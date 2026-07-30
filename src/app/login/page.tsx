"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Inventario Code301</h1>
        <p className="mt-1 text-sm text-gray-500">
          Inicia sesion para continuar
        </p>

        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Continuar con GitHub
        </button>
      </div>
    </main>
  );
}