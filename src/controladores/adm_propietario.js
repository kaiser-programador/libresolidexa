// CONTROLADOR RELACIONADO CON EL INVERSIONISTA DESDE EL LADO DEL GESTIONADOR DE LA APLICACION

const {
    indice_propietario,
    indiceInversiones,
    indiceAdministrador,
    indiceEmpresa,
    indiceFraccionInmueble,
} = require("../modelos/indicemodelo");

const { inmueble_card_adm_cli, fraccion_card_adm_cli } = require("../ayudas/funcionesayuda_1");

const {
    cabezeras_adm_cli,
    datos_propietario,
    datos_copropietario,
} = require("../ayudas/funcionesayuda_2");

const { te_inm_copropietario } = require("../ayudas/funcionesayuda_4");

// se usa para mover la imagen (la imagen misma) de la carpeta "temporal" a la carpeta "subido"
// tambien se usara su metodo "unlink" para eliminar archivos (como imagenes o pdf)
//const fs = require("fs-extra");

//const pache = require("path");

const controladorPropietario = {};

/************************************************************************************** */
/************************************************************************************** */
// llena los datos del propietario
controladorPropietario.llenar_datos_propietario = async (req, res) => {
    // la ruta que entra a este controlador es:
    // POST   '/laapirest/propietario/accion/llenar_datos_propietario'

    var ci_propietario = req.body.ci_propietario;

    var aux_respuesta = await datos_propietario(ci_propietario);

    res.json({
        respuesta: aux_respuesta,
    });
};

