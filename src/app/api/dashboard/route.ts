import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      cantidadProveedores,
      cantidadProductos,
      avgPrecio,
      avgStock,
      productoMayorPrecio,
      productoMayorStock,
    ] = await Promise.all([
      prisma.proveedor.count(),
      prisma.producto.count(),
      prisma.producto.aggregate({ _avg: { precio: true } }),
      prisma.producto.aggregate({ _avg: { stock: true } }),
      prisma.producto.findFirst({ orderBy: { precio: "desc" } }),
      prisma.producto.findFirst({ orderBy: { stock: "desc" } }),
    ]);

    return NextResponse.json({
      cantidadProveedores,
      cantidadProductos,
      promedioPrecio: Number(avgPrecio._avg.precio ?? 0),
      promedioStock: Math.round(avgStock._avg.stock ?? 0),
      productoMayorPrecio,
      productoMayorStock,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener metricas" },
      { status: 500 }
    );
  }
}