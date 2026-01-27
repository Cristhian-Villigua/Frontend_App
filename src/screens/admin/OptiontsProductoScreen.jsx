import { useEffect, useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Menu,
  Portal,
  Modal,
} from "react-native-paper";

import apiClient from "../../service/apiClient";
import { stylesAdmin } from "./styles";
import { useAppContext } from "../../context/AppContext";

export default function OptiontsProductoScreen({ route, navigation }) {
  const producto = route?.params?.producto || null;
  const isEdit = Boolean(producto);
  const { isDarkTheme } = useAppContext();

  const [categories, setCategories] = useState([]);
  const [categoryMenu, setCategoryMenu] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    picUrl: "",
    category_id: "",
  });

  useEffect(() => {
    fetchCategories();

    if (producto) {
      setForm({
        title: producto.title,
        description: producto.description,
        price: String(producto.price),
        picUrl: producto.picUrl || "",
        category_id: producto.category_id,
      });
    }
  }, []);

  const fetchCategories = async () => {
    const res = await apiClient.get("/api/categories");
    setCategories(res.data || []);
  };

  const updateField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const isDisabled = loading || deleteMode;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isEdit) {
        await apiClient.put(
          `/api/admin/items/${producto.id}`,
          form
        );
      } else {
        await apiClient.post("/api/admin/items", form);
      }

      navigation.goBack();
    } catch (e) {
      console.error("Error guardando producto", e.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await apiClient.delete(`/api/admin/items/${producto.id}`);
      setShowDeleteModal(false);
      navigation.goBack();
    } catch (e) {
      console.error("Error eliminando", e);
    } finally {
      setLoading(false);
    }
  };

  const dynamicModalStyle = {
    ...stylesAdmin.modal,
    backgroundColor: isDarkTheme ? "#000" : "#fff4ea",
  };

  return (
    <View
      style={[
        stylesAdmin.container,
        { backgroundColor: isDarkTheme ? "#121212" : "#fff4ea" },
      ]}
    >
      <Appbar.Header style={stylesAdmin.appbar}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={
            deleteMode
              ? "Eliminar Producto"
              : isEdit
                ? "Editar Producto"
                : "Nuevo Producto"
          }
          titleStyle={stylesAdmin.headerTitle}
        />
        <Appbar.Action color="white" style={{ opacity: 0 }} disabled />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <TextInput
          label="Título"
          value={form.title}
          onChangeText={(v) => updateField("title", v)}
          disabled={isDisabled}
          style={styles.input}
        />

        <TextInput
          label="Descripción"
          value={form.description}
          onChangeText={(v) => updateField("description", v)}
          disabled={isDisabled}
          style={styles.input}
        />

        <TextInput
          label="Precio"
          keyboardType="decimal-pad"
          value={form.price}
          onChangeText={(v) => updateField("price", v)}
          disabled={isDisabled}
          style={styles.input}
        />

        <TextInput
          label="Enlace de foto"
          value={form.picUrl}
          onChangeText={(v) => updateField("picUrl", v)}
          disabled={isDisabled}
          style={styles.input}
        />

        {/* ===== CATEGORÍA ===== */}
        <Menu
          visible={categoryMenu}
          onDismiss={() => setCategoryMenu(false)}
          anchor={
            <Pressable onPress={() => !isDisabled && setCategoryMenu(true)}>
              <View pointerEvents="none">
                <TextInput
                  label="Categoría"
                  value={
                    categories.find((c) => c.id === form.category_id)
                      ?.title || ""
                  }
                  disabled={isDisabled}
                  right={<TextInput.Icon icon="chevron-down" />}
                  style={styles.input}
                />
              </View>
            </Pressable>
          }
        >
          {categories.map((cat) => (
            <Menu.Item
              key={cat.id}
              title={cat.title}
              onPress={() => {
                updateField("category_id", cat.id);
                setCategoryMenu(false);
              }}
            />
          ))}
        </Menu>

        {/* ===== BOTONES ===== */}
        {!deleteMode && (
          <Button
            mode="contained"
            loading={loading}
            onPress={handleSubmit}
            style={styles.button}
          >
            {isEdit ? "Actualizar" : "Crear"}
          </Button>
        )}

        {isEdit && !deleteMode && (
          <Button
            mode="contained"
            onPress={() => setDeleteMode(true)}
            style={{ marginHorizontal: 50 }}
          >
            Eliminar producto
          </Button>
        )}

        {deleteMode && (
          <View style={{ gap: 10 }}>
            <Button
              mode="contained"
              onPress={() => setShowDeleteModal(true)}
              style={{ marginHorizontal: 50 }}
            >
              Confirmar eliminación
            </Button>

            <Button
              mode="contained"
              onPress={() => setDeleteMode(false)}
              style={{ marginHorizontal: 50 }}
            >
              Cancelar
            </Button>
          </View>
        )}
      </View>

      {/* ===== MODAL ELIMINAR ===== */}
      <Portal>
        <Modal
          visible={showDeleteModal}
          onDismiss={() => setShowDeleteModal(false)}
          contentContainerStyle={dynamicModalStyle}
        >
          <Text variant="titleMedium">
            ¿Está seguro de eliminar este producto?
          </Text>

          <View style={stylesAdmin.modalActions}>
            <Button onPress={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button
              textColor="red"
              onPress={handleDelete}
              loading={loading}
            >
              Eliminar
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
  button: {
    marginHorizontal: 50,
    marginTop: 12,
    marginBottom: 12,
  },
});