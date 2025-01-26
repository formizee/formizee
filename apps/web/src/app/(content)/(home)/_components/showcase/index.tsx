'use client';

import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';
import Image from 'next/image';

import lightImage from '@public/showcase-light.webp';
import darkImage from '@public/showcase-dark.webp';
import {BlurFade} from '@/components/blur-fade';

export const Showcase = () => {
  const [mounted, setMounted] = useState(false);
  const {resolvedTheme} = useTheme();

  useEffect(() => {
    //setTimeout(() => setMounted(true), 500);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[863px] w-[1400px] mt-16 sm:mt-24" />;
  }

  return (
    <BlurFade
      className="flex overflow-hidden w-full justify-start xl:justify-center mt-16 sm:mt-24 select-none"
      inView
      delay={0.5}
    >
      <Image
        src={resolvedTheme === 'light' ? lightImage : darkImage}
        className="max-w-[1400px] h-[500px] sm:h-auto"
        alt="Formizee Showcase"
        priority
      />
    </BlurFade>
  );
};
