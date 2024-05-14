interface DashboardContentProps {
  children: React.ReactNode;
}

export const DashboardContent = (props: DashboardContentProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      {props.children}
    </div>
  );
};

export default DashboardContent;
