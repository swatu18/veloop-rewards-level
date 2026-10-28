import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, Star, Wallet as WalletIcon } from 'lucide-react';
import { FaCoins, FaGem } from 'react-icons/fa';
import { usePlayer } from '../../context/PlayerContext';
import { fmt } from '../../utils/format';
import s from '../AppPages.module.css';

export default function Wallet() {
  const { player, activity, redemptions } = usePlayer();
  const [filter, setFilter] = useState('all');

  const spent = redemptions.map((r) => ({ id: r.id, title: `Redeemed: ${r.title}`, time: r.time, ve: -(r.cost.ve ?? 0), gems: -(r.cost.gems ?? 0), xp: 0 }));
  const all = [...spent, ...activity];
  const rows = all.filter((t) => (filter === 'earned' ? t.ve > 0 || t.gems > 0 || t.xp > 0 : filter === 'spent' ? t.ve < 0 || t.gems < 0 : true));

  const amount = (t) => [t.xp > 0 && `+${t.xp} XP`, t.ve !== 0 && `${t.ve > 0 ? '+' : '-'}${fmt(Math.abs(t.ve))} VEs`, t.gems && `${t.gems > 0 ? '+' : '-'}${fmt(Math.abs(t.gems))} Gems`].filter(Boolean).join(' · ');

  return (
    <div className={s.stack}>
      <div className="vl-pagehead">
        <h1>Wallet</h1>
        <p>Your VEs, Gems and XP, and everything you've earned or spent.</p>
      </div>

      <section className={`vl-card ${s.card} ${s.hero}`} aria-label="Balances">
        <div className={s.grid3}>
          <div className={s.bal}><span className={s.balLabel}><FaCoins aria-hidden="true" /> VEs</span><span className={`${s.balValue} vl-gold-text`}>{fmt(player.ve)}</span></div>
          <div className={s.bal}><span className={s.balLabel}><FaGem aria-hidden="true" /> Gems</span><span className={s.balValue}>{fmt(player.gems)}</span></div>
          <div className={s.bal}><span className={s.balLabel}><Star size={16} aria-hidden="true" /> Total XP</span><span className={s.balValue}>{fmt(player.xp)}</span></div>
        </div>
        <div className={s.actions}>
          <Link to="/earn" className="vl-btn-gold">Earn more</Link>
          <Link to="/rewards" className="vl-btn-ghost">Redeem rewards</Link>
          <button type="button" className="vl-btn-ghost" disabled title="Coming soon"><WalletIcon size={16} aria-hidden="true" /> Withdraw (coming soon)</button>
        </div>
      </section>

      <section className={`vl-card ${s.card}`} aria-labelledby="tx-t">
        <div className={s.secHead}>
          <h2 id="tx-t">Transactions</h2>
          <div className={s.chips} role="group" aria-label="Filter transactions">
            {[['all', 'All'], ['earned', 'Earned'], ['spent', 'Spent']].map(([id, label]) => (
              <button key={id} type="button" className={s.chip} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>
        </div>
        {rows.length === 0 ? (
          <div className={s.empty}>
            <WalletIcon size={28} aria-hidden="true" />
            <h3>No transactions yet</h3>
            <p>Complete an activity and it will appear here.</p>
            <Link to="/earn" className="vl-btn-gold">Start earning XP</Link>
          </div>
        ) : (
          <ul className={s.list}>
            {rows.map((t) => (
              <li key={t.id} className={s.row}>
                <span className={s.rowIcon}>{t.ve < 0 || t.gems < 0 ? <ArrowUpRight size={20} aria-hidden="true" /> : <ArrowDownLeft size={20} aria-hidden="true" />}</span>
                <span className={s.rowText}><strong>{t.title}</strong><span>{t.time}</span></span>
                <span className={`${s.gain} ${t.ve < 0 || t.gems < 0 ? s.spend : ''}`}>{amount(t)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
