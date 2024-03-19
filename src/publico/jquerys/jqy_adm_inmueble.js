// TODA LA LOGICA REFERENTE AL INMUEBLE DESDE EL ADMINISTRADOR DE LA APLICACION
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA GUARDAR LOS DATOS DEL FORMULARIO INICIAL DEL INMUEBLE

$("#guardar_datos_formulario_inmueble").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(
        document.getElementById("guardar_datos_formulario_inmueble")
    );

    var codigoInmueble = $("#guardar_datos_formulario_inmueble").attr("data-id");

    //console.log(codigoInmueble);

    $.ajax({
        type: "post",
        url: "/laapirest/inmueble/" + codigoInmueble + "/accion/guardar_descripcion",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".boton_guardar_inmueble").after(
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
            $(".boton_guardar_inmueble").after(
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
                "El inmueble presente se encuentra bloqueado, por tanto no es posible realizar cambios"
            );
        }
    });
});

/**************************************************************************** */

/* *************************************************************************** */
// AL MOMENTO DE HACER CLICK EN "ELIMINAR" PROPIETARIO, PERTENECE A "INMUEBLE"

// esta instruccion con "on", permite eliminar cualquier PROPIETARIO seleccionada, incluso aquellos que se subieron e inmediatamente se desea eliminarlas
$(".contenido ").on("click", "#eliminar_datos_pagos_propietario", function () {
    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    //e.preventDefault(); // Cancelamos el evento por defecto del elemento

    let $seleccionado = $(this);
    var ci_propietario = $seleccionado.attr("data-ci");

    var codigo_inmueble = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    /*
    alert("el propietario a eliminar es (solo ci): " + ci_propietario);
    alert(
        "el propietario a eliminar es ( ci con toString y length ): " +
            ci_propietario.toString().length
    );
    */

    if (ci_propietario.toString().length != 0) {
        const respuestaEliminar = confirm("¿Desea eliminar al propietario? " + ci_propietario);

        // si la respuesta es "true"
        if (respuestaEliminar) {
            var paqueteDatos = {
                codigo_inmueble,
                ci_propietario,
            };

            // ahora enviamos una peticion al servidor, un AJAX de tipo "delete"
            $.ajax({
                url:
                    "/laapirest/inmueble/" +
                    codigo_inmueble +
                    "/accion/eliminar_propietario_inmueble",
                type: "DELETE",
                data: paqueteDatos,
            }).done(function (respuestaServidor) {
                // ------- Para verificación -------
                //console.log("los datos de respuesta del servidor");
                //console.log(respuestaServidor);

                var tipoRespuesta = respuestaServidor.exito;

                if (tipoRespuesta == "si") {
                    alert("El propietario fue eliminado, se procedera a recargar la actual ventana");
                    // usamos el metodo DE RECARGAR/ACTUALIZAR LA PAGINA, porque asi no sera necesario borrar uno por uno los inputs de dotos y los inputs de tablas
                    location.reload();
                }

                if (tipoRespuesta == "no") {
                    // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                        </div>`
                    );
                }

                if (tipoRespuesta == "denegado") {
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El inmueble presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                    </div>`
                    );
                }
            });
        }
    } else {
        // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
        $(".ref_boton_datos_pagos_propietario").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Debe seleccionar un Propietario de la lista</strong>
            </div>`
        );
        alert("recargamos la ventan actual");
        location.reload();
    }
});

/**************************************************************************** */
// DIRIGIRSE A LA PAGINA DEL INVERSOR DEL PRESENTE INMUEBLE
/*
$(".contenedor_inversionista").on("click", ".ir_azul", function () {
    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    //e.preventDefault(); // Cancelamos el evento por defecto del elemento
    let $seleccionado = $(this);
    var ciInversionista = $seleccionado.attr("data-id");
    var paqueteDatos = {
        ciInversionista,
    };
    $.ajax({
        url: "/laapirest/inversor",
        type: "get",
        data: paqueteDatos,
    });
});
*/

/**************************************************************************** */
// AL MOMENTO DE HACER CLICK EN el boton de CERRAR LA VENTANA MODAL

$(".close").click(function (e) {
    // SERA SOLO PARA DEJAR LIMPIO EL INPUT DONDE SE INGRESA EL CI DEL INVERSIONISTA
    $("#idCedulaIdentidad").val("");
});

/**************************************************************************** */
// AL MOMENTO DE HACER CLICK EN BOTON DE "GUARDAR ESTADO INMUEBLE"

$("#guardar_estado_inmueble").click(function (e) {
    // **OK
    var codigo_inmueble = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let nuevo_estado = $(".radio_input_estado").val();
    let inversion = $("#a_inversion_estado").val();
    let periodo = $("#a_periodo_estado").val();
    var paqueteDatos = {
        nuevo_estado,
        inversion,
        periodo
    };

    $.ajax({
        url: "/laapirest/inmueble/" + codigo_inmueble + "/accion/guardar_estado_inmueble",
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "acceso_principal"

            $("#guardar_estado_inmueble").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Estado del inmueble guardado!</strong>
                    </div>`
            );
        }

        if (respuestaServidor.exito == "no") {
            $("#guardar_estado_inmueble").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                    </div>`
            );
        }

        if (respuestaServidor.exito == "denegado") {
            $("#guardar_estado_inmueble").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El inmueble presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                    </div>`
            );
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA ELIMINAR UN INMUEBLE

$("#id_eliminar_inmueble").click(function (e) {
    var codigo_inmueble = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let usuario_maestro = $("#id_usuario_maestro").val();
    let clave_maestro = $("#id_clave_maestro").val();

    if (usuario_maestro == "" || clave_maestro == "") {
        $("#id_eliminar_inmueble").after(
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
            url: "/laapirest/inmueble/" + codigo_inmueble + "/accion/eliminar_inmueble",
            type: "DELETE",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            if (respuestaServidor.exito == "si") {
                alert("Inmueble eliminado. Ahora usted sera redireccionado a la ventana principal");
                $("#id_ref_ventana_inicio").submit();
            }

            if (respuestaServidor.exito == "no") {
                $("#id_eliminar_inmueble").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>${respuestaServidor.mensaje}</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "no_maestro") {
                $("#id_eliminar_inmueble").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>${respuestaServidor.mensaje}</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "denegado") {
                $("#id_eliminar_inmueble").after(
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
