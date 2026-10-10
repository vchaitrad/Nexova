import { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'success' }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`fade-up flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              t.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : t.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            <span className="text-base flex-shrink-0">
              {t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : '✓'}
            </span>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
