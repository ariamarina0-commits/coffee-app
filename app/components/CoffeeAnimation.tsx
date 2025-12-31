"use client"; // This is the "magic" line that makes animations work

import { DotLottiePlayer } from '@dotlottie/react-player';

interface CoffeeProps {
  src: string;
  size: string;
}

export default function CoffeeAnimation({ src, size }: CoffeeProps) {
  return (
    /* We wrap it in a div so we can control the size from the main page */
    <div className={`${size} flex items-center justify-center overflow-hidden`}>
      <DotLottiePlayer
        src={src}
        autoplay
        loop
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}