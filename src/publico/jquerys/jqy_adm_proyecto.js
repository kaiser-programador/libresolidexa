// CONTIENE TODA LA LOGICA RELACIONADA CON EL "PROYECTO" LADO ADMINISTRADOR

/************************************************************************************* */
/************************************************************************************* */
// PARA GUARDAR DATOS FORMULARIO INICIAL PROYECTO

$("#guardar_datos_formulario_proyecto").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("guardar_datos_formulario_proyecto"));

    var codigo_proyecto = $("#guardar_datos_formulario_proyecto").attr("data-id");

    $.ajax({
        type: "post",
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_descripcion",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".boton_guardado").after(
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
            $(".boton_guardado").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                    </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            $(".boton_guardado").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>El presente proyecto se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                </div>`
            );
        }
    });
});

/************************************************************************************* */
/************************************************************************************* */
// PARA CREACION DE NUEVO CODIGO DE INMUEBLE

$("#creador_nuevo_inmueble").click(function (e) {
    var codigo_proyecto = $("#creador_nuevo_inmueble").attr("data-id"); // con el codigo del proyecto, se buscara en el controlador el codigo del terreno y con ese codigo se verificara si el terreno esta bloqueado o no lo esta.

    var paqueteDatos = {
        codigo_proyecto,
    };
    $.ajax({
        url: "/laapirest/administracion/general/accion/permiso_nuevo_inmueble",
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "permitido") {
            // /laapirest/inmueble/:codigo_proyecto
            var rutaServidor = "/laapirest/inmueble/" + codigo_proyecto;
            $("#formulario_creador_inmueble").attr("action", rutaServidor);
            vemos = $("#formulario_creador_inmueble").attr("action");

            // IMPORTANTE, PORQUE LE INDICAMOS AL FORMULARIO QUE HAGA "submit", es decir que se dirija a la ruta que se le creo guardao en "rutaServidor" y que le agregamos como "attr" 'action'
            $("#formulario_creador_inmueble").submit();
        }

        if (respuestaServidor.exito == "no") {
            $("#creador_nuevo_inmueble").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>¡Ocurrio un problema!, inténtelo nuevamente</strong>
                </div>`
            );
        }

        if (respuestaServidor.exito == "denegado") {
            $("#creador_nuevo_inmueble").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>El TERRENO presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                </div>`
            );
        }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA LA CASILLA DE VISIBILIDAD DE REQUERIMIENTOS DEL PROYECTO

$(".casilla_requerimientos_visible").click(function (e) {
    //
    var casilla = $(this).attr("data-marcado"); // el estado inicial del check, si es "false" significa que no esta seleccionado, si es "true" significa que si estea seleccionado

    if (casilla == "true") {
        // si la casilla era "true" ahora cambiara de estado a "false" (es decir no estara seleccionado)
        $(".casilla_requerimientos_visible").attr("data-marcado", "false");
        $(".input_visibilidad_requerimientos").val("false");
    }

    if (casilla == "false") {
        // si la casilla era "false" ahora cambiara de estado a "true" (es decir no estara seleccionado)
        $(".casilla_requerimientos_visible").attr("data-marcado", "true");
        $(".input_visibilidad_requerimientos").val("true");
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA LA CASILLA DE VISIBILIDAD DE RESPONSABILIDAD SOCIAL DEL PROYECTO

$(".casilla_rs_visible").click(function (e) {
    //
    var casilla = $(this).attr("data-marcado"); // el estado inicial del check, si es "false" significa que no esta seleccionado, si es "true" significa que si estea seleccionado

    if (casilla == "true") {
        // si la casilla era "true" ahora cambiara de estado a "false" (es decir no estara seleccionado)
        $(".casilla_rs_visible").attr("data-marcado", "false");
        $(".input_visibilidad_rs").val("false");
    }

    if (casilla == "false") {
        // si la casilla era "false" ahora cambiara de estado a "true" (es decir no estara seleccionado)
        $(".casilla_rs_visible").attr("data-marcado", "true");
        $(".input_visibilidad_rs").val("true");
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Al guardar el estado del proyecto

$("#guardar_estado_proyecto").click(function (e) {
    // **OK
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let nuevo_estado = $(".radio_input_estado").val();
    var paqueteDatos = {
        nuevo_estado,
    };

    $.ajax({
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_estado_proyecto",
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "acceso_principal"

            $("#guardar_estado_proyecto").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Estado del proyecto guardado!</strong>
                    </div>`
            );
        }

        if (respuestaServidor.exito == "no") {
            $("#guardar_estado_proyecto").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                    </div>`
            );
        }

        if (respuestaServidor.exito == "denegado") {
            $("#guardar_estado_proyecto").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                    </div>`
            );
        }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA LA CASILLA DE VISIBILIDAD DE PROYECTO

