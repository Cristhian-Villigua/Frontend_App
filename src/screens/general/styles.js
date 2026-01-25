import { StyleSheet } from "react-native";

export const stylesProfile = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa", // Fondo suave
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  cardPerfil: {
    marginVertical: 30,
    marginHorizontal: 16,
    elevation: 8, // Sombra más pronunciada
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderRadius: 16, // Bordes más redondeados
    backgroundColor: "#ffffff",
    overflow: "hidden", // Para que el borderRadius funcione con sombras
  },
  avatarContainer: {
    alignItems: "center",
    paddingTop: 35,
    marginTop: -45,
  },
  avatar: {
    backgroundColor: "#d32f2f", // Mantener el rojo principal
    elevation: 6,
    shadowColor: "#d32f2f",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  sectionSpacing: {
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  name: {
    textAlign: "center",
    fontSize: 22, // Tamaño mayor
    fontWeight: "700", // Peso más fuerte
    marginTop: 10,
    color: "#212121",
    letterSpacing: 0.5,
  },
  email: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    color: "#757575",
    fontWeight: "500",
  },
  btnProfile: {
    marginTop: 20,
    alignSelf: "center",
    paddingHorizontal: 32, // Más padding
    backgroundColor: "#d32f2f",
    height: 50, // Altura mayor
    justifyContent: "center",
    borderWidth: 0,
    borderRadius: 25, // Bordes redondeados
    elevation: 4,
    shadowColor: "#d32f2f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnLabel: {
    color: "white",
    fontSize: 14, // Tamaño mayor
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  // Eliminar estilos sueltos que no pertenecen a ningún objeto
  // backgroundColor: "#1a0a05",
  // height: 45,
  // justifyContent: "center",
});
