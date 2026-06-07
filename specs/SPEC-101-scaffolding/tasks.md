# Tasks: SPEC-101 — Scaffolding Next.js + Supabase + Vercel + Cloudflare R2

**Feature**: SPEC-101-scaffolding  
**Plan**: specs/SPEC-101-scaffolding/plan.md  
**Generated**: 2026-06-03

---

## TASK-001: Inicializar proyecto Next.js con create-next-app

**Status**: completed  
**Requirements**: FR-001  
**Complexity**: S  
**Depends on**: none  
**Files**: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

### Description
Correr `create-next-app` con las opciones: TypeScript, Tailwind CSS, App Router, sin `src/` directory prompts (usamos `src/` manualmente), sin `import alias` customizado. El resultado es un proyecto Next.js funcional que levanta con `npm run dev` sin errores.

### Validation
`npm run dev` arranca sin errores y la página raíz carga en `localhost:3000`.

---

## TASK-002: Ajustar estructura de carpetas según constitution

**Status**: completed  
**Requirements**: FR-002  
**Complexity**: S  
**Depends on**: TASK-001  
**Files**: `src/components/ui/.gitkeep`, `src/components/features/.gitkeep`, `src/lib/.gitkeep`, `src/handlers/.gitkeep`, `src/hooks/.gitkeep`, `src/types/.gitkeep`, `src/services/.gitkeep`

### Description
Crear las carpetas definidas en `constitution.md` que `create-next-app` no genera automáticamente: `src/components/ui/`, `src/components/features/`, `src/lib/`, `src/handlers/`, `src/hooks/`, `src/types/`, `src/services/`. Cada carpeta vacía lleva un `.gitkeep` para que git las trackee.

### Validation
Todas las carpetas existen en el repositorio. `git status` no muestra carpetas faltantes respecto a la estructura de `constitution.md`.

---

## TASK-003: Crear proyecto en Supabase

**Status**: pending  
**Requirements**: FR-003  
**Complexity**: S  
**Depends on**: none  
**Files**: `.env.local` (solo en local — no commiteado)

### Description
Tarea de setup externo (no código). Ir a supabase.com, crear un nuevo proyecto, copiar `Project URL` y `anon public key` desde Settings → API. Guardarlos en `.env.local` como `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Validation
Las dos variables están en `.env.local` con valores reales de Supabase. El dashboard de Supabase muestra el proyecto activo.

---

## TASK-004: Crear bucket en Cloudflare R2

**Status**: pending  
**Requirements**: FR-004  
**Complexity**: S  
**Depends on**: none  
**Files**: `.env.local` (solo en local — no commiteado)

### Description
Tarea de setup externo (no código). En el dashboard de Cloudflare: crear un bucket R2 (nombre sugerido: `dryada-assets`), ir a R2 → Manage R2 API Tokens, crear un token con permisos `Object Read & Write`, copiar `Account ID`, `Access Key ID` y `Secret Access Key`. Guardarlos en `.env.local` como `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`.

### Validation
Las cuatro variables R2 están en `.env.local` con valores reales. El bucket aparece en el dashboard de Cloudflare R2.

---

## TASK-005: Crear repositorio GitHub y hacer push inicial

**Status**: pending  
**Requirements**: FR-006  
**Complexity**: S  
**Depends on**: TASK-001, TASK-002  
**Files**: `.gitignore`

### Description
Crear un repositorio privado en GitHub (nombre sugerido: `dryada-web`). Verificar que `.gitignore` incluye `.env.local` y `node_modules/`. Hacer `git init`, commit inicial con todo el scaffolding, y push a `main`.

### Validation
El repositorio existe en GitHub, tiene commits, y `.env.local` no aparece en ningún commit (verificar con `git log --all -- .env.local`).

---

## TASK-006: Implementar validación de variables de entorno con Zod

**Status**: completed  
**Requirements**: FR-005, FR-007, NFR-002, EC-001, EC-002  
**Complexity**: M  
**Depends on**: TASK-001  
**Files**: `src/env.ts`, `.env.local.example`

### Description
Crear `src/env.ts` con un schema Zod que valide todas las variables de entorno requeridas (Supabase URL + anon key, R2 credentials × 4). El módulo debe validar al ser importado — no lazy. Si falta alguna variable o tiene formato inválido (ej: URL mal formateada), lanzar un error con la lista exacta de variables problemáticas. Crear `.env.local.example` documentando cada variable con descripción de su uso y de dónde obtenerla.

### Validation
1. Con `.env.local` completo: `npm run dev` arranca sin errores.
2. Con una variable comentada en `.env.local`: el proceso termina con mensaje que nombra la variable faltante.
3. Con `NEXT_PUBLIC_SUPABASE_URL=not-a-url`: Zod rechaza y el proceso no arranca.

---

## TASK-007: Implementar cliente Supabase server-side

**Status**: pending  
**Requirements**: FR-003, NFR-003, EC-004  
**Complexity**: M  
**Depends on**: TASK-003, TASK-006  
**Files**: `src/services/supabase/server.ts`

### Description
Crear `src/services/supabase/server.ts` usando `createServerClient` de `@supabase/ssr`. El cliente lee cookies del request usando `cookies()` de `next/headers`. Solo importable desde Server Components y Route Handlers — no desde archivos con `'use client'`. El patrón singleton se logra exportando una función `createClient()` (no una instancia global, ya que cada request tiene su propio cookie store).

### Validation
1. El archivo exporta una función `createClient()`.
2. TypeScript compila sin errores (`npx tsc --noEmit`).
3. Importar el archivo desde un Client Component marcado con `'use client'` genera error de compilación TypeScript.

---

## TASK-008: Implementar cliente Supabase browser-side

**Status**: pending  
**Requirements**: FR-003, NFR-003, EC-004  
**Complexity**: S  
**Depends on**: TASK-003, TASK-006  
**Files**: `src/services/supabase/client.ts`

### Description
Crear `src/services/supabase/client.ts` usando `createBrowserClient` de `@supabase/ssr`. Exportar una función `createClient()`. A diferencia del server client, este se puede usar en Client Components. El singleton pattern se mantiene usando `useMemo` en los componentes que lo consuman (documentar esto en el archivo).

### Validation
El archivo exporta `createClient()`. TypeScript compila sin errores. El cliente puede ser importado desde un archivo con `'use client'` sin errores de compilación.

---

## TASK-009: Implementar cliente Cloudflare R2

**Status**: pending  
**Requirements**: FR-004, NFR-003, EC-003, C-4  
**Complexity**: M  
**Depends on**: TASK-004, TASK-006  
**Files**: `src/services/r2/client.ts`

### Description
Crear `src/services/r2/client.ts` con un `S3Client` de `@aws-sdk/client-s3` apuntando al endpoint de R2: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`. Exportar el cliente como singleton (`r2Client`) y dos funciones helper: `uploadFile(key, body, contentType)` y `getFileUrl(key)`. Si un request a R2 falla (EC-003), el cliente debe lanzar la excepción original (no absorberla) para que el handler que lo llama pueda loguearla y manejarla.

