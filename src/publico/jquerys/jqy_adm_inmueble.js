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

/* *************************************************************************** */
// SI BIEN DICE "ELIMINAR", ESTE CONTROLADOR SOLO ELIMINARA TODA LA DOCUMENTACION PRIVADA QUE TIENE EL PROPIETARIO CON EL INMUEBLE Y CAMBIARA SU ESTADO DEL REGISTRO DE INVERSIONES DE "ACTIVO" A "PASIVO", ESTA INFORMACION SE MANTENDRA, PORQUE SE NECESITA CONTAR CON LOS PAGOS QUE HIZO EL PROPIETARIO EN EL INMUEBLE, HASTA QUE SEA COMPLETAMENTE REEMPLAZADO POR UN NUEVO PROPIETARIO ACTIVO

$(".contenido ").on("click", "#eliminar_propietario_inmueble", function () {
    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    //e.preventDefault(); // Cancelamos el evento por defecto del elemento

    let $seleccionado = $(this);
    var ci_propietario = $seleccionado.attr("data-ci");

    var codigo_inmueble = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    const respuestaEliminar = confirm("¿Desea agregar un nuevo propietario?");

    // si la respuesta es "true"
    if (respuestaEliminar) {
        var paqueteDatos = {
            codigo_inmueble,
            ci_propietario,
        };

        // ahora enviamos una peticion al servidor, un AJAX de tipo "delete"
        $.ajax({
            url: "/laapirest/inmueble/" + codigo_inmueble + "/accion/eliminar_propietario_inmueble",
            type: "POST",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            // ------- Para verificación -------
            //console.log("los datos de respuesta del servidor");
            //console.log(respuestaServidor);

            var tipoRespuesta = respuestaServidor.exito;

            if (tipoRespuesta == "si") {
                alert("Se procedera a recargar la actual ventana");
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
    var paqueteDatos = {
        nuevo_estado,
        inversion,
        periodo,
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

/**************************************************************************** */
// PARA CREAR FRACCIONES DE INMUEBLE

$("#crear_fracciones_inmueble").click(function (e) {
    var codigo_inmueble = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let valor_fraccion = $("#label_valor_fraccion").val();
    let cantidad_fraccion = $("#label_cantidad_fraccion").val();

    var esEnteroPositivo_1 = /^[1-9]\d*$/.test(valor_fraccion);
    var esEnteroPositivo_2 = /^[1-9]\d*$/.test(cantidad_fraccion);

    if (
        esEnteroPositivo_1 !== "" &&
        esEnteroPositivo_2 !== "" &&
        esEnteroPositivo_1 &&
        esEnteroPositivo_2
    ) {
        // verificamos si valor_fraccion y cantidad_fraccion no sean vacios y que sean numeros enteros positivos

        var paqueteDatos = {
            codigo_inmueble,
            valor_fraccion,
            cantidad_fraccion,
        };

        $.ajax({
            url: "/laapirest/inmueble/" + codigo_inmueble + "/accion/crear_fracciones_inmueble",
            type: "POST",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            if (respuestaServidor.exito == "si") {
                var arrayFraccionesCreadas = respuestaServidor.arrayFraccionesCreadas;

                if (arrayFraccionesCreadas.length > 0) {

                    for (let k = 0; k < arrayFraccionesCreadas.length; k++) {

                        let codigo_fraccion = arrayFraccionesCreadas[k].codigo_fraccion;
                        let fraccion_bs = arrayFraccionesCreadas[k].valor_fraccion;
                        let plusvalia = arrayFraccionesCreadas[k].plusvalia;
                        let dias_plusvalia = arrayFraccionesCreadas[k].dias_plusvalia;

                        // procedemos a renderizar las fracciones de inmueble recientemente creadas.

                        // con AFTER lO Agregamos despues del titulo y al mismo nivel que este (no como hijo)
                        $(".contenedor_titulo_fracciones").after(
                            // usando acento grave y el ${} para las partes que deven cambiar
                            // estructura html basada en "adm_cli_fraccion.hbs". AQUI ESTARA CON EL BOTON ELIMINAR PORQUE ESTA SIENDO CREADO DESDE CUENTA DE UN ADMINISTRADOR
                            `
                            <div class="card_un_fraccion mb-3 col-12 col-sm-6 col-md-4 col-lg-3">

                                <div class="card">

                                    <div class="card-body">

                                        <div class="text-center mb-2" title="Código fracción de terreno">
                                            <span class="h6"><b>Disponible</b></span>
                                        </div>

                                        <div class="text-center mb-2" title="Valor fracción de terreno">
                                            <span class="h6"><b>${fraccion_bs}</b></span>
                                            <span class="h6"><b>$us</b></span>
                                        </div>

                                        <div class="linea-x"></div>

                                        <div class="text-center">Copropietario</div>

                                        <div class="d-flex justify-content-between my-2">
                                            <div class="linea-v text-center w-50">
                                                <div>
                                                    <div class="h6">
                                                        <b>
                                                            <span>${plusvalia}</span>
                                                            <span>$us</span>
                                                        </b>
                                                    </div>
                                                </div>

                                                <div class="mb-1">
                                                    <span class="h6">Ganancia</span>
                                                </div>
                                            </div>

                                            <div class="text-center w-50">
                                                <div>
                                                    <div class="h6">
                                                        <b>
                                                            <span>${dias_plusvalia}</span>
                                                            <span>Días</span>
                                                        </b>
                                                    </div>
                                                </div>

                                                <div class="mb-1">
                                                    <span class="h6">Duración</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                            `
                        );
                    } // fin for
                }

                // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "crear_fracciones_inmueble"

                $("#crear_fracciones_inmueble").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Fracciones de inmueble creadas!</strong>
                        </div>`
                );
            }

            if (respuestaServidor.exito == "no") {
                $("#crear_fracciones_inmueble").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                        </div>`
                );
            }

            if (respuestaServidor.exito == "denegado") {
                $("#crear_fracciones_inmueble").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El inmueble presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                        </div>`
                );
            }

            if (respuestaServidor.exito == "no_fracciones") {
                $("#crear_fracciones_inmueble").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>El inmueble no pertenece a la clase FRACCIONADO, por tanto esta impedido en la creacion de fracciones.</strong>
                    </div>`
                );
            }
        });
    } else {
        $("#crear_fracciones_inmueble").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Los campos deben ser valores numéricos enteros positivos</strong>
            </div>`
        );
    }
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
