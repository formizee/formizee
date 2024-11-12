const VAULT_URL = 'https://vault.formizee.com/v1';

export const deleteEndpoint = async (VAULT_SECRET: string, id: string) => {
  await fetch(`${VAULT_URL}/endpoint/${id}`, {
    method: 'DELETE',
    mode: 'no-cors',
    credentials: 'include',
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });
};
