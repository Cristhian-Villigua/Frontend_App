import { DefaultTheme } from "react-native-paper";

export const PaperTheme = {
    ...DefaultTheme,

    colors: {
        ...DefaultTheme.colors,
        primary: "#E53935",
        secondary: "#EF5350",
        background: "#FFF",
        text: "#212121",
        error: "#ff0000",
        success: "#7CFC00",
    }
}