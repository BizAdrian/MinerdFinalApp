import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

const API_URL = 'https://adamix.net/minerd/def/situaciones.php?token=675c960f996d475d0af19b45a2da9757';

const Mapa = ({ navigation }) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.exito && result.datos) {
          setVisits(result.datos);
        } else {
          Alert.alert('Error', 'No se encontraron visitas.');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const handleCalloutPress = (visit) => {
    navigation.navigate('VisitDetailsScreen', { visit });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: visits.length > 0 ? parseFloat(visits[0].latitud) : 0,
            longitude: visits.length > 0 ? parseFloat(visits[0].longitud) : 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {visits.map((visit) => (
            <Marker
              key={visit.id}
              coordinate={{
                latitude: parseFloat(visit.latitud),
                longitude: parseFloat(visit.longitud),
              }}
            >
              <Callout onPress={() => handleCalloutPress(visit)}>
                <View>
                  <Text>{`Motivo: ${visit.motivo}`}</Text>
                  <Text>{`Fecha: ${visit.fecha}`}</Text>
                  <Text>{`Hora: ${visit.hora}`}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Mapa;