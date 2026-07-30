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

function TarjetaMetrica({
  titulo,
  valor,
  detalle,
}: {
  titulo: string;
  valor: string;
  detalle?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{titulo}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{valor}</p>
      {detalle && <p className="mt-1 text-sm text-gray-400">{detalle}</p>}
    </div>
  );
}

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
      } catch (err) {
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
        <p className="text-gray-500">Cargando metricas...</p>
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
        />
        <TarjetaMetrica
          titulo="Productos"
          valor={String(data.cantidadProductos)}
        />
        <TarjetaMetrica
          titulo="Precio promedio"
          valor={formatearMoneda(data.promedioPrecio)}
        />
        <TarjetaMetrica
          titulo="Stock promedio"
          valor={String(data.promedioStock)}
        />
        <TarjetaMetrica
          titulo="Producto con mayor precio"
          valor={data.productoMayorPrecio?.nombre ?? "-"}
          detalle={
            data.productoMayorPrecio
              ? formatearMoneda(Number(data.productoMayorPrecio.precio))
              : undefined
          }
        />
        <TarjetaMetrica
          titulo="Producto con mayor stock"
          valor={data.productoMayorStock?.nombre ?? "-"}
          detalle={
            data.productoMayorStock
              ? `${data.productoMayorStock.stock} unidades`
              : undefined
          }
        />
      </div>
    </main>
  );
}