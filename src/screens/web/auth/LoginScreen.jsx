import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Button, Text, TextInput, Snackbar, Card } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { webStyles } from "../../mobile/auth/webStyles";
import {useForm} from '../../../components/useForm';
import InputField from "../../../components/InputField";
import { validatePassword } from "../../../utils/validation";

export default function LoginScreen({ navigation }) {
    let login = "Iniciar Sesión";

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const{
        email, emailError, handleEmailChange
    } = useForm();

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
        <View style={webStyles.container}>
            <Card style={webStyles.card}>
                <Card.Content>
                    <Text style={webStyles.title}>{login}</Text>
            <InputField 
                label="Correo"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                icon="envelope"
                style={webStyles.inputWeb}
            />
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
                style={webStyles.inputWeb}
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
                style={webStyles.buttonWeb}
                onPress={handleLogin}
            >
                {login}
            </Button>

            <Text style={webStyles.link}>
                ¿No tienes cuenta?{" "}
                <Text style={{ color: "red" }} onPress={goToRegister}>Registrarse</Text>
            </Text>

            <Text style={webStyles.link}>
                Ingresa como invitado{" "}
                <Text style={{ color: "red" }} onPress={goToMenu}>Invitado</Text>
            </Text>
                </Card.Content>
            </Card>

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