"use server";
import Stripe from 'stripe';
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function createCheckoutSession(formData: FormData) {
  // Use the trimmed key for safety
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  
  if (!stripeKey) {
    throw new Error("Stripe Secret Key is missing from environment variables.");
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-12-18.acacia' as any,
  });

  let checkoutUrl = "";

  // A. Get form data (Including the new 'amount' from the buttons)
  const name = formData.get("name") as string || "Anonymous";
  const message = formData.get("message") as string || "";
  
  // Get amount and convert to number. If it fails, default to 500 ($5)
  const amount = Number(formData.get("amount")) || 500;

  // B. DATABASE STEP
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Save the ACTUAL amount (300, 500, or 1000)
    await supabase.from('donations').insert([
      { 
        sender_name: name, 
        message: message, 
        amount: amount 
      }
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
          currency: "eur",
          product_data: { 
            name: `Support from ${name}`,
            description: `A ${amount/100}$ coffee support message: "${message}"`
          },
          unit_amount: amount, // Dynamic amount based on button click
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

  // D. REDIRECT (Still outside all brackets!)
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}