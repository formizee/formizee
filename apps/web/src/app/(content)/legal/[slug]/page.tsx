import {getBySlug, markdownStyles, markdownToHtml} from '@/lib/markdown';
import {BlurFade} from '@/components/blur-fade';
import {notFound} from 'next/navigation';

export default async function Page(props: {params: {slug: string}}) {
  const post = getBySlug(props.params.slug, 'src/app/(content)/legal/_content');

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || '');

  return (
    <BlurFade className="flex flex-grow w-full items-center flex-col px-4 mt-32">
      <h1 className="font-bold text-2xl sm:text-4xl">{post.title}</h1>
      <time className="font-secondary text-sm max-w-96 text-center mt-4">
        {post.date}
      </time>
      <article className="flex flex-col w-full max-w-[700px]">
        <div
          className={markdownStyles.markdown}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{__html: content}}
        />
      </article>
    </BlurFade>
  );
}
