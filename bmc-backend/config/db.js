const mongoose = require('mongoose');

// Esta función se encargará de prender el cable hacia MongoDB
const conectarDB = async () => {
    try {
        // Le pedimos a Mongoose que se conecte usando la dirección secreta del archivo .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🍃 ¡Conectado con éxito a MongoDB! (Base de datos lista)');
    } catch (error) {
        console.error('❌ Error crítico al conectar a MongoDB:', error.message);
        // Si no se puede conectar a la base de datos, apagamos el servidor de inmediato
        process.exit(1); 
    }
};

// Exportamos la función para que el archivo server.js pueda usarla más adelante
module.exports = conectarDB;