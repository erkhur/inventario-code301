"use client";

import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  stock: number;
}

interface DashboardData {
  cantidadProveedores: number;
  cantidadProductos: number;
  promedioPrecio: number;
  promedioStock: number;
  productoMayorPrecio: Producto | null;
  productoMayorStock: Producto | null;
}

function formatearMoneda(valor: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(valor);
}

function IconoBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
      {children}
    </div>
  );
}

function TarjetaMetrica({
  titulo,
  valor,
  detalle,
  icono,
  color,
}: {
  titulo: string;
  valor: string;
  detalle?: string;
  icono: React.ReactNode;
  color: string;
}) {
  return (
    <div className="animate-fade-in rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <IconoBadge color={color}>{icono}</IconoBadge>
      <p className="mt-4 text-sm font-medium text-gray-500">{titulo}</p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{valor}</p>
      {detalle && <p className="mt-1 text-sm text-gray-400">{detalle}</p>}
    </div>
  );
}

const iconoProveedores = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 text-indigo-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
  </svg>
);
const iconoProductos = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 text-emerald-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
  </svg>
);
const iconoPrecio = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 text-amber-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const iconoStock = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 text-sky-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarMetricas() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("No se pudieron cargar las metricas");
        const json = await res.json();
        setData(json);
      } catch {
        setError("Error al cargar el dashboard");
      } finally {
        setCargando(false);
      }
    }
    cargarMetricas();
  }, []);

  if (cargando) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            />
          ))}
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-500">{error ?? "Error desconocido"}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Sistema de Inventarios
      </h1>
      <p className="mt-1 text-gray-500">Dashboard general</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <TarjetaMetrica
          titulo="Proveedores"
          valor={String(data.cantidadProveedores)}
          icono={iconoProveedores}
          color="bg-indigo-50"
        />
        <TarjetaMetrica
          titulo="Productos"
          valor={String(data.cantidadProductos)}
          icono={iconoProductos}
          color="bg-emerald-50"
        />
        <TarjetaMetrica
          titulo="Precio promedio"
          valor={formatearMoneda(data.promedioPrecio)}
          icono={iconoPrecio}
          color="bg-amber-50"
        />
        <TarjetaMetrica
          titulo="Stock promedio"
          valor={String(data.promedioStock)}
          icono={iconoStock}
          color="bg-sky-50"
        />
        <TarjetaMetrica
          titulo="Producto con mayor precio"
          valor={data.productoMayorPrecio?.nombre ?? "-"}
          detalle={
            data.productoMayorPrecio
              ? formatearMoneda(Number(data.productoMayorPrecio.precio))
              : undefined
          }
          icono={iconoPrecio}
          color="bg-amber-50"
        />
        <TarjetaMetrica
          titulo="Producto con mayor stock"
          valor={data.productoMayorStock?.nombre ?? "-"}
          detalle={
            data.productoMayorStock
              ? `${data.productoMayorStock.stock} unidades`
              : undefined
          }
          icono={iconoStock}
          color="bg-sky-50"
        />
      </div>
    </main>
  );
}