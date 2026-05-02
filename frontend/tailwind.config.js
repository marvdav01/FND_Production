export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0F172A',
          700: '#1E293B',
          500: '#475569',
          orange: '#F97316',
          slate: '#64748B',
        },
      },
    },
  },
  plugins: [],
}
