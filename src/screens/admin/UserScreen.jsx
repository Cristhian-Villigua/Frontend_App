import { useEffect, useMemo, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  DataTable,
  TextInput,
  Button,
  IconButton,
  ActivityIndicator,
  Appbar,
  Card,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import apiClient from "../../service/apiClient";
import { stylesAdmin } from "./styles";
import { useAppContext } from "../../context/AppContext";

const PAGE_SIZES = [5, 10, 15];
const screenWidth = Dimensions.get("window").width;

export default function UserScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZES[0]);

  const { isDarkTheme } = useAppContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/admin/usuarios");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  /* ===== FILTRO ===== */
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) =>
      `${u.nombres} ${u.apellidos} ${u.email} ${u.celular} ${u.role}`
        .toLowerCase()
        .includes(q)
    );
  }, [users, search]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(from, to);

  const COL_WIDTH = {
    nombres: 150,
    apellidos: 160,
    email: 230,
    celular: 130,
    role: 140,
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
        <Appbar.Content title="Staffs" titleStyle={stylesAdmin.headerTitle} />
      </Appbar.Header>

      {/* ===== BARRA SUPERIOR ===== */}
      <View style={localStyles.topBar}>
        <TextInput
          mode="outlined"
          placeholder="Buscar usuario"
          value={search}
          onChangeText={setSearch}
          left={<TextInput.Icon icon="magnify" />}
        />

        <View style={localStyles.topButtons}>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate("OptiontsUser")}
          >
            Nuevo
          </Button>

          <Button mode="contained" icon="refresh" onPress={fetchUsers}>
            Recargar
          </Button>
        </View>
      </View>

      {/* ===== TABLA ===== */}
      <View style={localStyles.centerWrapper}>
        <Card style={localStyles.tableCard}>
          <ScrollView horizontal>
            <ScrollView style={{ maxHeight: 380 }}>
              <DataTable style={{ minWidth: screenWidth + 300 }}>
                <DataTable.Header>
                  <DataTable.Title
                    style={[stylesAdmin.tableCenter, { width: COL_WIDTH.nombres }]}
                    textStyle={stylesAdmin.textCenter}
                  >
                    Nombres
                  </DataTable.Title>

                  <DataTable.Title
                    style={[stylesAdmin.tableCenter, { width: COL_WIDTH.apellidos }]}
                    textStyle={stylesAdmin.textCenter}
                  >
                    Apellidos
                  </DataTable.Title>

                  <DataTable.Title
                    style={[stylesAdmin.tableCenter, { width: COL_WIDTH.email }]}
                    textStyle={stylesAdmin.textCenter}
                  >
                    Email
                  </DataTable.Title>

                  <DataTable.Title
                    style={[stylesAdmin.tableCenter, { width: COL_WIDTH.celular }]}
                    textStyle={stylesAdmin.textCenter}
                  >
                    Celular
                  </DataTable.Title>

                  <DataTable.Title
                    style={[stylesAdmin.tableCenter, { width: COL_WIDTH.role }]}
                    textStyle={stylesAdmin.textCenter}
                  >
                    Rol
                  </DataTable.Title>

                  <DataTable.Title
                    style={[stylesAdmin.tableCenter, { width: COL_WIDTH.opciones }]}
                    textStyle={stylesAdmin.textCenter}
                  >
                    Opciones
                  </DataTable.Title>
                </DataTable.Header>

                {loading ? (
                  <View style={localStyles.loading}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  paginatedUsers.map((item) => (
                    <DataTable.Row key={item.id}>
                      <DataTable.Cell
                        style={[stylesAdmin.tableCenter, { width: COL_WIDTH.nombres }]}
                        textStyle={stylesAdmin.textCenter}
                      >
                        {item.nombres}
                      </DataTable.Cell>

                      <DataTable.Cell
                        style={[stylesAdmin.tableCenter, { width: COL_WIDTH.apellidos }]}
                        textStyle={stylesAdmin.textCenter}
                      >
                        {item.apellidos}
                      </DataTable.Cell>

                      <DataTable.Cell
                        style={[stylesAdmin.tableCenter, { width: COL_WIDTH.email }]}
                        textStyle={stylesAdmin.textCenter}
                      >
                        {item.email}
                      </DataTable.Cell>

                      <DataTable.Cell
                        style={[stylesAdmin.tableCenter, { width: COL_WIDTH.celular }]}
                        textStyle={stylesAdmin.textCenter}
                      >
                        {item.celular}
                      </DataTable.Cell>

                      <DataTable.Cell
                        style={[stylesAdmin.tableCenter, { width: COL_WIDTH.role }]}
                        textStyle={stylesAdmin.textCenter}
                      >
                        {item.role}
                      </DataTable.Cell>

                      <DataTable.Cell style={{ width: COL_WIDTH.opciones }}>
                        <View style={stylesAdmin.actionsCenter}>
                          <IconButton
                            icon="cog"
                            size={18}
                            onPress={() =>
                              navigation.navigate("OptiontsUser", {
                                usuario: item,
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
                    filteredUsers.length / itemsPerPage
                  )}
                  onPageChange={setPage}
                  label={`${from + 1}-${to} de ${filteredUsers.length}`}
                  numberOfItemsPerPageList={PAGE_SIZES}
                  numberOfItemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  showFastPaginationControls
                />
              </DataTable>
            </ScrollView>
          </ScrollView>
        </Card>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  topBar: {
    padding: 12,
    gap: 10,
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  tableCard: {
    width: "95%",
    borderRadius: 12,
    paddingVertical: 8,
  },
  loading: {
    padding: 16,
    alignItems: "center",
  },
});
