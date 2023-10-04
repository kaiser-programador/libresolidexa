//const { Number } = require("mongoose");
const {
    indiceTerreno,
    indiceInversiones,
    indiceInmueble,
    indiceGuardados,
    indiceProyecto,
} = require("../modelos/indicemodelo");

const { barra_progreso_card } = require("./ayudaslibreria");
const { numero_punto_coma } = require("./funcionesayuda_3");

const funcionesAyuda_4 = {};

// paquete_inmueble ={codigo_inmueble, codigo_usuario}
funcionesAyuda_4.inmueble_info_cd = async function (paquete_inmueble) {
    try {
        // ------- Para verificación -------
        //console.log("EL PAQUETE DE DATOS QUE LE LLEGA INMUEBLE INFO CD");
        //console.log(paquete_inmueble);

        var codigo_inmueble = paquete_inmueble.codigo_inmueble;
        var codigo_usuario = paquete_inmueble.codigo_usuario; // usuario que navega con su cuenta registrada

        const info_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                codigo_proyecto: 1,
                estado_inmueble: 1,
                valor_reserva: 1,
                precio_construccion: 1,
                precio_competencia: 1,
                inmueble_remate: 1,
                acumulador_penalizaciones: 1,
                penalizacion_inm: 1,
                _id: 0,
            }
        );

        if (info_inmueble) {
            if (info_inmueble.inmueble_remate) {
                // si el inmueble se encuentra en remate por la irresponsabilidad de su actual propietario
                var aux_precio_actual_inm = Number(
                    (
                        info_inmueble.precio_construccion -
                        info_inmueble.acumulador_penalizaciones -
                        info_inmueble.penalizacion_inm
                    ).toFixed(0)
                );
            } else {
                var aux_precio_actual_inm = Number(
                    (
                        info_inmueble.precio_construccion - info_inmueble.acumulador_penalizaciones
                    ).toFixed(0)
                );
            }

            var reserva = numero_punto_coma(info_inmueble.valor_reserva);

            var aux_ahorro = Number(
                (info_inmueble.precio_competencia - aux_precio_actual_inm).toFixed(0)
            );
            var ahorro = numero_punto_coma(aux_ahorro);

            var precio_actual_inm = numero_punto_coma(aux_precio_actual_inm);
            var precio_competencia = numero_punto_coma(info_inmueble.precio_competencia.toFixed(0));

            var porcentaje_datos = {
                tipo_objetivo: "inmueble",
                codigo_objetivo: codigo_inmueble,
            };

            var resultado = await barra_progreso_card(porcentaje_datos);

            //--------------------------------------------------------------
            // para saber si el presente inmueble es guardado del usuario
            if (codigo_usuario == "ninguno") {
                var inmueble_guardado = false;
            } else {
                var registro_inmueble_guardado = await indiceGuardados.findOne(
                    {
                        codigo_inmueble: codigo_inmueble,
                        ci_propietario: codigo_usuario,
                    },
                    {
                        codigo_inmueble: 1,
                        _id: 0,
                    }
                );

                if (registro_inmueble_guardado) {
                    // significa que el inmueble si es guardado por el usuario
                    var inmueble_guardado = true;
                } else {
                    // significa que el inmueble no es guardado por el usuario
                    var inmueble_guardado = false;
                }
            }

            //--------------------------------------------------------------
            // para saber si el presente inmueble es PROPIEDAD del usuario
            if (codigo_usuario == "ninguno") {
                var inmueble_propiedad = false;
            } else {
                var registro_inmueble_propiedad = await indiceInversiones.findOne(
                    {
                        codigo_inmueble: codigo_inmueble,
                        ci_propietario: codigo_usuario,
                    },
                    {
                        codigo_inmueble: 1,
                        _id: 0,
                    }
                );

                if (registro_inmueble_propiedad) {
                    // significa que el inmueble si es propiedad actual del usuario
                    var inmueble_propiedad = true;
                } else {
                    // significa que el inmueble no es propiedad actual del usuario
                    var inmueble_propiedad = false;
                }
            }

            //--------------------------------------------------------------
            // porcentaje de progreso de: recaudacion o pagados o construccion (dependiendo del estado del proyecto)
            // EL PORCENTAJE DE PROGRESO DEL INMUEBLE, SERA EL MISMO QUE EL DEL PROYECTO AL CUAL PERTENECE

            /*
            var paquete_datos = {
                codigo_terreno: info_inmueble.codigo_terreno,
                codigo_proyecto: info_inmueble.codigo_proyecto,
                estado_inmueble: info_inmueble.estado_inmueble,
            };
            var porcentaje_progreso = await progreso_proyecto(paquete_datos);
            */
            var paquete_datos = {
                codigo_terreno: info_inmueble.codigo_terreno,
                estado_inmueble: info_inmueble.estado_inmueble,
            };
            var obj_porcentaje_obra_inm = await progreso_obra_inm(paquete_datos);

            //--------------------------------------------------------------

            var informacion = {
                //porcentaje_progreso,
                porcentaje_obra_inm: obj_porcentaje_obra_inm.porcentaje_obra_inm,
                porcentaje_obra_inm_render: obj_porcentaje_obra_inm.porcentaje_obra_inm_render,
                reserva,
                financiado: resultado.card_financiamiento_render, // como STRING y PUNTO COMO MIL y COMA DECIMAL
                meta: resultado.card_meta_render,
                ahorro,
                num_puro_construccion: info_inmueble.precio_construccion,
                num_puro_ahorro: aux_ahorro, // util para hacer sumatorias donde se necesite

                porcentaje: resultado.card_porcentaje,
                porcentaje_render: resultado.card_porcentaje_render,

                precio_actual_inm,
                num_puro_precio_actual: aux_precio_actual_inm, // util para hacer sumatorias donde se necesite
                precio_competencia,
                inmueble_guardado,
                inmueble_propiedad,
            };

            return informacion;
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// capitales PROYECTO, con informacion de inmuebles existentes, disponibles

funcionesAyuda_4.proyecto_info_cd = async function (codigo_proyecto) {
    try {
        const inmuebles_proyecto = await indiceInmueble.find(
            { codigo_proyecto: codigo_proyecto },
            {
                codigo_inmueble: 1,
                estado_inmueble: 1,
                valor_reserva: 1,
                precio_competencia: 1,
                precio_construccion: 1,
                _id: 0,
            }
        );

        var n_disponibles = 0;
        var total_reserva = 0;
        var total_precio_competencia = 0;
        var total_precio_construccion = 0;

        if (inmuebles_proyecto.length > 0) {
            for (let i = 0; i < inmuebles_proyecto.length; i++) {
                var reserva = inmuebles_proyecto[i].valor_reserva;
                var precio_competencia = inmuebles_proyecto[i].precio_competencia;
                var precio_construccion = inmuebles_proyecto[i].precio_construccion;
                total_reserva = total_reserva + reserva;
                total_precio_competencia = total_precio_competencia + precio_competencia;
                total_precio_construccion = total_precio_construccion + precio_construccion;
                if (inmuebles_proyecto[i].estado_inmueble == "disponible") {
                    n_disponibles = n_disponibles + 1;
                }
            }
        }

        var aux_ahorro = total_precio_competencia - total_precio_construccion;
        var ahorro = numero_punto_coma(aux_ahorro.toFixed(0));

        var porcentaje_datos = {
            tipo_objetivo: "proyecto",
            codigo_objetivo: codigo_proyecto,
        };

        var resultado = await barra_progreso_card(porcentaje_datos);

        var informacion = {
            n_inmuebles: inmuebles_proyecto.length,
            n_disponibles,
            financiado: resultado.card_financiamiento_render, // como string CON PUNTO COMO MIL Y COMA DECIMAL
            financiado_num: resultado.card_financiamiento,
            construccion: total_precio_construccion, // como numerico
            meta: resultado.card_meta_render, // como string
            meta_num: resultado.card_meta,
            ahorro, // como string
            ahorro_num: aux_ahorro,

            porcentaje: resultado.card_porcentaje,
            porcentaje_render: resultado.card_porcentaje_render,
        };

        return informacion;
    } catch (error) {
        console.log(error);
    }
};

/*************************************************************************************/
// PORCENTAJE DE AVANCE DE OBRA DE CONTRUCCION DEL INMUEBLE
async function progreso_obra_inm(paquete_datos) {
    var codigo_terreno = paquete_datos.codigo_terreno;
    var estado_inmueble = paquete_datos.estado_inmueble;

    const info_terreno = await indiceTerreno.findOne(
        { codigo_terreno: codigo_terreno },
        {
            fecha_inicio_construccion: 1,
            fecha_fin_construccion: 1,
            _id: 0,
        }
    );

    // por defecto
    var obj_porcentajes = {
        porcentaje_obra_inm: 0,
        porcentaje_obra_inm_render: "0",
    };
    if (info_terreno) {
        if (estado_inmueble == "completado") {
            obj_porcentajes.porcentaje_obra_inm = 100;
            obj_porcentajes.porcentaje_obra_inm_render = "100";
        } else {
            if (estado_inmueble == "pagos" || estado_inmueble == "remate") {
                let tiempo_duracion_construccion =
                    info_terreno.fecha_fin_construccion - info_terreno.fecha_inicio_construccion; //resultados en milisegundos

                // "new Date()" nos devuelve la fecha actual
                let tiempo_transcurrido = new Date() - info_terreno.fecha_inicio_construccion;

                let aux_porcentaje_obra_inm = (
                    (tiempo_transcurrido / tiempo_duracion_construccion) *
                    100
                ).toFixed(2);
                obj_porcentajes.porcentaje_obra_inm = aux_porcentaje_obra_inm;
                obj_porcentajes.porcentaje_obra_inm_render = numero_punto_coma(aux_porcentaje_obra_inm);
            } else {
                obj_porcentajes.porcentaje_obra_inm = 0;
                obj_porcentajes.porcentaje_obra_inm_render = "0";
            }
        }
    }
    return obj_porcentajes;
}

/*************************************************************************************/

module.exports = funcionesAyuda_4;
