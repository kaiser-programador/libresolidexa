const { indiceProyecto, indiceInmueble, indiceTerreno } = require("../modelos/indicemodelo");

const moment = require("moment");

const funcionesAyuda_3 = {};

/************************************************************************************ */

//funcionesAyuda_3.numero_punto_coma = async function (numero) {
// NOTESE QUE EST FUNCION NO USA EL "ASYNC", POR TANTO AL DECLARAR ESTA FUNCION DESDE OTRO SITIO, NO SERA NECESARIO PONER POR DELANTE EL "AWAIT"
funcionesAyuda_3.numero_punto_coma = function (numero) {
    // como ejemplo:
    // 2275730.88; // tipo numerico
    // sera convetido a string ingles: 2,275,730.88
    // finalmente sera convertido a string español: 2.275.730,88

    // convertimos a numerico por seguridad
    var el_numero = Number(numero);
    if (el_numero > 0) {
        var aux_num_string = el_numero.toLocaleString("en"); // LO DEVUELVE EN FORMATO INGLES Y EN STRING

        // dividimos el string numero en ","
        var array_1 = aux_num_string.split(",");
        // unimos el array con "*" en el lugar de las ","
        var numero_string_2 = array_1.join("*");

        // dividimos el string numero en "."
        var array_2 = numero_string_2.split(".");
        // unimos el array con "," en el lugar de las "."
        var numero_string_3 = array_2.join(",");

        // dividimos el string numero en "*"
        var array_3 = numero_string_3.split("*");
        // unimos el array con "." en el lugar de las "*"
        var numero_string_4 = array_3.join(".");

        var numero_convertido = numero_string_4; // NUMERO CONVERTIDO A FORMATO ESPAÑOL, Y EN STRING

        return numero_convertido; // DEVUELVE COMO STRING
    } else {
        return 0;
    }
};

/*************************************************************************************/
// Para devolver la LEYENDA DE TIEMPO (Finalizado || Finaliza) y EL TIEMPO TRANSCURRIDO (hace x dias || en x dias)
// funcionesAyuda_3.funcion_tiempo_estado = async function (datos_tiempo) {
funcionesAyuda_3.funcion_tiempo_estado = function (datos_tiempo) {
    // la "datos_tiempo.fecha" viene en estado formato MONGO
    moment.locale("es");

    if (datos_tiempo.estado == "guardado" || datos_tiempo.estado == "construido") {
        var factor_tiempo_tiempo = moment(datos_tiempo.fecha).startOf("minute").fromNow(); // hace x dias
    } else {
        var factor_tiempo_tiempo = moment(datos_tiempo.fecha).endOf("minute").fromNow(); // en x dias
    }

    if (datos_tiempo.estado == "construido") {
        var factor_tiempo_titulo = "Finalizado";
        var factor_tiempo_porcentaje = 100;
    } else {
        if (datos_tiempo.estado == "guardado") {
            var factor_tiempo_titulo = "Guardado";
            var factor_tiempo_porcentaje = 0;
        } else {
            var factor_tiempo_titulo = "Finaliza";

            var tiempo_duracion = datos_tiempo.fecha_fin - datos_tiempo.fecha_inicio; //resultados en milisegundos
            var tiempo_transcurrido = new Date() - datos_tiempo.fecha_inicio;

            var factor_tiempo_porcentaje = ((tiempo_transcurrido / tiempo_duracion) * 100).toFixed(2);
        }
    }

    var resultado_tiempo = {
        factor_tiempo_tiempo,
        factor_tiempo_titulo,
        factor_tiempo_porcentaje,
    };

    return resultado_tiempo;
};

/*************************************************************************************/
//IMPORTANTE: PARA NO PERMITIR EL ACCESO A:TERRENOS, PROYECTOS O INMUEBLES INEXISTENTES O QUE NO ESTAN DISPONIBLES PARA SER VISIBLES POR EL USUARIO. USADO POR EL LADO DEL CLIENTE.
funcionesAyuda_3.verificarTePyInm = async function (paqueteria_datos) {
    try {
        var codigo_objetivo = paqueteria_datos.codigo_objetivo;
        var tipo = paqueteria_datos.tipo;

        var la_verificacion = false; // sera por defecto, pero sera corregida a true si cumple con las condiciones de verificacion

        if (tipo == "terreno") {
            var terrenoExiste = await indiceTerreno.findOne(
                { codigo_terreno: codigo_objetivo },
                {
                    estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                    _id: 0,
                }
            );

            if (terrenoExiste) {
                if (terrenoExiste.estado_terreno != "guardado") {
                    la_verificacion = true;
                }
            }
        }

        //---------------------------------------------------------------------

        if (tipo == "proyecto") {
            var proyectoExiste = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_objetivo },
                {
                    visible: 1, // true o false
                    estado_proyecto: 1, // guardado o completado
                    codigo_terreno: 1,
                    _id: 0,
                }
            );
            if (proyectoExiste) {
                var terrenoExiste = await indiceTerreno.findOne(
                    { codigo_terreno: proyectoExiste.codigo_terreno },
                    {
                        estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                        _id: 0,
                    }
                );

                if (terrenoExiste) {
                    if (
                        proyectoExiste.visible == true &&
                        proyectoExiste.estado_proyecto == "completado" &&
                        terrenoExiste.estado_terreno != "guardado"
                    ) {
                        la_verificacion = true;
                    }
                }
            }
        }

        //---------------------------------------------------------------------

        if (tipo == "inmueble") {
            var inmuebleExiste = await indiceInmueble.findOne(
                { codigo_inmueble: codigo_objetivo },
                {
                    codigo_proyecto: 1,

                    // guardado, disponible, reservado, pendiente_pago, pagado_pago, pendiente_aprobacion, pagos (construccion), remate, completado (construido)
                    estado_inmueble: 1,
                    _id: 0,
                }
            );

            if (inmuebleExiste) {
                var proyectoExiste = await indiceProyecto.findOne(
                    { codigo_proyecto: inmuebleExiste.codigo_proyecto },
                    {
                        visible: 1, // true o false
                        estado_proyecto: 1, // guardado o completado
                        codigo_terreno: 1,
                        _id: 0,
                    }
                );
                if (proyectoExiste) {
                    var terrenoExiste = await indiceTerreno.findOne(
                        { codigo_terreno: proyectoExiste.codigo_terreno },
                        {
                            estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                            _id: 0,
                        }
                    );

                    if (terrenoExiste) {
                        if (
                            inmuebleExiste.estado_inmueble != "guardado" &&
                            proyectoExiste.visible == true &&
                            proyectoExiste.estado_proyecto == "completado" &&
                            terrenoExiste.estado_terreno != "guardado"
                        ) {
                            la_verificacion = true;
                        }
                    }
                }
            }
        }

        //---------------------------------------------------------------------

        return la_verificacion; // true o false
    } catch (error) {
        console.log(error);
    }
};
/*************************************************************************************/

module.exports = funcionesAyuda_3;
