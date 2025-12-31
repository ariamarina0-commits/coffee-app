export const dynamic = "force-dynamic";
import { createCheckoutSession } from "./actions/checkout";
import { createClient } from "@supabase/supabase-js";
import CoffeeAnimation from "./components/CoffeeAnimation";

export default async function Home() { 
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fff4e6]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-orange-100">
        <div className="text-center mb-8">
          <CoffeeAnimation src="/Coffee-love.json" className="w-32 h-32" />
          <h1 className="text-3xl font-black text-gray-800">Buy Me a Coffee</h1>
        </div>

        <form action={createCheckoutSession} className="space-y-4">
          <input name="name" type="text" placeholder="Your Name" required className="w-full p-4 rounded-xl border border-gray-200 text-black" />
          <textarea name="message" placeholder="Leave a message..." className="w-full p-4 rounded-xl border border-gray-200 text-black" />
          <div className="flex flex-col gap-6 w-full max-w-md">
            
            <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
              {/* SMALL BUTTON */}
              <button type="submit" name="amount" value="300" className="group flex flex-col items-center p-4 border-2 rounded-3xl hover:border-orange-500 transition-all">
                <div className="w-16 h-16">
                  <CoffeeAnimation src="/medium-coffee-cup.json" className="w-16 h-16 transition-transform group-hover:scale-110" />
                </div>
                <span className="font-bold">Small</span>
                <span className="text-orange-600">€3</span>
              </button>

              {/* MEDIUM BUTTON */}
              <button type="submit" name="amount" value="500" className="group flex flex-col items-center p-4 border-2 rounded-3xl border-orange-400 bg-orange-50 scale-105 shadow-md">
                <div className="w-16 h-16">
                  <CoffeeAnimation src="/medium-coffee-cup.json" className="w-16 h-16 transition-transform group-hover:scale-110" />
                </div>
                <span className="font-bold">Medium</span>
                <span className="text-orange-600">€5</span>
              </button>

              {/* LARGE BUTTON */}
              <button type="submit" name="amount" value="1000" className="group flex flex-col items-center p-4 border-2 rounded-3xl hover:border-orange-500 transition-all">
                <div className="w-16 h-16">
                  <CoffeeAnimation src="/medium-coffee-cup.json" className="w-16 h-16 transition-transform group-hover:scale-110" />
                </div>
                <span className="font-bold">Large</span>
                <span className="text-orange-600">€10</span>
              </button>
            </div>
          </div>
        </form>

        {/* This brings back the list of donors */}
        <DonationList />
      </div>
    </main>
  );
}

async function DonationList() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return <p className="text-gray-500 text-center mt-8 italic">Check Supabase Keys...</p>;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });

  if (!donations || donations.length === 0) {
    return <p className="text-gray-500 text-center mt-8">No donations yet. Be the first!</p>;
  }

  return (
    <div className="mt-12 w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Recent Support</h2>
      <div className="space-y-4">
        {donations.map((d) => (
          <div key={d.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-500/10">
            <p className="font-bold text-orange-900">{d.sender_name} bought a coffee</p>
            {d.message && <p className="text-gray-600 italic text-sm">"{d.message}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}