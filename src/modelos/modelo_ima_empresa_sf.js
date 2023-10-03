// Base de datos de imagenes que pertenecen a la empresa, parte: COMO FUNCIONA y QUINES SOMOS

const mongoose = require("mongoose");

const { Schema } = mongoose;

const imagenesEmpresaEsquema_sf = new Schema({
    codigo_imagen: { type: String, default: "" }, // sin extension
    extension_imagen: { type: String, default: "" }, // ya viene con el punto, ej/  ".jpg" y minuscula
    tipo_imagen: { type: String, default: "" }, // "funciona" o "somos"
    titulo_imagen: { type: String, default: "" },
    texto_imagen: { type: String, default: "" },
    url_video: { type: String, default: "" }, // url (para: como funciona) que acompañara a la imagen
    video_funciona: { type: Boolean, default: false }, // true: si existe url de video de como funciona
    orden_imagen: { type: Number, default: 0 }, // el orden en que sera mostrado la imagen

    // es true en caso de que pertenesca a REQUERIMIENTOS DE INSUMOS Y/O SERVICIOS
    es_requerimiento: { type: Boolean, default: false }, // util para encontrar el manual y modelo de REQUERIMIENTOS

    url: { type: String, default: "" }, // PARA INDICAR LA URL DONDE ESTARA GUARDADA LA IMAGEN, por ejemplo en FIREBASE STORAGE
});

module.exports = mongoose.model("imagenesEmpresaModelo_sf", imagenesEmpresaEsquema_sf);
