import {BlurFade} from '@/components/blur-fade';
import {
  CodeIcon,
  DocumentIcon,
  PaintIcon,
  RocketIcon,
  ServerIcon,
  UserGroupIcon
} from '@formizee/ui/icons';

export const Features = () => {
  return (
    <BlurFade inView>
      <section className="flex px-4 flex-col items-center justify-center">
        <h3 className="text-neutral-900 dark:text-neutral-50 font-bold text-3xl text-center select-none">
          Need something else?
        </h3>
        <p className="font-secondary text-sm mt-4 mb-16">
          We have a lot of cools features to offer
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center w-full max-w-[62rem] gap-y-12 gap-x-6">
          <Item
            label="Teams Support"
            description="We provide members support, customize permissions and start working on your projects."
          >
            <UserGroupIcon />
          </Item>
          <Item
            label="Self Host"
            description="Formizee is open source, so you can host by your self without any restriction."
          >
            <ServerIcon />
          </Item>
          <Item
            label="SDKs"
            description="Accelerate development with SDKs in the language of your choice."
          >
            <RocketIcon />
          </Item>
          <Item
            label="GDPR Compliant"
            description="We ensure that all our data processing is regulated by the EU standards."
          >
            <DocumentIcon />
          </Item>
          <Item
            label="API Support"
            description="Unlike other companies, here we give you the freedom to use our API as you like."
          >
            <CodeIcon />
          </Item>
          <Item
            label="Customizable"
            description="We provide the tool, you use it the way you want."
          >
            <PaintIcon />
          </Item>
        </div>
      </section>
    </BlurFade>
  );
};

interface ItemProps {
  children: React.ReactNode;
  description: string;
  label: string;
}

const Item = (props: ItemProps) => {
  return (
    <div className="flex flex-col gap-4 items-start w-72 px-2 h-28">
      <div className="flex flex-row gap-2 items-center">
        <div className="flex items-center justify-center size-8 min-h-8 min-w-8 bg-white dark:bg-black/30 border dark:border-neutral-800 rounded-md">
          {props.children}
        </div>
        <span className="flex flex-col items-start">
          <span className="font-secondary font-bold text-nowrap">
            {props.label}
          </span>
        </span>
      </div>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm text-start">
        {props.description}
      </p>
    </div>
  );
};
