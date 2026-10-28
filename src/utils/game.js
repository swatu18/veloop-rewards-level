/** Prototype reward rule: pick the highest tier the score reaches. */
export function getReward(score, config) {
  const tiers = [...config.rewardTiers].sort((a, b) => b.min - a.min);
  const tier = tiers.find((t) => score >= t.min) ?? tiers[tiers.length - 1];
  return { xp: tier.xp, ve: tier.ve };
}
