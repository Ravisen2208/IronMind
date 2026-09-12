export type TaskType = "general" | "gym" | "study";
export type TaskPriority = "low" | "medium" | "high";

export interface ProgressionResult {
  previousLevel: number;
  newLevel: number;
  levelsGained: number;
  leveledUp: boolean;
  xpGained: number;
  currentXp: number;
  xpRequired: number;
  xpRemaining: number;
  xpProgressPercent: number;
}

export interface StreakResult {
  previousStreak: number;
  newStreak: number;
  todayDate: string;
  isStreakExtended: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  longestStreak?: number;
  lastCompletedDate: string | null;
  attributes: {
    intellect: number;
    willpower: number;
  };
  createdAt: string;
}

export interface GymDetails {
  exercise?: string;
  muscleGroup?: string;
  sets?: number;
  reps?: number;
  duration?: number;
}

export interface StudyDetails {
  subject?: string;
  topic?: string;
  duration?: number;
}

export interface TaskItem {
  id: string;
  uid: string;
  title: string;
  description?: string;
  type: TaskType;
  category: string;
  priority: TaskPriority;
  dueDate: string | null;
  completed: boolean;
  xpReward: number;
  coinReward: number;
  gym?: GymDetails;
  study?: StudyDetails;
  preferredAttribute?: "intellect" | "willpower";
  createdAt: string;
  updatedAt?: string;
  completedAt: string | null;
}

export interface CategoryItem {
  id: string;
  uid: string | null;
  name: string;
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface CompletionResponse {
  task: TaskItem;
  progression: ProgressionResult;
  streak: StreakResult;
  coinsEarned: number;
  attributeGained: "intellect" | "willpower";
  updatedProfile: UserProfile;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "cat_study", uid: null, name: "Study", icon: "BookOpen", color: "#0071E3", isDefault: true },
  { id: "cat_gym", uid: null, name: "Gym", icon: "Dumbbell", color: "#FF9F0A", isDefault: true },
  { id: "cat_work", uid: null, name: "Work", icon: "Briefcase", color: "#5856D6", isDefault: true },
  { id: "cat_reading", uid: null, name: "Reading", icon: "Book", color: "#34C759", isDefault: true },
  { id: "cat_mindfulness", uid: null, name: "Mindfulness", icon: "Sparkles", color: "#AF52DE", isDefault: true },
  { id: "cat_health", uid: null, name: "Health", icon: "Heart", color: "#FF2D55", isDefault: true },
  { id: "cat_coding", uid: null, name: "Coding", icon: "Code", color: "#0071E3", isDefault: true },
  { id: "cat_personal", uid: null, name: "Personal", icon: "User", color: "#6E6E73", isDefault: true },
];
