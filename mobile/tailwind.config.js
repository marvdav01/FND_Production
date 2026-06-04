/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#1E293B',
        accent: '#2563EB',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
