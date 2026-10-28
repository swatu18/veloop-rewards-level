/**
 * DEMO DATA: every value in this file is a development placeholder.
 * Replace the exports with the backend response when the API is ready
 * (keep the same shapes and the UI will not need changes).
 */

// Each level: where it starts (total XP) and the reward granted for reaching it.
export const LEVELS = [
  { level: 1, name: 'Starter', startXP: 0, reward: null },
  { level: 2, name: 'Explorer', startXP: 500, reward: { ve: 100, gems: 0 } },
  { level: 3, name: 'Collector', startXP: 1500, reward: { ve: 150, gems: 5 } },
  { level: 4, name: 'Achiever', startXP: 3200, reward: { ve: 300, gems: 10 } },
  { level: 5, name: 'Trailblazer', startXP: 5200, reward: { ve: 500, gems: 25 } },
  { level: 6, name: 'Champion', startXP: 8000, reward: { ve: 750, gems: 30 } },
  { level: 7, name: 'Elite', startXP: 11000, reward: { ve: 1000, gems: 40 } },
  { level: 8, name: 'Master', startXP: 15000, reward: { ve: 1500, gems: 60 } },
];

export const PLAYER = {
  name: 'VeLooper',
  xp: 6420,
  ve: 1280,
  gems: 35,
  streak: 7,
  tasksDone: 4,
  tasksTotal: 8,
};

export const LEVEL_PERKS = [
  { icon: 'trend', text: 'Higher daily XP limit' },
  { icon: 'target', text: 'Access to new challenges' },
  { icon: 'gift', text: 'Better reward opportunities' },
];

export const INITIAL_ACTIVITY = [
  { id: 'a1', icon: 'referral', title: 'Referral Bonus', xp: 20, ve: 0, time: 'Today, 10:45 AM' },
  { id: 'a2', icon: 'mission', title: 'Daily Mission Completed', xp: 50, ve: 0, time: 'Today, 09:12 AM' },
  { id: 'a3', icon: 'game', title: 'Mini Game Win', xp: 75, ve: 0, time: 'Today, 08:30 AM' },
  { id: 'a4', icon: 'catcher', title: 'XP Catcher Reward', xp: 10, ve: 10, time: 'Today, 07:50 AM' },
  { id: 'a5', icon: 'streak', title: 'Streak Bonus', xp: 25, ve: 0, time: 'Today, 07:20 AM' },
  { id: 'a6', icon: 'watch', title: 'Watch & Earn', xp: 35, ve: 25, time: 'Today, 07:05 AM' },
];

/* ---------- XP Catcher (frontend prototype) ---------- */
export const GAME_CONFIG = {
  isDemo: true, // values below are NOT official reward rules
  name: 'XP Catcher',
  durationSec: 20,
  dailyAttempts: 3,
  demoBest: 74,
  streakForMultiplier: 6,
  multiplier: 2,
  points: { xp: 6, coin: 4, gem: 10 },
  // highest matching `min` wins
  rewardTiers: [
    { min: 120, xp: 40, ve: 20 },
    { min: 80, xp: 30, ve: 12 },
    { min: 40, xp: 15, ve: 5 },
    { min: 0, xp: 5, ve: 0 },
  ],
};

const MAX_GAME_XP = Math.max(...GAME_CONFIG.rewardTiers.map((t) => t.xp));

/*
 * status: 'live' = existing/approved route, 'soon' = concept, not yet supported.
 * Flip `status` when the product team approves a feature.
 */
export const EARN_FEATURES = [
  { id: 'watch', icon: 'watch', tone: 'purple', title: 'Watch & Earn', desc: 'Watch ads and earn', reward: '+50 XP', status: 'live' },
  { id: 'daily', icon: 'tasks', tone: 'green', title: 'Daily Missions', desc: 'Complete daily tasks', reward: '+30 XP', status: 'live' },
  { id: 'refer', icon: 'refer', tone: 'gold', title: 'Refer & Earn', desc: 'Invite friends and earn', reward: '+100 XP', status: 'live' },
  { id: 'catcher', icon: 'catcher', tone: 'blue', title: 'XP Catcher', desc: 'Catch orbs and coins', reward: `Up to +${MAX_GAME_XP} XP`, status: 'live', action: 'game' },
  { id: 'streak', icon: 'streak', tone: 'orange', title: 'Streak Bonus', desc: 'Keep your streak alive', reward: '+25 XP', status: 'live' },
  { id: 'games', icon: 'game', tone: 'blue', title: 'Mini Games', desc: 'More games are on the way', reward: '+75 XP', status: 'soon' },
  { id: 'quiz', icon: 'quiz', tone: 'purple', title: 'Quick Quiz', desc: 'Answer a few questions', reward: 'XP', status: 'soon' },
  { id: 'weekly', icon: 'weekly', tone: 'green', title: 'Weekly Quest', desc: 'Finish a weekly objective', reward: 'XP + VEs', status: 'soon' },
  { id: 'hunt', icon: 'hunt', tone: 'gold', title: 'Reward Hunt', desc: 'Find hidden rewards', reward: 'VEs', status: 'soon' },
];

/* ---------- Accounts, earning and rewards store (all DEMO values) ---------- */
export const SHOWCASE_PLAYER = PLAYER; // signed-out visitors see the design's showcase numbers
export const NEW_PLAYER = { name: '', xp: 150, ve: 0, gems: 0, streak: 0, tasksDone: 0, tasksTotal: 8 };

export const EARN_RULES = {
  watch: { xp: 50, dailyLimit: 2, seconds: 5 },
  streak: { xp: 25 },
  referral: { xp: 100 },
};

// Prototype: missions are self-confirmed until a backend verifies them.
export const MISSIONS = [
  { id: 'm1', title: 'Explore the Rewards store', desc: 'Browse what you can redeem', xp: 30 },
  { id: 'm2', title: 'Check your wallet', desc: 'Review your VEs and Gems', xp: 30 },
  { id: 'm3', title: 'Review the level roadmap', desc: 'See what the next levels unlock', xp: 30 },
  { id: 'm4', title: 'Play one XP Catcher run', desc: 'Finish a 20-second challenge', xp: 30 },
];

/* category: voucher | boost | badge. `effect: 'xp'` really adds XP; others are added to "My rewards". */
export const REWARD_CATALOG = [
  { id: 'r1', title: 'XP Booster Pack', desc: 'Instantly adds 200 XP to your level progress.', cost: { ve: 300 }, minLevel: 1, category: 'boost', effect: 'xp', xpGain: 200 },
  { id: 'r2', title: 'Mobile Recharge ₹50', desc: 'Top up your mobile number.', cost: { ve: 500 }, minLevel: 2, category: 'voucher' },
  { id: 'r3', title: 'Gift Voucher ₹100', desc: 'Choose a partner store after redeeming.', cost: { ve: 1000 }, minLevel: 3, category: 'voucher' },
  { id: 'r4', title: 'Gold Profile Frame', desc: 'A gold frame around your profile picture.', cost: { gems: 20 }, minLevel: 1, category: 'badge' },
  { id: 'r5', title: 'Trailblazer Badge', desc: 'A collectible badge for Level 05 members.', cost: { gems: 35 }, minLevel: 5, category: 'badge' },
  { id: 'r6', title: 'Gift Voucher ₹250', desc: 'A bigger voucher for dedicated earners.', cost: { ve: 2200 }, minLevel: 5, category: 'voucher' },
];
