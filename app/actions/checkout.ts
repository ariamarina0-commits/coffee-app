"use server";
import Stripe from 'stripe';
import { redirect } from "next/navigation";

export async function createCheckoutSession(formData: FormData) {
  // 1. Log to the console so we can see it started in Vercel Logs
  console.log("CHECKOUT ACTION TRIGGERED");

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  
  if (!stripeKey) {
    console.error("CRITICAL: STRIPE_SECRET_KEY is missing from Vercel!");
    throw new Error("Configuration Error");
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-12-15.clover' as any,
  });

  let checkoutUrl = "";

  try {
    // We are SKIPPING Supabase for this one test to see if Stripe wakes up
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
      cancel_url: `https://coffee-app-25.vercel.app/`,
    });

    checkoutUrl = session.url!;
    console.log("STRIPE SESSION CREATED:", checkoutUrl);

  } catch (err: any) {
    console.error("STRIPE ERROR:", err.message);
    throw err; 
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}