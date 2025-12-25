import { createCheckoutSession } from "./actions/checkout";
import { createClient } from "@supabase/supabase-js";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fff4e6]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-orange-100">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-3xl font-black text-gray-800">Buy Me a Coffee</h1>
        </div>

        {/* We use a 'form' with an 'action' now! */}
        <form action={createCheckoutSession} className="space-y-4">
          <input 
            name="name" // The 'name' attribute is very important!
            type="text" 
            placeholder="Your Name"
            required
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-black"
          />
          <textarea 
            name="message"
            placeholder="Leave a message..."
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-black"
          />
          <button 
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
          >
            Support $5
          </button>
        </form>
        <DonationList />
      </div>
    </main>
  );
}


async function DonationList() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Ask the notebook for all donations, newest first
  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });

  if (!donations || donations.length === 0) {
    return <p className="text-gray-500 text-center mt-8">No donations yet. Be the first!</p>;
  }

  return (
    <div className="mt-12 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Support</h2>
      <div className="space-y-4">
        {donations.map((d) => (
          <div key={d.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
            <p className="font-bold text-orange-900">{d.sender_name} bought a coffee</p>
            {d.message && <p className="text-gray-600 italic">"{d.message}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}