const pasaporte = require("passport"); // NO es para inicializarlo, porque eso ya esta echo, sino mas bien para "ejecutarlo segun las tareas que se le definio en pasaporte.js"

// CONTIENE A LOS CONTROLADORES QUE FORMAN PARTE DE LA VENTANA DE "INICIO"

const {
    indiceProyecto,
    indiceInmueble,
    indiceAdministrador,
    indice_propietario,
    indiceEmpresa,
    indiceTerreno,
    indiceRequerimientos,
} = require("../modelos/indicemodelo");

const { cards_inicio_cli_adm } = require("../ayudas/funcionesayuda_0");
const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");

const controladorInicio = {};

/************************************************************************************** */
/************************************************************************************** */
// PARA LA VENTANA DE INICIO

controladorInicio.indexInicio = async (req, res) => {
    // renderizamos la ventana de inicio de la aplicacion

    res.render("acceso");
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// PARA ACCESO AL SISTEMA DE SOLIDEXA LADO ADMINISTRADOR
// especificamos el tipo de identificacion usar, en este caso el encargado del lado del administrador "verificar_usu_clave_adm"

controladorInicio.verificarClavesAdm = pasaporte.authenticate("verificar_usu_clave_adm", {
    failureRedirect: "/laapirest/revision_acceso_adm/acceso_fallado",
    successRedirect: "/laapirest/revision_acceso_adm/acceso_permitido",
});

controladorInicio.adm_incorrecto = async (req, res) => {
    res.json({
        tipo: "incorrecto",
    });
};

controladorInicio.adm_correcto = async (req, res) => {
    res.json({
        tipo: "correcto",
    });
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//  para renderizar la ventana de inico del sistema
// es la ventana que se abre despues de acceder con: la cuenta y contraseña de administrador (en la que se ven las cajas descendiendo)

controladorInicio.inicioSistema = async (req, res) => {
    // viene de la ruta:  "/laapirest/accesosistema"  metodo: GET

    try {
        // ------- Para verificación -------
        //console.log("estamos en el controlador de inicio sistema");

        // ------- Para verificación -------
        //console.log("TIPO NAVEGACION");
        //console.log(req.tipo_navegacion);

        /*
        // ------- Para verificación -------
        console.log("DATOS del administrador ingreso");
        console.log(req.user);
        console.log("el id del administrador ingreso");
        console.log(req.user.id);
        console.log("el CI del administrador ingreso");
        console.log(req.user.ci_administrador);
        */

        // ---------------------------------------------------------------
        // para las url de imagen inicio del sistema horizontal y vertical

        var url_inicio_h = "/rutavirtualpublico/imagenes/imagenes_sistema/inicio_horizontal.jpg";
        var url_inicio_v = "/rutavirtualpublico/imagenes/imagenes_sistema/inicio_vertical.jpg";

        // ---------------------------------------------------------------

        var registro_empresa = await indiceEmpresa.findOne(
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

        if (registro_empresa) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_empresa);

            // reconversion del "string" a "objeto"
            var datos_empresa = JSON.parse(aux_string);

            //----------------------------------------
            // agregando valores render con punto mil
            datos_empresa.r_construidos= numero_punto_coma(registro_empresa.n_construidos);
            datos_empresa.r_proyectos= numero_punto_coma(registro_empresa.n_proyectos);
            datos_empresa.r_inmuebles= numero_punto_coma(registro_empresa.n_inmuebles);
            datos_empresa.r_empleos= numero_punto_coma(registro_empresa.n_empleos);
            datos_empresa.r_ahorros= numero_punto_coma(registro_empresa.n_ahorros);
            datos_empresa.r_resp_social= numero_punto_coma(registro_empresa.n_resp_social);
            //----------------------------------------

            // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido

            //res.render("inicio", { es_ninguno: true }); //increible que borrandolo FUNCIONE
            //////// res.render("cli_inmueble", info_inmueble_cli);

            // ------- Para verificación -------
            //console.log("LOS DATOS DE INICIO DE VENTANA ADM");
            //console.log(datos_empresa);
            res.render("inicio", {
                es_ninguno: true,
                datos_empresa,
                url_inicio_h,
                url_inicio_v,
            }); //increible que borrandolo FUNCIONE
        } else {
            var datos_empresa = {}; // lo enviamos como objeto vacio

            // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
            //res.render("inicio", { es_ninguno: true }); //increible que borrandolo FUNCIONE
            //////// res.render("cli_inmueble", info_inmueble_cli);
            res.render("inicio", { es_ninguno: true, datos_empresa, url_inicio_h, url_inicio_v }); //increible que borrandolo FUNCIONE
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// BUSQUEDA DE PROYECTO, INMUEBLE, INVERSIONISA DESDE EL NAV

controladorInicio.buscarDesdeGestionador = async (req, res) => {
    // RUTA   post  '/laapirest/buscar_desde_gestionador/'

    var objetivoBusqueda = req.body.objetivo_busqueda.toLowerCase(); // en minuscula por seguridad

    // 1º BUSQUEDA EN LA BASE DE DATOS DE PROYECTO ... POR CODIGO DE PROYECTO
    var resultadoBusqueda = await indiceTerreno.findOne({ codigo_terreno: objetivoBusqueda });

    if (resultadoBusqueda) {
        // si existe en la base de datos
        // redireccionamos a la pagina del TERRENO

        // EN EL JQUERY PARA QUE SE VISUALIZE EN EL NAVEGADOR EL CAMBIO EN LA URL, HACER CLICK CON JQUERY EN UN FORMULARIO AUXILIAR(GET, SIN _BLACK) DANDOLE EL "ACTION" DE LA RUTA PARA RENDERIZAR LA VENTANA DEL TERRENO (usando attr)
        res.json({
            exito: "si",
            se_trata: "terreno",
        });
    } else {
        //////delete resultadoBusqueda; // para no ocupar espacio
        // 2º BUSQUEDA EN LA BASE DE DATOS ... POR CODIGO DE PROYECTO
        var resultadoBusqueda = await indiceProyecto.findOne({ codigo_proyecto: objetivoBusqueda });

        if (resultadoBusqueda) {
            // si existe en la base de datos
            // redireccionamos a la pagina del proyecto
            res.json({
                exito: "si",
                se_trata: "proyecto",
            });
        } else {
            //////delete resultadoBusqueda; // para no ocupar espacio
            // 3º BUSQUEDA EN LA BASE DE DATOS ... POR CODIGO DE INMUEBLE
            resultadoBusqueda = await indiceInmueble.findOne({ codigo_inmueble: objetivoBusqueda });

            if (resultadoBusqueda) {
                // si existe en la base de datos
                // redireccionamos a la pagina del inmueble
                res.json({
                    exito: "si",
                    se_trata: "inmueble",
                });
            } else {
                //////delete resultadoBusqueda; // para no ocupar espacio
                // 4º BUSQUEDA EN LA BASE DE DATOS DE INVERSIONISTAS ... POR CI INVERSIONISTA
                resultadoBusqueda = await indice_propietario.findOne({
                    ci_propietario: objetivoBusqueda,
                });

                if (resultadoBusqueda) {
                    res.json({
                        exito: "si",
                        se_trata: "inversionista",
                    });
                } else {
                    //////delete resultadoBusqueda; // para no ocupar espacio
                    // 5º BUSQUEDA EN LA BASE DE DATOS ... POR REQUERIMIENTO
                    resultadoBusqueda = await indiceRequerimientos.findOne(
                        {
                            codigo_requerimiento: objetivoBusqueda,
                        },
                        {
                            codigo_proyecto: 1,
                        }
                    );

                    if (resultadoBusqueda) {
                        res.json({
                            exito: "si",
                            se_trata: "requerimiento",
                            codigo_proyecto: resultadoBusqueda.codigo_proyecto,
                        });
                    } else {
                        // entonces NO EXISTEN RESULTADOS ENCONTRADOS
                        //////delete resultadoBusqueda; // para no ocupar espacio
                        res.json({
                            exito: "no",
                        });
                    }
                }
            }
        }
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// RENDERIZACION VENTANAS DE DIFERENTE ESTADO LADO ADMINISTRADOR

controladorInicio.proyectosVariosTipos = async (req, res) => {
    // viene de la ruta: GET  '/laapirest/ventana/:tipo_ventana'

    try {
        // ------- Para verificación -------
        //console.log("INGRESAMOS AL CONTROLADOR DE TIPOS DE VENTANA LADO ADMINISTRADOR");

        var tipo_ventana = req.params.tipo_ventana;
        var laapirest = "/laapirest/"; // por partir desde el lado del ADMINISTRADOR
        var codigo_usuario = "ninguno"; // por partir desde el lado del ADMINISTRADOR y solo sera tomado en cuenta en la construccion de las CARD DE INMUEBLES
        var paquete_info = {
            tipo_ventana,
            laapirest,
            codigo_usuario,
        };
        var cards_inicio = await cards_inicio_cli_adm(paquete_info);

        if (
            tipo_ventana == "guardado_terreno" ||
            tipo_ventana == "guardado_proyecto" ||
            tipo_ventana == "guardado_inmueble"
        ) {
            cards_inicio.ordenador_externo = false; // porque NO existen cards que ordenar
        } else {
            cards_inicio.ordenador_externo = true; // porque SI existen cards que ordenar
        }

        // ------- Para verificación -------

        //console.log("los datos ARMADOS DE INICIO");
        //console.log(cards_inicio);

        res.render("p_proyectos", cards_inicio);
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// RENDERIZACION DE PROYECTOS DE DIFERENTE ESTADO

controladorInicio.verificarMaestras = async (req, res) => {
    // ------- Para verificación -------
    /*
    console.log(
        "INGRESAMOS AL CONTROLADOR DE VERIFICAR CLAVES MAESTRAS PARA CREAR UN NUEVO PROYECTO"
    );
    */
    // viene de la ruta: POST  '/laapirest/verificarmaestras'

    try {
        const usuario_maestro = req.body.usuario_maestro;
        const clave_maestro = req.body.clave_maestro;
        // ------- Para verificación -------
        //console.log("claves:");
        //console.log(usuario_maestro + "   " + clave_maestro);

        var registro_maestro = await indiceAdministrador.findOne({ ad_usuario: usuario_maestro });

        if (registro_maestro) {
            // revision de contraseña
            const respuesta = await registro_maestro.compararContrasena(clave_maestro); // nos devuelve TRUE o FALSE

            if (respuesta) {
                if (registro_maestro.clase == "maestro") {
                    res.json({
                        exito: "si",
                        ci_administrador: registro_maestro.ci_administrador, // util para registrar en el histrorial de acciones
                    });
                } else {
                    res.json({
                        exito: "no",
                    });
                }
            } else {
                res.json({
                    exito: "no",
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

module.exports = controladorInicio;
