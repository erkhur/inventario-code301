"use client";

import { useEffect, useState } from "react";

interface Categoria {
  id: number;
  nombre: string;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  async function cargarCategorias() {
    try {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cargar categorias" });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensaje(null);

    if (!nombre.trim()) {
      setMensaje({ tipo: "error", texto: "El nombre es obligatorio" });
      return;
    }

    try {
      const url = editandoId ? `/api/categorias/${editandoId}` : "/api/categorias";
      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error ?? "Error desconocido" });
        return;
      }

      setMensaje({
        tipo: "exito",
        texto: editandoId ? "Categoria actualizada" : "Categoria creada",
      });
      setNombre("");
      setEditandoId(null);
      cargarCategorias();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexion" });
    }
  }

  function handleEditar(categoria: Categoria) {
    setEditandoId(categoria.id);
    setNombre(categoria.nombre);
  }

  function handleCancelar() {
    setEditandoId(null);
    setNombre("");
  }

  async function handleEliminar(id: number) {
    if (!confirm("Seguro que queres eliminar esta categoria?")) return;

    try {
      const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error ?? "Error al eliminar" });
        return;
      }

      setMensaje({ tipo: "exito", texto: "Categoria eliminada" });
      cargarCategorias();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexion" });
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
      <p className="mt-1 text-gray-500">Gestion de categorias de productos</p>

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
        className="mt-6 flex items-end gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Electronica"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
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
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 font-medium text-gray-500">Nombre</th>
              <th className="px-6 py-3 font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-gray-400">
                  No hay categorias registradas
                </td>
              </tr>
            ) : (
              categorias.map((categoria) => (
                <tr key={categoria.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-gray-500">{categoria.id}</td>
                  <td className="px-6 py-4 text-gray-900">{categoria.nombre}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditar(categoria)}
                      className="mr-3 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(categoria.id)}
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