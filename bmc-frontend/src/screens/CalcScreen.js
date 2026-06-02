import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '../config';

export default function CalcScreen({ cambiarPantalla, usuarioId, rol }) {
    const [pantalla, setPantalla] = useState(''); // Guarda lo que escribe el usuario

    // Captura los clics de los botones
    const presionarBoton = (valor) => {
        setPantalla(pantalla + valor);
    };

    // Limpia la pantalla (Botón C)
    const limpiarPantalla = () => {
        setPantalla('');
    };

    // Realiza el cálculo matemático e invoca al servidor
    const calcularResultado = async () => {
        if (!pantalla) return;

        try {
            // Evaluamos la expresión matemática de forma sencilla
            // Nota: En producción usarías una librería matemática más robusta, pero para aprender esto es ideal
            const resultadoFinal = eval(pantalla).toString();
            
            const operacionRealizada = pantalla;
            setPantalla(resultadoFinal); // Mostramos el resultado en el celular

            // Guardamos automáticamente en MongoDB a través del Backend
            await fetch(`${API_URL}/guardar-operacion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuarioId: usuarioId,
                    operacion: operacionRealizada,
                    resultado: resultadoFinal
                })
            });

        } catch (error) {
            Alert.alert('Error', 'Expresión matemática inválida');
            setPantalla('');
        }
    };

    return (
        <View style={styles.contenedor}>
            {/* Encabezado con navegación especial según el rol */}
            <View style={styles.barraSuperior}>
                <TouchableOpacity style={styles.botonSalir} onPress={() => cambiarPantalla('Login')}>
                    <Text style={styles.textoNav}>🚪 Salir</Text>
                </TouchableOpacity>

                {rol === 'admin' && (
                    <TouchableOpacity style={styles.botonAdmin} onPress={() => cambiarPantalla('Admin')}>
                        <Text style={styles.textoNav}>👑 Panel Admin</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Pantalla de visualización de la calculadora */}
            <View style={styles.zonaPantalla}>
                <Text style={styles.textoPantalla} numberOfLines={1} adjustsFontSizeToFit>
                    {pantalla || '0'}
                </Text>
            </View>

            {/* Fila de botones */}
            <View style={styles.gridBotones}>
                {[['7', '8', '9', '/'], ['4', '5', '6', '*'], ['1', '2', '3', '-'], ['C', '0', '=', '+']].map((fila, i) => (
                    <View key={i} style={styles.fila}>
                        {fila.map((boton) => {
                            let estiloBoton = styles.botonNumero;
                            let accion = () => presionarBoton(boton);

                            if (['/', '*', '-', '+'].includes(boton)) estiloBoton = styles.botonOperador;
                            if (boton === 'C') { estiloBoton = styles.botonClear; accion = limpiarPantalla; }
                            if (boton === '=') { estiloBoton = styles.botonIgual; accion = calcularResultado; }

                            return (
                                <TouchableOpacity key={boton} style={estiloBoton} onPress={accion}>
                                    <Text style={styles.textoBoton}>{boton}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#1e1e24',
        paddingTop: 50,
    },
    barraSuperior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    botonSalir: { backgroundColor: '#d9534f', padding: 10, borderRadius: 5 },
    botonAdmin: { backgroundColor: '#f0ad4e', padding: 10, borderRadius: 5 },
    textoNav: { color: '#fff', fontWeight: 'bold' },
    zonaPantalla: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 20,
        backgroundColor: '#111116',
        marginHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    textoPantalla: {
        color: '#a3e635', // Letras verdes estilo retro
        fontSize: 48,
        fontWeight: 'bold',
    },
    gridBotones: {
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    botonNumero: {
        backgroundColor: '#33333f',
        width: 75,
        height: 75,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonOperador: {
        backgroundColor: '#4e54c8',
        width: 75,
        height: 75,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonClear: {
        backgroundColor: '#f43f5e',
        width: 75,
        height: 75,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonIgual: {
        backgroundColor: '#22c55e',
        width: 75,
        height: 75,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBoton: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
});