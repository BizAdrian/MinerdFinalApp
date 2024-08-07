import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [clave, setClave] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const handleRegister = async () => {
    if (!cedula || !nombre || !apellido || !clave || !correo || !telefono || !fechaNacimiento) {
      Alert.alert('Error', 'Todos los campos son requeridos.');
      return;
    } else {
      await saveUser();
    }
  }

  const saveUser = async () => {
    const url = "https://adamix.net/minerd/def/registro.php";

    try {
      let formData = new FormData();
      formData.append('cedula', cedula);
      formData.append('nombre', nombre);
      formData.append('apellido', apellido);
      formData.append('clave', clave);
      formData.append('correo', correo);
      formData.append('telefono', telefono);
      formData.append('fecha_nacimiento', fechaNacimiento);

      let response = await fetch(url, {
        method: "POST",
        body: formData
      });

      let result = await response.json();

      if (result.exito) {
        Alert.alert('Éxito', 'Registro exitoso');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', result.mensaje);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Ingrese sus datos</Text>
      <TextInput
        placeholder="Cédula"
        value={cedula}
        onChangeText={(text) => setCedula(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={(text) => setApellido(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={clave}
        onChangeText={(text) => setClave(text)}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Correo"
        value={correo}
        onChangeText={(text) => setCorreo(text)}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={telefono}
        onChangeText={(text) => setTelefono(text)}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha de Nacimiento"
        value={fechaNacimiento}
        onChangeText={(text) => setFechaNacimiento(text)}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#333', // Fondo gris oscuro
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff', 
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#1E90FF', // Azul brillante
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8, // Bordes redondeados
    backgroundColor: '#fff', // Fondo blanco para los inputs
  },
  button: {
    backgroundColor: '#1E90FF', // Azul brillante
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, // Bordes redondeados
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff', // Texto blanco en los botones
    fontWeight: 'bold',
  },
});
