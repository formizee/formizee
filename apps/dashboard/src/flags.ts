import {unstable_flag as flag} from '@vercel/flags/next';
import {get} from '@vercel/edge-config';

export const allowNewUsers = flag({
  key: 'allow-new-users',
  async decide() {
    const value = await get('allow-new-users');
    return value ?? false;
  }
});
