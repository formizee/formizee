import {redirect} from 'next/navigation';
import {auth} from '@/lib/auth';

const Dashboard = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }
};

export default Dashboard;
