// contendra el modelo de informacion que tendran las imagenes del PROYECTO

const mongoose = require('mongoose');

const { Schema } = mongoose;

const imagenesProyectoEsquema = new Schema({

    codigo_terreno: { type: String, default: '' }, // codigo del terreno al que pertenece el proyecto
    codigo_proyecto: { type: String, default: '' },
    codigo_imagen: { type: String, default: '' }, // sin extension
    nombre_imagen: { type: String, default: '' },
    extension_imagen: { type: String, default: '' },  // ya viene con el punto, ej/  ".jpg" y minuscula

    // UN IMUEBLE/PROYECTO NO PUEDE TENER A ESTA IMAGEN COMO "PRINCIPAL", "EXCLUSIVA" Y "OTROS" AL MISMO TIEMPO, SOLO LO PUEDE TENER EN UNA DE ESTAS CATEGORIAS

    // inmuebles (incluido el proyecto si fuera el caso) que tienen a esta imagen como UNICA IMAGEN PRINCIPAL es decir que se mostraran en primera vista en los card
    parte_principal: { type: Array, default: [] },

    // inmuebles (incluido el proyecto si fuera el caso) que tienen a esta imagen como IMAGEN EXCLUSIVA
    parte_exclusiva: { type: Array, default: [] },

    imagen_respon_social: { type: Boolean }, // sera "FALSE" en caso de que NO SERA UNA IMAGEN DE RESPONSABILIDAD SOCIAL, "TRUE" EN CASO DE QUE SI LO SEA

    // la parte de "otros" son aquellos que no tienen a esta imagen como "principal" ni como "exclusiva"

    // LAS IMAGENES DE DONACION RESPONSABILIDAD SOCIAL NO TENDRAN DATOS DE "parte_principal" ni "parte_exclusiva"

    url: { type: String, default: "" }, // PARA INDICAR LA URL DONDE ESTARA GUARDADA EL ARCHIVO, por ejemplo en FIREBASE STORAGE

});

module.exports = mongoose.model('imagenesProyectoModelo', imagenesProyectoEsquema);

