const {
    indiceFraccionInmueble,
    indiceFraccionTerreno,
    indiceInversiones,
    indiceInmueble,
    indiceTerreno,
    indiceProyecto,
} = require("../modelos/indicemodelo");
const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");
const moment = require("moment");

const funcionesAyuda_5 = {};

// ====================================================================================
// ====================================================================================
// INFORMACION DE INMUEBLE

funcionesAyuda_5.super_info_inm = async function (paquete_datos) {
    try {
        //--------------------------------------------------------------
        // datos del inmueble
        var codigo_inmueble = paquete_datos.codigo_inmueble;
        var precio_construccion = paquete_datos.precio_construccion; // del inmueble
        var precio_competencia = paquete_datos.precio_competencia;
        var superficie_inmueble = paquete_datos.superficie_inmueble;
        var fraccionado = paquete_datos.fraccionado; // true o false

        //-------------------------------------------------------------
        // datos del proyecto
        var construccion_mensual = paquete_datos.construccion_mensual;

        //-------------------------------------------------------------
        // datos del terreno
        var estado_terreno = paquete_datos.estado_terreno;
        var precio_terreno = paquete_datos.precio_terreno; // ya considera el descuento del terreno
        var descuento_terreno = paquete_datos.descuento_terreno;
        var rend_fraccion_mensual = paquete_datos.rend_fraccion_mensual;
        var superficie_terreno = paquete_datos.superficie_terreno;
        var fecha_inicio_convocatoria = paquete_datos.fecha_inicio_convocatoria;
        var fecha_inicio_reservacion = paquete_datos.fecha_inicio_reservacion;
        var fecha_fin_reservacion = paquete_datos.fecha_fin_reservacion;
        var fecha_fin_construccion = paquete_datos.fecha_fin_construccion;

        //------------------------------------------------------
        // precio_justo_inm

        var paquete_datos_a = {
            codigo_inmueble,
            precio_construccion,
            precio_competencia,
            precio_terreno,
            descuento_terreno,
            rend_fraccion_mensual,
            superficie_terreno,
            superficie_inmueble,
            fecha_inicio_convocatoria,
            fraccionado,
        };
        var resultadoPrecioJusto = await precio_justo_inm(paquete_datos_a);

        var derecho_suelo = resultadoPrecioJusto.derecho_suelo;
        var derecho_suelo_render = resultadoPrecioJusto.derecho_suelo_render;
        var precio_justo = resultadoPrecioJusto.precio_justo;
        var precio_justo_render = resultadoPrecioJusto.precio_justo_render;
        var plusvalia = resultadoPrecioJusto.plusvalia;
        var plusvalia_render = resultadoPrecioJusto.plusvalia_render;
        var descuento_suelo = resultadoPrecioJusto.descuento_suelo;
        var descuento_suelo_render = resultadoPrecioJusto.descuento_suelo_render;

        //---------------------------------------------------------------
        // financiamiento_inm

        var paquete_datos_b = {
            estado_terreno,
            fraccionado,
            codigo_inmueble,
            fecha_fin_reservacion,
            fecha_fin_construccion,
            derecho_suelo,
            precio_justo,
        };
        var resultadoFinanciamiento = await financiamiento_inm(paquete_datos_b);

        var plazo_titulo = resultadoFinanciamiento.plazo_titulo;
        var plazo_tiempo = resultadoFinanciamiento.plazo_tiempo;
        var p_financiamiento = resultadoFinanciamiento.p_financiamiento;
        var p_financiamiento_render = resultadoFinanciamiento.p_financiamiento_render;
        var financiamiento = resultadoFinanciamiento.financiamiento;
        var financiamiento_render = resultadoFinanciamiento.financiamiento_render;
        var meta = resultadoFinanciamiento.meta;
        var meta_render = resultadoFinanciamiento.meta_render;

        //---------------------------------------------------------------
        // refracu_inm

        var paquete_datos_c = {
            codigo_inmueble,
            derecho_suelo,
            precio_construccion,
            estado_terreno,
            fraccionado,
            construccion_mensual,
        };
        var resultadoRefracu = await refracu_inm(paquete_datos_c);

        var refracu = resultadoRefracu.refracu; // true o false (para mostrar u ocultar)
        var titulo_refracu = resultadoRefracu.titulo_refracu; // vacio o Fracción o Cuota
        var valor_refracu = resultadoRefracu.valor_refracu; // 0 o valor de la fraccion u cuota
        var valor_refracu_render = resultadoRefracu.valor_refracu_render;
        var menor_igual = resultadoRefracu.menor_igual; // true o false (para mostrar u ocultar el simbolo de menor o igual)
        var ver_fraccion = resultadoRefracu.ver_fraccion; // true o false
        var ver_reserva = resultadoRefracu.ver_reserva; // true o false
        var ver_cuota = resultadoRefracu.ver_cuota; // true o false

        //---------------------------------------------------------------
        // para segundero

        var fecha_inicio = fecha_inicio_reservacion;
        var fecha_fin = fecha_fin_construccion;

        let d_segundos = (fecha_fin - fecha_inicio + 1000) / 1000;
        var r_plus = plusvalia / d_segundos; // bs/seg

        //---------------------------------------------------------------
        // Resultado

        var resultado = {
            //------------------------------
            // precio justo, derecho suelo, plusvalia
            derecho_suelo,
            derecho_suelo_render,
            precio_justo,
            precio_justo_render,
            plusvalia,
            plusvalia_render,
            descuento_suelo,
            descuento_suelo_render,
            //------------------------------
            // financiamiento, meta, porcentaje
            plazo_titulo,
            plazo_tiempo,
            p_financiamiento,
            p_financiamiento_render,
            financiamiento,
            financiamiento_render,
            meta,
            meta_render,
            //-----------------------
            // reserva, fraccio , cuota
            refracu,
            titulo_refracu,
            valor_refracu,
            valor_refracu_render,
            menor_igual,
            ver_fraccion,
            ver_reserva,
            ver_cuota,
            //-----------------------
            // para segundero
            fecha_inicio,
            fecha_fin,
            r_plus, // bs/seg
            //-----------------------
        };

        return resultado;
    } catch (error) {
        console.log(error);
    }
};

// ====================================================================================
// ====================================================================================
// INFORMACION DE PROYECTO

funcionesAyuda_5.super_info_py = async function (paquete_datos) {
    try {
        //-------------------------------------------------------------
        // datos del proyecto
        var codigo_proyecto = paquete_datos.codigo_proyecto;

        //-------------------------------------------------------------
        // datos del terreno
        var estado_terreno = paquete_datos.estado_terreno;
        var precio_terreno = paquete_datos.precio_terreno; // ya considera el descuento del terreno
        var descuento_terreno = paquete_datos.descuento_terreno;
        var rend_fraccion_mensual = paquete_datos.rend_fraccion_mensual;
        var superficie_terreno = paquete_datos.superficie_terreno;
        var fecha_inicio_convocatoria = paquete_datos.fecha_inicio_convocatoria;
        var fecha_inicio_reservacion = paquete_datos.fecha_inicio_reservacion;
        var fecha_fin_reservacion = paquete_datos.fecha_fin_reservacion;
        var fecha_fin_construccion = paquete_datos.fecha_fin_construccion;

        //--------------------------------------------------------------

        var arrayInmuebles = await indiceInmueble.find(
            {
                codigo_proyecto: codigo_proyecto,
            },
            {
                codigo_inmueble: 1,
                precio_construccion: 1,
                precio_competencia: 1,
                superficie_inmueble: 1,
                fraccionado: 1,

                estado_inmueble: 1, // agragado solo para "super_info_py"
                dormitorios_inmueble: 1, // agragado solo para "super_info_py"
                banos_inmueble: 1, // agragado solo para "super_info_py"

                _id: 0,
            }
        );

        var sum_disponibles = 0; // por defecto
        var sum_precio_justo = 0; // por defecto
        var sum_plusvalia = 0; // por defecto
        var sum_derecho_suelo = 0; // por defecto
        var sum_descuento_suelo = 0; // por defecto
        var sum_financiamiento = 0; // por defecto
        var sum_meta = 0; // por defecto

        var sum_dormitorios = 0; // por defecto
        var sum_banos = 0; // por defecto

        var array_segundero = []; // por defecto, para segundero
        var d_segundos = (fecha_fin_construccion - fecha_inicio_reservacion + 1000) / 1000; // para segundero

        if (arrayInmuebles.length > 0) {
            for (let i = 0; i < arrayInmuebles.length; i++) {
                if (arrayInmuebles[i].estado_inmueble == "disponible") {
                    sum_disponibles = sum_disponibles + 1;
                }

                sum_dormitorios = sum_dormitorios + arrayInmuebles[i].dormitorios_inmueble;
                sum_banos = sum_banos + arrayInmuebles[i].banos_inmueble;

                //--------------------------------------------------------------
                // datos del inmueble
                var codigo_inmueble = arrayInmuebles[i].codigo_inmueble;
                var precio_construccion = arrayInmuebles[i].precio_construccion; // del inmueble
                var precio_competencia = arrayInmuebles[i].precio_competencia;
                var superficie_inmueble = arrayInmuebles[i].superficie_inmueble;
                var fraccionado = arrayInmuebles[i].fraccionado; // true o false

                //------------------------------------------------------
                // precio_justo_inm

                var paquete_datos_a = {
                    codigo_inmueble,
                    precio_construccion,
                    precio_competencia,
                    precio_terreno,
                    descuento_terreno,
                    rend_fraccion_mensual,
                    superficie_terreno,
                    superficie_inmueble,
                    fecha_inicio_convocatoria,
                    fraccionado,
                };
                var resultadoPrecioJusto = await precio_justo_inm(paquete_datos_a);

                var derecho_suelo = resultadoPrecioJusto.derecho_suelo;
                var precio_justo = resultadoPrecioJusto.precio_justo;
                var plusvalia = resultadoPrecioJusto.plusvalia;
                var descuento_suelo = resultadoPrecioJusto.descuento_suelo;

                //---------------------------------------------------------------
                // financiamiento_inm

                var paquete_datos_b = {
                    estado_terreno,
                    fraccionado,
                    codigo_inmueble,
                    fecha_fin_reservacion,
                    fecha_fin_construccion,
                    derecho_suelo,
                    precio_justo,
                };
                var resultadoFinanciamiento = await financiamiento_inm(paquete_datos_b);

                var plazo_titulo = resultadoFinanciamiento.plazo_titulo;
                var plazo_tiempo = resultadoFinanciamiento.plazo_tiempo;
                var financiamiento = resultadoFinanciamiento.financiamiento;
                var meta = resultadoFinanciamiento.meta;

                //---------------------------------------------------------------
                sum_precio_justo = sum_precio_justo + precio_justo;
                sum_plusvalia = sum_plusvalia + plusvalia;
                sum_derecho_suelo = sum_derecho_suelo + derecho_suelo;
                sum_descuento_suelo = sum_descuento_suelo + descuento_suelo;
                sum_financiamiento = sum_financiamiento + financiamiento;
                sum_meta = sum_meta + meta;

                //---------------------------------------------------------------
                // para segundero
                var r_plus = plusvalia / d_segundos; // bs/seg

                array_segundero[i] = {
                    plus_r: r_plus,
                    plus_fechaInicio: fecha_inicio_reservacion,
                    plus_fechaFin: fecha_fin_construccion,
                };
                //---------------------------------------------------------------
            } // fin for
        } // fin if

        var inmuebles_total = arrayInmuebles.length;
        var inmuebles_disponibles = sum_disponibles;
        var dormitorios_total = sum_dormitorios;
        var banos_total = sum_banos;

        var precio_justo_total = sum_precio_justo;
        var plusvalia_total = sum_plusvalia;
        var derecho_suelo_total = sum_derecho_suelo;
        var descuento_suelo_total = sum_descuento_suelo;
        var financiamiento_total = sum_financiamiento;
        var meta_total = sum_meta;

        let string_p_financiamiento = ((financiamiento_total / meta_total) * 100).toFixed(2);
        var p_financiamiento = Number(string_p_financiamiento); // numerico con 2 decimales

        //---------------------------------------------------------------
        // Resultado

        var resultado = {
            //------------------------------
            inmuebles_total: numero_punto_coma(inmuebles_total),
            inmuebles_disponibles: numero_punto_coma(inmuebles_disponibles),
            dormitorios_total: numero_punto_coma(dormitorios_total),
            banos_total: numero_punto_coma(banos_total),
            //------------------------------
            // precio justo, derecho suelo, plusvalia
            derecho_suelo: derecho_suelo_total,
            derecho_suelo_render: numero_punto_coma(derecho_suelo_total),
            precio_justo: precio_justo_total,
            precio_justo_render: numero_punto_coma(precio_justo_total),
            plusvalia: plusvalia_total,
            plusvalia_render: numero_punto_coma(plusvalia_total),
            descuento_suelo: descuento_suelo_total,
            descuento_suelo_render: numero_punto_coma(descuento_suelo_total),
            //------------------------------
            // financiamiento, meta, porcentaje
            // dado que todos los inmuebles pertenecen al mismo py, entonces la "plazo_titulo" y "plazo_tiempo" de cualquira de ellos sera valido para representar a todo el py
            plazo_titulo,
            plazo_tiempo,
            p_financiamiento,
            p_financiamiento_render: numero_punto_coma(p_financiamiento),
            financiamiento: financiamiento_total,
            financiamiento_render: numero_punto_coma(financiamiento_total),
            meta: meta_total,
            meta_render: numero_punto_coma(meta_total),
            //-----------------------
            // para segundero
            array_segundero,
            //-----------------------
        };

        return resultado;
    } catch (error) {
        console.log(error);
    }
};

