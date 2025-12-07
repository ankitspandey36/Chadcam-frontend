/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx,vue}",
    ],
    theme: {
        extend: {

            colors: {
                'primary': '#1e293b',
                'accent': '#38bdf8',
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
        require('tailwind-scrollbar-hide'),
    ],
};
