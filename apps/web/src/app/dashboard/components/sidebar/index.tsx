import CreateFormButton from './create';
import Account from './account';
import Forms from './forms';

const FORMS = [
  {
    uid: '1',
    name: 'My homepage'
  },
  {
    uid: '2',
    name: 'Another Project'
  },
  {
    uid: '13',
    name: 'My Bussiness Saas'
  },
  {
    uid: '14',
    name: 'My homepage askljfaklsdjflkasjdklfj'
  },
  {
    uid: '15',
    name: 'Another Project'
  },
  {
    uid: '16',
    name: 'My Bussiness Saas'
  },
  {
    uid: '17',
    name: 'My homepage'
  },
  {
    uid: '18',
    name: 'Another Project'
  },
  {
    uid: '19',
    name: 'My Bussiness Saas'
  }
];

export function DashboardSidebar(): JSX.Element {
  return (
    <div className="flex w-60 flex-col justify-between border-r border-r-neutral-800 px-2">
      <CreateFormButton />
      <Forms forms={FORMS} />
      <Account username="@pauchiner" />
    </div>
  );
}

export default DashboardSidebar;
