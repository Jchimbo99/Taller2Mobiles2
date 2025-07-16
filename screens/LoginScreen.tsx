import {Alert,StyleSheet,Text,TextInput,TouchableOpacity,View,Dimensions,ScrollView,} from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { supabase } from '../supabase/Config'

const { width } = Dimensions.get('window')

export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')

  async function login() {
    
    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.')
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena,
      })

      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Credenciales inválidas', 'Correo o contraseña incorrectos.')
        } else if (error.message.includes('User not found')) {
          Alert.alert('Usuario no encontrado', 'No existe una cuenta con este correo.')
        } else {
          Alert.alert('Error de autenticación', error.message)
        }
        return
      }

      
      if (!data.user) {
        Alert.alert('Error inesperado', 'No se pudo iniciar sesión. Intenta de nuevo.')
        return
      }

      
      Alert.alert('¡Bienvenido!', 'Inicio de sesión exitoso.', [
        {
          text: 'Continuar',
          onPress: () => navigation.navigate('Productos'),
        },
      ])
    } catch (err: any) {
      console.error(err)
      Alert.alert('Error inesperado', 'Ocurrió un error al iniciar sesión. Intenta más tarde.')
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>FoodFast 🍔</Text>
      </View>

      <Text style={styles.title}>Inicia Sesión</Text>
      <Text style={styles.subtitle}>
        Accede para comenzar a ordenar tus platos favoritos.
      </Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#e72f2f" style={styles.icon} />
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            placeholderTextColor="#888"
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#e72f2f" style={styles.icon} />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            placeholderTextColor="#888"
            secureTextEntry
            onChangeText={setContrasena}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={login}
        >
          <Text style={styles.buttonIcon}>🔓</Text>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Restablecer')}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        © 2025 FoodFast. Todos los derechos reservados.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f0',
  },
  header: {
    width: '100%',
    height: 160,
    backgroundColor: '#e72f2f',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#e72f2f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
  },
  logoText: {
    color: 'white',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  form: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#e67e22',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    shadowColor: '#e67e22',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  buttonIcon: {
    fontSize: 26,
    marginRight: 10,
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  linkText: {
    color: '#e67e22',
    marginTop: 8,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 40,
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
})
