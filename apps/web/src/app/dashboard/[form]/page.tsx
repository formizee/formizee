'use client';

import { ClipboardButton } from "@/components";
import { Badge, Button, Input, Tabs, TabsContent, TabsList, TabsTrigger } from "@formizee/ui"
import { ArrowRightIcon, HomeIcon, InboxIcon, LinkIcon, PluginIcon, SettingsIcon } from "@formizee/ui/icons";

export default function Page({ params }: { params: { form: string } }) {
  const form = {
    name: 'My New Form',
  }

  return (
    <div className="flex flex-col container h-full px-16 py-10">
      <div className="flex gap-x-4 items-center">
        <h1
          className='bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-bold text-transparent no-underline'>
          {form.name}
        </h1>
        <Badge variant="success" className="mt-1">Active</Badge>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className='my-6'>
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
          <div className="flex flex-col w-full border rounded-md border-neutral-700">
            <div className="flex flex-col p-6 gap-2 ">
              <h2 className="font-semibold text-2xl">Form URL</h2>
              <p>Used when interacting with the Formizee API.</p>
              <div className="flex gap-x-2">
                <Input className="max-w-96" disabled value={`https://formizee.com/f/${params.form}`} />
                <ClipboardButton data={`https://formizee.com/f/${params.form}`} tooltip="Copy URL" />
              </div>
            </div>
            <div className='flex justify-between border-t border-neutral-700 p-6 '>
              <span className="flex items-center gap-x-2">Learn more about <a className="flex items-center gap-x-1 text-amber-400">Form URL<LinkIcon /></a></span>
              <Button>Integrate Your Form <ArrowRightIcon /></Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="submissions">
          Submissions
        </TabsContent>
        <TabsContent value="integrations">
          Integrations
        </TabsContent>
        <TabsContent value="settings">
          Settings
        </TabsContent>
      </Tabs>
    </div>
  )
}
