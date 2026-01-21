import { useEffect, useState } from "react";
import { Text, IconButton, Chip, Appbar, Snackbar } from "react-native-paper";
import { View, StyleSheet, ScrollView, Image, FlatList, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../service/apiClient";
import { stylesGlobal } from "./styles";

export default function MenuScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/api/categories");
      setCategories(data);

      // Extraer y limpiar items
      let allItems = [];
      data.forEach(cat => {
        if (cat.items && cat.items.length > 0) {
          const cleanedItems = cat.items.map(item => {
            let images = [];
            try {
              // Manejo de picUrl como string JSON o Array
              images = typeof item.picUrl === 'string' ? JSON.parse(item.picUrl) : item.picUrl;
            } catch (e) {
              images = [item.picUrl];
            }
            return { ...item, picUrl: Array.isArray(images) ? images : [images] };
          });
          allItems = [...allItems, ...cleanedItems];
        }
      });

      setPopularItems(allItems.slice(0, 4));
    } catch (error) {
      console.error(error);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200" }}
          style={styles.bannerImage}
          imageStyle={{ borderRadius: 100 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.logoText}>GourmetGo</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.sectionHeader}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 10}}>
          {categories.map(cat => (
            <Chip
              key={cat.id}
              style={styles.chip}
              onPress={() => navigation.navigate("Categoria", { categoriaId: cat.id, categoriaNombre: cat.title })}
            >
              {cat.title}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listHeader}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Platos Populares</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.Content title="Menú Principal" titleStyle={stylesGlobal.headerTitle} />
      </Appbar.Header>

      <FlatList
        data={popularItems}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.grid}
        refreshing={loading}
        onRefresh={fetchMenu}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detalle", { plato: item })}
          >
            <Image 
              source={{ uri: item.picUrl[0] || 'https://via.placeholder.com/150' }} 
              style={styles.image} 
            />
            <Text variant="titleMedium" numberOfLines={1} style={styles.nombrePlato}>{item.title}</Text>
            <View style={styles.footerCard}>
              <Text style={styles.precio}>${item.price}</Text>
              <IconButton icon="plus" mode="contained" containerColor="#1a0a05" iconColor="white" size={20} />
            </View>
          </TouchableOpacity>
        )}
      />

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        Error al cargar los datos
      </Snackbar>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4ea' },
  bannerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 15 },
  sectionTitle: { fontWeight: "bold", color: "#1a0a05" },
  chipScroll: { marginTop: 10 },
  chip: { marginRight: 8, backgroundColor: 'white', borderRadius: 20 },
  chipText: { fontSize: 15 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  verMas: { color: 'black' },
  grid: { paddingHorizontal: 8, paddingBottom: 20 },
  card: { flex: 1, backgroundColor: 'white', margin: 8, borderRadius: 24, padding: 12, elevation: 2 },
  image: { width: '100%', height: 110, borderRadius: 20, marginBottom: 8 },
  nombrePlato: { fontWeight: 'bold' },
  footerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precio: { fontSize: 18, fontWeight: 'bold' },
});