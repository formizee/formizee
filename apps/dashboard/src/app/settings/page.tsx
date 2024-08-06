import {Heading, Transition} from '@/components';
import Navbar from './_components/navbar';

const Settings = () => {
  return (
    <main>
      <Navbar />
      <Transition className="container px-12 flex flex-col w-full pt-24">
        <Heading>Account Settings</Heading>
      </Transition>
    </main>
  );
};

export default Settings;