// ====================================================================================
// ====================================================================================
// INFORMACION DE TERRENO

funcionesAyuda_5.super_info_te = async function (paquete_datos) {
    try {
        //---------------------------------------------------------------
        // Datos terreno
        var codigo_terreno = paquete_datos.codigo_terreno;
        var precio_terreno = paquete_datos.precio_terreno;
        var fecha_fin_convocatoria = paquete_datos.fecha_fin_convocatoria;

        //---------------------------------------------------------------
        // financiamiento_te

        var paquete_datos_b = {
            codigo_terreno,
            precio_terreno,
            fecha_fin_convocatoria,
        };
        var resultadoFinanciamiento = await financiamiento_te(paquete_datos_b);

        var fracciones_disponibles = resultadoFinanciamiento.fracciones_disponibles;
        var fracciones_invertidas = resultadoFinanciamiento.fracciones_invertidas;
        var plazo_titulo = resultadoFinanciamiento.plazo_titulo;
        var plazo_tiempo = resultadoFinanciamiento.plazo_tiempo;
        var meta = resultadoFinanciamiento.meta;
        var meta_render = resultadoFinanciamiento.meta_render;
        var financiamiento = resultadoFinanciamiento.financiamiento;
        var financiamiento_render = resultadoFinanciamiento.financiamiento_render;
        var p_financiamiento = resultadoFinanciamiento.p_financiamiento;
        var p_financiamiento_render = resultadoFinanciamiento.p_financiamiento_render;
        var fraccion = resultadoFinanciamiento.fraccion;
        var fraccion_render = resultadoFinanciamiento.fraccion_render;

        //---------------------------------------------------------------
        // RESULTADO

        var resultado = {
            fracciones_disponibles, // #
            fracciones_invertidas, // #
            plazo_titulo,
            plazo_tiempo,
            meta,
            meta_render,
            financiamiento,
            financiamiento_render,
            p_financiamiento, // %
            p_financiamiento_render, // %
            fraccion, // bs
            fraccion_render, // bs
        };

        return resultado;
    } catch (error) {
        console.log(error);
    }
};

// ====================================================================================
// ====================================================================================
// INFORMACION LA FRACCION

funcionesAyuda_5.super_info_fraccion = async function (paquete_datos) {
    try {
        var codigo_fraccion = paquete_datos.codigo_fraccion;
        var ci_propietario = paquete_datos.ci_propietario; // ci_propietario || "ninguno"
        //------------------------------------------------------

        var datos_fraccion = {
            codigo_fraccion,
            ci_propietario,
        };
        var resultadoDatosFraccion = await informacion_fraccion(datos_fraccion);

        var fraccion_bs = resultadoDatosFraccion.fraccion_bs;
        var fraccion_bs_render = resultadoDatosFraccion.fraccion_bs_render;
        var ganancia_bs = resultadoDatosFraccion.ganancia_bs;
        var ganancia_bs_render = resultadoDatosFraccion.ganancia_bs_render;
        var plusvalia_bs = resultadoDatosFraccion.plusvalia_bs;
        var plusvalia_bs_render = resultadoDatosFraccion.plusvalia_bs_render;
        var existe_inversionista = resultadoDatosFraccion.existe_inversionista;
        var existe_copropietario = resultadoDatosFraccion.existe_copropietario;
        var menor_igual = resultadoDatosFraccion.menor_igual;
        var verde = resultadoDatosFraccion.verde;
        var gris = resultadoDatosFraccion.gris;
        var azul = resultadoDatosFraccion.azul;
        var dias_plusvalia = resultadoDatosFraccion.dias_plusvalia;
        var dias_inversionista = resultadoDatosFraccion.dias_inversionista;
        var inversionista_color = resultadoDatosFraccion.inversionista_color;
        var inversionista_leyenda = resultadoDatosFraccion.inversionista_leyenda;
        var copropietario_color = resultadoDatosFraccion.copropietario_color;
        var copropietario_leyenda = resultadoDatosFraccion.copropietario_leyenda;
        var array_segundero = resultadoDatosFraccion.array_segundero;
        var fecha_render = resultadoDatosFraccion.fecha_render;
        var fecha_title = resultadoDatosFraccion.fecha_title;

        //---------------------------------------------------------------
        // resultado

        var resultado = {
            fraccion_bs, // valor de la fraccion
            fraccion_bs_render,
            ganancia_bs,
            ganancia_bs_render,
            plusvalia_bs,
            plusvalia_bs_render,
            existe_inversionista, // (para mostrar ganancia) false o true
            existe_copropietario, // (para mostrar plusvalia) false o true
            menor_igual, // Para mostrar el simbolo de menor igual
            verde, // true o false (true para fracciones disponibles)
            gris, // true o false (true para fracciones NO disponibles)
            azul, // true o false (true para fracciones que pertenecen al ci_propietario analizado)
            dias_plusvalia, // estan en render
            dias_inversionista, // estan en render
            inversionista_color, // "gris" o "verde"
            inversionista_leyenda, // "Completado" o "Vigente"
            copropietario_color, // "gris" o "verde"
            copropietario_leyenda, // "Completado" o "Vigente"
            array_segundero,
            fecha_render, // solo sirve para historial de propietario
            fecha_title, // solo sirve para historial de propietario
        };

        return resultado;
    } catch (error) {
        console.log(error);
    }
};

// ====================================================================================
// ====================================================================================
// INFORMACION DE PROPIETARIO

