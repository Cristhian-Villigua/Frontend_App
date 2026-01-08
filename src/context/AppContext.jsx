import { createContext, useContext, useState, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperLightTheme, PaperDarkTheme } from "../theme/PaperTheme";
import apiClient from "../service/apiClient";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const login = async (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    await AsyncStorage.setItem("token", tokenValue);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };


  const logout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (e) {}
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    };
    useEffect(() => {
      const loadSession = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
        setLoadingAuth(false);
      };
        loadSession();
    }, []);


  const toggleTheme = () => setIsDarkTheme((prev) => !prev);
  const paperTheme = isDarkTheme ? PaperDarkTheme : PaperLightTheme;
  const value = useMemo(
    () => ({ user, token, login, logout, loadingAuth, isDarkTheme,
    toggleTheme, paperTheme }),
    [user, token, isDarkTheme, paperTheme, loadingAuth]
  );
  return <AppContext.Provider
  value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
 return useContext(AppContext);
}