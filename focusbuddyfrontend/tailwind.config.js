const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        // 'textcolor': '#333333',
        'textcolor': '#583531',
        // 'textcolor': '#ffffff',
        'darkbrown': '#422d2a',
        // 'darkbrown': '#ffffff',
        // 'greenbg': '#4CAF50',
        'greenbg': '#008080',
        'darkgreen':'#3a943e',
        'sectionbg':'#F5F5F5',
        'bordercolor': '#DDDDDD',
        'lightbg': '#D1FFBE',
        'formgray': '#6B7280',
        'formblack': '#111827',
        'errorred': '#DE3535'
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        'horizontal-scroll': 'scroll 25s linear infinite',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    flowbite.plugin(),
  ],
}