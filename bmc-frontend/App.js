import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import CalcScreen from './src/screens/CalcScreen';
import AdminScreen from './src/screens/AdminScreen';

export default function App() {
  const [pantalla, setPantalla] = useState('Login');
  const [usuarioId, setUsuarioId] = useState(null);
  const [rol, setRol] = useState('user');

  const cambiarPantalla = (nuevaPantalla) => {
    if (nuevaPantalla === 'Login') {
      setUsuarioId(null);
      setRol('user');
    }
    setPantalla(nuevaPantalla);
  };

  return (
    <View style={styles.container}>
      {pantalla === 'Login' && (
        <LoginScreen
          cambiarPantalla={cambiarPantalla}
          setUsuarioId={setUsuarioId}
          setRol={setRol}
        />
      )}

      {pantalla === 'Calculadora' && (
        <CalcScreen
          cambiarPantalla={cambiarPantalla}
          usuarioId={usuarioId}
          rol={rol}
        />
      )}

      {pantalla === 'Admin' && (
        <AdminScreen
          cambiarPantalla={cambiarPantalla}
          adminId={usuarioId}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Mantiene el fondo oscuro de tu app
  },
});