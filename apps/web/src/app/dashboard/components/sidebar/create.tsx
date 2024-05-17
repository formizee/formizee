import { Button } from '@formizee/ui';
import { DocumentAddIcon } from '@formizee/ui/icons';

export function SidebarCreateForm(): JSX.Element {
  return (
    <div className="flex flex-col">
      <Button className="my-1 mt-3 items-center justify-start">
        <DocumentAddIcon />
        <span>Create a new form</span>
      </Button>
    </div>
  );
}

export default SidebarCreateForm;
