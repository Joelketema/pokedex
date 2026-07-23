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
        pokemon: {
          blue: "#1A50E2",
          darkBlue: "#0F3299",
          grass: "#47D1B1",
          poison: "#9370DB",
          fire: "#FB6C6C",
          water: "#60A5FA",
          bug: "#98D7A5",
          normal: "#C6C6A7",
          electric: "#FFD86F",
          ground: "#E2BF65",
          fairy: "#F492B7",
          fighting: "#D56723",
          psychic: "#FF6568",
          rock: "#D1C17D",
          ghost: "#70559B",
          ice: "#98D8D8",
          dragon: "#6F35FC",
          steel: "#B7B7CE",
        }
      }
    },
  },
  plugins: [],
}
