const VAULT_URL = 'https://vault.formizee.com/v1';

interface Submission {
  id: string;
  endpointId: string;
  data: object;
  isSpam: boolean;
  isRead: boolean;
  location: string;
  createdAt: string;
}

export const getSubmission = async (
  VAULT_SECRET: string,
  id: string
): Promise<Submission> => {
  const response = await fetch(`${VAULT_URL}/submission/${id}`, {
    method: 'GET',
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 404) {
    return Promise.reject(null);
  }

  const result = (await response.json()) as Submission;
  return Promise.resolve(result);
};

export const putSubmission = async (
  VAULT_SECRET: string,
  id: string,
  input: {isSpam?: boolean; isRead?: boolean}
) => {
  const response = await fetch(`${VAULT_URL}/submission/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    Promise.reject({
      status: response.status,
      body: response.json()
    });
  }
};

export const postSubmission = async (
  VAULT_SECRET: string,
  input: {endpointId: string; data: object; location: string}
) => {
  const response = await fetch(`${VAULT_URL}/submission`, {
    method: 'POST',
    body: JSON.stringify({
      endpointId: input.endpointId,
      data: input.data,
      fileUploads: [],
      location: input.location
    }),
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    Promise.reject({
      status: response.status,
      body: response.json()
    });
  }
};

export const listSubmissions = async (
  VAULT_SECRET: string,
  endpointId: string
): Promise<Submission[]> => {
  const response = await fetch(`${VAULT_URL}/submissions/${endpointId}`, {
    method: 'GET',
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 404) {
    return Promise.reject(null);
  }

  const result = (await response.json()) as Submission[];
  return Promise.resolve(result);
};

export const deleteSubmission = async (VAULT_SECRET: string, id: string) => {
  await fetch(`${VAULT_URL}/submission/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });
};
