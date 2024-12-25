import {AnimatedList, AnimatedListItem} from '@/components/animated-list';
import Item from './item';

const data = [
  {
    name: 'Maximilian Kaske',
    email: 'mxkaske@openstatus.dev'
  },
  {
    name: 'Chronark',
    email: 'chronark@unkey.com'
  },
  {
    name: 'Dries Augustyns',
    email: 'driaug@useplunk.com'
  },
  {
    name: 'Pau Chiner',
    email: 'pauchiner@formizee.com'
  },
  {
    name: 'Glauber Costa',
    email: 'glcst@turso.tech'
  },
  {
    name: 'Matt Aitken',
    email: 'mattaitken@trigger.dev'
  },
  {
    name: 'Piotr Kulpinski',
    email: 'piotr@openalternative.co'
  },
  {
    name: 'Thibault Le Ouay',
    email: 'thibault@openstatus.dev'
  },
  {
    name: 'Shadcn',
    email: 'shadcn@shadcn.com'
  },
  {
    name: 'Guillermo Rauch',
    email: 'rauchg@vercel.com'
  }
];

export const CryptoItem = () => {
  return (
    <article className="relative flex flex-row w-full max-w-96 sm:max-w-[36rem] h-80 overflow-hidden rounded-lg border dark:border-neutral-800 pt-0 pb-48 sm:pb-40 sm:pt-8 md:pb-60 shadow-sm">
      <div className="flex flex-col w-full items-center justify-center absolute top-6">
        <h4 className="text-2xl font-bold">Per-Tenant Encryption</h4>
        <p className="font-secondary font-medium text-neutral-400 dark:text-neutral-600 mt-2 text-md">
          Encrypted with AES-256
        </p>
      </div>
      <div className="flex w-full mt-28 sm:mt-20 ml-10 justify-start lg:ml-0 lg:justify-center">
        <AnimatedList delay={2000}>
          {data.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <AnimatedListItem key={index}>
              <Item {...item} />
            </AnimatedListItem>
          ))}
        </AnimatedList>
      </div>
    </article>
  );
};
