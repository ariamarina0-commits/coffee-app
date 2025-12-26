"use server";

import Stripe from 'stripe';
import { redirect } from "next/navigation";

export async function createCheckoutSession(formData: FormData) {
  // 1. Move EVERYTHING inside the function
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  
  if (!stripeKey) {
    console.error("LOGS: STRIPE_SECRET_KEY IS MISSING");
    throw new Error("Internal Configuration Error");
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-12-15.clover' as any,
  });

  let checkoutUrl = "";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Coffee Support" },
          unit_amount: 500,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `https://coffee-app-25.vercel.app/success`,
      cancel_url: `https://coffee-app-25.vercel.app`,
    });

    checkoutUrl = session.url!;
  } catch (err: any) {
    console.error("LOGS: Stripe Error:", err.message);
    throw err;
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}