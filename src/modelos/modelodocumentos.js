// contendra el modelo de informacion que tendran los DOCUMENTOS (pdf) del TERRENO, PROYECTO E INMUEBLE (privados o públicos)

const mongoose = require('mongoose');

const { Schema } = mongoose;

const documentosEsquema = new Schema({

    codigo_terreno: { type: String, default: '' }, // existe si o si, porque es la madre de todos. (para documentos que pertenescan a EMPRESA "Como funciona" aqui sera guardado el codigo de la imagen al que pertenecera este documento que acompañara a esta imagen de "Como funciona", cuyo codigo esta guardado en esta propiedad)
    codigo_proyecto: { type: String, default: '' }, // si no existe sera vacio ""
    codigo_inmueble: { type: String, default: '' }, // si no existe sera vacio ""

    nombre_documento: { type: String, default: '' }, // (para los documentos que pertenescan a "COMO FUNCIONA" aqui se indicara si es documento: pdf || word || excel)
    codigo_documento: { type: String, default: '' },
    // no es necesario especificar la EXTENSION

    // "General", "Garantía", "Económico" (estos 3 son publicos ya sea para inmueble o proyecto) y "Propietario" (privado solo para propietarios) LOS DOCUMENTOS "GENERAL" IRAN EN LA PESTAÑA DE "DESCRIPCION" YA SEA DEL INMUEBLE O PROYECTO CON EL TITULO "DOCUMENTACIÓN"
    clase_documento: { type: String }, // si es un doc que pertenecera a todos los inmuebles, entonces para no repetir y ocupar espacio poniendo a todos el mismo doc, se pondra solo una vez (como general) en la ventana del PROYECTO que engloba a todos los inmuebles
    // para documentos que pertenescan a "COMO FUNCIONA" aqui se guardara el tipo: manual || beneficio || modelo

    ci_propietario: { type: String, default: '' }, // existira SI EL TIPO DE DOCUMENTO ES PRIVADO, caso contrario estara vacio ''

    url: { type: String, default: "" }, // PARA INDICAR LA URL DONDE ESTARA GUARDADA EL ARCHIVO, por ejemplo en FIREBASE STORAGE

});

module.exports = mongoose.model('documentosModelo', documentosEsquema);

