import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { stylesGlobal } from "./styles";

export default function SearchScreen() {
    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <Appbar.Header style={stylesGlobal.appbar}>
                <Appbar.BackAction color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
                <Appbar.Content title="Buscar" titleStyle={stylesGlobal.headerTitle} />
                <Appbar.Action color="white" onPress={() => { }} style={{ opacity: 0 }} disabled />
            </Appbar.Header>

            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff4ea"
            }}>
                <Text>Hola a SearchScreen</Text>
            </View>
        </View>
    )
}