import { adminDb, isFirebaseAdminConfigured } from "./firebase-admin";
import {
  calculateLevelProgression,
  calculateStreak,
  getAuthoritativeRewards,
  ProgressionResult,
  StreakResult,
} from "./progression";

export interface UserProfile {
  uid: string;
  email: string | null;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastCompletedDate: string | null;
  attributes: {
    intellect: number;
    willpower: number;
  };
  createdAt: string;
}

export interface TaskItem {
  id: string;
  uid: string;
  title: string;
  category: "intellect" | "willpower";
  completed: boolean;
  xpReward: number;
  coinReward: number;
  createdAt: string;
  completedAt: string | null;
}

export interface CompletionResponse {
  task: TaskItem;
  progression: ProgressionResult;
  streak: StreakResult;
  coinsEarned: number;
  updatedProfile: UserProfile;
}

// In-memory fallback for local demo mode when Firestore Admin credentials are not set
const memoryUsers = new Map<string, UserProfile>();
const memoryTasks = new Map<string, TaskItem[]>();

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseAdminConfigured()) {
    try {
      const doc = await adminDb.collection("users").doc(uid).get();
      if (!doc.exists) return null;
      return doc.data() as UserProfile;
    } catch (err) {
      console.warn("Firestore getUserProfile fallback to memory store:", err);
    }
  }

  return memoryUsers.get(uid) || null;
}

export async function initializeUserProfile(
  uid: string,
  email: string | null = null
): Promise<UserProfile> {
  const existing = await getUserProfile(uid);
  if (existing) return existing;

  const newProfile: UserProfile = {
    uid,
    email,
    level: 1,
    xp: 0,
    coins: 50, // Starting welcome reward
    streak: 0,
    lastCompletedDate: null,
    attributes: {
      intellect: 10,
      willpower: 10,
    },
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseAdminConfigured()) {
    try {
      await adminDb.collection("users").doc(uid).set(newProfile);
      return newProfile;
    } catch (err) {
      console.warn("Firestore initializeUserProfile fallback to memory store:", err);
    }
  }

  memoryUsers.set(uid, newProfile);
  // Give initial demo quests
  if (!memoryTasks.has(uid)) {
    memoryTasks.set(uid, [
      {
        id: "quest_welcome_1",
        uid,
        title: "Read 10 pages of deep work principles",
        category: "intellect",
        completed: false,
        xpReward: 35,
        coinReward: 15,
        createdAt: new Date().toISOString(),
        completedAt: null,
      },
      {
        id: "quest_welcome_2",
        uid,
        title: "Complete 25 minutes of undistracted focus",
        category: "willpower",
        completed: false,
        xpReward: 40,
        coinReward: 20,
        createdAt: new Date().toISOString(),
        completedAt: null,
      },
    ]);
  }
  return newProfile;
}

export async function getUserTasks(uid: string): Promise<TaskItem[]> {
  if (isFirebaseAdminConfigured()) {
    try {
      const snap = await adminDb
        .collection("users")
        .doc(uid)
        .collection("tasks")
        .orderBy("createdAt", "desc")
        .get();

      return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TaskItem, "id">),
      }));
    } catch (err) {
      console.warn("Firestore getUserTasks fallback to memory store:", err);
    }
  }

  return memoryTasks.get(uid) || [];
}

