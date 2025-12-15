import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.emptyCard}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Text variant="headlineSmall" style={{ marginBottom: 10 }}>Tu carrito está vacío</Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 20 }}>
            ¡Parece que aún no te has decidido! Ve al menú para agregar deliciosos platillos.
          </Text>
          <Button mode="contained" buttonColor="#d32f2f" icon="food">
            Ir al Menú
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  emptyCard: { padding: 20, elevation: 2 }
});