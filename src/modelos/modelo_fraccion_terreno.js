/*
CREADOS EN LA ETAPA DE TERRENO DE: CONVOCATORIA

inversionista  <----->   n fracciones mismo terreno
inversionista  <----->   n fracciones diferentes terrenos

El terreno (lado administrador y cliente) tendra una pestaña llamada "Fracciones".
en el lado del administrador para la creacion automatica por primera vez de las fracciones, se crearan en base al precio de fraccion y numero de fracciones (asi se evitara el trabajo de crear una por una)
*/

const mongoose = require("mongoose");

const { Schema } = mongoose;

const fraccionTerrenoEsquema = new Schema({

    codigo_fraccion: { type: String },
    
    codigo_terreno: { type: String },

    fraccion_bs: { type: Number }, // precio unitario de la fraccion del terreno en bs

    orden: { type: Number }, // util para la ordenacion inicial para la venta de fracciones

    disponible: { type: Boolean, default: true }, // "true" cuando la fraccion esta disponible para ser adquirido por un inversionista, "false" cuando ya tiene un inversionista que lo adquirio

    //----------------------------------------------------------
    // cuando disponible: false, significa que deberan estar llenos los siguientes datos:
    ci_propietario: { type: String },
    // cuando un propietario de la fraccion por alguna circunstancia deja de serlo, solamente seran cambiados: ci_propietario y fecha_compra

    fecha_compra: { type: Date }, // fecha en que el inversionista compra la fraccion del terreno, en base a este dato sera la ordenacion de las fracciones del mas antiguo al mas reciente
    //----------------------------------------------------------

});

module.exports = mongoose.model("fraccionTerrenoModelo", fraccionTerrenoEsquema);
