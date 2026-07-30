"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const links = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h4a1 1 0 001-1v-5a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 001 1h4a1 1 0 001-1V10" />
      </svg>
    ),
  },
  {
    href: "/categorias",
    label: "Categorías",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5.586a1 1 0 01.707.293l6.414 6.414a1 1 0 010 1.414l-7.586 7.586a1 1 0 01-1.414 0l-6.414-6.414A1 1 0 013 11.586V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    href: "/proveedores",
    label: "Proveedores",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h.01M9 12h.01M9 15h.01" />
      </svg>
    ),
  },
  {
    href: "/productos",
    label: "Productos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">Inventario</h2>
        <p className="text-xs text-gray-400">Code301</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200 px-3 py-4">
        {session?.user && (
          <div className="mb-3 flex items-center gap-2 px-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? "Usuario"}
                className="h-8 w-8 rounded-full ring-2 ring-indigo-100"
              />
            )}
            <span className="truncate text-sm font-medium text-gray-700">
              {session.user.name ?? session.user.email}
            </span>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}