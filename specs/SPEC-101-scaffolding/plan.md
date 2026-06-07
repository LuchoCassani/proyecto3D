# Plan: SPEC-101 — Scaffolding Next.js + Supabase + Vercel + Cloudflare R2

## Architecture

Este spec establece la base técnica del proyecto. No hay lógica de negocio — el output es un proyecto Next.js funcional, conectado a servicios externos, con estructura correcta y configuración validada.

**Flujo de configuración (único flujo en esta spec):**
```
.env.local
    └─→ src/env.ts (Zod validation al arranque)
            ├─→ src/services/supabase/server.ts  (Server Components)
            ├─→ src/services/supabase/client.ts  (Client Components)
            └─→ src/services/r2/client.ts        (uploads/downloads de archivos)
```

Si falta una variable de entorno, `src/env.ts` lanza error antes de que cualquier request llegue al servidor. Esto impide que la app arranque con configuración rota.

**Integración con el resto del proyecto:**
- Los clientes en `src/services/` son singletons importados por los handlers (Serie 2xx) y las API Routes (Serie 3xx/4xx) — nadie instancia clientes directamente.
- La estructura de carpetas definida aquí es la base sobre la que se construyen todas las fases siguientes.

## Dependencies

| Paquete | Versión | Uso |
|---------|---------|-----|
| `next` | 14+ | Framework |
| `react`, `react-dom` | 18+ | UI runtime |
| `typescript` | 5+ | Tipado |
| `tailwindcss` | 3+ | Estilos |
| `@supabase/supabase-js` | latest | Supabase SDK base |
| `@supabase/ssr` | latest | Supabase para App Router (maneja cookies) |
| `@aws-sdk/client-s3` | 3+ | Cliente R2 (S3-compatible) |
| `zod` | 3+ | Validación de env vars |
| `vitest` | latest | Test runner |
| `@vitejs/plugin-react` | latest | Plugin de Vitest para React |

Todas están en la lista de dependencias aprobadas de `constitution.md`.

## Files Affected

### Setup del proyecto (via create-next-app + ajustes manuales)
```
package.json                          [create]
tsconfig.json                         [create]
tailwind.config.ts                    [create]
next.config.ts                        [create]
.gitignore                            [modify] — agregar .env.local
```

### Configuración de tests
```
vitest.config.ts                      [create]
```

### Documentación de entorno
```
.env.local.example                    [create]
```

### App base
```
src/app/layout.tsx                    [create]
src/app/page.tsx                      [create]
src/app/globals.css                   [create]
```

### Estructura de carpetas (placeholders para git)
```
src/components/ui/.gitkeep           [create]
src/components/features/.gitkeep     [create]
src/lib/.gitkeep                     [create]
src/handlers/.gitkeep                [create]
src/hooks/.gitkeep                   [create]
src/types/.gitkeep                   [create]
```

### Servicios externos
```
src/services/supabase/server.ts       [create]  — createServerClient para Server Components
src/services/supabase/client.ts       [create]  — createBrowserClient para Client Components
src/services/r2/client.ts            [create]  — S3Client apuntando a endpoint de R2
```

### Validación de entorno
```
src/env.ts                           [create]  — Zod schema + validación al arranque
```

### Tests
```
src/services/supabase/smoke.test.ts  [create]  — verifica instanciación sin errores
```

## Risks and Trade-offs

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| `@supabase/ssr` cambia su API entre versiones | Alto — rompe SPEC-104 (auth) si no se sigue la versión correcta | Fijar la versión exacta en package.json; documentar en SPEC-104 |
| `create-next-app` genera estructura diferente a la definida en constitution | Bajo — requiere ajuste manual | Ajustar manualmente post-generación |
| Vitest + Next.js App Router: los imports de `next/navigation` fallan en tests | Medio — el smoke test puede fallar por mocks faltantes | Configurar alias en vitest.config.ts para mockear `next/navigation` y `next/headers` |
| Variables de entorno requeridas en build time de Vercel | Medio — el deploy falla si no están configuradas en el dashboard | El `.env.local.example` lista todas las vars; la tarea de Vercel incluye configurarlas antes del primer deploy |

**Trade-off principal:** `@supabase/ssr` vs `@supabase/supabase-js` directo. La opción `ssr` es más opinionada pero maneja cookies automáticamente para auth — requisito de SPEC-104. El costo es una dependencia extra; el beneficio es no tener que reimplementar el manejo de sesión en el futuro.

## Decision

Ver `docs/adr/001-supabase-ssr-client-setup.md`
