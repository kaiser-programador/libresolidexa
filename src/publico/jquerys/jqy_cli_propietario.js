// toda la logica del PROPIETARIO lado CLIENTE
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA CAMBIAR LAS CLAVES DEL PROPIETARIO

$("#form_cambiar_claves_inversor").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    $("#form_cambiar_claves_inversor .alert").remove();

    let nue_clave_1 = $("#form_cambiar_claves_inversor #id_nue_clave_1").val();
    let nue_clave_2 = $("#form_cambiar_claves_inversor #id_nue_clave_2").val();

    if (nue_clave_1 == nue_clave_2) {
        var datosFormulario = new FormData(document.getElementById("form_cambiar_claves_inversor"));
        $.ajax({
            type: "post",
            url: "/inversor/operacion/cambiar-claves",
            data: datosFormulario,
            //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
            cache: false,
            contentType: false,
            processData: false,
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;
            if (tipoRespuesta == "si") {
                $("#form_cambiar_claves_inversor .ref_boton_inversor").after(
                    `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Nuevas claves de acceso cambiadas</strong>
                    </div>`
                );

                $("#form_cambiar_claves_inversor .ref_limpiar_inputs").val("");
            }
            if (tipoRespuesta == "no") {
                $("#form_cambiar_claves_inversor .ref_boton_inversor").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Claves de acceso incorrectas!</strong>
                    </div>`
                );
            }

            if (tipoRespuesta == "maestro denegado") {
                $("#form_cambiar_claves_inversor .ref_boton_inversor").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>La contraseña actual es incorrecta</strong>
                    </div>`
                );
            }

            if (tipoRespuesta == "cambie_usuario") {
                $("#form_cambiar_claves_inversor .ref_boton_inversor").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El nombre de usuario NUEVO que intenta registrar YA EXISTE, por favor utilize uno diferente</strong>
                    </div>`
                );
            }
        });
    } else {
        $("#form_cambiar_claves_inversor .ref_boton_inversor").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>ERROR, Las nuevas contraseñas NO SON IGUALES</strong>
            </div>`
        );
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA GUARDAR O DES-GUARDAR UN INMUEBLE

// ventana propietario, propiedades
// ventana propietario, guardados
// ventana resultados busqueda
// ventana proyecto, inmuebles

$("#contenedor_py_inm_render").on("click", ".guardar_si_no", function (e) {
    //e.preventDefault(); // deve estar desabilitado cuando se usa ".on"

    /*
    Inicialmente la pagina se carga sin cards inmuebles renderizados, pero con jquery haciendo "click()" se renderizan, pero aun no son reconocidos en el DOM HTML, es por ello que se usa al PADRE CONTENEDOR "#contenedor_py_inm_render" con el metodo ".on". de no usarlo no tendria ningun efecto hacer click desde el navegador en el ".guardar_si_no"
    */

    var n_inmuebles = $("#contenedor_py_inm_render .guardar_si_no").length;

    let estado_guardado = $(this).attr("estado");
    let codigo_inmueble = $(this).attr("data-id");

    var paqueteDatos = {
        estado_guardado,
        codigo_inmueble,
    };

    $.ajax({
        url: "/inversor/operacion/guardar-inmueble", // esta ruta puede guardar o des-guardar el inmueble seleccionado
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            for (let i = 0; i < n_inmuebles; i++) {
                let codigo_inm_for = $("#contenedor_py_inm_render .guardar_si_no")
                    .eq(i)
                    .attr("data-id");
                if (codigo_inm_for == codigo_inmueble) {
                    // encontramos al inmueble sobre el que se hizo click en su icono de guardar

                    if (estado_guardado == "si_guardado") {
                        // significa que el inmueble pasara a ser "no_guardado"
                        $("#contenedor_py_inm_render .guardar_si_no")
                            .eq(i)
                            .attr("estado", "no_guardado");

                        /* SIRVE
                        $("#contenedor_py_inm_render .guardar_si_no a").eq(1).children('i').removeClass('estilo_colorido');
                        $("#contenedor_py_inm_render .guardar_si_no a").eq(1).children('i').addClass('estilo_gris');
                        */
                        $("#contenedor_py_inm_render .guardar_si_no a i")
                            .eq(i)
                            .removeClass("estilo_colorido");
                        $("#contenedor_py_inm_render .guardar_si_no a i")
                            .eq(i)
                            .addClass("estilo_gris");
                    }

                    if (estado_guardado == "no_guardado") {
                        // significa que el inmueble pasara a ser "si_guardado"
                        $("#contenedor_py_inm_render .guardar_si_no")
                            .eq(i)
                            .attr("estado", "si_guardado");

                        /*   SIRVE
                            $("#contenedor_py_inm_render .guardar_si_no a").eq(1).children('i').removeClass('estilo_gris');
                            $("#contenedor_py_inm_render .guardar_si_no a").eq(1).children('i').addClass('estilo_colorido');
                        */
                        $("#contenedor_py_inm_render .guardar_si_no a i")
                            .eq(i)
                            .removeClass("estilo_gris");
                        $("#contenedor_py_inm_render .guardar_si_no a i")
                            .eq(i)
                            .addClass("estilo_colorido");
                    }

                    break; // salimos del bucle for
                }
            } // for

            // PARA EJECUTARSE EN AQUELLAS VENTANAS DONDE ADEMAS DE INMUEBLES RENDER EXISTEN INMUEBLES OCULTOS "TODOS" COMO EN LAS VENTANAS DE: INMUELBES DENTRO DE PROYECTO, INMUEBLES DENTRO DE PROPIETARIO, INMUEBLES GUARDADOS DENTRO DE PROPIETARIO

            // ESTE FOR ES PARA CAMBIAR EL ESTADO DE GUARDADO_SI_NO  DEL CONTENEDOR DE "TODOS", esto para que se vean el color de los iconos correctamente cuando se ORDENEN los inmuebles
            var n_inmuebles_todos = $("#contenedor_py_inm_todos .guardar_si_no").length;

            if (n_inmuebles_todos > 0 || n_inmuebles_todos != undefined) {
                for (let i = 0; i < n_inmuebles_todos; i++) {
                    let codigo_inm_for = $("#contenedor_py_inm_todos .guardar_si_no")
                        .eq(i)
                        .attr("data-id");
                    if (codigo_inm_for == codigo_inmueble) {
                        if (estado_guardado == "si_guardado") {
                            // significa que el inmueble pasara a ser "no_guardado"
                            $("#contenedor_py_inm_todos .guardar_si_no")
                                .eq(i)
                                .attr("estado", "no_guardado");
                            $("#contenedor_py_inm_todos .guardar_si_no a i")
                                .eq(i)
                                .removeClass("estilo_colorido");
                            $("#contenedor_py_inm_todos .guardar_si_no a i")
                                .eq(i)
                                .addClass("estilo_gris");
                        }

                        if (estado_guardado == "no_guardado") {
                            // significa que el inmueble pasara a ser "si_guardado"
                            $("#contenedor_py_inm_todos .guardar_si_no")
                                .eq(i)
                                .attr("estado", "si_guardado");
                            $("#contenedor_py_inm_todos .guardar_si_no a i")
                                .eq(i)
                                .removeClass("estilo_gris");
                            $("#contenedor_py_inm_todos .guardar_si_no a i")
                                .eq(i)
                                .addClass("estilo_colorido");
                        }

                        break; // salimos del bucle for
                    }
                }
            }
        } else {
            alert("Ocurrio un problema, intentelo nuevamente");
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA GUARDAR O DES-GUARDAR UN INMUEBLE
// VENTANA INVERSOR ----> GUARDADOS

$("#contenedor_inm_guardados_render").on("click", ".guardar_si_no", function (e) {
    //e.preventDefault(); // deve estar desabilitado cuando se usa ".on"

    var n_inmuebles = $("#contenedor_inm_guardados_render .guardar_si_no").length;

    let estado_guardado = $(this).attr("data-estado");
    let codigo_inmueble = $(this).attr("data-id");

    var paqueteDatos = {
        estado_guardado,
        codigo_inmueble,
    };

    $.ajax({
        url: "/inversor/operacion/guardar-inmueble", // esta ruta puede guardar o des-guardar el inmueble seleccionado
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            for (let i = 0; i < n_inmuebles; i++) {
                let codigo_inm_for = $("#contenedor_inm_guardados_render .guardar_si_no")
                    .eq(i)
                    .attr("data-id");
                if (codigo_inm_for == codigo_inmueble) {
                    // encontramos al inmueble sobre el que se hizo click en su icono de guardar

                    if (estado_guardado == "si_guardado") {
                        // el inmueble donde se hizo click, sera eliminado de esta ventana
                        $("#contenedor_inm_guardados_render .card_un_inm_py").eq(i).remove();
                    }

                    /* NO SE CONSIDERA "no_guardado", PORQUE EN ESTA VENTANA SOLO EXISTEN LOS GUARDADOS Y SI SON DES-GUARDADOS, SERAN ELIMIANDOS DE ESTA VENTANA
                    
                    */
                    break; // salimos del bucle for
                }
            }
        } else {
            alert("Ocurrio un problema, intentelo nuevamente");
        }
    });
});
