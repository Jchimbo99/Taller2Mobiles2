import {Alert,StyleSheet,Text,View,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,ScrollView,} from 'react-native'
import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/Config'
import { MaterialIcons } from '@expo/vector-icons'

export default function RestablecerScreen({ navigation }: any) {
    const [correo, setCorreo] = useState('')

    function restablecer() {
        if (!correo.trim()) {
            Alert.alert('Campo vacío', 'Por favor ingresa tu correo.')
            return
        }

        sendPasswordResetEmail(auth, correo)
            .then(() => {
                Alert.alert(
                    'Correo enviado',
                    'Hemos enviado un enlace para restablecer tu contraseña.'
                )
                setCorreo('')
                navigation.goBack()
            })
            .catch((error) => {
                console.error(error)
                Alert.alert('Error', 'No se pudo enviar el correo. Verifica tu dirección.')
            })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <KeyboardAvoidingView
                style={styles.inner}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Text style={styles.title}>Restablecer Contraseña</Text>
                <Text style={styles.subtitle}>
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </Text>

                <View style={styles.inputContainer}>
                    <MaterialIcons name="email" size={24} color="#e72f2f" style={styles.icon} />
                    <TextInput
                        placeholder="Correo electrónico"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={correo}
                        onChangeText={setCorreo}
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={restablecer}>
                    <Text style={styles.buttonText}>Enviar Solicitud</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.linkText}>← Volver al inicio de sesión</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff5f0',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 80,
        paddingBottom: 40,
    },
    inner: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#222',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 14,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        width: '100%',
        maxWidth: 400,
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
        backgroundColor: '#e67e22',
        paddingVertical: 15,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#e67e22',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    linkText: {
        color: '#e67e22',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
})
