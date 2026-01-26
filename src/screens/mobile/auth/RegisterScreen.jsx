import { useState } from "react";
import { View, Pressable, ImageBackground, ScrollView } from "react-native";
import { Button, Text, Snackbar, TextInput, RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome6 } from "@expo/vector-icons";
import { styles } from "./styles";
import { useForm } from "../../../components/useForm";
import {
    validateBirthday,
    validatePassword,
} from "../../../utils/validation";
import { webStyles } from "./webStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from "../../../service/apiClient";

const MAX_NAME_LENGTH = 20;
const MAX_PHONE_LENGTH = 10;
const MAX_EMAIL_LENGTH = 30;
const PASSWORD_LENGTH = 20;
const maxDateLimit = new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());


export default function RegisterScreen({ navigation }) {
    let register = "Registrarse";
    const [birthday, setBirthday] = useState("");
    const [birthdayDate, setBirthdayDate] = useState(maxDateLimit);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [birthdayError, setBirthdayError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        name, lastName, phone, email,
        nameError, lastNameError, phoneError, emailError,
        handleNameChange, handleLastNameChange, handlePhoneChange, handleEmailChange
    } = useForm();

    const goToLogin = () => navigation.replace("Login");

    const handleRegister = async () => {
        if (!name || !lastName || !birthday || !gender || !phone || !email || !password) {
            setSnackbarMessage("Todos los campos son obligatorios.");
            setSnackbarVisible(true);
            return;
        }

        if (nameError || lastNameError || birthdayError || phoneError || emailError || passwordError) {
            setSnackbarMessage("Corrige los errores antes de continuar.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);

        const formData = {
            nombres: name,
            apellidos: lastName,
            birthdate: birthday,
            genero: gender,
            celular: phone,
            email: email,
            password: password,
        };

        try {
            const response = await apiClient.post('/api/auth/register', formData);
            if (response.status === 201) {
                const { token, client } = response.data;
                await AsyncStorage.setItem('auth_token', token);
                setSnackbarMessage("Registro exitoso");
                setSnackbarVisible(true);
                setBirthday("");
                setGender("");
                setPassword("");
                navigation.replace("Login");
            } else {
                setSnackbarMessage(response.data.error || 'Error desconocido');
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error('Error al registrar: ', error);
            if (error.response) {
                console.log("Respuesta de error del servidor:", error.response);
                setSnackbarMessage(error.response.data.error || 'Error de servidor');
            } else {
                setSnackbarMessage('Error de red. Intenta nuevamente.');
            }
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
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

    const localHandlePhoneChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        let newPhone = numericText;

        if (newPhone.length < 2) {
            newPhone = "09";
        } else if (!newPhone.startsWith("09")) {
            newPhone = "09" + newPhone.substring(2);
        }

        if (newPhone.length > MAX_PHONE_LENGTH) {
            newPhone = newPhone.substring(0, MAX_PHONE_LENGTH);
        }

        handlePhoneChange(newPhone);
    };

    return (
        <ImageBackground
            source={require('../../../../assets/background_auth.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={[styles.container, { backgroundColor: 'rgba(255, 255, 255, 0.9)', margin: 20, borderRadius: 20, padding: 20 }]}>
                    <Text style={styles.title}>{register}</Text>

                    <TextInput
                        label="Nombres"
                        mode="outlined"
                        activeOutlineColor={nameError ? "red" : name ? "green" : "black"}
                        value={name}
                        onChangeText={handleNameChange}
                        style={styles.input}
                        maxLength={MAX_NAME_LENGTH}
                        error={!!nameError}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="user" size={20} color={nameError ? "red" : name ? "green" : "black"} solid />} />}
                        right={
                            name ? (
                                nameError ? (
                                    <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => handleNameChange("")} />
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
                        onChangeText={handleLastNameChange}
                        style={styles.input}
                        maxLength={MAX_NAME_LENGTH}
                        error={!!lastNameError}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="user" size={20} color={lastNameError ? "red" : lastName ? "green" : "black"} solid />} />}
                        right={
                            lastName ? (
                                lastNameError ? (
                                    <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => handleLastNameChange("")} />
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
                                left={<TextInput.Icon icon={() => <FontAwesome6 name="calendar-days" size={20} color={birthdayError ? "red" : birthday ? "green" : "black"} solid />} />}
                            />
                        </View>
                        {birthdayError ? <Text style={{ color: "red", marginTop: -8 }}>{birthdayError}</Text> : null}
                    </Pressable>

                    <Text style={webStyles.label}>Género</Text>
                    <RadioButton.Group onValueChange={(value) => setGender(value)} value={gender}>
                        <View style={webStyles.radioGroup}>
                            {["Mujer", "Hombre", "Personalizado"].map((option) => (
                                <View style={webStyles.radioItem} key={option}>
                                    <RadioButton value={option} />
                                    <Text style={webStyles.radioLabel}>{option}</Text>
                                </View>
                            ))}
                        </View>
                    </RadioButton.Group>

                    <TextInput
                        label="Teléfono"
                        mode="outlined"
                        activeOutlineColor={phoneError ? "red" : phone ? "green" : "black"}
                        value={phone}
                        onChangeText={localHandlePhoneChange}
                        style={styles.input}
                        keyboardType="numeric"
                        maxLength={MAX_PHONE_LENGTH}
                        error={!!phoneError}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="phone" size={20} color={phoneError ? "red" : phone ? "green" : "black"} solid />} />}
                        right={
                            phone ? (
                                phoneError ? (
                                    <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => handlePhoneChange("")} />
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
                        onChangeText={handleEmailChange}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        maxLength={MAX_EMAIL_LENGTH}
                        error={!!emailError}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="envelope" size={20} color={emailError ? "red" : email ? "green" : "black"} solid />} />}
                        right={
                            email ? (
                                emailError ? (
                                    <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => handleEmailChange("")} />
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
                        maxLength={PASSWORD_LENGTH}
                        error={!!passwordError}
                        left={<TextInput.Icon icon={() => <FontAwesome6 name="lock" size={20} color={passwordError ? "red" : password ? "green" : "black"} solid />} />}
                        right={password ? (
                            passwordError ? (
                                <TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="red" solid />} onPress={() => setPassword("")} />
                            ) : (
                                <TextInput.Icon icon={() => <FontAwesome6 name="eye" size={20} color="green" solid />} onPress={() => setShowPassword(!showPassword)} />
                            )
                        ) : null}
                    />
                    {passwordError ? <Text style={{ color: "red", marginTop: -8 }}>{passwordError}</Text> : null}

                    <Button
                        mode="contained"
                        loading={loading}
                        style={styles.button}
                        onPress={handleRegister}
                        buttonColor="#d32f2f"
                    >
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
                            display="spinner"
                            maximumDate={maxDateLimit}
                            onChange={onChangeBirthday}
                        />
                    )}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}