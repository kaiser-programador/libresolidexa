// TODA LA LOGICA REFERENTE AL INVERSIONISTA DESDE EL ADMINISTRADOR DE LA APLICACION

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SELECTOR DE CIUDAD, PERTENECE A "PROYECTO"
/*
$("#selector_ciudad_inversor").change(function () {
    //alert('entramos a seleccionar');
    var seleccionado = $(this).val();

    //var seleccionado2 = $('#mostrador_ciudad').text(seleccionado);
    $("#id_inversor_departamento").val(seleccionado);
});
*/
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#guardar_datos_inversor").click(function (e) {
    let paquete_datos = {
        inversor_nombres: $("#id_inversor_nombres").val(),
        inversor_apellidos: $("#id_inversor_apellidos").val(),
        inversor_ci: $("#id_inversor_ci").text(),
        inversor_ocupacion: $("#id_inversor_ocupacion").val(),
        //inversor_departamento: $("#id_inversor_departamento").val(),
        inversor_provincia: $("#id_inversor_provincia").val(),
        inversor_domicilio: $("#id_inversor_domicilio").val(),
        inversor_telefonos: $("#id_inversor_telefonos").val(),
        inversor_nacimiento: $("#id_inversor_nacimiento").val(),
    };

    $.ajax({
        // url: '/laapirest/guardar_datos_inversor',
        url: "/laapirest/inversor/guardar_datos_inversor",
        type: "POST",
        data: paquete_datos,
    }).done(function (respuestaServidor) {
        var tipo_respuesta = respuestaServidor.mensaje;

        if (tipo_respuesta == "exito") {
            // se creara el mensaje que se mostrara, despues del boton de "Guardar"

            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".boton_referencia"

            $(".boton_referencia").after(
                `<div class="alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Datos guardados</strong>
                    </div>`
            );
        } else {
            $(".boton_referencia").after(
                `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Hubo un problema, intentelo nuevamente!</strong>
                    </div>`
            );
        }
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// cuando el PROPIETARIO OLVIDA SUS CLAVES DE ACCESO, ENTONCES SE LE DARA SUS NUEVAS CLAVES POR DEFECTO (CI, FECHA DE NACIMIENTO) DESDE EL LADO DEL ADMINISTRADOR CON LAS LLAVES ADM MAESTRO
$("#generar_nuevas_claves_inversor").click(function (e) {
    let usuario_maestro = $("#id_usuario_maestro").val();
    let clave_maestro = $("#id_clave_maestro").val();

    if (usuario_maestro != "" && clave_maestro != "") {
        let paquete_datos = {
            usuario_maestro,
            clave_maestro,
            ci_inversionista: $("#ci_propietario_reclaves").attr("data-ci"),
        };

        $.ajax({
            url: "/laapirest/inversor/nuevas_claves",
            type: "POST",
            data: paquete_datos,
        }).done(function (respuestaServidor) {
            var tipo_respuesta = respuestaServidor.mensaje;

            if (tipo_respuesta == "exito") {
                $(".referencia_2").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Nuevas claves de acceso:</strong>
                            <br>
                            Usuario: <strong>${respuestaServidor.usuario}</strong>
                            <br>
                            Clave: <strong>${respuestaServidor.clave}</strong>
                        </div>`
                );
            }

            if (tipo_respuesta == "ci denegado") {
                $(".referencia_2").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El C.I. del inversionista es incorrecto, intentelo nuevamente</strong>
                        </div>`
                );
            }

            if (tipo_respuesta == "maestro denegado") {
                $(".referencia_2").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Los datos de acceso MAESTRO son incorrectos, intentelo nuevamente</strong>
                        </div>`
                );
            }
            $("#id_usuario_maestro").val("");
            $("#id_clave_maestro").val("");
        });
    } else {
        $(".referencia_2").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Llene todos los campos de acceso MAESTRO</strong>
            </div>`
        );
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
