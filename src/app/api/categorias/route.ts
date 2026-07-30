import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener categorias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre } = body;

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const existe = await prisma.categoria.findFirst({
      where: { nombre: nombre.trim() },
    });

    if (existe) {
      return NextResponse.json(
        { error: "Ya existe una categoria con ese nombre" },
        { status: 409 }
      );
    }

    const categoria = await prisma.categoria.create({
      data: { nombre: nombre.trim() },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear categoria" },
      { status: 500 }
    );
  }
}