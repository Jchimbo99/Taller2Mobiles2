import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'


export default function EliminarScreen() {

  const [cedula, setcedula] = useState("")

  function eliminar(){
  
  }

  return (
    <View>
      <Text>Eliminar</Text>

      <TextInput 
        placeholder='Cedula'
        onChangeText={(texto)=> setcedula(texto)}
      />

      <Button title='Eliminar' color={'red'} onPress={()=> eliminar()}/>
    </View>
  )
}

const styles = StyleSheet.create({})