// MODELO DE PROPIETARIOS ABSOLUTOS, QUE SON LOS DUEÑOS DE LA TOTALIDAD DEL "INMUEBLE" (por tanto aqui no se encuentran registrados los inmuebles que pertenecen a COPROPIETARIOS)

const mongoose = require("mongoose");

const { Schema } = mongoose;

// codigo_inmueble            <-- unico -->               ci_propietario

// un inmueble puede tener diferentes propietarios pasivos, pero solo uno activo
// un ci_propietario puede ser propietario de diferentes inmuebles

const inversionesEsquema = new Schema({
    codigo_terreno: { type: String },
    codigo_proyecto: { type: String },
    codigo_inmueble: { type: String },
    ci_propietario: { type: String },

    // Activo, cuando es el propietario del inmueble. Pasivo, cuando era un propietario del inmueble, pero por irresponsabilidad, ahora deja de ser el dueño de este inmueble (es decir cuando el inmueble pasa a ser de propiedad de otro).
    estado_propietario: { type: String }, // activo   o    pasivo

    //-------------------------------------------------------
    // MEJOR: cuando el propietario adquiere el inmueble ya sea por reservacion o remate
    pago_primer_bs: { type: Number },
    fecha: { type: Date, default: Date.now },
    pago_tipo: { type: String }, // "reserva" o "remate" (manera en que lo adquiere pagando en etapa de reservacion  o cuando el inmueble se encuentra en remate.)
    //-------------------------------------------------------

    // LAS CUOTAS MENSUALES DE CONTRUCCION QUE EL
    //  [ [1, "2023-09-08", 88.77], [ ], [ ]]
    pagos_mensuales: { type: Array, default: [] },
    //  [ [1, "2023-09-08", 88.77, Bs], [ ], [ ] ]

    /*
    MEJOR NUEVO
    Cada elemento del array "pagos_mensuales" tendra contenido el siguiente objeto:
    {
        fecha: "2023-09-08"...., // string
        pago_bs: #, // numero entero sin decimales
    }
    */

    //-----------------------------------------------------------------------------

    // util para ordenacion, si un inmueble paso por varios propietarios absolutos, entonces esta fecha permitira ordenarlos del mas antiguo al mas reciente.
    fecha_creacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("inversionesModelo", inversionesEsquema);