$(".casilla_py_visible").click(function (e) {
    // **OK
    var casilla = $(this).attr("data-marcado"); // el estado inicial del check, si es "false" significa que no esta seleccionado, si es "true" significa que si estea seleccionado

    if (casilla == "true") {
        // si la casilla era "true" ahora cambiara de estado a "false" (es decir no estara seleccionado)
        $(".casilla_py_visible").attr("data-marcado", "false");
        $(".input_visibilidad_proyecto").val("false");
    }

    if (casilla == "false") {
        // si la casilla era "false" ahora cambiara de estado a "true" (es decir no estara seleccionado)
        $(".casilla_py_visible").attr("data-marcado", "true");
        $(".input_visibilidad_proyecto").val("true");
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GUARDAR VISIBILIDAD del PROYECTO

$("#guardar_visibilidad_proyecto").click(function (e) {
    // **OK
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let casilla_check = $(".input_visibilidad_proyecto").val();
    var paqueteDatos = {
        casilla_check,
    };

    $.ajax({
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_visibilidad_proyecto",
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "acceso_principal"

            $("#guardar_visibilidad_proyecto").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Estado del proyecto guardado!</strong>
                    </div>`
            );
        }

        if (respuestaServidor.exito == "no") {
            $("#guardar_visibilidad_proyecto").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                    </div>`
            );
        }

        if (respuestaServidor.exito == "denegado") {
            $("#guardar_visibilidad_proyecto").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                    </div>`
            );
        }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para el menu apegado izquierdo
$(".clase_flecha_filtro_orden").click(function (e) {
    var el_estado = $(".deslizado_o_f_inm").text();

    // STOP() (se pone antes del animate) es para casos en que se hace click varias veces, solo se tome en cuenta una sola vez, asi se evita que la animacion se salgue de control
    if (el_estado == "comprimido") {
        $("#id_contenedor_filtro_orden")
            .stop()
            .animate(
                {
                    marginLeft: "18rem",
                },
                600,
                function () {
                    // para que despues de que se dezplace al lado izquierdo, recien se establesca como "expandido"
                    $(".deslizado_o_f_inm").text("expandido");
                }
            ); // tiempo animacion de 700 milisegundos
    } else {
        // si sale 'block'

        $("#id_contenedor_filtro_orden")
            .stop()
            .animate(
                {
                    marginLeft: "0rem",
                },
                600,
                function () {
                    // para que despues de que se dezplace al lado izquierdo, recien se establesca como "comprimido"
                    $(".deslizado_o_f_inm").text("comprimido");
                }
            );
    }
});

/************************************************************************************* */
// para RADIO cambio de "BLOQUEADO" o "DESBLOQUEADO"

$(".clase_bloq_desbloq").click(function (e) {
    var valorRadioSeleccinado = $(this).val();
    $("#id_bloqueo_desbloqueo").val(valorRadioSeleccinado);
});

/************************************************************************************* */
// para "ELIMINAR" el proyecto

$("#id_eliminar_proyecto").click(function (e) {
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let usuario_maestro = $("#id_usuario_maestro").val();
    let clave_maestro = $("#id_clave_maestro").val();

    if (usuario_maestro == "" || clave_maestro == "") {
        $("#id_eliminar_proyecto").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Llene los campos de acceso maestro!</strong>
            </div>`
        );
    } else {
        var paqueteDatos = {
            usuario_maestro,
            clave_maestro,
        };
        $.ajax({
            url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/eliminar_proyecto",
            type: "DELETE",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            if (respuestaServidor.exito == "si") {
                alert("Proyecto eliminado. Ahora usted sera redireccionado a la ventana principal");
                $("#id_ref_ventana_inicio").submit();
            }

            if (respuestaServidor.exito == "no") {
                $("#id_eliminar_proyecto").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>${respuestaServidor.mensaje}</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "no_maestro") {
                $("#id_eliminar_proyecto").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>${respuestaServidor.mensaje}</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "denegado") {
                $("#id_eliminar_proyecto").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>${respuestaServidor.mensaje}</strong>
                    </div>`
                );
            }

            // limpiesa de los campos de claves maestras
            $("#id_usuario_maestro").val("");
            $("#id_clave_maestro").val("");
        });
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR FORMULARIO DE RESPONSABILIDAD" del proyecto   **OK

$("#guardar_formulario_rs").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("guardar_formulario_rs"));
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    $.ajax({
        type: "post",
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_form_rs",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_rs").after(
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
            $(".ref_boton_rs").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            alert(
                "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios"
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "GUARDAR FORMULARIO DE TRABAJO" del proyecto   **OK

$("#guardar_formulario_empleos").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("guardar_formulario_empleos"));
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    $.ajax({
        type: "post",
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_form_empleos",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_rs").after(
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
            $(".ref_boton_rs").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            alert(
                "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios"
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "TEXTOS-PROYECTO" del PROYECTO

$("#form_textos_proyecto").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_textos_proyecto"));

    $.ajax({
        type: "post",
        url: "/laapirest/crearnuevoproyecto/guardar_textos_py/proyecto",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_textos_py").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Textos proyecto guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_textos_py").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            alert(
                "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios"
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "TEXTOS-INMUEBLE" del PROYECTO

$("#form_textos_inmueble").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_textos_inmueble"));

    $.ajax({
        type: "post",
        url: "/laapirest/crearnuevoproyecto/guardar_textos_py/inmueble",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_textos_inm").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Textos inmueble guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_textos_inm").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            alert(
                "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios"
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para "TEXTOS-SEGUNDEROS" del PROYECTO

$("#form_segunderos_justo").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_segunderos_justo"));

    $.ajax({
        type: "post",
        url: "/laapirest/crearnuevoproyecto/guardar_textos_py/segunderos_justo",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_segunderos_justo").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Textos inmueble guardados!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_segunderos_justo").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            alert(
                "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios"
            );
        }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GUARDAR VISIBILIDAD REQUERIMIENTOS del PROYECTO

$("#guardar_visibilidad_requerimientos").click(function (e) {
    //
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let casilla_check = $(".input_visibilidad_requerimientos").val();
    var paqueteDatos = {
        casilla_check,
    };

    $.ajax({
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_visibilidad_requerimientos",
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "acceso_principal"

            $("#guardar_visibilidad_requerimientos").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Visibilidad de requerimientos del proyecto guardado!</strong>
                    </div>`
            );
        }

        if (respuestaServidor.exito == "no") {
            $("#guardar_visibilidad_requerimientos").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                    </div>`
            );
        }

        if (respuestaServidor.exito == "denegado") {
            $("#guardar_visibilidad_requerimientos").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El presente proyecto se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                    </div>`
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para guardar "NOTA EXISTENTE REQUERIMIENTO" del PROYECTO

$("#form_existente_requerimientos").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_existente_requerimientos"));
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    $.ajax({
        type: "post",
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_requerimientos_existente",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_existente").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Nota requerimientos existente guardado!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_existente").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_existente").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El presente proyecto se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                </div>`
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para guardar "NOTA INEXISTENTE REQUERIMIENTO" del PROYECTO

$("#form_inexistente_requerimientos").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("form_inexistente_requerimientos"));
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    $.ajax({
        type: "post",
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_requerimientos_inexistente",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_inexistente").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Nota requerimientos inexistente guardado!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_inexistente").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_inexistente").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El presente proyecto se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                </div>`
            );
        }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GUARDAR REQUERIMIENTO del PROYECTO
$(".madre_requerimiento").on("click", "#id_guardar_requerimiento", function () {
    //$("#id_guardar_requerimiento").click(function (e) {

    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    var n_requerimientos = Number($(".listado_requerimientos").attr("data-id"));

    var texto_requerimiento = $(".texto_requerimiento").val();
    var texto_descripcion = $(".texto_descripcion").val();
    var texto_cantidad = $(".texto_cantidad").val();
    var texto_presupuesto = $(".texto_presupuesto").val();

    var paqueteDatos = {
        texto_requerimiento,
        texto_descripcion,
        texto_cantidad,
        texto_presupuesto,
    };

    $.ajax({
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/guardar_requerimiento",
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            var fecha = new Date();
            var codigo_requerimiento = respuestaServidor.codigo_requerimiento;

            // actualizamos el numero de requerimientos con el nuevo agregado recientemente
            $(".listado_requerimientos").attr("data-id", n_requerimientos + 1);
            var aux = "( " + (n_requerimientos + 1) + " )";
            $(".listado_requerimientos").text(aux);

            // agregamos la fila del nuevo requerimiento
            // LO Agregamos despues del cuerpo de la tabla (.cuerpo_filas), COMO HIJO (con "append")
            $(".cuerpo_filas").append(
                // usando acento grave y el ${} para las partes que deven cambiar

                `<tr class="fila_fila">
                <td
                    class="text-center numero_fila"
                    data-id="1"
                >1</td>

                <td>
                    <div style="min-width: 8em;">
                        ${fecha}
                    </div>
                </td>

                <td>
                    <div style="min-width: 8em;">
                        ${codigo_requerimiento}
                    </div>
                </td>

                <td>
                    <div style="min-width: 8em;">
                        ${texto_requerimiento}
                    </div>
                </td>

                <td>
                    <div style="min-width: 8em;">
                        ${texto_descripcion}
                    </div>
                </td>

                <td>
                    <div style="min-width: 8em;">
                        ${texto_cantidad}
                    </div>
                </td>

                <td>
                    <div style="min-width: 8em;">
                        ${texto_presupuesto}
                    </div>
                </td>

                <td>
                    <div class="d-flex">
                        <button
                            class="boton_fila_eliminar_req d-block btn p-1"
                            data-id="${codigo_requerimiento}"
                        ><i class="fas fa-window-close size_iconos"></i></button>
                    </div>
                </td>
            </tr>`
            );

            // actualizacion de los numeros de indices de la tabla
            let n_filas = $(".fila_fila").length;

            // "n_filas", aqui ya considera a la nueva fila de requerimiento agregado recientemente
            for (let j = 0; j < n_filas; j++) {
                $(".numero_fila")
                    .eq(j)
                    .text(j + 1);
            }

            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $("#id_guardar_requerimiento").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Requerimiento agregado!</strong>
                </div>`
            );

            // limpiamos los textareas
            $(".texto_requerimiento").val("");
            $(".texto_descripcion").val("");
            $(".texto_cantidad").val("");
            $(".texto_presupuesto").val("");
        }

        if (respuestaServidor.exito == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $("#id_guardar_requerimiento").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (respuestaServidor.exito == "denegado") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $("#id_guardar_requerimiento").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>El presente proyecto se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                </div>`
            );
        }
    });
});

// ---------------------------------------------------------------------------
// para "ELIMINAR LA FILA REQUERIMIENTO SELECCIONADO"
$(".madre_requerimiento").on("click", ".boton_fila_eliminar_req", function () {
    var codigo_requerimiento = $(this).attr("data-id");
    var codigo_proyecto = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    var paqueteDatos = {
        codigo_requerimiento,
    };

    $.ajax({
        url: "/laapirest/proyecto/" + codigo_proyecto + "/accion/eliminar_requerimiento",
        type: "DELETE",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            let n_filas = $(".fila_registro").length;

            // solo sera eliminado si existe mas de 1 fila, esto para mantener 1 fila como minimo que mantenga los botones que permitan agregar nuevas filas
            for (let i = 0; i < n_filas; i++) {
                let codigo_requerimiento_i = $(".boton_fila_eliminar_req").eq(i).attr("data-id");
                if (codigo_requerimiento_i == codigo_requerimiento) {
                    $(".fila_registro").eq(i).remove();
                    break;
                }
            }

            // actualizacion de los numero de indices de la tabla de requerimientos
            // "n_filas - 1", porque ahora se DISMINUYO EN una fila
            for (let j = 0; j < n_filas - 1; j++) {
                $(".numero_fila")
                    .eq(j)
                    .text(j + 1);
            }

            alert("Requerimiento eliminado exitosamente !");
        }

        if (respuestaServidor.exito == "no") {
            alert("Ocurrio un problema, intentelo nuevamente!");
        }

        if (respuestaServidor.exito == "denegado") {
            alert(
                "El presente proyecto se encuentra bloqueado, por tanto no es posible realizar cambios"
            );
        }
    });
});
