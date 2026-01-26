import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Text, Appbar, Snackbar, IconButton } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../../service/apiClient";
import { stylesGlobal } from "./styles";

export default function CategoriaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoriaId, categoriaNombre = "Categoría" } = route.params || {};
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [cartMsgVisible, setCartMsgVisible] = useState(false);

  const refreshPlatos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/categories/${categoriaId}`);
      const data = response.data.items || [];

      const parsedPlatos = data.map(item => ({
        ...item,
        picUrl: Array.isArray(item.picUrl) ? item.picUrl : []
      }));
      setPlatos(parsedPlatos);

      if (parsedPlatos.length === 0) {
        setSnackbarVisible(true);
      }

    } catch (error) {
      console.log(error);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPlatos();
  }, []);

  const quickAddToCart = async (plato) => {
    const nuevoItem = {
      id: plato.id,
      nombre: plato.title,
      precio: plato.price,
      cantidad: 1,
      img: plato.picUrl[0]
    };

    try {
      const stored = await AsyncStorage.getItem("cart");
      let existing = stored ? JSON.parse(stored) : [];

      const existe = existing.find(item => item.id === nuevoItem.id);

      if (existe) {
        existing = existing.map(item =>
          item.id === nuevoItem.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        existing.push(nuevoItem);
      }

      await AsyncStorage.setItem("cart", JSON.stringify(existing));
      setCartMsgVisible(true);

    } catch (error) {
      console.log("Error guardando carrito:", error);
    }
  };


  return (
    <View style={stylesGlobal.container}>
      {/* Header */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title={categoriaNombre} titleStyle={stylesGlobal.headerTitle} />
        <View style={{ width: 52 }} />
      </Appbar.Header>

      <FlatList
        data={platos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={stylesGlobal.listContent}
        refreshing={loading}
        onRefresh={refreshPlatos}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Detalle", { plato: item })}
              style={[
                stylesGlobal.rowContainer,
                { flexDirection: isEven ? "row" : "row-reverse" }
              ]}
            >
              {/* Info */}
              <View
                style={[
                  stylesGlobal.infoCard,
                  isEven ? stylesGlobal.infoLeft : stylesGlobal.infoRight
                ]}
              >
                <Text style={stylesGlobal.nombre}>{item.title}</Text>

                <View style={stylesGlobal.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Text key={s} style={stylesGlobal.star}>★</Text>
                  ))}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                  <Text style={stylesGlobal.precio}>${item.price}</Text>
                  <IconButton
                    icon="plus"
                    size={20}
                    style={{ backgroundColor: '#f1b46c', margin: 0 }}
                    iconColor="white"
                    onPress={(e) => {
                      e.preventDefault && e.preventDefault(); // Safety check though TouchableOpacity captures
                      quickAddToCart(item);
                    }}
                  />
                </View>
              </View>

              {/* Imagen */}
              <View style={stylesGlobal.imageWrapper}>
                <Image
                  source={{ uri: item.picUrl[0] }}
                  style={stylesGlobal.image}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>No hay producto en esta categoría</Snackbar>

      <Snackbar
        visible={cartMsgVisible}
        onDismiss={() => setCartMsgVisible(false)}
        duration={2000}
        style={{ backgroundColor: '#4caf50' }}
      >
        ¡Producto agregado al carrito!
      </Snackbar>
    </View>
  );
}