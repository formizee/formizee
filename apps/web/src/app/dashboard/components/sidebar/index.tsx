import CreateFormButton from './create';
import Account from './account';
import Forms from './forms';

const FORMS = [
  {
    title: 'My homepage',
    selected: false
  },
  {
    title: 'Another Project',
    selected: false
  },
  {
    title: 'My Bussiness Saas',
    selected: false
  },
  {
    title: 'My homepage askljfaklsdjflkasjdklfj',
    selected: false
  },
  {
    title: 'Another Project',
    selected: false
  },
  {
    title: 'My Bussiness Saas',
    selected: false
  },
  {
    title: 'My homepage',
    selected: false
  },
  {
    title: 'Another Project',
    selected: false
  },
  {
    title: 'My Bussiness Saas',
    selected: false
  }
];

export function DashboardSidebar() {
  return (
    <div className="flex w-60 flex-col justify-between border-r border-r-neutral-800 px-2">
      <CreateFormButton />
      <Forms forms={FORMS} />
      <Account username="@pauchiner" />
    </div>
  );
}

export default DashboardSidebar;
