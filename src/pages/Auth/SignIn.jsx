import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return setError('Enter your email and password.');
    setBusy(true);
    const res = await signIn(form);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    navigate('/Lvl-Dashboard');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your level progress."
      footer={<>New to VELOOP? <Link to="/signup" className="vl-link">Create an account</Link></>}
    >
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className="vl-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="vl-input" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={set('email')} />
        </div>
        <div className="vl-field">
          <label htmlFor="password">Password</label>
          <div className={styles.pw}>
            <input id="password" type={show ? 'text' : 'password'} className="vl-input" placeholder="Enter your password" autoComplete="current-password" value={form.password} onChange={set('password')} />
            <button type="button" className={styles.eye} onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="button" className={styles.forgot} onClick={() => setForgot((f) => !f)}>Forgot password?</button>
        {forgot && <p className={styles.demo} role="status">Password reset needs the backend and isn't connected in this prototype.</p>}
        {error && <p className="vl-error" role="alert">{error}</p>}
        <button type="submit" className="vl-btn-gold" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </AuthLayout>
  );
}
