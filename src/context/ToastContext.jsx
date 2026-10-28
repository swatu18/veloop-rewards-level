import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const toast = useCallback((m) => setMsg(m), []);
  useEffect(() => {
    if (!msg) return undefined;
    const t = setTimeout(() => setMsg(''), 2600);
    return () => clearTimeout(t);
  }, [msg]);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      {msg && (
        <div role="status" style={{ position: 'fixed', left: '50%', bottom: 88, transform: 'translateX(-50%)', zIndex: 1200, maxWidth: 'calc(100vw - 32px)', padding: '12px 18px', borderRadius: 12, fontSize: '0.9rem', background: '#2b3050', border: '1px solid rgba(255,255,255,.16)', boxShadow: '0 10px 30px rgba(0,0,0,.4)' }}>
          {msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}
