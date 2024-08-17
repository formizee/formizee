'use client';

import {PaintIcon, StarIcon} from '@formizee/ui/icons';
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
  toast
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
    onSuccess: async () => {
      await utils.endpoint.getBySlug.invalidate();
      await utils.endpoint.list.invalidate();
    }
  });

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
          className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
        >
          <Transition>
            <Tabs defaultValue="icons">
              <TabsList className="w-full mb-2">
                <TabsTrigger value="icons">
                  <StarIcon />
                  Icons
                </TabsTrigger>
                <TabsTrigger value="colors">
                  <PaintIcon />
                  Colors
                </TabsTrigger>
              </TabsList>
              <TabsContent value="icons">
                <Transition className="grid grid-cols-5">
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
                </Transition>
              </TabsContent>
              <TabsContent value="colors">
                <Transition className="grid grid-cols-5">
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
                </Transition>
              </TabsContent>
            </Tabs>
          </Transition>
        </PopoverContent>
      </Popover>
    </div>
  );
};
