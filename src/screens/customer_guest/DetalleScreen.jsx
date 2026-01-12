import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Text, IconButton, Appbar } from "react-native-paper";
import { stylesGlobal } from "./styles";

export default function DetalleScreen({ route, navigation }) {
  const { plato } = route.params;
  const [cantidad, setCantidad] = useState(0);

  return (
    <View style={styles.container}>
      {/* Header Rojo */}
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalle" titleStyle={stylesGlobal.headerTitle} />
        <Appbar.Action icon="heart" color="white" onPress={() => {}} />
      </Appbar.Header>


      <ScrollView bouncer={false}>
        {/* Imagen Principal */}
        <Image source={{ uri: plato.img }} style={styles.imageMain} />

        {/* Contenedor de Información con Bordes Redondeados */}
        <View style={styles.infoContainer}>
          <Text style={styles.nombrePlato}>{plato.nombre}</Text>
          <Text style={styles.categoriaTexto}>Plato Principal</Text>

          <View style={styles.row}>
            <View style={styles.stepper}>
              <Text style={styles.qtyLabel}>Qty.</Text>
              <View style={styles.stepperControls}>
                <TouchableOpacity onPress={() => cantidad > 0 && setCantidad(cantidad - 1)}>
                  <Text style={styles.stepperBtn}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{cantidad}</Text>
                <TouchableOpacity onPress={() => setCantidad(cantidad + 1)}>
                  <Text style={styles.stepperBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>4.8</Text>
              <IconButton icon="star" size={20} iconColor="black" style={styles.starIcon} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descripcionText}>
            {plato.descripcion || "El Guacamole es una mezcla deliciosa de aguacate triturado con cebolla, cilantro, tomate, chile y limón, perfecto para acompañar totopos o carnes."}
          </Text>

          {/* Botón Añadir al Carrito */}
          <TouchableOpacity style={styles.btnCarrito} onPress={() => console.log("Añadido")}>
            <Text style={styles.btnText}>Añadir al carrito</Text>
            <Text style={styles.btnPrice}>{plato.precio}</Text>
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