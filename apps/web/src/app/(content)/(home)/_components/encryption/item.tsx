'use client';

import {MailIcon, UserIcon} from '@formizee/ui/icons';
import {useEffect, useState} from 'react';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomString(length: number) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

interface Props {
  name: string;
  email: string;
}

export default function Item(props: Props) {
  const [nameLength, setNameLength] = useState(props.name.length);
  const [name, setName] = useState(props.name);
  const nameDefaultLength = props.name.length;

  const [emailLength, setEmailLength] = useState(props.email.length);
  const [email, setEmail] = useState(props.email);
  const emailDefaultLength = props.email.length;

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (animate) {
      const animation = setTimeout(() => {
        if (nameLength > 0) {
          setName(
            value =>
              value.substring(0, nameLength - 1) +
              generateRandomString(nameDefaultLength - nameLength)
          );
          setNameLength(length => length - 1);
        }
        if (emailLength > 0) {
          setEmail(
            value =>
              value.substring(0, emailLength - 1) +
              generateRandomString(emailDefaultLength - emailLength)
          );
          setEmailLength(length => length - 1);
        } else {
          setAnimate(false);
        }
      }, 25);

      return () => clearTimeout(animation);
    }

    const start = setTimeout(() => {
      setAnimate(true);
    }, 700);

    return () => clearTimeout(start);
  }, [animate, name, email, nameLength, emailLength]);

  return (
    <div className="flex flex-row gap-2 border dark:border-neutral-800 rounded-md shadow-sm">
      <span className="flex w-48 h-12 flex-grow gap-2 items-center px-4 py-2 border-r dark:border-neutral-800 text-sm font-secondary">
        <UserIcon className="size-[0.8rem] font-mono text-neutral-400 dark:text-neutral-600" />
        <span className="overflow-hidden text-no-wrap">{name}</span>
      </span>
      <span className="flex w-60 flex-grow gap-2 items-center px-4 py-2 dark:border-neutral-800 text-sm font-secondary">
        <MailIcon className="size-[0.8rem] font-mono text-neutral-400 dark:text-neutral-600" />
        <span className="overflow-hidden text-nowrap">{email}</span>
      </span>
    </div>
  );
}
