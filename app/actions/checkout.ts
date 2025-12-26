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

  // A. Get form data
  const name = formData.get("name") as string || "Anonymous";
  const message = formData.get("message") as string || "";

  // B. DATABASE STEP (Wrapped in its own safety block)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Save the donation info BEFORE going to Stripe
    await supabase.from('donations').insert([
      { sender_name: name, message: message, amount: 500 }
    ]);
  } catch (dbError) {
    console.error("Database failed, but moving to Stripe:", dbError);
  }

  // C. STRIPE STEP
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `Coffee from ${name}` },
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

  // D. REDIRECT (Keep this outside all brackets!)
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}