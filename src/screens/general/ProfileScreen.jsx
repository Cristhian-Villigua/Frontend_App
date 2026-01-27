import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Appbar, Card, Text, Avatar, Divider, List } from "react-native-paper";
import apiClient from "../../service/apiClient";
import { useAppContext } from "../../context/AppContext";
import { stylesGlobal } from "../customer_guest/styles";
import { stylesProfile } from "../general/styles";
import {
  parseISOToDate,
  formatDateToDisplay,
} from "../../utils/date";

export default function ProfileScreen({ navigation }) {
  const { isDarkTheme, user, userType } = useAppContext();

  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async () => {
    setRefreshing(true);

    try {
      const isCliente = userType === "cliente";
      let response;

      if (isCliente) {
        response = await apiClient.get("/api/me");
      } else {
        response = await apiClient.get("/api/usuarios/me");
      }

      setProfile(response.data);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getFormattedBirthdate = () => {
    if (!profile?.birthdate) return "—";

    const date = parseISOToDate(profile.birthdate);
    if (!date) return "—";

    return formatDateToDisplay(date);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = useCallback(() => {
    loadProfile();
  }, []);

  return (
    <View style={[stylesProfile.container, { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" }]}>
      {/* Header */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Mi Perfil" titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action color="white" style={{ opacity: 0 }} disabled />
      </Appbar.Header>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#d32f2f"]} />
        }
      >
        {/* Card principal */}
        <Card style={stylesProfile.cardPerfil}>
          <View style={stylesProfile.avatarContainer}>
            <Avatar.Icon size={90} icon="account" style={stylesProfile.avatar} />
          </View>

          <Card.Content>
            <Text style={stylesProfile.name}>
              {profile ? `${profile.nombres} ${profile.apellidos}` : "—"}
            </Text>

            <Text style={stylesProfile.email}>
              {profile?.email || "—"}
            </Text>
          </Card.Content>
        </Card>

        <Divider />

        {/* Información personal */}
        <List.Section title="Información personal" style={stylesProfile.sectionSpacing}>
          <List.Item
            title="Teléfono"
            description={profile?.celular || "—"}
            left={() => <List.Icon icon="phone" />}
          />

          <List.Item
            title="Género"
            description={profile?.genero || "—"}
            left={() => <List.Icon icon="account-outline" />}
          />

          <List.Item
            title="Fecha de nacimiento"
            description={getFormattedBirthdate() || "—"}
            left={() => <List.Icon icon="calendar" />}
          />
        </List.Section>

        <Divider />

        {/* Acciones */}
        <List.Section style={stylesProfile.sectionSpacing}>
          <List.Item
            title="Editar perfil"
            left={() => <List.Icon icon="account-edit" />}
            onPress={() =>
              navigation.navigate("EditProfile", { profile })
            }
          />
        </List.Section>
      </ScrollView>
    </View>
  );
}