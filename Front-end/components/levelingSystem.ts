export interface Level {
  hierarchy: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  level: number;
  points: number;
}

// Defines the XP required to reach the *next* level from the current one.
// e.g., to go from Beginner 1 to Beginner 2, you need 500 XP.
export const XP_THRESHOLDS: Record<string, Record<number, number>> = {
  Beginner: {
    1: 500,
    2: 750,
    3: 1000,
    4: 1250,
    5: 1500, // XP needed to reach Intermediate 1
  },
  Intermediate: {
    1: 2000,
    2: 2500,
    3: 3000,
    4: 3500,
    5: 4000, // XP needed to reach Advanced 1
  },
  Advanced: {
    1: 5000,
    2: 6000,
    3: 7000,
    4: 8000,
    5: 10000, // XP needed to reach Master
  },
  Master: {
    1: Infinity, // Master level has no cap
  },
};

export const getXpForNextLevel = (level: Level): number => {
    if (level.hierarchy === 'Master') return Infinity;
    return XP_THRESHOLDS[level.hierarchy]?.[level.level] || Infinity;
};


export const checkForLevelUp = (currentLevel: Level): { newLevel: Level, hasLeveledUp: boolean } => {
  let { hierarchy, level, points } = currentLevel;
  let hasLeveledUp = false;
  
  let requiredXp = XP_THRESHOLDS[hierarchy]?.[level];

  // Loop to handle multiple level-ups at once
  while (requiredXp && points >= requiredXp) {
    hasLeveledUp = true;
    points -= requiredXp; // Carry over remaining points
    level += 1;

    if (level > 5) {
      if (hierarchy === 'Beginner') {
        hierarchy = 'Intermediate';
        level = 1;
      } else if (hierarchy === 'Intermediate') {
        hierarchy = 'Advanced';
        level = 1;
      } else if (hierarchy === 'Advanced') {
        hierarchy = 'Master';
        level = 1;
      }
    }
    
    if (hierarchy === 'Master') break;
    
    requiredXp = XP_THRESHOLDS[hierarchy]?.[level];
  }

  return {
    newLevel: { hierarchy, level, points },
    hasLeveledUp,
  };
};
