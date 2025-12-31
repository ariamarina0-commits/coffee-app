"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CoffeeProps {
  src: string;
  className?: string; // Flexible sizing
}

export default function CoffeeAnimation({ src, className }: CoffeeProps) {
  return (
    <div className={className}>
      <DotLottieReact
        src={src}
        loop
        autoplay
      />
    </div>
  );
}