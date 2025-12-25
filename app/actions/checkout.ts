"use server";

// 1. TOOLS
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// 2. SETUP (Connecting to your notebook)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 3. THE INSTRUCTIONS
export async function createCheckoutSession(formData: FormData) {
  // Pull the data out of the form
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const amount = 5;

  // A. Save to Supabase (The Notebook)
  const { error } = await supabase
    .from('donations')
    .insert([{ 
      sender_name: name, 
      message: message, 
      amount: amount * 100 
    }]);

  if (error) {
    console.error("Supabase Error:", error.message);
  }

  // B. Talk to Stripe (The Cash Register)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { 
            name: "Coffee for Creator",
            description: `Message: ${message}` 
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/`,
  });

  // C. Send the user to the Stripe website
  redirect(session.url!);
}