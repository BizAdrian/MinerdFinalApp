import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, Platform, TouchableOpacity, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function RegisterIncidenceScreen({ navigation }) {
  const [directorId, setDirectorId] = useState('');
  const [centerCode, setCenterCode] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [comment, setComment] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [audioUri, setAudioUri] = useState('');
  const [recording, setRecording] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState(null);
  const soundRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: locationStatus } = await Location.requestPermissionsAsync();
      if (audioStatus !== 'granted' || imageStatus !== 'granted' || locationStatus !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos para usar el micrófono, la biblioteca de imágenes y la ubicación.');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
    })();

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
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleSubmit = async () => {
    if (!directorId || !centerCode || !date || !time) {
      Alert.alert('Error', 'Por favor, proporciona todos los campos obligatorios.');
      return;
    }

    const newIncidence = {
      directorId,
      centerCode,
      date: date.toISOString().split('T')[0],
      time: time.toISOString().split('T')[1].substring(0, 5),
      comment,
      photoUri,
      audioUri,
      latitude: location?.latitude,
      longitude: location?.longitude,
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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TextInput
        placeholder="Cédula del Director"
        value={directorId}
        onChangeText={setDirectorId}
        style={styles.input}
      />
      <TextInput
        placeholder="ID del Centro"
        value={centerCode}
        onChangeText={setCenterCode}
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
      <TouchableOpacity style={styles.button} onPress={showTimepicker}>
        <Text style={styles.buttonText}>Seleccionar Hora</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Text style={styles.infoText}>Fecha: {date.toDateString()}</Text>
      <Text style={styles.infoText}>Hora: {time.toTimeString().substring(0, 5)}</Text>
      <TextInput
        placeholder="Añadir Comentario"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handlePhotoPick}>
        <Text style={styles.buttonText}>Seleccionar una foto</Text>
      </TouchableOpacity>
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.image} /> : null}
      <TouchableOpacity style={styles.button} onPress={handleAudioRecord}>
        <Text style={styles.buttonText}>{recording ? "Detener Grabación" : "Grabar Audio"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </Animated.View>
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