//=========================================================================
//=========================================================================
// llena los datos del copropietario
controladorPropietario.llenar_datos_copropietario_inm = async (req, res) => {
    // la ruta que entra a este controlador es:
    // POST   '/laapirest/propietario/accion/llenar_datos_copropietario_inm'

    var ci_propietario = req.body.ci_propietario;
    var codigo_inmueble = req.body.codigo_inmueble;

    //--------------------------------------------------------
    // para armado de datos personales, documentos privados del copropietario
    var datos_funcion = {
        ci_propietario,
        codigo_objetivo: codigo_inmueble,
        copropietario: "inmueble",
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

    res.json(obj_union);
};

//=========================================================================
//=========================================================================
// llena los datos del copropietario
controladorPropietario.llenar_datos_copropietario_te = async (req, res) => {
    // la ruta que entra a este controlador es:
    // POST   '/laapirest/propietario/accion/llenar_datos_copropietario_te'

    var ci_propietario = req.body.ci_propietario;
    var codigo_terreno = req.body.codigo_terreno;

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

    res.json(obj_union);
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
controladorPropietario.guardarDatosInversor = async (req, res) => {
    // RUTA:  POST   /laapirest/inversor/guardar_datos_inversor

    try {
        var inversor_ci = req.body.inversor_ci;
        // ------- Para verificación -------
        //console.log("el ci del inversor es: " + inversor_ci);

        var registro_inversor = await indice_propietario.findOne({ ci_propietario: inversor_ci });
        if (registro_inversor) {
            registro_inversor.nombres_inversionista = req.body.inversor_nombres;
            registro_inversor.apellidos_inversionista = req.body.inversor_apellidos;
            registro_inversor.departamento_inversionista = req.body.inversor_departamento;
            registro_inversor.provincia_inversionista = req.body.inversor_provincia;
            registro_inversor.domicilio_inversionista = req.body.inversor_domicilio;
            registro_inversor.ocupacion_inversionista = req.body.inversor_ocupacion;
            registro_inversor.fecha_nacimiento_propietario = req.body.inversor_nacimiento;
            registro_inversor.telefonos_inversionista = req.body.inversor_telefonos;

            await registro_inversor.save();
            res.json({
                mensaje: "exito",
            });
        } else {
            res.json({
                mensaje: "fracaso",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// PARA RENDERIZAR LA VENTANA DEL ADMINISTRADOR segun la pestaña que sea elegida

// RUTA   "get"  "/laapirest/propietario/:ci_propietario/:ventana_propietario"
controladorPropietario.renderizarVentanaPropietario = async (req, res) => {
    try {
        var codigo_propietario = req.params.ci_propietario; // extraido de la SESION guardada del administrador
        var tipo_ventana_propietario = req.params.ventana_propietario;

        var info_propietario = {};
        info_propietario.cab_prop_adm = true;
        info_propietario.codigo_propietario = codigo_propietario;

        var aux_cabezera = {
            codigo_objetivo: codigo_propietario,
            tipo: "propietario",
        };

        info_propietario.estilo_cabezera = "cabezera_estilo_propietario";

        //----------------------------------------------------

        var cabezera_adm = await cabezeras_adm_cli(aux_cabezera);
        info_propietario.cabezera_adm = cabezera_adm;

        info_propietario.es_propietario = true; // para menu navegacion comprimido

        if (tipo_ventana_propietario == "datos") {
            var contenido_propietario = await informacion_propietario(codigo_propietario);
            info_propietario.datos_propietario = true; // para pestaña y ventana apropiada para proyecto
            info_propietario.contenido_propietario = contenido_propietario;
            // ------- Para verificación -------

            //console.log("los datos para renderizar DATOS DEL PROPIETARIO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }

        if (tipo_ventana_propietario == "resumen") {
            info_propietario.info_segundero = true;
            var contenido_propietario = await resumen_propietario(codigo_propietario);
            info_propietario.resumen_propietario = true; // para pestaña y ventana apropiada
            info_propietario.informacion = contenido_propietario;

            res.render("adm_propietario", info_propietario);
        }

        if (tipo_ventana_propietario == "fracciones") {
            var contenido_propietario = await fracciones_propietario(codigo_propietario);
            info_propietario.fracciones_propietario = true; // para pestaña y ventana apropiada
            info_propietario.contenido_propietario = contenido_propietario;
            // ------- Para verificación -------

            //console.log("los datos para renderizar INFORMACION DEL PROPIETARIO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }

        if (tipo_ventana_propietario == "propiedades") {
            let contenido_propietario = await propiedades_propietario(codigo_propietario);
            info_propietario.propiedades_propietario = true; // para pestaña y ventana apropiada

            //--------------------------------------------------------------
            // para mostrar los estados en filtro ordenador
            info_propietario.estado_py_todos = true;
            info_propietario.estado_py_reserva = true;
            info_propietario.estado_py_construccion = true;
            info_propietario.estado_py_construido = true;
            info_propietario.estado_rematado = true;

            //--------------------------------------------------------------
            // para contar el numero de inmuebles, segun el estado que posean
            let aux_n_todos = contenido_propietario.length;
            let aux_n_disponible = 0;
            let aux_n_reservado = 0;
            let aux_n_construccion = 0;
            let aux_n_remate = 0;
            let aux_n_rematado = 0;
            let aux_n_construido = 0;

            // guardado, disponible, reservado, construccion, remate, construido  OK
            if (contenido_propietario.length > 0) {
                for (let i = 0; i < contenido_propietario.length; i++) {
                    let aux_estado_inmueble = contenido_propietario[i].estado_inmueble;
                    let aux_estado_propietario = contenido_propietario[i].estado_propietario;

                    if (aux_estado_propietario == "pasivo") {
                        aux_n_rematado = aux_n_rematado + 1;
                    } else {
                        // aquellos que son "activos"
                        if (aux_estado_inmueble == "disponible") {
                            aux_n_disponible = aux_n_disponible + 1;
                        }
                        if (aux_estado_inmueble == "reservado") {
                            aux_n_reservado = aux_n_reservado + 1;
                        }
                        if (aux_estado_inmueble == "construccion") {
                            aux_n_construccion = aux_n_construccion + 1;
                        }
                        if (aux_estado_inmueble == "remate") {
                            aux_n_remate = aux_n_remate + 1;
                        }
                        if (aux_estado_inmueble == "construido") {
                            aux_n_construido = aux_n_construido + 1;
                        }
                    }
                }
            }

            //-----------------------------------------------
            // despues de pasar por todos los conteos de inmuebles

            if (aux_n_todos > 0) {
                info_propietario.badge_todos = true;
            } else {
                info_propietario.badge_todos = false;
            }

            if (aux_n_disponible > 0) {
                info_propietario.badge_disponible = true;
            } else {
                info_propietario.badge_disponible = false;
            }

            if (aux_n_reservado > 0) {
                info_propietario.badge_reservado = true;
            } else {
                info_propietario.badge_reservado = false;
            }

            if (aux_n_construccion > 0) {
                info_propietario.badge_construccion = true;
            } else {
                info_propietario.badge_construccion = false;
            }

            if (aux_n_remate > 0) {
                info_propietario.badge_remate = true;
            } else {
                info_propietario.badge_remate = false;
            }

            if (aux_n_rematado > 0) {
                info_propietario.badge_rematado = true;
            } else {
                info_propietario.badge_rematado = false;
            }

            if (aux_n_construido > 0) {
                info_propietario.badge_construido = true;
            } else {
                info_propietario.badge_construido = false;
            }

            //-----------------------------------------------
            info_propietario.n_todos = aux_n_todos;
            info_propietario.n_disponible = aux_n_disponible;
            info_propietario.n_reservado = aux_n_reservado;
            info_propietario.n_construccion = aux_n_construccion;
            info_propietario.n_remate = aux_n_remate;
            info_propietario.n_rematado = aux_n_rematado;
            info_propietario.n_construido = aux_n_construido;

            //--------------------------------------------------------------
            info_propietario.contenido_propietario = contenido_propietario;
            // ------- Para verificación -------

            //console.log("los datos para renderizar PROPIETARIO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }

        if (tipo_ventana_propietario == "eliminar") {
            info_propietario.eliminar_propietario = true; // para pestaña y ventana apropiada para proyecto
            // ------- Para verificación -------

            //console.log("los datos para renderizar PROPIETARIO");
            //console.log(info_propietario);

            res.render("adm_propietario", info_propietario);
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------
async function informacion_propietario(codigo_propietario) {
    try {
        var aux_respuesta = await datos_propietario(codigo_propietario);

        if (aux_respuesta) {
            return aux_respuesta;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function propiedades_propietario(codigo_propietario) {
    try {
        // inmuebles ENTEROS que pertenecen al propietario como ABSOLUTO
        var inm_propietario = await indiceInversiones.find(
            { ci_propietario: codigo_propietario },
            {
                codigo_inmueble: 1,
                estado_propietario: 1,
                _id: 0,
            }
        );

        // inmuebles que pertenecen al propietario como COPROPIETARIO
        var inm_co_propietario = await indiceFraccionInmueble.find(
            { ci_propietario: codigo_propietario, tipo: "copropietario" },
            {
                codigo_inmueble: 1,
                _id: 0,
            }
        );

        var contenido_inm_prop = [];

        if (inm_propietario.length > 0 || inm_co_propietario.length > 0) {
            var indice = -1;

            if (inm_propietario.length > 0) {
                for (let i = 0; i < inm_propietario.length; i++) {
                    // paquete_inmueble = {codigo_inmueble,codigo_usuario}
                    var paquete_inmueble_i = {
                        codigo_inmueble: inm_propietario[i].codigo_inmueble,
                        codigo_usuario: "ninguno", // porque es desde el lado del ADMINISTRADOR
                        laapirest: "/laapirest/", // por partir desde el lado del ADMINISTRADOR
                    };
                    indice = indice + 1;
                    contenido_inm_prop[indice] = await inmueble_card_adm_cli(paquete_inmueble_i);
                    contenido_inm_prop[indice].card_externo = true; // para que muestre info de card EXTERIONES
                    contenido_inm_prop[indice].estado_propietario =
                        inm_propietario[indice].estado_propietario;
                }
            }

            if (inm_co_propietario.length > 0) {
                for (let i = 0; i < inm_co_propietario.length; i++) {
                    // paquete_inmueble = {codigo_inmueble,codigo_usuario}
                    var paquete_inmueble_i = {
                        codigo_inmueble: inm_co_propietario[i].codigo_inmueble,
                        codigo_usuario: "ninguno", // porque es desde el lado del ADMINISTRADOR
                        laapirest: "/laapirest/", // por partir desde el lado del ADMINISTRADOR
                    };
                    indice = indice + 1;
                    contenido_inm_prop[indice] = await inmueble_card_adm_cli(paquete_inmueble_i);
                    contenido_inm_prop[indice].card_externo = true; // para que muestre info de card EXTERIONES
                    contenido_inm_prop[indice].estado_propietario = "activo";
                }
            }
        }
        return contenido_inm_prop;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function resumen_propietario(codigo_propietario) {
    try {
        //-------------------------------------------------------------------------------
        var paquete_datos = {
            ci_propietario: codigo_propietario,
            navegacion: "administrador",
        };

        var resultado = await super_info_propietario(paquete_datos);

        var plusvalia = resultado.plusvalia;
        var plusvalia_render = resultado.plusvalia_render;
        var ganancia = resultado.ganancia;
        var ganancia_render = resultado.ganancia_render;
        var fracciones = resultado.fracciones;
        var fracciones_render = resultado.fracciones_render;
        var propietario = resultado.propietario;
        var propietario_render = resultado.propietario_render;
        var array_segundero = resultado.array_segundero;
        var historial_propietario = resultado.historial_propietario;

        //-------------------------------------------------------------------------------
        // PARA LA SIGNIFICADO DE SEGUNDERO

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                texto_segundero_prop_iz: 1,
                _id: 0,
            }
        );

        //---------------------------------------------------------------
        // para mensaje debajo de segundero lado IZQUIERDO

        var mensaje_segundero_pro = "Mensaje segundero propietario"; // texto por defecto
        var reg_nombre_prop = await indice_propietario.findOne(
            { ci_propietario: codigo_propietario },
            {
                nombres_propietario: 1,
                _id: 0,
            }
        );

        if (reg_nombre_prop) {
            if (registro_empresa.texto_segundero_prop_iz != undefined) {
                if (registro_empresa.texto_segundero_prop_iz.indexOf("/nom_propietario/") != -1) {
                    var significado_aux_0 = registro_empresa.texto_segundero_prop_iz;
                    var mensaje_segundero_pro = significado_aux_0.replace(
                        "/nom_propietario/",
                        reg_nombre_prop.nombres_propietario
                    );
                }
            }
        }

        //-------------------------------------------------------------------------------

        var total_resumen_propietario = {
            plusvalia,
            plusvalia_render,
            ganancia,
            ganancia_render,
            fracciones,
            fracciones_render,
            propietario,
            propietario_render,
            array_segundero,
            historial_propietario,
            mensaje_segundero: mensaje_segundero_pro,
        };
        //-------------------------------------------------------------------------------

        return total_resumen_propietario;
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function fracciones_propietario(codigo_propietario) {
    try {
        var array_card_fracciones = []; // vacio de inicio

        // todas las fracciones que guardan relacion con el propietario
        var aux_fracciones_te = await indiceFraccionTerreno.find(
            { ci_propietario: codigo_propietario },
            {
                codigo_fraccion: 1,
                fecha_compra: 1,
                _id: 0,
            }
        );
        var fracciones_terreno = [];

        // todas las fracciones que guardan relacion con el propietario
        // solo consideramos tipo "copropietario", porque las de tipo "inversionista" tienen su origen en la fraccion de terreno.
        var aux_fracciones_inm = await indiceFraccionInmueble.find(
            { ci_propietario: codigo_propietario, tipo: "copropietario" },
            {
                codigo_fraccion: 1,
                fecha_copropietario: 1,
                _id: 0,
            }
        );
        var fracciones_inmueble = [];

        if (aux_fracciones_te.length > 0) {
            for (let i = 0; i < aux_fracciones_te.length; i++) {
                fracciones_terreno[i] = {
                    codigo_fraccion: aux_fracciones_te[i].codigo_fraccion,
                    fecha: aux_fracciones_te[i].fecha_compra,
                };
            }
        }

        if (aux_fracciones_inm.length > 0) {
            for (let i = 0; i < aux_fracciones_inm.length; i++) {
                //-------------------------------
                // pueda darse el caso que una fraccion de inmueble de tipo copropietario tenga origen en fraccion de terreno, de modo que estas fracciones copropietario NO SERAN TOMADAS EN CUENTA, porque la fecha origen de estas fracciones es la "fecha_compra" como fraccion de terreno.

                if (fracciones_terreno.length > 0) {
                    let encontrado = false; // Bandera para verificar si ya existe el codigo_fraccion
                    for (let k = 0; k < fracciones_terreno.length; k++) {
                        if (
                            aux_fracciones_inm[i].codigo_fraccion ==
                            fracciones_terreno[k].codigo_fraccion
                        ) {
                            encontrado = true; // Si ya existe, marcamos la bandera como verdadera
                            break; // Salimos del bucle porque ya no necesitamos seguir buscando
                        }
                    }
                    // Si no se encuentra el codigo_fraccion, lo agregamos al array limpio
                    if (!encontrado) {
                        let elemento = {
                            codigo_fraccion: aux_fracciones_inm[i].codigo_fraccion,
                            fecha: aux_fracciones_inm[i].fecha_copropietario,
                        };
                        fracciones_inmueble.push(elemento);
                    }
                } else {
                    fracciones_inmueble[i] = {
                        codigo_fraccion: aux_fracciones_inm[i].codigo_fraccion,
                        fecha: aux_fracciones_inm[i].fecha_copropietario,
                    };
                }
            }
        }

        if (fracciones_terreno.length > 0 || fracciones_inmueble.length > 0) {
            // Paso 1: Unir ambos arrays
            var arrayUnido = [];
            for (let i = 0; i < fracciones_terreno.length; i++) {
                arrayUnido.push(fracciones_terreno[i]); // Agregar elementos del primer array
            }
            for (let i = 0; i < fracciones_inmueble.length; i++) {
                arrayUnido.push(fracciones_inmueble[i]); // Agregar elementos del segundo array
            }

            // Paso 2: Ordenar por fecha (de más reciente a más antiguo)
            for (let i = 0; i < arrayUnido.length - 1; i++) {
                for (let j = 0; j < arrayUnido.length - i - 1; j++) {
                    //var fecha1 = new Date(arrayUnido[j].fecha);
                    //var fecha2 = new Date(arrayUnido[j + 1].fecha);
                    var fecha1 = arrayUnido[j].fecha;
                    var fecha2 = arrayUnido[j + 1].fecha;
                    if (fecha1 < fecha2) {
                        // Intercambiar elementos si no están en el orden correcto
                        var temp = arrayUnido[j];
                        arrayUnido[j] = arrayUnido[j + 1];
                        arrayUnido[j + 1] = temp;
                    }
                }
            }

            //-----------------------------------------------------------------

            for (let i = 0; i < arrayUnido.length; i++) {
                var paquete_fraccion = {
                    codigo_fraccion: arrayUnido[i].codigo_fraccion,
                    ci_propietario: codigo_propietario,
                    tipo_navegacion: "administrador", // porque estamos dentro de un controlador administrador
                };
                var card_fraccion_i = await fraccion_card_adm_cli(paquete_fraccion);
                array_card_fracciones[i] = card_fraccion_i;
            }
        }

        var contenido_fracciones = {
            array_card_fracciones,
        };

        return contenido_fracciones;
    } catch (error) {
        console.log(error);
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// de los da el administrador a aquellos propietarios que requieran sus re-claves cuando los propietarios olvidan sus claves de acceso
controladorPropietario.nuevasClavesInversor = async (req, res) => {
    //  viene de la RUTA  POST   '/laapirest/inversor/nuevas_claves'
    try {
        // ------- Para verificación -------
        //console.log("los datos del body para re-claves del inversor");
        //console.log(req.body);

        var usuario_maestro = req.body.usuario_maestro;
        var clave_maestro = req.body.clave_maestro;
        var ci_inversionista = req.body.ci_inversionista;

        var registro_maestro = await indiceAdministrador.findOne({
            ad_usuario: usuario_maestro,
        });

        if (registro_maestro) {
            // revision de contraseña
            const respuesta = await registro_maestro.compararContrasena(clave_maestro); // nos devuelve TRUE o FALSE

            if (respuesta) {
                // los nuevos codigos de acceso seran: fecha nacimiento y c.i. inversor
                var registro_inversor = await indice_propietario.findOne({
                    ci_propietario: ci_inversionista,
                });

                if (registro_inversor) {
                    let usuario = registro_inversor.ci_propietario;

                    let auxFechaNacimiento = registro_inversor.fecha_nacimiento_propietario;
                    // en mongo esta guardado en este formato:
                    // 2010-10-10T00:00:00.000Z
                    let fechaLocal = auxFechaNacimiento.toISOString();
                    // con "toISOString()" lo convertimos en cadena
                    // "2010-10-10T00:00:00.000Z"
                    let arrayFecha_1 = fechaLocal.split("T");
                    let fechaPinta = arrayFecha_1[0]; // nos devolvera "2010-10-10" y eso si se puede pintar en un input tipo "date"

                    let arrayFecha_2 = fechaPinta.split("-");
                    let year = arrayFecha_2[0];
                    let mes = arrayFecha_2[1];
                    let dia = arrayFecha_2[2];
                    let clave = dia + mes + year; // concatenamos

                    // ------- Para verificación -------
                    //console.log("vemos la contraseña diaMesAño ej/ 05011988");
                    //console.log(clave);

                    registro_inversor.usuario_propietario = usuario;
                    // antes encriptarlo para ser guardado
                    registro_inversor.clave_propietario =
                        await registro_inversor.encriptarContrasena(clave);
                    await registro_inversor.save();
                    //registro_inversor.save();

                    // ------- Para verificación -------
                    //console.log("los nuevos reclaves del propietario es:");
                    //console.log(usuario + "  " + clave);

                    res.json({
                        mensaje: "exito",
                        usuario,
                        clave,
                    });
                } else {
                    res.json({
                        mensaje: "ci denegado",
                    });
                }
            } else {
                res.json({
                    mensaje: "maestro denegado",
                });
            }
        } else {
            res.json({
                mensaje: "maestro denegado",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorPropietario;
