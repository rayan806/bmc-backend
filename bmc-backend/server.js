// 1. Cargamos las librerías necesarias
require('dotenv').config(); // Permite leer el archivo .env
const express = require('express');
const bcrypt = require('bcryptjs');
const conectarDB = require('./config/db'); // Trae tu archivo db.js
const Usuario = require('./models/Usuario'); // Trae tu plano Usuario.js

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const app = express();

// 2. Permitimos que el servidor entienda datos en formato JSON
app.use(express.json());

const inicializarAdmin = async () => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.warn('WARN: ADMIN_EMAIL o ADMIN_PASSWORD no están configurados en .env. No se creará el administrador automático.');
        return;
    }

    const adminExistente = await Usuario.findOne({ correo: ADMIN_EMAIL });
    if (!adminExistente) {
        const passwordEncriptada = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const admin = new Usuario({
            correo: ADMIN_EMAIL,
            password: passwordEncriptada,
            rol: 'admin'
        });
        await admin.save();
        console.log(`✅ Administrador creado con el correo ${ADMIN_EMAIL}`);
    } else {
        console.log(`✅ Administrador existente detectado: ${ADMIN_EMAIL}`);
    }
};

// ==========================================
// RUTA 1: REGISTRO DE USUARIOS
// ==========================================
app.post('/api/registrar', async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Si el correo coincide con el administrador, no permitimos que se registre desde la app
        if (ADMIN_EMAIL && correo === ADMIN_EMAIL) {
            return res.status(403).json({ error: "Este correo está reservado solo para el administrador." });
        }

        // Validamos que el correo no esté registrado ya
        const usuarioExiste = await Usuario.findOne({ correo });
        if (usuarioExiste) {
            return res.status(400).json({ error: "Este correo ya está registrado." });
        }

        // Encriptamos la contraseña por seguridad (la convertimos en un código raro)
        const passwordEncriptada = await bcrypt.hash(password, 10);

        // Creamos el nuevo usuario usando tu plano de MongoDB
        const nuevoUsuario = new Usuario({
            correo,
            password: passwordEncriptada,
            rol: 'user'
        });

        // Guardamos el usuario en la base de datos
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "¡Usuario registrado con éxito!" });

    } catch (error) {
        res.status(500).json({ error: "Hubo un error al registrar al usuario." });
    }
});

// ==========================================
// RUTA 2: INICIO DE SESIÓN (LOGIN)
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Buscamos si el correo existe en MongoDB
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ error: "El correo o la contraseña son incorrectos." });
        }

        // Comparamos la contraseña que escribió con la clave encriptada de la base de datos
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(400).json({ error: "El correo o la contraseña son incorrectos." });
        }

        // Si todo está bien, le mandamos a la app el ID del usuario y su ROL
        res.json({
            mensaje: "¡Login exitoso!",
            usuarioId: usuario._id,
            rol: usuario.rol
        });

    } catch (error) {
        res.status(500).json({ error: "Hubo un error al iniciar sesión." });
    }
});

// ==========================================
// RUTA 3: GUARDAR OPERACIÓN EN EL HISTORIAL
// ==========================================
app.post('/api/guardar-operacion', async (req, res) => {
    try {
        const { usuarioId, operacion, resultado } = req.body;

        // Buscamos al usuario por su ID único de MongoDB
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Metemos el nuevo cálculo dentro de su lista de historial
        usuario.historial.push({ operacion, resultado });

        // Guardamos los cambios actualizados en MongoDB
        await usuario.save();
        res.json({ mensaje: "Operación guardada en tu historial." });

    } catch (error) {
        res.status(500).json({ error: "Error al guardar la operación." });
    }
});

// ==========================================
// RUTA 4: PANEL SECRETO (Solo para ti como Admin)
// ==========================================
app.post('/api/historial-global', async (req, res) => {
    try {
        const { adminId } = req.body;

        // Buscamos tu cuenta en MongoDB usando tu ID
        const administrador = await Usuario.findById(adminId);
        
        // Si tu cuenta no existe o no tiene el rol "admin", bloqueamos el acceso inmediatamente
        if (!administrador || administrador.rol !== 'admin') {
            return res.status(403).json({ error: "Acceso denegado. No eres el administrador supremo." });
        }

        // Si eres tú, le pedimos a MongoDB la lista de TODOS los usuarios con sus historiales
        const todosLosUsuarios = await Usuario.find({}, 'correo historial');
        res.json({ usuarios: todosLosUsuarios });

    } catch (error) {
        res.status(500).json({ error: "Error al obtener el historial global." });
    }
});

const startServer = async () => {
    await conectarDB();
    await inicializarAdmin();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend corriendo con éxito en el puerto ${PORT}`);
    });
};

startServer();