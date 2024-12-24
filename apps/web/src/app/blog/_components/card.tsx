import Link from 'next/link';
import DateFormatter from './date-formatter';

interface Props {
  description: string;
  coverImage: string;
  author: string;
  title: string;
  date: string;
  slug: string;
}

export const PostCard = (props: Props) => {
  return (
    <section className="flex flex-col p-4 w-full max-w-[750px]">
      <Link className="group" href={`/blog/${props.slug}`}>
        <div className="transition-all group-hover:shadow-md rounded-md overflow-clip aspect-video border dark:border-neutral-800" />
      </Link>
      <div className="mt-4 flex flex-row items-center justify-between">
        <h3 className="font-secondary text-xl font-bold">{props.title}</h3>
        <DateFormatter
          dateString={props.date}
          className="text-sm font-secondary"
        />
      </div>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        {props.description}
      </p>
    </section>
  );
};
