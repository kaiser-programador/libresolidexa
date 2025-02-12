// CONTROLADOR INVERSOR DESDE PUBLICO

const pasaporte = require("passport"); // NO es para inicializarlo, porque eso ya esta echo, sino mas bien para "ejecutarlo segun las tareas que se le definio en pasaporte.js"

const {
    indice_propietario,
    indiceInversiones,
    indiceGuardados,
    indiceEmpresa,
    indiceInmueble,
    indiceFraccionTerreno,
    indiceFraccionInmueble,
} = require("../modelos/indicemodelo");

const { inmueble_card_adm_cli, fraccion_card_adm_cli } = require("../ayudas/funcionesayuda_1");

const { cabezeras_adm_cli, datos_propietario } = require("../ayudas/funcionesayuda_2");

const { te_inm_copropietario } = require("../ayudas/funcionesayuda_4");

const { super_info_propietario } = require("../ayudas/funcionesayuda_5");

const controladorCliInversor = {};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// PARA ACCESO AL SISTEMA DE SOLIDEXA LADO ADMINISTRADOR
// especificamos el tipo de identificacion usar, en este caso el encargado del lado del cliente "verificar_usu_clave_cli"

controladorCliInversor.verificarClavesCli = pasaporte.authenticate("verificar_usu_clave_cli", {
    failureRedirect: "/revision_acceso_cli/acceso_fallado",
    successRedirect: "/revision_acceso_cli/acceso_permitido",
});

controladorCliInversor.cli_incorrecto = async (req, res) => {
    // viene de la ruta: "/revision_acceso_cli/acceso_fallado"
    res.json({
        tipo: "incorrecto",
    });
};

