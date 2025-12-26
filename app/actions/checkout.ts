"use server";
import Stripe from 'stripe';
import { redirect } from "next/navigation";

export async function createCheckoutSession(formData: FormData) {
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  const stripe = new Stripe(stripeKey!, {
    apiVersion: '2025-12-15.clover' as any, // Keeping your successful version!
  });

  let checkoutUrl = ""; // 1. Create a variable to hold the URL

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
      cancel_url: `https://coffee-app-25.vercel.app/`,
    });

    checkoutUrl = session.url!; // 2. Assign the URL inside the try block
    console.log("Stripe Session Created!");

  } catch (err: any) {
    console.error("Caught a real error:", err.message);
    throw err; 
  }

  // 3. DO THE REDIRECT HERE (OUTSIDE THE TRY/CATCH)
  // This is the only way Next.js can see the redirect correctly
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}