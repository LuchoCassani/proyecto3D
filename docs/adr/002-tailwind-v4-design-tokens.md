# ADR-002: Tailwind v4 @theme como fuente de tokens del design system

**Date**: 2026-06-07
**Status**: Accepted
**Feature**: SPEC-102-design-system

## Context

El proyecto necesita una capa de tokens visuales unificada (colores, tipografía, spacing, sombras) consumible por cualquier componente. En Tailwind v4, la configuración ya no vive en `tailwind.config.ts` — la API cambió a directivas CSS dentro de `globals.css`. La spec SPEC-102 define el design system completo de Dryada, derivado del logo: gradiente de púrpura (#652B82) a ámbar (#F09818), con tipografía Poppins + Inter + JetBrains Mono.

La clarificación C-1 estableció que la paleta por defecto de Tailwind debe ser reemplazada completamente — solo existen tokens Dryada. Esto requiere el mecanismo de reset `--color-*: initial` dentro de `@theme`.

## Alternatives Considered

No hay alternativas viables. Las restricciones convergen en un único enfoque:

**CSS Modules / Sass variables:** requeriría importar variables en cada componente manualmente. Incompatible con el patrón de clases utilitarias que Tailwind v4 ya impone en el proyecto.

**Solo `:root` CSS vars sin @theme:** los componentes podrían usar `style={{ color: 'var(--color-primary)' }}` pero perderían todas las clases utilitarias (`bg-dryada-purple`, `text-magenta`, etc.) — regresión de DX significativa y violación del patrón Tailwind ya establecido.

**Downgrade a Tailwind v3 con tailwind.config.ts:** la constitution aprobó Tailwind v4 en SPEC-101 y `create-next-app` lo instaló. Revertir sería breaking change y scope creep fuera de esta spec.

## Decision

Definir todos los tokens de diseño en `src/app/globals.css`:

1. `@theme { --color-*: initial; ... }` — reemplaza la paleta por defecto de Tailwind y registra los tokens Dryada como utilidades generadas en build time.
2. `:root { ... }` — CSS custom properties semánticas para acceso desde JS/CSS inline y para el futuro bloque de dark mode.
3. `next/font/google` en `src/app/layout.tsx` — carga Poppins, Inter y JetBrains_Mono con sus variables CSS (`--font-display`, `--font-body`, `--font-mono`), inyectadas en `<body>`.

La paleta por defecto de Tailwind queda completamente reemplazada. Solo existen clases `dryada-*`, `neutral-*` y las semánticas definidas en la spec.

## Consequences

**Positivo:**
- Única fuente de verdad: cualquier cambio de color o tipografía se hace en un solo archivo.
- Las clases Tailwind generadas son predecibles — el build falla si se usa una clase inexistente.
- Sin dependencias nuevas — usa herramientas ya instaladas en SPEC-101.
- El bloque de dark mode en `:root` permite activar el tema oscuro en Fase 2 sin modificar ningún componente.

**Negativo:**
- La sintaxis `@theme` de Tailwind v4 es relativamente nueva con menos ejemplos en internet que v3. Errores de sintaxis pueden producir mensajes de error poco descriptivos.
- Redundancia intencional: algunos tokens viven tanto en `@theme` como en `:root`. Requiere disciplina para mantenerlos sincronizados si se editan manualmente en el futuro.
