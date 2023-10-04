// CONTROLADOR INVERSOR DESDE PUBLICO

const pasaporte = require("passport"); // NO es para inicializarlo, porque eso ya esta echo, sino mas bien para "ejecutarlo segun las tareas que se le definio en pasaporte.js"

const {
    indiceDocumentos,
    indice_propietario,
    indiceInversiones,
    indiceGuardados,
    indiceEmpresa,
    indiceInmueble,
    indiceImagenesSistema
} = require("../modelos/indicemodelo");

const { inmueble_card_adm_cli } = require("../ayudas/funcionesayuda_1");

const {
    cabezeras_adm_cli,
    datos_pagos_propietario,
    segundero_cajas,
    pie_pagina_cli,
} = require("../ayudas/funcionesayuda_2");

const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");

const moment = require("moment");

const controladorCliInversor = {};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// PARA ACCESO AL SISTEMA DE SOLIDEXA LADO ADMINISTRADOR
// especificamos el tipo de identificacion usar, en este caso el encargado del lado del cliente "verificar_usu_clave_cli"

controladorCliInversor.verificarClavesCli = pasaporte.authenticate("verificar_usu_clave_cli", {
    failureRedirect: "/revision_acceso_cli/acceso_fallado",
    successRedirect: "/revision_acceso_cli/acceso_permitido",
});

controladorCliInversor.cli_incorrecto = async (req, res) => {
    // viene de la ruta: "/revision_acceso_cli/acceso_fallado"
    res.json({
        tipo: "incorrecto",
    });
};

