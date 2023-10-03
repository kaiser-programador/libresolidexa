// IMAGENES PROPIOS DEL SISTEMA
// esta BD es importante porque asi no se necesitara revisar en la carpeta contenedora la existencia de las imagenes del sistema
const mongoose = require("mongoose");

const { Schema } = mongoose;

const imagenesSistemaEsquema = new Schema({
    imagen: { type: String, default: "" }, // EJ/  Cabecera convocatoria, Inicio horizontal
    tipo_imagen: { type: String, default: "" }, // EJ/  cabecera_convocatoria, inicio_horizontal, etc
    completo: { type: String, default: "" }, // EJ/ "cabecera_convocatoria.jpg", "inicio_horizontal.jpg"

    url: { type: String, default: "" }, // PARA INDICAR LA URL DONDE ESTARA GUARDADA EL ARCHIVO, por ejemplo en FIREBASE STORAGE
    // AHORA SE ALMACENA LA url DONDE SE ENCUENTRA ALMACENADA LA IMAGEN. EJ/ https://firebasestorage.googleapis.com/v0/b/solidexa-firebase.appspot.com/o/imagenes_sistema%2Fcabecera_construccion.jpg?alt=media&token=ccb9b2b8-9c91-4cf0-ac36-2e012cb0f917
});

module.exports = mongoose.model("imagenesSistemaModelo", imagenesSistemaEsquema);
