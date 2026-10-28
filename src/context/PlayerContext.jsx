import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  EARN_RULES, INITIAL_ACTIVITY, LEVELS, NEW_PLAYER, REWARD_CATALOG, SHOWCASE_PLAYER,
} from '../data/levelData';
import { deriveProgress, levelIndex } from '../utils/levels';

/**
 * Single source of truth for XP, VEs, Gems, activity, redemptions and daily earning.
 * Signed-out visitors get the showcase data; each account gets its own saved progress
 * (localStorage). Swap the load/save helpers for API calls when the backend exists.
 * `?state=loading|error|empty|nogame` previews UI states.
 */
const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

const dayKey = (offset = 0) => {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
const storeKey = (email) => `veloop-state-v1:${email || 'guest'}`;

function fresh(email) {
  const guest = !email;
  return {
    player: guest ? SHOWCASE_PLAYER : NEW_PLAYER,
    activity: guest ? INITIAL_ACTIVITY : [{ id: 'welcome', icon: 'game', title: 'Welcome bonus', xp: NEW_PLAYER.xp, ve: 0, gems: 0, time: 'Just now' }],
    redemptions: [],
    earn: { date: dayKey(), missions: {}, watch: 0, gamePlayed: false, streakDate: guest ? dayKey(-1) : null },
  };
}

function load(email) {
  try {
    const raw = localStorage.getItem(storeKey(email));
    if (raw) {
      const s = JSON.parse(raw);
      if (s.earn?.date !== dayKey()) {
        return { ...s, player: { ...s.player, tasksDone: 0 }, earn: { ...s.earn, date: dayKey(), missions: {}, watch: 0, gamePlayed: false } };
      }
      return s;
    }
  } catch { /* fall through to defaults */ }
  return fresh(email);
}

export function PlayerProvider({ children }) {
  const { user } = useAuth();
  const email = user?.email ?? null;
  const [forced] = useState(() => new URLSearchParams(window.location.search).get('state'));
  const [state, setState] = useState(() => {
    const s = load(email);
    return forced === 'empty' ? { ...s, activity: [] } : s;
  });
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [levelUp, setLevelUp] = useState(null);
  const ref = useRef(state);
  ref.current = state;

  const commit = useCallback((next) => { ref.current = next; setState(next); }, []);

  // switch saved progress when someone signs in or out
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    commit(load(email));
    setLevelUp(null);
  }, [email, commit]);

  useEffect(() => {
    try { localStorage.setItem(storeKey(email), JSON.stringify(state)); } catch { /* storage unavailable */ }
  }, [state, email]);

  useEffect(() => {
    setStatus('loading');
    if (forced === 'loading') return undefined;
    const t = setTimeout(() => setStatus(forced === 'error' && attempt === 0 ? 'error' : 'ready'), 900);
    return () => clearTimeout(t);
  }, [forced, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  const applyReward = useCallback(({ xp = 0, ve = 0, gems = 0, title, icon = 'game', task = false }) => {
    const s = ref.current;
    const p = s.player;
    const newXP = p.xp + xp;
    const before = levelIndex(p.xp);
    const after = levelIndex(newXP);
    commit({
      ...s,
      player: { ...p, xp: newXP, ve: p.ve + ve, gems: p.gems + gems, tasksDone: task ? Math.min(p.tasksTotal, p.tasksDone + 1) : p.tasksDone },
      activity: [{ id: `n${Date.now()}${Math.random()}`, icon, title, xp, ve, gems, time: 'Just now' }, ...s.activity].slice(0, 50),
    });
    if (after > before) {
      const reward = LEVELS.slice(before + 1, after + 1).reduce(
        (sum, l) => ({ ve: sum.ve + (l.reward?.ve ?? 0), gems: sum.gems + (l.reward?.gems ?? 0) }), { ve: 0, gems: 0 },
      );
      setLevelUp({ level: LEVELS[after].level, name: LEVELS[after].name, reward });
    }
  }, [commit]);

  const claimLevelUp = useCallback(() => {
    if (levelUp) {
      const { reward, level } = levelUp;
      applyReward({ ve: reward.ve, gems: reward.gems, title: `Level ${level} reward`, icon: 'game' });
    }
    setLevelUp(null);
  }, [levelUp, applyReward]);

  const patchEarn = (fn) => commit({ ...ref.current, earn: { ...ref.current.earn, ...fn(ref.current.earn) } });

  const completeMission = useCallback((m) => {
    if (ref.current.earn.missions[m.id]) return false;
    applyReward({ xp: m.xp, title: m.title, icon: 'mission', task: true });
    patchEarn((e) => ({ missions: { ...e.missions, [m.id]: true } }));
    return true;
  }, [applyReward]); // eslint-disable-line react-hooks/exhaustive-deps

  const watchAd = useCallback(() => {
    if (ref.current.earn.watch >= EARN_RULES.watch.dailyLimit) return false;
    applyReward({ xp: EARN_RULES.watch.xp, title: 'Watch & Earn', icon: 'watch', task: true });
    patchEarn((e) => ({ watch: e.watch + 1 }));
    return true;
  }, [applyReward]); // eslint-disable-line react-hooks/exhaustive-deps

  const claimStreak = useCallback(() => {
    const e = ref.current.earn;
    if (e.streakDate === dayKey()) return false;
    const streak = e.streakDate === dayKey(-1) ? ref.current.player.streak + 1 : 1;
    applyReward({ xp: EARN_RULES.streak.xp, title: 'Streak Bonus', icon: 'streak', task: true });
    commit({ ...ref.current, player: { ...ref.current.player, streak }, earn: { ...ref.current.earn, streakDate: dayKey() } });
    return true;
  }, [applyReward, commit]);

  const rewardGame = useCallback((r) => {
    const first = !ref.current.earn.gamePlayed;
    applyReward({ ...r, task: first });
    if (first) patchEarn(() => ({ gamePlayed: true }));
  }, [applyReward]); // eslint-disable-line react-hooks/exhaustive-deps

  const redeem = useCallback((item) => {
    const s = ref.current;
    const p = s.player;
    if (progressOf(p.xp).level < item.minLevel) return { ok: false, error: `Reach Level ${item.minLevel} to redeem this.` };
    if ((item.cost.ve ?? 0) > p.ve) return { ok: false, error: 'Not enough VEs yet. Earn more and come back.' };
    if ((item.cost.gems ?? 0) > p.gems) return { ok: false, error: 'Not enough Gems yet. Level up to earn more.' };
    commit({
      ...s,
      player: { ...p, ve: p.ve - (item.cost.ve ?? 0), gems: p.gems - (item.cost.gems ?? 0) },
      redemptions: [{ id: `r${Date.now()}`, itemId: item.id, title: item.title, cost: item.cost, time: 'Just now' }, ...s.redemptions],
    });
    if (item.effect === 'xp') applyReward({ xp: item.xpGain, title: `Redeemed: ${item.title}`, icon: 'game' });
    return { ok: true };
  }, [commit, applyReward]);

  const resetProgress = useCallback(() => { commit(fresh(email)); setLevelUp(null); }, [commit, email]);

  const { player, activity, redemptions, earn } = state;
  const progress = deriveProgress(player.xp);
  const value = {
    status, retry, user, displayName: user?.name?.split(' ')[0] ?? 'VeLooper',
    player, progress, activity, redemptions, earn, levelUp,
    applyReward, claimLevelUp, completeMission, watchAd, claimStreak, rewardGame, redeem, resetProgress,
    todayXP: activity.reduce((s, a) => s + a.xp, 0),
    todayVE: activity.reduce((s, a) => s + (a.ve > 0 ? a.ve : 0), 0),
    gameAvailable: forced !== 'nogame',
    catalog: REWARD_CATALOG,
  };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

function progressOf(xp) { return deriveProgress(xp); }
