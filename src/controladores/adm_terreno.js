// TODO LO REFERENTE A LA PARTE DE TERRENO PARA ALBERGAR PROPUESTAS DE PROYECTOS
const pache = require("path");
const fs = require("fs-extra");
//const fileType = require("file-type");
//const moment = require("moment");
const { codigoAlfanumericoTerreno } = require("../ayudas/ayudaslibreria");

const {
    indiceTerreno,
    indiceImagenesTerreno,
    indiceProyecto,
    indiceImagenesProyecto,
    indiceDocumentos,
    indiceInmueble,
    indiceInversiones,
    indiceGuardados,
    indiceRequerimientos,
    indiceImagenesSistema,
} = require("../modelos/indicemodelo");

const {
    verificadorTerrenoBloqueado,
    verificadorLlavesMaestras,
    guardarAccionAdministrador,
    proyecto_card_adm_cli,
} = require("../ayudas/funcionesayuda_1");

const { cabezeras_adm_cli, pie_pagina_adm } = require("../ayudas/funcionesayuda_2");

const controladorAdmTerreno = {};

/************************************************************************************ */
/************************************************************************************ */
// PARA CREAR UN NUEVO CODIGO DE terreno

controladorAdmTerreno.crearNuevoTerreno = (req, res) => {
    // ruta POST  '/laapirest/terreno'
    generadorCodigoAlfaNumTerreno(); // este es el que recien ordenara ejecutar la funcion "generadorCodigoAlfaNumTerreno"

    async function generadorCodigoAlfaNumTerreno() {
        const codigoTerreno = codigoAlfanumericoTerreno();

        // revisamos en la base de datos si el codigo alfanumerico del terreno ya existe o no
        const vemosExistecodigoAlfaNumTerreno = await indiceTerreno.find({
            codigo_terreno: codigoTerreno,
        });

        if (vemosExistecodigoAlfaNumTerreno.length > 0) {
            // si se encuentra un terreno con el mismo codigo alfanumerico, entonces volvemos a ejecutar la funcion nuevamente, a esto se llama FUNCION RECURSIVA
            generadorCodigoAlfaNumTerreno();
        } else {
            // si aun no existe este codigo, devolvera asi "[]" (un [] vacio)

            // si el codigo generado es unico. Entonces procedemos a guardarlo en la base de datos del terreno que se creara

            const codigoNuevoTerreno = new indiceTerreno({
                codigo_terreno: codigoTerreno,
            });

            // ahora guardamos en la base de datos solo el codigo del terreno
            await codigoNuevoTerreno.save();

            //--------------------------------------------
            // guardamos en el historial de acciones
            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
            var accion_administrador = "Crea terreno " + codigoTerreno;

            var aux_accion_adm = {
                ci_administrador,
                accion_administrador,
            };
            await guardarAccionAdministrador(aux_accion_adm);
            //--------------------------------------------
        }

        res.redirect("/laapirest/terreno/" + codigoTerreno + "/descripcion"); // para renderizar la ventana del nuevo terreno, recuerde que "redirect" es GET por defecto
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA RENDERIZAR LA VENTANA DEL TERRENO segun la pestaña que sea elegida

// RUTA   "get"  /laapirest/terreno/:codigo_terreno/:ventana_terreno
controladorAdmTerreno.renderizarVentanaTerreno = async (req, res) => {
    try {
        var codigo_terreno = req.params.codigo_terreno;
        var tipo_ventana_terreno = req.params.ventana_terreno;

        var terrenoExiste = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                _id: 0,
            }
        );

        if (terrenoExiste) {
            // VERIFICAMOS QUE EL TERRENO EXISTA EN LA BASE DE DATOS
            // ------- Para verificación -------
            //console.log("el codigo del terreno es:");
            //console.log(codigo_terreno);
            // ------- Para verificación -------
            //console.log("tipo de vista del terreno es:");
            //console.log(tipo_ventana_terreno);

            var info_terreno = {};
            info_terreno.cab_te_adm = true;

            //info_terreno.estilo_cabezera = "cabezera_estilo_terreno";

            //----------------------------------------------------
            // para la url de la cabezera
            var url_cabezera = ""; // vacio por defecto
            const registro_cabezera = await indiceImagenesSistema.findOne(
                { tipo_imagen: "cabezera_terreno" },
                {
                    url: 1,
                    _id: 0,
                }
            );

            if (registro_cabezera) {
                url_cabezera = registro_cabezera.url;
            }

            info_terreno.url_cabezera = url_cabezera;

            //----------------------------------------------------

            info_terreno.codigo_terreno = codigo_terreno;

            var aux_cabezera = {
                codigo_objetivo: codigo_terreno,
                tipo: "terreno",
                lado: "administrador",
            };

            info_terreno.es_terreno = true; // para menu navegacion comprimido

            var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
            info_terreno.cabezera_adm = cabezera_adm;

            var pie_pagina = await pie_pagina_adm();
            info_terreno.pie_pagina_adm = pie_pagina;

            if (tipo_ventana_terreno == "descripcion") {
                var contenido_terreno = await terreno_descripcion(codigo_terreno);
                info_terreno.descripcion_terreno = true; // para pestaña y ventana apropiada para terreno

                info_terreno.contenido_terreno = contenido_terreno;

                res.render("adm_terreno", info_terreno);
            }

            if (tipo_ventana_terreno == "imagenes") {
                var contenido_terreno = await terreno_imagenes(codigo_terreno);
                info_terreno.imagenes_terreno = true; // para pestaña y ventana apropiada para terreno

                info_terreno.contenido_terreno = contenido_terreno;
                info_terreno.codigo_objetivo = contenido_terreno;

                // ------- Para verificación -------
                //console.log("los datos info de terreno son");
                //console.log(info_terreno);
                res.render("adm_terreno", info_terreno);
            }

            if (tipo_ventana_terreno == "documentos") {
                var contenido_terreno = await terreno_documentos(codigo_terreno);
                info_terreno.documentos_terreno = true; // para pestaña y ventana apropiada para terreno

                info_terreno.contenido_terreno = contenido_terreno;

                res.render("adm_terreno", info_terreno);
            }

            if (tipo_ventana_terreno == "proyectos") {
                var contenido_terreno = await terreno_proyectos(codigo_terreno);
                info_terreno.proyectos_terreno = true; // para pestaña y ventana apropiada para terreno

                info_terreno.contenido_terreno = contenido_terreno;

                // ------- Para verificación -------

                //console.log("VENTANA DE PROYECTOS  DEL TERRENO");
                //console.log(info_terreno);

                res.render("adm_terreno", info_terreno);
            }

            if (tipo_ventana_terreno == "estados") {
                var contenido_terreno = await terreno_estados(codigo_terreno);
                info_terreno.estados_terreno = true; // para pestaña y ventana apropiada para terreno
                info_terreno.contenido_terreno = contenido_terreno;
                // ------- Para verificación -------
                //console.log("la info de estado del terreno");
                //console.log(info_terreno);
                res.render("adm_terreno", info_terreno);
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN TERRENO INEXISTENTE.
            res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------

async function terreno_descripcion(codigo_terreno) {
    try {
        const registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                proyecto_ganador: 1,
                bandera_ciudad: 1,
                fecha_inicio_reserva: 1,
                fecha_fin_reserva: 1,
                fecha_inicio_aprobacion: 1,
                fecha_fin_aprobacion: 1,
                fecha_inicio_pago: 1,
                fecha_fin_pago: 1,
                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,
                ciudad: 1,
                provincia: 1,
                direccion: 1,
                precio_sus: 1,
                anteproyectos_maximo: 1,
                superficie: 1,
                maximo_pisos: 1,
                convocatoria: 1,
                importante: 1,
                descri_ubi_terreno: 1,
                titulo_ubi_otros_1: 1,
                ubi_otros_1: 1,
                titulo_ubi_otros_2: 1,
                ubi_otros_2: 1,
                titulo_ubi_otros_3: 1,
                ubi_otros_3: 1,
                link_googlemap: 1,
                link_youtube: 1,
                link_facebook: 1,
                link_instagram: 1,
                link_tiktok: 1,
                _id: 0,
            }
        );

        if (registro_terreno) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_terreno);

            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            // AQUI no existe necesidad de convertir los numeros a formato 1.000,02 (solo se hara para cliente)
            // solo es necesario convertir la fecha MONGO a fecha JS (NOTE como con "aux_objeto" que fue reconvertido a OBJETO, ahora si es posible añadir propiedades a este objeto)
            if (aux_objeto.fecha_inicio_reserva) {
                let arrayFecha = aux_objeto.fecha_inicio_reserva.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_inicio_reserva = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_inicio_reserva = "";
            }

            if (aux_objeto.fecha_fin_reserva) {
                let arrayFecha = aux_objeto.fecha_fin_reserva.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_fin_reserva = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_fin_reserva = "";
            }

            if (aux_objeto.fecha_inicio_aprobacion) {
                let arrayFecha = aux_objeto.fecha_inicio_aprobacion.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_inicio_aprobacion = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_inicio_aprobacion = "";
            }

            if (aux_objeto.fecha_fin_aprobacion) {
                let arrayFecha = aux_objeto.fecha_fin_aprobacion.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_fin_aprobacion = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_fin_aprobacion = "";
            }

            if (aux_objeto.fecha_inicio_pago) {
                let arrayFecha = aux_objeto.fecha_inicio_pago.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_inicio_pago = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_inicio_pago = "";
            }

            if (aux_objeto.fecha_fin_pago) {
                let arrayFecha = aux_objeto.fecha_fin_pago.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_fin_pago = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_fin_pago = "";
            }

            if (aux_objeto.fecha_inicio_construccion) {
                let arrayFecha = aux_objeto.fecha_inicio_construccion.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_inicio_construccion = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_inicio_construccion = "";
            }

            if (aux_objeto.fecha_fin_construccion) {
                let arrayFecha = aux_objeto.fecha_fin_construccion.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_fin_construccion = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_fin_construccion = "";
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
async function terreno_imagenes(codigo_terreno) {
    try {
        const registro_terreno = await indiceImagenesTerreno.find(
            { codigo_terreno: codigo_terreno },
            {
                nombre_imagen: 1,
                codigo_imagen: 1,
                extension_imagen: 1,
                imagen_principal: 1, // true || false
                url: 1,
                _id: 0,
            }
        );

        var array_imagenes_principal_te = []; // aunque solo exista una sola imagen principal, esta sera guardada en un array
        var array_imagenes_exclusivas_te = [];

        if (registro_terreno.length > 0) {
            // conversion del documento MONGO ([ARRAY]) a "string"
            var aux_string = JSON.stringify(registro_terreno);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            var posi_p = -1;
            var posi_e = -1;

            for (let i = 0; i < aux_objeto.length; i++) {
                if (aux_objeto[i].imagen_principal) {
                    posi_p = posi_p + 1;
                    array_imagenes_principal_te[posi_p] = {
                        nombre_imagen: aux_objeto[i].nombre_imagen,
                        codigo_imagen: aux_objeto[i].codigo_imagen,
                        extension_imagen: aux_objeto[i].extension_imagen,
                        codigo_terreno,
                        url:aux_objeto[i].url,
                    };
                } else {
                    posi_e = posi_e + 1;
                    array_imagenes_exclusivas_te[posi_e] = {
                        nombre_imagen: aux_objeto[i].nombre_imagen,
                        codigo_imagen: aux_objeto[i].codigo_imagen,
                        extension_imagen: aux_objeto[i].extension_imagen,
                        codigo_terreno,
                        url:aux_objeto[i].url,
                    };
                }
            }
        }

        var contenido_img_te = {};
        contenido_img_te.imagenes_principal_te = array_imagenes_principal_te;
        contenido_img_te.imagenes_exclusivas_te = array_imagenes_exclusivas_te;

        return contenido_img_te;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------
async function terreno_documentos(codigo_terreno) {
    try {
        const registro_terreno = await indiceDocumentos.find(
            { codigo_terreno: codigo_terreno, codigo_proyecto: "", codigo_inmueble: "" },
            {
                nombre_documento: 1,
                codigo_documento: 1,
                clase_documento: 1,
                url: 1,
                _id: 0,
            }
        );

        if (registro_terreno.length > 0) {
            // conversion del documento MONGO ([ARRAY]) a "string"
            var aux_string = JSON.stringify(registro_terreno);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            return aux_objeto;

            // no es reconocido en handlebars, si se hace el return de "registro_terreno" extraido directamente de la base de datos sin conversiones
            // return registro_terreno;
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
        // como estamos en el lado del administrador, entonces "visible: true" no sera necesario ponerlo, porque este solo estara puesto para lado CLIENTE
        var proyectos_terreno = await indiceProyecto.find(
            { codigo_terreno: codigo_terreno },
            {
                codigo_proyecto: 1,
                _id: 0,
            }
        );

        var terreno_proyectos = []; // vacio de inicio
        if (proyectos_terreno.length > 0) {
            for (let i = 0; i < proyectos_terreno.length; i++) {
                var codigo_proyecto_i = proyectos_terreno[i].codigo_proyecto;
                var laapirest = "/laapirest/"; // por partir desde el lado del ADMINISTRADOR
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

//------------------------------------------------------------------
async function terreno_estados(codigo_terreno) {
    try {
        const registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                estado_terreno: 1,
                acceso_bloqueado: 1,
                _id: 0,
            }
        );

        if (registro_terreno) {
            // conversion del documento MONGO ({objeto}) a "string"
            var aux_string = JSON.stringify(registro_terreno);
            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            if (aux_objeto.acceso_bloqueado == true) {
                aux_objeto.te_bloq_desbloq = "bloqueado";
            }
            if (aux_objeto.acceso_bloqueado == false) {
                aux_objeto.te_bloq_desbloq = "desbloqueado";
            }

            if (aux_objeto.estado_terreno == "guardado") {
                var texto_estado = "Guardado";
            }
            if (aux_objeto.estado_terreno == "reserva") {
                var texto_estado = "Reserva";
            }
            if (aux_objeto.estado_terreno == "aprobacion") {
                var texto_estado = "Aprobación";
            }
            if (aux_objeto.estado_terreno == "pago") {
                var texto_estado = "Pago";
            }
            if (aux_objeto.estado_terreno == "construccion") {
                var texto_estado = "Construcción";
            }
            if (aux_objeto.estado_terreno == "construido") {
                var texto_estado = "Construido";
            }

            aux_objeto.texto_estado_terreno = texto_estado;
            return aux_objeto;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

/************************************************************************************ */
// PARA GUARDAR DATOS DE FORMULARIO DE DESCRIPCION DEL TERRENO

// RUTA   "post"  /laapirest/terreno/:codigo_terreno/accion/guardar_descripcion
controladorAdmTerreno.guardarDescripcionTerreno = async (req, res) => {
    try {
        const codigo_terreno = req.params.codigo_terreno; // "codigo_terreno" respetando el nombre como esta puesto en la ruta ( /:codigo_terreno )

        var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

        if (acceso == "permitido") {
            var terreno_encontrado = await indiceTerreno.findOne({
                codigo_terreno: codigo_terreno,
            });
            if (terreno_encontrado) {
                // ------- Para verificación -------
                //console.log("vemos los datos llegados de REQ.BODY");
                //console.log(req.body);
                /**--------------------------------------------- */
                // INFORMACION BASICA html

                terreno_encontrado.anteproyectos_maximo = req.body.anteproyectos_maximo;
                terreno_encontrado.fecha_inicio_reserva = req.body.fecha_inicio_reserva;
                terreno_encontrado.fecha_fin_reserva = req.body.fecha_fin_reserva;
                terreno_encontrado.fecha_inicio_aprobacion = req.body.fecha_inicio_aprobacion;
                terreno_encontrado.fecha_fin_aprobacion = req.body.fecha_fin_aprobacion;
                terreno_encontrado.fecha_inicio_pago = req.body.fecha_inicio_pago;
                terreno_encontrado.fecha_fin_pago = req.body.fecha_fin_pago;
                terreno_encontrado.fecha_inicio_construccion = req.body.fecha_inicio_construccion;
                terreno_encontrado.fecha_fin_construccion = req.body.fecha_fin_construccion;
                terreno_encontrado.ciudad = req.body.ciudad;
                terreno_encontrado.bandera_ciudad = req.body.bandera_ciudad;
                terreno_encontrado.convocatoria = req.body.convocatoria;
                terreno_encontrado.importante = req.body.importante;
                terreno_encontrado.provincia = req.body.provincia;
                terreno_encontrado.direccion = req.body.direccion;
                terreno_encontrado.precio_sus = req.body.precio_sus;
                terreno_encontrado.superficie = req.body.superficie;
                terreno_encontrado.anteproyectos_maximo = req.body.anteproyectos_maximo;
                terreno_encontrado.maximo_pisos = req.body.maximo_pisos;
                terreno_encontrado.descri_ubi_terreno = req.body.descri_ubi_terreno;
                terreno_encontrado.titulo_ubi_otros_1 = req.body.titulo_ubi_otros_1;
                terreno_encontrado.ubi_otros_1 = req.body.ubi_otros_1;
                terreno_encontrado.titulo_ubi_otros_2 = req.body.titulo_ubi_otros_2;
                terreno_encontrado.ubi_otros_2 = req.body.ubi_otros_2;
                terreno_encontrado.titulo_ubi_otros_3 = req.body.titulo_ubi_otros_3;
                terreno_encontrado.ubi_otros_3 = req.body.ubi_otros_3;
                terreno_encontrado.link_googlemap = req.body.link_googlemap;
                terreno_encontrado.link_youtube = req.body.link_youtube;
                terreno_encontrado.link_facebook = req.body.link_facebook;
                terreno_encontrado.link_instagram = req.body.link_instagram;
                terreno_encontrado.link_tiktok = req.body.link_tiktok;

                // LOS DATOS LLENADOS EN EL FORMULARIO, SERAN GUARDADOS EN LA BASE DE DATOS
                await terreno_encontrado.save();

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "Guarda descripción terreno " + codigo_terreno;
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
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// PARA GUARDAR ESTADO DEL TERRENO

// RUTA   "post"  /laapirest/terreno/:codigo_terreno/accion/guardar_estado
controladorAdmTerreno.guardarEstadoTerreno = async (req, res) => {
    try {
        const codigo_terreno = req.params.codigo_terreno; // "codigo_terreno" respetando el nombre como esta puesto en la ruta ( /:codigo_terreno )
        const estado_seleccionado = req.body.estado_seleccionado;

        // ------- Para verificación -------
        //console.log("el paquete de datos del terrno es:");
        //console.log(req.body);
        // ------- Para verificación -------
        //console.log("el nuevo estado del terreno es:");
        //console.log(estado_seleccionado);

        var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

        if (acceso == "permitido") {
            const registro_terreno = await indiceTerreno.findOne({
                codigo_terreno: codigo_terreno,
            });
            if (registro_terreno) {
                await indiceTerreno.updateOne(
                    { codigo_terreno: codigo_terreno },
                    { $set: { estado_terreno: estado_seleccionado } }
                ); // guardamos el registro con el dato modificado

                if (estado_seleccionado == "guardado") {
                    await indiceTerreno.updateOne(
                        { codigo_terreno: codigo_terreno },
                        { $set: { fecha_creacion: new Date() } }
                    ); // guardamos la fecha de guardado del terreno
                }
                //--------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador =
                    "Guarda estado de terreno " + codigo_terreno + "a " + estado_seleccionado;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //--------------------------------------------

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
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// CONTROLADOR PARA GUARDAR EL CAMBIO DE "BLOQUEO" o "DESBLOQUEO" del TERRENO

controladorAdmTerreno.guardarBloqueoDesbloqueoTerreno = async (req, res) => {
    // ruta   POST  /laapirest/terreno/:codigo_terreno/accion/guardar_bloqueo_desbloqueo

    try {
        const codigo_terreno = req.params.codigo_terreno;
        const radio_seleccionado = req.body.radio_seleccionado;
        const usuario_maestro = req.body.usuario_maestro;
        const clave_maestro = req.body.clave_maestro;
        // AQUI SE PERMITE EL CAMBIO DE BLOQUEO O DESBLOQUEO DEL PROYECTO, POR TANTO NO ES NECESARIO VERIFICAR SI EL PROYECTO ESTA O NO BLOQUEADO, SOLO SE DEBE VERIFICAR QUE LAS CLAVES MAESTRAS SON LAS CORRECTAS

        var paquete_datos = {
            usuario_maestro,
            clave_maestro,
        };
        var llaves_maestras = await verificadorLlavesMaestras(paquete_datos);
        if (llaves_maestras) {
            var terreno_encontrado = await indiceTerreno.findOne({
                codigo_terreno: codigo_terreno,
            });
            if (terreno_encontrado) {
                if (radio_seleccionado == "bloqueado") {
                    await indiceTerreno.updateOne(
                        { codigo_terreno: codigo_terreno },
                        { $set: { acceso_bloqueado: true } }
                    ); // guardamos el registro con el dato modificado
                    /*
                    terreno_encontrado.acceso_bloqueado = true;
                    await terreno_encontrado.save();
                    */
                }
                if (radio_seleccionado == "desbloqueado") {
                    await indiceTerreno.updateOne(
                        { codigo_terreno: codigo_terreno },
                        { $set: { acceso_bloqueado: false } }
                    ); // guardamos el registro con el dato modificado
                    /*
                    terreno_encontrado.acceso_bloqueado = false;
                    await terreno_encontrado.save();
                    */
                }

                //--------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = radio_seleccionado + " terreno " + codigo_terreno;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //--------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                res.json({
                    exito: "no",
                });
            }
        } else {
            res.json({
                exito: "no_maestro",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// CONTROLADOR PARA ELIMINAR TERRENO

controladorAdmTerreno.eliminarTerreno = async (req, res) => {
    // ruta   delete  "/laapirest/terreno/:codigo_terreno/accion/eliminar_terreno"
    try {
        const codigo_terreno = req.params.codigo_terreno;
        const usuario_maestro = req.body.usuario_maestro;
        const clave_maestro = req.body.clave_maestro;

        var paquete_datos = {
            usuario_maestro,
            clave_maestro,
        };
        var llaves_maestras = await verificadorLlavesMaestras(paquete_datos);
        if (llaves_maestras) {
            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

            if (acceso == "permitido") {
                // obviamente si se ingresa a este condicional, es porque el terreno existe en la base de datos, de manera que no es necesario verificarlo nuevamente

                // todos seran ejecutados al mismo tiempo (de manera paralela, para ello se hace uso de PROMISE.ALL)
                var resultadoEliminador = await Promise.all([
                    // al elimiar inmuebles, tambien estos deberan ser borrados de la lista de los propietarios
                    eliminadorImagenesTerreno(codigo_terreno),
                    eliminadorDocumentosTerreno(codigo_terreno),
                    eliminadorPyInmGuarTerreno(codigo_terreno),
                    eliminadorRequerimientos(codigo_terreno),
                ]);

                if (
                    resultadoEliminador[0] == "ok" &&
                    resultadoEliminador[1] == "ok" &&
                    resultadoEliminador[2] == "ok" &&
                    resultadoEliminador[3] == "ok"
                ) {
                    // si todos fueron eliminados satisfactoriamente
                    // AQUI RECIEN SE ELIMINARA EL PROYECTO DE LA BASE DE DATOS
                    // await indiceTerreno.remove({ codigo_terreno: codigo_terreno }); // no usamos remove para no caer en problemas de su caducidad
                    await indiceTerreno.deleteOne({ codigo_terreno: codigo_terreno });

                    //--------------------------------------------
                    // guardamos en el historial de acciones
                    var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                    var accion_administrador = "Elimina terreno " + codigo_terreno;
                    var aux_accion_adm = {
                        ci_administrador,
                        accion_administrador,
                    };
                    await guardarAccionAdministrador(aux_accion_adm);
                    //--------------------------------------------

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
                exito: "no_maestro",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//-----------------------------------------------------------------

async function eliminadorImagenesTerreno(codigo_terreno) {
    try {
        const registroImagenesTerreno = await indiceImagenesTerreno.find({
            codigo_terreno: codigo_terreno,
        });
        const registroImagenesProyecto = await indiceImagenesProyecto.find({
            codigo_terreno: codigo_terreno, // codigo_terreno esta OK
        });

        if (registroImagenesTerreno) {
            // eliminamos los ARCHIVOS IMAGEN uno por uno
            for (let i = 0; i < registroImagenesTerreno.length; i++) {
                let imagenNombreExtension =
                    registroImagenesTerreno[i].codigo_imagen +
                    registroImagenesTerreno[i].extension_imagen;
                // eliminamos el ARCHIVO IMAGEN DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + imagenNombreExtension)); // "+" es para concatenar
            }
            // luego de eliminar todos los ARCHIVOS IMAGEN, procedemos a ELIMINARLO DE LA BASE DE DATOS
            // await indiceImagenesTerreno.remove({ codigo_terreno: codigo_terreno }); // no usamos remove para no tener problemas con su caducidad
            // notese que aqui eliminamos TODOS de manera directa en funcion a los que tienen el dato "codigo_terreno: codigo_terreno "
            await indiceImagenesTerreno.deleteMany({ codigo_terreno: codigo_terreno }); // usamos "deleteMany" para eliminar TODOS los que cumplan con la condicion: codigo_terreno: codigo_terreno
        }
        if (registroImagenesProyecto) {
            // eliminamos los ARCHIVOS IMAGEN uno por uno
            for (let i = 0; i < registroImagenesProyecto.length; i++) {
                let imagenNombreExtension =
                    registroImagenesProyecto[i].codigo_imagen +
                    registroImagenesProyecto[i].extension_imagen;
                // eliminamos el ARCHIVO IMAGEN DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + imagenNombreExtension)); // "+" es para concatenar
            }

            // await indiceImagenesProyecto.remove({ codigo_terreno: codigo_terreno }); // no usamos remove para no tener problemas con su caducidad

            await indiceImagenesProyecto.deleteMany({ codigo_terreno: codigo_terreno }); // usamos "deleteMany" para eliminar TODOS los que cumplan con la condicion: codigo_terreno: codigo_terreno
        }
        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------

async function eliminadorDocumentosTerreno(codigo_terreno) {
    try {
        // se eliminaran todos los documentos que tienen relacion con el TERRENO, sean estos documentos propios de proyectos o inmuebles (en inmuebles documentos publicos o privados)
        const registroDocumentosTerreno = await indiceDocumentos.find({
            codigo_terreno: codigo_terreno,
        });

        if (registroDocumentosTerreno) {
            // eliminamos los ARCHIVOS DOCUMENTOS PDF uno por uno
            for (let i = 0; i < registroDocumentosTerreno.length; i++) {
                let documentoNombreExtension =
                    registroDocumentosTerreno[i].codigo_documento + ".pdf";
                // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + documentoNombreExtension)); // "+" es para concatenar
            }
            // luego de eliminar todos los ARCHIVOS DOCUMENTO, procedemos a ELIMINARLO DE LA BASE DE DATOS
            // await indiceDocumentos.remove({ codigo_terreno: codigo_terreno });
            await indiceDocumentos.deleteMany({ codigo_terreno: codigo_terreno });
            // notese que aqui eliminamos TODOS (usando deleteMany) de manera directa en funcion a los que tienen el dato "codigo_terreno: codigo_terreno "
        }
        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------

async function eliminadorPyInmGuarTerreno(codigo_terreno) {
    try {
        // dejamos de usar remove para no tener problemas con su caducidad, en su lugar usamos "deleteMany"
        // await indiceProyecto.remove({ codigo_terreno: codigo_terreno });
        // await indiceInmueble.remove({ codigo_terreno: codigo_terreno });
        // await indiceGuardados.remove({ codigo_terreno: codigo_terreno });
        // await indiceInversiones.remove({ codigo_terreno: codigo_terreno });

        await indiceProyecto.deleteMany({ codigo_terreno: codigo_terreno });
        await indiceInmueble.deleteMany({ codigo_terreno: codigo_terreno });
        await indiceGuardados.deleteMany({ codigo_terreno: codigo_terreno });
        await indiceInversiones.deleteMany({ codigo_terreno: codigo_terreno });

        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------
async function eliminadorRequerimientos(codigo_terreno) {
    try {
        await indiceRequerimientos.deleteMany({ codigo_terreno: codigo_terreno }); // esta con "codigo_terreno" ok

        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorAdmTerreno;
