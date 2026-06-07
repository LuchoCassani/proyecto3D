# SPEC-102 — Design System: Tokens, Tailwind v4 y Fuentes

**Estado:** specified  
**Fase:** 1 — Infraestructura  
**Estimación:** 2hs  
**Fecha de creación:** 2026-06-07

---

## 1. Contexto

Todo componente visual del proyecto — catálogo, cotizador, panel admin — va a consumir los mismos colores, gradientes, tipografía y espaciado. Sin esta capa de tokens unificada, cada pantalla inventaría sus propios valores y el resultado sería inconsistente y difícil de mantener.

El design system de Dryada se deriva directamente del logo: un gradiente de púrpura profundo (#652B82) a ámbar cálido (#F09818), pasando por violet, magenta, coral y warm orange. Toda la identidad visual respeta ese arco cromático.

Esta spec cubre exclusivamente la capa de configuración: tokens, variables CSS, fuentes y setup de Tailwind v4. Los componentes de UI (Button, Card, Input, Badge, ProgressBar) son SPEC-103.

---

## 2. Objetivo

Tener una única fuente de verdad visual en `src/app/globals.css` — con tokens CSS y la directiva `@theme` de Tailwind v4 — y las tres fuentes cargadas via `next/font`, de modo que cualquier componente pueda aplicar colores, gradientes, tipografía y espaciado usando clases Tailwind o variables CSS sin hardcodear ningún valor.

---

## 3. No-Goals

- No incluye ningún componente de UI (eso es SPEC-103)
- No incluye ninguna pantalla o ruta (eso es Serie 3xx y 4xx)
- No incluye modo oscuro activo (las variables CSS quedan preparadas, pero el `@media` no se activa en MVP)
- No incluye `tailwind.config.ts` — en Tailwind v4 no existe; toda la config vive en `globals.css`

---

## 4. Functional Requirements

| ID | Requisito |
|----|-----------|
| FR-001 | `globals.css` define los tokens de color de marca (purple, violet, magenta, coral, warm, amber) y neutros (900, 700, 400, 200, 100, surface, surface-tint) como CSS custom properties bajo `:root` |
| FR-002 | `globals.css` define los tokens semánticos (`--color-primary`, `--color-primary-dark`, `--color-primary-light`, `--color-accent`, `--color-danger`, `--color-success`) apuntando a las variables de marca |
| FR-003 | `globals.css` define los tres gradientes de marca: `--gradient-brand`, `--gradient-primary`, `--gradient-accent` |
| FR-004 | `globals.css` configura Tailwind v4 con `@theme` exponiendo colores, gradientes, fuentes, spacing, border-radius y box-shadow como utilidades Tailwind |
| FR-005 | Poppins (pesos 500, 600, 700, 800), Inter (pesos 400, 500) y JetBrains Mono (peso 400) se cargan via `next/font/google` y se exponen como variables CSS (`--font-display`, `--font-body`, `--font-mono`) |
| FR-006 | `globals.css` define la escala tipográfica como custom properties (`--text-xs` a `--text-5xl`) |
| FR-007 | `globals.css` define tokens de spacing (base 4px: `--space-1` a `--space-16`), border-radius (`--radius-sm` a `--radius-full`) y sombras con tinte de marca (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) |
| FR-008 | Las variables CSS de modo oscuro están definidas en un bloque `@media (prefers-color-scheme: dark)` pero comentado — listas para activar en Fase 2 sin tocar componentes |

---

## 5. Non-Functional Requirements

| ID | Requisito |
|----|-----------|
| NFR-001 | `next build` completa sin errores ni warnings de TypeScript después de aplicar esta spec |
| NFR-002 | Las fuentes se cargan con `display: 'swap'` para evitar FOIT (Flash of Invisible Text) |
| NFR-003 | No se usan valores hardcodeados de color o tipografía fuera de `globals.css` — cualquier excepción debe tener comentario justificado |
| NFR-004 | Las clases Tailwind generadas por `@theme` deben ser predecibles y documentadas en la propia spec (sin magia implícita) |

---

## 6. Tokens definidos

### Colores de marca (CSS vars → clases Tailwind)

| Token CSS | Hex | Clase Tailwind | Uso |
|---|---|---|---|
| `--color-purple` | `#652B82` | `text-dryada-purple`, `bg-dryada-purple` | Primario de marca, fondos hero |
| `--color-violet` | `#9E2478` | `text-dryada-violet`, `bg-dryada-violet` | Gradiente intermedio, hover |
| `--color-magenta` | `#D01F65` | `text-dryada-magenta`, `bg-dryada-magenta` | CTAs principales, links activos |
| `--color-coral` | `#E0404A` | `text-dryada-coral`, `bg-dryada-coral` | Alertas, badges de estado |
| `--color-warm` | `#E8672A` | `text-dryada-warm`, `bg-dryada-warm` | Gradiente de acento, iconos |
| `--color-amber` | `#F09818` | `text-dryada-amber`, `bg-dryada-amber` | Highlights, precio, badges |

### Neutros

| Token CSS | Hex | Clase Tailwind |
|---|---|---|
| `--color-neutral-900` | `#1A1A1A` | `text-neutral-900`, `bg-neutral-900` |
| `--color-neutral-700` | `#3D3D3D` | `text-neutral-700`, `bg-neutral-700` |
| `--color-neutral-400` | `#9E9E9E` | `text-neutral-400`, `bg-neutral-400` |
| `--color-neutral-200` | `#E8E8E8` | `text-neutral-200`, `bg-neutral-200` |
| `--color-neutral-100` | `#F5F5F5` | `text-neutral-100`, `bg-neutral-100` |
| `--color-surface` | `#FFFFFF` | `bg-surface` |
| `--color-surface-tint` | `#F8F4FF` | `bg-surface-tint` |

### Gradientes

| Token CSS | Valor | Clase Tailwind |
|---|---|---|
| `--gradient-brand` | `135deg: #652B82 → #9E2478 → #D01F65 → #E0404A → #E8672A → #F09818` | `bg-gradient-brand` |
| `--gradient-primary` | `135deg: #652B82 → #D01F65` | `bg-gradient-primary` |
| `--gradient-accent` | `135deg: #E0404A → #F09818` | `bg-gradient-accent` |

### Fuentes

| Variable CSS | Fuente | Pesos | Clase Tailwind | Uso |
|---|---|---|---|---|
| `--font-display` | Poppins | 500, 600, 700, 800 | `font-display` | Display, headings, labels |
| `--font-body` | Inter | 400, 500 | `font-body` | Body, captions, metadatos |
| `--font-mono` | JetBrains Mono | 400 | `font-mono` | Dimensiones, valores técnicos, STL |

---

## 7. Edge Cases

| ID | Escenario | Comportamiento esperado |
|----|-----------|------------------------|
| EC-001 | Una fuente de Google Fonts no carga (sin internet en dev) | `next/font` tiene fallback definido; la UI se renderiza con la fuente de sistema |
| EC-002 | Se usa una clase Tailwind de marca (`bg-dryada-purple`) en un archivo y no aparece en el CSS generado | Tailwind v4 detecta contenido automáticamente desde `src/`. Verificar que el archivo esté bajo `src/` y que la clase no esté generada dinámicamente (string concatenado). Si es dinámica, usar `@source` en globals.css para incluir el path explícitamente |
| EC-003 | El modo oscuro del sistema operativo está activado | El bloque `@media (prefers-color-scheme: dark)` está comentado → no hay cambio visual; la UI siempre usa el tema claro en MVP |

---

## 8. API Contracts

No aplica — esta spec no define endpoints.

---

## 9. Data Models

No aplica — esta spec no toca base de datos.

---

## 10. Open Questions

| ID | Pregunta | Propietario | Deadline |
|----|----------|-------------|----------|
| OQ-001 | ¿El color `--color-success` (#2ECC71) es definitivo o Denise quiere revisarlo junto al resto de la paleta? | Lucho/Denise | Antes de SPEC-103 |
| OQ-002 | ¿Se necesita alguna variante de peso adicional de Poppins o Inter más allá de los especificados? | Lucho | Antes de SPEC-103 |

---

## 11. Criterios de Aceptación

**Given** que se corre `npm run dev`  
**When** se inspecciona el `<html>` en el browser  
**Then** las variables CSS `--color-purple`, `--gradient-primary`, `--font-display` y `--space-4` están definidas en `:root`

**Given** que un componente usa `className="bg-gradient-primary text-white font-display"`  
**When** se renderiza en el browser  
**Then** el fondo muestra el gradiente púrpura→magenta y el texto usa Poppins

**Given** que se corre `next build`  
**Then** el build completa sin errores

**Given** que el sistema operativo tiene modo oscuro activado  
**Then** la UI no cambia — el tema oscuro está desactivado en MVP

---

## 12. Clarifications

### C-1: ¿La paleta de Tailwind por defecto queda disponible?
**Type:** ambiguity  
**Q:** ¿Los colores por defecto de Tailwind (blue, red, green, gray, etc.) quedan disponibles junto a los tokens Dryada, o los reemplazamos y dejamos solo la paleta Dryada?  
**A:** Solo paleta Dryada. El `@theme` reemplaza los defaults. Solo existen las clases `dryada-*`, `neutral-*` y los semánticos. Usar `bg-blue-500` sería un error detectable en build.  
**Pattern tip:** Cuando definís un design system, siempre especificá si extendés o reemplazás los defaults del framework de estilos — la diferencia determina si el sistema es realmente la única fuente de verdad visual.

### C-2: ¿Dónde vive la configuración de next/font?
**Type:** structural gap  
**Q:** ¿Dónde vive la configuración de next/font y cómo se inyectan las variables CSS de fuentes?  
**A:** En `src/app/layout.tsx` directamente. Las 3 fuentes (Poppins, Inter, JetBrains Mono) se definen ahí con `variable: '--font-display'`, `variable: '--font-body'`, `variable: '--font-mono'` y se pasan como `className` al `<body>`. Es el patrón estándar de App Router.  
**Pattern tip:** Para configuración de fuentes y otros recursos globales de Next.js, siempre especificá el archivo concreto donde vive la inicialización — "via next/font" es correcto pero incompleto sin el punto de entrada.
