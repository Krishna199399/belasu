import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getLiveDigitalBookBySlug } from '@/lib/digital';
import { SecureBookReader } from '@/components/reader/SecureBookReader';
import { createAdminClient } from '@/lib/supabase';
import { HIDE_DIGITAL_CLASS_6 } from '@/data/digitalBooksData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReaderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreviewMode = preview === 'true';

  if (HIDE_DIGITAL_CLASS_6 && (slug === 'kannada-class-6-guide' || slug === 'dbook-6-kn-01')) {
    redirect('/digital');
  }

  // Live database check first — any admin edits/creations/deletions take effect immediately
  const book = await getLiveDigitalBookBySlug(slug);

  if (!book) {
    redirect('/digital');
  }

  const authUser = await getAuthUser();

  // Preview mode: no login required, show first N pages
  if (isPreviewMode) {
    return (
      <SecureBookReader
        book={book}
        userPhone="Preview Mode"
        isOwned={false}
        initialPage={1}
      />
    );
  }

  // Non-preview mode requires authentication
  if (!authUser) {
    redirect(`/auth/login?redirect=/reader/${slug}`);
  }

  // Check ownership (only needed if not preview mode)
  let isOwned = false;
  let userPhone = authUser.phone || 'Anonymous';

  if (authUser) {
    const supabase = createAdminClient();
    const { data: user } = await supabase
      .from('users')
      .select('purchased_books')
      .eq('id', authUser.userId)
      .single();

    const books = user?.purchased_books;
    const digitalOwned  = (books?.digital  ?? []).includes(book.id);
    const physicalOwned = (books?.physical ?? []).includes(book.id);
    isOwned = digitalOwned || physicalOwned;

    // If not preview and not owned → redirect to purchase
    if (!isOwned) {
      redirect(`/digital/${slug}/purchase`);
    }
  }

  return (
    <SecureBookReader
      book={book}
      userPhone={userPhone}
      isOwned={isOwned}
      initialPage={1}
    />
  );
}
