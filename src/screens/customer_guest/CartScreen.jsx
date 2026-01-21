import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Text, IconButton, Divider, Appbar } from "react-native-paper";
import { stylesGlobal } from "./styles";

export default function CarritoScreen({ route }) {

  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    if (route.params?.items) {
      setCarrito(route.params.items);
    }
  }, [route.params?.items]);

  const carritoOrdenado = useMemo(() => {
    return [...carrito].sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  }, [carrito]);
  

  const subTotal = carritoOrdenado.reduce((acc, item) => {
    return acc + parseFloat(item.precio) * item.cantidad;
  }, 0);

  const impuesto = subTotal * 0.02;
  const total = subTotal + impuesto;

  // 🔹 FUNCIÓN VACÍA PARA ENVIAR DATOS
  const ordenarPedido = () => {
    const payload = {
      items: carritoOrdenado,
      subTotal,
      impuesto,
      total
    };

    console.log("Pedido listo para enviar:", payload);
    // apiClient.post("/api/orders", payload)
  };

  return (
    <View style={[stylesGlobal.container, { flex: 1 }]}>
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.Content title="Carrito" titleStyle={stylesGlobal.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {carritoOrdenado.map(item => (
          <View key={item.id} style={styles.cartCard}>
            <Image source={{ uri: item.img }} style={styles.productImage} />

            <View style={styles.infoContainer}>
              <Text style={styles.productName}>{item.nombre}</Text>
              <Text style={styles.productPrice}>${item.precio}</Text>
              <Text>Cantidad: {item.cantidad}</Text>
            </View>

            <Text style={styles.itemTotal}>
              ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>SubTotal</Text>
          <Text style={styles.totalValue}>${subTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Impuesto</Text>
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
  orderBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});