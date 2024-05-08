import {UserIcon} from '@/components/ui/icons';
import {Button} from '@/components/ui';

interface SidebarAccountProps {
  username: string;
}

export const SidebarAccount = (props: SidebarAccountProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Button variant="outline" className="m-3 w-full">
        <UserIcon />
        <span>{props.username}</span>
      </Button>
    </div>
  );
};

export default SidebarAccount;
