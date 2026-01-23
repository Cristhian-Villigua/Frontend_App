import { View, Text, StyleSheet } from "react-native";

export default function ProductosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
