"use server";
import Stripe from 'stripe';
import { redirect } from "next/navigation";

export async function createCheckoutSession(formData: FormData) {
  // We use the variable name Vercel expects
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    console.error("STRIPE_SECRET_KEY is missing!");
    throw new Error("Key missing");
  }

  const stripe = new Stripe(stripeKey); 
  let url = "";

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
      // Hardcoded for zero room for error
      success_url: `https://coffee-app-25.vercel.app/success`,
      cancel_url: `https://coffee-app-25.vercel.app/`,
    });
    
    url = session.url!;
  } catch (err: any) {
    console.error("STRIPE API ERROR:", err.message);
    throw err;
  }

  if (url) {
    redirect(url);
  }
}