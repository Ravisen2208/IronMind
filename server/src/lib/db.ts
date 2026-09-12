import { adminDb, isFirebaseAdminConfigured } from "./firebase-admin.js";
import {
  calculateLevelProgression,
  calculateStreak,
  getAuthoritativeRewards,
  getAttributeImpact,
} from "./progression.js";
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
} from "../types/index.js";

export * from "../types/index.js";

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
        gym: { exercise: "Bench Press & Pullups", muscleGroup: "Chest & Back", sets: 4, reps: 10 },
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
        .collection("tasks");

      if (filters?.type) query = query.where("type", "==", filters.type);
      if (filters?.category) query = query.where("category", "==", filters.category);
      if (filters?.priority) query = query.where("priority", "==", filters.priority);
      if (typeof filters?.completed === "boolean") {
        query = query.where("completed", "==", filters.completed);
      }

      const snapshot = await query.get();
      tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TaskItem));
    } catch (err) {
      console.warn("Firestore getUserTasks fallback:", err);
      tasks = memoryTasks.get(uid) || [];
    }
  } else {
    tasks = memoryTasks.get(uid) || [];
  }

  if (filters) {
    if (filters.type) tasks = tasks.filter((t) => t.type === filters.type);
    if (filters.category) tasks = tasks.filter((t) => t.category === filters.category);
    if (filters.priority) tasks = tasks.filter((t) => t.priority === filters.priority);
    if (typeof filters.completed === "boolean") {
      tasks = tasks.filter((t) => t.completed === filters.completed);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
  }

  return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  const { xpReward, coinReward } = getAuthoritativeRewards(priority, type);

  const taskId = `quest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newTask: TaskItem = {
    id: taskId,
    uid,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    type,
    category,
    priority,
    dueDate: data.dueDate || null,
    completed: false,
    xpReward,
    coinReward,
    gym: data.gym,
    study: data.study,
    preferredAttribute: data.preferredAttribute,
    createdAt: now,
    completedAt: null,
  };

  if (isFirebaseAdminConfigured()) {
    try {
      await adminDb.collection("users").doc(uid).collection("tasks").doc(taskId).set(newTask);
      return newTask;
    } catch (err) {
      console.warn("Firestore createNewTask fallback:", err);
    }
  }

  const existing = memoryTasks.get(uid) || [];
  memoryTasks.set(uid, [newTask, ...existing]);
  return newTask;
}

export async function updateTask(
  uid: string,
  taskId: string,
  updates: Partial<TaskItem>
): Promise<TaskItem> {
  if (isFirebaseAdminConfigured()) {
    try {
      const ref = adminDb.collection("users").doc(uid).collection("tasks").doc(taskId);
      const doc = await ref.get();
      if (!doc.exists) throw new Error("Task not found.");
      const current = doc.data() as TaskItem;
      if (current.completed) throw new Error("Completed quests cannot be modified.");

      const updated = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      delete (updated as any).id;
      await ref.update(updated);
      return { id: taskId, ...updated };
    } catch (err: any) {
      if (err.message === "Completed quests cannot be modified.") throw err;
      console.warn("Firestore updateTask fallback:", err);
    }
  }

  const list = memoryTasks.get(uid) || [];
  const idx = list.findIndex((t) => t.id === taskId);
  if (idx === -1) throw new Error("Task not found.");
  if (list[idx].completed) throw new Error("Completed quests cannot be modified.");

  const updated: TaskItem = {
    ...list[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  memoryTasks.set(uid, list);
  return updated;
}

export async function deleteTask(uid: string, taskId: string): Promise<boolean> {
  if (isFirebaseAdminConfigured()) {
    try {
      await adminDb.collection("users").doc(uid).collection("tasks").doc(taskId).delete();
      return true;
    } catch (err) {
      console.warn("Firestore deleteTask fallback:", err);
    }
  }

  const list = memoryTasks.get(uid) || [];
  const filtered = list.filter((t) => t.id !== taskId);
  memoryTasks.set(uid, filtered);
  return true;
}

export async function completeTask(
  uid: string,
  taskId: string
): Promise<CompletionResponse> {
  let profile = await getUserProfile(uid);
  if (!profile) {
    profile = await initializeUserProfile(uid);
  }

  let task: TaskItem | null = null;
  let taskRef: FirebaseFirestore.DocumentReference | null = null;

  if (isFirebaseAdminConfigured()) {
    try {
      taskRef = adminDb.collection("users").doc(uid).collection("tasks").doc(taskId);
      const doc = await taskRef.get();
      if (doc.exists) {
        task = { id: doc.id, ...doc.data() } as TaskItem;
      }
    } catch (err) {
      console.warn("Firestore completeTask get fallback:", err);
    }
  }

  if (!task) {
    const list = memoryTasks.get(uid) || [];
    task = list.find((t) => t.id === taskId) || null;
  }

  if (!task) {
    throw new Error("Task not found.");
  }

  if (task.completed) {
    throw new Error("Quest has already been completed.");
  }

  const { xpReward, coinReward } = getAuthoritativeRewards(task.priority, task.type);
  const attributeGained = getAttributeImpact(task.type, task.category, task.preferredAttribute);
  const now = new Date();

  const progression = calculateLevelProgression(profile.level, profile.xp, xpReward);
  const streak = calculateStreak(profile.streak, profile.lastCompletedDate, now);

  const updatedProfile: UserProfile = {
    ...profile,
    level: progression.newLevel,
    xp: progression.currentXp,
    coins: (profile.coins || 0) + coinReward,
    streak: streak.newStreak,
    longestStreak: Math.max(profile.longestStreak || 0, streak.newStreak),
    lastCompletedDate: streak.todayDate,
    attributes: {
      intellect:
        attributeGained === "intellect"
          ? profile.attributes.intellect + 1
          : profile.attributes.intellect,
      willpower:
        attributeGained === "willpower"
          ? profile.attributes.willpower + 1
          : profile.attributes.willpower,
    },
  };

  const completedTask: TaskItem = {
    ...task,
    completed: true,
    completedAt: now.toISOString(),
    xpReward,
    coinReward,
  };

  if (isFirebaseAdminConfigured() && taskRef) {
    try {
      const batch = adminDb.batch();
      batch.update(adminDb.collection("users").doc(uid), updatedProfile as any);
      batch.update(taskRef, {
        completed: true,
        completedAt: completedTask.completedAt,
        xpReward,
        coinReward,
      });
      await batch.commit();

      return {
        task: completedTask,
        progression,
        streak,
        coinsEarned: coinReward,
        attributeGained,
        updatedProfile,
      };
    } catch (err) {
      console.warn("Firestore completeTask atomic batch fallback:", err);
    }
  }

  memoryUsers.set(uid, updatedProfile);
  const list = memoryTasks.get(uid) || [];
  const idx = list.findIndex((t) => t.id === taskId);
  if (idx !== -1) {
    list[idx] = completedTask;
    memoryTasks.set(uid, list);
  }

  return {
    task: completedTask,
    progression,
    streak,
    coinsEarned: coinReward,
    attributeGained,
    updatedProfile,
  };
}

export async function getUserCategories(uid: string): Promise<CategoryItem[]> {
  let customCategories: CategoryItem[] = [];

  if (isFirebaseAdminConfigured()) {
    try {
      const snapshot = await adminDb
        .collection("users")
        .doc(uid)
        .collection("categories")
        .get();
      customCategories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CategoryItem));
    } catch (err) {
      console.warn("Firestore getUserCategories fallback:", err);
      customCategories = memoryCategories.get(uid) || [];
    }
  } else {
    customCategories = memoryCategories.get(uid) || [];
  }

  return [...DEFAULT_CATEGORIES, ...customCategories];
}

export async function createCategory(
  uid: string,
  data: { name: string; icon?: string; color?: string }
): Promise<CategoryItem> {
  const catId = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newCat: CategoryItem = {
    id: catId,
    uid,
    name: data.name.trim(),
    icon: data.icon || "Folder",
    color: data.color || "#0071E3",
    isDefault: false,
  };

  if (isFirebaseAdminConfigured()) {
    try {
      await adminDb.collection("users").doc(uid).collection("categories").doc(catId).set(newCat);
      return newCat;
    } catch (err) {
      console.warn("Firestore createCategory fallback:", err);
    }
  }

  const existing = memoryCategories.get(uid) || [];
  memoryCategories.set(uid, [...existing, newCat]);
  return newCat;
}

export async function deleteCategory(uid: string, categoryId: string): Promise<boolean> {
  if (isFirebaseAdminConfigured()) {
    try {
      await adminDb.collection("users").doc(uid).collection("categories").doc(categoryId).delete();
      return true;
    } catch (err) {
      console.warn("Firestore deleteCategory fallback:", err);
    }
  }

  const list = memoryCategories.get(uid) || [];
  memoryCategories.set(
    uid,
    list.filter((c) => c.id !== categoryId)
  );
  return true;
}
