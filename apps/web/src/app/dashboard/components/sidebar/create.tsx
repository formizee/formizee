import {Button} from '@/components/ui';
import {DocumentAddIcon} from '@/components/ui/icons';

export const SidebarCreateForm = () => {
  return (
    <div className="flex flex-col">
      <Button className="my-1 mt-3 items-center justify-start">
        <DocumentAddIcon />
        <span>Create a new form</span>
      </Button>
    </div>
  );
};

export default SidebarCreateForm;
