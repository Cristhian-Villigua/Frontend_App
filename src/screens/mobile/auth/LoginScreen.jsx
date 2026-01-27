import { useState } from "react";
import { View, ImageBackground } from "react-native";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { styles } from "./styles";
import { useForm } from "../../../components/useForm";
import { validatePassword } from "../../../utils/validation";
import { useAppContext } from "../../../context/AppContext";
import apiClient from "../../../service/apiClient";

const MAX_EMAIL_LENGTH = 30;
const PASSWORD_LENGTH = 20;

export default function LoginScreen({ navigation }) {
  const { login, isDarkTheme } = useAppContext(); // Extraemos isDarkTheme

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { email, emailError, handleEmailChange } = useForm();

  const goToRegister = () => navigation.replace("Register");

  const localHandleEmailChange = (text) => {
    handleEmailChange(text.slice(0, MAX_EMAIL_LENGTH));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setSnackbarMessage("Todos los campos son obligatorios");
      setSnackbarVisible(true);
      return;
    }

    try {
      setLoading(true);

      const { data } = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      await login(data.user, data.token, data.type, data.role);

    } catch (error) {
      setSnackbarMessage("Credenciales incorrectas");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Color dinámico para iconos y bordes
  const defaultColor = isDarkTheme ? "#fff" : "black";

  return (
    <ImageBackground
      source={require('../../../../assets/background_auth.jpg')}
      style={{ flex: 1, justifyContent: 'center' }}
      resizeMode="cover"
    >
      <View style={[
        styles.container, 
        { 
          backgroundColor: isDarkTheme ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.9)', 
          margin: 20, 
          borderRadius: 20, 
          padding: 20, 
          flex: 0 
        }
      ]}>
        <Text style={[styles.title, { color: isDarkTheme ? "#fff" : "#000" }]}>Login</Text>

        {/* EMAIL */}
        <TextInput
          label="Correo"
          mode="outlined"
          activeOutlineColor={
            emailError ? "red" : email ? "green" : (isDarkTheme ? "#d32f2f" : "black")
          }
          outlineColor={isDarkTheme ? "#555" : "#ccc"}
          textColor={isDarkTheme ? "#fff" : "#000"}
          value={email}
          onChangeText={localHandleEmailChange}
          style={[styles.input, { backgroundColor: isDarkTheme ? "#2c2c2c" : "#fff" }]}
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={MAX_EMAIL_LENGTH}
          error={!!emailError}
          left={
            <TextInput.Icon
              icon={() => (
                <FontAwesome6
                  name="envelope"
                  size={20}
                  color={emailError ? "red" : email ? "green" : defaultColor}
                  solid
                />
              )}
            />
          }
          right={
            email ? (
              emailError ? (
                <TextInput.Icon
                  icon={() => (
                    <FontAwesome6 name="circle-xmark" size={20} color="red" solid />
                  )}
                  onPress={() => handleEmailChange("")}
                />
              ) : (
                <TextInput.Icon
                  icon={() => (
                    <FontAwesome6 name="circle-check" size={20} color="green" solid />
                  )}
                />
              )
            ) : null
          }
        />

        {emailError && (
          <Text style={{ color: "red", marginTop: -8 }}>
            {emailError}
          </Text>
        )}

        {/* PASSWORD */}
        <TextInput
          label="Contraseña"
          mode="outlined"
          activeOutlineColor={
            passwordError ? "red" : password ? "green" : (isDarkTheme ? "#d32f2f" : "black")
          }
          outlineColor={isDarkTheme ? "#555" : "#ccc"}
          textColor={isDarkTheme ? "#fff" : "#000"}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            const v = validatePassword(text);
            setPasswordError(v.message);
          }}
          secureTextEntry={!showPassword}
          style={[styles.input, { backgroundColor: isDarkTheme ? "#2c2c2c" : "#fff" }]}
          maxLength={PASSWORD_LENGTH}
          error={!!passwordError}
          left={
            <TextInput.Icon
              icon={() => (
                <FontAwesome6
                  name="lock"
                  size={20}
                  color={passwordError ? "red" : password ? "green" : defaultColor}
                  solid
                />
              )}
            />
          }
          right={
            password ? (
              passwordError ? (
                <TextInput.Icon
                  icon={() => (
                    <FontAwesome6 name="circle-xmark" size={20} color="red" solid />
                  )}
                  onPress={() => setPassword("")}
                />
              ) : (
                <TextInput.Icon
                  icon={() => (
                    <FontAwesome6 name="eye" size={20} color="green" solid />
                  )}
                  onPress={() => setShowPassword(!showPassword)}
                />
              )
            ) : null
          }
        />

        {passwordError && (
          <Text style={{ color: "red", marginTop: -8 }}>
            {passwordError}
          </Text>
        )}

        {/* BUTTON */}
        <Button
          mode="contained"
          loading={loading}
          style={styles.button}
          onPress={handleLogin}
          buttonColor="#d32f2f"
        >
          Iniciar Sesión
        </Button>

        {/* LINKS */}
        <Text style={[styles.link, { color: isDarkTheme ? "#bbb" : "#000" }]}>
          ¿No tienes cuenta?{" "}
          <Text style={{ color: "#d32f2f", fontWeight: 'bold' }} onPress={goToRegister}>
            Registrarse
          </Text>
        </Text>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </ImageBackground>
  );
}