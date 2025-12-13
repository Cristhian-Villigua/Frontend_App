import { createContext, useContext, useState, useMemo } from "react";
import { PaperLightTheme, PaperDarkTheme } from "../theme/PaperTheme";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [user, setUser] = useState(null);

  const toggleTheme = () => setIsDarkTheme(v => !v);

  const login = (demo = true) => {
    const demoUser = {
      nombre: "Joel Cedeño",
      correo: "joel@example.com",
      rol: "Estudiante",
      ingreso: "2025-02-01",
      bio: "Aprendiendo React Native",
    };
    setUser(demo ? demoUser : null);
  };

  const logout = () => setUser(null);

  const paperTheme = useMemo(() => (isDarkTheme ? PaperDarkTheme : PaperLightTheme), [isDarkTheme]);

  return (
    <AppContext.Provider value={{ isDarkTheme, toggleTheme, user, login, logout, paperTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
export default AppContext;