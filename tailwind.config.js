/** @type {import('tailwindcss').Config} */
export const content = ["./dist/**/*.html"];
const plugin = require('tailwindcss/plugin')

const rotateX = plugin(function ({ addUtilities }) {
  addUtilities({
    '.rotate-x-45': {
      transform: 'rotateX(45deg)',
    },
    '.rotate-x-90': {
      transform: 'rotateX(90deg)',
    },
    '.rotate-x-135': {
      transform: 'rotateX(135deg)',
    },
    '.rotate-x-180': {
      transform: 'rotateX(180deg)',
    },
    '.rotate-y-30': {
      transform: 'rotateY(30deg)',
    },
    '.-rotate-y-35': {
      transform: 'rotateY(-45deg)',
    },
    '.-rotate-y-25': {
      transform: 'rotateY(-25deg)',
    },
  })
})

export const theme = {
  extend: {
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    }
  }
};

export const safelist = [
  'bg-[#4d51bc]',
  'drop-shadow-2xl',
  'text-[#22ff72]',
  'hover:scale-105',
  'cursor-pointer',
  'w-[170px]',
  'h-[170px]',
  'm-3',
  'w-[200px]',
  'h-[250px]'
]
export const plugins = [rotateX];