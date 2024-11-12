const VAULT_URL = 'https://vault.formizee.com/v1';

export const getSubmission = async (
  VAULT_SECRET: string,
  endpointId: string,
  id: string
): Promise<{id: string; data: object}> => {
  const response = await fetch(`${VAULT_URL}/submission/${endpointId}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });

  const result = await response.json();
  return result as {id: string; data: object};
};

export const postSubmission = async (
  VAULT_SECRET: string,
  data: {id: string; endpointId: string; data: object}
) => {
  await fetch(`${VAULT_URL}/submission`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });
};

export const deleteSubmission = async (
  VAULT_SECRET: string,
  endpointId: string,
  id: string
) => {
  await fetch(`${VAULT_URL}/submission/${endpointId}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });
};
