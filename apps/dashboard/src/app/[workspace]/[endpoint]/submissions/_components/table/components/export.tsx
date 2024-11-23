'use client';

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@formizee/ui';
import {DownloadIcon} from '@formizee/ui/icons';

export const ExportButton = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" disabled>
          Export
          <DownloadIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Coming Soon</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
