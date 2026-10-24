import PrivacyPage, { metadata as privacyMetadata } from '@/app/policies/privacy/page';

export const metadata = {
  ...privacyMetadata,
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default PrivacyPage;
