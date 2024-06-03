interface DashboardContentProps {
  children: React.ReactNode;
}

export function DashboardContent(props: DashboardContentProps): JSX.Element {
  return (
    <div className="disp hidden w-full flex-col items-center justify-center md:flex">
      {props.children}
    </div>
  );
}

export default DashboardContent;
