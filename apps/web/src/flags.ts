import {unstable_flag as flag} from '@vercel/flags/next';
import {get} from '@vercel/edge-config';

export const showWaitlist = flag({
  key: 'waitlist',
  async decide() {
    const value = await get('show-waitlist');
    return value ?? false;
  }
});
