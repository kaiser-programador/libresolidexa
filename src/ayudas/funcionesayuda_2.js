/** SE ENCARGARA DE CONSTRUIR LOS DATOS NECESARIOS EN EL ORDEN EN EL QUE SE DESEA */

const {
    indiceTerreno,
    indiceProyecto,
    indiceInversiones,
    indiceInmueble,
    indice_propietario,
    indiceAdministrador,
    indiceEmpresa,
} = require("../modelos/indicemodelo");

const { numero_punto_coma, funcion_tiempo_estado } = require("./funcionesayuda_3");

const { inmueble_info_cd, proyecto_info_cd } = require("./funcionesayuda_4");

const moment = require("moment");

const funcionesAyuda_2 = {};

/************************************************************************************ */
/************************************************************************************ */
// CABEZERAS LADO ADMINISTRADOR y CLIENTE

funcionesAyuda_2.cabezeras_adm_cli = async function (aux_cabezera) {
    try {
        var codigo_objetivo = aux_cabezera.codigo_objetivo;
        var tipo = aux_cabezera.tipo;
        var lado = aux_cabezera.lado;
        var datos_cabezera = {};
        if (tipo == "terreno") {
            var datos_objetivo = await indiceTerreno.findOne(
                { codigo_terreno: codigo_objetivo },
                {
                    estado_terreno: 1,
                    fecha_creacion: 1,

                    fecha_inicio_reserva: 1,
                    fecha_fin_reserva: 1,
                    fecha_inicio_aprobacion: 1,
                    fecha_fin_aprobacion: 1,
                    fecha_inicio_pago: 1,
                    fecha_fin_pago: 1,
                    fecha_inicio_construccion: 1,
                    fecha_fin_construccion: 1,

                    ciudad: 1,
                    provincia: 1,
                    direccion: 1,
                    link_youtube: 1,
                    link_facebook: 1,
                    link_instagram: 1,
                    link_tiktok: 1,
                    _id: 0,
                }
            );
            if (datos_objetivo) {
                datos_cabezera.ciudad = datos_objetivo.ciudad;
                datos_cabezera.provincia = datos_objetivo.provincia;
                datos_cabezera.direccion = datos_objetivo.direccion;
                datos_cabezera.codigo = codigo_objetivo;
                if (lado == "administrador") {
                    var datos_tiempo = {};
                    datos_tiempo.estado = datos_objetivo.estado_terreno; // ok para caso "terreno"
                    if (datos_objetivo.estado_terreno == "guardado") {
                        datos_tiempo.fecha = datos_objetivo.fecha_creacion;
                        datos_tiempo.fecha_inicio = 0;
                        datos_tiempo.fecha_fin = 0;
                    }
                    if (datos_objetivo.estado_terreno == "reserva") {
                        datos_tiempo.fecha = datos_objetivo.fecha_fin_reserva;
                        datos_tiempo.fecha_inicio = datos_objetivo.fecha_inicio_reserva;
                        datos_tiempo.fecha_fin = datos_objetivo.fecha_fin_reserva;
                    }
                    if (datos_objetivo.estado_terreno == "aprobacion") {
                        datos_tiempo.fecha = datos_objetivo.fecha_fin_aprobacion;
                        datos_tiempo.fecha_inicio = datos_objetivo.fecha_inicio_aprobacion;
                        datos_tiempo.fecha_fin = datos_objetivo.fecha_fin_aprobacion;
                    }
                    if (datos_objetivo.estado_terreno == "pago") {
                        datos_tiempo.fecha = datos_objetivo.fecha_fin_pago;
                        datos_tiempo.fecha_inicio = datos_objetivo.fecha_inicio_pago;
                        datos_tiempo.fecha_fin = datos_objetivo.fecha_fin_pago;
                    }
                    if (datos_objetivo.estado_terreno == "construccion") {
                        datos_tiempo.fecha = datos_objetivo.fecha_fin_construccion;
                        datos_tiempo.fecha_inicio = datos_objetivo.fecha_inicio_construccion;
                        datos_tiempo.fecha_fin = datos_objetivo.fecha_fin_construccion;
                    }
                    if (datos_objetivo.estado_terreno == "construido") {
                        datos_tiempo.fecha = datos_objetivo.fecha_fin_construccion;
                        datos_tiempo.fecha_inicio = 0;
                        datos_tiempo.fecha_fin = 0;
                    }

                    datos_cabezera.estado = datos_objetivo.estado_terreno;
                    var resultado_tiempo = funcion_tiempo_estado(datos_tiempo);
                    datos_cabezera.factor_tiempo_tiempo = resultado_tiempo.factor_tiempo_tiempo;
                }
                if (lado == "cliente") {
                    datos_cabezera.facebook = datos_objetivo.link_facebook;
                    datos_cabezera.instagram = datos_objetivo.link_instagram;
                    datos_cabezera.tiktok = datos_objetivo.link_tiktok;
                    datos_cabezera.youtube = datos_objetivo.link_youtube;
                }
                return datos_cabezera;
            }
        }

        if (tipo == "proyecto") {
            var datos_objetivo = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_objetivo },
                {
                    codigo_terreno: 1,
                    nombre_proyecto: 1,
                    estado_proyecto: 1,
                    fecha_creacion: 1,
                    link_youtube_proyecto: 1,
                    link_facebook_proyecto: 1,
                    link_instagram_proyecto: 1,
                    link_tiktok_proyecto: 1,
                    _id: 0,
                }
            );
            if (datos_objetivo) {
                var aux_terreno = await indiceTerreno.findOne(
                    { codigo_terreno: datos_objetivo.codigo_terreno },
                    {
                        estado_terreno: 1,
                        fecha_inicio_reserva: 1,
                        fecha_fin_reserva: 1,
                        fecha_inicio_aprobacion: 1,
                        fecha_fin_aprobacion: 1,
                        fecha_inicio_pago: 1,
                        fecha_fin_pago: 1,
                        fecha_inicio_construccion: 1,
                        fecha_fin_construccion: 1,
                        _id: 0,
                    }
                );

                if (aux_terreno) {
                    datos_cabezera.nombre_proyecto = datos_objetivo.nombre_proyecto;
                    datos_cabezera.codigo_terreno = datos_objetivo.codigo_terreno;
                    datos_cabezera.codigo = codigo_objetivo;
                    if (lado == "administrador") {
                        var datos_tiempo = {};
                        datos_cabezera.estado = datos_objetivo.estado_proyecto;

                        if (datos_objetivo.estado_proyecto == "guardado") {
                            datos_tiempo.estado = datos_objetivo.estado_proyecto;
                            datos_tiempo.fecha = datos_objetivo.fecha_creacion;
                            datos_tiempo.fecha_inicio = 0;
                            datos_tiempo.fecha_fin = 0;
                        }
                        if (datos_objetivo.estado_proyecto == "completado") {
                            datos_tiempo.estado = aux_terreno.estado_terreno;
                            if (aux_terreno.estado_terreno == "reserva") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_reserva;
                                datos_tiempo.fecha_inicio = aux_terreno.fecha_inicio_reserva;
                                datos_tiempo.fecha_fin = aux_terreno.fecha_fin_reserva;
                            }
                            if (aux_terreno.estado_terreno == "aprobacion") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_aprobacion;
                                datos_tiempo.fecha_inicio = aux_terreno.fecha_inicio_aprobacion;
                                datos_tiempo.fecha_fin = aux_terreno.fecha_fin_aprobacion;
                            }
                            if (aux_terreno.estado_terreno == "pago") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_pago;
                                datos_tiempo.fecha_inicio = aux_terreno.fecha_inicio_pago;
                                datos_tiempo.fecha_fin = aux_terreno.fecha_fin_pago;
                            }
                            if (aux_terreno.estado_terreno == "construccion") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_construccion;
                                datos_tiempo.fecha_inicio = aux_terreno.fecha_inicio_construccion;
                                datos_tiempo.fecha_fin = aux_terreno.fecha_fin_construccion;
                            }
                            if (aux_terreno.estado_terreno == "construido") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_construccion;
                                datos_tiempo.fecha_inicio = 0;
                                datos_tiempo.fecha_fin = 0;
                            }
                        }
                        var resultado_tiempo = funcion_tiempo_estado(datos_tiempo);
                        datos_cabezera.factor_tiempo_tiempo = resultado_tiempo.factor_tiempo_tiempo;
                    }
                    if (lado == "cliente") {
                        datos_cabezera.facebook = datos_objetivo.link_facebook_proyecto;
                        datos_cabezera.instagram = datos_objetivo.link_instagram_proyecto;
                        datos_cabezera.tiktok = datos_objetivo.link_tiktok_proyecto;
                        datos_cabezera.youtube = datos_objetivo.link_youtube_proyecto;

                        // corregimos que estado estara como "true"
                        if (aux_terreno.estado_terreno == "reserva") {
                            datos_cabezera.ver_propuestas = true; // para ver el TERRENO
                        }
                        if (aux_terreno.estado_terreno == "aprobacion") {
                            datos_cabezera.ver_propuestas = false;
                        }
                        if (aux_terreno.estado_terreno == "pago") {
                            datos_cabezera.ver_propuestas = false;
                        }
                        if (aux_terreno.estado_terreno == "construccion") {
                            datos_cabezera.ver_propuestas = false;
                        }
                        if (aux_terreno.estado_terreno == "construido") {
                            datos_cabezera.ver_propuestas = false;
                        }
                    }
                    return datos_cabezera;
                }
            }
        }

        if (tipo == "inmueble") {
            var datos_objetivo = await indiceInmueble.findOne(
                { codigo_inmueble: codigo_objetivo },
                {
                    codigo_terreno: 1,
                    codigo_proyecto: 1,
                    tipo_inmueble: 1,
                    estado_inmueble: 1,
                    fecha_creacion: 1,
                    link_youtube_inmueble: 1,
                    _id: 0,
                }
            );
            if (datos_objetivo) {
                var aux_proyecto = await indiceProyecto.findOne(
                    { codigo_proyecto: datos_objetivo.codigo_proyecto },
                    {
                        link_facebook_proyecto: 1,
                        link_instagram_proyecto: 1,
                        link_tiktok_proyecto: 1,
                        _id: 0,
                    }
                );

                var aux_terreno = await indiceTerreno.findOne(
                    { codigo_terreno: datos_objetivo.codigo_terreno },
                    {
                        estado_terreno: 1,
                        fecha_fin_reserva: 1,
                        fecha_fin_aprobacion: 1,
                        fecha_fin_pago: 1,
                        fecha_fin_construccion: 1,
                        _id: 0,
                    }
                );

                if (aux_proyecto && aux_terreno) {
                    datos_cabezera.tipo_inmueble = datos_objetivo.tipo_inmueble;
                    datos_cabezera.codigo = codigo_objetivo;
                    datos_cabezera.codigo_proyecto = datos_objetivo.codigo_proyecto;
                    datos_cabezera.codigo_terreno = datos_objetivo.codigo_terreno;
                    if (lado == "administrador") {
                        var datos_tiempo = {};

                        if (datos_objetivo.estado_inmueble == "guardado") {
                            datos_cabezera.estado = "Guardado";
                        }
                        if (datos_objetivo.estado_inmueble == "disponible") {
                            datos_cabezera.estado = "Disponible";
                        }
                        if (datos_objetivo.estado_inmueble == "reservado") {
                            datos_cabezera.estado = "Reservado";
                        }
                        if (datos_objetivo.estado_inmueble == "pendiente_pago") {
                            datos_cabezera.estado = "Pendiente";
                        }
                        if (datos_objetivo.estado_inmueble == "pagado_pago") {
                            datos_cabezera.estado = "Pagado";
                        }
                        if (datos_objetivo.estado_inmueble == "pendiente_aprobacion") {
                            datos_cabezera.estado = "Aprobación";
                        }
                        if (datos_objetivo.estado_inmueble == "pagos") {
                            datos_cabezera.estado = "Construcción";
                        }
                        if (datos_objetivo.estado_inmueble == "remate") {
                            datos_cabezera.estado = "Remate";
                        }
                        if (datos_objetivo.estado_inmueble == "completado") {
                            datos_cabezera.estado = "Construido";
                        }

                        // ------------------------------------------------

                        if (datos_objetivo.estado_inmueble == "guardado") {
                            datos_tiempo.estado = datos_objetivo.estado_inmueble;
                            datos_tiempo.fecha = datos_objetivo.fecha_creacion;
                            datos_tiempo.fecha_inicio = 0;
                            datos_tiempo.fecha_fin = 0;
                        } else {
                            datos_tiempo.estado = aux_terreno.estado_terreno;
                            if (aux_terreno.estado_terreno == "reserva") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_reserva;
                                datos_tiempo.fecha_inicio = aux_terreno.fecha_inicio_reserva;
                                datos_tiempo.fecha_fin = aux_terreno.fecha_fin_reserva;
                            }
                            if (aux_terreno.estado_terreno == "aprobacion") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_aprobacion;
                                datos_tiempo.fecha_inicio = aux_terreno.fecha_inicio_aprobacion;
                                datos_tiempo.fecha_fin = aux_terreno.fecha_fin_aprobacion;
                            }
                            if (aux_terreno.estado_terreno == "pago") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_pago;
                                datos_tiempo.fecha_inicio = aux_terreno.fecha_inicio_pago;
                                datos_tiempo.fecha_fin = aux_terreno.fecha_fin_pago;
                            }
                            if (aux_terreno.estado_terreno == "construccion") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_construccion;
                                datos_tiempo.fecha_inicio = aux_terreno.fecha_inicio_construccion;
                                datos_tiempo.fecha_fin = aux_terreno.fecha_fin_construccion;
                            }
                            if (aux_terreno.estado_terreno == "construido") {
                                datos_tiempo.fecha = aux_terreno.fecha_fin_construccion;
                                datos_tiempo.fecha_inicio = 0;
                                datos_tiempo.fecha_fin = 0;
                            }
                        }

                        var resultado_tiempo = funcion_tiempo_estado(datos_tiempo);
                        datos_cabezera.factor_tiempo_tiempo = resultado_tiempo.factor_tiempo_tiempo;
                    }
                    if (lado == "cliente") {
                        datos_cabezera.facebook = aux_proyecto.link_facebook_proyecto;
                        datos_cabezera.instagram = aux_proyecto.link_instagram_proyecto;
                        datos_cabezera.tiktok = aux_proyecto.link_tiktok_proyecto;
                        datos_cabezera.youtube = datos_objetivo.link_youtube_inmueble;

                        // corregimos que estado estara como "true"
                        if (aux_terreno.estado_terreno == "reserva") {
                            datos_cabezera.ver_propuestas = true; // para ver el TERRENO
                        }
                        if (aux_terreno.estado_terreno == "aprobacion") {
                            datos_cabezera.ver_propuestas = false;
                        }
                        if (aux_terreno.estado_terreno == "pago") {
                            datos_cabezera.ver_propuestas = false;
                        }
                        if (aux_terreno.estado_terreno == "construccion") {
                            datos_cabezera.ver_propuestas = false;
                        }
                        if (aux_terreno.estado_terreno == "construido") {
                            datos_cabezera.ver_propuestas = false;
                        }
                    }
                    return datos_cabezera;
                }
            }
        }

        if (tipo == "administrador") {
            var datos_objetivo = await indiceAdministrador.findOne(
                { ci_administrador: codigo_objetivo },
                {
                    ad_nombres: 1,
                    ad_apellidos: 1,
                    clase: 1,
                    ci_administrador: 1,
                    _id: 0,
                }
            );

            if (datos_objetivo) {
                datos_cabezera.nombre =
                    datos_objetivo.adm_nombres + " " + datos_objetivo.ad_apellidos;
                datos_cabezera.clase = datos_objetivo.clase;
                datos_cabezera.ci_administrador = datos_objetivo.ci_administrador;

                return datos_cabezera;
            }
        }

        if (tipo == "propietario") {
            var datos_objetivo = await indice_propietario.findOne(
                { ci_propietario: codigo_objetivo },
                {
                    nombres_propietario: 1,
                    apellidos_propietario: 1,

                    ci_propietario: 1,
                    _id: 0,
                }
            );

            if (datos_objetivo) {
                datos_cabezera.prop_nombres =
                    datos_objetivo.nombres_propietario + " " + datos_objetivo.apellidos_propietario;
                datos_cabezera.ci_propietario = datos_objetivo.ci_propietario;

                return datos_cabezera;
            }
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PIE DE PAGINA LADO ADMINISTRADOR

funcionesAyuda_2.pie_pagina_adm = async function () {
    try {
        // informacion para pie de página
        var registro_datos_empresa = await indiceEmpresa.findOne(
            {},
            {
                mision_vision: 1,
                texto_footer: 1,
                year_derecho: 1,
            }
        );

        if (registro_datos_empresa) {
            return {
                mision_vision: registro_datos_empresa.mision_vision,
                texto_footer: registro_datos_empresa.texto_footer,
                year_derecho: registro_datos_empresa.year_derecho,
            };
        } else {
            return {};
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PIE DE PAGINA LADO CLIENTE

funcionesAyuda_2.pie_pagina_cli = async function () {
    try {
        // informacion para pie de página
        var registro_datos_empresa = await indiceEmpresa.findOne(
            {},
            {
                whatsapp: 1,
                telefono_fijo: 1,
                facebook: 1,
                instagram: 1,
                tiktok: 1,
                youtube: 1,
                direccion: 1,
                year_derecho: 1,
                mision_vision: 1,
            }
        );

        if (registro_datos_empresa) {
            return {
                whatsapp: registro_datos_empresa.whatsapp,
                telefono_fijo: registro_datos_empresa.telefono_fijo,
                facebook: registro_datos_empresa.facebook,
                instagram: registro_datos_empresa.instagram,
                tiktok: registro_datos_empresa.tiktok,
                youtube: registro_datos_empresa.youtube,
                direccion: registro_datos_empresa.direccion,
                year_derecho: registro_datos_empresa.year_derecho,
                mision_vision: registro_datos_empresa.mision_vision,
            };
        } else {
            return {};
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// ARMADOR DE DATOS Y PAGOS DE PROPIETARIO (util para renderizar en las pestañas de "propietario y pagos" de inmueble; y de "datos" "pagos" de propietario)

// paquete_propietario : {ci_propietario: ... , codigo_inmueble: ...}
funcionesAyuda_2.datos_pagos_propietario = async function (paquete_propietario) {
    const ci_propietario = paquete_propietario.ci_propietario;
    const codigo_inmueble = paquete_propietario.codigo_inmueble;

    moment.locale("es");

    var contenedor_propietario = {}; // vacio para luego ser llenado

    // datos del propietario

    var registro_propietario = await indice_propietario.findOne(
        {
            ci_propietario: ci_propietario,
        },
        {
            ci_propietario: 1,
            nombres_propietario: 1,
            apellidos_propietario: 1,
            departamento_propietario: 1,
            provincia_propietario: 1,
            domicilio_propietario: 1,
            ocupacion_propietario: 1,
            fecha_nacimiento_propietario: 1,
            telefonos_propietario: 1,
            _id: 0,
        }
    );

    if (registro_propietario) {
        // conversion del documento MONGO ({objeto}) a "string"
        var aux_string = JSON.stringify(registro_propietario);
        // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
        var propietario_datos = JSON.parse(aux_string);

        if (propietario_datos.fecha_nacimiento_propietario) {
            let arrayFecha = propietario_datos.fecha_nacimiento_propietario.split("T");
            // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
            propietario_datos.fecha_nacimiento_propietario = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"

            // conversion de formato de fecha a ej/ domingo 28 Junio de 2023
            //moment.locale("es");
            propietario_datos.nacimiento_propietario_render = moment
                .utc(propietario_datos.fecha_nacimiento_propietario)
                .format("LL"); // muestra solo fecha español
        } else {
            propietario_datos.fecha_nacimiento_propietario = "";
            propietario_datos.nacimiento_propietario_render = "";
        }

        contenedor_propietario.propietario_datos = propietario_datos;
    } else {
        // es un propietario completamente nuevo que aun no existe en la base de datos

        contenedor_propietario.propietario_datos = {
            ci_propietario: ci_propietario,
            nombres_propietario: "",
            apellidos_propietario: "",
            departamento_propietario: "",
            provincia_propietario: "",
            domicilio_propietario: "",
            ocupacion_propietario: "",
            fecha_nacimiento_propietario: "",
            telefonos_propietario: "",
        };
    }

    // Se inspeccionara si el potencial propietario cuenta con pagos anteriores en el inmueble o si es completamtente nuevo
    var inversionistaActivo = await indiceInversiones.findOne(
        {
            ci_propietario: ci_propietario,
            codigo_inmueble: codigo_inmueble,
        },
        {
            _id: 0,
        }
    );

    // Si el propietario cuenta con pagos en el inmueble
    if (inversionistaActivo) {
        // conversion del documento MONGO ({OBJETO}) a "string"
        var aux_string = JSON.stringify(inversionistaActivo);
        // reconversion del "string" a "objeto"
        var propietario_pagos = JSON.parse(aux_string);

        //----------------------------------------------
        // para color de estado de propietario.
        // activo: color link, pasivo: color rojo

        if (propietario_pagos.estado_propietario=="activo") {
            //agregamos la propiedad "es_activo" al objeto
            propietario_pagos.es_activo = true;
        }
        if (propietario_pagos.estado_propietario=="pasivo") {
            //agregamos la propiedad "es_activo" al objeto
            propietario_pagos.es_activo = false;
        }
        //----------------------------------------------

        if (propietario_pagos.tiene_reserva) {
            // para mostrar el pago en formato español con punto mil y coma decimal PARA LA VENTANA DE INMUEBLE EN SU PESTAÑA PROPIETARIO
            propietario_pagos.pagado_reserva_render = numero_punto_coma(
                propietario_pagos.pagado_reserva
            );

            // conversion de formato de fecha a ej/ domingo 28 Junio de 2023
            // PARA LA VENTANA DE INMUEBLE EN SU PESTAÑA PROPIETARIO
            propietario_pagos.fecha_pagado_reserva_render = moment
                .utc(propietario_pagos.fecha_pagado_reserva)
                .format("LL"); // muestra solo fecha español

            // llevamos el formato fecha de mongo a formato html, para mostrarlo en html
            propietario_pagos.fecha_pagado_reserva = fecha_html(
                propietario_pagos.fecha_pagado_reserva
            );
        }

        if (propietario_pagos.tiene_pago) {
            // para mostrar el pago en formato español con punto mil y coma decimal PARA LA VENTANA DE INMUEBLE EN SU PESTAÑA PROPIETARIO
            propietario_pagos.pagado_pago_render = numero_punto_coma(propietario_pagos.pagado_pago);

            // conversion de formato de fecha a ej/ domingo 28 Junio de 2023
            // PARA LA VENTANA DE INMUEBLE EN SU PESTAÑA PROPIETARIO
            propietario_pagos.fecha_pagado_pago_render = moment
                .utc(propietario_pagos.fecha_pagado_pago)
                .format("LL"); // muestra solo fecha español

            // llevamos el formato fecha de mongo a formato html, para mostrarlo en html
            propietario_pagos.fecha_pagado_pago = fecha_html(propietario_pagos.fecha_pagado_pago);
        }

        if (propietario_pagos.tiene_mensuales) {
            var aux_mensuales = 0;
            for (let i = 0; i < propietario_pagos.pagos_mensuales.length; i++) {
                /*
                propietario_pagos.pagos_mensuales[i].fecha_pago = fecha_html(
                    propietario_pagos.pagos_mensuales[i].fecha_pago
                );
                */

                // en el array de pagos mensuales, la fecha se encuentra guardada en el formato string: "2023-09-08"
                /*
                propietario_pagos.pagos_mensuales[i].fecha_pago =
                    propietario_pagos.pagos_mensuales[i].fecha_pago;
                // agregando la propiedad de numeracion para mostrarlo en el html
                propietario_pagos.pagos_mensuales[i].numero = i + 1;
                var aux_mensual_i = Number(propietario_pagos.pagos_mensuales[i].pago);
                aux_mensuales = aux_mensuales + aux_mensual_i;
                */

                propietario_pagos.pagos_mensuales[i] = {
                    numero: propietario_pagos.pagos_mensuales[i][0],
                    fecha_pago: propietario_pagos.pagos_mensuales[i][1],
                    pago: propietario_pagos.pagos_mensuales[i][2],

                    fecha_pago_render: moment
                        .utc(propietario_pagos.pagos_mensuales[i][1])
                        .format("LL"), // muestra solo fecha español
                    pago_render: numero_punto_coma(propietario_pagos.pagos_mensuales[i][2]),
                };
            }
        }

        contenedor_propietario.propietario_pagos = propietario_pagos;

        // calculo indemnizacion y penalizacion que seran aplicados cuando el propietario sea un incumplido
        var inmueble_registro = await indiceInmueble.findOne(
            {
                codigo_inmueble: codigo_inmueble,
            },
            {
                codigo_proyecto: 1,
            }
        );

        if (inmueble_registro) {
            var codigo_proyecto = inmueble_registro.codigo_proyecto;
            var proyecto_registro = await indiceProyecto.findOne(
                {
                    codigo_proyecto: codigo_proyecto,
                },
                {
                    penalizacion: 1,
                }
            );

            if (proyecto_registro) {
                var porc_penalizacion = Number(proyecto_registro.penalizacion) / 100;
                var aux_reserva = Number(propietario_pagos.pagado_reserva);
                var aux_pago = Number(propietario_pagos.pagado_pago);
                var aux_total_pagado = aux_reserva + aux_pago + aux_mensuales;

                contenedor_propietario.total_pagado = numero_punto_coma(
                    Number(aux_total_pagado.toFixed(2))
                );
                contenedor_propietario.indemnizacion = numero_punto_coma(
                    Number((aux_total_pagado - aux_total_pagado * porc_penalizacion).toFixed(2))
                );
                contenedor_propietario.penalizacion = numero_punto_coma(
                    Number((aux_total_pagado * porc_penalizacion).toFixed(2))
                );
            }
        }
    } else {
        contenedor_propietario.propietario_pagos = {
            tiene_reserva: false,
            pagado_reserva: "",
            fecha_pagado_reserva: "",

            tiene_pago: false,
            pagado_pago: "",
            fecha_pagado_pago: "",

            tiene_mensuales: false,
            pagos_mensuales: [], // array vacio
        };

        contenedor_propietario.total_pagado = 0;
        contenedor_propietario.indemnizacion = 0;
        contenedor_propietario.penalizacion = 0;
    }

    return contenedor_propietario;
};

//---------------------------

function fecha_html(fecha_mongo) {
    if (fecha_mongo != "") {
        let arrayFecha = fecha_mongo.split("T");
        // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
        fecha_mongo = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"
    } else {
        fecha_mongo = "";
    }
    return fecha_mongo;
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para segundero, en ventana de resumen PROPIETARIO [que contabilizara todas las propiedades activas de ese propietario], en ventana de INMUEBLE (cliente) [que contabilizara solo para ese inmueble]
// datos_segundero: {codigo_objetivo, ci_propietario,tipo_objetivo}
funcionesAyuda_2.segundero_cajas = async function (datos_segundero) {
    // ------- Para verificación -------
    //console.log("entrando a la funcion de segundero_cajas");
    //console.log(datos_segundero);

    var codigo_objetivo = datos_segundero.codigo_objetivo; // de: propietario o inmueble o proyecto
    var tipo_objetivo = datos_segundero.tipo_objetivo; // propietario o inmueble o proyecto
    var ci_propietario = datos_segundero.ci_propietario; // (puede ser: ci o ninguno)

    //----------------------------------------------------------------------------
    // SEGUNDERO PLUSVALIA
    var total = 0; // el valor total del inmueble (ahorro + construccion)
    var ahorro = 0; // el ahorro
    var precio = 0; // el valor real de precio de venta del inmueble (incluido todos los descuentos actuales con las que pueda contar)
    var construccion = 0; // valor de contruccion SOLIDEXA del inmueble

    var array_plusvalia = [];

    //var array_plus_r = []; // $us/seg de plusvalia
    //var array_plus_fechaInicio = [];
    //var array_plus_fechaFin = [];

    //----------------------------------------------------------------------------
    // SEGUNDERO RECOMPENSA

    var recompensa = 0; // Bs redondeado al entero inmediato inferior
    var meses = 0; // meses espera de recompensa redondeado al entero inmediato inferior

    var array_recompensa = [];

    //var array_recom_r = []; // $us/seg de recompensa
    //var array_recom_fechaInicio = []; // fecha Cuando el inm es reservado
    //var array_recom_fechaFin = [];

    //----------------------------------------------------------------------------

    if (tipo_objetivo == "propietario") {
        // solo seran considerados los inmuebles del propietario, donde este esta "activo"
        var registro_inmueble = await indiceInversiones.find(
            { ci_propietario: codigo_objetivo, estado_propietario: "activo" },
            {
                codigo_proyecto: 1,
                codigo_inmueble: 1,
                codigo_terreno: 1,
                _id: 0,
            }
        );

        if (registro_inmueble.length > 0) {
            // los que generan $us/seg son los inmuebles en estado:
            // disponible, reservado, pendiente, pagado, pagos (construccion)
            // los que terminaron de generar $us/seg son los inmuebles en estado:
            // completado (construido)

            //-----------------------------------------------------------------

            for (let i = 0; i < registro_inmueble.length; i++) {
                let codigo_inmueble_i = registro_inmueble[i].codigo_inmueble;

                var aux_paquete_datos = {
                    codigo_inmueble: codigo_inmueble_i,
                    ci_propietario,
                };

                var resultado_funcion = await aux_inmueble_segundero(aux_paquete_datos);

                //-----------------------------------------------------------------
                // PARA SEGUNDERO DE PLUSVALIA

                total = total + resultado_funcion.total;
                ahorro = ahorro + resultado_funcion.ahorro;
                precio = precio + resultado_funcion.precio;
                construccion = construccion + resultado_funcion.construccion;

                array_plusvalia[i] = {
                    plus_r: resultado_funcion.r_plus,
                    plus_fechaInicio: resultado_funcion.fecha_inicio_reserva,
                    plus_fechaFin: resultado_funcion.fecha_fin_construccion,
                };

                //-----------------------------------------------------------------
                // PARA SEGUNDERO DE RECOMPENSA

                recompensa = recompensa + resultado_funcion.recompensa_real;
                meses = meses + resultado_funcion.meses_r;

                array_recompensa[i] = {
                    recom_r: resultado_funcion.r_recompensa, // Bs/seg real
                    recom_fechaInicio: resultado_funcion.fecha_pagado_reserva_r,
                    recom_fechaFin: resultado_funcion.fecha_inicio_construccion_r,
                };

                //-----------------------------------------------------------------
            } // for
        }

        var resultado = {
            //---------------------------------------
            // SEGUNDERO PLUSVALIA
            array_plusvalia,

            total,
            ahorro,
            precio,
            construccion,

            //---------------------------------------
            // SEGUNDERO RECOMPENSA
            array_recompensa,

            recompensa,
            meses,
            //---------------------------------------
        };
        return resultado;
    }

    if (tipo_objetivo == "inmueble") {
        // aqui se ingresa solo por el lado del cliente, ya que es solo en esa ventana donde se ven los segunderos ( en lado de administrador NO )
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_objetivo },
            {
                codigo_proyecto: 1,
                codigo_terreno: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            // los que generan $us/seg son los inmuebles en estado:
            // disponible, reservado, pendiente, pagado, pagos
            // los que terminaron de generar $us/seg son los inmuebles en estado:
            // completado

            var aux_paquete_datos = {
                codigo_inmueble: codigo_objetivo,
                ci_propietario,
            };

            var resultado_funcion = await aux_inmueble_segundero(aux_paquete_datos);

            //-----------------------------------------------------------------
            // PARA SEGUNDERO DE PLUSVALIA

            total = resultado_funcion.total;
            ahorro = resultado_funcion.ahorro;
            precio = resultado_funcion.precio;
            construccion = resultado_funcion.construccion;

            array_plusvalia[0] = {
                plus_r: resultado_funcion.r_plus,
                plus_fechaInicio: resultado_funcion.fecha_inicio_reserva,
                plus_fechaFin: resultado_funcion.fecha_fin_construccion,
            };

            //-----------------------------------------------------------------
            // PARA SEGUNDERO DE RECOMPENSA

            recompensa = recompensa + resultado_funcion.recompensa_real;
            meses = meses + resultado_funcion.meses_r;

            array_recompensa[0] = {
                recom_r: resultado_funcion.r_recompensa, // Bs/seg real
                recom_fechaInicio: resultado_funcion.fecha_pagado_reserva_r,
                recom_fechaFin: resultado_funcion.fecha_inicio_construccion_r,
            };

            //-----------------------------------------------------------------
            // PARA LAS 2 BARRAS DE PROGRESO (FINANCIAMIENTO Y PLAZO)

            var paquete_datos = {
                tipo_objetivo,
                codigo_objetivo,
                ci_propietario,
            };
            var progresos = await aux_barras_progreso(paquete_datos);

            //-----------------------------------------------------------------
        }

        var resultado = {
            //---------------------------------------
            // SEGUNDERO PLUSVALIA
            array_plusvalia,

            total,
            ahorro,
            precio,
            construccion,

            progresos,

            //---------------------------------------
            // SEGUNDERO RECOMPENSA
            array_recompensa,

            recompensa,
            meses,
            //---------------------------------------
        };
        return resultado;
    }

    if (tipo_objetivo == "proyecto") {
        // aqui se ingresa solo por el lado del cliente, ya que es solo en esa ventana donde se ven los segunderos ( en lado de administrador NO )
        var registro_inmueble = await indiceInmueble.find(
            { codigo_proyecto: codigo_objetivo },
            {
                codigo_inmueble: 1,
                codigo_terreno: 1,
                _id: 0,
            }
        );

        if (registro_inmueble.length > 0) {
            // los que generan $us/seg son los inmuebles en estado:
            // disponible, reservado, pendiente, pagado, pagos
            // los que terminaron de generar $us/seg son los inmuebles en estado:
            // completado (construido)

            //-----------------------------------------------------------------

            for (let i = 0; i < registro_inmueble.length; i++) {
                let codigo_inmueble_i = registro_inmueble[i].codigo_inmueble;

                // a pesar de que todos los inmuebles pertenecen al mismo proyecto y por ende al mismo terreno, obviamente todos tendran la misma fecha de inicio de reserva y fin de contruccion, pero para no crear otra funcion, se utilizara la funcion "aux_inmueble_segundero", tratandolos como si fueran inmuebles de diferentes proyectos, pero al final se obtendra el mismo resultado correcto.

                var aux_paquete_datos = {
                    codigo_inmueble: codigo_inmueble_i,
                    ci_propietario,
                };

                var resultado_funcion = await aux_inmueble_segundero(aux_paquete_datos);

                //-----------------------------------------------------------------
                // PARA SEGUNDERO DE PLUSVALIA

                total = total + resultado_funcion.total;
                ahorro = ahorro + resultado_funcion.ahorro;
                precio = precio + resultado_funcion.precio;
                construccion = construccion + resultado_funcion.construccion;

                array_plusvalia[i] = {
                    plus_r: resultado_funcion.r_plus,
                    plus_fechaInicio: resultado_funcion.fecha_inicio_reserva,
                    plus_fechaFin: resultado_funcion.fecha_fin_construccion,
                };

                //-----------------------------------------------------------------
                // PARA SEGUNDERO DE RECOMPENSA

                recompensa = recompensa + resultado_funcion.recompensa_real;
                meses = meses + resultado_funcion.meses_r;

                array_recompensa[i] = {
                    recom_r: resultado_funcion.r_recompensa, // Bs/seg real
                    recom_fechaInicio: resultado_funcion.fecha_pagado_reserva_r,
                    recom_fechaFin: resultado_funcion.fecha_inicio_construccion_r,
                };

                //-----------------------------------------------------------------
            } // for

            //-----------------------------------------------------------------
            // PARA LAS 2 BARRAS DE PROGRESO (FINANCIAMIENTO Y PLAZO)

            var paquete_datos = {
                tipo_objetivo,
                codigo_objetivo,
                ci_propietario,
            };
            var progresos = await aux_barras_progreso(paquete_datos);

            //-----------------------------------------------------------------
        }

        var resultado = {
            //---------------------------------------
            // SEGUNDERO PLUSVALIA
            array_plusvalia,

            total,
            ahorro,
            precio,
            construccion,

            progresos,

            //---------------------------------------
            // SEGUNDERO RECOMPENSA
            array_recompensa,

            recompensa,
            meses,
            //---------------------------------------
        };
        return resultado;
    }

    // SOLO PARA TERRENO EN ETAPA DE CONVOCATORIA, Y SOLO ES VISIBLE CUANDO SI INGRESA DEL LADO DEL CLIENTE (NO DEL GESTIONADOR)
    if (tipo_objetivo == "terreno") {
        // EN TERRENO NO EXISTE SEGUNDERO, SOLO EXISTE BARRAS DE PROGRESO

        //-----------------------------------------------------------------
        // PARA LAS 2 BARRAS DE PROGRESO (PLAZO y VACANTES)

        var paquete_datos = {
            tipo_objetivo,
            codigo_objetivo,
            ci_propietario,
        };
        var progresos = await aux_barras_progreso(paquete_datos);

        //-----------------------------------------------------------------

        var resultado = {
            progresos,
        };
        return resultado;
    }
};

//-----------------------------------------------------------------------------

async function aux_inmueble_segundero(aux_paquete_datos) {
    try {
        var codigo_inmueble = aux_paquete_datos.codigo_inmueble;
        var ci_propietario = aux_paquete_datos.ci_propietario;

        var inmueble_i = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                estado_inmueble: 1,
                //ci_propietario: 1, // Util para RECOMPENSA POR TIEMPO DE ESPERA
                recompensa: 1, // Util para RECOMPENSA POR TIEMPO DE ESPERA
                _id: 0,
            }
        );

        var aux_terreno = await indiceTerreno.findOne(
            { codigo_terreno: inmueble_i.codigo_terreno },
            {
                fecha_inicio_reserva: 1,
                fecha_fin_construccion: 1,

                fecha_inicio_construccion: 1, // util para RECOMPESA
                estado_terreno: 1, // util para RECOMPESA

                _id: 0,
            }
        );

        var paquete_inmueble = {
            codigo_inmueble: codigo_inmueble,
            codigo_usuario: ci_propietario, // (puede ser: ci o ninguno)
            //laapirest: "/laapirest/", // por partir desde el lado del ADMINISTRADOR
        };

        // ------- Para verificación -------
        //console.log("para ver que paquete de datos se esta enviando");
        //console.log(paquete_inmueble);

        var aux_inm = await inmueble_info_cd(paquete_inmueble);

        var construccion = aux_inm.num_puro_construccion;
        var precio = aux_inm.num_puro_precio_actual;
        var ahorro = aux_inm.num_puro_ahorro;
        var total = precio + ahorro;

        var fecha_inicio_reserva = aux_terreno.fecha_inicio_reserva;
        var fecha_fin_construccion = aux_terreno.fecha_fin_construccion;

        let d_segundos = (fecha_fin_construccion - fecha_inicio_reserva + 1000) / 1000;

        // ------- Para verificación -------
        /*
        console.log(
            "los segundos entre inicio de reserva y la entrega construido del proyecto"
        );
        console.log(d_segundos);
        */

        var r_plus = aux_inm.num_puro_ahorro / d_segundos; // $us/seg

        //------------------------------------------------------------------
        // para RECOMPENSA

        // si el inmueble NO tiene propietario, entonces en el segundero estaran los valores de CERO tanto en la parte entera como en los decimales.

        // si el inmueble SI tiene propietario, entonces el valor de recompensa sera el correspondiente a los dias que falten para dar inicio a la construccion del py
        // el valor total que ganara el propietario del inmueble sera menor (cuando reserve su inmueble varios diaas despues de haber sido lanzado a convocatoria) o igual (cuando reserve su inmueble el mismo dia que se lanze la convocatoria) al valor de RECOMPENSA fijado en el formulario del inmueble, nunca superara a dicho valor, aunque la fecha de "inicio de contruccion" se retrase meses (ampliando el periodo de APROBACION), es decir cuando los tramites para la obtencion de permisos este demorando mucho tiempo. Otra razon para que los propietario de los inmuebles ganen menos que el valor de la RECOMPENSA fijada originalmente es cuando se de inicio a la construccion del proyecto antes de la fecha de inicio de contruccion estimada

        var r_recompensa = 0; // Bs/seg para SEGUNDERO DE RECOMPENSA
        var recompensa_real = 0; // Bs

        var continuar = false; // por defecto

        var fecha_inicio_reserva_r = aux_terreno.fecha_inicio_reserva;
        var fecha_inicio_construccion_r = aux_terreno.fecha_inicio_construccion;

        var diferenciaEnMilisegundos = fecha_inicio_construccion_r - fecha_inicio_reserva_r;

        // Convertir la diferencia de milisegundos a días
        var diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

        // Calcular el número de meses, redondeado al entero inmediato inferior
        var meses_r = Math.floor(diferenciaEnDias / 30); // meses espera de recompensa

        // para la visualizacion del segundero de recompensa, siempre se tomara la fecha de reserva de dicho inmueble, independiemtemente del inversionista que realizo el pago de reservacion.
        // IMPORTANTE: no borrar las inversiones que se realizan en el inmueble, porque de borrarlos y se corre el riesgo de eliminar el registro donde se encontraba la fecha del pago de reserva del inmueble. De manera que en lugar de eliminarlos, poner el estado_propietario en "pasivo"
        var registro = await indiceInversiones.findOne(
            { codigo_inmueble: codigo_inmueble, tiene_reserva: true },
            {
                fecha_pagado_reserva: 1,
                _id: 0,
            }
        );

        if (registro) {
            continuar = true;
        }

        if (continuar) {
            var fecha_pagado_reserva_r = registro.fecha_pagado_reserva;

            let d_segundos_teo =
                (fecha_inicio_construccion_r - fecha_inicio_reserva_r + 1000) / 1000;
            let d_segundos_real =
                (fecha_inicio_construccion_r - fecha_pagado_reserva_r + 1000) / 1000;

            let recompensa = inmueble_i.recompensa;

            // aplicando regla de 3 simple, calculamos la ganancia por recompensa real correspondiente al tiempo real que el propietario permanecio desde que reservo su inmueble hasta el primer dia en que se inicie su construccion.
            let aux_real = (recompensa / d_segundos_teo) * d_segundos_real;
            recompensa_real = Math.floor(aux_real); // redondeado al entero inmediato inferior

            r_recompensa = recompensa_real / d_segundos_real; // Bs/seg Esta es la velociad real a la que avanzara el segundero de RECOMPENSA
        }

        //------------------------------------------------------------------

        var resultados = {
            //-----------------------------------------------------
            // SEGUNDERO PLUSVALIA
            fecha_inicio_reserva,
            fecha_fin_construccion,
            r_plus,

            construccion,
            precio,
            ahorro,
            total,

            //-----------------------------------------------------
            // SEGUNDERO RECOMPENSA
            r_recompensa, // Bs/seg real
            recompensa_real, // Bs redondeado al entero inmediato inferior
            fecha_pagado_reserva_r, // fecha en que inicia. Cuando el inm es reservado
            fecha_inicio_construccion_r,
            meses_r, // meses espera de recompensa redondeado al entero inmediato inferior
            //-----------------------------------------------------
        };

        // ------- Para verificación -------
        //console.log("el retorno de propietaio aux_inmueble_segundero");
        //console.log(resultados);

        return resultados;
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------------------
// PARA LAS BARRAS DE PROGRESO QUE SE VERAN EN LA VENTANA DESCRIPION DE: TE, PY, INM (TODOS LADO CLIENTE)
async function aux_barras_progreso(paquete_datos) {
    // corregir el codigo que viene debajo
    try {
        // ------- Para verificación -------
        //console.log("EL PAQUETE DE DATOS QUE LE LLEGA A AUX_BARRAS_PROGRESO");
        //console.log(paquete_datos);

        var tipo_objetivo = paquete_datos.tipo_objetivo;
        var codigo_objetivo = paquete_datos.codigo_objetivo;
        var ci_propietario = paquete_datos.ci_propietario;

        if (tipo_objetivo == "proyecto") {
            var datos_proyecto = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_objetivo },
                {
                    codigo_terreno: 1,
                    _id: 0,
                }
            );
            var codigo_terreno = datos_proyecto.codigo_terreno;
        }

        if (tipo_objetivo == "inmueble") {
            var datos_inmueble = await indiceInmueble.findOne(
                { codigo_inmueble: codigo_objetivo },
                {
                    codigo_terreno: 1,
                    _id: 0,
                }
            );
            var codigo_terreno = datos_inmueble.codigo_terreno;
        }

        if (tipo_objetivo == "terreno") {
            var codigo_terreno = codigo_objetivo;
        }

        if (codigo_terreno) {
            var datos_terreno = await indiceTerreno.findOne(
                { codigo_terreno: codigo_terreno },
                {
                    // guardado, reserva, pago, construccion, construido
                    estado_terreno: 1,
                    fecha_inicio_reserva: 1,
                    fecha_fin_reserva: 1,
                    fecha_inicio_aprobacion: 1,
                    fecha_fin_aprobacion: 1,
                    fecha_inicio_pago: 1,
                    fecha_fin_pago: 1,
                    fecha_inicio_construccion: 1,
                    fecha_fin_construccion: 1,
                    anteproyectos_maximo: 1, // es util solo para tipo = terreno
                    anteproyectos_registrados: 1, // es util solo para tipo = terreno
                    _id: 0,
                }
            );

            //---------------------------------------------------------------
            // PLAZO

            if (datos_terreno) {
                moment.locale("es");
                if (datos_terreno.estado_terreno == "reserva") {
                    var fecha_inicio = datos_terreno.fecha_inicio_reserva;
                    var fecha_fin = datos_terreno.fecha_fin_reserva;
                }
                if (datos_terreno.estado_terreno == "aprobacion") {
                    var fecha_inicio = datos_terreno.fecha_inicio_aprobacion;
                    var fecha_fin = datos_terreno.fecha_fin_aprobacion;
                }
                if (datos_terreno.estado_terreno == "pago") {
                    var fecha_inicio = datos_terreno.fecha_inicio_pago;
                    var fecha_fin = datos_terreno.fecha_fin_pago;
                }
                if (
                    datos_terreno.estado_terreno == "construccion" ||
                    datos_terreno.estado_terreno == "construido"
                ) {
                    var fecha_inicio = datos_terreno.fecha_inicio_construccion;
                    var fecha_fin = datos_terreno.fecha_fin_construccion;
                }

                if (
                    datos_terreno.estado_terreno == "reserva" ||
                    datos_terreno.estado_terreno == "aprobacion" ||
                    datos_terreno.estado_terreno == "pago" ||
                    datos_terreno.estado_terreno == "construccion"
                ) {
                    var fecha_actual = new Date();

                    var porcentaje_plazo = (
                        (1 - (fecha_fin - fecha_actual) / (fecha_fin - fecha_inicio)) *
                        100
                    ).toFixed(2);

                    if (fecha_fin > fecha_actual) {
                        var aux_plazo = moment(fecha_fin).endOf("minute").fromNow(); // ej/ [quedan] x dias
                        var etiqueta_plazo = "Finaliza " + aux_plazo;
                    } else {
                        var etiqueta_plazo = "Vencido";
                    }
                } else {
                    if (datos_terreno.estado_terreno == "construido") {
                        var porcentaje_plazo = "100";
                        var aux_plazo = moment(fecha_fin).startOf("minute").fromNow();
                        var etiqueta_plazo = "Hace " + aux_plazo;
                    } else {
                        var porcentaje_plazo = "0";
                        var etiqueta_plazo = "Indefinido";
                    }
                }
            }

            //---------------------------------------------------------------
            // FINANCIAMIENTO (para inmueble o proyecto) o VACANTES (para terreno)
            // var porcentaje_fina_vaca ES EL PORCENTAJE DE "FINANCIAMIENTO" O "VACANTES"

            if (tipo_objetivo == "proyecto") {
                var resultado_py = await proyecto_info_cd(codigo_objetivo);
                var porcentaje_fina_vaca = resultado_py.porcentaje;
                var aux_financiado = resultado_py.financiado; // YA VIENE COMO STRING CON PUNTO COMO MIL
                var etiqueta_fina_vaca = aux_financiado + " $us";
            }

            //---------------------------------------------

            if (tipo_objetivo == "inmueble") {
                var paquete_datos = {
                    codigo_inmueble: codigo_objetivo,
                    codigo_usuario: ci_propietario,
                };
                var resultado_inm = await inmueble_info_cd(paquete_datos);

                // ------- Para verificación -------
                //console.log("INMUEBLE INFO CD");
                //console.log(resultado_inm);

                // resultado_inm.porcentaje ES EL PORCENTAJE DE "FINANCIAMIENTO DEL INM" NO ES EL VALOR DE "RESERVA O PAGO"
                var porcentaje_fina_vaca = resultado_inm.porcentaje;

                var aux_financiado = resultado_inm.financiado; // YA VIENE COMO STRING CON PUNTO COMO MIL
                var etiqueta_fina_vaca = aux_financiado + " $us";
            }
            if (tipo_objetivo == "terreno") {
                var porcentaje_fina_vaca = (
                    (datos_terreno.anteproyectos_registrados / datos_terreno.anteproyectos_maximo) *
                    100
                ).toFixed(2);
                var etiqueta_fina_vaca =
                    datos_terreno.anteproyectos_registrados +
                    " de " +
                    datos_terreno.anteproyectos_maximo;
            }

            //---------------------------------------------------------------

            var resultados = {
                porcentaje_plazo,
                porcentaje_plazo_render: numero_punto_coma(porcentaje_plazo),
                etiqueta_plazo,
                porcentaje_fina_vaca,
                porcentaje_fina_vaca_render: numero_punto_coma(porcentaje_fina_vaca),
                etiqueta_fina_vaca,
            };

            return resultados;
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------------------

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = funcionesAyuda_2;
