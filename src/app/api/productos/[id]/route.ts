import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, descripcion, precio, stock, categoriaId, proveedorId } = body;

    const data: Record<string, unknown> = {};

    if (nombre !== undefined) {
      if (nombre.trim() === "") {
        return NextResponse.json(
          { error: "El nombre no puede estar vacio" },
          { status: 400 }
        );
      }
      data.nombre = nombre.trim();
    }

    if (descripcion !== undefined) data.descripcion = descripcion?.trim() || null;

    if (precio !== undefined) {
      if (precio <= 0) {
        return NextResponse.json(
          { error: "El precio debe ser mayor a 0" },
          { status: 400 }
        );
      }
      data.precio = precio;
    }

    if (stock !== undefined) {
      if (stock < 0) {
        return NextResponse.json(
          { error: "El stock no puede ser negativo" },
          { status: 400 }
        );
      }
      data.stock = stock;
    }

    if (categoriaId !== undefined) {
      if (categoriaId !== null) {
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
      data.categoriaId = categoriaId ? Number(categoriaId) : null;
    }

    if (proveedorId !== undefined) {
      if (proveedorId !== null) {
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
      data.proveedorId = proveedorId ? Number(proveedorId) : null;
    }

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data,
      include: {
        categoria: true,
        proveedor: true,
      },
    });

    return NextResponse.json(producto);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.producto.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}