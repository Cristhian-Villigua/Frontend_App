import { useState } from "react";
import { View, Platform, Pressable, StyleSheet } from "react-native";
import { Button, Text, Snackbar, TextInput, RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome6 } from "@expo/vector-icons";
import { styles } from "./styles";
import { useForm } from "../../../components/useForm";
import InputField from "../../../components/InputField";
import { validateBirthday, validatePassword } from "../../../utils/validation";
import { webStyles } from "./webStyles";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  let register = "Registrarse";
  const [birthday, setBirthday] = useState("");
  const [birthdayDate, setBirthdayDate] = useState(null);
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
      celular: phone,
      genero: gender,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post('http://192.168.0.107:8000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{register}</Text>
      <InputField
        label="Nombres"
        value={name}
        onChange={handleNameChange}
        error={nameError}
        icon="user"
        style={styles.input}
      />
      <InputField
        label="Apellidos"
        value={lastName}
        onChange={handleLastNameChange}
        error={lastNameError}
        icon="user"
        style={styles.input}
      />
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
      

      <InputField
        label="Teléfono"
        value={phone}
        onChange={handlePhoneChange}
        error={phoneError}
        icon="phone"
        style={styles.input}
      />
      <InputField
        label="Correo"
        value={email}
        onChange={handleEmailChange}
        error={emailError}
        icon="envelope"
        style={styles.input}
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
        style={styles.input}
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
          display="spinner"
          maximumDate={new Date()}
          onChange={onChangeBirthday}
        />
      )}
    </View>
  );
}
