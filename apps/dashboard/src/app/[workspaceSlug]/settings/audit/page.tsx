import {ArrowRightIcon, DocumentIcon} from '@formizee/ui/icons';
import lockIcon from '@/../public/lock.webp';
import {Transition} from '@/components';
import {Button} from '@formizee/ui';
import Image from 'next/image';

const Audit = () => {
  return (
    <Transition>
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 my-8">
        <div className="flex flex-row gap-4">
          <Image
            height={56}
            width={56}
            src={lockIcon}
            alt="Lock Icon"
            className="z-[999] size-14 dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl">Audit Logs</span>
            <p>These keys are used to interact with the Formizee API.</p>
          </div>
        </div>
        <div className="flex flex-row-reverse sm:flex-row gap-4">
          <Button variant="outline">
            Export
            <DocumentIcon />
          </Button>
          <Button variant="outline">
            Columns
            <ArrowRightIcon />
          </Button>
        </div>
      </section>
    </Transition>
  );
};

export default Audit;
