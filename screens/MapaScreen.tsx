import React, { useRef } from 'react';
import { View, Text, StyleSheet, Button, Platform, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapaScreen() {
    const latitude = -2.2244302;
    const longitude = -79.8987661;

    const mapRef = useRef<MapView | null>(null);

    const abrirEnGoogleMaps = () => {
        const url = Platform.select({
            ios: `maps://?daddr=${latitude},${longitude}&directionsmode=walking`,
            android: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking`,
        });

        if (url) {
            Linking.openURL(url).catch(() =>
                alert('No se pudo abrir Google Maps')
            );
        }
    };

    const centrarEnUbicacion = () => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoText}>
                    FoodFast <Text>🍔</Text>
                </Text>
            </View>

            <Text style={styles.title}>Nuestra Ubicación</Text>
            <Text style={styles.subtitle}>Aquí puedes ver nuestra ubicación exacta en el mapa.</Text>

            <MapView
                ref={mapRef}
                style={styles.mapa}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                }}
            >
                <Marker
                    coordinate={{ latitude, longitude }}
                    title="FoodFast Las Acacias"
                    description="Portoviejo, Ecuador"
                />
            </MapView>

            <View style={styles.botonContainer}>
                <Button
                    title="📍 Abrir en Google Maps"
                    onPress={abrirEnGoogleMaps}
                    color="#e72f2f"
                />
                <View style={{ height: 10 }} />
                <Button
                    title="🎯 Centrar Ubicación"
                    onPress={centrarEnUbicacion}
                    color="#4CAF50"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff5f0',
    },
    header: {
        width: '100%',
        height: 140,
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
    },
    logoText: {
        color: 'white',
        fontSize: 34,
        fontWeight: '900',
        letterSpacing: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#222',
        marginTop: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    mapa: {
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 15,
        overflow: 'hidden',
    },
    botonContainer: {
        padding: 20,
        backgroundColor: '#fff5f0',
    },
});
