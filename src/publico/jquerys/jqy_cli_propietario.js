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

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA ADQUIRIR FRACCIONES DE INMUEBLE EMPLEANDO FRACCIONES DE TERRENO

$("#adquirir_frac_inm").click(function (e) {
    // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton "#adquirir_frac_inm"
    $("#adquirir_frac_inm").after(
        `<div class="alerta_i alert alert-success mt-3">
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
            <p class="text-left">Por favor espere...
            </p>
        </div>`
    );

    let f_vender_val = Number($("#f_vender_val").attr("data-f_vender_val")); // Bs

    if (f_vender_val > 0) {
        let paqueteDatos = {
            codigo_inmueble,
            f_vender_val,
        };
        // entramos a la ruta de servidor
        $.ajax({
            url: "/propietario/accion/adquirir_fraccion_inm",
            type: "POST",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            // ------- Para verificación -------
            //console.log("la respuesta del servidor");
            //console.log(respuestaServidor);

            var exito = respuestaServidor.exito;

            if (exito === "si") {
                let array_card_fracciones = respuestaServidor.array_card_fracciones;

                let precio_justo_inm = Number($(".precio_justo_inm").attr("data-precio_justo_inm"));

                let f_vender_n = Number($("#f_vender_n").attr("data-f_vender_n"));

                let c_ft_d_n = Number($(".c_ft_d_n").attr("data-c_ft_d_n")); //
                let c_ft_d_val = Number($(".c_ft_d_val").attr("data-c_ft_d_val")); //
                let c_fti_a_n = Number($(".c_fti_a_n").attr("data-c_fti_a_n")); //
                let c_fti_a_val = Number($(".c_fti_a_val").attr("data-c_fti_a_val")); //
                let ti_f_val = Number($(".ti_f_val").attr("data-ti_f_val")); //
                let ti_f_d_n = Number($(".ti_f_d_n").attr("data-ti_f_d_n")); //
                let ti_f_d_val = Number($(".ti_f_d_val").attr("data-ti_f_d_val")); //

                //----------------------------------------
                // actualizando los valores en funcion de las fracciones de inmueble que el usuario acaba de adquirir

                let aux_c_ft_d_n = c_ft_d_n - f_vender_n;
                let aux_c_ft_d_n_render = numero_punto_coma_query(aux_c_ft_d_n);
                $(".c_ft_d_n").attr("data-c_ft_d_n", aux_c_ft_d_n);
                $(".c_ft_d_n").text(aux_c_ft_d_n_render);

                let aux_c_ft_d_val = c_ft_d_val - f_vender_val;
                let aux_c_ft_d_val_render = numero_punto_coma_query(aux_c_ft_d_val);
                $(".c_ft_d_val").attr("data-c_ft_d_val", aux_c_ft_d_val);
                $(".c_ft_d_val").text(aux_c_ft_d_val_render);

                let aux_c_fti_a_n = c_fti_a_n + f_vender_n;
                let aux_c_fti_a_n_render = numero_punto_coma_query(aux_c_fti_a_n);
                $(".c_fti_a_n").attr("data-c_fti_a_n", aux_c_fti_a_n);
                $(".c_fti_a_n").text(aux_c_fti_a_n_render);

                let aux_c_fti_a_val = c_fti_a_val + f_vender_val;
                let aux_c_fti_a_val_render = numero_punto_coma_query(aux_c_fti_a_val);
                $(".c_fti_a_val").attr("data-c_fti_a_val", aux_c_fti_a_val);
                $(".c_fti_a_val").text(aux_c_fti_a_val_render);

                let aux_ti_f_val = ti_f_val + f_vender_val;
                let aux_ti_f_val_render = numero_punto_coma_query(aux_ti_f_val);
                $(".ti_f_val").attr("data-ti_f_val", aux_ti_f_val);
                $(".ti_f_val").text(aux_ti_f_val_render);

                let string_p_participacion = ((aux_c_fti_a_val / precio_justo_inm) * 100).toFixed(
                    2
                );
                let p_participacion = Number(string_p_participacion); // numerico con 2 decimales
                let f_p_propietario_render = numero_punto_coma_query(p_participacion); // string con coma decimal
                $(".c_fti_a_p").text(f_p_propietario_render);

                let string_p_financiamiento = ((aux_ti_f_val / precio_justo_inm) * 100).toFixed(2);
                let p_financiamiento = Number(string_p_financiamiento); // numerico con 2 decimales
                let f_p_inm_render = numero_punto_coma_query(p_financiamiento); // string con coma decimal
                $(".ti_f_p").text(f_p_inm_render);

                let aux_ti_f_d_n = ti_f_d_n - f_vender_n;
                let aux_ti_f_d_n_render = numero_punto_coma_query(aux_ti_f_d_n);
                $(".ti_f_d_n").attr("data-ti_f_d_n", aux_ti_f_d_n);
                $(".ti_f_d_n").text(aux_ti_f_d_n_render);

                let aux_ti_f_d_val = ti_f_d_val - f_vender_val;
                let aux_ti_f_d_val_render = numero_punto_coma_query(aux_ti_f_d_val);
                $(".ti_f_d_val").attr("data-ti_f_d_val", aux_ti_f_d_val);
                $(".ti_f_d_val").text(aux_ti_f_d_val_render);

                //----------------------------------------
                // renderizado de card fracciones adquiridas

                for (let i = 0; i < array_card_fracciones.length; i++) {
                    let codigo_fraccion = array_card_fracciones[i].codigo_fraccion;
                    let fraccion_bs = array_card_fracciones[i].fraccion_bs;
                    let fraccion_bs_render = array_card_fracciones[i].fraccion_bs_render;
                    let ganancia_bs = array_card_fracciones[i].ganancia_bs;
                    let ganancia_bs_render = array_card_fracciones[i].ganancia_bs_render;
                    let plusvalia_bs = array_card_fracciones[i].plusvalia_bs;
                    let plusvalia_bs_render = array_card_fracciones[i].plusvalia_bs_render;
                    let existe_inversionista = array_card_fracciones[i].existe_inversionista;
                    let existe_copropietario = array_card_fracciones[i].existe_copropietario;
                    let menor_igual = array_card_fracciones[i].menor_igual;
                    let verde = array_card_fracciones[i].verde;
                    let gris = array_card_fracciones[i].gris;
                    let azul = array_card_fracciones[i].azul;
                    let dias_plusvalia = array_card_fracciones[i].dias_plusvalia;
                    let dias_inversionista = array_card_fracciones[i].dias_inversionista;

                    // AQUI RENDERIZAR CONFORME AL FORMTAO HTML DEL CARD DE FRACCIONES INMUEBLE

                    // con AFTER lO Agregamos despues del titulo y al mismo nivel que este (no como hijo)
                    $(".contenedor_titulo_fracciones").after(
                        `
                        <div class="card_un_fraccion mb-3 col-12 col-sm-6 col-md-4 col-lg-3">
                            <div class="card">
                                <div class="card-body">
                                    <div class="text-center mb-2">
                                        <a href="laapirest/fraccion/${codigo_fraccion}/descripcion">
                                            <span class="h6"><b>${codigo_fraccion}</b></span>
                                        </a>
                                    </div>

                                    <div class="text-center mb-2" title="Valor fracción de terreno">
                                        <span class="h6"><b class="elvalor" data-bs="${fraccion_bs}">${fraccion_bs_render}</b></span>
                                        <span class="h6"><b class="lamoneda">Bs</b></span>
                                    </div>

                                    <div class="linea-x"></div>
                                    <div class="text-center">Copropietario</div>
                                    <div class="d-flex justify-content-between my-2">
                                        <div class="linea-v text-center w-50">
                                            <div>
                                                <div class="h6">
                                                    <b>
                                                        <span class="elvalor" data-bs="${plusvalia_bs}">${plusvalia_bs_render}</span>
                                                        <span class="lamoneda">Bs</span>
                                                    </b>
                                                </div>
                                            </div>

                                            <div class="mb-1">
                                                <span class="h6">Plusvalía</span>
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
                }

                //----------------------------------------
                // llevando a cantidades por defecto

                $("#f_vender_n").attr("data-f_vender_n", 0);
                $("#f_vender_n").text(0);
                $("#f_vender_val").attr("data-f_vender_val", 0);
                $("#f_vender_val").text(0);
                //----------------------------------------

                $(".alerta_i").remove(); // eliminamos todos los alert que puedan existir
                // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton "#adquirir_frac_inm"
                $("#adquirir_frac_inm").after(
                    `<div class="alerta_i alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <p class="text-left">
                            Fracciones de inmueble adquiridas con exito.
                        </p>
                    </div>`
                );
            } else {
                $(".alerta_i").remove(); // eliminamos todos los alert que puedan existir
                let mensaje = respuestaServidor.mensaje;
                // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton "#adquirir_frac_inm"
                $("#adquirir_frac_inm").after(
                    `<div class="alerta_i alert alert-success mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <p class="text-left">
                            ${mensaje}
                        </p>
                    </div>`
                );
            }
        });
    } else {
        $(".alerta_i").remove(); // eliminamos todos los alert que puedan existir
        // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton "#adquirir_frac_inm"
        $("#adquirir_frac_inm").after(
            `<div class="alerta_i alert alert-danger mt-3">
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
            <p class="text-left">
                Debe especificar la cantidad de fracciones de inmueble que desea adquirir.
            </p>
        </div>`
        );
    }
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA DESHACER FRACCIONES DE INMUEBLE ADQUIRIDAS CON FRACCIONES DE TERRENO

$("#deshacer_frac_inm").click(function (e) {
    // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton "#deshacer_frac_inm"
    $("#deshacer_frac_inm").after(
        `<div class="alerta_i alert alert-success mt-3">
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
            <p class="text-left">Por favor espere...
            </p>
        </div>`
    );

    let paqueteDatos = {
        codigo_inmueble,
    };
    // entramos a la ruta de servidor
    $.ajax({
        url: "/propietario/accion/deshacer_fraccion_inm",
        type: "POST",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        // ------- Para verificación -------
        //console.log("la respuesta del servidor");
        //console.log(respuestaServidor);

        var exito = respuestaServidor.exito;

        if (exito === "si") {

            let c_ft_d_n = respuestaServidor.c_ft_d_n;
            let c_ft_d_n_render = respuestaServidor.c_ft_d_n_render;
            let c_ft_d_val = respuestaServidor.c_ft_d_val;
            let c_ft_d_val_render = respuestaServidor.c_ft_d_val_render;
            let c_fti_a_n = respuestaServidor.c_fti_a_n;
            let c_fti_a_n_render = respuestaServidor.c_fti_a_n_render;
            let c_fti_a_val = respuestaServidor.c_fti_a_val;
            let c_fti_a_val_render = respuestaServidor.c_fti_a_val_render;
            let c_fti_a_p = respuestaServidor.c_fti_a_p;
            let c_fti_a_p_render = respuestaServidor.c_fti_a_p_render;
            let ti_f_p_render = respuestaServidor.ti_f_p_render;
            let ti_f_val = respuestaServidor.ti_f_val;
            let ti_f_val_render = respuestaServidor.ti_f_val_render;
            let ti_f_d_n = respuestaServidor.ti_f_d_n;
            let ti_f_d_n_render = respuestaServidor.ti_f_d_n_render;
            let ti_f_d_val = respuestaServidor.ti_f_d_val;
            let ti_f_d_val_render = respuestaServidor.ti_f_d_val_render;

            //----------------------------------------
            // actualizando los valores en funcion de las fracciones de inmueble que el usuario acaba de adquirir

            $(".c_ft_d_n").attr("data-c_ft_d_n", c_ft_d_n);
            $(".c_ft_d_n").text(c_ft_d_n_render);

            $(".c_ft_d_val").attr("data-c_ft_d_val", c_ft_d_val);
            $(".c_ft_d_val").text(c_ft_d_val_render);

            $(".c_fti_a_n").attr("data-c_fti_a_n", c_fti_a_n);
            $(".c_fti_a_n").text(c_fti_a_n_render);

            $(".c_fti_a_val").attr("data-c_fti_a_val", c_fti_a_val);
            $(".c_fti_a_val").text(c_fti_a_val_render);

            $(".ti_f_val").attr("data-ti_f_val", ti_f_val);
            $(".ti_f_val").text(ti_f_val_render);

            $(".c_fti_a_p").text(c_fti_a_p_render);

            $(".ti_f_p").text(ti_f_p_render);

            $(".ti_f_d_n").attr("data-ti_f_d_n", ti_f_d_n);
            $(".ti_f_d_n").text(ti_f_d_n_render);

            $(".ti_f_d_val").attr("data-ti_f_d_val", ti_f_d_val);
            $(".ti_f_d_val").text(ti_f_d_val_render);

            //----------------------------------------
            // llevando a cantidades por defecto

            $("#f_vender_n").attr("data-f_vender_n", 0);
            $("#f_vender_n").text(0);
            $("#f_vender_val").attr("data-f_vender_val", 0);
            $("#f_vender_val").text(0);
            //----------------------------------------

            $(".alerta_i").remove(); // eliminamos todos los alert que puedan existir
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton "#adquirir_frac_inm"
            $("#adquirir_frac_inm").after(
                `<div class="alerta_i alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <p class="text-left">
                        Fracciones de inmueble eliminadas con exito.
                    </p>
                </div>`
            );
        } else {
            $(".alerta_i").remove(); // eliminamos todos los alert que puedan existir
            let mensaje = respuestaServidor.mensaje;
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton "#adquirir_frac_inm"
            $("#adquirir_frac_inm").after(
                `<div class="alerta_i alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <p class="text-left">
                        ${mensaje}
                    </p>
                </div>`
            );
        }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++