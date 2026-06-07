# Dryada 3D — Plataforma Web

E-commerce para venta de figuras escultóricas 3D personalizadas, impresas bajo demanda.

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend + Backend | Next.js + TypeScript + Tailwind CSS |
| Hosting | Vercel |
| Base de datos | PostgreSQL en Supabase + pg_cron |
| Event bus | Supabase Realtime |
| Archivos STL / fotos | Cloudflare R2 |
| Visor 3D | react-three-fiber (Three.js) |
| Pagos | MercadoPago |
| WhatsApp | Twilio (WhatsApp Business API) |
| Email | Resend |
| Auth panel interno | Supabase Auth — magic link + TOTP |
| IA | Anthropic SDK — Claude Haiku |

## SDD Workflow

Este proyecto usa Specification-Driven Development. Todas las features siguen este ciclo:

1. `/sdd:specify` — Escribir spec a partir de una descripción de feature
2. `/sdd:clarify` — Identificar y resolver gaps en la spec
3. `/sdd:plan` — Diseñar el enfoque técnico + generar ADR
4. `/sdd:tasks` — Descomponer el plan en tareas atómicas y testeables
5. `/sdd:implement TASK-NNN` — Implementar una tarea a la vez
6. `/sdd:validate` — Verificar que la implementación cumple la spec

El estado se trackea en `.sdd/state.json`. Correr `/sdd:status` para un resumen rápido.

Para principios y no-negociables del proyecto, ver `constitution.md`. **En caso de conflicto entre este archivo y constitution.md, constitution.md tiene precedencia.**

## Key Commands

- `/sdd:status` — Estado actual del proyecto y progreso
- `/sdd:constitution` — Ver o editar principios del proyecto
- `/sdd:init` — Re-inicializar (usar con cuidado)

## Rules

1. Nunca implementar sin spec. Si no hay spec, correr `/sdd:specify` primero.
2. Nunca saltear la clarificación. La ambigüedad en specs se convierte en bugs.
3. Una tarea a la vez. No implementar múltiples tareas en batch.
4. Reportar blockers, no workaroundearlos. Si una tarea necesita algo fuera de su scope, parar y reportar.
