import type {APIKeyExpirationDate} from 'domain/models/values';
import shortUUID from 'short-uuid';
import bcryptjs from 'bcryptjs';

export const generateAPIKey = (): {apiKey: string; hash: string} => {
  const uuid = crypto.randomUUID();
  const apiKey = `fz_${shortUUID().fromUUID(uuid)}`;
  const hash = getAPIKeyHash(apiKey);
  return {apiKey, hash};
};

export const getAPIKeyHash = (apiKey: string): string => {
  return bcryptjs.hashSync(apiKey, 13);
};

export const generateExpirationDate = (value: APIKeyExpirationDate): Date => {
  switch (value) {
    case '1-day': {
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    case '7-days': {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    case '30-days': {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    case '60-days': {
      return new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    }
    case '90-days': {
      return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }
    case '180-days': {
      return new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
    }
    case '1-year': {
      return new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
    }
    case 'never': {
      return new Date(3333, 8, 10, 13, 13, 13);
    }
  }
};
