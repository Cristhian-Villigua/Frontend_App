import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Text, Appbar, Snackbar } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import apiClient from "../../service/apiClient";
import { stylesGlobal } from "./styles";

export default function CategoriaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoriaId, categoriaNombre = "Categoría" } = route.params || {};
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

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

                <Text style={stylesGlobal.precio}>${item.price}</Text>
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
    </View>
  );
}