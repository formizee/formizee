export const getSubmission = async (
  vault: Fetcher,
  secret: string,
  id: string
): Promise<{id: string; data: object}> => {
  const response = await vault.fetch(`/v1/submission/${id}`, {
    headers: {Authorization: `Bearer ${secret}`},
    method: 'GET'
  });

  const result = await response.json();
  return result as {id: string; data: object};
};

export const postSubmission = async (
  vault: Fetcher,
  secret: string,
  data: {id: string; endpointId: string; data: object}
) => {
  await vault.fetch('/v1/submission', {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json'
    }
  });
};

export const deleteSubmission = async (
  vault: Fetcher,
  secret: string,
  id: string
) => {
  await vault.fetch(`/v1/submission/${id}`, {
    headers: {Authorization: `Bearer ${secret}`},
    method: 'DELETE'
  });
};
