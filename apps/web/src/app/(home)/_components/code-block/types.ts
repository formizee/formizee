export type Stacks = 'node' | 'serverless' | 'rest';

export interface Stack {
  icon: React.ElementType;
  stack: Stacks;
  color: string;
  name: string;
}

export interface Example {
  icon: React.ElementType;
  language: string;
  stack: Stacks;
  name: string;
  code: string;
}
