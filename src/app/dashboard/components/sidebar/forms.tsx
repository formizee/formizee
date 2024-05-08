import {Button} from '@/components/ui';
import {DocumentIcon} from '@/components/ui/icons';

interface SidebarFormsItemProps {
  selected: boolean;
  children: string;
}

interface SidebarForms {
  forms: Array<any>;
}

const SidebarFormsItem = (props: SidebarFormsItemProps) => {
  return (
    <Button
      className="mx-0.5 my-1.5 w-48 items-center justify-start"
      variant={props.selected ? 'outline' : 'ghost'}>
      <DocumentIcon className="max-h-4 min-h-4 min-w-4 max-w-4" />
      <span className="truncate">{props.children}</span>
    </Button>
  );
};

export const SidebarForms = (props: SidebarForms) => {
  if (props.forms.length === 0) return <></>;

  return (
    <div className="flex h-full flex-col items-start overflow-y-auto">
      {props.forms.map(item => (
        <SidebarFormsItem selected={item.selected}>
          {item.title}
        </SidebarFormsItem>
      ))}
    </div>
  );
};

export default SidebarForms;
