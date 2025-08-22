/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui','ui-sans-serif','Helvetica','Arial','sans-serif']
      },
      dropShadow: {
        neon: '0 0 6px rgba(255,255,255,0.9)'
      }
    }
  },
  plugins: []
}
