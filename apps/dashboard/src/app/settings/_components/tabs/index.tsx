'use client';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@formizee/ui';
import {InfoIcon, LockIcon, SettingsIcon} from '@formizee/ui/icons';
import DocumentsSettings from '../../documents';
import SecuritySettings from '../../security';
import GeneralSettings from '../../general';
import type {schema} from '@/lib/db';

export const SettingsTabs = ({user}: {user: schema.User}) => (
  <Tabs defaultValue="general">
    <TabsList>
      <TabsTrigger value="general">
        <SettingsIcon />
        General
      </TabsTrigger>
      <TabsTrigger value="security">
        <LockIcon />
        Authentication
      </TabsTrigger>
      <TabsTrigger value="documents">
        <InfoIcon />
        Documents
      </TabsTrigger>
    </TabsList>
    <TabsContent value="general">
      <GeneralSettings user={user} />
    </TabsContent>
    <TabsContent value="security">
      <SecuritySettings />
    </TabsContent>
    <TabsContent value="documents">
      <DocumentsSettings />
    </TabsContent>
  </Tabs>
);

export default SettingsTabs;
