import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { styles } from "./styles";
import { validateEmail, validatePassword } from "../../utils/validation";

export default function LoginScreen({ navigation }) {
    let login = "Iniciar Sesión";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const goToMenu = () => navigation.replace("Dashboard");
    const goToRegister = () => navigation.replace("Register");


    const handleLogin = () => {
        if (!email || !password) {
            setSnackbarMessage("Todos los campos son obligatorios.");
            setSnackbarVisible(true);
            return;
        }

        if (emailError || passwordError) {
            setSnackbarMessage("Corrige los errores antes de continuar.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSnackbarMessage("Inicio de sesión exitoso");
            setSnackbarVisible(true);
            setEmail("");
            setPassword("");
            goToMenu();
        }, 1200);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{login}</Text>

            <TextInput
                label="Correo"
                mode="outlined"
                activeOutlineColor={emailError ? "red" : email ? "green" : "black"}
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    const v = validateEmail(text);
                    setEmailError(v.message);
                }}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!emailError}
                left={<TextInput.Icon icon={() => <FontAwesome6 name="envelope" size={20}
                    color={emailError ? "red" : email ? "green" : "black"} solid />} />}
                right={
                    email ? (
                        emailError ? (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => setEmail("")} />
                        ) : (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="green" solid />} />
                        )
                    ) : null
                }
            />
            {emailError ? <Text style={{ color: "red", marginTop: -8 }}>{emailError}</Text> : null}

            <TextInput
                label="Contraseña"
                mode="outlined"
                activeOutlineColor={passwordError ? "red" : password ? "green" : "black"}
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    const v = validatePassword(text);
                    setPasswordError(v.message);
                }}
                secureTextEntry={!showPassword}
                style={styles.input}
                error={!!passwordError}
                left={<TextInput.Icon icon={() => <FontAwesome6 name="lock" size={20}
                    color={passwordError ? "red" : password ? "green" : "black"} solid />} />}
                right={
                    password ? (
                        passwordError ? (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => setPassword("")} />
                        ) : (
                            <TextInput.Icon icon={() => <FontAwesome6 name="eye" size={20} color="green" solid />} onPress={() => setShowPassword(!showPassword)} />
                        )
                    ) : null
                }
            />
            {passwordError ? <Text style={{ color: "red", marginTop: -8 }}>{passwordError}</Text> : null}

            <Button
                mode="contained"
                loading={loading}
                style={styles.button}
                onPress={handleLogin}
            >
                {login}
            </Button>

            <Text style={styles.link}>
                ¿No tienes cuenta?{" "}
                <Text style={{ color: "red" }} onPress={goToRegister}>Registrarse</Text>
            </Text>

            <Text style={styles.link}>
                Ingresa como invitado{" "}
                <Text style={{ color: "red" }} onPress={goToMenu}>Invitado</Text>
            </Text>

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