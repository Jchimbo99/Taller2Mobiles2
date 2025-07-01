import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'


export default function LeerScreen() {

  const [datos, setdatos] = useState([])


  function leer() {
    
  }


  useEffect(() => {
   leer()
   //console.log(datos); 
  }, [ ] )

  type Usuario ={
    cedula: String,
    user: String,
    age: number,
    email: String
  }
  

  return (
    <View>
      <Text>Leer </Text>
      <FlatList 
        data={datos}
        renderItem={ ( {item}: {item: Usuario}  ) =>
        <View>
          <Text>{item.user}</Text>
          <Text>{item.age}</Text>
        </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({})