import React from "react";
import { TextInput, Text } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { styles } from "../screens/mobile/auth/styles";
import { webStyles } from "../screens/mobile/auth/webStyles";
import { Platform } from "react-native";

const InputField = ({
  label,
  value,
  onChange,
  error,
  icon,
}) => (
  <>
    <TextInput
      label={label}
      mode="outlined"
      activeOutlineColor={error ? "red" : value ? "green" : "black"}
      value={value}
      onChangeText={onChange}
      style={Platform.OS === 'web' ? webStyles.inputWeb : styles.input}
      error={!!error}
      left={<TextInput.Icon icon={() => <FontAwesome6 name={icon} size={20} color={error ? "red" : value ? "green" : "black"} solid />} />}
    />
    {error ? <Text style={{ color: "red", marginTop: -8 }}>{error}</Text> : null}
  </>
);

export default InputField;
