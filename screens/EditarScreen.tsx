import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'


export default function EditarScreen() {
  const [cedula, setcedula] = useState("")
    const [nombre, setnombre] = useState("")
    const [edad, setedad] = useState(0)
    const [correo, setcorreo] = useState("")
  
    function editar() {
      
    
    }
  
  
    return (
      <View>
        <Text>Editar</Text>
        <TextInput
          placeholder='Ingresar cedula'
          onChangeText={(texto) => setcedula(texto)}
          style={styles.input}
        />
  
        <TextInput
          placeholder='Ingresar nombre'
          onChangeText={(texto) => setnombre(texto)}
          style={styles.input}
        />
  
        <TextInput
          placeholder='Ingresar edad'
          onChangeText={(texto) => setedad( +texto)}
          style={styles.input}
        />
  
        <TextInput
          placeholder='Ingresar correo'
          onChangeText={(texto) => setcorreo(texto)}
          style={styles.input}
        />
        <Button title='Editar' onPress={()=> editar() } color={'green'}/>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
    input:{
      fontSize: 25,
      backgroundColor:"#9999",
      margin: 6,
      width: "80%"
    }
  })