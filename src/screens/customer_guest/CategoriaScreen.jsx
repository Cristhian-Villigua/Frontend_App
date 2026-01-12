import React from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Text, Appbar } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { stylesGlobal } from "./styles";

export default function CategoriaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoriaNombre } = route.params || { categoriaNombre: "Platos" };

  const platos = [
    { id: 1, nombre: "Carne Asada", precio: "15.0 USD", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500" },
    { id: 2, nombre: "Tostada de Atún", precio: "13.0 USD", img: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=500" },
    { id: 3, nombre: "Arroz con Pollo", precio: "11.0 USD", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500" },
    {
      id: 4,
      nombre: "Hamburguesa Royal",
      descripcion: "Carne angus, huevo, queso y tocino.",
      precio: "$8.50",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
      id: 5,
      nombre: "Pizza Napolitana",
      descripcion: "Salsa de tomate casera y mozzarella.",
      precio: "$12.00",
      img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500"
    },
    {
      id: 6,
      nombre: "Ensalada César",
      descripcion: "Pollo grillado, lechuga romana y crotones.",
      precio: "$6.50",
      img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500"
    },
    {
      id: 7,
      nombre: "Tacos al Pastor",
      descripcion: "3 piezas con piña, cilantro y cebolla.",
      precio: "$7.00",
      img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500"
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header Rojo*/}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title={categoriaNombre} titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action icon="heart" color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
      </Appbar.Header>

      <FlatList
        data={platos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0; // Alterna la posición

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Detalle', { plato: item })}
              style={[
                styles.rowContainer,
                { flexDirection: isEven ? 'row' : 'row-reverse' }
              ]}
            >
              {/* Cuadro de Texto Blanco */}
              <View style={[
                styles.infoCard,
                isEven ? styles.infoLeft : styles.infoRight
              ]}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Text key={s} style={styles.star}>★</Text>
                  ))}
                </View>
                <Text style={styles.precio}>{item.precio}</Text>
              </View>

              {/* Imagen Ovalada Escalada */}
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.img }} style={styles.image} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
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