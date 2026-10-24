import TermsPage, { metadata as termsMetadata } from '@/app/policies/terms/page';

export const metadata = {
  ...termsMetadata,
  alternates: {
    canonical: '/terms-and-conditions',
  },
};

export default TermsPage;
