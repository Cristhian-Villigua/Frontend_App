import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Button, IconButton, Chip } from "react-native-paper";
import { useAppContext } from "../../context/AppContext"; 

export default function MenuScreen() {
  const { user } = useAppContext();

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
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.titulo}>
            Menú del Día 🍽️
          </Text>
          <Text variant="bodyMedium" style={{color: 'gray'}}>
            Hola {user?.nombre || "Invitado"}, hoy recomendamos:
          </Text>
        </View>

        {platos.map((plato) => (
          <Card key={plato.id} style={styles.card} mode="elevated">
            <Card.Cover source={{ uri: plato.img }} />
            <Card.Title 
              title={plato.nombre} 
              subtitle={plato.descripcion}
              titleStyle={{fontWeight: 'bold'}}
              right={(props) => (
                <Text style={styles.precio}>{plato.precio}</Text>
              )}
            />
            <Card.Actions>
              <IconButton icon="heart-outline" onPress={() => {}} />
              <Button 
                mode="contained" 
                buttonColor="#d32f2f" 
                onPress={() => console.log('Añadido al carrito:', plato.nombre)}
              >
                Agregar
              </Button>
            </Card.Actions>
          </Card>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { padding: 16 },
  header: { marginBottom: 20 },
  titulo: { fontWeight: "bold", color: "#d32f2f" },
  card: { marginBottom: 20, backgroundColor: 'white' },
  precio: { fontWeight: 'bold', fontSize: 16, color: '#2e7d32', marginRight: 16 }
});