// CONTROLADORES PARA EL FRACCION DESDE EL LADO DEL CLIENTE PUBLICO

const {
    indiceTerreno,
    indiceFraccionInmueble,
    indiceFraccionTerreno,
} = require("../modelos/indicemodelo");

const { cabezeras_adm_cli, datos_copropietario } = require("../ayudas/funcionesayuda_2");
const { numero_punto_coma, verificarTePyInmFracc } = require("../ayudas/funcionesayuda_3");
const { super_info_fraccion } = require("../ayudas/funcionesayuda_5");
const moment = require("moment");

const controladorCliFraccion = {};

//==========================================================================
//==========================================================================

// PARA RENDERIZAR LA VENTANA DE LA FRACCION DESDE EL LADO PUBLICO DEL CLIENTE
// RUTA   "get"   /fraccion/:codigo_fraccion/:vista_fraccion

controladorCliFraccion.renderVentanaFraccion = async (req, res) => {
    try {
        // ------------------------------------------------------

        var codigo_fraccion = req.params.codigo_fraccion;
        var tipo_vista_fraccion = req.params.vista_fraccion;

        //IMPORTANTE: PARA NO PERMITIR EL ACCESO A PROYECTOS INEXISTENTES O QUE NO ESTAN DISPONIBLES PARA SER VISIBLES POR EL USUARIO, ES QUE 1º EL PROYECTO SERA BUSCADO EN LA BASE DE DATOS

        var paqueteria_datos = {
            codigo_objetivo: codigo_fraccion,
            tipo: "fraccion",
        };
        var verificacion = await verificarTePyInmFracc(paqueteria_datos);

        if (verificacion == true) {
            var info_fraccion_cli = {};
            info_fraccion_cli.cab_fracc_cli = true;
            info_fraccion_cli.estilo_cabezera = "cabezera_estilo_fraccion";
            info_fraccion_cli.navegador_cliente = true;
            info_fraccion_cli.codigo_fraccion = codigo_fraccion;

            // ------- Para verificación -------
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO");
            //console.log(req.inversor_autenticado);
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");

            info_fraccion_cli.inversor_autenticado = req.inversor_autenticado;
            // si es TRUE y solo si es true, entonces se mostrara su ci
            if (req.inversor_autenticado) {
                info_fraccion_cli.ci_propietario = req.user.ci_propietario;
            }

            var aux_cabezera = {
                codigo_objetivo: codigo_fraccion,
                tipo: "fraccion",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_fraccion_cli.cabezera_cli = cabezera_cli;

            //-------------------------------------------------------------------------------
            // si el cliente esta navegado con su cuenta
            if (req.inversor_autenticado) {
                var ci_propietario = req.user.ci_propietario;
            } else {
                // en caso de que este navegando sin haber accedido a su cuenta personal

                var ci_propietario = "ninguno";
            }

            var paquete_datos = {
                codigo_fraccion,
                ci_propietario,
            };
            var global_fraccion = await complementos_globales_fraccion(paquete_datos);
            info_fraccion_cli.global_fraccion = global_fraccion;

            var existe_copropietario = global_fraccion.existe_copropietario; // true o false
            //-------------------------------------------------------------------------------

            info_fraccion_cli.es_fraccion = true; // para menu navegacion comprimido

            //----------------------------------------------------

            if (tipo_vista_fraccion == "descripcion") {
                // para mostrar seleccinada la pestaña donde nos encontramos
                // descripcion del lado administrador = lado cliente
                info_fraccion_cli.descripcion_fraccion = true;

                //info_fraccion_cli.info_segundero = true;

                var paquete_datos = {
                    codigo_fraccion,
                    ci_propietario, // ci_propietario || "ninguno"
                };

                var info_fraccion = await fraccion_descripcion(paquete_datos);
                info_fraccion_cli.informacion = info_fraccion;

                res.render("cli_fraccion", info_fraccion_cli);
            }

            if (tipo_vista_fraccion == "copropietario") {
                if (ci_inversionista != "ninguno" && existe_copropietario == true) {
                    // para mostrar seleccinada la pestaña donde nos encontramos
                    info_fraccion_cli.copropietario_fraccion = true;

                    let paquete_datos = {
                        ci_propietario,
                        codigo_fraccion,
                    };

                    var info_inmueble = await fraccion_copropietario(paquete_datos);
                    info_fraccion_cli.informacion = info_inmueble;

                    // ------- Para verificación -------
                    //console.log("los datos de PROPIETARIO del inmueble");
                    //console.log(info_fraccion_cli);

                    res.render("cli_fraccion", info_fraccion_cli);
                } else {
                    // porque un usuario navegando con una cuenta ci_propietario intenta ingresar a la pestaña privada de una fraccion del cual no es dueña
                    res.redirect("/"); // rediccionara a la pagina DE INICIO DEL CLIENTE
                }
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN INMUEBLE INEXISTENTE O QUE NO ESTA AUN DISPONIBLE PARA SER VISUALIZADO POR EL CLIENTE.
            res.redirect("/"); // rediccionara a la pagina DE INICIO DEL CLIENTE
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
// para informacion global de FRACCION que se mostrara en todas las ventanas

async function complementos_globales_fraccion(paquete_datos) {
    const codigo_fraccion = paquete_datos.codigo_fraccion;
    const ci_propietario = paquete_datos.ci_propietario;

    var existe_copropietario = false; // por defecto

    // revision si se trata de una fraccion de tipo copropietario o inversionista

    var fraccionInmueble = await indiceFraccionInmueble.findOne({
        codigo_fraccion: codigo_fraccion,
        tipo: "copropietario",
        disponible: false,
        ci_propietario: ci_propietario,
    });

    if (fraccionInmueble) {
        existe_copropietario = true;
    } else {
        var fraccionTerreno = await indiceFraccionTerreno.findOne({
            codigo_fraccion: codigo_fraccion,
            disponible: false,
            ci_propietario: ci_propietario,
        });

        if (fraccionTerreno) {
            existe_copropietario = true;
        }
    }

    return {
        existe_copropietario,
    };
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorCliFraccion;