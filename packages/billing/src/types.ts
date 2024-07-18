export type Limits = {
  support: 'community' | 'email' | 'custom';
  endpoints: number | 'unlimited';
  members: number | 'unlimited';
  submissions: number;
  storage: number; // Size in MB
};
