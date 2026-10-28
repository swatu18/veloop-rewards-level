import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Copy, Flame, Magnet, Play, Share2, Users, ClipboardList } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import XPProgress from '../../components/XPProgress/XPProgress';
import { EARN_FEATURES, EARN_RULES, MISSIONS } from '../../data/levelData';
import { FEATURE_ICONS } from '../../utils/icons';
import { fmt, pad2, scrollToId } from '../../utils/format';
import s from '../AppPages.module.css';

function refCode(user) {
  if (!user) return null;
  let n = 0;
  for (const c of user.email) n = (n * 31 + c.charCodeAt(0)) % 9000;
  return `VELOOP-${1000 + n}`;
}
const today = () => new Date().toISOString().slice(0, 10);

export default function Earn() {
  const { user, player, progress: p, earn, completeMission, watchAd, claimStreak } = usePlayer();
  const toast = useToast();
  const { search } = useLocation();
  const [secs, setSecs] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    const f = new URLSearchParams(search).get('focus');
    if (f) setTimeout(() => scrollToId(f), 100);
  }, [search]);
  useEffect(() => () => clearInterval(timer.current), []);

  const watchesLeft = EARN_RULES.watch.dailyLimit - earn.watch;
  const startWatch = () => {
    setSecs(EARN_RULES.watch.seconds);
    let left = EARN_RULES.watch.seconds;
    timer.current = setInterval(() => {
      left -= 1;
      setSecs(left);
      if (left <= 0) {
        clearInterval(timer.current);
        if (watchAd()) toast(`+${EARN_RULES.watch.xp} XP from Watch & Earn`);
      }
    }, 1000);
  };

  const missionsDone = MISSIONS.filter((m) => earn.missions[m.id]).length;
  const streakClaimed = earn.streakDate === today();
  const code = refCode(user);
  const link = code ? `${window.location.origin}/signup?ref=${code}` : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); toast('Referral link copied'); } catch { toast('Copy failed. Select the link and copy it manually.'); }
  };
  const share = () => (navigator.share ? navigator.share({ title: 'Join VELOOP Rewards', url: link }).catch(() => {}) : copy());

  return (
    <div className={s.stack}>
      <div className="vl-pagehead">
        <h1>Earn &amp; Level Up</h1>
        <p>Complete activities, earn XP and climb to your next level.</p>
      </div>

      <section className={`vl-card ${s.card} ${s.hero}`} aria-label="Your progress">
        <div className={s.secHead}>
          <strong>{p.isMax ? 'Top level reached' : `${fmt(p.xpToNext)} XP to Level ${pad2(p.nextLevel)}`}</strong>
          <span className={s.muted}>Tasks today: {player.tasksDone}/{player.tasksTotal}</span>
        </div>
        <XPProgress percent={p.percent} thin />
      </section>

      <div className={s.grid2}>
        <section className={`vl-card ${s.card}`} id="watch" aria-labelledby="watch-t">
          <div className={s.secHead}>
            <h2 id="watch-t"><Play size={20} aria-hidden="true" /> Watch &amp; Earn</h2>
            <span className={s.xpTag}>+{EARN_RULES.watch.xp} XP each</span>
          </div>
          <div className={s.ad} aria-live="polite">
            {secs > 0 ? <div><strong>{secs}</strong><p>Sample video playing (demo)</p></div> : <p>Sample ad area. Real ads connect here later.</p>}
          </div>
          <button type="button" className="vl-btn-gold" onClick={startWatch} disabled={secs > 0 || watchesLeft <= 0}>
            {watchesLeft <= 0 ? 'Come back tomorrow' : secs > 0 ? 'Watching...' : `Watch now (${watchesLeft} left today)`}
          </button>
        </section>

        <section className={`vl-card ${s.card}`} id="streak" aria-labelledby="streak-t">
          <div className={s.secHead}>
            <h2 id="streak-t"><Flame size={20} aria-hidden="true" /> Streak Bonus</h2>
            <span className={s.xpTag}>+{EARN_RULES.streak.xp} XP daily</span>
          </div>
          <p className={s.muted}>You're on a <strong>{player.streak}-day</strong> streak. Check in every day to keep it going.</p>
          <button type="button" className="vl-btn-gold" disabled={streakClaimed} onClick={() => { if (claimStreak()) toast(`Streak extended. +${EARN_RULES.streak.xp} XP`); }}>
            {streakClaimed ? 'Checked in today' : 'Check in for today'}
          </button>
        </section>
      </div>

      <section className={`vl-card ${s.card}`} id="daily" aria-labelledby="daily-t">
        <div className={s.secHead}>
          <h2 id="daily-t"><ClipboardList size={20} aria-hidden="true" /> Daily Missions</h2>
          <span className={s.muted}>{missionsDone}/{MISSIONS.length} done</span>
        </div>
        <ul className={s.list}>
          {MISSIONS.map((m) => {
            const done = earn.missions[m.id];
            return (
              <li key={m.id} className={s.row}>
                <span className={s.rowIcon}>{done ? <Check size={20} /> : <ClipboardList size={20} />}</span>
                <span className={s.rowText}><strong>{m.title}</strong><span>{m.desc}</span></span>
                {done ? <span className={s.done}>Done</span> : (
                  <button type="button" className={`vl-btn-ghost ${s.smallBtn}`} onClick={() => { if (completeMission(m)) toast(`+${m.xp} XP: ${m.title}`); }}>
                    Complete +{m.xp} XP
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <p className={s.muted}>Prototype: missions are self-confirmed until the backend verifies them.</p>
      </section>

      <div className={s.grid2}>
        <section className={`vl-card ${s.card}`} id="refer" aria-labelledby="ref-t">
          <div className={s.secHead}>
            <h2 id="ref-t"><Users size={20} aria-hidden="true" /> Refer &amp; Earn</h2>
            <span className={s.xpTag}>+{EARN_RULES.referral.xp} XP per friend</span>
          </div>
          {code ? (
            <>
              <p className={s.muted}>Share your link. You earn XP when a friend joins with your code.</p>
              <div className={s.code}><span className={s.codeBox}>{code}</span></div>
              <div className={s.actions}>
                <button type="button" className="vl-btn-ghost" onClick={copy}><Copy size={16} aria-hidden="true" /> Copy link</button>
                <button type="button" className="vl-btn-gold" onClick={share}><Share2 size={16} aria-hidden="true" /> Share</button>
              </div>
              <p className={s.muted}>Referral rewards are credited by the backend once a friend signs up. Friends joined so far: 0.</p>
            </>
          ) : (
            <>
              <p className={s.muted}>Sign up to get your own referral code and invite friends.</p>
              <div className={s.actions}><Link to="/signup" className="vl-btn-gold">Create account</Link></div>
            </>
          )}
        </section>

        <section className={`vl-card ${s.card}`} id="catcher" aria-labelledby="catch-t">
          <div className={s.secHead}>
            <h2 id="catch-t"><Magnet size={20} aria-hidden="true" /> XP Catcher</h2>
            <span className={s.xpTag}>Up to +40 XP</span>
          </div>
          <p className={s.muted}>A 20-second skill game. Catch orbs and coins, then turn your score into XP.</p>
          <div className={s.actions}><Link to="/Lvl-Dashboard#play" className="vl-btn-gold">Play now</Link></div>
        </section>
      </div>

      <section className={`vl-card ${s.card}`} aria-labelledby="soon-t">
        <h2 id="soon-t" style={{ fontSize: '1.1rem' }}>Coming soon</h2>
        <div className={s.grid3}>
          {EARN_FEATURES.filter((f) => f.status === 'soon').map((f) => {
            const Icon = FEATURE_ICONS[f.icon];
            return (
              <div key={f.id} className={`${s.row} ${s.soonCard}`}>
                <span className={s.rowIcon}><Icon size={20} aria-hidden="true" /></span>
                <span className={s.rowText}><strong>{f.title}</strong><span>{f.desc}</span></span>
                <span className="vl-pill">Soon</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
