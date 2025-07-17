import {Alert,StyleSheet,Text,TextInput,TouchableOpacity,View,Dimensions,ScrollView, GestureResponderEvent,} from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { supabase } from '../supabase/Config'
import { Picker } from '@react-native-picker/picker'
import {  Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'



const { width } = Dimensions.get('window')

export default function RegistroScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [username, setUsername] = useState('')
  const [genero, setGenero] = useState('')
  const [edad, setEdad] = useState('')
  const [image, setImage] = useState('')
const [avatarUrl, setAvatarUrl] = useState('')

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  })

  if (!result.canceled) {
    setImage(result.assets[0].uri)
  }
}



 async function registro() {
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
    options: {
      data: {
        name: nombre,
        apellido: apellido,
        username: username,
      },
    },
  })

  if (data.user != null) {
    const userId = data.user.id

    let avatarPublicUrl = null

    if (image) {
      // Subir imagen al bucket
      const id = Date.now()
      const fileName = `avatar_${userId}_${id}.png`

      const { error: uploadError } = await supabase.storage
        .from('registro')
        .upload(`public/${fileName}`, {
          uri: image,
        } as any, {
          contentType: 'image/png',
        })

      if (!uploadError) {
        const { data: publicUrlData } = supabase
          .storage
          .from('registro')
          .getPublicUrl(`public/${fileName}`)

        avatarPublicUrl = publicUrlData.publicUrl
        setAvatarUrl(avatarPublicUrl)
      }
    }

    // Guardar en tabla perfil
    await guardar(userId, avatarPublicUrl)

    Alert.alert('✅ Registro exitoso', 'Tu cuenta ha sido creada correctamente.', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Login'),
      },
    ])
  } else {
    Alert.alert('❌ Error', error?.message || 'No se pudo registrar.')
  }
}


async function guardar(uid: string, avatarUrlParam: string | null) {
  const { error } = await supabase.from('perfil').insert({
    id: uid,
    nombre,
    apellido,
    username,
    edad: Number(edad),
    genero,
    correo,
    avatar_url: avatarUrlParam,
  })

  if (error) {
    Alert.alert('❌ No se pudo guardar el perfil', error.message)
  }
}

  function subirAvatar(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.')
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

  <Text style={styles.title}>Crea tu cuenta</Text>
  <Text style={styles.subtitle}>
    Regístrate para ordenar, guardar favoritos y más.
  </Text>

 {image ? (
  <Image source={{ uri: image }} style={styles.avatar} />
) : (
  <View style={styles.avatarPlaceholder}>
    <Text style={{ color: '#e67e22' }}>Sin foto</Text>
  </View>
)}


  <TouchableOpacity style={styles.button} onPress={pickImage}>
    <Text style={styles.buttonText}>Seleccionar Avatar</Text>
  </TouchableOpacity>

  <View style={styles.form}>
    <FormInput icon="person" placeholder="Nombre" value={nombre} onChangeText={setNombre} />
    <FormInput icon="person-outline" placeholder="Apellido" value={apellido} onChangeText={setApellido} />
    <FormInput icon="alternate-email" placeholder="Username" value={username} onChangeText={setUsername} />
    <FormInput icon="email" placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
    <FormInput icon="lock" placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />

    <Text style={styles.label}>Género</Text>
    <View style={styles.pickerContainer}>
      <MaterialIcons name="wc" size={24} color="#e72f2f" style={styles.icon} />
      <Picker
        selectedValue={genero}
        onValueChange={(itemValue: React.SetStateAction<string>) => setGenero(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="-- Selecciona --" value="" />
        <Picker.Item label="Masculino" value="Masculino" />
        <Picker.Item label="Femenino" value="Femenino" />
      </Picker>
    </View>

    <FormInput icon="calendar-today" placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />

    <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={registro}>
      <Text style={styles.buttonIcon}>📝</Text>
      <Text style={styles.buttonText}>Registrarse</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
      <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
    </TouchableOpacity>
  </View>

  <Text style={styles.footer}>© 2025 FoodFast. Todos los derechos reservados.</Text>
</ScrollView>

  )
}

function FormInput({ icon, placeholder, ...props }: any) {
  return (
    <View style={styles.inputContainer}>
      <MaterialIcons name={icon} size={24} color="#e72f2f" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f0' },
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
  title: { fontSize: 30, fontWeight: '800', color: '#222', marginBottom: 8, textAlign: 'center' },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  form: { width: '90%', maxWidth: 400, alignItems: 'center' },
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
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },

  label: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontWeight: '700',
    color: '#333',
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  picker: {
    flex: 1,
    height: 50,
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
  buttonIcon: { fontSize: 26, marginRight: 10, color: '#fff' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  linkText: {
    color: '#e67e22',
    marginTop: 8,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  footer: { marginTop: 40, color: '#aaa', fontSize: 14, textAlign: 'center' },
  avatar: {
  width: 150,
  height: 150,
  borderRadius: 75,
  borderWidth: 3,
  borderColor: '#e67e22',
  marginBottom: 20,
},
avatarPlaceholder: {
  width: 150,
  height: 150,
  borderRadius: 75,
  borderWidth: 2,
  borderColor: '#e67e22',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
  backgroundColor: '#fff1e0',
},

})
