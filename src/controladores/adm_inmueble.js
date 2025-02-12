const { codigoAlfanumericoInmueble } = require("../ayudas/ayudaslibreria");

const {
    indiceInmueble,
    indiceDocumentos,
    indiceProyecto,
    indice_propietario,
    indiceInversiones,
    indiceGuardados,
    indiceImagenesProyecto,
    indiceTerreno,
    indiceFraccionInmueble,
} = require("../modelos/indicemodelo");

const {
    verificadorTerrenoBloqueado,
    guardarAccionAdministrador,
    verificadorLlavesMaestras,
    fraccion_card_adm_cli,
} = require("../ayudas/funcionesayuda_1");

const { cabezeras_adm_cli, datos_pagos_propietario } = require("../ayudas/funcionesayuda_2");

//const pache = require("path");

//const fs = require("fs-extra");

const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");
const { super_info_inm } = require("../ayudas/funcionesayuda_5");
//const { Number } = require("mongoose");

const { getStorage, ref, deleteObject } = require("firebase/storage");

const moment = require("moment");

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
                // guardado, disponible, reservado, construccion, remate, construido
                estado_inmueble: 1,

                // false: cuando se trata de un inmueble normal, adquiridos por PROPIETARIOS ABSOLUTOS
                // true: cuando se trata de un inmueble que esta fraccionado, que estara formado por  COPROPIETARIOS
                fraccionado: 1,

                // estos valores seran utililes solo para la pestaña de "Propietario". Para no hacer la consulta nuevamente a la base de datos del inmueble
                precio_construccion: 1,
                precio_competencia: 1,

                _id: 0,
            }
        );

        if (inmuebleExiste) {
            // VERIFICAMOS QUE EL INMUEBLE EXISTA EN LA BASE DE DATOS
            var info_inmueble = {};
            info_inmueble.cab_inm_adm = true;
            info_inmueble.estilo_cabezera = "cabezera_estilo_inmueble";

            //----------------------------------------------------

            info_inmueble.codigo_inmueble = codigo_inmueble;

            var aux_cabezera = {
                codigo_objetivo: codigo_inmueble,
                tipo: "inmueble",
            };

            var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
            info_inmueble.cabezera_adm = cabezera_adm;

            info_inmueble.es_inmueble = true; // para menu navegacion comprimido

            if (inmuebleExiste.fraccionado) {
                // para indicar que se trata de un inmueble que pertenece a varios COPROPIETARIOS
                info_inmueble.inmueble_fraccionado = true;
            } else {
                // para indicar que se trata de un inmueble que pertenece a un solo PROPIETARIO ABSOLUTO
                info_inmueble.inmueble_entero = true;
            }

            if (tipo_ventana_inmueble == "descripcion") {
                var contenido_inmueble = await inmueble_descripcion(codigo_inmueble);
                info_inmueble.descripcion_inmueble = true; // para pestaña y ventana apropiada para inmueble
                info_inmueble.contenido_inmueble = contenido_inmueble;

                // ------- Para verificación -------
                //console.log("DESCRIPCION INMUEBLE");
                //console.log(info_inmueble);

                res.render("adm_inmueble", info_inmueble);
            }

            // la pestaña de "fracciones" es visible solo para inmuebles del tipo FRACCIONADO
            if (tipo_ventana_inmueble == "fracciones") {
                var paquete_datos = {
                    codigo_inmueble,
                    codigo_usuario: "ninguno",
                };

                // para mostrar seleccinada la pestaña donde nos encontramos
                info_inmueble.fracciones_inmueble = true;

                var info_inmueble = await inmueble_fracciones(paquete_datos);
                info_inmueble.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de fracciones del inmueble");
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
                // para documentos propios del inmueble, no estan incluidos los documentos privados del dueño o copropietarios
                var contenido_inmueble = await inmueble_documentos(codigo_inmueble);
                info_inmueble.documentos_inmueble = true;
                info_inmueble.contenido_inmueble = contenido_inmueble;
                // ------- Para verificación -------
                //console.log("los datos de documentos del inmueble");
                //console.log(info_inmueble);
                res.render("adm_inmueble", info_inmueble);
            }

            // para PROPIETARIO de inmuebles enteros
            if (tipo_ventana_inmueble == "propietario") {
                var contenido_inmueble = await inmueble_propietario(codigo_inmueble);
                info_inmueble.propietario_inmueble = true; // para resaltar la pestaña navegacion
                info_inmueble.contenido_propietario = contenido_inmueble;

                // ------- Para verificación -------
                //console.log("informacion completa PROPIETARIO");
                //console.log(info_inmueble);
                // ------- Para verificación -------
                //console.log("informacion completa pagos_mensuales");
                //console.log(info_inmueble.contenido_propietario.propietario_pagos.pagos_mensuales);

                res.render("adm_inmueble", info_inmueble);
            }

            // para COPROPIETARIOS de inmuebles FRACCIONADOS
            if (tipo_ventana_inmueble == "copropietario") {
                var contenido_inmueble = await inmueble_copropietario(codigo_inmueble);
                info_inmueble.copropietario_inmueble = true; // para resaltar la pestaña navegacion
                info_inmueble.contenido = contenido_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de PAGOS inmueble");
                //console.log(info_inmueble);
                res.render("adm_inmueble", info_inmueble);
            }

            if (tipo_ventana_inmueble == "lista") {
                var contenido_inmueble = await inmueble_lista(codigo_inmueble);
                info_inmueble.lista_inmueble = true;
                info_inmueble.contenido_propietario = contenido_inmueble;
                // ------- Para verificación -------
                //console.log("los datos de PAGOS inmueble");
                //console.log(info_inmueble);
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
                financiado: 1,
                pagos_mensuales: 1,
                tipo_inmueble: 1,
                fraccionado: 1,
                fecha_fin_fraccionado: 1,
                torre: 1,
                piso: 1,
                puerta_inmueble: 1,
                superficie_inmueble_m2: 1,
                dormitorios_inmueble: 1,
                banos_inmueble: 1,
                garaje_inmueble: 1,
                precio_competencia: 1,
                precio_construccion: 1,
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
                _id: 0,
            }
        );

        if (registro_inmueble) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_inmueble);

            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            if (aux_objeto.fecha_fin_fraccionado) {
                let arrayFecha = aux_objeto.fecha_fin_fraccionado.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_fin_fraccionado = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_fin_fraccionado = "";
            }

            //------------------------------------------
            // para los inputs de departamentos tradicionales comparativos
            let direccion_comparativa = registro_inmueble.direccion_comparativa;
            let m2_comparativa = registro_inmueble.m2_comparativa;
            let precio_comparativa = registro_inmueble.precio_comparativa;

            if (
                direccion_comparativa.length > 0 &&
                m2_comparativa.length > 0 &&
                precio_comparativa.length > 0
            ) {
                // oblibatoriamente son 5 inmuebles TRADICIONALES, por tanto se procede al armado de estos datos:
                aux_objeto.tra_direccion_1 = direccion_comparativa[0];
                aux_objeto.tra_superficie_1 = Number(m2_comparativa[0]);
                aux_objeto.tra_precio_1 = Number(precio_comparativa[0]);

                aux_objeto.tra_direccion_2 = direccion_comparativa[1];
                aux_objeto.tra_superficie_2 = Number(m2_comparativa[1]);
                aux_objeto.tra_precio_2 = Number(precio_comparativa[1]);

                aux_objeto.tra_direccion_3 = direccion_comparativa[2];
                aux_objeto.tra_superficie_3 = Number(m2_comparativa[2]);
                aux_objeto.tra_precio_3 = Number(precio_comparativa[2]);

                aux_objeto.tra_direccion_4 = direccion_comparativa[3];
                aux_objeto.tra_superficie_4 = Number(m2_comparativa[3]);
                aux_objeto.tra_precio_4 = Number(precio_comparativa[3]);

                aux_objeto.tra_direccion_5 = direccion_comparativa[4];
                aux_objeto.tra_superficie_5 = Number(m2_comparativa[4]);
                aux_objeto.tra_precio_5 = Number(precio_comparativa[4]);

            }
            //------------------------------------------

            return aux_objeto;
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
                    ci_propietario, // ya esta como "ninguno"
                    tipo_navegacion: "administrador", // porque estamos dentro de un controlador administrador
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
        var contenedor_propietario = await datos_pagos_propietario(codigo_inmueble);

        return contenedor_propietario;
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_copropietario(codigo_inmueble) {
    try {
        // valores por defecto
        var fracciones_disponibles = [];
        var existen_disponibles = false;
        var precio_justo = 0;

        var ti_f_val = 0;
        var ti_f_val_render = "0";
        var ti_f_d_n = 0;
        var ti_f_d_n_render = "0";
        var ti_f_d_val = 0;
        var ti_f_d_val_render = "0";
        var ti_f_p_render = "0"; // %

        //-------------------------------------------------------
        var fracciones_inmueble = await indiceFraccionInmueble
            .find(
                { codigo_inmueble: codigo_inmueble, tipo: "copropietario" },
                {
                    fraccion_bs: 1,
                    disponible: 1, // true o false
                    _id: 0,
                }
            )
            .sort({ orden: 1 }); // ordenado del menor al mayor

        if (fracciones_inmueble.length > 0) {
            let k = -1;
            for (let i = 0; i < fracciones_inmueble.length; i++) {
                let fraccion_bs = fracciones_inmueble[i].fraccion_bs;
                let disponible = fracciones_inmueble[i].disponible;

                if (disponible === true) {
                    ti_f_d_n = ti_f_d_n + 1;
                    ti_f_d_val = ti_f_d_val + fraccion_bs;
                    k = k + 1;
                    fracciones_disponibles[k] = {
                        fraccion_bs: fraccion_bs,
                    };
                } else {
                    ti_f_val = ti_f_val + fraccion_bs;
                }
            }

            ti_f_val_render = numero_punto_coma(ti_f_val);

            if (ti_f_d_n > 0) {
                ti_f_d_n_render = numero_punto_coma(ti_f_d_n);
                ti_f_d_val_render = numero_punto_coma(ti_f_d_val);

                existen_disponibles = true;

                //--------------------------------------------------
                // para precio justo de inmueble

                let registro_inmueble = await indiceInmueble.findOne(
                    { codigo_inmueble: codigo_inmueble },
                    {
                        codigo_proyecto: 1,
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

                    let registro_proyecto = await indiceProyecto.findOne(
                        {
                            codigo_proyecto: registro_inmueble.codigo_proyecto,
                        },
                        {
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
                        precio_justo = resultado.precio_justo;

                        let p_financiamiento_render = resultado.p_financiamiento_render;

                        //--------------------------------------------------------------
                        ti_f_p_render = p_financiamiento_render;

                        //--------------------------------------------------
                    }
                }
            }
        }
        //-------------------------------------------------------

        var resultado = {
            fracciones_disponibles,
            existen_disponibles, // para permitir o negar la venta de fracciones
            precio_justo,
            //-----------------

            ti_f_val,
            ti_f_val_render,
            ti_f_d_n,
            ti_f_d_n_render,
            ti_f_d_val,
            ti_f_d_val_render,
            ti_f_p_render,
        };

        return resultado;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function inmueble_lista(codigo_inmueble) {
    // se mostrara listado de todos los copropietarios que tienen el inmueble.

    try {
        var contenedor_propietario = {};

        var arrayCopropietarios = await indiceFraccionInmueble
            .find(
                {
                    codigo_inmueble: codigo_inmueble,
                    disponible: false,
                    tipo: "copropietario",
                },
                {
                    codigo_fraccion: 1,
                    ci_propietario: 1,
                    fraccion_bs: 1,
                    fecha_copropietario: 1,
                    _id: 0,
                }
            )
            .sort({ fecha_copropietario: 1 }); // "1" ordenados de la fecha mas antiguo a las mas reciente

        if (arrayCopropietarios.length > 0) {
            // conversion del documento MONGO ([array]) a "string"
            var aux_string = JSON.stringify(arrayCopropietarios);
            // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
            var copropietarios_inmueble = JSON.parse(aux_string);

            // ahora los nombres de los propietarios
            for (let i = 0; i < arrayCopropietarios.length; i++) {
                var ci_propietario_i = arrayCopropietarios[i].ci_propietario;
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
                    copropietarios_inmueble[i].nombres_propietario =
                        propietario_inmueble.nombres_propietario;
                    copropietarios_inmueble[i].apellidos_propietario =
                        propietario_inmueble.apellidos_propietario;
                }
                //-----------------------------------------------
                // para la fecha en formato resumido
                // conversion de formato de fecha a ej/ domingo 28 Junio de 2023
                // PARA LA VENTANA DE INMUEBLE EN SU PESTAÑA PROPIETARIO
                moment.locale("es");
                copropietarios_inmueble[i].fecha_copropietario = moment
                    .utc(arrayCopropietarios[i].fecha_copropietario)
                    .format("LL"); // muestra solo fecha español
                //-----------------------------------------------
                copropietarios_inmueble[i].orden = i + 1;
            }
        } else {
            var copropietarios_inmueble = false; // para el each del handlebars
        }

        contenedor_propietario.copropietarios_inmueble = copropietarios_inmueble;
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
            if (aux_objeto.estado_inmueble == "construccion") {
                var texto_estado = "Construcción";
            }
            if (aux_objeto.estado_inmueble == "remate") {
                var texto_estado = "Remate";
            }
            if (aux_objeto.estado_inmueble == "construido") {
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
                // CLASE DE INMUEBLE

                let clase_inmueble = req.body.clase_inmueble;
                if (clase_inmueble == "fraccionado") {
                    inmuebleEncontrado.fraccionado = true;
                    inmuebleEncontrado.fecha_fin_fraccionado = req.body.fecha_fin_fraccionado;
                } else {
                    inmuebleEncontrado.fraccionado = false;
                }

                /**--------------------------------------------- */
                // INFORMACION BASICA html

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
                    Number(req.body.precio_bs_1),
                    Number(req.body.precio_bs_2),
                    Number(req.body.precio_bs_3),
                    Number(req.body.precio_bs_4),
                    Number(req.body.precio_bs_5),
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
                inmuebleEncontrado.precio_competencia = Math.round(
                    sum_precios / auxPrecioComparativa.length
                ); // es el promedio de los precios de la competencia
                // -------------------------------------------------------
                // guardado de CIUDAD a la que pertenece el inmueble

                var codigo_terreno = inmuebleEncontrado.codigo_terreno;

                var aux_terreno = await indiceTerreno.findOne(
                    {
                        codigo_terreno: codigo_terreno,
                    },
                    {
                        ciudad: 1,
                    }
                );

                if (aux_terreno) {
                    inmuebleEncontrado.ciudad = aux_terreno.ciudad;
                }
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
// SI BIEN DICE "ELIMINAR", ESTE CONTROLADOR SOLO ELIMINARA TODA LA DOCUMENTACION PRIVADA QUE TIENE EL PROPIETARIO CON EL INMUEBLE Y CAMBIARA SU ESTADO DEL REGISTRO DE INVERSIONES DE "ACTIVO" A "PASIVO", ESTA INFORMACION SE MANTENDRA, PORQUE SE NECESITA CONTAR CON LOS PAGOS QUE HIZO EL PROPIETARIO EN EL INMUEBLE, HASTA QUE SEA COMPLETAMENTE REEMPLAZADO POR UN NUEVO PROPIETARIO ACTIVO

controladorAdmInmueble.eliminarPropietarioInmueble = async (req, res) => {
    // la ruta que entra a este controlador es: post
    // "/laapirest/inmueble/:codigo_inmueble/accion/eliminar_propietario_inmueble"

    try {
        // ------- Para verificación -------
        //console.log("los datos del paquete de datos es:");
        //console.log(req.body);

        const ci_propietario = req.body.ci_propietario;
        const codigo_inmueble = req.body.codigo_inmueble;

        // -----------------------------------------------------------

        const registroInversion = await indiceInversiones.findOne({
            codigo_inmueble: codigo_inmueble,
            ci_propietario: ci_propietario,
        });

        if (registroInversion) {
            var acceso = await verificadorTerrenoBloqueado(registroInversion.codigo_terreno);

            if (acceso == "permitido") {
                const storage = getStorage();

                //--------------------------------------------------------
                // ELIMINACION DE LOS DOCUMENTOS PRIVADOS DEL INMUEBLE QUE TIENE CON SU PROPIETARIO
                // ASI SE AHORRA ESPACIO EN EL SERVIDOR

                var registroDocumentosPrivados = await indiceDocumentos.find({
                    codigo_inmueble: codigo_inmueble,
                    clase_documento: "Propietario",
                    ci_propietario: ci_propietario,
                });

                if (registroDocumentosPrivados) {
                    // eliminamos los ARCHIVOS DOCUMENTOS PDF uno por uno (sean publicos o privados)
                    for (let i = 0; i < registroDocumentosPrivados.length; i++) {
                        /*
                        let documentoNombreExtension =
                            registroDocumentosPrivados[i].codigo_documento + ".pdf";
                        // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                        await fs.unlink(
                            pache.resolve("./src/publico/subido/" + documentoNombreExtension)
                        ); // "+" es para concatenar
                        */

                        //--------------------------------------------------

                        //const storage = getStorage();

                        var nombre_y_ext = registroDocumentosPrivados[i].codigo_documento + ".pdf";

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
                    // luego de eliminar todos los ARCHIVOS DOCUMENTO, procedemos a ELIMINARLO DE LA BASE DE DATOS. Esto para ahorrar espacio en el servidor
                    await indiceDocumentos.deleteMany({
                        codigo_inmueble: codigo_inmueble,
                        clase_documento: "Propietario",
                        ci_propietario: ci_propietario,
                    }); // "deleteMany" para que elimine TODOS los que coinciden con las condiciones
                }

                //-------------------------------------------------------
                // NO SE ELIMINA EL REGISTRO DE LOS PAGOS DEL ACTUAL PROPIETARIO DEL INMUEBLE (que sera reemplazado por el nuevo), SOLO SE CAMBIARA EL ESTADO "estado_propietario" de "activo" a "pasivo"

                // guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
                await indiceInversiones.updateOne(
                    { codigo_inmueble: codigo_inmueble, ci_propietario: ci_propietario },
                    { $set: { estado_propietario: "pasivo" } }
                );

                //------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador =
                    "El propietario: " +
                    ci_propietario +
                    " de inmueble: " +
                    codigo_inmueble +
                    " fue eliminado";
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

/************************************************************************************** */
/************************************************************************************** */
// PARA CREAR FRACCIONES DEL INMUEBLE

controladorAdmInmueble.crearFraccionesInmueble = async (req, res) => {
    // la ruta que entra a este controlador es:
    // post   "/laapirest/inmueble/:codigo_inmueble/accion/crear_fracciones_inmueble"

    try {
        // ------- Para verificación -------
        console.log("los datos que se leen para CREAR FRACCIONES INMUEBLE");
        console.log(req.body);

        var codigo_inmueble = req.body.codigo_inmueble;
        var valor_fraccion = Number(req.body.valor_fraccion);
        var cantidad_fraccion = Number(req.body.cantidad_fraccion);

        let registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                codigo_proyecto: 1,
                fraccionado: 1,
                precio_construccion: 1,
                precio_competencia: 1,
                superficie_inmueble_m2: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            var acceso = await verificadorTerrenoBloqueado(registro_inmueble.codigo_terreno);
            if (acceso == "permitido") {
                if (registro_inmueble.fraccionado) {
                    // si es true
                    // si es un inmueble de la clase FRACCIONADO, entonces si admite la creacion de fracciones de inmueble

                    //--------------------------------------------------
                    // determinacion de la plusvalia en funcion a la participacion de la fraccion y el tiempo de plusvalia

                    var fraccion_bs_render = numero_punto_coma(Math.floor(valor_fraccion));

                    var aux_plusvalia = 0; // por defecto
                    var aux_dias_plusvalia = 0; // por defecto

                    let registro_terreno = await indiceTerreno.findOne(
                        { codigo_terreno: registro_inmueble.codigo_terreno },
                        {
                            fecha_inicio_construccion: 1,
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

                    //---------------------------------------------------------

                    let registro_proyecto = await indiceProyecto.findOne(
                        {
                            codigo_proyecto: codigo_proyecto,
                        },
                        {
                            construccion_mensual: 1,
                            _id: 0,
                        }
                    );

                    if (registro_terreno && registro_proyecto) {
                        let datos_inm = {
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
                        var plusvalia = resultado.plusvalia;

                        //---------------------------------------------------------

                        // con ese dato, determinaremos el %de participacion de la presente fraccion, para determinar la plusvalia que le corresponde a la presente fraccion
                        var participacion = valor_fraccion / precio_justo;

                        // redondeando al entero inmediato inferior
                        aux_plusvalia = Math.floor(participacion * plusvalia);

                        if (registro_terreno) {
                            let fecha_inicio_construccion =
                                registro_terreno.fecha_inicio_construccion;
                            let fecha_fin_construccion = registro_terreno.fecha_fin_construccion;
                            let milisegundos = fecha_fin_construccion - fecha_inicio_construccion;
                            let dias_plusvalia = milisegundos / (1000 * 60 * 60 * 24);
                            aux_dias_plusvalia = Math.floor(dias_plusvalia);
                        }

                        var aux_plusvalia_render = numero_punto_coma(aux_plusvalia);
                        var dias_plusvalia = numero_punto_coma(aux_dias_plusvalia);

                        //--------------------------------------------------

                        // revisamos si el inmueble ya presenta con fracciones de inmueble anteriores
                        let fracciones = await indiceFraccionInmueble.find(
                            { codigo_inmueble: codigo_inmueble },
                            { codigo_fraccion: 1, orden: 1 }
                        );

                        var array_codigos = []; // vacio por defecto
                        var array_orden = []; // vacio por defecto

                        var arrayFraccionesCreadas = []; // vacio por defecto

                        if (fracciones) {
                            for (let j = 0; j < fracciones.length; j++) {
                                array_codigos[j] = fracciones[j].codigo_fraccion;
                                array_orden[j] = fracciones[j].orden;
                            }
                        }

                        for (let i = 0; i < cantidad_fraccion; i++) {
                            var paqueteria = {
                                codigo_inmueble,
                                array_codigos,
                                array_orden,
                            };

                            var resultado_funcion = funcion_codigo_fraccion(paqueteria);

                            var codigo_fraccion = resultado_funcion.codigo_fraccion;
                            var orden = resultado_funcion.orden;

                            const fraccionInmueble = new indiceFraccionInmueble({
                                //-------------------------------
                                codigo_fraccion: codigo_fraccion,
                                codigo_terreno: registro_inmueble.codigo_terreno,
                                codigo_proyecto: registro_inmueble.codigo_proyecto,
                                codigo_inmueble: codigo_inmueble,
                                disponible: true,
                                orden: orden,
                                tipo: "copropietario",
                                fraccion_bs: valor_fraccion,
                                //-------------------------------
                            });

                            await fraccionInmueble.save();

                            //--------------------------------------------------------

                            let objeto = {
                                codigo_fraccion,
                                fraccion_bs: valor_fraccion,
                                fraccion_bs_render,
                                plusvalia: aux_plusvalia,
                                plusvalia_render: aux_plusvalia_render,
                                dias_plusvalia,
                            };
                            // El método unshift agrega uno o más elementos al principio del array. Esto para que la ordenacion renderizada en la ventana del navegador recorriendo el for se vea ordenadas secuencialemte las fracciones creadas
                            arrayFraccionesCreadas.unshift(objeto);
                            // usamos un array extra "arrayFraccionesCreadas" donde estaran los codigos de las fracciones de inmueble recientemente creadas, ya que "array_codigos" puede tener dentro de si codigos de fracciones antiguas creadas con anterioridad
                            //--------------------------------------------------------
                            // agregamos el nuevo codigo de fraccion y el nuevo orden en el array, para la creacion de nueva fraccion de inmueble
                            // El método push agrega uno o más elementos al final del array.

                            array_codigos.push(codigo_fraccion);
                            array_orden.push(orden);
                        } // fin for

                        //-------------------------------------------------------------------
                        // guardamos en el historial de acciones
                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var accion_administrador =
                            "Crea fracciones para el inmueble " + codigo_inmueble;
                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //-------------------------------------------------------------------

                        res.json({
                            exito: "si",
                            arrayFraccionesCreadas, // para renderizar las fracciones recientemente creadas
                        });
                    }
                } else {
                    // si no es un inmueble de la clase FRACCIONADO
                    res.json({
                        exito: "no_fracciones",
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SACAR DE LA PROMESA ESTE ELIMINADOR Y HACERLO FUNCIONAR APARTE

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
            const storage = getStorage();

            // eliminamos los ARCHIVOS DOCUMENTOS PDF uno por uno (sean publicos o privados del propietario dueño de este inmueble)
            for (let i = 0; i < registroDocumentosInmueble.length; i++) {
                /*
                let documentoNombreExtension =
                    registroDocumentosInmueble[i].codigo_documento + ".pdf";
                // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + documentoNombreExtension)); // "+" es para concatenar
                */

                //--------------------------------------------------

                //const storage = getStorage();

                var nombre_y_ext = registroDocumentosInmueble[i].codigo_documento + ".pdf";

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

//---------------------------------------------------------------------
// PARA crear el codigo unico de cada fraccion de inmueble
function funcion_codigo_fraccion(paqueteria) {
    var codigo_inmueble = paqueteria.codigo_inmueble;
    var array_codigos = paqueteria.array_codigos;
    var array_orden = paqueteria.array_orden;

    if (array_orden.length > 0) {
        var continuar = true;
        var aux_orden = 1;
        while (continuar) {
            // Condición para que el bucle continúe

            //----------------------------------------
            // El método includes devuelve true si el elemento está presente en el array.
            if (array_orden.includes(aux_orden)) {
                //console.log("El elemento existe en el array.");
                aux_orden = aux_orden + 1;
            } else {
                //console.log("El elemento no existe en el array.");

                // el elemento "aux_orden" es unico dentro del array

                // construimos el codigo de la fraccion:

                // Convertir el número a string
                var numeroComoString = aux_orden.toString();

                // Contar los caracteres
                var numeroDeCaracteres = numeroComoString.length;

                if (numeroDeCaracteres >= 3) {
                    var string_orden = numeroComoString;
                    var aux_codigo_fraccion = codigo_inmueble + string_orden;
                } else {
                    if ((numeroDeCaracteres = 1)) {
                        var string_orden = "00" + numeroComoString;
                        var aux_codigo_fraccion = codigo_inmueble + string_orden;
                    }
                    if ((numeroDeCaracteres = 2)) {
                        var string_orden = "0" + numeroComoString;
                        var aux_codigo_fraccion = codigo_inmueble + string_orden;
                    }
                }

                // por seguridad, revision de si el codigo de la fraccion es unico en el array de codigos
                // El método includes devuelve true si el elemento está presente en el array.
                if (array_codigos.includes(aux_codigo_fraccion)) {
                    //console.log("El elemento existe en el array.");
                    aux_orden = aux_orden + 1; // para que continue nuevamente con el while, ahora analizando con un nuevo aux_orden
                } else {
                    // el elemento "aux_codigo_fraccion" es unico dentro del array

                    var orden = aux_orden; // tipo numerico
                    var codigo_fraccion = aux_codigo_fraccion; // tipo string
                    continuar = false; // para salir del bucle while
                }
            }
        } // fin while

        // aqui ya contaremos con el "orden" y "codigo_fraccion" unicos
    } else {
        //significa que no existen codigos de inmueble, y por tanto sera creado la primera de todas
        var codigo_fraccion = codigo_inmueble + "001";
        var orden = 1;
    }

    var resultado = {
        codigo_fraccion,
        orden,
    };

    //resultado.estado = datos_terreno.estado_terreno;
    return resultado;
}

//---------------------------------------------------------------------

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorAdmInmueble;
