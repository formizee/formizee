'use client';

import {LoadingIcon, PaintIcon, ReloadIcon, StarIcon} from '@formizee/ui/icons';
import {Icon} from '../icon';
import Transition from '../transition';
import {schema} from '@formizee/db';
import {api} from '@/trpc/client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  toast,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@formizee/ui';
import {useState} from 'react';
import {getColor} from '@/lib/colors';

interface Props {
  endpoint: schema.Endpoint;
}

type Route = 'icons' | 'colors';

export const IconPicker = ({endpoint}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<Route>('icons');
  const utils = api.useUtils();

  const updateEndpointIcon = api.endpoint.update.icon.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
      setTimeout(() => setIsLoading(false), 150);
    },
    onSuccess: () => {
      utils.endpoint.get.invalidate();
      utils.endpoint.list.invalidate();
      setTimeout(() => setIsLoading(false), 250);
    }
  });

  const updateEndpointColor = api.endpoint.update.color.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
      setTimeout(() => setIsLoading(false), 150);
    },
    onSuccess: () => {
      utils.endpoint.get.invalidate();
      utils.endpoint.list.invalidate();
      setTimeout(() => setIsLoading(false), 250);
    }
  });

  const randomizeIcon = () => {
    const icon =
      schema.endpointIcon[
        Math.floor(Math.random() * schema.endpointIcon.length)
      ];
    const color =
      schema.endpointColor[
        Math.floor(Math.random() * schema.endpointColor.length)
      ];
    if (icon) {
      updateEndpointIcon.mutate({id: endpoint.id, icon});
    }
    if (color) {
      updateEndpointColor.mutate({id: endpoint.id, color});
    }
  };

  const IconsContent = () => (
    <div className="grid grid-cols-5">
      {schema.endpointIcon.map(icon => {
        return (
          <Button
            key={icon}
            size="icon"
            onClick={() => updateEndpointIcon.mutate({id: endpoint.id, icon})}
            variant={endpoint?.icon !== icon ? 'ghost' : 'outline'}
          >
            <Icon icon={icon} color="gray" selected={true} />
          </Button>
        );
      })}
    </div>
  );

  const ColorsContent = () => (
    <div className="grid grid-cols-5">
      {schema.endpointColor.map(color => {
        return (
          <Button
            key={color}
            size="icon"
            onClick={() => updateEndpointColor.mutate({id: endpoint.id, color})}
            variant={endpoint?.color !== color ? 'ghost' : 'outline'}
          >
            <svg className="size-4">
              <rect
                rx={5}
                className={cn(getColor(color, true).fill, 'size-4 rounded-md')}
              />
            </svg>
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="size-12">
            {isLoading ? (
              <LoadingIcon className="size-8" />
            ) : (
              <Icon
                selected={true}
                icon={endpoint.icon}
                color={endpoint.color}
                className="animate-fade-in size-8"
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700"
        >
          <Transition>
            <nav>
              <div className="flex flex-row w-full justify-between mb-4 px-2">
                <div className="flex flex-row gap-2 mr-2">
                  <Button
                    onClick={() => setRoute('icons')}
                    variant={route === 'icons' ? 'outline' : 'ghost'}
                  >
                    <StarIcon
                      className={
                        route === 'icons'
                          ? ''
                          : 'text-neutral-400 dark:text-neutral-600'
                      }
                    />
                    <span
                      className={
                        route === 'icons'
                          ? ''
                          : 'text-neutral-600 dark:text-neutral-400'
                      }
                    >
                      Icons
                    </span>
                  </Button>
                  <Button
                    onClick={() => setRoute('colors')}
                    variant={route === 'colors' ? 'outline' : 'ghost'}
                  >
                    <PaintIcon
                      className={
                        route === 'colors'
                          ? ''
                          : 'text-neutral-400 dark:text-neutral-600'
                      }
                    />
                    <span
                      className={
                        route === 'colors'
                          ? ''
                          : 'text-neutral-600 dark:text-neutral-400'
                      }
                    >
                      Colors
                    </span>
                  </Button>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={randomizeIcon}>
                      <ReloadIcon className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-950 dark:hover:text-neutral-50" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Randomize</TooltipContent>
                </Tooltip>
              </div>
            </nav>
            {route === 'icons' ? <IconsContent /> : <ColorsContent />}
          </Transition>
        </PopoverContent>
      </Popover>
    </div>
  );
};
