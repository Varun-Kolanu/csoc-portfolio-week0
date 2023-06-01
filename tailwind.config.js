/** @type {import('tailwindcss').Config} */
export const content = ["./dist/**/*.html"];
export const theme = {
  extend: {
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    }
  },
};
export const plugins = [];