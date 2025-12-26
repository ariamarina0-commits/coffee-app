import Stripe from 'stripe';

export const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  
  if (!key) {
    // If the key is missing, we return null instead of crashing
    return null;
  }

  return new Stripe(key, {
    apiVersion: '2024-12-18.acacia' as any,
  });
};