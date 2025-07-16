import React, { useEffect, useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { supabase } from '../supabase/Config'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'

const { width } = Dimensions.get('window')

export default function PerfilScreen({ navigation }: any) {
  const [perfil, setPerfil] = useState<any>(null)
  const [editando, setEditando] = useState(false)

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [username, setUsername] = useState('')
  const [genero, setGenero] = useState('')
  const [edad, setEdad] = useState('')
  const [correo, setCorreo] = useState('')
  const [image, setImage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    cargarPerfil()
  }, [])

  async function cargarPerfil() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('perfil')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setPerfil(data)
    setNombre(data.nombre)
    setApellido(data.apellido)
    setUsername(data.username)
    setGenero(data.genero)
    setEdad(data.edad ? String(data.edad) : '')
    setCorreo(data.correo)
    setAvatarUrl(data.avatar_url || '') // ✅ Carga la imagen guardada cada vez
  }

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

  async function subirAvatar() {
    if (!image) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const id = Date.now()
    const fileName = `avatar_${user.id}_${id}.png`

    const { error: uploadError } = await supabase
      .storage
      .from('registro')
      .upload(`public/${fileName}`, {
        uri: image,
      } as any, {
        contentType: 'image/png',
      })

    if (uploadError) {
      Alert.alert('Error', 'Error al subir imagen.')
      return
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('registro')
      .getPublicUrl(`public/${fileName}`)

    const avatarPublicUrl = publicUrlData.publicUrl

    await supabase
      .from('perfil')
      .update({ avatar_url: avatarPublicUrl })
      .eq('id', user.id)

    setAvatarUrl(avatarPublicUrl)
    setImage('')
    Alert.alert('✅', 'Avatar actualizado correctamente.')
  }

  async function guardarCambios() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('perfil')
      .update({
        nombre,
        apellido,
        username,
        genero,
        edad: Number(edad),
      })
      .eq('id', user.id)

    if (error) {
      Alert.alert('Error', error.message)
      return
    }

    setEditando(false)
    Alert.alert('✅', 'Perfil actualizado correctamente.')
    cargarPerfil()
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    })
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>FoodFast 🍔</Text>
      </View>

      <Text style={styles.title}>Mi Perfil</Text>

      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={{ color: '#e67e22' }}>Sin foto</Text>
        </View>
      )}

      {editando && (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Seleccionar Avatar</Text>
        </TouchableOpacity>
      )}

      {image ? (
        <TouchableOpacity style={styles.button} onPress={subirAvatar}>
          <Text style={styles.buttonText}>Subir Avatar</Text>
        </TouchableOpacity>
      ) : null}

      <FormInput
        icon="person"
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        editable={editando}
      />
      <FormInput
        icon="person-outline"
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        editable={editando}
      />
      <FormInput
        icon="alternate-email"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        editable={editando}
      />

      <Text style={styles.label}>Género</Text>
      <View style={styles.pickerContainer}>
        <MaterialIcons name="wc" size={24} color="#e72f2f" style={styles.icon} />
        <Picker
          enabled={editando}
          selectedValue={genero}
          onValueChange={(itemValue) => setGenero(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Selecciona --" value="" />
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Femenino" value="Femenino" />
        </Picker>
      </View>

      <FormInput
        icon="calendar-today"
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        editable={editando}
        keyboardType="numeric"
      />
      <FormInput
        icon="email"
        placeholder="Correo"
        value={correo}
        editable={false} // correo siempre no editable
      />

      {editando ? (
        <TouchableOpacity style={styles.button} onPress={guardarCambios}>
          <Text style={styles.buttonIcon}>💾</Text>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
          <Text style={styles.buttonIcon}>✏️</Text>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#e72f2f' }]}
        onPress={cerrarSesion}
      >
        <Text style={styles.buttonIcon}>🚪</Text>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© 2025 FoodFast. Todos los derechos reservados.</Text>
    </ScrollView>
  )
}

function FormInput({ icon, placeholder, editable = true, ...props }: any) {
  return (
    <View style={styles.inputContainer}>
      <MaterialIcons name={icon} size={24} color="#e72f2f" style={styles.icon} />
      <TextInput
        style={[styles.input, !editable && { opacity: 0.6 }]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        editable={editable}
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
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
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
    width: '90%',
    maxWidth: 400,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontWeight: '700',
    color: '#333',
    fontSize: 16,
    width: '90%',
    maxWidth: 400,
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
    width: '90%',
    maxWidth: 400,
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
    width: '90%',
    maxWidth: 400,
    marginBottom: 15,
    justifyContent: 'center',
  },
  buttonIcon: { fontSize: 26, marginRight: 10, color: '#fff' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  footer: {
    marginTop: 40,
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
})
