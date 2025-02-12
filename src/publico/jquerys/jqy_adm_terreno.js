// TODO LO RELACIONADO AL TERRENO LADO ADMINISTRADOR
// ver como se transmite con el menu desplegable la ciudad elegida, sin usar input auxiliar
/* ************************************************************************************ */
// PARA GUARDAR DATOS FORMULARIO INICIAL PROYECTO

$("#guardar_descripcion_terreno").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("guardar_descripcion_terreno"));

    var codigo_terreno = $("#guardar_descripcion_terreno").attr("data-id");

    $.ajax({
        type: "post",
        url: "/laapirest/terreno/" + codigo_terreno + "/accion/guardar_descripcion",
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
                    <strong>El presente terreno se encuentra bloqueado, por tanto no es posible realizar cambios!</strong>
                </div>`
            );
        }
    });
});

/************************************************************************************* */
// GUARDAR ESTADO DE TERRENO

$("#guardar_estado_terreno").click(function (e) {
    var codigo_terreno = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    let estado_seleccionado = $(".contenedor_estados_terreno .radio_input_estado").val();
    let estado_anterior = $(".contenedor_estados_terreno .estado_anterior").val();

    var paqueteDatos = {
        estado_seleccionado,
        estado_anterior,
    };

    $.ajax({
        type: "POST",
        url: "/laapirest/terreno/" + codigo_terreno + "/accion/guardar_estado",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "si") {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "acceso_principal"

            $("#guardar_estado_terreno").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Estado del terreno guardado!</strong>
                </div>`
            );

            if (estado_seleccionado == "guardado") {
                var texto_estado = "Guardado";
            }
            if (estado_seleccionado == "reserva") {
                var texto_estado = "Reserva";
            }
            if (estado_seleccionado == "aprobacion") {
                var texto_estado = "Aprobación";
            }
            if (estado_seleccionado == "pago") {
                var texto_estado = "Pago";
            }
            if (estado_seleccionado == "construccion") {
                var texto_estado = "Construcción";
            }
            if (estado_seleccionado == "construido") {
                var texto_estado = "Construido";
            }

            $(".texto_estado_terreno").text(texto_estado);
        }

        if (respuestaServidor.exito == "no") {
            $("#guardar_estado_terreno").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                </div>`
            );
        }

        if (respuestaServidor.exito == "denegado") {
            $("#guardar_estado_terreno").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>El terreno presente se encuentra bloqueado, por tanto no es posible realizar cambios!</strong>
                </div>`
            );
        }
    });
});

/************************************************************************************* */
// para "BLOQUEO" o "DESBLOQUEO" de ACCESO al TERRENO

$("#guardar_bloqueo_desbloqueo_terreno").click(function (e) {
    var codigo_terreno = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    var $boton = $(this);
    let identificador_input = $boton.attr("data-boton_radio");
    let radio_seleccionado = $("." + identificador_input).val();

    let usuario_maestro = $("#id_usuario_maestro").val();
    let clave_maestro = $("#id_clave_maestro").val();

    if (usuario_maestro == "" || clave_maestro == "") {
        $("#guardar_bloqueo_desbloqueo_terreno").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Llene los campos de acceso maestro!</strong>
            </div>`
        );
    } else {
        var paqueteDatos = {
            radio_seleccionado,
            usuario_maestro,
            clave_maestro,
        };
        $.ajax({
            url: "/laapirest/terreno/" + codigo_terreno + "/accion/guardar_bloqueo_desbloqueo",
            type: "POST",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            if (respuestaServidor.exito == "si") {
                if (radio_seleccionado == "bloqueado") {
                    $("#guardar_bloqueo_desbloqueo_terreno").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El proyecto a sido BLOQUEADO, por favor refresque el navegador!</strong>
                        </div>`
                    );
                }
                if (radio_seleccionado == "desbloqueado") {
                    $("#guardar_bloqueo_desbloqueo_terreno").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El proyecto a sido DESBLOQUEADO, por favor refresque el navegador!</strong>
                        </div>`
                    );
                }
            }

            if (respuestaServidor.exito == "no") {
                $("#guardar_bloqueo_desbloqueo_terreno").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Proyecto no encontrado, refresque el navegador e intentelo nuevamente!</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "no_maestro") {
                $("#guardar_bloqueo_desbloqueo_terreno").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Los claves maestras de acceso son incorrectas, intentelo nuevamente!</strong>
                    </div>`
                );
            }

            // limpiesa de los campos de claves maestras
            $("#id_usuario_maestro").val("");
            $("#id_clave_maestro").val("");
        });
    }
});

/************************************************************************************* */
// para "ELIMINAR" el TERRENO

