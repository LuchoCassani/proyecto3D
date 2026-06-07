# ADR-001: Uso de @supabase/ssr para clientes Supabase en Next.js App Router

**Date**: 2026-06-03  
**Status**: Accepted  
**Feature**: SPEC-101-scaffolding

## Context

El proyecto usa Next.js con App Router, que divide el código en Server Components (corren en el servidor, tienen acceso a cookies HTTP) y Client Components (corren en el browser). Supabase requiere acceso a cookies para manejar sesiones de auth.

Existen dos formas de instanciar el cliente Supabase en Next.js:

1. `@supabase/supabase-js` directamente con `createClient` — biblioteca base, no sabe nada de cookies ni de App Router.
2. `@supabase/ssr` con `createServerClient` y `createBrowserClient` — wrapper oficial diseñado específicamente para frameworks SSR (Next.js App Router, SvelteKit, etc.).

## Alternatives Considered

**Opción A: `@supabase/supabase-js` directo**
- Pro: una sola dependencia, API más simple.
- Con: no maneja cookies automáticamente. Para auth (SPEC-104) habría que implementar manualmente la lectura/escritura de cookies en cada Server Component y Route Handler. Alta probabilidad de bugs de sesión.
- Incompatible con SPEC-104 sin trabajo extra significativo.

**Opción B: `@supabase/ssr`** ← elegida
- Pro: maneja cookies automáticamente para Server Components, Client Components y Route Handlers. Documentación oficial de Supabase para Next.js App Router. Prerequisito para auth sin fricción en SPEC-104.
- Con: dependencia adicional. La API es ligeramente más verbosa (`createServerClient` requiere pasar el cookieStore de `next/headers`).
- Alineada con la constitution: `@supabase/ssr` está en la lista de dependencias aprobadas.

## Decision

Se usa `@supabase/ssr` con dos clientes separados:
- `src/services/supabase/server.ts` — usa `createServerClient` con cookies de `next/headers`. Solo importable desde Server Components y Route Handlers.
- `src/services/supabase/client.ts` — usa `createBrowserClient`. Solo importable desde Client Components.

Esta separación es explícita por diseño: TypeScript detecta en compilación si se importa el cliente equivocado (EC-004 de la spec).

## Consequences

**Positivo:**
- SPEC-104 (auth) puede implementarse directamente sobre este setup sin refactorizar.
- El manejo de sesión es correcto por defecto — no hay surface de error en cookies.
- Alineado con la documentación oficial y el stack aprobado en constitution.

**Negativo:**
- La versión de `@supabase/ssr` debe mantenerse sincronizada con `@supabase/supabase-js`. Un upgrade descuidado puede romper el setup de cookies.
- Los tests que importan `server.ts` necesitan mockear `next/headers` (disponible solo en runtime de Next.js, no en Vitest por defecto).
