const WAITLIST_ENDPOINT = 'enp_ix8cq8Jg7R6p5hcY5kbG8S7WUoC';

export async function joinWaitlist(
  email: string
): Promise<{error: Error | null}> {
  const res = await fetch(
    `https://api.formizee.com/v1/f/${WAITLIST_ENDPOINT}`,
    {
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({email}),
      method: 'post'
    }
  );

  if (!res.ok) {
    const data = await res.json();
    return Promise.resolve({error: new Error(data.message)});
  }

  return Promise.resolve({error: null});
}
