import CreateFormButton from './create';
import Account from './account';
import Forms from './forms';

export function DashboardSidebar(): JSX.Element {
  return (
    <div className="flex w-60 flex-col justify-between border-r border-r-neutral-800 px-2">
      <CreateFormButton />
      <Forms forms={[]} />
      <Account username="@pauchiner" />
    </div>
  );
}

export default DashboardSidebar;
