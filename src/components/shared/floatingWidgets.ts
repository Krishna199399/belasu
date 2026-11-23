/**
 * Shared placement rules for the floating bottom-right widgets
 * (WhatsApp button + Belesu chat assistant) so they stay stacked consistently.
 */

/** Routes where floating support widgets must never render. */
export function isFloatingWidgetHidden(pathname: string | null): boolean {
  return Boolean(
    pathname?.startsWith('/admin') ||
      pathname?.startsWith('/dispatch') ||
      pathname?.startsWith('/reader')
  );
}

/** Routes that show a mobile sticky purchase/checkout bar at the bottom of the screen. */
export function hasBottomStickyBar(pathname: string | null): boolean {
  return Boolean(
    (pathname?.startsWith('/books/') && pathname !== '/books' && pathname !== '/books/') ||
      pathname?.startsWith('/digital/') ||
      pathname === '/checkout' ||
      pathname === '/checkout/' ||
      pathname === '/cart' ||
      pathname === '/cart/'
  );
}
