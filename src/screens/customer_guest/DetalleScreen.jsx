import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { Text, Appbar, IconButton, Snackbar } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../../service/apiClient";
import { stylesGlobal } from "./styles";

export default function DetalleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { plato: initialPlato } = route.params;

  const [plato, setPlato] = useState(initialPlato);
  const [cantidad, setCantidad] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // 🔄 Pull to refresh
  const refreshPlato = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await apiClient.get(`/api/items/${plato.id}`);
      setPlato({
        ...response.data,
        picUrl: Array.isArray(response.data.picUrl)
          ? response.data.picUrl
          : []
      });
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }, [plato.id]);

  // 🛒 Agregar al carrito
  const agregarAlCarrito = async () => {
    if (cantidad <= 0) return;

    const nuevoItem = {
      id: plato.id,
      nombre: plato.title,
      precio: plato.price,
      cantidad,
      img: plato.picUrl[0]
    };

    try {
      const stored = await AsyncStorage.getItem("cart");
      let existing = stored ? JSON.parse(stored) : [];

      const existe = existing.find(item => item.id === nuevoItem.id);

      if (existe) {
        existing = existing.map(item =>
          item.id === nuevoItem.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        existing.push(nuevoItem);
      }

      await AsyncStorage.setItem("cart", JSON.stringify(existing));
      setCantidad(1);
      setSnackbarVisible(true);

    } catch (error) {
      console.log("Error guardando carrito:", error);
    }
  };

  return (
    <View style={stylesGlobal.container}>
      {/* Header */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalle" titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action icon="heart-outline" color="white" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPlato} />
        }
      >
        {/* Imagen */}
        <Image
          source={{ uri: plato.picUrl[0] }}
          style={styles.imageMain}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.nombrePlato}>{plato.title}</Text>
          <Text style={styles.categoriaTexto}>Plato principal</Text>

          {/* Cantidad + rating */}
          <View style={styles.row}>
            <View style={styles.stepper}>
              <Text style={styles.qtyLabel}>Cantidad</Text>
              <View style={styles.stepperControls}>
                <TouchableOpacity
                  onPress={() => setCantidad(prev => Math.max(prev - 1, 1))}
                >
                  <Text style={styles.stepperBtn}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyNumber}>{cantidad}</Text>

                <TouchableOpacity
                  onPress={() => setCantidad(prev => Math.min(prev + 1, 25))}
                >
                  <Text style={styles.stepperBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>4.8</Text>
              <IconButton icon="star" size={20} iconColor="black" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descripcionText}>
            {plato.description || "Sin descripción disponible."}
          </Text>

          {/* Botón carrito */}
          <TouchableOpacity
            style={styles.btnCarrito}
            onPress={agregarAlCarrito}
          >
            <Text style={styles.btnText}>Añadir al carrito</Text>
            <Text style={styles.btnPrice}>${plato.price}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
      >
        Producto agregado al carrito
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  imageMain: {
    width: "100%",
    height: 300,
    resizeMode: "cover"
  },

  infoContainer: {
    backgroundColor: "#fff4ea",
    marginTop: -40,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 25,
    minHeight: 400
  },

  nombrePlato: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a0a05"
  },

  categoriaTexto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a0a05",
    marginTop: 15
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center"
  },

  qtyLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10
  },

  stepperControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a0a05",
    borderRadius: 20,
    paddingHorizontal: 10
  },

  stepperBtn: {
    fontSize: 24,
    paddingHorizontal: 10,
    color: "#1a0a05"
  },

  qtyNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10
  },

  ratingBox: {
    flexDirection: "row",
    alignItems: "center"
  },

  ratingText: {
    fontSize: 18,
    fontWeight: "bold"
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a0a05",
    marginBottom: 10
  },

  descripcionText: {
    fontSize: 16,
    color: "#4a4a4a",
    lineHeight: 22
  },

  btnCarrito: {
    backgroundColor: "#1a0a05",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 30,
    marginTop: 30,
    alignItems: "center"
  },

  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },

  btnPrice: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  }
});
