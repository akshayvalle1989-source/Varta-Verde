/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'sans-serif'],
        deva: ['"Noto Sans Devanagari"', 'sans-serif'],
        brand: ['"Yatra One"', '"Noto Sans Devanagari"', 'serif'],
      },
      colors: {
        clay: { DEFAULT: '#b85d36', deep: '#9c4724', rich: '#c86d44', dark: '#4a2818' },
        soil: { DEFAULT: '#2e1a10', ink: '#1e1b15', variant: '#55433c' },
        sand: { DEFAULT: '#fcf8f2', bright: '#fcf8f2', ochre: '#e8dacb', container: '#f5ede2', low: '#fbf2e7' },
        forest: { DEFAULT: '#20432f', deep: '#012d1d', dark: '#143326', sage: '#e2ece5', mid: '#426650' },
        marigold: { DEFAULT: '#eab308', dark: '#ca8a04', light: '#fef08a' },
        bloom: { DEFAULT: '#db2777', deep: '#be185d', soft: '#f472b6', mist: '#fdf2f8' },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        earth: '0 4px 16px -2px rgba(74, 40, 24, 0.08)',
        'earth-lg': '0 8px 24px -4px rgba(46, 26, 16, 0.16)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'pulse-wave': { '0%,100%': { transform: 'scaleY(0.4)' }, '50%': { transform: 'scaleY(1)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.5s ease-out both',
        'pulse-wave': 'pulse-wave 0.9s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
