import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutUsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Acerca de Nosotros</Text>
      
      <Text style={styles.description}>
        Somos un equipo apasionado por el desarrollo de soluciones innovadoras y efectivas para nuestros clientes. Nos especializamos en crear aplicaciones móviles y web que no solo cumplen con los requisitos técnicos, sino que también ofrecen una experiencia de usuario excepcional. Nuestro enfoque se basa en la colaboración, la transparencia y el compromiso con la excelencia.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Miembro</Text>
        <Text style={styles.cardItem}>Nombre: Estefani Ariana</Text>
        <Text style={styles.cardItem}>Apellido: Lorenzo Soriano</Text>
        <Text style={styles.cardItem}>Matrícula: 20220852</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Miembro</Text>
        <Text style={styles.cardItem}>Nombre: Christopher Alexis</Text>
        <Text style={styles.cardItem}>Apellido: Peguero Encarnacion</Text>
        <Text style={styles.cardItem}>Matrícula: 20221024</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Miembro</Text>
        <Text style={styles.cardItem}>Nombre: Diego Jossel</Text>
        <Text style={styles.cardItem}>Apellido: Vega Kelly</Text>
        <Text style={styles.cardItem}>Matrícula: 20220587</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Miembro</Text>
        <Text style={styles.cardItem}>Nombre: Josue</Text>
        <Text style={styles.cardItem}>Apellido: Nina Diaz</Text>
        <Text style={styles.cardItem}>Matrícula: 20220079</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Miembro</Text>
        <Text style={styles.cardItem}>Nombre: Adrian Alberto</Text>
        <Text style={styles.cardItem}>Apellido: Encarnacion Rubiera</Text>
        <Text style={styles.cardItem}>Matrícula: 20220502</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#333', 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', 
    textAlign: 'center',
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: '#fff', 
    textAlign: 'justify',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#444', 
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20, 
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 10,
  },
  cardItem: {
    fontSize: 16,
    color: '#fff', 
    marginBottom: 5,
  },
});
