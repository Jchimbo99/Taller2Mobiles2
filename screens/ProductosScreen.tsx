import React, { useEffect, useState } from 'react'
import {
    View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert
} from 'react-native'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/Config'
import { supabase } from '../supabase/Config'

type Producto = {
    id: string
    nombre: string
    precio: number
    imagenUrl: string
    descripcion: string
}

type CarritoItem = {
    producto: Producto
    cantidad: number
}

export default function CatalogoScreen() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [carrito, setCarrito] = useState<CarritoItem[]>([])
    const [nombreUsuario, setNombreUsuario] = useState<string | null>(null)

    useEffect(() => {
        leerProductos()
        cargarUsuario()
    }, [])

    async function leerProductos() {
        const snapshot = await getDocs(collection(db, 'productos'))
        const lista: Producto[] = []
        snapshot.forEach((doc) =>
            lista.push({ id: doc.id, ...doc.data() } as Producto)
        )
        setProductos(lista)
    }

    async function cargarUsuario() {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (user) {
            const nombre =
                user.user_metadata?.name ||
                user.user_metadata?.username ||
                user.email ||
                null

            setNombreUsuario(nombre)
        }
    }

    const agregarAlCarrito = (producto: Producto) => {
        setCarrito((prev) => {
            const existe = prev.find((item) => item.producto.id === producto.id)
            if (existe) {
                return prev.map((item) =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            } else {
                return [...prev, { producto, cantidad: 1 }]
            }
        })
        Alert.alert('Agregado', `${producto.nombre} añadido al carrito`)
    }

    const aumentarCantidad = (id: string) => {
        setCarrito((prev) =>
            prev.map((item) =>
                item.producto.id === id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            )
        )
    }

    const disminuirCantidad = (id: string) => {
        setCarrito((prev) =>
            prev
                .map((item) =>
                    item.producto.id === id && item.cantidad > 1
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                )
                .filter((item) => item.cantidad > 0)
        )
    }

    const eliminarProducto = (id: string) => {
        setCarrito((prev) => prev.filter((item) => item.producto.id !== id))
    }

    const vaciarCarrito = () => {
        setCarrito([])
        Alert.alert('Carrito', 'Se vació el carrito.')
    }

    const totalCarrito = carrito.reduce(
        (suma, item) => suma + item.producto.precio * item.cantidad,
        0
    )

    const comprarCarrito = async () => {
        if (carrito.length === 0) {
            Alert.alert('Carrito vacío', 'Agrega productos antes de comprar.')
            return
        }

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            Alert.alert('Error', 'Debes iniciar sesión para comprar.')
            return
        }

        for (const item of carrito) {
            const total = item.producto.precio * item.cantidad
            const { error } = await supabase.from('pedidos').insert([
                {
                    usuario_id: user.id,
                    usuario_nombre: nombreUsuario,
                    producto_id: item.producto.id,
                    producto_nombre: item.producto.nombre,
                    cantidad: item.cantidad,
                    total,
                },
            ])

            if (error) {
                Alert.alert('Error', `No se pudo guardar ${item.producto.nombre}.`)
                return
            }
        }

        Alert.alert('Pedido realizado', `Total: $${totalCarrito.toFixed(2)}`)
        setCarrito([])
    }

    const renderProducto = ({ item }: { item: Producto }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.imagenUrl }} style={styles.imagen} />
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.precio}>${item.precio.toFixed(2)}</Text>
            <TouchableOpacity
                style={styles.botonAgregar}
                onPress={() => agregarAlCarrito(item)}
            >
                <Text style={styles.botonAgregarTexto}>Agregar</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.container}>
            {/* Header estilo LoginScreen */}
            <View style={styles.header}>
                <Text style={styles.logoText}>FoodFast 🍔</Text>
            </View>

            <FlatList
                data={productos}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={renderProducto}
                columnWrapperStyle={styles.fila}
                contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 10 }}
            />

            {carrito.length > 0 && (
                <View style={styles.carrito}>
                    <Text style={styles.carritoTitulo}>🛒 Carrito</Text>
                    {carrito.map((item) => (
                        <View key={item.producto.id} style={styles.carritoItem}>
                            <Text>
                                {item.producto.nombre} x {item.cantidad}
                            </Text>
                            <View style={styles.cantidadControles}>
                                <TouchableOpacity
                                    onPress={() => aumentarCantidad(item.producto.id)}
                                    style={styles.botonCantidad}
                                >
                                    <Text style={styles.botonCantidadTexto}>+</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => disminuirCantidad(item.producto.id)}
                                    style={styles.botonCantidad}
                                >
                                    <Text style={styles.botonCantidadTexto}>-</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => eliminarProducto(item.producto.id)}
                                    style={styles.botonEliminar}
                                >
                                    <Text style={styles.botonEliminarTexto}>❌</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <Text style={styles.totalTexto}>Total: ${totalCarrito.toFixed(2)}</Text>
                    <TouchableOpacity
                        style={styles.botonComprar}
                        onPress={comprarCarrito}
                    >
                        <Text style={styles.botonComprarTexto}>Comprar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonVaciar} onPress={vaciarCarrito}>
                        <Text style={styles.botonVaciarTexto}>Vaciar carrito</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        marginBottom: 15,
    },
    logoText: {
        color: 'white',
        fontSize: 38,
        fontWeight: '900',
        letterSpacing: 3,
    },
    fila: { justifyContent: 'space-between' },
    card: {
        backgroundColor: '#fff',
        padding: 8,
        margin: 5,
        borderRadius: 12,
        flex: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    imagen: { width: 120, height: 120, borderRadius: 8 },
    nombre: { fontWeight: 'bold', marginVertical: 4, textAlign: 'center' },
    precio: { color: '#555' },
    botonAgregar: {
        backgroundColor: '#e67e22',
        padding: 6,
        borderRadius: 6,
        marginTop: 5,
        width: '100%',
        alignItems: 'center',
    },
    botonAgregarTexto: { color: '#fff', fontWeight: 'bold' },
    carrito: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff5f0',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 15,
        maxHeight: 220,
    },
    carritoTitulo: { fontWeight: 'bold', marginBottom: 5 },
    carritoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    cantidadControles: { flexDirection: 'row' },
    botonCantidad: {
        backgroundColor: '#e67e22',
        borderRadius: 5,
        marginLeft: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    botonCantidadTexto: { color: '#fff' },
    botonEliminar: {
        backgroundColor: '#dc3545',
        borderRadius: 5,
        marginLeft: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    botonEliminarTexto: { color: '#fff', fontWeight: 'bold' },
    botonVaciar: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
    },
    botonVaciarTexto: { color: '#fff', fontWeight: 'bold' },
    totalTexto: { textAlign: 'right', marginTop: 5, fontWeight: 'bold' },
    botonComprar: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    botonComprarTexto: { color: '#fff', fontWeight: 'bold' },
})
