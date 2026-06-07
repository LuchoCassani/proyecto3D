# SPEC-101 — Scaffolding: Next.js + Supabase + Vercel + Cloudflare R2

**Estado:** specified  
**Fase:** 1 — Infraestructura  
**Estimación:** 4hs  
**Fecha de creación:** 2026-06-03

---

## 1. Contexto

El proyecto Dryada 3D necesita una base técnica sobre la que construir todas las fases siguientes. Sin este scaffolding no hay nada: ningún handler de backend, ninguna página de frontend, ningún flujo de pagos puede existir sin que la infraestructura base esté configurada y funcionando.

Esta spec cubre únicamente la configuración inicial del proyecto — no incluye ninguna feature de negocio.

---

## 2. Objetivo

Tener un repositorio Next.js funcional, conectado a Supabase y desplegado en Vercel, con la estructura de carpetas definida en `constitution.md`, las variables de entorno validadas al arranque, y la conexión a Cloudflare R2 configurada y testeada.

---

## 3. No-Goals

- No incluye esquema de base de datos (eso es SPEC-103)
- No incluye autenticación (eso es SPEC-104)
- No incluye ningún componente de UI ni design system (eso es SPEC-102)
- No incluye ningún handler de eventos (Serie 2xx)
- No incluye configuración de Twilio, Resend, MercadoPago ni Anthropic SDK

---

## 4. Functional Requirements

| ID | Requisito |
|----|-----------|
| FR-001 | El proyecto se inicializa con `create-next-app` usando TypeScript, Tailwind CSS y App Router |
| FR-002 | La estructura de carpetas respeta exactamente lo definido en `constitution.md`: `src/app/`, `src/components/ui/`, `src/components/features/`, `src/lib/`, `src/handlers/`, `src/hooks/`, `src/types/`, `src/services/` |
| FR-003 | Existe un cliente Supabase para uso en Server Components (`src/services/supabase/server.ts`) y otro para Client Components (`src/services/supabase/client.ts`) |
| FR-004 | Existe un cliente S3-compatible para Cloudflare R2 (`src/services/r2/client.ts`) que puede subir y descargar objetos |
| FR-005 | Las variables de entorno requeridas son validadas con Zod al arranque de la aplicación; si falta alguna, el proceso falla con un mensaje claro |
| FR-006 | El proyecto se despliega correctamente en Vercel desde la rama `main` |
| FR-007 | El archivo `.env.local.example` documenta todas las variables de entorno requeridas con descripción de cada una |
| FR-008 | El proyecto tiene `vitest` configurado y un test de smoke que verifica que el cliente Supabase se puede instanciar sin errores |

---

## 5. Non-Functional Requirements

| ID | Requisito |
|----|-----------|
| NFR-001 | `next build` debe completar sin errores ni warnings de TypeScript |
| NFR-002 | La validación de variables de entorno ocurre antes de que cualquier request sea procesada (en módulo cargado en el inicio, no lazy) |
| NFR-003 | Los clientes de Supabase y R2 son singletons — no se instancian múltiples veces por request |

---

## 6. Journeys aplicables

Esta spec no tiene journeys de usuario final — es infraestructura interna.

---

## 7. Out of Scope

Ver Sección 3 (No-Goals).

---

## 8. Data Models

No aplica en esta spec — no se define esquema de base de datos ni entidades de dominio. Eso corresponde a SPEC-103.

---

## 9. API Contracts

No aplica en esta spec — no se definen endpoints de API. Las rutas de API se definen en las specs de cada handler (Serie 2xx).

---

## 10. Edge Cases

| ID | Escenario | Comportamiento esperado |
|----|-----------|------------------------|
| EC-001 | Una variable de entorno requerida está ausente en el `.env.local` | La aplicación no arranca. El proceso termina con error y lista las variables faltantes |
| EC-002 | La URL de Supabase es inválida (mal formateada, no es una URL) | Zod rechaza la variable en la validación al arranque; la aplicación no arranca |
| EC-003 | Las credenciales de Cloudflare R2 son incorrectas | El cliente se instancia sin error (las credenciales se validan en el primer request, no en la construcción del cliente) |
| EC-004 | Se llama al cliente Supabase server-side desde un Client Component | TypeScript detecta el error en tiempo de compilación gracias a los tipos de `@supabase/ssr` |

---

## 11. Open Questions

| ID | Pregunta | Propietario | Deadline |
|----|----------|-------------|----------|
| OQ-001 | ¿Cuál es el nombre de la organización/equipo en Vercel donde se despliega el proyecto? | Lucho | Antes de SPEC-101 |
| OQ-002 | ¿El bucket de R2 ya existe o lo creamos como parte de esta spec? | Lucho | Antes de SPEC-101 |
| OQ-003 | ¿El proyecto de Supabase ya existe o lo creamos como parte de esta spec? | Lucho | Antes de SPEC-101 |

---

## 12. Criterios de Aceptación

**Given** que el repositorio fue clonado en una máquina nueva  
**When** se copia `.env.local.example` a `.env.local` con valores válidos y se corre `npm run dev`  
**Then** la aplicación inicia sin errores, el cliente Supabase responde, y la página raíz carga en el browser

**Given** que falta la variable `NEXT_PUBLIC_SUPABASE_URL` en `.env.local`  
**When** se corre `npm run dev`  
**Then** el proceso termina con un mensaje que indica exactamente qué variable falta

**Given** que el código está en la rama `main`  
**When** se hace push a `main`  
**Then** Vercel despliega automáticamente y el build completa sin errores

**Given** que se corre `npm run test`  
**Then** el test de smoke pasa: el cliente Supabase se instancia sin lanzar excepciones

---

## 13. Clarifications

### C-5: ¿El repositorio de GitHub ya existe?
**Type:** assumption  
**Q:** ¿Ya tenés el repositorio de GitHub creado, o lo creamos como parte de SPEC-101?  
**A:** Hay que crearlo. La spec incluye crear el repo en GitHub y hacer el primer push.

### C-4: Comportamiento del cliente R2 ante credenciales incorrectas
**Type:** edge case  
**Q:** ¿Qué debe pasar cuando el primer request a R2 falla por credenciales incorrectas?  
**A:** Lanzar excepción y loguear el error. El error se propaga al handler que llamó a R2, que es responsable de manejarlo. El cliente R2 no absorbe errores silenciosamente.

### C-3: ¿La cuenta de Vercel ya existe?
**Type:** assumption  
**Q:** ¿Tenés cuenta de Vercel donde deployar, o necesitamos crear una como parte del setup?  
**A:** Cuenta existente. La spec incluye conectar el repositorio a Vercel y configurar las variables de entorno en el dashboard.

### C-2: ¿El proyecto de Supabase ya existe o lo creamos en esta spec?
**Type:** assumption  
**Q:** ¿El proyecto de Supabase ya existe, o lo creamos como parte de esta spec?  
**A:** Lo creamos como parte de esta spec.  
**Pattern tip:** Igual que con R2 — cualquier servicio externo que necesita ser provisionado debe estar explícito en el scope de la spec.

### C-1: ¿El bucket de R2 ya existe o lo creamos en esta spec?
**Type:** assumption  
**Q:** ¿El bucket de Cloudflare R2 ya existe, o lo creamos como parte de esta spec?  
**A:** Lo creamos como parte de esta spec.  
**Pattern tip:** Cuando una spec depende de recursos externos (buckets, proyectos cloud, bases de datos), siempre especificá si el recurso ya existe o si su creación es parte del scope. Esto cambia la estimación de tiempo y los pasos de setup.
