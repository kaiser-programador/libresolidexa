// CONTROLADORES PARA EL INMUEBLE DESDE EL LADO DEL CLIENTE PUBLICO

const {
    indiceProyecto,
    indiceImagenesProyecto,
    indiceDocumentos,
    indiceInmueble,
    indiceInversiones,
    indiceTerreno,
    indiceEmpresa,
    indiceFraccionInmueble,
} = require("../modelos/indicemodelo");

const { fraccion_card_adm_cli } = require("../ayudas/funcionesayuda_1");

const {
    cabezeras_adm_cli,
    datos_pagos_propietario,
    datos_copropietario,
} = require("../ayudas/funcionesayuda_2");

const { te_inm_copropietario } = require("../ayudas/funcionesayuda_4");
const { super_info_inm } = require("../ayudas/funcionesayuda_5");

const {
    numero_punto_coma,
    verificarTePyInmFracc,
    inmueble_pronostico,
} = require("../ayudas/funcionesayuda_3");

const moment = require("moment");

const controladorCliInmueble = {};

//============================================================================
//============================================================================
// para enviar al usuario los precios $us/m2 del inmueble
// Ruta: post "/inmueble/operacion/pronostico_precio_m2"

controladorCliInmueble.pronostico_precio_m2 = async (req, res) => {
    try {
        var respuestaPronostico = inmueble_pronostico();
        res.json(respuestaPronostico);
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA RENDERIZAR LA VENTANA DEL INMUEBLE DESDE EL LADO PUBLICO DEL CLIENTE
// RUTA   "get"   /inmueble/:codigo_inmueble/:vista_inm

controladorCliInmueble.renderVentanaInmueble = async (req, res) => {
    try {
        // ------------------------------------------------------

        var codigo_inmueble = req.params.codigo_inmueble;
        var tipo_vista_inmueble = req.params.vista_inm;

        //IMPORTANTE: PARA NO PERMITIR EL ACCESO A PROYECTOS INEXISTENTES O QUE NO ESTAN DISPONIBLES PARA SER VISIBLES POR EL USUARIO, ES QUE 1º EL PROYECTO SERA BUSCADO EN LA BASE DE DATOS

        var paqueteria_datos = {
            codigo_objetivo: codigo_inmueble,
            tipo: "inmueble",
        };
        var verificacion = await verificarTePyInmFracc(paqueteria_datos);

        if (verificacion == true) {
            // ------- Para verificación -------
            //console.log("el codigo del inmueble es:");
            //console.log(codigo_inmueble);
            // ------- Para verificación -------
            //console.log("tipo de vista del inmueble es:");
            //console.log(tipo_vista_inmueble);

            var info_inmueble_cli = {};
            info_inmueble_cli.cab_inm_cli = true;
            info_inmueble_cli.estilo_cabezera = "cabezera_estilo_inmueble";
            info_inmueble_cli.navegador_cliente = true;
            info_inmueble_cli.codigo_inmueble = codigo_inmueble;

            // ------- Para verificación -------
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO");
            //console.log(req.inversor_autenticado);
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");

            info_inmueble_cli.inversor_autenticado = req.inversor_autenticado;
            // si es TRUE y solo si es true, entonces se mostrara su ci
            if (req.inversor_autenticado) {
                info_inmueble_cli.ci_propietario = req.user.ci_propietario;
            }

            var aux_cabezera = {
                codigo_objetivo: codigo_inmueble,
                tipo: "inmueble",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_inmueble_cli.cabezera_cli = cabezera_cli;

            //-------------------------------------------------------------------------------
            // si el cliente esta navegado con su cuenta
            if (req.inversor_autenticado) {
                var ci_inversionista = req.user.ci_propietario;

                // ------- Para verificación -------
                //console.log("el codigo del propietario registrado con su cuenta es");
                //console.log(ci_inversionista);
            } else {
                // en caso de que este navegando sin haber accedido a su cuenta personal

                var ci_inversionista = "ninguno";
            }

            var paquete_datos = {
                codigo_inmueble,
                //codigo_proyecto,
                //tipo_inmueble: registro_inmueble.tipo_inmueble,
                ci_inversionista,
            };
            var global_inm = await complementos_globales_inm(paquete_datos);
            info_inmueble_cli.global_inm = global_inm;
            //-------------------------------------------------------------------------------

            info_inmueble_cli.es_inmueble = true; // para menu navegacion comprimido

            //----------------------------------------------------

            if (tipo_vista_inmueble == "descripcion") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.descripcion_inm = true;

                info_inmueble_cli.info_segundero = true;

                // para mostrar circulos estados y caracteristicas del proyecto
                info_inmueble_cli.estado_caracteristicas = true;

                info_inmueble_cli.caracteristicas_inmueble = true;

                var paquete_datos = {
                    codigo_inmueble,
                    //ci_propietario: ci_inversionista,
                };

                var info_inmueble = await inmueble_descripcion(paquete_datos);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de descripcion del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            //--------------------------------------
            if (tipo_vista_inmueble == "fracciones") {
                // si el cliente esta navegado con su cuenta
                if (req.inversor_autenticado) {
                    var codigo_usuario = req.user.ci_propietario;

                    // ------- Para verificación -------
                    //console.log("el codigo del propietario registrado con su cuenta es");
                    //console.log(codigo_usuario);
                } else {
                    // en caso de que este navegando sin haber accedido a su cuenta personal

                    var codigo_usuario = "ninguno";
                }

                var paquete_datos = {
                    codigo_inmueble,
                    codigo_usuario, // codigo || "ninguno"
                };

                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.fracciones_inmueble = true;

                var info_inmueble = await inmueble_fracciones(paquete_datos);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de fracciones del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }
            //--------------------------------------

            if (tipo_vista_inmueble == "garantias") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.garantias_inm = true;

                var info_inmueble = await inmueble_garantias(codigo_inmueble);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de garantias del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "beneficios") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.beneficios_inm = true;

                var info_inmueble = await inmueble_beneficios(codigo_inmueble);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de beneficios del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "info_economico") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.informe_economico = true;

                var info_inmueble = await inmueble_info_economico(codigo_inmueble);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de info_economico del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "empleos") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.empleos_inm = true;

                var info_inmueble = await inmueble_empleos(codigo_inmueble);

                info_inmueble_cli.informacion = info_inmueble;

                // agregamos info complementaria
                //info_inmueble_cli.codigo_proyecto = codigo_proyecto;

                // ------- Para verificación -------
                //console.log("LOS DATOS A RENDERIZAR DE EMPLEOS DEL INMUEBLE");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "calculadora") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.calculadora_inm = true;

                // para mostrar al copropietario de las fracciones del inmueble o la opcion de comprar fracciones del inmueble
                info_inmueble_cli.inm_fraccionado = global_inm.inm_fraccionado;

                if (global_inm.inm_fraccionado) {
                    var info_inmueble = await inmueble_calculadora_fr(codigo_inmueble);
                    info_inmueble_cli.informacion = info_inmueble;
                } else {
                    var info_inmueble = await inmueble_calculadora(codigo_inmueble);
                    info_inmueble_cli.informacion = info_inmueble;
                }

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (ci_inversionista != "ninguno" && tipo_vista_inmueble == "inversor") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.inversor_inmueble = true;

                let paquete_datos = {
                    ci_inversionista,
                    codigo_inmueble,
                };

                var info_inmueble = await inmueble_inversor(paquete_datos);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de PROPIETARIO del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (ci_inversionista != "ninguno" && tipo_vista_inmueble == "copropietario") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble_cli.copropietario_inmueble = true;

                // para mostrar al copropietario de las fracciones del inmueble o la opcion de comprar fracciones del inmueble
                info_inmueble_cli.adquirir_f_inm = global_inm.adquirir_f_inm;

                if (global_inm.adquirir_f_inm) {
                    // para que el copropietario del terreno pueda adquiriri fracciones del inmueble
                    let paquete_datos = {
                        ci_propietario: ci_inversionista,
                        codigo_inmueble,
                    };

                    var info_inmueble = await inmueble_adquirir_f_inm(paquete_datos);
                    info_inmueble_cli.contenido = info_inmueble;
                } else {
                    let paquete_datos = {
                        ci_propietario: ci_inversionista,
                        codigo_inmueble,
                    };

                    var info_inmueble = await inmueble_copropietario(paquete_datos);
                    info_inmueble_cli.contenido = info_inmueble;
                }

                // ------- Para verificación -------
                //console.log("los datos de PROPIETARIO del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN INMUEBLE INEXISTENTE O QUE NO ESTA AUN DISPONIBLE PARA SER VISUALIZADO POR EL CLIENTE.
            res.redirect("/"); // rediccionara a la pagina DE INICIO DEL CLIENTE
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------

async function inmueble_descripcion(paquete_datos) {
    try {
        var codigo_inmueble = paquete_datos.codigo_inmueble;
        //var ci_propietario = paquete_datos.ci_propietario;

        moment.locale("es");

        const registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                codigo_proyecto: 1,
                tipo_inmueble: 1,
                estado_inmueble: 1,
                precio_construccion: 1,
                superficie_inmueble_m2: 1,
                fraccionado: 1,
                inmueble_descripcion: 1,
                titulo_descripcion_1: 1,
                varios_descripcion_1: 1,
                titulo_descripcion_2: 1,
                varios_descripcion_2: 1,
                titulo_descripcion_3: 1,
                varios_descripcion_3: 1,
                titulo_descripcion_4: 1,
                varios_descripcion_4: 1,
                titulo_descripcion_5: 1,
                varios_descripcion_5: 1,
                link_youtube_inmueble: 1,
                titulo_garantia_1: 1,
                garantia_1: 1,
                titulo_garantia_2: 1,
                garantia_2: 1,
                titulo_garantia_3: 1,
                garantia_3: 1,
                dormitorios_inmueble: 1,
                banos_inmueble: 1,
                garaje_inmueble: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            let codigo_terreno = registro_inmueble.codigo_terreno;

            const registro_terreno = await indiceTerreno.findOne(
                { codigo_terreno: codigo_terreno },
                {
                    precio_bs: 1,
                    descuento_bs: 1,
                    rend_fraccion_mensual: 1,
                    superficie: 1,
                    ciudad: 1,
                    provincia: 1,
                    direccion: 1,
                    estado_terreno: 1,
                    titulo_ubi_otros_1: 1,
                    ubi_otros_1: 1,
                    titulo_ubi_otros_2: 1,
                    ubi_otros_2: 1,
                    titulo_ubi_otros_3: 1,
                    ubi_otros_3: 1,
                    link_googlemap: 1,
                    fecha_inicio_convocatoria: 1,
                    fecha_inicio_reservacion: 1,
                    fecha_fin_reservacion: 1,
                    fecha_fin_construccion: 1,
                    _id: 0,
                }
            );

            let codigo_proyecto = registro_inmueble.codigo_proyecto;
            const registro_proyecto = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_proyecto },
                {
                    meses_construccion: 1,
                    mensaje_segundero_py_inm_a: 1,
                    mensaje_segundero_py_inm_b: 1,
                    nota_precio_justo: 1,
                    trafico: 1,
                    construccion_mensual: 1,
                    _id: 0,
                }
            );

            if (registro_terreno && registro_proyecto) {
                // conversion del documento MONGO ({OBJETO}) a "string"
                var aux_string = JSON.stringify(registro_inmueble);

                // reconversion del "string" a "objeto"
                var inm_descripcion = JSON.parse(aux_string);

                // conversion de superficie inmueble a punto mil
                inm_descripcion.superficie_inmueble_m2 = numero_punto_coma(
                    registro_inmueble.superficie_inmueble_m2
                );

                //--------------------------------------------------------

                // por defecto ponemos a todos en "false"
                inm_descripcion.resplandor_1 = false;
                inm_descripcion.resplandor_2 = false;
                inm_descripcion.resplandor_3 = false;
                inm_descripcion.resplandor_4 = false;
                inm_descripcion.resplandor_5 = false;

                inm_descripcion.plazo = registro_proyecto.meses_construccion;
                inm_descripcion.nota_precio_justo = registro_proyecto.nota_precio_justo;
                inm_descripcion.trafico = registro_proyecto.trafico;

                // guardado, convocatoria, anteproyecto, reservacion, construccion, construido OK
                // corregimos que estado estara como "true"
                if (registro_terreno.estado_terreno == "convocatoria") {
                    inm_descripcion.resplandor_1 = true;
                }
                if (registro_terreno.estado_terreno == "anteproyecto") {
                    inm_descripcion.resplandor_2 = true;
                }
                if (registro_terreno.estado_terreno == "reservacion") {
                    inm_descripcion.resplandor_3 = true;
                }
                if (registro_terreno.estado_terreno == "construccion") {
                    inm_descripcion.resplandor_4 = true;
                }
                if (registro_terreno.estado_terreno == "construido") {
                    inm_descripcion.resplandor_5 = true;
                }

                if (registro_terreno.estado_terreno == "construido") {
                    var mensaje_segundero = registro_proyecto.mensaje_segundero_py_inm_b;
                } else {
                    var mensaje_segundero = registro_proyecto.mensaje_segundero_py_inm_a;
                }

                //----------------------------------------------------------------
                // para estado y color del inmueble

                // guardado, disponible, reservado, construccion, remate, construido  OK

                if (inm_descripcion.estado_inmueble == "guardado") {
                    inm_descripcion.leyenda_precio_inm = "Guardado";
                    inm_descripcion.color_precio_inm = "en_gris";
                }
                if (inm_descripcion.estado_inmueble == "disponible") {
                    inm_descripcion.leyenda_precio_inm = "Disponible";
                    inm_descripcion.color_precio_inm = "en_verde";
                }
                if (inm_descripcion.estado_inmueble == "reservado") {
                    inm_descripcion.leyenda_precio_inm = "Reservado";
                    inm_descripcion.color_precio_inm = "en_gris";
                }
                if (inm_descripcion.estado_inmueble == "construccion") {
                    inm_descripcion.leyenda_precio_inm = "Construcción";
                    inm_descripcion.color_precio_inm = "en_amarillo";
                }
                if (inm_descripcion.estado_inmueble == "remate") {
                    inm_descripcion.leyenda_precio_inm = "Remate";
                    inm_descripcion.color_precio_inm = "en_azul";
                }
                if (inm_descripcion.estado_inmueble == "construido") {
                    inm_descripcion.leyenda_precio_inm = "Construido";
                    inm_descripcion.color_precio_inm = "en_gris";
                }

                //----------------------------------------------------------------
                // para las viñetas
                var titulo_descrip_1 = registro_inmueble.titulo_descripcion_1;
                var array = registro_inmueble.varios_descripcion_1.split("*");
                var puntos_descrip_1 = [];
                if (titulo_descrip_1 != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_descrip_1[i - 1] = { punto: array[i] };
                    }
                }
                inm_descripcion.titulo_descrip_1 = titulo_descrip_1;
                inm_descripcion.puntos_descrip_1 = puntos_descrip_1;

                var titulo_descrip_2 = registro_inmueble.titulo_descripcion_2;
                var array = registro_inmueble.varios_descripcion_2.split("*");
                var puntos_descrip_2 = [];
                if (titulo_descrip_2 != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_descrip_2[i - 1] = { punto: array[i] };
                    }
                }
                inm_descripcion.titulo_descrip_2 = titulo_descrip_2;
                inm_descripcion.puntos_descrip_2 = puntos_descrip_2;

                var titulo_descrip_3 = registro_inmueble.titulo_descripcion_3;
                var array = registro_inmueble.varios_descripcion_3.split("*");
                var puntos_descrip_3 = [];
                if (titulo_descrip_3 != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_descrip_3[i - 1] = { punto: array[i] };
                    }
                }
                inm_descripcion.titulo_descrip_3 = titulo_descrip_3;
                inm_descripcion.puntos_descrip_3 = puntos_descrip_3;

                var titulo_descrip_4 = registro_inmueble.titulo_descripcion_4;
                var array = registro_inmueble.varios_descripcion_4.split("*");
                var puntos_descrip_4 = [];
                if (titulo_descrip_4 != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_descrip_4[i - 1] = { punto: array[i] };
                    }
                }
                inm_descripcion.titulo_descrip_4 = titulo_descrip_4;
                inm_descripcion.puntos_descrip_4 = puntos_descrip_4;

                // NO TIENE ****, Y ES CORRESPONDIENTE A POSIBLEMENTE "ACABADOS DE CALIDAD"
                inm_descripcion.titulo_descrip_5 = registro_inmueble.titulo_descripcion_5;
                inm_descripcion.descripcion_5 = registro_inmueble.varios_descripcion_5;

                //-------------------------------------------------------------------
                // UBICACION DEL INMUEBLE

                inm_descripcion.ciudad = registro_terreno.ciudad;
                inm_descripcion.direccion = registro_terreno.direccion;
                inm_descripcion.provincia = registro_terreno.provincia;
                inm_descripcion.link_googlemap = registro_terreno.link_googlemap;

                var titulo_up_a = registro_terreno.titulo_ubi_otros_1;
                var array = registro_terreno.ubi_otros_1.split("*");
                var puntos_up_a = [];
                if (titulo_up_a != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_up_a[i - 1] = { punto: array[i] };
                    }
                }

                var titulo_up_b = registro_terreno.titulo_ubi_otros_2;
                var array = registro_terreno.ubi_otros_2.split("*");
                var puntos_up_b = [];
                if (titulo_up_b != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_up_b[i - 1] = { punto: array[i] };
                    }
                }

                var titulo_up_c = registro_terreno.titulo_ubi_otros_3;
                var array = registro_terreno.ubi_otros_3.split("*");
                var puntos_up_c = [];
                if (titulo_up_c != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_up_c[i - 1] = { punto: array[i] };
                    }
                }
                //-------------------------------------------------------------------
                var datos_inm = {
                    // datos del inmueble
                    codigo_inmueble,
                    precio_construccion: registro_inmueble.precio_construccion,
                    precio_competencia: registro_inmueble.precio_competencia,
                    superficie_inmueble: registro_inmueble.superficie_inmueble_m2,
                    fraccionado: registro_inmueble.fraccionado,
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

                // precio justo, derecho suelo, plusvalia
                var derecho_suelo = resultado.derecho_suelo;
                var derecho_suelo_render = resultado.derecho_suelo_render;
                var precio_justo = resultado.precio_justo;
                var precio_justo_render = resultado.precio_justo_render;
                var plusvalia = resultado.plusvalia;
                var plusvalia_render = resultado.plusvalia_render;
                var descuento_suelo = resultado.descuento_suelo;
                var descuento_suelo_render = resultado.descuento_suelo_render;
                //------------------------------
                // financiamiento, meta, porcentaje
                var plazo_titulo = resultado.plazo_titulo;
                var plazo_tiempo = resultado.plazo_tiempo;
                var p_financiamiento = resultado.p_financiamiento;
                var p_financiamiento_render = resultado.p_financiamiento_render;
                var financiamiento = resultado.financiamiento;
                var financiamiento_render = resultado.financiamiento_render;
                var meta = resultado.meta;
                var meta_render = resultado.meta_render;
                //-----------------------
                // reserva, fraccio , cuota
                var refracu = resultado.refracu;
                var titulo_refracu = resultado.titulo_refracu;
                var valor_refracu = resultado.valor_refracu;
                var valor_refracu_render = resultado.valor_refracu_render;
                var menor_igual = resultado.menor_igual;
                var ver_fraccion = resultado.ver_fraccion;
                var ver_reserva = resultado.ver_reserva;
                var ver_cuota = resultado.ver_cuota;
                //-----------------------
                // para segundero
                var fecha_inicio = resultado.fecha_inicio;
                var fecha_fin = resultado.fecha_fin;
                var r_plus = resultado.r_plus; // bs/seg

                //-------------------------------------------------------------------

                inm_descripcion.derecho_suelo = derecho_suelo;
                inm_descripcion.derecho_suelo_render = derecho_suelo_render;
                inm_descripcion.descuento_suelo = descuento_suelo;
                inm_descripcion.descuento_suelo_render = descuento_suelo_render;
                inm_descripcion.popover_precio =
                    "Es la fracción del terreno que corresponde al inmueble en base a la superficie que ocupa.";
                inm_descripcion.popover_descuento =
                    "Es el descuento en la fracción del terreno que favorecer al propietario del inmueble.";
                inm_descripcion.mensaje_terreno =
                    "Un mayor descuento en el terreno se logra si el propietario del inmueble adquiere fracciones del terreno durante la etapa de Convocatoria.";

                inm_descripcion.financiamiento = financiamiento;
                inm_descripcion.financiamiento_render = financiamiento_render;
                inm_descripcion.p_financiamiento = p_financiamiento;
                inm_descripcion.p_financiamiento_render = p_financiamiento_render;
                inm_descripcion.plazo_titulo = plazo_titulo;
                inm_descripcion.plazo_tiempo = plazo_tiempo;

                inm_descripcion.refracu = refracu;
                inm_descripcion.titulo_refracu = titulo_refracu;
                inm_descripcion.valor_refracu = valor_refracu;
                inm_descripcion.valor_refracu_render = valor_refracu_render;
                inm_descripcion.menor_igual = menor_igual;
                inm_descripcion.ver_fraccion = ver_fraccion;
                inm_descripcion.ver_reserva = ver_reserva;
                inm_descripcion.ver_cuota = ver_cuota;

                inm_descripcion.precio_justo = precio_justo;
                inm_descripcion.precio_justo_render = precio_justo_render;
                inm_descripcion.plusvalia = plusvalia;
                inm_descripcion.plusvalia_render = plusvalia_render;
                inm_descripcion.precio_tradicional = precio_justo + plusvalia;
                inm_descripcion.precio_tradicional_render = numero_punto_coma(precio_tradicional);

                var array_segundero = [];
                array_segundero[0] = {
                    plus_r: r_plus, // bs/seg
                    plus_fechaInicio: fecha_inicio,
                    plus_fechaFin: fecha_fin,
                };
                inm_descripcion.array_segundero = array_segundero;

                //-------------------------------------------------------------------------------

                inm_descripcion.mensaje_segundero = mensaje_segundero;

                //---------------------------------------------------------------
                inm_descripcion.titulo_up_a = titulo_up_a;
                inm_descripcion.puntos_up_a = puntos_up_a;
                inm_descripcion.titulo_up_b = titulo_up_b;
                inm_descripcion.puntos_up_b = puntos_up_b;
                inm_descripcion.titulo_up_c = titulo_up_c;
                inm_descripcion.puntos_up_c = puntos_up_c;

                //-------------------------------------------------------------------
                var registro_documentos = await indiceDocumentos.find({
                    codigo_inmueble: codigo_inmueble,
                    clase_documento: "General",
                });

                // por defecto con respectos a los documentos del inmueble
                var documentos_descripcion = [];

                if (registro_documentos.length > 0) {
                    for (let d = 0; d < registro_documentos.length; d++) {
                        documentos_descripcion[d] = {
                            titulo_documento: registro_documentos[d].nombre_documento,
                            codigo_documento: registro_documentos[d].codigo_documento,
                            url: registro_documentos[d].url,
                        };
                    }
                }
                inm_descripcion.documentos_descripcion = documentos_descripcion;
                //-------------------------------------------------------------------

                return inm_descripcion;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function inmueble_fracciones(paquete_datos) {
    try {
        var codigo_inmueble = paquete_datos.codigo_inmueble;
        var ci_propietario = paquete_datos.codigo_usuario;

        // todas las fracciones que guardan relacion con el inmueble
        var fracciones = await indiceFraccionInmueble
            .find(
                { codigo_inmueble: codigo_inmueble },
                {
                    codigo_fraccion: 1,
                    _id: 0,
                }
            )
            .sort({ orden: 1 }); // ordenado del menor al mayor

        if (fracciones.length > 0) {
            var array_fracciones = []; // vacio de inicio

            for (let i = 0; i < fracciones.length; i++) {
                var codigo_fraccion_i = fracciones[i].codigo_fraccion;
                var paquete_fraccion = {
                    codigo_fraccion: codigo_fraccion_i,
                    ci_propietario,
                    tipo_navegacion: "cliente", // porque estamos dentro de un controlador cliente
                };
                var card_fraccion_i = await fraccion_card_adm_cli(paquete_fraccion);

                array_fracciones[i] = card_fraccion_i;
            }
        } else {
            var array_fracciones = []; // vacio
        }

        var contenido_fracciones = {
            array_fracciones,
        };

        return contenido_fracciones;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function inmueble_garantias(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_proyecto: 1,
                tipo_inmueble: 1,
                titulo_garantia_1: 1,
                garantia_1: 1,
                titulo_garantia_2: 1,
                garantia_2: 1,
                titulo_garantia_3: 1,
                garantia_3: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            var registro_documentos = await indiceDocumentos.find({
                codigo_inmueble: codigo_inmueble,
                clase_documento: "Garantía",
            });

            // por defecto con respectos a los documentos  de garantia del proyecto
            var documentacion = [];

            if (registro_documentos.length > 0) {
                for (let d = 0; d < registro_documentos.length; d++) {
                    documentacion[d] = {
                        titulo_documento: registro_documentos[d].nombre_documento,
                        codigo_documento: registro_documentos[d].codigo_documento,
                        url: registro_documentos[d].url,
                    };
                }
            }

            var info_inmueble_garantias = {
                titulo_garantia_1: registro_inmueble.titulo_garantia_1,
                garantia_1: registro_inmueble.garantia_1,
                titulo_garantia_2: registro_inmueble.titulo_garantia_2,
                garantia_2: registro_inmueble.garantia_2,
                titulo_garantia_3: registro_inmueble.titulo_garantia_3,
                garantia_3: registro_inmueble.garantia_3,

                documentacion,
            };

            return info_inmueble_garantias;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_beneficios(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_proyecto: 1,
                codigo_terreno: 1,
                superficie_inmueble_m2: 1,
                direccion_comparativa: 1,
                m2_comparativa: 1,
                precio_comparativa: 1,
                precio_construccion: 1,
                precio_competencia: 1,
                fraccionado: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            var codigo_proyecto = registro_inmueble.codigo_proyecto;
            var codigo_terreno = registro_inmueble.codigo_terreno;

            var registro_terreno = await indiceTerreno.findOne(
                {
                    codigo_terreno: codigo_terreno,
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

            var registro_proyecto = await indiceProyecto.findOne(
                {
                    codigo_proyecto: codigo_proyecto,
                },
                {
                    contructora_dolar_m2_1: 1,
                    contructora_dolar_m2_2: 1,
                    contructora_dolar_m2_3: 1,
                    volterra_dolar_m2: 1,
                    titulo_construccion_inm: 1,
                    texto_construccion_inm: 1,
                    nota_construccion_inm: 1,
                    titulo_precio_inm: 1,
                    texto_precio_inm: 1,
                    titulo_plusvalia_inm: 1,
                    texto_plusvalia_inm: 1,
                    construccion_mensual: 1,
                    _id: 0,
                }
            );

            if (registro_terreno && registro_proyecto) {
                //--------------------------------------------------------------
                var datos_inm = {
                    // datos del inmueble
                    codigo_inmueble,
                    precio_construccion: registro_inmueble.precio_construccion,
                    precio_competencia: registro_inmueble.precio_competencia,
                    superficie_inmueble: registro_inmueble.superficie_inmueble_m2,
                    fraccionado: registro_inmueble.fraccionado,
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

                // precio justo, derecho suelo, plusvalia
                var precio_justo = resultado.precio_justo;
                var precio_justo_render = resultado.precio_justo_render;
                var plusvalia = resultado.plusvalia;
                var plusvalia_render = resultado.plusvalia_render;
                //--------------------------------------------------------------

                var construccion_inm = registro_inmueble.precio_construccion;

                //-------------------------------------------------------------------------------
                // COSTO CONTRUCCION (trabajamos con los valores referentes a la construccion y no con los precios de mercado)
                var contructora_dolar_m2_1 = Number(registro_proyecto.contructora_dolar_m2_1);
                var contructora_dolar_m2_2 = Number(registro_proyecto.contructora_dolar_m2_2);
                var contructora_dolar_m2_3 = Number(registro_proyecto.contructora_dolar_m2_3);
                var volterra_bs_m2 = Math.round(
                    construccion_inm / registro_inmueble.superficie_inmueble_m2
                );

                var prom_constructoras =
                    (contructora_dolar_m2_1 + contructora_dolar_m2_2 + contructora_dolar_m2_3) / 3;
                var prom_constructoras_r = numero_punto_coma(Math.round(prom_constructoras));
                var solid_constru_r = numero_punto_coma(volterra_bs_m2);

                var area_construida = registro_inmueble.superficie_inmueble_m2; // m2 del INMUEBLE

                var costo_constructora_1 = area_construida * contructora_dolar_m2_1;
                var costo_constructora_2 = area_construida * contructora_dolar_m2_2;
                var costo_constructora_3 = area_construida * contructora_dolar_m2_3;

                var costo_volterra = construccion_inm;

                var sobreprecio_1 = costo_constructora_1 - costo_volterra;
                var sobreprecio_2 = costo_constructora_2 - costo_volterra;
                var sobreprecio_3 = costo_constructora_3 - costo_volterra;

                var constructoras = [
                    {
                        nombre: "SOLIDEXA",
                        contructora_dolar_m2: Number(volterra_bs_m2.toFixed(2)),
                        costo_constructora: Math.round(costo_volterra),
                        sobreprecio: 0,
                    },
                    {
                        nombre: "Constructora A",
                        contructora_dolar_m2: Number(contructora_dolar_m2_1.toFixed(2)),
                        costo_constructora: Math.round(costo_constructora_1),
                        sobreprecio: Math.round(sobreprecio_1),
                    },
                    {
                        nombre: "Constructora B",
                        contructora_dolar_m2: Number(contructora_dolar_m2_2.toFixed(2)),
                        costo_constructora: Math.round(costo_constructora_2),
                        sobreprecio: Math.round(sobreprecio_2),
                    },
                    {
                        nombre: "Constructora C",
                        contructora_dolar_m2: Number(contructora_dolar_m2_3.toFixed(2)),
                        costo_constructora: Math.round(costo_constructora_3),
                        sobreprecio: Math.round(sobreprecio_3),
                    },
                ];

                var constructoras_render = [
                    {
                        nombre: "SOLIDEXA",
                        contructora_dolar_m2: Number(volterra_bs_m2.toFixed(2)),
                        contructora_dolar_m2_r: numero_punto_coma(volterra_bs_m2.toFixed(2)),
                        costo_constructora: Number(Math.round(costo_volterra)),
                        costo_constructora_r: numero_punto_coma(Math.round(costo_volterra)),
                        sobreprecio: 0,
                        sobreprecio_r: "-",
                    },
                    {
                        nombre: "Constructora A",
                        contructora_dolar_m2: Number(contructora_dolar_m2_1.toFixed(2)),
                        contructora_dolar_m2_r: numero_punto_coma(contructora_dolar_m2_1.toFixed(2)),
                        costo_constructora: Number(Math.round(costo_constructora_1)),
                        costo_constructora_r: numero_punto_coma(Math.round(costo_constructora_1)),
                        sobreprecio: Number(Math.abs(sobreprecio_1).toFixed(0)),
                        sobreprecio_r: numero_punto_coma(Math.abs(sobreprecio_1).toFixed(0)),
                    },
                    {
                        nombre: "Constructora B",
                        contructora_dolar_m2: Number(contructora_dolar_m2_2.toFixed(2)),
                        contructora_dolar_m2_r: numero_punto_coma(contructora_dolar_m2_2.toFixed(2)),
                        costo_constructora: Number(costo_constructora_2.toFixed(0)),
                        costo_constructora_r: numero_punto_coma(costo_constructora_2.toFixed(0)),
                        sobreprecio: Number(Math.abs(sobreprecio_2).toFixed(0)),
                        sobreprecio_r: numero_punto_coma(Math.abs(sobreprecio_2).toFixed(0)),
                    },
                    {
                        nombre: "Constructora C",
                        contructora_dolar_m2: Number(contructora_dolar_m2_3.toFixed(2)),
                        contructora_dolar_m2_r: numero_punto_coma(contructora_dolar_m2_3.toFixed(2)),
                        costo_constructora: Number(costo_constructora_3.toFixed(0)),
                        costo_constructora_r: numero_punto_coma(costo_constructora_3.toFixed(0)),
                        sobreprecio: Number(Math.abs(sobreprecio_3).toFixed(0)),
                        sobreprecio_r: numero_punto_coma(Math.abs(sobreprecio_3).toFixed(0)),
                    },
                ];

                //-------------------------------------------------------------------------------

                var precios_mercado = [];
                var precios_mercado_render = []; // para numeros separados por punto mil

                let n_p = registro_inmueble.direccion_comparativa.length;
                if (n_p > 0) {
                    var sum_precios = 0; // Bs
                    var bs_m2_solidexa = precio_justo / area_construida;
                    var sum_bs_m2 = 0; // Bs/m2 sumatoria de todos los inm tradicionales
                    for (let i = 0; i < n_p; i++) {
                        var aux_bs_m2 = Number(
                            (
                                Number(registro_inmueble.precio_comparativa[i]) /
                                Number(registro_inmueble.m2_comparativa[i])
                            ).toFixed(2)
                        );

                        var aux_precio_inm_volterra = Number(
                            (aux_bs_m2 * area_construida).toFixed(2)
                        );
                        sum_precios = sum_precios + aux_precio_inm_volterra;

                        precios_mercado[i] = {
                            direccion_comparativa: registro_inmueble.direccion_comparativa[i],
                            m2_comparativa: Number(registro_inmueble.m2_comparativa[i].toFixed(2)),
                            precio_comparativa: Number(
                                registro_inmueble.precio_comparativa[i].toFixed(0)
                            ),
                            sus_m2: Number(aux_bs_m2.toFixed(0)),

                            sobreprecio_venta: Number((aux_bs_m2 - bs_m2_solidexa).toFixed(0)), // Bs/m2
                        };

                        precios_mercado_render[i] = {
                            direccion_comparativa: registro_inmueble.direccion_comparativa[i],
                            //m2_comparativa: registro_inmueble.m2_comparativa[i],
                            m2_comparativa: numero_punto_coma(
                                registro_inmueble.m2_comparativa[i].toFixed(2)
                            ),
                            precio_comparativa: Number(
                                registro_inmueble.precio_comparativa[i].toFixed(0)
                            ),
                            precio_comparativa_r: numero_punto_coma(
                                registro_inmueble.precio_comparativa[i].toFixed(0)
                            ),
                            sus_m2: Number(aux_bs_m2.toFixed(0)),
                            sus_m2_r: numero_punto_coma(aux_bs_m2.toFixed(0)),
                            sobreprecio_venta: Number(
                                (aux_bs_m2 - bs_m2_solidexa).toFixed(0)
                            ),
                            sobreprecio_venta_r: numero_punto_coma(
                                (aux_bs_m2 - bs_m2_solidexa).toFixed(0)
                            ),
                        };

                        sum_bs_m2 =
                            sum_bs_m2 +
                            Number(registro_inmueble.precio_comparativa[i]) /
                                Number(registro_inmueble.m2_comparativa[i]);
                    }
                    //---------------------------------------------------------------
                    // agregamos los datos de SOLIDEXA al inicio de los array necesarios
                    let datos_solidexa = {
                        direccion_comparativa: "SOLIDEXA",
                        m2_comparativa: Number(area_construida.toFixed(2)),
                        precio_comparativa: Number(precio_justo.toFixed(0)),
                        sus_m2: Number(bs_m2_solidexa.toFixed(0)),
                        sobreprecio_venta: "-",
                    };

                    // Agregar al inicio del array
                    precios_mercado.unshift(datos_solidexa);

                    let datos_solidexa_render = {
                        direccion_comparativa: "SOLIDEXA",
                        m2_comparativa: numero_punto_coma(area_construida.toFixed(2)),
                        precio_comparativa: Number(precio_justo.toFixed(0)),
                        precio_comparativa_r: numero_punto_coma(precio_justo.toFixed(0)),
                        sus_m2: Number(bs_m2_solidexa.toFixed(0)),
                        sus_m2_r: numero_punto_coma(bs_m2_solidexa.toFixed(0)),
                        sobreprecio_venta: 0,
                        sobreprecio_venta_r: "-",
                    };

                    // Agregar al inicio del array
                    precios_mercado_render.unshift(datos_solidexa_render);
                    //---------------------------------------------------------------

                    var precio_promedio = (sum_precios / n_p).toFixed(0);
                    var precio_promedio_render = numero_punto_coma((sum_precios / n_p).toFixed(0));

                    var prom_bs_m2 = Number((sum_bs_m2 / n_p).toFixed(0));
                    var prom_bs_m2_r = numero_punto_coma((sum_bs_m2 / n_p).toFixed(0));

                    var solid_precio = Number((precio_justo / area_construida).toFixed(0));
                    var solid_precio_r = numero_punto_coma(
                        (precio_justo / area_construida).toFixed(0)
                    );
                }

                var info_inmueble_beneficios = {
                    //--------------------------------
                    prom_constructoras_r, // Bs/m2 promedio de todas la constructoras fuera de solidexa
                    prom_constructoras: Math.round(prom_constructoras),
                    prom_bs_m2, // // Bs/m2 promedio de todos los inm tradicionales
                    prom_bs_m2_r, // // Bs/m2 promedio de todos los inm tradicionales
                    solid_constru_r, // Bs/m2 precio de construccion solidexa
                    solid_constru: Math.round(volterra_bs_m2),
                    solid_precio_r, // Bs/m2 precio justo solidexa
                    solid_precio, // Bs/m2 precio justo solidexa
                    //--------------------------------
                    // precios CONSTRUCTORAS - SOLIDEXA
                    constructoras,
                    constructoras_render,
                    // anteriormente era solo: area_construida,
                    area_construida: numero_punto_coma(area_construida.toFixed(2)),
                    //--------------------------------

                    plusvalia_sus: plusvalia,
                    plusvalia_sus_render: plusvalia_render,
                    pv_volterra: precio_justo,
                    costo_volterra_render: precio_justo_render,

                    //--------------------------------
                    // para los precios de venta, comparativa de mercado
                    precios_mercado,
                    precios_mercado_render, // para mostrar con punto mil
                    //nota_comparativa: registro_inmueble.nota_comparativa, // para explicar la comparativa de mercado de los precios de venta
                    precio_promedio,

                    precio_promedio_render, // para mostrar con punto mil

                    //-----------------------------------------
                    // textos beneficio inmueble

                    titulo_construccion_inm: registro_proyecto.titulo_construccion_inm,
                    texto_construccion_inm: registro_proyecto.texto_construccion_inm,
                    nota_construccion_inm: registro_proyecto.nota_construccion_inm,

                    titulo_precio_inm: registro_proyecto.titulo_precio_inm,
                    texto_precio_inm: registro_proyecto.texto_precio_inm,

                    titulo_plusvalia_inm: registro_proyecto.titulo_plusvalia_inm,
                    texto_plusvalia_inm: registro_proyecto.texto_plusvalia_inm,
                };

                // ------- Para verificación -------
                //console.log("la respuesta de beneficios");
                //console.log(info_inmueble_beneficios);

                return info_inmueble_beneficios;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_info_economico(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_proyecto: 1,
                precio_construccion: 1,
                superficie_inmueble_m2: 1,
                tipo_inmueble: 1,
                _id: 0,
            }
        );
        if (registro_inmueble) {
            var codigo_proyecto = registro_inmueble.codigo_proyecto;
            var registro_proyecto = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_proyecto },
                {
                    presupuesto_proyecto: 1,
                    titulo_economico_inm: 1,
                    texto_economico_inm: 1,
                    nota_economico_inm: 1,
                    _id: 0,
                }
            );
            if (registro_proyecto) {
                let n_filas = registro_proyecto.presupuesto_proyecto.length;
                var sum_valores = 0;
                for (let t = 0; t < n_filas; t++) {
                    // porque de momento son 14 filas como maximo que permite la tabla
                    if (registro_proyecto.presupuesto_proyecto[t][1] != "") {
                        sum_valores =
                            sum_valores + Number(registro_proyecto.presupuesto_proyecto[t][2]);
                    }
                }
                var total_presupuesto = sum_valores;

                var area_construida = Number(registro_inmueble.superficie_inmueble_m2); // de INMUEBLE

                var valores_tabla = []; // asumimos
                var t_posi = -1;

                for (let t = 0; t < n_filas; t++) {
                    // porque de momento son 14 filas como maximo que permite la tabla
                    if (registro_proyecto.presupuesto_proyecto[t][1] != "") {
                        t_posi = t_posi + 1;

                        var porcentaje_item = numero_punto_coma(
                            Number(
                                (
                                    (Number(registro_proyecto.presupuesto_proyecto[t][2]) /
                                        total_presupuesto) *
                                    100
                                ).toFixed(2)
                            )
                        );
                        var porcentaje_item_prog = Number(
                            (
                                (Number(registro_proyecto.presupuesto_proyecto[t][2]) /
                                    total_presupuesto) *
                                100
                            ).toFixed(2)
                        );
                        var presupuesto_valores = Number(
                            (
                                (porcentaje_item_prog / 100) *
                                Number(registro_inmueble.precio_construccion)
                            ).toFixed(2)
                        );

                        valores_tabla[t_posi] = {
                            presupuesto_items: registro_proyecto.presupuesto_proyecto[t][1],
                            presupuesto_valores: Number(presupuesto_valores),
                            presupuesto_valores_r: numero_punto_coma(presupuesto_valores),
                            sus_m2: Number((presupuesto_valores / area_construida).toFixed(2)),
                            sus_m2_r: numero_punto_coma(
                                Number((presupuesto_valores / area_construida).toFixed(2))
                            ),
                            porcentaje_item,
                            porcentaje_item_prog,
                        };
                    }
                }

                var registro_documentos = await indiceDocumentos.find({
                    codigo_inmueble: codigo_inmueble,
                    clase_documento: "Económico",
                });

                var documentacion = []; // por defecto con respectos a los documentos  economico del proyecto
                if (registro_documentos.length > 0) {
                    for (let d = 0; d < registro_documentos.length; d++) {
                        documentacion[d] = {
                            titulo_documento: registro_documentos[d].nombre_documento,
                            codigo_documento: registro_documentos[d].codigo_documento,
                            url: registro_documentos[d].url,
                        };
                    }
                }

                var info_inmueble_info_economico = {
                    tipo_inmueble: registro_inmueble.tipo_inmueble,
                    sus_m2_total: Number(
                        (Number(registro_inmueble.precio_construccion) / area_construida).toFixed(2)
                    ),
                    sus_m2_total_r: numero_punto_coma(
                        (Number(registro_inmueble.precio_construccion) / area_construida).toFixed(2)
                    ),
                    total_presupuesto: Number(
                        Number(registro_inmueble.precio_construccion).toFixed(0)
                    ),
                    total_presupuesto_r: numero_punto_coma(
                        Number(registro_inmueble.precio_construccion).toFixed(0)
                    ),
                    area_construida,
                    valores_tabla,
                    documentacion,

                    superficie_inmueble_m2: numero_punto_coma(
                        registro_inmueble.superficie_inmueble_m2
                    ),

                    titulo_economico_inm: registro_proyecto.titulo_economico_inm,
                    texto_economico_inm: registro_proyecto.texto_economico_inm,
                    nota_economico_inm: registro_proyecto.nota_economico_inm,
                };

                // ------- Para verificación -------
                //console.log("DATOS DE INFORME ECONOMICO DE INMUEBLE");
                //console.log(info_inmueble_info_economico);

                return info_inmueble_info_economico;
            } else {
                return false;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_empleos(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            {
                codigo_inmueble: codigo_inmueble,
            },
            {
                codigo_proyecto: 1,
                codigo_terreno: 1,
                tipo_inmueble: 1,
                precio_construccion: 1,
                precio_competencia: 1,
                superficie_inmueble_m2: 1,
                fraccionado: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            var codigo_proyecto = registro_inmueble.codigo_proyecto;
            var construccion_inmueble = registro_inmueble.precio_construccion;

            var registro_proyecto = await indiceProyecto.findOne(
                {
                    codigo_proyecto: codigo_proyecto,
                },
                {
                    nombre_proyecto: 1,
                    descripcion_empleo: 1,

                    tabla_empleos_sociedad: 1,
                    construccion_mensual: 1,
                    _id: 0,
                }
            );

            var registro_terreno = await indiceTerreno.findOne(
                {
                    codigo_terreno: registro_inmueble.codigo_terreno,
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

            if (registro_proyecto && registro_terreno) {
                // [ {fecha: String, pago_bs: Number}, {fecha: String, pago_bs: Number} , ... , {fecha: String, pago_bs: Number} ]
                let arrayConstuccionPy = registro_proyecto.construccion_mensual;
                let sum_construccion_py = 0;
                if (arrayConstuccionPy.length > 0) {
                    for (let k = 0; k < arrayConstuccionPy.length; k++) {
                        let elemento_pago = arrayConstuccionPy[k].pago_bs;
                        sum_construccion_py = sum_construccion_py + elemento_pago;
                    }
                }
                //----------------------------------------------------
                // se trabajar con el valor de precio de CONTRUCCION, no asi con el valor actual de precio de los inmuebles, porque es con el valor de CONSTRUCCION con el que se paga a los trabajadores directos e indirectos, proveedores, etc
                var construccion_proyecto = sum_construccion_py;
                var factorConstruccion = construccion_inmueble / construccion_proyecto;

                // ------- Para verificación -------
                //console.log("la fraccion del inmueble es:");
                //console.log(factorConstruccion);

                let n_filas = registro_proyecto.tabla_empleos_sociedad.length;
                var sum_valores = 0;
                var sum_valores_2 = 0;
                var sum_beneficiarios = 0;
                for (let t = 0; t < n_filas; t++) {
                    if (registro_proyecto.tabla_empleos_sociedad[t] != "") {
                        sum_valores =
                            sum_valores +
                            Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                factorConstruccion;
                        sum_valores_2 =
                            sum_valores_2 + Number(registro_proyecto.tabla_empleos_sociedad[t][4]);

                        sum_beneficiarios =
                            sum_beneficiarios +
                            Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                    }
                }

                var total_beneficio = sum_valores; // en moneda
                var total_beneficio_2 = sum_valores_2; // en moneda
                var total_beneficiarios = sum_beneficiarios; // #

                var valores_tabla = []; // asumimos vacio
                var t_posi = -1;
                var n_directos = 0;
                var n_indirectos = 0;
                var sus_directos = 0;
                var sus_indirectos = 0;
                for (let t = 0; t < n_filas; t++) {
                    if (registro_proyecto.tabla_empleos_sociedad[t][1] != "") {
                        t_posi = t_posi + 1;
                        if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Directo") {
                            var tipo_color = "en_azul";
                        }
                        if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Indirecto") {
                            var tipo_color = "en_verde";
                        }
                        valores_tabla[t_posi] = {
                            // [#, beneficiario, directo/directo, cantidad, beneficio $us]
                            empleo_beneficiario: registro_proyecto.tabla_empleos_sociedad[t][1],
                            empleo_tipo: registro_proyecto.tabla_empleos_sociedad[t][2],
                            empleo_cantidad: registro_proyecto.tabla_empleos_sociedad[t][3],
                            empleo_beneficio: numero_punto_coma(
                                (
                                    Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                    factorConstruccion
                                ).toFixed(0)
                            ),
                            empleo_beneficio_n: Number(
                                (
                                    Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                    factorConstruccion
                                ).toFixed(0)
                            ),

                            empleo_porcentaje: numero_punto_coma(
                                Number(
                                    (
                                        (Number(registro_proyecto.tabla_empleos_sociedad[t][4]) /
                                            total_beneficio_2) *
                                        100
                                    ).toFixed(1)
                                )
                            ),
                            empleo_porcentaje_prog: Number(
                                (
                                    (Number(registro_proyecto.tabla_empleos_sociedad[t][4]) /
                                        total_beneficio_2) *
                                    100
                                ).toFixed(1)
                            ),
                            tipo_color,
                        };

                        if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Directo") {
                            n_directos =
                                n_directos + Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                            sus_directos =
                                sus_directos +
                                Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                    factorConstruccion;
                        }
                        if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Indirecto") {
                            n_indirectos =
                                n_indirectos +
                                Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                            sus_indirectos =
                                sus_indirectos +
                                Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                    factorConstruccion;
                        }
                    }
                }

                //-----------------------------------------------------------
                var datos_inm = {
                    // datos del inmueble
                    codigo_inmueble,
                    precio_construccion: registro_inmueble.precio_construccion,
                    precio_competencia: registro_inmueble.precio_competencia,
                    superficie_inmueble: registro_inmueble.superficie_inmueble_m2,
                    fraccionado: registro_inmueble.fraccionado,
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

                var plusvalia_render = resultado.plusvalia_render;
                var plusvalia = resultado.plusvalia;

                //------------------------------------------------------------

                let inm_nfp = 1; // representa al mismo propietario del inmueble
                let inm_dfp = plusvalia_render; // es la plusvalia total de inmueble
                let inm_dfp_n = plusvalia;
                let py_inm_nfe = n_directos;
                let inm_dfe = numero_punto_coma(Math.round(sus_directos));
                let inm_dfe_n = Number(Math.round(sus_directos));
                let py_inm_nfb = n_indirectos;
                let inm_dfb = numero_punto_coma(Math.round(sus_indirectos));
                let inm_dfb_n = Number(Math.round(sus_indirectos));

                // ---------------------------------------------------------------------

                var info_proyecto_info_economico = {
                    tipo_inmueble: registro_inmueble.tipo_inmueble,
                    total_beneficio: numero_punto_coma(total_beneficio.toFixed(0)),
                    total_beneficio_n: Number(total_beneficio.toFixed(0)),
                    total_beneficiarios,
                    nombre_proyecto: registro_proyecto.nombre_proyecto,

                    area_construida: registro_proyecto.area_construida,
                    valores_tabla,

                    descripcion_empleo: registro_proyecto.descripcion_empleo,

                    inm_nfp,
                    inm_dfp,
                    inm_dfp_n,
                    py_inm_nfe,
                    inm_dfe,
                    inm_dfe_n,
                    py_inm_nfb,
                    inm_dfb,
                    inm_dfb_n,
                };

                return info_proyecto_info_economico;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------
// si se entra en esta funcion quiere decir que existe "Calculadora" y que se accedio desde esa pestaña.
// la pestaña de "calculadora" sera visible cuando el inmueble este en estado de: disponible, remate. ESTO YA ESTA PREVIAMENTE DETERMINADO EN LA FUNCION: complementos_globales_inm
async function inmueble_calculadora(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                superficie_inmueble_m2: 1,
                codigo_terreno: 1,
                codigo_proyecto: 1,
                precio_comparativa: 1,
                m2_comparativa: 1,
                estado_inmueble: 1,

                precio_construccion: 1,
                precio_competencia: 1,
                fraccionado: 1,

                _id: 0,
            }
        );

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                tc_ine: 1,
                tc_paralelo: 1,
                inflacion_ine: 1,
                tasa_banco: 1,
                _id: 0,
            }
        );

        var registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: registro_inmueble.codigo_proyecto },
            {
                construccion_mensual: 1, // [ {fecha: String, pago_bs: Number},...,]
                _id: 0,
            }
        );

        var registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: registro_inmueble.codigo_terreno },
            {
                ubicacion: 1,
                direccion: 1,
                fecha_fin_construccion: 1,

                estado_terreno: 1,
                precio_bs: 1,
                descuento_bs: 1,
                rend_fraccion_mensual: 1,
                superficie: 1,
                fecha_inicio_convocatoria: 1,
                fecha_inicio_reservacion: 1,
                fecha_fin_reservacion: 1,

                _id: 0,
            }
        );

        var solidexa_inm_bs = 0;
        var solidexa_inm_bs_render = "0";
        var solidexa_inm_bsm2 = 0;
        var solidexa_inm_m2 = 0;

        var maximo_bsm2 = 0; // por defecto
        var minimo_bsm2 = 0; // por defecto
        var promedio_bsm2 = 0; // por defecto

        var maximo_bsm2_render = "0"; // por defecto
        var minimo_bsm2_render = "0"; // por defecto
        var promedio_bsm2_render = "0"; // por defecto

        var direccion = "Dirección";
        var ubicacion = "Ubicación";

        if (registro_inmueble && registro_proyecto && registro_terreno && registro_empresa) {
            //-------------------------------------------------------------------
            var datos_inm = {
                // datos del inmueble
                codigo_inmueble,
                precio_construccion: registro_inmueble.precio_construccion,
                precio_competencia: registro_inmueble.precio_competencia,
                superficie_inmueble: registro_inmueble.superficie_inmueble_m2,
                fraccionado: registro_inmueble.fraccionado,
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

            var precio_justo = resultado.precio_justo;
            var plusvalia_inm_bs = resultado.plusvalia;
            var suelo_bs = resultado.derecho_suelo;
            var suelo_bs_render = resultado.derecho_suelo_render;

            //-------------------------------------------------------------------
            solidexa_inm_bs = precio_justo; // precio actual del inmueble
            solidexa_inm_bs_render = numero_punto_coma(solidexa_inm_bs);

            solidexa_inm_bsm2 = Number(
                (solidexa_inm_bs / registro_inmueble.superficie_inmueble_m2).toFixed(2)
            ); // en valor numerico con 2 decimales

            solidexa_inm_m2 = registro_inmueble.superficie_inmueble_m2; // de la BD ya viene como numerico y redondeado a 2 decimales

            direccion = registro_terreno.direccion;
            ubicacion = registro_terreno.ubicacion;

            //----------------------------------------------------------
            // calculo del total plazo en meses DESDE INICIO CONVOCATORIA HASTA FIN CONTRUCCION

            var diferenciaEnMilisegundos =
                registro_terreno.fecha_fin_construccion - registro_terreno.fecha_inicio_reservacion;

            // Convertir la diferencia de milisegundos a días
            var diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

            // el número de meses, redondeado al entero inmediato inferior
            var plazo = Math.floor(diferenciaEnDias / 30); // meses

            //------------------------------------------------------------

            let precios_otros = registro_inmueble.precio_comparativa;
            let m2_otros = registro_inmueble.m2_comparativa;
            let sus_m2 = [];
            let sum_sus_m2 = 0;
            let contador = 0;

            if (precios_otros.length > 0 && m2_otros.length > 0) {
                for (let d = 0; d < precios_otros.length; d++) {
                    sus_m2[d] = precios_otros[d] / m2_otros[d];
                    sum_sus_m2 = sum_sus_m2 + precios_otros[d] / m2_otros[d];
                    contador = contador + 1;
                }

                // el valor MAXIMO del array sus_m2
                var aux_maximo = Math.max(...sus_m2);
                maximo_bsm2 = Number(aux_maximo.toFixed(2));
                maximo_bsm2_render = numero_punto_coma(aux_maximo.toFixed(2));
                // el valor minimo del array sus_m2
                var aux_minimo = Math.min(...sus_m2);
                minimo_bsm2 = Number(aux_minimo.toFixed(2));
                minimo_bsm2_render = numero_punto_coma(aux_minimo.toFixed(2));
                // el valor promedio del array sus_m2
                var aux_promedio = sum_sus_m2 / contador;
                promedio_bsm2 = Number(aux_promedio.toFixed(2));
                promedio_bsm2_render = numero_punto_coma(aux_promedio.toFixed(2));
            }

            //--------------------------------------
            var tasa_banco = registro_empresa.tasa_banco;
            var tasa_banco_max = Math.round(tasa_banco + 3);
            //---------------------------------------
            // util para mostrar el mensaje popover correcto
            if (registro_inmueble.estado_inmueble === "remate") {
                var remate = true;
            } else {
                var remate = false;
            }
            //---------------------------------------
            var respuesta_dpp = await datos_pagos_propietario(codigo_inmueble);
            if (respuesta_dpp) {
                var cronograma_pagos = respuesta_dpp.cronograma_pagos;
                var inversion_bs = respuesta_dpp.pago_nuevo_propietario;
                var inversion_bs_render = respuesta_dpp.pago_nuevo_propietario_render;

                // para el valor de contruccion en CALCULADORA INMUEBLE - INVERSIONISTA
                var construccion_inv = inversion_bs - suelo_bs;
                var construccion_inv_render = numero_punto_coma(construccion_inv);
            }
            //---------------------------------------

            var datos_calculadora = {
                remate, // true or false
                cronograma_pagos,
                inversion_bs,
                inversion_bs_render,
                construccion_inv,
                construccion_inv_render,

                direccion,
                ubicacion,

                solidexa_inm_bs,
                plusvalia_inm_bs,
                solidexa_inm_m2,
                solidexa_inm_bsm2,
                solidexa_inm_bs_render,

                suelo_bs,
                suelo_bs_render,
                //construccion_bs: registro_inmueble.precio_construccion,
                //construccion_bs_render: numero_punto_coma(registro_inmueble.precio_construccion),

                maximo_bsm2, // bs/m2 numerico redondeado a 2 decimales
                minimo_bsm2, // bs/m2 numerico redondeado a 2 decimales
                promedio_bsm2, // bs/m2 numerico redondeado a 2 decimales

                maximo_bsm2_render, // bs/m2
                minimo_bsm2_render, // bs/m2
                promedio_bsm2_render, // bs/m2
                meses_min: plazo * 3, // #meses minimo para el tiempo de financiamiento del apalancamiento

                tc_ine: registro_empresa.tc_ine,
                tc_paralelo: registro_empresa.tc_paralelo,
                inflacion: registro_empresa.inflacion_ine,
                tasa_banco,
                tasa_banco_max,
            };

            return datos_calculadora;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------
// CALCULADORA DE INMUEBLE FRACCIONADO

async function inmueble_calculadora_fr(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                superficie_inmueble_m2: 1,
                codigo_terreno: 1,
                codigo_proyecto: 1,
                precio_comparativa: 1,
                m2_comparativa: 1,

                precio_construccion: 1,
                precio_competencia: 1,
                fraccionado: 1,

                _id: 0,
            }
        );

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                tc_ine: 1,
                tc_paralelo: 1,
                inflacion_ine: 1,
                _id: 0,
            }
        );

        var registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: registro_inmueble.codigo_proyecto },
            {
                construccion_mensual: 1, // [ {fecha: String, pago_bs: Number},...,]
                _id: 0,
            }
        );

        var registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: registro_inmueble.codigo_terreno },
            {
                ubicacion: 1,
                direccion: 1,
                fecha_fin_construccion: 1,

                estado_terreno: 1,
                precio_bs: 1,
                descuento_bs: 1,
                rend_fraccion_mensual: 1,
                superficie: 1,
                fecha_inicio_convocatoria: 1,
                fecha_inicio_reservacion: 1,
                fecha_fin_reservacion: 1,

                _id: 0,
            }
        );

        var solidexa_inm_bs = 0;
        var solidexa_inm_bs_render = "0";
        var solidexa_inm_bsm2 = 0;
        var solidexa_inm_m2 = 0;

        var maximo_bsm2 = 0; // por defecto
        var minimo_bsm2 = 0; // por defecto
        var promedio_bsm2 = 0; // por defecto

        var maximo_bsm2_render = "0"; // por defecto
        var minimo_bsm2_render = "0"; // por defecto
        var promedio_bsm2_render = "0"; // por defecto

        var direccion = "Dirección";
        var ubicacion = "Ubicación";

        if (registro_inmueble && registro_proyecto && registro_terreno && registro_empresa) {
            //-------------------------------------------------------------------
            var datos_inm = {
                // datos del inmueble
                codigo_inmueble,
                precio_construccion: registro_inmueble.precio_construccion,
                precio_competencia: registro_inmueble.precio_competencia,
                superficie_inmueble: registro_inmueble.superficie_inmueble_m2,
                fraccionado: registro_inmueble.fraccionado,
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

            var precio_justo = resultado.precio_justo;
            var plusvalia_inm_bs = resultado.plusvalia;
            var suelo_bs = resultado.derecho_suelo;
            var suelo_bs_render = resultado.derecho_suelo_render;

            //-------------------------------------------------------------------
            solidexa_inm_bs = precio_justo; // precio actual del inmueble
            solidexa_inm_bs_render = numero_punto_coma(solidexa_inm_bs);

            solidexa_inm_bsm2 = Number(
                (solidexa_inm_bs / registro_inmueble.superficie_inmueble_m2).toFixed(2)
            ); // en valor numerico con 2 decimales

            solidexa_inm_m2 = registro_inmueble.superficie_inmueble_m2; // de la BD ya viene como numerico y redondeado a 2 decimales

            direccion = registro_terreno.direccion;
            ubicacion = registro_terreno.ubicacion;

            //------------------------------------------------------------

            let precios_otros = registro_inmueble.precio_comparativa;
            let m2_otros = registro_inmueble.m2_comparativa;
            let sus_m2 = [];
            let sum_sus_m2 = 0;
            let contador = 0;

            if (precios_otros.length > 0 && m2_otros.length > 0) {
                for (let d = 0; d < precios_otros.length; d++) {
                    sus_m2[d] = precios_otros[d] / m2_otros[d];
                    sum_sus_m2 = sum_sus_m2 + precios_otros[d] / m2_otros[d];
                    contador = contador + 1;
                }

                // el valor MAXIMO del array sus_m2
                var aux_maximo = Math.max(...sus_m2);
                maximo_bsm2 = Number(aux_maximo.toFixed(2));
                maximo_bsm2_render = numero_punto_coma(aux_maximo.toFixed(2));
                // el valor minimo del array sus_m2
                var aux_minimo = Math.min(...sus_m2);
                minimo_bsm2 = Number(aux_minimo.toFixed(2));
                minimo_bsm2_render = numero_punto_coma(aux_minimo.toFixed(2));
                // el valor promedio del array sus_m2
                var aux_promedio = sum_sus_m2 / contador;
                promedio_bsm2 = Number(aux_promedio.toFixed(2));
                promedio_bsm2_render = numero_punto_coma(aux_promedio.toFixed(2));
            }

            //------------------------------------------------------------
            var registro_fracciones = await indiceFraccionInmueble.findOne(
                { codigo_inmueble: codigo_inmueble, disponible: true },
                {
                    fraccion_bs: 1,
                    _id: 0,
                }
            );

            var nf_maximo = 0; // Por defecto. numero maximo de fracciones de terreno disponibles
            var fraccion_bs = 0; // por defecto. El valor de una fraccion DISPONIBLE de terreno
            var fraccion_bs_render = "0";
            if (registro_fracciones.length > 0) {
                nf_maximo = registro_fracciones.length;
                // bastara tomar el valor de una fraccion, porque todas las demas vigetes tienen el mismo valor
                fraccion_bs = registro_fracciones[0].fraccion_bs;
                fraccion_bs_render = numero_punto_coma(fraccion_bs);
            }
            //------------------------------------------------------------

            var datos_calculadora = {
                nf_maximo,
                fraccion_bs,
                fraccion_bs_render,

                direccion,
                ubicacion,

                solidexa_inm_bs,
                plusvalia_inm_bs,
                solidexa_inm_m2,
                solidexa_inm_bsm2,
                solidexa_inm_bs_render,

                suelo_bs,
                suelo_bs_render,
                construccion_bs: registro_inmueble.precio_construccion,
                construccion_bs_render: numero_punto_coma(registro_inmueble.precio_construccion),

                maximo_bsm2, // bs/m2 numerico redondeado a 2 decimales
                minimo_bsm2, // bs/m2 numerico redondeado a 2 decimales
                promedio_bsm2, // bs/m2 numerico redondeado a 2 decimales

                maximo_bsm2_render, // bs/m2
                minimo_bsm2_render, // bs/m2
                promedio_bsm2_render, // bs/m2

                tc_ine: registro_empresa.tc_ine,
                tc_paralelo: registro_empresa.tc_paralelo,
                inflacion: registro_empresa.inflacion_ine,
            };

            return datos_calculadora;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
// ------------------------------------------------------------------

async function inmueble_inversor(paquete_datos) {
    // ESTO SERA EL MISMO QUE EL LADO DEL ADMINISTRADOR

    try {
        /*
        var paquete_propietario = {
            ci_propietario: paquete_datos.ci_inversionista,
            codigo_inmueble: paquete_datos.codigo_inmueble,
        };
        */

        var aux_respuesta = await datos_pagos_propietario(paquete_datos.codigo_inmueble);
        aux_respuesta.existe_propietario = true; // porque esta pestaña "Propietario" dentro de la ventana de "Inmuble" (lado cliente) solo esta disponible cuando en verdad existe un propietario de este inmueble

        /*
        var reg_estado_propietario = await indiceInversiones.findOne(
            {
                codigo_inmueble: paquete_datos.codigo_inmueble,
                ci_propietario: paquete_datos.ci_inversionista,
            },
            {
                estado_propietario: 1,
                _id: 0,
            }
        );

        aux_respuesta.estado_propietario = reg_estado_propietario.estado_propietario;
        */

        // DOCUMENTOS PRIVADOS DEL PROPIETARIO
        var documentos_privados = [];
        var registro_documentos_priv = await indiceDocumentos.find({
            ci_propietario: paquete_datos.ci_inversionista,
            codigo_inmueble: paquete_datos.codigo_inmueble,
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

        //en caso de que no existiesen documentos privados, entonces "documentos_privados" estara vacio
        aux_respuesta.documentos = documentos_privados;

        return aux_respuesta;
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_adquirir_f_inm(paquete_datos) {
    try {
        var ci_propietario = paquete_datos.ci_propietario;
        var codigo_inmueble = paquete_datos.codigo_inmueble;

        let datos_funcion = {
            ci_propietario,
            codigo_objetivo: codigo_inmueble,
            copropietario: "inmueble",
        };
        let respuesta = await te_inm_copropietario(datos_funcion);

        let leyenda_tiempo = respuesta.leyenda_tiempo;
        let precio_te_inm = respuesta.precio_te_inm;
        let tiene_fracciones = respuesta.tiene_fracciones;
        let array_fracciones = respuesta.array_fracciones;
        let c_ft_d_n = respuesta.c_ft_d_n;
        let c_ft_d_n_render = respuesta.c_ft_d_n_render;
        let c_ft_d_val = respuesta.c_ft_d_val;
        let c_ft_d_val_render = respuesta.c_ft_d_val_render;
        let c_fti_a_n = respuesta.c_fti_a_n;
        let c_fti_a_n_render = respuesta.c_fti_a_n_render;
        let c_fti_a_val = respuesta.c_fti_a_val;
        let c_fti_a_val_render = respuesta.c_fti_a_val_render;
        let c_fti_a_p = respuesta.c_fti_a_p;
        let c_fti_a_p_render = respuesta.c_fti_a_p_render;
        let ti_f_p_render = respuesta.ti_f_p_render;
        let ti_f_val = respuesta.ti_f_val;
        let ti_f_val_render = respuesta.ti_f_val_render;
        let ti_f_d_n = respuesta.ti_f_d_n;
        let ti_f_d_n_render = respuesta.ti_f_d_n_render;
        let ti_f_d_val = respuesta.ti_f_d_val;
        let ti_f_d_val_render = respuesta.ti_f_d_val_render;

        //--------------------------------------------------------

        return {
            leyenda_tiempo,
            precio_te_inm,
            tiene_fracciones,
            array_fracciones,
            c_ft_d_n,
            c_ft_d_n_render,
            c_ft_d_val,
            c_ft_d_val_render,
            c_fti_a_n,
            c_fti_a_n_render,
            c_fti_a_val,
            c_fti_a_val_render,
            c_fti_a_p,
            c_fti_a_p_render,
            ti_f_p_render,
            ti_f_val,
            ti_f_val_render,
            ti_f_d_n,
            ti_f_d_n_render,
            ti_f_d_val,
            ti_f_d_val_render,
        };
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_copropietario(paquete_datos) {
    // es casi similar al controlador: llenar_datos_copropietario_inm

    try {
        var ci_propietario = paquete_datos.ci_propietario;
        var codigo_inmueble = paquete_datos.codigo_inmueble;

        //--------------------------------------------------------
        // para armado de datos personales, documentos privados del copropietario
        var datos_funcion = {
            ci_propietario,
            codigo_objetivo: codigo_inmueble,
            copropietario: "inmueble",
        };

        // {datos personales..., documentos_privados}
        var obj_datos = await datos_copropietario(datos_funcion);

        //--------------------------------------------------------
        // para armado de relacionados con las fracciones del cual el copropietario es dueño

        var obj_fracciones = await te_inm_copropietario(datos_funcion);

        //--------------------------------------------------------
        // union de los dos objetos. todos los elementos de ambos objetos seran unidos en un solo objeto llamado obj_union

        var obj_union = { ...obj_datos, ...obj_fracciones };
        //--------------------------------------------------------

        /*
        if (obj_datos.tiene_datos == false && obj_fracciones.tiene_fracciones == false) {
            // significa que es un usuario completamente nuevo: no tiene datos ni es dueño de fracciones de este inmueble
    
            var caso = "nuevo_a";
        } else {
            if (obj_datos.tiene_datos == true && obj_fracciones.tiene_fracciones == false) {
                // el usuario cuenta con datos registrados, pero NO cuenta con fracciones en el inmueble
                var caso = "nuevo_b";
            }
        }
    
        obj_union.caso = caso;
        */

        //--------------------------------------------------------------

        return obj_union;

        /*
        ESTA ES LA INFORMACION QUE SE DEVUELVE EN obj_union:
        var obj_union = {
            //------------------
            ci_propietario,
            propietario_registrado,
            nombres_propietario,
            apellidos_propietario,
            departamento_propietario,
            provincia_propietario,
            domicilio_propietario,
            ocupacion_propietario,
            fecha_nacimiento_propietario,
            telefonos_propietario,
            documentos_privados,
            tiene_datos,
            //------------------
            leyenda_tiempo,
            precio_te_inm,
            tiene_fracciones,
            array_fracciones,
            c_ft_d_n,
            c_ft_d_n_render,
            c_ft_d_val,
            c_ft_d_val_render,
            c_fti_a_n,
            c_fti_a_n_render,
            c_fti_a_val,
            c_fti_a_val_render,
            c_fti_a_p,
            c_fti_a_p_render,
            ti_f_p_render,
            ti_f_val,
            ti_f_val_render,
            ti_f_d_n,
            ti_f_d_n_render,
            ti_f_d_val,
            ti_f_d_val_render,
            //---------------------
            caso,
        }
        */
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------
// para informacion global de INMUEBLE que se mostrara en todas las ventanas

async function complementos_globales_inm(paquete_datos) {
    const codigo_inmueble = paquete_datos.codigo_inmueble;

    const ci_inversionista = paquete_datos.ci_inversionista;

    // por defecto:
    var existe_inversor_inmueble = false;
    var existe_copropietario_inmueble = false;
    var adquirir_f_inm = false; // sera "true" para que el copropietario del terreno pueda adquirir fracciones del inmueble usando sus fracciones de terreno

    var aux_inmueble = await indiceInmueble.findOne(
        { codigo_inmueble: codigo_inmueble },
        {
            codigo_proyecto: 1,
            codigo_terreno: 1,
            estado_inmueble: 1,
            fraccionado: 1, // true o false
            fecha_fin_fraccionado: 1, // solo es de utilidad si fraccionado es true
        }
    );

    const codigo_proyecto = aux_inmueble.codigo_proyecto;

    /*
    var basico_py = await indiceProyecto.findOne(
        { codigo_proyecto: codigo_proyecto },
        {
            nombre_proyecto: 1,
            estado_proyecto: 1,
        }
    );
    */

    //if (basico_py) {
    if (aux_inmueble) {
        var registro_imagenes_py = await indiceImagenesProyecto.find(
            {
                codigo_proyecto: codigo_proyecto,
                imagen_respon_social: false,
            },
            {
                nombre_imagen: 1,
                codigo_imagen: 1,
                extension_imagen: 1,
                parte_principal: 1,
                parte_exclusiva: 1,
                url: 1,
                _id: 0,
            }
        );

        var imagenes_inm_principal = []; // asumimos por defecto
        var imagenes_inm_exclusiva = []; // asumimos por defecto
        if (registro_imagenes_py.length > 0) {
            var i_principal = -1;
            var i_exclusiva = -1;
            for (let i = 0; i < registro_imagenes_py.length; i++) {
                // revision si la "imagen for" es una imagen principal del inmueble

                let arrayPrincipalesFor = registro_imagenes_py[i].parte_principal;

                // buscamos en este "arrayPrincipalesFor" si existe el codigo del inmueble (buscando la posicion que este ocupa en el presente ARRAY)
                let pocisionExiste = arrayPrincipalesFor.indexOf(codigo_inmueble);
                if (pocisionExiste != -1) {
                    // si el codigo del INMUEBLE figura en este ARRAY, significa que la presente imagen for, es la imagen principal del INMUEBLE

                    // incrementamos en +1 la pocision para construir el ARRAY
                    i_principal = i_principal + 1; // AUNQUE SOLO PUEDE EXISTIR 1 IMAGEN COMO PRINCIPAL
                    // llenamos el objeto con los valores de la imagen que corresponda "i"
                    imagenes_inm_principal[i_principal] = {
                        nombre_imagen: registro_imagenes_py[i].nombre_imagen,
                        codigo_imagen: registro_imagenes_py[i].codigo_imagen, // sin extension
                        inmueble_imagen:
                            registro_imagenes_py[i].codigo_imagen +
                            registro_imagenes_py[i].extension_imagen,
                        url: registro_imagenes_py[i].url,
                    };
                } else {
                    // si la imagen no es "principal" para el proyecto,
                    // entonces revisamos si es una "exclusiva" del proyecto
                    let arrayExclusivasFor = registro_imagenes_py[i].parte_exclusiva;

                    // buscamos en este "arrayExclusivasFor" si existe el codigo del proyecto (buscando la posicion que este ocupa en el presente ARRAY)
                    let pocisionExiste = arrayExclusivasFor.indexOf(codigo_inmueble);

                    if (pocisionExiste != -1) {
                        // si el codigo del inmueble figura en este ARRAY, significa que la presente imagen for, es una imagen exclusiva del inmueble

                        // incrementamos en +1 la pocision para construir el ARRAY
                        i_exclusiva = i_exclusiva + 1;
                        // llenamos el objeto con los valores de la imagen que corresponda "i"
                        imagenes_inm_exclusiva[i_exclusiva] = {
                            nombre_imagen: registro_imagenes_py[i].nombre_imagen,
                            codigo_imagen: registro_imagenes_py[i].codigo_imagen, // sin extension
                            inmueble_imagen:
                                registro_imagenes_py[i].codigo_imagen +
                                registro_imagenes_py[i].extension_imagen,
                            url: registro_imagenes_py[i].url,
                        };
                    }
                }
            }
        }

        // solo para mostrar las pestañas de navegacion correspondientes al estado del proyecto

        //----------------------------------------------------------
        // para mostrar la pestaña del inversor o copropietario del presente inmueble

        if (ci_inversionista != "ninguno") {
            // CORREGIR. QUE SEA VERIFICADO PRIMER POR ESTADO DEL TERRENO, YA QUE EL PROPIETARIO PUEDE TENER FRACCIONES DE TERRENO YA UTILIZADAS FIGURANDO COMO FRACCIONES DE INMUEBLES, Y PUDE TENER ALGUNAS FRACCIONES DEL MISMO TERRENO AUN SIN UTILIZAR ESPERANDO UTILIZARLO EN ALGUN OTRO INM SOBRE EL MISMO TERRENO.

            if (aux_inmueble.fraccionado) {
                let registro_copropietario_inm = await indiceFraccionInmueble.find(
                    {
                        codigo_terreno: aux_inmueble.codigo_terreno,
                        ci_propietario: ci_inversionista,
                    },
                    {
                        codigo_fraccion: 1,
                        fraccion_bs: 1,
                        tipo: 1,
                    }
                );

                if (registro_copropietario_inm.length > 0) {
                    existe_copropietario_inmueble = true;

                    let registro_terreno = await indiceTerreno.findOne(
                        {
                            codigo_terreno: aux_inmueble.codigo_terreno,
                        },
                        {
                            estado_terreno: 1,
                        }
                    );

                    let fecha_actual = new Date();
                    let fecha_fin_fraccionado = aux_inmueble.fecha_fin_fraccionado;

                    if (
                        registro_terreno.estado_terreno == "reservacion" &&
                        fecha_actual <= fecha_fin_fraccionado
                    ) {
                        adquirir_f_inm = true;
                    }
                }
            } else {
                // entonces se trata de un inmueble del tipo entero
                let registro_inversor = await indiceInversiones.findOne({
                    ci_propietario: ci_inversionista,
                    codigo_inmueble: codigo_inmueble,
                });
                if (registro_inversor) {
                    // si el inversor EXISTE EN LA BASE DE DATOS y es actual dueño del presente INMUEBLE
                    existe_inversor_inmueble = true;
                }
            }
        }

        //----------------------------------------------------------
        // para mostrar la pestaña de fracciones del inmueble si es que las tuviera
        if (aux_inmueble.fraccionado) {
            // si es true, es porque el inmueble es del tipo fraccionado (COPROPIETARIOS) y tiene fracciones que mostrarse
            var existe_fracciones_inmueble = true;
        } else {
            var existe_fracciones_inmueble = false;
        }

        //----------------------------------------------------------
        // para mostrar u ocultar la pestaña de calculadora dentro del inmueble

        // para mostrar la calculadora correcta del inmueble
        if (aux_inmueble.fraccionado) {
            // se trata de un inmueble fraccionado
            var inm_fraccionado = true;

            let fraccionesInmueble = await indiceFraccionInmueble.find({
                codigo_inmueble: codigo_inmueble,
                disponible: true,
            });

            if (fraccionesInmueble.length > 0) {
                var existe_calculadora_inmueble = true;
            } else {
                var existe_calculadora_inmueble = false;
            }
        } else {
            // se trata de un inmueble entero
            var inm_fraccionado = false;
            if (
                aux_inmueble.estado_inmueble == "disponible" ||
                aux_inmueble.estado_inmueble == "remate"
            ) {
                // la pestaña de "calculadora" sera visible cuando el inmueble este en estado de: disponible, remate
                var existe_calculadora_inmueble = true;
            } else {
                var existe_calculadora_inmueble = false;
            }
        }

        //----------------------------------------------------------

        return {
            codigo_proyecto,
            //nombre_proyecto: basico_py.nombre_proyecto,
            //estado_proyecto: basico_py.estado_proyecto,

            //tipo_inmueble, // (departamento, garzonier, tienda, otro [en ese caso especificado] )
            codigo_inmueble,

            imagenes_inm_principal,
            imagenes_inm_exclusiva,

            existe_inversor_inmueble,
            existe_copropietario_inmueble,
            adquirir_f_inm, // true o false
            inm_fraccionado, // true o false

            existe_fracciones_inmueble,

            existe_calculadora_inmueble,
        };
    }
}

// ------------------------------------------------------------------

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorCliInmueble;
