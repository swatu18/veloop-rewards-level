# VELOOP Rewards: Level-Up Dashboard

A premium, gamified progression hub for VELOOP Rewards (Task 16). Users see their level, XP, the next reward and a roadmap, then play a mini-game or pick an earning activity to level up faster.

> All XP, level, reward and game values are **development/demo data** until the product team approves the official rules.

## Live Demo
- Live: `https://<your-app>.vercel.app/Lvl-Dashboard` (add after deploy)
- Repository: `https://github.com/<your-username>/<repo>` (add after push)

## Screenshots
Add images to `/screenshots` and link them here: desktop, tablet, mobile, current level, XP progress, next reward, roadmap, game start/gameplay/result, earn cards, XP activity, level-up, loading, empty, error.
Tip: append `?demo=1` to the URL to open the demo bar (trigger level-up, loading, error, empty and no-game states).

## Level System
8 demo levels (`src/data/levelData.js`). Each level has a name, the total XP where it starts, and the reward granted for reaching it. The roadmap shows four states: **Completed**, **You are here**, **Next goal**, **Locked**. Tap a level to see its details.

## XP System
- Total XP decides the level. The bar shows progress *inside* the current level (e.g. 6,420 XP between Level 05 at 5,200 and Level 06 at 8,000 = 44%).
- "XP to next level" is always calculated for the user.
- Sources: activities, referrals, games, streaks, daily bonuses (amounts are demo values).

## Next-Level Reward
A locked reward chest with VEs and Gems, the unlock requirement, a progress bar and an [i] tooltip explaining the reward comes from the current reward configuration.

## Game Concept: XP Catcher
A 20-second skill game. Move a basket to catch falling XP orbs, coins and gems.

## Game Rules (demo)
| Item | Value |
|---|---|
| Objective | Catch as many items as possible |
| Points | XP orb +6, coin +4, gem +10 |
| Bonus | 6 catches in a row = 2X until a miss |
| Time | 20 seconds |
| Attempts | 3 runs per day (local state) |
| Reward | Score 0+: +5 XP, 40+: +15 XP +5 VEs, 80+: +30 XP +12 VEs, 120+: +40 XP +20 VEs |
| Eligibility | Every member; prototype only |

It is a skill/engagement game: no betting, chance payouts or jackpots. Prototype logic lives in `PlayAndEarn/` and `utils/game.js`; real reward crediting plugs into `onReward` (see `PlayerContext.applyReward`).

## Earning Features
Watch & Earn, Daily Missions, Refer & Earn, XP Catcher, Streak Bonus (`status: 'live'`) and Mini Games, Quick Quiz, Weekly Quest, Reward Hunt (`status: 'soon'`, shown as **Coming soon**). Flip `status` in `levelData.js` once approved, and connect `onFeature` in the page to the existing routes.

## Technology Stack
React 18, Vite, Bootstrap 5, CSS Modules, React Hooks, React Router, Lucide React, React Icons.

## Installation
```bash
npm install
npm run dev
```
Open `http://localhost:5173/` (welcome page) or `http://localhost:5173/Lvl-Dashboard`.

## Development Commands
```bash
npm run dev      # local dev server
npm run build    # production build in /dist
npm run preview  # preview the build
```
Preview states: `?state=loading`, `?state=error`, `?state=empty`, `?state=nogame`, and `?demo=1` for the demo bar.

## Badges
Drop the official badge images in `src/assets/badges/` named `level-1.png`, `level-2.png`, ... They are picked up automatically. Without them, a built-in gold hexagon badge is drawn.

## Folder Structure
```
src/
  components/ LevelBadge, LevelHero, XPProgress, NextLevelReward, LevelRoadmap,
              LevelRewardCard, PlayAndEarn (GameContainer, GameStart, GamePlay,
              GameResult, Game.module.css), EarnMoreXP, XPActivity, LevelInfo,
              LevelUpModal, States, BottomNav, shared
  data/       levelData.js (all demo data)
  context/    AuthContext, PlayerContext, ToastContext
  hooks/      useCountUp.js
  pages/      Landing, Auth (SignIn, SignUp), LevelDashboard, Earn, Rewards, Wallet, Profile
  styles/     global.css
  utils/      format.js, game.js, icons.js
  assets/badges/
```

## Component Architecture
`LevelDashboard` (page) owns the state from `useLevelProgress` and composes the sections. Components are presentational and receive data via props, so replacing the hook's demo data with an API call needs no UI changes.

## Responsive Behavior
Mobile 320px+: single column in the design's order (hero, reward, roadmap, game, earn, activity), vertical roadmap, bottom navigation. Tablet 768px+: horizontal roadmap, two-column earn grid. Laptop 1280px+ and above: two-column hero + reward, game + activity side by side, three-column earn grid.

## Animation Details
XP bar fills on load, count-up score, chest lid lift on hover/focus, reward reveal on the result screen, subtle level-up badge reveal and particles. All motion is reduced when `prefers-reduced-motion` is on.

## Accessibility
Keyboard-playable game, visible focus rings, ARIA progress bars, labelled tooltips (Escape closes), focus moved into the level-up dialog.

## Deployment
Push to GitHub, import into Vercel (framework: Vite). `vercel.json` rewrites all routes to `index.html`, so `/Lvl-Dashboard` works directly.

## Pages, Accounts and Navigation
| Route | Page |
|---|---|
| `/` | Welcome / landing page with Sign up and Sign in |
| `/signup`, `/signin` | Account forms with validation and placeholders |
| `/Lvl-Dashboard` | Level-Up Dashboard (home) |
| `/earn` | Watch & Earn, Streak Bonus, Daily Missions, Refer & Earn, XP Catcher link, Coming soon |
| `/rewards` | Rewards store: filter, redeem with confirmation, "My rewards" |
| `/wallet` | VEs, Gems, XP balances and a filterable transaction list |
| `/profile` | Account, stats, badge collection, sign out, reset demo progress |

- The top bar (desktop) and bottom bar (mobile) link to all five app pages. The bell shows recent activity.
- Signed-out visitors see showcase data (Level 05, 6,420 XP). New accounts start at Level 1 with a 150 XP welcome bonus and their own saved progress.
- **Demo auth:** accounts and progress are stored in this browser's localStorage (passwords as a salted SHA-256 hash). Replace `AuthContext` and `PlayerContext` with real API calls for production.
- Earning is prototype logic: missions are self-confirmed, ads are simulated, referral rewards need the backend, and the Rewards catalog is placeholder data in `levelData.js`.

## Author
Swathi G
