"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/categorias", label: "Categorías" },
  { href: "/proveedores", label: "Proveedores" },
  { href: "/productos", label: "Productos" },
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
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
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
                className="h-8 w-8 rounded-full"
              />
            )}
            <span className="truncate text-sm font-medium text-gray-700">
              {session.user.name ?? session.user.email}
            </span>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}