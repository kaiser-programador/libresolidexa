const {
    indiceTerreno,
    indiceFraccionInmueble,
    indiceFraccionTerreno,
} = require("../modelos/indicemodelo");

const {
    verificadorTerrenoBloqueado,
    guardarAccionAdministrador,
    verificadorLlavesMaestras,
} = require("../ayudas/funcionesayuda_1");

const { cabezeras_adm_cli, datos_copropietario } = require("../ayudas/funcionesayuda_2");
const { numero_punto_coma } = require("../ayudas/funcionesayuda_3");
const { super_info_fraccion } = require("../ayudas/funcionesayuda_5");
const moment = require("moment");

const controladorAdmFraccion = {};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// RENDERIZAR VENTANA DE FRACCION
// ruta: get   "/laapirest/fraccion/:codigo_fraccion/:ventana_fraccion"

controladorAdmFraccion.renderizarVentanaFraccion = async (req, res) => {
    try {
        var codigo_fraccion = req.params.codigo_fraccion;
        var tipo_ventana = req.params.ventana_inmueble;

        var fraccionEncontrado = false; // por defecto
        var ci_propietario = "ninguno"; // por defecto
        var existe_copropietario = false; // por defecto

        var fraccionEncontradoTe = await indiceFraccionTerreno.findOne(
            {
                codigo_fraccion: codigo_fraccion,
            },
            {
                ci_propietario: 1,
                disponible: 1,
            }
        );

        if (fraccionEncontradoTe) {
            fraccionEncontrado = true;
            if (fraccionEncontradoTe.disponible == false) {
                existe_copropietario = true;
                ci_propietario = fraccionEncontradoTe.ci_propietario;
            }
        } else {
            var fraccionEncontradoInm = await indiceFraccionInmueble.findOne(
                {
                    codigo_fraccion: codigo_fraccion,
                },
                {
                    ci_propietario: 1,
                    disponible: 1,
                }
            );
            if (fraccionEncontradoInm) {
                fraccionEncontrado = true;
                if (fraccionEncontradoInm.disponible == false) {
                    existe_copropietario = true;
                    ci_propietario = fraccionEncontradoInm.ci_propietario;
                }
            }
        }

        if (fraccionEncontrado) {
            // VERIFICAMOS QUE EL INMUEBLE EXISTA EN LA BASE DE DATOS
            var info_fraccion = {};
            info_fraccion.cab_fracc_adm = true;
            info_fraccion.estilo_cabezera = "cabezera_estilo_fraccion";

            //----------------------------------------------------

            info_fraccion.codigo_fraccion = codigo_fraccion;

            var aux_cabezera = {
                codigo_objetivo: codigo_fraccion,
                tipo: "fraccion",
            };

            var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
            info_fraccion.cabezera_adm = cabezera_adm;

            info_fraccion.es_fraccion = true; // para menu navegacion comprimido

            info_fraccion.existe_copropietario = existe_copropietario; // true o false para mostrar la pestaña de copropietario

            if (tipo_ventana == "descripcion") {
                // descripcion del lado administrador = lado cliente
                info_fraccion.descripcion_fraccion = true;

                let paquete_datos = {
                    codigo_fraccion,
                    ci_propietario, // ci_propietario || "ninguno"
                };

                var informacion = await fraccion_descripcion(paquete_datos);
                info_fraccion.informacion = informacion;

                res.render("adm_fraccion", info_fraccion);
            }

            // para COPROPIETARIOS de fraccions FRACCIONADOS
            if (tipo_ventana == "copropietario") {
                if (existe_copropietario) {
                    info_fraccion.copropietario_fraccion = true;

                    let paquete_datos = {
                        ci_propietario,
                        codigo_fraccion,
                    };

                    var informacion = await fraccion_copropietario(paquete_datos);
                    info_fraccion.informacion = informacion;

                    res.render("adm_fraccion", info_fraccion);
                } else {
                    res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
                }
            }

            if (tipo_ventana == "eliminar") {
                info_fraccion.eliminar_fraccion = true;
                res.render("adm_fraccion", info_fraccion);
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN fraccion INEXISTENTE.
            res.redirect("/laapirest/accesosistema"); // rediccionara a la pagina inicio del sistema
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------

async function fraccion_descripcion(paquete_datos) {
    try {
        var codigo_fraccion = paquete_datos.codigo_fraccion;
        var ci_propietario = paquete_datos.ci_propietario;

        var fecha_adquisicion = ""; // por defecto
        var arrayInmuebles = []; // por defecto

        moment.locale("es");

        // una sola fraccion de terreno puede ser convertida a fraccion de inmueble del tipo: "copropietario" (una sola) o "inversionista" (de una solo, o diferentes inmuebles que pertenecen al mismo terreno)

        var datos_funcion = {
            codigo_fraccion,
            ci_propietario,
        };
        var respuesta = await super_info_fraccion(datos_funcion);

        var fraccion_bs = respuesta.fraccion_bs;
        var fraccion_bs_render = respuesta.fraccion_bs_render;
        var ganancia_bs = respuesta.ganancia_bs;
        var ganancia_bs_render = respuesta.ganancia_bs_render;
        var plusvalia_bs = respuesta.plusvalia_bs;
        var plusvalia_bs_render = respuesta.plusvalia_bs_render;
        var existe_inversionista = respuesta.existe_inversionista;
        var existe_copropietario = respuesta.existe_copropietario;
        var array_segundero = respuesta.array_segundero;

        if (existe_inversionista) {
            // solo en indiceFraccionTerreno se encuentra el dato de fecha_compra de la fraccion
            let fraccionTerreno = await indiceFraccionTerreno.findOne(
                {
                    codigo_fraccion: codigo_fraccion,
                    disponible: false,
                    ci_propietario: ci_propietario,
                },
                {
                    codigo_terreno: 1,
                    fecha_compra: 1,
                }
            );

            if (fraccionTerreno) {
                // Convertir la fecha de MongoDB a un objeto Moment
                var fechaMongo = moment(fraccionInmueble.fecha_copropietario);

                // Formatear la fecha en el formato deseado Ejemplo: "29/enero/2024"
                fecha_adquisicion = fechaMongo.format("D[/]MMMM[/]YYYY");

                // usamos ".find" porque la fraccion puede formar parte de diferentes inmuebles como "inversionista"
                let fraccionInmueble = await indiceFraccionInmueble.find(
                    {
                        codigo_fraccion: codigo_fraccion,
                        disponible: false,
                        ci_propietario: ci_propietario,
                        tipo: "inversionista",
                    },
                    {
                        codigo_inmueble: 1,
                        ganancia_bs: 1,
                        fecha_pago: 1,
                        fecha_inversionista: 1,
                    }
                );

                let registroTerreno = await indiceTerreno.findOne(
                    {
                        codigo_terreno: fraccionTerreno.codigo_terreno,
                    },
                    {
                        fecha_inicio_convocatoria: 1,
                    }
                );

                if (fraccionInmueble.length > 0 && registroTerreno) {
                    for (let i = 0; i < fraccionInmueble.length; i++) {
                        let fechaMongoA = moment(fraccionInmueble[i].fecha_pago);
                        let fecha_pago = fechaMongoA.format("D[/]MMMM[/]YYYY");
                        let fechaMongoB = moment(registroTerreno.fecha_inicio_convocatoria);
                        let fecha_inicio = fechaMongoB.format("D[/]MMMM[/]YYYY");
                        let fechaMongoC = moment(fraccionInmueble[i].fecha_inversionista);
                        let fecha_fin = fechaMongoC.format("D[/]MMMM[/]YYYY");
                        arrayInmuebles[i] = {
                            codigo_inmueble: fraccionInmueble[i].codigo_inmueble,
                            ganancia_bs: fraccionInmueble[i].ganancia_bs,
                            ganancia_bs_render: numero_punto_coma(fraccionInmueble[i].ganancia_bs),
                            fecha_adquisicion,
                            fecha_inicio,
                            fecha_fin,
                            fecha_pago,
                        };
                    }
                }
            }
        }

        if (existe_copropietario) {
            // usamos ".findOne" porque una fraccion puede formar parte de unicamente un solo inmueble como "copropietario"
            let fraccionInmueble = await indiceFraccionInmueble.findOne(
                {
                    codigo_fraccion: codigo_fraccion,
                    disponible: false,
                    ci_propietario: ci_propietario,
                    tipo: "copropietario",
                },
                {
                    fecha_copropietario: 1,
                    codigo_inmueble: 1,
                }
            );

            if (fraccionInmueble) {
                // Convertir la fecha de MongoDB a un objeto Moment
                var fechaMongo = moment(fraccionInmueble.fecha_copropietario);

                // Formatear la fecha en el formato deseado Ejemplo: "29/enero/2024"
                fecha_adquisicion = fechaMongo.format("D[/]MMMM[/]YYYY");

                let registroTerreno = await indiceTerreno.findOne(
                    {
                        codigo_terreno: fraccionTerreno.codigo_terreno,
                    },
                    {
                        fecha_inicio_construccion: 1,
                        fecha_fin_construccion: 1,
                    }
                );

                if (registroTerreno) {
                    let fechaMongoB = moment(registroTerreno.fecha_inicio_construccion);
                    let fecha_inicio = fechaMongoB.format("D[/]MMMM[/]YYYY");
                    let fechaMongoC = moment(registroTerreno.fecha_fin_construccion);
                    let fecha_fin = fechaMongoC.format("D[/]MMMM[/]YYYY");

                    arrayInmuebles[0] = {
                        codigo_inmueble: fraccionInmueble.codigo_inmueble,
                        plusvalia_bs,
                        plusvalia_bs_render,
                        fecha_adquisicion,
                        fecha_inicio,
                        fecha_fin,
                    };
                }
            }
        }

        var objetoResultado = {
            existe_inversionista, // true o false
            existe_copropietario, // true o false
            // "propietario" solo tiene un valor para los inmuebles del tipo entero, no para fracciones
            propietario: 0,
            propietario_render: "0",
            fraccion_bs,
            fraccion_bs_render,
            ganancia_bs,
            ganancia_bs_render,
            plusvalia_bs,
            plusvalia_bs_render,
            array_segundero,
            arrayInmuebles,
        };

        return objetoResultado;
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function fraccion_copropietario(paquete_datos) {
    // es casi similar al controlador: llenar_datos_copropietario_inm

    try {
        var ci_propietario = paquete_datos.ci_propietario;
        var codigo_fraccion = paquete_datos.codigo_fraccion;

        //--------------------------------------------------------
        // para armado de datos personales, documentos privados del copropietario
        var datos_funcion = {
            ci_propietario,
            codigo_objetivo: codigo_fraccion,
            copropietario: "fraccion",
        };

        // {datos personales..., documentos_privados}
        var obj_datos = await datos_copropietario(datos_funcion);

        //--------------------------------------------------------------

        return obj_datos;

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
        }
        */
    } catch (error) {
        console.log(error);
    }
}
// ------------------------------------------------------------------

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SERAN ELIMINADOS TODOS LOS REGISTROS QUE TIENE LA FRACCION. (ESCEPTO LOS DOCUMENTOS PRIVADOS, PARA ELIMINARLOS SE LO HACE A TRAVEZ DE ELIMINAR COPROPIETARIO)

controladorAdmFraccion.eliminarFraccion = async (req, res) => {
    // RUTA  "DELETE"    "/laapirest/fraccion/:codigo_fraccion/accion/eliminar_fraccion"
    try {
        var codigo_fraccion = req.params.codigo_fraccion;

        var fraccionEncontrado = false; // por defecto

        var fraccionEncontradoInm = await indiceFraccionInmueble.findOne(
            {
                codigo_fraccion: codigo_fraccion,
            },
            {
                codigo_terreno: 1,
            }
        );

        var fraccionEncontradoTe = await indiceFraccionTerreno.findOne(
            {
                codigo_fraccion: codigo_fraccion,
            },
            {
                codigo_terreno: 1,
            }
        );

        if (fraccionEncontradoInm) {
            var codigo_terreno = fraccionEncontradoInm.codigo_terreno;
            fraccionEncontrado = true;
        } else {
            if (fraccionEncontradoTe) {
                var codigo_terreno = fraccionEncontradoTe.codigo_terreno;
                fraccionEncontrado = true;
            }
        }

        if (fraccionEncontrado) {
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
                    if (fraccionEncontradoInm) {
                        await indiceFraccionInmueble.deleteMany({
                            codigo_fraccion: codigo_fraccion,
                        });
                    }

                    if (fraccionEncontradoTe) {
                        await indiceFraccionTerreno.deleteMany({
                            codigo_fraccion: codigo_fraccion,
                        });
                    }

                    //-------------------------------------------------------------------
                    // guardamos en el historial de acciones
                    var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                    var accion_administrador = "Elimina fracción " + codigo_fraccion;
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
        } else {
            res.json({
                exito: "no",
                mensaje:
                    "Fracción No encontrado, por favor refresque la ventana e intentelo nuevamente",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorAdmFraccion;
