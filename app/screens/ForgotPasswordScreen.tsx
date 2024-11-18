import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../config/supabase";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setResetError("Erro ao enviar o email de recuperação: " + error.message);
      setResetSuccess(null);
    } else {
      setResetError(null);
      setResetSuccess("Email de recuperação enviado com sucesso!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Insira seu email para receber as instruções de recuperação.
      </Text>
      {resetError && <Text style={styles.error}>{resetError}</Text>}
      {resetSuccess && <Text style={styles.success}>{resetSuccess}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
        <Text style={styles.resetButtonText}>Enviar email de recuperação</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.backButtonText}>Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resetButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginVertical: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#007bff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
