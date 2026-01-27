import { StyleSheet } from "react-native";

export const stylesAdmin = StyleSheet.create({
  appbar: { backgroundColor: "#d32f2f" },
  headerTitle: { color: "white", fontWeight: "bold", alignSelf: "center" },
  container: { flex: 1, backgroundColor: "#fff4ea" },

  tableCenter: {
    justifyContent: "center",
  },

  textCenter: {
    textAlign: "center",
  },
  actionsCenter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
    modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 8,
  },
});