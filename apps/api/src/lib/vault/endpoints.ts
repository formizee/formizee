export const deleteEndpoint = async (
  vault: Fetcher,
  secret: string,
  id: string
) => {
  await vault.fetch(`/v1/endpoint/${id}`, {
    headers: {Authorization: `Bearer ${secret}`},
    method: 'DELETE'
  });
};
