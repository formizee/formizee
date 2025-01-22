import DateFormatter from './date-formatter';
import Image from 'next/image';
import Link from 'next/link';

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
    <section className="flex flex-col p-4">
      <Link className="group" href={`/blog/${props.slug}`}>
        <Image
          priority
          width={640}
          height={420}
          src={props.coverImage}
          alt={`Cover image for ${props.title}`}
          className="transition-all object-contain group-hover:shadow-md rounded-lg overflow-clip border dark:border-neutral-800"
        />
      </Link>
      <div className="mt-4 flex flex-row items-center justify-between">
        <h3 className="font-secondary text-xl font-bold">{props.title}</h3>
        <DateFormatter
          dateString={props.date}
          className="text-xs sm:text-sm font-secondary"
        />
      </div>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        {props.description}
      </p>
    </section>
  );
};
