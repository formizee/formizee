import type {PrismTheme} from 'prism-react-renderer';

export type Color = string;
export type Theme = 'light' | 'dark';

export const getColor = (color: Color = 'none', theme: Theme = 'dark') => {
  switch (color) {
    case 'text-lime-500': {
      if (theme === 'light') {
        return '#84cc16';
      }
      return '#84cc16';
    }
    case 'text-amber-500': {
      if (theme === 'light') {
        return '#d97706';
      }
      return '#f59e0b';
    }
    case 'text-violet-500': {
      if (theme === 'light') {
        return '#6d28d9';
      }
      return '#8b5cf6';
    }
  }
  if (theme === 'light') {
    return '#000000';
  }
  return '#ffffff';
};

export const getTheme = (
  color: Color = 'green',
  theme: Theme = 'dark'
): PrismTheme => {
  return {
    plain: {
      color: theme === 'dark' ? '#ffffff' : '#000000'
    },
    styles: [
      {
        types: [
          'constant',
          'symbol',
          'builtin',
          'namespace',
          'tag',
          'number',
          'keyword',
          'comment',
          'prolog',
          'doctype',
          'cdata'
        ],
        style: {
          color: '#78716c'
        }
      },
      {
        types: [
          'boolean',
          'string',
          'entity',
          'url',
          'attr-value',
          'directive',
          'control',
          'unit',
          'statement',
          'regex',
          'atrule',
          'placeholder'
        ],
        style: {
          color: getColor(color, theme)
        }
      },
      {
        types: ['variable', 'parameter', 'punctuation'],
        style: {
          color: '#78716c'
        },
        languages: ['bash']
      },
      {
        types: ['string'],
        style: {
          color: getColor(color, theme)
        },
        languages: ['bash']
      }
    ]
  };
};
