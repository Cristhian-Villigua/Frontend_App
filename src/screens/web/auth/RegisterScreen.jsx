import { useState } from "react";
import { View, Platform } from "react-native";
import { Button, Text, Snackbar, TextInput, RadioButton, Card, } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { webStyles } from "../../mobile/auth/webStyles";
import { useForm } from "../../../components/useForm";
import InputField from "../../../components/InputField";
import { validatePassword } from "../../../utils/validation";
import { Picker } from "react-native-web";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
  let register = "Registrarse";
  const [birthday, setBirthday] = useState({ day: "", month: "", year: "" });
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  const handleRegister = async () => {
  if (!name || !lastName || !birthday.day || !birthday.month || !birthday.year || !gender || !phone || !email || !password) {
    setSnackbarMessage("Todos los campos son obligatorios.");
    setSnackbarVisible(true);
    return;
  }

  if (nameError || lastNameError || phoneError || emailError || passwordError) {
    setSnackbarMessage("Corrige los errores antes de continuar.");
    setSnackbarVisible(true);
    return;
  }

  setLoading(true);

  const birthdate = `${birthday.year}-${birthday.month}-${birthday.day}`;

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

        console.log("Respuesta del servidor: ", response.data);

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
            <InputField
                label="Nombres"
                value={name}
                onChange={handleNameChange}
                error={nameError}
                icon="user"
                style={webStyles.inputWeb}
            />
            <InputField
                label="Apellidos"
                value={lastName}
                onChange={handleLastNameChange}
                error={lastNameError}
                icon="user"
                style={webStyles.inputWeb}
            />

            <View>
                <Text style={webStyles.label}>Fecha de nacimiento</Text>
                <View style={webStyles.dateColumn}>
                <Picker
                    selectedValue={birthday.day}
                    style={webStyles.picker}
                    onValueChange={(value) => setBirthday({ ...birthday, day: value })}
                >
                    {[...Array(31).keys()].map((i) => (
                    <Picker.Item label={`${i + 1}`} value={`${i + 1}`} key={`day-${i}`} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={birthday.month}
                    style={webStyles.picker}
                    onValueChange={(value) => setBirthday({ ...birthday, month: value })}
                >
                    {["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."].map((m, i) => (
                    <Picker.Item label={m} value={`${i + 1}`} key={`month-${i}`} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={birthday.year}
                    style={webStyles.picker}
                    onValueChange={(value) => setBirthday({ ...birthday, year: value })}
                >
                    {[...Array(100).keys()].map((i) => (
                    <Picker.Item label={`${2025 - i}`} value={`${2025 - i}`} key={`year-${i}`} />
                    ))}
                </Picker>
            </View>

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

            <InputField
                label="Teléfono"
                value={phone}
                onChange={handlePhoneChange}
                error={phoneError}
                icon="phone"
                style={webStyles.inputWeb}
            />
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
