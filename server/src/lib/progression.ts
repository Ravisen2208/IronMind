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

export function getXpRequiredForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return Math.round(100 * Math.pow(safeLevel, 1.5));
}

export function calculateLevelProgression(
  currentLevel: number,
  currentXp: number,
  xpGained: number
): ProgressionResult {
  let level = Math.max(1, Math.floor(currentLevel || 1));
  let xp = Math.max(0, Math.floor(currentXp || 0)) + Math.max(0, Math.floor(xpGained || 0));
  let levelsGained = 0;

  while (true) {
    const requiredForCurrent = getXpRequiredForLevel(level);
    if (xp >= requiredForCurrent) {
      xp -= requiredForCurrent;
      level += 1;
      levelsGained += 1;
    } else {
      break;
    }
  }

  const xpRequired = getXpRequiredForLevel(level);
  const xpRemaining = Math.max(0, xpRequired - xp);
  const xpProgressPercent = Math.min(100, Math.round((xp / xpRequired) * 100));

  return {
    previousLevel: currentLevel,
    newLevel: level,
    levelsGained,
    leveledUp: levelsGained > 0,
    xpGained,
    currentXp: xp,
    xpRequired,
    xpRemaining,
    xpProgressPercent,
  };
}

export function calculateStreak(
  currentStreak: number,
  lastCompletedDate: string | null | undefined,
  now: Date = new Date()
): StreakResult {
  const today = formatDateOnly(now);
  const yesterday = getYesterdayDateString(now);

  const prevStreak = Math.max(0, currentStreak || 0);

  if (!lastCompletedDate) {
    return {
      previousStreak: prevStreak,
      newStreak: 1,
      todayDate: today,
      isStreakExtended: true,
    };
  }

  if (lastCompletedDate === today) {
    return {
      previousStreak: prevStreak,
      newStreak: prevStreak === 0 ? 1 : prevStreak,
      todayDate: today,
      isStreakExtended: false,
    };
  }

  if (lastCompletedDate === yesterday) {
    return {
      previousStreak: prevStreak,
      newStreak: prevStreak + 1,
      todayDate: today,
      isStreakExtended: true,
    };
  }

  return {
    previousStreak: prevStreak,
    newStreak: 1,
    todayDate: today,
    isStreakExtended: true,
  };
}

export function getAuthoritativeRewards(
  priority: TaskPriority = "medium",
  type: TaskType = "general"
): { xpReward: number; coinReward: number } {
  let xpReward = 40;
  let coinReward = 18;

  if (priority === "low") {
    xpReward = 25;
    coinReward = 10;
  } else if (priority === "high") {
    xpReward = 60;
    coinReward = 30;
  }

  if (type === "gym" || type === "study") {
    xpReward += 10;
    coinReward += 5;
  }

  return { xpReward, coinReward };
}

export function getAttributeImpact(
  type: TaskType,
  category: string,
  preferredAttribute?: "intellect" | "willpower"
): "intellect" | "willpower" {
  if (type === "study") return "intellect";
  if (type === "gym") return "willpower";

  const lowerCat = category.toLowerCase();
  if (
    lowerCat === "study" ||
    lowerCat === "coding" ||
    lowerCat === "reading" ||
    lowerCat === "intellect"
  ) {
    return "intellect";
  }

  if (
    lowerCat === "gym" ||
    lowerCat === "fitness" ||
    lowerCat === "health" ||
    lowerCat === "mindfulness" ||
    lowerCat === "willpower"
  ) {
    return "willpower";
  }

  return preferredAttribute || "willpower";
}

function formatDateOnly(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString(d: Date): string {
  const yesterday = new Date(d);
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateOnly(yesterday);
}
