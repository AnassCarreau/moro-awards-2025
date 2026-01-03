# Moro Awards 2025

Plataforma de votación y premios para los Moro Awards 2025. Construida con tecnologías web modernas para ofrecer una experiencia rápida, interactiva y segura.

## 🚀 Tecnologías

Este proyecto utiliza el siguiente stack tecnológico:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Testing:** [Playwright](https://playwright.dev/)

## ✨ Características Principales

- **Sistema de Votación:** Interfaz segura para que los usuarios voten por sus favoritos.
- **Nominaciones:** Módulo para gestionar y visualizar nominados.
- **Panel de Administración:**
  - Configuración general del evento.
  - Curación de contenido.
  - Control en tiempo real de la Gala.
- **Gala en Vivo:** Vista dedicada para el evento en vivo.
- **Resultados:** Visualización de ganadores y estadísticas.
- **Gestión de Fases:** Control de las etapas del evento (Nominación, Votación, Resultados, etc.).

## 🛠️ Configuración Local

### Prerrequisitos

- Node.js 18+
- npm, pnpm o yarn

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las credenciales de tu proyecto en Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📂 Estructura del Proyecto

```
src/
├── app/                  # Rutas y páginas (App Router)
│   ├── admin/            # Panel de administración
│   ├── api/              # Endpoints API
│   ├── auth/             # Autenticación
│   ├── votar/            # Página de votación
│   ├── gala/             # Página de la gala
│   └── ...
├── components/           # Componentes reutilizables
│   ├── ui/               # Componentes base (botones, inputs, etc.)
│   ├── auth/             # Componentes de autenticación
│   └── ...
├── lib/                  # Utilidades y lógica de negocio
│   ├── supabase/         # Cliente y utilidades de Supabase
│   └── phases.ts         # Gestión de fases del evento
└── types/                # Definiciones de tipos TypeScript
```

## 🧪 Tests

Para ejecutar las pruebas end-to-end con Playwright:

```bash
npx playwright test
```