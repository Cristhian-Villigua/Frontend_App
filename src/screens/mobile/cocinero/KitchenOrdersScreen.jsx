import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Appbar, Card, Text, Button, Chip, IconButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../../service/apiClient";

export default function KitchenOrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

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
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleLarge" style={styles.orderTitle}>Orden #{item.id}</Text>
                    <Chip icon="clock-outline">{new Date(item.created_at).toLocaleTimeString()}</Chip>
                </View>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>Cliente: {item.cliente ? `${item.cliente.nombres} ${item.cliente.apellidos}` : "Desconocido"}</Text>

                {item.items && item.items.map((orderItem, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.qty}>{orderItem.quantity}x</Text>
                        <Text style={styles.itemName}>{orderItem.item ? orderItem.item.title : "Item eliminado"}</Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text variant="titleMedium">Total: ${item.total}</Text>
                </View>
            </Card.Content>
            <Card.Actions style={styles.actions}>
                <IconButton
                    icon="trash-can-outline"
                    iconColor="red"
                    size={24}
                    onPress={() => deleteOrder(item.id)}
                />
                <Button
                    mode="contained"
                    onPress={() => confirmOrder(item.id)}
                    buttonColor="#4caf50"
                >
                    Confirmar
                </Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
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
                            <Text variant="titleMedium">No hay pedidos pendientes</Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    appbar: { backgroundColor: "#d32f2f" },
    list: { padding: 16 },
    card: { marginBottom: 16, backgroundColor: "white" },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, alignItems: "center" },
    orderTitle: { fontWeight: "bold" },
    itemRow: { flexDirection: "row", marginBottom: 4 },
    qty: { fontWeight: "bold", marginRight: 8, minWidth: 20 },
    itemName: { flex: 1 },
    totalRow: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 5 },
    actions: { justifyContent: "space-between", paddingTop: 10 },
    empty: { alignItems: "center", marginTop: 50 }
});
