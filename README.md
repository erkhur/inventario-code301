Inventario Code301

Sistema de gestión de inventarios con dashboard, autenticación y panel administrativo. Proyecto full-stack construido con Next.js 16, Prisma 7 y PostgreSQL (Neon).

Developed & Built by Coderk.

Características
Dashboard con métricas en tiempo real (proveedores, productos, precios y stock promedio)
CRUD completo de Categorías, Proveedores y Productos, con relaciones entre ellos
Autenticación con GitHub OAuth (NextAuth)
API REST documentada, probada con Postman
Notificaciones toast y modales de confirmación
Interfaz responsive construida con Tailwind CSS
Stack
Capa	Tecnología
Framework	Next.js 16 (App Router)
Lenguaje	TypeScript
Estilos	Tailwind CSS 4
Base de datos	PostgreSQL (Neon)
ORM	Prisma 7
Autenticación	NextAuth v4 (GitHub OAuth)
Requisitos previos
Node.js 20+
Una base de datos PostgreSQL (por ejemplo, un proyecto gratuito en Neon)
Una OAuth App de GitHub (github.com/settings/developers)

Abrí http://localhost:3000 — vas a ser redirigido a /login hasta iniciar sesión con GitHub.

Modelo de datos
Categoria 1───* Producto *───1 Proveedor

Un producto pertenece opcionalmente a una categoría y a un proveedor. Si se elimina una categoría o proveedor, el producto queda sin esa referencia (SET NULL).

API
Recurso	Endpoint	Métodos
Categorías	/api/categorias, /api/categorias/:id	GET, POST, PUT, DELETE
Proveedores	/api/proveedores, /api/proveedores/:id	GET, POST, PUT, DELETE
Productos	/api/productos, /api/productos/:id	GET, POST, PUT, DELETE
Dashboard	/api/dashboard	GET
Estructura del proyecto
src/
├── app/
│   ├── (admin)/        # Dashboard y módulos, protegidos por sesión
│   ├── login/          # Página de inicio de sesión
│   └── api/            # Endpoints REST + NextAuth
├── components/         # Sidebar, Footer, ToastProvider, ConfirmModal
└── lib/                # Cliente de Prisma y configuración de NextAuth
prisma/
└── schema.prisma

Roadmap
 Tabla de usuarios propia vía Prisma Adapter (roles y permisos)
 Login con Github
 Filtros y paginación en las tablas
Licencia

Proyecto educativo desarrollado como parte del bootcamp Code 301 (Professional Fullstack).

Desarrollado y creado por Coderk