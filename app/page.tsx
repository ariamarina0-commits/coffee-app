export const dynamic = "force-dynamic";
import { createCheckoutSession } from "./actions/checkout";
import { createClient } from "@supabase/supabase-js";

export default async function Home() { 
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fff4e6]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-orange-100">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-3xl font-black text-gray-800">Buy Me a Coffee</h1>
        </div>

        <form action={createCheckoutSession} className="space-y-4">
          <input name="name" type="text" placeholder="Your Name" required className="w-full p-4 rounded-xl border border-gray-200 text-black" />
          <textarea name="message" placeholder="Leave a message..." className="w-full p-4 rounded-xl border border-gray-200 text-black" />
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg">
            Support $5
          </button>
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