controladorCliInversor.cli_correcto = async (req, res) => {
    // viene de la ruta: "/revision_acceso_cli/acceso_permitido"

    // ------- Para verificación -------
    /* 
    //console.log("estamos en el controlador de inicio PROPIETARIO CLIENTE");

    console.log("DATOS del CLIENTE ingreso");
    console.log(req.user);

    console.log("el CI del CLIENTE ingreso");
    console.log(req.user.ci_propietario);
    */

    var ci_propietario = req.user.ci_propietario;

    res.json({
        tipo: "correcto",
        ci_propietario,
    });
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA RENDERIZAR LA VENTANA DEL ADMINISTRADOR segun la pestaña que sea elegida

// RUTA   "get"  "/propietario/:ci_propietario/:ventana_propietario"
controladorCliInversor.renderizarVentanaPropietarioCli = async (req, res) => {
    try {
        /*
        // ------- Para verificación -------
        console.log("estamos en el controlador de inicio PROPIETARIO CLIENTE");

        // ------- Para verificación -------
        console.log("DATOS del CLIENTE ingreso");
        console.log(req.user);
        console.log("el id del CLIENTE ingreso");
        console.log(req.user.id);
        console.log("el CI del CLIENTE ingreso desde USER");
        console.log(req.user.ci_propietario);
        */

        var codigo_propietario = req.params.ci_propietario;
        var tipo_ventana_propietario = req.params.ventana_propietario;

        var info_propietario = {};
        info_propietario.navegador_cliente = true;
        info_propietario.cab_prop_cli = true;
        info_propietario.estilo_cabezera = "cabezera_estilo_propietario";
        info_propietario.codigo_propietario = codigo_propietario;
        info_propietario.inversor_autenticado = req.inversor_autenticado;

        //----------------------------------------------------

        // "req.inversor_autenticado" si es TRUE y solo si es true, de manera que el propietario se encuentra navegando con su cuenta privada
        // "req.params.ci_propietario == req.user.ci_propietario" si y solo si el ci que figura en la url del navegador es igual a ci del req.user
        if (req.inversor_autenticado && req.params.ci_propietario == req.user.ci_propietario) {
            info_propietario.ci_propietario = req.user.ci_propietario; // el C.I. del propietario que se encuentra navegando con su cuenta privada

            var aux_cabezera = {
                codigo_objetivo: codigo_propietario,
                tipo: "propietario",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_propietario.cabezera_cli = cabezera_cli;

            info_propietario.es_propietario = true; // para menu navegacion comprimido

            //----------------------------------------------------
            // paquete para mostrar (si es que existiesen) el numero de propiedades y numero de guardados
            var paquete_badge = {
                codigo_propietario,
            };
            var badge = await valores_badge(paquete_badge);
            info_propietario.existe_n_propiedades = badge.existe_n_propiedades;
            info_propietario.n_propiedades = badge.n_propiedades;
            info_propietario.existe_n_guardados = badge.existe_n_guardados;
            info_propietario.n_guardados = badge.n_guardados;
            //----------------------------------------------------

            if (tipo_ventana_propietario == "resumen") {
                info_propietario.resumen_propietario = true; // para pestaña y ventana apropiada para proyecto

                info_propietario.info_segundero = true;

                var contenido_propietario = await resumen_propietario(codigo_propietario);

                info_propietario.informacion = contenido_propietario;
                // ------- Para verificación -------

                //console.log("los datos para renderizar RESUMEN DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }

            if (tipo_ventana_propietario == "informacion") {
                var contenido_propietario = await datos_propietario(codigo_propietario);
                info_propietario.informacion_propietario = true; // para pestaña y ventana apropiada para proyecto
                info_propietario.contenido_propietario = contenido_propietario;
                // ------- Para verificación -------

                //console.log("los datos para renderizar INFORMACION DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }

            if (tipo_ventana_propietario == "fracciones") {
                var contenido_propietario = await fracciones_propietario(codigo_propietario);
                info_propietario.fracciones_propietario = true; // para pestaña y ventana apropiada para proyecto
                info_propietario.contenido_propietario = contenido_propietario;
                // ------- Para verificación -------

                //console.log("los datos para renderizar INFORMACION DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }

            if (tipo_ventana_propietario == "propiedades") {
                let contenido_propietario = await propiedades_propietario(codigo_propietario);
                info_propietario.propiedades_propietario = true; // para pestaña y ventana apropiada para proyecto

                //--------------------------------------------------------------
                // para mostrar los estados en filtro ordenador
                info_propietario.estado_py_todos = true;
                info_propietario.estado_py_reserva = true;
                info_propietario.estado_py_construccion = true;
                info_propietario.estado_py_construido = true;
                info_propietario.estado_rematado = true;

                //---------------------------------------------------------------
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

                //console.log("los datos para renderizar PROPIEDADES DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }

            if (tipo_ventana_propietario == "guardados") {
                let contenido_propietario = await guardados_propietario(codigo_propietario);
                info_propietario.guardados_propietario = true; // para pestaña y ventana apropiada para proyecto

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
                info_propietario.n_construido = aux_n_construido;

                //--------------------------------------------------------------
                info_propietario.contenido_propietario = contenido_propietario;
                // ------- Para verificación -------

                //console.log("los datos para renderizar GUARDADOS DEL PROPIETARIO");
                //console.log(info_propietario);

                res.render("cli_propietario", info_propietario);
            }
        } else {
            // si el propietario no se encuentra navegando con su cuenta privada, y desea ingresar por la url a una cuenta privada, entonces se le redireccionara a la ventana de inicio

            res.redirect("/"); // rediccionara a la pagina DE INICIO DEL CLIENTE
        }
    } catch (error) {
        console.log(error);
    }
};

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
                        codigo_usuario: codigo_propietario,
                        laapirest: "/", // por partir desde el lado del CLIENTE
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
                        codigo_usuario: codigo_propietario,
                        laapirest: "/", // por partir desde el lado del CLIENTE
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

async function guardados_propietario(codigo_propietario) {
    try {
        // ordenamos por numero de piso (de menor a mayor, por ello se escribio "1")
        // Al parecer si el dato "piso" estubiera dentro de un objero EJ/ "descripcion_inmueble", tambien funcionaria como se lo declara aqui
        var inm_propietario = await indiceGuardados
            .find(
                { ci_propietario: codigo_propietario },
                {
                    codigo_inmueble: 1,
                    // estado_propietario: 1, esta propiedad no existe en "guardados"
                    _id: 0,
                }
            )
            .sort({ fecha_guardado: 1 });

        if (inm_propietario.length > 0) {
            var contenido_inm_prop = [];
            for (let i = 0; i < inm_propietario.length; i++) {
                // paquete_inmueble = {codigo_inmueble,codigo_usuario}
                var paquete_inmueble_i = {
                    codigo_inmueble: inm_propietario[i].codigo_inmueble,
                    codigo_usuario: codigo_propietario,
                    laapirest: "/", // por partir desde el lado del CLIENTE
                };
                contenido_inm_prop[i] = await inmueble_card_adm_cli(paquete_inmueble_i);
                contenido_inm_prop[i].card_externo = true; // para que muestre info de card EXTERIONES
                contenido_inm_prop[i].estado_propietario = inm_propietario[i].estado_propietario;
            }
            return contenido_inm_prop;
        } else {
            var contenido_inm_prop = [];
            return contenido_inm_prop;
        }
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
            navegacion: "cliente",
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
                    tipo_navegacion: "cliente", // porque estamos dentro de un controlador cliente
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

// -----------------------------------------------------------------------------------

async function valores_badge(paquete_badge) {
    try {
        var codigo_propietario = paquete_badge.codigo_propietario;

        var badge_resultados = {
            existe_n_propiedades: false, // por defecto
            n_propiedades: 0, // por defecto
            existe_n_guardados: false, // por defecto
            n_guardados: 0, // por defecto
        };

        const registro_propiedades = await indiceInversiones.find(
            { ci_propietario: codigo_propietario, estado_propietario: "activo" },
            {
                codigo_inmueble: 1,
            }
        );

        if (registro_propiedades.length > 0) {
            badge_resultados.existe_n_propiedades = true;
            badge_resultados.n_propiedades = registro_propiedades.length;
        }

        const registro_guardados = await indiceGuardados.find(
            { ci_propietario: codigo_propietario },
            {
                codigo_inmueble: 1,
            }
        );

        if (registro_guardados.length > 0) {
            badge_resultados.existe_n_guardados = true;
            badge_resultados.n_guardados = registro_guardados.length;
        }

        return badge_resultados;
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------------------------------------

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA GUARDAR O DES-GUARDAR INMUEBLE QUE SELECCIONA EL INVERSOR

controladorCliInversor.guardarInmueble = async (req, res) => {
    //  viene de la RUTA  post   '/inversor/operacion/guardar-inmueble'
    try {
        //--------------- Verificacion ----------------
        //console.log("los datos de PAQUETE DE DATOS para guardar o des-guardar");
        //console.log(req.body);
        //---------------------------------------------
        var estado_guardado = req.body.estado_guardado;
        var codigo_inmueble = req.body.codigo_inmueble;

        // ------- Para verificación -------
        //console.log("VEMOS SI EL CLIENTE ES VALIDADO iniciooo, PROPIETARIO GUARDAR INMUEBLE");
        //console.log(req.inversor_autenticado);
        //console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn, PROPIETARIO GUARDAR INMUEBLE");

        // ------------------------------------------------------
        //var ci_propietario = req.user.ci_propietario; // alfa estaba anteriormente
        // ------------------------------------------------------
        if (req.inversor_autenticado) {
            var ci_propietario = req.user.ci_propietario;
            //if (ci_propietario) { // alfa estaba anteriormente
            if (estado_guardado == "si_guardado") {
                // significa que el inmueble pasara a ser "no_guardado"

                // verificamos efectivamente que el inmueble ya figura como guardado del inversor
                var registro = await indiceGuardados.findOne({
                    ci_propietario: ci_propietario,
                    codigo_inmueble: codigo_inmueble,
                });

                if (registro) {
                    // entonces eliminamos de la base de datos el registro
                    // await registro.remove(); dejamos de usar remove para no tener problemas con su caducidad
                    await indiceGuardados.deleteOne({
                        ci_propietario: ci_propietario,
                        codigo_inmueble: codigo_inmueble,
                    });
                    res.json({
                        exito: "si",
                    });
                } else {
                    res.json({
                        exito: "no",
                    });
                }
            }

            if (estado_guardado == "no_guardado") {
                // significa que el inmueble pasara a ser "si_guardado"

                // verificamos efectivamente que el inmueble NO figura como guardado del inversor
                var registro = await indiceGuardados.findOne({
                    ci_propietario: ci_propietario,
                    codigo_inmueble: codigo_inmueble,
                });

                if (!registro) {
                    // NOTESE QUE USAMOS "!"

                    var registro_inmueble = await indiceInmueble.findOne(
                        {
                            codigo_inmueble: codigo_inmueble,
                        },
                        { codigo_proyecto: 1, codigo_terreno: 1, _id: 0 }
                    );

                    if (registro_inmueble) {
                        // entonces creamos el nuevo registro

                        const nuevo_registro = new indiceGuardados({
                            ci_propietario: ci_propietario,
                            codigo_terreno: registro_inmueble.codigo_terreno,
                            codigo_proyecto: registro_inmueble.codigo_proyecto,
                            codigo_inmueble: codigo_inmueble,
                            // la fecha de guardado se crea por defecto en la base de datos
                        });
                        await nuevo_registro.save();

                        res.json({
                            exito: "si",
                        });
                    }
                } else {
                    // significa que el inmueble ya lo tiene el inversor guardado, pero que intenta guardarlo nuevamente, lo cual no es posible, por tanto le enviamos un res "no"
                    res.json({
                        exito: "no",
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA CAMBIAR LAS CLAVES DE ACCESO DEL INVERSOR

controladorCliInversor.cambiarClavesAcceso = async (req, res) => {
    //  viene de la RUTA  post   '/inversor/operacion/cambiar-claves'
    try {
        var act_usuario = req.body.act_usuario;
        var act_clave = req.body.act_clave;
        var nue_usuario = req.body.nue_usuario;
        var nue_clave_1 = req.body.nue_clave_1;
        //var nue_clave_2 = req.body.nue_clave_2; // no es necesario ya que es el mismo que nue_clave_1 que ya fue verificado en logica de cliente propietario

        // ------- Para verificación -------
        //console.log("los datos enviados al servidor para las re-claves del propietario");
        //console.log(req.body);

        var registro_inversionista = await indice_propietario.findOne({
            usuario_propietario: act_usuario,
        });

        if (registro_inversionista) {
            // revision de contraseña
            const respuesta = await registro_inversionista.compararContrasena(act_clave); // nos devuelve TRUE o FALSE
            if (respuesta) {
                if (nue_usuario == registro_inversionista.usuario_propietario) {
                    // si el nuevo usuario que desea registrar es el mismo que el que tiene actualmente, LE ESTA PERMITIDO, porque este ya esta asegurado que es unico en toda la base de datos

                    // cambiaremos (aunque en este caso el nombre de USUARIO sera el mismo) las claves
                    registro_inversionista.usuario_propietario = nue_usuario;
                    // antes encriptarlo para ser guardado
                    registro_inversionista.clave_propietario =
                        await registro_inversionista.encriptarContrasena(nue_clave_1); // indiferente usar nue_clave_1 o nue_clave_2

                    await registro_inversionista.save();

                    res.json({
                        exito: "si",
                    });
                } else {
                    // ahora revisamos si el dato NUEVO de USUARIO existe o no en la base de datos, BASTA QUE SOLO EXISTA UNO (findOne) PARA QUE ESTE NUEVO USUARIO SEA DESCARTADO Y SE LE PIDA QUE INGRESE UN NUEVO NOMBRE DE USUARIO
                    var usuario_existente = await indice_propietario.findOne({
                        usuario_propietario: nue_usuario,
                    });

                    if (usuario_existente) {
                        // significa que el nombre de usuario que intenta registrar ya existe y que le pertenece a otro usuario
                        res.json({
                            exito: "cambie_usuario",
                        });
                    } else {
                        registro_inversionista.usuario_propietario = nue_usuario;
                        // antes encriptarlo para ser guardado
                        registro_inversionista.clave_propietario =
                            await registro_inversionista.encriptarContrasena(nue_clave_1); // indiferente usar nue_clave_1 o nue_clave_2
                        await registro_inversionista.save();

                        res.json({
                            exito: "si",
                        });
                    }
                }
            } else {
                res.json({
                    exito: "maestro denegado",
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
// PARA ADQUIRIR FRACCIONES DE INMUEBLE EMPLEANDO FRACCIONES DE TERRENO

controladorCliInversor.adquirirFraccionInm = async (req, res) => {
    //  viene de la RUTA  post   /propietario/accion/adquirir_fraccion_inm
    try {
        //--------------- Verificacion ----------------
        //console.log("los datos de PAQUETE DE DATOS para guardar o des-guardar");
        //console.log(req.body);
        //---------------------------------------------
        var codigo_inmueble = req.body.codigo_inmueble;
        var f_vender_val = req.body.f_vender_val;

        var exito = false; // por defecto
        var mensaje = "Error, intentelo nuevamente."; // por defecto
        var arrayFraccAdquirir = []; // por defecto (fracciones de inmueble que el usuario adquirira utilizando sus fracciones de inmueble)
        var array_card_fracciones = []; // por defecto

        // verificacion si existe la cantidad requerida de fracciones de inmuebles disponibles para ser adquridas.

        let fracciones_inm_disp = await indiceFraccionInmueble
            .find(
                {
                    codigo_inmueble: codigo_inmueble,
                    disponible: true,
                    tipo: "copropietario",
                },
                {
                    codigo_fraccion: 1,
                    fraccion_bs: 1,
                }
            )
            .sort({ orden: 1 }); // ordenado del menor al mayor

        if (fracciones_inm_disp.length > 0) {
            let sum_bs_disponible = 0;
            for (let i = 0; i < fracciones_inm_disp.length; i++) {
                let elemento_bs = fracciones_inm_disp[i].fraccion_bs;
                sum_bs_disponible = sum_bs_disponible + elemento_bs;
                if (sum_bs_disponible <= f_vender_val) {
                    arrayFraccAdquirir[i] = {
                        codigo_fraccion: fracciones_inm_disp[i].codigo_fraccion,
                        fraccion_bs: fracciones_inm_disp[i].fraccion_bs,
                    };
                } else {
                    break; // salimos del bucle for
                }
            }

            if (sum_bs_disponible === f_vender_val) {
                if (req.inversor_autenticado) {
                    var ci_propietario = req.user.ci_propietario;

                    //----------------------------------------
                    // para determinar el valor de fracciones disponibles para la adquisicion de fracciones de inmueble

                    let registro_inmueble = await indiceInmueble.findOne(
                        {
                            codigo_inmueble: codigo_inmueble,
                        },
                        {
                            codigo_terreno: 1,
                            fecha_fin_fraccionado: 1,
                        }
                    );

                    if (registro_inmueble) {
                        let fecha_actual = new Date();
                        let fecha_fin_fraccionado = registro_inmueble.fecha_fin_fraccionado;

                        if (fecha_actual <= fecha_fin_fraccionado) {
                            let registro_copropietario_te = await indiceFraccionTerreno
                                .find(
                                    {
                                        codigo_terreno: registro_inmueble.codigo_terreno,
                                        ci_propietario: ci_propietario,
                                    },
                                    {
                                        codigo_fraccion: 1,
                                        fraccion_bs: 1,
                                    }
                                )
                                .sort({ orden: 1 }); // ordenado del menor al mayor

                            if (registro_copropietario_te.length > 0) {
                                // importante (fecha_actual <= fecha_fin_fraccionado) esta condicion de fechas verdaderas significa que el terreno se encuentra en etapa de RESERVACION, por tanto durante esta etapa aun no existen fracciones de inmueble del tipo "inversionista", solo existirian del tipo "copropietario"
                                // recolectamos todas las fracciones de inmueble que el usuario podria tener adquiridos
                                let registro_copropietario_inm = await indiceFraccionInmueble
                                    .find(
                                        {
                                            codigo_terreno: registro_inmueble.codigo_terreno,
                                            ci_propietario: ci_propietario,
                                            tipo: "copropietario",
                                            disponible: false,
                                        },
                                        {
                                            codigo_fraccion: 1,
                                            fraccion_bs: 1,
                                        }
                                    )
                                    .sort({ orden: 1 }); // ordenado del menor al mayor

                                if (registro_copropietario_inm.length > 0) {
                                    let j = -1;
                                    let f_te_disponibles = [];
                                    let sum_f_disponibles_val = 0;
                                    for (let i = 0; i < registro_copropietario_te.length; i++) {
                                        let codigo_fraccion_te_i =
                                            registro_copropietario_te[i].codigo_fraccion;
                                        let fraccion_bs_te_i =
                                            registro_copropietario_te[i].fraccion_bs;

                                        let fraccionDisponible = true; // por defecto

                                        for (
                                            let k = 0;
                                            k < registro_copropietario_inm.length;
                                            k++
                                        ) {
                                            let codigo_fraccion_inm_k =
                                                registro_copropietario_inm[k].codigo_fraccion;

                                            if (codigo_fraccion_te_i === codigo_fraccion_inm_k) {
                                                // significa que el usuario utilizo su fraccion de terreno codigo_fraccion_te_i para adquriri fraccion de inmueble
                                                fraccionDisponible = false;
                                                break; // salimos del bucle for k de fraccion de inmueble
                                                // importante: 1 fraccion de terreno, solo puede adquirir 1 fraccio de inmueble. (el inmueble debe pertenecer al terreno sobre el que sera construido)
                                            }
                                        } // fin for k

                                        if (fraccionDisponible) {
                                            sum_f_disponibles_val =
                                                sum_f_disponibles_val + fraccion_bs_te_i;
                                            j = j + 1;
                                            f_te_disponibles[j] = {
                                                codigo_fraccion: codigo_fraccion_te_i,
                                                disponible_bs: fraccion_bs_te_i,
                                            };

                                            if (sum_f_disponibles_val === f_vender_val) {
                                                break; // salimos del bucle for i de fraccion de terreno
                                            }
                                        }
                                    } // fin for i terreno

                                    if (
                                        sum_f_disponibles_val === f_vender_val &&
                                        f_te_disponibles.length === arrayFraccAdquirir.length
                                    ) {
                                        // dado que inicialmente las fracciones de terreno fueron ordenadas por orden de menor a mayor, entonces "f_te_disponibles" mantendra ese orden de fracciones de terreno disponibles para que sean empleadas para adqurir fracciones de inmueble.
                                        for (let i = 0; i < arrayFraccAdquirir.length; i++) {
                                            let codigo_fraccion_ad =
                                                arrayFraccAdquirir[i].codigo_fraccion;
                                            let codigo_fraccion_te =
                                                f_te_disponibles[i].codigo_fraccion;

                                            // "new Date()" nos devuelve la fecha actual
                                            await indiceFraccionInmueble.updateOne(
                                                { codigo_fraccion: codigo_fraccion_ad },
                                                {
                                                    $set: {
                                                        codigo_fraccion: codigo_fraccion_te,
                                                        ci_propietario: ci_propietario,
                                                        disponible: false,
                                                        fecha_copropietario: new Date(),
                                                    },
                                                }
                                            );
                                        }

                                        //-----------------------------------------------
                                        // armado de las fracciones que seran renderizados en el navegador

                                        for (let i = 0; i < arrayFraccAdquirir.length; i++) {
                                            let codigo_fraccion =
                                                arrayFraccAdquirir[i].codigo_fraccion;
                                            var paquete_fraccion = {
                                                codigo_fraccion: codigo_fraccion,
                                                ci_propietario: ci_propietario,
                                                tipo_navegacion: "administrador", // porque estamos dentro de un controlador administrador
                                            };
                                            let card_fraccion_i = await fraccion_card_adm_cli(
                                                paquete_fraccion
                                            );
                                            array_card_fracciones[i] = card_fraccion_i;
                                        }

                                        exito = true;
                                    } else {
                                        exito = false;
                                        mensaje =
                                            "No cuentas con la suficiente cantidad de fracciones de terreno disponibles para adquirir la cantidad de fracciones de inmueble que deseas.";
                                    }
                                } else {
                                    // el usuario cuenta con fracciones de terreno, pero no utilizo ningua de sus fracciones de terreno para adquirir fracciones de inmuebles.

                                    let f_te_disponibles = [];
                                    let sum_f_disponibles_val = 0;
                                    for (let i = 0; i < registro_copropietario_te.length; i++) {
                                        let codigo_fraccion_te_i =
                                            registro_copropietario_te[i].codigo_fraccion;
                                        let fraccion_bs_te_i =
                                            registro_copropietario_te[i].fraccion_bs;

                                        sum_f_disponibles_val =
                                            sum_f_disponibles_val + fraccion_bs_te_i;

                                        f_te_disponibles[i] = {
                                            codigo_fraccion: codigo_fraccion_te_i,
                                            disponible_bs: fraccion_bs_te_i,
                                        };

                                        if (sum_f_disponibles_val === f_vender_val) {
                                            break; // salimos del bucle for i de fraccion de terreno
                                        }
                                    } // fin for i terreno

                                    if (
                                        sum_f_disponibles_val === f_vender_val &&
                                        f_te_disponibles.length === arrayFraccAdquirir.length
                                    ) {
                                        // dado que inicialmente las fracciones de terreno fueron ordenadas por orden de menor a mayor, entonces "f_te_disponibles" mantendra ese orden de fracciones de terreno disponibles para que sean empleadas para adqurir fracciones de inmueble.
                                        for (let i = 0; i < arrayFraccAdquirir.length; i++) {
                                            let codigo_fraccion_ad =
                                                arrayFraccAdquirir[i].codigo_fraccion;
                                            let codigo_fraccion_te =
                                                f_te_disponibles[i].codigo_fraccion;

                                            // "new Date()" nos devuelve la fecha actual
                                            await indiceFraccionInmueble.updateOne(
                                                { codigo_fraccion: codigo_fraccion_ad },
                                                {
                                                    $set: {
                                                        codigo_fraccion: codigo_fraccion_te,
                                                        ci_propietario: ci_propietario,
                                                        disponible: false,
                                                        fecha_copropietario: new Date(),
                                                    },
                                                }
                                            );
                                        }

                                        //-----------------------------------------------
                                        // armado de las fracciones que seran renderizados en el navegador

                                        for (let i = 0; i < arrayFraccAdquirir.length; i++) {
                                            let codigo_fraccion =
                                                arrayFraccAdquirir[i].codigo_fraccion;
                                            var paquete_fraccion = {
                                                codigo_fraccion: codigo_fraccion,
                                                ci_propietario: ci_propietario,
                                                tipo_navegacion: "administrador", // porque estamos dentro de un controlador administrador
                                            };
                                            let card_fraccion_i = await fraccion_card_adm_cli(
                                                paquete_fraccion
                                            );
                                            array_card_fracciones[i] = card_fraccion_i;
                                        }

                                        exito = true;
                                    } else {
                                        exito = false;
                                        mensaje =
                                            "No cuentas con la suficiente cantidad de fracciones de terreno disponibles para adquirir la cantidad de fracciones de inmueble que deseas.";
                                    }
                                }
                            }
                        } else {
                            // el usuario no podra adquriri fracciones de inmueble, porque no se esta dentro de la fecha plazo para la adquisicion de dichas fracciones
                            exito = false;
                            mensaje = "El plazo para adquirir fracciones del inmueble a vencido.";
                        }
                    }
                }
            } else {
                // no existe la cantidad requerida de fracciones de inmueble para ser adquridias por el usuario
                exito = false;
                mensaje =
                    "No existe la cantidad suficiente de fracciones de inmueble para ser adquiridas.";
            }
        } else {
            // no existe la cantidad requerida de fracciones de inmueble para ser adquridias por el usuario
            exito = false;
            mensaje =
                "No existe la cantidad suficiente de fracciones de inmueble para ser adquiridas.";
        }

        //-------------------------------------------------

        if (exito) {
            //-----------------------------------------------

            res.json({
                exito: "si",
                array_card_fracciones,
            });
        } else {
            res.json({
                exito: "no",
                mensaje,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA DESHACER FRACCIONES DE INMUEBLE ADQUIRIDAS

controladorCliInversor.deshacerFraccionInm = async (req, res) => {
    //  viene de la RUTA  post   /propietario/accion/deshacer_fraccion_inm
    try {
        //--------------- Verificacion ----------------
        //console.log("los datos de PAQUETE DE DATOS para guardar o des-guardar");
        //console.log(req.body);
        //---------------------------------------------
        var codigo_inmueble = req.body.codigo_inmueble;

        var exito = false; // por defecto
        var mensaje = "Error, intentelo nuevamente."; // por defecto

        if (req.inversor_autenticado) {
            var ci_propietario = req.user.ci_propietario;

            let registro_copropietario_inm = await indiceFraccionInmueble.find(
                {
                    ci_propietario: ci_propietario,
                    tipo: "copropietario",
                    disponible: false,
                    codigo_inmueble: codigo_inmueble,
                },
                {
                    codigo_fraccion: 1,
                }
            );

            if (registro_copropietario_inm.length > 0) {
                // eliminacion de los registro de fracciones de inmueble que tiene el ci_propietario en el codigo_inmueble en especifico
                // "deleteMany" para que elimine a TODOS los que coinciden con el filtro especificado

                await indiceFraccionInmueble.deleteMany({
                    ci_propietario: ci_propietario,
                    tipo: "copropietario",
                    disponible: false,
                    codigo_inmueble: codigo_inmueble,
                });
                //-----------------------------------------
                // actualizacion de los indicadores de fracciones
                var datos_funcion = {
                    ci_propietario,
                    codigo_objetivo: codigo_inmueble,
                    copropietario: "inmueble",
                };
                var resultado = await te_inm_copropietario(datos_funcion);

                var c_ft_d_n = resultado.c_ft_d_n;
                var c_ft_d_n_render = resultado.c_ft_d_n_render;
                var c_ft_d_val = resultado.c_ft_d_val;
                var c_ft_d_val_render = resultado.c_ft_d_val_render;
                var c_fti_a_n = resultado.c_fti_a_n;
                var c_fti_a_n_render = resultado.c_fti_a_n_render;
                var c_fti_a_val = resultado.c_fti_a_val;
                var c_fti_a_val_render = resultado.c_fti_a_val_render;
                var c_fti_a_p = resultado.c_fti_a_p;
                var c_fti_a_p_render = resultado.c_fti_a_p_render;
                var ti_f_p_render = resultado.ti_f_p_render;
                var ti_f_val = resultado.ti_f_val;
                var ti_f_val_render = resultado.ti_f_val_render;
                var ti_f_d_n = resultado.ti_f_d_n;
                var ti_f_d_n_render = resultado.ti_f_d_n_render;
                var ti_f_d_val = resultado.ti_f_d_val;
                var ti_f_d_val_render = resultado.ti_f_d_val_render;

                //-----------------------------------------
                exito = true;
            } else {
                mensaje = "No cuenta con fracciones de inmueble para su eliminación.";
            }
        }

        // verificacion si existe la cantidad requerida de fracciones de inmuebles disponibles para ser adquridas.

        //-------------------------------------------------

        if (exito) {
            //-----------------------------------------------

            res.json({
                exito: "si",
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
            });
        } else {
            res.json({
                exito: "no",
                mensaje,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*
// ORIGINALMENTE ESTE CODIGO NO DESTRUYE LAS SESSIONES CREADAS CON COOKIES EN LA BASE DE DATOS DE MONGODB ATLAS, CUANDO SE LE DA LA OPCION DESDE NUESTRA APP WEB DE "CERRAR SESION"

controladorCliInversor.cerrarInversor = async (req, res) => {
    //  viene de la RUTA  GET   '/ventana/inversor/cerrar'
    try {
        req.logout(); // para BORRAR la sesion del CLIENTE
        // res.render('acceso');  // funciona renderiza la ventana de inicio, pero en la url del navegador se queda con "/ventana/inversor/cerrar"
        res.redirect("/"); // funciona, renderiza la ventana de inicio y la url del navegador se ve con el correcto "/" de inicio del sistema publico
    } catch (error) {
        console.log(error);
    }
};
*/

controladorCliInversor.cerrarInversor = async (req, res) => {
    try {
        // "destroy" Destruye la sesión actual de la base de datos de mongodb atlas
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        req.logout(); // para BORRAR la sesion del CLIENTE

        res.redirect("/"); // funciona, renderiza la ventana de inicio y la url del navegador se ve con el correcto "/" de inicio del sistema
    } catch (err) {
        console.error("Error al cerrar sesión:", err);
        // Maneja el error de acuerdo a tus necesidades
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorCliInversor;
