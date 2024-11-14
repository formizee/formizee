'use client';

import {PlusIcon} from '@formizee/ui/icons';
import {Button} from '@formizee/ui';

export const AddMemberButton = () => (
  <Button disabled variant="outline">
    Add Member
    <PlusIcon />
  </Button>
);