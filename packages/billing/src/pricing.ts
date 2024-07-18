import type {Limits} from './types';

export const pricingTableConfig: Record<
  string,
  {
    label: string;
    features: {value: keyof Limits; label: string; badge?: string}[];
  }
> = {
  forms: {
    label: 'Forms',
    features: [
      {
        value: 'submissions',
        label: 'Number of submissions'
      },
      {
        value: 'endpoints',
        label: 'Number of forms'
      }
    ]
  },
  storage: {
    label: 'Storage',
    features: [
      {
        value: 'storage',
        label: 'File Uploads'
      }
    ]
  },
  collaboration: {
    label: 'Collaboration',
    features: [
      {
        value: 'members',
        label: 'Team members'
      }
    ]
  },
  others: {
    label: 'Others',
    features: [
      {
        value: 'support',
        label: 'Custom support'
      }
    ]
  }
};
