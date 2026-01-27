import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Snackbar,
  Text,
  Menu,

  RadioButton
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import apiClient from "../../service/apiClient";
import { useAppContext } from "../../context/AppContext";
import { stylesGlobal } from "../customer_guest/styles";
import { stylesProfile } from "./styles";
import { FontAwesome6 } from "@expo/vector-icons";

import {
  validateName,
  validateLastname,
  validatePhone,
  validateBirthday,
} from "../../utils/validation";

import {
  formatDateToISO,
  formatDateToDisplay,
  parseISOToDate,
} from "../../utils/date";

/* ================== CONSTANTES ================== */
const MAX_NAME_LENGTH = 20;
const MAX_PHONE_LENGTH = 10;

// Fecha máxima: hoy - 18 años
const maxDateLimit = new Date();
maxDateLimit.setFullYear(maxDateLimit.getFullYear() - 18);

export default function EditProfileScreen({ navigation, route }) {
  const { isDarkTheme, userType } = useAppContext();
  const { profile } = route.params;
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  /* ================== ESTADO FORM ================== */
  const [form, setForm] = useState({
    nombres: profile?.nombres || "",
    apellidos: profile?.apellidos || "",
    email: profile?.email || "",
    celular: profile?.celular || "",
    genero: profile?.genero || "",
  });

  /* ================== ERRORES ================== */
  const [errors, setErrors] = useState({
    nombres: "",
    apellidos: "",
    celular: "",
    birthdate: "",
  });

  /* ================== FECHA ================== */
  const initialDate = profile?.birthdate
    ? parseISOToDate(profile.birthdate)
    : maxDateLimit;

  const [birthdayDate, setBirthdayDate] = useState(initialDate);
  const [birthday, setBirthday] = useState(
    initialDate ? formatDateToDisplay(initialDate) : ""
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeBirthday = (event, selectedDate) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    setBirthdayDate(selectedDate);

    const displayDate = formatDateToDisplay(selectedDate);
    setBirthday(displayDate);

    const v = validateBirthday(displayDate);
    setErrors((prev) => ({ ...prev, birthdate: v.message }));
  };

  /* ================== HANDLERS ================== */
  const handleNameChange = (text) => {
    setForm({ ...form, nombres: text });
    setErrors((prev) => ({
      ...prev,
      nombres: validateName(text).message,
    }));
  };

  const handleLastNameChange = (text) => {
    setForm({ ...form, apellidos: text });
    setErrors((prev) => ({
      ...prev,
      apellidos: validateLastname(text).message,
    }));
  };

  const handlePhoneChange = (text) => {
    let numeric = text.replace(/\D/g, "");

    if (numeric.length < 2) numeric = "09";
    if (!numeric.startsWith("09")) numeric = "09" + numeric.slice(2);
    if (numeric.length > MAX_PHONE_LENGTH)
      numeric = numeric.slice(0, MAX_PHONE_LENGTH);

    setForm({ ...form, celular: numeric });
    setErrors((prev) => ({
      ...prev,
      celular: validatePhone(numeric).message,
    }));
  };

  /* ================== GUARDAR ================== */
  const handleSave = async () => {
    if (
      !form.nombres ||
      !form.apellidos ||
      !form.celular ||
      !birthday
    ) {
      setSnackbarMessage("Todos los campos son obligatorios.");
      setSnackbar(true);
      return;
    }

    if (
      errors.nombres ||
      errors.apellidos ||
      errors.celular ||
      errors.birthdate
    ) {
      setSnackbarMessage("Corrige los errores antes de guardar.");
      setSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        birthdate: formatDateToISO(birthdayDate),
      };

      const isCliente = userType === "cliente";
      const isStaff = userType === "usuario";

      if (isCliente) {
        await apiClient.put(`/api/clientes/${profile.id}`, payload);
      } else if (isStaff) {
        await apiClient.put(`/api/usuarios/${profile.id}`, payload);
      } else {
        throw new Error("Tipo de usuario desconocido");
      }

      setSnackbarMessage("Perfil actualizado correctamente");
      setSnackbar(true);
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setSnackbarMessage("Error al actualizar el perfil");
      setSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  /* ================== UI ================== */
  return (
    <View
      style={[
        stylesProfile.container,
        { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" },
      ]}
    >
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Editar Perfil"
          titleStyle={stylesGlobal.headerTitle}
        />
        <Appbar.Action color="white" style={{ opacity: 0 }} disabled />
      </Appbar.Header>

      <ScrollView>
        <View style={{ padding: 16 }}>
          {/* Nombres */}
          <TextInput
            label="Nombres"
            mode="outlined"
            value={form.nombres}
            onChangeText={handleNameChange}
            maxLength={MAX_NAME_LENGTH}
            error={!!errors.nombres}
            style={stylesProfile.input}
            left={
              <TextInput.Icon
                icon={() => (
                  <FontAwesome6
                    name="user"
                    size={20}
                    color={errors.nombres ? "red" : form.nombres ? "green" : "black"}
                    solid
                  />
                )}
              />
            }
            right={
              form.nombres ? (
                errors.nombres ? (
                  <TextInput.Icon
                    icon={() => (
                      <FontAwesome6 name="circle-xmark" size={20} color="red" solid />
                    )}
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
          {errors.nombres && <Text style={{ color: "red", marginTop: -8 }}>{errors.nombres}</Text>}

          {/* Apellidos */}
          <TextInput
            label="Apellidos"
            mode="outlined"
            value={form.apellidos}
            onChangeText={handleLastNameChange}
            maxLength={MAX_NAME_LENGTH}
            error={!!errors.apellidos}
            style={stylesProfile.input}
            left={
              <TextInput.Icon
                icon={() => (
                  <FontAwesome6
                    name="user"
                    size={20}
                    color={errors.apellidos ? "red" : form.apellidos ? "green" : "black"}
                    solid
                  />
                )}
              />
            }
            right={
              form.apellidos ? (
                errors.apellidos ? (
                  <TextInput.Icon
                    icon={() => (
                      <FontAwesome6 name="circle-xmark" size={20} color="red" solid />
                    )}
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
          {errors.apellidos && <Text style={{ color: "red", marginTop: -8 }}>{errors.apellidos}</Text>}

          {/* Correo (solo lectura) */}
          <TextInput
            label="Correo"
            mode="outlined"
            value={form.email}
            disabled
            style={stylesProfile.input}
            left={<TextInput.Icon icon={() => <FontAwesome6 name="envelope" size={20} />} />}
          />

          {/* Teléfono */}
          <TextInput
            label="Teléfono"
            mode="outlined"
            keyboardType="numeric"
            value={form.celular}
            onChangeText={handlePhoneChange}
            maxLength={MAX_PHONE_LENGTH}
            error={!!errors.celular}
            style={stylesProfile.input}
            left={
              <TextInput.Icon
                icon={() => (
                  <FontAwesome6
                    name="phone"
                    size={20}
                    color={errors.celular ? "red" : form.celular ? "green" : "black"}
                    solid
                  />
                )}
              />
            }
            right={
              form.celular ? (
                errors.celular ? (
                  <TextInput.Icon
                    icon={() => (
                      <FontAwesome6 name="circle-xmark" size={20} color="red" solid />
                    )}
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
          {errors.celular && <Text style={{ color: "red", marginTop: -8 }}>{errors.celular}</Text>}

          {/* Género */}
          {/* Género */}
          <Menu
            visible={genderMenuVisible}
            onDismiss={() => setGenderMenuVisible(false)}
            anchor={
              <Pressable onPress={() => setGenderMenuVisible(true)}>
                <View pointerEvents="none">
                  <TextInput
                    label="Género"
                    mode="outlined"
                    value={form.genero}
                    style={stylesProfile.input}
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <FontAwesome6
                            name="venus-mars"
                            size={18}
                            color={form.genero ? "green" : "black"}
                            solid
                          />
                        )}
                      />
                    }
                    right={<TextInput.Icon icon="chevron-down" />}
                  />
                </View>
              </Pressable>
            }
          >
            <Menu.Item
              title="Hombre"
              leadingIcon="gender-male"
              onPress={() => {
                setForm({ ...form, genero: "Hombre" });
                setGenderMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Mujer"
              leadingIcon="gender-female"
              onPress={() => {
                setForm({ ...form, genero: "Mujer" });
                setGenderMenuVisible(false);
              }}
            />
          </Menu>

          {/* Fecha */}
          <Pressable onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                label="Fecha de nacimiento"
                mode="outlined"
                value={birthday}
                error={!!errors.birthdate}
                style={stylesProfile.input}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <FontAwesome6
                        name="calendar-days"
                        size={20}
                        color={errors.birthdate ? "red" : birthday ? "green" : "black"}
                        solid
                      />
                    )}
                  />
                }
                right={
                  birthday ? (
                    !!errors.birthdate ? (
                      <TextInput.Icon
                        icon={() => (
                          <FontAwesome6 name="circle-xmark" size={20} color="red" solid />
                        )}
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
            </View>
          </Pressable>
          {errors.birthdate && <Text style={{ color: "red", marginTop: -8 }}>{errors.birthdate}</Text>}

          <Button
            mode="contained"
            loading={loading}
            buttonColor="#d32f2f"
            onPress={handleSave}
            style={stylesProfile.btnProfile}
          >
            Guardar cambios
          </Button>

          <Snackbar visible={snackbar} onDismiss={() => setSnackbar(false)}>
            {snackbarMessage}
          </Snackbar>

          {showDatePicker && (
            <DateTimePicker
              value={birthdayDate}
              mode="date"
              display="spinner"
              maximumDate={maxDateLimit}
              onChange={onChangeBirthday}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
