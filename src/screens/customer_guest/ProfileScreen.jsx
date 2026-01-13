import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Appbar, Card, Text, Avatar, Divider, List, ProgressBar, Switch, Button } from "react-native-paper";
import { useAppContext } from "../../context/AppContext";
import { stylesGlobal } from "./styles";

export default function ProfileScreen({ navigation }) {
  const { user, isDarkTheme, toggleTheme, logout } = useAppContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#121212' : '#fff4ea' }]}>
      {/* Header */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
        <Appbar.Content title="Perfil" titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
      </Appbar.Header>
      <ScrollView>
        <Card style={styles.cardPerfil}>
          <View style={styles.avatarContainer}>
            <Avatar.Icon size={80} icon="account" style={{ backgroundColor: '#d32f2f' }} />
          </View>
          <Card.Title
            title={user?.name && user?.lastname ? `${user.name} ${user.lastname}` : "Usuario"}
            subtitle={user?.rol || "Cliente VIP"}
            titleStyle={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10 }}
            subtitleStyle={{ textAlign: 'center', color: '#ffb300' }}
          />
          <Card.Content>
            <Text style={{ textAlign: 'center', marginBottom: 10 }}>{user?.email}</Text>
            <Divider style={{ marginVertical: 10 }} />
            <Text variant="labelMedium" style={{ fontWeight: 'bold' }}>Nivel Foodie 🍔</Text>
            <ProgressBar progress={0.6} color="#d32f2f" style={{ height: 8, borderRadius: 5, marginTop: 5 }} />
            <Text style={{ textAlign: 'right', fontSize: 10 }}>600 pts</Text>
          </Card.Content>
        </Card>


        <List.Section title="Mi Cuenta">
          <List.Item
            title="Historial de Pedidos"
            left={() => <List.Icon icon="history" color="#d32f2f" />}
            onPress={() => navigation.navigate('History')} // Navega a HistoryScreen
          />
          <List.Item
            title="Métodos de Pago"
            left={() => <List.Icon icon="credit-card" color="#d32f2f" />}
          />
        </List.Section>

        <Divider />


        <List.Section title="Configuración">
          <List.Item
            title="Modo Oscuro"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} color="#d32f2f" />}
          />

          <View style={{ padding: 16 }}>
            <Button
              mode="outlined"
              icon="logout"
              textColor="#d32f2f"
              style={{ borderColor: '#d32f2f' }}
              onPress={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </View>
        </List.Section>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  cardPerfil: { margin: 16, padding: 10, elevation: 3, marginTop: 20 },
  avatarContainer: { alignItems: 'center', marginTop: -20 }
});