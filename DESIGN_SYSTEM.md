# Belesu Design System

This document defines the unified design tokens and standards for the Belesu application to ensure consistency and maintainability.

---

## Typography Scale (10 sizes max)

### Font Sizes (Reduced from 13 to 8)
```css
text-xs: 0.75rem (12px)     /* Small labels, captions */
text-sm: 0.875rem (14px)    /* Body text, buttons */
text-base: 1rem (16px)      /* Standard body, default */
text-lg: 1.125rem (18px)    /* Emphasized text */
text-xl: 1.25rem (20px)     /* Subheadings */
text-2xl: 1.5rem (24px)     /* Section headings */
text-3xl: 1.875rem (30px)   /* Major headings */
text-4xl: 2.25rem (36px)    /* Hero headings */
```

**Eliminated:**
- text-[9px], text-[10px], text-[11px] (too small)
- text-5xl, text-6xl (combine into text-4xl)

---

## Color Palette (Reduced from 20 to 10)

### Text Colors
```css
Primary Text:
- text-slate-900    /* Headings, primary content */
- text-slate-700    /* Secondary content */
- text-slate-600    /* Tertiary content */
- text-slate-400    /* Disabled, placeholder */

Brand Colors:
- text-amber-600    /* Primary brand accent */
- text-amber-800    /* Darker brand */
- text-indigo-600   /* Secondary brand (digital) */

Semantic Colors:
- text-emerald-600  /* Success */
- text-rose-600     /* Error, important */
- text-white        /* On dark backgrounds */
```

**Consolidated:**
- All slate-500, slate-800 → slate-600 or slate-700
- All amber-700, amber-900 → amber-800
- Remove one-off colors

---

## Border Radii (Reduced from 7 to 4)

```css
rounded-lg: 0.5rem (8px)      /* Small elements, inputs */
rounded-xl: 0.75rem (12px)    /* Cards, buttons (PRIMARY) */
rounded-2xl: 1rem (16px)      /* Large containers */
rounded-full: 9999px          /* Pills, badges, circular */
```

**Eliminated:**
- rounded-sm, rounded-md (use rounded-lg)
- rounded-3xl (use rounded-2xl)

**Standard:** Use `rounded-xl` for all interactive elements (buttons, cards)

---

## Button Styles (5 core variants)

See `/src/components/ui/Button.tsx` for implementation.

1. **Primary** - Amber, main CTAs
2. **Secondary** - Indigo, secondary actions
3. **Outline** - Border only
4. **Ghost** - Subtle background
5. **Danger** - Red, destructive

---

## Spacing Scale

### Consistent Gaps
```css
gap-2: 0.5rem (8px)    /* Tight grouping */
gap-3: 0.75rem (12px)  /* Standard spacing */
gap-4: 1rem (16px)     /* Comfortable spacing */
gap-6: 1.5rem (24px)   /* Section breaks */
gap-8: 2rem (32px)     /* Major divisions */
```

---

## Heading Hierarchy

### Proper Outline
```html
H1: Page title (once per page)
H2: Major sections
H3: Subsections within H2
H4: Sub-subsections (use sparingly)
H5-H6: Avoid if possible
```

**Never skip levels:** H1 → H2 → H3 (not H1 → H3)

---

## Accessibility Standards

### Minimum Sizes
- Body text: 14px minimum (text-sm)
- Touch targets: 44x44px minimum
- Color contrast: WCAG AA (4.5:1 for text)

### Text Handling
- Avoid truncation when possible
- Use sentence case for readability
- Reserve ALL CAPS for short labels only (max 20 chars)

---

## Implementation Priority

1. **Typography** - Update font sizes
2. **Colors** - Consolidate palette
3. **Spacing** - Standardize gaps
4. **Buttons** - Use unified components
5. **Borders** - Standardize radii
6. **Headings** - Fix hierarchy
