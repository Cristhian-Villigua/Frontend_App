import { PaperProvider } from "react-native-paper";
import { PaperTheme } from "./src/theme/PaperTheme";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";


export default function App() {
  return (
    <PaperProvider theme={PaperTheme}>
      <RegisterScreen/>
      {/* <LoginScreen/> */}
    </PaperProvider>
  );
}