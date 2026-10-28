import { LEVELS } from '../data/levelData';

export function levelIndex(xp) {
  let idx = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.startXP) idx = i; });
  return idx;
}

export function deriveProgress(xp) {
  const idx = levelIndex(xp);
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  return {
    level: cur.level,
    name: cur.name,
    xp,
    nextLevel: next?.level ?? null,
    nextName: next?.name ?? null,
    nextXP: next?.startXP ?? null,
    nextReward: next?.reward ?? null,
    xpToNext: next ? next.startXP - xp : 0,
    percent: next ? ((xp - cur.startXP) / (next.startXP - cur.startXP)) * 100 : 100,
    isMax: !next,
  };
}
