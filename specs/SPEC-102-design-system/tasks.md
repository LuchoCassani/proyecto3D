# Tasks: SPEC-102 — Design System: Tokens, Tailwind v4 y Fuentes

**Feature**: SPEC-102-design-system  
**Plan**: specs/SPEC-102-design-system/plan.md  
**Generated**: 2026-06-07

---

## TASK-001: Configurar next/font en layout.tsx

**Status**: pending  
**Requirements**: FR-005, NFR-002, EC-001  
**Complexity**: S  
**Depends on**: none  
**Files**: `src/app/layout.tsx`

### Description
Importar `Poppins`, `Inter` y `JetBrains_Mono` desde `next/font/google`. Configurar cada una con sus pesos y `variable` CSS (`--font-display`, `--font-body`, `--font-mono`) y `display: 'swap'`. Pasar las tres variables al `<body>` como `className` combinado. La fuente de fallback de cada una debe ser `sans-serif` / `monospace` según corresponda.

### Validation
- El `<body>` en el HTML renderizado tiene las tres clases de variable CSS (`--font-display`, `--font-body`, `--font-mono`) visibles al inspeccionar en el browser
- `next build` completa sin errores tipográficos ni de fuentes

---

## TASK-002: Configurar @theme en globals.css con colores, gradientes y layout tokens

**Status**: pending  
**Requirements**: FR-001, FR-003, FR-004, FR-007, C-1  
**Complexity**: M  
**Depends on**: none  
**Files**: `src/app/globals.css`

### Description
Agregar un bloque `@theme { }` después del `@import "tailwindcss"` existente. Dentro del bloque:
1. Escribir `--color-*: initial;` primero para reemplazar la paleta por defecto de Tailwind.
2. Definir los 6 colores de marca (`--color-dryada-purple: #652B82`, violet, magenta, coral, warm, amber) y los 7 neutros (`--color-neutral-900` a `--color-surface-tint`).
3. Definir los 3 gradientes de marca como `background-image` (`--background-image-gradient-brand`, etc.) usando los valores de la spec.
4. Definir las fuentes como `--font-family-display: var(--font-display)`, `--font-family-body: var(--font-body)`, `--font-family-mono: var(--font-mono)`.
5. Definir tokens de spacing (`--spacing-1: 4px` a `--spacing-16: 64px`), border-radius (`--radius-sm: 4px` a `--radius-full: 9999px`) y sombras con tinte de marca (`--shadow-sm`, `--shadow-md`, `--shadow-lg`).

### Validation
- Al inspeccionar `:root` en el browser, las variables `--color-dryada-purple`, `--color-neutral-900`, `--background-image-gradient-primary` están presentes
- La clase `bg-dryada-purple` aplicada a un elemento produce el color correcto (`#652B82`)
- La clase `bg-blue-500` NO produce ningún color (paleta de Tailwind reemplazada)

---

## TASK-003: Agregar tokens semánticos y escala tipográfica en :root

**Status**: pending  
**Requirements**: FR-002, FR-006  
**Complexity**: S  
**Depends on**: TASK-002  
**Files**: `src/app/globals.css`

### Description
Agregar un bloque `:root { }` después del bloque `@theme`. Dentro del bloque definir:
1. Tokens semánticos que apuntan a las vars de marca: `--color-primary: var(--color-dryada-magenta)`, `--color-primary-dark: var(--color-dryada-violet)`, `--color-primary-light: #F5E6FF`, `--color-accent: var(--color-dryada-amber)`, `--color-danger: var(--color-dryada-coral)`, `--color-success: #2ECC71`.
2. Escala tipográfica: `--text-xs: 0.75rem` hasta `--text-5xl: 3rem` (9 valores según la spec).

### Validation
- Al inspeccionar `:root` en el browser, `--color-primary` resuelve al valor hex de magenta (`#D01F65`) y `--text-base` vale `1rem`
- Un elemento con `style={{ color: 'var(--color-primary)' }}` muestra el color magenta

---

## TASK-004: Agregar bloque dark mode comentado en globals.css

**Status**: pending  
**Requirements**: FR-008  
**Complexity**: S  
**Depends on**: TASK-003  
**Files**: `src/app/globals.css`

### Description
Al final de `globals.css`, agregar el bloque `@media (prefers-color-scheme: dark)` con todas las overrides de colores semánticos (text-primary, text-secondary, text-muted, border, bg, surface, surface-tint) envuelto en un comentario de bloque CSS. El comentario debe incluir una nota `/* Dark mode — activar en Fase 2 */` para que sea fácil de encontrar y descomentar.

### Validation
- Con el sistema operativo en modo oscuro, la UI no cambia visualmente (bloque comentado)
- El archivo contiene el bloque con los valores de override según la spec, pero completamente dentro de `/* ... */`

---

## TASK-005: Verificar build completo y criterios de aceptación

**Status**: pending  
**Requirements**: NFR-001, NFR-003, NFR-004, EC-002, EC-003  
**Complexity**: S  
**Depends on**: TASK-001, TASK-004  
**Files**: ninguno (verificación)

### Description
Correr `next build` y verificar que completa sin errores ni warnings de TypeScript. Verificar manualmente en el browser (modo dev) los cuatro criterios de aceptación de la spec: (1) variables CSS presentes en `:root`, (2) `className="bg-gradient-primary text-white font-display"` renderiza correctamente, (3) `bg-blue-500` no produce output, (4) modo oscuro del OS no afecta la UI.

### Validation
- `next build` completa sin errores
- Las cuatro condiciones de los criterios de aceptación de la spec se cumplen al inspeccionarlo en el browser
