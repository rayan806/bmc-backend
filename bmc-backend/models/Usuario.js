const mongoose = require('mongoose');

// Este es el plano (Schema) que define la forma de los datos en MongoDB
const UsuarioSchema = new mongoose.Schema({
    correo: { 
        type: String, 
        unique: true,      // No permite que dos personas se registren con el mismo correo
        required: true     // Obligatorio para poder crear la cuenta
    },
    password: { 
        type: String, 
        required: true     // Obligatorio (aquí guardaremos la clave encriptada)
    },
    rol: { 
        type: String, 
        default: "user"    // Por defecto todos son 'user'. Tú luego cambiarás el tuyo a 'admin'
    },
    // El historial es un arreglo (una lista []) que guardará cada cálculo como un objeto interno
    historial: [{
        operacion: { type: String, required: true }, // Ej: "15 + 30"
        resultado: { type: String, required: true }, // Ej: "45"
        fecha: { type: Date, default: Date.now }     // Guarda el día y la hora automáticamente
    }]
});

// Exportamos el modelo para poder meter y sacar usuarios desde el servidor
module.exports = mongoose.model('Usuario', UsuarioSchema);