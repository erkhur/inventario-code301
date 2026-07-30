import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const proveedores = await prisma.proveedor.findMany({
      orderBy: { nombre: "asc" },
      include: {
        _count: { select: { productos: true } },
      },
    });
    return NextResponse.json(proveedores);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener proveedores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, telefono } = body;

    if (!nombre || !email || !telefono) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const existe = await prisma.proveedor.findFirst({
      where: { email: email.trim() },
    });

    if (existe) {
      return NextResponse.json(
        { error: "Ya existe un proveedor con ese email" },
        { status: 409 }
      );
    }

    const proveedor = await prisma.proveedor.create({
      data: {
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
      },
    });

    return NextResponse.json(proveedor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear proveedor" },
      { status: 500 }
    );
  }
}