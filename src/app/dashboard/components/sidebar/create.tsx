import {Button} from '@/components/ui';

export const SidebarCreateForm = () => {
  return (
    <div className="flex flex-col">
      <Button className="my-1 mt-3 items-center justify-start">
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4.75 4.75a.75.75 0 0 0-1.5 0v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5Z"
            clipRule="evenodd"
          />
        </svg>
        <span>Create a new form</span>
      </Button>
    </div>
  );
};

export default SidebarCreateForm;
