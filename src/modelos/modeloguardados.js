// MODELO DE INMUEBLES QUE ESTAN GUARDADOS POR LOS USUARIOS (no necesariamente deben ser inversores en estos inmuebles)

const mongoose = require('mongoose');

const { Schema } = mongoose;

// codigo_inmueble            <-- par unico -->               ci_propietario
// unico o varios                                           guarda uno o varios

const guardadosEsquema = new Schema({
    codigo_terreno: { type: String, default: '' },
    codigo_proyecto: { type: String, default: '' },
    codigo_inmueble: { type: String, default: '' },
    ci_propietario: { type: String, default: '' },
    fecha_guardado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('guardadosModelo', guardadosEsquema)