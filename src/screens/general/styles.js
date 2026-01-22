import { StyleSheet } from "react-native";
export const stylesProfile = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardPerfil: {
    marginVertical: 30,
    marginHorizontal: 16,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: "center",
    paddingTop: 35,
    marginTop: -45,
  },
  avatar: {
    backgroundColor: "#d32f2f",
  },
  sectionSpacing: {
    marginHorizontal: 16,
  },
  name: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  btnProfile: {
    marginTop: 20,
    alignSelf: "center",
    paddingHorizontal: 20,
    backgroundColor: "#d32f2f",
    height: 45,
    justifyContent: "center",
    borderWidth: 0,
  },
  btnLabel: {
    color: "white",
    fontSize: 12,
  },
  backgroundColor: "#1a0a05",
  height: 45,
  justifyContent: "center",
});
