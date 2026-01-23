import { createContext, useContext, useState, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperLightTheme, PaperDarkTheme } from "../theme/PaperTheme";
import apiClient from "../service/apiClient";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const login = async (userData, tokenValue, type, role = null) => {
    setUser(userData);
    setToken(tokenValue);
    setUserType(type);
    setUserRole(role);

    await AsyncStorage.multiSet([
      ["token", tokenValue],
      ["user", JSON.stringify(userData)],
      ["userType", type],
      ["userRole", role ?? ""],
    ]);
  };


  const logout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (e) { }

    setUser(null);
    setToken(null);
    setUserType(null);
    setUserRole(null);

    await AsyncStorage.multiRemove([
      "token",
      "user",
      "userType",
      "userRole",
    ]);
  };


  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      const userType = await AsyncStorage.getItem("userType");
      const userRole = await AsyncStorage.getItem("userRole");

      if (token && user && userType) {
        setToken(token);
        setUser(JSON.parse(user));
        setUserType(userType);
        setUserRole(userRole || null);
      }

      setLoadingAuth(false);
    };

    loadSession();
  }, []);


  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  const paperTheme = isDarkTheme ? PaperDarkTheme : PaperLightTheme;

  const value = useMemo(
    () => ({
      user,
      token,
      userType,
      userRole,
      login,
      logout,
      loadingAuth,
      isDarkTheme,
      toggleTheme,
      paperTheme,
    }),
    [user, token, userType, userRole, isDarkTheme, paperTheme, loadingAuth]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}