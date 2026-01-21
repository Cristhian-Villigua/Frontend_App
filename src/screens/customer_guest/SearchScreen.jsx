import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { Text, Appbar, Snackbar, Menu, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../service/apiClient";
import { stylesGlobal } from "./styles";

export default function SearchScreen() {
  const navigation = useNavigation();
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [platos, setPlatos] = useState([]);
  const [filteredPlatos, setFilteredPlatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchCategorias = async () => {
    try {
      const response = await apiClient.get("/api/categories");
      setCategorias(response.data);
    } catch (error) {
      console.log("Error categorias:", error);
    }
  };

  const fetchPlatos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/items");
      const data = response.data.map(item => ({
        ...item,
        picUrl: Array.isArray(item.picUrl) ? item.picUrl : []
      }));
      setPlatos(data);
    } catch (error) {
      console.log("Error platos:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (text, categoria) => {
    if (!text) {
      setFilteredPlatos([]);
      return;
    }

    let filtered = platos.filter(p =>
      p.title.toLowerCase().includes(text.toLowerCase())
    );

    if (categoria) {
      filtered = filtered.filter(p => p.category_id === categoria.id);
    }

    setFilteredPlatos(filtered);

    if (filtered.length === 0 && text) {
      setSnackbarVisible(true);
    } else {
      setSnackbarVisible(false);
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    applyFilters(text, selectedCategoria);
  };

  const selectCategoria = (categoria) => {
    setMenuVisible(false);
    setSelectedCategoria(categoria);
    setTimeout(() => {
      applyFilters(searchText, categoria);
    }, 50);
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategoria(null);
    setFilteredPlatos([]);
    setSnackbarVisible(false);
  };

  useEffect(() => {
    fetchCategorias();
    fetchPlatos();
  }, []);

  return (
    <View style={stylesGlobal.container}>
      <Appbar.Header style={stylesGlobal.appbar}>
        <Appbar.Content title="Buscar" titleStyle={stylesGlobal.headerTitle} />
      </Appbar.Header>

      {/* Input búsqueda */}
      <TextInput
        placeholder="Buscar plato..."
        value={searchText}
        onChangeText={handleSearchTextChange}
        style={styles.searchInput}
      />

      {/* Botones categoría / limpiar */}
      <View style={styles.actionsRow}>

        {/* Categoría - IZQUIERDA */}
        <View style={styles.dropdownContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="contained"
                onPress={() => setMenuVisible(true)}
                style={styles.btnCategory}
                icon="chevron-down"
                contentStyle={{ flexDirection: "row-reverse" }}
                labelStyle={styles.btnLabel}
              >
                {selectedCategoria ? selectedCategoria.title : "Categorías"}
              </Button>
            }
          >
            <Menu.Item title="Todas" onPress={() => selectCategoria(null)} />
            {categorias.map(c => (
              <Menu.Item
                key={c.id.toString()}
                title={c.title}
                onPress={() => selectCategoria(c)}
              />
            ))}
          </Menu>
        </View>

        {/* Limpiar - DERECHA */}
        <Button
          mode="contained"
          onPress={clearFilters}
          style={styles.btnClear}
          icon="delete-outline"
          labelStyle={styles.btnLabel}
        >
          Limpiar
        </Button>

      </View>

      {/* Mensaje central */}
      {!searchText && (
        <View style={styles.centerMessage}>
          <Text style={{ fontSize: 16, color: "#555" }}>
            Escribe algo para buscar los platos
          </Text>
        </View>
      )}

      {/* Lista */}
      {searchText && (
        <FlatList
          data={filteredPlatos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={stylesGlobal.listContent}
          refreshing={loading}
          onRefresh={() => applyFilters(searchText, selectedCategoria)}
          renderItem={({ item, index }) => {
            const isEven = index % 2 === 0;

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Detalle", { plato: item })}
                style={[
                  stylesGlobal.rowContainer,
                  { flexDirection: isEven ? "row" : "row-reverse" }
                ]}
              >
                <View style={[
                  stylesGlobal.infoCard,
                  isEven ? stylesGlobal.infoLeft : stylesGlobal.infoRight
                ]}>
                  <Text style={stylesGlobal.nombre}>{item.title}</Text>
                  <View style={stylesGlobal.starsRow}>
                    {[1,2,3,4,5].map(s => (
                      <Text key={s} style={stylesGlobal.star}>★</Text>
                    ))}
                  </View>
                  <Text style={stylesGlobal.precio}>${item.price}</Text>
                </View>

                <View style={stylesGlobal.imageWrapper}>
                  <Image source={{ uri: item.picUrl[0] }} style={stylesGlobal.image} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        No hay productos para mostrar
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 16,
  },

  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  dropdownContainer: {
    flex: 1,
    marginRight: 10,
  },

  btnCategory: {
    backgroundColor: "#1a0a05",
    height: 45,
    justifyContent: "center",
  },

  btnClear: {
    backgroundColor: "#1a0a05",
    height: 45,
    justifyContent: "center",
    minWidth: 100,
  },

  btnLabel: {
    color: "white",
    fontSize: 12,
  },

  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});