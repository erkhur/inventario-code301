"use client";

import { useEffect, useState } from "react";

interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  _count?: { productos: number };
}

const FORM_INICIAL = { nombre: "", email: "", telefono: "" };

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  async function cargarProveedores() {
    try {
      const res = await fetch("/api/proveedores");
      const data = await res.json();
      setProveedores(data);
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cargar proveedores" });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProveedores();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensaje(null);

    if (!form.nombre.trim() || !form.email.trim() || !form.telefono.trim()) {
      setMensaje({ tipo: "error", texto: "Todos los campos son obligatorios" });
      return;
    }

    try {
      const url = editandoId ? `/api/proveedores/${editandoId}` : "/api/proveedores";
      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error ?? "Error desconocido" });
        return;
      }

      setMensaje({
        tipo: "exito",
        texto: editandoId ? "Proveedor actualizado" : "Proveedor creado",
      });
      setForm(FORM_INICIAL);
      setEditandoId(null);
      cargarProveedores();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexion" });
    }
  }

  function handleEditar(proveedor: Proveedor) {
    setEditandoId(proveedor.id);
    setForm({
      nombre: proveedor.nombre,
      email: proveedor.email,
      telefono: proveedor.telefono,
    });
  }

  function handleCancelar() {
    setEditandoId(null);
    setForm(FORM_INICIAL);
  }

  async function handleEliminar(id: number) {
    if (!confirm("Seguro que queres eliminar este proveedor?")) return;

    try {
      const res = await fetch(`/api/proveedores/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error ?? "Error al eliminar" });
        return;
      }

      setMensaje({ tipo: "exito", texto: "Proveedor eliminado" });
      cargarProveedores();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexion" });
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
      <p className="mt-1 text-gray-500">Gestion de proveedores</p>

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
            placeholder="Ej: TechSupply"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="info@techsupply.com"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefono</label>
          <input
            type="text"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            placeholder="555-0101"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div className="flex gap-3 sm:col-span-3">
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
              <th className="px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 font-medium text-gray-500">Telefono</th>
              <th className="px-6 py-3 font-medium text-gray-500">Productos</th>
              <th className="px-6 py-3 font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : proveedores.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-gray-400">
                  No hay proveedores registrados
                </td>
              </tr>
            ) : (
              proveedores.map((proveedor) => (
                <tr key={proveedor.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-gray-500">{proveedor.id}</td>
                  <td className="px-6 py-4 text-gray-900">{proveedor.nombre}</td>
                  <td className="px-6 py-4 text-gray-500">{proveedor.email}</td>
                  <td className="px-6 py-4 text-gray-500">{proveedor.telefono}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {proveedor._count?.productos ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditar(proveedor)}
                      className="mr-3 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(proveedor.id)}
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