import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Appbar, Card, Text, SegmentedButtons, Chip } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../../service/apiClient";

export default function KitchenHistoryScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("today");

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const endpoint = filter === "today"
                ? "/api/cocinero/orders/history?date=today"
                : "/api/cocinero/orders/history";

            const response = await apiClient.get(endpoint);
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [filter])
    );

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleMedium" style={styles.orderTitle}>Orden #{item.id}</Text>
                    <Text variant="bodySmall" style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text variant="bodySmall" style={{ fontWeight: 'bold', marginBottom: 5 }}>Detalle del pedido:</Text>
                    {item.items && item.items.map((orderItem, index) => (
                        <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                            <Text variant="bodySmall" style={{ flex: 1 }}>{orderItem.quantity}x {orderItem.item ? orderItem.item.title : "Item eliminado"}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 }}>
                    <Text variant="titleMedium">Total: ${item.total}</Text>
                    <Chip style={{ backgroundColor: '#e0e0e0' }} textStyle={{ fontSize: 12 }}>{item.status}</Chip>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Historial de Cocina" titleStyle={{ fontWeight: 'bold', color: 'white' }} />
            </Appbar.Header>

            <View style={styles.filters}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'today', label: 'Hoy' },
                        { value: 'all', label: 'Todos' },
                    ]}
                    theme={{ colors: { secondaryContainer: '#ffccbc' } }}
                />
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                refreshing={loading}
                onRefresh={fetchHistory}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.empty}>
                            <Text variant="titleMedium">No hay pedidos en el historial</Text>
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
    filters: { padding: 16, backgroundColor: "white", elevation: 2 },
    list: { padding: 16 },
    card: { marginBottom: 12, backgroundColor: "white" },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    orderTitle: { fontWeight: "bold" },
    date: { color: "gray" },
    empty: { alignItems: "center", marginTop: 50 },
});
