import {Transition} from '@/components';
import {Signature} from './_components/signature';

export default function Page() {
  return (
    <Transition className="flex flex-grow w-full items-center flex-col px-4 mt-32">
      <h1 className="font-bold text-2xl sm:text-4xl">Made With Love</h1>
      <h2 className="font-secondary text-sm mt-2">
        a love letter to all indie developers
      </h2>
      <section className="flex flex-col w-full max-w-[700px]">
        <p className="text-neutral-600 dark:text-neutral-400 mt-16">
          Formizee is a small, independent SaaS built and run by one person.
          It’s not backed by venture capital or part of a big tech company. It’s
          just me doing what I love: creating software that matters.
          <br />
          <br />I built Formizee because I’m passionate about open source and
          the beauty of software crafted with care. To me, web forms are such a
          common need that they should be simple, affordable, and powered by
          modern, reliable technology—not left behind on outdated servers.
          That’s why I’ve poured so much energy into making Formizee innovative,
          fast, and full of thoughtful features.
          <br />
          <br />
          I’m far from perfect, and Formizee is proof of that. It’s a reflection
          of my journey—learning, growing, and building as this project evolves.
          <br />
          <br />
          Formizee is not software; it’s a love letter to indie software
          developers and to you, the people who support and inspire me to keep
          going every single day. Thank you for being part of this story.
        </p>
        <div className="flex flex-row mt-12 gap-4 justify-start items-center">
          <img
            src="https://cdn.bsky.app/img/avatar/plain/did:plc:xwn3jzsld3cjlwppwhjgjzpq/bafkreihvmsypm5cvzkxkwuasfrfz7wi4i237ae42obc7ylh225xky64goy@jpeg"
            width={48}
            height={48}
            alt="Pau Chiner's face"
            className="mt-1 rounded-full bg-neutral-300 dark:bg-neutral-700"
          />
          <Signature />
        </div>
        <div className="flex mt-8 gap-4 items-center">
          <p className="font-secondary mt-4">
            This page is highly inspired by{' '}
            <a className="underline" href="https://logsnag.com/run-by-a-human">
              Shayan
            </a>
          </p>
        </div>
      </section>
    </Transition>
  );
}
