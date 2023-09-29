// contendra el modelo de informacion que tendran las imagenes del PROYECTO

const mongoose = require("mongoose");

const { Schema } = mongoose;

const imagenesTerrenoEsquema = new Schema({
    // IMAGENES PROPIAS DEL SUELO DEL TERRENO QUE SERAN DE CARACTER "PÚBLICO"

    codigo_terreno: { type: String, default: "" }, // codigo del terreno al que pertenece la imagen
    nombre_imagen: { type: String, default: "" },
    codigo_imagen: { type: String, default: "" }, // sin extension
    extension_imagen: { type: String, default: "" }, // ya viene con el punto, ej/  ".jpg" y minuscula

    imagen_principal: { type: Boolean, default: false }, // sera TRUE en caso de que sea la imagen PRINCIPAL DEL TERRENO, y sera FALSE en caso contrario
});

module.exports = mongoose.model("imagenesTerrenoModelo", imagenesTerrenoEsquema);
