import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getDigitalBookBySlug } from '@/data/digitalBooksData';
import { SecureBookReader } from '@/components/reader/SecureBookReader';

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

  let book = getDigitalBookBySlug(slug);
  if (!book) {
    const { createAdminClient } = await import('@/lib/supabase');
    const supabase = createAdminClient();
    const { data: dbBook } = await supabase
      .from('digital_books')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (dbBook) {
      book = {
        id: dbBook.id,
        slug: dbBook.slug,
        title: dbBook.title,
        sku: dbBook.sku,
        subject: dbBook.subject,
        gradeClass: Number(dbBook.grade_class),
        price: Number(dbBook.price),
        originalPrice: dbBook.original_price ? Number(dbBook.original_price) : undefined,
        coverImage: dbBook.cover_image || '/digital-covers/kn-6.webp',
        totalPages: Number(dbBook.total_pages) || 50,
        isFreePreviewPages: Number(dbBook.is_free_preview_pages) || 5,
        description: dbBook.description || '',
        author: dbBook.author || 'Belesu Academic Team',
        language: dbBook.language || 'Kannada with English Translations',
        badge: dbBook.badge || undefined,
        rating: dbBook.rating ? Number(dbBook.rating) : 5.0,
        reviewCount: dbBook.review_count ? Number(dbBook.review_count) : 0,
        features: Array.isArray(dbBook.features) ? dbBook.features : [],
        tableOfContents: Array.isArray(dbBook.table_of_contents) ? dbBook.table_of_contents : [],
      };
    }
  }

  if (!book) redirect('/digital');

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
  let userPhone = 'Anonymous';

  if (authUser) {
    userPhone = authUser.phone;
    // We rely on the API route to verify ownership at page-load time.
    // For the initial render, fetch from the DB server-side to show the correct UI.
    const { createAdminClient } = await import('@/lib/supabase');
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
    if (!isPreviewMode && !isOwned) {
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
