import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { API_URL } from '../config';

export default function LoginScreen({ cambiarPantalla, setUsuarioId, setRol }) {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    // FUNCIÓN PARA INICIAR SESIÓN
    const manejarLogin = async () => {
        if (!correo || !password) {
            Alert.alert('Error', 'Por favor llena todos los campos');
            return;
        }
        try {
            const respuesta = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password })
            });
            const datos = await respuesta.json();

            if (respuesta.ok) {
                Alert.alert('¡Bienvenido!', datos.mensaje);
                setUsuarioId(datos.usuarioId); // Guardamos quién entró
                setRol(datos.rol);             // Guardamos si es user o admin
                cambiarPantalla('Calculadora'); // Lo mandamos a la calculadora
            } else {
                Alert.alert('Error', datos.error);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo conectar con el servidor backend');
        }
    };

    // FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO
    const manejarRegistro = async () => {
        if (!correo || !password) {
            Alert.alert('Error', 'Por favor llena todos los campos');
            return;
        }
        try {
            const respuesta = await fetch(`${API_URL}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password })
            });
            const datos = await respuesta.json();

            if (respuesta.ok) {
                Alert.alert('Éxito', datos.mensaje);
            } else {
                Alert.alert('Error', datos.error);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo conectar con el servidor backend');
        }
    };

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>BMC Calculadora</Text>
            
            <TextInput 
                style={styles.entrada}
                placeholder="Correo electrónico"
                placeholderTextColor="#aaa"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput 
                style={styles.entrada}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true} // Oculta los caracteres de la clave
            />

            <TouchableOpacity style={styles.botonLogin} onPress={manejarLogin}>
                <Text style={styles.textoBoton}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonRegistro} onPress={manejarRegistro}>
                <Text style={styles.textoBotonRegistro}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#1e1e24', // Fondo oscuro moderno
        justifyContent: 'center',
        padding: 30,
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    entrada: {
        backgroundColor: '#2a2a35',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
    },
    botonLogin: {
        backgroundColor: '#4e54c8', // Azul rey llamativo
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBoton: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    botonRegistro: {
        alignItems: 'center',
        marginTop: 20,
    },
    textoBotonRegistro: {
        color: '#4e54c8',
        fontSize: 16,
    }
});