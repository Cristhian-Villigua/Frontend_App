import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Appbar, Text, Surface, Divider, Chip } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../service/apiClient";
import { stylesGlobal } from "./styles";

export default function HistoryScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/api/orders");
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const renderItem = ({ item }) => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <View>
                    <Text variant="titleMedium" style={styles.orderId}>Orden #{item.id}</Text>
                    <Text variant="bodySmall" style={styles.date}>{formatDate(item.createdAt || item.date)}</Text>
                </View>
                <Chip icon="check-circle-outline" style={styles.chip} textStyle={{ color: "white", fontSize: 12 }}>
                    {item.status || "Completado"}
                </Chip>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.cardBody}>
                <Text variant="bodyMedium">Total items: {item.items ? item.items.length : 0}</Text>
                <Text variant="titleLarge" style={styles.totalPrice}>
                    ${parseFloat(item.total).toFixed(2)}
                </Text>
            </View>
        </Surface>
    );

    return (
        <View style={stylesGlobal.container}>
            <Appbar.Header style={stylesGlobal.appbar}>
                <Appbar.BackAction color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
                <Appbar.Content title="Historial" titleStyle={stylesGlobal.headerTitle} />
                <Appbar.Action color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
            </Appbar.Header>

            <View style={styles.content}>
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchHistory} colors={["#d32f2f"]} />
                    }
                    ListEmptyComponent={
                        !loading && (
                            <View style={styles.emptyContainer}>
                                <Text variant="titleMedium" style={{ color: "gray" }}>No tienes pedidos anteriores.</Text>
                            </View>
                        )
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    listContent: {
        padding: 16,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    orderId: {
        fontWeight: "bold",
        color: "#333",
    },
    date: {
        color: "gray",
        marginTop: 4,
    },
    chip: {
        backgroundColor: "#4caf50", // Green for success/completed
        height: 32,
    },
    divider: {
        marginVertical: 12,
        backgroundColor: "#eee",
    },
    cardBody: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalPrice: {
        fontWeight: "bold",
        color: "#d32f2f",
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    }
});
