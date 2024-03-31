//const pache = require("path");

// se usa para mover la imagen (la imagen misma) de la carpeta "temporal" a la carpeta "subido"
// tambien se usara su metodo "unlink" para eliminar archivos (como imagenes o pdf)
//const fs = require("fs-extra");
// import { rename, unlink } from 'fs-extra';

const { getStorage, ref, deleteObject } = require("firebase/storage");

const {
    codigoAlfanumericoProyecto,
    codigoAlfanumericoRequerimiento,
} = require("../ayudas/ayudaslibreria");

const {
    indiceProyecto,
    indiceImagenesProyecto,
    indiceDocumentos,
    indiceInmueble,
    indiceInversiones,
    indiceGuardados,
    indiceTerreno,
    indiceRequerimientos,
    indiceImagenesSistema,
} = require("../modelos/indicemodelo");

const {
    verificadorTerrenoBloqueado,
    verificadorLlavesMaestras,
    guardarAccionAdministrador,
    inmueble_card_adm_cli,
} = require("../ayudas/funcionesayuda_1");

const { cabezeras_adm_cli, pie_pagina_adm } = require("../ayudas/funcionesayuda_2");

const { proyecto_info_cd } = require("../ayudas/funcionesayuda_4");

const moment = require("moment");

const controladorAdmProyecto = {};

/************************************************************************************ */
/************************************************************************************ */
// PARA CREAR UN NUEVO CODIGO DE PROYECTO

