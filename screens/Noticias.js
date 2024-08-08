import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const response = await fetch('https://remolacha.net/wp-json/wp/v2/posts?search=minerd');
                const data = await response.json();
                setNoticias(data);
            } catch (error) {
                console.error(error);
                alert('Error al cargar las noticias');
            }
        };

        fetchNoticias();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => alert(item.link)}>
            <Text style={styles.title}>{item.title.rendered}</Text>
            <Text style={styles.excerpt}>{item.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Noticias</Text>
            <FlatList
                data={noticias}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#333',
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    list: {
        paddingBottom: 16,
    },
    item: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 25,
        backgroundColor: '#1E90FF',
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    excerpt: {
        marginTop: 8,
        fontSize: 14,
        color: '#fff',
    },
});

export default Noticias;
