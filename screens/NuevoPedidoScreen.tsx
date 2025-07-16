import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native'
import { supabase } from '../supabase/Config'

export default function NuevoPedidoScreen() {
    const [producto, setProducto] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [cliente, setCliente] = useState('')

    const enviarPedido = async () => {
        if (!producto || !cantidad || !cliente) {
            Alert.alert('Error', 'Por favor completa todos los campos')
            return
        }

        const { data, error } = await supabase
            .from('pedidos')
            .insert([{ producto, cantidad: Number(cantidad), cliente }])

        if (error) {
            Alert.alert('Error al enviar pedido', error.message)
        } else {
            Alert.alert('Pedido enviado con éxito')
            setProducto('')
            setCantidad('')
            setCliente('')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nuevo Pedido</Text>

            <TextInput
                style={styles.input}
                placeholder="Producto"
                value={producto}
                onChangeText={setProducto}
            />

            <TextInput
                style={styles.input}
                placeholder="Cantidad"
                keyboardType="numeric"
                value={cantidad}
                onChangeText={setCantidad}
            />

            <TextInput
                style={styles.input}
                placeholder="Cliente"
                value={cliente}
                onChangeText={setCliente}
            />

            <Button title="Enviar Pedido" onPress={enviarPedido} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        padding: 8,
        borderRadius: 6,
    },
})