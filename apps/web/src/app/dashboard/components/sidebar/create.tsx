"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@formizee/ui';
import { ArrowRightIcon, DocumentAddIcon } from '@formizee/ui/icons';

export function SidebarCreateForm(): JSX.Element {
  return (
    <div className="flex flex-col">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="my-1 mt-3 items-center justify-start">
            <DocumentAddIcon />
            <span>Create a new form</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-left font-semibold">Create New Form</DialogTitle>
            <DialogDescription className="text-left">
              Give your form a catchy name that captures its essence. This will be your form's headline act!
            </DialogDescription>
            <DialogFooter>
              <form className="w-full flex flex-row justify-between gap-x-4 pt-4">
              <Input type="text" required autoComplete="off" placeholder="My new form..." className="flex flex-1" />
              <Button type="submit"><span>Let's Build</span> <ArrowRightIcon /></Button>
              </form>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SidebarCreateForm;
