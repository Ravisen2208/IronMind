/**
 * IronMind Authoritative RPG Progression Engine
 * Server-side calculation of levels, XP, streaks, attributes, and rewards.
 */

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

/**
 * Calculates XP required to advance from level N to level N + 1.
 * Formula: round(100 * N^1.5)
 */
export function getXpRequiredForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return Math.round(100 * Math.pow(safeLevel, 1.5));
}

/**
 * Computes authoritative level and XP progression.
 * Seamlessly handles single or multi-level advancements.
 */
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

/**
 * Calculates streak progression based on server-side calendar dates.
 *
 * Rules:
 * - No previous completion -> streak = 1
 * - Yesterday -> streak + 1
 * - Today -> streak unchanged
 * - Older than yesterday -> streak = 1
 */
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
    // Already completed a task today, maintain current streak
    return {
      previousStreak: prevStreak,
      newStreak: prevStreak === 0 ? 1 : prevStreak,
      todayDate: today,
      isStreakExtended: false,
    };
  }

  if (lastCompletedDate === yesterday) {
    // Consecutive day completion!
    return {
      previousStreak: prevStreak,
      newStreak: prevStreak + 1,
      todayDate: today,
      isStreakExtended: true,
    };
  }

  // Missed one or more days, reset streak to 1
  return {
    previousStreak: prevStreak,
    newStreak: 1,
    todayDate: today,
    isStreakExtended: true,
  };
}

/**
 * Server-authoritative quest reward defaults.
 * Clients cannot modify these amounts.
 */
export function getAuthoritativeRewards(category: "intellect" | "willpower") {
  if (category === "willpower") {
    return {
      xpReward: 40,
      coinReward: 20,
    };
  }
  return {
    xpReward: 35,
    coinReward: 15,
  };
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
