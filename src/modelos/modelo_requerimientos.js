// MODELO DE REQUERIMIENTOS DE MATERIALES, SERVICIOS POR PROYECTO. (creado como modelo para que su busqueda sea facil para los usuarios interezados)
// los codigos de los requerimientos seran unicos entre todos los requerimientos que figuren actualmente (sean visibles o no), puede darse el caso que un codigo actual sea igual al codigo de un requerimiento anterior, pero esto requerimientos anteriores no tienen validez pues ya fueron eliminados ya sea porque dejaron de requerirse.

const mongoose = require('mongoose');

const { Schema } = mongoose;

const requerimientosEsquema = new Schema({
    visible: { type: Boolean}, // el false o true lo tomara de acuerdo a lo que figura en la base de datos del proyecto al que pertenece en la parte que dice: "existe_requerimientos". ESTO ES UTIL PARA MOSTAR O NO EN LOS RESULTADOS DE BUSQUEDA
    codigo_terreno: { type: String, default: '' },
    codigo_proyecto: { type: String, default: '' },
    codigo_requerimiento: { type: String, default: '' },
    ciudad: { type: String, default: '' },
    requerimiento: { type: String, default: '' },
    descripcion: { type: String, default: '' },
    cantidad: { type: String, default: '' }, // string, porque puede aceptar valores como: "1" o "n boslas"
    presupuesto_maximo: { type: String, default: '' }, // string, porque puede aceptar valores como: "n Bs." o "m $us"
    fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('requerimientosModelo', requerimientosEsquema)