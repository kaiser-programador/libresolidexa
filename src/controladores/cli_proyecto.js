// CONTROLADORES PARA EL PROYECTO DESDE EL LADO DEL CLIENTE PUBLICO

const {
    indiceProyecto,
    indiceImagenesProyecto,
    indiceDocumentos,
    indiceInmueble,
    indiceTerreno,
    indiceEmpresa,
    indiceRequerimientos,
    indiceImagenesEmpresa_sf,
} = require("../modelos/indicemodelo");

const { inmueble_card_adm_cli } = require("../ayudas/funcionesayuda_1");

const { cabezeras_adm_cli } = require("../ayudas/funcionesayuda_2");

const { numero_punto_coma, verificarTePyInmFracc } = require("../ayudas/funcionesayuda_3");

const { super_info_py } = require("../ayudas/funcionesayuda_5");

const moment = require("moment");

const controladorCliProyecto = {};

/************************************************************************************ */
/************************************************************************************ */
// PARA RENDERIZAR LA VENTANA DEL PROYECTO DESDE EL LADO PUBLICO DEL CLIENTE
// RUTA   "get"   /proyecto/:codigo_proyecto/:vista_py
controladorCliProyecto.renderVentanaProyecto = async (req, res) => {
    try {
        var codigo_proyecto = req.params.codigo_proyecto;
        var tipo_vista_proyecto = req.params.vista_py;

        //IMPORTANTE: PARA NO PERMITIR EL ACCESO A PROYECTOS INEXISTENTES O QUE NO ESTAN DISPONIBLES PARA SER VISIBLES POR EL USUARIO, ES QUE 1º EL PROYECTO SERA BUSCADO EN LA BASE DE DATOS
        var paqueteria_datos = {
            codigo_objetivo: codigo_proyecto,
            tipo: "proyecto",
        };
        var verificacion = await verificarTePyInmFracc(paqueteria_datos);

        if (verificacion == true) {
            // ------- Para verificación -------
            //console.log("el codigo del proyectaso es:");
            //console.log(codigo_proyecto);
            // ------- Para verificación -------
            //console.log("tipo de vista del proyectaso es:");
            //console.log(tipo_vista_proyecto);

            var info_proyecto_cli = {};
            info_proyecto_cli.codigo_proyecto = codigo_proyecto;
            info_proyecto_cli.navegador_cliente = true;
            info_proyecto_cli.cab_py_cli = true;
            info_proyecto_cli.estilo_cabezera = "cabezera_estilo_proyecto";

            //----------------------------------------------------

            //////var inversor_autenticado = validar_cli_2(); // devuelve "true" or "false"

            // ------- Para verificación -------
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO");
            //console.log(req.inversor_autenticado);
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");

            info_proyecto_cli.inversor_autenticado = req.inversor_autenticado;
            // si es TRUE y solo si es true, entonces se mostrara su ci
            if (req.inversor_autenticado) {
                info_proyecto_cli.ci_propietario = req.user.ci_propietario;
            }

            var aux_cabezera = {
                codigo_objetivo: codigo_proyecto,
                tipo: "proyecto",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_proyecto_cli.cabezera_cli = cabezera_cli;

            info_proyecto_cli.global_py = await complementos_globales_py(codigo_proyecto);

            info_proyecto_cli.es_proyecto = true; // para menu navegacion comprimido

            //----------------------------------------------------
            // paquete para mostrar en la pestaña "Inmuebles" (si es que existiesen) el numero de inmuebles dependiendo del estado. Y numero de requerimientos
            var paquete_badge = {
                codigo_proyecto,
            };
            var badge = await valores_badge(paquete_badge);
            info_proyecto_cli.existe_n_inmuebles = badge.existe_n_inmuebles;
            info_proyecto_cli.n_inmuebles = badge.n_inmuebles;
            info_proyecto_cli.existe_n_requerimientos = badge.existe_n_requerimientos;
            info_proyecto_cli.n_requerimientos = badge.n_requerimientos;
            //----------------------------------------------------

            if (tipo_vista_proyecto == "descripcion") {
                // para pestaña y ventana apropiada para proyecto
                info_proyecto_cli.descripcion_py = true;

                info_proyecto_cli.info_segundero = true;

                // para mostrar circulos estados y caracteristicas del proyecto
                info_proyecto_cli.estado_caracteristicas = true;

                info_proyecto_cli.caracteristicas_proyecto = true;

                var info_proyecto = await proyecto_descripcion(codigo_proyecto);
                info_proyecto_cli.informacion = info_proyecto;
                //agregamos info complementaria
                info_proyecto_cli.codigo_proyecto = codigo_proyecto;

                // ------- Para verificación -------
                //console.log("los datos info de PROYECTO CLIENTE son");
                //console.log(info_proyecto_cli);

                res.render("cli_proyecto", info_proyecto_cli);
            }

            if (tipo_vista_proyecto == "inmuebles") {
                // agregamos info complementaria

                // si el cliente esta navegado con su cuenta
                if (req.inversor_autenticado) {
                    var cod_inversor = req.user.ci_propietario;

                    // ------- Para verificación -------
                    //console.log("el codigo del propietario registrado con su cuenta es");
                    //console.log(cod_inversor);
                } else {
                    // en caso de que este navegando sin haber accedido a su cuenta personal

                    var cod_inversor = "ninguno";
                }

                var paqueteDatos = {
                    codigo_proyecto,
                    cod_inversor,
                };

                let contenido_proyecto = await proyecto_inmuebles(paqueteDatos);
                info_proyecto_cli.inmuebles_py = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto_cli.contenido_proyecto = contenido_proyecto;

                //estado_terreno: { type: String, default: "guardado" }, // guardado, reserva, pago, aprobacion, construccion, construido
                //--------------------------------------------------------------
                info_proyecto_cli.estado_py_todos = true; // para mostrar todos en boton radio opciones

                let registro_proyecto = await indiceInmueble.findOne(
                    { codigo_proyecto: codigo_proyecto },
                    {
                        codigo_terreno: 1,
                        _id: 0,
                    }
                );

                if (registro_proyecto) {
                    let registro_terreno = await indiceTerreno.findOne(
                        { codigo_terreno: registro_proyecto.codigo_terreno },
                        {
                            estado_terreno: 1,
                            _id: 0,
                        }
                    );
                    if (registro_terreno) {
                        if (registro_terreno.estado_terreno == "reservacion") {
                            info_proyecto_cli.estado_py_reserva = true;
                        }
                        if (registro_terreno.estado_terreno == "construccion") {
                            info_proyecto_cli.estado_py_construccion = true;
                        }
                        if (registro_terreno.estado_terreno == "construido") {
                            info_proyecto_cli.estado_py_construido = true;
                        }
                    }
                }

                //--------------------------------------------------------------
                // Para mostrar el filtro de tipo de inmuebles en caso de que se trata de un PROYECTO EDIFICIO

                var aux_proyecto = await indiceProyecto.findOne(
                    { codigo_proyecto: codigo_proyecto },
                    {
                        tipo_proyecto: 1,
                        _id: 0,
                    }
                );

                if (aux_proyecto.tipo_proyecto == "edificio") {
                    info_proyecto_cli.tipo_py_edificio = true;
                }
                if (aux_proyecto.tipo_proyecto == "condominio") {
                    info_proyecto_cli.tipo_py_edificio = false;
                }
                //--------------------------------------------------------------
                // para contar el numero de inmuebles, segun el estado que posean
                let aux_n_todos = contenido_proyecto.length;
                let aux_n_disponible = 0;
                let aux_n_reservado = 0;
                let aux_n_construccion = 0;
                let aux_n_remate = 0;
                let aux_n_construido = 0;

                // guardado, disponible, reservado, construccion, remate, construido  OK
                if (contenido_proyecto.length > 0) {
                    for (let i = 0; i < contenido_proyecto.length; i++) {
                        let aux_estado_inmueble = contenido_proyecto[i].estado_inmueble;
                        if (aux_estado_inmueble == "disponible") {
                            aux_n_disponible = aux_n_disponible + 1;
                        }
                        if (aux_estado_inmueble == "reservado") {
                            aux_n_reservado = aux_n_reservado + 1;
                        }
                        if (aux_estado_inmueble == "construccion") {
                            aux_n_construccion = aux_n_construccion + 1;
                        }
                        if (aux_estado_inmueble == "remate") {
                            aux_n_remate = aux_n_remate + 1;
                        }
                        if (aux_estado_inmueble == "construido") {
                            aux_n_construido = aux_n_construido + 1;
                        }
                    }
                }

                //-----------------------------------------------
                // despues de pasar por todos los conteos de inmuebles

                if (aux_n_todos > 0) {
                    info_proyecto_cli.badge_todos = true;
                } else {
                    info_proyecto_cli.badge_todos = false;
                }

                if (aux_n_disponible > 0) {
                    info_proyecto_cli.badge_disponible = true;
                } else {
                    info_proyecto_cli.badge_disponible = false;
                }

                if (aux_n_reservado > 0) {
                    info_proyecto_cli.badge_reservado = true;
                } else {
                    info_proyecto_cli.badge_reservado = false;
                }

                if (aux_n_construccion > 0) {
                    info_proyecto_cli.badge_construccion = true;
                } else {
                    info_proyecto_cli.badge_construccion = false;
                }

                if (aux_n_remate > 0) {
                    info_proyecto_cli.badge_remate = true;
                } else {
                    info_proyecto_cli.badge_remate = false;
                }

                if (aux_n_construido > 0) {
                    info_proyecto_cli.badge_construido = true;
                } else {
                    info_proyecto_cli.badge_construido = false;
                }

                //-----------------------------------------------

                info_proyecto_cli.n_todos = aux_n_todos;
                info_proyecto_cli.n_disponible = aux_n_disponible;
                info_proyecto_cli.n_reservado = aux_n_reservado;
                info_proyecto_cli.n_construccion = aux_n_construccion;
                info_proyecto_cli.n_remate = aux_n_remate;
                info_proyecto_cli.n_construido = aux_n_construido;

                //--------------------------------------------------------------

                // ------- Para verificación -------
                //console.log("los inmuebles de proyecto son ");
                //console.log(info_proyecto_cli);

                res.render("cli_proyecto", info_proyecto_cli);
            }

            if (tipo_vista_proyecto == "garantias") {
                var contenido_proyecto = await proyecto_garantias(codigo_proyecto);

                info_proyecto_cli.contenido_proyecto = contenido_proyecto;

                // agregamos info complementaria
                info_proyecto_cli.codigo_proyecto = codigo_proyecto;

                // para pestaña y ventana apropiada para proyecto
                info_proyecto_cli.garantias_py = true;

                // ------- Para verificación -------
                //console.log("LOS DATOS A RENDERIZAR DE GARANTIAS DEL PROYECTO");
                //console.log(info_proyecto_cli);

                res.render("cli_proyecto", info_proyecto_cli);
            }

            if (tipo_vista_proyecto == "beneficios") {
                var contenido_proyecto = await proyecto_beneficios(codigo_proyecto);

                info_proyecto_cli.contenido_proyecto = contenido_proyecto;

                // agregamos info complementaria
                info_proyecto_cli.codigo_proyecto = codigo_proyecto;

                // para pestaña y ventana apropiada para proyecto
                info_proyecto_cli.beneficios_py = true;

                // ------- Para verificación -------
                //console.log("LOS DATOS A RENDERIZAR DE BENEFICIOS DEL PROYECTO");
                //console.log(info_proyecto_cli);

                res.render("cli_proyecto", info_proyecto_cli);
            }

            if (tipo_vista_proyecto == "info_economico") {
                var contenido_proyecto = await proyecto_info_economico(codigo_proyecto);

                info_proyecto_cli.contenido_proyecto = contenido_proyecto;

                // agregamos info complementaria
                info_proyecto_cli.codigo_proyecto = codigo_proyecto;

                // para pestaña y ventana apropiada para proyecto
                info_proyecto_cli.informe_economico = true;

                // ------- Para verificación -------
                //console.log("LOS DATOS A RENDERIZAR DE INFORME ECONOMICO DEL PROYECTO");
                //console.log(info_proyecto_cli);

                res.render("cli_proyecto", info_proyecto_cli);
            }

            if (tipo_vista_proyecto == "empleos") {
                var contenido_proyecto = await proyecto_empleos(codigo_proyecto);

                info_proyecto_cli.contenido_proyecto = contenido_proyecto;

                // agregamos info complementaria
                info_proyecto_cli.codigo_proyecto = codigo_proyecto;

                // para pestaña y ventana apropiada para proyecto
                info_proyecto_cli.empleos_py = true;

                // ------- Para verificación -------
                //console.log("LOS DATOS A RENDERIZAR DE EMPLEOS DEL PROYECTO");
                //console.log(info_proyecto_cli);

                res.render("cli_proyecto", info_proyecto_cli);
            }

            if (tipo_vista_proyecto == "requerimientos") {
                var contenido_proyecto = await proyecto_requerimientos(codigo_proyecto);

                info_proyecto_cli.contenido_proyecto = contenido_proyecto;

                // agregamos info complementaria
                info_proyecto_cli.codigo_proyecto = codigo_proyecto;

                // para pestaña y ventana apropiada para proyecto
                info_proyecto_cli.requerimientos_py = true;

                // ------- Para verificación -------
                //console.log("LOS DATOS A RENDERIZAR DE EMPLEOS DEL PROYECTO");
                //console.log(info_proyecto_cli);

                res.render("cli_proyecto", info_proyecto_cli);
            }

            if (tipo_vista_proyecto == "resp_social") {
                var contenido_proyecto = await proyecto_resp_social(codigo_proyecto);

                info_proyecto_cli.contenido_proyecto = contenido_proyecto;

                // agregamos info complementaria
                info_proyecto_cli.codigo_proyecto = codigo_proyecto;

                // para pestaña y ventana apropiada para proyecto
                info_proyecto_cli.responsabilidad_social = true;

                // ------- Para verificación -------
                console.log("los datos a renderizar de responsabilidad social");
                console.log(info_proyecto_cli);

                res.render("cli_proyecto", info_proyecto_cli);
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN PROYECTO INEXISTENTE O QUE NO ESTA AUN DISPONIBLE PARA SER VISUALIZADO POR EL CLIENTE.
            res.redirect("/"); // rediccionara a la pagina DE INICIO DEL CLIENTE
        }
    } catch (error) {
        console.log(error);
    }
};

// ------------------------------------------------------------------

async function proyecto_descripcion(codigo_proyecto) {
    try {
        moment.locale("es");

        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                codigo_terreno: 1,
                codigo_proyecto: 1,
                nombre_proyecto: 1,
                meses_construccion: 1,

                tipo_proyecto: 1,

                total_departamentos: 1,
                total_oficinas: 1,
                total_comerciales: 1,
                total_casas: 1,
                trafico: 1,
                garajes: 1,
                area_construida: 1,
                proyecto_descripcion: 1,

                titulo_garantia_1: 1,
                garantia_1: 1,
                titulo_garantia_2: 1,
                garantia_2: 1,
                titulo_garantia_3: 1,
                garantia_3: 1,

                titulo_otros_1: 1,
                otros_1: 1,
                titulo_otros_2: 1,
                otros_2: 1,
                titulo_otros_3: 1,
                otros_3: 1,
                acabados: 1,

                mensaje_segundero_py_inm_a: 1,
                mensaje_segundero_py_inm_b: 1,
                nota_precio_justo: 1,

                _id: 0,
            }
        );

        if (registro_proyecto) {
            let codigo_terreno = registro_proyecto.codigo_terreno;

            const registro_terreno = await indiceTerreno.findOne(
                { codigo_terreno: codigo_terreno },
                {
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

            if (registro_terreno) {
                // conversion del documento MONGO ({OBJETO}) a "string"
                var aux_string = JSON.stringify(registro_proyecto);

                // reconversion del "string" a "objeto"
                var py_descripcion = JSON.parse(aux_string);

                // correccion superficie del py en punto mil
                py_descripcion.area_construida = numero_punto_coma(
                    registro_proyecto.area_construida
                );

                // por defecto ponemos a todos en "false"
                py_descripcion.resplandor_1 = false;
                py_descripcion.resplandor_2 = false;
                py_descripcion.resplandor_3 = false;
                py_descripcion.resplandor_4 = false;
                py_descripcion.resplandor_5 = false;

                // guardado, convocatoria, anteproyecto, reservacion, construccion, construido OK
                // corregimos que estado estara como "true"
                if (registro_terreno.estado_terreno == "convocatoria") {
                    py_descripcion.resplandor_1 = true;
                }
                if (registro_terreno.estado_terreno == "anteproyecto") {
                    py_descripcion.resplandor_2 = true;
                }
                if (registro_terreno.estado_terreno == "reservacion") {
                    py_descripcion.resplandor_3 = true;
                }
                if (registro_terreno.estado_terreno == "construccion") {
                    py_descripcion.resplandor_4 = true;
                }
                if (registro_terreno.estado_terreno == "construido") {
                    py_descripcion.resplandor_5 = true;
                }

                if (registro_terreno.estado_terreno == "construido") {
                    var mensaje_segundero = registro_proyecto.mensaje_segundero_py_inm_b;
                } else {
                    var mensaje_segundero = registro_proyecto.mensaje_segundero_py_inm_a;
                }
                py_descripcion.mensaje_segundero = mensaje_segundero;

                //-------------------------------------------------------------------
                // para tipo de proyecto: edificio || condominio

                if (registro_proyecto.tipo_proyecto == "edificio") {
                    py_descripcion.tipo_edificio = true;
                    py_descripcion.tipo_condominio = false;
                }
                if (registro_proyecto.tipo_proyecto == "condominio") {
                    py_descripcion.tipo_edificio = false;
                    py_descripcion.tipo_condominio = true;
                }

                //-------------------------------------------------------------------
                // PUNTOS DESCRIPTIVOS DEL PROYECTO

                var titulo_ot_a = registro_proyecto.titulo_otros_1;
                var array_ot = registro_proyecto.otros_1.split("*");
                var puntos_ot_a = [];
                if (titulo_ot_a != "") {
                    for (let i = 1; i < array_ot.length; i++) {
                        // desde i = 1 ok
                        puntos_ot_a[i - 1] = { punto: array_ot[i] };
                    }
                }

                var titulo_ot_b = registro_proyecto.titulo_otros_2;
                var array_ot = registro_proyecto.otros_2.split("*");
                var puntos_ot_b = [];
                if (titulo_ot_b != "") {
                    for (let i = 1; i < array_ot.length; i++) {
                        // desde i = 1 ok
                        puntos_ot_b[i - 1] = { punto: array_ot[i] };
                    }
                }

                var titulo_ot_c = registro_proyecto.titulo_otros_3;
                var array_ot = registro_proyecto.otros_3.split("*");
                var puntos_ot_c = [];
                if (titulo_ot_c != "") {
                    for (let i = 1; i < array_ot.length; i++) {
                        // desde i = 1 ok
                        puntos_ot_c[i - 1] = { punto: array_ot[i] };
                    }
                }
                //-------------------------------------------------------------------

                // UBICACION DEL PROYECTO

                py_descripcion.ciudad = registro_terreno.ciudad;
                py_descripcion.provincia = registro_terreno.provincia;
                py_descripcion.direccion = registro_terreno.direccion;
                py_descripcion.link_googlemap = registro_terreno.link_googlemap;

                var titulo_up_a = registro_terreno.titulo_ubi_otros_1;
                var array_up = registro_terreno.ubi_otros_1.split("*");
                var puntos_up_a = [];
                if (titulo_up_a != "") {
                    for (let i = 1; i < array_up.length; i++) {
                        // desde i = 1 ok
                        puntos_up_a[i - 1] = { punto: array_up[i] };
                    }
                }

                var titulo_up_b = registro_terreno.titulo_ubi_otros_2;
                var array_up = registro_terreno.ubi_otros_2.split("*");
                var puntos_up_b = [];
                if (titulo_up_b != "") {
                    for (let i = 1; i < array_up.length; i++) {
                        // desde i = 1 ok
                        puntos_up_b[i - 1] = { punto: array_up[i] };
                    }
                }

                var titulo_up_c = registro_terreno.titulo_ubi_otros_3;
                var array_up = registro_terreno.ubi_otros_3.split("*");
                var puntos_up_c = [];
                if (titulo_up_c != "") {
                    for (let i = 1; i < array_up.length; i++) {
                        // desde i = 1 ok
                        puntos_up_c[i - 1] = { punto: array_up[i] };
                    }
                }

                //-------------------------------------------------------------------
                var datos_funcion = {
                    //------------------------------
                    // datos del proyecto
                    codigo_proyecto,

                    //------------------------------
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
                var resultado = await super_info_py(datos_funcion);

                var inmuebles_total = resultado.inmuebles_total;
                var inmuebles_disponibles = resultado.inmuebles_disponibles;
                var dormitorios_total = resultado.dormitorios_total;
                var banos_total = resultado.banos_total;
                var derecho_suelo = resultado.derecho_suelo;
                var derecho_suelo_render = resultado.derecho_suelo_render;
                var precio_justo = resultado.precio_justo;
                var precio_justo_render = resultado.precio_justo_render;
                var plusvalia = resultado.plusvalia;
                var plusvalia_render = resultado.plusvalia_render;
                var descuento_suelo = resultado.descuento_suelo;
                var descuento_suelo_render = resultado.descuento_suelo_render;
                var plazo_titulo = resultado.plazo_titulo;
                var plazo_tiempo = resultado.plazo_tiempo;
                var p_financiamiento = resultado.p_financiamiento;
                var p_financiamiento_render = resultado.p_financiamiento_render;
                var financiamiento = resultado.financiamiento;
                var financiamiento_render = resultado.financiamiento_render;
                var meta = resultado.meta;
                var meta_render = resultado.meta_render;
                var array_segundero = resultado.array_segundero;
                //-------------------------------------------------------------------

                py_descripcion.precio_justo = precio_justo;
                py_descripcion.precio_justo_render = precio_justo_render;
                py_descripcion.plusvalia = plusvalia;
                py_descripcion.plusvalia_render = plusvalia_render;
                py_descripcion.precio_tradicional = precio_justo + plusvalia;
                py_descripcion.precio_tradicional_render = numero_punto_coma(precio_tradicional);

                py_descripcion.derecho_suelo = derecho_suelo;
                py_descripcion.derecho_suelo_render = derecho_suelo_render;
                py_descripcion.descuento_suelo = descuento_suelo;
                py_descripcion.descuento_suelo_render = descuento_suelo_render;

                py_descripcion.financiamiento = financiamiento;
                py_descripcion.financiamiento_render = financiamiento_render;
                py_descripcion.p_financiamiento = p_financiamiento;
                py_descripcion.p_financiamiento_render = p_financiamiento_render;
                py_descripcion.plazo_titulo = plazo_titulo;
                py_descripcion.plazo_tiempo = plazo_tiempo;
                py_descripcion.array_segundero = array_segundero;

                py_descripcion.dormitorios_total = dormitorios_total;
                py_descripcion.banos_total = banos_total;

                //-------------------------------------------------------------------------------

                py_descripcion.titulo_ot_a = titulo_ot_a;
                py_descripcion.puntos_ot_a = puntos_ot_a;
                py_descripcion.titulo_ot_b = titulo_ot_b;
                py_descripcion.puntos_ot_b = puntos_ot_b;
                py_descripcion.titulo_ot_c = titulo_ot_c;
                py_descripcion.puntos_ot_c = puntos_ot_c;

                py_descripcion.titulo_up_a = titulo_up_a;
                py_descripcion.puntos_up_a = puntos_up_a;
                py_descripcion.titulo_up_b = titulo_up_b;
                py_descripcion.puntos_up_b = puntos_up_b;
                py_descripcion.titulo_up_c = titulo_up_c;
                py_descripcion.puntos_up_c = puntos_up_c;

                //-------------------------------------------------------------------
                var registro_documentos = await indiceDocumentos.find({
                    codigo_proyecto: codigo_proyecto,
                    clase_documento: "General",
                    codigo_inmueble: "",
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
                py_descripcion.documentos_descripcion = documentos_descripcion;

                //-------------------------------------------------------------------

                return py_descripcion;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function proyecto_inmuebles(paqueteDatos) {
    try {
        var codigo_proyecto = paqueteDatos.codigo_proyecto;
        var cod_inversor = paqueteDatos.cod_inversor;

        // ordenamos por numero de piso (de menor a mayor, por ello se escribio "1")
        // Al parecer si el dato "piso" estubiera dentro de un objero EJ/ "descripcion_inmueble", tambien funcionaria como se lo declara aqui
        // $ne: "guardado" es para no considerar a los inmuebles que esten guardados, es decir que se mostraran todos aquellos inmuebles que sean diferentes al estado de "guardado"
        var inmuebles_py = await indiceInmueble
            .find(
                { codigo_proyecto: codigo_proyecto, estado_inmueble: { $ne: "guardado" } },
                {
                    codigo_inmueble: 1,
                    _id: 0,
                }
            )
            .sort({ piso: 1 });

        if (inmuebles_py.length > 0) {
            var contenido_inm_py = [];
            for (let i = 0; i < inmuebles_py.length; i++) {
                // paquete_inmueble = {codigo_inmueble,codigo_usuario}
                var paquete_inmueble_i = {
                    codigo_inmueble: inmuebles_py[i].codigo_inmueble,
                    codigo_usuario: cod_inversor,
                    laapirest: "/", // por partir desde el lado del CLIENTE
                };
                contenido_inm_py[i] = await inmueble_card_adm_cli(paquete_inmueble_i);
                contenido_inm_py[i].card_externo = false; // para que muestre info de card interiores
            }
            return contenido_inm_py;
        } else {
            var contenido_inm_py = [];
            return contenido_inm_py;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function proyecto_garantias(codigo_proyecto) {
    try {
        var registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                titulo_garantia_1: 1,
                garantia_1: 1,
                titulo_garantia_2: 1,
                garantia_2: 1,
                titulo_garantia_3: 1,
                garantia_3: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            var registro_documentos = await indiceDocumentos.find({
                codigo_proyecto: codigo_proyecto,
                clase_documento: "Garantía",
                codigo_inmueble: "",
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

            var info_proyecto_garantias = {
                titulo_garantia_1: registro_proyecto.titulo_garantia_1,
                garantia_1: registro_proyecto.garantia_1,
                titulo_garantia_2: registro_proyecto.titulo_garantia_2,
                garantia_2: registro_proyecto.garantia_2,
                titulo_garantia_3: registro_proyecto.titulo_garantia_3,
                garantia_3: registro_proyecto.garantia_3,

                documentacion,
            };

            return info_proyecto_garantias;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function proyecto_beneficios(codigo_proyecto) {
    try {
        var registro_proyecto = await indiceProyecto.findOne(
            {
                codigo_proyecto: codigo_proyecto,
            },
            {
                codigo_terreno: 1,
                contructora_dolar_m2_1: 1,
                contructora_dolar_m2_2: 1,
                contructora_dolar_m2_3: 1,
                volterra_dolar_m2: 1,
                area_construida: 1,

                nombre_proyecto: 1,
                titulo_construccion_py: 1,
                texto_construccion_py: 1,
                nota_construccion_py: 1,
                titulo_plusvalia_py: 1,
                texto_plusvalia_py: 1,
                nota_plusvalia_py: 1,

                _id: 0,
            }
        );

        var registro_terreno = await indiceTerreno.findOne(
            {
                codigo_terreno: registro_proyecto.codigo_terreno,
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
            //-------------------------------------------------------------------------------

            var datos_funcion = {
                //------------------------------
                // datos del proyecto
                codigo_proyecto,

                //------------------------------
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
            var resultado = await super_info_py(datos_funcion);

            var precio_justo = resultado.precio_justo;
            var precio_justo_render = resultado.precio_justo_render;
            var plusvalia = resultado.plusvalia;
            var plusvalia_render = resultado.plusvalia_render;

            //-------------------------------------------------------------------------------
            // COSTO CONTRUCCION
            var contructora_dolar_m2_1 = Number(registro_proyecto.contructora_dolar_m2_1);
            var contructora_dolar_m2_2 = Number(registro_proyecto.contructora_dolar_m2_2);
            var contructora_dolar_m2_3 = Number(registro_proyecto.contructora_dolar_m2_3);
            var volterra_dolar_m2 = Number(registro_proyecto.volterra_dolar_m2);

            var prom_constructoras =
                (contructora_dolar_m2_1 + contructora_dolar_m2_2 + contructora_dolar_m2_3) / 3;
            var prom_constructoras_r = numero_punto_coma(prom_constructoras.toFixed(0));
            var solid_constru_r = numero_punto_coma(volterra_dolar_m2.toFixed(0));

            var area_construida = Number(registro_proyecto.area_construida); // m2 de todos los inmuebles y areas del proyecto en TOTAL

            var costo_constructora_1 = area_construida * contructora_dolar_m2_1;
            var costo_constructora_2 = area_construida * contructora_dolar_m2_2;
            var costo_constructora_3 = area_construida * contructora_dolar_m2_3;
            var costo_volterra = area_construida * volterra_dolar_m2;

            var sobreprecio_1 = costo_constructora_1 - costo_volterra;
            var sobreprecio_2 = costo_constructora_2 - costo_volterra;
            var sobreprecio_3 = costo_constructora_3 - costo_volterra;

            var constructoras = [
                {
                    nombre: "SOLIDEXA",
                    contructora_dolar_m2: Number(volterra_dolar_m2.toFixed(2)),
                    costo_constructora: Number(costo_volterra.toFixed(0)),
                    sobreprecio: 0,
                },
                {
                    nombre: "Constructora A",
                    contructora_dolar_m2: Number(contructora_dolar_m2_1.toFixed(2)),
                    costo_constructora: Number(costo_constructora_1.toFixed(0)),
                    sobreprecio: Number(sobreprecio_1.toFixed(0)),
                },
                {
                    nombre: "Constructora B",
                    contructora_dolar_m2: Number(contructora_dolar_m2_2.toFixed(2)),
                    costo_constructora: Number(costo_constructora_2.toFixed(0)),
                    sobreprecio: Number(sobreprecio_2.toFixed(0)),
                },
                {
                    nombre: "Constructora C",
                    contructora_dolar_m2: Number(contructora_dolar_m2_3.toFixed(2)),
                    costo_constructora: Number(costo_constructora_3.toFixed(0)),
                    sobreprecio: Number(sobreprecio_3.toFixed(0)),
                },
            ];

            var constructoras_render = [
                {
                    nombre: "SOLIDEXA",
                    contructora_dolar_m2: Number(volterra_dolar_m2.toFixed(2)),
                    contructora_dolar_m2_r: numero_punto_coma(volterra_dolar_m2.toFixed(2)),
                    costo_constructora: Number(costo_volterra.toFixed(0)),
                    costo_constructora_r: numero_punto_coma(costo_volterra.toFixed(0)),
                    sobreprecio: 0,
                    sobreprecio_r: "-",
                },
                {
                    nombre: "Constructora A",
                    contructora_dolar_m2: Number(contructora_dolar_m2_1.toFixed(2)),
                    contructora_dolar_m2_r: numero_punto_coma(contructora_dolar_m2_1.toFixed(2)),
                    costo_constructora: Number(costo_constructora_1.toFixed(0)),
                    costo_constructora_r: numero_punto_coma(costo_constructora_1.toFixed(0)),
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
            // PLUSVALIAS DE REGALO
            var plusvalias_total = plusvalia;
            //-------------------------------------------------------------------------------

            var info_proyecto_beneficios = {
                prom_constructoras_r,
                prom_constructoras: Math.round(prom_constructoras),
                solid_constru_r,
                solid_constru: Math.round(volterra_dolar_m2),
                //-----------------------------------
                precio_justo,
                precio_justo_render,
                constructoras,
                constructoras_render,
                area_construida,
                area_construida_render: numero_punto_coma(area_construida.toFixed(2)),
                volterra_dolar_m2,
                volterra_dolar_m2_render: numero_punto_coma(volterra_dolar_m2.toFixed(2)),

                plusvalias_total,
                plusvalias_total_render: plusvalia_render,

                nombre_proyecto: registro_proyecto.nombre_proyecto,

                titulo_construccion_py: registro_proyecto.titulo_construccion_py,
                texto_construccion_py: registro_proyecto.texto_construccion_py,
                nota_construccion_py: registro_proyecto.nota_construccion_py,

                titulo_plusvalia_py: registro_proyecto.titulo_plusvalia_py,
                texto_plusvalia_py: registro_proyecto.texto_plusvalia_py,
                nota_plusvalia_py: registro_proyecto.nota_plusvalia_py,
            };

            // ------- Para verificación -------
            //console.log("la respuesta de beneficios");
            //console.log(info_proyecto_beneficios);

            return info_proyecto_beneficios;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function proyecto_info_economico(codigo_proyecto) {
    try {
        var registro_proyecto = await indiceProyecto.findOne(
            {
                codigo_proyecto: codigo_proyecto,
            },
            {
                presupuesto_proyecto: 1,
                nombre_proyecto: 1,
                area_construida: 1,
                titulo_economico_py: 1,
                texto_economico_py: 1,
                nota_economico_py: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            let n_filas = registro_proyecto.presupuesto_proyecto.length;
            var sum_valores = 0;
            for (let t = 0; t < n_filas; t++) {
                if (registro_proyecto.presupuesto_proyecto[t] != "") {
                    sum_valores =
                        sum_valores + Number(registro_proyecto.presupuesto_proyecto[t][2]);
                }
            }
            var total_presupuesto = sum_valores;

            var area_construida = registro_proyecto.area_construida;

            var valores_tabla = []; // asumimos
            var t_posi = -1;
            //var sum_sus_m2 = 0;
            //var sum_porcentaje = 0;
            for (let t = 0; t < n_filas; t++) {
                if (registro_proyecto.presupuesto_proyecto[t][1] != "") {
                    t_posi = t_posi + 1;
                    valores_tabla[t_posi] = {
                        presupuesto_items: registro_proyecto.presupuesto_proyecto[t][1],
                        presupuesto_valores: Number(
                            registro_proyecto.presupuesto_proyecto[t][2]
                        ),
                        presupuesto_valores_r: numero_punto_coma(
                            registro_proyecto.presupuesto_proyecto[t][2]
                        ),
                        sus_m2: Number(
                            (
                                Number(registro_proyecto.presupuesto_proyecto[t][2]) /
                                Number(area_construida)
                            ).toFixed(2)
                        ), // redondeado a 2 decimales
                        sus_m2_r: numero_punto_coma(
                            (
                                Number(registro_proyecto.presupuesto_proyecto[t][2]) /
                                Number(area_construida)
                            ).toFixed(2)
                        ), // redondeado a 2 decimales
                        porcentaje_item: numero_punto_coma(
                            Number(
                                (
                                    (Number(registro_proyecto.presupuesto_proyecto[t][2]) /
                                        total_presupuesto) *
                                    100
                                ).toFixed(2)
                            )
                        ),
                        porcentaje_item_prog: Number(
                            (
                                (Number(registro_proyecto.presupuesto_proyecto[t][2]) /
                                    total_presupuesto) *
                                100
                            ).toFixed(2)
                        ),
                    };
                }
            }

            var registro_documentos = await indiceDocumentos.find({
                codigo_proyecto: codigo_proyecto,
                clase_documento: "Económico",
                codigo_inmueble: "",
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

            var info_proyecto_info_economico = {
                nombre_proyecto: registro_proyecto.nombre_proyecto,
                sus_m2_total: Number((total_presupuesto / area_construida).toFixed(2)),
                sus_m2_total_r: numero_punto_coma((total_presupuesto / area_construida).toFixed(2)),
                total_presupuesto: Number(total_presupuesto.toFixed(0)),
                total_presupuesto_r: numero_punto_coma(total_presupuesto.toFixed(0)),
                area_construida: numero_punto_coma(registro_proyecto.area_construida),
                valores_tabla,
                documentacion,

                titulo_economico_py: registro_proyecto.titulo_economico_py,
                texto_economico_py: registro_proyecto.texto_economico_py,
                nota_economico_py: registro_proyecto.nota_economico_py,
            };

            return info_proyecto_info_economico;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function proyecto_empleos(codigo_proyecto) {
    try {
        var registro_proyecto = await indiceProyecto.findOne(
            {
                codigo_proyecto: codigo_proyecto,
            },
            {
                codigo_terreno: 1,
                nombre_proyecto: 1,
                descripcion_empleo: 1,

                tabla_empleos_sociedad: 1,
                _id: 0,
            }
        );

        var registro_terreno = await indiceTerreno.findOne(
            {
                codigo_terreno: registro_proyecto.codigo_terreno,
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

        //console.log("estamos a punto de entrar");
        if (registro_proyecto && registro_terreno) {
            //console.log("estamos dentro");
            let n_filas = registro_proyecto.tabla_empleos_sociedad.length;
            var sum_valores = 0;
            var sum_beneficiarios = 0;
            for (let t = 0; t < n_filas; t++) {
                if (registro_proyecto.tabla_empleos_sociedad[t] != "") {
                    sum_valores =
                        sum_valores + Number(registro_proyecto.tabla_empleos_sociedad[t][4]);

                    sum_beneficiarios =
                        sum_beneficiarios + Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                }
            }
            var total_beneficio = sum_valores; // $US O BS
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
                            registro_proyecto.tabla_empleos_sociedad[t][4].toFixed(0)
                        ),
                        empleo_beneficio_n: Number(
                            registro_proyecto.tabla_empleos_sociedad[t][4].toFixed(0)
                        ),

                        empleo_porcentaje: numero_punto_coma(
                            Number(
                                (
                                    (Number(registro_proyecto.tabla_empleos_sociedad[t][4]) /
                                        total_beneficio) *
                                    100
                                ).toFixed(1)
                            )
                        ),
                        empleo_porcentaje_prog: Number(
                            (
                                (Number(registro_proyecto.tabla_empleos_sociedad[t][4]) /
                                    total_beneficio) *
                                100
                            ).toFixed(1)
                        ),
                        tipo_color,
                    };

                    if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Directo") {
                        n_directos =
                            n_directos + Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                        sus_directos =
                            sus_directos + Number(registro_proyecto.tabla_empleos_sociedad[t][4]);
                    }
                    if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Indirecto") {
                        n_indirectos =
                            n_indirectos + Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                        sus_indirectos =
                            sus_indirectos + Number(registro_proyecto.tabla_empleos_sociedad[t][4]);
                    }
                }
            }

            //----------------------------------------------------------
            // para los significados de los empleos

            var datos_funcion = {
                //------------------------------
                // datos del proyecto
                codigo_proyecto,

                //------------------------------
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
            var resultado = await super_info_py(datos_funcion);

            var inmuebles_total = resultado.inmuebles_total;
            var plusvalia_render = resultado.plusvalia_render;
            var plusvalia = resultado.plusvalia;

            //------------------------

            let py_nfp = numero_punto_coma(inmuebles_total);
            let py_dfp = plusvalia_render; // es la plusvalia total de proyecto
            let py_dfp_n = plusvalia;
            let py_inm_nfe = n_directos;
            let py_dfe = numero_punto_coma(sus_directos.toFixed(0));
            let py_dfe_n = Number(sus_directos.toFixed(0));
            let py_inm_nfb = n_indirectos;
            let py_dfb = numero_punto_coma(sus_indirectos.toFixed(0));
            let py_dfb_n = Number(sus_indirectos.toFixed(0));

            // ---------------------------------------------------------------------
            var info_proyecto_info_economico = {
                total_beneficio: numero_punto_coma(total_beneficio.toFixed(0)),
                total_beneficio_n: Number(total_beneficio.toFixed(0)),
                total_beneficiarios,
                nombre_proyecto: registro_proyecto.nombre_proyecto,

                area_construida: registro_proyecto.area_construida,
                valores_tabla,

                descripcion_empleo: registro_proyecto.descripcion_empleo,

                py_nfp,
                py_dfp,
                py_dfp_n,
                py_inm_nfe,
                py_dfe,
                py_dfe_n,
                py_inm_nfb,
                py_dfb,
                py_dfb_n,
            };

            return info_proyecto_info_economico;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function proyecto_requerimientos(codigo_proyecto) {
    try {
        var info_requerimientos = {}; // estara vacio por defecto, para luego ser llenado

        // asumimos que no existen por defecto
        // luego seran corregidos si fuera el caso
        info_requerimientos.existe_manual = false;
        info_requerimientos.existe_modelo = false;
        info_requerimientos.existe_video = false;

        var registro_proyecto = await indiceProyecto.findOne(
            {
                codigo_proyecto: codigo_proyecto,
            },
            {
                nota_no_requerimientos: 1,
                nota_si_requerimientos: 1,
                existe_requerimientos: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            if (registro_proyecto.existe_requerimientos) {
                // si es TRUE

                //--------------------------------------------
                // el manual y modelo de requerimientos, como solo puede existir uno sola imagen que sea para requerimientos, es por eso que se utliza "findOne"

                var aux_requerimiento = await indiceImagenesEmpresa_sf.findOne(
                    {
                        es_requerimiento: true,
                    },
                    {
                        codigo_imagen: 1,
                        url_video: 1,
                        video_funciona: 1, // true o false
                        _id: 0,
                    }
                );

                if (aux_requerimiento) {
                    info_requerimientos.existe_video = aux_requerimiento.video_funciona; // true o false
                    info_requerimientos.url_video = aux_requerimiento.url_video;

                    // entonces se procedera a la busqueda del manual y del modelo de requerimiento
                    // pueden existir documentos: manual || beneficio || modelo, es por ello que se tomaran en cuenta todos usando "find"
                    var documentos_requerimientos = await indiceDocumentos.find(
                        {
                            codigo_terreno: aux_requerimiento.codigo_imagen,
                        },
                        {
                            clase_documento: 1, // manual || beneficio || modelo
                            nombre_documento: 1, // pdf || word || excel
                            codigo_documento: 1,
                            _id: 0,
                        }
                    );

                    if (documentos_requerimientos.length > 0) {
                        for (let k = 0; k < documentos_requerimientos.length; k++) {
                            // no existe problema en recorrer todo el for, porque de echo solo pueden existir un solo documento de "manual" y uno solo de "modelo" para REQUERIMIENTO

                            if (documentos_requerimientos[k].clase_documento == "manual") {
                                info_requerimientos.existe_manual = true;

                                // // pdf || word || excel (para icono bootstrap)
                                info_requerimientos.bootstrap_manual =
                                    documentos_requerimientos[k].nombre_documento;

                                if (documentos_requerimientos[k].nombre_documento == "pdf") {
                                    var extension_manual = "pdf";
                                }
                                if (documentos_requerimientos[k].nombre_documento == "word") {
                                    var extension_manual = "docx";
                                }
                                if (documentos_requerimientos[k].nombre_documento == "excel") {
                                    var extension_manual = "xlsx";
                                }

                                // ej: codigodocumento.docx
                                info_requerimientos.documento_manual =
                                    documentos_requerimientos[k].codigo_documento +
                                    "." +
                                    extension_manual;
                            }

                            if (documentos_requerimientos[k].clase_documento == "modelo") {
                                info_requerimientos.existe_modelo = true;

                                // // pdf || word || excel (para icono bootstrap)
                                info_requerimientos.bootstrap_modelo =
                                    documentos_requerimientos[k].nombre_documento;

                                if (documentos_requerimientos[k].nombre_documento == "pdf") {
                                    var extension_modelo = "pdf";
                                }
                                if (documentos_requerimientos[k].nombre_documento == "word") {
                                    var extension_modelo = "docx";
                                }
                                if (documentos_requerimientos[k].nombre_documento == "excel") {
                                    var extension_modelo = "xlsx";
                                }

                                // ej: codigodocumento.docx
                                info_requerimientos.documento_modelo =
                                    documentos_requerimientos[k].codigo_documento +
                                    "." +
                                    extension_modelo;
                            }
                        }
                    }
                }

                //--------------- Verificacion ----------------
                //console.log("LOS PUTOS DOC DE REQUERIMIENTOS");
                //console.log(info_requerimientos);
                //---------------------------------------------

                //--------------------------------------------
                // para el armado de la tabla de requerimientos

                info_requerimientos.nota_si_requerimientos =
                    registro_proyecto.nota_si_requerimientos;
                info_requerimientos.existe_requerimientos = registro_proyecto.existe_requerimientos;

                var registro_requerimientos = await indiceRequerimientos
                    .find(
                        {
                            codigo_proyecto: codigo_proyecto,
                        },
                        {
                            codigo_requerimiento: 1,
                            requerimiento: 1,
                            descripcion: 1,
                            cantidad: 1,
                            presupuesto_maximo: 1,
                            fecha: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha: -1 }); // ordenado del mas reciente al menos reciente;

                if (registro_requerimientos.length > 0) {
                    // conversion del documento MONGO ([ARRAY]) a "string"
                    var aux_string_requeri = JSON.stringify(registro_requerimientos);
                    // reconversion del "string" a "objeto"
                    // [{}]
                    var aux_objeto_requeri = JSON.parse(aux_string_requeri);

                    //---------------------------------------------------------
                    // conversion de formato de fecha a ej/ domingo 28 Junio de 2023
                    moment.locale("es");

                    for (let j = 0; j < aux_objeto_requeri.length; j++) {
                        //let aux_fecha = moment(aux_objeto_requeri[j].fecha).format("LLL"); // muestra fecha y hora español
                        let aux_fecha = moment(aux_objeto_requeri[j].fecha).format("LL"); // muestra solo fecha español
                        aux_objeto_requeri[j].fecha = aux_fecha;
                    }
                    //---------------------------------------------------------

                    info_requerimientos.tabla_requerimientos = aux_objeto_requeri;

                    return info_requerimientos;
                } else {
                    info_requerimientos.tabla_requerimientos = []; // un array vacio

                    return info_requerimientos;
                }
            } else {
                info_requerimientos.nota_no_requerimientos =
                    registro_proyecto.nota_no_requerimientos;
                info_requerimientos.existe_requerimientos = registro_proyecto.existe_requerimientos;

                return info_requerimientos;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function proyecto_resp_social(codigo_proyecto) {
    // si se entra en esta funcion quiere decir que existe "responsabilidad social" y que se accedio desde esa pestaña.
    try {
        var registro_proyecto = await indiceProyecto.findOne(
            {
                codigo_proyecto: codigo_proyecto,
            },
            {
                beneficiario_rs: 1,
                descripcion_rs: 1,
                monto_dinero_rs: 1,
                link_youtube_rs: 1,
                fecha_entrega_rs: 1,
                tabla_rs_proyecto: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            var registro_imagenes_py = await indiceImagenesProyecto.find(
                {
                    codigo_proyecto: codigo_proyecto,
                    imagen_respon_social: true,
                },
                {
                    nombre_imagen: 1,
                    codigo_imagen: 1,
                    extension_imagen: 1,
                    url: 1,
                    _id: 0,
                }
            );

            var imagenes_rs = []; // asumimos por defecto
            if (registro_imagenes_py.length > 0) {
                for (let i = 0; i < registro_imagenes_py.length; i++) {
                    imagenes_rs[i] = {
                        nombre_imagen: registro_imagenes_py[i].nombre_imagen,
                        codigo_imagen: registro_imagenes_py[i].codigo_imagen,
                        extension_imagen: registro_imagenes_py[i].extension_imagen,
                        /*
                        imagen_rs:
                            registro_imagenes_py[i].codigo_imagen +
                            registro_imagenes_py[i].extension_imagen,
                            */
                        imagen_rs: registro_imagenes_py[i].url,
                    };
                }
            }

            var detalles_tabla = [];
            if (registro_proyecto.tabla_rs_proyecto.length > 0) {
                for (let j = 0; j < registro_proyecto.tabla_rs_proyecto.length; j++) {
                    detalles_tabla[j] = {
                        rs_numero: registro_proyecto.tabla_rs_proyecto[j][0],
                        rs_item: registro_proyecto.tabla_rs_proyecto[j][1],
                        rs_unidad: registro_proyecto.tabla_rs_proyecto[j][2],
                        rs_pu: Number(registro_proyecto.tabla_rs_proyecto[j][3]),
                        rs_pu_r: numero_punto_coma(registro_proyecto.tabla_rs_proyecto[j][3]),
                        rs_cantidad: numero_punto_coma(registro_proyecto.tabla_rs_proyecto[j][4]),
                        rs_total: Number(registro_proyecto.tabla_rs_proyecto[j][5]),
                        rs_total_r: numero_punto_coma(registro_proyecto.tabla_rs_proyecto[j][5]),
                    };
                }
            }

            moment.locale("es");

            var info_proyecto_resp_social = {
                beneficiario_rs: registro_proyecto.beneficiario_rs,
                descripcion_rs: registro_proyecto.descripcion_rs,
                monto_dinero_rs: registro_proyecto.monto_dinero_rs,
                monto_dinero_rs_r: numero_punto_coma(registro_proyecto.monto_dinero_rs),
                link_youtube_rs: registro_proyecto.link_youtube_rs,
                fecha_entrega_rs: moment.utc(registro_proyecto.fecha_entrega_rs).format("LL"), // llevando la fecha a formato latino

                detalles_tabla,

                imagenes_rs,
            };

            return info_proyecto_resp_social;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------------------------------------

async function valores_badge(paquete_badge) {
    try {
        var codigo_proyecto = paquete_badge.codigo_proyecto;

        var badge_resultados = {
            existe_n_inmuebles: false, // por defecto
            n_inmuebles: 0, // por defecto
            existe_n_requerimientos: false, // por defecto
            n_requerimientos: 0, // por defecto
        };

        var registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                codigo_terreno: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            var registro_terreno = await indiceTerreno.findOne(
                { codigo_terreno: registro_proyecto.codigo_terreno },
                {
                    estado_terreno: 1,
                    _id: 0,
                }
            );

            if (registro_terreno) {
                // guardado, disponible, reservado, pendiente, pagado, pagos (construccion), remate, completado (construido)

                // guardado, convocatoria, anteproyecto, reservacion, construccion, construido OK

                if (registro_terreno.estado_terreno == "reservacion") {
                    // estado_inmueble: "disponible" considera tanto inmuebles del tipo ENTEROS como COPROPIETARIOS
                    var registro_inmuebles = await indiceInmueble.find(
                        { codigo_proyecto: codigo_proyecto, estado_inmueble: "disponible" },
                        {
                            codigo_inmueble: 1,
                        }
                    );

                    if (registro_inmuebles.length > 0) {
                        badge_resultados.existe_n_inmuebles = true;
                        badge_resultados.n_inmuebles = registro_inmuebles.length;
                    }
                }

                if (registro_terreno.estado_terreno == "construccion") {
                    // estado_inmueble: "remate" para inmuebles del tipo ENTEROS
                    var registro_inmuebles = await indiceInmueble.find(
                        { codigo_proyecto: codigo_proyecto, estado_inmueble: "remate" },
                        {
                            codigo_inmueble: 1,
                        }
                    );

                    // estado_inmueble: "disponible" para inmuebles del tipo COPROPIETARIOS
                    var registro_inmuebles_co = await indiceInmueble.find(
                        { codigo_proyecto: codigo_proyecto, estado_inmueble: "disponible" },
                        {
                            codigo_inmueble: 1,
                        }
                    );

                    if (registro_inmuebles.length > 0 || registro_inmuebles_co.length > 0) {
                        badge_resultados.existe_n_inmuebles = true;
                        badge_resultados.n_inmuebles =
                            registro_inmuebles.length + registro_inmuebles_co.length;
                    }
                }
            }
        }

        // si el valor de los inmuebles no cambia despues de pasar por el codigo anterior de estados, entonces mantendran sus valores iniciales por defecto

        const registro_requerimientos = await indiceRequerimientos.find(
            { codigo_proyecto: codigo_proyecto, visible: true },
            {
                codigo_inmueble: 1,
            }
        );

        if (registro_requerimientos.length > 0) {
            badge_resultados.existe_n_requerimientos = true;
            badge_resultados.n_requerimientos = registro_requerimientos.length;
        }

        return badge_resultados;
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------------------------------------
// para informacion global de proyecto que se mostrara en todas las ventanas

async function complementos_globales_py(codigo_proyecto) {
    var basico_py = await indiceProyecto.findOne(
        { codigo_proyecto: codigo_proyecto },
        {
            nombre_proyecto: 1,
            //link_video_recorrido: 1,
            //link_facebook_proyecto: 1,
            //link_tiktok_proyecto: 1,
            estado_proyecto: 1,
            existe_rs: 1,
            _id: 0,
        }
    );

    if (basico_py) {
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

        var imagenes_py_principal = []; // asumimos por defecto
        var imagenes_py_exclusiva = []; // asumimos por defecto
        if (registro_imagenes_py.length > 0) {
            var i_principal = -1;
            var i_exclusiva = -1;
            for (let i = 0; i < registro_imagenes_py.length; i++) {
                // revision si la "imagen for" es una imagen principal del PROYECTO

                let arrayPrincipalesFor = registro_imagenes_py[i].parte_principal;

                // buscamos en este "arrayPrincipalesFor" si existe el codigo del PROYECTO (buscando la posicion que este ocupa en el presente ARRAY)
                let pocisionExiste = arrayPrincipalesFor.indexOf(codigo_proyecto);
                if (pocisionExiste != -1) {
                    // si el codigo del PROYECTO figura en este ARRAY, significa que la presente imagen for, es la imagen principal del PROYECTO

                    // incrementamos en +1 la pocision para construir el ARRAY
                    i_principal = i_principal + 1; // AUNQUE SOLO PUEDE EXISTIR 1 IMAGEN COMO PRINCIPAL
                    // llenamos el objeto con los valores de la imagen que corresponda "i"
                    imagenes_py_principal[i_principal] = {
                        nombre_imagen: registro_imagenes_py[i].nombre_imagen,
                        codigo_imagen: registro_imagenes_py[i].codigo_imagen, // sin extension
                        proyecto_imagen:
                            registro_imagenes_py[i].codigo_imagen +
                            registro_imagenes_py[i].extension_imagen,
                        url: registro_imagenes_py[i].url,
                    };
                } else {
                    // si la imagen no es "principal" para el proyecto,
                    // entonces revisamos si es una "exclusiva" del proyecto
                    let arrayExclusivasFor = registro_imagenes_py[i].parte_exclusiva;

                    // buscamos en este "arrayExclusivasFor" si existe el codigo del proyecto (buscando la posicion que este ocupa en el presente ARRAY)
                    let pocisionExiste = arrayExclusivasFor.indexOf(codigo_proyecto);

                    if (pocisionExiste != -1) {
                        // si el codigo del PROYECTO figura en este ARRAY, significa que la presente imagen for, es una imagen exclusiva del PROYECTO

                        // incrementamos en +1 la pocision para construir el ARRAY
                        i_exclusiva = i_exclusiva + 1;
                        // llenamos el objeto con los valores de la imagen que corresponda "i"
                        imagenes_py_exclusiva[i_exclusiva] = {
                            nombre_imagen: registro_imagenes_py[i].nombre_imagen,
                            codigo_imagen: registro_imagenes_py[i].codigo_imagen, // sin extension
                            proyecto_imagen:
                                registro_imagenes_py[i].codigo_imagen +
                                registro_imagenes_py[i].extension_imagen,
                            url: registro_imagenes_py[i].url,
                        };
                    }
                }
            }
        }

        var existe_res_soc = basico_py.existe_rs; // sera "true" o "false"

        return {
            codigo_proyecto,
            nombre_proyecto: basico_py.nombre_proyecto,
            estado_proyecto: basico_py.estado_proyecto,

            existe_res_soc,

            //facebook_py: basico_py.link_facebook_proyecto,
            //tiktok_py: basico_py.link_tiktok_proyecto,
            //youtube_py: basico_py.link_video_recorrido,

            imagenes_py_principal,
            imagenes_py_exclusiva,
        };
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorCliProyecto;
