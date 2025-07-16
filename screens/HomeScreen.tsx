import {StyleSheet,Text,View,TouchableOpacity,ScrollView,Dimensions,} from "react-native";
import React from "react";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header con fondo rojo y logo */}
      <View style={styles.header}>
        <Text style={styles.logoText}>FoodFast 🍔</Text>
      </View>

      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>
        Elige una opción para comenzar tu experiencia gastronómica.
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Registro")}
        >
          <Text style={styles.buttonIcon}>📝</Text>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonIcon}>🔑</Text>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        
      </View>

      <Text style={styles.footer}>© 2025 FoodFast. Todos los derechos reservados.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5f0", // fondo suave naranja/blanco
  },
  header: {
    width: "100%",
    height: 160,
    backgroundColor: "#e72f2f", // rojo vibrante estilo KFC
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#e72f2f",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 3,
    fontFamily: "System",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#222",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  buttonsContainer: {
    width: "90%",
    maxWidth: 400,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },//HOLA
  buttonIcon: {
    fontSize: 36,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  registerButton: {
    borderLeftWidth: 8,
    borderLeftColor: "#FF4C29", // rojo vibrante
  },
  loginButton: {
    borderLeftWidth: 8,
    borderLeftColor: "#FF8C00", // naranja
  },
  profileButton: {
    borderLeftWidth: 8,
    borderLeftColor: "#FFC107", // amarillo
  },
  footer: {
    marginTop: 40,
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },
});
