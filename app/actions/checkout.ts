"use server";

import { getStripe } from "@/lib/stripe"; // Note: we changed this to getStripe
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createCheckoutSession(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const amount = 5;

  // 1. Get Stripe safely
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured correctly.");
  }

  // 2. Save to Supabase
  await supabase.from('donations').insert([{ 
    sender_name: name, 
    message: message, 
    amount: amount * 100 
  }]);

  // 3. Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "Coffee for Creator" },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `https://coffee-app-25.vercel.app/success`, // Update this!
    cancel_url: `https://coffee-app-25.vercel.app/`,
  });

  redirect(session.url!);
}