controladorAdmProyecto.crearNuevoProyecto = (req, res) => {
    // RUTA: POST  "/laapirest/proyecto/:codigo_terreno"

    // no es necesario revisar si el terreno esta bloqueado o si aun admite nuevos anteproyectos, pues estos ya fueron revisados con anterioridad

    generadorCodigoAlfaNumProyecto(); // este es el que recien ordenara ejecutar la funcion "generadorCodigoAlfaNumProyecto"

    async function generadorCodigoAlfaNumProyecto() {
        var codigo_proyecto = codigoAlfanumericoProyecto();

        // revisamos en la base de datos si el codigo alfanumerico del terreno ya existe o no
        const existeCodigoAlfaNumProyecto = await indiceProyecto.find({
            codigo_proyecto: codigo_proyecto,
        });

        if (existeCodigoAlfaNumProyecto.length > 0) {
            // si se encuentra un terreno con el mismo codigo alfanumerico, entonces volvemos a ejecutar la funcion nuevamente, a esto se llama FUNCION RECURSIVA
            generadorCodigoAlfaNumProyecto();
        } else {
            // si aun no existe este codigo, devolvera asi "[]" (un [] vacio)

            // si el codigo generado es unico.
            const codigoNuevoTerreno = new indiceProyecto({
                codigo_proyecto: codigo_proyecto,
                codigo_terreno: req.params.codigo_terreno,
            });

            // ahora guardamos en la base de datos solo el codigo del terreno
            await codigoNuevoTerreno.save();

            // con este nuevo proyecto creado, vemos si se completo o no el limite de proyectos permitidos (se contaran el numero total actual de proyectos que tiene el terreno, incluido el reciente que acaba de crearse, pues ya esta guardado en la base de datos)
            var aux_proyectos_terreno = await indiceProyecto.find(
                { codigo_terreno: req.params.codigo_terreno },
                { codigo_terreno: 1, _id: 0 }
            );

            if (aux_proyectos_terreno.length > 0) {
                var aux_terreno = await indiceTerreno.findOne(
                    { codigo_terreno: req.params.codigo_terreno },
                    { anteproyectos_maximo: 1, _id: 0 }
                );
                if (aux_terreno) {
                    // actualizamos el numero total de anteproyectos registrados que tiene este terreno
                    await indiceTerreno.updateOne(
                        { codigo_terreno: req.params.codigo_terreno },
                        { $set: { anteproyectos_registrados: aux_proyectos_terreno.length } }
                    ); // guardamos el registro con el dato modificado

                    // si con este nuevo proyecto, el terreno cumple con la cantidad maxima de anteproyectos creados, entonces se cambia su propiedad de true a false
                    if (aux_terreno.anteproyectos_maximo <= aux_proyectos_terreno.length) {
                        await indiceTerreno.updateOne(
                            { codigo_terreno: req.params.codigo_terreno },
                            { $set: { convocatoria_disponible: false } }
                        ); // guardamos el registro con el dato modificado
                    }
                }
            }

            //--------------------------------------------
            // guardamos en el historial de acciones
            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
            var accion_administrador = "Crea Proyecto " + codigo_proyecto;

            var aux_accion_adm = {
                ci_administrador,
                accion_administrador,
            };
            await guardarAccionAdministrador(aux_accion_adm);
            //--------------------------------------------
        }

        res.redirect("/laapirest/proyecto/" + codigo_proyecto + "/descripcion"); // para renderizar la ventana del nuevo proyecto, recuerde que "redirect" es GET por defecto
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA RENDERIZAR LA VENTANA DEL PROYECTO segun la pestaña que sea elegida

// RUTA   "get"  /laapirest/proyecto/:codigo_proyecto/:ventana_proyecto
controladorAdmProyecto.renderizarVentanaProyecto = async (req, res) => {
    try {
        var codigo_proyecto = req.params.codigo_proyecto;
        var tipo_ventana_proyecto = req.params.ventana_proyecto;

        var proyectoExiste = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                estado_proyecto: 1, // guardado o completado
                _id: 0,
            }
        );

        if (proyectoExiste) {
            // VERIFICAMOS QUE EL PROYECTO EXISTA EN LA BASE DE DATOS
            var info_proyecto = {};
            info_proyecto.cab_py_adm = true;
            //info_proyecto.estilo_cabezera = "cabezera_estilo_proyecto";

            //----------------------------------------------------
            // para la url de la cabezera
            var url_cabezera = ""; // vacio por defecto
            const registro_cabezera = await indiceImagenesSistema.findOne(
                { tipo_imagen: "cabecera_proyecto" },
                {
                    url: 1,
                    _id: 0,
                }
            );

            if (registro_cabezera) {
                url_cabezera = registro_cabezera.url;
            }

            info_proyecto.url_cabezera = url_cabezera;

            //----------------------------------------------------

            info_proyecto.codigo_proyecto = codigo_proyecto;

            var aux_cabezera = {
                codigo_objetivo: codigo_proyecto,
                tipo: "proyecto",
                lado: "administrador",
            };

            info_proyecto.es_proyecto = true; // para menu navegacion comprimido

            var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
            info_proyecto.cabezera_adm = cabezera_adm;

            var pie_pagina = await pie_pagina_adm();
            info_proyecto.pie_pagina_adm = pie_pagina;

            if (tipo_ventana_proyecto == "descripcion") {
                var contenido_proyecto = await proyecto_descripcion(codigo_proyecto);
                info_proyecto.descripcion_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;
                // ------- Para verificación -------

                //console.log("los datos para renderizar la DESCRIPCION DEL PROYECTO");
                //console.log(info_proyecto);

                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "imagenes") {
                var contenido_proyecto = await proyecto_imagenes(codigo_proyecto);
                info_proyecto.imagenes_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;
                // ------- Para verificación -------
                //console.log("los datos info de PROYECTO son");
                //console.log(info_proyecto);
                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "documentos") {
                var contenido_proyecto = await proyecto_documentos(codigo_proyecto);
                info_proyecto.documentos_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;

                // ------- Para verificación -------
                //console.log("la info del proyecto en pestaña de DOCUMENTOS");
                //console.log(info_proyecto);
                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "inmuebles") {
                let contenido_proyecto = await proyecto_inmuebles(codigo_proyecto);
                info_proyecto.inmuebles_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;

                //estado_terreno: { type: String, default: "guardado" }, // guardado, reserva, pago, aprobacion, construccion, construido
                //--------------------------------------------------------------
                info_proyecto.estado_py_todos = true; // para mostrar todos en boton radio opciones

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
                            info_proyecto.estado_py_reserva = true;
                        }
                        if (registro_terreno.estado_terreno == "aprobacion") {
                            info_proyecto.estado_py_aprobacion = true;
                        }
                        if (registro_terreno.estado_terreno == "pago") {
                            info_proyecto.estado_py_pago = true;
                        }
                        if (registro_terreno.estado_terreno == "construccion") {
                            info_proyecto.estado_py_construccion = true;
                        }
                        if (registro_terreno.estado_terreno == "construido") {
                            info_proyecto.estado_py_construido = true;
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
                    info_proyecto.tipo_py_edificio = true;
                }
                if (aux_proyecto.tipo_proyecto == "condominio") {
                    info_proyecto.tipo_py_edificio = false;
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
                    info_proyecto.badge_todos = true;
                } else {
                    info_proyecto.badge_todos = false;
                }

                if (aux_n_disponible > 0) {
                    info_proyecto.badge_disponible = true;
                } else {
                    info_proyecto.badge_disponible = false;
                }

                if (aux_n_reservado > 0) {
                    info_proyecto.badge_reservado = true;
                } else {
                    info_proyecto.badge_reservado = false;
                }

                if (aux_n_pendiente_aprobacion > 0) {
                    info_proyecto.badge_pendiente_aprobacion = true;
                } else {
                    info_proyecto.badge_pendiente_aprobacion = false;
                }

                if (aux_n_pendiente_pago > 0) {
                    info_proyecto.badge_pendiente_pago = true;
                } else {
                    info_proyecto.badge_pendiente_pago = false;
                }

                if (aux_n_pagado_pago > 0) {
                    info_proyecto.badge_pagado_pago = true;
                } else {
                    info_proyecto.badge_pagado_pago = false;
                }

                if (aux_n_en_pago > 0) {
                    info_proyecto.badge_en_pago = true;
                } else {
                    info_proyecto.badge_en_pago = false;
                }

                if (aux_n_remate > 0) {
                    info_proyecto.badge_remate = true;
                } else {
                    info_proyecto.badge_remate = false;
                }

                if (aux_n_completado > 0) {
                    info_proyecto.badge_completado = true;
                } else {
                    info_proyecto.badge_completado = false;
                }

                //-----------------------------------------------

                info_proyecto.n_todos = aux_n_todos;
                info_proyecto.n_disponible = aux_n_disponible;
                info_proyecto.n_reservado = aux_n_reservado;
                info_proyecto.n_pendiente_aprobacion = aux_n_pendiente_aprobacion;
                info_proyecto.n_pendiente_pago = aux_n_pendiente_pago;
                info_proyecto.n_pagado_pago = aux_n_pagado_pago;
                info_proyecto.n_en_pago = aux_n_en_pago;
                info_proyecto.n_remate = aux_n_remate;
                info_proyecto.n_completado = aux_n_completado;

                //--------------------------------------------------------------

                // ------- Para verificación -------
                //console.log("los inmuebles de proyecto son ");
                //console.log(info_proyecto);

                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "sociedad") {
                var contenido_proyecto = await proyecto_sociedad(codigo_proyecto);
                info_proyecto.sociedad_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;
                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "empleos") {
                var contenido_proyecto = await proyecto_empleos(codigo_proyecto);
                info_proyecto.empleos_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;
                // ------- Para verificación -------
                //console.log("los datos de empleos");
                //console.log(info_proyecto);
                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "requerimientos") {
                var contenido_proyecto = await proyecto_requerimientos(codigo_proyecto);
                info_proyecto.requerimientos_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;
                // ------- Para verificación -------
                //console.log("los datos de requerimientos");
                //console.log(info_proyecto);
                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "estados") {
                var contenido_proyecto = await proyecto_estados(codigo_proyecto);
                info_proyecto.estados_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;
                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "textos") {
                var contenido_proyecto = await proyecto_textos(codigo_proyecto);
                info_proyecto.textos_proyecto = true; // para pestaña y ventana apropiada para proyecto
                info_proyecto.contenido_proyecto = contenido_proyecto;
                res.render("adm_proyecto", info_proyecto);
            }

            if (tipo_ventana_proyecto == "eliminar") {
                info_proyecto.eliminar_proyecto = true; // para pestaña y ventana apropiada para proyecto
                // ------- Para verificación -------
                //console.log("LA PUTA ELIMINACIN DEL PROYECTO");
                //console.log(info_proyecto);
                res.render("adm_proyecto", info_proyecto);
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN PROYECTO INEXISTENTE.
            res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------

async function proyecto_descripcion(codigo_proyecto) {
    try {
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
                dormitorios: 1,
                banos: 1,
                garajes: 1,
                trafico: 1,
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

                link_youtube_proyecto: 1,
                link_instagram_proyecto: 1,
                link_facebook_proyecto: 1,
                link_tiktok_proyecto: 1,

                contructora_dolar_m2_1: 1,
                contructora_dolar_m2_2: 1,
                contructora_dolar_m2_3: 1,
                volterra_dolar_m2: 1,
                presupuesto_proyecto: 1,

                _id: 0,
            }
        );

        if (registro_proyecto) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_proyecto);

            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            // capitales del proyecto
            var resultado_capitales = await proyecto_info_cd(codigo_proyecto);
            aux_objeto.meta = resultado_capitales.meta;
            aux_objeto.financiado = resultado_capitales.financiado_num;
            aux_objeto.porcentaje = resultado_capitales.porcentaje;

            return aux_objeto;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function proyecto_imagenes(codigo_proyecto) {
    try {
        // EXTRAEMOS "TODAS LA IMAGENES DEL PROYECTO" (incluida las que son de RESPONSABILIDAD SOCIAL)

        var aux_proyectoImagenes = await indiceImagenesProyecto.find(
            {
                codigo_proyecto: codigo_proyecto,
                imagen_respon_social: false, // solo imagenes no responsabilidad social
            },
            { _id: 0 }
        );

        // conversion del documento MONGO ([ARRAY]) a "string"
        var aux_string = JSON.stringify(aux_proyectoImagenes);
        // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
        var proyectoImagenes = JSON.parse(aux_string);

        //-------------------------------------------------------------------------------
        // RECONSTRUIMOS LOS DATOS DE LAS IMAGENES DEL PROYECTO

        // array  donde estara la imagen principal que forman parte del propio proyecto
        // aunque solo sera una sola, aun asi lo pondremos en una [ ]
        var imagenesProyectoPrincipal = [];

        // array donde estaran las imagenes que forman parte del propio proyecto
        var imagenesProyectoExclusiva = [];

        var imagenesProyectoOtros = [];

        if (proyectoImagenes.length > 0) {
            // Empezamos a contar desde "-1", para que asi sea mas facil recorrerlo con el for
            var i_proyectoPrincipal = -1;
            var i_proyectoExclusiva = -1;
            var i_proyectoOtros = -1;

            for (i = 0; i < proyectoImagenes.length; i++) {
                // revision si la "imagen for" es una imagen principal del proyecto

                let arrayPrincipalesFor = proyectoImagenes[i].parte_principal;

                // buscamos en este "arrayPrincipalesFor" si existe el codigo del proyecto (buscando la posicion que este ocupa en el presente ARRAY)
                let pocisionExiste = arrayPrincipalesFor.indexOf(codigo_proyecto);

                if (pocisionExiste != -1) {
                    // si el codigo del proyecto figura en este ARRAY, significa que la presente imagen for, es la imagen principal del proyecto

                    // incrementamos en +1 la pocision para construir el ARRAY
                    i_proyectoPrincipal = i_proyectoPrincipal + 1;
                    // llenamos el objeto con los valores de la imagen que corresponda "i"
                    imagenesProyectoPrincipal[i_proyectoPrincipal] = {
                        codigo_proyecto: proyectoImagenes[i].codigo_proyecto,
                        nombre_imagen: proyectoImagenes[i].nombre_imagen,
                        codigo_imagen: proyectoImagenes[i].codigo_imagen, // sin extension
                        extension_imagen: proyectoImagenes[i].extension_imagen,
                        url: proyectoImagenes[i].url,
                    };
                } else {
                    // si la imagen no es "principal" para el proyecto,
                    // entonces revisamos si es una "exclusiva" del proyecto
                    let arrayExclusivasFor = proyectoImagenes[i].parte_exclusiva;

                    // buscamos en este "arrayExclusivasFor" si existe el codigo del proyecto (buscando la posicion que este ocupa en el presente ARRAY)
                    let pocisionExiste = arrayExclusivasFor.indexOf(codigo_proyecto);

                    if (pocisionExiste != -1) {
                        // si el codigo del proyecto figura en este ARRAY, significa que la presente imagen for, es una imagen exclusiva del proyecto

                        // incrementamos en +1 la pocision para construir el ARRAY
                        i_proyectoExclusiva = i_proyectoExclusiva + 1;
                        // llenamos el objeto con los valores de la imagen que corresponda "i"
                        imagenesProyectoExclusiva[i_proyectoExclusiva] = {
                            codigo_proyecto: proyectoImagenes[i].codigo_proyecto,
                            nombre_imagen: proyectoImagenes[i].nombre_imagen,
                            codigo_imagen: proyectoImagenes[i].codigo_imagen, // sin extension
                            extension_imagen: proyectoImagenes[i].extension_imagen,
                            url: proyectoImagenes[i].url,
                        };
                    } else {
                        // si la imagen NO es "principal", NO es "exclusiva", entonces es "OTROS" para el proyecto,

                        // incrementamos en +1 la pocision para construir el ARRAY
                        i_proyectoOtros = i_proyectoOtros + 1;

                        // llenamos el objeto con los valores de la imagen que corresponda "i"
                        imagenesProyectoOtros[i_proyectoOtros] = {
                            codigo_proyecto: proyectoImagenes[i].codigo_proyecto,
                            nombre_imagen: proyectoImagenes[i].nombre_imagen,
                            codigo_imagen: proyectoImagenes[i].codigo_imagen, // sin extension
                            extension_imagen: proyectoImagenes[i].extension_imagen,
                            url: proyectoImagenes[i].url,
                        };
                    }
                }
            }
        }
        var contenido_img_py = {};
        contenido_img_py.imagenesDelProyecto_principal = imagenesProyectoPrincipal;
        contenido_img_py.imagenesDelProyecto_exclusiva = imagenesProyectoExclusiva;
        contenido_img_py.imagenesDelProyecto_otros = imagenesProyectoOtros;

        return contenido_img_py;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function proyecto_documentos(codigo_proyecto) {
    try {
        var proyectoDocumentos = await indiceDocumentos.find(
            {
                codigo_proyecto: codigo_proyecto,
            },
            {
                codigo_proyecto: 1,
                nombre_documento: 1,
                codigo_documento: 1,
                clase_documento: 1,
                url: 1,
                _id: 0,
            }
        );

        var existenDocumentos = proyectoDocumentos.length;

        if (existenDocumentos > 0) {
            // para armar el ARRAY que contendra solo los datos necesarios de los documentos del PROYECTO
            // todos los documentos del proyecto son PUBLICOS, por tanto no es necesario especificar "publico o privado"

            // conversion del documento MONGO ([ARRAY]) a "string"
            var aux_string = JSON.stringify(proyectoDocumentos);
            // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
            var contenido_doc_py = JSON.parse(aux_string);
            return contenido_doc_py;
        } else {
            // OJO NO FUNCIONA SE ES CON "const, let" SOLO FUNCIONA CON "var o vacio"
            var contenido_doc_py = [];
            return contenido_doc_py;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function proyecto_inmuebles(codigo_proyecto) {
    try {
        // ordenamos por numero de piso (de menor a mayor, por ello se escribio "1")
        // Al parecer si el dato "piso" estubiera dentro de un objero EJ/ "descripcion_inmueble", tambien funcionaria como se lo declara aqui
        var inmuebles_py = await indiceInmueble
            .find(
                { codigo_proyecto: codigo_proyecto },
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
                    codigo_usuario: "ninguno", // porque es desde el lado del ADMINISTRADOR
                    laapirest: "/laapirest/", // por partir desde el lado del ADMINISTRADOR
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

//------------------------------------------------------------------
async function proyecto_sociedad(codigo_proyecto) {
    try {
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                beneficiario_rs: 1,
                descripcion_rs: 1,
                monto_dinero_rs: 1,
                link_youtube_rs: 1,
                fecha_entrega_rs: 1,
                tabla_rs_proyecto: 1,
                existe_rs: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            // conversion del documento MONGO ({objeto}) a "string"
            var aux_string = JSON.stringify(registro_proyecto);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            if (aux_objeto.fecha_entrega_rs) {
                let arrayFecha = aux_objeto.fecha_entrega_rs.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_entrega_rs = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_entrega_rs = "";
            }

            var imagenes_py_rs = await indiceImagenesProyecto.find(
                {
                    codigo_proyecto: codigo_proyecto,
                    imagen_respon_social: true, // solo imagenes DE responsabilidad social
                },
                { _id: 0 }
            );

            if (imagenes_py_rs.length > 0) {
                // conversion del documento MONGO ([ARRAY]) a "string"
                var aux_string_2 = JSON.stringify(imagenes_py_rs);
                // reconversion del "string" a "objeto"
                var aux_objeto_2 = JSON.parse(aux_string_2);

                aux_objeto.imagenes_py_rs = aux_objeto_2;

                return aux_objeto;
            } else {
                aux_objeto.imagenes_py_rs = [];

                return aux_objeto;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------
async function proyecto_empleos(codigo_proyecto) {
    try {
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                descripcion_empleo: 1,
                tabla_empleos_sociedad: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            // conversion del documento MONGO ({objeto}) a "string"
            var aux_string = JSON.stringify(registro_proyecto);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            return aux_objeto;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------
async function proyecto_requerimientos(codigo_proyecto) {
    try {
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                nota_no_requerimientos: 1,
                nota_si_requerimientos: 1,
                existe_requerimientos: 1, // false || true
                _id: 0,
            }
        );

        if (registro_proyecto) {
            // conversion del documento MONGO ({objeto}) a "string"
            var aux_string = JSON.stringify(registro_proyecto);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            // recoleccion de requerimientos del proyecto, ordenados del mas reciente al mas antiguo
            const registro_requerimientos = await indiceRequerimientos
                .find(
                    { codigo_proyecto: codigo_proyecto },
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

                // conversion de formato de fecha a ej/ domingo 28 Junio de 2023
                moment.locale("es");

                // añadiendo el numero de indice a cada requerimiento para la tabla y con la fecha en formato español
                for (let i = 0; i < aux_objeto_requeri.length; i++) {
                    aux_objeto_requeri[i].indice = i + 1;

                    let aux_fecha = moment(aux_objeto_requeri[i].fecha).format("LL"); // muestra solo fecha español
                    aux_objeto_requeri[i].fecha = aux_fecha;
                }

                aux_objeto.num_requerimientos = aux_objeto_requeri.length;
                aux_objeto.n_requerimientos = "( " + aux_objeto_requeri.length + " )";
                aux_objeto.tabla_requerimientos = aux_objeto_requeri;
            } else {
                aux_objeto.num_requerimientos = 0;
                aux_objeto.n_requerimientos = "( 0 )";
                aux_objeto.tabla_requerimientos = []; // un array vacio
            }

            return aux_objeto;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------
async function proyecto_estados(codigo_proyecto) {
    try {
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                estado_proyecto: 1,
                proyecto_ganador: 1,
                visible: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            // conversion del documento MONGO ({objeto}) a "string"
            var aux_string = JSON.stringify(registro_proyecto);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            if (aux_objeto.estado_proyecto == "guardado") {
                var texto_estado = "Guardado";
            }
            if (aux_objeto.estado_proyecto == "completado") {
                var texto_estado = "Completado";
            }

            aux_objeto.texto_estado_proyecto = texto_estado;
            return aux_objeto;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
//------------------------------------------------------------------
async function proyecto_textos(codigo_proyecto) {
    try {
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                titulo_construccion_py: 1,
                texto_construccion_py: 1,
                nota_construccion_py: 1,
                titulo_plusvalia_py: 1,
                texto_plusvalia_py: 1,
                nota_plusvalia_py: 1,
                titulo_economico_py: 1,
                texto_economico_py: 1,
                nota_economico_py: 1,
                titulo_construccion_inm: 1,
                texto_construccion_inm: 1,
                nota_construccion_inm: 1,
                titulo_precio_inm: 1,
                texto_precio_inm: 1,
                titulo_plusvalia_inm: 1,
                texto_plusvalia_inm: 1,
                titulo_economico_inm: 1,
                texto_economico_inm: 1,
                nota_economico_inm: 1,
                mensaje_segundero_py_inm_a: 1,
                mensaje_segundero_py_inm_b: 1,
                nota_precio_justo: 1,
                _id: 0,
            }
        );

        if (registro_proyecto) {
            // conversion del documento MONGO ({objeto}) a "string"
            var aux_string = JSON.stringify(registro_proyecto);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            return aux_objeto;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
//------------------------------------------------------------------

//------------------------------------------------------------------

/************************************************************************************ */
/************************************************************************************ */
// PARA GUARDAR LOS DATOS DE FORMULARIO DEL PROYECTO

controladorAdmProyecto.guardarDatosProyecto = async (req, res) => {
    // **OK
    // viene de la ruta   POST   '/laapirest/proyecto/:codigo_proyecto/accion/guardar_descripcion'
    // OJO que del ajax viene como    url: "/laapirest/proyecto/"+codigo_proyecto+"/accion/guardar_descripcion
    // ------- Para verificación -------
    //console.log("ESTAMOS EN GUARDAR DATOS FORMULARIO INICIAL DEL PROYECTO");

    try {
        const codigoProyecto = req.params.codigo_proyecto; // "codigo_proyecto" respetando el nombre como esta puesto en la ruta ( /:codigo_proyecto )

        const proyectoEncontrado = await indiceProyecto.findOne({
            codigo_proyecto: codigoProyecto,
        });

        if (proyectoEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                proyectoEncontrado.nombre_proyecto = req.body.nombre_proyecto;
                proyectoEncontrado.meses_construccion = req.body.meses_construccion;

                proyectoEncontrado.fecha_guardado = new Date(); // fecha del momento en que se esta guardando el proyecto

                /*********************************** */
                // GARANTIAS DEL PROYECTO
                proyectoEncontrado.titulo_garantia_1 = req.body.titulo_garantia_1;
                proyectoEncontrado.garantia_1 = req.body.garantia_1;
                proyectoEncontrado.titulo_garantia_2 = req.body.titulo_garantia_2;
                proyectoEncontrado.garantia_2 = req.body.garantia_2;
                proyectoEncontrado.titulo_garantia_3 = req.body.titulo_garantia_3;
                proyectoEncontrado.garantia_3 = req.body.garantia_3;

                /*********************************** */
                // TIPO PROYECTO
                proyectoEncontrado.tipo_proyecto = req.body.tipo_proyecto; // edificio || condominio

                /*********************************** */
                // DESCRIPCION DEL PROYECTO
                proyectoEncontrado.total_departamentos = req.body.total_departamentos;
                proyectoEncontrado.total_oficinas = req.body.total_oficinas;
                proyectoEncontrado.total_comerciales = req.body.total_comerciales;
                proyectoEncontrado.total_casas = req.body.total_casas;
                proyectoEncontrado.trafico = req.body.trafico;
                //proyectoEncontrado.dormitorios = req.body.dormitorios;
                //proyectoEncontrado.banos = req.body.banos;
                proyectoEncontrado.garajes = req.body.garajes;
                proyectoEncontrado.terreno = req.body.terreno;
                proyectoEncontrado.area_construida = req.body.area_construida;
                proyectoEncontrado.proyecto_descripcion = req.body.proyecto_descripcion;
                proyectoEncontrado.penalizacion = req.body.penalizacion;

                /**--------------- */
                proyectoEncontrado.titulo_otros_1 = req.body.titulo_otros_1;
                proyectoEncontrado.otros_1 = req.body.otros_1;

                /**--------------- */
                proyectoEncontrado.titulo_otros_2 = req.body.titulo_otros_2;
                proyectoEncontrado.otros_2 = req.body.otros_2;

                /**--------------- */
                proyectoEncontrado.titulo_otros_3 = req.body.titulo_otros_3;
                proyectoEncontrado.otros_3 = req.body.otros_3;
                /**--------------- */

                proyectoEncontrado.acabados = req.body.acabados;

                /*********************************** */
                // SOCIALES PROYECTO
                proyectoEncontrado.link_youtube_proyecto = req.body.link_youtube_proyecto;
                proyectoEncontrado.link_facebook_proyecto = req.body.link_facebook_proyecto;
                proyectoEncontrado.link_instagram_proyecto = req.body.link_instagram_proyecto;
                proyectoEncontrado.link_tiktok_proyecto = req.body.link_tiktok_proyecto;

                /*********************************** */
                // INFORMACION ECONOMICA
                proyectoEncontrado.contructora_dolar_m2_1 = req.body.contructora_dolar_m2_1;
                proyectoEncontrado.contructora_dolar_m2_2 = req.body.contructora_dolar_m2_2;
                proyectoEncontrado.contructora_dolar_m2_3 = req.body.contructora_dolar_m2_3;

                proyectoEncontrado.volterra_dolar_m2 = req.body.volterra_dolar_m2;

                /*********************************** */
                // LOS DATOS LLENADOS EN EL FORMULARIO, SERAN GUARDADOS EN LA BASE DE DATOS
                await proyectoEncontrado.save();

                //------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "Guarda descripción proyecto " + codigoProyecto;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
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

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA GUARDAR ESTADO DEL PROYECTO

controladorAdmProyecto.guardarEstadoProyecto = async (req, res) => {
    // **OK
    // ruta   POST  "/laapirest/proyecto/:codigo_proyecto/accion/guardar_estado_proyecto"

    try {
        const codigoProyecto = req.params.codigo_proyecto;
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (registro_proyecto) {
            var acceso = await verificadorTerrenoBloqueado(registro_proyecto.codigo_terreno);
            if (acceso == "permitido") {
                await indiceProyecto.updateOne(
                    { codigo_proyecto: codigoProyecto },
                    { $set: { estado_proyecto: req.body.nuevo_estado } }
                ); // guardamos el registro con el dato modificado

                if (req.body.nuevo_estado == "guardado") {
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigoProyecto },
                        { $set: { fecha_creacion: new Date() } }
                    ); // guardamos la fecha de guardado del proyeto
                }

                // con "updateOne" aun usando "{ multi: true }" solo cambia al primero que encuentre, los demas NO, usando "update" cambian TODOS los inmuebles que pertenecen a este proyecto, pero mongo manda un mensaje diciendo:
                // (node:2304) DeprecationWarning: collection.update is deprecated. Use updateOne, updateMany, or bulkWrite instead.
                /// if (req.body.nuevo_estado == 'construccion' || req.body.nuevo_estado == 'construido') {// no se considerara a "construido" porque pueda que en el estado de "construccion" existan inmuebles que hayan podido ser vendidos

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador =
                    "Guarda estado proyecto " + codigoProyecto + " a " + req.body.nuevo_estado;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
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

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA GUARDAR ELECCION DEL PROYECTO

controladorAdmProyecto.guardarEleccionProyecto = async (req, res) => {
    // **OK
    // ruta   POST  "/laapirest/proyecto/:codigo_proyecto/accion/guardar_estado_proyecto"

    try {
        const codigoProyecto = req.params.codigo_proyecto;
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (registro_proyecto) {
            var acceso = await verificadorTerrenoBloqueado(registro_proyecto.codigo_terreno);
            if (acceso == "permitido") {
                if (req.body.casilla_check == "true") {
                    // todos proyectos que puede tener el terreno, pasaran a "false", devido a que solo puede existir un proyecto ganador como "true"
                    await indiceProyecto.updateMany(
                        //  REVISAR ESTE "updateMany"
                        { codigo_terreno: registro_proyecto.codigo_terreno },
                        { $set: { proyecto_ganador: false } }
                    );

                    // ahora solo cambiamos a "true" el proyecto ganador seleccionado
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigoProyecto },
                        { $set: { proyecto_ganador: true } }
                    ); // guardamos el registro con el dato modificado

                    var accion_administrador =
                        "Proyecto " + codigoProyecto + " seleccionado como ganador";
                }

                if (req.body.casilla_check == "false") {
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigoProyecto },
                        { $set: { proyecto_ganador: false } }
                    ); // guardamos el registro con el dato modificado
                    var accion_administrador =
                        "Proyecto " + codigoProyecto + " DE-seleccionado como ganador";
                }

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
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

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA GUARDAR VISIBILIDAD DEL PROYECTO

controladorAdmProyecto.guardarVisibilidadProyecto = async (req, res) => {
    // **OK
    // ruta   POST  "/laapirest/proyecto/:codigo_proyecto/accion/guardar_visibilidad_proyecto"

    try {
        const codigoProyecto = req.params.codigo_proyecto;
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (registro_proyecto) {
            var acceso = await verificadorTerrenoBloqueado(registro_proyecto.codigo_terreno);
            if (acceso == "permitido") {
                if (req.body.casilla_check == "true") {
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigoProyecto },
                        { $set: { visible: true } }
                    ); // guardamos el registro con el dato modificado

                    var accion_administrador = "Proyecto " + codigoProyecto + " seleccionado a VISIBLE";
                }

                if (req.body.casilla_check == "false") {
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigoProyecto },
                        { $set: { visible: false } }
                    ); // guardamos el registro con el dato modificado
                    var accion_administrador =
                        "Proyecto " + codigoProyecto + " seleccionado a INVISIBLE";
                }

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
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

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA ELIMINAR PROYECTO

controladorAdmProyecto.eliminarProyecto = async (req, res) => {
    // ruta   delete  '"/laapirest/proyecto/:codigo_proyecto/accion/eliminar_proyecto"
    try {
        const codigo_proyecto = req.params.codigo_proyecto;

        const proyectoEncontrado = await indiceProyecto.findOne({
            codigo_proyecto: codigo_proyecto,
        });

        if (proyectoEncontrado) {
            const usuario_maestro = req.body.usuario_maestro;
            const clave_maestro = req.body.clave_maestro;
            var paquete_datos = {
                usuario_maestro,
                clave_maestro,
            };
            var llaves_maestras = await verificadorLlavesMaestras(paquete_datos);
            if (llaves_maestras) {
                var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
                if (acceso == "permitido") {
                    // todos seran ejecutados al mismo tiempo (de manera paralela, para ello se hace uso de PROMISE.ALL)
                    var resultadoEliminador = await Promise.all([
                        eliminadorImagenesProyecto(codigo_proyecto),
                        eliminadorDocumentosProyecto(codigo_proyecto),
                        eliminadorInmGuarInvProyecto(codigo_proyecto),
                        eliminadorRequerimientoProyecto(codigo_proyecto),
                    ]);

                    if (
                        resultadoEliminador[0] == "ok" &&
                        resultadoEliminador[1] == "ok" &&
                        resultadoEliminador[2] == "ok" &&
                        resultadoEliminador[3] == "ok"
                    ) {
                        // si todos fueron eliminados satisfactoriamente
                        // AQUI RECIEN SE ELIMINARA EL PROYECTO DE LA BASE DE DATOS
                        //await proyectoEncontrado.remove(); // eliminamos para no tener problemas con la caducidad de remove
                        await indiceProyecto.deleteOne({ codigo_proyecto: codigo_proyecto });

                        //------------------------------------------------------
                        // actualizacion de "anteproyectos_registrados" y "convocatoria_disponible" de terreno
                        var aux_proyectos_terreno = await indiceProyecto.find(
                            { codigo_terreno: proyectoEncontrado.codigo_terreno },
                            { codigo_terreno: 1, _id: 0 }
                        );

                        if (aux_proyectos_terreno.length > 0) {
                            var aux_terreno = await indiceTerreno.findOne(
                                { codigo_terreno: proyectoEncontrado.codigo_terreno },
                                { anteproyectos_maximo: 1, _id: 0 }
                            );
                            if (aux_terreno) {
                                // actualizamos el numero total de anteproyectos registrados que tiene este terreno
                                await indiceTerreno.updateOne(
                                    { codigo_terreno: proyectoEncontrado.codigo_terreno },
                                    {
                                        $set: {
                                            anteproyectos_registrados: aux_proyectos_terreno.length,
                                        },
                                    }
                                ); // guardamos el registro con el dato modificado

                                // como el anteproyecto fue eliminado, entonces se cambia su propiedad "convocatoria_disponible" a true

                                await indiceTerreno.updateOne(
                                    { codigo_terreno: proyectoEncontrado.codigo_terreno },
                                    { $set: { convocatoria_disponible: true } }
                                ); // guardamos el registro con el dato modificado
                            }
                        }

                        //-------------------------------------------------------------------
                        // guardamos en el historial de acciones
                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var accion_administrador = "Elimina proyecto " + codigo_proyecto;
                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //-------------------------------------------------------------------

                        res.json({
                            exito: "si",
                        });
                    }
                } else {
                    // si el acceso es denegado
                    res.json({
                        exito: "denegado",
                        mensaje:
                            "El Terreno del proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios",
                    });
                }
            } else {
                res.json({
                    exito: "no_maestro",
                    mensaje: "Datos de acceso MAESTRO incorrectos",
                });
            }
        } else {
            res.json({
                exito: "no",
                mensaje: "Proyecto No encontrado, por favor refresque la ventana e intentelo nuevamente",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//-----------------------------------------------------------------
async function eliminadorImagenesProyecto(codigo_proyecto) {
    try {
        const registroImagenesProyecto = await indiceImagenesProyecto.find({
            codigo_proyecto: codigo_proyecto,
        });

        if (registroImagenesProyecto) {

            const storage = getStorage();

            // eliminamos los ARCHIVOS IMAGEN uno por uno
            for (let i = 0; i < registroImagenesProyecto.length; i++) {

                /*
                let imagenNombreExtension =
                    registroImagenesProyecto[i].codigo_imagen +
                    registroImagenesProyecto[i].extension_imagen;
                // eliminamos el ARCHIVO IMAGEN DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + imagenNombreExtension)); // "+" es para concatenar
                */

                //--------------------------------------------------

                //const storage = getStorage();

                var nombre_y_ext = registroImagenesProyecto[i].codigo_imagen +
                registroImagenesProyecto[i].extension_imagen;

                // para encontrar en la carpeta "subido" en firebase con el nombre y la extension de la imagen incluida
                var direccionActualImagen = "subido/" + nombre_y_ext;

                // Crear una referencia al archivo que se eliminará
                var desertRef = ref(storage, direccionActualImagen);

                // Eliminar el archivo y esperar la promesa
                await deleteObject(desertRef);

                // Archivo eliminado con éxito
                //console.log("Archivo eliminado DE FIREBASE con éxito");

                //--------------------------------------------------

            }
            // luego de eliminar todos los ARCHIVOS IMAGEN, procedemos a ELIMINARLO DE LA BASE DE DATOS
            //await indiceImagenesProyecto.remove({ codigo_proyecto: codigo_proyecto });
            await indiceImagenesProyecto.deleteMany({ codigo_proyecto: codigo_proyecto }); // "deleteMany" para que elimine TODOS los que coinciden con la condicion de: codigo_proyecto: codigo_proyecto
        }
        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------
async function eliminadorDocumentosProyecto(codigo_proyecto) {
    try {
        const registroDocumentosProyecto = await indiceDocumentos.find({
            codigo_proyecto: codigo_proyecto,
        });

        if (registroDocumentosProyecto) {

            const storage = getStorage();

            // eliminamos los ARCHIVOS DOCUMENTOS PDF uno por uno (sean publicos o privados)
            for (let i = 0; i < registroDocumentosProyecto.length; i++) {

                /*
                let documentoNombreExtension = registroDocumentosProyecto[i].codigo_documento + ".pdf";
                // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + documentoNombreExtension)); // "+" es para concatenar
                */

                //--------------------------------------------------

                //const storage = getStorage();

                var nombre_y_ext = registroDocumentosProyecto[i].codigo_documento + ".pdf";

                // para encontrar en la carpeta "subido" en firebase con el nombre y la extension de la imagen incluida
                var direccionActualImagen = "subido/" + nombre_y_ext;

                // Crear una referencia al archivo que se eliminará
                var desertRef = ref(storage, direccionActualImagen);

                // Eliminar el archivo y esperar la promesa
                await deleteObject(desertRef);

                // Archivo eliminado con éxito
                //console.log("Archivo eliminado DE FIREBASE con éxito");

                //--------------------------------------------------
            }
            // luego de eliminar todos los ARCHIVOS DOCUMENTO, procedemos a ELIMINARLO DE LA BASE DE DATOS
            //await indiceDocumentos.remove({ codigo_proyecto: codigo_proyecto }); no usamos esto porque no deseamos tener problemas con la caducidad de remove
            await indiceDocumentos.deleteMany({ codigo_proyecto: codigo_proyecto }); // "deleteMany" para que elimine TODOS los que coinciden con la condicion de: codigo_proyecto: codigo_proyecto
        }
        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------
async function eliminadorInmGuarInvProyecto(codigo_proyecto) {
    try {
        // no usamos remove para no tener problemas con su caducidad, en lugar de ello usamos "deleteMany" para que elimine a TODOS los que coinciden con la condicion de: codigo_proyecto: codigo_proyecto
        // await indiceInmueble.remove({ codigo_proyecto: codigo_proyecto });
        // await indiceGuardados.remove({ codigo_proyecto: codigo_proyecto });
        // await indiceInversiones.remove({ codigo_proyecto: codigo_proyecto });

        await indiceInmueble.deleteMany({ codigo_proyecto: codigo_proyecto });
        await indiceGuardados.deleteMany({ codigo_proyecto: codigo_proyecto });
        await indiceInversiones.deleteMany({ codigo_proyecto: codigo_proyecto });

        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------
async function eliminadorRequerimientoProyecto(codigo_proyecto) {
    try {
        await indiceRequerimientos.deleteMany({ codigo_proyecto: codigo_proyecto });

        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA GUARDAR FORMULARIO RESPONSABILIDAD SOCIAL DEL PROYECTO

controladorAdmProyecto.guardarFormularioRs = async (req, res) => {
    // viene de la ruta   POST   "/laapirest/proyecto/:codigo_proyecto/accion/guardar_form_rs"

    try {
        //---------------------------------------------
        const codigoProyecto = req.params.codigo_proyecto; // "codigo_proyecto" respetando el nombre como esta puesto en la ruta ( /:codigo_proyecto )

        var proyectoEncontrado = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (proyectoEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                // aqui respetando el nombre "name" que se le puso en el HTML a ese INPUT
                proyectoEncontrado.beneficiario_rs = req.body.beneficiario_rs;
                proyectoEncontrado.descripcion_rs = req.body.descripcion_rs;
                proyectoEncontrado.monto_dinero_rs = req.body.monto_dinero_rs;
                proyectoEncontrado.link_youtube_rs = req.body.link_youtube_rs;
                proyectoEncontrado.fecha_entrega_rs = req.body.fecha_entrega_rs;

                if (req.body.visibilidad_rs == "true") {
                    // PARA HACER VISIBLE RESPONSABILIDAD SOCIAL
                    proyectoEncontrado.existe_rs = true;
                } else {
                    if (req.body.visibilidad_rs == "false") {
                        // PARA OCULTAR RESPONSABILIDAD SOCIAL
                        proyectoEncontrado.existe_rs = false;
                    }
                }

                await proyectoEncontrado.save();

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "Guarda formulario RS de proyecto " + codigoProyecto;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
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

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA GUARDAR FORMULARIO EMPLEOS DEL PROYECTO

controladorAdmProyecto.guardarFormularioEmpleos = async (req, res) => {
    // viene de la ruta   POST   "/laapirest/proyecto/:codigo_proyecto/accion/guardar_form_empleos"

    try {
        const codigoProyecto = req.params.codigo_proyecto; // "codigo_proyecto" respetando el nombre como esta puesto en la ruta ( /:codigo_proyecto )

        var proyectoEncontrado = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (proyectoEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                // aqui respetando el nombre "name" que se le puso en el HTML a ese INPUT
                proyectoEncontrado.descripcion_empleo = req.body.descripcion_empleo;
                //proyectoEncontrado.moneda_empleo = req.body.moneda_empleo;

                await proyectoEncontrado.save();

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "guarda formulario EMPLEO de proyecto " + codigoProyecto;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };

                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTROLADOR PARA GUARDAR TEXTOS-PROYECTO DEL PROYECTO

controladorAdmProyecto.guardarTextosProyectoPy = async (req, res) => {
    // viene de la ruta   POST   '/laapirest/crearnuevoproyecto/guardar_textos_py/proyecto'

    try {
        const codigoProyecto = req.body.codigo_proyecto_py_html;

        var proyectoEncontrado = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (proyectoEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                // sie es FALSE, significa que el proyecto esta DESBLOQUEADO

                proyectoEncontrado.titulo_construccion_py = req.body.titulo_construccion_py_html;
                proyectoEncontrado.texto_construccion_py = req.body.texto_construccion_py_html;
                proyectoEncontrado.nota_construccion_py = req.body.nota_construccion_py_html;
                proyectoEncontrado.titulo_plusvalia_py = req.body.titulo_plusvalia_py_html;
                proyectoEncontrado.texto_plusvalia_py = req.body.texto_plusvalia_py_html;
                proyectoEncontrado.nota_plusvalia_py = req.body.nota_plusvalia_py_html;
                proyectoEncontrado.titulo_economico_py = req.body.titulo_economico_py_html;
                proyectoEncontrado.texto_economico_py = req.body.texto_economico_py_html;
                proyectoEncontrado.nota_economico_py = req.body.nota_economico_py_html;

                await proyectoEncontrado.save();

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "Guarda TEXTOS PROYECTO del proyecto " + codigoProyecto;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTROLADOR PARA GUARDAR TEXTOS-INMUEBLE DEL PROYECTO

controladorAdmProyecto.guardarTextosProyectoInm = async (req, res) => {
    // viene de la ruta   POST   '/laapirest/crearnuevoproyecto/guardar_textos_py/inmueble'

    try {
        const codigoProyecto = req.body.codigo_proyecto_inm_html;

        var proyectoEncontrado = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (proyectoEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                proyectoEncontrado.titulo_construccion_inm = req.body.titulo_construccion_inm_html;
                proyectoEncontrado.texto_construccion_inm = req.body.texto_construccion_inm_html;
                proyectoEncontrado.nota_construccion_inm = req.body.nota_construccion_inm_html;
                proyectoEncontrado.titulo_precio_inm = req.body.titulo_precio_inm_html;
                proyectoEncontrado.texto_precio_inm = req.body.texto_precio_inm_html;
                proyectoEncontrado.titulo_plusvalia_inm = req.body.titulo_plusvalia_inm_html;
                proyectoEncontrado.texto_plusvalia_inm = req.body.texto_plusvalia_inm_html;
                proyectoEncontrado.titulo_economico_inm = req.body.titulo_economico_inm_html;
                proyectoEncontrado.texto_economico_inm = req.body.texto_economico_inm_html;
                proyectoEncontrado.nota_economico_inm = req.body.nota_economico_inm_html;

                await proyectoEncontrado.save();

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "Guarda TEXTOS INMUEBLE del proyecto " + codigoProyecto;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTROLADOR PARA GUARDAR TEXTOS-SEGUNDEROS DEL PROYECTO

controladorAdmProyecto.guardarTextosSegunderosPy = async (req, res) => {
    // viene de la ruta   POST   '/laapirest/crearnuevoproyecto/guardar_textos_py/segunderos_justo'

    try {
        const codigoProyecto = req.body.codigo_proyecto_seg_html;

        var proyectoEncontrado = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (proyectoEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                proyectoEncontrado.mensaje_segundero_py_inm_a = req.body.mensaje_segundero_py_inm_a_html;
                proyectoEncontrado.mensaje_segundero_py_inm_b = req.body.mensaje_segundero_py_inm_b_html;
                proyectoEncontrado.nota_precio_justo = req.body.nota_precio_justo;

                await proyectoEncontrado.save();

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador =
                    "Guarda TEXTOS SEGUNDEROS y NOTA DE PRECIO JUSTO del proyecto " + codigoProyecto;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTROLADOR PARA GUARDAR VISIBILIDAD DE REQUERIMIENTOS DEL PROYECTO

controladorAdmProyecto.guardarVisibilidadRequerimientos = async (req, res) => {
    // ruta   POST  "/laapirest/proyecto/:codigo_proyecto/accion/guardar_visibilidad_requerimientos"

    try {
        const codigoProyecto = req.params.codigo_proyecto;
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (registro_proyecto) {
            var acceso = await verificadorTerrenoBloqueado(registro_proyecto.codigo_terreno);
            if (acceso == "permitido") {
                if (req.body.casilla_check == "true") {
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigoProyecto },
                        { $set: { existe_requerimientos: true } }
                    ); // guardamos el registro con el dato modificado

                    var accion_administrador =
                        "Proyecto " + codigoProyecto + " REQUERIMIENTOS seleccionado a VISIBLE";
                }

                if (req.body.casilla_check == "false") {
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigoProyecto },
                        { $set: { existe_requerimientos: false } }
                    ); // guardamos el registro con el dato modificado
                    var accion_administrador =
                        "Proyecto " + codigoProyecto + " REQUERIMIENTOS seleccionado a INVISIBLE";
                }

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTROLADOR PARA GUARDAR NOTA EXISTENTE REQUERIMIENTO DEL PROYECTO

controladorAdmProyecto.guardarRequerimientosExistente = async (req, res) => {
    // viene de la ruta   POST   '/laapirest/proyecto/:codigo_proyecto/accion/guardar_requerimientos_existente'

    try {
        const codigoProyecto = req.params.codigo_proyecto;

        var proyectoEncontrado = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (proyectoEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                proyectoEncontrado.nota_si_requerimientos = req.body.existente_requerimientos_html;

                await proyectoEncontrado.save();

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador =
                    "Guarda NOTA EXISTENTE REQUERIMIENTOS del proyecto " + codigoProyecto;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTROLADOR PARA GUARDAR NOTA INEXISTENTE REQUERIMIENTO DEL PROYECTO

controladorAdmProyecto.guardarRequerimientosInexistente = async (req, res) => {
    // viene de la ruta   POST   '/laapirest/proyecto/:codigo_proyecto/accion/guardar_requerimientos_inexistente'

    try {
        const codigoProyecto = req.params.codigo_proyecto;

        var proyectoEncontrado = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (proyectoEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(proyectoEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                proyectoEncontrado.nota_no_requerimientos = req.body.inexistente_requerimientos_html;

                await proyectoEncontrado.save();

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador =
                    "Guarda NOTA INEXISTENTE REQUERIMIENTOS del proyecto " + codigoProyecto;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-------------------------------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTROLADOR PARA GUARDAR REQUERIMIENTO DEL PROYECTO

controladorAdmProyecto.guardarRequerimiento = async (req, res) => {
    // ruta   POST  "/laapirest/proyecto/:codigo_proyecto/accion/guardar_requerimiento"

    try {
        const codigoProyecto = req.params.codigo_proyecto;
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1, existe_requerimientos: 1 }
        );

        if (registro_proyecto) {
            var acceso = await verificadorTerrenoBloqueado(registro_proyecto.codigo_terreno);
            if (acceso == "permitido") {
                // creamos el registro de REQUERIMIENTO en la base de datos

                funcionGuardaRequerimiento();

                async function funcionGuardaRequerimiento() {
                    // esta funcion genera el nombre alfanumerico de la imagen (ojo, sin extension)
                    var codigo_requerimiento = codigoAlfanumericoRequerimiento();

                    // revisamos en la base de datos, si el nombre de la imagen alfanumerico ya existe
                    var codigoImagenExistente = await indiceRequerimientos.find({
                        codigo_requerimiento: codigo_requerimiento,
                    });

                    // si se encuentra un requerimiento con el mismo codigo
                    if (codigoImagenExistente.length > 0) {
                        // entonces se le creara un nuevo codigo de requerimiento
                        funcionGuardaRequerimiento(); // volvemos a ejecutar la funcion nuevamente, a esto se llama FUNCION RECURSIVA.
                    } else {
                        // si el codigo de requerimiento es unico y no tiene similares, entonces

                        const registro_terreno = await indiceTerreno.findOne(
                            { codigo_terreno: registro_proyecto.codigo_terreno },
                            { ciudad: 1 }
                        );

                        const nuevo_requerimiento = new indiceRequerimientos({
                            visible: registro_proyecto.existe_requerimientos, // true o false
                            codigo_terreno: registro_proyecto.codigo_terreno,
                            codigo_proyecto: codigoProyecto,
                            codigo_requerimiento,
                            ciudad: registro_terreno.ciudad,
                            requerimiento: req.body.texto_requerimiento,
                            descripcion: req.body.texto_descripcion,
                            cantidad: req.body.texto_cantidad,
                            presupuesto_maximo: req.body.texto_presupuesto,
                            // fecha: se creara automaticamente en la BD al momento de ser creado este registro
                        });
                        // ahora guardamos en la base de datos la informacion de la imagen creada
                        await nuevo_requerimiento.save();

                        //-------------------------------------------------------------------
                        // guardamos en el historial de acciones
                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var accion_administrador =
                            "CREA REQUERIMIENTO " +
                            codigo_requerimiento +
                            " del proyecto " +
                            codigoProyecto;
                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //-------------------------------------------------------------------

                        res.json({
                            exito: "si",
                            codigo_requerimiento,
                        });
                    }
                }
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTROLADOR PARA ELIMINAR UN REQUERIMIENTO DEL PROYECTO
// DELETE: "/laapirest/proyecto/:codigo_proyecto/accion/eliminar_requerimiento"
controladorAdmProyecto.eliminarRequerimiento = async (req, res) => {
    try {
        const codigo_proyecto = req.params.codigo_proyecto;
        const codigo_requerimiento = req.body.codigo_requerimiento;

        //--------------- Verificacion ----------------
        //console.log('Estamos en eliminar requerimiento');
        //console.log(codigo_proyecto);
        //console.log(codigo_requerimiento);
        //---------------------------------------------
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto },
            { codigo_terreno: 1 }
        );

        if (registro_proyecto) {
            var acceso = await verificadorTerrenoBloqueado(registro_proyecto.codigo_terreno);

            if (acceso == "permitido") {
                var requerimientoEliminar = await indiceRequerimientos.findOne({
                    codigo_proyecto,
                    codigo_requerimiento,
                });

                if (requerimientoEliminar) {
                    // ahora eliminamos el requerimiento de la base de datos
                    // await requerimientoEliminar.remove(); // no usamos para no tener problemas con la caducidad de remove
                    await indiceRequerimientos.deleteOne({ codigo_proyecto, codigo_requerimiento });

                    //-----------------------------------------------
                    // guardamos en el historial de acciones
                    var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                    var accion_administrador = "Elimina REQUERIMIENTO " + codigo_requerimiento;
                    var aux_accion_adm = {
                        ci_administrador,
                        accion_administrador,
                    };
                    await guardarAccionAdministrador(aux_accion_adm);
                    //-----------------------------------------------

                    res.json({
                        exito: "si",
                    });
                } else {
                    res.json({
                        exito: "no",
                    });
                }
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorAdmProyecto;
