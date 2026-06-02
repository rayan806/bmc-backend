const mongoose = require('mongoose');

// Esta función intenta conectar a MongoDB con reintentos y backoff.
const conectarDB = async (opts = {}) => {
    const uri = process.env.MONGO_URI;
    const maxRetries = opts.maxRetries ?? 5;
    const baseDelayMs = opts.baseDelayMs ?? 2000;

    if (!uri) {
        console.error('❌ MONGO_URI no está configurada en el entorno. No se intentará conectar.');
        return false;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await mongoose.connect(uri);
            console.log('🍃 ¡Conectado con éxito a MongoDB! (Base de datos lista)');
            return true;
        } catch (error) {
            console.error(`Intento ${attempt}/${maxRetries} - Error al conectar a MongoDB:`, error.message);
            if (attempt < maxRetries) {
                const delay = baseDelayMs * attempt;
                console.log(`Reintentando en ${delay}ms...`);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    console.error('❌ No se pudo conectar a MongoDB después de varios intentos. Mantendré el proceso en ejecución para facilitar debugging.');
    return false;
};

module.exports = conectarDB;