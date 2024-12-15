import {getBySlug, markdownStyles, markdownToHtml} from '@/lib/markdown';
import {Navbar, Transition} from '@/components';
import {notFound} from 'next/navigation';

export default async function Page(props: {params: {slug: string}}) {
  const post = getBySlug(props.params.slug, 'src/app/legal/_content');

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || '');

  return (
    <main className="flex flex-grow items-center justify-center overflow-x-clip">
      <Navbar />
      <Transition className="mx-6 my-28 max-w-[800px]">
        <h1 className="font-secondary font-semibold text-4xl text-neutral-950 dark:text-neutral-50 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-2 text-lg font-secondary text-neutral-600 dark:text-neutral-500">
          {post.date}
        </p>
        <div
          className={markdownStyles.markdown}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{__html: content}}
        />
      </Transition>
    </main>
  );
}
