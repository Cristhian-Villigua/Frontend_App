import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Portal,
  Modal,
  HelperText,
  Appbar,
  Menu,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome6 } from "@expo/vector-icons";

import apiClient from "../../service/apiClient";
import { useAppContext } from "../../context/AppContext";
import { stylesAdmin } from "./styles";

// utils
import {
  formatDateToISO,
  formatDateToDisplay,
  parseISOToDate,
} from "../../utils/date";

import {
  validateName,
  validateLastname,
  validatePhone,
  validateBirthday,
} from "../../utils/validation";

export default function OptiontsCustomerScreen({ route, navigation }) {
  const cliente = route?.params?.cliente || null;
  const isEdit = Boolean(cliente);
  const { isDarkTheme } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ================== GÉNERO MENU ================== */
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);

  /* ================== FECHA ================== */
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDateValue, setBirthDateValue] = useState(
    cliente?.birthdate
      ? parseISOToDate(cliente.birthdate)
      : new Date()
  );
  const [birthDateText, setBirthDateText] = useState(
    cliente?.birthdate
      ? formatDateToDisplay(parseISOToDate(cliente.birthdate))
      : ""
  );

  /* ================== FORM ================== */
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    celular: "",
    genero: "",
    password: "",
  });

  /* ================== ERRORES ================== */
  const [errors, setErrors] = useState({
    nombres: "",
    apellidos: "",
    celular: "",
    genero: "",
    birthdate: "",
  });

  useEffect(() => {
    if (cliente) {
      setForm({
        nombres: cliente.nombres ?? "",
        apellidos: cliente.apellidos ?? "",
        email: cliente.email ?? "",
        celular: cliente.celular ?? "",
        genero: cliente.genero ?? "",
        password: "",
      });
    }
  }, [cliente]);

  const isDisabled = loading || deleteMode;

  /* ================== HANDLERS ================== */
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (text) => {
    updateField("nombres", text);
    setErrors((e) => ({ ...e, nombres: validateName(text).message }));
  };

  const handleLastNameChange = (text) => {
    updateField("apellidos", text);
    setErrors((e) => ({
      ...e,
      apellidos: validateLastname(text).message,
    }));
  };

  const handlePhoneChange = (text) => {
    const numeric = text.replace(/\D/g, "");
    updateField("celular", numeric);
    setErrors((e) => ({
      ...e,
      celular: validatePhone(numeric).message,
    }));
  };

  const handleGeneroSelect = (value) => {
    updateField("genero", value);
    setErrors((e) => ({
      ...e,
      genero: value ? "" : "El género es requerido",
    }));
    setGenderMenuVisible(false);
  };

  const onChangeBirthday = (event, selectedDate) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    setBirthDateValue(selectedDate);
    const formatted = formatDateToDisplay(selectedDate);
    setBirthDateText(formatted);

    setErrors((e) => ({
      ...e,
      birthdate: validateBirthday(formatted).message,
    }));
  };

  /* ================== SUBMIT ================== */
  const handleSubmit = async () => {
    // ⛔ BLOQUEO PRINCIPAL
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        birthdate: birthDateValue
          ? formatDateToISO(birthDateValue)
          : null,
      };

      if (!payload.password) delete payload.password;

      if (isEdit) {
        await apiClient.put(
          `/api/admin/clientes/${cliente.id}`,
          payload
        );
      } else {
        await apiClient.post(`/api/admin/clientes`, payload);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================== DELETE ================== */
  const handleDelete = async () => {
    try {
      setLoading(true);
      await apiClient.delete(`/api/admin/clientes/${cliente.id}`);
      setShowDeleteModal(false);
      navigation.goBack();
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const dynamicModalStyle = {
    ...stylesAdmin.modal,
    backgroundColor: isDarkTheme ? "#000" : "#fff4ea",
  };

  const validateForm = () => {
    const newErrors = {
      nombres: validateName(form.nombres).message,
      apellidos: validateLastname(form.apellidos).message,
      celular: validatePhone(form.celular).message,
      genero: form.genero ? "" : "El género es requerido",
      birthdate: validateBirthday(birthDateText).message,
    };

    setErrors(newErrors);

    // si algún error tiene texto → NO es válido
    return Object.values(newErrors).every((e) => e === "");
  };

  /* ================== UI ================== */
  return (
    <View
      style={[
        stylesAdmin.container,
        { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" },
      ]}
    >
      <Appbar.Header style={stylesAdmin.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={
            deleteMode
              ? "Eliminar Cliente"
              : isEdit
                ? "Editar Cliente"
                : "Nuevo Cliente"
          }
          titleStyle={stylesAdmin.headerTitle}
        />
        <Appbar.Action color="white" style={{ opacity: 0 }} disabled />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <ValidatedInput
          label="Nombres"
          value={form.nombres}
          onChangeText={handleNameChange}
          error={errors.nombres}
          icon="user"
          disabled={isDisabled}
        />

        <ValidatedInput
          label="Apellidos"
          value={form.apellidos}
          onChangeText={handleLastNameChange}
          error={errors.apellidos}
          icon="user"
          disabled={isDisabled}
        />

        <TextInput
          label="Email"
          value={form.email}
          onChangeText={(v) => updateField("email", v)}
          disabled={isEdit}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={() => <FontAwesome6 name="envelope" size={18} />}
            />
          }
        />

        <ValidatedInput
          label="Celular"
          value={form.celular}
          onChangeText={handlePhoneChange}
          error={errors.celular}
          icon="phone"
          keyboardType="phone-pad"
          disabled={isDisabled}
        />

        {/* ===== GÉNERO DESPLEGABLE ===== */}
        <Menu
          visible={genderMenuVisible}
          onDismiss={() => setGenderMenuVisible(false)}
          anchor={
            <Pressable onPress={() => setGenderMenuVisible(true)}>
              <View pointerEvents="none">
                <ValidatedInput
                  label="Género"
                  value={form.genero}
                  error={errors.genero}
                  icon="venus-mars"
                  disabled={isDisabled}
                  rightIcon="chevron-down"
                />
              </View>
            </Pressable>
          }
        >
          <Menu.Item
            title="Hombre"
            leadingIcon="gender-male"
            onPress={() => handleGeneroSelect("Hombre")}
          />
          <Menu.Item
            title="Mujer"
            leadingIcon="gender-female"
            onPress={() => handleGeneroSelect("Mujer")}
          />
        </Menu>

        {/* ===== FECHA ===== */}
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <ValidatedInput
              label="Fecha de nacimiento"
              value={birthDateText}
              error={errors.birthdate}
              icon="calendar-days"
              disabled={isDisabled}
            />
          </View>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={birthDateValue}
            mode="date"
            display="spinner"
            onChange={onChangeBirthday}
          />
        )}

        {!isEdit && !deleteMode && (
          <>
            <TextInput
              label="Contraseña"
              secureTextEntry
              value={form.password}
              onChangeText={(v) => updateField("password", v)}
              disabled={loading}
              style={styles.input}
            />
            <HelperText type="info">Mínimo 8 caracteres</HelperText>
          </>
        )}

        {/* ===== BOTONES ===== */}
        {!deleteMode && (
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            style={styles.button}
          >
            {isEdit ? "Actualizar" : "Crear"}
          </Button>
        )}

        {isEdit && !deleteMode && (
          <Button
            mode="contained"
            onPress={() => setDeleteMode(true)}
            style={{ marginHorizontal: 50 }}
          >
            Eliminar cliente
          </Button>
        )}

        {deleteMode && (
          <View style={{ gap: 10 }}>
            <Button
              mode="contained"
              onPress={() => setShowDeleteModal(true)}
              style={{ marginHorizontal: 50 }}
            >
              Confirmar eliminación
            </Button>

            <Button
              mode="contained"
              onPress={() => setDeleteMode(false)}
              style={{ marginHorizontal: 50 }}
            >
              Cancelar
            </Button>
          </View>
        )}
      </View>

      {/* ===== MODAL ELIMINAR ===== */}
      <Portal>
        <Modal
          visible={showDeleteModal}
          onDismiss={() => setShowDeleteModal(false)}
          contentContainerStyle={dynamicModalStyle}
        >
          <Text variant="titleMedium">
            ¿Está seguro de eliminar esta cuenta?
          </Text>

          <View style={stylesAdmin.modalActions}>
            <Button onPress={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button
              textColor="red"
              onPress={handleDelete}
              loading={loading}
            >
              Eliminar
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

/* ================== INPUT REUTILIZABLE ================== */
const ValidatedInput = ({
  label,
  value,
  onChangeText,
  error,
  icon,
  disabled,
  keyboardType,
  rightIcon,
}) => (
  <>
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      disabled={disabled}
      keyboardType={keyboardType}
      error={!!error}
      style={styles.input}
      left={
        <TextInput.Icon
          icon={() => (
            <FontAwesome6
              name={icon}
              size={18}
              color={error ? "red" : value ? "green" : "black"}
              solid
            />
          )}
        />
      }
      right={
        rightIcon ? (
          <TextInput.Icon icon={rightIcon} />
        ) : value ? (
          error ? (
            <TextInput.Icon
              icon={() => (
                <FontAwesome6 name="circle-xmark" size={18} color="red" solid />
              )}
            />
          ) : (
            <TextInput.Icon
              icon={() => (
                <FontAwesome6 name="circle-check" size={18} color="green" solid />
              )}
            />
          )
        ) : null
      }
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
  button: {
    marginHorizontal: 50,
    marginTop: 12,
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    marginTop: -8,
    marginBottom: 8,
  },
});
