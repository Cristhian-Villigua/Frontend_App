import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

// Tema Claro
export const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#d32f2f",       
    secondary: "#fbc02d",     
    background: "#f5f5f5",
    surface: "#ffffff",
  },
};

// Tema Oscuro
export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#ef5350",       
    secondary: "#fdd835",
    background: "#121212",
    surface: "#1e1e1e",
  },
};