funcionesAyuda_5.super_info_propietario = async function (paquete_datos) {
    try {
        /*
        PARA INMUEBLES DONDE EL PROPIETARIO ES DUEÑO ABSOLUTO, Nos interesa como resultado: financiamiento, plusvalia y array_segundero (para segundero). Y solo como dato adicional pero no relevante, porque no lo mostraremos: precio justo, valor total, derecho suelo, descuento derecho de suelo, 

        PARA INMUEBLES DONDE EL PROPIETARIO ES CO-PROPIETARIO, nos interesa como resultado:
        plusvalia, ganancia, fraccion_bs y array_segundero (para segundero)
        */

        //-------------------------------------------------------------
        var ci_propietario = paquete_datos.ci_propietario;
        var navegacion = paquete_datos.navegacion; // "administrador" o "cliente" SOLO PARA HISTORIAL PROPIETARIO

        //-------------------------------------------------------------
        // este array acumulara los segundero de inmuebles enteros y todas las fracciones de las que es dueño el propietario. (es por ello que esta decharado al inicio de todo)
        var array_segundero = []; // por defecto, para segundero
        var iseg = -1; // para alamacenar los datos de segundero dentro del array

        var sumFracValor = 0; // por defecto
        var historial_propietario = []; // por defecto
        var sum_precio_justo = 0; // por defecto
        var sum_plusvalia = 0; // por defecto
        var sum_ganancia = 0; // por defecto
        var sum_derecho_suelo = 0; // por defecto
        var sum_descuento_suelo = 0; // por defecto
        var sum_financiamiento = 0; // por defecto
        var sum_meta = 0; // por defecto

        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        // 1º para los INMUEBLES ENTEROS

        // inmuebles de los que el propietario es dueño entero absoluto
        var arrayInmuebles = await indiceInversiones.find(
            {
                ci_propietario: ci_propietario,
                estado_propietario: "activo",
            },
            {
                codigo_proyecto: 1, // solo para historial de propietario
                fecha: 1, // solo para historial de propietario
                codigo_inmueble: 1,
                _id: 0,
            }
        );

        if (arrayInmuebles.length > 0) {
            moment.locale("es");

            //--------------------------------------------

            for (let i = 0; i < arrayInmuebles.length; i++) {
                let codigo_inmueble = arrayInmuebles[i].codigo_inmueble;
                let codigo_proyecto = arrayInmuebles[i].codigo_proyecto;
                let fecha_h = arrayInmuebles[i].fecha;
                var registroInmueble = await indiceInmueble.findOne(
                    {
                        codigo_inmueble: codigo_inmueble,
                    },
                    {
                        codigo_inmueble: 1,
                        codigo_terreno: 1,
                        precio_construccion: 1,
                        precio_competencia: 1,
                        superficie_inmueble_m2: 1,
                        fraccionado: 1, // (para los inm enteros ya viene como false)
                        _id: 0,
                    }
                );

                let registroProyecto = await indiceProyecto.findOne(
                    {
                        codigo_proyecto: codigo_proyecto,
                    },
                    {
                        nombre_proyecto: 1,
                        _id: 0,
                    }
                );

                if (registroInmueble && registroProyecto) {
                    let codigo_terreno = registroInmueble.codigo_terreno;
                    let registroTerreno = await indiceTerreno.findOne(
                        {
                            codigo_terreno: codigo_terreno,
                        },
                        {
                            bandera_ciudad: 1, // solo para historial de propietario
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

                    if (registroTerreno) {
                        //--------------------------------------------------------------
                        // datos del inmueble
                        //var codigo_inmueble = arrayInmuebles[i].codigo_inmueble;
                        var precio_construccion = arrayInmuebles[i].precio_construccion; // del inmueble
                        var precio_competencia = arrayInmuebles[i].precio_competencia;
                        var superficie_inmueble = arrayInmuebles[i].superficie_inmueble_m2;
                        var fraccionado = arrayInmuebles[i].fraccionado; // true o false

                        //-------------------------------------------------------------
                        // datos del terreno
                        var estado_terreno = registroTerreno.estado_terreno;
                        var precio_terreno = registroTerreno.precio_bs; // ya considera el descuento del terreno
                        var descuento_terreno = registroTerreno.descuento_bs;
                        var rend_fraccion_mensual = registroTerreno.rend_fraccion_mensual;
                        var superficie_terreno = registroTerreno.superficie;
                        var fecha_inicio_convocatoria = registroTerreno.fecha_inicio_convocatoria;
                        var fecha_inicio_reservacion = registroTerreno.fecha_inicio_reservacion;
                        var fecha_fin_reservacion = registroTerreno.fecha_fin_reservacion;
                        var fecha_fin_construccion = registroTerreno.fecha_fin_construccion;

                        //--------------------------------------------------------------

                        var d_segundos =
                            (fecha_fin_construccion - fecha_inicio_reservacion + 1000) / 1000; // para segundero

                        //------------------------------------------------------
                        // precio_justo_inm

                        var paquete_datos_a = {
                            codigo_inmueble,
                            precio_construccion,
                            precio_competencia,
                            precio_terreno,
                            descuento_terreno,
                            rend_fraccion_mensual,
                            superficie_terreno,
                            superficie_inmueble,
                            fecha_inicio_convocatoria,
                            fraccionado,
                        };
                        var resultadoPrecioJusto = await precio_justo_inm(paquete_datos_a);

                        var derecho_suelo = resultadoPrecioJusto.derecho_suelo;
                        var precio_justo = resultadoPrecioJusto.precio_justo;
                        var plusvalia = resultadoPrecioJusto.plusvalia;
                        var plusvalia_render = resultadoPrecioJusto.plusvalia_render;
                        var descuento_suelo = resultadoPrecioJusto.descuento_suelo;

                        //---------------------------------------------------------------
                        // financiamiento_inm

                        var paquete_datos_b = {
                            estado_terreno,
                            fraccionado,
                            codigo_inmueble,
                            fecha_fin_reservacion,
                            fecha_fin_construccion,
                            derecho_suelo,
                            precio_justo,
                        };
                        var resultadoFinanciamiento = await financiamiento_inm(paquete_datos_b);

                        var financiamiento = resultadoFinanciamiento.financiamiento;
                        var financiamiento_render = resultadoFinanciamiento.financiamiento_render;
                        var meta = resultadoFinanciamiento.meta;

                        //---------------------------------------------------------------
                        sum_precio_justo = sum_precio_justo + precio_justo;
                        sum_plusvalia = sum_plusvalia + plusvalia;
                        sum_derecho_suelo = sum_derecho_suelo + derecho_suelo;
                        sum_descuento_suelo = sum_descuento_suelo + descuento_suelo;
                        sum_financiamiento = sum_financiamiento + financiamiento;
                        sum_meta = sum_meta + meta;

                        //---------------------------------------------------------------
                        // para segundero
                        var r_plus = plusvalia / d_segundos; // bs/seg
                        iseg = iseg + 1;

                        array_segundero[iseg] = {
                            plus_r: r_plus,
                            plus_fechaInicio: fecha_inicio_reservacion,
                            plus_fechaFin: fecha_fin_construccion,
                        };

                        //---------------------------------------------------------------
                        // para historial de propietario

                        if (navegacion === "administrador") {
                            var laapirest = "laapirest/";
                        } else {
                            if (navegacion === "cliente") {
                                var laapirest = "/";
                            }
                        }

                        let respuesta_estado = estadoTerreno(registroTerreno.estado_terreno);

                        historial_propietario[iseg] = {
                            laapirest,
                            estado: respuesta_estado,
                            terreproy: "proyecto",
                            titulo_terreproy: "Proyecto",
                            nombre_terreproy: registroProyecto.nombre_proyecto,
                            codigo_terreproy: codigo_proyecto,
                            bandera_ciudad: registroTerreno.bandera_ciudad,
                            titulo_producto: "Inmueble",
                            tipo_producto: "inmueble",
                            codigo_producto: codigo_inmueble,
                            titulo_fracpro: "Propietario",
                            fracpro: financiamiento,
                            fracpro_render: financiamiento_render,
                            plusvalia,
                            plusvalia_render,
                            ganancia: 0,
                            ganancia_render: "0",
                            fecha_h,
                            fecha_render: moment(fecha_h).startOf("minute").fromNow(), // hace x dias
                            fecha_title: moment.utc(fecha_h).format("LL"), // muestra solo fecha español,
                        };
                        //---------------------------------------------------------------
                    }
                }
            } // end for
        } // end if

        //let string_p_financiamiento = ((sum_financiamiento / sum_meta) * 100).toFixed(2);
        //var p_financiamiento = Number(string_p_financiamiento); // numerico con 2 decimales

        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        // 2º para las FRACCIONES
        // Primero se revisara las fracciones de terreno, porque pueda que alguna de estas hayan migrado a ser como fracciones de inmuebles

        //----------------------------------------
        // es similar al controlador "fracciones_propietario" de cli_propietario.js o de adm_propietario.js. Solo que aqui modificamos algunas lineas de codigo para que sea mas rapido su ejecusion

        // todas las fracciones que guardan relacion con el propietario
        var aux_fracciones_te = await indiceFraccionTerreno.find(
            { ci_propietario: ci_propietario },
            {
                codigo_fraccion: 1,
                fecha_compra: 1,
                _id: 0,
            }
        );
        var fracciones_terreno = [];

        // todas las fracciones que guardan relacion con el propietario
        // solo consideramos tipo "copropietario", porque las de tipo "inversionista" tienen su origen en la fraccion de terreno.
        var aux_fracciones_inm = await indiceFraccionInmueble.find(
            { ci_propietario: ci_propietario, tipo: "copropietario" },
            {
                codigo_fraccion: 1,
                fecha_copropietario: 1,
                _id: 0,
            }
        );
        var fracciones_inmueble = [];

        if (aux_fracciones_te.length > 0) {
            for (let i = 0; i < aux_fracciones_te.length; i++) {
                fracciones_terreno[i] = {
                    codigo_fraccion: aux_fracciones_te[i].codigo_fraccion,
                    fecha: aux_fracciones_te[i].fecha_compra,
                };
            }
        }

        if (aux_fracciones_inm.length > 0) {
            for (let i = 0; i < aux_fracciones_inm.length; i++) {
                //-------------------------------
                // pueda darse el caso que una fraccion de inmueble de tipo copropietario tenga origen en fraccion de terreno, de modo que estas fracciones copropietario NO SERAN TOMADAS EN CUENTA, porque la fecha origen de estas fracciones es la "fecha_compra" como fraccion de terreno.

                if (fracciones_terreno.length > 0) {
                    let encontrado = false; // Bandera para verificar si ya existe el codigo_fraccion
                    for (let k = 0; k < fracciones_terreno.length; k++) {
                        if (
                            aux_fracciones_inm[i].codigo_fraccion ==
                            fracciones_terreno[k].codigo_fraccion
                        ) {
                            encontrado = true; // Si ya existe, marcamos la bandera como verdadera
                            break; // Salimos del bucle porque ya no necesitamos seguir buscando
                        }
                    }
                    // Si no se encuentra el codigo_fraccion, lo agregamos al array limpio
                    if (!encontrado) {
                        let elemento = {
                            codigo_fraccion: aux_fracciones_inm[i].codigo_fraccion,
                            fecha: aux_fracciones_inm[i].fecha_copropietario,
                        };
                        fracciones_inmueble.push(elemento);
                    }
                } else {
                    fracciones_inmueble[i] = {
                        codigo_fraccion: aux_fracciones_inm[i].codigo_fraccion,
                        fecha: aux_fracciones_inm[i].fecha_copropietario,
                    };
                }
            }
        }

        if (fracciones_terreno.length > 0 || fracciones_inmueble.length > 0) {
            var arrayUnido = [];
            for (let i = 0; i < fracciones_terreno.length; i++) {
                arrayUnido.push(fracciones_terreno[i]); // Agregar elementos del primer array
            }
            for (let i = 0; i < fracciones_inmueble.length; i++) {
                arrayUnido.push(fracciones_inmueble[i]); // Agregar elementos del segundo array
            }

            //-----------------------------------------------------------------

            for (let k = 0; k < arrayUnido.length; k++) {
                var paquete_datos_c = {
                    codigo_fraccion: arrayUnido[k].codigo_fraccion,
                    ci_propietario,
                };
                var resultadoDatosFraccion = await informacion_fraccion(paquete_datos_c);

                var fraccion_bs = resultadoDatosFraccion.fraccion_bs;
                var fraccion_bs_render = resultadoDatosFraccion.fraccion_bs_render;
                var ganancia_bs = resultadoDatosFraccion.ganancia_bs;
                var ganancia_bs_render = resultadoDatosFraccion.ganancia_bs_render;
                var plusvalia_bs = resultadoDatosFraccion.plusvalia_bs;
                var plusvalia_bs_render = resultadoDatosFraccion.plusvalia_bs_render;
                var estado = resultadoDatosFraccion.estado;
                var terreproy = resultadoDatosFraccion.terreproy;
                var titulo_terreproy = resultadoDatosFraccion.titulo_terreproy;
                var nombre_terreproy = resultadoDatosFraccion.nombre_terreproy;
                var codigo_terreproy = resultadoDatosFraccion.codigo_terreproy;
                var bandera_ciudad = resultadoDatosFraccion.bandera_ciudad;

                sumFracValor = sumFracValor + fraccion_bs;
                sum_plusvalia = sum_plusvalia + plusvalia_bs;
                sum_ganancia = sum_ganancia + ganancia_bs;

                iseg = iseg + 1;
                array_segundero[iseg] = resultadoDatosFraccion.array_segundero;

                //---------------------------------------------------------------
                // para historial de propietario

                if (navegacion === "administrador") {
                    var laapirest = "laapirest/";
                } else {
                    if (navegacion === "cliente") {
                        var laapirest = "/";
                    }
                }

                let fecha_h = arrayUnido[k].fecha;

                historial_propietario[iseg] = {
                    laapirest,
                    estado,
                    terreproy,
                    titulo_terreproy,
                    nombre_terreproy,
                    codigo_terreproy,
                    bandera_ciudad,
                    titulo_producto: "Fraccion",
                    tipo_producto: "fraccion",
                    codigo_producto: arrayUnido[k].codigo_fraccion,
                    titulo_fracpro: "Fracción",
                    fracpro: fraccion_bs,
                    fracpro_render: fraccion_bs_render,
                    plusvalia: plusvalia_bs,
                    plusvalia_render: plusvalia_bs_render,
                    ganancia: ganancia_bs,
                    ganancia_render: ganancia_bs_render,
                    fecha_h,
                    fecha_render: moment(fecha_h).startOf("minute").fromNow(), // hace x dias
                    fecha_title: moment.utc(fecha_h).format("LL"), // muestra solo fecha español,
                };
                //---------------------------------------------------------------
            } // fin for k
        }

        //---------------------------------------------------------------
        // ordenamiento del mas reciente al mas antiguo, para el historial de propietario
        if (historial_propietario.length > 0) {
            for (let i = 0; i < historial_propietario.length - 1; i++) {
                for (let j = 0; j < historial_propietario.length - i - 1; j++) {
                    //var fecha1 = new Date(historial_propietario[j].fecha);
                    //var fecha2 = new Date(historial_propietario[j + 1].fecha);
                    var fecha1 = historial_propietario[j].fecha_h;
                    var fecha2 = historial_propietario[j + 1].fecha_h;
                    if (fecha1 < fecha2) {
                        // Intercambiar elementos si no están en el orden correcto
                        var temp = historial_propietario[j];
                        historial_propietario[j] = historial_propietario[j + 1];
                        historial_propietario[j + 1] = temp;
                    }
                }
            }
        }

        //---------------------------------------------------------------
        // Resultado

        var resultado = {
            plusvalia: sum_plusvalia,
            plusvalia_render: numero_punto_coma(sum_plusvalia),
            ganancia: sum_ganancia,
            ganancia_render: numero_punto_coma(sum_ganancia),
            fracciones: sumFracValor,
            fracciones_render: numero_punto_coma(sumFracValor),
            propietario: sum_financiamiento,
            propietario_render: numero_punto_coma(sum_financiamiento),
            array_segundero,
            historial_propietario,

            sum_precio_justo,
            sum_derecho_suelo,
            sum_descuento_suelo,
            sum_meta,
            //p_financiamiento,
        };

        return resultado;
    } catch (error) {
        console.log(error);
    }
};

// ------------------------------------------------------------------------------------
// funcion de la fraccion:

async function informacion_fraccion(paquete_datos) {
    try {

        var codigo_fraccion = paquete_datos.codigo_fraccion;
        var ci_propietario = paquete_datos.ci_propietario; // ci_propietario || "ninguno"

        //---------------------------------------------------------------
        // valores por defecto
        var fraccion_bs = 0;
        var fraccion_bs_render = "0";
        var ganancia_bs = 0;
        var ganancia_bs_render = "0";
        var plusvalia_bs = 0;
        var plusvalia_bs_render = "0";
        var existe_inversionista = false;
        var existe_copropietario = false;
        var menor_igual = false;
        var verde = false;
        var gris = false;
        var azul = false;
        var dias_plusvalia = "0";
        var dias_inversionista = "0";
        var array_segundero = []; // por defecto, para segundero
        var estado = ""; // estado del terreno
        var terreproy = ""; // terreno o proyecto (util para el link url)
        var titulo_terreproy = ""; // Terreno o Proyecto
        var nombre_terreproy = "";
        var codigo_terreproy = "";
        var bandera_ciudad = "";
        //------------------------
        // para los cuadros de inversionista
        // la fraccion pasara a "gris" y "completado" cuando la totalidad de la fraccion sea adquirida como derechos de suelo por propietarios absolutos y solo en ese caso SOLIDEXA pagara al dueño de la fraccion la totalidad de ganancia que le corresponda.
        var inversionista_color = "verde"; // por defecto
        var inversionista_leyenda = "Vigente"; // por defecto
        //------------------------
        // para los cuadros de copropietario
        // aunque una misma fraccion podria formar parte de diferentes inmuebles como copropietario, el "copropietario_color" se pondra en gris y "copropietario_leyenda" dira Vigente cuando el terreno (cual pertenecen todos los inmuebles) pase a estado CONSTRUIDO.
        var copropietario_color = "verde"; // por defecto
        var copropietario_leyenda = "Vigente"; // por defecto
        //---------------------------------------------------------------

        moment.locale("es");

        // puede tratarse de una fraccion de terreno que puede estar disponible a la espera de ser adquirida por un usuario, o que ya fue adquirida por un usuario y que tiene uso TODO como "inversionista" o "copropietario" de un inmueble. O tiene uso "inversionista" y  "copropietario" a la vez de uno o varios inmuebles
        // O se trata de una fraccion puramente de origen inmueble que puede estar disponible a la espera de un usuario que lo compre como "copropietario", o puede ya haber sido adquirido por un usuario y ahora forma parte total como "copropietario" del inmueble. Este tipo de fracciones copropietario no tiene parte como "inversionista".

        var fraccion_terreno = await indiceFraccionTerreno.findOne(
            { codigo_fraccion: codigo_fraccion },
            {
                fraccion_bs: 1,
                disponible: 1,
                codigo_terreno: 1,
                ci_propietario: 1,
                _id: 0,
            }
        );

        if (fraccion_terreno) {

            if (fraccion_terreno.disponible) {
                // OK
                // entonces se trata de una fraccion de terreno que aun esta disponible a la espera de ser adquirido por un usuario

                let registro_terreno = await indiceTerreno.findOne(
                    { codigo_terreno: fraccion_terreno.codigo_terreno },
                    {
                        fecha_inicio_convocatoria: 1, // solo para segundero
                        rend_fraccion_total: 1,
                        dias_maximo: 1,

                        _id: 0,
                    }
                );

                existe_copropietario = false;
                existe_inversionista = true;
                menor_igual = false; // para el simbolo de menor igual

                verde = true;

                fraccion_bs = Math.floor(fraccion_terreno.fraccion_bs);
                fraccion_bs_render = numero_punto_coma(fraccion_bs);

                ganancia_bs = Math.floor(
                    fraccion_terreno.fraccion_bs * (registro_terreno.rend_fraccion_total / 100)
                );
                ganancia_bs_render = numero_punto_coma(ganancia_bs);

                dias_inversionista = numero_punto_coma(Math.floor(registro_terreno.dias_maximo));

                //------------------------------------------------
                // para segundero fraccion
                // mientras la fraccion de terreno esta a la espera de ser comprado por un usuario, la fraccion actua como tipo "inversionista"
                let aux_plus_fechaInicio = registro_terreno.fecha_inicio_convocatoria;
                let plus_fechaInicio = aux_plus_fechaInicio;
                // Usamos el método .setDate() para actualizar el día del mes sumando los días deseados (dias_maximo ejemplo 240).
                aux_plus_fechaInicio.setDate(
                    aux_plus_fechaInicio.getDate() + registro_terreno.dias_maximo
                );
                let plus_fechaFin = aux_plus_fechaInicio; // la aux_plus_fechaInicio ya esta sumado con los dias_maximo (ejemplo 240)
                let d_segundos = (plus_fechaFin - plus_fechaInicio + 1000) / 1000; // para segundero
                let r_plus = ganancia_bs / d_segundos; // bs/seg

                array_segundero[0] = {
                    plus_r: r_plus,
                    plus_fechaInicio,
                    plus_fechaFin,
                };
                //------------------------------------------------
                // LAS FRACCIONES DE TERRENO DISPONIBLES NO TIENEN DATOS PARA SER MOSTRADAS EN EL HISTORIAL DE PROPIETARIO
                //------------------------------------------------
            } else {
                // OK
                // entonces se trata de una fraccion de terreno que a sido comprada por un usuario.
                // toda la fraccion de terreno puede haber sido usado para adquirir una fraccion de inmueble, en ese caso la fraccion de terreno sera una fraccion de inmueble del tipo "copropietario"
                // toda la fraccion de terreno puede estar en espera, hasta que su dueño lo use para adquirir una fraccion de inmueble.
                // toda la fraccion de terreno puede estar en espera, hasta que sea adquririda por un propietario absoluto (el propietario absoluto lo adquiere a travez de la compra de derecho de suelo), una vez que eso suceda, la fraccion de terreno se convertira en una fraccion de inmueble del tipo "inversionista".

                //------------------------------------------------
                // no es necesario añadir en el filtro que disponible: false, porque aqui todas las fracciones de terreno que ingresan a este "if" tienen disponible: false
                var fracciones_inmueble = await indiceFraccionInmueble.find(
                    { codigo_fraccion: codigo_fraccion },
                    {
                        tipo: 1, // "inversionista"  ||  "copropietario"
                        fraccion_bs: 1,
                        ganancia_bs: 1,
                        fecha_inversionista: 1,
                        codigo_inmueble: 1, // util para calcular la plusvalia
                        fecha_pago: 1, // util para tipo "inversionista"
                        _id: 0,
                    }
                );

                if (fracciones_inmueble.length > 0) {
                    // OK
                    // si la fraccion de terreno tiene registro en esta base de datos (indiceFraccionInmueble), significa que fue convertida en una fraccion de inmueble del tipo: "copropietario" o "inverionista" (solo podra ser uno de esos tipos y nunca ambos a la vez)
                    // TODA una fraccion de terreno puede ser convertida en TODA una fraccion de inmueble del tipo "copropietario"
                    // TODA una fraccion de terreno puede ser convertida en TODA una fraccion de inmueble del tipo "inversionista" O EN VARIAS fracciones de inmueble del tipo "inversionista" de diferentes inmuebles que pertenecen al mismo codigo_terreno.

                    var sum_ganancia = 0;
                    var sum_plusvalia = 0;
                    var sum_fraccion_bs = 0; // la sumatoria total debe dar como resultado el valor total de la fraccion (ej/ 2000 $us)
                    var aux_dias_inversionista = 0;

                    // valor total de la fraccion
                    var fraccion_bs_total = fraccion_terreno.fraccion_bs;

                    let registro_terreno = await indiceTerreno.findOne(
                        { codigo_fraccion: fraccion_terreno.codigo_terreno },
                        {
                            fecha_inicio_convocatoria: 1,
                            fecha_inicio_construccion: 1,
                            fecha_fin_construccion: 1,
                            dias_maximo: 1,
                            estado_terreno: 1,
                            fecha_inicio_reservacion: 1, // solo para segundero (cuando tipo de fraccion es copropietario)

                            precio_bs: 1,
                            descuento_bs: 1,
                            rend_fraccion_mensual: 1,
                            superficie: 1,
                            ubicacion: 1, // solo para historial de propietario
                            bandera_ciudad: 1, // solo para historial de propietario
                            _id: 0,
                        }
                    );

                    if (registro_terreno) {
                        // valor total de la fraccion
                        var fecha_inicio_convocatoria = registro_terreno.fecha_inicio_convocatoria;
                        var fecha_inicio_construccion = registro_terreno.fecha_inicio_construccion;
                        var fecha_fin_construccion = registro_terreno.fecha_fin_construccion;
                    }

                    let i_seg = -1; // para almacenador de segundero de la fraccion
                    for (let i = 0; i < fracciones_inmueble.length; i++) {
                        var tipo = fracciones_inmueble[i].tipo;
                        sum_fraccion_bs = sum_fraccion_bs + fracciones_inmueble[i].fraccion_bs;

                        if (tipo === "inversionista") {
                            // cuando la fraccion de terreno (todo o parte de ella) ya fue adquirida por un propietario absoluto como derecho de suelo

                            sum_ganancia = sum_ganancia + fracciones_inmueble[i].ganancia_bs;

                            //----------------------------------
                            // para tiempo de inversionista

                            var tiempoMilisegundos =
                                fracciones_inmueble[i].fecha_inversionista -
                                fecha_inicio_convocatoria;

                            var diasTranscurridos = tiempoMilisegundos / (1000 * 60 * 60 * 24);

                            // es el numero de dias que se maneja como standart para ganancia de rendimientos hasta 16% maximo.
                            var dias_maximo = registro_terreno.dias_maximo;

                            if (diasTranscurridos >= dias_maximo) {
                                var tiempo_inversionista = dias_maximo;
                            } else {
                                var tiempo_inversionista = diasTranscurridos;
                            }

                            if (tiempo_inversionista >= aux_dias_inversionista) {
                                // para quedarnos solo con el numero de dias mayor de inversionista y asi darle a duracion en los card el simbolo de "menor igual que"
                                aux_dias_inversionista = tiempo_inversionista;
                            }
                            //----------------------------------
                            if (fracciones_inmueble[i].fecha_pago) {
                                // si el dueño de la fraccion como "inversionista" recibio el pago de ganancia por su fraccion (una fraccion de terreno que se convirtio en fraccion de inmueble)
                                // basta que tenga fecha_pago, para indicar que la totalidad de la fraccion tendra los siguientes datos:
                                inversionista_color = "gris";
                                inversionista_leyenda = "Completado";
                            }

                            //------------------------------------------------
                            // para segundero fraccion

                            let plus_fechaInicio = fecha_inicio_convocatoria;
                            let plus_fechaFin = fracciones_inmueble[i].fecha_inversionista;
                            let d_segundos = (plus_fechaFin - plus_fechaInicio + 1000) / 1000; // para segundero
                            let r_plus = fracciones_inmueble[i].ganancia_bs / d_segundos; // bs/seg
                            i_seg = i_seg + 1;
                            array_segundero[i_seg] = {
                                plus_r: r_plus,
                                plus_fechaInicio,
                                plus_fechaFin,
                            };
                            //------------------------------------------------
                        }

                        if (tipo === "copropietario") {
                            let registro_inmueble = await indiceInmueble.findOne(
                                { codigo_inmueble: fracciones_inmueble[i].codigo_inmueble },
                                {
                                    codigo_terreno: 1,
                                    precio_construccion: 1,
                                    precio_competencia: 1,
                                    superficie_inmueble_m2: 1,
                                    fraccionado: 1,
                                    _id: 0,
                                }
                            );

                            if (registro_inmueble) {
                                //------------------------------------------------------------
                                // datos del inmueble
                                let codigo_inmueble = fracciones_inmueble[i].codigo_inmueble;
                                let precio_construccion = registro_inmueble.precio_construccion; // del inmueble
                                let precio_competencia = registro_inmueble.precio_competencia;
                                let superficie_inmueble = registro_inmueble.superficie_inmueble_m2;
                                let fraccionado = registro_inmueble.fraccionado; // true o false

                                //-------------------------------------------------------------
                                // datos del terreno

                                let precio_terreno = registro_terreno.precio_bs; // ya considera el descuento del terreno
                                let descuento_terreno = registro_terreno.descuento_bs;
                                let rend_fraccion_mensual = registro_terreno.rend_fraccion_mensual;
                                let superficie_terreno = registro_terreno.superficie;
                                let fecha_inicio_convocatoria =
                                    registro_terreno.fecha_inicio_convocatoria;

                                //------------------------------------------------------
                                // precio_justo_inm

                                var paquete_datos_a = {
                                    codigo_inmueble,
                                    precio_construccion,
                                    precio_competencia,
                                    precio_terreno,
                                    descuento_terreno,
                                    rend_fraccion_mensual,
                                    superficie_terreno,
                                    superficie_inmueble,
                                    fecha_inicio_convocatoria,
                                    fraccionado,
                                };
                                let resultadoPrecioJusto = await precio_justo_inm(paquete_datos_a);

                                let precio_justo = resultadoPrecioJusto.precio_justo;
                                let plusvalia = resultadoPrecioJusto.plusvalia;

                                //------------------------------------------------------------

                                var participacion =
                                    fracciones_inmueble[i].fraccion_bs / precio_justo;

                                // redondeando al entero inmediato inferior
                                var aux_plusvalia = Math.floor(participacion * plusvalia);

                                sum_plusvalia = sum_plusvalia + aux_plusvalia;

                                //----------------------------------------------
                                if (registro_terreno.estado_terreno === "construido") {
                                    // vasta que el terreno este en estado "construido" para que todas las fracciones de terreno que luego se conviertan a fracciones de inmueble o fracciones de inmueble puros, (todas las fracciones que guardan relacion con el terreno) que sean del tipo COPROPIETARIO, pasaran a tener los siguientes datos
                                    copropietario_color = "gris";
                                    copropietario_leyenda = "Completado";
                                }

                                //------------------------------------------------
                                // para segundero fraccion
                                let d_segundos =
                                    (registro_terreno.fecha_fin_construccion -
                                        registro_terreno.fecha_inicio_reservacion +
                                        1000) /
                                    1000; // para segundero
                                let r_plus = plusvalia / d_segundos; // bs/seg
                                i_seg = i_seg + 1;
                                array_segundero[i_seg] = {
                                    plus_r: r_plus,
                                    plus_fechaInicio: registro_terreno.fecha_inicio_reservacion,
                                    plus_fechaFin: registro_terreno.fecha_fin_construccion,
                                };
                                //------------------------------------------------
                            }
                        }
                    } // fin for

                    //------------------------------------------------

                    if (fraccion_bs_total > sum_fraccion_bs) {
                        // OK
                        // significa que la fraccion tiene residuo (ESTO SOLO SUCEDE CON LAS FRACCIONES DE INMUEBLE DEL TIPO "inversionista"), entontonces este residuo estara actuando como tipo "inversionista" con la ganancia por defecto (16%) y la duracion por defecto (dias_maximo) esperando a ser adquirido por un propietario absoluto
                        var aux_ganancia_residuo =
                            (fraccion_bs_total - sum_fraccion_bs) *
                            (fraccion_terreno.rend_fraccion_total / 100);

                        var ganancia_residuo = Math.floor(aux_ganancia_residuo); // redondeando al entero inmediato inferior

                        // sumamos a las ganancias
                        sum_ganancia = sum_ganancia + ganancia_residuo;

                        aux_dias_inversionista = registro_terreno.dias_maximo;

                        //------------------------------------------------
                        // para segundero fraccion
                        // mientras la fraccion de terreno esta a la espera de ser comprado por un usuario, la fraccion actua como tipo "inversionista"
                        let aux_plus_fechaInicio = fecha_inicio_convocatoria;
                        let plus_fechaInicio = aux_plus_fechaInicio;
                        // Usamos el método .setDate() para actualizar el día del mes sumando los días deseados (dias_maximo ejemplo 240).
                        aux_plus_fechaInicio.setDate(
                            aux_plus_fechaInicio.getDate() + registro_terreno.dias_maximo
                        );
                        let plus_fechaFin = aux_plus_fechaInicio; // la aux_plus_fechaInicio ya esta sumado con los dias_maximo (ejemplo 240)
                        let d_segundos = (plus_fechaFin - plus_fechaInicio + 1000) / 1000; // para segundero
                        let r_plus = ganancia_residuo / d_segundos; // bs/seg

                        i_seg = i_seg + 1;
                        array_segundero[i_seg] = {
                            plus_r: r_plus,
                            plus_fechaInicio,
                            plus_fechaFin,
                        };
                        //------------------------------------------------
                    }

                    //------------------------------------------------
                    if ((sum_ganancia = 0)) {
                        menor_igual = false; // para el simbolo de menor igual
                        existe_inversionista = false;
                    } else {
                        menor_igual = true; // para el simbolo de menor igual
                        // Math.floor redondea al entero inferior, devolviendo el resultado en tipo numerico
                        existe_inversionista = true;

                        ganancia_bs = Math.floor(sum_ganancia);
                        ganancia_bs_render = numero_punto_coma(ganancia_bs);
                        dias_inversionista = numero_punto_coma(Math.floor(aux_dias_inversionista));
                    }

                    if ((sum_plusvalia = 0)) {
                        existe_copropietario = false;
                    } else {
                        // Math.floor redondea al entero inferior, devolviendo el resultado en tipo numerico

                        existe_copropietario = true;

                        plusvalia_bs = Math.floor(sum_plusvalia);
                        plusvalia_bs_render = numero_punto_coma(plusvalia_bs);

                        var milisegundos = fecha_fin_construccion - fecha_inicio_construccion;

                        var aux_dias_plusvalia = milisegundos / (1000 * 60 * 60 * 24);

                        dias_plusvalia = numero_punto_coma(Math.floor(aux_dias_plusvalia));
                    }

                    //------------------------------------------------

                    if (fraccion_terreno.ci_propietario == ci_propietario) {
                        azul = true;
                    } else {
                        gris = true;
                    }

                    //------------------------------------------------
                    // solo para historial de propietario
                    // aunque sea una fraccion de terreno que paso a convertirse todo o una parte de ella en fraccion de inmueble, su verdadero origen es como fraccion de terreno, por tanto se toman en cuenta los datos del terreno

                    if (registro_terreno) {
                        estado = estadoTerreno(registro_terreno.estado_terreno);
                        terreproy = "terreno";
                        titulo_terreproy = "Terreno";
                        nombre_terreproy = registro_terreno.ubicacion;
                        codigo_terreproy = fraccion_terreno.codigo_terreno;
                        bandera_ciudad = registro_terreno.bandera_ciudad;
                    }
                    //------------------------------------------------
                } else {
                    // OK
                    // significa que la fraccion de terreno (que tiene dueño) en su TOTALIDAD esta en espera como "inversionista" hasta que su dueño lo use para ser "copropietario" de TODA una fraccion de inmueble, O simplemente su dueño desea mantenerlo como "inversionista" todo el tiempo

                    inversionista_color = "verde";
                    inversionista_leyenda = "Vigente";
                    existe_copropietario = false;
                    existe_inversionista = true;
                    menor_igual = false; // para el simbolo de menor igual

                    fraccion_bs = Math.floor(fraccion_terreno.fraccion_bs);
                    fraccion_bs_render = numero_punto_coma(fraccion_bs);

                    let registro_terreno = await indiceTerreno.findOne(
                        { codigo_terreno: fraccion_terreno.codigo_terreno },
                        {
                            fecha_inicio_convocatoria: 1, // solo para segundero
                            rend_fraccion_total: 1,
                            dias_maximo: 1,
                            estado_terreno: 1, // solo para historial de propietario
                            nombre: 1, // solo para historial de propietario
                            bandera_ciudad: 1, // solo para historial de propietario

                            _id: 0,
                        }
                    );

                    if (registro_terreno) {
                        ganancia_bs = Math.floor(
                            fraccion_terreno.fraccion_bs *
                                (registro_terreno.rend_fraccion_total / 100)
                        );
                        ganancia_bs_render = numero_punto_coma(ganancia_bs);

                        dias_inversionista = numero_punto_coma(
                            Math.floor(registro_terreno.dias_maximo)
                        );
                    }

                    //--------------------------------------------------------------
                    if (fraccion_terreno.ci_propietario == ci_propietario) {
                        azul = true;
                    } else {
                        gris = true;
                    }

                    //------------------------------------------------
                    // para segundero fraccion
                    // mientras la fraccion de terreno esta a la espera de ser comprado por un usuario, la fraccion actua como tipo "inversionista"
                    let aux_plus_fechaInicio = registro_terreno.fecha_inicio_convocatoria;
                    let plus_fechaInicio = aux_plus_fechaInicio;
                    // Usamos el método .setDate() para actualizar el día del mes sumando los días deseados (dias_maximo ejemplo 240).
                    aux_plus_fechaInicio.setDate(
                        aux_plus_fechaInicio.getDate() + registro_terreno.dias_maximo
                    );
                    let plus_fechaFin = aux_plus_fechaInicio; // la aux_plus_fechaInicio ya esta sumado con los dias_maximo (ejemplo 240)
                    let d_segundos = (plus_fechaFin - plus_fechaInicio + 1000) / 1000; // para segundero
                    let r_plus = ganancia_bs / d_segundos; // bs/seg

                    array_segundero[0] = {
                        plus_r: r_plus,
                        plus_fechaInicio,
                        plus_fechaFin,
                    };

                    //------------------------------------------------
                    // solo para historial de propietario

                    if (registro_terreno) {
                        estado = estadoTerreno(registro_terreno.estado_terreno);
                        terreproy = "terreno";
                        titulo_terreproy = "Terreno";
                        nombre_terreproy = registro_terreno.ubicacion;
                        codigo_terreproy = fraccion_terreno.codigo_terreno;
                        bandera_ciudad = registro_terreno.bandera_ciudad;
                    }
                    //------------------------------------------------
                }
            }
        } else {
            // OK
            // entonces se trata de una fraccion puramente originada desde un inmueble que puede estar disponible para ser adquirida por un usuario que desea ser "copropietario" del inmueble del que forma parte la fraccion. O puede ya haber sido adquirida por un usuario y ahora es "copropietario" del inmueble. Lo importante es que esta clase de fracciones puras de inmueble, NO tienen parte "inversionista", solo "copropietario"

            // no es necesario añadir en el filtro de (tipo: "copropietario"), porque hasta aqui todas son fracciones de enteramente origen inmueble y ya tienen  como dato tipo: "copropietario"
            let fraccion_inmueble = await indiceFraccionInmueble.findOne(
                { codigo_fraccion: codigo_fraccion },
                {
                    fraccion_bs: 1,
                    codigo_inmueble: 1,
                    codigo_terreno: 1,
                    codigo_proyecto: 1, // solo para historial de propietario
                    ci_propietario: 1,
                    disponible: 1, // true || false
                    _id: 0,
                }
            );

            if (fraccion_inmueble) {
                existe_copropietario = true;
                existe_inversionista = false;
                menor_igual = false; // para el simbolo de menor igual

                fraccion_bs = Math.floor(fraccion_inmueble.fraccion_bs);
                fraccion_bs_render = numero_punto_coma(fraccion_bs);

                var aux_plusvalia = 0; // por defecto

                let registro_inmueble = await indiceInmueble.findOne(
                    { codigo_inmueble: fraccion_inmueble.codigo_inmueble },
                    {
                        codigo_terreno: 1,
                        precio_construccion: 1,
                        precio_competencia: 1,
                        superficie_inmueble_m2: 1,
                        fraccionado: 1,
                        _id: 0,
                    }
                );

                if (registro_inmueble) {
                    let registro_terreno = await indiceTerreno.findOne(
                        { codigo_terreno: registro_inmueble.codigo_terreno },
                        {
                            precio_bs: 1,
                            descuento_bs: 1,
                            rend_fraccion_mensual: 1,
                            superficie: 1,
                            fecha_inicio_convocatoria: 1,
                            fecha_fin_construccion: 1,
                            fecha_inicio_construccion: 1,
                            estado_terreno: 1,
                            fecha_inicio_reservacion: 1, // solo para segundero
                            bandera_ciudad: 1, // solo para segundero
                            _id: 0,
                        }
                    );

                    if (registro_terreno) {
                        //------------------------------------------------------------
                        // datos del inmueble
                        let codigo_inmueble = fraccion_inmueble.codigo_inmueble;
                        let precio_construccion = registro_inmueble.precio_construccion; // del inmueble
                        let precio_competencia = registro_inmueble.precio_competencia;
                        let superficie_inmueble = registro_inmueble.superficie_inmueble_m2;
                        let fraccionado = registro_inmueble.fraccionado; // true o false

                        //-------------------------------------------------------------
                        // datos del terreno
                        let precio_terreno = registro_terreno.precio_bs; // ya considera el descuento del terreno
                        let descuento_terreno = registro_terreno.descuento_bs;
                        let rend_fraccion_mensual = registro_terreno.rend_fraccion_mensual;
                        let superficie_terreno = registro_terreno.superficie;
                        let fecha_inicio_convocatoria = registro_terreno.fecha_inicio_convocatoria;

                        //------------------------------------------------------
                        // precio_justo_inm

                        var paquete_datos_a = {
                            codigo_inmueble,
                            precio_construccion,
                            precio_competencia,
                            precio_terreno,
                            descuento_terreno,
                            rend_fraccion_mensual,
                            superficie_terreno,
                            superficie_inmueble,
                            fecha_inicio_convocatoria,
                            fraccionado,
                        };
                        let resultadoPrecioJusto = await precio_justo_inm(paquete_datos_a);

                        let precio_justo = resultadoPrecioJusto.precio_justo;
                        let plusvalia = resultadoPrecioJusto.plusvalia;

                        //------------------------------------------------------------

                        // con ese dato, determinaremos el %de participacion de la presente fraccion, para determinar la plusvalia que le corresponde a la presente fraccion
                        // AQUI CORREGIR, EN LUGAR DE precio_construccion, TRABAJAR CON EL PRECIO JUSTO DEL INM
                        var participacion = fraccion_inmueble.fraccion_bs / precio_justo;

                        // redondeando al entero inmediato inferior
                        aux_plusvalia = Math.floor(participacion * plusvalia);

                        plusvalia_bs = Math.floor(aux_plusvalia);
                        plusvalia_bs_render = numero_punto_coma(plusvalia_bs);

                        var milisegundos =
                            registro_terreno.fecha_fin_construccion -
                            registro_terreno.fecha_inicio_construccion;

                        var aux_dias_plusvalia = milisegundos / (1000 * 60 * 60 * 24);

                        dias_plusvalia = numero_punto_coma(Math.floor(aux_dias_plusvalia));

                        if (fraccion_inmueble.disponible == true) {
                            verde = true;
                        } else {
                            //--------------------------------------------------------------
                            if (fraccion_inmueble.ci_propietario == ci_propietario) {
                                azul = true;
                            } else {
                                gris = true;
                            }
                            //--------------------------------------------------------------
                            if (registro_terreno.estado_terreno === "construido") {
                                // vasta que el terreno este en estado "construido" para que todas las fracciones de terreno que luego se conviertan a fracciones de inmueble o fracciones de inmueble puros, (todas las fracciones que guardan relacion con el terreno) que sean del tipo COPROPIETARIO, pasaran a tener los siguientes datos
                                copropietario_color = "gris";
                                copropietario_leyenda = "Completado";
                            }
                        }

                        //------------------------------------------------
                        // para segundero fraccion
                        let d_segundos =
                            (registro_terreno.fecha_fin_construccion -
                                registro_terreno.fecha_inicio_reservacion +
                                1000) /
                            1000; // para segundero
                        let r_plus = plusvalia / d_segundos; // bs/seg

                        array_segundero[0] = {
                            plus_r: r_plus,
                            plus_fechaInicio: registro_terreno.fecha_inicio_reservacion,
                            plus_fechaFin: registro_terreno.fecha_fin_construccion,
                        };

                        //------------------------------------------------
                        // solo para historial de propietario

                        estado = estadoTerreno(registro_terreno.estado_terreno);

                        // si se trata de una fraccion del tipo copropietario, entonces forma parte de un proyecto

                        let registro_proyecto = await indiceProyecto.findOne(
                            { codigo_proyecto: fraccion_inmueble.codigo_proyecto },
                            {
                                nombre_proyecto: 1,
                                _id: 0,
                            }
                        );
                        if (registro_proyecto) {
                            terreproy = "proyecto";
                            titulo_terreproy = "Proyecto";
                            nombre_terreproy = registro_proyecto.nombre_proyecto;
                            codigo_terreproy = fraccion_inmueble.codigo_proyecto;
                            bandera_ciudad = registro_terreno.bandera_ciudad;
                        }
                        //------------------------------------------------
                    }
                }
            } else {
                return false;
            }
        }

        //---------------------------------------------------------------

        var resultado = {
            fraccion_bs, // valor de la fraccion
            fraccion_bs_render,
            ganancia_bs,
            ganancia_bs_render,
            plusvalia_bs,
            plusvalia_bs_render,
            existe_inversionista, // (para mostrar ganancia) false o true
            existe_copropietario, // (para mostrar plusvalia) false o true
            menor_igual, // Para mostrar el simbolo de menor igual
            verde, // true o false (true para fracciones disponibles)
            gris, // true o false (true para fracciones NO disponibles)
            azul, // true o false (true para fracciones que pertenecen al ci_propietario analizado)
            dias_plusvalia, // estan en render
            dias_inversionista, // estan en render
            inversionista_color,
            inversionista_leyenda,
            copropietario_color,
            copropietario_leyenda,
            array_segundero,
            //--------------------------
            // solo para historial de propietario
            estado,
            terreproy,
            titulo_terreproy,
            nombre_terreproy,
            codigo_terreproy,
            bandera_ciudad,
            //--------------------------
        };
        return resultado;
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------------------------
// funcion que de un inmueble devuele los resultados de:
// derecho_suelo, derecho_suelo_render, precio_justo, precio_justo_render, plusvalia, plusvalia_render,

async function precio_justo_inm(paquete_datos) {
    var codigo_inmueble = paquete_datos.codigo_inmueble;
    var precio_construccion = paquete_datos.precio_construccion; // del inmueble
    var precio_competencia = paquete_datos.precio_competencia;
    var precio_terreno = paquete_datos.precio_terreno;
    var descuento_terreno = paquete_datos.descuento_terreno;
    var rend_fraccion_mensual = paquete_datos.rend_fraccion_mensual;
    var superficie_terreno = paquete_datos.superficie_terreno;
    var superficie_inmueble = paquete_datos.superficie_inmueble;
    var fecha_inicio_convocatoria = paquete_datos.fecha_inicio_convocatoria;
    var fraccionado = paquete_datos.fraccionado; // true o false

    var factorSuperficie = superficie_inmueble / superficie_terreno;

    if (fraccionado) {
        // true: cuando se trata de un inmueble que esta fraccionado, que estara formado por COPROPIETARIOS
        // AQUI el precio justo es = precio construccion + derecho suelo (sin sobreprecio)

        // precio_terreno esta guardado siempre en valor entero sin decimales

        // equivale al valor en fracciones de terreno que absorveria este inmueble como derecho de suelo (sin ganancias para los dueños de estas fracciones de terreno)
        // Math.round() redondea al entero, Valores con decimales de 0.5 o más se redondean hacia arriba. Valores menores a 0.5 se redondean hacia abajo.
        let totalFracciones = Math.round(precio_terreno * factorSuperficie);

        var derecho_suelo = totalFracciones; // (sin sobreprecio de ganancias)
        var derecho_suelo_render = numero_punto_coma(derecho_suelo);

        var descuento_suelo = Math.round(descuento_terreno * factorSuperficie);
        var descuento_suelo_render = numero_punto_coma(descuento_suelo);

        //---------------------------------------------------------------------
    } else {
        // false: cuando se trata de un inmueble normal, adquiridos por PROPIETARIOS ABSOLUTOS
        // AQUI el precio justo es = precio construccion + derecho suelo (con sobreprecio dependiendo del tiempo en que es reservado el inmueble para pagar a los fraccionistas del terreno el %ganancia que les corresponde)
        // rescatamos las fracciones de terreno que se convirtieron en fracciones del inmueble en cuestion a travez del DERECHO DE SUELO.
        var arrayFracciones = await indiceFraccionInmueble.find(
            { codigo_inmueble: codigo_inmueble, tipo: "inversionista", disponible: false },
            {
                fraccion_bs: 1,
                ganancia_bs: 1,
                _id: 0,
            }
        );

        // fraccion_bs y ganancia_bs estan guardados en valores enteros sin decimales

        if (arrayFracciones.length > 0) {
            let [{ total_f }] = await indiceFraccionInmueble.aggregate([
                {
                    $match: {
                        codigo_inmueble: codigo_inmueble, // Filtra
                    },
                },
                {
                    $group: {
                        _id: null,
                        total_f: { $sum: "$fraccion_bs" }, // Suma el valor de las fracciones que fueron destinadas como derecho de suelo para el inmueble
                    },
                },
            ]);

            var totalFracciones = total_f;

            let [{ total_g }] = await indiceFraccionInmueble.aggregate([
                {
                    $match: {
                        codigo_inmueble: codigo_inmueble, // Filtra
                    },
                },
                {
                    $group: {
                        _id: null,
                        total_g: { $sum: "$ganancia_bs" }, // Suma las ganancias de las fracciones que fueron destinadas como derecho de suelo para el inmueble
                    },
                },
            ]);

            var totalGanancias = total_g;

            var derecho_suelo = totalFracciones + totalGanancias;
            var derecho_suelo_render = numero_punto_coma(derecho_suelo);

            var descuento_suelo = Math.round(descuento_terreno * factorSuperficie) - derecho_suelo;
            var descuento_suelo_render = numero_punto_coma(descuento_suelo);
        } else {
            // entonces se trata de un inmueble normal que aun no a sido reservado mediante derecho de suelo. Por tanto se procedera a determinar el nivel de ganancia que le corresponde segun el tiempo transcurrido desde la fecha inicio de reservacion.

            // "new Date()" nos devuelve la fecha actual
            let fecha_actual = new Date();

            // Usamos el método .setDate() para actualizar el día del mes sumando los días deseados (30).
            fecha_inicio_convocatoria.setDate(fecha_inicio_convocatoria.getDate() + 30);
            let fecha_1 = fecha_inicio_convocatoria;
            fecha_inicio_convocatoria.setDate(fecha_inicio_convocatoria.getDate() + 30);
            let fecha_2 = fecha_inicio_convocatoria;
            fecha_inicio_convocatoria.setDate(fecha_inicio_convocatoria.getDate() + 30);
            let fecha_3 = fecha_inicio_convocatoria;
            fecha_inicio_convocatoria.setDate(fecha_inicio_convocatoria.getDate() + 30);
            let fecha_4 = fecha_inicio_convocatoria;
            fecha_inicio_convocatoria.setDate(fecha_inicio_convocatoria.getDate() + 30);
            let fecha_5 = fecha_inicio_convocatoria;
            fecha_inicio_convocatoria.setDate(fecha_inicio_convocatoria.getDate() + 30);
            let fecha_6 = fecha_inicio_convocatoria;
            fecha_inicio_convocatoria.setDate(fecha_inicio_convocatoria.getDate() + 30);
            let fecha_7 = fecha_inicio_convocatoria;

            var gananciaPotencial = 0;
            if (fecha_actual <= fecha_1) {
                gananciaPotencial = (rend_fraccion_mensual / 100) * 1;
            } else {
                if (fecha_actual > fecha_1 && fecha_actual <= fecha_2) {
                    gananciaPotencial = (rend_fraccion_mensual / 100) * 2;
                } else {
                    if (fecha_actual > fecha_2 && fecha_actual <= fecha_3) {
                        gananciaPotencial = (rend_fraccion_mensual / 100) * 3;
                    } else {
                        if (fecha_actual > fecha_3 && fecha_actual <= fecha_4) {
                            gananciaPotencial = (rend_fraccion_mensual / 100) * 4;
                        } else {
                            if (fecha_actual > fecha_4 && fecha_actual <= fecha_5) {
                                gananciaPotencial = (rend_fraccion_mensual / 100) * 5;
                            } else {
                                if (fecha_actual > fecha_5 && fecha_actual <= fecha_6) {
                                    gananciaPotencial = (rend_fraccion_mensual / 100) * 6;
                                } else {
                                    if (fecha_actual > fecha_6 && fecha_actual <= fecha_7) {
                                        gananciaPotencial = (rend_fraccion_mensual / 100) * 7;
                                    } else {
                                        if (fecha_actual > fecha_7) {
                                            gananciaPotencial = (rend_fraccion_mensual / 100) * 8;
                                        } else {
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            let factorSuperficie = superficie_inmueble / superficie_terreno;

            // equivale al valor en fracciones de terreno que absorveria este inmueble como derecho de suelo (sin ganancias para los dueños de estas fracciones de terreno)
            // Math.round() redondea al entero, Valores con decimales de 0.5 o más se redondean hacia arriba. Valores menores a 0.5 se redondean hacia abajo.
            let totalFracciones = Math.round(precio_terreno * factorSuperficie);

            let totalGanancias = Math.round(totalFracciones * gananciaPotencial);

            var derecho_suelo = totalFracciones + totalGanancias; // esto ya dara como resultado un valor entero sin decimales
            var derecho_suelo_render = numero_punto_coma(derecho_suelo);

            var descuento_suelo = Math.round(descuento_terreno * factorSuperficie) - derecho_suelo;
            var descuento_suelo_render = numero_punto_coma(descuento_suelo);
        }
    }

    // precio_construccion debe estar siempre guardado en valor entero sin decimales

    var precio_justo = precio_construccion + derecho_suelo;
    var precio_justo_render = numero_punto_coma(precio_justo);

    var plusvalia = precio_competencia - precio_justo;
    var plusvalia_render = numero_punto_coma(plusvalia);

    var resultado = {
        // todos los valores estan en valor numerico, entero sin decimales
        derecho_suelo,
        derecho_suelo_render,
        precio_justo,
        precio_justo_render,
        plusvalia,
        plusvalia_render,
        descuento_suelo,
        descuento_suelo_render,
    };

    return resultado;
}

//--------------------------------------------------------------------------
// funcion que de un inmueble devuele los resultados de:
// plazo_titulo, plazo_tiempo, p_financiamiento, p_financiamiento_render, financiamiento, financiamiento_render, meta, meta_render,

async function financiamiento_inm(paquete_datos) {
    try {
        // Los inmuebles solo existen en las etapas del terreno de: reservacion, construccion, construido OK
        var estado_terreno = paquete_datos.estado_terreno;
        var fraccionado = paquete_datos.fraccionado; // inmueble true o false
        var codigo_inmueble = paquete_datos.codigo_inmueble;
        var fecha_fin_reservacion = paquete_datos.fecha_fin_reservacion;
        var fecha_fin_construccion = paquete_datos.fecha_fin_construccion;
        var derecho_suelo = paquete_datos.derecho_suelo;
        var precio_justo = paquete_datos.precio_justo;

        //---------------------------------------------------------------
        // PLAZO

        moment.locale("es");
        if (estado_terreno == "reservacion") {
            var fecha_fin = fecha_fin_reservacion;
        }
        if (estado_terreno == "construccion" || estado_terreno == "construido") {
            var fecha_fin = fecha_fin_construccion;
        }

        if (estado_terreno == "reservacion" || estado_terreno == "construccion") {
            var plazo_titulo = "Finaliza";

            let fecha_actual = new Date();

            if (fecha_fin > fecha_actual) {
                var plazo_tiempo = moment(fecha_fin).endOf("minute").fromNow(); // ej/ en x dias
            } else {
                var plazo_tiempo = "Vencido";
            }
        } else {
            var plazo_titulo = "Finalizado";
            if (estado_terreno == "construido") {
                var plazo_tiempo = moment(fecha_fin).startOf("minute").fromNow(); // hace x dias
            } else {
                var plazo_tiempo = "Indefinido";
            }
        }

        //---------------------------------------------------------------
        // FINANCIAMIENTO

        var p_financiamiento = 0; // numerico para que sea leido como tal por el style
        var p_financiamiento_render = "0"; // (string) para mostrar visiblemente al cliente
        var financiamiento = 0;
        var financiamiento_render = "0";
        var meta = 0;
        var meta_render = "0";
        //--------------------
        if (fraccionado) {
            // si el inmueble es de tipo fraccionado que pertenece a copropietarios
            var registro_pagos = await indiceFraccionInmueble.find(
                {
                    codigo_inmueble: codigo_inmueble,
                    tipo: "copropietario",
                    disponible: false,
                },
                {
                    fraccion_bs: 1,
                    _id: 0,
                }
            );

            // sumatoria de todas las fracciones compradas por aquellos que desean ser copropietarios del inmueble
            if (registro_pagos.length > 0) {
                let [{ total_fracciones }] = await indiceFraccionInmueble.aggregate([
                    {
                        $match: {
                            codigo_inmueble: codigo_inmueble, // Filtra
                            tipo: "copropietario",
                            disponible: false,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total_fracciones: { $sum: "$fraccion_bs" }, // Suma el valor de las fracciones
                        },
                    },
                ]);

                var financiamiento = total_fracciones;
                var financiamiento_render = numero_punto_coma(financiamiento);
            } else {
                var financiamiento = 0;
                var financiamiento_render = "0";
            }
            //--------------------------------------------------------
            // los card inmuebles solo existen en las etapas de terreno: reservacion, construccion, construido. PERO AL TRATARSE DE UN INMUEBLE DEL TIPO COPROPIETARIO. LA META Y LOS PORCENTAJES MANTENDRAN SU ESTRUCTURA EN CUALQUIERA DE ESAS ETAPAS DE TERRENO

            meta = precio_justo;
            meta_render = numero_punto_coma(meta);

            let string_p_financiamiento = ((financiamiento / meta) * 100).toFixed(2);
            p_financiamiento = Number(string_p_financiamiento); // numerico con 2 decimales
            p_financiamiento_render = numero_punto_coma(p_financiamiento); // string con coma decimal
        } else {
            // si se trata de un inmueble que pertenece a propietarios absolutos
            //-----------------------------------------------------
            // los card inmuebles solo existen en las etapas de terreno: reservacion, construccion, construido

            if (estado_terreno == "reservacion") {
                meta = derecho_suelo;
            }

            if (estado_terreno == "construccion" || estado_terreno == "construido") {
                meta = precio_justo;
            }
            meta_render = numero_punto_coma(meta);

            // utilizamos "findOne", porque solo puede existir un solo propietario "activo" por inmueble
            let registro_pagos = await indiceInversiones.findOne(
                { codigo_inmueble: codigo_inmueble },
                {
                    pago_primer_bs: 1,
                    pagos_mensuales: 1, // [{fecha,pago_bs},...,{fecha,pago_bs}]
                    _id: 0,
                }
            );

            if (registro_pagos) {
                let pago_primer_bs = registro_pagos.pago_primer_bs;
                let pagos_mensuales = registro_pagos.pagos_mensuales;
                let sum_mensuales = 0;

                if (pagos_mensuales.length > 0) {
                    for (let i = 0; i < pagos_mensuales.length; i++) {
                        let pago_bs = pagos_mensuales[i].pago_bs;
                        sum_mensuales = sum_mensuales + pago_bs;
                    }
                }

                var financiamiento = pago_primer_bs + sum_mensuales;
                var financiamiento_render = numero_punto_coma(financiamiento);
            } else {
                // entonces se trata de un inmueble que no tiene ningun tipo de financimiento
                var financiamiento = 0;
                var financiamiento_render = "0";
            }

            let string_p_financiamiento = ((financiamiento / meta) * 100).toFixed(2);
            p_financiamiento = Number(string_p_financiamiento); // numerico con 2 decimales
            p_financiamiento_render = numero_punto_coma(p_financiamiento); // string con coma decimal
        }
        //--------------------
        var resultado = {
            plazo_titulo,
            plazo_tiempo,
            p_financiamiento,
            p_financiamiento_render,
            financiamiento,
            financiamiento_render,
            meta,
            meta_render,
        };
        return resultado;
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------------------------
// funcion que de un inmueble devuele los resultados de:
// refracu, titulo_refracu, valor_refracu, valor_refracu_render, menor_igual

async function refracu_inm(paquete_datos) {
    try {
        var codigo_inmueble = paquete_datos.codigo_inmueble;
        var derecho_suelo = paquete_datos.derecho_suelo;
        var precio_construccion = paquete_datos.precio_construccion; // del inmueble
        var estado_terreno = paquete_datos.estado_terreno;
        var fraccionado = paquete_datos.fraccionado; // true o false
        var construccion_mensual = paquete_datos.construccion_mensual;

        if (estado_terreno == "construido") {
            var refracu = false; // para no mostrarlo en html
            var titulo_refracu = "";
            var valor_refracu = 0;
            var valor_refracu_render = "0";
            var menor_igual = false;
            var ver_fraccion = false;
            var ver_reserva = false;
            var ver_cuota = false;
        } else {
            var refracu = true; // para si mostrarlo en html

            if (fraccionado) {
                // el inmueble es de tipo fraccionado que pertenece a copropietarios

                var menor_igual = true;
                var titulo_refracu = "Fracción";
                var ver_fraccion = true;
                var ver_reserva = false;
                var ver_cuota = false;

                var registro_fracciones = await indiceFraccionInmueble.find(
                    { codigo_inmueble: codigo_inmueble },
                    {
                        fraccion_bs: 1,
                        _id: 0,
                    }
                );

                if (registro_fracciones.length > 0) {
                    // extraccion del precio mas elevado que puede existir entre todas las fracciones que conforman al inmueble
                    const [fracciones_inmueble] = await indiceFraccionInmueble.aggregate([
                        {
                            $match: { codigo_inmueble: codigo_inmueble }, // Filtra solo los libros del género "novela"
                        },
                        {
                            $group: {
                                _id: null,
                                fraccion_max: { $max: "$fraccion_bs" }, // Obtiene el precio más alto
                            },
                        },
                    ]);
                    var valor_refracu = fracciones_inmueble.fraccion_max;
                    var valor_refracu_render = numero_punto_coma(valor_refracu);
                } else {
                    var valor_refracu = 0;
                    var valor_refracu_render = "0";
                }
            } else {
                // si se trata de un inmueble que pertenece a propietarios absolutos

                var menor_igual = false;

                if (estado_terreno == "reservacion") {
                    var titulo_refracu = "Reserva";
                    var ver_fraccion = false;
                    var ver_reserva = true;
                    var ver_cuota = false;

                    // aqui la reserva sera igual al valor de derecho de suelo que tiene el inmueble
                    var valor_refracu = derecho_suelo;
                    var valor_refracu_render = numero_punto_coma(valor_refracu);
                }

                if (estado_terreno == "construccion") {
                    // AQUI CALCULAR EL VALOR DE LA CUOTA MENSUAL DE CONSTRUCCION, QUE SERA valor correspondiente al mes de construccion en el que se encuentre el proyecto, tomando el dato de las cuotas mensuales de contruccion del proyecto.

                    var titulo_refracu = "Cuota";
                    var ver_fraccion = false;
                    var ver_reserva = false;
                    var ver_cuota = true;

                    // [ {fecha: String, pago_bs: Number},...,{fecha: String, pago_bs: Number} ]
                    if (construccion_mensual.length > 0) {
                        // suma todos los precios de construccion mensual del proyecto
                        let construccion_py = 0;

                        for (let i = 0; i < construccion_mensual.length; i++) {
                            let pago_bs = construccion_mensual[i].pago_bs;
                            construccion_py = construccion_py + pago_bs;
                        }

                        let factorConstruccion = precio_construccion / construccion_py;

                        //-------------------------------------------------
                        // Convertir las fechas en strings a objetos Date para facilitar comparaciones
                        for (let i = 0; i < construccion_mensual.length; i++) {
                            let fechaComoString = construccion_mensual[i].fecha; // Obtenemos la fecha como string
                            let fechaComoDate = new Date(fechaComoString); // Convertimos la fecha a tipo Date
                            construccion_mensual[i].fecha = fechaComoDate; // Reemplazamos el valor en el array
                        }

                        // Obtenemos la fecha actual
                        let fechaActual = new Date();

                        // Inicializamos la variable para almacenar el precio seleccionado
                        let precioSeleccionado = 0;

                        // Recorremos el array de construccion_mensual para encontrar el rango adecuado
                        for (let i = 0; i < construccion_mensual.length; i++) {
                            // Obtenemos la fecha del elemento actual
                            let fechaInicio = construccion_mensual[i].fecha;

                            // Verificamos si hay un siguiente elemento para establecer el rango superior
                            let fechaFin = null; // Por defecto, no hay rango superior
                            if (i + 1 < construccion_mensual.length) {
                                fechaFin = construccion_mensual[i + 1].fecha; // Usamos la fecha del siguiente elemento
                            }

                            // Comprobamos si la fecha actual está dentro del rango
                            if (
                                fechaActual >= fechaInicio &&
                                (fechaFin === null || fechaActual < fechaFin)
                            ) {
                                precioSeleccionado = construccion_mensual[i].pago_bs; // Asignamos el precio del elemento actual
                                break; // Salimos del bucle for una vez encontrado el precio
                            }
                        }

                        var valor_refracu = Math.round(precioSeleccionado * factorConstruccion);
                        var valor_refracu_render = numero_punto_coma(valor_refracu);
                        //-------------------------------------------------
                    }
                }
            }
        }
        var resultado = {
            refracu, // true o false (para mostrar u ocultar)
            titulo_refracu, // vacio o Fracción o Cuota
            valor_refracu, // 0 o valor de la fraccion u cuota
            valor_refracu_render,
            menor_igual, // true o false (para mostrar u ocultar el simbolo de menor o igual)
            ver_fraccion, // true o false para ver u ocultar
            ver_reserva, // true o false para ver u ocultar
            ver_cuota, // true o false para ver u ocultar
        };
        return resultado;
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------------------------
// funcion del terreno:
//

async function financiamiento_te(paquete_datos) {
    try {
        var codigo_terreno = paquete_datos.codigo_terreno;
        var precio_terreno = paquete_datos.precio_terreno;
        var fecha_fin_convocatoria = paquete_datos.fecha_fin_convocatoria;

        //---------------------------------------------------------------
        // PLAZO

        moment.locale("es");
        var fecha_fin = fecha_fin_convocatoria;

        let fecha_actual = new Date();

        if (fecha_fin > fecha_actual) {
            var plazo_titulo = "Finaliza";
            var plazo_tiempo = moment(fecha_fin).endOf("minute").fromNow(); // ej/ [quedan] x dias
        } else {
            var plazo_titulo = "Finalizado";
            var plazo_tiempo = moment(fecha_fin).startOf("minute").fromNow(); // hace x dias
        }

        //---------------------------------------------------------------
        // NÚMERO FRACCIONES

        // Cuenta solo las fracciones que pertenecen al terreno en especifico
        var fracciones_maximo = await indiceFraccionTerreno.countDocuments({
            codigo_terreno: codigo_terreno,
        });

        // Cuenta solo las fracciones que pertenecen al terreno en especifico y que aun no hayan sido adquiridas por un inversionista
        var fracciones_disponibles = await indiceFraccionTerreno.countDocuments({
            codigo_terreno: codigo_terreno,
            disponible: true,
        });

        var fracciones_invertidas = fracciones_maximo - fracciones_disponibles;

        //---------------------------------------------------------------
        // FINANCIAMIENTO

        var meta = precio_terreno;
        var meta_render = numero_punto_coma(meta);

        var registro_fracciones = await indiceFraccionTerreno.find(
            { codigo_terreno: codigo_terreno, disponible: false },
            {
                fraccion_bs: 1,
                _id: 0,
            }
        );

        if (registro_fracciones.length > 0) {
            const [{ total }] = await indiceFraccionTerreno.aggregate([
                {
                    $match: {
                        codigo_terreno: codigo_terreno, // Filtra solo las fracciones que forman parte del terreno en especifico
                        disponible: false, // Filtra aquellas fracciones que fueron vendidas
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$fraccion_bs" }, // Suma los precios de las fracciones filtrados
                    },
                },
            ]);

            var financiamiento = total;
            var financiamiento_render = numero_punto_coma(financiamiento);

            let aux_p_financiamiento = ((financiamiento / meta) * 100).toFixed(2);
            var p_financiamiento = Number(aux_p_financiamiento); // numerico con 2 decimales
            var p_financiamiento_render = numero_punto_coma(p_financiamiento); // string con coma decimal

            // bastara que tomemos un solo registro para el valor unitario de una fraccion de terreno, porque todas las demas tienen el mismo valor
            var fraccion = registro_fracciones[0].fraccion_bs; // valor unitario de fraccion
            var fraccion_render = numero_punto_coma(fraccion);
        } else {
            var financiamiento = 0;
            var financiamiento_render = "0";
            var p_financiamiento = 0;
            var p_financiamiento_render = "0";

            var fraccion = 0; // valor unitario de fraccion
            var fraccion_render = "0";
        }

        //-----------------------------------------------------
        // RESULTADO

        var resultado = {
            fracciones_disponibles,
            fracciones_invertidas,
            plazo_titulo,
            plazo_tiempo,
            meta,
            meta_render,
            financiamiento,
            financiamiento_render,
            p_financiamiento,
            p_financiamiento_render,
            fraccion, // bs
            fraccion_render,
        };

        return resultado;
    } catch (error) {
        console.log(error);
    }
}

//--------------------------------------------------------------------
function estadoTerreno(estado) {
    if (estado === "guardado") {
        var respuesta = "Guardado";
    }
    if (estado === "convocatoria") {
        var respuesta = "Convocatoria";
    }
    if (estado === "anteproyecto") {
        var respuesta = "Anteproyecto";
    }
    if (estado === "reservacion") {
        var respuesta = "Reservación";
    }
    if (estado === "construccion") {
        var respuesta = "Construcción";
    }
    if (estado === "construido") {
        var respuesta = "Construido";
    }
    return respuesta;
}


// -----------------------------------------------------------------------
module.exports = funcionesAyuda_5;
