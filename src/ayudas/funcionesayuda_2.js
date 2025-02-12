/** SE ENCARGARA DE CONSTRUIR LOS DATOS NECESARIOS EN EL ORDEN EN EL QUE SE DESEA */

const {
    indiceTerreno,
    indiceProyecto,
    indiceInversiones,
    indiceInmueble,
    indice_propietario,
    indiceAdministrador,
    indiceDocumentos,
    indiceFraccionInmueble,
    indiceFraccionTerreno,
} = require("../modelos/indicemodelo");

const { numero_punto_coma } = require("./funcionesayuda_3");
const { super_info_inm } = require("./funcionesayuda_5");

const moment = require("moment");

const funcionesAyuda_2 = {};

/************************************************************************************ */
/************************************************************************************ */
// CABEZERAS LADO ADMINISTRADOR y CLIENTE

funcionesAyuda_2.cabezeras_adm_cli = async function (aux_cabezera) {
    try {
        var codigo_objetivo = aux_cabezera.codigo_objetivo;
        var tipo = aux_cabezera.tipo;

        var datos_cabezera = {};
        if (tipo == "terreno") {
            var datos_objetivo = await indiceTerreno.findOne(
                { codigo_terreno: codigo_objetivo },
                {
                    estado_terreno: 1,
                    fecha_creacion: 1,

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

                datos_cabezera.facebook = datos_objetivo.link_facebook;
                datos_cabezera.instagram = datos_objetivo.link_instagram;
                datos_cabezera.tiktok = datos_objetivo.link_tiktok;
                datos_cabezera.youtube = datos_objetivo.link_youtube;
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
                datos_cabezera.nombre_proyecto = datos_objetivo.nombre_proyecto;
                datos_cabezera.codigo_terreno = datos_objetivo.codigo_terreno;
                datos_cabezera.codigo = codigo_objetivo;

                datos_cabezera.facebook = datos_objetivo.link_facebook_proyecto;
                datos_cabezera.instagram = datos_objetivo.link_instagram_proyecto;
                datos_cabezera.tiktok = datos_objetivo.link_tiktok_proyecto;
                datos_cabezera.youtube = datos_objetivo.link_youtube_proyecto;

                return datos_cabezera;
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

                if (aux_proyecto) {
                    datos_cabezera.tipo_inmueble = datos_objetivo.tipo_inmueble;
                    datos_cabezera.codigo = codigo_objetivo;
                    datos_cabezera.codigo_proyecto = datos_objetivo.codigo_proyecto;
                    datos_cabezera.codigo_terreno = datos_objetivo.codigo_terreno;

                    datos_cabezera.facebook = aux_proyecto.link_facebook_proyecto;
                    datos_cabezera.instagram = aux_proyecto.link_instagram_proyecto;
                    datos_cabezera.tiktok = aux_proyecto.link_tiktok_proyecto;
                    datos_cabezera.youtube = datos_objetivo.link_youtube_inmueble;

                    return datos_cabezera;
                }
            }
        }

        if (tipo == "fraccion") {
            // 1º revision si se trata de una fraccion de tipo copropietario o inversionista

            //2º visualizacion de las redes sociales, dependiendo si se trata de una fraccion que correspondera a inmueble o a terreno

            var fraccionInmueble = await indiceFraccionInmueble.findOne(
                { codigo_fraccion: codigo_objetivo, tipo: "copropietario" },
                {
                    codigo_inmueble: 1,
                    codigo_proyecto: 1,
                    _id: 0,
                }
            );

            if (fraccionInmueble) {
                var registroInmueble = await indiceInmueble.findOne(
                    { codigo_inmueble: fraccionInmueble.codigo_inmueble },
                    {
                        link_youtube_inmueble: 1,
                        _id: 0,
                    }
                );

                var registroProyecto = await indiceProyecto.findOne(
                    { codigo_proyecto: fraccionInmueble.codigo_proyecto },
                    {
                        link_facebook_proyecto: 1,
                        link_instagram_proyecto: 1,
                        link_tiktok_proyecto: 1,
                        _id: 0,
                    }
                );

                if (registroInmueble && registroProyecto) {
                    datos_cabezera.codigo = codigo_objetivo;
                    datos_cabezera.fraccion_inmueble = true;
                    datos_cabezera.codigo_inmueble = fraccionInmueble.codigo_inmueble;

                    datos_cabezera.facebook = registroProyecto.link_facebook_proyecto;
                    datos_cabezera.instagram = registroProyecto.link_instagram_proyecto;
                    datos_cabezera.tiktok = registroProyecto.link_tiktok_proyecto;
                    datos_cabezera.youtube = registroInmueble.link_youtube_inmueble;

                    return datos_cabezera;
                }
            } else {
                var fraccionTerreno = await indiceFraccionTerreno.findOne(
                    { codigo_fraccion: codigo_objetivo },
                    {
                        codigo_terreno: 1,
                        _id: 0,
                    }
                );

                if (fraccionTerreno) {
                    var registroTerreno = await indiceTerreno.findOne(
                        { codigo_terreno: fraccionTerreno.codigo_terreno },
                        {
                            link_youtube: 1,
                            link_facebook: 1,
                            link_instagram: 1,
                            link_tiktok: 1,
                            _id: 0,
                        }
                    );
                }
            }

            if (registroTerreno) {
                datos_cabezera.codigo = codigo_objetivo;
                datos_cabezera.fraccion_terreno = true;
                datos_cabezera.codigo_terreno = fraccionTerreno.codigo_terreno;

                datos_cabezera.facebook = registroTerreno.link_facebook;
                datos_cabezera.instagram = registroTerreno.link_instagram;
                datos_cabezera.tiktok = registroTerreno.link_tiktok;
                datos_cabezera.youtube = registroTerreno.link_youtube;
                return datos_cabezera;
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
// ARMADOR DE DATOS Y PAGOS DE PROPIETARIO (util para renderizar en las pestañas de "propietario" de inmueble; y de "datos" "pagos" de propietario)

funcionesAyuda_2.datos_pagos_propietario = async function (codigo_inmueble) {
    moment.locale("es");

    var contenedor_propietario = {}; // vacio para luego ser llenado

    //--------------------------------------------------------------------------

    // valores por defecto
    var esta_disponible = false;
    var esta_remate = false;

    var existe_propietario = false; // por defecto "false" para indicar que no se mostraran datos ni documentos del propietario del inmueble.

    // ira sumando todos los pagos que en verdad  realizo el propietario (pasivo o activo)
    var pagado_actual = 0;

    // ira sumando todos el pago que tendra que hacer el nuevo propietario si deseara adquirir el inmueble.
    var pago_nuevo_propietario = 0; // en moneda Bs

    // ira sumando los pagos de construccion vencidos que debe pagar el actual propietario (activo o pasivo) del inmueble
    var deuda_demora = 0;

    var cronograma_pagos = [];

    var documentos_privados = [];

    // si es que existe propietario (sea activo o pasivo), sera el PRIMER pago (de reserva o remate) con el que el actual propietario adquirio el inmueble
    var pagado_primer = 0;

    let registroInmueble = await indiceInmueble.findOne(
        { codigo_inmueble: codigo_inmueble },
        {
            precio_construccion: 1,
            codigo_proyecto: 1,
            codigo_terreno: 1,

            precio_competencia: 1,
            superficie_inmueble_m2: 1,
            fraccionado: 1,

            _id: 0,
        }
    );

    if (registroInmueble) {
        /*
        Cada elemento del array "pagos_mensuales" tendra contenido el siguiente objeto:
        {
            fecha: ...., // date
            pago_bs: #, // number maximo 2 decimales
        }
        */
        let registroInversionista = await indiceInversiones.findOne(
            {
                codigo_inmueble: codigo_inmueble,
            },
            {
                ci_propietario: 1,
                estado_propietario: 1,

                //-----------------
                pago_primer_bs: 1,
                fecha: 1,
                pago_tipo: 1, // "reserva" o "remate"
                //-----------------

                pagos_mensuales: 1,
                _id: 0,
            }
        );

        if (registroInversionista) {
            // significa que el inmueble si cuenta con pagos de un propietario, ya sea que se trate de un propietario "pasivo" o "activo".

            if (registroInversionista.pago_tipo == "reserva") {
                contenedor_propietario.adquisicion = "Reserva";
            } else {
                contenedor_propietario.adquisicion = "Remate";
            }

            pagado_primer = registroInversionista.pago_primer_bs;

            contenedor_propietario.fecha_re_re = moment
                .utc(registroInversionista.fecha)
                .format("LL"); // muestra solo fecha español

            pagado_actual = registroInversionista.pago_primer_bs;

            pago_nuevo_propietario = registroInversionista.pago_primer_bs;

            let arrayInmuebles = await indiceInmueble.find(
                { codigo_proyecto: registroInmueble.codigo_proyecto },
                {
                    precio_construccion: 1,
                    _id: 0,
                }
            );

            if (arrayInmuebles.length > 0) {
                var [{ precio_proyecto }] = await indiceInmueble.aggregate([
                    {
                        $match: {
                            codigo_proyecto: registroInmueble.codigo_proyecto, // Filtra
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            precio_proyecto: { $sum: "$precio_construccion" }, // Suma los precios
                        },
                    },
                ]);

                //console.log("La suma de precios es :", precio_proyecto);
                var fraccion_inm = registroInmueble.precio_construccion / precio_proyecto;
            } else {
                var fraccion_inm = 0;
            }

            let registroProyecto = await indiceProyecto.findOne(
                { codigo_proyecto: registroInmueble.codigo_proyecto },
                {
                    // [ {fecha: Date, pago_bs: Number}, {fecha: Date, pago_bs: Number} , ... , {fecha: Date, pago_bs: Number} ] LOS PAGOS en moneda Bs (bolivianos)
                    construccion_mensual: 1,

                    _id: 0,
                }
            );

            if (registroProyecto) {
                let array_construccion_py = registroProyecto.construccion_mensual;
                if (array_construccion_py.length > 0) {
                    let array_construccion_inm = [];
                    for (let i = 0; i < array_construccion_py.length; i++) {
                        let fecha = array_construccion_py[i].fecha;
                        let pago_bs = array_construccion_py[i].pago_bs;
                        array_construccion_inm[i] = {
                            fecha: fecha, // esta en tipo string ej: "2010-10-10"
                            // Math.round redondea al entero mas cercano devolviendolo en tipo numerico
                            pago_bs: Math.round(pago_bs * fraccion_inm),
                        };
                    }

                    // armado de los pago que hizo el propietario (sea activo o pasivo)
                    let array_const_prop = registroInversionista.pagos_mensuales;
                    if (array_const_prop.length > 0) {
                        for (let i = 0; i < array_construccion_inm.length; i++) {
                            if (array_const_prop[i]) {
                                // ej "2010-10-10"
                                let aux_fecha = array_const_prop[i].fecha;

                                // Convertir string ej "2010-10-10" a tipo Date ej 2010-10-10T00:00:00.000Z
                                let fechaDate = new Date(aux_fecha); // ej: 2010-10-10T00:00:00.000Z

                                // si existe pago realizado por el propietario
                                cronograma_pagos[i] = {
                                    orden: i + 1,
                                    fecha: fechaDate,
                                    fecha_render: moment.utc(fechaDate).format("LL"), // muestra solo fecha español,
                                    pago_bs: array_const_prop[i].pago_bs,
                                    pago_bs_render: numero_punto_coma(array_const_prop[i].pago_bs),
                                    leyenda_pago: "Pagado",
                                    color_css: "verde",
                                };

                                pagado_actual = pagado_actual + array_const_prop[i].pago_bs;
                                pago_nuevo_propietario =
                                    pago_nuevo_propietario + array_const_prop[i].pago_bs;
                            } else {
                                // "new Date()" nos devuelve la fecha actual
                                let fecha_actual = new Date();

                                // ej "2010-10-10"
                                let aux_fecha = array_construccion_inm[i].fecha;

                                // Convertir string ej "2010-10-10" a tipo Date ej 2010-10-10T00:00:00.000Z
                                let fechaDate = new Date(aux_fecha); // ej: 2010-10-10T00:00:00.000Z

                                if (fecha_actual >= fechaDate) {
                                    cronograma_pagos[i] = {
                                        orden: i + 1,
                                        fecha: fechaDate,
                                        fecha_render: moment.utc(fechaDate).format("LL"), // muestra solo fecha español,
                                        pago_bs: array_construccion_inm[i].pago_bs,
                                        pago_bs_render: numero_punto_coma(
                                            array_construccion_inm[i].pago_bs
                                        ),
                                        leyenda_pago: "Demora",
                                        color_css: "rojo",
                                    };

                                    pago_nuevo_propietario =
                                        pago_nuevo_propietario + array_construccion_inm[i].pago_bs;

                                    esta_remate = true;

                                    deuda_demora = deuda_demora + array_construccion_inm[i].pago_bs;
                                } else {
                                    // ej "2010-10-10"
                                    let aux_fecha = array_construccion_inm[i].fecha;

                                    // Convertir string ej "2010-10-10" a tipo Date ej 2010-10-10T00:00:00.000Z
                                    let fechaDate = new Date(aux_fecha); // ej: 2010-10-10T00:00:00.000Z

                                    cronograma_pagos[i] = {
                                        orden: i + 1,
                                        fecha: fechaDate,
                                        fecha_render: moment.utc(fechaDate).format("LL"), // muestra solo fecha español,
                                        pago_bs: array_construccion_inm[i].pago_bs,
                                        pago_bs_render: numero_punto_coma(
                                            array_construccion_inm[i].pago_bs
                                        ),
                                        leyenda_pago: "Pendiente",
                                        color_css: "gris",
                                    };
                                }
                            }
                        } // fin for

                        // el pagado_actual ya considera la sumatoria de todos los pagos que hizo el  propietario (activo o pasivo)
                        // el pago_nuevo_propietario ya considera la sumatoria de todo el pago que debera pagar el nuevo propietario si deseara adquirir el inmueble.
                    }
                }
            }

            // si el propietario esta activo, entonces seran mostrados sus datos personales, documentos y pagos que haya efectuado

            if (registroInversionista.estado_propietario == "activo") {
                existe_propietario = true;
            } else {
                // se lo tomara como propietario "pasivo"
                existe_propietario = false;
            }
        } else {
            // significa que el inmueble no cuenta con ningun pago de ningun propietario
            // por tanto se lo considerara como inmueble en estado de "disponible"

            esta_disponible = true;

            existe_propietario = false;

            //-----------------------------------------------------
            let registro_terreno = await indiceTerreno.findOne(
                {
                    codigo_terreno: registroInmueble.codigo_terreno,
                },
                {
                    estado_terreno: 1,
                    precio_bs: 1,
                    descuento_bs: 1,
                    rend_fraccion_mensual: 1,
                    superficie: 1,
                    fecha_inicio_convocatoria: 1,
                    fecha_inicio_reservacion: 1,
                    fecha_fin_reservacion: 1,
                    fecha_fin_construccion: 1,
                    _id: 0,
                }
            );

            let registro_proyecto = await indiceProyecto.findOne(
                {
                    codigo_proyecto: registroInmueble.codigo_proyecto,
                },
                {
                    construccion_mensual: 1,
                    _id: 0,
                }
            );

            if (registro_terreno && registro_proyecto) {
                //--------------------------------------------------------------
                var datos_inm = {
                    // datos del inmueble
                    codigo_inmueble,
                    precio_construccion: registroInmueble.precio_construccion,
                    precio_competencia: registroInmueble.precio_competencia,
                    superficie_inmueble: registroInmueble.superficie_inmueble_m2,
                    fraccionado: registroInmueble.fraccionado,
                    // datos del proyecto
                    construccion_mensual: registro_proyecto.construccion_mensual,
                    // datos del terreno
                    estado_terreno: registro_terreno.estado_terreno,
                    precio_terreno: registro_terreno.precio_bs,
                    descuento_terreno: registro_terreno.descuento_bs,
                    rend_fraccion_mensual: registro_terreno.rend_fraccion_mensual,
                    superficie_terreno: registro_terreno.superficie,
                    fecha_inicio_convocatoria: registro_terreno.fecha_inicio_convocatoria,
                    fecha_inicio_reservacion: registro_terreno.fecha_inicio_reservacion,
                    fecha_fin_reservacion: registro_terreno.fecha_fin_reservacion,
                    fecha_fin_construccion: registro_terreno.fecha_fin_construccion,
                };
                var resultado = await super_info_inm(datos_inm);

                var derecho_suelo = resultado.derecho_suelo;

                //--------------------------------------------------------------

                pago_nuevo_propietario = derecho_suelo;
            }
            //-----------------------------------------------------
        }

        if (existe_propietario) {
            //-----------------------------------------------------------
            // para el armado de datos personales del propietario

            let registro_propietario = await indice_propietario.findOne(
                {
                    ci_propietario: registroInversionista.ci_propietario,
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

                //-----------------------------------------------------------
                // para el armado de documentos del propietario

                // DOCUMENTOS PRIVADOS DEL PROPIETARIO
                var registro_documentos_priv = await indiceDocumentos.find({
                    ci_propietario: registroInversionista.ci_propietario,
                    codigo_inmueble: codigo_inmueble,
                    clase_documento: "Propietario",
                });

                if (registro_documentos_priv.length > 0) {
                    for (let p = 0; p < registro_documentos_priv.length; p++) {
                        documentos_privados[p] = {
                            codigo_inmueble: registro_documentos_priv[p].codigo_inmueble,
                            nombre_documento: registro_documentos_priv[p].nombre_documento,
                            codigo_documento: registro_documentos_priv[p].codigo_documento,
                            url: registro_documentos_priv[p].url,
                        };
                    }
                }

                //-----------------------------------------------------------
            } else {
                contenedor_propietario.propietario_datos = {
                    ci_propietario: "",
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
        } // fin existe_propietario
    } // fin de registroInmueble

    contenedor_propietario.esta_disponible = esta_disponible; // true o false
    contenedor_propietario.esta_remate = esta_remate; // true o false
    contenedor_propietario.cronograma_pagos = cronograma_pagos;
    contenedor_propietario.documentos_privados = documentos_privados;
    contenedor_propietario.existe_propietario = existe_propietario; // true o false

    contenedor_propietario.pagado_actual = pagado_actual;
    contenedor_propietario.pago_nuevo_propietario = pago_nuevo_propietario;
    contenedor_propietario.deuda_demora = deuda_demora;

    contenedor_propietario.pagado_primer = pagado_primer;
    contenedor_propietario.pagado_primer_r = numero_punto_coma(pagado_primer);

    contenedor_propietario.pagado_actual_render = numero_punto_coma(pagado_actual);
    contenedor_propietario.pago_nuevo_propietario_render =
        numero_punto_coma(pago_nuevo_propietario);
    contenedor_propietario.deuda_demora_render = numero_punto_coma(deuda_demora);

    //--------------------------------------------------------------------------

    return contenedor_propietario;
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// solo mostrara los datos actuales del propietario

funcionesAyuda_2.datos_propietario = async function (ci_propietario) {
    moment.locale("es");

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

        // para indicar que se trata de un propietario cuyos datos ya se encuentran registrados en la base de datos.
        propietario_datos.propietario_registrado = true;
    } else {
        // es un propietario completamente nuevo que aun no existe en la base de datos

        propietario_datos = {
            ci_propietario: ci_propietario,
            // para indicar que se trata de un propietario nuevo. Que no esta registrado en la base de datos
            propietario_registrado: false,
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

    return propietario_datos;
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// solo mostrara los datos DATOS PERSONALES, DOCUMENTOS PRIVADOS actuales del propietario.
// VALIDO PARA COPROPIETARIO DE INMUEBLE Y TERRENO

funcionesAyuda_2.datos_copropietario = async function (paquete_datos) {
    var ci_propietario = paquete_datos.ci_propietario;
    var codigo_objetivo = paquete_datos.codigo_objetivo; // codigo_inmueble || codigo_terreno || codigo_fraccion
    var copropietario = paquete_datos.copropietario; // "inmueble" || "terreno" || "fraccion"

    // valores por defecto
    var tiene_datos = false;

    moment.locale("es");

    //--------------------------------------------------------------
    // datos personales

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
        tiene_datos = true;

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

        // para indicar que se trata de un propietario cuyos datos ya se encuentran registrados en la base de datos.
        propietario_datos.propietario_registrado = true;
    } else {
        // es un propietario completamente nuevo que aun no existe en la base de datos

        var propietario_datos = {
            ci_propietario: ci_propietario,
            // para indicar que se trata de un propietario nuevo. Que no esta registrado en la base de datos
            propietario_registrado: false,
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

    //--------------------------------------------------------------
    // las documentos privados que tienen relacion con las fracciones que tiene el copropietario del terreno o inmueble o fraccion. Para ello se necesita el codigo del terreno o inmueble o fraccion respectivamente

    var documentos_privados = [];

    if (copropietario === "terreno") {
        var registro_documentos_priv = await indiceDocumentos.find({
            codigo_terreno: codigo_objetivo,
            ci_propietario: ci_propietario,
            clase_documento: "Propietario",
        });
    }

    if (copropietario === "inmueble") {
        var registro_documentos_priv = await indiceDocumentos.find({
            codigo_inmueble: codigo_objetivo,
            ci_propietario: ci_propietario,
            clase_documento: "Propietario",
        });
    }

    if (copropietario === "fraccion") {
        let codigo_fraccion = codigo_objetivo;
        // en caso de documentos que guardan relacion con la fraccion, se buscaran en los registros privados tento de terreno, como de inmueble.

        var fraccionInmueble = await indiceFraccionInmueble.findOne(
            {
                codigo_fraccion: codigo_fraccion,
                tipo: "copropietario",
                disponible: false,
                ci_propietario: ci_propietario,
            },
            {
                codigo_inmueble: 1,
                codigo_terreno: 1,
            }
        );

        if (fraccionInmueble) {
            let codigo_inmueble = fraccionInmueble.codigo_inmueble;
            let codigo_terreno = fraccionInmueble.codigo_terreno;

            let cc = -1;

            //-------------------------------
            let documentos_priv_inm = await indiceDocumentos.find({
                codigo_inmueble: codigo_inmueble,
                ci_propietario: ci_propietario,
                clase_documento: "Propietario",
            });

            if (documentos_priv_inm.length > 0) {
                for (let i = 0; i < documentos_priv_inm.length; i++) {
                    cc = cc + 1;
                    documentos_privados[cc] = {
                        nombre_documento: documentos_priv_inm[cc].nombre_documento,
                        codigo_documento: documentos_priv_inm[cc].codigo_documento,
                        url: documentos_priv_inm[cc].url,
                    };
                }
            }

            //------------------------------

            let documentos_priv_te = await indiceDocumentos.find({
                codigo_terreno: codigo_terreno,
                ci_propietario: ci_propietario,
                clase_documento: "Propietario",
            });

            if (documentos_priv_te.length > 0) {
                for (let i = 0; i < documentos_priv_te.length; i++) {
                    cc = cc + 1;
                    documentos_privados[cc] = {
                        nombre_documento: documentos_priv_te[cc].nombre_documento,
                        codigo_documento: documentos_priv_te[cc].codigo_documento,
                        url: documentos_priv_te[cc].url,
                    };
                }
            }

        } else {
            var fraccionTerreno = await indiceFraccionTerreno.findOne(
                {
                    codigo_fraccion: codigo_fraccion,
                    disponible: false,
                    ci_propietario: ci_propietario,
                },
                {
                    codigo_terreno: 1,
                }
            );

            if (fraccionTerreno) {
                let codigo_terreno = fraccionTerreno.codigo_terreno;
                var registro_documentos_priv = await indiceDocumentos.find({
                    codigo_terreno: codigo_terreno,
                    ci_propietario: ci_propietario,
                    clase_documento: "Propietario",
                });
            }
        }
    }

    if (registro_documentos_priv.length > 0) {
        for (let p = 0; p < registro_documentos_priv.length; p++) {
            documentos_privados[p] = {
                nombre_documento: registro_documentos_priv[p].nombre_documento,
                codigo_documento: registro_documentos_priv[p].codigo_documento,
                url: registro_documentos_priv[p].url,
                codigo_inmueble: codigo_objetivo,
            };
        }
    }

    propietario_datos.documentos_privados = documentos_privados;
    propietario_datos.tiene_datos = tiene_datos;

    //--------------------------------------------------------------

    return propietario_datos;
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = funcionesAyuda_2;
