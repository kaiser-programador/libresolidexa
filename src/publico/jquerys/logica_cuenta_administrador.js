/*
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para las pestañas de ADMINISTRADOR (maestro o empleado) clickeadas desde el menu desplegable en vista comprimida
$('.aux_tabe').click(function (e) {
    let tab_seleccionado = $(this).attr('data-id');
    document.getElementById(tab_seleccionado).click();
});
*/

//const { Number } = require("mongoose");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$("#form_cambiar_claves").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_cambiar_claves"));

    // llevandolos a minusculas por seguridad
    let nue_clave_1 = $("#id_nue_clave_1").val();
    let nue_clave_2 = $("#id_nue_clave_2").val();

    if (nue_clave_1 == nue_clave_2) {
        $.ajax({
            url: "/laapirest/administrador/accion/cambiar_claves",
            type: "post",
            data: datosFormulario,
            cache: false,
            contentType: false,
            processData: false,
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;

            if (tipoRespuesta == "si") {
                $(".ref_boton_cambiar_claves").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Nuevas claves guardadas!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "no") {
                $(".ref_boton_cambiar_claves").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El administrador no existe!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "otro_usuario") {
                $(".ref_boton_cambiar_claves").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El NUEVO USUARIO que intenta registrar ya existe, porfavor ingrese un nuevo usuario diferente.</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "corrupto") {
                $(".ref_boton_cambiar_claves").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Usted esta intentando cambiar las claves de otro usuario. Si continua con la operación su cuenta sera bloqueada!</strong>
                        </div>`
                );
            }

            // borramos los datos de los inputs
            $(".ref_limpiar_nuevas_claves").val("");
        });
    } else {
        $(".ref_boton_cambiar_claves").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Las nuevas contraseñas que introdujo no son iguales!</strong>
            </div>`
        );
        // borramos los datos de los inputs
        $(".ref_limpiar_nuevas_claves").val("");
    }
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#id_form_inspeccionar_adm").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("id_form_inspeccionar_adm"));

    $.ajax({
        url: "/laapirest/administrador/accion/insp_nuevo_adm",
        type: "post",
        data: datosFormulario,
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // si es un administrador que ya existe en la base de datos, entonces procedemos a mostrar sus datos en los INPUTS
            $("#id_estado_adm").val(respuestaServidor.estado_administrador);
            $("#id_ci_adm").val(respuestaServidor.ci_administrador);
            $("#id_ci_adm_aux").val(respuestaServidor.ci_administrador);
            $("#id_nombres_adm").val(respuestaServidor.ad_nombres);
            $("#id_apellidos_adm").val(respuestaServidor.ad_apellidos);
            $("#id_nacimiento_adm").val(respuestaServidor.ad_nacimiento);
            $("#id_telefonos_adm").val(respuestaServidor.ad_telefonos);
            $("#id_departamento_adm").val(respuestaServidor.ad_departamento);
            $("#id_provincia_adm").val(respuestaServidor.ad_provincia);
            $("#id_ciudad_adm").val(respuestaServidor.ad_ciudad);
            $("#id_direccion_adm").val(respuestaServidor.ad_direccion);

            // borramos el input de ci de inspeccion de nuevo administrador
            $("#ci_adm_inspeccionar").val("");

            if (respuestaServidor.estado_administrador == "eliminado") {
                $(".ref_inspeccionar_ci_adm").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Administrador eliminado, si desea guardelo para que sea ACTIVO!</strong>
                    </div>`
                );
            }

            if (respuestaServidor.estado_administrador == "activo") {
                $(".ref_inspeccionar_ci_adm").after(
                    `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Administrador ACTIVO, si desea cambie los datos y guardelos, o bien puede eliminarlo o proporsionarle sus Re-claves!</strong>
                    </div>`
                );
            }
        }

        if (tipoRespuesta == "nuevo") {
            $(".ref_inspeccionar_ci_adm").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Administrador NUEVO, llene los datos y guardelo!</strong>
                </div>`
            );
            // Limpiamos los demas campos por seguridad
            $(".ref_limpiar_adm").val("");
            $("#id_estado_adm").val("Nuevo");
            $("#id_ci_adm").val(respuestaServidor.ci_inspeccion);
            $("#id_ci_adm_aux").val(respuestaServidor.ci_inspeccion);
        }
        $(".radio_accion_administrador").eq(0).click(); // para poner al radio en su estado por defecto
    });
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(".radio_accion_administrador").click(function (e) {
    let accion_elegida = $(this).val();
    $("#id_aux_radio_adm").val(accion_elegida);
});
//---------------------------------------------------------
$("#id_form_administrador").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("id_form_administrador"));

    let accion_elegida = $("#id_aux_radio_adm").val();

    var estado_administrador = $("#id_estado_adm").val();

    if (accion_elegida == "Guardar") {
        // puede ser para guardar a un nuevo administrador (uno completamente NUEVO o uno que anteriormente fue ELIMINADO) o guardar con datos corregidos a un administrador que ya esta activo
        var ruta_servidor = "/laapirest/administrador/accion/adm_guardar";
        var acceso_servidor = true;
    }

    if (accion_elegida == "Eliminar") {
        if (estado_administrador == "eliminado") {
            $("#id_ref_botones_adm").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No es posible ELIMINAR a un ADMINISTRADOR que ya se encuentra ELIMINADO!</strong>
                </div>`
            );
            var acceso_servidor = false;
        } else {
            var respuesta = confirm("Esta seguro eliminar a este ADMINISTRADOR?");
            if (respuesta) {
                // para eliminar a un administrador ACTIVO
                var ruta_servidor = "/laapirest/administrador/accion/adm_eliminar";
                var acceso_servidor = true;
            } else {
                var acceso_servidor = false;
            }
        }
    }

    if (accion_elegida == "Re-claves") {
        if (estado_administrador == "eliminado") {
            $("#id_ref_botones_adm").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No es posible RE-CLAVES para un administrador que se encuentra ELIMINADO!</strong>
                </div>`
            );
            var acceso_servidor = false;
        } else {
            var respuesta = confirm("Esta seguro de dar RE-CLAVES a este ADMINISTRADOR?");
            if (respuesta) {
                // LAS nuevas claves seran: usuario el C.I.  clave  el FECHA DE NACIMIENTO
                var ruta_servidor = "/laapirest/administrador/accion/adm_re_claves";
                var acceso_servidor = true;
            } else {
                var acceso_servidor = false;
            }
        }
    }

    if (acceso_servidor) {
        // si es TRUE

        $.ajax({
            url: ruta_servidor,
            type: "post",
            data: datosFormulario,
            cache: false,
            contentType: false,
            processData: false,
        }).done(function (respuestaServidor) {
            if (accion_elegida == "Guardar") {
                var tipoRespuesta = respuestaServidor.exito;

                if (tipoRespuesta == "si") {
                    // por seguridad cambiamos el estado del administrador a ACTIVO
                    $("#id_estado_adm").val("activo");

                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Datos administrador guardados!</strong>
                    </div>`
                    );
                }

                if (tipoRespuesta == "nuevo") {
                    $("#id_estado_adm").val("activo");

                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Administrador registrado!</strong><br>
                        <span>Usuario: </span><span><b>${respuestaServidor.ad_usuario}</b></span><br>
                        <span>Clave: </span><span><b>${respuestaServidor.ad_clave}</b></span>
                    </div>`
                    );
                }

                if (tipoRespuesta == "jefe incorrecto") {
                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>C.I. Administrador jefe INCORRECTO!</strong>
                    </div>`
                    );
                }
            }

            if (accion_elegida == "Eliminar") {
                var tipoRespuesta = respuestaServidor.exito;

                if (tipoRespuesta == "si") {
                    // cambiamos el estado del administrador a ELIMINADO
                    $("#id_estado_adm").val("eliminado");

                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Datos administrador ELIMINADOS!</strong>
                        </div>`
                    );
                }

                if (tipoRespuesta == "no") {
                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Administrador NO ENCONTRADO!</strong>
                        </div>`
                    );
                }

                if (tipoRespuesta == "jefe incorrecto") {
                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>C.I. Administrador jefe INCORRECTO!</strong>
                        </div>`
                    );
                }
            }

            if (accion_elegida == "Re-claves") {
                var tipoRespuesta = respuestaServidor.exito;

                if (tipoRespuesta == "si") {
                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Re-claves Administrador!</strong><br>
                            <span>Usuario: </span><span><b>${respuestaServidor.usuario_defecto}</b></span><br>
                            <span>Clave: </span><span><b>${respuestaServidor.clave_defecto}</b></span>
                        </div>`
                    );
                }

                if (tipoRespuesta == "no") {
                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Administrador NO ENCONTRADO!</strong>
                        </div>`
                    );
                }

                if (tipoRespuesta == "jefe incorrecto") {
                    $("#id_ref_botones_adm").after(
                        `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>C.I. Administrador jefe INCORRECTO!</strong>
                        </div>`
                    );
                }
            }
        });
    }
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA ENLISTAR AL PERSONAL ACTIVO DE FONDECORP
$("#id_personal_activo").click(function (e) {
    // por seguridad limpiamos la tabla, para que no existan filas repetidas cada vez que se presione este boton
    let n_filas = $(".ref_fila_registro_adm_act").length;

    if (n_filas > 0) {
        $(".ref_fila_registro_adm_act").remove(); // borramos todos de una sola vez, gracias a que todas las filas tienen la classe de referancia "ref_fila_registro_adm_act"
    }

    $.ajax({
        url: "/laapirest/administrador/accion/ver_personal_activo",
        type: "get",
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            let n = respuestaServidor.administradores_activos.length;
            for (let i = 0; i < n; i++) {
                // agregamos la fila tabla del documento
                // LO Agregamos DESPUES del cuerpo de la tabla (.ref_enlistar_adm_activos), COMO HIJO (con "append")
                let j = i + 1; // para la numeracion de las filas de la tabla

                $(".ref_enlistar_adm_activos").append(
                    `<tr class="ref_fila_registro_adm_act">
                        <td class="c_0">${j}</td>
                        <td class="c_1">${respuestaServidor.administradores_activos[i].ci_administrador}</td>
                        <td class="c_2">${respuestaServidor.administradores_activos[i].ad_nombres}</td>
                        <td class="c_3">${respuestaServidor.administradores_activos[i].ad_apellidos}</td>
                        <td class="c_4">${respuestaServidor.administradores_activos[i].ad_departamento}</td>
                        <td class="c_5">${respuestaServidor.administradores_activos[i].ad_provincia}</td>
                        <td class="c_6">${respuestaServidor.administradores_activos[i].ad_ciudad}</td>
                        <td class="c_7">${respuestaServidor.administradores_activos[i].fecha_ingreso}</td>
                    </tr>`
                );
            }
        }

        if (tipoRespuesta == "no") {
            $(".ref_mensaje_tabla_activos").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No existen administradores activos!</strong>
                </div>`
            );
        }
    });
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA ORDENAR LA COLUMNA DE LA TABLA
$(".orden_tabla_activos").click(function (e) {
    let ref_columna = Number($(this).attr("id").split("c_")[1]); // 0 1 2 3 .. 7
    let n_filas = $(".ref_fila_registro_adm_act").length;
    var vemos = $(this).attr("data-id"); // menor a mayor   o    mayor a menor

    var matriz = [];
    for (let k = 0; k < n_filas; k++) {
        matriz[k] = [
            $(".ref_fila_registro_adm_act .c_0").eq(k).text(),
            $(".ref_fila_registro_adm_act .c_1").eq(k).text(),
            $(".ref_fila_registro_adm_act .c_2").eq(k).text(),
            $(".ref_fila_registro_adm_act .c_3").eq(k).text(),
            $(".ref_fila_registro_adm_act .c_4").eq(k).text(),
            $(".ref_fila_registro_adm_act .c_5").eq(k).text(),
            $(".ref_fila_registro_adm_act .c_6").eq(k).text(),
            $(".ref_fila_registro_adm_act .c_7").eq(k).text(),
        ];
    }

    //let deseado = matriz[1][6];

    for (let i = 0; i < n_filas - 1; i++) {
        for (let j = i + 1; j < n_filas; j++) {
            let valorInteres_i = matriz[i][ref_columna];
            let valorInteres_j = matriz[j][ref_columna];

            if (vemos == "menor_mayor") {
                // se ordenara de "menor a MAYOR"
                if (valorInteres_i > valorInteres_j) {
                    let auxiliar = matriz[i];
                    matriz[i] = matriz[j];
                    matriz[j] = auxiliar;
                    // j ocupa el lugar de i,  i ocupa el lugar de j
                }
            } else {
                // se ordenara de "MAYOR a menor"
                if (valorInteres_i < valorInteres_j) {
                    let auxiliar = matriz[i];
                    matriz[i] = matriz[j];
                    matriz[j] = auxiliar;
                    // j ocupa el lugar de i,  i ocupa el lugar de j
                }
            }
        }
    }

    // reconstruccion de la tabla ordenada
    for (let r = 0; r < n_filas; r++) {
        $(".ref_fila_registro_adm_act .c_0").eq(r).text(matriz[r][0]);
        $(".ref_fila_registro_adm_act .c_1").eq(r).text(matriz[r][1]);
        $(".ref_fila_registro_adm_act .c_2").eq(r).text(matriz[r][2]);
        $(".ref_fila_registro_adm_act .c_3").eq(r).text(matriz[r][3]);
        $(".ref_fila_registro_adm_act .c_4").eq(r).text(matriz[r][4]);
        $(".ref_fila_registro_adm_act .c_5").eq(r).text(matriz[r][5]);
        $(".ref_fila_registro_adm_act .c_6").eq(r).text(matriz[r][6]);
        $(".ref_fila_registro_adm_act .c_7").eq(r).text(matriz[r][7]);
    }

    // corregimos el numero de filas, respetando el orden secuencial 1. 2. 3. ...
    for (let k = 0; k < n_filas; k++) {
        $(".c_0")
            .eq(k)
            .text(k + 1);
    }

    if (vemos == "menor_mayor") {
        $(this).attr("data-id", "mayor_menor"); // para que el siguiente orden sea de "MAYOR a menor"
    } else {
        $(this).attr("data-id", "menor_mayor"); // para que el siguiente orden sea de "menor a MAYOR"
    }
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$("#id_form_buscar_historial").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO
    // por seguridad limpiamos la tabla, para que no existan filas repetidas cada vez que se presione este boton
    let n_filas = $(".ref_fila_resultado").length;

    if (n_filas > 0) {
        $(".ref_fila_resultado").remove(); // borramos todos de una sola vez, gracias a que todas las filas tienen la classe de referancia "ref_fila_resultado"
    }

    var datosFormulario = new FormData(document.getElementById("id_form_buscar_historial"));

    $.ajax({
        url: "/laapirest/administrador/accion/buscar_historial",
        type: "post",
        data: datosFormulario,
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // procedemos a llenar la tabla con los resultados encontrados
            let n_resultados = respuestaServidor.array_resultados.length;
            for (let i = 0; i < n_resultados; i++) {
                let j = i + 1; // para la numeracion de las filas de la tabla
                $(".ref_enlistar_resultados").append(
                    `<tr class="ref_fila_resultado">
                        <td>${j}</td>
                        <td>${respuestaServidor.array_resultados[i].ci_administrador}</td>
                        <td>${respuestaServidor.array_resultados[i].accion_historial}</td>
                        <td>${respuestaServidor.array_resultados[i].fecha_accion}</td>
                    </tr>`
                );
            }
        }

        if (tipoRespuesta == "no") {
            $("#id_form_buscar_historial").after(
                `<div class="alert alert-danger m-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No existen resultados!</strong>
                </div>`
            );
        }
    });
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$("#id_form_borrar_historial").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO
    // por seguridad limpiamos la tabla, para que no existan filas repetidas cada vez que se presione este boton
    let n_filas = $(".ref_fila_resultado").length;

    if (n_filas > 0) {
        $(".ref_fila_resultado").remove(); // borramos todos de una sola vez, gracias a que todas las filas tienen la classe de referancia "ref_fila_resultado"
    }

    var datosFormulario = new FormData(document.getElementById("id_form_borrar_historial"));

    $.ajax({
        url: "/laapirest/administrador/accion/borrar_historial",
        type: "post",
        data: datosFormulario,
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var exito = respuestaServidor.exito;
        var mensaje = respuestaServidor.mensaje;

        if (exito == "si") {
            $(".ref_boton_borrar_hist").after(
                `<div class="alert alert-success m-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>${mensaje}</strong>
                </div>`
            );
        }

        if (exito == "no") {
            $(".ref_boton_borrar_hist").after(
                `<div class="alert alert-danger m-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>${mensaje}</strong>
                </div>`
            );
        }
    });
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA ORDENAR LA COLUMNA DE LA TABLA "VISITAS" PARA ver las visitas de las pestañas de: TERRENO, PROYECTO, INMUEBLE

$("#madre_visitas").on("click", ".orden_tabla_visitas", function () {
    let ref_columna = $(this).attr("id"); // c_0, c_1, c_3,...
    let n_filas = $(".ref_fila_visita").length;
    var vemos = $(this).attr("data-id"); // menor a mayor   o    mayor a menor

    let uno = 30;
    let dos = 6;

    if (uno > dos) {
        console.log("30 numero es mayor que 6 numero");
    } else {
        console.log("1 numero es mayor que 30 numero");
    }

    let unos = "30";
    let doss = "6";

    if (unos > doss) {
        console.log("30 string es mayor que 6 string");
    } else {
        console.log("6 string es mayor que 30 string");
    }

    if (n_filas > 1) {
        var array_valores = [];
        for (let t = 0; t < n_filas; t++) {
            if (ref_columna == "c_0") {
                // notese que "eq()" se posiciona en funcion a ".ref_fila_visita" y no a ",c_0"
                array_valores[t] = $(".ref_fila_visita .c_0").eq(t).text();
            }
            if (ref_columna == "c_1") {
                array_valores[t] = $(".ref_fila_visita .c_1").eq(t).text();
            }

            // a partir de "c_2" el contenido son valores numericos, solo que estan en string, por lo que deberan ser convertidos a valores numericos usando "Number"
            if (ref_columna == "c_2") {
                let aux_c2 = $(".ref_fila_visita .c_2").eq(t).text();
                // "trim" elimina los espacios en blanco en ambos extremos de la cadena
                array_valores[t] = Number(aux_c2.trim());
            }
            if (ref_columna == "c_3") {
                let aux_c3 = $(".ref_fila_visita .c_3").eq(t).text();
                array_valores[t] = Number(aux_c3.trim());
            }
            if (ref_columna == "c_4") {
                let aux_c4 = $(".ref_fila_visita .c_4").eq(t).text();
                array_valores[t] = Number(aux_c4.trim());
            }
            if (ref_columna == "c_5") {
                let aux_c5 = $(".ref_fila_visita .c_5").eq(t).text();
                array_valores[t] = Number(aux_c5.trim());
            }
            if (ref_columna == "c_6") {
                let aux_c6 = $(".ref_fila_visita .c_6").eq(t).text();
                array_valores[t] = Number(aux_c6.trim());
            }
            if (ref_columna == "c_7") {
                let aux_c7 = $(".ref_fila_visita .c_7").eq(t).text();
                array_valores[t] = Number(aux_c7.trim());
            }
            if (ref_columna == "c_8") {
                let aux_c8 = $(".ref_fila_visita .c_8").eq(t).text();
                array_valores[t] = Number(aux_c8.trim());
            }
            if (ref_columna == "c_9") {
                let aux_c9 = $(".ref_fila_visita .c_9").eq(t).text();
                array_valores[t] = Number(aux_c9.trim());
            }
            if (ref_columna == "c_10") {
                let aux_c10 = $(".ref_fila_visita .c_10").eq(t).text();
                array_valores[t] = Number(aux_c10.trim());
            }
        }

        // guardamos todas las filas iniciales en la "array_html"
        var array_html = [];
        for (let k = 0; k < n_filas; k++) {
            let fila_k = $(".ref_fila_visita").eq(k).html(); // toma el html que esta DENTRO de ".ref_fila_visita"
            array_html[k] = fila_k;
        }

        for (let i = 0; i < n_filas - 1; i++) {
            for (let j = i + 1; j < n_filas; j++) {
                let valorInteres_i = array_valores[i];
                let valorInteres_j = array_valores[j];

                if (vemos == "menor_mayor") {
                    // se ordenara de "menor a MAYOR"
                    if (valorInteres_i > valorInteres_j) {
                        // j ocupa el lugar de i,  i ocupa el lugar de j
                        //----------------------------------
                        // ordenamos la: array_valores
                        let auxiliar_valor = array_valores[i];
                        array_valores[i] = array_valores[j];
                        array_valores[j] = auxiliar_valor;
                        // ---------------------------------
                        // ordenamos la: array_html
                        let auxiliar_html = array_html[i];
                        array_html[i] = array_html[j];
                        array_html[j] = auxiliar_html;
                    }
                } else {
                    // se ordenara de "MAYOR a menor"
                    if (valorInteres_i < valorInteres_j) {
                        // j ocupa el lugar de i,  i ocupa el lugar de j
                        //-------------------------------------
                        // ordenamos la: array_valores
                        let auxiliar_valor = array_valores[i];
                        array_valores[i] = array_valores[j];
                        array_valores[j] = auxiliar_valor;
                        //-------------------------------------
                        // ordenamos la: array_html
                        let auxiliar_html = array_html[i];
                        array_html[i] = array_html[j];
                        array_html[j] = auxiliar_html;
                    }
                }
            }
        }

        //------------------------------------------------------
        // eliminamos TODAS las FILAS DE LA TABLA DE VISITAS que existan
        $(".ref_fila_visita").remove();

        //-------------------------------------------------------
        /*
        // reconstruccion de la tabla ordenada
        for (let r = 0; r < n_filas; r++) {
            // "append" inserta contenido como hijo de ".tbody_filas_visitas" y al final
            $(".tbody_filas_visitas")
                .eq(r)
                .append(`<tr class="ref_fila_visita">` + array_html[r] + `</tr>`);
        }
        */

        // reconstruccion de la tabla ordenada
        for (let r = 0; r < n_filas; r++) {
            // "append" inserta contenido como hijo de ".tbody_filas_visitas" y al final
            $(".tbody_filas_visitas").append(`<tr class="ref_fila_visita">` + array_html[r] + `</tr>`);
        }

        //---------------------------------------------------------
        // corregimos el tipo de orden para la proxima vez que se le haga click
        if (vemos == "menor_mayor") {
            $(this).attr("data-id", "mayor_menor"); // para que el siguiente orden sea de "MAYOR a menor"
        } else {
            $(this).attr("data-id", "menor_mayor"); // para que el siguiente orden sea de "menor a MAYOR"
        }
    }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR FORMULARIO DE ENCABEZADO DE COMO FUNCIONA"

$("#form_datos_empresa").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_datos_empresa"));

    $.ajax({
        type: "post",
        url: "/laapirest/administrador/accion/guardar_datos_empresa",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_datos_empresa").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Datos guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_datos_empresa").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GAUARDAR FORMULARIO DE ENCABEZADO DE COMO FUNCIONA"

$("#form_encabezados_empresa").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_encabezados_empresa"));

    $.ajax({
        type: "post",
        url: "/laapirest/administrador/accion/guardar_encabezados_empresa",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_encabezados").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Datos guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_encabezados").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR FORMULARIO DE TEXTO PRINCIPAL DE EMPRESA"

$("#form_texto_principal_empresa").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_texto_principal_empresa"));

    $.ajax({
        type: "post",
        url: "/laapirest/administrador/accion/guardar_texto_principal_empresa",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_principal_transiciones").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Texto principal empresa guardada!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_principal_transiciones").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR FORMULARIO DE BENEFICIOS DE EMPRESA"

$("#form_significados_empleos").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_significados_empleos"));

    $.ajax({
        type: "post",
        url: "/laapirest/administrador/accion/guardar_significados_empleos",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_significados_empleos").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Significados guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_significados_empleos").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR FORMULARIO DE BENEFICIOS DE EMPRESA"

$("#textos_segundero").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("textos_segundero"));

    $.ajax({
        type: "post",
        url: "/laapirest/administrador/accion/guardar_textos_segundero",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_textos_segundero").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Textos segundero guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_textos_segundero").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR FORMULARIO DE ENCABEZADO DE COMO SOMOS"

$("#form_encabezado_somos").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_encabezado_somos"));

    $.ajax({
        type: "post",
        url: "/laapirest/administrador/accion/guardar_encabezado_somos",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_somos").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Datos guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_somos").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR FORMULARIO DE ENCABEZADO DE COMO FUNCIONA"

$("#form_encabezado_funciona").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_encabezado_funciona"));

    $.ajax({
        type: "post",
        url: "/laapirest/administrador/accion/guardar_encabezado_funciona",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_funciona").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Datos guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_funciona").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "AGREGAR NUEVA FILA, ARRIBA DE LA FILA SELECCIONADA"

$(".cuerpo_filas_funciona").on("click", ".funciona_arriba", function () {
    let fila_numero = Number($(this).attr("data-id"));
    let n_filas = $(".fila_funciona").length;
    for (let i = 0; i < n_filas; i++) {
        let numero_i = Number($(".numero_funciona").eq(i).text());
        if (numero_i == fila_numero) {
            // "before" inserta contenido ANTES de ".fila_funciona" y A su mismo NIVEL
            $(".fila_funciona")
                .eq(i)
                .before(
                    `<tr class="fila_funciona">

                <td class="numero_funciona text-center"></td>
                <td><input type="text" class="form-control campo_icono_funciona">
                </td>

                <td>
                    <textarea class="form-control campo_explicacion_funciona"
                        rows="5"></textarea>
                </td>

                <td>
                    <div class="d-flex">
                        <button class="funciona_arriba d-block btn btn-primary p-1 m-1"
                            data-id=""><i
                                class="fas fa-arrow-circle-up size_iconos"></i></button>
                        <button class="funciona_abajo d-block btn btn-primary p-1 m-1"
                            data-id=""><i
                                class="fas fa-arrow-circle-down size_iconos"></i></button>
                        <button class="funciona_eliminar d-block btn btn-danger p-1 m-1"
                            data-id=""><i class="fas fa-window-close size_iconos"></i></button>
                    </div>
                </td>

            </tr>`
                );

            break;
        }
    }

    // "n_filas + 1", porque ahora se incremento con una nueva fila
    for (let j = 0; j < n_filas + 1; j++) {
        $(".numero_funciona")
            .eq(j)
            .text(j + 1);
        $(".funciona_arriba")
            .eq(j)
            .attr("data-id", j + 1);
        $(".funciona_abajo")
            .eq(j)
            .attr("data-id", j + 1);
        $(".funciona_eliminar")
            .eq(j)
            .attr("data-id", j + 1);
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "AGREGAR NUEVA FILA, ABAJO DE LA FILA SELECCIONADA"

$(".cuerpo_filas_funciona").on("click", ".funciona_abajo", function () {
    let fila_numero = Number($(this).attr("data-id"));
    let n_filas = $(".fila_funciona").length;
    for (let i = 0; i < n_filas; i++) {
        let numero_i = Number($(".numero_funciona").eq(i).text());
        if (numero_i == fila_numero) {
            // "after" inserta contenido DESPUES de ".fila_funciona" y A su mismo NIVEL
            $(".fila_funciona")
                .eq(i)
                .after(
                    `<tr class="fila_funciona">

                <td class="numero_funciona text-center"></td>
                <td><input type="text" class="form-control campo_icono_funciona">
                </td>

                <td>
                    <textarea class="form-control campo_explicacion_funciona"
                        rows="5"></textarea>
                </td>

                <td>
                    <div class="d-flex">
                        <button class="funciona_arriba d-block btn btn-primary p-1 m-1"
                            data-id=""><i
                                class="fas fa-arrow-circle-up size_iconos"></i></button>
                        <button class="funciona_abajo d-block btn btn-primary p-1 m-1"
                            data-id=""><i
                                class="fas fa-arrow-circle-down size_iconos"></i></button>
                        <button class="funciona_eliminar d-block btn btn-danger p-1 m-1"
                            data-id=""><i class="fas fa-window-close size_iconos"></i></button>
                    </div>
                </td>

            </tr>`
                );

            break;
        }
    }

    // "n_filas + 1", porque ahora se incremento con una nueva fila
    for (let j = 0; j < n_filas + 1; j++) {
        $(".numero_funciona")
            .eq(j)
            .text(j + 1);
        $(".funciona_arriba")
            .eq(j)
            .attr("data-id", j + 1);
        $(".funciona_abajo")
            .eq(j)
            .attr("data-id", j + 1);
        $(".funciona_eliminar")
            .eq(j)
            .attr("data-id", j + 1);
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "ELIMINAR LA FILA SELECCIONADA"

$(".cuerpo_filas_funciona").on("click", ".funciona_eliminar", function () {
    let fila_numero = Number($(this).attr("data-id"));
    let n_filas = $(".fila_funciona").length;
    if (n_filas > 1) {
        // solo sera eliminado si existe mas de 1 fila, esto para mantener 1 fila como minimo que mantenga los botones que permitan agregar nuevas filas
        for (let i = 0; i < n_filas; i++) {
            let numero_i = Number($(".numero_funciona").eq(i).text());
            if (numero_i == fila_numero) {
                $(".fila_funciona").eq(i).remove();
                break;
            }
        }

        // "n_filas - 1", porque ahora se DISMINUYO EN una fila
        for (let j = 0; j < n_filas - 1; j++) {
            $(".numero_funciona")
                .eq(j)
                .text(j + 1);
            $(".funciona_arriba")
                .eq(j)
                .attr("data-id", j + 1);
            $(".funciona_abajo")
                .eq(j)
                .attr("data-id", j + 1);
            $(".funciona_eliminar")
                .eq(j)
                .attr("data-id", j + 1);
        }
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR TABLA DE COMO FUNCIONA"
$("#id_guardar_tabla_funciona").click(function (e) {
    // revision de inputs completos llenados

    let n_item = $(".campo_explicacion_funciona").length; // los demas campos inputs tendran el mismo numero que este
    let campos_vacios = 0;

    for (let i = 0; i < n_item; i++) {
        let valor_icono = $(".campo_icono_funciona").eq(i).val();
        let valor_explicacion = $(".campo_explicacion_funciona").eq(i).val();
        if (valor_icono == "" || valor_explicacion == "") {
            campos_vacios = 1;
            break; // para salir del bucle for
        }
    }

    if (campos_vacios == 0) {
        // almacenamos los valores de los inputs de la tabla
        let array_icono = [];
        let array_explicacion = [];

        for (let j = 0; j < n_item; j++) {
            array_icono[j] = $(".campo_icono_funciona").eq(j).val();
            array_explicacion[j] = $(".campo_explicacion_funciona").eq(j).val();
        }

        var paqueteDatos = {
            array_icono,
            array_explicacion,
        };

        $.ajax({
            type: "POST",
            url: "/laapirest/administrador/accion/guardar_tabla_funciona",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;

            if (tipoRespuesta == "si") {
                $(".ref_botones_tabla_funciona").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Tabla guardada!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "no") {
                $(".ref_botones_tabla_funciona").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Ocurrio un error, intentelo nuevamente!</strong>
                        </div>`
                );
            }
        });
    } else {
        // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
        $(".ref_botones_tabla_funciona").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Todos los campos de la tabla deben estar llenados!</strong>
            </div>`
        );
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "ELIMINAR TABLA DE COMO FUNCIONA"
$("#id_eliminar_tabla_funciona").click(function (e) {
    const respuestaEliminar = confirm("¿Desea eliminar la tabla de CÓMO FUNCIONA?");
    // si la respuesta es "true"
    if (respuestaEliminar) {
        $.ajax({
            type: "POST", // ojo, usamos el metodo POST y no DELETE, YA QUE SOLO SERAN MODIFICADOS LAS PROPIEDADES DE RESPONSABILIDAD SOCIAL DE LA BASE DE DATOS DEL PROYECTO
            url: "/laapirest/administrador/accion/eliminar_tabla_funciona",
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;
            if (tipoRespuesta == "si") {
                // borramos todo el contenido de sus inputs de la primara fila
                $(".campo_icono_funciona").eq(0).val("");
                $(".campo_explicacion_funciona").eq(0).val("");

                let n_filas = $(".fila_funciona").length; // numero de filas de la tabla
                // eliminamos todas las filas de la tabla, excepto la primera (pocicion 0 de la matriz de elementos)
                if (n_filas > 1) {
                    for (let i = 0; i < n_filas - 1; i++) {
                        // "(n_filas - 1)" porque la primara fila no sera eliminada
                        // al eliminar una fila, las que se encuentran debajo de esta suben un nivel, de manera que se ira eliminando siempre la posicion "1" en cada ciclo de eliminacion (sin tocar la posicion 0, es decir la PRIMERA FILA)
                        $(".fila_funciona").eq(1).remove(); //
                    }
                }

                $(".ref_botones_tabla_funciona").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Tabla eliminada!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "no") {
                $(".ref_botones_tabla_funciona").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Ocurrio un error, intentelo nuevamente!</strong>
                        </div>`
                );
            }
        });
    }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GAUARDAR FORMULARIO DE ENCABEZADO DE PREGUNTAS FRECUENTES"

