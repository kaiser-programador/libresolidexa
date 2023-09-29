// CONTROLADOR RELACIONADO CON EL ADMINISTRADOR Y MAESTRO DEL SISTEMA

const {
    indiceAdministrador,
    indiceHistorial,
    indiceEmpresa,
    indiceImagenesEmpresa_sf,
    indiceProyecto,
    indiceInmueble,
    indiceDocumentos,
    indiceImagenesSistema,
    indiceTerreno,
} = require("../modelos/indicemodelo");

const moment = require("moment");

const { cabezeras_adm_cli, segundero_cajas, pie_pagina_adm } = require("../ayudas/funcionesayuda_2");

const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");

const controladorAdmAdministrador = {};

/************************************************************************************ */
/************************************************************************************ */
// PARA RENDERIZAR LA VENTANA DEL ADMINISTRADOR segun la pestaña que sea elegida

// RUTA   "get"  "/laapirest/administrador/:ventana_administrador"
controladorAdmAdministrador.renderizarVentanaAdministrador = async (req, res) => {
    try {
        var codigo_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
        var tipo_ventana_administrador = req.params.ventana_administrador;

        var info_administrador = {};
        info_administrador.cab_adm_adm = true;
        info_administrador.estilo_cabezera = "cabezera_estilo_administrador";
        info_administrador.codigo_administrador = codigo_administrador;

        // -----------------------------------------------
        // revisamos en la base de datos si el administrador es simple empleado o maestro
        const clase_administrador = await indiceAdministrador.findOne(
            { ci_administrador: codigo_administrador },
            {
                clase: 1,
                _id: 0,
            }
        );
        if (clase_administrador.clase == "maestro") {
            info_administrador.administrador_maestro = true;
        }
        if (clase_administrador.clase == "administrador") {
            info_administrador.administrador_maestro = false;
        }
        // -----------------------------------------------

        var aux_cabezera = {
            codigo_objetivo: codigo_administrador,
            tipo: "administrador",
            lado: "administrador", // aunque para esta ventana, solo existira el lado administrador
        };

        var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
        info_administrador.cabezera_adm = cabezera_adm;

        var pie_pagina = await pie_pagina_adm();
        info_administrador.pie_pagina_adm = pie_pagina;

        if (tipo_ventana_administrador == "cuenta") {
            // esta pestaña no esta habilitada para el ADMINISTRADOR MAESTRO, mas si para los administradores ORDINARIOS.
            var contenido_administrador = await cuenta_administrador(codigo_administrador);
            info_administrador.cuenta_administrador = true; // para pestaña y ventana apropiada para proyecto
            info_administrador.contenido_administrador = contenido_administrador;
            // ------- Para verificación -------

            //console.log("los datos para renderizar CUENTA ADMINISTRADOR");
            //console.log(info_administrador);

            res.render("adm_administrador", info_administrador);
        }

        if (tipo_ventana_administrador == "claves") {
            info_administrador.claves_administrador = true; // para pestaña y ventana apropiada para proyecto
            // ------- Para verificación -------

            //console.log("los datos para renderizar la DESCRIPCION DEL PROYECTO");
            //console.log(info_administrador);

            res.render("adm_administrador", info_administrador);
        }

        if (tipo_ventana_administrador == "administrador") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                info_administrador.administrador_administrador = true; // para pestaña y ventana apropiada para proyecto
                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "personal") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                info_administrador.personal_administrador = true; // para pestaña y ventana apropiada para proyecto
                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "historial") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                info_administrador.historial_administrador = true; // para pestaña y ventana apropiada para proyecto
                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "genericos") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                var contenido_administrador = await genericos_administrador();
                info_administrador.genericos_administrador = true; // para pestaña y ventana apropiada para proyecto
                info_administrador.contenido_administrador = contenido_administrador;

                // ------- Para verificación -------
                //console.log("LOS TEXTOS DE GENERICOS EMPRESA");
                //console.log(info_administrador);

                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "textos") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                var contenido_administrador = await textos_administrador(codigo_administrador);
                info_administrador.textos_administrador = true; // para pestaña y ventana apropiada para proyecto
                info_administrador.contenido_administrador = contenido_administrador;

                // ------- Para verificación -------
                //console.log("los textos de empresa son:");
                //console.log(info_administrador);

                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "somos") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                var contenido_administrador = await somos_administrador();
                info_administrador.somos_administrador = true; // para pestaña y ventana apropiada para proyecto
                info_administrador.contenido_administrador = contenido_administrador;

                // ------- Para verificación -------

                //console.log("los datos para renderizar la SOMOS DE LA EMPRESA");
                //console.log(info_administrador);

                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "funciona") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                var contenido_administrador = await funciona_administrador(codigo_administrador);
                info_administrador.funciona_administrador = true; // para pestaña y ventana apropiada para proyecto
                info_administrador.contenido_administrador = contenido_administrador;

                // ------- Para verificación -------

                //console.log("los datos para renderizar la FUNCIONA DE LA EMPRESA");
                //console.log(info_administrador);

                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "preguntas") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                var contenido_administrador = await preguntas_administrador(codigo_administrador);
                info_administrador.preguntas_administrador = true; // para pestaña y ventana apropiada para proyecto
                info_administrador.contenido_administrador = contenido_administrador;

                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "imagenes") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                var contenido_administrador = await imagenes_administrador(codigo_administrador);
                info_administrador.imagenes_administrador = true; // para pestaña y ventana apropiada para proyecto
                info_administrador.contenido_administrador = contenido_administrador;

                //--------------- Verificacion ----------------
                //console.log("los datos de renderizacion de imagenes del sistema es:");
                //console.log(contenido_administrador);
                //---------------------------------------------
                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "numeros") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                var contenido_administrador = await numeros_administrador(codigo_administrador);
                info_administrador.numeros_administrador = true; // para pestaña y ventana apropiada para proyecto
                info_administrador.contenido_administrador = contenido_administrador;

                // ------- Para verificación -------
                //console.log("los numeros resumen de empresa");
                //console.log(info_administrador);

                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }

        if (tipo_ventana_administrador == "visitas") {
            if (clase_administrador.clase == "maestro") {
                // porque solo el administrador maestro puede ingresar a esta pestaña privada
                info_administrador.visitas_administrador = true; // para pestaña y ventana apropiada para proyecto
                res.render("adm_administrador", info_administrador);
            } else {
                res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
            }
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------

async function cuenta_administrador(codigo_administrador) {
    try {
        const registro_administrador = await indiceAdministrador.findOne(
            { ci_administrador: codigo_administrador, estado_administrador: "activo" },
            {
                ci_administrador: 1,
                ad_nombres: 1,
                ad_apellidos: 1,
                ad_telefonos: 1,
                ad_departamento: 1,
                ad_provincia: 1,
                ad_ciudad: 1,
                ad_direccion: 1,
                estado_administrador: 1,
                ad_nacimiento: 1,
                fecha_ingreso: 1,

                _id: 0,
            }
        );

        if (registro_administrador) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_administrador);

            // reconversion del "string" a "objeto"
            var aux_objeto = JSON.parse(aux_string);

            /*
            let auxFechaNacimiento = registro_administrador.ad_nacimiento;
            // en mongo esta guardado en este formato:
            // 2010-10-10T00:00:00.000Z
            let fechaLocal = auxFechaNacimiento.toISOString();
            // con "toISOString()" lo convertimos en cadena
            // "2010-10-10T00:00:00.000Z"
            let arrayFecha = fechaLocal.split("T");
            // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
            let fecha_nacimiento = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"

            let auxFechaIngreso = registro_administrador.fecha_ingreso;
            let fechaLocal_2 = auxFechaIngreso.toISOString();
            let arrayFecha_2 = fechaLocal_2.split("T");
            let fecha_ingreso = arrayFecha_2[0];

            aux_objeto.fecha_nacimiento = fecha_nacimiento;
            aux_objeto.fecha_ingreso = fecha_ingreso;
            */

            // conversion de formato de fecha a ej/ domingo 28 Junio de 2023
            moment.locale("es");

            aux_objeto.fecha_nacimiento = moment.utc(registro_administrador.ad_nacimiento).format("LL"); // muestra solo fecha español

            aux_objeto.fecha_ingreso = moment.utc(registro_administrador.fecha_ingreso).format("LL"); // muestra solo fecha español

            return aux_objeto;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function genericos_administrador() {
    try {
        var datos_empresa = await indiceEmpresa.findOne(
            {},
            {
                nombre_empresa: 1,
                texto_inicio_principal: 1,
                whatsapp: 1,
                telefono_fijo: 1,
                facebook: 1,
                instagram: 1,
                tiktok: 1,
                youtube: 1,
                direccion: 1,
                year_derecho: 1,
                texto_footer: 1,
                mision_vision: 1,

                /*
                encabezado_guardado_terreno: 1,
                texto_guardado_terreno: 1,
                inexistente_guardado_terreno: 1,
                encabezado_guardado_proyecto: 1,
                texto_guardado_proyecto: 1,
                inexistente_guardado_proyecto: 1,
                encabezado_guardado_inmueble: 1,
                texto_guardado_inmueble: 1,
                inexistente_guardado_inmueble: 1,
                encabezado_convocatoria: 1,
                texto_convocatoria: 1,
                inexistente_convocatoria: 1,
                encabezado_reserva: 1,
                texto_reserva: 1,
                inexistente_reserva: 1,
                encabezado_pago: 1,
                texto_pago: 1,
                inexistente_pago: 1,
                encabezado_construccion: 1,
                texto_construccion: 1,
                inexistente_construccion: 1,
                encabezado_construido: 1,
                texto_construido: 1,
                inexistente_construido: 1,
                */

                /*
                significado_py_propietarios: 1,
                significado_py_empresa: 1,
                significado_py_pais: 1,
                significado_inm_propietarios: 1,
                significado_inm_empresa: 1,
                significado_inm_pais: 1,
                */

                _id: 0,
            }
        );

        if (datos_empresa) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(datos_empresa);

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

async function textos_administrador() {
    try {
        var datos_empresa = await indiceEmpresa.findOne(
            {},
            {
                encabezado_guardado_terreno: 1,
                texto_guardado_terreno: 1,
                inexistente_guardado_terreno: 1,
                encabezado_guardado_proyecto: 1,
                texto_guardado_proyecto: 1,
                inexistente_guardado_proyecto: 1,
                encabezado_guardado_inmueble: 1,
                texto_guardado_inmueble: 1,
                inexistente_guardado_inmueble: 1,
                encabezado_convocatoria: 1,
                texto_convocatoria: 1,
                inexistente_convocatoria: 1,
                encabezado_reserva: 1,
                texto_reserva: 1,
                inexistente_reserva: 1,
                encabezado_aprobacion: 1,
                texto_aprobacion: 1,
                inexistente_aprobacion: 1,
                encabezado_pago: 1,
                texto_pago: 1,
                inexistente_pago: 1,
                encabezado_construccion: 1,
                texto_construccion: 1,
                inexistente_construccion: 1,
                encabezado_construido: 1,
                texto_construido: 1,
                inexistente_construido: 1,

                significado_py_propietarios: 1,
                significado_py_empresa: 1,
                significado_py_pais: 1,
                significado_inm_propietarios: 1,
                significado_inm_empresa: 1,
                significado_inm_pais: 1,

                texto_segundero_py: 1,
                texto_segundero_inm: 1,
                texto_segundero_prop: 1,
                texto_segundero_prop_iz: 1,

                _id: 0,
            }
        );

        if (datos_empresa) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(datos_empresa);

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

async function somos_administrador() {
    try {
        var datos_somos = {};
        var lista_somos = [];

        var somos_empresa = await indiceEmpresa.findOne(
            {},
            {
                encabezado_somos: 1,
                texto_somos: 1,
                _id: 0,
            }
        );

        if (somos_empresa) {
            datos_somos.encabezado_somos = somos_empresa.encabezado_somos;
            datos_somos.texto_somos = somos_empresa.texto_somos;
        }

        var somos_empresa_detalle = await indiceImagenesEmpresa_sf
            .find(
                { tipo_imagen: "somos" },
                {
                    codigo_imagen: 1,
                    extension_imagen: 1,
                    texto_imagen: 1,
                    titulo_imagen: 1,
                    orden_imagen: 1,
                    _id: 0,
                }
            )
            .sort({ orden_imagen: 1 }); // para que este ordenado por orden de imagen

        if (somos_empresa_detalle.length > 0) {
            for (let i = 0; i < somos_empresa_detalle.length; i++) {
                lista_somos[i] = {
                    codigo_imagen: somos_empresa_detalle[i].codigo_imagen,
                    extension_imagen: somos_empresa_detalle[i].extension_imagen,
                    texto_imagen: somos_empresa_detalle[i].texto_imagen,
                    titulo_imagen: somos_empresa_detalle[i].titulo_imagen,
                    orden_imagen: somos_empresa_detalle[i].orden_imagen,
                };
            }
        }

        datos_somos.lista_somos = lista_somos;

        return datos_somos;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function funciona_administrador() {
    try {
        var datos_funciona = {};
        var lista_funciona = [];

        var funciona_empresa = await indiceEmpresa.findOne(
            {},
            {
                encabezado_funciona: 1,
                texto_funciona: 1,
                _id: 0,
            }
        );

        if (funciona_empresa) {
            datos_funciona.encabezado_funciona = funciona_empresa.encabezado_funciona;
            datos_funciona.texto_funciona = funciona_empresa.texto_funciona;
        }

        var funciona_empresa_detalle = await indiceImagenesEmpresa_sf
            .find(
                { tipo_imagen: "funciona" },
                {
                    codigo_imagen: 1,
                    extension_imagen: 1,
                    texto_imagen: 1,
                    orden_imagen: 1,
                    titulo_imagen: 1,
                    url_video: 1,
                    video_funciona: 1, // true o false
                    _id: 0,
                }
            )
            .sort({ orden_imagen: 1 }); // para que este ordenado por orden de imagen (de menor a mayor)

        if (funciona_empresa_detalle.length > 0) {
            for (let i = 0; i < funciona_empresa_detalle.length; i++) {
                lista_funciona[i] = {
                    codigo_imagen: funciona_empresa_detalle[i].codigo_imagen,
                    extension_imagen: funciona_empresa_detalle[i].extension_imagen,
                    texto_imagen: funciona_empresa_detalle[i].texto_imagen,
                    orden_imagen: funciona_empresa_detalle[i].orden_imagen,
                    titulo_imagen: funciona_empresa_detalle[i].titulo_imagen,
                    url_video: funciona_empresa_detalle[i].url_video,
                    video_funciona: funciona_empresa_detalle[i].video_funciona,
                    lista_documentos: [], // POR DEFECTO de inicio vacio para luego ser llenado
                };

                // en: codigo_terreno esta el codigo de imagen de "como funciona"
                var documentos_i = await indiceDocumentos.find(
                    { codigo_terreno: funciona_empresa_detalle[i].codigo_imagen },
                    {
                        nombre_documento: 1, // pdf || word || excel
                        codigo_documento: 1,
                        clase_documento: 1, // manual || beneficio || modelo
                        _id: 0,
                    }
                );

                if (documentos_i.length > 0) {
                    var aux_documentos = [];
                    for (let j = 0; j < documentos_i.length; j++) {
                        // ----------------------------------------------------
                        if (documentos_i[j].nombre_documento == "pdf") {
                            var extension = "pdf";
                        }
                        if (documentos_i[j].nombre_documento == "word") {
                            var extension = "docx";
                        }
                        if (documentos_i[j].nombre_documento == "excel") {
                            var extension = "xlsx";
                        }
                        // ----------------------------------------------------
                        if (documentos_i[j].clase_documento == "manual") {
                            var tipo_documento = "Manual";
                        }
                        if (documentos_i[j].clase_documento == "beneficio") {
                            var tipo_documento = "Beneficio";
                        }
                        if (documentos_i[j].clase_documento == "modelo") {
                            var tipo_documento = "Modelo";
                        }
                        // ----------------------------------------------------
                        aux_documentos[j] = {
                            codigo_documento: documentos_i[j].codigo_documento,
                            tipo_documento, // Manual || Beneficio || Modelo
                            extension, // pdf || docx || xlsx
                            tipo_archivo: documentos_i[j].nombre_documento, // pdf || word || excel (para bootstrap)
                        };
                    }

                    lista_funciona[i].lista_documentos = aux_documentos;
                }
            }
        }

        datos_funciona.lista_funciona = lista_funciona;

        return datos_funciona;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function preguntas_administrador() {
    try {
        var datos_empresa = await indiceEmpresa.findOne({});
        if (datos_empresa) {
            var tabla_preguntas = [];
            if (datos_empresa.preguntas_frecuentes.length > 0) {
                var existen_preguntas = true;

                for (let i = 0; i < datos_empresa.preguntas_frecuentes.length; i++) {
                    tabla_preguntas[i] = {
                        numero_preguntas: i + 1,
                        pregunta_preguntas: datos_empresa.preguntas_frecuentes[i].pregunta,
                        respuesta_preguntas: datos_empresa.preguntas_frecuentes[i].respuesta,
                    };
                }
            } else {
                var existen_preguntas = false;
            }

            var datos_administrador = {
                encabezado_preguntas: datos_empresa.encabezado_preguntas,
                texto_preguntas: datos_empresa.texto_preguntas,
                existen_preguntas,
                tabla_preguntas,
            };
            return datos_administrador;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function imagenes_administrador() {
    try {
        // el objeto que sera devuelto como resultado con valores por defecto
        var datos_imagenes_sistema = {
            inicio_horizontal: false,
            inicio_vertical: false,
            cabecera_convocatoria: false,
            cabecera_reserva: false,
            cabecera_aprobacion: false,
            cabecera_pago: false,
            cabecera_construccion: false,
            cabecera_construido: false,
            cabecera_administrador: false,
            cabecera_propietario: false,
            cabecera_terreno: false,
            cabecera_proyecto: false,
            cabecera_inmueble: false,
            cabecera_empresa: false,
            cabecera_resultados_inmuebles: false,
            cabecera_resultados_requerimientos: false,
            lista_imagenes: [],
        };
        var imagenes_sistema = await indiceImagenesSistema.find(
            {},
            {
                imagen: 1,
                tipo_imagen: 1,
                completo: 1,
                _id: 0,
            }
        );

        if (imagenes_sistema.length > 0) {
            for (let i = 0; i < imagenes_sistema.length; i++) {
                if (imagenes_sistema[i].tipo_imagen == "inicio_horizontal") {
                    datos_imagenes_sistema.inicio_horizontal = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "inicio_vertical") {
                    datos_imagenes_sistema.inicio_vertical = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_convocatoria") {
                    datos_imagenes_sistema.cabecera_convocatoria = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_reserva") {
                    datos_imagenes_sistema.cabecera_reserva = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_aprobacion") {
                    datos_imagenes_sistema.cabecera_aprobacion = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_pago") {
                    datos_imagenes_sistema.cabecera_pago = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_construccion") {
                    datos_imagenes_sistema.cabecera_construccion = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_construido") {
                    datos_imagenes_sistema.cabecera_construido = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_administrador") {
                    datos_imagenes_sistema.cabecera_administrador = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_propietario") {
                    datos_imagenes_sistema.cabecera_propietario = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_terreno") {
                    datos_imagenes_sistema.cabecera_terreno = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_proyecto") {
                    datos_imagenes_sistema.cabecera_proyecto = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_inmueble") {
                    datos_imagenes_sistema.cabecera_inmueble = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_empresa") {
                    datos_imagenes_sistema.cabecera_empresa = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_resultados_inmuebles") {
                    datos_imagenes_sistema.cabecera_resultados_inmuebles = true;
                }
                if (imagenes_sistema[i].tipo_imagen == "cabecera_resultados_requerimientos") {
                    datos_imagenes_sistema.cabecera_resultados_requerimientos = true;
                }
            }

            // conversion del documento MONGO ([array]) a "string"
            var aux_string = JSON.stringify(imagenes_sistema);
            // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
            var objeto_ima_sistema = JSON.parse(aux_string);

            datos_imagenes_sistema.lista_imagenes = objeto_ima_sistema;
        }

        return datos_imagenes_sistema;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function numeros_administrador() {
    try {
        var datos_empresa = await indiceEmpresa.findOne(
            {},
            {
                n_construidos: 1,
                n_proyectos: 1,
                n_inmuebles: 1,
                n_empleos: 1,
                n_ahorros: 1,
                n_resp_social: 1,
                _id: 0,
            }
        );

        if (datos_empresa) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(datos_empresa);

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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
controladorAdmAdministrador.cerrarAdministrador = async (req, res) => {
    //  viene de la RUTA  GET   '/laapirest/administrador/accion/cerrar'
    try {
        req.logout(); // para BORRAR la sesion del ADMINISTRADOR
        // res.render('acceso');  // funciona renderiza la ventana de inicio, pero en la url del navegador se queda con "/laapirest/administrador/cerrar"
        res.redirect("/laapirest"); // funciona, renderiza la ventana de inicio y la url del navegador se ve con el correcto "/" de inicio del sistema
    } catch (error) {
        console.log(error);
    }
};
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
controladorAdmAdministrador.cambiarClaves = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/cambiar_claves'
    try {
        var ci_administrador = req.user.ci_administrador; // es el ci del administrador que esta navegando con su cuenta personal por el sistema

        //--------------- Verificacion ----------------
        //console.log("el ci del administrador presente que esta navegando es:");
        //console.log(ci_administrador);
        //---------------------------------------------

        var usuario_actual = req.body.act_usuario;
        var clave_actual = req.body.act_clave;
        var usuario_nuevo = req.body.nue_usuario;
        // aqui las nuevas claves 1 y 2, ya vienen verificadas que son iguales
        var clave_nuevo_1 = req.body.nue_clave_1;
        // var clave_nuevo_2 = (req.body.nue_clave_2); // no es necesario ya que es el mismo que clave_nuevo_1 que ya fue verificado en jqy logica administrador

        // los nombres de USUARIO ESTAN CREADOS PARA SER UNICOS, por ello se usa "findOne"
        var registro_administrador = await indiceAdministrador.findOne({
            ad_usuario: usuario_actual,
        });

        if (registro_administrador) {
            // solo podra cambiar sus claves el mismo usuario dueño de la cuenta con el que esta navegando
            // (si el administrador maestro desea cambiar las claves de un administrador ordinario dandole sus RE-CLAVES, lo puede hacer desde su propia cuenta de administrador maestro en la pestaña "Administrador")
            if (registro_administrador.ci_administrador == ci_administrador) {
                // si el USUARIO ADMINISTRADOR ES ENCONTRADO, entonces verificamos la contraseña descifrandola
                const respuesta = await registro_administrador.compararContrasena(clave_actual); // nos devuelve TRUE o FALSE

                if (respuesta) {
                    // si es TRUE la contraseña es correcta

                    if (registro_administrador.ad_usuario == usuario_nuevo) {
                        // si el nuevo usuario que desea registrar es el mismo que el que tiene actualmente, LE ESTA PERMITIDO, porque este ya esta asegurado que es unico en toda la base de datos

                        // cambiaremos (aunque en este caso el nombre de USUARIO sera el mismo) las claves
                        registro_administrador.ad_usuario = usuario_nuevo;

                        //----------------------------------
                        // #session-passport #encriptar-contraseña encriptar contraseña y guardarlo en la base de datos
                        registro_administrador.ad_clave =
                            await registro_administrador.encriptarContrasena(clave_nuevo_1);
                        //----------------------------------

                        await registro_administrador.save();

                        res.json({
                            exito: "si",
                        });
                    } else {
                        // ahora revisamos si el dato NUEVO de USUARIO existe o no en la base de datos, BASTA QUE SOLO EXISTA UNO (findOne) PARA QUE ESTE NUEVO USUARIO SEA DESCARTADO Y SE LE PIDA QUE INGRESE UN NUEVO NOMBRE DE USUARIO
                        var usuario_existente = await indiceAdministrador.findOne({
                            ad_usuario: usuario_nuevo,
                        });
                        if (usuario_existente) {
                            res.json({
                                exito: "otro_usuario",
                            });
                        } else {
                            console.log("vamos a camiar las claves");
                            registro_administrador.ad_usuario = usuario_nuevo;
                            //registro_administrador.ad_clave = clave_nuevo_1; // podria ser tambien clave_nuevo_2

                            //----------------------------------
                            // #session-passport #encriptar-contraseña encriptar contraseña y guardarlo en la base de datos
                            registro_administrador.ad_clave =
                                await registro_administrador.encriptarContrasena(clave_nuevo_1);
                            //----------------------------------

                            await registro_administrador.save();

                            res.json({
                                exito: "si",
                            });
                        }
                    }
                } else {
                    // si la contraseña es INCORRECTA

                    res.json({
                        exito: "no",
                    });
                }
            } else {
                res.json({
                    exito: "corrupto",
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
controladorAdmAdministrador.guardarDatosEmpresa = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_datos_empresa'
    try {
        // ------- Para verificación -------
        //console.log("los datos desde DATOS EMPRESA del formulario html");
        //console.log(req.body);

        const registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.nombre_empresa = req.body.nombre_empresa_html;
            registro_empresa.whatsapp = req.body.whatsapp_html;
            registro_empresa.telefono_fijo = req.body.telefono_fijo_html;
            registro_empresa.facebook = req.body.facebook_html;
            registro_empresa.instagram = req.body.instagram_html;
            registro_empresa.tiktok = req.body.tiktok_html;
            registro_empresa.youtube = req.body.youtube_html;
            registro_empresa.direccion = req.body.direccion_html;
            registro_empresa.texto_footer = req.body.texto_footer_adm_html;
            registro_empresa.mision_vision = req.body.mision_vision_html;
            registro_empresa.year_derecho = req.body.year_derecho_html;

            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.guardarEncabezadosEmpresa = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_encabezados_empresa'
    try {
        // ------- Para verificación -------
        //console.log("los datos ENCABEZADOS EMPRESA desde el formulario html");
        //console.log(req.body);

        const registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.encabezado_guardado_terreno = req.body.encabezado_guardado_terreno;
            registro_empresa.texto_guardado_terreno = req.body.texto_guardado_terreno;
            registro_empresa.inexistente_guardado_terreno = req.body.inexistente_guardado_terreno;
            registro_empresa.encabezado_guardado_proyecto = req.body.encabezado_guardado_proyecto;
            registro_empresa.texto_guardado_proyecto = req.body.texto_guardado_proyecto;
            registro_empresa.inexistente_guardado_proyecto = req.body.inexistente_guardado_proyecto;
            registro_empresa.encabezado_guardado_inmueble = req.body.encabezado_guardado_inmueble;
            registro_empresa.texto_guardado_inmueble = req.body.texto_guardado_inmueble;
            registro_empresa.inexistente_guardado_inmueble = req.body.inexistente_guardado_inmueble;
            registro_empresa.encabezado_convocatoria = req.body.encabezado_convocatoria;
            registro_empresa.texto_convocatoria = req.body.texto_convocatoria;
            registro_empresa.inexistente_convocatoria = req.body.inexistente_convocatoria;
            registro_empresa.encabezado_reserva = req.body.encabezado_reserva;
            registro_empresa.texto_reserva = req.body.texto_reserva;
            registro_empresa.inexistente_reserva = req.body.inexistente_reserva;

            registro_empresa.encabezado_aprobacion = req.body.encabezado_aprobacion;
            registro_empresa.texto_aprobacion = req.body.texto_aprobacion;
            registro_empresa.inexistente_aprobacion = req.body.inexistente_aprobacion;

            registro_empresa.encabezado_pago = req.body.encabezado_pago;
            registro_empresa.texto_pago = req.body.texto_pago;
            registro_empresa.inexistente_pago = req.body.inexistente_pago;
            registro_empresa.encabezado_construccion = req.body.encabezado_construccion;
            registro_empresa.texto_construccion = req.body.texto_construccion;
            registro_empresa.inexistente_construccion = req.body.inexistente_construccion;
            registro_empresa.encabezado_construido = req.body.encabezado_construido;
            registro_empresa.texto_construido = req.body.texto_construido;
            registro_empresa.inexistente_construido = req.body.inexistente_construido;

            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.guardarTextoPrincipalEmpresa = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_texto_principal_empresa'
    try {
        // ------- Para verificación -------
        //console.log("El texto principal de EMPRESA");
        //console.log(req.body);

        const registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.texto_inicio_principal = req.body.texto_principal_html;

            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.guardarSignificadosEmpleos = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_significados_empleos'
    try {
        // ------- Para verificación -------
        //console.log("los datos desde DATOS EMPRESA del formulario html SIGNIFICADOS EMPLEOS");
        //console.log(req.body);

        const registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.significado_py_propietarios = req.body.significado_py_propietarios;
            registro_empresa.significado_py_empresa = req.body.significado_py_empresa;
            registro_empresa.significado_py_pais = req.body.significado_py_pais;
            registro_empresa.significado_inm_propietarios = req.body.significado_inm_propietarios;
            registro_empresa.significado_inm_empresa = req.body.significado_inm_empresa;
            registro_empresa.significado_inm_pais = req.body.significado_inm_pais;

            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.guardarTextosSegundero = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_textos_segundero'
    try {
        // ------- Para verificación -------
        //console.log("TEXTOS DE SEGUNDERO PARA: PROYECTO, INMUEBLE Y PROPIETARIO");
        //console.log(req.body);

        const registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {

            registro_empresa.texto_segundero_py = req.body.texto_segundero_py;
            registro_empresa.texto_segundero_inm = req.body.texto_segundero_inm;
            registro_empresa.texto_segundero_prop = req.body.texto_segundero_prop;
            registro_empresa.texto_segundero_prop_iz = req.body.texto_segundero_prop_iz;

            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.inspCiAdmNuevo = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/insp_nuevo_adm'
    try {
        // llevando todos a minusculas por seguridad
        var ci_inspeccion = req.body.html_ci_insp_adm.toLowerCase();
        var registro_administrador = await indiceAdministrador.findOne({
            ci_administrador: ci_inspeccion,
            clase: "administrador",
        }); // clase: 'administrador'  para no considerar al MAESTRO (aunque el maestro no tiene C.I.)

        if (registro_administrador) {
            let auxFechaNacimiento = registro_administrador.ad_nacimiento;
            // en mongo esta guardado en este formato:
            // 2010-10-10T00:00:00.000Z
            let fechaString = auxFechaNacimiento.toISOString();
            // con "toISOString()" lo convertimos en cadena
            // "2010-10-10T00:00:00.000Z"
            let arrayFecha = fechaString.split("T");
            let fechaNacimiento = arrayFecha[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"

            res.json({
                exito: "si",

                ci_administrador: registro_administrador.ci_administrador,
                ad_nombres: registro_administrador.ad_nombres,
                ad_apellidos: registro_administrador.ad_apellidos,
                ad_nacimiento: fechaNacimiento,
                ad_telefonos: registro_administrador.ad_telefonos,
                ad_departamento: registro_administrador.ad_departamento,
                ad_provincia: registro_administrador.ad_provincia,
                ad_ciudad: registro_administrador.ad_ciudad,
                ad_direccion: registro_administrador.ad_direccion,
                estado_administrador: registro_administrador.estado_administrador,
            });
        } else {
            // significa que es un administrador que no figura en los registros
            res.json({
                exito: "nuevo",
                ci_inspeccion,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
controladorAdmAdministrador.guardarAdministrador = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/adm_guardar'
    // ya se verifico que el administrador sea activo, o un eliminado que sera nuevamente registrado, o uno nuevo
    try {
        // para verificar datos del formulario
        // ------- Para verificación -------
        //console.log("los datos del formulario guardarAdministrador son req.body");
        //console.log(req.body);

        // verificacion del C.I. del jefe administrador solicitante, puede ser tambien el MAESTRO el solicitante
        let ci_jefe_adm = req.body.ci_reg_jefe.toLowerCase();

        var registro_administrador_jefe = await indiceAdministrador.findOne({
            ci_administrador: ci_jefe_adm,
            estado_administrador: "activo",
        });

        if (registro_administrador_jefe) {
            // llevando todos a minusculas por seguridad
            var ci_adm = req.body.ci_adm.toLowerCase();

            var registro_administrador = await indiceAdministrador.findOne({
                ci_administrador: ci_adm,
                clase: "administrador",
            }); // clase: 'administrador'  para no considerar al MAESTRO y no se considera que sea ACTIVO o ELIMINADO, porque ya se tiene permiso de acceso

            if (registro_administrador) {
                // si es un administrador que ya esta registrado en la base de datos (como ACTIVO o ELIMINADO)
                registro_administrador.ci_solicitante = ci_jefe_adm;
                // no se modifica el C.I. del administrador
                registro_administrador.ad_nombres = req.body.nombres_adm.toLowerCase();
                registro_administrador.ad_apellidos = req.body.apellidos_adm.toLowerCase();
                registro_administrador.ad_nacimiento = req.body.nacimiento_adm;
                registro_administrador.ad_telefonos = req.body.telefonos_adm.toLowerCase();
                registro_administrador.ad_departamento = req.body.departamento_adm.toLowerCase();
                registro_administrador.ad_provincia = req.body.provincia_adm.toLowerCase();
                registro_administrador.ad_ciudad = req.body.ciudad_adm.toLowerCase();
                registro_administrador.ad_direccion = req.body.direccion_adm.toLowerCase();
                registro_administrador.estado_administrador = "activo"; //sea activo o eliminado
                registro_administrador.fecha_ingreso = new Date(); // la fecha de ahora en que es registrado

                await registro_administrador.save();

                //--------------------------------------------
                // Registrar accion en el historial de acciones
                const accionHistorial = new indiceHistorial({
                    ci_administrador: ci_jefe_adm, // el solicitante o ejecutor
                    accion_historial: "guarda administrador " + ci_adm,
                });
                await accionHistorial.save();
                //--------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // significa que es un administrador que no figura en los registros, por tanto se trata de uno NUEVO al que hade tener que crearsele su registro en la base de datos

                //--------------------------------------------------
                // damos sus claves de acceso por defecto
                let auxFechaNacimiento = req.body.nacimiento_adm;
                // La fecha de nacimiento esta en formato: año-mes-dia   ej/ 1988-01-30

                let a_m_d = auxFechaNacimiento.split("-");
                let a_ano = a_m_d[0];
                let a_mes = a_m_d[1];
                let a_dia = a_m_d[2];

                let clave_defecto = a_dia + a_mes + a_ano;
                //--------------------------------------------------

                // importante guardarle en "minusculas"
                const datosNuevoAdministrador = new indiceAdministrador({
                    ci_solicitante: ci_jefe_adm,
                    ci_administrador: ci_adm,
                    ad_nombres: req.body.nombres_adm.toLowerCase(),
                    ad_apellidos: req.body.apellidos_adm.toLowerCase(),
                    ad_nacimiento: req.body.nacimiento_adm,
                    ad_telefonos: req.body.telefonos_adm.toLowerCase(),
                    ad_departamento: req.body.departamento_adm.toLowerCase(),
                    ad_provincia: req.body.provincia_adm.toLowerCase(),
                    ad_ciudad: req.body.ciudad_adm.toLowerCase(),
                    ad_direccion: req.body.direccion_adm.toLowerCase(),
                    ad_usuario: ci_adm,
                    clase: "administrador",
                    fecha_ingreso: new Date(), // la fecha de ahora en que es registrado
                });
                //----------------------------------
                // #session-passport #encriptar-contraseña para SESION USUARIO, encriptar contraseña y guardarlo en la base de datos
                datosNuevoAdministrador.ad_clave = await datosNuevoAdministrador.encriptarContrasena(
                    clave_defecto
                );
                //----------------------------------
                // ahora guardamos en la base de datos la informacion de la imagen creada
                await datosNuevoAdministrador.save();

                //--------------------------------------------
                // Registrar accion en el historial de acciones
                const accionHistorial = new indiceHistorial({
                    ci_administrador: ci_jefe_adm, // el solicitante o ejecutor
                    accion_historial: "guarda administrador " + ci_adm,
                });
                await accionHistorial.save();
                //--------------------------------------------
                res.json({
                    exito: "nuevo",
                    ad_usuario: ci_adm,
                    ad_clave: clave_defecto,
                });
            }
        } else {
            res.json({
                exito: "jefe incorrecto",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
controladorAdmAdministrador.eliminarAdministrador = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/adm_eliminar'
    try {
        // para verificar datos del formulario
        // ------- Para verificación -------
        //console.log("los datos del formulario eliminarAdministrador son req.body");
        //console.log(req.body);
        // verificacion del C.I. del jefe administrador solicitante, puede ser tambien el MAESTRO el solicitante
        let ci_jefe_adm = req.body.ci_reg_jefe.toLowerCase();

        var registro_administrador_jefe = await indiceAdministrador.findOne({
            ci_administrador: ci_jefe_adm,
            estado_administrador: "activo",
        });

        if (registro_administrador_jefe) {
            // llevando todos a minusculas por seguridad
            var ci_adm = req.body.ci_adm.toLowerCase();

            var registro_administrador = await indiceAdministrador.findOne({
                ci_administrador: ci_adm,
                clase: "administrador",
            }); // clase: 'administrador'  para no considerar al MAESTRO y no se considera que sea ACTIVO o ELIMINADO, porque ya se tiene permiso de acceso

            if (registro_administrador) {
                // TENGA PRESENTE QUE EL ADMINISTRADOR NO ES ELIMINADO DE LOS REGISTROS, SOLO SE CAMBIA SU ESTADO A "ELIMINADO"
                registro_administrador.ci_solicitante = ci_jefe_adm;
                registro_administrador.estado_administrador = "eliminado";
                registro_administrador.fecha_salida = new Date(); // fecha del momento
                await registro_administrador.save();

                //--------------------------------------------
                // Registrar accion en el historial de acciones
                const accionHistorial = new indiceHistorial({
                    ci_administrador: ci_jefe_adm, // el solicitante o ejecutor
                    accion_historial: "elimina administrador " + ci_adm,
                });
                await accionHistorial.save();
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
                exito: "jefe incorrecto",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
controladorAdmAdministrador.reClavesAdministrador = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/adm_re_claves'
    try {
        // verificacion del C.I. del jefe administrador solicitante, puede ser tambien el MAESTRO el solicitante

        /*
        // ------- Para verificación ------- 
        console.log('los datos del body re-claves administrador');
        console.log(req.body);
        */

        let ci_jefe_adm = req.body.ci_reg_jefe.toLowerCase();

        var registro_administrador_jefe = await indiceAdministrador.findOne({
            ci_administrador: ci_jefe_adm,
            estado_administrador: "activo",
        });

        if (registro_administrador_jefe) {
            // llevando todos a minusculas por seguridad
            var ci_adm = req.body.ci_adm.toLowerCase();

            var registro_administrador = await indiceAdministrador.findOne({
                ci_administrador: ci_adm,
                clase: "administrador",
            }); // clase: 'administrador'  para no considerar al MAESTRO y no se considera que sea ACTIVO o ELIMINADO, porque ya se tiene permiso de acceso

            if (registro_administrador) {
                //--------------------------------------------------
                // tratamiento de la fecha, para que pueda ser mostrado en el input de fecha
                let auxFechaNacimiento = registro_administrador.ad_nacimiento;
                // en mongo esta guardado en este formato:
                // 2010-10-10T00:00:00.000Z
                let fechaString = auxFechaNacimiento.toISOString();
                // con "toISOString()" lo convertimos en cadena
                // "2010-10-10T00:00:00.000Z"
                let arrayFecha = fechaString.split("T");
                // ahora con split lo separamos, quedandonos con el formato que intereza "año-mes-dia"
                let fechaPinta = arrayFecha[0]; // nos devolvera "2010-10-10"input tipo "date"
                let a_m_d = fechaPinta.split("-");
                let a_ano = a_m_d[0];
                let a_mes = a_m_d[1];
                let a_dia = a_m_d[2];

                let clave_defecto = a_dia + a_mes + a_ano;
                //--------------------------------------------------

                registro_administrador.ad_usuario = registro_administrador.ci_administrador;
                registro_administrador.ci_solicitante = ci_jefe_adm;
                registro_administrador.ad_clave = await registro_administrador.encriptarContrasena(
                    clave_defecto
                );
                await registro_administrador.save();

                //--------------------------------------------
                // Registrar accion en el historial de acciones
                const accionHistorial = new indiceHistorial({
                    ci_administrador: ci_jefe_adm, // el solicitante o ejecutor
                    accion_historial: "re-claves administrador " + ci_adm,
                });
                await accionHistorial.save();
                //--------------------------------------------

                /*
                // ------- Para verificación -------
                console.log("los datos respuesta de re-claves");
                console.log(registro_administrador.ci_administrador + "  " + clave_defecto);
                */

                res.json({
                    exito: "si",
                    usuario_defecto: registro_administrador.ci_administrador,
                    clave_defecto,
                });
            } else {
                res.json({
                    exito: "no",
                });
            }
        } else {
            res.json({
                exito: "jefe incorrecto",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA ENLISTAR AL PERSONAL ACTIVO DE FONDECORP

controladorAdmAdministrador.verPersonalActivo = async (req, res) => {
    //  viene de la RUTA  GET  '/laapirest/administrador/accion/ver_personal_activo'
    try {
        var personal_activo = await indiceAdministrador
            .find({ estado_administrador: "activo", clase: "administrador" })
            .sort({ fecha_ingreso: 1 }); // no se considerara al administrador MAESTRO, ordenado por fecha de ANTIGUO A RECIENTE

        if (personal_activo.length > 0) {
            moment.locale("es");
            var administradores_activos = [];
            for (let i = 0; i < personal_activo.length; i++) {
                var fecha_ingreso_adm = moment(personal_activo[i].fecha_ingreso).format("LL");

                administradores_activos[i] = {
                    ci_administrador: personal_activo[i].ci_administrador,
                    ad_nombres: personal_activo[i].ad_nombres,
                    ad_apellidos: personal_activo[i].ad_apellidos,
                    ad_departamento: personal_activo[i].ad_departamento,
                    ad_provincia: personal_activo[i].ad_provincia,
                    ad_ciudad: personal_activo[i].ad_ciudad,
                    //fecha_ingreso: personal_activo[i].fecha_ingreso,
                    fecha_ingreso: fecha_ingreso_adm,
                };
            }

            res.json({
                exito: "si",
                administradores_activos,
            });
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
// PARA BUSCAR EN EL HISTORIAL DE ACCIONES DEL DENTRO DEL SISTEMA
controladorAdmAdministrador.buscarHistorial = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/buscar_historial'
    try {
        // llevando todos a minusculas por seguridad
        var objetivo_busqueda = req.body.html_buscar_historial.toLowerCase();

        // "$or" sirve para mostrar resultados que cumpla con todos o solo uno de los que encierra en su [ ], "$regex" permite buscar similares, por ejemplo si ponemos "elim" nos mostrara resultados de todo aquello que tengoa parecido con ese "elim", por ejemplo "eliminar"
        var registro_resultados = await indiceHistorial
            .find({
                $or: [
                    { ci_administrador: { $regex: objetivo_busqueda } },
                    { accion_historial: { $regex: objetivo_busqueda } },
                ],
            })
            .sort({ fecha_accion: -1 }); // ordenado por fecha de reciente a antiguo

        if (registro_resultados.length > 0) {
            moment.locale("es");

            var array_resultados = [];
            for (let i = 0; i < registro_resultados.length; i++) {
                var fecha_accion_adm = moment(registro_resultados[i].fecha_accion).format("LL");
                array_resultados[i] = {
                    ci_administrador: registro_resultados[i].ci_administrador,
                    fecha_accion: fecha_accion_adm,
                    accion_historial: registro_resultados[i].accion_historial,
                };
            }
            res.json({
                exito: "si",
                array_resultados,
            });
        } else {
            // significa que NO existen resultados para ser mostrados
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
// PARA BORRAR EL HISTORIAL DE ACCIONES DEPENDIENDO DEL TIEMPO EN QUE SEA DEFINIDO
controladorAdmAdministrador.borrarHistorial = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/borrar_historial'
    try {
        // llevando todos a minusculas por seguridad
        var tiempo_borrar = req.body.name_hist_tiempo_borrar;

        // por defecto, luego seran corregidos dependiendo de las condiciones de borrado
        var exito = "no";
        var mensaje = "Ocurrió un problema, inténtelo nuevamente";

        // "new Date()" nos devuelve la fecha actual
        //let tiempo_transcurrido = new Date() - info_terreno.fecha_inicio_construccion;

        if (tiempo_borrar == "semana") {
            // entonces solo permaneceran sin ser borrados aquellas acciones que esten dentro de una semana de tiempo
            var dias = 7; // 7
        }
        if (tiempo_borrar == "mes") {
            // entonces solo permaneceran sin ser borrados aquellas acciones que esten dentro de un mes de tiempo
            var dias = 30;
        }
        if (tiempo_borrar == "trimestre") {
            // entonces solo permaneceran sin ser borrados aquellas acciones que esten dentro de un trimestre de tiempo
            var dias = 30 * 4;
        }
        if (tiempo_borrar == "semestre") {
            // entonces solo permaneceran sin ser borrados aquellas acciones que esten dentro de un semestre de tiempo
            var dias = 30 * 6;
        }
        if (tiempo_borrar == "year") {
            // entonces solo permaneceran sin ser borrados aquellas acciones que esten dentro de un año de tiempo
            var dias = 365;
        }

        if (tiempo_borrar != "todo") {
            // "new Date()" nos devuelve la fecha actual
            var fecha_referencia = new Date();

            //--------------- Verificacion ----------------
            //console.log("la fecha actual");
            //console.log(fecha_referencia);
            //---------------------------------------------

            // restamos la cantidad de dias a la fecha, esta nueva fecha restada sera la fecha de referencia que se  utilizara para el proceso de eliminacion por filtro
            fecha_referencia.setDate(fecha_referencia.getDate() - dias);

            //--------------- Verificacion ----------------
            //console.log("la fecha referencia a borrar que seran mas antiguos que esta fecha");
            //console.log(fecha_referencia);

            //---------------------------------------------------------------

            var contenedor_acciones = await indiceHistorial.find({});

            //--------------- Verificacion ----------------
            //console.log("el numero total de acciones registradas es:");
            //console.log(contenedor_acciones.length);
            //---------------------------------------------

            if (contenedor_acciones.length > 0) {
                // "$lte" para que filtre las fechas "menores o iguales que" la fecha de referencia
                var acciones_eliminar = await indiceHistorial.find({
                    fecha_accion: { $lte: fecha_referencia },
                });

                if (acciones_eliminar.length > 0) {
                    await indiceHistorial.deleteMany({ fecha_accion: { $lte: fecha_referencia } }); // borramos TODOS (usando deleteMany) las acciones del historial que cumplan con la condicion de fecha

                    for (let n = 0; n < acciones_eliminar.length; n++) {
                        console.log(
                            "la fecha " +
                                (n + 1) +
                                " " +
                                acciones_eliminar[n].fecha_accion +
                                " es menor o igual que la fecha de referencia"
                        );
                    }

                    exito = "si";
                    mensaje =
                        "De total de " +
                        contenedor_acciones.length +
                        " acciones en el historial, fueron eliminadas: " +
                        acciones_eliminar.length;

                    //var contenedor_acciones_2 = await indiceHistorial.find({});

                    //--------------- Verificacion ----------------
                    //console.log("el numero NUEVO de total de acciones es:");
                    //console.log(contenedor_acciones_2.length);
                    //---------------------------------------------
                } else {
                    exito = "no";
                    mensaje =
                        "No existen acciones que cumplan con el tiempo requerido para ser eliminadas";
                }
            } else {
                exito = "no";
                mensaje = "El historial no cuenta con acciones para ser eliminadas";
            }
        } else {
            // si es "todo"

            var registro_resultados = await indiceHistorial.find({}, { fecha_accion: 1 });
            var numero_borrados = registro_resultados.length;
            if (registro_resultados.length > 0) {
                await indiceHistorial.deleteMany({}); // borramos TODOS las acciones del historial de la base de datos
            }

            exito = "si";
            mensaje = "Fueron eliminadas TODAS las acciones del historial, en total: " + numero_borrados;
        }

        res.json({
            exito,
            mensaje,
        });
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
controladorAdmAdministrador.guardarEncabezadoSomos = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_encabezado_somos'

    try {
        // ------- Para verificación -------
        //console.log("los datos ENCABEZADO SOMOS EMPRESA del formulario html");
        //console.log(req.body);

        const registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.encabezado_somos = req.body.encabezado_somos;
            registro_empresa.texto_somos = req.body.texto_somos;

            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.guardarEncabezadoFunciona = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_encabezado_funciona'

    try {
        // ------- Para verificación -------
        //console.log("los datos ENCABEZADO FUNCIONA EMPRESA del formulario html");
        //console.log(req.body);

        const registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.encabezado_funciona = req.body.encabezado_funciona;
            registro_empresa.texto_funciona = req.body.texto_funciona;

            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.guardarEncabezadoPreguntas = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_encabezado_preguntas'
    try {
        // ------- Para verificación -------
        //console.log("los datos ENCABEZADO PREGUNTAS FRECUENTES EMPRESA del formulario html");
        //console.log(req.body);

        var registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.encabezado_preguntas = req.body.encabezado_preguntas_html;
            registro_empresa.texto_preguntas = req.body.texto_preguntas_html;

            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.guardarTablaPreguntas = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/guardar_tabla_preguntas'

    try {
        // ------- Para verificación -------
        //console.log("TABLA DE PREGUNTAS FRECUENTES");
        //console.log(req.body);

        for (var propiedad in req.body) {
            let p_array_pregunta = propiedad.indexOf("array_pregunta");
            let p_array_respuesta = propiedad.indexOf("array_respuesta");

            if (p_array_pregunta != -1) {
                var array_pregunta = req.body[propiedad];
            }
            if (p_array_respuesta != -1) {
                var array_respuesta = req.body[propiedad];
            }
        }

        // ------- Para verificación -------
        /*
        console.log("el array pregunta");
        console.log(array_pregunta);
        console.log("el array respuesta");
        console.log(array_respuesta);
        */

        var aux_array = [];
        if (array_pregunta.length > 0 && array_respuesta.length > 0) {
            for (let i = 0; i < array_pregunta.length; i++) {
                aux_array[i] = {
                    pregunta: array_pregunta[i],
                    respuesta: array_respuesta[i],
                };
            }
        }

        // ------- Para verificación -------
        //console.log("ARRAY DE FUNCIONA TERMINADO");
        //console.log(aux_array);

        var registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.preguntas_frecuentes = aux_array;
            await registro_empresa.save();

            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.eliminarTablaPreguntas = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/eliminar_tabla_preguntas'

    try {
        var registro_empresa = await indiceEmpresa.findOne({});
        if (registro_empresa) {
            // llevamos a estado VACIO
            registro_empresa.preguntas_frecuentes = [];
            await registro_empresa.save();
            res.json({
                exito: "si",
            });
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
controladorAdmAdministrador.actualizarNumerosEmpresa = async (req, res) => {
    //  viene de la RUTA  GET   '/laapirest/administrador/accion/actualizar_numeros_empresa'
    // CONTROLADOR CREADO PARA AHORRO DE TIEMPO DE CARGA EN LA VENTANA DE INICIO (LADO CLIENTE Y ADMINISTRAFOR), DE MANERA QUE ESAS VENTANAS DE INICIO NO TENDRAN QUE REALIZAR ESTA LABORIOSA TAREA CADA VEZ QUE SEA VISUALIZADA

    try {
        //----------------------------------------------------------------
        // n_proyectos  n_inmuebles
        var n_proyectos = await indiceProyecto.find().countDocuments();
        var n_inmuebles = await indiceInmueble.find().countDocuments();

        if (n_proyectos == 0) {
            n_proyectos = "";
        } else {
            n_proyectos = numero_punto_coma(n_proyectos);
        }

        if (n_inmuebles == 0) {
            n_inmuebles = "";
        } else {
            n_inmuebles = numero_punto_coma(n_inmuebles);
        }

        //----------------------------------------------------------------
        // n_construidos
        var n_construidos = ""; // valor por defecto

        var ma_construidos = await indiceProyecto.find(
            { proyecto_ganador: true, estado_proyecto: "completado" },
            {
                area_construida: 1,
                _id: 0,
            }
        );

        if (ma_construidos.length > 0) {
            var auxiliar_i = 0;
            var sum_m2 = 0;
            for (let i = 0; i < ma_construidos.length; i++) {
                auxiliar_i = ma_construidos[i].area_construida;
                sum_m2 = sum_m2 + auxiliar_i;
            }
            if (sum_m2 > 0) {
                n_construidos = numero_punto_coma(sum_m2.toFixed(2));
            } else {
                n_construidos = "";
            }
        } else {
            n_construidos = "";
        }

        //----------------------------------------------------------------
        // n_empleos

        var n_empleos = ""; // valor por defecto

        var ma_empleos = await indiceProyecto.find(
            { proyecto_ganador: true, estado_proyecto: "completado" },
            {
                tabla_empleos_sociedad: 1,
                _id: 0,
            }
        );

        if (ma_empleos.length > 0) {
            var valor_empleo = 0;
            var sum_empleos = 0;
            var matriz_aux_k = [];
            var sub_matriz_kk = [];
            for (let k = 0; k < ma_empleos.length; k++) {
                matriz_aux_k = ma_empleos[k].tabla_empleos_sociedad;
                if (matriz_aux_k.length > 0) {
                    for (let kk = 0; kk < matriz_aux_k.length; kk++) {
                        sub_matriz_kk = matriz_aux_k[kk];
                        valor_empleo = sub_matriz_kk[3]; // por el ordenamiento en la matriz, el valor de la donacion esta en la pisicion 3
                        sum_empleos = sum_empleos + valor_empleo;
                    }
                }
            }
            // despues de recorrer todas las resp sociales de todas los proyectos
            if (sum_empleos > 0) {
                n_empleos = numero_punto_coma(sum_empleos);
            } else {
                n_empleos = "";
            }
        } else {
            n_empleos = "";
        }

        //----------------------------------------------------------------
        // n_ahorros $us SON LAS PLUSVALIAS DE REGALO

        var n_ahorros = ""; // valor por defecto

        var ma_codigos_py = await indiceProyecto.find(
            { proyecto_ganador: true, estado_proyecto: "completado" },
            {
                codigo_proyecto: 1,
                _id: 0,
            }
        );

        if (ma_codigos_py.length > 0) {
            var codigo_aux = "";
            var sum_plusvalias = 0;
            var datos_segundero = {
                codigo_objetivo: "",
                tipo_objetivo: "proyecto",
            };
            var capitalesProyecto = {};
            var valor_plusvalia = 0;
            for (let m = 0; m < ma_codigos_py.length; m++) {
                codigo_aux = ma_codigos_py[m].codigo_proyecto;
                datos_segundero.codigo_objetivo = codigo_aux;
                capitalesProyecto = await segundero_cajas(datos_segundero);
                valor_plusvalia = Number(capitalesProyecto.plusGeneranCompleta);
                sum_plusvalias = sum_plusvalias + valor_plusvalia;
            }
            if (sum_plusvalias > 0) {
                n_ahorros = numero_punto_coma(sum_plusvalias.toFixed(0));
            } else {
                n_ahorros = "";
            }
        } else {
            n_ahorros = "";
        }

        //----------------------------------------------------------------
        // n_resp_social

        var n_resp_social = ""; // valor por defecto

        var ma_resp_social = await indiceProyecto.find(
            { proyecto_ganador: true, estado_proyecto: "completado" },
            {
                monto_dinero_rs: 1,
                _id: 0,
            }
        );

        if (ma_resp_social.length > 0) {
            var valor_rs = 0;
            var sum_rs = 0;
            for (let j = 0; j < ma_resp_social.length; j++) {
                valor_rs = ma_resp_social[j].monto_dinero_rs;
                sum_rs = sum_rs + valor_rs;
            }
            // despues de recorrer todas las resp sociales de todas los proyectos
            if (sum_rs > 0) {
                // redondeamos a valor entero para que no ocupe demasiado espacio en los cuadros descendentes de la ventana principal del sistema
                n_resp_social = numero_punto_coma(sum_rs.toFixed(0));
            } else {
                n_resp_social = "";
            }
        } else {
            n_resp_social = "";
        }

        //----------------------------------------------------------------

        const registro_empresa = await indiceEmpresa.findOne({});

        if (registro_empresa) {
            registro_empresa.n_construidos = n_construidos;
            registro_empresa.n_proyectos = n_proyectos;
            registro_empresa.n_inmuebles = n_inmuebles;
            registro_empresa.n_empleos = n_empleos;
            registro_empresa.n_ahorros = n_ahorros;
            registro_empresa.n_resp_social = n_resp_social;

            await registro_empresa.save();

            // en el paquete de respuesta estaran los valores como string y tendran como serparador de punto al punto
            var paquete_respuesta = {
                n_construidos, // m2
                n_proyectos,
                n_inmuebles,
                n_empleos,
                n_ahorros, // $us son las plusvalias de regalo
                n_resp_social, // Bs
            };

            // ------- Para verificación -------
            //console.log("los numeros de empresa actualizados");
            //console.log(paquete_respuesta);

            res.json({
                exito: "si",
                paquete_respuesta, // para pintarlo en html actualizado
            });
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
// para "TABLA DE VISITAS A LAS PAGINAS DE: TERRENO, PROYECTO, INMUEBLE"
controladorAdmAdministrador.visitas = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/visitas'
    try {
        var tipo_visita = req.body.tipo_visita;

        if (tipo_visita == "terreno") {
            var registro_resultados = await indiceTerreno
                .find(
                    {},
                    {
                        codigo_terreno: 1,
                        estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                        v_descripcion: 1,
                        v_proyectos: 1,
                        _id: 0,
                    }
                )
                .sort({ fecha_creacion: -1 }); // ordenado por fecha de reciente a antiguo
        }

        if (tipo_visita == "proyecto") {
            var registro_resultados = await indiceProyecto
                .find(
                    {},
                    {
                        codigo_proyecto: 1,
                        estado_proyecto: 1, // guardado o completado
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
                )
                .sort({ fecha_creacion: -1 }); // ordenado por fecha de reciente a antiguo
        }

        if (tipo_visita == "inmueble") {
            var registro_resultados = await indiceInmueble
                .find(
                    {},
                    {
                        codigo_inmueble: 1,
                        estado_inmueble: 1, // guardado, disponible, reservado, pendiente, pagado, pagos, remate, completado
                        v_descripcion: 1,
                        v_garantias: 1,
                        v_beneficios: 1,
                        v_info_economico: 1,
                        v_empleos: 1,
                        v_inversor: 1,
                        _id: 0,
                    }
                )
                .sort({ fecha_creacion: -1 }); // ordenado por fecha de reciente a antiguo
        }

        if (registro_resultados.length > 0) {
            // conversion del documento MONGO ([ARRAY]) a "string"
            var aux_string = JSON.stringify(registro_resultados);
            // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
            var listado_visitas = JSON.parse(aux_string);

            //---------------------------------------------------
            // agregando el numero total de visitas por terreno, proyecto, inmueble

            if (tipo_visita == "terreno") {
                for (let i = 0; i < listado_visitas.length; i++) {
                    listado_visitas[i].total_visitas =
                        listado_visitas[i].v_descripcion + listado_visitas[i].v_proyectos;
                }
            }

            if (tipo_visita == "proyecto") {
                for (let i = 0; i < listado_visitas.length; i++) {
                    listado_visitas[i].total_visitas =
                        listado_visitas[i].v_descripcion +
                        listado_visitas[i].v_inmuebles +
                        listado_visitas[i].v_garantias +
                        listado_visitas[i].v_beneficios +
                        listado_visitas[i].v_info_economico +
                        listado_visitas[i].v_empleos +
                        listado_visitas[i].v_resp_social +
                        listado_visitas[i].v_requerimientos;
                }
            }

            if (tipo_visita == "inmueble") {
                for (let i = 0; i < listado_visitas.length; i++) {
                    listado_visitas[i].total_visitas =
                        listado_visitas[i].v_descripcion +
                        listado_visitas[i].v_garantias +
                        listado_visitas[i].v_beneficios +
                        listado_visitas[i].v_info_economico +
                        listado_visitas[i].v_empleos +
                        listado_visitas[i].v_inversor;
                }
            }

            //---------------------------------------------------

            res.json({
                exito: "si",
                listado_visitas,
                tipo_visita,
            });
        } else {
            // significa que NO existen resultados para ser mostrados
            res.json({
                exito: "no",
                tipo_visita,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "BUSCAR NUMERO DE VISITAS DE: TERRENO, PROYECTO, INMUEBLE"

controladorAdmAdministrador.buscarVisitas = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/administrador/accion/buscar_visitas'
    try {
        // llevando todos a minusculas por seguridad
        var codigo_visita = req.body.codigo_visita.toLowerCase();

        //--------------- Verificacion ----------------
        //console.log("el codigo de las vistas es:");
        //console.log(codigo_visita);
        //---------------------------------------------

        // revisamos el tipo de codigo que se trata: "te", "py", "im"
        var tipo_visita = codigo_visita.substring(0, 2);

        //--------------- Verificacion ----------------
        //console.log("las primeras dos letraas de vistas es:");
        //console.log(tipo_visita);
        //---------------------------------------------

        if (tipo_visita == "te") {
            var registro_resultado = await indiceTerreno.findOne(
                {
                    codigo_terreno: codigo_visita,
                },
                {
                    codigo_terreno: 1,
                    estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                    v_descripcion: 1,
                    v_proyectos: 1,
                    _id: 0,
                }
            );
        }

        if (tipo_visita == "py") {
            var registro_resultado = await indiceProyecto.findOne(
                {
                    codigo_proyecto: codigo_visita,
                },
                {
                    codigo_proyecto: 1,
                    estado_proyecto: 1, // guardado o completado
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
        }

        if (tipo_visita == "im") {
            var registro_resultado = await indiceInmueble.findOne(
                {
                    codigo_inmueble: codigo_visita,
                },
                {
                    codigo_inmueble: 1,
                    estado_inmueble: 1, // guardado, disponible, reservado, pendiente, pagado, pagos, remate, completado
                    v_descripcion: 1,
                    v_garantias: 1,
                    v_beneficios: 1,
                    v_info_economico: 1,
                    v_empleos: 1,
                    v_inversor: 1,
                    _id: 0,
                }
            );
        }

        if (registro_resultado) {
            // conversion del documento MONGO a "string"
            var aux_string = JSON.stringify(registro_resultado);
            // reconversion del "string" a "objeto" EN ESTE CASO RESPETANDO QUE SERA UN ARRAY
            var visitas = JSON.parse(aux_string);

            //---------------------------------------------------
            // agregando el numero total de visitas por terreno, proyecto, inmueble

            if (tipo_visita == "te") {
                visitas.total_visitas = visitas.v_descripcion + visitas.v_proyectos;
            }

            if (tipo_visita == "py") {
                visitas.total_visitas =
                    visitas.v_descripcion +
                    visitas.v_inmuebles +
                    visitas.v_garantias +
                    visitas.v_beneficios +
                    visitas.v_info_economico +
                    visitas.v_empleos +
                    visitas.v_resp_social +
                    visitas.v_requerimientos;
            }

            if (tipo_visita == "im") {
                visitas.total_visitas =
                    visitas.v_descripcion +
                    visitas.v_garantias +
                    visitas.v_beneficios +
                    visitas.v_info_economico +
                    visitas.v_empleos +
                    visitas.v_inversor;
            }

            //---------------------------------------------------

            res.json({
                exito: "si",
                visitas,
                tipo_visita,
            });
        } else {
            // significa que NO existen resultados para ser mostrados
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

module.exports = controladorAdmAdministrador;
