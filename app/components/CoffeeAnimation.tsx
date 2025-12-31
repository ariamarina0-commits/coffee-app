"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CoffeeProps {
  src: string;
  size: string;
}

export default function CoffeeAnimation({ src, size }: CoffeeProps) {
  return (
    <div className={`${size} flex items-center justify-center overflow-hidden`}>
      <DotLottieReact
        src={src}
        loop
        autoplay
      />
    </div>
  );
}