export async function createNewTask(
  uid: string,
  title: string,
  category: "intellect" | "willpower"
): Promise<TaskItem> {
  const rewards = getAuthoritativeRewards(category);
  const nowIso = new Date().toISOString();

  if (isFirebaseAdminConfigured()) {
    try {
      const docRef = adminDb.collection("users").doc(uid).collection("tasks").doc();
      const newTask: TaskItem = {
        id: docRef.id,
        uid,
        title,
        category,
        completed: false,
        xpReward: rewards.xpReward,
        coinReward: rewards.coinReward,
        createdAt: nowIso,
        completedAt: null,
      };
      await docRef.set(newTask);
      return newTask;
    } catch (err) {
      console.warn("Firestore createNewTask fallback to memory store:", err);
    }
  }

  const tasks = memoryTasks.get(uid) || [];
  const newTask: TaskItem = {
    id: `quest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    uid,
    title,
    category,
    completed: false,
    xpReward: rewards.xpReward,
    coinReward: rewards.coinReward,
    createdAt: nowIso,
    completedAt: null,
  };
  tasks.unshift(newTask);
  memoryTasks.set(uid, tasks);
  return newTask;
}

export async function deleteTask(uid: string, taskId: string): Promise<boolean> {
  if (isFirebaseAdminConfigured()) {
    try {
      const docRef = adminDb.collection("users").doc(uid).collection("tasks").doc(taskId);
      const doc = await docRef.get();
      if (!doc.exists) return false;
      await docRef.delete();
      return true;
    } catch (err) {
      console.warn("Firestore deleteTask fallback to memory store:", err);
    }
  }

  const tasks = memoryTasks.get(uid) || [];
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return false;
  tasks.splice(index, 1);
  memoryTasks.set(uid, tasks);
  return true;
}

/**
 * Authoritative Anti-Cheat Task Completion
 * Committed atomically with duplicate prevention and server calculation.
 */
export async function completeTaskAtomic(
  uid: string,
  taskId: string
): Promise<CompletionResponse> {
  if (isFirebaseAdminConfigured()) {
    try {
      const userRef = adminDb.collection("users").doc(uid);
      const taskRef = userRef.collection("tasks").doc(taskId);

      const result = await adminDb.runTransaction(async (transaction) => {
        const [userSnap, taskSnap] = await Promise.all([
          transaction.get(userRef),
          transaction.get(taskRef),
        ]);

        if (!userSnap.exists) {
          throw new Error("User profile not found.");
        }
        if (!taskSnap.exists) {
          throw new Error("Task not found.");
        }

        const task = taskSnap.data() as TaskItem;
        if (task.completed) {
          throw new Error("Task is already completed.");
        }

        const user = userSnap.data() as UserProfile;

        // Authoritative server reward determination
        const rewards = getAuthoritativeRewards(task.category);
        const progression = calculateLevelProgression(user.level, user.xp, rewards.xpReward);
        const streakResult = calculateStreak(user.streak, user.lastCompletedDate);

        const newIntellect =
          task.category === "intellect"
            ? (user.attributes?.intellect || 10) + 1
            : user.attributes?.intellect || 10;

        const newWillpower =
          task.category === "willpower"
            ? (user.attributes?.willpower || 10) + 1
            : user.attributes?.willpower || 10;

        const updatedProfile: UserProfile = {
          ...user,
          level: progression.newLevel,
          xp: progression.currentXp,
          coins: (user.coins || 0) + rewards.coinReward,
          streak: streakResult.newStreak,
          lastCompletedDate: streakResult.todayDate,
          attributes: {
            intellect: newIntellect,
            willpower: newWillpower,
          },
        };

        const nowIso = new Date().toISOString();
        const updatedTask: TaskItem = {
          ...task,
          id: taskId,
          completed: true,
          completedAt: nowIso,
          xpReward: rewards.xpReward,
          coinReward: rewards.coinReward,
        };

        transaction.update(userRef, updatedProfile as any);
        transaction.update(taskRef, {
          completed: true,
          completedAt: nowIso,
          xpReward: rewards.xpReward,
          coinReward: rewards.coinReward,
        });

        return {
          task: updatedTask,
          progression,
          streak: streakResult,
          coinsEarned: rewards.coinReward,
          updatedProfile,
        };
      });

      return result;
    } catch (err: any) {
      if (err.message && (err.message.includes("already completed") || err.message.includes("not found"))) {
        throw err;
      }
      console.warn("Firestore completeTaskAtomic error, attempting fallback:", err);
    }
  }

  // Fallback memory atomic simulation
  const tasks = memoryTasks.get(uid) || [];
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error("Task not found.");
  }
  if (task.completed) {
    throw new Error("Task is already completed.");
  }

  let user = memoryUsers.get(uid);
  if (!user) {
    user = await initializeUserProfile(uid);
  }

  const rewards = getAuthoritativeRewards(task.category);
  const progression = calculateLevelProgression(user.level, user.xp, rewards.xpReward);
  const streakResult = calculateStreak(user.streak, user.lastCompletedDate);

  const newIntellect =
    task.category === "intellect"
      ? (user.attributes?.intellect || 10) + 1
      : user.attributes?.intellect || 10;

  const newWillpower =
    task.category === "willpower"
      ? (user.attributes?.willpower || 10) + 1
      : user.attributes?.willpower || 10;

  const nowIso = new Date().toISOString();
  task.completed = true;
  task.completedAt = nowIso;
  task.xpReward = rewards.xpReward;
  task.coinReward = rewards.coinReward;

  const updatedProfile: UserProfile = {
    ...user,
    level: progression.newLevel,
    xp: progression.currentXp,
    coins: (user.coins || 0) + rewards.coinReward,
    streak: streakResult.newStreak,
    lastCompletedDate: streakResult.todayDate,
    attributes: {
      intellect: newIntellect,
      willpower: newWillpower,
    },
  };

  memoryUsers.set(uid, updatedProfile);

  return {
    task,
    progression,
    streak: streakResult,
    coinsEarned: rewards.coinReward,
    updatedProfile,
  };
}
