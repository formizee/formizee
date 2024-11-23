import {LoadingIcon} from '@formizee/ui/icons';

export const DialogLoading = () => {
  return (
    <div className="flex min-h-[700px] md:max-h-[700px] w-full h-full items-center justify-center">
      <LoadingIcon className="size-16 -mt-4" />
    </div>
  );
};
