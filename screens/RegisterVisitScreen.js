import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Animated, Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterVisitScreen({ navigation }) {
  const [cedulaDirector, setCedulaDirector] = useState("");
  const [codigoCentro, setCodigoCentro] = useState("");
  const [motivo, setMotivo] = useState("");
  const [comentario, setComentario] = useState("");
  const [fotoUri, setFotoUri] = useState("");
  const [audioUri, setAudioUri] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [token, setToken] = useState("");
  const [motivos, setMotivos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingMotivos, setIsLoadingMotivos] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); 

  useEffect(() => {
    const fetchTokenAndMotivos = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        if (storedToken) {
          setToken(storedToken);
          await fetchAllMotivos(storedToken);
        } else {
          Alert.alert("Error", "No se encontró un token de autenticación.");
          navigation.navigate("Login");
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Hubo un problema al obtener el token.");
        navigation.navigate("Login");
      }
    };

    fetchTokenAndMotivos();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [navigation, fadeAnim]);

  const fetchAllMotivos = async (authToken) => {
    try {
      const allMotivos = [];
      const urlBase = "https://adamix.net/minerd/def/situacion.php?token=";

      for (let id = 1; id <= 35; id++) {
        const url = `${urlBase}${authToken}&situacion_id=${id}`;
        let response = await fetch(url);
        let result = await response.json();

        if (result.exito && result.datos && result.datos.motivo) {
          allMotivos.push(result.datos.motivo);
        }
      }

      const uniqueMotivos = Array.from(new Set(allMotivos));
      const motivoList = uniqueMotivos.map((motivo, index) => ({
        id: index.toString(),
        motivo,
      }));

      setMotivos(motivoList);
      setIsLoadingMotivos(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
      console.error(error);
      setIsLoadingMotivos(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShowDatePicker(Platform.OS === "ios");
    setFecha(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || hora;
    setShowTimePicker(Platform.OS === "ios");
    setHora(currentTime);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleRegisterVisit = async () => {
    if (
      !cedulaDirector ||
      !codigoCentro ||
      !motivo ||
      !comentario ||
      !latitud ||
      !longitud ||
      !fecha ||
      !hora ||
      !token
    ) {
      Alert.alert("Error", "Todos los campos son requeridos.");
      return;
    }

    const formattedDate = fecha.toISOString().split("T")[0];
    const formattedTime = hora.toTimeString().substring(0, 5);

    try {
      const url = "https://adamix.net/minerd/minerd/registrar_visita.php";
      let formData = new FormData();
      formData.append("cedula_director", cedulaDirector);
      formData.append("codigo_centro", codigoCentro);
      formData.append("motivo", motivo);
      formData.append("comentario", comentario);
      formData.append("latitud", latitud);
      formData.append("longitud", longitud);
      formData.append("fecha", formattedDate);
      formData.append("hora", formattedTime);
      formData.append("token", token);
      formData.append("foto_evidencia", fotoUri);
      formData.append("nota_voz", audioUri);

      let response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      let result = await response.json();

      if (result.exito) {
        Alert.alert("Registro de Visita", "Visita registrada exitosamente");

        // Guardar la visita en AsyncStorage
        const newVisit = {
          cedulaDirector,
          codigoCentro,
          motivo,
          comentario,
          latitud,
          longitud,
          fecha: formattedDate,
          hora: formattedTime,
          fotoUri,
          audioUri,
        };

        const storedVisits = await AsyncStorage.getItem('visits');
        const visits = storedVisits ? JSON.parse(storedVisits) : [];
        visits.push(newVisit);
        await AsyncStorage.setItem('visits', JSON.stringify(visits));

        navigation.navigate("ViewVisits");
      } else {
        Alert.alert("Error", result.mensaje);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
      console.error(error);
    }
  };

  const renderMotivoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setMotivo(item.motivo);
        setModalVisible(false);
      }}
    >
      <Text style={styles.modalItemText}>{item.motivo}</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TextInput
        placeholder="ID Director"
        value={cedulaDirector}
        onChangeText={setCedulaDirector}
        style={styles.input}
      />
      <TextInput
        placeholder="ID del Centro"
        value={codigoCentro}
        onChangeText={setCodigoCentro}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          if (!isLoadingMotivos) {
            setModalVisible(true);
          } else {
            Alert.alert(
              "Cargando",
              "Por favor, espere mientras se cargan los motivos."
            );
          }
        }}
      >
        <Text style={styles.inputText}>{motivo || "Selecciona el motivo"}</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Comentario"
        value={comentario}
        onChangeText={setComentario}
        style={styles.input}
      />
      <TextInput
        placeholder="Latitud"
        value={latitud}
        onChangeText={setLatitud}
        style={styles.input}
      />
      <TextInput
        placeholder="Longitud"
        value={longitud}
        onChangeText={setLongitud}
        style={styles.input}
      />
      <TextInput
        placeholder="Ruta de la Imagen"
        value={fotoUri}
        onChangeText={setFotoUri}
        style={styles.input}
      />
      <TextInput
        placeholder="Ruta del Audio"
        value={audioUri}
        onChangeText={setAudioUri}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={showDatepicker}>
        <Text style={styles.buttonText}>Seleccionar Fecha</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
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
          value={hora}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Text style={styles.infoText}>Fecha: {fecha.toISOString().split("T")[0]}</Text>
      <Text style={styles.infoText}>Hora: {hora.toTimeString().substring(0, 5)}</Text>
      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegisterVisit}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona un motivo</Text>
          {isLoadingMotivos ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : (
            <FlatList
              data={motivos}
              renderItem={renderMotivoItem}
              keyExtractor={(item) => item.id}
            />
          )}
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  inputText: {
    color: '#000', // Texto blanco
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
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Fondo gris oscuro
  },
  modalTitle: {
    fontSize: 24,
    color: '#fff', // Texto blanco
    marginBottom: 12,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalItemText: {
    color: '#fff', // Texto blanco en items del modal
  },
  modalCloseButton: {
    backgroundColor: '#E53935', // Rojo brillante
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, // Bordes redondeados
    marginTop: 20,
  },
});
