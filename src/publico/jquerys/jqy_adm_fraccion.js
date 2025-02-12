// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA ELIMINAR UNA FRACCION

$("#id_eliminar_fraccion").click(function (e) {
    var codigo_fraccion = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let usuario_maestro = $("#id_usuario_maestro").val();
    let clave_maestro = $("#id_clave_maestro").val();

    if (usuario_maestro == "" || clave_maestro == "") {
        $("#id_eliminar_fraccion").after(
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
            url: "/laapirest/fraccion/" + codigo_fraccion + "/accion/eliminar_fraccion",
            type: "DELETE",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            if (respuestaServidor.exito == "si") {
                alert("Fracción eliminado. Ahora usted sera redireccionado a la ventana principal");
                $("#id_ref_ventana_inicio").submit();
            }

            if (respuestaServidor.exito == "no") {
                $("#id_eliminar_fraccion").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>${respuestaServidor.mensaje}</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "no_maestro") {
                $("#id_eliminar_fraccion").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>${respuestaServidor.mensaje}</strong>
                    </div>`
                );
            }

            if (respuestaServidor.exito == "denegado") {
                $("#id_eliminar_fraccion").after(
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