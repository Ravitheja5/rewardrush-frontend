import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, width: '100%', maxWidth: '380px', padding: '0 16px', pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '14px', background: '#151D2E', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', color: '#F5F7FF' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {toast.type === 'success' && <CheckCircle2 size={16} color="#22C55E" />}
                {toast.type === 'error' && <AlertCircle size={16} color="#EF4444" />}
                {toast.type === 'info' && <Info size={16} color="#38BDF8" />}
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{toast.message}</span>
              </div>
              <button onClick={() => removeToast(toast.id)} style={{ background: 'transparent', border: 'none', color: '#6B7490', cursor: 'pointer', padding: 0 }}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
