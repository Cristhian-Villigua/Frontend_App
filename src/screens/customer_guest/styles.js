import { StyleSheet } from "react-native";
export const stylesGlobal = StyleSheet.create({
    appbar: { backgroundColor: '#d32f2f' },
    headerTitle: { color: 'white', fontWeight: 'bold', alignSelf: 'center' },
    container: { flex: 1, backgroundColor: "#fff4ea" },
    
    // SearchScreen y CategoriaScreen
    listContent: { paddingVertical: 20 },
    rowContainer: {
        alignItems: "center",
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    infoCard: {
        backgroundColor: "white",
        width: "65%",
        minHeight: 100,
        borderRadius: 15,
        padding: 15,
        paddingRight: 60,
        justifyContent: "center",
        elevation: 4,
    },

    infoLeft: {
        marginRight: -45,
        alignItems: "flex-end",
        paddingRight: 60,
        paddingLeft: 15,
    },

    infoRight: {
        marginLeft: -45,
        alignItems: "flex-start",
        paddingLeft: 60,
        paddingRight: 15,
    },
    imageWrapper: {
        width: 150,
        height: 110,
        borderRadius: 55,
        overflow: "hidden",
        backgroundColor: "white",
        elevation: 6,
    },

    image: { width: "100%", height: "100%", resizeMode: "cover" },
    nombre: {
        fontSize: 17,
        fontWeight: "bold",
        flexWrap: "wrap",
        marginBottom: 5,
    },
    starsRow: {
        flexDirection: "row",
        marginBottom: 5,
    },
    star: { fontSize: 14 },
    precio: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
