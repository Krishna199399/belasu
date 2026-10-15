# Unified Button System

This document defines the standardized button system for the Belesu application, reducing from 16+ distinct button styles to **5 core variants**.

## Problem
The application had 16+ distinct button styles, creating an inconsistent user experience and making maintenance difficult.

## Solution
A unified button component system with 5 core variants that cover all use cases.

---

## Core Components

### 1. `<Button>` - Main Button Component

**5 Variants:**
- **primary** - Main CTAs (amber/orange)
- **secondary** - Secondary actions (indigo/blue)  
- **outline** - Border-only style
- **ghost** - Subtle background
- **danger** - Destructive actions (red)

**3 Sizes:**
- **sm** - Small (text-xs, compact padding)
- **md** - Medium (text-sm) - **DEFAULT**
- **lg** - Large (text-base, generous padding)

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

// Primary CTA
<Button variant="primary" size="lg">
  Add to Cart
</Button>

// Secondary action
<Button variant="secondary">
  Browse Digital Books
</Button>

// Outline style
<Button variant="outline" size="sm">
  Preview
</Button>

// Ghost (subtle)
<Button variant="ghost">
  Cancel
</Button>

// Danger
<Button variant="danger">
  Delete
</Button>

// Full width
<Button variant="primary" fullWidth>
  Checkout
</Button>
```

---

### 2. `<IconButton>` - Icon-Only Buttons

For icon-only actions (close, navigation, etc.)

**3 Variants:**
- **default** - White background with border
- **primary** - Amber background
- **ghost** - Light gray background

**2 Sizes:**
- **sm** - Compact (p-2)
- **md** - Standard (p-2.5) - **DEFAULT**

**Usage:**
```tsx
import { IconButton } from '@/components/ui/Button';
import { X, ChevronLeft } from 'lucide-react';

// Close button
<IconButton variant="ghost">
  <X className="w-4 h-4" />
</IconButton>

// Navigation
<IconButton variant="default">
  <ChevronLeft className="w-5 h-5" />
</IconButton>
```

---

### 3. `<Badge>` - Non-Interactive Labels

For displaying tags, categories, status indicators (not clickable).

**5 Color Variants:**
- **amber** - Default, warm accent
- **indigo** - Digital/tech related
- **emerald** - Success, positive
- **rose** - Important, attention
- **slate** - Neutral

**Usage:**
```tsx
import { Badge } from '@/components/ui/Button';

<Badge variant="amber">Class 1</Badge>
<Badge variant="indigo">Digital Books</Badge>
<Badge variant="emerald">In Stock</Badge>
```

---

## Migration Guide

### Before (16+ styles):
```tsx
// Style 1
<button className="py-3 px-5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-lg">

// Style 2  
<button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm px-7 py-3.5 rounded-xl">

// Style 3
<button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-amber-400">

// Style 4
<button className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md">

// ... 12 more variations
```

### After (5 core variants):
```tsx
<Button variant="primary">Add to Cart</Button>
<Button variant="secondary" size="lg">Browse Digital Books</Button>
<IconButton variant="default"><Eye /></IconButton>
<Button variant="outline" size="sm">Preview</Button>
```

---

## Implementation Strategy

### Phase 1: High-Impact Areas (Recommended)
Update buttons in these critical user flows first:

1. **Primary CTAs** - "Add to Cart", "Buy Now", "Checkout"
2. **Navigation** - Header buttons, menu items
3. **Product cards** - "Preview", "Add" buttons
4. **Modals** - Close buttons, action buttons

### Phase 2: Secondary Areas
5. Admin interface buttons
6. Form buttons
7. Utility buttons (logout, settings, etc.)

### Phase 3: Edge Cases
8. Social media buttons
9. Special promotional buttons
10. Custom interactive elements

---

## Accessibility Features

All button components include:
- ✅ Proper focus states (`focus:ring-2`)
- ✅ Disabled states with visual feedback
- ✅ Keyboard navigation support
- ✅ Proper ARIA attributes when needed
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Touch-friendly sizing (min 44x44px)

---

## Benefits

1. **Consistency** - Users see familiar patterns throughout
2. **Maintainability** - One place to update button styles
3. **Performance** - Shared classes = smaller CSS bundle
4. **Accessibility** - Centralized a11y improvements
5. **Development Speed** - No reinventing button styles
6. **Design System** - Foundation for future UI components

---

## File Locations

- **Component**: `/src/components/ui/Button.tsx`
- **Documentation**: `/BUTTON_SYSTEM.md`
- **Usage Examples**: See component JSDoc comments

---

## Quick Reference

| Use Case | Component | Variant | Size |
|----------|-----------|---------|------|
| Primary CTA | Button | primary | lg |
| Secondary action | Button | secondary | md |
| Subtle action | Button | outline | sm |
| Cancel/close | Button | ghost | md |
| Delete/remove | Button | danger | md |
| Icon only | IconButton | default | md |
| Status tag | Badge | amber/indigo/etc | - |

---

## Notes

- All buttons use `rounded-xl` for consistency
- Shadows are applied only to primary/secondary variants
- Transitions are standardized at 200ms
- Focus rings use 2px offset for clarity
- Disabled state reduces opacity to 50%
