import React, { useCallback, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import {
  Appbar,
  Card,
  Text,
  Avatar,
  Divider,
  List,
  Switch,
  Button,
  Portal,
  Modal,
} from "react-native-paper";

import { useAppContext } from "../../context/AppContext";
import { stylesGlobal } from "../customer_guest/styles";
import { stylesProfile } from "./styles";
import { stylesAdmin } from "../admin/styles";

export default function AccountScreen({ navigation }) {
  const { user, isDarkTheme, toggleTheme, logout } = useAppContext();

  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } finally {
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  const dynamicModalStyle = [
    stylesAdmin.modal,
    { backgroundColor: isDarkTheme ? "#1e1e1e" : "white" },
  ];

  return (
    <View
      style={[
        stylesProfile.container,
        { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" },
      ]}
    >
      {/* Header */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => {}} style={{ opacity: 0 }} disabled />
        <Appbar.Content title="Perfil" titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action color="white" onPress={() => {}} style={{ opacity: 0 }} disabled />
      </Appbar.Header>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#d32f2f"]}
          />
        }
      >
        {/* Card usuario */}
        <Card style={stylesProfile.cardPerfil}>
          <View style={stylesProfile.avatarContainer}>
            <Avatar.Icon size={80} icon="account" style={stylesProfile.avatar} />
          </View>

          <Card.Content>
            <Text style={stylesProfile.name}>
              {user?.nombres && user?.apellidos
                ? `${user.nombres} ${user.apellidos}`
                : "Usuario"}
            </Text>

            <Text style={stylesProfile.email}>
              {user?.email || "—"}
            </Text>
          </Card.Content>
        </Card>

        <Divider />

        {/* Cuenta */}
        <List.Section title="Mi Cuenta" style={stylesProfile.sectionSpacing}>
          <List.Item
            title="Ver perfil"
            left={() => <List.Icon icon="account-edit" />}
            onPress={() => navigation.navigate("Profile")}
          />
        </List.Section>

        <Divider />

        {/* Configuración */}
        <List.Section title="Configuración" style={stylesProfile.sectionSpacing}>
          <List.Item
            title="Modo oscuro"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => (
              <Switch value={isDarkTheme} onValueChange={toggleTheme} />
            )}
          />
        </List.Section>

        <Divider />

        {/* Botón cerrar sesión */}
        <Button
          mode="contained"
          icon="logout"
          labelStyle={stylesProfile.btnLabel}
          style={stylesProfile.btnProfile}
          onPress={() => setShowLogoutModal(true)}
        >
          Cerrar sesión
        </Button>
      </ScrollView>

      {/* ===== MODAL CERRAR SESIÓN ===== */}
      <Portal>
        <Modal
          visible={showLogoutModal}
          onDismiss={() => setShowLogoutModal(false)}
          contentContainerStyle={dynamicModalStyle}
        >
          <Text variant="titleMedium">
            ¿Está seguro de cerrar sesión?
          </Text>

          <View style={stylesAdmin.modalActions}>
            <Button onPress={() => setShowLogoutModal(false)}>
              Cancelar
            </Button>
            <Button
              textColor="red"
              onPress={handleLogout}
              loading={loading}
            >
              Cerrar sesión
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
