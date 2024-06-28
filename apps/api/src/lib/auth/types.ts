export interface Payload<T> {
  expiresAt: Date;
  data: T;
}

export interface LinkedEmailToken {
  id: string;
  email: string;
  token: number;
}

export interface Session {
  id: string;
  name: string;
}

export interface Verification {
  email: string;
  type: 'account' | 'password';
}

export type Data = Session | Verification | LinkedEmailToken;