controladorCliInversor.cli_correcto = async (req, res) => {
    // viene de la ruta: "/revision_acceso_cli/acceso_permitido"

    // ------- Para verificación -------
    /* 
    //console.log("estamos en el controlador de inicio PROPIETARIO CLIENTE");

    console.log("DATOS del CLIENTE ingreso");
    console.log(req.user);

    console.log("el CI del CLIENTE ingreso");
    console.log(req.user.ci_propietario);
    */

    var ci_propietario = req.user.ci_propietario;

    res.json({
        tipo: "correcto",
        ci_propietario,
    });
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA RENDERIZAR LA VENTANA DEL ADMINISTRADOR segun la pestaña que sea elegida

// RUTA   "get"  "/propietario/:ci_propietario/:ventana_propietario"
controladorCliInversor.renderizarVentanaPropietarioCli = async (req, res) => {
    try {
        /*
        // ------- Para verificación -------
        console.log("estamos en el controlador de inicio PROPIETARIO CLIENTE");

        // ------- Para verificación -------
        console.log("DATOS del CLIENTE ingreso");
        console.log(req.user);
        console.log("el id del CLIENTE ingreso");
        console.log(req.user.id);
        console.log("el CI del CLIENTE ingreso desde USER");
        console.log(req.user.ci_propietario);
        */

        var codigo_propietario = req.params.ci_propietario;
        var tipo_ventana_propietario = req.params.ventana_propietario;

        var info_propietario = {};
        info_propietario.navegador_cliente = true;
        info_propietario.cab_prop_cli = true;
        //info_propietario.estilo_cabezera = "cabezera_estilo_propietario";
        info_propietario.codigo_propietario = codigo_propietario;
        info_propietario.inversor_autenticado = req.inversor_autenticado;

        //----------------------------------------------------
        // para la url de la cabezera
        var url_cabezera = ""; // vacio por defecto
        const registro_cabezera = await indiceImagenesSistema.findOne(
            { tipo_imagen: "cabezera_propietario" },
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

        // "req.inversor_autenticado" si es TRUE y solo si es true, de manera que el propietario se encuentra navegando con su cuenta privada
        // "req.params.ci_propietario == req.user.ci_propietario" si y solo si el ci que figura en la url del navegador es igual a ci del req.user
        if (req.inversor_autenticado && req.params.ci_propietario == req.user.ci_propietario) {
            info_propietario.ci_propietario = req.user.ci_propietario; // el C.I. del propietario que se encuentra navegando con su cuenta privada

            var aux_cabezera = {
                codigo_objetivo: codigo_propietario,
                tipo: "propietario",
                lado: "propietario",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_propietario.cabezera_cli = cabezera_cli;

            var pie_pagina = await pie_pagina_cli();
            info_propietario.pie_pagina_cli = pie_pagina;

            info_propietario.es_propietario = true; // para menu navegacion comprimido

            //----------------------------------------------------
            // paquete para mostrar (si es que existiesen) el numero de propiedades y numero de guardados
            var paquete_badge = {
                codigo_propietario,
            };
            var badge = await valores_badge(paquete_badge);
            info_propietario.existe_n_propiedades = badge.existe_n_propiedades;
            info_propietario.n_propiedades = badge.n_propiedades;
            info_propietario.existe_n_guardados = badge.existe_n_guardados;
            info_propietario.n_guardados = badge.n_guardados;
            //----------------------------------------------------

            if (tipo_ventana_propietario == "resumen") {
                info_propietario.resumen_propietario = true; // para pestaña y ventana apropiada para proyecto

                info_propietario.info_segundero = true;

                var contenido_propietario = await resumen_propietario(codigo_propietario);

                info_propietario.informacion = contenido_propietario;
                // ------- Para verificación -------

                //console.log("los datos para renderizar RESUMEN DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }

            if (tipo_ventana_propietario == "informacion") {
                var contenido_propietario = await datos_propietario(codigo_propietario);
                info_propietario.informacion_propietario = true; // para pestaña y ventana apropiada para proyecto
                info_propietario.contenido_propietario = contenido_propietario;
                // ------- Para verificación -------

                //console.log("los datos para renderizar INFORMACION DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
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

                //---------------------------------------------------------------
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

                //console.log("los datos para renderizar PROPIEDADES DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }

            if (tipo_ventana_propietario == "guardados") {
                let contenido_propietario = await guardados_propietario(codigo_propietario);
                info_propietario.guardados_propietario = true; // para pestaña y ventana apropiada para proyecto

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
                info_propietario.n_completado = aux_n_completado;

                //--------------------------------------------------------------
                info_propietario.contenido_propietario = contenido_propietario;
                // ------- Para verificación -------

                //console.log("los datos para renderizar GUARDADOS DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }

            if (tipo_ventana_propietario == "documentos") {
                var contenido_propietario = await documentos_propietario(codigo_propietario);
                info_propietario.documentos_propietario = true; // para pestaña y ventana apropiada para proyecto
                info_propietario.contenido_propietario = contenido_propietario;
                // ------- Para verificación -------

                //console.log("los datos para renderizar PROPIETARIO DOCUMENTOS PRIVADOS");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }
        } else {
            // si el propietario no se encuentra navegando con su cuenta privada, y desea ingresar por la url a una cuenta privada, entonces se le redireccionara a la ventana de inicio

            /*
            var registro_terreno = await indiceEmpresa.findOne(
                {},
                {
                    texto_inicio_principal: 1,
                    n_construidos: 1,
                    n_proyectos: 1,
                    n_inmuebles: 1,
                    n_empleos: 1,
                    n_ahorros: 1,
                    n_resp_social: 1,
                    _id: 0,
                }
            );
    
            if (registro_terreno) {
                // conversion del documento MONGO ({OBJETO}) a "string"
                var aux_string = JSON.stringify(registro_terreno);
    
                // reconversion del "string" a "objeto"
                var datos_empresa = JSON.parse(aux_string);
    
                
                // ------- Para verificación -------
                //console.log("VEMOS SI EL CLIENTE ES VALIDADO");
                //console.log(req.inversor_autenticado); // puede dar:false o true
                //console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");
                
    
                datos_empresa.inversor_autenticado = req.inversor_autenticado;
                // si es TRUE y solo si es true, entonces se mostrara su ci
                if (req.inversor_autenticado) {
                    datos_empresa.ci_propietario = req.user.ci_propietario;
                }
    
                // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
                datos_empresa.es_ninguno = true;
    
                var pie_pagina = await pie_pagina_cli();
                datos_empresa.pie_pagina_cli = pie_pagina;
    
                datos_empresa.navegador_cliente = true;
    
                res.render("cli_inicio", datos_empresa); //increible que borrandolo FUNCIONE
            } else {
                var datos_empresa = {}; // lo enviamos como objeto vacio
    

                // ------- Para verificación -------
                console.log("VEMOS SI EL CLIENTE ES VALIDADO");
                console.log(req.inversor_autenticado); // puede dar:false o true
                console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");

    
                datos_empresa.inversor_autenticado = req.inversor_autenticado;
                // si es TRUE y solo si es true, entonces se mostrara su ci
                if (req.inversor_autenticado) {
                    datos_empresa.ci_propietario = req.user.ci_propietario;
                }
    
                // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
                datos_empresa.es_ninguno = true;
    
                var pie_pagina = await pie_pagina_cli();
                datos_empresa.pie_pagina_cli = pie_pagina;
    
                datos_empresa.navegador_cliente = true;
    
                res.render("cli_inicio", datos_empresa);

            }
            */

            res.redirect("/"); // rediccionara a la pagina DE INICIO DEL CLIENTE
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

        /*
        // si es esta navegando desde el lado del administrador
        if (req.user.ci_propietario) {
            var codigo_usuario = req.user.ci_propietario;
        } else {
            var codigo_usuario = "ninguno";
        }
        */

        if (inm_propietario.length > 0) {
            var contenido_inm_prop = [];
            for (let i = 0; i < inm_propietario.length; i++) {
                var paquete_inmueble_i = {
                    codigo_inmueble: inm_propietario[i].codigo_inmueble,
                    codigo_usuario: codigo_propietario,
                    laapirest: "/", // por partir desde el lado del CLIENTE
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

async function guardados_propietario(codigo_propietario) {
    try {
        // ordenamos por numero de piso (de menor a mayor, por ello se escribio "1")
        // Al parecer si el dato "piso" estubiera dentro de un objero EJ/ "descripcion_inmueble", tambien funcionaria como se lo declara aqui
        var inm_propietario = await indiceGuardados
            .find(
                { ci_propietario: codigo_propietario },
                {
                    codigo_inmueble: 1,
                    // estado_propietario: 1, esta propiedad no existe en "guardados"
                    _id: 0,
                }
            )
            .sort({ fecha_guardado: 1 });

        if (inm_propietario.length > 0) {
            var contenido_inm_prop = [];
            for (let i = 0; i < inm_propietario.length; i++) {
                // paquete_inmueble = {codigo_inmueble,codigo_usuario}
                var paquete_inmueble_i = {
                    codigo_inmueble: inm_propietario[i].codigo_inmueble,
                    codigo_usuario: codigo_propietario,
                    laapirest: "/", // por partir desde el lado del ADMINISTRADOR
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
        // PARA EL HISTORIAL DE INVERSIONES
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

        if (inm_propietario.length > 0) {
            // conversion del documento MONGO ([array]) a "string"
            var aux_string = JSON.stringify(inm_propietario);
            // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
            var historial_inversiones = JSON.parse(aux_string);

            // la fecha en la que uno hace el pago inicial para adquiriri el inmueble es: en reserva o en remate, por tanto solo las fechas de estos estados seran considerados.
            moment.locale("es");

            for (let i = 0; i < inm_propietario.length; i++) {
                historial_inversiones[i].numero_fila = i + 1; // agregamos al objeto
                historial_inversiones[i].laapirest = "/"; // por partir desde el lado del CLIENTE

                // un propietario solo puede ingresar a formar parte del inmueble con: RESERVA o PAGO
                if (historial_inversiones[i].tiene_reserva) {
                    //var fecha_estado = historial_inversiones[i].fecha_pagado_reserva;
                    var fecha_estado = inm_propietario[i].fecha_pagado_reserva;
                } else {
                    if (historial_inversiones[i].tiene_pago) {
                        //var fecha_estado = historial_inversiones[i].fecha_pagado_pago;
                        var fecha_estado = inm_propietario[i].fecha_pagado_pago;
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
                    laapirest: "/", // por partir desde el lado del CLIENTE
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

                //--------------- Verificacion ----------------
                //console.log("historial de inversiones");
                //console.log(historial_inversiones);
                //---------------------------------------------
            } // for
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

        var aux_segundero_cajas = await segundero_cajas(datos_segundero);

        var aux_cajas = {
            // despues de sumar todos valores de plusvalia, contruccion y valor total
            // convertimos a numeros con separadores de punto, coma
            valor_total: numero_punto_coma(aux_segundero_cajas.total),
            precio: numero_punto_coma(aux_segundero_cajas.precio),
            plusvalia: numero_punto_coma(aux_segundero_cajas.ahorro),
            plusvalia_construida: aux_segundero_cajas.plusvalia_construida, // en tipo "numerico puro"
        };

        //-------------------------------------------------------------------------------
        // PARA LA SIGNIFICADO DE SEGUNDERO

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                texto_segundero_prop: 1,
                texto_segundero_prop_iz: 1,
                _id: 0,
            }
        );

        if (registro_empresa.texto_segundero_prop != undefined) {
            if (
                registro_empresa.texto_segundero_prop.indexOf("/sus_precio/") != -1 &&
                registro_empresa.texto_segundero_prop.indexOf("/sus_total/") != -1 &&
                registro_empresa.texto_segundero_prop.indexOf("/sus_plusvalia/") != -1 &&
                inm_propietario.length > 0
            ) {
                var significado_aux_0 = registro_empresa.texto_segundero_prop;
                var significado_aux_1 = significado_aux_0.replace("/sus_precio/", aux_cajas.precio);
                var significado_aux_2 = significado_aux_1.replace("/sus_total/", aux_cajas.valor_total);
                var significado_aux = significado_aux_2.replace("/sus_plusvalia/", aux_cajas.plusvalia);
            } else {
                var significado_aux = "Significado";
            }
        } else {
            var significado_aux = "Significado";
        }

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

        //total_resumen_propietario.mensaje_segundero = mensaje_segundero_pro;
        //-------------------------------------------------------------------------------

        var total_resumen_propietario = {
            historial_inversiones,
            val_cajas: aux_cajas,
            val_segundero_cajas: aux_segundero_cajas,
            significado_segundero: significado_aux,
            mensaje_segundero: mensaje_segundero_pro,
        };
        //-------------------------------------------------------------------------------
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
                    url: registro_documentos_priv[p].url,
                };
            }
        }

        //en caso de que no existiesen documentos privados, entonces se guardara como un ARRAY vacio
        return documentos_privados;
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------------------------------------

async function valores_badge(paquete_badge) {
    try {
        var codigo_propietario = paquete_badge.codigo_propietario;

        var badge_resultados = {
            existe_n_propiedades: false, // por defecto
            n_propiedades: 0, // por defecto
            existe_n_guardados: false, // por defecto
            n_guardados: 0, // por defecto
        };

        const registro_propiedades = await indiceInversiones.find(
            { ci_propietario: codigo_propietario, estado_propietario: "activo" },
            {
                codigo_inmueble: 1,
            }
        );

        if (registro_propiedades.length > 0) {
            badge_resultados.existe_n_propiedades = true;
            badge_resultados.n_propiedades = registro_propiedades.length;
        }

        const registro_guardados = await indiceGuardados.find(
            { ci_propietario: codigo_propietario },
            {
                codigo_inmueble: 1,
            }
        );

        if (registro_guardados.length > 0) {
            badge_resultados.existe_n_guardados = true;
            badge_resultados.n_guardados = registro_guardados.length;
        }

        return badge_resultados;
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------------------------------------

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA GUARDAR O DES-GUARDAR INMUEBLE QUE SELECCIONA EL INVERSOR

controladorCliInversor.guardarInmueble = async (req, res) => {
    //  viene de la RUTA  post   '/inversor/operacion/guardar-inmueble'
    try {
        //--------------- Verificacion ----------------
        //console.log("los datos de PAQUETE DE DATOS para guardar o des-guardar");
        //console.log(req.body);
        //---------------------------------------------
        var estado_guardado = req.body.estado_guardado;
        var codigo_inmueble = req.body.codigo_inmueble;

        // ------- Para verificación -------
        //console.log("VEMOS SI EL CLIENTE ES VALIDADO iniciooo, PROPIETARIO GUARDAR INMUEBLE");
        //console.log(req.inversor_autenticado);
        //console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn, PROPIETARIO GUARDAR INMUEBLE");

        // ------------------------------------------------------
        //var ci_propietario = req.user.ci_propietario; // alfa estaba anteriormente
        // ------------------------------------------------------
        if (req.inversor_autenticado) {
            var ci_propietario = req.user.ci_propietario;
            //if (ci_propietario) { // alfa estaba anteriormente
            if (estado_guardado == "si_guardado") {
                // significa que el inmueble pasara a ser "no_guardado"

                // verificamos efectivamente que el inmueble ya figura como guardado del inversor
                var registro = await indiceGuardados.findOne({
                    ci_propietario: ci_propietario,
                    codigo_inmueble: codigo_inmueble,
                });

                if (registro) {
                    // entonces eliminamos de la base de datos el registro
                    // await registro.remove(); dejamos de usar remove para no tener problemas con su caducidad
                    await indiceGuardados.deleteOne({
                        ci_propietario: ci_propietario,
                        codigo_inmueble: codigo_inmueble,
                    });
                    res.json({
                        exito: "si",
                    });
                } else {
                    res.json({
                        exito: "no",
                    });
                }
            }

            if (estado_guardado == "no_guardado") {
                // significa que el inmueble pasara a ser "si_guardado"

                // verificamos efectivamente que el inmueble NO figura como guardado del inversor
                var registro = await indiceGuardados.findOne({
                    ci_propietario: ci_propietario,
                    codigo_inmueble: codigo_inmueble,
                });

                if (!registro) {
                    // NOTESE QUE USAMOS "!"

                    var registro_inmueble = await indiceInmueble.findOne(
                        {
                            codigo_inmueble: codigo_inmueble,
                        },
                        { codigo_proyecto: 1, codigo_terreno: 1, _id: 0 }
                    );

                    if (registro_inmueble) {
                        // entonces creamos el nuevo registro

                        const nuevo_registro = new indiceGuardados({
                            ci_propietario: ci_propietario,
                            codigo_terreno: registro_inmueble.codigo_terreno,
                            codigo_proyecto: registro_inmueble.codigo_proyecto,
                            codigo_inmueble: codigo_inmueble,
                            // la fecha de guardado se crea por defecto en la base de datos
                        });
                        await nuevo_registro.save();

                        res.json({
                            exito: "si",
                        });
                    }
                } else {
                    // significa que el inmueble ya lo tiene el inversor guardado, pero que intenta guardarlo nuevamente, lo cual no es posible, por tanto le enviamos un res "no"
                    res.json({
                        exito: "no",
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA CAMBIAR LAS CLAVES DE ACCESO DEL INVERSOR

controladorCliInversor.cambiarClavesAcceso = async (req, res) => {
    //  viene de la RUTA  post   '/inversor/operacion/cambiar-claves'
    try {
        var act_usuario = req.body.act_usuario;
        var act_clave = req.body.act_clave;
        var nue_usuario = req.body.nue_usuario;
        var nue_clave_1 = req.body.nue_clave_1;
        //var nue_clave_2 = req.body.nue_clave_2; // no es necesario ya que es el mismo que nue_clave_1 que ya fue verificado en logica de cliente propietario

        // ------- Para verificación -------
        //console.log("los datos enviados al servidor para las re-claves del propietario");
        //console.log(req.body);

        var registro_inversionista = await indice_propietario.findOne({
            usuario_propietario: act_usuario,
        });

        if (registro_inversionista) {
            // revision de contraseña
            const respuesta = await registro_inversionista.compararContrasena(act_clave); // nos devuelve TRUE o FALSE
            if (respuesta) {
                if (nue_usuario == registro_inversionista.usuario_propietario) {
                    // si el nuevo usuario que desea registrar es el mismo que el que tiene actualmente, LE ESTA PERMITIDO, porque este ya esta asegurado que es unico en toda la base de datos

                    // cambiaremos (aunque en este caso el nombre de USUARIO sera el mismo) las claves
                    registro_inversionista.usuario_propietario = nue_usuario;
                    // antes encriptarlo para ser guardado
                    registro_inversionista.clave_propietario =
                        await registro_inversionista.encriptarContrasena(nue_clave_1); // indiferente usar nue_clave_1 o nue_clave_2

                    await registro_inversionista.save();

                    res.json({
                        exito: "si",
                    });
                } else {
                    // ahora revisamos si el dato NUEVO de USUARIO existe o no en la base de datos, BASTA QUE SOLO EXISTA UNO (findOne) PARA QUE ESTE NUEVO USUARIO SEA DESCARTADO Y SE LE PIDA QUE INGRESE UN NUEVO NOMBRE DE USUARIO
                    var usuario_existente = await indice_propietario.findOne({
                        usuario_propietario: nue_usuario,
                    });

                    if (usuario_existente) {
                        // significa que el nombre de usuario que intenta registrar ya existe y que le pertenece a otro usuario
                        res.json({
                            exito: "cambie_usuario",
                        });
                    } else {
                        registro_inversionista.usuario_propietario = nue_usuario;
                        // antes encriptarlo para ser guardado
                        registro_inversionista.clave_propietario =
                            await registro_inversionista.encriptarContrasena(nue_clave_1); // indiferente usar nue_clave_1 o nue_clave_2
                        await registro_inversionista.save();

                        res.json({
                            exito: "si",
                        });
                    }
                }
            } else {
                res.json({
                    exito: "maestro denegado",
                });
            }
        } else {
            res.json({
                exito: "no",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*
// ORIGINALMENTE ESTE CODIGO NO DESTRUYE LAS SESSIONES CREADAS CON COOKIES EN LA BASE DE DATOS DE MONGODB ATLAS, CUANDO SE LE DA LA OPCION DESDE NUESTRA APP WEB DE "CERRAR SESION"

controladorCliInversor.cerrarInversor = async (req, res) => {
    //  viene de la RUTA  GET   '/ventana/inversor/cerrar'
    try {
        req.logout(); // para BORRAR la sesion del CLIENTE
        // res.render('acceso');  // funciona renderiza la ventana de inicio, pero en la url del navegador se queda con "/ventana/inversor/cerrar"
        res.redirect("/"); // funciona, renderiza la ventana de inicio y la url del navegador se ve con el correcto "/" de inicio del sistema publico
    } catch (error) {
        console.log(error);
    }
};
*/

controladorCliInversor.cerrarInversor = async (req, res) => {
    try {
        // "destroy" Destruye la sesión actual de la base de datos de mongodb atlas
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        req.logout(); // para BORRAR la sesion del CLIENTE

        res.redirect("/"); // funciona, renderiza la ventana de inicio y la url del navegador se ve con el correcto "/" de inicio del sistema
    } catch (err) {
        console.error("Error al cerrar sesión:", err);
        // Maneja el error de acuerdo a tus necesidades
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorCliInversor;
