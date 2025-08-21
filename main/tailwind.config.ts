import type { Config } from 'tailwindcss'

export default {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'aspect-[1920/1700]', // 여기에 직접 추가
    { pattern: /aspect-\[\d+\/\d+\]/ },
  ],
  theme: {
    fontSize: {
      xxxs: '0.6rem', // 10px
      xxs: '0.65rem', // 11px
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '4rem', // 64px
      '7xl': '5rem', // 80px
      '8xl': '6rem', // 96px
      '9xl': '8rem', // 128px
    },
    extend: {
      writingMode: {
        'vertical-lr': 'vertical-lr',
        'vertical-rl': 'vertical-rl',
        'horizontal-tb': 'horizontal-tb',
      },
      screens: {
        xs: '390px',
        'md-landscape': {
          raw: '(min-width: 768px) and (orientation: landscape) and (hover: none) and (pointer: coarse)',
        },
        'md-landscape-coming': {
          raw: '(min-width: 768px) and (max-width: 1440px) and (orientation: landscape)',
        },

        lg: '1440px',
        xl: '1920px',
        '2xl': '2560px',
      },
      colors: {},
      fontFamily: {
        // 한글용 폰트
        korean: ['var(--font-pretendard)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        english: ['var(--font-saans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      aspectRatio: {},
    },
  },
  plugins: [],
} satisfies Config
