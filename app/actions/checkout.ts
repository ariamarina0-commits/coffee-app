"use server";

import { getStripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const maxDuration = 30;
export const runtime = 'nodejs';

export async function createCheckoutSession(formData: FormData) {
  // 1. SETTINGS - Update this to your actual Vercel URL
  const baseUrl = "https://coffee-app-25.vercel.app"; 
  let redirectUrl = "";

  // TEMPORARY TEST - Replace process.env with your actual key string
  const stripe = new Stripe("sk_test_51SiN7N8Xiy0YoJ6NjiAMEySp40PxW10Ztf69Lvd1luG2XR8kudIcLEUmGBtSmMKQyMMdBAYHz1JVhceE19Ymhjrd00UhmOlWiC", {
    apiVersion: '2024-12-18.acacia' as any,
    timeout: 20000,
  });
  
  // 2. DATA EXTRACTION
  const name = formData.get("name") as string || "Anonymous";
  const message = formData.get("message") as string || "";
  const amount = 500; // $5.00 in cents

  try {
    // 3. DATABASE CHECK
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: dbError } = await supabase.from('donations').insert([
      { sender_name: name, message: message, amount: amount }
    ]);

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    // 4. STRIPE CHECK
    const stripe = getStripe();
    if (!stripe) throw new Error("Stripe secret key is missing from Vercel settings!");

    // 5. SESSION CREATION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { 
            name: "Coffee for Creator",
            description: `From: ${name}`
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/`,
    });

    if (!session.url) throw new Error("Stripe failed to generate a redirect URL.");

    // 6. REDIRECT
    redirect(session.url);

  } catch (error: any) {
    console.error("CRITICAL ERROR:", error.message);
    // This sends the specific error back to the Vercel logs
    throw new Error(`Checkout Failed: ${error.message}`);
  }
}