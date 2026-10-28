import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', ref: params.get('ref') ?? '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (form.name.trim().length < 2) err.name = 'Please enter your full name.';
    if (!EMAIL.test(form.email.trim())) err.email = 'Enter a valid email, like you@example.com.';
    if (form.password.length < 8) err.password = 'Use at least 8 characters.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    const res = await signUp(form);
    setBusy(false);
    if (!res.ok) return setErrors({ form: res.error });
    navigate('/Lvl-Dashboard');
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join VELOOP Rewards and start earning XP today."
      footer={<>Already have an account? <Link to="/signin" className="vl-link">Sign in</Link></>}
    >
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className="vl-field">
          <label htmlFor="name">Full name</label>
          <input id="name" className="vl-input" placeholder="e.g. Swathi G" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
          {errors.name && <span className="vl-error">{errors.name}</span>}
        </div>
        <div className="vl-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="vl-input" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
          {errors.email && <span className="vl-error">{errors.email}</span>}
        </div>
        <div className="vl-field">
          <label htmlFor="password">Password</label>
          <div className={styles.pw}>
            <input id="password" type={show ? 'text' : 'password'} className="vl-input" placeholder="At least 8 characters" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} />
            <button type="button" className={styles.eye} onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="vl-error">{errors.password}</span>}
        </div>
        <div className="vl-field">
          <label htmlFor="ref">Referral code <span className={styles.opt}>(optional)</span></label>
          <input id="ref" className="vl-input" placeholder="e.g. VELOOP-4821" value={form.ref} onChange={set('ref')} />
        </div>
        {errors.form && <p className="vl-error" role="alert">{errors.form}</p>}
        <button type="submit" className="vl-btn-gold" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
        <p className={styles.demo}>Prototype sign up: your account is saved in this browser only.</p>
      </form>
    </AuthLayout>
  );
}
