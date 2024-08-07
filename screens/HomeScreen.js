import React, { useEffect, useState } from 'react';
import { View, Alert, Text, StyleSheet, Animated, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button as PaperButton } from 'react-native-paper';


const clearStorage = async () => {
  Alert.alert(
    "Confirmación",
    "Estás a punto de borrar todos los datos, esta acción no puede revertirse.",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Aceptar",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert("Haz eliminado de forma permanente todos los registros");
          } catch (e) {
            Alert.alert("Error al borrar los registros");
          }
        },
      },
    ],
    { cancelable: true }
  );
};

const handleLogout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('userToken');
    Alert.alert("Cerraste Sesión");
    navigation.navigate('Login');
  } catch (e) {
    Alert.alert("Error al cerrar sesión");
    console.error(e);
  }
};

export default function HomeScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    navigation.setOptions({});

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, navigation]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

      <Image
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo8BG6UD3b_Fowh4gtwIjw2GPTWQQ30uBy-w&s' }}
      style={styles.logo}
    />
       
      <Text style={styles.welcomeText}>Bienvenidos a Nuestra App</Text>
      <PaperButton mode="contained" style={styles.button} onPress={() => navigation.navigate('Registro de Visitas')}>
        Registrar Nueva Visita
      </PaperButton>
      <PaperButton mode="contained" style={styles.button} onPress={() => navigation.navigate("Listado de Visitas")}>
        Ver listado de Visitas
      </PaperButton>
      <PaperButton mode="contained" style={styles.button} onPress={() => navigation.navigate("Opciones Avanzadas")}>
        Ver el horoscopo del dia
      </PaperButton>
      <PaperButton mode="contained" style={styles.button} onPress={() => navigation.navigate("Opciones Avanzadas")}>
        Ver las noticias del dia
      </PaperButton>
      <PaperButton mode="contained" style={styles.button} onPress={() => navigation.navigate("Opciones Avanzadas")}>
        Ver el mapa de las visitas
      </PaperButton>
      <PaperButton mode="contained" style={styles.button} onPress={() => navigation.navigate("Opciones Avanzadas")}>
        Opciones avanzadas
      </PaperButton>
      <PaperButton mode="contained" style={styles.button} onPress={() => navigation.navigate('About')}>
        About
      </PaperButton>
      <PaperButton mode="contained" style={[styles.button, styles.deleteButton]} onPress={clearStorage}>
        Borrar registros
      </PaperButton>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333', 
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff', 
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20, 
    marginTop: -80,
  },
  button: {
    borderRadius: 25, // Botón más redondeado
    marginVertical: 10,
    width: '80%',
    backgroundColor: '#1E90FF', // Azul brillante
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#E53935', 
    marginTop: 80,
  },
});
