interface Props {
  children: React.ReactNode;
}

export const LaunchBanner = (props: Props) => {
  return (
    <div className="z-50 fixed font-secondary text-xs top-16 flex w-full dark:bg-neutral-950/80 bg-neutral-50/80 backdrop-blur-sm border-b dark:border-neutral-800 h-8 items-center justify-center  animate-in slide-in-from-top-5 fade-in duration-1000">
      <span>{props.children}</span>
    </div>
  );
};
