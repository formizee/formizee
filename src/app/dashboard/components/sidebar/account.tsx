import {Button} from '@/components/ui';

interface SidebarAccountProps {
  username: string;
}

export const SidebarAccount = (props: SidebarAccountProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Button variant="outline" className="m-3 w-full">
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <span>{props.username}</span>
      </Button>
    </div>
  );
};

export default SidebarAccount;
