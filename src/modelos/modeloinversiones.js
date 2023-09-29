// MODELO DE PROPIETARIOS QUE PAGARON EN "INMUEBLE"

const mongoose = require("mongoose");

const { Schema } = mongoose;

// codigo_inmueble            <-- unico -->               ci_propietario
// unico                                                   puede comprar varios

const inversionesEsquema = new Schema({
    codigo_terreno: { type: String },
    codigo_proyecto: { type: String },
    codigo_inmueble: { type: String },
    ci_propietario: { type: String },

    // Activo, cuando es el propietario del inmueble. Pasivo, cuando era un propietario del inmueble, pero por irresponsabilidad, ahora deja de ser el dueño de este inmueble (es decir cuando el inmueble pasa a ser de propiedad de otro).
    estado_propietario: { type: String }, // activo   o    pasivo

    //fecha_estado_inv_inm: { type: Date, default: "" }, // con hora

    // los siguientes, en caso de que esta base de datos deje de usarse, seran copiados en la base de datos de inmueble

    // si paga reserva, pero despues incumple en el pago total de su inmueble, entonces ese pago de reserva el irresponsable lo perdera y en la base de datos sera borrado ese pago, aparecera como nuevo, es decir como disponible esperando a un nuevo interesado que desee reservarlo

    tiene_reserva: { type: Boolean },
    pagado_reserva: { type: Number },
    fecha_pagado_reserva: { type: Date },

    tiene_pago: { type: Boolean },
    pagado_pago: { type: Number },
    fecha_pagado_pago: { type: Date },

    //pago_mensual: { type: Number, default: 0 }, // pago que debe pagar mensualmente el nuevo propietario

    //  [ [1, "2023-09-08", 88.77], [ ], [ ]]
    tiene_mensuales: { type: Boolean},
    pagos_mensuales: { type: Array },

    //-----------------------------------------------------------------------------
    // VALORES QUE ESTARAN ACTUALIZADOS SIMPRE, PERO QUE SI SERAN TOMADOS EN CUENTA, CUANDO EL PROPIETARIO LLEGAR A SER IRRESPONSABLE CON ESTE INMUEBLE

    // monto a devolver al propietario por irresponsable, (menos el 15% de penalizacion)
    ///devuelto: { type: Number, default: 0 },
    // el 15% de todo el aporte actual corriente que haya pagado el propietario
    ///penalizacion: { type: Number, default: 0 },
    //-----------------------------------------------------------------------------

    // para el calculo del total recaudado por el inmueble se sumaran: "pagado_reserva, pagado_pago y pagos_mensuales"
});

module.exports = mongoose.model("inversionesModelo", inversionesEsquema);
