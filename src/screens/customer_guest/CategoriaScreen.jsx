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
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title={categoriaNombre} titleStyle={stylesGlobal.headerTitle} />
        <View style={{ width: 52 }} />
      </Appbar.Header>

      <FlatList
        data={platos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={refreshPlatos}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Detalle", { plato: item })}
              style={[
                styles.rowContainer,
                { flexDirection: isEven ? "row" : "row-reverse" }
              ]}
            >
              {/* Info */}
              <View
                style={[
                  styles.infoCard,
                  isEven ? styles.infoLeft : styles.infoRight
                ]}
              >
                <Text style={styles.nombre}>{item.title}</Text>

                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Text key={s} style={styles.star}>★</Text>
                  ))}
                </View>

                <Text style={styles.precio}>${item.price}</Text>
              </View>

              {/* Imagen */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.picUrl[0] }}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        No hay platos en esta categoría
      </Snackbar>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4ea' },
  listContent: { paddingVertical: 20 },

  rowContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },

  // Estilo del cuadro blanco (Texto)
  infoCard: {
    backgroundColor: 'white',
    width: '65%',
    height: 100,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    elevation: 4,
    zIndex: 1, // Queda detrás de la imagen
  },
  infoLeft: { marginRight: -45, alignItems: 'flex-start', paddingLeft: 20 },
  infoRight: { marginLeft: -45, alignItems: 'flex-end', paddingRight: 20 },

  // Estilo del contenedor de imagen (Ovalado)
  imageWrapper: {
    width: 150,
    height: 110,
    borderRadius: 55, // Crea el óvalo
    overflow: 'hidden',
    elevation: 6,
    backgroundColor: 'white',
    zIndex: 2, // Queda encima del cuadro blanco
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },

  nombre: { fontSize: 17, fontWeight: 'bold', color: '#1a0a05' },
  starsRow: { flexDirection: 'row', marginVertical: 2 },
  star: { color: '#1a0a05', fontSize: 14 },
  precio: { fontSize: 16, fontWeight: 'bold', color: '#1a0a05' },
});