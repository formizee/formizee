import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import type {Config} from 'tailwindcss';

// We want each package to be responsible for its own content.
const config: Omit<Config, 'content'> = {
  darkMode: ['class'],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    textShadow: {
      sm: '1px 1px 2px var(--tw-shadow-color)',
      DEFAULT: '2px 2px 4px var(--tw-shadow-color)',
      lg: '4px 4px 8px var(--tw-shadow-color)',
      xl: '4px 4px 16px var(--tw-shadow-color)'
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'}
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'}
        },
        'caret-blink': {
          '0%,70%,100%': {opacity: '1'},
          '20%,50%': {opacity: '0'}
        },
        'fade-in': {
          '0%': {opacity: '0', transform: 'translateY(10px)'},
          '100%': {opacity: '1', transform: 'translateY(0px)'}
        },
        'fade-card-background': {
          '0%': {background: 'theme(colors.neutral.700)'},
          '100%': {background: 'theme(colors.transparent)'}
        },
        'heading-accent': {
          '0%': {
            backgroundPosition: '0% 0%',
            textShadow: '0 1px 10px rgb(253 230 138 / 0)'
          },
          '100%': {
            backgroundPosition: '100% 100%',
            textShadow: '0 1px 10px rgb(253 230 138 / 0.5)'
          }
        },
        spotlight: {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.7)'
          },
          '100%': {
            opacity: '100',
            transform: 'translate(-50%,-40%) scale(1)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'heading-accent': 'heading-accent 1s ease-out 0.6s forwards',
        'fade-in': 'fade-in 400ms ease-out forwards',
        spotlight: 'spotlight 1.5s ease-out 0.3s forwards'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({matchUtilities, theme}) => {
      matchUtilities(
        {
          'text-shadow': value => ({
            textShadow: value
          })
        },
        {values: theme('textShadow')}
      );
    })
  ]
};
export default config;
