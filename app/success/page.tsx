import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-green-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl text-center border border-green-100">
        <div className="text-6xl mb-4 text-green-500">✅</div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Payment Received!</h1>
        <p className="text-gray-600 mb-8">
          Thank you so much for the coffee. It means the world to me!
        </p>
        <Link 
          href="/" 
          className="inline-block bg-gray-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-900 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}