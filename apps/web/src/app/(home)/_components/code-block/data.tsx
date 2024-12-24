import type {Example, Stack} from './types';

import {
    AstroIcon,
  CurlIcon,
  DenoIcon,
  LambdaIcon,
  NextIcon,
  NodeIcon,
  RestIcon,
  ServerlessIcon,
  VercelIcon,
  WgetIcon,
  WorkersIcon
} from './icons';

export const STACKS: Stack[] = [
  {
    stack: 'node',
    name: 'Node.js',
    color: 'text-lime-500',
    icon: NodeIcon
  },
  {
    stack: 'serverless',
    name: 'Serverless',
    color: 'text-amber-500',
    icon: ServerlessIcon
  },
  {
    stack: 'rest',
    name: 'Rest',
    color: 'text-violet-500',
    icon: RestIcon
  }
];

const NodejsExamples: Example[] = [
  {
    name: 'Next.js',
    language: 'tsx',
    icon: NextIcon,
    stack: 'node',
    code: `import Form from 'next/form';

export default function Page() {
  return (
    <Form action="https://api.formizee.com/v1/f/enp_123456">
      <label htmlFor="name">
        Name
        <input type="text" name="name"/>
      </label
      <label htmlFor="email">
        Email
      <input type="email" name="email"/>
      </label
      <button>Submit</button>
    </Form>
  )
}`
  },
  {
    name: 'Astro',
    language: 'tsx',
    icon: AstroIcon,
    stack: 'node',
    code: `<form method="POST" action="https://api.formizee.com/v1/f/enp_123456">
  <label>
    Name
    <input type="text" name="name"/>
  </label
  <label>
    Email
  <input type="email" name="email"/>
  </label
  <button>Submit</button>
</form>`
  },
  {
    name: 'Svelte',
    language: 'tsx',
    icon: AstroIcon,
    stack: 'node',
    code: `<form method="POST" action="https://api.formizee.com/v1/f/enp_123456">
  <label>
    Name
    <input name="name" type="text"/>
  </label>
  <label>
    Email
    <input name="email" type="email"/>
  </label>
  <button>Submit</button>
</form>`
  },
  {
    name: 'Vue',
    language: 'tsx',
    icon: AstroIcon,
    stack: 'node',
    code: `<template>
  <form>
    <label>
      Name
      <input type="text" name="name" />
    </label>
    <label>
      Email
      <input type="email" name="email" />
    </label>
    <button>Submit</button>
  </form>
</template>`
  },
];

const ServerlessExamples: Example[] = [
  {
    name: 'Cloudflare Workers',
    stack: 'serverless',
    language: 'tsx',
    icon: WorkersIcon,
    code: `export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const res = await fetch('https://api.formizee.com/v1/f/enp_123456', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'example',
        email: 'example@mail.com'
      })
    });

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};`
  },
  {
    name: 'Vercel Functions',
    language: 'tsx',
    icon: VercelIcon,
    stack: 'serverless',
    code: `export async function POST() {
  const res = await fetch('https://api.formizee.com/v1/f/enp_123456', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'example',
      email: 'example@mail.com'
    }),
  });

  if (res.ok) {
    const data = await res.json();
    return Response.json(data);
  }
}`
  },
  {
    name: 'AWS Lambda',
    stack: 'serverless',
    language: 'tsx',
    icon: LambdaIcon,
    code: `export const handler = async(event) => {
  const res = await fetch('https://api.formizee.com/v1/f/enp_123456', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'example',
        email: 'example@mail.com'
    })
  });

  if (res.ok) {
    const data = await res.json();

    return {
      statusCode: 200,
      body: data,
    };
  }
};`
  },
  {
    name: 'Deno',
    stack: 'serverless',
    language: 'tsx',
    icon: DenoIcon,
    code: `import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const handler = async (_request: Request): Promise<Response> => {
  const res = await fetch('https://api.formizee.com/v1/f/enp_123456', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'example',
      email: 'example@mail.com'
    })
  });

  if (res.ok) {
    const data = await res.json();

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

serve(handler);
`
  }
];

const restExamples: Example[] = [
  {
    name: 'cURL',
    language: 'bash',
    icon: CurlIcon,
    stack: 'rest',
    code: `curl -X POST 'https://api.formizee.com/v1/f/enp_123456' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "name": "example",
  "email": "example@formizee.com"
}'`
  },
  {
    name: 'wget',
    language: 'bash',
    icon: WgetIcon,
    stack: 'rest',
    code: `wget --method POST \\
  --header 'Content-Type: application/json' \\
  --body-data '{
  "name": "example",
  "email": "example@formizee.com"
}' \\
'https://api.formizee.com/v1/f/enp_123456' `
  }
];

export const DATA: Example[] = [
  ...NodejsExamples,
  ...ServerlessExamples,
  ...restExamples
];
