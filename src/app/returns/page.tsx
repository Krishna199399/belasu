import ReturnsPolicyPage, { metadata as returnsMetadata } from '@/app/policies/returns/page';

export const metadata = {
  ...returnsMetadata,
  alternates: {
    canonical: '/returns',
  },
};

export default ReturnsPolicyPage;
