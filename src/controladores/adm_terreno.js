// TODO LO REFERENTE A LA PARTE DE TERRENO PARA ALBERGAR PROPUESTAS DE PROYECTOS
//const pache = require("path");
//const fs = require("fs-extra");

//const fileType = require("file-type");
//const moment = require("moment");

const { getStorage, ref, deleteObject } = require("firebase/storage");

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
    indiceFraccionTerreno,
    indiceFraccionInmueble,
} = require("../modelos/indicemodelo");

const {
    verificadorTerrenoBloqueado,
    verificadorLlavesMaestras,
    guardarAccionAdministrador,
    proyecto_card_adm_cli,
    fraccion_card_adm_cli,
} = require("../ayudas/funcionesayuda_1");

const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");
const { cabezeras_adm_cli } = require("../ayudas/funcionesayuda_2");

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

            info_terreno.estilo_cabezera = "cabezera_estilo_terreno";

            //----------------------------------------------------

            info_terreno.codigo_terreno = codigo_terreno;

            var aux_cabezera = {
                codigo_objetivo: codigo_terreno,
                tipo: "terreno",
            };

            info_terreno.es_terreno = true; // para menu navegacion comprimido

            var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
            info_terreno.cabezera_adm = cabezera_adm;

            if (tipo_ventana_terreno == "descripcion") {
                var contenido_terreno = await terreno_descripcion(codigo_terreno);
                info_terreno.descripcion_terreno = true; // para pestaña y ventana apropiada para terreno

                info_terreno.contenido_terreno = contenido_terreno;

                res.render("adm_terreno", info_terreno);
            }

            if (tipo_ventana_terreno == "fracciones") {
                var contenido_terreno = await terreno_fracciones(codigo_terreno);
                info_terreno.fracciones_terreno = true; // para pestaña y ventana apropiada para terreno
                info_terreno.contenido_terreno = contenido_terreno;

                // ------- Para verificación -------
                // console.log("FRACCIONES DE TERRENO");
                // console.log(info_terreno);

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

            // para COPROPIETARIOS de TERRENO
            if (tipo_ventana_terreno == "copropietario") {
                var contenido = await terreno_copropietario(codigo_terreno);
                info_terreno.copropietario_terreno = true; // para resaltar la pestaña navegacion
                info_terreno.contenido = contenido;

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
                nombre: 1,
                bandera_ciudad: 1,
                fraccion_bs:1,
                rend_fraccion_mensual:1,
                rend_fraccion_total:1,
                dias_maximo:1,
                meses_maximo:1,

                direccion_comparativa: 1,
                m2_comparativa: 1,
                precio_comparativa: 1,

                fecha_inicio_convocatoria: 1,
                fecha_fin_convocatoria: 1,
                fecha_inicio_anteproyecto: 1,
                fecha_fin_anteproyecto: 1,
                fecha_inicio_reservacion: 1,
                fecha_fin_reservacion: 1,
                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,

                ciudad: 1,
                ubicacion: 1,
                provincia: 1,
                direccion: 1,
                precio_bs: 1,
                descuento_bs: 1,
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
            if (aux_objeto.fecha_inicio_reservacion) {
                let arrayFecha = aux_objeto.fecha_inicio_reservacion.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_inicio_reservacion = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_inicio_reservacion = "";
            }

            if (aux_objeto.fecha_fin_reservacion) {
                let arrayFecha = aux_objeto.fecha_fin_reservacion.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_fin_reservacion = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_fin_reservacion = "";
            }

            if (aux_objeto.fecha_inicio_convocatoria) {
                let arrayFecha = aux_objeto.fecha_inicio_convocatoria.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_inicio_convocatoria = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_inicio_convocatoria = "";
            }

            if (aux_objeto.fecha_fin_convocatoria) {
                let arrayFecha = aux_objeto.fecha_fin_convocatoria.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_fin_convocatoria = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_fin_convocatoria = "";
            }

            if (aux_objeto.fecha_inicio_anteproyecto) {
                let arrayFecha = aux_objeto.fecha_inicio_anteproyecto.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_inicio_anteproyecto = arrayFecha[0]; // nos devolvera "2010-10-10" (año-mes-dia) y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_inicio_anteproyecto = "";
            }

            if (aux_objeto.fecha_fin_anteproyecto) {
                let arrayFecha = aux_objeto.fecha_fin_anteproyecto.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                aux_objeto.fecha_fin_anteproyecto = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"
            } else {
                aux_objeto.fecha_fin_anteproyecto = "";
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

            //------------------------------------------
            // para los inputs de departamentos tradicionales comparativos
            let direccion_comparativa = registro_terreno.direccion_comparativa;
            let m2_comparativa = registro_terreno.m2_comparativa;
            let precio_comparativa = registro_terreno.precio_comparativa;

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

async function terreno_fracciones(codigo_terreno) {
    try {
        var fracciones_terreno = await indiceFraccionTerreno
            .find(
                { codigo_terreno: codigo_terreno },
                {
                    codigo_fraccion: 1,
                    _id: 0,
                }
            )
            .sort({ orden: 1 }); // ordenado del menor al mayor

        if (fracciones_terreno.length > 0) {
            var crear_fracciones = false;
            var eliminar_fracciones = true;
            var terreno_fracciones = []; // vacio de inicio

            for (let i = 0; i < fracciones_terreno.length; i++) {
                var codigo_fraccion_i = fracciones_terreno[i].codigo_fraccion;

                var paquete_fraccion = {
                    codigo_fraccion: codigo_fraccion_i,
                    ci_propietario: "ninguno",
                    tipo_navegacion: "administrador", // porque estamos dentro de un controlador administrador
                };

                var card_fraccion_i = await fraccion_card_adm_cli(paquete_fraccion);
                terreno_fracciones[i] = card_fraccion_i;
            }
        } else {
            var crear_fracciones = true; // por defecto
            var eliminar_fracciones = false; // por defecto
            var terreno_fracciones = []; // vacio
        }

        var contenido_fracciones = {
            crear_fracciones,
            eliminar_fracciones,
            terreno_fracciones,
        };

        return contenido_fracciones;
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
                        url: aux_objeto[i].url,
                    };
                } else {
                    posi_e = posi_e + 1;
                    array_imagenes_exclusivas_te[posi_e] = {
                        nombre_imagen: aux_objeto[i].nombre_imagen,
                        codigo_imagen: aux_objeto[i].codigo_imagen,
                        extension_imagen: aux_objeto[i].extension_imagen,
                        codigo_terreno,
                        url: aux_objeto[i].url,
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
async function terreno_copropietario(codigo_terreno) {
    try {
        // valores por defecto
        var fracciones_disponibles = [];
        var existen_disponibles = false;
        var precio_terreno = 0;

        var ti_f_val = 0;
        var ti_f_val_render = "0";

        var ti_f_d_n = 0;
        var ti_f_d_n_render = "0";
        var ti_f_d_val = 0;
        var ti_f_d_val_render = "0";
        var ti_f_p_render = "0"; // %

        //-------------------------------------------------------
        var fracciones_terreno = await indiceFraccionTerreno
            .find(
                { codigo_terreno: codigo_terreno },
                {
                    fraccion_bs: 1,
                    disponible: 1, // true o false
                    _id: 0,
                }
            )
            .sort({ orden: 1 }); // ordenado del menor al mayor

        if (fracciones_terreno.length > 0) {
            let k = -1;
            for (let i = 0; i < fracciones_terreno.length; i++) {
                let fraccion_bs = fracciones_terreno[i].fraccion_bs;
                let disponible = fracciones_terreno[i].disponible;

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
                // para precio del terreno

                let registro_terreno = await indiceTerreno.findOne(
                    {
                        codigo_terreno: codigo_terreno,
                    },
                    {
                        precio_bs: 1,
                        _id: 0,
                    }
                );

                if (registro_terreno) {
                    precio_terreno = registro_terreno.precio_bs;

                    // % financiamiento del terreno
                    let aux_ti_f_p = ((ti_f_val / precio_terreno) * 100).toFixed(2);
                    ti_f_p_render = numero_punto_coma(Number(aux_ti_f_p));
                }
            }
        }
        //-------------------------------------------------------

        var resultado = {
            fracciones_disponibles,
            existen_disponibles, // para permitir o negar la venta de fracciones
            precio_terreno,
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

            // guardado, convocatoria, anteproyecto, reservacion, construccion, construido

            if (aux_objeto.estado_terreno == "guardado") {
                var texto_estado = "Guardado";
            }
            if (aux_objeto.estado_terreno == "convocatoria") {
                var texto_estado = "Convocatoria";
            }
            if (aux_objeto.estado_terreno == "anteproyecto") {
                var texto_estado = "Anteproyecto";
            }
            if (aux_objeto.estado_terreno == "reservacion") {
                var texto_estado = "Reservacion";
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

                terreno_encontrado.fecha_inicio_reservacion = req.body.fecha_inicio_reservacion;
                terreno_encontrado.fecha_fin_reservacion = req.body.fecha_fin_reservacion;
                terreno_encontrado.fecha_inicio_anteproyecto = req.body.fecha_inicio_anteproyecto;
                terreno_encontrado.fecha_fin_anteproyecto = req.body.fecha_fin_anteproyecto;
                terreno_encontrado.fecha_inicio_convocatoria = req.body.fecha_inicio_convocatoria;
                terreno_encontrado.fecha_fin_convocatoria = req.body.fecha_fin_convocatoria;
                terreno_encontrado.fecha_inicio_construccion = req.body.fecha_inicio_construccion;
                terreno_encontrado.fecha_fin_construccion = req.body.fecha_fin_construccion;
                terreno_encontrado.ciudad = req.body.ciudad;
                terreno_encontrado.bandera_ciudad = req.body.bandera_ciudad;
                terreno_encontrado.convocatoria = req.body.convocatoria;
                terreno_encontrado.importante = req.body.importante;
                terreno_encontrado.provincia = req.body.provincia;
                terreno_encontrado.direccion = req.body.direccion;
                terreno_encontrado.precio_bs = req.body.precio_bs;

                terreno_encontrado.descuento_bs = req.body.descuento_bs;
                terreno_encontrado.fraccion_bs = req.body.fraccion_bs;
                terreno_encontrado.rend_fraccion_mensual = req.body.rend_fraccion_mensual;
                terreno_encontrado.rend_fraccion_total = req.body.rend_fraccion_total;
                terreno_encontrado.dias_maximo = req.body.dias_maximo;
                terreno_encontrado.meses_maximo = req.body.meses_maximo;

                terreno_encontrado.superficie = req.body.superficie;
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
                terreno_encontrado.ubicacion = req.body.ubicacion;

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

                terreno_encontrado.direccion_comparativa = auxDireccionComparativa;
                terreno_encontrado.m2_comparativa = auxSuperficieComparativa;
                terreno_encontrado.precio_comparativa = auxPrecioComparativa;

                // -------------------------------------------------------

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
// PARA CREAR FRACCIONES DEL TERRENO

controladorAdmTerreno.crearFraccionesTerreno = async (req, res) => {
    // la ruta que entra a este controlador es:
    // post   "/laapirest/terreno/:codigo_terreno/accion/crear_fracciones_terreno"

    try {
        // ------- Para verificación -------
        console.log("los datos que se leen para CREAR FRACCIONES TERRENO");
        console.log(req.body);

        var codigo_terreno = req.body.codigo_terreno;
        var valor_fraccion = Number(req.body.valor_fraccion);
        var cantidad_fraccion = Number(req.body.cantidad_fraccion);

        var acceso = await verificadorTerrenoBloqueado(codigo_terreno);
        if (acceso == "permitido") {
            var fracciones_terreno = await indiceFraccionTerreno.find({
                codigo_terreno: codigo_terreno,
            });

            if (fracciones_terreno.length > 0) {
                // si el terreno ya cuenta con fracciones anteriormente creadas, entonces no sera posible crear nuevas, porque primero debera eliminar las anteriores existentes
                res.json({
                    exito: "no_fracciones",
                });
            } else {
                // si el terreno no cuenta con fracciones.

                //--------------------------------------------------
                // determinacion de la ganancia y el tiempo de ganancia

                let registro_terreno = await indiceTerreno.findOne(
                    { codigo_terreno: codigo_terreno },
                    {
                        rend_fraccion_total: 1,
                        dias_maximo: 1,
                        _id: 0,
                    }
                );

                if (registro_terreno) {
                    var fraccion_bs = Math.floor(valor_fraccion);
                    var fraccion_bs_r = numero_punto_coma(fraccion_bs);

                    var ganancia = Math.floor(
                        valor_fraccion * (registro_terreno.rend_fraccion_total / 100)
                    ); // bs
                    var ganancia_r = numero_punto_coma(ganancia); // bs

                    var dias_ganancia = numero_punto_coma(Math.floor(registro_terreno.dias_maximo));

                    //------------------------------------------------------

                    var arrayFraccionesCreadas = []; // vacio por defecto

                    for (let i = 0; i < cantidad_fraccion; i++) {
                        let aux_orden = i + 1;
                        //--------------------------------------------------
                        // Convertir el número a string
                        var numeroComoString = aux_orden.toString();

                        // Contar los caracteres
                        var numeroDeCaracteres = numeroComoString.length;

                        if (numeroDeCaracteres >= 3) {
                            var string_orden = numeroComoString;
                            var aux_codigo_fraccion = codigo_terreno + string_orden;
                        } else {
                            if ((numeroDeCaracteres = 1)) {
                                var string_orden = "00" + numeroComoString;
                                var aux_codigo_fraccion = codigo_terreno + string_orden;
                            }
                            if ((numeroDeCaracteres = 2)) {
                                var string_orden = "0" + numeroComoString;
                                var aux_codigo_fraccion = codigo_terreno + string_orden;
                            }
                        }

                        var orden = aux_orden; // tipo numerico
                        var codigo_fraccion = aux_codigo_fraccion; // tipo string

                        //--------------------------------------------------

                        const fraccionTerreno = new indiceFraccionTerreno({
                            codigo_fraccion: codigo_fraccion,
                            codigo_terreno: codigo_terreno,
                            fraccion_bs: valor_fraccion, // numerico
                            orden: orden, // numerico
                            //disponible: // ya se encuentra configurado en la base de datos, por defecto se creara como "true"
                        });

                        await fraccionTerreno.save();

                        //--------------------------------------------------------

                        let objeto = {
                            codigo_fraccion,
                            fraccion_bs,
                            fraccion_bs_r,
                            ganancia,
                            ganancia_r,
                            dias_ganancia,
                        };
                        // El método unshift agrega uno o más elementos al principio del array. Esto para que la ordenacion renderizada en la ventana del navegador recorriendo el for se vea ordenadas secuencialemte las fracciones creadas
                        arrayFraccionesCreadas.unshift(objeto);
                        // usamos un array extra "arrayFraccionesCreadas" donde estaran los codigos de las fracciones recientemente creadas.
                    }

                    //----------------------------------------------------
                    // updateOne guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
                    await indiceTerreno.updateOne(
                        { codigo_terreno: codigo_terreno },
                        { $set: { fraccion_bs: fraccion_bs } }
                    );

                    //-------------------------------------------------------------------
                    // guardamos en el historial de acciones
                    var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                    var accion_administrador = "Crea fracciones para el terreno " + codigo_terreno;
                    var aux_accion_adm = {
                        ci_administrador,
                        accion_administrador,
                    };
                    await guardarAccionAdministrador(aux_accion_adm);
                    //-------------------------------------------------------------------

                    res.json({
                        exito: "si",
                        arrayFraccionesCreadas, // para renderizar los codigos recientemente creados
                    });
                } else {
                    res.json({
                        exito: "no",
                    });
                }
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

//==============================================================================
// eliminar todas las fracciones que pertenecen al terreno

controladorAdmTerreno.eliminarFraccionesTerreno = async (req, res) => {
    // ruta   delete  "/laapirest/terreno/accion/eliminar_fracciones_te"
    try {
        let codigo_terreno = req.body.codigo_terreno;
        let usuario_maestro = req.body.usuario_maestro;
        let clave_maestro = req.body.clave_maestro;

        var paquete_datos = {
            usuario_maestro,
            clave_maestro,
        };
        var llaves_maestras = await verificadorLlavesMaestras(paquete_datos);
        if (llaves_maestras) {
            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);
            if (acceso == "permitido") {
                // usamos "deleteMany" para eliminar TODOS los que cumplan con el filtro
                await indiceFraccionInmueble.deleteMany({
                    codigo_terreno: codigo_terreno,
                });

                await indiceFraccionTerreno.deleteMany({
                    codigo_terreno: codigo_terreno,
                });

                //-------------------------------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "Elimina fraccines del terreno " + codigo_terreno;
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
                    mensaje:
                        "El Terreno se encuentra bloqueado, por tanto no es posible realizar cambios",
                });
            }
        } else {
            res.json({
                exito: "no_maestro",
                mensaje: "Datos de acceso MAESTRO incorrectos",
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
                    eliminadorFraccionesTerreno(codigo_terreno),
                ]);

                if (
                    resultadoEliminador[0] == "ok" &&
                    resultadoEliminador[1] == "ok" &&
                    resultadoEliminador[2] == "ok" &&
                    resultadoEliminador[3] == "ok" &&
                    resultadoEliminador[4] == "ok"
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

        const storage = getStorage();

        if (registroImagenesTerreno) {
            // eliminamos los ARCHIVOS IMAGEN uno por uno
            for (let i = 0; i < registroImagenesTerreno.length; i++) {
                /*
                let imagenNombreExtension =
                    registroImagenesTerreno[i].codigo_imagen +
                    registroImagenesTerreno[i].extension_imagen;
                // eliminamos el ARCHIVO IMAGEN DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + imagenNombreExtension)); // "+" es para concatenar
                */

                //--------------------------------------------------

                //const storage = getStorage();

                var nombre_y_ext =
                    registroImagenesTerreno[i].codigo_imagen +
                    registroImagenesTerreno[i].extension_imagen;

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
            // await indiceImagenesTerreno.remove({ codigo_terreno: codigo_terreno }); // no usamos remove para no tener problemas con su caducidad
            // notese que aqui eliminamos TODOS de manera directa en funcion a los que tienen el dato "codigo_terreno: codigo_terreno "
            await indiceImagenesTerreno.deleteMany({ codigo_terreno: codigo_terreno }); // usamos "deleteMany" para eliminar TODOS los que cumplan con la condicion: codigo_terreno: codigo_terreno
        }
        if (registroImagenesProyecto) {
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

                var nombre_y_ext =
                    registroImagenesProyecto[i].codigo_imagen +
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
            const storage = getStorage();

            // eliminamos los ARCHIVOS DOCUMENTOS PDF uno por uno
            for (let i = 0; i < registroDocumentosTerreno.length; i++) {
                /*
                let documentoNombreExtension =
                    registroDocumentosTerreno[i].codigo_documento + ".pdf";
                // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                await fs.unlink(pache.resolve("./src/publico/subido/" + documentoNombreExtension)); // "+" es para concatenar
                */

                //--------------------------------------------------

                //const storage = getStorage();

                var nombre_y_ext = registroDocumentosTerreno[i].codigo_documento + ".pdf";

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

//-----------------------------------------------------------------
async function eliminadorFraccionesTerreno(codigo_terreno) {
    try {
        // se eliminaran todas las fracciones que existen en fracciones de inmueble y fracciones de terreno que guardan relacon con el codigo_terreno

        // usamos "deleteMany" para eliminar TODOS los que cumplan con el filtro
        await indiceFraccionInmueble.deleteMany({ codigo_terreno: codigo_terreno });
        await indiceFraccionTerreno.deleteMany({ codigo_terreno: codigo_terreno });

        return "ok";
    } catch (error) {
        console.log(error);
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorAdmTerreno;
