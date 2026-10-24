import ShippingPolicyPage, { metadata as shippingMetadata } from '@/app/policies/shipping/page';

export const metadata = {
  ...shippingMetadata,
  alternates: {
    canonical: '/shipping-policy',
  },
};

export default ShippingPolicyPage;
