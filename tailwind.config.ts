import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['var(--font-pretendard)']
      },
      colors: {
        main: {
          50: '#EEEDFC',
          100: '#C3C2F5',
          400: '#423edf',
          500: '#2521C9'
        },
        sub: {
          50: '#F2F7FD',
          100: '#C7DCF5',
          200: '#9BC0ED'
        },
        neutral: {
          50: '#f5f5f5',
          100: '#dbdbdb',
          200: '#c2c2c2',
          300: '#a8a8a8',
          400: '#8f8f8f',
          500: '#757575',
          600: '#5c5c5c',
          700: '#424242',
          800: '#292929',
          900: '#0f0f0f'
        },
        red: '#F66161',
        black: '#000000',
        white: '#ffffff'
      },
      fontSize: {
        h1: ['60px', { lineHeight: '135%', letterSpacing: '-0.5px' }],
        h2: ['48px', { lineHeight: '135%', letterSpacing: '-0.5px' }],
        h3: ['28px', { lineHeight: '135%', letterSpacing: '-0.5px' }],
        h4: ['24px', { lineHeight: '135%', letterSpacing: '-0.5px' }],
        h5: ['20px', { lineHeight: '135%', letterSpacing: '-0.5px' }],
        subtitle1: ['18px', { lineHeight: '135%', letterSpacing: '-0.5px' }],
        subtitle2: ['16px', { lineHeight: '135%', letterSpacing: '-0.5px' }],
        subtitle3: ['14px', { lineHeight: '135%', letterSpacing: '-0.5px' }],
        body1: ['18px', { lineHeight: '150%', letterSpacing: '-0.5px' }],
        body2: ['16px', { lineHeight: '150%', letterSpacing: '-0.5px' }],
        body3: ['14px', { lineHeight: '150%', letterSpacing: '-0.5px' }],
        body4: ['13px', { lineHeight: '150%', letterSpacing: '-0.5px' }],
        overline1: ['14px', { lineHeight: '150%', letterSpacing: '-0.5px' }],
        overline2: ['12px', { lineHeight: '150%', letterSpacing: '-0.5px' }],
        caption1: ['14px', { lineHeight: '150%', letterSpacing: '-0.5px' }],
        caption2: ['12px', { lineHeight: '150%', letterSpacing: '-0.5px' }]
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700'
      },
      boxShadow: {
        custom: '-2px 0px 1px 0px rgba(234, 234, 234, 0.25), 2px 0px 1px 0px rgba(234, 234, 234, 0.25)',
        'custom-light': '0px 0px 4px 0px rgba(234, 234, 234, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
