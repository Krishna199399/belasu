# Implementation Plan: Design System Overhaul

This plan addresses 21 usability heuristic violations found in the audit of http://localhost:3000/. The work is organized into 5 focused features that can be implemented sequentially.

---

## Feature Overview

**FEAT-001**: Typography consistency (font sizes 13→8, text colors 20→10)  
**FEAT-002**: Fix all-caps text readability (4 instances)  
**FEAT-003**: Fix text truncation and small badges (badge sizing & truncation)  
**FEAT-004**: Fix heading hierarchy violations (H1→H3, H2→H4 skips)  
**FEAT-005**: Standardize spacing, radii, layout (7→4 border radii, consistent padding/gaps)

---

## FEAT-001: Typography Consistency

### Goal
Reduce distinct font sizes from 13 to 8, text colors from 20 to 10 per DESIGN_SYSTEM.md canonical values.

### Files to Modify
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/BookCard.tsx`
- `src/components/home/HeroCarousel.tsx`
- `src/components/home/ParentFeedbackSection.tsx`
- `src/components/home/QuickLookBookSection.tsx`
- `src/app/page.tsx`
- `src/app/books/page.tsx`
- `src/app/cart/page.tsx`

### Changes

**Navbar.tsx:**
- Line ~50: `text-[13px]` → `text-sm`
- Lines ~79, 83, 114, 118: `text-[10px]` → `text-xs`
- Lines ~192, 202, 208: `text-[7px]` → (keep as-is or use `text-[8px]`, these are tiny badges)
- All `text-slate-500` → `text-slate-600` (consolidate color palette)

**Footer.tsx:**
- Lines ~93-109 payment badges: `text-[10px]` → `text-xs`
- Line ~28: Change `CKELP TECHNOLOGIES PRIVATE LIMITED` to `Ckelp Technologies Private Limited` and remove `font-extrabold`

**BookCard.tsx:**
- Line ~33: `text-[11px]` → `text-xs`

**HeroCarousel.tsx:**
- Line ~125 badge: `text-[7px]` → `text-[8px]` (or keep minimal for badge)
- Any `text-[10px]` → `text-xs`

**ParentFeedbackSection.tsx:**
- Line ~52: `text-[11px]` → `text-xs`
- Lines ~63, 65: `text-[10px]` → `text-xs`

**page.tsx (home):**
- Lines ~60, 85, 93, 97: `text-[10px]` → `text-xs`
- Line ~128: `text-[9px]` → `text-xs`

**books/page.tsx:**
- Line ~35: `text-[7px]` → `text-[8px]`

**cart/page.tsx:**
- Lines ~63, 104: `text-[10px]` → `text-xs`

### Verification
```bash
npm run dev
```
- Navigate to http://localhost:3000/
- Inspect navbar, footer, home sections, /books, /cart
- Use DevTools to search for `text-[` and verify only standard Tailwind sizes remain
- Confirm no layout shifts or text overflow

---

## FEAT-002: Fix All-Caps Text

### Goal
Remove `uppercase` class and convert to sentence/title case for all text runs exceeding 20 characters (Issues 5, 6, 7, 12).

### Files to Modify
- `src/components/home/HeroCarousel.tsx`
- `src/components/home/QuickLookBookSection.tsx`
- `src/components/home/CurriculumExplorer.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Navbar.tsx` (check dropdowns)

### Changes

**HeroCarousel.tsx:**
- Line ~102: `<span class="text-xs font-bold uppercase tracking-widest text-slate-600 block">Kannada Mathadi, Kannada Belesi</span>`
  - Remove `uppercase` class
  - Keep text as-is or change to title case: "Kannada Mathadi, Kannada Belesi"

**QuickLookBookSection.tsx:**
- Line ~89: `<Link ... className="... uppercase tracking-wider ...">Order Complete Guidebook Series</Link>`
  - Remove `uppercase`, change text to: "Order Complete Guidebook Series" (sentence case or title case)

**CurriculumExplorer.tsx:**
- Line ~85: `<h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Target Academic Skills Built:</h4>`
  - Remove `uppercase`, change to: "Target academic skills built:" (sentence case) or "Target Academic Skills Built:" (title case)

**Footer.tsx:**
- Line ~28: `<p className="font-extrabold text-slate-900 pt-1">CKELP TECHNOLOGIES PRIVATE LIMITED</p>`
  - Change to: "Ckelp Technologies Private Limited"
  - Remove `font-extrabold`, use `font-bold`

**Navbar.tsx:**
- Lines ~79, 83: Check dropdown labels like "PHYSICAL BOOKS" and "DIGITAL BOOKS"
  - If >20 chars, remove `uppercase` and convert to title case
  - These appear to be short, but verify in context

### Verification
```bash
npm run dev
```
- Visit http://localhost:3000/
- Scroll through hero carousel – verify tagline is sentence/title case
- Scroll to "Quick Look at the Book" section – verify CTA button is readable case
- Check "Curriculum Explorer" section – verify skills heading is sentence/title case
- Scroll to footer – verify company name is title case
- Use DevTools to search for `uppercase` class on spans/paragraphs with long text

---

## FEAT-003: Fix Text Truncation & Small Badges

### Goal
Remove `truncate` and `max-w-[160px]` from badges, upgrade `text-[10px]` to `text-xs` (Issues 8-11).

### Files to Modify
- `src/components/home/ParentFeedbackSection.tsx`

### Changes

**ParentFeedbackSection.tsx:**
- Lines ~63-65 (4 instances in the map):
  ```tsx
  // OLD:
  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full max-w-[160px] truncate">
    {review.bookTitle}
  </span>
  
  // NEW:
  <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1.5 rounded-xl">
    {review.bookTitle}
  </span>
  ```
  - Remove `max-w-[160px]` and `truncate`
  - Change `text-[10px]` → `text-xs`
  - Optionally change `rounded-full` → `rounded-xl` for better multi-line wrap
  - Add `line-clamp-2` if needed to limit to 2 lines

### Verification
```bash
npm run dev
```
- Navigate to http://localhost:3000/
- Scroll to "What Parents Say About Belesu Books" section
- Verify all 4 review cards show full book titles without ellipsis
- Confirm badge text is 12px minimum (text-xs)
- Check layout remains clean without overflow

---

## FEAT-004: Fix Heading Hierarchy

### Goal
Correct all heading level skips (H1→H3, H2→H4) to ensure proper document outline (Issues 13-16).

### Files to Modify
- `src/components/home/ElevatingKannadaSection.tsx`
- `src/components/home/QuickLookBookSection.tsx`
- `src/components/home/CurriculumExplorer.tsx`
- `src/components/home/ParentFeedbackSection.tsx`
- `src/app/books/page.tsx` (verify)

### Changes

**ElevatingKannadaSection.tsx:**
- Line ~22: `<h3 className="text-base font-serif font-bold text-slate-900 mb-1">Language Preservation</h3>`
  - Change `h3` → `h2` (fixes H1→H3 skip from page H1)

**QuickLookBookSection.tsx:**
- Line ~41: `<h4 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">{currentTabInfo.title}</h4>`
  - Change `h4` → `h3` (fixes H2→H4 skip)

**CurriculumExplorer.tsx:**
- Line ~68: `<h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{activeGradeData.title}</h3>`
  - Verify this follows an H2; if it follows H1 directly, change to `h2`
  - If it already follows proper hierarchy, leave as-is

**ParentFeedbackSection.tsx:**
- Line ~60: `<h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">{review.parentName}...`
  - Change `h4` → `h3` OR change to `<p className="font-bold text-slate-900 text-sm ...">` (author names may not need heading semantics)

**books/page.tsx:**
- Line ~35: Verify H1 "Purchase Book" is followed by H2 for category sections (not H3)

### Verification
```bash
npm run dev
```
- Navigate to http://localhost:3000/
- Open DevTools → Accessibility panel or use HeadingsMap browser extension
- Verify heading sequence: H1 → H2 → H3 with no skips
- Check /books page for proper hierarchy
- Use browser's document outline inspector to confirm structure

---

## FEAT-005: Standardize Spacing & Layout

### Goal
Reduce border radii from 7 to 4 variants (rounded-lg/xl/2xl/full), standardize padding (p-4/p-6), gaps (gap-2/4/6/8), verify Button component usage (Issues 3, 17-21).

### Files to Modify
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/BookCard.tsx`
- All `src/components/home/*.tsx` files
- `src/app/page.tsx`
- `src/app/books/page.tsx`
- `src/app/cart/page.tsx`

### Changes

**Global Pattern:**
- Replace `rounded-sm`, `rounded-md` → `rounded-lg`
- Replace `rounded-3xl` → `rounded-2xl`
- Standardize card padding: small cards `p-4`, large cards `p-6`
- Button gaps: verify `gap-2` (already in Button.tsx)
- Grid gaps: `gap-4` compact, `gap-6` default, `gap-8` spacious

**Navbar.tsx:**
- All `rounded-md` → `rounded-lg`
- Verify IconButton uses `p-2.5` (standard)
- Dropdown menu: verify `rounded-xl` (already correct)

**Footer.tsx:**
- Standardize column padding
- Verify grid uses `gap-6` or `gap-8`

**BookCard.tsx:**
- Outer card: verify `rounded-2xl`
- Inner elements: verify `rounded-xl`
- Padding: consolidate `p-5` → `p-6`
- Verify "Add" button uses `<Button variant="primary" size="sm">` from Button.tsx (already correct per code review)

**Home section components:**
- ElevatingKannadaSection: verify grid `gap-8`
- QuickLookBookSection: verify grid `gap-6`
- CurriculumExplorer: verify card `p-6`, grid `gap-6`
- SeriesFilter: verify card `p-6`, grid `gap-6`
- WhyChooseBelesu: verify card `p-8` (large feature cards), grid `gap-8`
- ParentFeedbackSection: verify card `p-8`, grid `gap-8`
- VideoReelsSection: verify grid `gap-8`

**page.tsx (home):**
- Line ~60: verify rounded-xl (icon containers)
- Verify all section grids use gap-6 or gap-8

**books/page.tsx:**
- Verify BookCard grid uses `gap-8` (line ~179)

**cart/page.tsx:**
- Verify card spacing uses `p-6`, gaps use `gap-6`

### Verification
```bash
npm run dev
```
- Navigate to http://localhost:3000/
- Visually inspect all sections for consistent spacing and radii
- Check BookCard "Add" buttons match Button component styling
- Use DevTools to search for `rounded-sm`, `rounded-md`, `rounded-3xl` (should find minimal/none)
- Verify grid layouts have consistent gaps
- Navigate to /books and /cart to verify consistency

---

## Cross-FEAT Integration Verification

After completing all 5 FEATs, perform full-site regression test:

```bash
npm run build
npm run dev
```

**Pages to check:**
- http://localhost:3000/ (home page – all sections)
- http://localhost:3000/books (catalog page)
- http://localhost:3000/cart (cart page)

**Checklist:**
- [ ] Font sizes: 8 or fewer distinct sizes
- [ ] Text colors: 10 or fewer distinct colors
- [ ] Border radii: 4 or fewer variants
- [ ] No all-caps text exceeding 20 characters
- [ ] No truncated badges with ellipsis
- [ ] No heading level skips (H1→H2→H3 progression)
- [ ] Consistent card padding (p-4 or p-6)
- [ ] Consistent button gaps (gap-2)
- [ ] Consistent grid gaps (gap-4/6/8 pattern)
- [ ] No console errors
- [ ] No layout shifts or visual regressions
- [ ] Responsive behavior intact (mobile/tablet/desktop)

---

## Notes

- **Button component already exists** (src/components/ui/Button.tsx) with 5 variants – no need to create it
- **Design tokens are canonical** – DESIGN_SYSTEM.md and BUTTON_SYSTEM.md define the target state
- **No test framework** – verification is manual visual inspection via dev server
- **Next.js 16 breaking changes** – consult node_modules/next/dist/docs/ if API issues arise
- **Build command**: `npm run build` (for production verification)
- **Dev command**: `npm run dev` (starts server on port 3000)

