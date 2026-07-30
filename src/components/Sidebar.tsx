"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/categorias", label: "Categorías" },
  { href: "/proveedores", label: "Proveedores" },
  { href: "/productos", label: "Productos" },
];

export default function Sidebar() {
  const pathname = usePathname();

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
    </aside>
  );
}