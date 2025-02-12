// TODO LO REFERENTE A LA PARTE DE TERRENO PARA ALBERGAR PROPUESTAS DE PROYECTOS

const {
    indiceTerreno,
    indiceImagenesTerreno,
    indiceProyecto,
    indiceDocumentos,
    indiceFraccionTerreno,
    indiceEmpresa,
} = require("../modelos/indicemodelo");

const { proyecto_card_adm_cli, fraccion_card_adm_cli } = require("../ayudas/funcionesayuda_1");

const { cabezeras_adm_cli, datos_copropietario } = require("../ayudas/funcionesayuda_2");

const {
    numero_punto_coma,
    verificarTePyInmFracc,
    terreno_pronostico,
} = require("../ayudas/funcionesayuda_3");
const { te_inm_copropietario } = require("../ayudas/funcionesayuda_4");
const { super_info_te } = require("../ayudas/funcionesayuda_5");

const moment = require("moment");

const controladorCliTerreno = {};

//============================================================================
//============================================================================
// para enviar al usuario los precios $us/m2 del terreno
// Ruta: post "/terreno/operacion/pronostico_precio_m2"

controladorCliTerreno.pronostico_precio_m2 = async (req, res) => {
    try {
        var respuestaPronostico = terreno_pronostico();
        res.json(respuestaPronostico);
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA RENDERIZAR LA VENTANA DEL TERRENO DESDE EL LADO PUBLICO DEL CLIENTE
// RUTA   "get"   /terreno/:codigo_terreno/:vista_te

controladorCliTerreno.renderVentanaTerreno = async (req, res) => {
    try {
        var codigo_terreno = req.params.codigo_terreno;
        var tipo_vista_terreno = req.params.vista_te;

        //IMPORTANTE: PARA NO PERMITIR EL ACCESO A TERRENOS INEXISTENTES O QUE NO ESTAN DISPONIBLES PARA SER VISIBLES POR EL USUARIO, ES QUE 1º EL PROYECTO SERA BUSCADO EN LA BASE DE DATOS

        var paqueteria_datos = {
            codigo_objetivo: codigo_terreno,
            tipo: "terreno",
        };
        var verificacion = await verificarTePyInmFracc(paqueteria_datos);

        if (verificacion == true) {
            // ------- Para verificación -------
            //console.log("el codigo del TERRENO es:");
            //console.log(codigo_terreno);
            // ------- Para verificación -------
            //console.log("tipo de vista del TERRENO es:");
            //console.log(tipo_vista_terreno);

            var info_terreno_cli = {};
            info_terreno_cli.codigo_terreno = codigo_terreno;
            info_terreno_cli.navegador_cliente = true;
            info_terreno_cli.cab_te_cli = true;
            info_terreno_cli.estilo_cabezera = "cabezera_estilo_terreno";

            //----------------------------------------------------

            //////var inversor_autenticado = validar_cli_2(); // devuelve "true" or "false"

            // ------- Para verificación -------
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO");
            //console.log(req.inversor_autenticado);
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");

            info_terreno_cli.inversor_autenticado = req.inversor_autenticado;
            // si es TRUE y solo si es true, entonces se mostrara su ci
            if (req.inversor_autenticado) {
                info_terreno_cli.ci_propietario = req.user.ci_propietario;
            }

            var aux_cabezera = {
                codigo_objetivo: codigo_terreno,
                tipo: "terreno",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_terreno_cli.cabezera_cli = cabezera_cli;

            //-------------------------------------------------------------------------------
            // si el cliente esta navegado con su cuenta
            if (req.inversor_autenticado) {
                var ci_propietario = req.user.ci_propietario;

                // ------- Para verificación -------
                //console.log("el codigo del propietario registrado con su cuenta es");
                //console.log(ci_propietario);
            } else {
                // en caso de que este navegando sin haber accedido a su cuenta personal

                var ci_propietario = "ninguno";
            }

            var paquete_datos = {
                codigo_terreno,
                ci_propietario,
            };

            var global_te = await complementos_globales_te(paquete_datos);
            info_terreno_cli.global_te = global_te;
            //-------------------------------------------------------------------------------

            info_terreno_cli.es_terreno = true; // para menu navegacion comprimido

            //----------------------------------------------------

            if (tipo_vista_terreno == "descripcion") {
                // para pestaña y ventana apropiada para proyecto
                info_terreno_cli.descripcion_te = true;

                // porque no se mostrara los segunderos solo para el caso de TERRENO
                info_terreno_cli.info_segundero = false;

                // para mostrar circulos estados y caracteristicas del proyecto
                info_terreno_cli.estado_caracteristicas = true;

                info_terreno_cli.caracteristicas_terreno = true;

                var info_proyecto = await terreno_descripcion(codigo_terreno);
                info_terreno_cli.informacion = info_proyecto;
                //agregamos info complementaria
                info_terreno_cli.codigo_terreno = codigo_terreno;

                // ------- Para verificación -------
                //console.log("los datos info de TERRENO CLIENTE son");
                //console.log(info_terreno_cli);

                res.render("cli_terreno", info_terreno_cli);
            }

            if (tipo_vista_terreno == "fracciones") {
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
                    codigo_terreno,
                    codigo_usuario, // codigo || "ninguno"
                };

                var contenido_terreno = await terreno_fracciones(paquete_datos);
                info_terreno_cli.fracciones_te = true; // para pestaña y ventana apropiada para terreno

                info_terreno_cli.contenido_terreno = contenido_terreno;

                // ------- Para verificación -------
                //console.log("los proyectos del terreno son ");
                //console.log(info_terreno_cli);

                res.render("cli_terreno", info_terreno_cli);
            }

            if (tipo_vista_terreno == "proyectos") {
                var contenido_terreno = await terreno_proyectos(codigo_terreno);
                info_terreno_cli.proyectos_te = true; // para pestaña y ventana apropiada para terreno
                info_terreno_cli.contenido_terreno = contenido_terreno;

                // ------- Para verificación -------
                //console.log("los proyectos del terreno son ");
                //console.log(info_terreno_cli);

                res.render("cli_terreno", info_terreno_cli);
            }

            if (ci_propietario != "ninguno" && tipo_vista_terreno == "copropietario") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                info_terreno_cli.copropietario_te = true;

                let paquete_datos = {
                    ci_propietario,
                    codigo_terreno,
                    precio_terreno: global_te.precio_bs,
                };

                var contenido_terreno = await terreno_copropietario(paquete_datos);
                info_terreno_cli.contenido = contenido_terreno;

                // ------- Para verificación -------
                //console.log("los datos de COPROPIETARIO del terreno");
                //console.log(info_terreno_cli);

                res.render("cli_terreno", info_terreno_cli);
            }

            if (tipo_vista_terreno == "calculadora") {
                info_terreno_cli.calculadora_te = true; // para pestaña y ventana apropiada para terreno

                var contenido_terreno = await terreno_calculadora(codigo_terreno);

                info_terreno_cli.contenido_terreno = contenido_terreno;

                // ------- Para verificación -------
                //console.log("los calculadora del terreno son ");
                //console.log(info_terreno_cli);

                res.render("cli_terreno", info_terreno_cli);
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN TERRENO INEXISTENTE O QUE NO ESTA AUN DISPONIBLE PARA SER VISUALIZADO POR EL CLIENTE.
            res.redirect("/"); // rediccionara a la pagina DE INICIO DEL CLIENTE
        }
    } catch (error) {
        console.log(error);
    }
};

// ------------------------------------------------------------------

async function terreno_descripcion(codigo_terreno) {
    try {
        moment.locale("es");

        const registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                precio_bs: 1,
                descuento_bs: 1,
                fraccion_bs: 1,
                superficie: 1,
                maximo_pisos: 1,
                convocatoria: 1,
                importante: 1,
                ciudad: 1,
                provincia: 1,
                direccion: 1,
                fecha_fin_convocatoria: 1,
                descri_ubi_terreno: 1,
                titulo_ubi_otros_1: 1,
                ubi_otros_1: 1,
                titulo_ubi_otros_2: 1,
                ubi_otros_2: 1,
                titulo_ubi_otros_3: 1,
                ubi_otros_3: 1,
                link_googlemap: 1,
                v_descripcion: 1,
                _id: 0,
            }
        );

        if (registro_terreno) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_terreno);

            // reconversion del "string" a "objeto"
            var te_descripcion = JSON.parse(aux_string);

            //-------------------------------------------------------------------
            // UBICACION DEL TERRENO

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
                // datos del terreno
                codigo_terreno,
                precio_terreno: registro_terreno.precio_bs,
                fecha_fin_convocatoria: registro_terreno.fecha_fin_convocatoria,
            };
            var resultado = await super_info_te(datos_inm);

            var fracciones_disponibles = resultado.fracciones_disponibles;
            var fracciones_invertidas = resultado.fracciones_invertidas;
            var plazo_titulo = resultado.plazo_titulo;
            var plazo_tiempo = resultado.plazo_tiempo;
            var meta = resultado.meta;
            var meta_render = resultado.meta_render;
            var financiamiento = resultado.financiamiento;
            var financiamiento_render = resultado.financiamiento_render;
            var p_financiamiento = resultado.p_financiamiento;
            var p_financiamiento_render = resultado.p_financiamiento_render;
            var fraccion_bs = resultado.fraccion; // bs
            var fraccion_bs_r = resultado.fraccion_render; // bs

            //-------------------------------------------------------------------

            te_descripcion.fracciones_disponibles = fracciones_disponibles;
            te_descripcion.fracciones_invertidas = fracciones_invertidas;
            te_descripcion.plazo_titulo = plazo_titulo;
            te_descripcion.plazo_tiempo = plazo_tiempo;
            te_descripcion.financiamiento = financiamiento;
            te_descripcion.financiamiento_render = financiamiento_render;
            te_descripcion.p_financiamiento = p_financiamiento;
            te_descripcion.p_financiamiento_render = p_financiamiento_render;

            te_descripcion.titulo_up_a = titulo_up_a;
            te_descripcion.puntos_up_a = puntos_up_a;
            te_descripcion.titulo_up_b = titulo_up_b;
            te_descripcion.puntos_up_b = puntos_up_b;
            te_descripcion.titulo_up_c = titulo_up_c;
            te_descripcion.puntos_up_c = puntos_up_c;

            te_descripcion.precio_bs_r = numero_punto_coma(te_descripcion.precio_bs);
            te_descripcion.descuento_bs_r = numero_punto_coma(te_descripcion.descuento_bs);
            te_descripcion.superficie = numero_punto_coma(te_descripcion.superficie);

            //-------------------------------------------------------------------
            var registro_documentos = await indiceDocumentos.find({
                codigo_terreno: codigo_terreno,
                codigo_proyecto: "",
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
            te_descripcion.documentos_descripcion = documentos_descripcion;
            //-------------------------------------------------------------------

            return te_descripcion;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function terreno_fracciones(paquete_datos) {
    try {
        var codigo_terreno = paquete_datos.codigo_terreno;
        var codigo_usuario = paquete_datos.codigo_usuario;

        var fracciones = await indiceFraccionTerreno
            .find(
                { codigo_terreno: codigo_terreno },
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
                    ci_propietario: codigo_usuario,
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

// -----------------------------------------------------------------------------------

async function terreno_proyectos(codigo_terreno) {
    try {
        // solo seran mostrados los que tienen la opcionde ser mostrados visiblemente
        // como es el dado del CLIENTE, entonces "visible: true" estara agregado para mostrar solo aquellos py que esten permitidos para ser vistos
        var proyectos_terreno = await indiceProyecto.find(
            { codigo_terreno: codigo_terreno, visible: true },
            {
                codigo_proyecto: 1,
                v_proyectos: 1,
                _id: 0,
            }
        );

        var terreno_proyectos = []; // vacio de inicio
        if (proyectos_terreno.length > 0) {
            for (let i = 0; i < proyectos_terreno.length; i++) {
                var codigo_proyecto_i = proyectos_terreno[i].codigo_proyecto;
                var laapirest = "/"; // por partir desde el lado del CLIENTE
                var paquete_proyecto = {
                    codigo_proyecto: codigo_proyecto_i,
                    laapirest,
                };
                var card_proyecto_i = await proyecto_card_adm_cli(paquete_proyecto);
                terreno_proyectos[i] = card_proyecto_i;
            }
        }

        return terreno_proyectos;
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function terreno_copropietario(paquete_datos) {
    // es casi similar al controlador: llenar_datos_copropietario_inm

    try {
        var ci_propietario = paquete_datos.ci_propietario;
        var codigo_terreno = paquete_datos.codigo_terreno;

        //--------------------------------------------------------
        // para armado de datos personales, documentos privados del copropietario
        var datos_funcion = {
            ci_propietario,
            codigo_objetivo: codigo_terreno,
            copropietario: "terreno",
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

        //--------------------------------------------------------------

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

        return obj_union;
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function terreno_calculadora(codigo_terreno) {
    try {
        var registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                ubicacion: 1,
                direccion: 1,
                precio_bs: 1, // ya considera el descuento del terreno
                descuento_bs: 1,
                fraccion_bs: 1,
                rend_fraccion_mensual: 1,
                rend_fraccion_total: 1,
                dias_maximo: 1,
                meses_maximo: 1,
                superficie: 1,
                precio_comparativa: 1, // array
                m2_comparativa: 1, // array
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

        var maximo_bsm2 = 0; // por defecto
        var minimo_bsm2 = 0; // por defecto
        var promedio_bsm2 = 0; // por defecto

        var maximo_bsm2_render = "0"; // por defecto
        var minimo_bsm2_render = "0"; // por defecto
        var promedio_bsm2_render = "0"; // por defecto

        if (registro_terreno && registro_empresa) {
            let bsm2 = registro_terreno.precio_bs / registro_terreno.superficie;
            var solidexa_te_bsm2 = Number(bsm2.toFixed(2)); // Redondea a 2 decimales

            if (
                registro_terreno.descuento_bs == undefined ||
                registro_terreno.descuento_bs == null ||
                registro_terreno.descuento_bs == "" ||
                registro_terreno.descuento_bs == 0
            ) {
                var existe_descuento = "no";
            } else {
                var existe_descuento = "si";
            }

            //direccion del terreno
            let ubicacion = registro_terreno.ubicacion; // ej: OTB Vertiente
            let direccion = registro_terreno.direccion; // ej: Calle X y Av. Z

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

            var registro_fracciones = await indiceFraccionTerreno.findOne(
                { codigo_terreno: codigo_terreno, disponible: true },
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

            return {
                ubicacion,
                direccion,

                solidexa_te_bs: registro_terreno.precio_bs,
                solidexa_te_bs_render: numero_punto_coma(registro_terreno.precio_bs),
                solidexa_te_m2: registro_terreno.superficie,
                solidexa_te_bsm2,
                maximo_bsm2,
                minimo_bsm2,
                promedio_bsm2,
                maximo_bsm2_render,
                minimo_bsm2_render,
                promedio_bsm2_render,
                descuento_bs: registro_terreno.descuento_bs,
                fraccion_bs,
                fraccion_bs_render,
                p_f_mensual: registro_terreno.rend_fraccion_mensual,
                p_f_total: registro_terreno.rend_fraccion_total,
                dias_maximo: registro_terreno.dias_maximo,
                meses_maximo: registro_terreno.meses_maximo,
                tc_ine: registro_empresa.tc_ine,
                tc_paralelo: registro_empresa.tc_paralelo,
                inflacion: registro_empresa.inflacion_ine,
                existe_descuento,
                nf_maximo,
            };
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------
// para informacion global de proyecto que se mostrara en todas las ventanas

async function complementos_globales_te(paquete_datos) {
    var codigo_terreno = paquete_datos.codigo_terreno;
    var ci_propietario = paquete_datos.ci_propietario; // ci_propietario o "ninguno"

    var existe_copropietario_terreno = false; // por defecto

    //----------------------------------------------------------
    // para mostrar la pestaña del  copropietario del terreno

    if (ci_propietario != "ninguno") {
        var registro_copropietario = await indiceFraccionTerreno.findOne({
            ci_propietario: ci_propietario,
            codigo_terreno: codigo_terreno,
        });
        // puedes ser copropietario de varias fracciones de terreno, pero basta que sea dueño de UNO solo para confirmar que existe_copropietario_terreno, es por ello que basta utilizar ".findOne"
        if (registro_copropietario) {
            // si el usuario EXISTE EN LA BASE DE DATOS y es actual copropietario del presente INMUEBLE
            existe_copropietario_terreno = true;
        }
    }

    //----------------------------------------------------------
    // para visualización de la calculadora del terreno

    let fraccionesTerreno = await indiceFraccionTerreno.find({
        codigo_terreno: codigo_terreno,
        disponible: true,
    });

    if (fraccionesTerreno.length > 0) {
        var existe_calculadora_terreno = true;
    } else {
        var existe_calculadora_terreno = false;
    }

    //----------------------------------------------------------

    var basico_te = await indiceTerreno.findOne(
        { codigo_terreno: codigo_terreno },
        {
            ciudad: 1,
            provincia: 1,
            direccion: 1,
            precio_bs: 1, // solo sera util para calcular el % de particpacion del copropietario del terreno
            _id: 0,
        }
    );

    if (basico_te) {
        var registro_imagenes = await indiceImagenesTerreno.find(
            {
                codigo_terreno: codigo_terreno,
            },
            {
                nombre_imagen: 1,
                codigo_imagen: 1,
                extension_imagen: 1,
                url: 1,
                _id: 0,
            }
        );

        var imagenes_te = []; // asumimos por defecto
        if (registro_imagenes.length > 0) {
            for (let i = 0; i < registro_imagenes.length; i++) {
                imagenes_te[i] = {
                    nombre_imagen: registro_imagenes[i].nombre_imagen,
                    codigo_imagen: registro_imagenes[i].codigo_imagen,
                    extension_imagen: registro_imagenes[i].extension_imagen,
                    imagen_te:
                        registro_imagenes[i].codigo_imagen + registro_imagenes[i].extension_imagen,
                    url: registro_imagenes[i].url,
                };
            }
        }

        return {
            codigo_terreno,

            ciudad: basico_te.ciudad,
            provincia: basico_te.provincia,
            direccion: basico_te.direccion,

            existe_copropietario_terreno,

            imagenes_te,
            existe_calculadora_terreno,
        };
    }
}

// ------------------------------------------------------------------

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorCliTerreno;
