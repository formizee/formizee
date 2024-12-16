'use client';

import lightSign from '@/../public/light-sign.webp';
import darkSign from '@/../public/dark-sign.webp';
import {useTheme} from 'next-themes';
import Image from 'next/image';

export const Signature = () => {
  const {resolvedTheme} = useTheme();

  return (
    <Image
      src={resolvedTheme === 'light' ? lightSign : darkSign}
      width={96}
      height={57}
      alt="Pau Chiner's signature"
    />
  );
};
