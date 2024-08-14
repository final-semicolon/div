import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'], // shadcn의 dark mode 설정

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{ts,tsx}', // shadcn 설정에 추가된 경로
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],

  theme: {
    container: {
      center: true, // shadcn의 container 설정
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },

    extend: {
      // 기존 설정의 확장된 테마를 유지합니다.
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
        white: '#ffffff',

        // shadcn의 확장된 테마를 추가합니다.
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
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
        'custom-light': '0px 0px 4px 0px rgba(234, 234, 234, 0.25)',
        button: '0px 2px 8px 0px rgba(0, 0, 0, 0.25)'
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },

  plugins: [
    require('@tailwindcss/line-clamp'), // 기존 플러그인
    require('tailwindcss-animate') // shadcn 플러그인
  ]
};

export default config;
