// AQUI ESTARA TODO EL HISTORIAL DE LAS ACCIONES REALIZADAS POR LOS ADMINISTRADORES DEL SISTEMA

const mongoose = require("mongoose");

const { Schema } = mongoose;

const historialEsquema = new Schema({
    ci_administrador: { type: String, required: true }, // puede ser administrador simple o jefe
    fecha_accion: { type: Date, default: Date.now },
    accion_historial: String,
});

module.exports = mongoose.model("historialModelo", historialEsquema);
