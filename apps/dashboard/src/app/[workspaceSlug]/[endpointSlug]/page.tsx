import {redirect} from 'next/navigation';
import {auth} from '@/lib/auth';

const EndpointPage = async ({params}: {params: {endpointSlug: string}}) => {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <main className="animate-out fade-out-100 opacity-0 fill-mode-forwards">
      <h1 className="font-bold text-4xl">{params.endpointSlug}</h1>
    </main>
  );
};

export default EndpointPage;
