'use client';

import {PaintIcon, ReloadIcon, StarIcon} from '@formizee/ui/icons';
import {Icon, getColor} from '../icon';
import Transition from '../transition';
import {schema} from '@formizee/db';
import {api} from '@/trpc/client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsList,
  cn,
  toast,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@formizee/ui';

interface Props {
  endpoint: schema.Endpoint;
}

export const IconPicker = ({endpoint}: Props) => {
  const utils = api.useUtils();

  const updateEndpoint = api.endpoint.update.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Error updating the icon',
        description: error.message
      });
    },
    onSuccess: () => {
      utils.endpoint.getBySlug.invalidate();
      utils.endpoint.list.invalidate();
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
    updateEndpoint.mutate({id: endpoint.id, color, icon});
  };

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="size-12">
            {endpoint !== null ? (
              <Icon
                icon={endpoint.icon}
                color={endpoint.color}
                selected={true}
                className="size-8"
              />
            ) : (
              <></>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700"
        >
          <Transition>
            <Tabs defaultValue="icons">
              <div className="flex flex-row w-full justify-between mb-4 px-2">
                <TabsList>
                  <TabsTrigger value="icons">
                    <StarIcon />
                    Icons
                  </TabsTrigger>
                  <TabsTrigger value="colors">
                    <PaintIcon />
                    Colors
                  </TabsTrigger>
                </TabsList>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="ghost" size="icon" onClick={randomizeIcon}>
                      <ReloadIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Randomize</TooltipContent>
                </Tooltip>
              </div>
              <TabsContent value="icons">
                <div className="grid grid-cols-5">
                  {schema.endpointIcon.map(icon => {
                    return (
                      <Button
                        key={icon}
                        size="icon"
                        onClick={() =>
                          updateEndpoint.mutate({id: endpoint.id, icon})
                        }
                        variant={endpoint?.icon !== icon ? 'ghost' : 'outline'}
                      >
                        <Icon icon={icon} color="gray" selected={true} />
                      </Button>
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="colors">
                <div className="grid grid-cols-5">
                  {schema.endpointColor.map(color => {
                    return (
                      <Button
                        key={color}
                        size="icon"
                        onClick={() =>
                          updateEndpoint.mutate({id: endpoint.id, color})
                        }
                        variant={
                          endpoint?.color !== color ? 'ghost' : 'outline'
                        }
                      >
                        <svg className="size-4">
                          <rect
                            rx={5}
                            className={cn(
                              getColor(color, true),
                              'size-4 rounded-md'
                            )}
                          />
                        </svg>
                      </Button>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </Transition>
        </PopoverContent>
      </Popover>
    </div>
  );
};
