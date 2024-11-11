import {env} from '@/lib/enviroment';

interface Params {
  params: {
    endpointId: string;
  };
}

export const GET = async (_request: Request, {params}: Params) => {
  const response = await fetch('https://vault.formizee.com/v1/submissions', {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include',
    body: JSON.stringify({endpointId: params.endpointId}),
    headers: {
      Authorization: env().VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });

  const result = await response.json();
  return Response.json(result);
};
