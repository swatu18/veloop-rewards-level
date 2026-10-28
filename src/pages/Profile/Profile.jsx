import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import LevelBadge from '../../components/LevelBadge/LevelBadge';
import { LEVELS } from '../../data/levelData';
import { fmt, pad2 } from '../../utils/format';
import s from '../AppPages.module.css';

export default function Profile() {
  const { user, signOut, updateName } = useAuth();
  const { player, progress: p, resetProgress } = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [confirmReset, setConfirmReset] = useState(false);

  const stateOf = (lvl) => (lvl < p.level ? 'done' : lvl === p.level ? 'current' : lvl === p.level + 1 ? 'next' : 'locked');
  const saveName = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast('Please enter your full name.');
    updateName(name.trim());
    setEditing(false);
    toast('Name updated');
  };

  return (
    <div className={s.stack}>
      <div className="vl-pagehead">
        <h1>Profile</h1>
        <p>Your account, progress and badge collection.</p>
      </div>

      <section className={`vl-card ${s.card} ${s.hero}`} aria-label="Account">
        {user ? (
          <>
            <div className={s.who}>
              <span className={s.avatar} aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {editing ? (
                  <form className={s.edit} onSubmit={saveName}>
                    <label className="vl-sr" htmlFor="pname">Full name</label>
                    <input id="pname" className="vl-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Swathi G" />
                    <button type="submit" className={`vl-btn-gold ${s.smallBtn}`}>Save</button>
                    <button type="button" className={`vl-btn-ghost ${s.smallBtn}`} onClick={() => { setEditing(false); setName(user.name); }}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <h2 style={{ fontSize: '1.3rem' }}>{user.name}</h2>
                    <p className={s.muted} style={{ overflowWrap: 'anywhere' }}>{user.email}</p>
                  </>
                )}
              </div>
              {!editing && <button type="button" className={`vl-btn-ghost ${s.smallBtn}`} onClick={() => setEditing(true)}><Pencil size={14} aria-hidden="true" /> Edit name</button>}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.2rem' }}>You're browsing as a guest</h2>
            <p className={s.muted}>Create an account to save your progress, get a referral code and keep your rewards.</p>
            <div className={s.actions}>
              <Link to="/signup" className="vl-btn-gold">Create account</Link>
              <Link to="/signin" className="vl-btn-ghost">Sign in</Link>
            </div>
          </>
        )}
      </section>

      <div className={s.stats}>
        <div className={s.stat}><strong>{pad2(p.level)}</strong><span>Level: {p.name}</span></div>
        <div className={s.stat}><strong>{fmt(player.xp)}</strong><span>Total XP</span></div>
        <div className={s.stat}><strong>{player.streak}</strong><span>Day streak</span></div>
        <div className={s.stat}><strong>{player.tasksDone}/{player.tasksTotal}</strong><span>Tasks today</span></div>
      </div>

      <section className={`vl-card ${s.card}`} aria-labelledby="badge-t">
        <h2 id="badge-t" style={{ fontSize: '1.1rem' }}>Badge collection</h2>
        <ul className={s.badges}>
          {LEVELS.map((l) => (
            <li key={l.level}>
              <LevelBadge level={l.level} size="md" state={stateOf(l.level)} />
              <span>{l.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`vl-card ${s.card}`} aria-labelledby="acct-t">
        <h2 id="acct-t" style={{ fontSize: '1.1rem' }}>Account actions</h2>
        <div className={s.actions}>
          {user && <button type="button" className="vl-btn-ghost" onClick={() => { signOut(); toast('Signed out'); navigate('/'); }}>Sign out</button>}
          {!confirmReset ? (
            <button type="button" className="vl-btn-ghost" onClick={() => setConfirmReset(true)}>Reset demo progress</button>
          ) : (
            <>
              <button type="button" className="vl-btn-gold" onClick={() => { resetProgress(); setConfirmReset(false); toast('Progress reset'); }}>Yes, reset</button>
              <button type="button" className="vl-btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
            </>
          )}
        </div>
        <p className={s.muted}>Resetting returns your XP, balances and activity to the starting values. This only affects this browser.</p>
      </section>
    </div>
  );
}
