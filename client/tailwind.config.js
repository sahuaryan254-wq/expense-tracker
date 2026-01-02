/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
                display: ['Orbitron', 'sans-serif'],
                mono: ['Rajdhani', 'monospace'],
            },
            colors: {
                primary: '#4F46E5', // Indigo 600
                secondary: '#10B981', // Emerald 500
                dark: '#0f172a', // Slate 900
                light: '#F8FAFC', // Slate 50
            }
        },
    },
    plugins: [],
}
