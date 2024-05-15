import { Button } from '@/components/ui';
import { DocumentIcon } from '@/components/ui/icons';
import { Endpoint } from 'domain/models';

interface SidebarFormsItemProps {
  children: string;
}

interface SidebarForms {
  forms: Array<Endpoint>;
}

function SidebarFormsItem(props: SidebarFormsItemProps) {
  return (
    <Button
      className="mx-0.5 my-1.5 w-48 items-center justify-start"
      variant="ghost">
      <DocumentIcon className="max-h-4 min-h-4 min-w-4 max-w-4" />
      <span className="truncate">{props.children}</span>
    </Button>
  );
}

export function SidebarForms(props: SidebarForms) {
  if (props.forms.length === 0) return;

  return (
    <div className="flex h-full flex-col items-start overflow-y-auto">
      {props.forms.map(item => (
        <SidebarFormsItem key={item.uid}>{item.name}</SidebarFormsItem>
      ))}
    </div>
  );
}

export default SidebarForms;
