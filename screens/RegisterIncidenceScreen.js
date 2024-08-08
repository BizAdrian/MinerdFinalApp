import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, Platform, TouchableOpacity, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterIncidenceScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [schoolCenter, setSchoolCenter] = useState('');
  const [regional, setRegional] = useState('');
  const [district, setDistrict] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [audioUri, setAudioUri] = useState('');
  const [recording, setRecording] = useState(null);
  const soundRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (audioStatus !== 'granted' || imageStatus !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos para usar el micrófono y la biblioteca de imágenes.');
      }
    })();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handlePhotoPick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto.');
      console.error(error);
    }
  };

  const handleAudioRecord = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setRecording(null);
      } else {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(newRecording);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo grabar el audio.');
      console.error(error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    if (!title || !schoolCenter || !regional || !district || !date || !description) {
      Alert.alert('Error', 'Por favor, proporciona todos los campos obligatorios.');
      return;
    }

    const newIncidence = {
      title,
      schoolCenter,
      regional,
      district,
      date: date.toISOString().split('T')[0],
      description,
      photoUri,
      audioUri,
    };

    try {
      const storedIncidents = await AsyncStorage.getItem('incidents');
      const incidents = storedIncidents ? JSON.parse(storedIncidents) : [];
      incidents.push(newIncidence);
      await AsyncStorage.setItem('incidents', JSON.stringify(incidents));
      Alert.alert('Éxito', '¡Incidencia registrada exitosamente!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la incidencia.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Centro Educativo"
        value={schoolCenter}
        onChangeText={setSchoolCenter}
        style={styles.input}
      />
      <TextInput
        placeholder="Regional"
        value={regional}
        onChangeText={setRegional}
        style={styles.input}
      />
      <TextInput
        placeholder="Distrito"
        value={district}
        onChangeText={setDistrict}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={showDatepicker}>
        <Text style={styles.buttonText}>Seleccionar Fecha</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text style={styles.infoText}>Fecha: {date.toDateString()}</Text>
      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handlePhotoPick}>
        <Text style={styles.buttonText}>Seleccionar una foto</Text>
      </TouchableOpacity>
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.image} /> : null}
      <TouchableOpacity style={styles.button} onPress={handleAudioRecord}>
        <Text style={styles.buttonText}>{recording ? "Detener Grabación" : "Grabar Audio"}</Text>
      </TouchableOpacity>
      {audioUri ? (
        <TouchableOpacity onPress={() => soundRef.current && soundRef.current.playAsync()}>
          <Text style={styles.buttonText}>Reproducir Audio</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333', // Fondo gris oscuro
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
  registerButton: {
    backgroundColor: '#28a745', // Verde para el botón de registro
  },
  buttonText: {
    color: '#fff', // Texto blanco en los botones
    fontWeight: 'bold',
  },
  infoText: {
    color: '#fff', // Texto blanco
    marginBottom: 12,
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginVertical: 16,
  },
});

