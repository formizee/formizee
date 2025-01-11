import {type Color, getColor} from '@/lib/colors';
import {cn} from '@formizee/ui';

interface Props {
  color: Color;
  name: string;
  url: string;
}

export const FileLink = ({url, name, color}: Props) => {
  return (
    <a
      className={cn(getColor(color).text, 'hover:underline')}
      title={`Download ${name}`}
      rel="noreferrer"
      target="_blank"
      href={url}
    >
      {name}
    </a>
  );
};
