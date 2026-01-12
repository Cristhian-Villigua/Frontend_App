import { useState } from "react";
import { Text, IconButton, Chip, Appbar } from "react-native-paper";
import { useAppContext } from "../../context/AppContext";
import { View, StyleSheet, ScrollView, Image, FlatList, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { stylesGlobal } from "./styles";

export default function MenuScreen() {
  const { user } = useAppContext();
  const navigation = useNavigation();
  const categorias = [
    { id: '1', nombre: 'Entradas', slug: 'entradas' },
    { id: '2', nombre: 'Platos Principales', slug: 'principales' },
    { id: '3', nombre: 'Postres', slug: 'postres' },
  ];

  const platos = [
    {
      id: 1,
      nombre: "Hamburguesa Royal",
      descripcion: "Carne angus, huevo, queso y tocino.",
      precio: "$8.50",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
      id: 2,
      nombre: "Pizza Napolitana",
      descripcion: "Salsa de tomate casera y mozzarella.",
      precio: "$12.00",
      img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500"
    },
    {
      id: 3,
      nombre: "Ensalada César",
      descripcion: "Pollo grillado, lechuga romana y crotones.",
      precio: "$6.50",
      img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500"
    },
    {
      id: 4,
      nombre: "Tacos al Pastor",
      descripcion: "3 piezas con piña, cilantro y cebolla.",
      precio: "$7.00",
      img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500"
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header Rojo */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
        <Appbar.Content title="Menú Principal" titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
      </Appbar.Header>

      {/* Banner de GourmetGo */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={{ uri: 'https://tu-url-de-imagen-de-fondo.com/comida.jpg' }}
          style={styles.bannerImage}
          imageStyle={{ borderRadius: 100 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.logoText}>GourmetGo</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Categorías */}
      <View style={styles.sectionHeader}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {categorias.map((cat) => (
            <Chip
              key={cat.id}
              style={styles.chip}
              onPress={() => navigation.navigate("Categoria", { categoriaNombre: cat.nombre, categoriaId: cat.id })}
            >
              {cat.nombre}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Platos Populares */}
      <View style={styles.listHeader}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Platos Populares</Text>
        <Text style={styles.verMas}>Ver más</Text>
      </View>

      <FlatList
        data={platos}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detalle', { plato: item })}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text variant="titleMedium" style={styles.nombrePlato}>{item.nombre}</Text>
            <View style={styles.footerCard}>
              <Text style={styles.precio}>{item.precio}</Text>
              <IconButton
                icon="plus"
                mode="contained"
                containerColor="#1a0a05"
                iconColor="white"
                size={24}
                onPress={() => { /* Lógica para agregar al carrito */ }}
              />
            </View>
          </TouchableOpacity>
        )}
      />
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