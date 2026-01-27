import { useEffect, useState } from "react";
import { Text, IconButton, Chip, Appbar, Snackbar } from "react-native-paper";
import { View, StyleSheet, ScrollView, Image, FlatList, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../service/apiClient";
import { stylesGlobal } from "./styles";
import { useAppContext } from "../../context/AppContext";

export default function MenuScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { isDarkTheme } = useAppContext();

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/api/categories");
      setCategories(data);

      let allItems = [];
      data.forEach(cat => {
        if (cat.items && cat.items.length > 0) {
          const cleanedItems = cat.items.map(item => ({
            ...item,
            picUrl: Array.isArray(item.picUrl) ? item.picUrl : []
          }));
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

  useEffect(() => {
    fetchMenu();
  }, []);

  const renderHeader = () => (
    <View >
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
        <Text variant="headlineSmall" style={[styles.sectionTitle, { color: isDarkTheme ? "#fff" : "#1a0a05" }]}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 10}}>
          {categories.map(cat => (
            <Chip
              key={cat.id}
              style={[styles.chip, { backgroundColor: isDarkTheme ? "#1e1e1e" : "white" }]}
              textStyle={{ color: isDarkTheme ? "#fff" : "#000" }}
              onPress={() => navigation.navigate("Categoria", { categoriaId: cat.id, categoriaNombre: cat.title })}
            >
              {cat.title}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listHeader}>
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: isDarkTheme ? "#fff" : "#1a0a05" }]}>Platos Populares</Text>
      </View>
    </View>
  );

  return (
    <View style={[
                stylesGlobal.container,
                { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" },
            ]}>
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
            style={[styles.card, { backgroundColor: isDarkTheme ? "#1e1e1e" : "white" }]}
            onPress={() => navigation.navigate("Detalle", { plato: item })}
          >
            <Image 
              source={{ uri: item.picUrl[0] || 'https://via.placeholder.com/150' }} 
              style={styles.image} 
            />
            <Text variant="titleMedium" numberOfLines={1} style={[styles.nombrePlato, { color: isDarkTheme ? "#fff" : "#000" }]}>{item.title}</Text>
            <View style={styles.footerCard}>
              <Text style={[styles.precio, { color: isDarkTheme ? "#fff" : "#000" }]}>${item.price}</Text>
              <IconButton 
                icon="plus" 
                mode="contained" 
                containerColor={isDarkTheme ? "#d32f2f" : "#1a0a05"} 
                iconColor="white" 
                size={20} 
              />
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
  sectionTitle: { fontWeight: "bold" },
  chipScroll: { marginTop: 10 },
  chip: { marginRight: 8, borderRadius: 20 },
  chipText: { fontSize: 15 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  verMas: { color: 'black' },
  grid: { paddingHorizontal: 8, paddingBottom: 20 },
  card: { flex: 1, margin: 8, borderRadius: 24, padding: 12, elevation: 2 },
  image: { width: '100%', height: 110, borderRadius: 20, marginBottom: 8 },
  nombrePlato: { fontWeight: 'bold' },
  footerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precio: { fontSize: 18, fontWeight: 'bold' },
});