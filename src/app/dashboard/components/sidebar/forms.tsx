import {Button} from '@/components/ui';

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
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="max-h-4 min-h-4 min-w-4 max-w-4">
        <path
          fillRule="evenodd"
          d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm1 5.75A.75.75 0 0 1 5.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 7.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
          clipRule="evenodd"
        />
      </svg>
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
