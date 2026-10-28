import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Lock, Ticket, Zap, BadgeCheck } from 'lucide-react';
import { FaCoins, FaGem } from 'react-icons/fa';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import RewardChips from '../../components/shared/RewardChips';
import { fmt, pad2 } from '../../utils/format';
import s from '../AppPages.module.css';

const FILTERS = [['all', 'All'], ['voucher', 'Vouchers'], ['boost', 'Boosts'], ['badge', 'Badges']];
const CAT_ICON = { voucher: Ticket, boost: Zap, badge: BadgeCheck };

function Cost({ cost }) {
  return (
    <span className={s.cost}>
      {cost.ve != null && <><FaCoins aria-hidden="true" /> {fmt(cost.ve)} VEs</>}
      {cost.gems != null && <span className={s.gem}><FaGem aria-hidden="true" /> {fmt(cost.gems)} Gems</span>}
    </span>
  );
}

export default function Rewards() {
  const { player, progress: p, catalog, redeem, redemptions } = usePlayer();
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [pending, setPending] = useState(null);
  const confirmBtn = useRef(null);

  useEffect(() => {
    if (!pending) return undefined;
    confirmBtn.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setPending(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [pending]);

  const items = catalog.filter((i) => filter === 'all' || i.category === filter);
  const confirm = () => {
    const res = redeem(pending);
    toast(res.ok ? `Redeemed: ${pending.title}` : res.error);
    setPending(null);
  };

  return (
    <div className={s.stack}>
      <div className="vl-pagehead">
        <h1>Rewards store</h1>
        <p>Spend your VEs and Gems on rewards. Higher levels unlock more.</p>
      </div>

      <section className={`vl-card ${s.card} ${s.hero}`} aria-label="Your balance">
        <div className={s.secHead}>
          <div className={s.actions}>
            <span className={`${s.cost}`}><FaCoins aria-hidden="true" /> {fmt(player.ve)} VEs</span>
            <span className={`${s.cost} ${s.gem}`}><FaGem aria-hidden="true" /> {fmt(player.gems)} Gems</span>
          </div>
          <Link to="/wallet" className="vl-link">Open wallet</Link>
        </div>
        {!p.isMax && (
          <div className={s.secHead}>
            <span className={s.muted}>Level {pad2(p.nextLevel)} reward:</span>
            <RewardChips reward={p.nextReward} />
            <Link to="/Lvl-Dashboard#roadmap" className="vl-link">See roadmap</Link>
          </div>
        )}
      </section>

      <div className={s.chips} role="group" aria-label="Filter rewards">
        {FILTERS.map(([id, label]) => (
          <button key={id} type="button" className={s.chip} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>

      <ul className={`${s.grid3} ${s.list}`} style={{ display: 'grid' }}>
        {items.map((i) => {
          const Icon = CAT_ICON[i.category] ?? Gift;
          const locked = p.level < i.minLevel;
          const short = (i.cost.ve ?? 0) > player.ve || (i.cost.gems ?? 0) > player.gems;
          return (
            <li key={i.id} className={`vl-card ${s.card} ${s.item}`}>
              <div className={s.itemTop}>
                <span className={s.rowIcon}><Icon size={22} aria-hidden="true" /></span>
                {locked ? <span className={s.lockNote}><Lock size={14} aria-hidden="true" /> Level {pad2(i.minLevel)}</span> : <Cost cost={i.cost} />}
              </div>
              <div>
                <h3>{i.title}</h3>
                <p className={s.muted}>{i.desc}</p>
              </div>
              {locked ? <button type="button" className="vl-btn-ghost" disabled>Reach Level {pad2(i.minLevel)}</button>
                : <button type="button" className="vl-btn-gold" disabled={short} onClick={() => setPending(i)}>{short ? 'Not enough balance' : 'Redeem'}</button>}
            </li>
          );
        })}
      </ul>
      <p className={s.muted}>Demo catalog: items and prices are placeholders until the official rewards list is approved.</p>

      <section className={`vl-card ${s.card}`} aria-labelledby="mine-t">
        <h2 id="mine-t" style={{ fontSize: '1.1rem' }}>My rewards</h2>
        {redemptions.length === 0 ? (
          <div className={s.empty}><Gift size={28} aria-hidden="true" /><h3>No rewards redeemed yet</h3><p>Redeem something above and it will show up here.</p></div>
        ) : (
          <ul className={s.list}>
            {redemptions.map((r) => (
              <li key={r.id} className={s.row}>
                <span className={s.rowIcon}><Gift size={20} aria-hidden="true" /></span>
                <span className={s.rowText}><strong>{r.title}</strong><span>{r.time}</span></span>
                <Cost cost={r.cost} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {pending && (
        <div className={s.overlay} role="dialog" aria-modal="true" aria-labelledby="cf-t" onClick={(e) => { if (e.target === e.currentTarget) setPending(null); }}>
          <div className={s.modal}>
            <h2 id="cf-t">Redeem {pending.title}?</h2>
            <p className={s.muted}>This will use <Cost cost={pending.cost} /> from your wallet.</p>
            <div className={s.actions}>
              <button ref={confirmBtn} type="button" className="vl-btn-gold" onClick={confirm}>Confirm</button>
              <button type="button" className="vl-btn-ghost" onClick={() => setPending(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
