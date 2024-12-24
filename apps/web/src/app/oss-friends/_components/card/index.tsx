import {LinkIcon} from '@formizee/ui/icons';

interface Props {
  name: string;
  href: string;
  children: React.ReactNode;
}

export const ProductCard = (props: Props) => {
  const faviconHref = new URL(props.href).host;

  return (
    <a
      className="transition-all group"
      href={props.href}
      target="_blank"
      rel="noreferrer"
    >
      <article className="flex flex-col h-32 max-w-96 rounded-md border dark:border-neutral-800 gap-4 p-4 group-hover:shadow-md">
        <h3 className="flex flex-row gap-2 items-center font-secondary text-xl font-bold">
          <img
            className="grayscale rounded-[0.25rem]"
            width={16}
            height={16}
            alt={`${props.name} favicon`}
            src={`https://icons.duckduckgo.com/ip3/${faviconHref}.ico`}
          />
          {props.name}
          <LinkIcon className="text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-950 dark:group-hover:text-neutral-50 group-hover:mb-1" />
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {props.children}
        </p>
      </article>
    </a>
  );
};
