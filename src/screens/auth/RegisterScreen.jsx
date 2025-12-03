import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { styles } from "./styles";

export default function RegisterScreen(){
    let register = "Registrarse"
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthday, setBirtday] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    return(
    <KeyboardAvoidingView
        style={{ flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">  
            <View style={styles.container}>
                <Text style={styles.title}>{register}</Text>
                <TextInput
                    label="Nombres"
                    mode="outlined"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    left={<TextInput.Icon icon={() => <FontAwesome6 name="user" size={20} color="#ff0000" solid/>}/>}
                    // right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="#ff0000" solid/>}/>}
                    right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="#00ff00" solid/>}/>}
                ></TextInput>
                <TextInput
                    label="Apellidos"
                    mode="outlined"
                    value={lastName}
                    onChangeText={setLastName}
                    style={styles.input}
                    left={<TextInput.Icon icon={() => <FontAwesome6 name="user" size={20} color="#ff0000" solid/>}/>}
                    // right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="#ff0000" solid/>}/>}
                    right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="#00ff00" solid/>}/>}
                ></TextInput>
                <TextInput
                    label="Fecha de nacimiento"
                    mode="outlined"
                    value={birthday}
                    onChangeText={setBirtday}
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={10}
                    left={<TextInput.Icon icon={() => <FontAwesome6 name="calendar-days" size={20} color="#ff0000" solid/>}/>}
                    // right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="#ff0000" solid/>}/>}
                    right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="#00ff00" solid/>}/>}
                ></TextInput>
                <TextInput
                    label="Teléfono"
                    mode="outlined"
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    keyboardType="phone-pad"
                    maxLength={10}
                    left={<TextInput.Icon icon={() => <FontAwesome6 name="phone" size={20} color="#ff0000" type="fill" solid/>}/>}
                    // right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="#ff0000" solid/>}/>}
                    right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="#00ff00" solid/>}/>}
                ></TextInput>
                <TextInput
                    label="Correo"
                    mode="outlined"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    left={<TextInput.Icon icon={() => <FontAwesome6 name="envelope" size={20} color="#ff0000" solid/>}/>}
                    // right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="#ff0000" solid/>}/>}
                    right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="#00ff00" solid/>}/>}
                ></TextInput>
                <TextInput
                    label="Contraseña"
                    mode="outlined"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                    left={<TextInput.Icon icon={() => <FontAwesome6 name="lock" size={20} color="#ff0000" solid/>}/>}
                    // right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-xmark" size={20} color="#ff0000" solid/>}/>}
                    right={<TextInput.Icon icon={() => <FontAwesome6 name="circle-check" size={20} color="#00ff00" solid/>}/>}
                ></TextInput>
                <Button
                    mode = "contained"
                    loading = {loading}
                    style = {styles.button}
                >{register}</Button>
                <Text style={styles.link}>
                    ¿Ya tienes una cuenta?{" "}<Text style={{ color: "#ff0000"}}>Inicie Sesión</Text>
                </Text>
                <Text style={styles.link}>
                    Ingresa como invitado{" "}<Text style={{ color: "#ff0000"}}>Invitado</Text>
                </Text>
            </View>
        </ScrollView> 
    </KeyboardAvoidingView>
    )
}