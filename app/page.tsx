import { createCheckoutSession } from "./actions/checkout";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <form action={createCheckoutSession}>
        <button type="submit" className="p-4 bg-orange-500 text-white rounded">
          Pay $5
        </button>
      </form>
    </main>
  );
}