import {BookIcon} from '@formizee/ui/icons';
import {FeedbackButton} from './feedback';
import {AccountButton} from './account';
import {Button} from '@formizee/ui';
import Link from 'next/link';

interface NavbarProps {
  userId: string;
}

export const Navbar = (props: NavbarProps) => {
  return (
    <nav className="z-50 flex flex-row bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md right-4 fixed rounded-bl-md">
      <Options {...props} />
    </nav>
  );
};

export const Options = (props: NavbarProps) => {
  return (
    <div className="flex flex-row justify-end p-4 gap-2">
      <Button variant="outline" asChild>
        <Link
          href="https://docs.formizee.com"
          target="_blank"
          className="flex flex-row items-center gap-2"
        >
          <BookIcon />
          Docs
        </Link>
      </Button>
      <FeedbackButton />
      <AccountButton userId={props.userId} />
    </div>
  );
};
