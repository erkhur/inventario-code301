import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get("categoriaId");

    const where: { categoriaId?: number } = {};
    if (categoriaId) {
      where.categoriaId = Number(categoriaId);
    }

    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: true,
        proveedor: true,
      },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, descripcion, precio, stock, categoriaId, proveedorId } = body;

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (precio === undefined || precio <= 0) {
      return NextResponse.json(
        { error: "El precio debe ser mayor a 0" },
        { status: 400 }
      );
    }

    if (stock !== undefined && stock < 0) {
      return NextResponse.json(
        { error: "El stock no puede ser negativo" },
        { status: 400 }
      );
    }

    if (categoriaId) {
      const cat = await prisma.categoria.findUnique({
        where: { id: Number(categoriaId) },
      });
      if (!cat) {
        return NextResponse.json(
          { error: "Categoria no encontrada" },
          { status: 404 }
        );
      }
    }

    if (proveedorId) {
      const prov = await prisma.proveedor.findUnique({
        where: { id: Number(proveedorId) },
      });
      if (!prov) {
        return NextResponse.json(
          { error: "Proveedor no encontrado" },
          { status: 404 }
        );
      }
    }

    const producto = await prisma.producto.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        precio,
        stock: stock ?? 0,
        categoriaId: categoriaId ? Number(categoriaId) : null,
        proveedorId: proveedorId ? Number(proveedorId) : null,
      },
      include: {
        categoria: true,
        proveedor: true,
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}