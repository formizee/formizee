'use client';

import {CodeBlock as Component} from '@/components/code-block';
import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';
import {STACKS, DATA} from './data';
import type {Stack} from './types';
import {Sidebar} from './sidebar';
import {Topbar} from './topbar';
import {BlurFade} from '@/components/blur-fade';
import {Footer} from './footer';

export const CodeBlock = () => {
  const [stack, setStack] = useState<Stack | undefined>(STACKS[0]);
  const [example, setExample] = useState(DATA[0]);
  const [mounted, setMounted] = useState(false);
  const {resolvedTheme} = useTheme();

  useEffect(() => {
    setExample(DATA.find(example => example.stack === stack?.stack));
  }, [stack]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[29.3rem] max-w-[62rem] rounded-lg mt-16" />
    );
  }

  return (
    <BlurFade
      delay={0.5}
      inView
      className="w-full max-w-[62rem] border dark:border-neutral-800 rounded-lg mt-16 shadow-sm"
    >
      <Topbar example={example} stack={stack} setStack={setStack} />
      <div className="flex flex-col sm:flex-row h-[24rem] p-2 sm:p-4 overflow-scroll overflow-light-style dark:overflow-dark-style">
        <Sidebar
          stack={stack}
          current={example}
          examples={DATA}
          setExample={setExample}
        />
        <Component
          key={example?.name}
          className="overflow-scroll overflow-light-style dark:overflow-dark-style w-full h-full"
          color={stack?.color ?? 'green'}
          language={example?.language ?? 'html'}
          theme={resolvedTheme === 'light' ? 'light' : 'dark'}
        >
          {example?.code ?? ''}
        </Component>
      </div>
      <Footer example={example} />
    </BlurFade>
  );
};
