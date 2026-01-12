import { StyleSheet } from "react-native";

export const webStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#f0f2f5",
  },

  card: {
    width: 540,
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#1c1e21",
  },

  inputWeb: {
    width: "100%",
    marginBottom: 16,
  },

  buttonWeb: {
    width: "100%",
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },

  link: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    color: "#1877f2",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#1c1e21",
  },

  dateColumn: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  picker: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccd0d5",
    borderRadius: 6,
    backgroundColor: "#f5f6f7",
  },

  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  radioLabel: {
    fontSize: 14,
    color: "#1c1e21",
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});
