"use client";

interface ConfirmModalProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({
  abierto,
  titulo,
  mensaje,
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  if (!abierto) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
        <p className="mt-2 text-sm text-gray-500">{mensaje}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}