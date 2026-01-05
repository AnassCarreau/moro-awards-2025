# Moro Awards 2025 🏆

Plataforma oficial de votación y premios para los **Moro Awards 2025**. Una aplicación web interactiva diseñada para gestionar todo el ciclo de vida del evento, desde las nominaciones hasta la gala en vivo.

## 🚀 Tecnologías

Este proyecto está construido con un stack moderno enfocado en rendimiento y experiencia de usuario:

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Google OAuth)
- **Estilos:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Testing:** [Playwright](https://playwright.dev/)
- **Despliegue:** Optimizado para [Netlify](https://www.netlify.com/)

## ✨ Características Principales

- **Sistema de Fases Automático:** Control temporal del evento (Nominaciones → Curación → Votación → Gala → Resultados) gestionado centralizadamente.
- **Votación Segura:** Autenticación mediante Google para garantizar un voto único por usuario.
- **Modo Gala en Vivo:** Interfaz inmersiva con revelación de ganadores en tiempo real.
- **Nominaciones Dinámicas:** Soporte para nominaciones por usuario, enlace o texto según la categoría.

## 🛠️ Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu máquina.

### 1. Prerrequisitos

- Node.js 18 o superior.
- Una cuenta y proyecto creado en Supabase.

### 2. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales:

```bash
NEXT_PUBLIC_SUPABASE_URL=tuh_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
3. Instalación
Instala las dependencias del proyecto:

Bash

npm install
4. Ejecución
Inicia el servidor de desarrollo:

Bash

npm run dev
Abre http://localhost:3000 en tu navegador para ver la aplicación.

🧪 Tests
Este proyecto utiliza Playwright para pruebas end-to-end (E2E).

Bash

# Ejecutar todos los tests
npx playwright test

# Ejecutar tests con interfaz gráfica
npx playwright test --ui
📂 Estructura del Proyecto
Plaintext

src/
├── app/                  # Rutas y páginas (App Router)
│   ├── api/              # Endpoints de API y Webhooks
│   ├── auth/             # Callbacks de autenticación
│   ├── gala/             # Vista del evento en vivo
│   ├── nominar/          # Flujo de nominaciones
│   └── votar/            # Flujo de votación
├── components/           # Componentes de React reutilizables
│   ├── ui/               # Componentes base (Botones, Inputs, Cards)
│   └── ...               # Componentes específicos (Gala, Votación)
├── lib/                  # Utilidades y lógica de negocio
│   ├── supabase/         # Cliente y Middleware de Supabase
│   └── phases.ts         # Máquina de estados de las fases del evento
└── types/                # Definiciones de tipos TypeScript (Database, Config)
🔒 Privacidad y OAuth
Este proyecto utiliza Google OAuth para la autenticación de usuarios.

La política de privacidad se encuentra disponible en https://morotw2025.netlify.app/privacy.

Solo se recopilan datos públicos para la validación única de votos y nominaciones.
```
