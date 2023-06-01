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
    '.rotate-y-15': {
      transform: 'rotateY(15deg)',
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
export const plugins = [rotateX];