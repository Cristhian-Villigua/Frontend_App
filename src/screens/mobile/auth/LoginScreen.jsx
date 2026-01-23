import { useState } from "react";
import { View } from "react-native";
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
  const { login } = useAppContext();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { email, emailError, handleEmailChange } = useForm();

  const goToMenu = () => navigation.replace("Dashboard");
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

    console.log("LOGIN RESPONSE", {
  type: data.type,
  role: data.role,
  user: data.user,
});

    await login(data.user, data.token, data.type, data.role);

    } catch (error) {
      setSnackbarMessage("Credenciales incorrectas");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>

    {/* EMAIL */}
    <TextInput
      label="Correo"
      mode="outlined"
      activeOutlineColor={
        emailError ? "red" : email ? "green" : "black"
      }
      value={email}
      onChangeText={localHandleEmailChange}
      style={styles.input}
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
              color={emailError ? "red" : email ? "green" : "black"}
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
        passwordError ? "red" : password ? "green" : "black"
      }
      value={password}
      onChangeText={(text) => {
        setPassword(text);
        const v = validatePassword(text);
        setPasswordError(v.message);
      }}
      secureTextEntry={!showPassword}
      style={styles.input}
      maxLength={PASSWORD_LENGTH}
      error={!!passwordError}
      left={
        <TextInput.Icon
          icon={() => (
            <FontAwesome6
              name="lock"
              size={20}
              color={passwordError ? "red" : password ? "green" : "black"}
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
    >
      Iniciar Sesión
    </Button>

    {/* LINKS */}
    <Text style={styles.link}>
      ¿No tienes cuenta?{" "}
      <Text style={{ color: "red" }} onPress={goToRegister}>
        Registrarse
      </Text>
    </Text>

    {/* <Text style={styles.link}>
      Ingresa como invitado{" "}
      <Text style={{ color: "red" }} onPress={goToMenu}>
        Invitado
      </Text>
    </Text> */}

    <Snackbar
      visible={snackbarVisible}
      onDismiss={() => setSnackbarVisible(false)}
      duration={3000}
    >
      {snackbarMessage}
    </Snackbar>
  </View>
);
}