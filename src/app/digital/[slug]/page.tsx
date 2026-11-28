import { permanentRedirect } from 'next/navigation';

/**
 * Only the dedicated Class 6 route is currently an active digital product page.
 * Preview and upcoming digital-book slugs must not resolve as purchasable pages.
 * The explicit /digital/kannada-class-6-guide/ route takes precedence over this
 * catch-all route in the Next.js App Router.
 */
export default async function InactiveDigitalBookRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  permanentRedirect('/digital/');
}
