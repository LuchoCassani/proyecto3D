# Plataforma web — Figuras 3D personalizadas

Plataforma e-commerce para venta de figuras escultoricas 3D personalizadas o elegidas de un catalogo e impresas bajo demanda.
El negocio tiene una fabricante artística (Denise) como operadora principal.

**Principio de construcción:** primero vender, después automatizar, después escalar.

---

## Stack técnico (decisiones tomadas)

| Capa | Tecnología |
|---|---|
| Frontend + backend | Next.js + TypeScript + Tailwind CSS |
| Hosting | Vercel (plan gratuito en MVP) |
| Base de datos | PostgreSQL en Supabase + pg_cron |
| Event bus | Supabase Realtime |
| Archivos STL / fotos | Cloudflare R2 |
| Visor 3D | react-three-fiber (Three.js) |
| Pagos | MercadoPago |
| WhatsApp | Twilio (WhatsApp Business API) |
| Email | Resend |
| Auth panel interno | Supabase Auth — magic link + TOTP (MFA nativo) |
| IA | Anthropic API — Claude Haiku |

---

## Arquitectura de handlers

El routing de eventos es **código determinístico** (switch en API Routes de Next.js).
Claude solo interviene donde el input es genuinamente impredecible.

| Handler | Tipo | LLM |
|---|---|---|
| Quote Handler | Determinístico | Solo Haiku si hay error de geometría STL |
| Production Handler | Determinístico | No |
| Notif Handler | Determinístico (templates) | No |
| Reports Handler | Determinístico SQL + template | Haiku en Fase 2 |
| Social Agent | LLM | Haiku — único agente real en Fase 1 |

---

## Journeys del usuario

| Journey | Dispositivo esperado | Descripción |
|---|---|---|
| Catálogo | ~90% móvil | Navega productos existentes, elige variante, compra directa |
| Cotizador STL | ~70% desktop | Sube archivo .stl, ve preview 3D, obtiene precio exacto |
| Pedido custom | ~80% móvil | Formula + referencia visual, Denise cotiza en 24hs |

---

## Fases de construcción y specs

### Fase 1 — Infraestructura (Series 1xx)
Base sobre la que se construye todo. Sin esto no hay nada.

| Spec | Nombre | Estado |
|---|---|---|
| SPEC-101 | Scaffolding — Next.js + Supabase + Vercel + Cloudflare R2 | Pendiente |
| SPEC-102 | Design system — Tailwind config + tokens + componentes base | Pendiente |
| SPEC-103 | Modelo de datos — esquema PostgreSQL completo | Pendiente |
| SPEC-104 | Auth panel interno — Supabase magic link + TOTP | Pendiente |

### Fase 2 — Handlers backend (Series 2xx)
Lógica de negocio. Cada handler es independiente y testeable.

| Spec | Nombre | Estado |
|---|---|---|
| SPEC-201 | Quote Handler — STL parsing + fórmula + validación | Pendiente |
| SPEC-202 | Production Handler — procesamiento de pagos confirmados | Pendiente |
| SPEC-203 | Notif Handler — WhatsApp templates por estado de orden | Pendiente |
| SPEC-204 | Reports Handler — métricas diarias vía pg_cron | Pendiente |
| SPEC-205 | Social Agent — Claude Haiku + Instagram DMs | Pendiente |

### Fase 3 — Frontend público (Series 3xx)
Interfaz del cliente final. Mobile-first.

| Spec | Nombre | Estado |
|---|---|---|
| SPEC-301 | Landing + navegación global | Pendiente |
| SPEC-302 | Catálogo — grilla + detalle de producto | Pendiente |
| SPEC-303 | Cotizador STL — visor 3D + wizard de pasos | Pendiente |
| SPEC-304 | Formulario de pedido custom | Pendiente |
| SPEC-305 | Carrito + checkout MercadoPago | Pendiente |
| SPEC-306 | Confirmación de compra + seguimiento de orden | Pendiente |

### Fase 4 — Panel de control (Series 4xx)
Interfaz interna de Denise. Desktop-first.

| Spec | Nombre | Estado |
|---|---|---|
| SPEC-401 | Dashboard overview — KPIs + cola de producción + alertas | Pendiente |
| SPEC-402 | Gestión de órdenes — tabla + detalle + cambio de estado | Pendiente |
| SPEC-403 | Cotizaciones STL activas — conversión + vencimiento | Pendiente |
| SPEC-404 | Métricas — reportes del negocio por período | Pendiente |
| SPEC-405 | Configuración del sistema — precios, límites, catálogo, templates | Pendiente |
| SPEC-406 | Gestión de clientes — historial + contacto directo | Pendiente |

---

## Pendientes bloqueantes (pre-lanzamiento)

- [ ] Límites físicos reales de la impresora de Denise (min/max mm) → SPEC-201 y SPEC-405
- [ ] Catálogo inicial: 3–5 productos reales con fotos → SPEC-302 y SPEC-405
- [ ] Nombre definitivo del proyecto y dominio → dryada.com.ar / dryada3d.com / otro

---

## Convención de specs

- Carpeta: `specs/` (en `.gitignore` — metodología privada)
- Nombre de archivo: `SPEC-NNN-nombre-corto.md`
- Estimación máxima por spec: 4 horas de implementación. Si supera eso, se segmenta.
- Criterios de aceptación en formato Given/When/Then
