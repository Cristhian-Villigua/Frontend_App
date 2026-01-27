import { useState } from "react";
import {
    View,
    Pressable,
    ImageBackground,
    ScrollView,
} from "react-native";
import {
    Button,
    Text,
    Snackbar,
    TextInput,
    RadioButton,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "./styles";
import { webStyles } from "./webStyles";
import { useForm } from "../../../components/useForm";
import { useAppContext } from "../../../context/AppContext"; 
import {
    validateBirthday,
    validatePassword,
} from "../../../utils/validation";
import {
    formatDateToDisplay,
    formatDateToISO,
} from "../../../utils/date";
import apiClient from "../../../service/apiClient";

const MAX_NAME_LENGTH = 20;
const MAX_PHONE_LENGTH = 10;
const MAX_EMAIL_LENGTH = 30;
const PASSWORD_LENGTH = 20;

const maxDateLimit = new Date();
maxDateLimit.setFullYear(maxDateLimit.getFullYear() - 18);

export default function RegisterScreen({ navigation }) {
    const { isDarkTheme } = useAppContext(); 
    const register = "Registrarse";

    const [birthday, setBirthday] = useState("");
    const [birthdayDate, setBirthdayDate] = useState(maxDateLimit);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthdayError, setBirthdayError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const {
        name,
        lastName,
        phone,
        email,
        nameError,
        lastNameError,
        phoneError,
        emailError,
        handleNameChange,
        handleLastNameChange,
        handlePhoneChange,
        handleEmailChange,
    } = useForm();

    const goToLogin = () => navigation.replace("Login");

    // Colores dinámicos
    const iconDefaultColor = isDarkTheme ? "#fff" : "black";
    const containerBg = isDarkTheme ? "rgba(30, 30, 30, 0.95)" : "rgba(255,255,255,0.9)";
    const inputBg = isDarkTheme ? "#2c2c2c" : "#fff";
    const textColor = isDarkTheme ? "#fff" : "#000";

    const onChangeBirthday = (event, selectedDate) => {
        setShowDatePicker(false);
        if (!selectedDate) return;
        setBirthdayDate(selectedDate);
        const displayDate = formatDateToDisplay(selectedDate);
        setBirthday(displayDate);
        const v = validateBirthday(displayDate);
        setBirthdayError(v.message);
    };

    const localHandlePhoneChange = (text) => {
        let numeric = text.replace(/\D/g, "");
        if (numeric.length < 2) numeric = "09";
        if (!numeric.startsWith("09")) numeric = "09" + numeric.slice(2);
        if (numeric.length > MAX_PHONE_LENGTH) numeric = numeric.slice(0, MAX_PHONE_LENGTH);
        handlePhoneChange(numeric);
    };

    const handleRegister = async () => {
        if (!name || !lastName || !birthday || !gender || !phone || !email || !password) {
            setSnackbarMessage("Todos los campos son obligatorios.");
            setSnackbarVisible(true);
            return;
        }
        setLoading(true);
        try {
            const formData = {
                nombres: name,
                apellidos: lastName,
                birthdate: formatDateToISO(birthdayDate),
                genero: gender,
                celular: phone,
                email: email,
                password: password,
            };
            const response = await apiClient.post("/api/auth/register", formData);
            if (response.status === 201) {
                navigation.replace("Login");
            }
        } catch (error) {
            setSnackbarMessage(error.response?.data?.error || "Error de red.");
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    // Helper para renderizar iconos derechos (Validación)
    const renderRightIcon = (error, value, clearFunc) => {
        if (!value) return null;
        return (
            <TextInput.Icon
                icon={() => (
                    <FontAwesome6 
                        name={error ? "circle-xmark" : "circle-check"} 
                        size={20} 
                        color={error ? "red" : "green"} 
                        solid 
                    />
                )}
                onPress={error && clearFunc ? () => clearFunc("") : undefined}
            />
        );
    };

    return (
        <ImageBackground source={require("../../../../assets/background_auth.jpg")} style={{ flex: 1 }} resizeMode="cover">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                <View style={[styles.container, { backgroundColor: containerBg, marginVertical: 50, borderRadius: 20, padding: 20 }]}>
                    <Text style={[styles.title, { color: textColor }]}>{register}</Text>

                    {/* Nombres */}
                    <TextInput
                        label="Nombres"
                        mode="outlined"
                        value={name}
                        onChangeText={handleNameChange}
                        error={!!nameError}
                        style={[styles.input, { backgroundColor: inputBg }]}
                        textColor={textColor}
                        activeOutlineColor={nameError ? "red" : name ? "green" : (isDarkTheme ? "#d32f2f" : "black")}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="user" size={20} color={nameError ? "red" : name ? "green" : iconDefaultColor} solid />} />}
                        right={renderRightIcon(nameError, name, handleNameChange)}
                    />
                    {nameError && <Text style={{ color: "red", marginTop: -8 }}>{nameError}</Text>}

                    {/* Apellidos */}
                    <TextInput
                        label="Apellidos"
                        mode="outlined"
                        value={lastName}
                        onChangeText={handleLastNameChange}
                        error={!!lastNameError}
                        style={[styles.input, { backgroundColor: inputBg }]}
                        textColor={textColor}
                        activeOutlineColor={lastNameError ? "red" : lastName ? "green" : (isDarkTheme ? "#d32f2f" : "black")}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="user" size={20} color={lastNameError ? "red" : lastName ? "green" : iconDefaultColor} solid />} />}
                        right={renderRightIcon(lastNameError, lastName, handleLastNameChange)}
                    />
                    {lastNameError && <Text style={{ color: "red", marginTop: -8 }}>{lastNameError}</Text>}

                    {/* Fecha */}
                    <Pressable onPress={() => setShowDatePicker(true)}>
                        <View pointerEvents="none">
                            <TextInput
                                label="Fecha de nacimiento"
                                mode="outlined"
                                value={birthday}
                                error={!!birthdayError}
                                style={[styles.input, { backgroundColor: inputBg }]}
                                textColor={textColor}
                                left={<TextInput.Icon icon={() => <FontAwesome6 name="calendar-days" size={20} color={birthdayError ? "red" : birthday ? "green" : iconDefaultColor} solid />} />}
                                right={renderRightIcon(birthdayError, birthday)}
                            />
                        </View>
                    </Pressable>
                    {birthdayError && <Text style={{ color: "red", marginTop: -8 }}>{birthdayError}</Text>}

                    {/* Género */}
                    <Text style={[webStyles.label, { color: textColor }]}>Género</Text>
                    <RadioButton.Group value={gender} onValueChange={setGender}>
                        <View style={webStyles.radioGroup}>
                            <View style={webStyles.radioItem}>
                                <FontAwesome6 name="mars" size={16} color={textColor} />
                                <RadioButton value="Hombre" color={isDarkTheme ? "#d32f2f" : "green"} uncheckedColor={textColor} />
                                <Text style={{ color: textColor }}>Hombre</Text>
                            </View>
                            <View style={webStyles.radioItem}>
                                <FontAwesome6 name="venus" size={16} color={textColor} />
                                <RadioButton value="Mujer" color={isDarkTheme ? "#d32f2f" : "green"} uncheckedColor={textColor} />
                                <Text style={{ color: textColor }}>Mujer</Text>
                            </View>
                        </View>
                    </RadioButton.Group>

                    {/* Teléfono */}
                    <TextInput
                        label="Teléfono"
                        mode="outlined"
                        keyboardType="numeric"
                        value={phone}
                        onChangeText={localHandlePhoneChange}
                        error={!!phoneError}
                        style={[styles.input, { backgroundColor: inputBg }]}
                        textColor={textColor}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="phone" size={20} color={phoneError ? "red" : phone ? "green" : iconDefaultColor} solid />} />}
                        right={renderRightIcon(phoneError, phone, handlePhoneChange)}
                    />
                    {phoneError && <Text style={{ color: "red", marginTop: -8 }}>{phoneError}</Text>}

                    {/* Correo */}
                    <TextInput
                        label="Correo"
                        mode="outlined"
                        value={email}
                        onChangeText={handleEmailChange}
                        error={!!emailError}
                        style={[styles.input, { backgroundColor: inputBg }]}
                        textColor={textColor}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="envelope" size={20} color={emailError ? "red" : email ? "green" : iconDefaultColor} solid />} />}
                        right={renderRightIcon(emailError, email, handleEmailChange)}
                    />
                    {emailError && <Text style={{ color: "red", marginTop: -8 }}>{emailError}</Text>}

                    {/* Contraseña */}
                    <TextInput
                        label="Contraseña"
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError(validatePassword(text).message);
                        }}
                        error={!!passwordError}
                        style={[styles.input, { backgroundColor: inputBg }]}
                        textColor={textColor}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="lock" size={20} color={passwordError ? "red" : password ? "green" : iconDefaultColor} solid />} />}
                        right={
                            password ? (
                                <TextInput.Icon
                                    icon={() => <FontAwesome6 name={showPassword ? "eye-slash" : "eye"} size={20} color={passwordError ? "red" : "green"} solid />}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            ) : null
                        }
                    />
                    {passwordError && <Text style={{ color: "red", marginTop: -8 }}>{passwordError}</Text>}

                    <Button mode="contained" loading={loading} style={styles.button} onPress={handleRegister} buttonColor="#d32f2f">
                        {register}
                    </Button>

                    <Text style={[styles.link, { color: textColor }]}>
                        ¿Ya tienes una cuenta?{" "}
                        <Text style={{ color: "red", fontWeight: 'bold' }} onPress={goToLogin}>Inicia sesión</Text>
                    </Text>

                    <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>{snackbarMessage}</Snackbar>

                    {showDatePicker && (
                        <DateTimePicker value={birthdayDate} mode="date" display="spinner" maximumDate={maxDateLimit} onChange={onChangeBirthday} />
                    )}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}