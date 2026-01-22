import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import { Text, IconButton, Divider, Appbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { stylesGlobal } from "./styles";

export default function CartScreen() {

  const [carrito, setCarrito] = useState([]);

  const cargarCarrito = async () => {
    try {
      const stored = await AsyncStorage.getItem("cart");
      setCarrito(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.log("Error loading cart:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarCarrito();
    }, [])
  );

  const guardarCarrito = async (data) => {
    setCarrito(data);
    await AsyncStorage.setItem("cart", JSON.stringify(data));
  };

  const cambiarCantidad = (id, delta) => {
    const actualizado = carrito.map(item =>
      item.id === id
        ? { ...item, cantidad: Math.max(item.cantidad + delta, 1) }
        : item
    );
    guardarCarrito(actualizado);
  };

  const eliminarItem = (id) => {
    const filtrado = carrito.filter(item => item.id !== id);
    guardarCarrito(filtrado);
  };

  const limpiarCarrito = async () => {
    setCarrito([]);
    await AsyncStorage.removeItem("cart");
  };

  const carritoOrdenado = useMemo(
    () => [...carrito].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [carrito]
  );

  const subTotal = carritoOrdenado.reduce(
    (acc, item) => acc + parseFloat(item.precio) * item.cantidad,
    0
  );

  const TASA_IVA = 0.12;

  const impuesto = subTotal * TASA_IVA;

  const total = subTotal + impuesto;

  const ordenarPedido = () => {
    const payload = {
      items: carritoOrdenado,
      subTotal,
      impuesto,
      total
    };
    console.log("Pedido listo:", payload);
  };

  return (
    <View style={[stylesGlobal.container, { flex: 1 }]}>
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.Action icon="arrow-left" style={{ opacity: 0 }} onPress={() => { }} disabled/>
        <Appbar.Content title="Carrito" titleStyle={stylesGlobal.headerTitle}/>
        {carrito.length > 0 ? (
          <Appbar.Action icon="delete" color="white" onPress={limpiarCarrito}/>
        ) : (
          <Appbar.Action icon="delete" style={{ opacity: 0 }} onPress={() => { }} disabled/>
        )}
      </Appbar.Header>

      {carritoOrdenado.length === 0 ? (
  // 🛒 CARRITO VACÍO
  <View style={styles.emptyContainer}>
    <FontAwesome
      name="shopping-cart"
      size={70}
      color="#bbb"
    />
    <Text style={styles.emptyText}>
      Tu carrito está vacío
    </Text>
    <Text style={styles.emptySubText}>
      Agrega productos para continuar
    </Text>
  </View>
) : (
      // 🧾 CARRITO CON ITEMS
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {carritoOrdenado.map(item => (
          <View key={item.id} style={styles.cartCard}>
            <Image source={{ uri: item.img }} style={styles.productImage} />

            <View style={styles.infoContainer}>
              <Text style={styles.productName}>{item.nombre}</Text>
              <Text style={styles.productPrice}>${item.precio}</Text>

              {/* STEPPER */}
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => cambiarCantidad(item.id, -1)}
                >
                  <Text style={styles.stepperText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyText}>{item.cantidad}</Text>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => cambiarCantidad(item.id, 1)}
                >
                  <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* DERECHA */}
            <View style={styles.rightAction}>
              <IconButton
                icon="close"
                size={20}
                style={styles.closeBtn}
                onPress={() => eliminarItem(item.id)}
              />
              <Text style={styles.itemTotal}>
                ${(item.precio * item.cantidad).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    )}

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>SubTotal</Text>
          <Text style={styles.totalValue}>${subTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Impuesto (12%)</Text>
          <Text style={styles.totalValue}>${impuesto.toFixed(2)}</Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.finalTotalLabel}>Total</Text>
          <Text style={styles.finalTotalValue}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.orderBtn} onPress={ordenarPedido}>
          <Text style={styles.orderBtnText}>ORDENAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  scrollContent: { padding: 20 },

  cartCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: { width: 80, height: 80, borderRadius: 40 },
  infoContainer: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 18, fontWeight: 'bold' },
  productPrice: { fontSize: 16, color: 'gray', marginVertical: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  stepperBtn: {
    backgroundColor: '#f1b46c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepperText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  qtyText: { marginHorizontal: 15, fontSize: 18, fontWeight: 'bold' },

  rightAction: { alignItems: 'flex-end', justifyContent: 'space-between', height: 80 },
  closeBtn: { margin: 0, marginTop: -10, marginRight: -10 },
  itemTotal: { fontSize: 20, fontWeight: 'bold' },

  footer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    paddingBottom: 40,
    elevation: 10,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  divider: { height: 2, backgroundColor: '#1a0a05', marginVertical: 15 },
  finalTotalLabel: { fontSize: 20, fontWeight: 'bold' },
  finalTotalValue: { fontSize: 20, fontWeight: 'bold' },

  orderBtn: {
    backgroundColor: '#d32f2f',
    borderRadius: 25,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  orderBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 40,
},

emptyText: {
  fontSize: 20,
  fontWeight: "bold",
  marginTop: 15,
},

emptySubText: {
  fontSize: 16,
  color: "gray",
  marginTop: 5,
  textAlign: "center",
},
});