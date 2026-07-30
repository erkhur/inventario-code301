"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface ToastItem {
  id: number;
  tipo: "exito" | "error";
  texto: string;
}

interface ToastContextValue {
  mostrarToast: (tipo: "exito" | "error", texto: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return context;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const mostrarToast = useCallback((tipo: "exito" | "error", texto: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tipo, texto }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-slide-in flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.tipo === "exito" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            <span>{toast.tipo === "exito" ? "✓" : "✕"}</span>
            <span>{toast.texto}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}