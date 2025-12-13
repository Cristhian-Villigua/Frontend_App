import {
  MD3LightTheme as DefaultLightTheme,
  MD3DarkTheme as DefaultDarkTheme,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";

const colors = {
  primary: "#E53935",
  secondary: "#EF5350",
  backgroundLight: "#FFFFFF",
  backgroundDark: "#121212",
  textLight: "#212121",
  textDark: "#FFFFFF",
  error: "#FF0000",
  success: "#7CFC00",
};

export const PaperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.backgroundLight,
    surface: colors.backgroundLight,
    text: colors.textLight,
    error: colors.error,
    success: colors.success,
  },
};

export const PaperLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.backgroundLight,
    surface: colors.backgroundLight,
    text: colors.textLight,
    error: colors.error,
    success: colors.success,
  },
};

export const PaperDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    primary: colors.secondary,
    secondary: colors.primary,
    background: colors.backgroundDark,
    surface: colors.backgroundDark,
    text: colors.textDark,
    error: colors.error,
    success: colors.success,
  },
};
