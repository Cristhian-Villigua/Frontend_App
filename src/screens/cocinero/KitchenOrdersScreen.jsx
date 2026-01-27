import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Appbar, Card, Text, Button, Chip, IconButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../service/apiClient";
import { useAppContext } from "../../context/AppContext";

export default function KitchenOrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isDarkTheme } = useAppContext();

    const fetchPendingOrders = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/api/cocinero/orders/pending");
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPendingOrders();
        }, [])
    );

    const confirmOrder = (id) => {
        Alert.alert(
            "Confirmar Pedido",
            "¿Marcar este pedido como completado?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        try {
                            await apiClient.put(`/api/cocinero/orders/${id}/status`, { status: "Completado" });
                            fetchPendingOrders();
                        } catch (error) {
                            Alert.alert("Error", "No se pudo actualizar el pedido");
                        }
                    }
                }
            ]
        );
    };

    const deleteOrder = (id) => {
        Alert.alert(
            "Eliminar Pedido",
            "¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await apiClient.delete(`/api/cocinero/orders/${id}`);
                            fetchPendingOrders();
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el pedido");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Card style={[styles.card, { backgroundColor: isDarkTheme ? "#1E1E1E" : "white" }]}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleLarge" style={[styles.orderTitle, { color: isDarkTheme ? "#fff" : "#000" }]}>Orden #{item.id}</Text>
                    <Chip 
                        icon="clock-outline" 
                        style={{ backgroundColor: isDarkTheme ? "#333" : "#ebebeb" }}
                        textStyle={{ color: isDarkTheme ? "#fff" : "#000" }}
                    >
                        {new Date(item.created_at).toLocaleTimeString()}
                    </Chip>
                </View>
                <Text variant="bodyMedium" style={{ marginBottom: 10, color: isDarkTheme ? "#ccc" : "#444" }}>
                    Cliente: {item.cliente ? `${item.cliente.nombres} ${item.cliente.apellidos}` : "Desconocido"}
                </Text>

                {item.items && item.items.map((orderItem, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={[styles.qty, { color: isDarkTheme ? "#fff" : "#000" }]}>{orderItem.quantity}x</Text>
                        <Text style={[styles.itemName, { color: isDarkTheme ? "#ccc" : "#000" }]}>
                            {orderItem.item ? orderItem.item.title : "Item eliminado"}
                        </Text>
                    </View>
                ))}

                <View style={[styles.totalRow, { borderTopColor: isDarkTheme ? "#444" : "#eee" }]}>
                    <Text variant="titleMedium" style={{ color: isDarkTheme ? "#fff" : "#000" }}>Total: ${item.total}</Text>
                </View>
            </Card.Content>
            <Card.Actions style={styles.actions}>
                <IconButton
                    icon="trash-can-outline"
                    iconColor={isDarkTheme ? "#ff5252" : "red"}
                    size={24}
                    onPress={() => deleteOrder(item.id)}
                />
                <Button
                    mode="contained"
                    onPress={() => confirmOrder(item.id)}
                    buttonColor={isDarkTheme ? "#388e3c" : "#4caf50"}
                    textColor="white"
                >
                    Confirmar
                </Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={{ flex: 1, backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" }}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Pedidos Pendientes" titleStyle={{ fontWeight: 'bold', color: 'white' }} />
            </Appbar.Header>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                refreshing={loading}
                onRefresh={fetchPendingOrders}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.empty}>
                            <Text variant="titleMedium" style={{ color: isDarkTheme ? "#aaa" : "#000" }}>No hay pedidos pendientes</Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    appbar: { backgroundColor: "#d32f2f" },
    list: { padding: 16 },
    card: { marginBottom: 16 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, alignItems: "center" },
    orderTitle: { fontWeight: "bold" },
    itemRow: { flexDirection: "row", marginBottom: 4 },
    qty: { fontWeight: "bold", marginRight: 8, minWidth: 20 },
    itemName: { flex: 1 },
    totalRow: { marginTop: 10, borderTopWidth: 1, paddingTop: 5 },
    actions: { justifyContent: "space-between", paddingTop: 10 },
    empty: { alignItems: "center", marginTop: 50 }
});