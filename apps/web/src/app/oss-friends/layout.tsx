import {BaseLayout} from '@/components/layouts';

export default function Layout({children}: {children: React.ReactNode}) {
  return <BaseLayout>{children}</BaseLayout>;
}
