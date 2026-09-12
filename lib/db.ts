import { adminDb, isFirebaseAdminConfigured } from "./firebase-admin";
import {
  calculateLevelProgression,
  calculateStreak,
  getAuthoritativeRewards,
  getAttributeImpact,
} from "./progression";
import {
  UserProfile,
  TaskItem,
  CategoryItem,
  CompletionResponse,
  DEFAULT_CATEGORIES,
  TaskType,
  TaskPriority,
  GymDetails,
  StudyDetails,
} from "@/types";

export * from "@/types";

// In-memory fallback stores
const memoryUsers = new Map<string, UserProfile>();
const memoryTasks = new Map<string, TaskItem[]>();
const memoryCategories = new Map<string, CategoryItem[]>();

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseAdminConfigured()) {
    try {
      const doc = await adminDb.collection("users").doc(uid).get();
      if (!doc.exists) return null;
      return doc.data() as UserProfile;
    } catch (err) {
      console.warn("Firestore getUserProfile fallback:", err);
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
    coins: 50,
    streak: 0,
    longestStreak: 0,
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
      console.warn("Firestore initializeUserProfile fallback:", err);
    }
  }

  memoryUsers.set(uid, newProfile);
  if (!memoryTasks.has(uid)) {
    memoryTasks.set(uid, [
      {
        id: "quest_welcome_1",
        uid,
        title: "Study system design principles",
        description: "Read 15 pages on distributed systems caching and consensus.",
        type: "study",
        category: "Study",
        priority: "medium",
        dueDate: null,
        completed: false,
        xpReward: 50,
        coinReward: 23,
        study: { subject: "System Design", topic: "Distributed Caching", duration: 30 },
        createdAt: new Date().toISOString(),
        completedAt: null,
      },
      {
        id: "quest_welcome_2",
        uid,
        title: "Upper body strength session",
        description: "Bench press, pullups, and core stability work.",
        type: "gym",
        category: "Gym",
        priority: "high",
        dueDate: null,
        completed: false,
        xpReward: 70,
        coinReward: 35,
        gym: { exercise: "Bench Press", muscleGroup: "Chest", sets: 4, reps: 10, duration: 45 },
        createdAt: new Date().toISOString(),
        completedAt: null,
      },
    ]);
  }
  return newProfile;
}

export async function getUserTasks(
  uid: string,
  filters?: {
    type?: string;
    category?: string;
    priority?: string;
    completed?: boolean;
    search?: string;
  }
): Promise<TaskItem[]> {
  let tasks: TaskItem[] = [];

  if (isFirebaseAdminConfigured()) {
    try {
      let query: FirebaseFirestore.Query = adminDb
        .collection("users")
        .doc(uid)
        .collection("tasks")
        .orderBy("createdAt", "desc");

      if (filters?.type) query = query.where("type", "==", filters.type);
      if (filters?.category) query = query.where("category", "==", filters.category);
      if (filters?.priority) query = query.where("priority", "==", filters.priority);
      if (filters?.completed !== undefined) query = query.where("completed", "==", filters.completed);

      const snap = await query.get();
      tasks = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TaskItem, "id">),
      }));
    } catch (err) {
      console.warn("Firestore getUserTasks fallback:", err);
      tasks = memoryTasks.get(uid) || [];
    }
  } else {
    tasks = memoryTasks.get(uid) || [];
  }

  // Apply memory filters if fallback or search query is present
  return tasks.filter((t) => {
    if (filters?.type && t.type !== filters.type) return false;
    if (filters?.category && t.category !== filters.category) return false;
    if (filters?.priority && t.priority !== filters.priority) return false;
    if (filters?.completed !== undefined && t.completed !== filters.completed) return false;
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      const matchesTitle = t.title.toLowerCase().includes(q);
      const matchesDesc = t.description?.toLowerCase().includes(q);
      const matchesCat = t.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesCat) return false;
    }
    return true;
  });
}

