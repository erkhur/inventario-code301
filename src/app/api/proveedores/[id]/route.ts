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
    const { nombre, email, telefono } = body;

    const data: { nombre?: string; email?: string; telefono?: string } = {};
    if (nombre) data.nombre = nombre.trim();
    if (email) data.email = email.trim();
    if (telefono) data.telefono = telefono.trim();

    const proveedor = await prisma.proveedor.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(proveedor);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Proveedor no encontrado" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Error al actualizar proveedor" },
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

    const productos = await prisma.producto.findMany({
      where: { proveedorId: Number(id) },
    });

    if (productos.length > 0) {
      return NextResponse.json(
        {
          error: "No se puede eliminar: tiene productos asociados",
          productos: productos.length,
        },
        { status: 409 }
      );
    }

    await prisma.proveedor.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Proveedor eliminado" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Proveedor no encontrado" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Error al eliminar proveedor" },
      { status: 500 }
    );
  }
}