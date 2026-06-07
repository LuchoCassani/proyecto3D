# Plan: SPEC-102 — Design System: Tokens, Tailwind v4 y Fuentes

## Architecture

Esta spec toca exclusivamente la capa de configuración visual — sin componentes React, sin rutas de API. Son dos archivos con una dirección de datos unidireccional:

```
src/app/globals.css
  @import "tailwindcss"
  @theme { --color-*: initial; tokens Dryada... }   → Tailwind genera clases utilitarias en build
  :root { CSS custom properties semánticas... }      → accesibles desde JS/CSS inline

src/app/layout.tsx
  next/font/google (Poppins + Inter + JetBrains_Mono)
  variables CSS → <body className="...">             → disponibles globalmente via --font-*
```

**globals.css** — única fuente de verdad visual:
- `@import "tailwindcss"` ya existente de SPEC-101
- `@theme` con `--color-*: initial` primero (elimina paleta por defecto de Tailwind) y luego todos los tokens Dryada (colores, gradientes, fuentes, spacing, radius, shadows)
- `:root` con CSS custom properties semánticas (`--color-primary`, `--gradient-brand`, `--text-xs`, etc.)
- Bloque `@media (prefers-color-scheme: dark)` comentado al final, listo para activar en Fase 2

**layout.tsx** — único punto de carga de fuentes:
- `Poppins` pesos 500, 600, 700, 800 → `variable: '--font-display'`
- `Inter` pesos 400, 500 → `variable: '--font-body'`
- `JetBrains_Mono` peso 400 → `variable: '--font-mono'`
- Las tres variables se pasan al `<body>` como `className` combinado

## Dependencies

No se agregan dependencias nuevas:

| Recurso | Origen | Estado |
|---|---|---|
| `tailwindcss` | Ya instalado (SPEC-101) | ✓ disponible |
| `next/font/google` | Built-in de Next.js | ✓ disponible |
| `@tailwindcss/typography` | Ya aprobado en constitution | ✓ disponible (no requerido en esta spec) |

## Files Affected

**Modificados:**
- `src/app/globals.css` [modify] — agregar `@theme` con tokens completos + `:root` con semánticos + dark mode comentado
- `src/app/layout.tsx` [modify] — agregar next/font para las 3 fuentes e inyectar variables en `<body>`

## Risks and Trade-offs

**Riesgo 1 — Sintaxis de reset en Tailwind v4 (impacto: alto / probabilidad: media)**
Para reemplazar la paleta por defecto, la sintaxis correcta es `--color-*: initial` dentro de `@theme`. Si se omite, los colores por defecto de Tailwind coexisten con los Dryada y `bg-blue-500` seguiría funcionando — violando C-1.
→ Mitigación: el criterio de aceptación verifica explícitamente que `bg-blue-500` no produce output CSS.

**Riesgo 2 — Orden de directivas en globals.css (impacto: alto / probabilidad: baja)**
En Tailwind v4, `@theme` debe aparecer después de `@import "tailwindcss"`. Si el orden se invierte, las utilidades no se generan y el error puede ser críptico.
→ Mitigación: la tarea de implementación especifica el orden exacto de secciones.

**Riesgo 3 — Nombre exacto de JetBrains Mono en next/font (impacto: medio / probabilidad: baja)**
El nombre correcto es `JetBrains_Mono` (con guión bajo, no guión medio). Un typo rompe el build con un error poco descriptivo.
→ Mitigación: la tarea incluye el import exacto documentado.

**Trade-off — CSS vars en `:root` + `@theme` en paralelo**
Podríamos definir solo `@theme` (Tailwind genera todo) o solo `:root` (CSS vars puras sin clases Tailwind). Elegimos ambos: `@theme` para clases utilitarias y `:root` para acceso desde JS o CSS inline. El costo es redundancia mínima; el beneficio es máxima flexibilidad para SPEC-103.

## Decision

Ver `docs/adr/002-tailwind-v4-design-tokens.md`
