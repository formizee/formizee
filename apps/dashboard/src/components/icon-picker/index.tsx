'use client';

import {schema} from '@formizee/db';
import {useState} from 'react';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsList,
  cn
} from '@formizee/ui';

import {DocumentIcon} from '@formizee/ui/icons';

type EndpointIcon = (typeof schema.endpointIcon)[number];
type EndpointColor = (typeof schema.endpointColor)[number];

const getColor = (color: EndpointColor) => {
  switch (color) {
    case 'red':
      return 'fill-red-400';
    case 'lime':
      return 'fill-lime-400';
    case 'teal':
      return 'fill-teal-400';
    case 'cyan':
      return 'fill-cyan-400';
    case 'pink':
      return 'fill-pink-400';
    case 'amber':
      return 'fill-amber-400';
    case 'indigo':
      return 'fill-indigo-400';
    case 'violet':
      return 'fill-violet-400';
    case 'white':
      return 'fill-neutral-950 dark:fill-neutral-50';
    default:
      return 'fill-neutral-400';
  }
};

const Icon = (props: {icon: EndpointIcon; color: EndpointColor}) => {
  switch (props.icon) {
    default:
      return <DocumentIcon className={getColor(props.color)} />;
  }
};

export const IconPicker = () => {
  const [currentIcon, _setCurrentIcon] = useState<EndpointIcon>('file');
  const [currentColor, _setCurrentColor] = useState<EndpointColor>('gray');

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Icon icon={currentIcon} color={currentColor} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-neutral-900 border border-neutral-700">
          <Tabs defaultValue="icons">
            <TabsList>
              <TabsTrigger value="icons">Icons</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
            </TabsList>
            <TabsContent value="icons">
              <div className="grid grid-cols-5">
                {schema.endpointIcon.map(icon => {
                  return (
                    <Button key={icon} variant="ghost" size="icon">
                      <Icon icon={icon} color="gray" />
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="colors">
              <div className="grid grid-cols-5">
                {schema.endpointColor.map(color => {
                  return (
                    <Button key={color} variant="ghost" size="icon">
                      <svg className="size-4">
                        <rect
                          className={cn(getColor(color), 'size-4 rounded-md')}
                        />
                      </svg>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};
