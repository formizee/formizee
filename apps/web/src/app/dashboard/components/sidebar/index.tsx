import CreateFormButton from './create';
import Account from './account';
import Forms from './forms';

export function DashboardSidebar(): JSX.Element {
  return (
    <div className="flex w-full flex-col justify-between px-2 md:w-60 md:border-r md:border-r-neutral-800">
      <CreateFormButton />
      <Forms forms={[]} />
      <Account username="@pauchiner" />
    </div>
  );
}

export default DashboardSidebar;
