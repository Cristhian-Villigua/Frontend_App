import React, { useCallback, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Appbar, Card, Text, Avatar, Divider, List, Switch, Button } from "react-native-paper";
import { useAppContext } from "../../context/AppContext";
import { stylesGlobal } from "../customer_guest/styles";
import { stylesProfile } from "./styles";

export default function AccountScreen({ navigation }) {
  const { user, isDarkTheme, toggleTheme, logout } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  return (
    <View style={[stylesProfile.container, { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" }]}>
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
              {user?.name && user?.lastname
                ? `${user.name} ${user.lastname}`
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
            left={() => <List.Icon icon="account-edit"/>}
            onPress={() => navigation.navigate("Profile")}
          />
        </List.Section>

        <Divider />

        {/* Configuración */}
        <List.Section title="Configuración" style={stylesProfile.sectionSpacing}>
          <List.Item
            title="Modo oscuro"
            left={() => <List.Icon icon="theme-light-dark"/>}
            right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} />}
          />
        </List.Section>
        <Divider />
        <Button
              mode="outlined"
              icon="logout"
              labelStyle={stylesProfile.btnLabel}
              style={stylesProfile.btnProfile}
              onPress={logout}
            >
              Cerrar sesión
            </Button>
      </ScrollView>
    </View>
  );
}
