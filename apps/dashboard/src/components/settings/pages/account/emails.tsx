import {EmailsTable, columns} from '../../components/tables/emails';
import Transition from '@/components/transition';
import emailIcon from '@/../public/email.webp';
import {api} from '@/trpc/client';
import Image from 'next/image';
import {PageError} from '../../components/error';
import {AddLinkedEmailButton} from '../../components/dialogs/emails';
import {AccountEmailsPageLoading} from '../../components/skeletons';

interface Props {
  userId: string;
}

export const SettingsAccountEmails = (props: Props) => {
  const emailsRequest = api.user.getEmails.useQuery({id: props.userId});
  const userRequest = api.user.get.useQuery({id: props.userId});

  if (emailsRequest.isLoading || userRequest.isLoading) {
    return <AccountEmailsPageLoading />;
  }

  if (emailsRequest.error || userRequest.error) {
    return <PageError />;
  }

  const user = userRequest.data;

  const emails = emailsRequest.data.map(email => {
    return {
      isPrimary: email.email === user.email,
      ...email
    };
  });

  return (
    <Transition className="flex flex-col w-full">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
        <div className="flex flex-row gap-4">
          <Image
            height={48}
            width={48}
            src={emailIcon}
            alt="Email Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col gap-1 items-start">
            <span className="font-medium">Linked Emails</span>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage your linked emails and notifications
            </p>
          </div>
        </div>
        <AddLinkedEmailButton />
      </section>
      <EmailsTable columns={columns} data={emails} />
    </Transition>
  );
};
