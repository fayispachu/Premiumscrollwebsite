/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#040507',
        midnight: '#030406',
        glass: 'rgba(255,255,255,0.08)',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(5, 10, 30, 0.28)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 36%), radial-gradient(circle at 30% 20%, rgba(236, 72, 153, 0.14), transparent 20%), linear-gradient(180deg, rgba(6, 7, 22, 0.88), rgba(2, 4, 11, 0.98))',
      },
    },
  },
  plugins: [],
};