$("#form_encabezado_preguntas").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_encabezado_preguntas"));

    $.ajax({
        type: "post",
        url: "/laapirest/administrador/accion/guardar_encabezado_preguntas",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_preguntas").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Datos guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_preguntas").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "AGREGAR NUEVA FILA, ARRIBA DE LA FILA SELECCIONADA"

$(".cuerpo_filas_preguntas").on("click", ".preguntas_arriba", function () {
    let fila_numero = Number($(this).attr("data-id"));
    let n_filas = $(".fila_preguntas").length;
    for (let i = 0; i < n_filas; i++) {
        let numero_i = Number($(".numero_preguntas").eq(i).text());
        if (numero_i == fila_numero) {
            // "before" inserta contenido ANTES de ".fila_preguntas" y A su mismo NIVEL
            $(".fila_preguntas")
                .eq(i)
                .before(
                    `<tr class="fila_preguntas">

                <td class="numero_preguntas text-center"></td>
                <td>
                    <textarea class="form-control campo_pregunta_preguntas" rows="5"></textarea>
                </td>

                <td>
                    <textarea class="form-control campo_respuesta_preguntas"
                        rows="5"></textarea>
                </td>

                <td>
                    <div class="d-flex">
                        <button class="preguntas_arriba d-block btn p-1 m-1"
                            data-id=""><i
                                class="fas fa-arrow-circle-up size_iconos"></i></button>
                        <button class="preguntas_abajo d-block btn p-1 m-1"
                            data-id=""><i
                                class="fas fa-arrow-circle-down size_iconos"></i></button>
                        <button class="preguntas_eliminar d-block btn p-1 m-1"
                            data-id=""><i class="fas fa-window-close size_iconos"></i></button>
                    </div>
                </td>

            </tr>`
                );

            break;
        }
    }

    // "n_filas + 1", porque ahora se incremento con una nueva fila
    for (let j = 0; j < n_filas + 1; j++) {
        $(".numero_preguntas")
            .eq(j)
            .text(j + 1);
        $(".preguntas_arriba")
            .eq(j)
            .attr("data-id", j + 1);
        $(".preguntas_abajo")
            .eq(j)
            .attr("data-id", j + 1);
        $(".preguntas_eliminar")
            .eq(j)
            .attr("data-id", j + 1);
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "AGREGAR NUEVA FILA, ABAJO DE LA FILA SELECCIONADA"

$(".cuerpo_filas_preguntas").on("click", ".preguntas_abajo", function () {
    let fila_numero = Number($(this).attr("data-id"));
    let n_filas = $(".fila_preguntas").length;
    for (let i = 0; i < n_filas; i++) {
        let numero_i = Number($(".numero_preguntas").eq(i).text());
        if (numero_i == fila_numero) {
            // "after" inserta contenido DESPUES de ".fila_preguntas" y A su mismo NIVEL
            $(".fila_preguntas")
                .eq(i)
                .after(
                    `<tr class="fila_preguntas">

                <td class="numero_preguntas text-center"></td>
                <td>
                    <textarea class="form-control campo_pregunta_preguntas" rows="5"></textarea>
                </td>

                <td>
                    <textarea class="form-control campo_respuesta_preguntas"
                        rows="5"></textarea>
                </td>

                <td>
                    <div class="d-flex">
                        <button class="preguntas_arriba d-block btn p-1 m-1"
                            data-id=""><i
                                class="fas fa-arrow-circle-up size_iconos"></i></button>
                        <button class="preguntas_abajo d-block btn p-1 m-1"
                            data-id=""><i
                                class="fas fa-arrow-circle-down size_iconos"></i></button>
                        <button class="preguntas_eliminar d-block btn p-1 m-1"
                            data-id=""><i class="fas fa-window-close size_iconos"></i></button>
                    </div>
                </td>

            </tr>`
                );

            break;
        }
    }

    // "n_filas + 1", porque ahora se incremento con una nueva fila
    for (let j = 0; j < n_filas + 1; j++) {
        $(".numero_preguntas")
            .eq(j)
            .text(j + 1);
        $(".preguntas_arriba")
            .eq(j)
            .attr("data-id", j + 1);
        $(".preguntas_abajo")
            .eq(j)
            .attr("data-id", j + 1);
        $(".preguntas_eliminar")
            .eq(j)
            .attr("data-id", j + 1);
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "ELIMINAR LA FILA SELECCIONADA"

$(".cuerpo_filas_preguntas").on("click", ".preguntas_eliminar", function () {
    let fila_numero = Number($(this).attr("data-id"));
    let n_filas = $(".fila_preguntas").length;
    if (n_filas > 1) {
        // solo sera eliminado si existe mas de 1 fila, esto para mantener 1 fila como minimo que mantenga los botones que permitan agregar nuevas filas
        for (let i = 0; i < n_filas; i++) {
            let numero_i = Number($(".numero_preguntas").eq(i).text());
            if (numero_i == fila_numero) {
                $(".fila_preguntas").eq(i).remove();
                break;
            }
        }

        // "n_filas - 1", porque ahora se DISMINUYO EN una fila
        for (let j = 0; j < n_filas - 1; j++) {
            $(".numero_preguntas")
                .eq(j)
                .text(j + 1);
            $(".preguntas_arriba")
                .eq(j)
                .attr("data-id", j + 1);
            $(".preguntas_abajo")
                .eq(j)
                .attr("data-id", j + 1);
            $(".preguntas_eliminar")
                .eq(j)
                .attr("data-id", j + 1);
        }
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR TABLA DE COMO preguntas"
$("#id_guardar_tabla_preguntas").click(function (e) {
    // revision de inputs completos llenados

    let n_item = $(".campo_pregunta_preguntas").length; // los demas campos inputs tendran el mismo numero que este
    let campos_vacios = 0;

    for (let i = 0; i < n_item; i++) {
        let valor_icono = $(".campo_pregunta_preguntas").eq(i).val();
        let valor_explicacion = $(".campo_respuesta_preguntas").eq(i).val();
        if (valor_icono == "" || valor_explicacion == "") {
            campos_vacios = 1;
            break; // para salir del bucle for
        }
    }

    if (campos_vacios == 0) {
        // significa que no existen campos vacios, mas al contrario existen campos llenos con informacion

        // almacenamos los valores de los inputs de la tabla
        let array_pregunta = [];
        let array_respuesta = [];

        for (let j = 0; j < n_item; j++) {
            array_pregunta[j] = $(".campo_pregunta_preguntas").eq(j).val();
            array_respuesta[j] = $(".campo_respuesta_preguntas").eq(j).val();
        }

        var paqueteDatos = {
            array_pregunta,
            array_respuesta,
        };

        // ------- Para verificación -------
        console.log("el paquete de datos a envia");
        console.log(paqueteDatos);

        $.ajax({
            type: "POST",
            url: "/laapirest/administrador/accion/guardar_tabla_preguntas",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;

            if (tipoRespuesta == "si") {
                $(".ref_botones_tabla_preguntas").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Tabla guardada!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "no") {
                $(".ref_botones_tabla_preguntas").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Ocurrio un error, intentelo nuevamente!</strong>
                        </div>`
                );
            }
        });
    } else {
        // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
        $(".ref_botones_tabla_preguntas").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Todos los campos de la tabla deben estar llenados!</strong>
            </div>`
        );
    }
});

/**************************************************************************** */
// PARA SUBIR DOCUMENTO DE EMPRESA "COMO FUNCIONA"
// importante, recuerda que para subir documentos o imagenes o cualquier tipo de archivo se usa "submit" (y no "click")
$("#madre_funciona").on("submit", "#idSubirDocEmpresaFunciona", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("idSubirDocEmpresaFunciona"));

    $.ajax({
        type: "post",
        //url: rutaServidor,
        url: "/laapirest/administracion/general/accion/subir_doc_empresa_funciona",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            var codigo_documento = respuestaServidor.codigo_documento;
            var codigo_funciona = respuestaServidor.codigo_funciona;
            var tipo_archivo = respuestaServidor.tipo_archivo; // pdf || word || excel
            var tipo_doc = respuestaServidor.tipo_doc; // manual || beneficio || modelo

            var numeroFunciona = $(".boton_eliminar_imagen_jquery").length;

            //alert("Numero de imagenes: " + numeroFunciona);

            for (let i = 0; i < numeroFunciona; i++) {
                let codigo_funciona_i = $(".boton_eliminar_imagen_jquery").eq(i).attr("data-id");

                //alert("codigo de funciona i: " + codigo_funciona_i);

                if (codigo_funciona_i == codigo_funciona) {
                    if (tipo_doc == "manual") {
                        var tipo_documento = "Manual";
                    }

                    if (tipo_doc == "beneficio") {
                        var tipo_documento = "Beneficio";
                    }

                    if (tipo_doc == "modelo") {
                        var tipo_documento = "Modelo";
                    }

                    //---------------------------------------------

                    if (tipo_archivo == "pdf") {
                        var extension = "pdf";
                    }
                    if (tipo_archivo == "word") {
                        var extension = "docx";
                    }
                    if (tipo_archivo == "excel") {
                        var extension = "xlsx";
                    }

                    // agregamos en el card de funcionamiento que le corresponde
                    // LO Agregamos despues de (.card-footer), COMO HIJO (con "append")
                    // usando acento grave y el ${} para las partes que deven cambiar
                    $(".card-footer")
                        .eq(i)
                        .append(
                            `<div class="documento_funciona d-flex justify-content-between">
                            <div>
                                <i
                                    class="texto-link fas fa-file-${tipo_archivo}"
                                    style="font-size: 2em;"
                                ></i>
                                <a
                                    class="ml-3"
                                    href="/rutavirtualpublico/subido/${codigo_documento}.${extension}"
                                    target="_blank"
                                >
                                    ${tipo_documento}
                                </a>
                            </div>

                            <div>
                                <button
                                    class="eliminar_doc_funciona d-block btn p-1"
                                    data-id="${codigo_documento}"
                                ><i class="fas fa-window-close size_iconos"></i></button>
                            </div>
                        </div>`
                        );

                    break; // una vez encontrado la "imagen funciona" deseada, salimos del bucle "for"
                }
            }

            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_doc").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Documento guardado!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no" || tipoRespuesta == "denegado") {
            var mensaje = respuestaServidor.mensaje;
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_doc").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>${mensaje}</strong>
                </div>`
            );
        }

        // LIMPIAMOS LOS INPUTS
        $("#id_input_subir_documento").val(""); // es el tipo "file"
        $(".clase_codigo_funciona").val("");
    });
});

/**************************************************************************** */
// PARA ELIMINAR DOCUMENTO de "COMO FUNCIONA"

$("#madre_funciona").on("click", ".eliminar_doc_funciona", function () {
    const respuestaEliminar = confirm("¿Desea eliminar el documento?");

    // si la respuesta es "true"
    if (respuestaEliminar) {
        var codigo_documento = $(this).attr("data-id");

        var paqueteDatos = {
            codigo_documento,
        };

        // ahora enviamos una peticion al servidor, un AJAX de tipo "delete"
        // usamos el metodo AJAX
        $.ajax({
            url: "/laapirest/administracion/general/accion/eliminar_doc_empresa_funciona",
            type: "DELETE",
            data: paqueteDatos,
        })
            // la respusta del servidor la guardamos en "respuestaServidor" (que sera el parametro que recibira la funcion)
            .done(function (respuestaServidor) {
                var laRespuesta = respuestaServidor.exito;

                if (laRespuesta == "si") {
                    // Contamos todas las documentos que existen en la ventana
                    var numeroElementos = $(".eliminar_doc_funciona").length;

                    for (let i = 0; i < numeroElementos; i++) {
                        let codigoDocumentoFor = $(".eliminar_doc_funciona").eq(i).attr("data-id");

                        if (codigoDocumentoFor === codigo_documento) {
                            $(".documento_funciona").eq(i).remove();
                            break; // una vez encontrado el documento deseado, salimos del bucle "for"
                        }
                    }
                }

                if (laRespuesta == "no") {
                    alert(respuestaServidor.mensaje);
                }
            });
    }
});

/**************************************************************************** */
// PARA GUARDAR URL VIDEO DE "COMO FUNCIONA"
$("#madre_funciona").on("submit", "#idSubirVidEmpresaFunciona", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("idSubirVidEmpresaFunciona"));

    $.ajax({
        type: "post",
        //url: rutaServidor,
        url: "/laapirest/administracion/general/accion/subir_url_video_funciona",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            var url_video = respuestaServidor.url_video;
            var codigo_funciona = respuestaServidor.codigo_funciona;

            //-----------------------------------------------------------------
            // eliminacion de url video si exiese, para ser reemplazado con la nueva url
            var n_videos = $(".eliminar_video_funciona").length;

            if (n_videos > 0) {
                for (let j = 0; j < n_videos; j++) {
                    let codigo_funciona_j = $(".eliminar_video_funciona").eq(j).attr("data-id");
                    if (codigo_funciona_j == codigo_funciona) {
                        // eliminamos desde el contenedor del video funciona
                        $(".video_funciona").eq(j).remove();
                        break; // una vez encontrado el video deseado, salimos del bucle "for"
                    }
                }
            }

            //-----------------------------------------------------------------
            // agregacion de la nueva url en el card de funciona que le corresponde

            var n_funciona = $(".boton_eliminar_imagen_jquery").length;

            for (let i = 0; i < n_funciona; i++) {
                let codigo_funciona_i = $(".boton_eliminar_imagen_jquery").eq(i).attr("data-id");

                if (codigo_funciona_i === codigo_funciona) {
                    // agregamos en el card de funcionamiento que le corresponde
                    // LO Agregamos despues de (.card-footer), COMO HIJO (con "append")
                    // usando acento grave y el ${} para las partes que deven cambiar
                    $(".card-footer")
                        .eq(i)
                        .append(
                            `<div class="video_funciona d-flex justify-content-between">
                                <div>
                                    <i
                                        class="texto-link fas fa-video"
                                        style="font-size: 2em;"
                                    ></i>
                                    <a
                                        class="ml-3"
                                        href="${url_video}"
                                        target="_blank"
                                    >
                                        Video
                                    </a>
                                </div>

                                <div>
                                    <button
                                        class="eliminar_video_funciona d-block btn p-1"
                                        data-id="${codigo_funciona}"
                                    ><i class="fas fa-window-close size_iconos"></i></button>
                                </div>
                            </div>`
                        );

                    break; // una vez encontrado la "imagen funciona" deseada, salimos del bucle "for"
                }
            }

            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_vid").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Url de video guardado!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            var mensaje = respuestaServidor.mensaje;
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_vid").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>${mensaje}</strong>
                </div>`
            );
        }
        // LIMPIAMOS LOS INPUTS
        $(".clase_codigo_funciona").val("");
        $(".clase_url_video_funciona").val("");
    });
});

/**************************************************************************** */
// PARA ELIMINAR VIDEO de "COMO FUNCIONA"

$("#madre_funciona").on("click", ".eliminar_video_funciona", function () {
    const respuestaEliminar = confirm("¿Desea eliminar la url del video?");

    // si la respuesta es "true"
    if (respuestaEliminar) {
        var codigo_imagen_funciona = $(this).attr("data-id");

        var paqueteDatos = {
            codigo_imagen_funciona,
        };

        // ahora enviamos una peticion al servidor, un AJAX de tipo "delete"
        // usamos el metodo AJAX
        $.ajax({
            url: "/laapirest/administracion/general/accion/eliminar_vid_empresa_funciona",
            type: "DELETE",
            data: paqueteDatos,
        })
            // la respusta del servidor la guardamos en "respuestaServidor" (que sera el parametro que recibira la funcion)
            .done(function (respuestaServidor) {
                var laRespuesta = respuestaServidor.exito;

                if (laRespuesta == "si") {
                    var codigo_funciona = respuestaServidor.codigo_imagen_funciona;

                    //-----------------------------------------------------------------
                    // eliminacion de url video si exiese, para ser reemplazado con la nueva url
                    n_videos = $(".eliminar_video_funciona").length;

                    if (n_videos > 0) {
                        for (let j = 0; j < n_videos; j++) {
                            let codigo_funciona_j = $(".eliminar_video_funciona").eq(j).attr("data-id");
                            if (codigo_funciona_j == codigo_funciona) {
                                // eliminamos desde el contenedor del video funciona
                                $(".video_funciona").eq(j).remove();
                                break; // una vez encontrado el video deseado, salimos del bucle "for"
                            }
                        }
                    }
                }

                if (laRespuesta == "no") {
                    alert(respuestaServidor.mensaje);
                }
            });
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "ELIMINAR TABLA DE COMO preguntas"
$("#id_eliminar_tabla_preguntas").click(function (e) {
    const respuestaEliminar = confirm("¿Desea eliminar la tabla de CÓMO preguntas?");
    // si la respuesta es "true"
    if (respuestaEliminar) {
        $.ajax({
            type: "POST", // ojo, usamos el metodo POST y no DELETE, YA QUE SOLO SERAN MODIFICADOS LAS PROPIEDADES DE RESPONSABILIDAD SOCIAL DE LA BASE DE DATOS DEL PROYECTO
            url: "/laapirest/administrador/accion/eliminar_tabla_preguntas",
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;
            if (tipoRespuesta == "si") {
                // borramos todo el contenido de sus inputs de la primara fila
                $(".campo_pregunta_preguntas").eq(0).val("");
                $(".campo_respuesta_preguntas").eq(0).val("");

                let n_filas = $(".fila_preguntas").length; // numero de filas de la tabla
                // eliminamos todas las filas de la tabla, excepto la primera (pocicion 0 de la matriz de elementos)
                if (n_filas > 1) {
                    for (let i = 0; i < n_filas - 1; i++) {
                        // "(n_filas - 1)" porque la primara fila no sera eliminada
                        // al eliminar una fila, las que se encuentran debajo de esta suben un nivel, de manera que se ira eliminando siempre la posicion "1" en cada ciclo de eliminacion (sin tocar la posicion 0, es decir la PRIMERA FILA)
                        $(".fila_preguntas").eq(1).remove(); //
                    }
                }

                $(".ref_botones_tabla_preguntas").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Tabla eliminada!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "no") {
                $(".ref_botones_tabla_preguntas").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Ocurrio un error, intentelo nuevamente!</strong>
                        </div>`
                );
            }
        });
    }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "ACTUALIZAR LOS NUMERO RESUMEN DE VISTA INICIAL CUADROS DESCENDENTES"

$("#actualizar_numeros").click(function (e) {
    $.ajax({
        url: "/laapirest/administrador/accion/actualizar_numeros_empresa",
        type: "get",
    }).done(function (respuestaServidor) {
        // ------- Para verificación -------
        //console.log("los numeros actualizados");
        //console.log(respuestaServidor.exito);
        //console.log(respuestaServidor.paquete_respuesta);

        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // PINTAMOS LOS VALORES RESUMENES ACTUALIZADOS
            $(".n_construidos").text(respuestaServidor.paquete_respuesta.n_construidos);
            $(".n_proyectos").text(respuestaServidor.paquete_respuesta.n_proyectos);
            $(".n_inmuebles").text(respuestaServidor.paquete_respuesta.n_inmuebles);
            $(".n_empleos").text(respuestaServidor.paquete_respuesta.n_empleos);
            $(".n_ahorros").text(respuestaServidor.paquete_respuesta.n_ahorros);
            $(".n_resp_social").text(respuestaServidor.paquete_respuesta.n_resp_social);

            $(".ref_mensaje_numeros_resumen").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Números resumen actualizados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            $(".ref_mensaje_numeros_resumen").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No se logro actualizar los números resumen!</strong>
                </div>`
            );
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "TABLA DE VISITAS A LAS PAGINAS DE: TERRENO, PROYECTO, INMUEBLE"
$("#madre_visitas").on("click", ".radio_tipo_vista", function () {
    // eliminamos toda la tabla si es que existiese alguna (por seguridad)
    $(".contenedor_visitas").remove();
    $(".alert").remove(); // borramos todos los alert

    // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
    $(".referencia_mensaje").after(
        `<div class="alert alert-success mt-3">
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
            <strong>Espere...</strong>
        </div>`
    );

    var tipo_visita = $(this).val(); // terreno || proyecto || inmueble

    var paqueteDatos = {
        tipo_visita,
    };

    // ahora enviamos una peticion al servidor, un AJAX de tipo "delete"
    // usamos el metodo AJAX
    $.ajax({
        url: "/laapirest/administrador/accion/visitas",
        type: "post",
        data: paqueteDatos,
    })
        // la respuesta del servidor la guardamos en "respuestaServidor" (que sera el parametro que recibira la funcion)
        .done(function (respuestaServidor) {
            var laRespuesta = respuestaServidor.exito;
            var tipo_visita = respuestaServidor.tipo_visita;

            if (laRespuesta == "si") {
                var listado_visitas = respuestaServidor.listado_visitas;

                //--------------------------------------------------------
                // creamos la primera parte de la tabla

                cabecera_tabla_visitas(tipo_visita);

                //--------------------------------------------------------------------
                // ARMADO DE LAS FILAS DE VISTAS
                for (let i = 0; i < listado_visitas.length; i++) {
                    if (tipo_visita == "terreno") {
                        // "append" inserta contenido como hijo de ".tbody_filas_visitas" y al final
                        $(".tbody_filas_visitas").append(
                            `
                            <tr class="ref_fila_visita">
                                <td class="c_0"><a href="/laapirest/terreno/${listado_visitas[i].codigo_terreno}/descripcion" target="_blank">${listado_visitas[i].codigo_terreno}</a></td>
                                <td class="c_1">${listado_visitas[i].estado_terreno}</td>
                                <td class="c_2">${listado_visitas[i].v_descripcion}</td>
                                <td class="c_3">${listado_visitas[i].v_proyectos}</td>
                                <td class="c_4">${listado_visitas[i].total_visitas}</td>
                            </tr>
                            `
                        );
                    }

                    if (tipo_visita == "proyecto") {
                        // "append" inserta contenido como hijo de ".tbody_filas_visitas" y al final
                        $(".tbody_filas_visitas").append(
                            `
                            <tr class="ref_fila_visita">
                                <td class="c_0"><a href="/laapirest/proyecto/${listado_visitas[i].codigo_proyecto}/descripcion" target="_blank">${listado_visitas[i].codigo_proyecto}</a></td>
                                <td class="c_1">${listado_visitas[i].estado_proyecto}</td>
                                <td class="c_2">${listado_visitas[i].v_descripcion}</td>
                                <td class="c_3">${listado_visitas[i].v_inmuebles}</td>
                                <td class="c_4">${listado_visitas[i].v_garantias}</td>
                                <td class="c_5">${listado_visitas[i].v_beneficios}</td>
                                <td class="c_6">${listado_visitas[i].v_info_economico}</td>
                                <td class="c_7">${listado_visitas[i].v_empleos}</td>
                                <td class="c_8">${listado_visitas[i].v_requerimientos}</td>
                                <td class="c_9">${listado_visitas[i].v_resp_social}</td>
                                <td class="c_10">${listado_visitas[i].total_visitas}</td>
                            </tr>
                            `
                        );
                    }

                    if (tipo_visita == "inmueble") {
                        // "append" inserta contenido como hijo de ".tbody_filas_visitas" y al final
                        $(".tbody_filas_visitas").append(
                            `
                            <tr class="ref_fila_visita">
                                <td class="c_0"><a href="/laapirest/inmueble/${listado_visitas[i].codigo_inmueble}/descripcion" target="_blank">${listado_visitas[i].codigo_inmueble}</a></td>
                                <td class="c_1">${listado_visitas[i].estado_inmueble}</td>
                                <td class="c_2">${listado_visitas[i].v_descripcion}</td>
                                <td class="c_3">${listado_visitas[i].v_garantias}</td>
                                <td class="c_4">${listado_visitas[i].v_beneficios}</td>
                                <td class="c_5">${listado_visitas[i].v_info_economico}</td>
                                <td class="c_6">${listado_visitas[i].v_empleos}</td>
                                <td class="c_7">${listado_visitas[i].v_inversor}</td>
                                <td class="c_8">${listado_visitas[i].total_visitas}</td>
                            </tr>
                            `
                        );
                    }
                }

                $(".alert").remove(); // borramos todos los alert
                // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
                $(".referencia_mensaje").after(
                    `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Terminado!</strong>
                    </div>`
                );
            }

            if (laRespuesta == "no") {
                $(".alert").remove(); // borramos todos los alert
                // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
                $(".referencia_mensaje").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Aun no se cuentan con número de visitas para ${tipo_visita}</strong>
                    </div>`
                );
            }
        });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "BUSCAR NUMERO DE VISITAS DE: TERRENO, PROYECTO, INMUEBLE"
$("#madre_visitas").on("click", ".buscar_visita", function () {
    // eliminamos toda la tabla si es que existiese alguna (por seguridad)
    $(".contenedor_visitas").remove();

    $(".alert").remove(); // borramos todos los alert

    var codigo_visita = $("#id_input_visita").val(); // terreno || proyecto || inmueble

    if (codigo_visita != "") {
        var paqueteDatos = {
            codigo_visita,
        };

        // ahora enviamos una peticion al servidor, un AJAX de tipo "delete"
        // usamos el metodo AJAX
        $.ajax({
            url: "/laapirest/administrador/accion/buscar_visitas",
            type: "post",
            data: paqueteDatos,
        })
            // la respuesta del servidor la guardamos en "respuestaServidor" (que sera el parametro que recibira la funcion)
            .done(function (respuestaServidor) {
                var laRespuesta = respuestaServidor.exito;
                var tipo_visita = respuestaServidor.tipo_visita;
                var visitas = respuestaServidor.visitas;

                if (laRespuesta == "si") {
                    if (tipo_visita == "te") {
                        var aux_tipo_visita = "terreno";
                    }
                    if (tipo_visita == "py") {
                        var aux_tipo_visita = "proyecto";
                    }
                    if (tipo_visita == "im") {
                        var aux_tipo_visita = "inmueble";
                    }

                    cabecera_tabla_visitas(aux_tipo_visita);

                    if (aux_tipo_visita == "terreno") {
                        // "append" inserta contenido como hijo de ".tbody_filas_visitas" y al final
                        $(".tbody_filas_visitas").append(
                            `
                            <tr class="ref_fila_visita">
                                <td class="c_0"><a href="/laapirest/terreno/${visitas.codigo_terreno}/descripcion" target="_blank">${visitas.codigo_terreno}</a></td>
                                <td class="c_1">${visitas.estado_terreno}</td>
                                <td class="c_2">${visitas.v_descripcion}</td>
                                <td class="c_3">${visitas.v_proyectos}</td>
                                <td class="c_4">${visitas.total_visitas}</td>
                            </tr>
                            `
                        );
                    }

                    if (aux_tipo_visita == "proyecto") {
                        // "append" inserta contenido como hijo de ".tbody_filas_visitas" y al final
                        $(".tbody_filas_visitas").append(
                            `
                            <tr class="ref_fila_visita">
                                <td class="c_0"><a href="/laapirest/proyecto/${visitas.codigo_proyecto}/descripcion" target="_blank">${visitas.codigo_proyecto}</a></td>
                                <td class="c_1">${visitas.estado_proyecto}</td>
                                <td class="c_2">${visitas.v_descripcion}</td>
                                <td class="c_3">${visitas.v_inmuebles}</td>
                                <td class="c_4">${visitas.v_garantias}</td>
                                <td class="c_5">${visitas.v_beneficios}</td>
                                <td class="c_6">${visitas.v_info_economico}</td>
                                <td class="c_7">${visitas.v_empleos}</td>
                                <td class="c_8">${visitas.v_requerimientos}</td>
                                <td class="c_9">${visitas.v_resp_social}</td>
                                <td class="c_10">${visitas.total_visitas}</td>
                            </tr>
                            `
                        );
                    }

                    if (aux_tipo_visita == "inmueble") {
                        // "append" inserta contenido como hijo de ".tbody_filas_visitas" y al final
                        $(".tbody_filas_visitas").append(
                            `
                            <tr class="ref_fila_visita">
                                <td class="c_0"><a href="/laapirest/inmueble/${visitas.codigo_inmueble}/descripcion" target="_blank">${visitas.codigo_inmueble}</a></td>
                                <td class="c_1">${visitas.estado_inmueble}</td>
                                <td class="c_2">${visitas.v_descripcion}</td>
                                <td class="c_3">${visitas.v_garantias}</td>
                                <td class="c_4">${visitas.v_beneficios}</td>
                                <td class="c_5">${visitas.v_info_economico}</td>
                                <td class="c_6">${visitas.v_empleos}</td>
                                <td class="c_7">${visitas.v_inversor}</td>
                                <td class="c_8">${visitas.total_visitas}</td>
                            </tr>
                            `
                        );
                    }

                    // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
                    $(".ref_mensaje_busc_visitas").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Terminado!</strong>
                        </div>`
                    );
                }

                if (laRespuesta == "no") {
                    // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
                    $(".ref_mensaje_busc_visitas").after(
                        `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Aun no se cuentan con número de visitas para ${codigo_visita}</strong>
                        </div>`
                    );
                }
            });
    } else {
        // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
        $(".ref_mensaje_busc_visitas").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Introduzca un código de: Terreno, Proyecto o Inmueble</strong>
            </div>`
        );
    }
});

//----------------------------------------------------------------------

function cabecera_tabla_visitas(aux_tipo_visita) {
    var tipo_visita = aux_tipo_visita;

    if (tipo_visita == "terreno") {
        // "after" inserta contenido DESPUES de ".ref_tabla_visitas" y A su mismo NIVEL
        $(".ref_tabla_visitas").after(
            `
                <div class="contenedor_visitas mt-5">
                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-center"><i class="fas fa-glasses"></i>&nbsp;Terreno</h5>
                        </div>
            
                    </div>
            
                    <div class="table-responsive ref_historial_acciones cuadro_estandart p-3 my-4">
                        <table class="texto-link table table-bordered">
                            <thead>
                                <tr>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_0" data-id="mayor_menor">Código&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_1" data-id="mayor_menor">Estado&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_2" data-id="mayor_menor">Descripción&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_3" data-id="mayor_menor">Proyectos&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_4" data-id="mayor_menor">Total&nbsp;<i class="fas fa-sort"></i></th>
                                </tr>
                            </thead>
            
                            <tbody class="tbody_filas_visitas">
            
                            </tbody>
            
                        </table>
            
                    </div>
                </div>
            `
        );
    }

    if (tipo_visita == "proyecto") {
        // "after" inserta contenido DESPUES de ".ref_tabla_visitas" y A su mismo NIVEL
        $(".ref_tabla_visitas").after(
            `
                <div class="contenedor_visitas mt-5">
                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-center"><i class="fas fa-glasses"></i>&nbsp;Proyecto</h5>
                        </div>
                    </div>

                    <div class="table-responsive ref_historial_acciones cuadro_estandart p-3 my-4">
                        <table class="texto-link table table-bordered">
                            <thead>
                                <tr>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_0" data-id="mayor_menor">Código&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_1" data-id="mayor_menor">Estado&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_2" data-id="mayor_menor">Descripción&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_3" data-id="mayor_menor">Inmuebles&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_4" data-id="mayor_menor">Garantía&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_5" data-id="mayor_menor">Beneficios&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_6" data-id="mayor_menor">Info. Eco.&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_7" data-id="mayor_menor">Empleos&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_8" data-id="mayor_menor">Requerimientos&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_9" data-id="mayor_menor">Resp. Soci.&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_10" data-id="mayor_menor">Total&nbsp;<i class="fas fa-sort"></i></th>
                                </tr>
                            </thead>

                            <tbody class="tbody_filas_visitas">

                            </tbody>

                        </table>

                    </div>
                </div>
            `
        );
    }

    if (tipo_visita == "inmueble") {
        // "after" inserta contenido DESPUES de ".ref_tabla_visitas" y A su mismo NIVEL
        $(".ref_tabla_visitas").after(
            `
                <div class="contenedor_visitas mt-5">
                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-center"><i class="fas fa-glasses"></i>&nbsp;Inmueble</h5>
                        </div>
                    </div>
            
                    <div class="table-responsive ref_historial_acciones cuadro_estandart p-3 my-4">
                        <table class="texto-link table table-bordered">
                            <thead>
                                <tr>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_0" data-id="mayor_menor">Código&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_1" data-id="mayor_menor">Estado&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_2" data-id="mayor_menor">Descripción&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_3" data-id="mayor_menor">Garantías&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_4" data-id="mayor_menor">Beneficios&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_5" data-id="mayor_menor">Info. Eco.&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_6" data-id="mayor_menor">Empleos&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_7" data-id="mayor_menor">Propietario&nbsp;<i class="fas fa-sort"></i></th>
                                    <th class="text-left texto-resaltado orden_tabla_visitas" id="c_8" data-id="mayor_menor">Total&nbsp;<i class="fas fa-sort"></i></th>
                                </tr>
                            </thead>
            
                            <tbody class="tbody_filas_visitas">
            
            
                            </tbody>
            
                        </table>
            
            
                    </div>
                </div>
            `
        );
    }
}
