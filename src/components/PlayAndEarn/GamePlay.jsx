import { useEffect, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import styles from './Game.module.css';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function GamePlay({ config, onFinish }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const [hud, setHud] = useState({ score: 0, time: config.durationSec, mult: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf;
    const keys = { left: false, right: false };
    const s = {
      score: 0, streak: 0, best: 0, elapsed: 0, spawn: 0, last: performance.now(), over: false,
      caught: { xp: 0, coin: 0, gem: 0 }, items: [], x: 0, bw: 90, bh: 30, mult: 1, shownScore: -1, shownTime: -1, shownMult: 1,
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.bw = clamp(W * 0.24, 76, 120);
      s.x = s.x ? clamp(s.x, s.bw / 2, W - s.bw / 2) : W / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const moveTo = (clientX) => {
      const r = canvas.getBoundingClientRect();
      s.x = clamp(clientX - r.left, s.bw / 2, W - s.bw / 2);
    };
    const onPointer = (e) => moveTo(e.clientX);
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') { keys.left = true; e.preventDefault(); }
      if (e.key === 'ArrowRight') { keys.right = true; e.preventDefault(); }
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'ArrowRight') keys.right = false;
    };
    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const TYPES = [
      { type: 'xp', p: 0.5 }, { type: 'coin', p: 0.35 }, { type: 'gem', p: 0.15 },
    ];
    const pick = () => {
      let r = Math.random();
      for (const t of TYPES) { if ((r -= t.p) <= 0) return t.type; }
      return 'xp';
    };

    const drawItem = (it) => {
      const { x, y, r, type } = it;
      if (type === 'gem') {
        ctx.beginPath();
        for (let i = 0; i < 6; i += 1) {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        }
        ctx.closePath();
        const g = ctx.createLinearGradient(x, y - r, x, y + r);
        g.addColorStop(0, '#8ff0bd'); g.addColorStop(1, '#2f9e68');
        ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.stroke();
        return;
      }
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      if (type === 'xp') { g.addColorStop(0, '#c9b8ff'); g.addColorStop(1, '#5a3fd1'); } else { g.addColorStop(0, '#fbe6a0'); g.addColorStop(1, '#c48a1e'); }
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = type === 'xp' ? '#fff' : '#5a3a05';
      ctx.font = `700 ${Math.round(r * 0.8)}px Sora, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(type === 'xp' ? 'XP' : 'V', x, y + 1);
    };

    const drawBasket = () => {
      const top = H - s.bh - 10;
      const l = s.x - s.bw / 2;
      const g = ctx.createLinearGradient(0, top, 0, top + s.bh);
      g.addColorStop(0, '#f8dc8a'); g.addColorStop(1, '#a87a22');
      ctx.beginPath();
      ctx.moveTo(l, top); ctx.lineTo(l + s.bw, top);
      ctx.lineTo(l + s.bw * 0.86, top + s.bh); ctx.lineTo(l + s.bw * 0.14, top + s.bh); ctx.closePath();
      ctx.fillStyle = 'rgba(233,185,73,.18)'; ctx.fill();
      ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.stroke();
      ctx.strokeStyle = 'rgba(248,220,138,.35)'; ctx.lineWidth = 1;
      for (let i = 1; i < 5; i += 1) {
        const px = l + (s.bw * i) / 5;
        ctx.beginPath(); ctx.moveTo(px, top + 2); ctx.lineTo(l + s.bw * 0.14 + (s.bw * 0.72 * i) / 5, top + s.bh); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(l + 4, top + s.bh * 0.5); ctx.lineTo(l + s.bw - 4, top + s.bh * 0.5); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(s.x, top, s.bw / 2, 6, 0, 0, Math.PI * 2); ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.stroke();
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;
      s.elapsed += dt;

      if (keys.left) s.x -= 520 * dt;
      if (keys.right) s.x += 520 * dt;
      s.x = clamp(s.x, s.bw / 2, W - s.bw / 2);

      s.spawn -= dt;
      if (s.spawn <= 0) {
        s.spawn = Math.max(0.45, 0.68 - s.elapsed * 0.012);
        const r = 14 + Math.random() * 5;
        s.items.push({ type: pick(), r, x: r + 6 + Math.random() * (W - 2 * r - 12), y: -r, vy: 150 + Math.random() * 70 + s.elapsed * 7 });
      }

      const top = H - s.bh - 10;
      s.items = s.items.filter((it) => {
        it.y += it.vy * dt;
        const caught = it.y + it.r >= top && it.y - it.r <= top + s.bh && Math.abs(it.x - s.x) <= s.bw / 2 + it.r * 0.3;
        if (caught) {
          s.streak += 1;
          s.best = Math.max(s.best, s.streak);
          s.mult = s.streak >= config.streakForMultiplier ? config.multiplier : 1;
          s.score += config.points[it.type] * s.mult;
          s.caught[it.type] += 1;
          return false;
        }
        if (it.y - it.r > H) { s.streak = 0; s.mult = 1; return false; }
        return true;
      });

      ctx.clearRect(0, 0, W, H);
      s.items.forEach(drawItem);
      drawBasket();

      const timeLeft = Math.max(0, Math.ceil(config.durationSec - s.elapsed));
      if (s.score !== s.shownScore || timeLeft !== s.shownTime || s.mult !== s.shownMult) {
        s.shownScore = s.score; s.shownTime = timeLeft; s.shownMult = s.mult;
        setHud({ score: s.score, time: timeLeft, mult: s.mult });
      }

      if (s.elapsed >= config.durationSec) {
        if (!s.over) {
          s.over = true;
          finishRef.current({ score: s.score, caught: s.caught, bestStreak: s.best });
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      s.over = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [config]);

  return (
    <div className={styles.play}>
      <div className={styles.hud}>
        <span className={styles.timer} aria-label={`${hud.time} seconds left`}><Timer size={16} aria-hidden="true" /> 00:{String(hud.time).padStart(2, '0')}</span>
        <span className={styles.score}>Score <strong>{hud.score}</strong></span>
        <span className={`${styles.mult} ${hud.mult > 1 ? styles.multOn : ''}`}>{hud.mult}X</span>
      </div>
      <div className={styles.arena} ref={wrapRef}>
        <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="XP Catcher play area. Move the basket with a pointer, touch or the arrow keys." />
      </div>
      <p className={styles.hint}>Drag, touch, or use the arrow keys to move the basket.</p>
    </div>
  );
}
