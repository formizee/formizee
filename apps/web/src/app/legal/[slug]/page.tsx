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
    <main className="flex flex-grow w-full items-center flex-col px-4 mt-32">
      <Navbar />
      <h1 className="font-bold text-2xl sm:text-4xl">{post.title}</h1>
      <time className="font-secondary text-sm max-w-96 text-center mt-4">
        {post.date}
      </time>
      <Transition className="flex flex-col w-full max-w-[700px]">
        <div
          className={markdownStyles.markdown}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{__html: content}}
        />
      </Transition>
    </main>
  );
}
