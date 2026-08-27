import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  showSuccess: (title: string, description?: string) => string;
  showError: (title: string, description?: string) => string;
  showInfo: (title: string, description?: string) => string;
  showLoading: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, description, duration = 3500 }: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, type, title, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (type !== 'loading' && duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (title: string, description?: string) => addToast({ type: 'success', title, description }),
    [addToast]
  );

  const showError = useCallback(
    (title: string, description?: string) => addToast({ type: 'error', title, description, duration: 5000 }),
    [addToast]
  );

  const showInfo = useCallback(
    (title: string, description?: string) => addToast({ type: 'info', title, description }),
    [addToast]
  );

  const showLoading = useCallback(
    (title: string, description?: string) => addToast({ type: 'loading', title, description, duration: 0 }),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showLoading,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div
        id="toast-container"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            id={`toast-item-${toast.id}`}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border bg-[#141414]/95 backdrop-blur-md shadow-2xl transition-all animate-in slide-in-from-bottom-2 duration-200"
            style={{
              borderColor:
                toast.type === 'success'
                  ? '#D4AF37'
                  : toast.type === 'error'
                  ? '#ef4444'
                  : '#333333',
            }}
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-sky-400" />
              )}
              {toast.type === 'loading' && (
                <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white tracking-wide">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-neutral-500 hover:text-neutral-300 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
