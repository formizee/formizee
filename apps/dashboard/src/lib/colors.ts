export type Color =
  | 'violet'
  | 'indigo'
  | 'cyan'
  | 'pink'
  | 'amber'
  | 'teal'
  | 'lime'
  | 'red'
  | 'gray'
  | 'white';

export const getColor = (color: Color = 'gray', selected?: boolean) => {
  switch (color) {
    case 'violet':
      return {
        fill: selected
          ? 'fill-violet-600 dark:fill-violet-500'
          : 'fill-violet-600/70 dark:fill-violet-500/70',
        text: selected
          ? 'text-violet-600 dark:text-violet-500'
          : 'text-violet-600/70 dark:text-violet-500/70'
      };
    case 'indigo':
      return {
        fill: selected
          ? 'fill-indigo-600 dark:fill-indigo-500'
          : 'fill-indigo-600/70 dark:fill-indigo-500/70',
        text: selected
          ? 'text-indigo-600 dark:text-indigo-500'
          : 'text-indigo-600/70 dark:text-indigo-500/70'
      };
    case 'cyan':
      return {
        fill: selected
          ? 'fill-cyan-600 dark:fill-cyan-500'
          : 'fill-cyan-600/70 dark:fill-cyan-500/70',
        text: selected
          ? 'text-cyan-600 dark:text-cyan-500'
          : 'text-cyan-600/70 dark:text-cyan-500/70'
      };
    case 'pink':
      return {
        fill: selected
          ? 'fill-pink-600 dark:fill-pink-500'
          : 'fill-pink-600/70 dark:fill-pink-500/70',
        text: selected
          ? 'text-pink-600 dark:text-pink-500'
          : 'text-pink-600/70 dark:text-pink-500/70'
      };
    case 'amber':
      return {
        fill: selected
          ? 'fill-amber-600 dark:fill-amber-500'
          : 'fill-amber-600/70 dark:fill-amber-500/70',
        text: selected
          ? 'text-amber-600 dark:text-amber-500'
          : 'text-amber-600/70 dark:text-amber-500/70'
      };
    case 'teal':
      return {
        fill: selected
          ? 'fill-teal-600 dark:fill-teal-500'
          : 'fill-teal-600/70 dark:fill-teal-500/70',
        text: selected
          ? 'text-teal-600 dark:text-teal-500'
          : 'text-teal-600/70 dark:text-teal-500/70'
      };
    case 'lime':
      return {
        fill: selected
          ? 'fill-lime-600 dark:fill-lime-500'
          : 'fill-lime-600/70 dark:fill-lime-500/70',
        text: selected
          ? 'text-lime-600 dark:text-lime-500'
          : 'text-lime-600/70 dark:text-lime-500/70'
      };
    case 'red':
      return {
        fill: selected
          ? 'fill-red-600 dark:fill-red-500'
          : 'fill-red-600/70 dark:fill-red-500/70',
        text: selected
          ? 'text-red-600 dark:text-red-500'
          : 'text-red-600/70 dark:text-red-500/70'
      };
    default:
      return {
        fill: selected
          ? 'fill-neutral-950 dark:fill-neutral-50'
          : 'fill-neutral-500 dark:fill-neutral-400',
        text: selected
          ? 'text-neutral-950 dark:text-neutral-50'
          : 'text-neutral-500 dark:text-neutral-400'
      };
  }
};
