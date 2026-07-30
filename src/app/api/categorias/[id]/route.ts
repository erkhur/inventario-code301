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
    const { nombre } = body;

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const categoria = await prisma.categoria.update({
      where: { id: Number(id) },
      data: { nombre: nombre.trim() },
    });

    return NextResponse.json(categoria);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Categoria no encontrada" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Error al actualizar categoria" },
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

    await prisma.categoria.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Categoria eliminada" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Categoria no encontrada" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Error al eliminar categoria" },
      { status: 500 }
    );
  }
}