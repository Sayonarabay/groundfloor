import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#18150f',
          2: '#4a4238',
          3: '#9a9088',
        },
        cream: {
          DEFAULT: '#f4f1ea',
          2: '#ede9e0',
        },
        terra: {
          DEFAULT: '#c4622d',
          light: '#f2e6de',
          2: '#e8855a',
        },
        stone: {
          border: '#ddd8ce',
          surface: '#faf8f4',
        },
      },
    },
  },
  plugins: [],
}
export default config
