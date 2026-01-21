import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Text, Appbar, IconButton } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { stylesGlobal } from "./styles";

export default function DetalleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { plato } = route.params;

  const [cantidad, setCantidad] = useState(0);
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = () => {
    if (cantidad === 0) return;

    const nuevoItem = {
      id: plato.id,
      nombre: plato.title,
      precio: plato.price,
      cantidad,
      img: plato.picUrl[0],
    };

    setCarrito(prev => {
      const nuevoCarrito = [...prev, nuevoItem];
      alert("Producto añadido al carrito!");
      navigation.navigate("CarritoScreen", { items: nuevoCarrito });
      return nuevoCarrito;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalle" titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action icon="heart" color="white" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView>
        {/* Imagen Principal */}
        <Image source={{ uri: plato.picUrl[0] }} style={styles.imageMain} />

        {/* Contenedor de Información */}
        <View style={styles.infoContainer}>
          <Text style={styles.nombrePlato}>{plato.title}</Text>
          <Text style={styles.categoriaTexto}>Plato Principal</Text>

          <View style={styles.row}>
            {/* Stepper para cantidad */}
            <View style={styles.stepper}>
              <Text style={styles.qtyLabel}>Cantidad</Text>
              <View style={styles.stepperControls}>
                <TouchableOpacity
                  onPress={() => setCantidad(prev => Math.max(prev - 1, 0))}
                >
                  <Text style={styles.stepperBtn}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{cantidad}</Text>
                <TouchableOpacity
                  onPress={() => setCantidad(prev => Math.min(prev + 1, 25))}
                >
                  <Text style={styles.stepperBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rating */}
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>4.8</Text>
              <IconButton icon="star" size={20} iconColor="black" style={styles.starIcon} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descripcionText}>
            {plato.description || "Sin descripción disponible."}
          </Text>

          {/* Botón Añadir al carrito */}
          <TouchableOpacity style={styles.btnCarrito} onPress={agregarAlCarrito}>
            <Text style={styles.btnText}>Añadir al carrito</Text>
            <Text style={styles.btnPrice}>${plato.price}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4ea' },
  imageMain: { width: '100%', height: 300, resizeMode: 'cover' },
  infoContainer: {
    backgroundColor: '#fff4ea',
    marginTop: -40, // Sube el contenedor sobre la imagen
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 25,
    flex: 1,
    minHeight: 400
  },
  nombrePlato: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#1a0a05' },
  categoriaTexto: { fontSize: 18, fontWeight: '600', color: '#1a0a05', marginTop: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  qtyLabel: { fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  stepperControls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#1a0a05', 
    borderRadius: 20,
    paddingHorizontal: 10
  },
  stepperBtn: { fontSize: 24, paddingHorizontal: 10, color: '#1a0a05' },
  qtyNumber: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 10 },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 18, fontWeight: 'bold' },
  starIcon: { margin: 0 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a0a05', marginBottom: 10 },
  descripcionText: { fontSize: 16, color: '#4a4a4a', lineHeight: 22 },
  btnCarrito: {
    backgroundColor: '#1a0a05',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center'
  },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  btnPrice: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});