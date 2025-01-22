import Image from 'next/image';

type Props = {
  title: string;
  src: string;
};

const CoverImage = ({title, src}: Props) => {
  return (
    <Image
      priority
      src={src}
      alt={`Cover image for ${title}`}
      width={718}
      height={403}
      className="object-contain rounded-lg overflow-clip border dark:border-neutral-800"
    />
  );
};

export default CoverImage;
