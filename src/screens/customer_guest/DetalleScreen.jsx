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
import { useAppContext } from "../../context/AppContext";

export default function DetalleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { plato: initialPlato } = route.params;
  const { isDarkTheme } = useAppContext();
  const [plato, setPlato] = useState(initialPlato);
  const [cantidad, setCantidad] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

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
    <View style={[
                stylesGlobal.container,
                { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" },
            ]}>
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalle" titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action icon="heart-outline" color="white" onPress={() => { }} />
      </Appbar.Header>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPlato} />
        }
      >
        <Image
          source={{ uri: plato.picUrl[0] }}
          style={styles.imageMain}
        />

        <View style={[styles.infoContainer, { backgroundColor: isDarkTheme ? "#1E1E1E" : "#fff4ea" }]}>
          <Text style={[styles.nombrePlato, { color: isDarkTheme ? "#fff" : "#1a0a05" }]}>{plato.title}</Text>
          <Text style={[styles.categoriaTexto, { color: isDarkTheme ? "#ccc" : "#1a0a05" }]}>Plato principal</Text>

          <View style={styles.row}>
            <View style={styles.stepper}>
              <Text style={[styles.qtyLabel, { color: isDarkTheme ? "#fff" : "#000" }]}>Cantidad</Text>
              <View style={[styles.stepperControls, { borderColor: isDarkTheme ? "#fff" : "#1a0a05" }]}>
                <TouchableOpacity
                  onPress={() => setCantidad(prev => Math.max(prev - 1, 1))}
                >
                  <Text style={[styles.stepperBtn, { color: isDarkTheme ? "#fff" : "#1a0a05" }]}>−</Text>
                </TouchableOpacity>

                <Text style={[styles.qtyNumber, { color: isDarkTheme ? "#fff" : "#000" }]}>{cantidad}</Text>

                <TouchableOpacity
                  onPress={() => setCantidad(prev => Math.min(prev + 1, 25))}
                >
                  <Text style={[styles.stepperBtn, { color: isDarkTheme ? "#fff" : "#1a0a05" }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.ratingBox}>
              <Text style={[styles.ratingText, { color: isDarkTheme ? "#fff" : "#000" }]}>4.8</Text>
              <IconButton icon="star" size={20} iconColor={isDarkTheme ? "#FFD700" : "black"} />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: isDarkTheme ? "#fff" : "#1a0a05" }]}>Descripción</Text>
          <Text style={[styles.descripcionText, { color: isDarkTheme ? "#bbb" : "#4a4a4a" }]}>
            {plato.description || "Sin descripción disponible."}
          </Text>

          <TouchableOpacity
            style={[styles.btnCarrito, { backgroundColor: isDarkTheme ? "#d32f2f" : "#1a0a05" }]}
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
        duration={3000}
        action={{
          label: 'Ir al Carrito',
          onPress: () => {
            navigation.navigate('ClienteTabs', { screen: 'Carrito' });
          },
        }}
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
    marginTop: -40,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 25,
    minHeight: 400
  },

  nombrePlato: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center"
  },

  categoriaTexto: {
    fontSize: 18,
    fontWeight: "600",
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
    borderRadius: 20,
    paddingHorizontal: 10
  },

  stepperBtn: {
    fontSize: 24,
    paddingHorizontal: 10
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
    marginBottom: 10
  },

  descripcionText: {
    fontSize: 16,
    lineHeight: 22
  },

  btnCarrito: {
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