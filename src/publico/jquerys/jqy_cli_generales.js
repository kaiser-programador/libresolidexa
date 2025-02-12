// GENERALES DEL CLIENTE PUBLICO

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para el menu apegado izquierdo
$(".deslizador_busqueda").click(function (e) {
    var el_estado = $(".deslizado_busqueda_cli").text();
    // STOP() (se pone antes del animate) es para casos en que se hace click varias veces, solo se tome en cuenta una sola vez, asi se evita que la animacion se salgue de control
    // ------- Para verificación -------
    //console.log("el texto del deslizador de busqueda");
    //console.log(el_estado);

    if (el_estado == "comprimido") {
        $("#id_contenedor_busqueda_orden")
            .stop()
            .animate(
                {
                    marginLeft: "18rem",
                },
                600,
                function () {
                    // para que despues de que se dezplace al lado izquierdo, recien se establesca como "expandido"
                    $(".deslizado_busqueda_cli").text("expandido");

                    // $('.icono_flecha_f_o_inm').text('<');
                }
            ); // tiempo animacion de 700 milisegundos
    } else {
        // si sale 'block'

        $("#id_contenedor_busqueda_orden")
            .stop()
            .animate(
                {
                    marginLeft: "0rem",
                },
                600,
                function () {
                    // para que despues de que se dezplace al lado izquierdo, recien se establesca como "comprimido"
                    $(".deslizado_busqueda_cli").text("comprimido");
                }
            );
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// deslizador para ocultar formulario buscador
$("#cerrar_buscador").click(function (e) {
    $(".deslizador_busqueda").click();
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para DESHACER FILTROS y llevar las opciones del buscador en estado inicial (manteniendo el radio elegido)
$("#deshacer_filtros").click(function (e) {
    let disponible = $(".radio_inm_py_busq").eq(0).attr("data-seleccionada");
    let aprobacion = $(".radio_inm_py_busq").eq(1).attr("data-seleccionada");
    let pendiente = $(".radio_inm_py_busq").eq(2).attr("data-seleccionada");
    let remate = $(".radio_inm_py_busq").eq(3).attr("data-seleccionada");

    if (disponible == "si") {
        $(".radio_inm_py_busq").eq(0).click();
    }
    if (aprobacion == "si") {
        $(".radio_inm_py_busq").eq(1).click();
    }
    if (pendiente == "si") {
        $(".radio_inm_py_busq").eq(2).click();
    }
    if (remate == "si") {
        $(".radio_inm_py_busq").eq(3).click();
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// seleccion de opciones de radio INMUEBLE BUSQUEDA
$(".radio_tipo_busqueda").click(function (e) {
    let val_seleccionado = $(this).attr("value");

    if (val_seleccionado == "inmueble") {
        $("#formulario_busqueda_requerimiento").attr("hidden", true); // ocultamos
        $("#formulario_busqueda_cli").attr("hidden", false); // mostramos
        $("#formulario_busqueda_fracciones").attr("hidden", true); // ocultamos
    }

    if (val_seleccionado == "requerimiento") {
        $("#formulario_busqueda_requerimiento").attr("hidden", false); // mostramos
        $("#formulario_busqueda_cli").attr("hidden", true); // ocultamos
        $("#formulario_busqueda_fracciones").attr("hidden", true); // ocultamos
    }

    if (val_seleccionado == "proyecto") {
        $("#formulario_busqueda_requerimiento").attr("hidden", true); // ocultamos
        $("#formulario_busqueda_cli").attr("hidden", true); // ocultamos
        $("#formulario_busqueda_fracciones").attr("hidden", false); // mostramos
    }

    //-----------------------------------------------
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// seleccion de opciones de radio INMUEBLE BUSQUEDA
$(".radio_inm_py_busq").click(function (e) {
    let val_seleccionado = $(this).attr("value");

    //alert('seleccionamos el tipo radio busqueda: ' + val_seleccionado);

    if (val_seleccionado == "disponible") {
        $(".radio_inm_py_busq").eq(0).attr("data-seleccionada", "si");
        $(".radio_inm_py_busq").eq(1).attr("data-seleccionada", "no");
        $(".radio_inm_py_busq").eq(2).attr("data-seleccionada", "no");

        $(".contenedor_disponible_busq").attr("hidden", false);
        $(".contenedor_fraccion_busq").attr("hidden", true);
        $(".contenedor_remate_busq").attr("hidden", true);

        var v_min = $("#range_precio_disponible_busq").attr("min");
        $("#range_precio_disponible_busq").val(v_min);
        $("#input_precio_disponible_busq").val(v_min);
    }

    if (val_seleccionado == "remate") {
        $(".radio_inm_py_busq").eq(0).attr("data-seleccionada", "no");
        $(".radio_inm_py_busq").eq(1).attr("data-seleccionada", "si");
        $(".radio_inm_py_busq").eq(2).attr("data-seleccionada", "no");

        $(".contenedor_disponible_busq").attr("hidden", true);
        $(".contenedor_remate_busq").attr("hidden", false);
        $(".contenedor_fraccion_busq").attr("hidden", true);

        var v_min = $("#range_precio_remate_busq").attr("min");
        $("#range_precio_remate_busq").val(v_min);
        $("#input_precio_remate_busq").val(v_min);
    }

    if (val_seleccionado == "fraccion") {
        $(".radio_inm_py_busq").eq(0).attr("data-seleccionada", "no");
        $(".radio_inm_py_busq").eq(1).attr("data-seleccionada", "no");
        $(".radio_inm_py_busq").eq(2).attr("data-seleccionada", "si");

        $(".contenedor_disponible_busq").attr("hidden", true);
        $(".contenedor_remate_busq").attr("hidden", true);
        $(".contenedor_fraccion_busq").attr("hidden", false);

        var v_min = $("#range_precio_fraccion_busq").attr("min");
        $("#range_precio_fraccion_busq").val(v_min);
        $("#input_precio_fraccion_busq").val(v_min);
    }

    //-----------------------------------------------
    // genericos para todos los radios elegidos
    var v_min = $("#range_superficie_busq").attr("min");
    $("#range_superficie_busq").val(v_min);
    $("#input_superficie_busq").val(v_min);

    // numero de baños
    $(".ref_numero_banos .numero_banos").eq(0).click();
    // numero de habitaciones
    $(".ref_numero_habitaciones .numero_habitaciones").eq(0).click();

    // deseleccionar todas las casillas de tipo de inmueble
    let n_casillas = $(".contenedor_tipo_inmueble_busqueda .casilla_inm_py").length;
    for (let i = 0; i < n_casillas; i++) {
        let seleccionado = $(".contenedor_tipo_inmueble_busqueda .casilla_inm_py")
            .eq(i)
            .attr("seleccionado");
        if (seleccionado == "si") {
            // si esta seleccionado, entonces lo DEseleccionamos
            $(".contenedor_tipo_inmueble_busqueda .casilla_inm_py").eq(i).click();
        }
    }

    // casilla de garaje
    let seleccionado = $("#id_garaje_busq").attr("seleccionado");
    if (seleccionado == "si") {
        // si esta seleccionado, entonces lo DEseleccionamos
        $("#id_garaje_busq").click();
    }
    //-----------------------------------------------
});

$("#range_precio_disponible_busq").change(function (e) {
    let cambio = $(this);
    let el_valor = cambio.val();
    $("#input_precio_disponible_busq").val(el_valor);
});

$("#range_precio_fraccion_busq").change(function (e) {
    let cambio = $(this);
    let el_valor = cambio.val();
    $("#input_precio_fraccion_busq").val(el_valor);
});

$("#range_precio_remate_busq").change(function (e) {
    let cambio = $(this);
    let el_valor = cambio.val();
    $("#input_precio_remate_busq").val(el_valor);
});

$("#range_superficie_busq").change(function (e) {
    let cambio = $(this);
    let el_valor = cambio.val();
    $("#input_superficie_busq").val(el_valor);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// RANGE VALOR DESDE SU INPUT RESPECTIVO DESDE TECLADO

$("#input_precio_disponible_busq").keyup(function (e) {
    mover_range("disponible");
});

$("#input_precio_fraccion_busq").keyup(function (e) {
    mover_range("fraccion");
});

$("#input_precio_remate_busq").keyup(function (e) {
    mover_range("remate");
});

$("#input_superficie_busq").keyup(function (e) {
    mover_range("superficie");
});

function mover_range(tipo_input) {
    if (tipo_input == "disponible") {
        let valor_numerico = Number($("#input_precio_disponible_busq").val());
        $("#range_precio_disponible_busq").val(valor_numerico);
    }

    if (tipo_input == "fraccion") {
        let valor_numerico = Number($("#input_precio_fraccion_busq").val());
        $("#range_precio_fraccion_busq").val(valor_numerico);
    }

    if (tipo_input == "remate") {
        let valor_numerico = Number($("#input_precio_remate_busq").val());
        $("#range_precio_remate_busq").val(valor_numerico);
    }

    if (tipo_input == "superficie") {
        let valor_numerico = Number($("#input_superficie_busq").val());
        $("#range_superficie_busq").val(valor_numerico);
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// seleccion de casilla garaje
$("#id_garaje_busq").click(function (e) {
    let tipo_seleccionado = $(this).attr("seleccionado");
    if (tipo_seleccionado == "no") {
        $(this).attr("seleccionado", "si");
    }
    if (tipo_seleccionado == "si") {
        $(this).attr("seleccionado", "no");
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SELECCION DE NUMERO DE BAÑOS
$(".ref_numero_banos .numero_banos").click(function (e) {
    e.preventDefault();
    let numero_banos = Number($(this).attr("numero"));

    // despintamos todos
    $(".ref_numero_banos .numero_banos").removeClass("n_bano_seleccionado");

    // luego pintamos este boton seleccionada con this
    $(this).addClass("n_bano_seleccionado");

    $("#id_numero_banos").attr("value", numero_banos);
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SELECCION DE NUMERO DE HABITACIONES
$(".ref_numero_habitaciones .numero_habitaciones").click(function (e) {
    e.preventDefault();
    let numero_habitaciones = Number($(this).attr("numero"));

    // despintamos todos
    $(".ref_numero_habitaciones .numero_habitaciones").removeClass("n_dormitorio_seleccionado");
    // $(".ref_numero_habitaciones .numero_habitaciones").removeClass("btn-success");

    // luego pintamos este boton seleccionada con this
    $(this).addClass("n_dormitorio_seleccionado");
    // $(this).addClass("btn-success");

    $("#id_numero_habitaciones").attr("value", numero_habitaciones);
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// botones de "significado" de empleos lado: proyecto, inmueble
$(".btn-propietarios").click(function (e) {
    $(".significado-propietarios").css("display", "block");
    $(".significado-empresa").css("display", "none");
    $(".significado-pais").css("display", "none");
});
$(".btn-empresa").click(function (e) {
    $(".significado-propietarios").css("display", "none");
    $(".significado-empresa").css("display", "block");
    $(".significado-pais").css("display", "none");
});
$(".btn-pais").click(function (e) {
    $(".significado-propietarios").css("display", "none");
    $(".significado-empresa").css("display", "none");
    $(".significado-pais").css("display", "block");
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#ventanaModalAccesoInversor").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    var datosFormulario = new FormData(document.getElementById("ventanaModalAccesoInversor"));

    $.ajax({
        type: "post",
        url: "/verificarclavescli",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.tipo;
        if (tipoRespuesta == "correcto") {
            var ci_propietario = respuestaServidor.ci_propietario;
            //cerramos la ventana modal
            $("#ventanaModalAccesoInversor .cerrar_modal_acceso").click(); // haciendo click en su boton de cerrar
            // creamos la action ruta del formulario
            var rutaServidor = "/propietario/" + ci_propietario + "/resumen";
            $("#id_form_acceso_cuenta_inversor").attr("action", rutaServidor);

            // IMPORTANTE, PORQUE LE INDICAMOS AL FORMULARIO QUE HAGA "submit", es decir que se dirija a la ruta que se le creo guardao en "rutaServidor" y que le agregamos como "attr" 'action'
            $("#id_form_acceso_cuenta_inversor").submit();
        }

        if (tipoRespuesta == "incorrecto") {
            $("#ventanaModalAccesoInversor .ref_boton_acceder").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Claves de acceso incorrectas!</strong>
                </div>`
            );
        }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para el menu apegado IZQUIERDO INFERIOR

$(".clase_flecha_filtro_orden").click(function (e) {
    var el_estado = $(".deslizado_o_f_inm").text();

    // STOP() (se pone antes del animate) es para casos en que se hace click varias veces, solo se tome en cuenta una sola vez, asi se evita que la animacion se salgue de control
    if (el_estado == "comprimido") {
        $("#id_contenedor_filtro_orden")
            .stop()
            .animate(
                {
                    marginLeft: "18rem",
                    // marginLeft: '13.4rem',
                },
                600,
                function () {
                    // para que despues de que se dezplace al lado izquierdo, recien se establesca como "expandido"
                    $(".deslizado_o_f_inm").text("expandido");

                    // $('.icono_flecha_f_o_inm').text('<');
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

//==================================================================
//==================================================================
// checkbox para el seleccion o deseleccion de la casilla

$("#ajustar_economia").change(function () {
    if ($(this).is(":checked")) {
        // Acción cuando el checkbox está seleccionado

        $("#tc_paralelo").prop("readonly", false); // Quita el atributo readonly
        $("#inflacion").prop("readonly", false); // Quita el atributo readonly

        $("#tc_paralelo").removeClass("input_respuesta");
        $("#inflacion").removeClass("input_respuesta");
    } else {
        // Acción cuando el checkbox está deseleccionado

        $("#tc_paralelo").prop("readonly", true); // Añade el atributo readonly
        $("#inflacion").prop("readonly", true); // Añade el atributo readonly

        $("#tc_paralelo").addClass("input_respuesta");
        $("#inflacion").addClass("input_respuesta");

        $("#tc_paralelo").val(6);
        $("#inflacion").val(4.9);
    }
});

//==================================================================
//==================================================================
// checkbox para el seleccion o deseleccion de la casilla de comision de intermediario, valido para terreno o inmueble

$("#ajustar_comision").change(function () {
    if ($(this).is(":checked")) {
        // Acción cuando el checkbox está seleccionado

        $("#input_comision").prop("readonly", false); // Quita el atributo readonly
        $("#input_comision").removeClass("input_respuesta");

        $("#input_comision").val(3);
    } else {
        // Acción cuando el checkbox está deseleccionado

        $("#input_comision").prop("readonly", true); // Añade el atributo readonly
        $("#input_comision").addClass("input_respuesta");

        $("#input_comision").val(0);
    }
});
//==================================================================
//==================================================================
/*
$(".cabezera_py_inm").on("click", "#ver_fotos_py", function (e) {
    
        $("#contenedor_imagenes_py a").fancybox({
            overlayColor: "#797e79",
            overlayOpacity: .6,
            transitionIn: "elastic",
            transitionOut: "elastic",
            titlePosition: "outside",
            cyclic: true,
        });
    
});

*/

/*
$("#id_body").on("click", "#ver_fotos_rspy", function (e) {

    alert("hola putos");
    
        $("#contenedor_imagenes_rspy a").fancybox({
            overlayColor: "#797e79",
            overlayOpacity: .6,
            transitionIn: "elastic",
            transitionOut: "elastic",
            titlePosition: "outside",
            cyclic: true,
        });
    
});
*/

// para terreno
$("#id_body").on("click", "#ver_fotos_te", function (e) {
    $("#contenedor_imagenes_te img").eq(0).click();
});

// para proyecto
$("#id_body").on("click", "#ver_fotos_py", function (e) {
    $("#contenedor_imagenes_py img").eq(0).click();
});

// agregado para inmueble
$("#id_body").on("click", "#ver_fotos_inm", function (e) {
    $("#contenedor_imagenes_inm img").eq(0).click();
});

// agregado para RESPONSABILIDAD SOCIAL DEL PROYECTO
$("#id_body").on("click", "#ver_fotos_rspy", function (e) {
    $("#contenedor_imagenes_rspy img").eq(0).click();
});

$('[data-fancybox="images"]').fancybox({
    afterLoad: function (instance, current) {
        var pixelRatio = window.devicePixelRatio || 1;

        if (pixelRatio > 1.5) {
            current.width = current.width / pixelRatio;
            current.height = current.height / pixelRatio;
        }
    },
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Al momento de seleccionar un tipo de moneda desde el menu superior

$("#id_body").on("click", ".tipo_moneda", function (e) {
    let tipoMoneda = $(this).attr("data-tipo_moneda"); // bs o sus

    // en el cargado de toda ventana se asegura que existan los valores de: tipoCambio y tipoMoneda, por tanto se puede extraer directaente el tipoCambio, puesto que esta previamente asegurado su existencia

    let tipoCambio = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico

    // funcion
    let datosMoneda = {
        tipoCambio,
        tipoMoneda,
    };
    tipoMonedaTipoCambio(datosMoneda);

    // ahora se guarda en la memoria del navegador el tipo de moneda que se selecciono:
    sessionStorage.setItem("tipoMoneda", tipoMoneda);
});

//==================================================================
//==================================================================
// CALCULADORA ---- rangue, input del rangue EN fracciones de terreno o inmueble

// cuando se mueve manualmente el punto del rangue
$("#range_fracciones").change(function (e) {
    let cambio = $(this);
    let el_valor = cambio.val();
    $("#input_fracciones").val(el_valor);
});

// cuando se escribe directamente dentro de la caja del input
$("#input_fracciones").keyup(function (e) {
    let maximo = Number($(".limite_max").attr("data-maximo"));
    let num_f = Number($("#input_fracciones").val());

    if (num_f >= 0 && num_f <= maximo) {
        let valor_numerico = Number($("#input_fracciones").val());
        $("#range_fracciones").val(valor_numerico);
    } else {
        alert("El número de fracciones no debe superar los límites establecidos " + num_f);
    }
});

// cada vez que la caja del input cambia de valor
$("#input_fracciones").change(function (e) {
    var tc_oficial = Number(sessionStorage.getItem("tipoCambio"));
    var tipoMoneda = sessionStorage.getItem("tipoMoneda");
    if (tipoMoneda === "sus") {
        var cambio = tc_oficial;
    } else {
        if (tipoMoneda === "bs") {
            var cambio = 1;
        }
    }

    // precio unitario de la fraccion Bs
    let fraccion_bs = Number($(".fraccion_bs").attr("data-fraccion_bs"));

    // precio justo del terreno Bs
    let solidexa_bs = Number($(".solidexa_bs").attr("data-solidexa_bs"));

    //---------------------------

    let num_f = Number($("#input_fracciones").val());

    let fraccion_val = num_f * fraccion_bs * (1 / cambio);
    let terreno_val = solidexa_bs * (1 / cambio);

    let participacion = Math.floor(fraccion_val / terreno_val);
    let participacion_render = numero_punto_coma_query(participacion);
    let fraccion_val_render = numero_punto_coma_query(fraccion_val);

    $("#valor_adquiridos").val(fraccion_val_render);
    $("#participacion").val(participacion_render);
});
//==================================================================
//==================================================================
