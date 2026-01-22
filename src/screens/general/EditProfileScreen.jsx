import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Appbar, TextInput, Button, Snackbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import apiClient from "../../service/apiClient";
import { useAppContext } from "../../context/AppContext";
import { stylesGlobal } from "../customer_guest/styles";
import { stylesProfile } from "./styles";

/**
 * Convierte Date → YYYY-MM-DD (formato backend)
 */
const formatDateToISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EditProfileScreen({ navigation, route }) {
  const { isDarkTheme } = useAppContext();
  const { profile } = route.params;

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  // 📅 Fecha de nacimiento
  const [birthdayDate, setBirthdayDate] = useState(
    profile?.birthdate ? new Date(profile.birthdate) : new Date()
  );

  const [birthday, setBirthday] = useState(
    profile?.birthdate
      ? new Date(profile.birthdate).toLocaleDateString("es-EC")
      : ""
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    nombres: profile?.nombres || "",
    apellidos: profile?.apellidos || "",
    email: profile?.email || "",
    celular: profile?.celular || "",
    genero: profile?.genero || "",
    photo: null,
  });

  const onChangeBirthday = (event, selectedDate) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    setBirthdayDate(selectedDate);
    setBirthday(selectedDate.toLocaleDateString("es-EC"));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,
        birthdate: formatDateToISO(birthdayDate),
        photo: null,
      };

      console.log("ENVIANDO:", payload);

      await apiClient.put(`/api/clientes/${profile.id}`, payload);

      setSnackbar(true);
      navigation.goBack();
    } catch (error) {
      console.error(
        "Error al actualizar perfil:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        stylesProfile.container,
        { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" },
      ]}
    >
      {/* Header */}
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
          <TextInput
            label="Nombres"
            value={form.nombres}
            onChangeText={(text) =>
              setForm({ ...form, nombres: text })
            }
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Apellidos"
            value={form.apellidos}
            onChangeText={(text) =>
              setForm({ ...form, apellidos: text })
            }
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Correo electrónico"
            value={form.email}
            disabled
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Teléfono"
            value={form.celular}
            keyboardType="phone-pad"
            onChangeText={(text) =>
              setForm({ ...form, celular: text })
            }
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Género"
            value={form.genero}
            onChangeText={(text) =>
              setForm({ ...form, genero: text })
            }
            style={{ marginBottom: 12 }}
          />

          {/* 📅 Fecha de nacimiento */}
          <Pressable onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                label="Fecha de nacimiento"
                value={birthday}
                style={{ marginBottom: 20 }}
              />
            </View>
          </Pressable>

          <TextInput
            label="Foto"
            value="Sin foto"
            disabled
            style={{ marginBottom: 20 }}
          />

          <Button
            mode="contained"
            loading={loading}
            onPress={handleSave}
            labelStyle={stylesProfile.btnLabel}
            style={ stylesProfile.btnProfile }
          >
            Guardar cambios
          </Button>
        </View>
      </ScrollView>

      <Snackbar visible={snackbar} onDismiss={() => setSnackbar(false)}>
        Perfil actualizado correctamente
      </Snackbar>

      {showDatePicker && (
        <DateTimePicker
          value={birthdayDate}
          mode="date"
          display="spinner"
          onChange={onChangeBirthday}
        />
      )}
    </View>
  );
}
