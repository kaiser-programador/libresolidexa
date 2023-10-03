const { codigoAlfanumericoInmueble } = require("../ayudas/ayudaslibreria");

const {
    indiceInmueble,
    indiceDocumentos,
    indiceProyecto,
    indice_propietario,
    indiceInversiones,
    indiceGuardados,
    indiceImagenesProyecto,
    indiceImagenesSistema,
} = require("../modelos/indicemodelo");

const {
    verificadorTerrenoBloqueado,
    guardarAccionAdministrador,
    verificadorLlavesMaestras,
} = require("../ayudas/funcionesayuda_1");

const {
    cabezeras_adm_cli,
    datos_pagos_propietario,
    pie_pagina_adm,
} = require("../ayudas/funcionesayuda_2");
const pache = require("path");

const fs = require("fs-extra");
const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");
//const { Number } = require("mongoose");

const controladorAdmInmueble = {};

/************************************************************************************** */
/************************************************************************************** */
// PARA CREAR CODIGO NUEVO DE INMUEBLE

controladorAdmInmueble.crearNuevoInmueble = async (req, res) => {
    // viene de la ruta POST:  "/laapirest/inmueble/:codigo_proyecto"

    try {
        const codigoProyecto = req.params.codigo_proyecto;
        const registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigoProyecto },
            { codigo_terreno: 1 }
        );

        if (registro_proyecto) {
            const codigo_terreno = registro_proyecto.codigo_terreno;

            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

            if (acceso == "permitido") {
                funcionGeneradorCodigoAlfaNumericoInmueble(); // este es el que recien ordenara ejecutar la funcion "funcionGeneradorCodigoAlfaNumericoInmueble"

                async function funcionGeneradorCodigoAlfaNumericoInmueble() {
                    const codigoInmueble = codigoAlfanumericoInmueble();

                    // revisamos en la base de datos si el codigo alfanumerico del inmueble ya existe o no
                    const vemosExistecodigoAlfaNumInmueble = await indiceInmueble.find({
                        codigo_inmueble: codigoInmueble,
                    });

                    if (vemosExistecodigoAlfaNumInmueble.length > 0) {
                        // si se encuentra un inmueble con el mismo codigo alfanumerico, entonces volvemos a ejecutar la funcion nuevamente, a esto se llama FUNCION RECURSIVA
                        funcionGeneradorCodigoAlfaNumericoInmueble();
                    } else {
                        // si aun no existe este codigo, devolvera asi "[]" (un [] vacio)

                        // si el codigo generado es unico. Entonces procedemos a guardarlo en la base de datos del inmueble que se creara

                        const codigoNuevoInmueble = new indiceInmueble({
                            codigo_inmueble: codigoInmueble,
                            codigo_proyecto: codigoProyecto,
                            codigo_terreno: codigo_terreno,
                        });

                        await codigoNuevoInmueble.save();

                        //--------------------------------------------
                        // guardamos en el historial de acciones
                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var accion_administrador = "Crea Inmueble " + codigoInmueble;

                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //--------------------------------------------

                        // IMPORTANTE, EL REDIRECCIOAMIENTO DEBE ESTAR DENTRO DE "IF" CASO, CONTRARIO  si es redireccionamiento estaria fuera de "if", NODEJS LO EJECUTARIA CON "codigoInmueble" indefinido.

                        res.redirect("/laapirest/inmueble/" + codigoInmueble + "/descripcion"); // por defecto REDIRECTO es "get"
                    }
                }
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************** */
/************************************************************************************** */
// RENDERIZAR VENTANA DE INMUEBLE
// ruta: get   "/laapirest/inmueble/:codigo_inmueble/:ventana_inmueble"

controladorAdmInmueble.renderizarVentanaInmueble = async (req, res) => {
    try {
        var codigo_inmueble = req.params.codigo_inmueble;
        var tipo_ventana_inmueble = req.params.ventana_inmueble;

        var inmuebleExiste = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                // guardado, disponible, reservado, pendiente_pago, pagado_pago, pendiente_aprobacion, pagos (construccion), remate, completado (construido)
                estado_inmueble: 1,

                // estos valores seran utililes solo para la pestaña de "Propietario". Para no hacer la consulta nuevamente a la base de datos del inmueble
                valor_reserva: 1,
                precio_construccion: 1,
                precio_competencia: 1,

                _id: 0,
            }
        );

        if (inmuebleExiste) {
            // VERIFICAMOS QUE EL INMUEBLE EXISTA EN LA BASE DE DATOS
            var info_inmueble = {};
            info_inmueble.cab_inm_adm = true;
            //info_inmueble.estilo_cabezera = "cabezera_estilo_inmueble";

            //----------------------------------------------------
            // para la url de la cabezera
            var url_cabezera = ""; // vacio por defecto
            const registro_cabezera = await indiceImagenesSistema.findOne(
                { tipo_imagen: "cabezera_inmueble" },
                {
                    url: 1,
                    _id: 0,
                }
            );

            if (registro_cabezera) {
                url_cabezera = registro_cabezera.url;
            }

            info_inmueble.url_cabezera = url_cabezera;

            //----------------------------------------------------

            info_inmueble.codigo_inmueble = codigo_inmueble;

            var aux_cabezera = {
                codigo_objetivo: codigo_inmueble,
                tipo: "inmueble",
                lado: "administrador",
            };

            var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
            info_inmueble.cabezera_adm = cabezera_adm;

            var pie_pagina = await pie_pagina_adm();
            info_inmueble.pie_pagina_adm = pie_pagina;

            info_inmueble.es_inmueble = true; // para menu navegacion comprimido

            if (tipo_ventana_inmueble == "descripcion") {
                var contenido_inmueble = await inmueble_descripcion(codigo_inmueble);
                info_inmueble.descripcion_inmueble = true; // para pestaña y ventana apropiada para inmueble
                info_inmueble.contenido_inmueble = contenido_inmueble;

                // ------- Para verificación -------
                //console.log("DESCRIPCION INMUEBLE");
                //console.log(info_inmueble);

                res.render("adm_inmueble", info_inmueble);
            }

            if (tipo_ventana_inmueble == "imagenes") {
                var contenido_inmueble = await inmueble_imagenes(codigo_inmueble);
                info_inmueble.imagenes_inmueble = true;
                info_inmueble.contenido_inmueble = contenido_inmueble;

                // ------- Para verificación -------
                //console.log("IMAGENES INMUEBLE");
                //console.log(info_inmueble);

                res.render("adm_inmueble", info_inmueble);
            }

            if (tipo_ventana_inmueble == "documentos") {
                var contenido_inmueble = await inmueble_documentos(codigo_inmueble);
                info_inmueble.documentos_inmueble = true;
                info_inmueble.contenido_inmueble = contenido_inmueble;
                // ------- Para verificación -------
                console.log("los datos de documentos del inmueble");
                console.log(info_inmueble);
                res.render("adm_inmueble", info_inmueble);
            }

            if (tipo_ventana_inmueble == "propietario") {
                var reserva_inm = inmuebleExiste.valor_reserva;
                var precio_justo_inm = inmuebleExiste.precio_construccion;
                var competencia_inm = inmuebleExiste.precio_competencia;
                var plusvalia_inm = competencia_inm - precio_justo_inm;

                info_inmueble.reserva_render = numero_punto_coma(reserva_inm);
                info_inmueble.precio_render = numero_punto_coma(precio_justo_inm.toFixed(0));
                info_inmueble.plusvalia_render = numero_punto_coma(plusvalia_inm.toFixed(0));

                var contenido_inmueble = await inmueble_propietario(codigo_inmueble);
                info_inmueble.propietario_inmueble = true;
                info_inmueble.contenido_propietario = contenido_inmueble;

                // ------- Para verificación -------
                console.log("informacion completa PROPIETARIO");
                console.log(info_inmueble);
                // ------- Para verificación -------
                console.log("informacion completa pagos_mensuales");
                console.log(info_inmueble.contenido_propietario.propietario_pagos.pagos_mensuales);

                res.render("adm_inmueble", info_inmueble);
            }

            if (tipo_ventana_inmueble == "pagos") {
                var contenido_inmueble = await inmueble_pagos(codigo_inmueble);
                info_inmueble.pagos_inmueble = true;
                info_inmueble.contenido_propietario = contenido_inmueble;
                // ------- Para verificación -------
                console.log("los datos de PAGOS inmueble");
                console.log(info_inmueble);
                res.render("adm_inmueble", info_inmueble);
            }

            if (tipo_ventana_inmueble == "estados") {
                var contenido_inmueble = await inmueble_estados(codigo_inmueble);
                info_inmueble.estados_inmueble = true;
                info_inmueble.contenido_inmueble = contenido_inmueble;
                // ------- Para verificación -------
                //console.log("los datos de ESTADOS del inmueble");
                //console.log(info_inmueble);
                res.render("adm_inmueble", info_inmueble);
            }

            if (tipo_ventana_inmueble == "eliminar") {
                info_inmueble.eliminar_inmueble = true;
                info_inmueble.contenido_inmueble = contenido_inmueble;
                res.render("adm_inmueble", info_inmueble);
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN INMUEBLE INEXISTENTE.
            res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------

async function inmueble_descripcion(codigo_inmueble) {
    try {
        const registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                codigo_proyecto: 1,
                codigo_inmueble: 1,
                estado_inmueble: 1,
                fecha_creacion: 1,
                valor_reserva: 1,
                financiado: 1,
                pagos_mensuales: 1,
                tipo_inmueble: 1,
                torre: 1,
                piso: 1,
                puerta_inmueble: 1,
                superficie_inmueble_m2: 1,
                dormitorios_inmueble: 1,
                banos_inmueble: 1,
                garaje_inmueble: 1,
                precio_competencia: 1,
                precio_construccion: 1,
                plusvalia_sus: 1,
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

                direccion_comparativa: 1,
                m2_comparativa: 1,
                precio_comparativa: 1,

                titulo_garantia_1: 1,
                garantia_1: 1,
                titulo_garantia_2: 1,
                garantia_2: 1,
                titulo_garantia_3: 1,
                garantia_3: 1,
                inmueble_remate: 1,
                acumulador_penalizaciones: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_inmueble);

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

async function inmueble_imagenes(codigo_inmueble) {
    try {
        // EXTRAEMOS "TODAS LA IMAGENES DEL PROYECTO" (incluida las que son de RESPONSABILIDAD SOCIAL)

        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            { codigo_proyecto: 1, _id: 0 }
        );

        if (registro_inmueble) {
            var aux_proyectoImagenes = await indiceImagenesProyecto.find(
                {
                    codigo_proyecto: registro_inmueble.codigo_proyecto,
                    imagen_respon_social: false, // NO seran considerados imagenes de responsabilidad social
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
            var imagenesInmueblePrincipal = [];

            // array donde estaran las imagenes que forman parte del propio proyecto
            var imagenesInmuebleExclusiva = [];

            var imagenesInmuebleOtros = [];

            // ------- Para verificación -------
            //console.log("las putas imagenes del proyecto sin res social");
            //console.log(proyectoImagenes);

            if (proyectoImagenes.length > 0) {
                // Empezamos a contar desde "-1", para que asi sea mas facil recorrerlo con el for
                var i_inmueblePrincipal = -1;
                var i_inmuebleExclusiva = -1;
                var i_inmuebleOtros = -1;

                for (i = 0; i < proyectoImagenes.length; i++) {
                    // revision si la "imagen for" es una imagen principal del proyecto

                    let arrayPrincipalesFor = proyectoImagenes[i].parte_principal;

                    // buscamos en este "arrayPrincipalesFor" si existe el codigo del inmueble (buscando la posicion que este ocupa en el presente ARRAY)
                    let pocisionExiste = arrayPrincipalesFor.indexOf(codigo_inmueble);

                    if (pocisionExiste != -1) {
                        // si el codigo del inmueble figura en este ARRAY, significa que la presente imagen for, es la imagen principal del inmueble

                        // incrementamos en +1 la pocision para construir el ARRAY
                        i_inmueblePrincipal = i_inmueblePrincipal + 1;
                        // llenamos el objeto con los valores de la imagen que corresponda "i"
                        imagenesInmueblePrincipal[i_inmueblePrincipal] = {
                            codigo_inmueble: codigo_inmueble,
                            nombre_imagen: proyectoImagenes[i].nombre_imagen,
                            codigo_imagen: proyectoImagenes[i].codigo_imagen, // sin extension
                            extension_imagen: proyectoImagenes[i].extension_imagen,
                            url: proyectoImagenes[i].url,
                        };
                    } else {
                        // si la imagen no es "principal" para el inmueble,
                        // entonces revisamos si es una "exclusiva" del inmueble
                        let arrayExclusivasFor = proyectoImagenes[i].parte_exclusiva;

                        // buscamos en este "arrayExclusivasFor" si existe el codigo del inmueble (buscando la posicion que este ocupa en el presente ARRAY)
                        let pocisionExiste = arrayExclusivasFor.indexOf(codigo_inmueble);

                        if (pocisionExiste != -1) {
                            // si el codigo del inmueble figura en este ARRAY, significa que la presente imagen for, es una imagen exclusiva del inmueble

                            // incrementamos en +1 la pocision para construir el ARRAY
                            i_inmuebleExclusiva = i_inmuebleExclusiva + 1;
                            // llenamos el objeto con los valores de la imagen que corresponda "i"
                            imagenesInmuebleExclusiva[i_inmuebleExclusiva] = {
                                codigo_inmueble: codigo_inmueble,
                                nombre_imagen: proyectoImagenes[i].nombre_imagen,
                                codigo_imagen: proyectoImagenes[i].codigo_imagen, // sin extension
                                extension_imagen: proyectoImagenes[i].extension_imagen,
                                url: proyectoImagenes[i].url,
                            };
                        } else {
                            // si la imagen NO es "principal", NO es "exclusiva", entonces es "OTROS" para el inmueble,

                            // incrementamos en +1 la pocision para construir el ARRAY
                            i_inmuebleOtros = i_inmuebleOtros + 1;

                            // llenamos el objeto con los valores de la imagen que corresponda "i"
                            imagenesInmuebleOtros[i_inmuebleOtros] = {
                                codigo_inmueble: codigo_inmueble,
                                nombre_imagen: proyectoImagenes[i].nombre_imagen,
                                codigo_imagen: proyectoImagenes[i].codigo_imagen, // sin extension
                                extension_imagen: proyectoImagenes[i].extension_imagen,
                                url: proyectoImagenes[i].url,
                            };
                        }
                    }
                }
            }
            var contenido_img_inm = {};
            contenido_img_inm.imagenesDelInmueble_principal = imagenesInmueblePrincipal;
            contenido_img_inm.imagenesDelInmueble_exclusiva = imagenesInmuebleExclusiva;
            contenido_img_inm.imagenesDelInmueble_otros = imagenesInmuebleOtros;

            return contenido_img_inm;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function inmueble_documentos(codigo_inmueble) {
    try {
        var inmuebleDocumentos = await indiceDocumentos.find(
            {
                codigo_inmueble: codigo_inmueble,
            },
            {
                nombre_documento: 1,
                codigo_documento: 1,
                clase_documento: 1,
                url: 1,
                _id: 0,
            }
        );

        // conversion del documento MONGO ([ARRAY]) a "string"
        var aux_string = JSON.stringify(inmuebleDocumentos);
        // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
        var aux_contenido_doc_inm = JSON.parse(aux_string);

        var contenido_doc_inm = [];
        var aux_i = -1;

        if (aux_contenido_doc_inm.length > 0) {
            for (let i = 0; i < aux_contenido_doc_inm.length; i++) {
                var clase_documento = aux_contenido_doc_inm[i].clase_documento;
                if (clase_documento != "Propietario") {
                    // porque solo seran mostrados los doc PUBLICOS
                    aux_i = aux_i + 1;
                    contenido_doc_inm[aux_i] = aux_contenido_doc_inm[i];
                }
            }
            return contenido_doc_inm;
        } else {
            return contenido_doc_inm; // devolvera un array vacio si no existen documentos
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_propietario(codigo_inmueble) {
    try {
        var registro_inversion = await indiceInversiones.findOne(
            {
                codigo_inmueble: codigo_inmueble,
                estado_propietario: "activo", // solo puede existir un activo
            },
            {
                ci_propietario: 1,
                _id: 0,
            }
        );

        // si existe un solo propietario activo
        if (registro_inversion) {
            var paquete_propietario = {
                ci_propietario: registro_inversion.ci_propietario,
                codigo_inmueble: codigo_inmueble,
            };
        } else {
            var paquete_propietario = {
                ci_propietario: "", // porque el inmueble no tiene a ningun propietario como ACTIVO
                codigo_inmueble: codigo_inmueble,
            };
        }
        var aux_respuesta = {}; // ***** REVISAR SI ES CORRECTO DECLARARLO VACIO PARA LUEGO LLENARLO CON AWAIT.
        aux_respuesta = await datos_pagos_propietario(paquete_propietario);
        if (registro_inversion) {
            aux_respuesta.existe_propietario = true;
        } else {
            aux_respuesta.existe_propietario = false;
        }
        return aux_respuesta;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function inmueble_pagos(codigo_inmueble) {
    // se mostrara todos los propietarios que tuvo el inmueble

    try {
        var contenedor_propietario = {};

        var propietarios_inmueble = await indiceInversiones.find(
            {
                codigo_inmueble: codigo_inmueble,
            },
            {
                codigo_inmueble: 1,
                ci_propietario: 1,
                estado_propietario: 1,
                _id: 0,
            }
        );

        if (propietarios_inmueble.length > 0) {
            // conversion del documento MONGO ([array]) a "string"
            var aux_string = JSON.stringify(propietarios_inmueble);
            // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
            var propietarios_inmueble = JSON.parse(aux_string);

            // ahora los nombres de los propietarios
            for (let i = 0; i < propietarios_inmueble.length; i++) {
                var ci_propietario_i = propietarios_inmueble[i].ci_propietario;
                var propietario_inmueble = await indice_propietario.findOne(
                    {
                        ci_propietario: ci_propietario_i,
                    },
                    {
                        nombres_propietario: 1,
                        apellidos_propietario: 1,
                        _id: 0,
                    }
                );

                if (propietario_inmueble) {
                    // agregando los nombres de los propietarios del inmueble
                    propietarios_inmueble[i].nombres_propietario =
                        propietario_inmueble.nombres_propietario;
                    propietarios_inmueble[i].apellidos_propietario =
                        propietario_inmueble.apellidos_propietario;
                }
            }
        } else {
            var propietarios_inmueble = false; // para el each del handlebars
        }

        contenedor_propietario.propietarios_inmueble = propietarios_inmueble;
        return contenedor_propietario;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function inmueble_estados(codigo_inmueble) {
    try {
        const registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                estado_inmueble: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            // conversion del documento MONGO ({objeto}) a "string"
            var aux_string = JSON.stringify(registro_inmueble);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            if (aux_objeto.estado_inmueble == "guardado") {
                var texto_estado = "Guardado";
            }
            if (aux_objeto.estado_inmueble == "disponible") {
                var texto_estado = "Disponible";
            }
            if (aux_objeto.estado_inmueble == "reservado") {
                var texto_estado = "Reservado";
            }
            if (aux_objeto.estado_inmueble == "pendiente_pago") {
                var texto_estado = "Pendiente";
            }
            if (aux_objeto.estado_inmueble == "pagado_pago") {
                var texto_estado = "Pagado";
            }
            if (aux_objeto.estado_inmueble == "pagos") {
                var texto_estado = "Construcción";
            }
            if (aux_objeto.estado_inmueble == "remate") {
                var texto_estado = "Remate";
            }
            if (aux_objeto.estado_inmueble == "completado") {
                var texto_estado = "Construido";
            }

            aux_objeto.texto_estado_inmueble = texto_estado;
            return aux_objeto;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
//------------------------------------------------------------------

/************************************************************************************** */
/************************************************************************************** */
//GUARDAR LOS DATOS FORMULARIO INICIAL INICIAL DEL INMUEBLE

controladorAdmInmueble.guardarDatosInmueble = async (req, res) => {
    // la ruta que entra a este controlador es:
    // post  "/laapirest/inmueble/:codigo_inmueble/accion/guardar_descripcion"

    try {
        const codigoInmueble = req.params.codigo_inmueble; // "codigo_inmueble" respetando el nombre como esta puesto en la ruta ( /:codigo_inmueble )

        const inmuebleEncontrado = await indiceInmueble.findOne({
            codigo_inmueble: codigoInmueble,
        });

        if (inmuebleEncontrado) {
            var acceso = await verificadorTerrenoBloqueado(inmuebleEncontrado.codigo_terreno);
            if (acceso == "permitido") {
                /**--------------------------------------------- */
                // INFORMACION BASICA html

                inmuebleEncontrado.valor_reserva = Number(req.body.valor_reserva);

                inmuebleEncontrado.titulo_garantia_1 = req.body.titulo_garantia_1;
                inmuebleEncontrado.garantia_1 = req.body.garantia_1;

                inmuebleEncontrado.titulo_garantia_2 = req.body.titulo_garantia_2;
                inmuebleEncontrado.garantia_2 = req.body.garantia_2;

                inmuebleEncontrado.titulo_garantia_3 = req.body.titulo_garantia_3;
                inmuebleEncontrado.garantia_3 = req.body.garantia_3;

                inmuebleEncontrado.torre = req.body.torre;
                inmuebleEncontrado.piso = Number(req.body.piso);
                inmuebleEncontrado.puerta_inmueble = req.body.puerta_inmueble;

                inmuebleEncontrado.precio_construccion = Number(req.body.precio_construccion);
                //inmuebleEncontrado.plusvalia_sus = Number(req.body.plusvalia_sus);
                //inmuebleEncontrado.precio_competencia = req.body.precio_competencia;

                /**--------------------------------------------- */
                // DESCRIPCION INMUEBLE html

                inmuebleEncontrado.tipo_inmueble = req.body.tipo_inmueble;

                inmuebleEncontrado.superficie_inmueble_m2 = Number(req.body.superficie_inmueble_m2);
                inmuebleEncontrado.dormitorios_inmueble = Number(req.body.dormitorios_inmueble);
                inmuebleEncontrado.banos_inmueble = Number(req.body.banos_inmueble);
                inmuebleEncontrado.garaje_inmueble = Number(req.body.garaje_inmueble);

                inmuebleEncontrado.inmueble_descripcion = req.body.inmueble_descripcion;

                inmuebleEncontrado.titulo_descripcion_1 = req.body.titulo_descripcion_1;
                inmuebleEncontrado.varios_descripcion_1 = req.body.varios_descripcion_1;
                inmuebleEncontrado.titulo_descripcion_2 = req.body.titulo_descripcion_2;
                inmuebleEncontrado.varios_descripcion_2 = req.body.varios_descripcion_2;
                inmuebleEncontrado.titulo_descripcion_3 = req.body.titulo_descripcion_3;
                inmuebleEncontrado.varios_descripcion_3 = req.body.varios_descripcion_3;
                inmuebleEncontrado.titulo_descripcion_4 = req.body.titulo_descripcion_4;
                inmuebleEncontrado.varios_descripcion_4 = req.body.varios_descripcion_4;
                inmuebleEncontrado.titulo_descripcion_5 = req.body.titulo_descripcion_5;
                inmuebleEncontrado.varios_descripcion_5 = req.body.varios_descripcion_5;

                inmuebleEncontrado.link_youtube_inmueble = req.body.link_youtube_inmueble;

                /**--------------------------------------------- */
                // INFORMACION ECONOMICA html

                var auxDireccionComparativa = [
                    req.body.direccion_1,
                    req.body.direccion_2,
                    req.body.direccion_3,
                    req.body.direccion_4,
                    req.body.direccion_5,
                ];

                var auxSuperficieComparativa = [
                    Number(req.body.superficie_m2_1),
                    Number(req.body.superficie_m2_2),
                    Number(req.body.superficie_m2_3),
                    Number(req.body.superficie_m2_4),
                    Number(req.body.superficie_m2_5),
                ];

                var auxPrecioComparativa = [
                    Number(req.body.precio_sus_1),
                    Number(req.body.precio_sus_2),
                    Number(req.body.precio_sus_3),
                    Number(req.body.precio_sus_4),
                    Number(req.body.precio_sus_5),
                ];

                inmuebleEncontrado.direccion_comparativa = auxDireccionComparativa;
                inmuebleEncontrado.m2_comparativa = auxSuperficieComparativa;
                inmuebleEncontrado.precio_comparativa = auxPrecioComparativa;

                // actualizacion de PRECIO COMPETENCIA
                // -------------------------------------------------------
                var superficie_inmueble = Number(req.body.superficie_inmueble_m2);
                var sum_precios = 0;
                var superficie = 0;
                var precio = 0;
                var sus_m2 = 0;
                for (let i = 0; i < auxPrecioComparativa.length; i++) {
                    superficie = Number(auxSuperficieComparativa[i]);
                    precio = Number(auxPrecioComparativa[i]);
                    sus_m2 = precio / superficie;
                    sum_precios = sum_precios + sus_m2 * superficie_inmueble;
                }
                inmuebleEncontrado.precio_competencia = Number(
                    (sum_precios / auxPrecioComparativa.length).toFixed(0)
                ); // es el promedio de los precios de la competencia
                // -------------------------------------------------------

                // LOS DATOS LLENADOS EN EL FORMULARIO, SERAN GUARDADOS EN LA BASE DE DATOS
                await inmuebleEncontrado.save();

                //------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "Guarda descripción inmueble " + codigoInmueble;
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

/************************************************************************************** */
/************************************************************************************** */
// INSPECCIONAR CI DEL PROPIETARIO POTENCIAL. ESTE COMANDO SOLO ESTA DISPONIBLE CUANDO EL INMUEBLE NO CUENTA CON PROPIETARIO ACTIVO
// VALIDO PARA: llenado de datos y "pagos" en cuenta de "inmueble", "datos" y "pagos" en cuenta de "propietario"
controladorAdmInmueble.llenar_datos_pagos_propietario = async (req, res) => {
    // la ruta que entra a este controlador es:
    // POST   '/laapirest/inmueble/:codigo_inmueble/accion/llenar_datos_pagos_propietario'

    var paquete_propietario = {
        ci_propietario: req.body.ci_propietario,
        codigo_inmueble: req.body.codigo_inmueble,
    };

    var aux_respuesta = await datos_pagos_propietario(paquete_propietario);

    res.json({
        respuesta: aux_respuesta,
    });
};

/************************************************************************************** */
/************************************************************************************** */
// PARA ELIMINAR A UN PROPIETARIO DE UN INMUEBLE (no es eliminacion completa del propietario, eso esta en controladores de "PROPIETARIO")

controladorAdmInmueble.eliminar_propietario_inmueble = async (req, res) => {
    // la ruta que entra a este controlador es: delete
    // "/laapirest/inmueble/:codigo_inmueble/accion/eliminar_propietario_inmueble"

    try {
        // ------- Para verificación -------
        //console.log("los datos del paquete de datos es:");
        //console.log(req.body);

        const ci_propietario = req.body.ci_propietario;
        const codigo_inmueble = req.body.codigo_inmueble;

        // -----------------------------------------------------------
        // eliminamos del registro de "indiceInversiones" buscandolo en base a "codigo_inmueble" y "ci_propietario", como este par es único, es que se utiliza "findOne"

        const registroInversion = await indiceInversiones.findOne({
            codigo_inmueble: codigo_inmueble,
            ci_propietario: ci_propietario,
        });

        if (registroInversion) {
            var acceso = await verificadorTerrenoBloqueado(registroInversion.codigo_terreno);

            if (acceso == "permitido") {
                //--------------------------------------------------------
                // ELIMINACION DE LOS DOCUMENTOS PRIVADOS DEL INMUEBLE QUE TIENE CON SU PROPIETARIO

                var registroDocumentosPrivados = await indiceDocumentos.find({
                    codigo_inmueble: codigo_inmueble,
                    clase_documento: "Propietario",
                    ci_propietario: ci_propietario,
                });

                if (registroDocumentosPrivados) {
                    // eliminamos los ARCHIVOS DOCUMENTOS PDF uno por uno (sean publicos o privados)
                    for (let i = 0; i < registroDocumentosPrivados.length; i++) {
                        let documentoNombreExtension =
                            registroDocumentosPrivados[i].codigo_documento + ".pdf";
                        // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                        await fs.unlink(
                            pache.resolve("./src/publico/subido/" + documentoNombreExtension)
                        ); // "+" es para concatenar
                    }
                    // luego de eliminar todos los ARCHIVOS DOCUMENTO, procedemos a ELIMINARLO DE LA BASE DE DATOS
                    await indiceDocumentos.deleteMany({
                        codigo_inmueble: codigo_inmueble,
                        clase_documento: "Propietario",
                        ci_propietario: ci_propietario,
                    }); // "deleteMany" para que elimine TODOS los que coinciden con las condiciones
                }

                //-------------------------------------------------------
                // eliminamos todos los datos (informacion que esta guardada en la base de datos) del propietario en este inmueble
                //await registroInversion.remove(); // no usamos para no tener problemas con problemas de caducidad de remove
                await indiceInversiones.deleteOne({
                    codigo_inmueble: codigo_inmueble,
                    ci_propietario: ci_propietario,
                });

                //------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador =
                    "Elimina propietario: " + ci_propietario + " de inmueble: " + codigo_inmueble;
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

/************************************************************************************** */
/************************************************************************************** */
// GUARDAR ESTADO DEL INMUEBLE

controladorAdmInmueble.guardarEstadoInmueble = async (req, res) => {
    // la ruta que entra a este controlador es:
    // post   "/laapirest/inmueble/:codigo_inmueble/accion/guardar_estado_inmueble"

    try {
        const codigo_inmueble = req.params.codigo_inmueble;

        const registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            { codigo_terreno: 1 }
        );

        if (registro_inmueble) {
            var acceso = await verificadorTerrenoBloqueado(registro_inmueble.codigo_terreno);
            if (acceso == "permitido") {
                await indiceInmueble.updateOne(
                    { codigo_inmueble: codigo_inmueble },
                    { $set: { estado_inmueble: req.body.nuevo_estado } }
                ); // guardamos el registro con el dato modificado

                if (req.body.nuevo_estado == "guardado") {
                    await indiceInmueble.updateOne(
                        { codigo_inmueble: codigo_inmueble },
                        { $set: { fecha_creacion: new Date() } }
                    ); // guardamos fecha de guardado del inmueble
                }

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador =
                    "Guarda estado inmueble " + codigo_inmueble + " a " + req.body.nuevo_estado;
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SACAR DE LA PROMEDA ESTE ELIMINADOR Y HACERLO FUNCIONAR APARTE

controladorAdmInmueble.eliminarInmueble = async (req, res) => {
    // RUTA  "DELETE"    "/laapirest/inmueble/:codigo_inmueble/accion/eliminar_inmueble"
    try {
        // para ver el funcionamiento de splice en eliminar elementos dentro un array
        //var myFish = ["angel", "clown", "drum", "mandarin", "sturgeon"];
        //console.log(myFish);
        //var removed = myFish.splice(3, 1);
        //console.log(removed);
        //console.log(myFish);

        const codigo_inmueble = req.params.codigo_inmueble;

        var inmuebleEncontrado = await indiceInmueble.findOne({
            codigo_inmueble: codigo_inmueble,
        });

        if (inmuebleEncontrado) {
            const usuario_maestro = req.body.usuario_maestro;
            const clave_maestro = req.body.clave_maestro;
            var paquete_datos = {
                usuario_maestro,
                clave_maestro,
            };
            var llaves_maestras = await verificadorLlavesMaestras(paquete_datos);
            if (llaves_maestras) {
                var acceso = await verificadorTerrenoBloqueado(inmuebleEncontrado.codigo_terreno);
                if (acceso == "permitido") {
                    // todos seran ejecutados al mismo tiempo (de manera paralela, para ello se hace uso de PROMISE.ALL)
                    var aux_datos = {
                        codigo_inmueble,
                        codigo_proyecto: inmuebleEncontrado.codigo_proyecto,
                    };
                    //var eli_img = await eliminadorImagenesInmueble(aux_datos);

                    var resultadoEliminador = await Promise.all([
                        eliminadorImagenesInmueble(aux_datos),
                        eliminadorDocumentosInmueble(codigo_inmueble),
                        eliminadorGuarInvInmueble(codigo_inmueble),
                    ]);

                    if (
                        resultadoEliminador[0] == "ok" &&
                        resultadoEliminador[1] == "ok" &&
                        resultadoEliminador[2] == "ok"
                    ) {
                        // si todos fueron eliminados satisfactoriamente
                        // AQUI RECIEN SE ELIMINARA EL INMUEBLE DE LA BASE DE DATOS
                        //await inmuebleEncontrado.remove();
                        //await indiceInmueble.remove({ codigo_inmueble: codigo_inmueble });
                        await indiceInmueble.deleteOne({ codigo_inmueble: codigo_inmueble });

                        //-------------------------------------------------------------------
                        // guardamos en el historial de acciones
                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var accion_administrador = "Elimina inmueble " + codigo_inmueble;
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
                            "El Terreno del inmueble presente se encuentra bloqueado, por tanto no es posible realizar cambios",
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
                mensaje:
                    "Inmueble No encontrado, por favor refresque la ventana e intentelo nuevamente",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//-----------------------------------------------------------------

async function eliminadorImagenesInmueble(aux_datos) {
    try {
        //var myFish = ["angel", "clown", "drum", "mandarin", "sturgeon"];
        //console.log(myFish);
        //var removed = myFish.splice(3, 1);
        //console.log(removed);
        //console.log(myFish);

        // eliminacion del codigo del inmueble de imagenes principales y exclusivas de la imagenes
        var codigo_inmueble = aux_datos.codigo_inmueble;
        var codigo_proyecto = aux_datos.codigo_proyecto;

        const registroImagenesProyecto = await indiceImagenesProyecto.find({
            codigo_proyecto: codigo_proyecto,
        });

        if (registroImagenesProyecto.length > 0) {
            // recorreremos todos las imagenes del proyecto, buscando a este inmueble si se encuentra como imagen principal o exlcusiva
            for (let i = 0; i < registroImagenesProyecto.length; i++) {
                var pocisionInmueble_p =
                    registroImagenesProyecto[i].parte_principal.indexOf(codigo_inmueble);
                if (pocisionInmueble_p != -1) {
                    let array_cambiar_p = registroImagenesProyecto[i].parte_principal;
                    // significa que el inmueble figura en este ARRAY
                    //registroImagenesProyecto[i].parte_principal.splice(pocisionInmueble_p, 1); // Recuerde que "1" significa que solo queremos borrar "1" valor del ARRAY a partir de la posicion "pocisionInmueble_p"

                    array_cambiar_p.splice(pocisionInmueble_p, 1); // aqui array_cambiar_p sera modificado
                    // updateOne guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
                    await indiceImagenesProyecto.updateOne(
                        { codigo_imagen: registroImagenesProyecto[i].codigo_imagen },
                        { $set: { parte_principal: array_cambiar_p } }
                    );
                }

                var pocisionInmueble_e =
                    registroImagenesProyecto[i].parte_exclusiva.indexOf(codigo_inmueble);
                if (pocisionInmueble_e != -1) {
                    let array_cambiar_e = registroImagenesProyecto[i].parte_exclusiva;

                    // ------- Para verificación -------
                    //console.log("codigo del inmueble a ser eliminado:");
                    //console.log(codigo_inmueble);
                    // ------- Para verificación -------
                    //console.log("posicion del inmueble a ser eliminado:");
                    //console.log(pocisionInmueble_e);

                    // ------- Para verificación -------
                    //console.log("array exclusiva antes de ser eliminado:");
                    //console.log(array_cambiar_e);

                    // significa que el inmueble figura en este ARRAY
                    //registroImagenesProyecto[i].parte_exclusiva.splice(pocisionInmueble_e, 1); // Recuerde que "1" significa que solo queremos borrar "1" valor del ARRAY a partir de la posicion "pocisionInmueble_e"

                    array_cambiar_e.splice(pocisionInmueble_e, 1);
                    // updateOne guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
                    await indiceImagenesProyecto.updateOne(
                        { codigo_imagen: registroImagenesProyecto[i].codigo_imagen },
                        { $set: { parte_exclusiva: array_cambiar_e } }
                    );

                    // ------- Para verificación -------
                    //console.log("array exclusiva DESPUES de ser eliminado:");
                    //console.log(array_cambiar_e);

                    // ------- Para verificación -------
                    /*
                    console.log("array ejemplo eliminaremos la posicion 1");
                    let cosmos = ["a", "b", "c", "d"];
                    console.log(cosmos);
                    let array_cambiado = cosmos.splice(1, 1);
                    console.log("nuevo array eliminado b");
                    console.log(array_cambiado);
                    */
                }
            }

            // una vez eliminado de los ARRAYs donde se encuentra este inmueble, se procede a guardar el registro de registroImagenesProyecto
            //await registroImagenesProyecto.save();
        }
        // una vez eliminado de los ARRAYs donde se encuentra este inmueble, se procede a guardar el registro de registroImagenesProyecto
        //await registroImagenesProyecto.save();
        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------
async function eliminadorDocumentosInmueble(codigo_inmueble) {
    try {
        const registroDocumentosInmueble = await indiceDocumentos.find({
            codigo_inmueble: codigo_inmueble,
        });

        if (registroDocumentosInmueble.length > 0) {
            // eliminamos los ARCHIVOS DOCUMENTOS PDF uno por uno (sean publicos o privados del propietario dueño de este inmueble)
            for (let i = 0; i < registroDocumentosInmueble.length; i++) {
                let documentoNombreExtension =
                    registroDocumentosInmueble[i].codigo_documento + ".pdf";
                // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + documentoNombreExtension)); // "+" es para concatenar
            }
            // luego de eliminar todos los ARCHIVOS DOCUMENTO, procedemos a ELIMINARLO DE LA BASE DE DATOS
            //await indiceDocumentos.remove({ codigo_inmueble: codigo_inmueble });
            await indiceDocumentos.deleteMany({ codigo_inmueble: codigo_inmueble });
        }
        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------
async function eliminadorGuarInvInmueble(codigo_inmueble) {
    try {
        //await indiceGuardados.remove({ codigo_inmueble: codigo_inmueble });
        //await indiceInversiones.remove({ codigo_inmueble: codigo_inmueble });

        // deleteMany borra TODOS aquellos que tienen { codigo_inmueble: codigo_inmueble }
        // deleteOne borra solo el PRIMERO que encuentra en la base de datos
        await indiceGuardados.deleteMany({ codigo_inmueble: codigo_inmueble });
        await indiceInversiones.deleteMany({ codigo_inmueble: codigo_inmueble });

        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorAdmInmueble;
