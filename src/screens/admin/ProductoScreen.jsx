import { useEffect, useMemo, useState, useCallback } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import {
  DataTable,
  Button,
  IconButton,
  ActivityIndicator,
  Appbar,
  Card,
  TextInput,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import apiClient from "../../service/apiClient";
import { stylesAdmin } from "./styles";
import { useAppContext } from "../../context/AppContext";

const PAGE_SIZES = [5, 10, 15];
const screenWidth = Dimensions.get("window").width;

export default function ProductoScreen({ navigation }) {
  const { isDarkTheme } = useAppContext();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZES[0]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/items");
      setItems(res.data || []);
    } catch (e) {
      console.error("Error cargando productos", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage, search]);

  /* ===== FILTRO ===== */
  const filteredItems = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) =>
      `${i.title} ${i.category?.title}`.toLowerCase().includes(q)
    );
  }, [items, search]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filteredItems.length);
  const paginatedItems = filteredItems.slice(from, to);

  const COL_WIDTH = {
    id: 60,
    titulo: 220,
    categoria: 160,
    Precio: 120,
    opciones: 110,
  };

  return (
    <View
      style={[
        stylesAdmin.container,
        { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" },
      ]}
    >
      <Appbar.Header style={stylesAdmin.appbar}>
        <Appbar.Content
          title="Productos"
          titleStyle={stylesAdmin.headerTitle}
        />
      </Appbar.Header>

      <View style={{ padding: 12, gap: 10 }}>
        <TextInput
          mode="outlined"
          placeholder="Buscar producto"
          value={search}
          onChangeText={setSearch}
          left={<TextInput.Icon icon="magnify" />}
        />

        <Button
          mode="contained"
          icon="plus"
          onPress={() => navigation.navigate("OptiontsProducto")}
        >
          Nuevo producto
        </Button>
      </View>

      <Card style={{ margin: 12 }}>
        <ScrollView horizontal>
          <DataTable style={{ minWidth: screenWidth + 250 }}>
            <DataTable.Header>
              <DataTable.Title style={[stylesAdmin.tableCenter, { width: COL_WIDTH.titulo }]}
                    textStyle={stylesAdmin.textCenter}>
                Título
              </DataTable.Title>
              <DataTable.Title style={[stylesAdmin.tableCenter, { width: COL_WIDTH.categoria }]}
                    textStyle={stylesAdmin.textCenter}>
                Categoría
              </DataTable.Title>
              <DataTable.Title numeric style={[stylesAdmin.tableCenter, { width: COL_WIDTH.Precio }]}
                    textStyle={stylesAdmin.textCenter}>
                Precio
              </DataTable.Title>
              <DataTable.Title style={[stylesAdmin.tableCenter, { width: COL_WIDTH.opciones }]}
                    textStyle={stylesAdmin.textCenter}>
                Opciones
              </DataTable.Title>
            </DataTable.Header>

            {loading ? (
              <View style={{ padding: 16 }}>
                <ActivityIndicator />
              </View>
            ) : (
              paginatedItems.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell style={[stylesAdmin.tableCenter, { width: COL_WIDTH.titulo }]}
                    textStyle={stylesAdmin.textCenter}>
                    {item.title}
                  </DataTable.Cell>
                  <DataTable.Cell style={[stylesAdmin.tableCenter, { width: COL_WIDTH.categoria }]}
                    textStyle={stylesAdmin.textCenter}>
                    {item.category?.title}
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={[stylesAdmin.tableCenter, { width: COL_WIDTH.Precio }]}
                    textStyle={stylesAdmin.textCenter}>
                    ${item.price}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <View style={[stylesAdmin.actionsCenter, { width: COL_WIDTH.opciones }]}
                    textStyle={stylesAdmin.textCenter}>
                      <IconButton
                        icon="cog"
                        size={18}
                        onPress={() =>
                          navigation.navigate("OptiontsProducto", {
                            producto: item,
                          })
                        }
                      />
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            )}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(
                filteredItems.length / itemsPerPage
              )}
              onPageChange={setPage}
              label={`${from + 1}-${to} de ${filteredItems.length}`}
              numberOfItemsPerPageList={PAGE_SIZES}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              showFastPaginationControls
            />
          </DataTable>
        </ScrollView>
      </Card>
    </View>
  );
}