export async function createNewTask(
  uid: string,
  data: {
    title: string;
    description?: string;
    type?: TaskType;
    category?: string;
    priority?: TaskPriority;
    dueDate?: string | null;
    gym?: GymDetails;
    study?: StudyDetails;
    preferredAttribute?: "intellect" | "willpower";
  }
): Promise<TaskItem> {
  const type = data.type || "general";
  const priority = data.priority || "medium";
  const category = data.category || (type === "gym" ? "Gym" : type === "study" ? "Study" : "Personal");
  const rewards = getAuthoritativeRewards(priority, type);
  const nowIso = new Date().toISOString();

  const newTask: TaskItem = {
    id: `quest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    uid,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    type,
    category,
    priority,
    dueDate: data.dueDate || null,
    completed: false,
    xpReward: rewards.xpReward,
    coinReward: rewards.coinReward,
    gym: data.gym,
    study: data.study,
    preferredAttribute: data.preferredAttribute,
    createdAt: nowIso,
    completedAt: null,
  };

  if (isFirebaseAdminConfigured()) {
    try {
      const docRef = adminDb.collection("users").doc(uid).collection("tasks").doc();
      newTask.id = docRef.id;
      await docRef.set(newTask);
      return newTask;
    } catch (err) {
      console.warn("Firestore createNewTask fallback:", err);
    }
  }

  const tasks = memoryTasks.get(uid) || [];
  tasks.unshift(newTask);
  memoryTasks.set(uid, tasks);
  return newTask;
}

export async function updateTask(
  uid: string,
  taskId: string,
  updates: Partial<Pick<TaskItem, "title" | "description" | "category" | "priority" | "dueDate" | "gym" | "study">>
): Promise<TaskItem | null> {
  if (isFirebaseAdminConfigured()) {
    try {
      const taskRef = adminDb.collection("users").doc(uid).collection("tasks").doc(taskId);
      const snap = await taskRef.get();
      if (!snap.exists) return null;
      const existing = snap.data() as TaskItem;
      if (existing.completed) {
        throw new Error("Completed quests cannot be modified.");
      }

      const safeUpdates: any = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      // Re-calculate rewards if priority changed
      if (updates.priority && updates.priority !== existing.priority) {
        const rew = getAuthoritativeRewards(updates.priority, existing.type);
        safeUpdates.xpReward = rew.xpReward;
        safeUpdates.coinReward = rew.coinReward;
      }

      await taskRef.update(safeUpdates);
      return { ...existing, ...safeUpdates, id: taskId };
    } catch (err) {
      console.warn("Firestore updateTask error:", err);
      throw err;
    }
  }

  const tasks = memoryTasks.get(uid) || [];
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;
  if (task.completed) {
    throw new Error("Completed quests cannot be modified.");
  }

  Object.assign(task, updates, { updatedAt: new Date().toISOString() });
  if (updates.priority) {
    const rew = getAuthoritativeRewards(updates.priority, task.type);
    task.xpReward = rew.xpReward;
    task.coinReward = rew.coinReward;
  }
  return task;
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
      console.warn("Firestore deleteTask fallback:", err);
    }
  }

  const tasks = memoryTasks.get(uid) || [];
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return false;
  tasks.splice(index, 1);
  memoryTasks.set(uid, tasks);
  return true;
}

export async function completeTaskAtomic(
  uid: string,
  taskId: string
): Promise<CompletionResponse> {
  if (isFirebaseAdminConfigured()) {
    try {
      const userRef = adminDb.collection("users").doc(uid);
      const taskRef = userRef.collection("tasks").doc(taskId);

      return await adminDb.runTransaction(async (transaction) => {
        const [userSnap, taskSnap] = await Promise.all([
          transaction.get(userRef),
          transaction.get(taskRef),
        ]);

        if (!userSnap.exists) throw new Error("User profile not found.");
        if (!taskSnap.exists) throw new Error("Task not found.");

        const task = taskSnap.data() as TaskItem;
        if (task.completed) throw new Error("Task is already completed.");

        const user = userSnap.data() as UserProfile;
        const rewards = getAuthoritativeRewards(task.priority, task.type);
        const progression = calculateLevelProgression(user.level, user.xp, rewards.xpReward);
        const streakResult = calculateStreak(user.streak, user.lastCompletedDate);
        const longestStreak = Math.max(user.longestStreak || 0, streakResult.newStreak);

        const attributeGained = getAttributeImpact(task.type, task.category, task.preferredAttribute);

        const newIntellect =
          attributeGained === "intellect"
            ? (user.attributes?.intellect || 10) + 1
            : user.attributes?.intellect || 10;

        const newWillpower =
          attributeGained === "willpower"
            ? (user.attributes?.willpower || 10) + 1
            : user.attributes?.willpower || 10;

        const updatedProfile: UserProfile = {
          ...user,
          level: progression.newLevel,
          xp: progression.currentXp,
          coins: (user.coins || 0) + rewards.coinReward,
          streak: streakResult.newStreak,
          longestStreak,
          lastCompletedDate: streakResult.todayDate,
          attributes: { intellect: newIntellect, willpower: newWillpower },
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
          attributeGained,
          updatedProfile,
        };
      });
    } catch (err: any) {
      if (err.message && (err.message.includes("already completed") || err.message.includes("not found"))) {
        throw err;
      }
      console.warn("Firestore completeTaskAtomic error, attempting fallback:", err);
    }
  }

  // Memory transaction simulation
  const tasks = memoryTasks.get(uid) || [];
  const task = tasks.find((t) => t.id === taskId);
  if (!task) throw new Error("Task not found.");
  if (task.completed) throw new Error("Task is already completed.");

  let user = memoryUsers.get(uid);
  if (!user) user = await initializeUserProfile(uid);

  const rewards = getAuthoritativeRewards(task.priority, task.type);
  const progression = calculateLevelProgression(user.level, user.xp, rewards.xpReward);
  const streakResult = calculateStreak(user.streak, user.lastCompletedDate);
  const longestStreak = Math.max(user.longestStreak || 0, streakResult.newStreak);
  const attributeGained = getAttributeImpact(task.type, task.category, task.preferredAttribute);

  const newIntellect =
    attributeGained === "intellect"
      ? (user.attributes?.intellect || 10) + 1
      : user.attributes?.intellect || 10;

  const newWillpower =
    attributeGained === "willpower"
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
    longestStreak,
    lastCompletedDate: streakResult.todayDate,
    attributes: { intellect: newIntellect, willpower: newWillpower },
  };

  memoryUsers.set(uid, updatedProfile);

  return {
    task,
    progression,
    streak: streakResult,
    coinsEarned: rewards.coinReward,
    attributeGained,
    updatedProfile,
  };
}

// Category Management
export async function getUserCategories(uid: string): Promise<CategoryItem[]> {
  if (isFirebaseAdminConfigured()) {
    try {
      const snap = await adminDb
        .collection("users")
        .doc(uid)
        .collection("categories")
        .orderBy("name", "asc")
        .get();

      const userCats = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CategoryItem, "id">),
      }));

      return [...DEFAULT_CATEGORIES, ...userCats];
    } catch (err) {
      console.warn("Firestore getUserCategories fallback:", err);
    }
  }

  const userCustom = memoryCategories.get(uid) || [];
  return [...DEFAULT_CATEGORIES, ...userCustom];
}

export async function createCustomCategory(
  uid: string,
  name: string,
  icon: string = "Tag",
  color: string = "#0071E3"
): Promise<CategoryItem> {
  const cleanName = name.trim();
  const newCat: CategoryItem = {
    id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    uid,
    name: cleanName,
    icon,
    color,
    isDefault: false,
  };

  if (isFirebaseAdminConfigured()) {
    try {
      const docRef = adminDb.collection("users").doc(uid).collection("categories").doc();
      newCat.id = docRef.id;
      await docRef.set(newCat);
      return newCat;
    } catch (err) {
      console.warn("Firestore createCustomCategory fallback:", err);
    }
  }

  const list = memoryCategories.get(uid) || [];
  list.push(newCat);
  memoryCategories.set(uid, list);
  return newCat;
}

export async function updateCustomCategory(
  uid: string,
  categoryId: string,
  updates: { name?: string; icon?: string; color?: string }
): Promise<CategoryItem | null> {
  if (isFirebaseAdminConfigured()) {
    try {
      const catRef = adminDb.collection("users").doc(uid).collection("categories").doc(categoryId);
      await catRef.update(updates);
      const snap = await catRef.get();
      return { id: categoryId, ...(snap.data() as Omit<CategoryItem, "id">) };
    } catch (err) {
      console.warn("Firestore updateCustomCategory error:", err);
    }
  }

  const list = memoryCategories.get(uid) || [];
  const item = list.find((c) => c.id === categoryId);
  if (!item) return null;
  Object.assign(item, updates);
  return item;
}

export async function deleteCustomCategory(uid: string, categoryId: string): Promise<boolean> {
  if (isFirebaseAdminConfigured()) {
    try {
      await adminDb.collection("users").doc(uid).collection("categories").doc(categoryId).delete();
      return true;
    } catch (err) {
      console.warn("Firestore deleteCustomCategory error:", err);
    }
  }

  const list = memoryCategories.get(uid) || [];
  const idx = list.findIndex((c) => c.id === categoryId);
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}
