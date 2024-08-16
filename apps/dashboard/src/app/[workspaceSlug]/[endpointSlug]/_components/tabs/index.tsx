'use client';

import {
  HomeIcon,
  InboxIcon,
  PluginIcon,
  SettingsIcon
} from '@formizee/ui/icons';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@formizee/ui';
import type {schema} from '@/lib/db';

import {Integrations} from '../../(content)/integrations';
import {Submissions} from '../../(content)/submissions';
import {Overview} from '../../(content)/overview';
import {Settings} from '../../(content)/settings';

export const EndpointTabs = ({endpoint}: {endpoint: schema.Endpoint}) => {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">
          <HomeIcon />
          Overview
        </TabsTrigger>
        <TabsTrigger value="submissions">
          <InboxIcon />
          Submissions
        </TabsTrigger>
        <TabsTrigger value="integrations">
          <PluginIcon />
          Integrations
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Overview endpointId={endpoint.id} />
      </TabsContent>
      <TabsContent value="submissions">
        <Submissions />
      </TabsContent>
      <TabsContent value="integrations">
        <Integrations />
      </TabsContent>
      <TabsContent value="settings">
        <Settings endpoint={endpoint} />
      </TabsContent>
    </Tabs>
  );
};

export default EndpointTabs;
