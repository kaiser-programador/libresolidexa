// CONTROLADOR RELACIONADO CON EL INVERSIONISTA DESDE EL LADO DEL GESTIONADOR DE LA APLICACION

const {
    //indiceInmueble,
    indiceDocumentos,
    indice_propietario,
    indiceInversiones,
    indiceAdministrador,
    indiceEmpresa,
    indiceImagenesSistema,
} = require("../modelos/indicemodelo");

const {
    //verificadorTerrenoBloqueado,
    inmueble_card_adm_cli,
    //guardarAccionAdministrador,
} = require("../ayudas/funcionesayuda_1");

const {
    cabezeras_adm_cli,
    datos_pagos_propietario,
    segundero_cajas,
    pie_pagina_adm,
} = require("../ayudas/funcionesayuda_2");

const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");

//const { codigoAlfanumericoDocumento } = require("../ayudas/ayudaslibreria");

const moment = require("moment");

// se usa para mover la imagen (la imagen misma) de la carpeta "temporal" a la carpeta "subido"
// tambien se usara su metodo "unlink" para eliminar archivos (como imagenes o pdf)
//const fs = require("fs-extra");

//const pache = require("path");

const controladorPropietario = {};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
controladorPropietario.guardarDatosInversor = async (req, res) => {
    // RUTA:  POST   /laapirest/inversor/guardar_datos_inversor

    try {
        var inversor_ci = req.body.inversor_ci;
        // ------- Para verificación -------
        //console.log("el ci del inversor es: " + inversor_ci);

        var registro_inversor = await indice_propietario.findOne({ ci_propietario: inversor_ci });
        if (registro_inversor) {
            registro_inversor.nombres_inversionista = req.body.inversor_nombres;
            registro_inversor.apellidos_inversionista = req.body.inversor_apellidos;
            registro_inversor.departamento_inversionista = req.body.inversor_departamento;
            registro_inversor.provincia_inversionista = req.body.inversor_provincia;
            registro_inversor.domicilio_inversionista = req.body.inversor_domicilio;
            registro_inversor.ocupacion_inversionista = req.body.inversor_ocupacion;
            registro_inversor.fecha_nacimiento_propietario = req.body.inversor_nacimiento;
            registro_inversor.telefonos_inversionista = req.body.inversor_telefonos;

            await registro_inversor.save();
            res.json({
                mensaje: "exito",
            });
        } else {
            res.json({
                mensaje: "fracaso",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// PARA RENDERIZAR LA VENTANA DEL ADMINISTRADOR segun la pestaña que sea elegida

// RUTA   "get"  "/laapirest/propietario/:ci_propietario/:ventana_propietario"
controladorPropietario.renderizarVentanaPropietario = async (req, res) => {
    try {
        var codigo_propietario = req.params.ci_propietario; // extraido de la SESION guardada del administrador
        var tipo_ventana_propietario = req.params.ventana_propietario;

        var info_propietario = {};
        info_propietario.cab_prop_adm = true;
        info_propietario.codigo_propietario = codigo_propietario;

        var aux_cabezera = {
            codigo_objetivo: codigo_propietario,
            tipo: "propietario",
            lado: "propietario",
        };

        //info_propietario.estilo_cabezera = "cabezera_estilo_propietario";

        //----------------------------------------------------
        // para la url de la cabezera
        var url_cabezera = ""; // vacio por defecto
        const registro_cabezera = await indiceImagenesSistema.findOne(
            { tipo_imagen: "cabecera_propietario" },
            {
                url: 1,
                _id: 0,
            }
        );

        if (registro_cabezera) {
            url_cabezera = registro_cabezera.url;
        }

        info_propietario.url_cabezera = url_cabezera;

        //----------------------------------------------------

        var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
        info_propietario.cabezera_adm = cabezera_adm;

        var pie_pagina = await pie_pagina_adm();
        info_propietario.pie_pagina_adm = pie_pagina;

        info_propietario.es_propietario = true; // para menu navegacion comprimido

        if (tipo_ventana_propietario == "datos") {
            var contenido_propietario = await datos_propietario(codigo_propietario);
            info_propietario.datos_propietario = true; // para pestaña y ventana apropiada para proyecto
            info_propietario.contenido_propietario = contenido_propietario;
            // ------- Para verificación -------

            //console.log("los datos para renderizar DATOS DEL PROPIETARIO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }

        if (tipo_ventana_propietario == "resumen") {
            info_propietario.info_segundero = true;
            var contenido_propietario = await resumen_propietario(codigo_propietario);
            info_propietario.resumen_propietario = true; // para pestaña y ventana apropiada para proyecto
            info_propietario.informacion = contenido_propietario;
            // ------- Para verificación -------

            //console.log("los datos para renderizar la DESCRIPCION DEL PROYECTO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }

        if (tipo_ventana_propietario == "propiedades") {
            let contenido_propietario = await propiedades_propietario(codigo_propietario);
            info_propietario.propiedades_propietario = true; // para pestaña y ventana apropiada para proyecto

            //--------------------------------------------------------------
            // para mostrar los estados en filtro ordenador
            info_propietario.estado_py_todos = true;
            info_propietario.estado_py_reserva = true;
            info_propietario.estado_py_aprobacion = true;
            info_propietario.estado_py_pago = true;
            info_propietario.estado_py_construccion = true;
            info_propietario.estado_py_construido = true;
            info_propietario.estado_rematado = true;

            //--------------------------------------------------------------
            // para contar el numero de inmuebles, segun el estado que posean
            let aux_n_todos = contenido_propietario.length;
            let aux_n_disponible = 0;
            let aux_n_reservado = 0;
            let aux_n_pendiente_aprobacion = 0;
            let aux_n_pendiente_pago = 0;
            let aux_n_pagado_pago = 0;
            let aux_n_en_pago = 0;
            let aux_n_remate = 0;
            let aux_n_rematado = 0;
            let aux_n_completado = 0;

            // guardado, disponible, reservado, pendiente, pagado, pagos, remate, completado
            if (contenido_propietario.length > 0) {
                for (let i = 0; i < contenido_propietario.length; i++) {
                    let aux_estado_inmueble = contenido_propietario[i].estado_inmueble;
                    let aux_estado_propietario = contenido_propietario[i].estado_propietario;

                    if (aux_estado_propietario == "pasivo") {
                        aux_n_rematado = aux_n_rematado + 1;
                    } else {
                        // aquellos que son "activos"
                        if (aux_estado_inmueble == "disponible") {
                            aux_n_disponible = aux_n_disponible + 1;
                        }
                        if (aux_estado_inmueble == "reservado") {
                            aux_n_reservado = aux_n_reservado + 1;
                        }
                        if (aux_estado_inmueble == "pendiente_aprobacion") {
                            aux_n_pendiente_aprobacion = aux_n_pendiente_aprobacion + 1;
                        }
                        if (aux_estado_inmueble == "pendiente_pago") {
                            aux_n_pendiente_pago = aux_n_pendiente_pago + 1;
                        }
                        if (aux_estado_inmueble == "pagado_pago") {
                            aux_n_pagado_pago = aux_n_pagado_pago + 1;
                        }
                        if (aux_estado_inmueble == "pagos") {
                            aux_n_en_pago = aux_n_en_pago + 1;
                        }
                        if (aux_estado_inmueble == "remate") {
                            aux_n_remate = aux_n_remate + 1;
                        }
                        if (aux_estado_inmueble == "completado") {
                            aux_n_completado = aux_n_completado + 1;
                        }
                    }
                }
            }

            //-----------------------------------------------
            // despues de pasar por todos los conteos de inmuebles

            if (aux_n_todos > 0) {
                info_propietario.badge_todos = true;
            } else {
                info_propietario.badge_todos = false;
            }

            if (aux_n_disponible > 0) {
                info_propietario.badge_disponible = true;
            } else {
                info_propietario.badge_disponible = false;
            }

            if (aux_n_reservado > 0) {
                info_propietario.badge_reservado = true;
            } else {
                info_propietario.badge_reservado = false;
            }

            if (aux_n_pendiente_aprobacion > 0) {
                info_propietario.badge_pendiente_aprobacion = true;
            } else {
                info_propietario.badge_pendiente_aprobacion = false;
            }

            if (aux_n_pendiente_pago > 0) {
                info_propietario.badge_pendiente_pago = true;
            } else {
                info_propietario.badge_pendiente_pago = false;
            }

            if (aux_n_pagado_pago > 0) {
                info_propietario.badge_pagado_pago = true;
            } else {
                info_propietario.badge_pagado_pago = false;
            }

            if (aux_n_en_pago > 0) {
                info_propietario.badge_en_pago = true;
            } else {
                info_propietario.badge_en_pago = false;
            }

            if (aux_n_remate > 0) {
                info_propietario.badge_remate = true;
            } else {
                info_propietario.badge_remate = false;
            }

            if (aux_n_rematado > 0) {
                info_propietario.badge_rematado = true;
            } else {
                info_propietario.badge_rematado = false;
            }

            if (aux_n_completado > 0) {
                info_propietario.badge_completado = true;
            } else {
                info_propietario.badge_completado = false;
            }

            //-----------------------------------------------
            info_propietario.n_todos = aux_n_todos;
            info_propietario.n_disponible = aux_n_disponible;
            info_propietario.n_reservado = aux_n_reservado;
            info_propietario.n_pendiente_aprobacion = aux_n_pendiente_aprobacion;
            info_propietario.n_pendiente_pago = aux_n_pendiente_pago;
            info_propietario.n_pagado_pago = aux_n_pagado_pago;
            info_propietario.n_en_pago = aux_n_en_pago;
            info_propietario.n_remate = aux_n_remate;
            info_propietario.n_rematado = aux_n_rematado;
            info_propietario.n_completado = aux_n_completado;

            //--------------------------------------------------------------
            info_propietario.contenido_propietario = contenido_propietario;
            // ------- Para verificación -------

            //console.log("los datos para renderizar PROPIETARIO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }

        if (tipo_ventana_propietario == "documentos") {
            var contenido_propietario = await documentos_propietario(codigo_propietario);
            info_propietario.documentos_propietario = true; // para pestaña y ventana apropiada para proyecto
            info_propietario.contenido_propietario = contenido_propietario;
            // ------- Para verificación -------

            //console.log("los datos para renderizar PROPIETARIO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }

        if (tipo_ventana_propietario == "eliminar") {
            info_propietario.eliminar_propietario = true; // para pestaña y ventana apropiada para proyecto
            // ------- Para verificación -------

            //console.log("los datos para renderizar PROPIETARIO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------
async function datos_propietario(codigo_propietario) {
    try {
        var paquete_propietario = {
            ci_propietario: codigo_propietario,
            codigo_inmueble: "ninguno", // porque solo nos intereza los datos del propietario, de manera que poniendo "ninguno" no existe ningun inmueble que tenga ese codigo, asi esos datos financieros el programa los dejara vacios
        };

        var aux_respuesta = await datos_pagos_propietario(paquete_propietario);

        if (aux_respuesta) {
            return aux_respuesta;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function propiedades_propietario(codigo_propietario) {
    try {
        // ordenamos por numero de piso (de menor a mayor, por ello se escribio "1")
        // Al parecer si el dato "piso" estubiera dentro de un objero EJ/ "descripcion_inmueble", tambien funcionaria como se lo declara aqui
        var inm_propietario = await indiceInversiones.find(
            { ci_propietario: codigo_propietario },
            {
                codigo_inmueble: 1,
                estado_propietario: 1,
                _id: 0,
            }
        );

        if (inm_propietario.length > 0) {
            var contenido_inm_prop = [];
            for (let i = 0; i < inm_propietario.length; i++) {
                // paquete_inmueble = {codigo_inmueble,codigo_usuario}
                var paquete_inmueble_i = {
                    codigo_inmueble: inm_propietario[i].codigo_inmueble,
                    codigo_usuario: "ninguno", // porque es desde el lado del ADMINISTRADOR
                    laapirest: "/laapirest/", // por partir desde el lado del ADMINISTRADOR
                };
                contenido_inm_prop[i] = await inmueble_card_adm_cli(paquete_inmueble_i);
                contenido_inm_prop[i].card_externo = true; // para que muestre info de card EXTERIONES
                contenido_inm_prop[i].estado_propietario = inm_propietario[i].estado_propietario;
            }
            return contenido_inm_prop;
        } else {
            var contenido_inm_prop = [];
            return contenido_inm_prop;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function resumen_propietario(codigo_propietario) {
    try {
        //-------------------------------------------------------------------------------

        var inm_propietario = await indiceInversiones.find(
            { ci_propietario: codigo_propietario },
            {
                codigo_proyecto: 1,
                codigo_inmueble: 1,
                estado_propietario: 1,

                tiene_reserva: 1,
                pagado_reserva: 1,
                fecha_pagado_reserva: 1,

                // tiene_pago: 1,
                // pagado_pago: 1,
                // fecha_pagado_pago: 1,

                // tiene_mensuales: 1,
                // pagos_mensuales: 1,

                _id: 0,
            }
        );

        // Para tabla resumen de inversiones y cajas resumen

        if (inm_propietario.length > 0) {
            // conversion del documento MONGO ([array]) a "string"
            var aux_string = JSON.stringify(inm_propietario);
            // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
            var historial_inversiones = JSON.parse(aux_string);

            for (let i = 0; i < inm_propietario.length; i++) {
                historial_inversiones[i].numero_fila = i + 1; // agregamos al objeto
                historial_inversiones[i].laapirest = "/laapirest/"; // por partir desde el lado del ADMINISTRADOR

                // la fecha en la que uno hace el pago inicial para adquirir el inmueble es: en reserva o en pago (remate), por tanto solo las fechas de estos estados seran considerados.
                moment.locale("es");
                if (historial_inversiones[i].tiene_reserva) {
                    var fecha_estado = historial_inversiones[i].fecha_pagado_reserva;
                } else {
                    if (historial_inversiones[i].tiene_pago) {
                        var fecha_estado = historial_inversiones[i].fecha_pagado_pago;
                    }
                }

                if (historial_inversiones[i].tiene_reserva || historial_inversiones[i].tiene_pago) {
                    //var fecha_estado_inversion = moment(fecha_estado).format("LL");
                    // Usamos "utc" para que una fecha ej/ 2023-09-02T00:00:00.000Z se muestre "2023-09-02T00:00:00.000Z" y no un dia menos.
                    // el "utc" es util para fechas que son guardadas desde inputs que admiten: dia, mes, año (sin horas). Pero para fechas guardadas como: 2023-08-18T20:50:22.055Z el uso del "utc" no es necesario usarlo.
                    var fecha_estado_inversion = moment.utc(fecha_estado).format("LL");
                    historial_inversiones[i].fecha_estado_inversion = fecha_estado_inversion;
                }

                var paquete_inmueble_i = {
                    codigo_inmueble: historial_inversiones[i].codigo_inmueble,
                    codigo_usuario: "ninguno", // porque es desde el lado del ADMINISTRADOR
                    laapirest: "/laapirest/", // por partir desde el lado del ADMINISTRADOR
                };

                // OJO***
                var aux_inm_prop_i = await inmueble_card_adm_cli(paquete_inmueble_i);

                // agregando nuevas propiedades
                historial_inversiones[i].nombre_proyecto = aux_inm_prop_i.nombre_proyecto;
                historial_inversiones[i].porcentaje = aux_inm_prop_i.porcentaje;
                historial_inversiones[i].porcentaje_obra_inm = aux_inm_prop_i.porcentaje_obra_inm;
                historial_inversiones[i].porcentaje_obra_inm_render =
                    aux_inm_prop_i.porcentaje_obra_inm_render;
                historial_inversiones[i].precio_actual_inm = aux_inm_prop_i.precio_actual_inm;
                historial_inversiones[i].ahorro = aux_inm_prop_i.ahorro;
                historial_inversiones[i].estado_inmueble = aux_inm_prop_i.leyenda_precio_inm;

                // corrigiendo estado del inmueble
                if (historial_inversiones[i].estado_propietario == "pasivo") {
                    historial_inversiones[i].estado_inmueble = "rematado";
                }

                /*
                // para caja resumen
                if (historial_inversiones[i].estado_propietario == "activo") {
                    aux_valor_total =
                        aux_valor_total +
                        aux_inm_prop_i.num_puro_ahorro +
                        aux_inm_prop_i.num_puro_precio_actual;

                    precio_actual = precio_actual + aux_inm_prop_i.num_puro_precio_actual;
                    aux_plusvalia = aux_plusvalia + aux_inm_prop_i.num_puro_ahorro;
                }
                */
            } // for

            /*
            // despues de sumar todos valores de plusvalia, contruccion y valor total
            // convertimos a numeros con separadores de punto, coma
            val_cajas.valor_total = numero_punto_coma(aux_valor_total);
            val_cajas.precio = numero_punto_coma(precio_actual);
            val_cajas.plusvalia = numero_punto_coma(aux_plusvalia);
            */
        } else {
            var historial_inversiones = [];
        }

        //-------------------------------------------------------------------------------
        // PARA LA CAJA DE SEGUNDERO

        var datos_segundero = {
            codigo_objetivo: codigo_propietario,
            ci_propietario: codigo_propietario,
            tipo_objetivo: "propietario",
        };

        // OJO*** PORQUE "segundero_cajas" tambien utiliza "inmueble_card_adm_cli" y estan ambas en esta misma funcion
        var aux_segundero_cajas = await segundero_cajas(datos_segundero);

        var aux_cajas = {
            //-------------------------------------------------
            // para PLUSVALIA

            // despues de sumar todos valores de plusvalia, contruccion y valor total
            // convertimos a numeros con separadores de punto, coma
            valor_total: numero_punto_coma(aux_segundero_cajas.total),
            precio: numero_punto_coma(aux_segundero_cajas.precio),
            plusvalia: numero_punto_coma(aux_segundero_cajas.ahorro),
            //plusvalia_construida: aux_segundero_cajas.ahorro, // en tipo "numerico puro"
            //-------------------------------------------------
            // para RECOMPENSA
            recompensa: numero_punto_coma(aux_segundero_cajas.recompensa),
            meses: numero_punto_coma(aux_segundero_cajas.meses),

            //-------------------------------------------------
        };

        var total_resumen_propietario = {
            historial_inversiones,
            val_cajas: aux_cajas,
            val_segundero_cajas: aux_segundero_cajas,
        };

        //-------------------------------------------------------------------------------
        // PARA LA SIGNIFICADO DE SEGUNDERO

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                texto_segundero_prop: 1,
                texto_segundero_prop_iz: 1,
                texto_segundero_prop_recom_iz: 1,
                texto_segundero_prop_recom_de: 1,
                _id: 0,
            }
        );

        if (registro_empresa.texto_segundero_prop != undefined) {
            if (
                registro_empresa.texto_segundero_prop.indexOf("/sus_precio/") != -1 &&
                registro_empresa.texto_segundero_prop.indexOf("/sus_total/") != -1 &&
                registro_empresa.texto_segundero_prop.indexOf("/sus_plusvalia/") != -1
            ) {
                var significado_aux_0 = registro_empresa.texto_segundero_prop;
                var significado_aux_1 = significado_aux_0.replace("/sus_precio/", aux_cajas.precio);
                var significado_aux_2 = significado_aux_1.replace(
                    "/sus_total/",
                    aux_cajas.valor_total
                );
                var significado_aux = significado_aux_2.replace(
                    "/sus_plusvalia/",
                    aux_cajas.plusvalia
                );
            } else {
                var significado_aux = "Significado";
            }
        } else {
            var significado_aux = "Significado";
        }

        // agregando al objeto "total_resumen_propietario"
        total_resumen_propietario.significado_segundero = significado_aux;

        //---------------------------------------------------------------
        // para mensaje debajo de segundero lado IZQUIERDO

        var mensaje_segundero_pro = "Mensaje segundero propietario"; // texto por defecto
        var reg_nombre_prop = await indice_propietario.findOne(
            { ci_propietario: codigo_propietario },
            {
                nombres_propietario: 1,
                _id: 0,
            }
        );

        if (reg_nombre_prop) {
            if (registro_empresa.texto_segundero_prop_iz != undefined) {
                if (registro_empresa.texto_segundero_prop_iz.indexOf("/nom_propietario/") != -1) {
                    var significado_aux_0 = registro_empresa.texto_segundero_prop_iz;
                    var mensaje_segundero_pro = significado_aux_0.replace(
                        "/nom_propietario/",
                        reg_nombre_prop.nombres_propietario
                    );
                }
            }
        }

        total_resumen_propietario.mensaje_segundero = mensaje_segundero_pro;
        //-------------------------------------------------------------------------------
        // para mensaje debajo de segundero RECOMPENSA lado IZQUIERDO

        var significado_re_iz_aux = "Mensaje segundero RECOMPENSA propietario"; // texto por defecto

        if (reg_nombre_prop) {
            if (registro_empresa.texto_segundero_prop_recom_iz != undefined) {
                if (registro_empresa.texto_segundero_prop_recom_iz.indexOf("/nom_propietario/") != -1) {
                    var significado_aux_0 = registro_empresa.texto_segundero_prop_recom_iz;
                    var significado_re_iz_aux = significado_aux_0.replace(
                        "/nom_propietario/",
                        reg_nombre_prop.nombres_propietario
                    );
                }
            }
        }

        total_resumen_propietario.texto_segundero_recom_iz = significado_re_iz_aux;

        //---------------------------------------------------------------
        // para mensaje debajo de segundero RECOMPENSA lado DERECHO

        if (registro_empresa.texto_segundero_prop_recom_de != undefined) {
            if (
                registro_empresa.texto_segundero_prop_recom_de.indexOf("/n_meses/") != -1 &&
                registro_empresa.texto_segundero_prop_recom_de.indexOf("/bs_espera/") != -1
            ) {
                var significado_re_aux_0 = registro_empresa.texto_segundero_prop_recom_de;
                var significado_re_aux_1 = significado_re_aux_0.replace("/n_meses/", aux_cajas.meses);
                var significado_re_de_aux = significado_re_aux_1.replace(
                    "/bs_espera/",
                    aux_cajas.recompensa
                );
            } else {
                var significado_re_de_aux = "Significado";
            }
        } else {
            var significado_re_de_aux = "Significado";
        }

        // agregando al objeto "total_resumen_propietario"
        total_resumen_propietario.texto_segundero_recom_de = significado_re_de_aux;

        //---------------------------------------------------------------

        return total_resumen_propietario;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function documentos_propietario(codigo_propietario) {
    try {
        // DOCUMENTOS PRIVADOS DEL PROPIETARIO
        var documentos_privados = [];
        var registro_documentos_priv = await indiceDocumentos.find({
            ci_propietario: codigo_propietario,
            clase_documento: "Propietario",
        });

        if (registro_documentos_priv.length > 0) {
            for (let p = 0; p < registro_documentos_priv.length; p++) {
                documentos_privados[p] = {
                    codigo_inmueble: registro_documentos_priv[p].codigo_inmueble,
                    nombre_documento: registro_documentos_priv[p].nombre_documento,
                    codigo_documento: registro_documentos_priv[p].codigo_documento,
                };
            }
        }

        //en caso de que no existiesen documentos privados, entonces se guardara como un ARRAY vacio
        return documentos_privados;
    } catch (error) {
        console.log(error);
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// de los da el administrador a aquellos propietarios que requieran sus re-claves cuando los propietarios olvidan sus claves de acceso
controladorPropietario.nuevasClavesInversor = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/inversor/nuevas_claves'
    try {
        // ------- Para verificación -------
        //console.log("los datos del body para re-claves del inversor");
        //console.log(req.body);

        var usuario_maestro = req.body.usuario_maestro;
        var clave_maestro = req.body.clave_maestro;
        var ci_inversionista = req.body.ci_inversionista;

        var registro_maestro = await indiceAdministrador.findOne({
            ad_usuario: usuario_maestro,
        });

        if (registro_maestro) {
            // revision de contraseña
            const respuesta = await registro_maestro.compararContrasena(clave_maestro); // nos devuelve TRUE o FALSE

            if (respuesta) {
                // los nuevos codigos de acceso seran: fecha nacimiento y c.i. inversor
                var registro_inversor = await indice_propietario.findOne({
                    ci_propietario: ci_inversionista,
                });

                if (registro_inversor) {
                    let usuario = registro_inversor.ci_propietario;

                    let auxFechaNacimiento = registro_inversor.fecha_nacimiento_propietario;
                    // en mongo esta guardado en este formato:
                    // 2010-10-10T00:00:00.000Z
                    let fechaLocal = auxFechaNacimiento.toISOString();
                    // con "toISOString()" lo convertimos en cadena
                    // "2010-10-10T00:00:00.000Z"
                    let arrayFecha_1 = fechaLocal.split("T");
                    let fechaPinta = arrayFecha_1[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"

                    let arrayFecha_2 = fechaPinta.split("-");
                    let year = arrayFecha_2[0];
                    let mes = arrayFecha_2[1];
                    let dia = arrayFecha_2[2];
                    let clave = dia + mes + year; // concatenamos

                    // ------- Para verificación -------
                    //console.log("vemos la contraseña diaMesAño ej/ 05011988");
                    //console.log(clave);

                    registro_inversor.usuario_propietario = usuario;
                    // antes encriptarlo para ser guardado
                    registro_inversor.clave_propietario =
                        await registro_inversor.encriptarContrasena(clave);
                    await registro_inversor.save();
                    //registro_inversor.save();

                    // ------- Para verificación -------
                    //console.log("los nuevos reclaves del propietario es:");
                    //console.log(usuario + "  " + clave);

                    res.json({
                        mensaje: "exito",
                        usuario,
                        clave,
                    });
                } else {
                    res.json({
                        mensaje: "ci denegado",
                    });
                }
            } else {
                res.json({
                    mensaje: "maestro denegado",
                });
            }
        } else {
            res.json({
                mensaje: "maestro denegado",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorPropietario;
