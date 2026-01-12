import { useState } from "react";
import { View, Platform } from "react-native";
import { Button, Text, Snackbar, TextInput, RadioButton, Card, } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { webStyles } from "../../mobile/auth/webStyles";
import { useForm } from "../../../components/useForm";
import { validatePassword } from "../../../utils/validation";
import { Picker } from "react-native-web";
import axios from "axios";

const MAX_NAME_LENGTH = 20;
const MAX_PHONE_LENGTH = 10;
const MAX_EMAIL_LENGTH = 30;
const PASSWORD_LENGTH = 20;
const MAX_YEAR_LIMIT = 2007;

export default function RegisterScreen({ navigation }) {
    let register = "Registrarse";
    const [birthday, setBirthday] = useState({ day: "", month: "", year: "" });
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [birthdayError, setBirthdayError] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        name, lastName, phone, email,
        nameError, lastNameError, phoneError, emailError,
        handleNameChange, handleLastNameChange, handlePhoneChange, handleEmailChange
    } = useForm();

    const goToLogin = () => navigation.replace("Login");

    const validateAge = (day, month, year) => {
        if (!day || !month || !year) return "";

        const birthYear = parseInt(year, 10);
        const birthMonth = parseInt(month, 10);
        const birthDay = parseInt(day, 10);

        const userDate = new Date(birthYear, birthMonth - 1, birthDay);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

        if (userDate > eighteenYearsAgo) {
            return "Debes tener al menos 18 años de edad.";
        }
        return "";
    };

    const handleDateChange = (type, value) => {
        const newBirthday = { ...birthday, [type]: value };
        setBirthday(newBirthday);
        
        const error = validateAge(newBirthday.day, newBirthday.month, newBirthday.year);
        setBirthdayError(error);
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

    const localHandleEmailChange = (text) => {
        let newEmail = text;
        if (newEmail.length > MAX_EMAIL_LENGTH) {
            newEmail = newEmail.substring(0, MAX_EMAIL_LENGTH);
        }
        handleEmailChange(newEmail);
    };

    const handleRegister = async () => {
        const ageError = validateAge(birthday.day, birthday.month, birthday.year);
        setBirthdayError(ageError);

        if (!name || !lastName || !birthday.day || !birthday.month || !birthday.year || !gender || !phone || !email || !password) {
            setSnackbarMessage("Todos los campos son obligatorios.");
            setSnackbarVisible(true);
            return;
        }

        if (nameError || lastNameError || phoneError || emailError || passwordError || ageError) {
            setSnackbarMessage("Corrige los errores antes de continuar.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);

        const birthdate = `${birthday.year}-${birthday.month.padStart(2, '0')}-${birthday.day.padStart(2, '0')}`;

        const formData = {
            nombres: name,
            apellidos: lastName,
            birthdate: birthdate, 
            celular: phone,
            genero: gender,
            email: email,
            password: password,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                const { token, client } = response.data; 

                localStorage.setItem('auth_token', token);

                setSnackbarMessage("Registro exitoso");
                setSnackbarVisible(true);
                setBirthday({ day: "", month: "", year: "" }); 
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

    return (
        <View style={webStyles.container}>
            <Card style={webStyles.card}>
                <Card.Content>
                    <Text style={webStyles.title}>{register}</Text>
                    
                    <TextInput
                        label="Nombres"
                        mode="outlined"
                        activeOutlineColor={nameError ? "red" : name ? "green" : "black"}
                        value={name}
                        onChangeText={handleNameChange}
                        style={webStyles.inputWeb}
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
                        style={webStyles.inputWeb}
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

                    <View>
                        <Text style={webStyles.label}>Fecha de nacimiento</Text>
                        <View style={webStyles.dateColumn}>
                        <Picker
                            selectedValue={birthday.day}
                            style={webStyles.picker}
                            onValueChange={(value) => handleDateChange("day", value)}
                        >
                            <Picker.Item label="Día" value="" />
                            {[...Array(31).keys()].map((i) => (
                            <Picker.Item label={`${i + 1}`} value={`${i + 1}`} key={`day-${i}`} />
                            ))}
                        </Picker>
                        <Picker
                            selectedValue={birthday.month}
                            style={webStyles.picker}
                            onValueChange={(value) => handleDateChange("month", value)}
                        >
                            <Picker.Item label="Mes" value="" />
                            {["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."].map((m, i) => (
                            <Picker.Item label={m} value={`${i + 1}`} key={`month-${i}`} />
                            ))}
                        </Picker>
                        <Picker
                            selectedValue={birthday.year}
                            style={webStyles.picker}
                            onValueChange={(value) => handleDateChange("year", value)}
                        >
                            <Picker.Item label="Año" value="" />
                            {[...Array(100).keys()].map((i) => (
                            <Picker.Item label={`${MAX_YEAR_LIMIT - i}`} value={`${MAX_YEAR_LIMIT - i}`} key={`year-${i}`} />
                            ))}
                        </Picker>
                    </View>
                    {birthdayError ? <Text style={{ color: "red", marginTop: 4 }}>{birthdayError}</Text> : null}

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
                    </View>

                    <TextInput
                        label="Teléfono"
                        mode="outlined"
                        activeOutlineColor={phoneError ? "red" : phone ? "green" : "black"}
                        value={phone}
                        onChangeText={localHandlePhoneChange}
                        style={webStyles.inputWeb}
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
                        onChangeText={localHandleEmailChange}
                        style={webStyles.inputWeb}
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
                        style={webStyles.inputWeb}
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
                        style={webStyles.buttonWeb}
                        onPress={handleRegister}>
                        {register}
                    </Button>

                    <Text style={webStyles.link}>
                        ¿Ya tienes una cuenta?{" "}
                        <Text style={{ color: "red" }} onPress={goToLogin}>Inicie Sesión</Text>
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