$("#eliminar_terreno").click(function (e) {
    var codigo_terreno = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let usuario_maestro = $("#id_usuario_maestro").val();
    let clave_maestro = $("#id_clave_maestro").val();

    if (usuario_maestro == "" || clave_maestro == "") {
        $("#eliminar_terreno").after(
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
            url: "/laapirest/terreno/" + codigo_terreno + "/accion/eliminar_terreno",
            type: "DELETE",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            if (respuestaServidor.exito == "si") {
                alert("Terreno eliminado. Ahora usted sera redireccionado a la ventana principal");
                // para pintar en el navegador e ir a la ventana de inicio
                $("#id_ref_ventana_inicio").submit();
            }

            if (respuestaServidor.exito == "no") {
                $("#eliminar_terreno").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Proyecto no encontrado, refresque el navegador e intentelo nuevamente!</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "no_maestro") {
                $("#eliminar_terreno").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Los claves maestras de acceso son incorrectas, intentelo nuevamente!</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "denegado") {
                alert(
                    "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios"
                );
            }

            // limpiesa de los campos de claves maestras
            $("#id_usuario_maestro").val("");
            $("#id_clave_maestro").val("");
        });
    }
});

/************************************************************************************* */
// PARA CREACION DE NUEVO PROYECTO DEL TERRENO

$("#creador_nuevo_proyecto").click(function (e) {
    var codigo_terreno = $("#creador_nuevo_proyecto").attr("data-id");
    var paqueteDatos = {
        codigo_terreno,
    };
    $.ajax({
        url: "/laapirest/administracion/general/accion/permiso_nuevo_proyecto",
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        if (respuestaServidor.exito == "libre") {
            // /laapirest/proyecto/:codigo_terreno
            var rutaServidor = "/laapirest/proyecto/" + codigo_terreno;
            $("#formulario_creador_proyecto").attr("action", rutaServidor);
            vemos = $("#formulario_creador_proyecto").attr("action");

            // IMPORTANTE, PORQUE LE INDICAMOS AL FORMULARIO QUE HAGA "submit", es decir que se dirija a la ruta que se le creo guardao en "rutaServidor" y que le agregamos como "attr" 'action'
            $("#formulario_creador_proyecto").submit();
        }

        if (respuestaServidor.exito == "lleno") {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "creador_nuevo_proyecto"

            $("#creador_nuevo_proyecto").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>El terreno no admite más Anteproyectos</strong>
                </div>`
            );
        }

        if (respuestaServidor.exito == "no") {
            $("#creador_nuevo_proyecto").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>¡Ocurrio un problema!, inténtelo nuevamente</strong>
                </div>`
            );
        }

        if (respuestaServidor.exito == "denegado") {
            $("#creador_nuevo_proyecto").after(
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

/************************************************************************************* */
// PARA CREAR FRACCIONES DE TERRENO

$("#crear_fracciones_terreno").click(function (e) {
    var codigo_terreno = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
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
            codigo_terreno,
            valor_fraccion,
            cantidad_fraccion,
        };

        $.ajax({
            url: "/laapirest/terreno/" + codigo_terreno + "/accion/crear_fracciones_terreno",
            type: "POST",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            if (respuestaServidor.exito == "si") {
                var arrayFraccionesCreadas = respuestaServidor.arrayFraccionesCreadas;

                if (arrayFraccionesCreadas.length > 0) {

                    for (let k = 0; k < arrayFraccionesCreadas.length; k++) {

                        let codigo_fraccion = arrayFraccionesCreadas[k].codigo_fraccion;
                        let fraccion_bs = arrayFraccionesCreadas[k].valor_fraccion;
                        let ganancia = arrayFraccionesCreadas[k].ganancia;
                        let dias_inversionista = arrayFraccionesCreadas[k].dias_inversionista;

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

                                        <div class="text-center">Inversionista</div>

                                        <div class="d-flex justify-content-between my-2">
                                            <div class="linea-v text-center w-50">
                                                <div>
                                                    <div class="h6">
                                                        <b>
                                                            <span>${ganancia}</span>
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
                                                            <span>${dias_inversionista}</span>
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

                // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "crear_fracciones_terreno"

                $("#crear_fracciones_terreno").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Fracciones de terreno creadas!</strong>
                        </div>`
                );
            }

            if (respuestaServidor.exito == "no") {
                $("#crear_fracciones_terreno").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Ocurrio un problema, intentelo nuevamente!</strong>
                        </div>`
                );
            }

            if (respuestaServidor.exito == "denegado") {
                $("#crear_fracciones_terreno").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El terreno se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                        </div>`
                );
            }

            if (respuestaServidor.exito == "no_fracciones") {
                $("#crear_fracciones_terreno").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Para la creacion de fracciones deberá primero eliminar todas las existentes.</strong>
                    </div>`
                );
            }

        });
    } else {
        $("#crear_fracciones_terreno").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Los campos deben ser valores numéricos enteros positivos</strong>
            </div>`
        );
    }
});
/************************************************************************************* */
