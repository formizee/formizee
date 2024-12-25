import {getBySlug, markdownStyles, markdownToHtml} from '@/lib/markdown';
import {Transition} from '@/components';
import {notFound} from 'next/navigation';
import DateFormatter from '../_components/date-formatter';
import {BlurFade} from '@/components/blur-fade';

export default async function Page(props: {params: {slug: string}}) {
  const post = getBySlug(props.params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || '');

  return (
    <BlurFade className="flex flex-grow w-full items-center flex-col px-4 mt-32">
      <div className="flex flex-col w-full max-w-[700px]">
        <div className="rounded-md overflow-clip aspect-video border dark:border-neutral-800" />
        <div className="mt-4 flex flex-row items-center justify-between">
          <h3 className="font-secondary text-xl font-bold">{post.title}</h3>
          <DateFormatter
            dateString={post.date}
            className="text-sm font-secondary"
          />
        </div>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {post.author}
        </p>
      </div>
      <Transition className="flex flex-col w-full max-w-[700px]">
        <article
          className={markdownStyles.markdown}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{__html: content}}
        />
      </Transition>
    </BlurFade>
  );
}
