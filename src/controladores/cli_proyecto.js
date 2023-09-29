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

const { cabezeras_adm_cli, pie_pagina_cli, segundero_cajas } = require("../ayudas/funcionesayuda_2");

const { numero_punto_coma, verificarTePyInm } = require("../ayudas/funcionesayuda_3");

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
        var verificacion = await verificarTePyInm(paqueteria_datos);

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
                lado: "cliente",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_proyecto_cli.cabezera_cli = cabezera_cli;

            var pie_pagina = await pie_pagina_cli();
            info_proyecto_cli.pie_pagina_cli = pie_pagina;

            info_proyecto_cli.global_py = await complementos_globales_py(codigo_proyecto);

            info_proyecto_cli.es_proyecto = true; // para menu navegacion comprimido

            //----------------------------------------------------
            // paquete para actualizar el numero de vistas segun el tipo de la ventana
            var paquete_vista = {
                codigo_proyecto,
                ventana: tipo_vista_proyecto,
            };
            info_proyecto_cli.nv_ventana = await n_vista_ventana(paquete_vista);

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
                        if (registro_terreno.estado_terreno == "reserva") {
                            info_proyecto_cli.estado_py_reserva = true;
                        }
                        if (registro_terreno.estado_terreno == "aprobacion") {
                            info_proyecto_cli.estado_py_aprobacion = true;
                        }
                        if (registro_terreno.estado_terreno == "pago") {
                            info_proyecto_cli.estado_py_pago = true;
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
                let aux_n_pendiente_aprobacion = 0;
                let aux_n_pendiente_pago = 0;
                let aux_n_pagado_pago = 0;
                let aux_n_en_pago = 0;
                let aux_n_remate = 0;
                let aux_n_completado = 0;
                // guardado, disponible, reservado, pendiente, pagado, pagos, remate, completado
                if (contenido_proyecto.length > 0) {
                    for (let i = 0; i < contenido_proyecto.length; i++) {
                        let aux_estado_inmueble = contenido_proyecto[i].estado_inmueble;
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

                if (aux_n_pendiente_aprobacion > 0) {
                    info_proyecto_cli.badge_pendiente_aprobacion = true;
                } else {
                    info_proyecto_cli.badge_pendiente_aprobacion = false;
                }

                if (aux_n_pendiente_pago > 0) {
                    info_proyecto_cli.badge_pendiente_pago = true;
                } else {
                    info_proyecto_cli.badge_pendiente_pago = false;
                }

                if (aux_n_pagado_pago > 0) {
                    info_proyecto_cli.badge_pagado_pago = true;
                } else {
                    info_proyecto_cli.badge_pagado_pago = false;
                }

                if (aux_n_en_pago > 0) {
                    info_proyecto_cli.badge_en_pago = true;
                } else {
                    info_proyecto_cli.badge_en_pago = false;
                }

                if (aux_n_remate > 0) {
                    info_proyecto_cli.badge_remate = true;
                } else {
                    info_proyecto_cli.badge_remate = false;
                }

                if (aux_n_completado > 0) {
                    info_proyecto_cli.badge_completado = true;
                } else {
                    info_proyecto_cli.badge_completado = false;
                }

                //-----------------------------------------------

                info_proyecto_cli.n_todos = aux_n_todos;
                info_proyecto_cli.n_disponible = aux_n_disponible;
                info_proyecto_cli.n_reservado = aux_n_reservado;
                info_proyecto_cli.n_pendiente_aprobacion = aux_n_pendiente_aprobacion;
                info_proyecto_cli.n_pendiente_pago = aux_n_pendiente_pago;
                info_proyecto_cli.n_pagado_pago = aux_n_pagado_pago;
                info_proyecto_cli.n_en_pago = aux_n_en_pago;
                info_proyecto_cli.n_remate = aux_n_remate;
                info_proyecto_cli.n_completado = aux_n_completado;

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
                //console.log("los datos a renderizar de responsabilidad social");
                //console.log(info_proyecto_cli);

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
                proyecto_ganador: 1,
                meses_construccion: 1,

                tipo_proyecto: 1,

                total_departamentos: 1,
                total_oficinas: 1,
                total_comerciales: 1,
                total_casas: 1,
                garajes: 1,
                area_construida: 1,
                proyecto_descripcion: 1,
                penalizacion: 1,

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
                    _id: 0,
                }
            );

            if (registro_terreno) {
                // conversion del documento MONGO ({OBJETO}) a "string"
                var aux_string = JSON.stringify(registro_proyecto);

                // reconversion del "string" a "objeto"
                var py_descripcion = JSON.parse(aux_string);

                // correccion superficie del py en punto mil
                py_descripcion.area_construida = numero_punto_coma(registro_proyecto.area_construida);

                // por defecto ponemos a todos en "false"
                py_descripcion.resplandor_1 = false;
                py_descripcion.resplandor_2 = false;
                py_descripcion.resplandor_3 = false;
                py_descripcion.resplandor_4 = false;
                py_descripcion.resplandor_5 = false;

                // corregimos que estado estara como "true"
                if (registro_terreno.estado_terreno == "reserva") {
                    py_descripcion.resplandor_1 = true;
                }
                if (registro_terreno.estado_terreno == "pago") {
                    py_descripcion.resplandor_2 = true;
                }
                if (registro_terreno.estado_terreno == "aprobacion") {
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
                var datos_segundero = {
                    codigo_objetivo: codigo_proyecto,
                    tipo_objetivo: "proyecto",
                };

                // OJO*** PORQUE "segundero_cajas" tambien utiliza "inmueble_card_adm_cli" y estan ambas en esta misma funcion
                var aux_segundero_cajas = await segundero_cajas(datos_segundero);
                var aux_cajas = {
                    // despues de sumar todos valores de plusvalia, precio y valor total
                    // convertimos a numeros con separadores de punto, coma
                    valor_total: numero_punto_coma(aux_segundero_cajas.total),
                    precio: numero_punto_coma(aux_segundero_cajas.precio),
                    plusvalia: numero_punto_coma(aux_segundero_cajas.ahorro),
                    plusvalia_construida: aux_segundero_cajas.plusvalia_construida, // util solo para propietario, aqui ya viene con su valor por defecto con CERO
                };

                py_descripcion.val_segundero_cajas = aux_segundero_cajas;
                py_descripcion.val_cajas = aux_cajas;
                py_descripcion.construccion = numero_punto_coma(
                    aux_segundero_cajas.construccion.toFixed(0)
                );

                //-------------------------------------------------------------------------------
                // PARA LA SIGNIFICADO DE SEGUNDERO

                var registro_empresa = await indiceEmpresa.findOne(
                    {},
                    {
                        texto_segundero_py: 1,
                        _id: 0,
                    }
                );

                if (registro_empresa.texto_segundero_py != undefined) {
                    if (
                        registro_empresa.texto_segundero_py.indexOf("/sus_precio/") != -1 &&
                        registro_empresa.texto_segundero_py.indexOf("/sus_total/") != -1 &&
                        registro_empresa.texto_segundero_py.indexOf("/sus_plusvalia/") != -1
                    ) {
                        var significado_aux_0 = registro_empresa.texto_segundero_py;
                        var significado_aux_1 = significado_aux_0.replace(
                            "/sus_precio/",
                            aux_cajas.precio
                        );
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

                py_descripcion.significado_segundero = significado_aux;
                py_descripcion.mensaje_segundero = mensaje_segundero;
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
                });

                // por defecto con respectos a los documentos del inmueble
                var documentos_descripcion = [];

                if (registro_documentos.length > 0) {
                    for (let d = 0; d < registro_documentos.length; d++) {
                        documentos_descripcion[d] = {
                            titulo_documento: registro_documentos[d].nombre_documento,
                            codigo_documento: registro_documentos[d].codigo_documento,
                        };
                    }
                }
                py_descripcion.documentos_descripcion = documentos_descripcion;

                //-------------------------------------------------------------------
                // numero totales de dormitorios, baños del proyecto
                // (numero total de garajes ya esta determinado en la base de datos de proyecto)

                var registro_inmuebles = await indiceInmueble.find(
                    {
                        codigo_proyecto: codigo_proyecto,
                    },
                    {
                        dormitorios_inmueble: 1,
                        banos_inmueble: 1,
                        // garaje_inmueble: 1,
                        _id: 0,
                    }
                );

                var nt_dormitorios = 0;
                var nt_banos = 0;

                if (registro_inmuebles.length > 0) {
                    for (let i = 0; i < registro_inmuebles.length; i++) {
                        nt_dormitorios = nt_dormitorios + registro_inmuebles[i].dormitorios_inmueble;
                        nt_banos = nt_banos + registro_inmuebles[i].banos_inmueble;
                    }
                }

                py_descripcion.nt_dormitorios = nt_dormitorios;
                py_descripcion.nt_banos = nt_banos;

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
            });

            // por defecto con respectos a los documentos  de garantia del proyecto
            var documentacion = [];

            if (registro_documentos.length > 0) {
                for (let d = 0; d < registro_documentos.length; d++) {
                    documentacion[d] = {
                        titulo_documento: registro_documentos[d].nombre_documento,
                        codigo_documento: registro_documentos[d].codigo_documento,
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

        if (registro_proyecto) {
            // sin importar el estado del proyecto, armaremos los datos como si se tratase para todos, ya en el html, con las condicionantes if, se renderizaran los datos que deban ser mostrados

            //-------------------------------------------------------------------------------

            var datos_segundero = {
                codigo_objetivo: codigo_proyecto,
                tipo_objetivo: "proyecto",
            };

            var capitalesProyecto = await segundero_cajas(datos_segundero);

            //-------------------------------------------------------------------------------
            // COSTO CONTRUCCION
            var contructora_dolar_m2_1 = Number(registro_proyecto.contructora_dolar_m2_1);
            var contructora_dolar_m2_2 = Number(registro_proyecto.contructora_dolar_m2_2);
            var contructora_dolar_m2_3 = Number(registro_proyecto.contructora_dolar_m2_3);
            var volterra_dolar_m2 = Number(registro_proyecto.volterra_dolar_m2);

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
                    nombre: "Constructora 1",
                    contructora_dolar_m2: Number(contructora_dolar_m2_1.toFixed(2)),
                    costo_constructora: Number(costo_constructora_1.toFixed(0)),
                    sobreprecio: Number(sobreprecio_1.toFixed(0)),
                },
                {
                    nombre: "Constructora 2",
                    contructora_dolar_m2: Number(contructora_dolar_m2_2.toFixed(2)),
                    costo_constructora: Number(costo_constructora_2.toFixed(0)),
                    sobreprecio: Number(sobreprecio_2.toFixed(0)),
                },
                {
                    nombre: "Constructora 3",
                    contructora_dolar_m2: Number(contructora_dolar_m2_3.toFixed(2)),
                    costo_constructora: Number(costo_constructora_3.toFixed(0)),
                    sobreprecio: Number(sobreprecio_3.toFixed(0)),
                },
            ];

            var constructoras_render = [
                {
                    nombre: "SOLIDEXA",
                    contructora_dolar_m2: numero_punto_coma(volterra_dolar_m2.toFixed(2)),
                    costo_constructora: numero_punto_coma(costo_volterra.toFixed(0)),
                    sobreprecio: 0,
                },
                {
                    nombre: "Constructora 1",
                    contructora_dolar_m2: numero_punto_coma(contructora_dolar_m2_1.toFixed(2)),
                    costo_constructora: numero_punto_coma(costo_constructora_1.toFixed(0)),
                    sobreprecio: numero_punto_coma(Math.abs(sobreprecio_1).toFixed(0)),
                },
                {
                    nombre: "Constructora 2",
                    contructora_dolar_m2: numero_punto_coma(contructora_dolar_m2_2.toFixed(2)),
                    costo_constructora: numero_punto_coma(costo_constructora_2.toFixed(0)),
                    sobreprecio: numero_punto_coma(Math.abs(sobreprecio_2).toFixed(0)),
                },
                {
                    nombre: "Constructora 3",
                    contructora_dolar_m2: numero_punto_coma(contructora_dolar_m2_3.toFixed(2)),
                    costo_constructora: numero_punto_coma(costo_constructora_3.toFixed(0)),
                    sobreprecio: numero_punto_coma(Math.abs(sobreprecio_3).toFixed(0)),
                },
            ];

            //-------------------------------------------------------------------------------
            // PLUSVALIAS DE REGALO
            var plusvalias_total = Number(capitalesProyecto.plusGeneranCompleta.toFixed(2));
            //var plusvalias_total = Number(capitalesProyecto.plusGeneranCompleta);
            //-------------------------------------------------------------------------------

            var info_proyecto_beneficios = {
                constructoras,
                constructoras_render,
                area_construida,
                area_construida_render: numero_punto_coma(area_construida.toFixed(2)),
                volterra_dolar_m2,
                volterra_dolar_m2_render: numero_punto_coma(volterra_dolar_m2.toFixed(2)),
                costo_volterra: Number(costo_volterra.toFixed(0)),
                costo_volterra_render: numero_punto_coma(costo_volterra.toFixed(0)),

                plusvalias_total,
                plusvalias_total_render: numero_punto_coma(plusvalias_total),

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
                    sum_valores = sum_valores + Number(registro_proyecto.presupuesto_proyecto[t][2]);
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
                        presupuesto_valores: numero_punto_coma(
                            registro_proyecto.presupuesto_proyecto[t][2]
                        ),
                        sus_m2: numero_punto_coma(
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
            });

            var documentacion = []; // por defecto con respectos a los documentos  economico del proyecto
            if (registro_documentos.length > 0) {
                for (let d = 0; d < registro_documentos.length; d++) {
                    documentacion[d] = {
                        titulo_documento: registro_documentos[d].nombre_documento,
                        codigo_documento: registro_documentos[d].codigo_documento,
                    };
                }
            }

            var info_proyecto_info_economico = {
                nombre_proyecto: registro_proyecto.nombre_proyecto,
                sus_m2_total: numero_punto_coma((total_presupuesto / area_construida).toFixed(2)),
                total_presupuesto: numero_punto_coma(total_presupuesto.toFixed(0)),
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
                nombre_proyecto: 1,
                descripcion_empleo: 1,

                tabla_empleos_sociedad: 1,
                _id: 0,
            }
        );

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                nombre_empresa: 1,
                significado_py_propietarios: 1,
                significado_py_empresa: 1,
                significado_py_pais: 1,
                _id: 0,
            }
        );

        //console.log("estamos a punto de entrar");
        if (registro_proyecto && registro_empresa) {
            //console.log("estamos dentro");
            let n_filas = registro_proyecto.tabla_empleos_sociedad.length;
            var sum_valores = 0;
            var sum_beneficiarios = 0;
            for (let t = 0; t < n_filas; t++) {
                if (registro_proyecto.tabla_empleos_sociedad[t] != "") {
                    sum_valores = sum_valores + Number(registro_proyecto.tabla_empleos_sociedad[t][4]);

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
                        n_directos = n_directos + Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
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

            //-------------
            var aux_n_inm = await indiceInmueble.find(
                {
                    codigo_proyecto: codigo_proyecto,
                },
                {
                    codigo_inmueble: 1,
                    _id: 0,
                }
            );

            //-------------
            var datos_segundero = {
                codigo_objetivo: codigo_proyecto,
                tipo_objetivo: "proyecto",
            };
            var aux_segundero_cajas = await segundero_cajas(datos_segundero);
            //-------------

            let significado_py_propietarios_0 = registro_empresa.significado_py_propietarios;
            let significado_py_empresa_0 = registro_empresa.significado_py_empresa;
            let significado_py_pais_0 = registro_empresa.significado_py_pais;

            let nom_empre = registro_empresa.nombre_empresa;
            let py_nfp = numero_punto_coma(aux_n_inm.length);
            let py_dfp = numero_punto_coma(aux_segundero_cajas.ahorro); // es la plusvalia total de proyecto
            let py_inm_nfe = n_directos;
            let py_dfe = numero_punto_coma(sus_directos.toFixed(0));
            let py_inm_nfb = n_indirectos;
            let py_dfb = numero_punto_coma(sus_indirectos.toFixed(0));

            //--------------- Verificacion ----------------
            console.log("/py_nfp/ " + py_nfp);
            console.log("/py_dfp/ " + py_dfp);
            console.log("/nom_empre/ " + nom_empre);
            console.log("/py_inm_nfe/ " + py_inm_nfe);
            console.log("/py_dfe/ " + py_dfe);
            console.log("/nom_empre/ " + nom_empre);
            console.log("/py_inm_nfb/ " + py_inm_nfb);
            console.log("/py_dfb/ " + py_dfb);
            //---------------------------------------------

            // "replace" reemplaza solo la primera coincidencia.

            var significado_py_propietarios_1 = significado_py_propietarios_0.replace(
                "/py_nfp/",
                py_nfp
            );
            var significado_py_propietarios = significado_py_propietarios_1.replace("/py_dfp/", py_dfp);

            var significado_py_empresa_1 = significado_py_empresa_0.replace("/nom_empre/", nom_empre);
            var significado_py_empresa_2 = significado_py_empresa_1.replace("/py_inm_nfe/", py_inm_nfe);
            var significado_py_empresa = significado_py_empresa_2.replace("/py_dfe/", py_dfe);

            var significado_py_pais_1 = significado_py_pais_0.replace("/nom_empre/", nom_empre);
            var significado_py_pais_2 = significado_py_pais_1.replace("/py_inm_nfb/", py_inm_nfb);
            var significado_py_pais = significado_py_pais_2.replace("/py_dfb/", py_dfb);

            // ---------------------------------------------------------------------
            var info_proyecto_info_economico = {
                total_beneficio: numero_punto_coma(total_beneficio.toFixed(0)),
                total_beneficiarios,
                nombre_proyecto: registro_proyecto.nombre_proyecto,

                area_construida: registro_proyecto.area_construida,
                valores_tabla,

                descripcion_empleo: registro_proyecto.descripcion_empleo,

                py_nfp,
                py_dfp,
                py_inm_nfe,
                py_dfe,
                py_inm_nfb,
                py_dfb,
                significado_py_propietarios,
                significado_py_empresa,
                significado_py_pais,
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
                console.log('LOS PUTOS DOC DE REQUERIMIENTOS');
                console.log(info_requerimientos);
                //---------------------------------------------

                //--------------------------------------------
                // para el armado de la tabla de requerimientos

                info_requerimientos.nota_si_requerimientos = registro_proyecto.nota_si_requerimientos;
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
                info_requerimientos.nota_no_requerimientos = registro_proyecto.nota_no_requerimientos;
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
                        imagen_rs:
                            registro_imagenes_py[i].codigo_imagen +
                            registro_imagenes_py[i].extension_imagen,
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
                        rs_pu: numero_punto_coma(registro_proyecto.tabla_rs_proyecto[j][3]),
                        rs_cantidad: numero_punto_coma(registro_proyecto.tabla_rs_proyecto[j][4]),
                        rs_total: numero_punto_coma(registro_proyecto.tabla_rs_proyecto[j][5]),
                    };
                }
            }

            moment.locale("es");

            var info_proyecto_resp_social = {
                beneficiario_rs: registro_proyecto.beneficiario_rs,
                descripcion_rs: registro_proyecto.descripcion_rs,
                monto_dinero_rs: numero_punto_coma(registro_proyecto.monto_dinero_rs),
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

async function n_vista_ventana(paquete_vista) {
    try {
        var codigo_proyecto = paquete_vista.codigo_proyecto;
        var ventana = paquete_vista.ventana;

        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                v_descripcion: 1,
                v_inmuebles: 1,
                v_garantias: 1,
                v_beneficios: 1,
                v_info_economico: 1,
                v_empleos: 1,
                v_resp_social: 1,
                v_requerimientos: 1,
                _id: 0,
            }
        );
        if (registro_proyecto) {
            if (ventana == "descripcion") {
                var n_vista = registro_proyecto.v_descripcion + 1;
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigo_proyecto },
                    { $set: { v_descripcion: n_vista } }
                );
            }
            if (ventana == "inmuebles") {
                var n_vista = registro_proyecto.v_inmuebles + 1;
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigo_proyecto },
                    { $set: { v_inmuebles: n_vista } }
                );
            }
            if (ventana == "garantias") {
                var n_vista = registro_proyecto.v_garantias + 1;
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigo_proyecto },
                    { $set: { v_garantias: n_vista } }
                );
            }
            if (ventana == "beneficios") {
                var n_vista = registro_proyecto.v_beneficios + 1;
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigo_proyecto },
                    { $set: { v_beneficios: n_vista } }
                );
            }
            if (ventana == "info_economico") {
                var n_vista = registro_proyecto.v_info_economico + 1;
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigo_proyecto },
                    { $set: { v_info_economico: n_vista } }
                );
            }
            if (ventana == "empleos") {
                var n_vista = registro_proyecto.v_empleos + 1;
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigo_proyecto },
                    { $set: { v_empleos: n_vista } }
                );
            }
            if (ventana == "requerimientos") {
                var n_vista = registro_proyecto.v_requerimientos + 1;
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigo_proyecto },
                    { $set: { v_requerimientos: n_vista } }
                );
            }
            if (ventana == "resp_social") {
                var n_vista = registro_proyecto.v_resp_social + 1;
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigo_proyecto },
                    { $set: { v_resp_social: n_vista } }
                );
            }
            return n_vista;
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
                // guardado, disponible, reservado, pendiente, pagado, pendiente_aprobacion, pagos (construccion), remate, completado (construido)

                if (registro_terreno.estado_terreno == "reserva") {
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

                if (registro_terreno.estado_terreno == "pago") {
                    var registro_inmuebles = await indiceInmueble.find(
                        { codigo_proyecto: codigo_proyecto, estado_inmueble: "pendiente_pago" },
                        {
                            codigo_inmueble: 1,
                        }
                    );

                    if (registro_inmuebles.length > 0) {
                        badge_resultados.existe_n_inmuebles = true;
                        badge_resultados.n_inmuebles = registro_inmuebles.length;
                    }
                }

                if (registro_terreno.estado_terreno == "aprobacion") {
                    var registro_inmuebles = await indiceInmueble.find(
                        { codigo_proyecto: codigo_proyecto, estado_inmueble: "pendiente_aprobacion" },
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
                    var registro_inmuebles = await indiceInmueble.find(
                        { codigo_proyecto: codigo_proyecto, estado_inmueble: "remate" },
                        {
                            codigo_inmueble: 1,
                        }
                    );

                    if (registro_inmuebles.length > 0) {
                        badge_resultados.existe_n_inmuebles = true;
                        badge_resultados.n_inmuebles = registro_inmuebles.length;
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

// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// para informacion PIE DE PAGINA DE VENTANAS DEL LADO DEL CLIENTE

/** 
async function pie_py() {
    // informacion para pie de página
    var registro_datos_empresa = await indiceEmpresa.findOne(
        {},
        {
            whatsapp: 1,
            telefono_fijo: 1,
            facebook: 1,
            tiktok: 1,
            youtube: 1,
            direccion: 1,
            year_derecho: 1,
        }
    );

    if (registro_datos_empresa) {
        return {
            whatsapp: registro_datos_empresa.whatsapp,
            telefono_fijo: registro_datos_empresa.telefono_fijo,
            facebook: registro_datos_empresa.facebook,
            tiktok: registro_datos_empresa.tiktok,
            youtube: registro_datos_empresa.youtube,
            direccion: registro_datos_empresa.direccion,
            year_derecho: registro_datos_empresa.year_derecho,
        };
    } else {
        return {};
    }
}
*/

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorCliProyecto;
