import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

// Tema Claro Mejorado
export const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#d32f2f",       // Rojo principal
    onPrimary: "#ffffff",     // Texto sobre primary
    primaryContainer: "#ffebee", // Contenedor primary
    onPrimaryContainer: "#d32f2f",
    secondary: "#ff9800",     // Naranja mejorado
    onSecondary: "#ffffff",
    secondaryContainer: "#fff3e0",
    onSecondaryContainer: "#ff9800",
    tertiary: "#4caf50",      // Verde para acentos
    onTertiary: "#ffffff",
    tertiaryContainer: "#e8f5e8",
    onTertiaryContainer: "#4caf50",
    error: "#f44336",
    onError: "#ffffff",
    errorContainer: "#ffebee",
    onErrorContainer: "#f44336",
    background: "#fafafa",    // Fondo más suave
    onBackground: "#212121",
    surface: "#ffffff",
    onSurface: "#212121",
    surfaceVariant: "#f5f5f5",
    onSurfaceVariant: "#757575",
    outline: "#bdbdbd",
    outlineVariant: "#e0e0e0",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#303030",
    inverseOnSurface: "#fafafa",
    inversePrimary: "#ff8a80",
    elevation: {
      level0: "transparent",
      level1: "#ffffff",
      level2: "#f8f8f8",
      level3: "#f0f0f0",
      level4: "#e8e8e8",
      level5: "#e0e0e0",
    },
  },
};

// Tema Oscuro Mejorado
export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#ff8a80",       // Rojo claro para oscuro
    onPrimary: "#000000",
    primaryContainer: "#3e2723",
    onPrimaryContainer: "#ff8a80",
    secondary: "#ffb74d",     // Naranja claro
    onSecondary: "#000000",
    secondaryContainer: "#3e2723",
    onSecondaryContainer: "#ffb74d",
    tertiary: "#81c784",      // Verde claro
    onTertiary: "#000000",
    tertiaryContainer: "#1b5e20",
    onTertiaryContainer: "#81c784",
    error: "#ef5350",
    onError: "#000000",
    errorContainer: "#3e2723",
    onErrorContainer: "#ef5350",
    background: "#121212",    // Fondo oscuro
    onBackground: "#ffffff",
    surface: "#1e1e1e",
    onSurface: "#ffffff",
    surfaceVariant: "#2d2d2d",
    onSurfaceVariant: "#bdbdbd",
    outline: "#8d8d8d",
    outlineVariant: "#5d5d5d",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#fafafa",
    inverseOnSurface: "#303030",
    inversePrimary: "#d32f2f",
    elevation: {
      level0: "transparent",
      level1: "#1e1e1e",
      level2: "#232323",
      level3: "#252525",
      level4: "#272727",
      level5: "#292929",
    },
  },
};
