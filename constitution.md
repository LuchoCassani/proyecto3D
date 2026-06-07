# Constitution

Principios y no-negociables del proyecto. Este documento tiene precedencia sobre CLAUDE.md en caso de conflicto.

## Architecture

- Patrón: monolito full-stack Next.js App Router (frontend + API Routes en el mismo proyecto). Sin microservicios en MVP.
- Routing de lógica de negocio: switch determinístico en API Routes. Claude/LLM solo donde el input es genuinamente impredecible (Social Agent, error de geometría STL).
- Estructura de carpetas obligatoria:

```
src/
  app/              # Next.js App Router — pages y layouts
  components/
    ui/             # Componentes de UI puros (sin lógica de negocio)
    features/       # Componentes específicos de dominio
  lib/              # Lógica de negocio, utilidades, helpers
  handlers/         # Handlers de eventos (Quote, Production, Notif, Reports, Social)
  hooks/            # Custom React hooks
  types/            # TypeScript types e interfaces globales
  services/         # Integraciones externas (Supabase, R2, MercadoPago, Twilio, Resend, Anthropic)
specs/              # Especificaciones SDD (en .gitignore)
docs/adr/           # Architecture Decision Records
```

- Principio de construcción: primero vender, después automatizar, después escalar. Sin over-engineering en MVP.
- Fases de construcción respetadas en orden: Fase 1 (infra) → Fase 2 (handlers) → Fase 3 (frontend público) → Fase 4 (panel interno).

## Testing

- Framework: Vitest. No Jest.
- Cobertura obligatoria: todos los handlers de eventos (Quote, Production, Notif, Reports, Social).
- Tests de handlers: cubrir caso base + casos de error conocidos.
- Sin E2E en MVP. Tests de integración se agregan en Fase 2.
- Los tests viven junto al código fuente: `src/handlers/quote-handler.test.ts`.

## Security

**Credenciales y secretos**
- Nunca hardcodear API keys, tokens, ni secrets en el código. Siempre desde `process.env`.
- Validar todas las variables de entorno con Zod al arranque — si falta una clave, la app no arranca.
- No loguear valores de variables de entorno ni tokens en ningún contexto (dev, staging, prod).
- Las claves de servicios externos (MercadoPago, Twilio, Anthropic, R2, Supabase) se rotan si alguna vez quedan expuestas en git o en logs.

**Autenticación**
- Auth del panel interno: Supabase Auth (magic link + TOTP). Sin usuario/contraseña.
- Clientes: sin cuenta — flujo de checkout por email + notificación WhatsApp.
- Toda ruta del panel interno (`/admin/*`) verifica sesión activa antes de procesar cualquier request. Sin excepción.
- Los tokens de sesión nunca se pasan como query params en URLs — solo en cookies HttpOnly o headers `Authorization`.

**HTTP y llamadas a servicios externos**
- Todas las llamadas a APIs externas (MercadoPago, Twilio, Resend, Anthropic, Supabase, R2) se hacen desde server-side (API Routes o Server Components). Nunca desde el browser directamente.
- Los webhooks entrantes (MercadoPago, Twilio) deben validar firma/autenticidad antes de procesarse — nunca confiar solo en el payload.
- HTTPS obligatorio en todos los endpoints. Sin excepciones en ningún entorno.

**Input y datos**
- Validación de input: Zod en todas las API Routes. Todo input externo (usuario, webhooks, payloads de Twilio) debe pasar por un schema Zod antes de procesarse.
- Sin raw SQL. Todo acceso a datos vía Supabase client o funciones pg_cron definidas.
- No exponer IDs internos de base de datos en URLs públicas cuando sea posible — preferir slugs o UUIDs opacos.

## Allowed Dependencies

Dependencias aprobadas:

| Paquete | Uso |
|---------|-----|
| `next`, `react`, `react-dom` | Framework |
| `typescript` | Tipado estático |
| `tailwindcss`, `@tailwindcss/typography` | Estilos |
| `@supabase/supabase-js`, `@supabase/ssr` | DB + Auth + Realtime |
| `@react-three/fiber`, `@react-three/drei`, `three` | Visor 3D |
| `mercadopago` | Pagos |
| `twilio` | WhatsApp Business API |
| `resend` | Email |
| `@anthropic-ai/sdk` | IA (Claude Haiku) |
| `zod` | Validación de schemas |
| `vitest`, `@testing-library/react` | Testing |
| `@aws-sdk/client-s3` | Cloudflare R2 (compatible S3) |

Para agregar una dependencia nueva: justificarla en la spec que la requiere y aprobarla antes de instalar.

## Code Standards

- Componentes React: `PascalCase` (`ProductCard.tsx`)
- Archivos de utilidades, handlers, services, hooks: `kebab-case` (`quote-handler.ts`, `use-cart.ts`)
- Variables y funciones: `camelCase`
- Constantes globales: `UPPER_SNAKE_CASE`
- Types e interfaces: `PascalCase` sin prefijo `I` (`OrderStatus`, no `IOrderStatus`)
- Linting: ESLint + Prettier con configuración estándar de Next.js. Sin overrides custom salvo justificación en spec.
- Máximo 300 líneas por archivo. Si se supera, segmentar.
- Sin comentarios obvios. Solo comentar el *por qué* cuando no es evidente.

## Process

- Todas las features siguen el ciclo SDD: specify → clarify → plan → tasks → implement → validate.
- Sin implementación sin spec revisada.
- Sin scope creep durante implementación — reportar blockers en lugar de workaroundearlos.
- Estimación máxima por spec: 4 horas. Si supera eso, segmentar en dos specs.
