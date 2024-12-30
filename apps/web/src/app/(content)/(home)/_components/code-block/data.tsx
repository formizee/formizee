import type {Example, Stack} from './types';

import {
  CurlIcon,
  DenoIcon,
  LambdaIcon,
  NextIcon,
  WebIcon,
  RestIcon,
  ServerlessIcon,
  VercelIcon,
  WgetIcon,
  WorkersIcon,
  AngularIcon,
  VueIcon
} from './icons';

export const STACKS: Stack[] = [
  {
    stack: 'node',
    name: 'Frameworks',
    color: 'text-lime-500',
    icon: WebIcon
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
    github: 'https://github.com/formizee/formizee-next-example',
    name: 'Next.js',
    language: 'tsx',
    icon: NextIcon,
    stack: 'node',
    code: `export default function Page() {
	return (
		<form method="post" action="https://api.formizee.com/v1/f/enp_123456">
			<label htmlFor="name">
				Name
				<input id="name" autoComplete="name" name="name" />
			</label>
			<label htmlFor="email">
				Email
				<input id="email" autoComplete="email" name="email" />
			</label>
			<button>Submit</button>
		</form>
	);
}`
  },
  {
    github: 'https://github.com/formizee/formizee-angular-example',
    name: 'Angular',
    language: 'tsx',
    icon: AngularIcon,
    stack: 'node',
    code: `<form method="post" action="https://api.formizee.com/v1/f/enp_123456">
  <label htmlFor="name">
    Name
    <input id="name" autoComplete="name" name="name" />
  </label>
  <label htmlFor="email">
    Email
    <input id="email" autoComplete="email" name="email" />
  </label>
  <button type="submit">Submit</button>
</form>`
  },
  {
    github: 'https://github.com/formizee/formizee-vue-example',
    name: 'Vue',
    language: 'tsx',
    icon: VueIcon,
    stack: 'node',
    code: `<template>
  <form method="post" action="https://api.formizee.com/v1/f/enp_123456">
    <label htmlFor="name">
      Name
      <input id="name" autoComplete="name" name="name" />
    </label>
    <label htmlFor="email">
      Email
      <input id="email" autoComplete="email" name="email" />
    </label>
    <button type="submit">Submit</button>
  </form>
</template>`
  }
];

const ServerlessExamples: Example[] = [
  {
    github: 'https://github.com/formizee/formizee-cloudflare-workers-example',
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
    github: 'https://github.com/formizee/formizee-vercel-functions-example',
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
    github: 'https://github.com/formizee/formizee-aws-lambda-example',
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
    github: 'https://github.com/formizee/formizee-deno-example',
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
    github: 'https://github.com/formizee/formizee-curl-example',
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
    github: 'https://github.com/formizee/formizee-wget-example',
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
