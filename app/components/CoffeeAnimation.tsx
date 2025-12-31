"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CoffeeProps {
  src: string;
  className?: string; // Flexible sizing
}

export default function CoffeeAnimation({ src, className }: CoffeeProps) {
  return (
    <div className={`${className} flex items-center justify-center mx-auto`}>
      <DotLottieReact
        src={src}
        loop
        autoplay
        style={{ width: '100%', height: '100%' }} // Ensures it fills the container
      />
    </div>
  );
}