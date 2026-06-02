import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { API_URL } from '../config';

export default function AdminScreen({ cambiarPantalla, adminId }) {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Función para traer el historial global de la base de datos
    const obtenerHistorialGlobal = async () => {
        try {
            setCargando(true);
            const respuesta = await fetch(`${API_URL}/historial-global`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId })
            });
            const datos = await respuesta.json();

            if (respuesta.ok) {
                setUsuarios(datos.usuarios || []);
            } else {
                Alert.alert('Error', datos.error || 'No se pudo obtener el historial');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión con el backend');
        } finally {
            setCargando(false);
        }
    };

    // Se ejecuta automáticamente al abrir la pantalla
    useEffect(() => {
        obtenerHistorialGlobal();
    }, []);

    return (
        <View style={styles.contenedor}>
            {/* Barra superior de navegación */}
            <View style={styles.barraSuperior}>
                <Text style={styles.titulo}>👑 Panel de Auditoría</Text>
                <TouchableOpacity style={styles.botonVolver} onPress={() => cambiarPantalla('Calculadora')}>
                    <Text style={styles.textoBoton}>🧮 Volver</Text>
                </TouchableOpacity>
            </View>

            {/* Ruleta de carga si los datos están viajando desde la nube */}
            {cargando ? (
                <ActivityIndicator size="large" color="#f0ad4e" style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={usuarios}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <Text style={styles.textoVacio}>No hay operaciones registradas aún en el sistema.</Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.tarjetaUsuario}>
                            <Text style={styles.correoUsuario}>{item.correo}</Text>
                            {item.historial.length === 0 ? (
                                <Text style={styles.textoVacioOperacion}>Este usuario aún no realizó cálculos.</Text>
                            ) : (
                                item.historial.map((operacion, index) => (
                                    <View key={index} style={styles.tarjetaOperacion}>
                                        <Text style={styles.textoCalculo}>
                                            {operacion.operacion} = <Text style={styles.resultadoDestacado}>{operacion.resultado}</Text>
                                        </Text>
                                        <Text style={styles.textoFecha}>
                                            📅 {new Date(operacion.fecha).toLocaleString()}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#1e1e24',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    barraSuperior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f0ad4e', // Dorado de administrador
    },
    botonVolver: {
        backgroundColor: '#4e54c8',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    textoBoton: {
        color: '#fff',
        fontWeight: 'bold',
    },
    textoVacio: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    tarjetaUsuario: {
        backgroundColor: '#282935',
        padding: 15,
        borderRadius: 12,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#3b3b4b',
    },
    correoUsuario: {
        color: '#f8fafc',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    tarjetaOperacion: {
        backgroundColor: '#20222b',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    textoCalculo: {
        color: '#e5e7eb',
        fontSize: 15,
    },
    resultadoDestacado: {
        color: '#22c55e',
        fontWeight: 'bold',
    },
    textoFecha: {
        color: '#8b98a7',
        fontSize: 12,
        marginTop: 6,
        textAlign: 'right',
    },
    textoVacioOperacion: {
        color: '#a1a1aa',
        fontSize: 14,
        marginTop: 5,
    }
}); // <-- ¡Asegúrate de que tenga el paréntesis y el punto y coma justo después de la llave!