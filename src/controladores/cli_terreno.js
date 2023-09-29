// TODO LO REFERENTE A LA PARTE DE TERRENO PARA ALBERGAR PROPUESTAS DE PROYECTOS

const {
    indiceTerreno,
    indiceImagenesTerreno,
    indiceProyecto,
    indiceDocumentos,
} = require("../modelos/indicemodelo");

const { proyecto_card_adm_cli } = require("../ayudas/funcionesayuda_1");

const { cabezeras_adm_cli, pie_pagina_cli, segundero_cajas } = require("../ayudas/funcionesayuda_2");

const { numero_punto_coma, verificarTePyInm } = require("../ayudas/funcionesayuda_3");

const moment = require("moment");

const controladorCliTerreno = {};

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
        var verificacion = await verificarTePyInm(paqueteria_datos);

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
                lado: "cliente",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_terreno_cli.cabezera_cli = cabezera_cli;

            var pie_pagina = await pie_pagina_cli();
            info_terreno_cli.pie_pagina_cli = pie_pagina;

            info_terreno_cli.global_te = await complementos_globales_te(codigo_terreno);

            info_terreno_cli.es_terreno = true; // para menu navegacion comprimido

            //----------------------------------------------------
            // paquete para actualizar el numero de vistas segun el tipo de la ventana
            var paquete_vista = {
                codigo_terreno,
                ventana: tipo_vista_terreno,
            };
            info_terreno_cli.nv_ventana = await n_vista_ventana(paquete_vista);
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

            if (tipo_vista_terreno == "proyectos") {
                var contenido_terreno = await terreno_proyectos(codigo_terreno);
                info_terreno_cli.proyectos_te = true; // para pestaña y ventana apropiada para terreno
                info_terreno_cli.contenido_terreno = contenido_terreno;

                // ------- Para verificación -------
                //console.log("los proyectos del terreno son ");
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
                precio_sus: 1,
                superficie: 1,
                maximo_pisos: 1,
                convocatoria: 1,
                importante: 1,
                anteproyectos_maximo: 1,
                anteproyectos_registrados: 1,
                ciudad: 1,
                provincia: 1,
                direccion: 1,
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
            var datos_segundero = {
                codigo_objetivo: codigo_terreno,
                tipo_objetivo: "terreno",
            };

            var aux_segundero_cajas = await segundero_cajas(datos_segundero);

            // ------- Para verificación -------
            //console.log("los valores de segundero cajas TERRENO");
            //console.log(aux_segundero_cajas);

            te_descripcion.val_segundero_cajas = aux_segundero_cajas;

            te_descripcion.titulo_up_a = titulo_up_a;
            te_descripcion.puntos_up_a = puntos_up_a;
            te_descripcion.titulo_up_b = titulo_up_b;
            te_descripcion.puntos_up_b = puntos_up_b;
            te_descripcion.titulo_up_c = titulo_up_c;
            te_descripcion.puntos_up_c = puntos_up_c;

            te_descripcion.precio_sus = numero_punto_coma(te_descripcion.precio_sus);
            te_descripcion.superficie = numero_punto_coma(te_descripcion.superficie);

            te_descripcion.anteproyectos_libres =
                registro_terreno.anteproyectos_maximo - registro_terreno.anteproyectos_registrados;

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

// -----------------------------------------------------------------------------------

async function n_vista_ventana(paquete_vista) {
    try {
        var codigo_terreno = paquete_vista.codigo_terreno;
        var ventana = paquete_vista.ventana;

        const registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                v_descripcion: 1,
                v_imagenes: 1,
                v_documentos: 1,
                v_proyectos: 1,
                v_estados: 1,
                _id: 0,
            }
        );
        if (registro_terreno) {
            if (ventana == "descripcion") {
                var n_vista = registro_terreno.v_descripcion + 1;
                await indiceTerreno.updateOne(
                    { codigo_terreno: codigo_terreno },
                    { $set: { v_descripcion: n_vista } }
                );
            }

            if (ventana == "proyectos") {
                var n_vista = registro_terreno.v_proyectos + 1;
                await indiceTerreno.updateOne(
                    { codigo_terreno: codigo_terreno },
                    { $set: { v_proyectos: n_vista } }
                );
            }

            return n_vista;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------
// para informacion global de proyecto que se mostrara en todas las ventanas

async function complementos_globales_te(codigo_terreno) {
    var basico_te = await indiceTerreno.findOne(
        { codigo_terreno: codigo_terreno },
        {
            ciudad: 1,
            provincia: 1,
            direccion: 1,
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
                };
            }
        }

        return {
            codigo_terreno,

            ciudad: basico_te.ciudad,
            provincia: basico_te.provincia,
            direccion: basico_te.direccion,

            imagenes_te,
        };
    }
}

// ------------------------------------------------------------------

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorCliTerreno;
