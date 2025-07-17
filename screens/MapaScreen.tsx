import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Linking, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/Config';

type Location = {
  latitude: number;
  longitude: number;
  direccion: string;
};

export default function MapaScreen() {
  const [location, setLocation] = useState<Location>({
    latitude: -0.2526,
    longitude: -78.5224,
    direccion: 'Cargando...',
  });

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const docRef = doc(db, 'config', 'ubicacion');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Location;
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            direccion: data.direccion,
          });
        } else {
          Alert.alert('Error', 'No se encontró la ubicación en la base de datos');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la ubicación');
      }
    };
    fetchLocation();
  }, []);

  const centerMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    }
  };

  // Función para abrir Google Maps externo con la ubicación
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se puede abrir Google Maps en este dispositivo');
        }
      })
      .catch(() => Alert.alert('Error', 'Ocurrió un error al intentar abrir Google Maps'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ubicación del Negocio</Text>
        <Text style={styles.address}>{location.direccion}</Text>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Ubicación actual"
          description={location.direccion}
        />
      </MapView>

      <View style={styles.buttonsContainer}>
        {/* Botón para centrar mapa */}
        <TouchableOpacity style={styles.centerButton} onPress={centerMap}>
          <Text style={styles.centerIcon}>🍔</Text>
        </TouchableOpacity>

        {/* Botón para abrir Google Maps externo */}
        <TouchableOpacity style={styles.externalButton} onPress={openInGoogleMaps}>
          <Text style={styles.externalButtonText}>Abrir en Google Maps</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa' },
  header: {
    padding: 16,
    backgroundColor: '#0a3d62',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  address: {
    marginTop: 4,
    fontSize: 14,
    color: 'white',
  },
  map: {
    flex: 1,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,
  },
  centerButton: {
    backgroundColor: '#e67e22',
    borderRadius: 30,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 12,
  },
  centerIcon: {
    fontSize: 24,
    color: '#fff',
  },
  externalButton: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  externalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
