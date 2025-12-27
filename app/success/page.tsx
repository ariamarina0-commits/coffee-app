"use client"; // Required for animations/effects
import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    // This runs as soon as the user lands on the page
    const duration = 3 * 1000; // 3 seconds
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f97316', '#fbbf24'] // Coffee-orange and gold
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f97316', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff4e6] text-center px-4">
      <h1 className="text-5xl font-bold text-orange-600 mb-4">You're Amazing! ☕</h1>
      <p className="text-xl text-gray-700 max-w-md">
        Your support has been received. Thanks for keeping the code (and the caffeine) flowing!
      </p>
      
      <Link 
        href="/" 
        className="mt-10 px-8 py-4 bg-orange-500 text-white font-bold rounded-full shadow-lg hover:bg-orange-600 hover:scale-105 transition-all"
      >
        Back to the App
      </Link>
    </div>
  );
}