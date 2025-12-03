## 🚀 Tecnologías Utilizadas

* **React Native**
* **Expo**
* **React Native Paper** (componentes y theming)
* **@expo/vector-icons** (iconos integrados en Expo)
* **React Hooks** (`useState`)

---

## 🔤 Iconos en Expo

No es necesario instalar `react-native-vector-icons` manualmente.
**Expo ya incluye todas las librerías más usadas.**

📚 **Catálogo oficial para buscar iconos:**

👉 [https://oblador.github.io/react-native-vector-icons/](https://oblador.github.io/react-native-vector-icons/)

>(Aunque sea la web de `react-native-vector-icons`, Expo usa exactamente los mismos **nombres de iconos**.)

### 📦 Cómo importar iconos en Expo

Importa solo los iconos que realmente vas a usar:

```javascript
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  MaterialIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
```