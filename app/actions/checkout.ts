"use server";
import Stripe from 'stripe';
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function createCheckoutSession(formData: FormData) {
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  const stripe = new Stripe(stripeKey!, {
    apiVersion: '2025-12-15.clover' as any,
  });

  let checkoutUrl = "";

  // 1. DATABASE STEP (Wrapped in its own try/catch so it can't kill the Stripe step)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const name = formData.get("name") as string || "Anonymous";
    const message = formData.get("message") as string || "";

    await supabase.from('donations').insert([
      { sender_name: name, message: message, amount: 500 }
    ]);
    console.log("DB Insert Successful");
  } catch (dbError) {
    console.error("Database failed, but continuing to Stripe:", dbError);
  }

  // 2. STRIPE STEP
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

    checkoutUrl = session.url!;
  } catch (err: any) {
    console.error("Stripe Error:", err.message);
    throw err; 
  }

  // 3. REDIRECT (Must be outside all try/catch blocks)
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}