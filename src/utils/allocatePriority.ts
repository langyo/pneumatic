export function allocatePriority(
  op: '>' | '<', oldLevel: number, newLevel: number
): number {
  if (op === '>') {
    if (oldLevel >= 0 && newLevel > 0 || oldLevel < 0 && newLevel < 0) {
      return Math.max(oldLevel, newLevel) === -1 ? -1 : Math.max(oldLevel, newLevel) + 1;
    } else if (oldLevel >= 0 && newLevel < 0) {
      return newLevel === -1 ? -1 : newLevel + 1;
    } else {
      // oldLevel < 0 && newLevel >= 0
      return oldLevel === -1 ? -1 : oldLevel + 1;
    }
  } else {
    // op === '<'
    if (oldLevel >= 0 && newLevel > 0 || oldLevel < 0 && newLevel < 0) {
      return Math.min(oldLevel, newLevel) === 1 ? 1 : Math.min(oldLevel, newLevel) - 1;
    } else if (oldLevel >= 0 && newLevel < 0) {
      return oldLevel === 1 ? 1 : oldLevel;
    } else {
      // oldLevel < 0 && newLevel >= 0
      return newLevel === 1 ? 1 : newLevel;
    }
  }
}