### Validation
1. El archivo exporta `r2Client`, `uploadFile`, y `getFileUrl`.
2. TypeScript compila sin errores.
3. Con credenciales correctas en `.env.local`, se puede subir y recuperar un archivo de prueba al bucket.

---

## TASK-010: Configurar Vitest con mocks para Next.js

**Status**: completed  
**Requirements**: FR-008  
**Complexity**: S  
**Depends on**: TASK-001  
**Files**: `vitest.config.ts`

### Description
Crear `vitest.config.ts` con el plugin de React y configuración de jsdom. Agregar aliases para mockear los módulos de Next.js que no funcionan fuera del runtime de Next.js: `next/headers` (usado por `server.ts`) y `next/navigation`. Sin estos mocks, el smoke test falla aunque el código esté correcto. Agregar el script `"test": "vitest"` en `package.json`.

### Validation
`npm run test` ejecuta sin errores de importación de módulos de Next.js. El comando termina (aunque sea sin tests todavía).

---

## TASK-011: Escribir smoke test del cliente Supabase

**Status**: pending  
**Requirements**: FR-008  
**Complexity**: S  
**Depends on**: TASK-007, TASK-008, TASK-010  
**Files**: `src/services/supabase/smoke.test.ts`

### Description
Crear `src/services/supabase/smoke.test.ts` con un test que verifica que `createClient()` del browser client se puede instanciar sin lanzar excepciones. No hace requests reales a Supabase — solo verifica que el cliente se construye correctamente con las variables de entorno mockeadas.

### Validation
`npm run test` pasa. El output muestra `1 test passed` para el smoke test.

---

## TASK-012: Conectar repositorio a Vercel y configurar deploy

**Status**: pending  
**Requirements**: FR-006  
**Complexity**: S  
**Depends on**: TASK-005, TASK-006, TASK-007, TASK-008, TASK-009  
**Files**: ninguno (configuración en dashboard de Vercel)

### Description
Tarea de setup externo (no código). En vercel.com, importar el repositorio GitHub `dryada-web`. Configurar todas las variables de entorno en Vercel (las mismas que en `.env.local`, usando los valores reales de Supabase y R2). Hacer un push a `main` para disparar el primer deploy automático.

### Validation
El dashboard de Vercel muestra el deploy como exitoso (verde). La URL pública de Vercel carga la página raíz sin errores.

---

## TASK-013: Verificar build y tests completos

**Status**: pending  
**Requirements**: NFR-001, FR-008  
**Complexity**: S  
**Depends on**: TASK-011, TASK-012  
**Files**: ninguno

### Description
Verificación final. Correr `npx tsc --noEmit` para confirmar zero TypeScript errors, `npm run build` para confirmar que el build de producción completa sin warnings, y `npm run test` para confirmar que el smoke test pasa. Si alguno de los tres falla, corresponde a la tarea que generó el problema, no a esta.

### Validation
Los tres comandos terminan con exit code 0: `npx tsc --noEmit`, `npm run build`, `npm run test`.
