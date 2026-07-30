"use client";

import { useEffect, useState } from "react";

interface Categoria {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: string;
  stock: number;
  categoria: Categoria | null;
  proveedor: Proveedor | null;
}

const FORM_INICIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoriaId: "",
  proveedorId: "",
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  async function cargarDatos() {
    try {
      const [resProductos, resCategorias, resProveedores] = await Promise.all([
        fetch("/api/productos"),
        fetch("/api/categorias"),
        fetch("/api/proveedores"),
      ]);
      setProductos(await resProductos.json());
      setCategorias(await resCategorias.json());
      setProveedores(await resProveedores.json());
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cargar los datos" });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensaje(null);

    if (!form.nombre.trim()) {
      setMensaje({ tipo: "error", texto: "El nombre es obligatorio" });
      return;
    }

    if (!form.precio || Number(form.precio) <= 0) {
      setMensaje({ tipo: "error", texto: "El precio debe ser mayor a 0" });
      return;
    }

    try {
      const url = editandoId ? `/api/productos/${editandoId}` : "/api/productos";
      const method = editandoId ? "PUT" : "POST";

      const body = {
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        precio: Number(form.precio),
        stock: form.stock ? Number(form.stock) : 0,
        categoriaId: form.categoriaId ? Number(form.categoriaId) : null,
        proveedorId: form.proveedorId ? Number(form.proveedorId) : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error ?? "Error desconocido" });
        return;
      }

      setMensaje({
        tipo: "exito",
        texto: editandoId ? "Producto actualizado" : "Producto creado",
      });
      setForm(FORM_INICIAL);
      setEditandoId(null);
      cargarDatos();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexion" });
    }
  }

  function handleEditar(producto: Producto) {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: String(producto.precio),
      stock: String(producto.stock),
      categoriaId: producto.categoria ? String(producto.categoria.id) : "",
      proveedorId: producto.proveedor ? String(producto.proveedor.id) : "",
    });
  }

  function handleCancelar() {
    setEditandoId(null);
    setForm(FORM_INICIAL);
  }

  async function handleEliminar(id: number) {
    if (!confirm("Seguro que queres eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error ?? "Error al eliminar" });
        return;
      }

      setMensaje({ tipo: "exito", texto: "Producto eliminado" });
      cargarDatos();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexion" });
    }
  }

  function formatearMoneda(valor: string) {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(valor));
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
      <p className="mt-1 text-gray-500">Gestion de productos del inventario</p>

      {mensaje && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            mensaje.tipo === "exito"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-3"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej: Laptop HP"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            step="0.01"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            placeholder="1200"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="15"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Descripcion</label>
          <input
            type="text"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="Opcional"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoria</label>
          <select
            value={form.categoriaId}
            onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="">Sin categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Proveedor</label>
          <select
            value={form.proveedorId}
            onChange={(e) => setForm({ ...form, proveedorId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="">Sin proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            {editandoId ? "Actualizar" : "Crear"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={handleCancelar}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 font-medium text-gray-500">Nombre</th>
              <th className="px-6 py-3 font-medium text-gray-500">Precio</th>
              <th className="px-6 py-3 font-medium text-gray-500">Stock</th>
              <th className="px-6 py-3 font-medium text-gray-500">Categoria</th>
              <th className="px-6 py-3 font-medium text-gray-500">Proveedor</th>
              <th className="px-6 py-3 font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-gray-400">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-gray-500">{producto.id}</td>
                  <td className="px-6 py-4 text-gray-900">{producto.nombre}</td>
                  <td className="px-6 py-4 text-gray-500">{formatearMoneda(producto.precio)}</td>
                  <td className="px-6 py-4 text-gray-500">{producto.stock}</td>
                  <td className="px-6 py-4 text-gray-500">{producto.categoria?.nombre ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-500">{producto.proveedor?.nombre ?? "-"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditar(producto)}
                      className="mr-3 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(producto.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}