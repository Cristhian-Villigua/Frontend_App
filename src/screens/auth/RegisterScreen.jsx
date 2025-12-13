import { useState } from "react";
import { View, Platform, Pressable } from "react-native";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome6 } from "@expo/vector-icons";
import { styles } from "./styles";
import {
    validateName,
    validateLastname,
    validateBirthday,
    validatePhone,
    validateEmail,
    validatePassword,
    validateConfirmPassword
} from "../../utils/validation";

export default function RegisterScreen({ navigation }) {
    let register = "Registrarse";

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthdayDate, setBirthdayDate] = useState(null);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [nameError, setNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [birthdayError, setBirthdayError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const goToLogin = () => navigation.replace("Login");

    const handleRegister = () => {
        if (!name || !lastName || !birthday || !phone || !email || !password || !confirmPassword) {
            setSnackbarMessage("Todos los campos son obligatorios.");
            setSnackbarVisible(true);
            return;
        }

        if (nameError || lastNameError || birthdayError || phoneError || emailError || passwordError || confirmPasswordError) {
            setSnackbarMessage("Corrige los errores antes de continuar.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSnackbarMessage("Registro exitoso");
            setSnackbarVisible(true);

            setName("");
            setLastName("");
            setBirthday("");
            setPhone("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }, 1200);
    };

    const onChangeBirthday = (event, selectedDate) => {
        setShowDatePicker(false);

        if (!selectedDate) return;

        setBirthdayDate(selectedDate);

        const formattedDate = selectedDate.toLocaleDateString("es-EC");
        setBirthday(formattedDate);

        const v = validateBirthday(formattedDate);
        setBirthdayError(v.message);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{register}</Text>
            <TextInput
                label="Nombres"
                mode="outlined"
                activeOutlineColor={nameError ? "red" : name ? "green" : "black"}
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    const v = validateName(text);
                    setNameError(v.message);
                }}
                style={styles.input}
                error={!!nameError}
                left={<TextInput.Icon icon={() => <FontAwesome6 name="user" size={20}
                    color={nameError ? "red" : name ? "green" : "black"} solid />} />}
                right={
                    name ? (
                        nameError ? (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => setName("")} />
                        ) : (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="green" solid />} />
                        )
                    ) : null
                }
            />
            {nameError ? <Text style={{ color: "red", marginTop: -8 }}>{nameError}</Text> : null}

            <TextInput
                label="Apellidos"
                mode="outlined"
                activeOutlineColor={lastNameError ? "red" : lastName ? "green" : "black"}
                value={lastName}
                onChangeText={(text) => {
                    setLastName(text);
                    const v = validateLastname(text);
                    setLastNameError(v.message);
                }}
                style={styles.input}
                error={!!lastNameError}
                left={<TextInput.Icon icon={() => <FontAwesome6 name="user" size={20}
                    color={lastNameError ? "red" : lastName ? "green" : "black"} solid />} />}
                right={
                    lastName ? (
                        lastNameError ? (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => setLastName("")} />
                        ) : (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="green" solid />} />
                        )
                    ) : null
                }
            />
            {lastNameError ? <Text style={{ color: "red", marginTop: -8 }}>{lastNameError}</Text> : null}

            <Pressable onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                    <TextInput
                        label="Fecha de nacimiento"
                        mode="outlined"
                        value={birthday}
                        activeOutlineColor={birthdayError ? "red" : birthday ? "green" : "black"}
                        style={styles.input}
                        error={!!birthdayError}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="calendar-days" size={20}
                            color={birthdayError ? "red" : birthday ? "green" : "black"} solid />} />}
                        right={
                            birthday ? (
                                birthdayError ? (
                                    <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20}color="red" solid/>} />
                                ) : (
                                    <TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="green" solid />} />
                                )
                            ) : null
                        }
                    />
                </View>
            </Pressable>
            {birthdayError ? <Text style={{ color: "red", marginTop: -8 }}>{birthdayError}</Text> : null}

            <TextInput
                label="Teléfono"
                mode="outlined"
                activeOutlineColor={phoneError ? "red" : phone ? "green" : "black"}
                value={phone}
                onChangeText={(text) => {
                    setPhone(text);
                    const v = validatePhone(text);
                    setPhoneError(v.message);
                }}
                style={styles.input}
                keyboardType="phone-pad"
                error={!!phoneError}
                maxLength={10}
                left={<TextInput.Icon icon={() => <FontAwesome6 name="phone" size={20}
                    color={phoneError ? "red" : phone ? "green" : "black"} solid />} />}
                right={
                    phone ? (
                        phoneError ? (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => setPhone("")} />
                        ) : (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="green" solid />} />
                        )
                    ) : null
                }
            />
            {phoneError ? <Text style={{ color: "red", marginTop: -8 }}>{phoneError}</Text> : null}

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

            <TextInput
                label="Confirmar contraseña"
                mode="outlined"
                activeOutlineColor={confirmPasswordError ? "red" : confirmPassword ? "green" : "black"}
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    const v = validateConfirmPassword(password, text);
                    setConfirmPasswordError(v.message);
                }}
                secureTextEntry={!showPassword}
                style={styles.input}
                error={!!confirmPasswordError}
                left={<TextInput.Icon icon={() => <FontAwesome6 name="lock" size={20}
                    color={confirmPasswordError ? "red" : confirmPassword ? "green" : "black"} solid />} />}
                right={
                    confirmPassword ? (
                        confirmPasswordError ? (
                            <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => setConfirmPassword("")} />
                        ) : (
                            <TextInput.Icon icon={() => <FontAwesome6 name="eye" size={20} color="green" solid />} onPress={() => setShowPassword(!showPassword)} />
                        )
                    ) : null
                }
            />
            {confirmPasswordError ? <Text style={{ color: "red", marginTop: -8 }}>{confirmPasswordError}</Text> : null}

            <Button
                mode="contained"
                loading={loading}
                style={styles.button}
                onPress={handleRegister}>
                {register}
            </Button>

            <Text style={styles.link}>
                ¿Ya tienes una cuenta?{" "}
                <Text style={{ color: "red" }} onPress={goToLogin}>Inicie Sesión</Text>
            </Text>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
            {showDatePicker && (
                <DateTimePicker
                    value={birthdayDate || new Date()}
                    mode="date"
                    display={Platform.OS === "android" ? "spinner" : "spinner"}
                    maximumDate={new Date()}
                    onChange={onChangeBirthday}
                />
            )}
        </View>
    );
}