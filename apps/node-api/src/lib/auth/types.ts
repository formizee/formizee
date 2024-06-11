export interface Payload<T> {
  expiresAt: Date;
  data: T;
}

export interface LinkedEmailToken {
  uid: string;
  email: string;
  token: number;
}

export interface Session {
  uid: string;
  name: string;
  permission: 'user' | 'admin';
}

export interface Verification {
  email: string;
  type: 'account' | 'password';
}

export type Data = Session | Verification | LinkedEmailToken;
