// PARA CODIGO REUTILIZABLE EN LA PARTE "ADMINISTRATIVA" Y "CLIENTE"

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para las sub pestañas de te, py, inm, propietario ya sea lado cliente o administrador, clickeadas desde el menu desplegable en vista comprimida
$(".aux_tabe").click(function (e) {
    let tab_seleccionado = $(this).attr("data-id");
    document.getElementById(tab_seleccionado).click();
});

/************************************************************************************* */
// SELECTOR DE CIUDAD EN OPCIONES DE BUSQUEDA DE INMUEBLES LADO DEL CLIENTE
$("#selector_ciudad_busq").change(function () {
    var $seleccionado = $(this);
    var ciudad = $seleccionado.val();
    $("#ciudad_elegida").val(ciudad); // para el hidden
});

/************************************************************************************* */
// SELECTOR DE CIUDAD EN OPCIONES DE BUSQUEDA DE REQUERIMIENTOS LADO DEL CLIENTE
$("#selector_ciudad_busq_req").change(function () {
    var $seleccionado = $(this);
    var ciudad = $seleccionado.val();
    $("#ciudad_elegida_req").val(ciudad); // para el hidden
});

/************************************************************************************* */
// SELECTOR DE CIUDAD EN OPCIONES DE BUSQUEDA DE FRACCIONES TERRENO LADO DEL CLIENTE
$("#selector_ciudad_busq_frac_te").change(function () {
    var $seleccionado = $(this);
    var ciudad = $seleccionado.val();
    $("#ciudad_elegida_frac_te").val(ciudad); // para el hidden
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// INMUEBLE LADO: ADMINISTRADOR Y CLIENTE

// AL SELECCIONAR UNO DE LOS RADIOS DE INMUEBLE DENTRO DE PROYECTO, ( Y PROPIETARIO )

$(".radio_inm_py").click(function (e) {
    let tipo_elegido = $(this).val();

    let aux_data_id = $(this).attr("data-id");

    $(".ref_titulo_py_inm_r_o_b .t_busqueda").text(""); // limpiamos

    // al limpiar este input, NO SE EJECUTA LA FUNSION DE BUSQUEDA ".keyup", PORQUE NO ESTAMOS ESCRIBIENDO NI BORRANDO NADA CON EL TECLADO.
    $("#palabras_buscar_py_inm").val(""); // limpiamos el input donde se escriben las palabras claves

    $(".ref_titulo_py_inm_r_o_b .t_busqueda").attr("hidden", true); // ocultamos
    $(".ref_titulo_py_inm_r_o_b .t1_inv_inm").attr("hidden", false); // mostramos
    $(".ref_titulo_py_inm_r_o_b .t2_inv_inm").attr("hidden", false); // mostramos

    $(".t1_inv_inm").html(`${aux_data_id} &gt;`);
    ////$('.t2_inv_inm').html(`${array_data_id[1]}`);

    //-------------------------------------------
    // HABILITAMOS las opciones de ordenamientos.
    // $('.ul_ordenadores_inm_py .o_inm_py').attr('disabled', false);
    $(".ul_ordenadores_inm_py").attr("hidden", false); // no fue posible bloquearlos, asi que los mostramos
    // HABILITAMOS las CASILLAS DE FILTRO.
    $(".casilla_inm_py").attr("disabled", false);

    //-------------------------------------------------------------
    // las casillas checkbox de filtro las DEseleccionamos todas
    let n_casillas = $(".casilla_inm_py").length;
    for (let i = 0; i < n_casillas; i++) {
        let estado_casilla_i = $(".casilla_inm_py").eq(i).attr("seleccionado");
        if (estado_casilla_i == "si") {
            $(".casilla_inm_py").eq(i).click(); // esto ejecutara la funcion click de los checkbox, que cambiara su atributo "seleccionado" al valor "no"
        }
    }

    //-------------------------------------------------------------

    // eliminamos todos los inmuebles que estan renderizados al momento
    $("#contenedor_py_inm_render .card_un_inm_py").remove();

    // borramos por seguridad todos los mensajes ALERT que figuren en la ventana
    $("#contenedor_py_inm_render .mensaje_alerta_inv_inm").remove();

    // recolectamos los inmuebles que estan dentro del contenedor "#contenedor_py_inm_todos"
    let n_inmuebles = $("#contenedor_py_inm_todos .card_un_inm_py").length;

    //alert("el numero de inmuebles figurantes es: "+n_inmuebles);

    var n_renderizados = 0;
    if (n_inmuebles > 0) {
        for (let i = 0; i < n_inmuebles; i++) {
            let tipo_inmueble_radio = $(
                "#contenedor_py_inm_todos .card_un_inm_py .clase_tipo_radio_inmueble"
            )
                .eq(i)
                .attr("tipo_radio_inmueble");

            if (tipo_elegido == tipo_inmueble_radio || tipo_elegido == "todos") {
                let card_inm_render_html = $("#contenedor_py_inm_todos .card_un_inm_py").eq(i).html();

                // lo renderizamos (aun sin ordenarlo) dentro del contenedor de card renderizados (es decir debajo y al mismo nivel de ".ref_tipo_py_inm")
                $("#contenedor_py_inm_render .ref_tipo_py_inm").after(
                    `<div class="card_un_inm_py col-12 mb-3 col-sm-6 col-md-4 col-lg-3">` +
                        card_inm_render_html +
                        `</div>`
                );

                n_renderizados = n_renderizados + 1;
            }
        }
    }

    if (n_renderizados > 0) {
        $(".o_inm_py").eq(0).click(); // hacemos click en la primera opcion de ordenamiento (que son los POR DEFECTO "piso")
    } else {
        //$("#contenedor_py_inm_render .ref_tipo_inm_inv").after(
        $("#contenedor_py_inm_render .ref_tipo_py_inm").after(
            `<div class="mensaje_alerta_inv_inm alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>No existen inmuebles dentro de esta categoría!</strong>
            </div>`
        );
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// FILTRO INTERIOR DE INMUEBLES PROPIETARIO LADO ADMINISTRADOR Y CLIENTE

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para los filtros por tipo casilla check, se buscara entre todos los inmuebles presentes resultados del tipo elegido, se ocultaran todos y se mostrara solo aquel que cumpla con el check

$(".casilla").click(function (e) {
    let casilla_seleccionada = $(this).attr("seleccionado");

    if (casilla_seleccionada == "no") {
        // si la casilla estaba NO SELECCIONADA, entonces con el click, estara SI SELECCIONADA
        $(this).attr("seleccionado", "si");
    } else {
        // si la casilla estaba SI SELECCIONADA, entonces con el click, estara NO SELECCIONADA
        $(this).attr("seleccionado", "no");
    }

    let n_inmuebles = $("#contenedor_inm_inv_render .card_un_inm_py").length; // si hubieran ocultos, tambien entrarian en el conteo
    if (n_inmuebles > 0) {
        // se FILTRARA solo si existen inmuebles que FILTRAR
        let n_casillas = $(".casilla").length;

        // revision con este click, si todos las casillas estan ahora seleccionadas, ('seleccionado' esta 'si') o si todos estan DEseleccionadas ('seleccionado' esta 'no')
        let n_seleccionados = 0;
        let n_deseleccionados = 0;

        for (let i = 0; i < n_casillas; i++) {
            let estado_casilla_i = $(".casilla").eq(i).attr("seleccionado");
            if (estado_casilla_i == "si") {
                n_seleccionados = n_seleccionados + 1;
            } else {
                n_deseleccionados = n_deseleccionados + 1;
            }
        }

        if (n_seleccionados == n_casillas || n_deseleccionados == n_casillas) {
            $("#contenedor_inm_inv_render .card_un_inm_py").attr("hidden", false); // mostramos todos los inmuebles presentes, segun el radio previo que se eligio
        } else {
            // recorremos todos las casillas, viendo quienes estan seleccionadas y mostrando solo a estas en la ventana del navegador
            $("#contenedor_inm_inv_render .card_un_inm_py").attr("hidden", true); // ocultamos todos los inmuebles presentes

            for (let i = 0; i < n_casillas; i++) {
                let estado_casilla_i = $(".casilla").eq(i).attr("seleccionado");
                if (estado_casilla_i == "si") {
                    // entonces mostramos a todos los inmuebles que cumplen con esta casilla
                    let casilla_valor_i = $(".casilla").eq(i).attr("value").toLowerCase(); // llevado a minuscula por seguridad
                    for (let j = 0; j < n_inmuebles; j++) {
                        let aux_tipo_inmueble_j = $(
                            "#contenedor_inm_inv_render .card_un_inm_py .v_tipo_inmueble"
                        ).eq(j)[0].innerText;
                        let tipo_inmueble_j = aux_tipo_inmueble_j.toLowerCase(); // llevado a minuscula por seguridad
                        if (casilla_valor_i == tipo_inmueble_j) {
                            $("#contenedor_inm_inv_render .card_un_inm_py").eq(j).attr("hidden", false); // mostramos el inmueble
                        }
                    }
                }
            }
        }
    }
});
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA BUSCAR INMUEBLES DENTRO DE LAS INVERSIONES DEL INVERSIONISTA
////// ***BORRAR
$("#palabras_buscar_inm_inv_XXX").keyup(function (e) {
    $(".t1_inv_inm").attr("hidden", true); // ocultamos
    $(".t2_inv_inm").attr("hidden", true); // ocultamos
    $(".t3_inv_inm").attr("hidden", true); // ocultamos

    $(".t_busqueda").attr("hidden", false); // mostramos
    $(".t_busqueda").text("Resultados busqueda");

    // bloqueamos las opciones de ordenamientos, esto para evitar que despues de una busqueda se realize de manera directa un ordenamiento, pues de permitirselo, no se sabria como ordenarlo, ya que las busquedas eliminan todos los inmuebles que estaban en "#contenedor_inm_inv_render"
    //$('.ul_ordenadores .inv_inm_o').attr('disabled', true); // no es posible bloquear estos elementos
    // las opciones de ordenamientos solo pueden ser habilitadas con las seleccion de algun tipo de radio de tipo de inmueble
    $(".ul_ordenadores").attr("hidden", true); // asi que ocultamos todo su contenedor

    // tambien bloqueamos las opciones de CASILLAS, estas solo podran ser habilitadas con la seleccion de algun radio de tipo de inmueble
    $(".casilla").attr("disabled", true);

    if ($("#palabras_buscar_inm_inv").val() != "") {
        buscaInversionInmueble();
    }
});

function buscaInversionInmueble() {
    let inmueble_buscar_palabras = $("#palabras_buscar_inm_inv").val().toLowerCase(); // llevando todo a minuscula por seguridad (y a string por defecto)

    let arrayPalabras = inmueble_buscar_palabras.split(" "); // los separamos por espacios en blanco si existiesen

    $(".mensaje_alerta_inv_inm").remove(); // borramos los mensajes alert si es que existiesen por seguridad

    // por cada inmueble armamos un gran string donde estaran la informacion mas relevante, donde se hara la busqueda de las palabras claves
    let n_inmuebles = $("#contenedor_inm_inv_todos .card_un_inm_py").length;
    let arrayInmueblesHtml = [];
    let i_inm = -1;
    for (let n = 0; n < n_inmuebles; n++) {
        // en lugar de usar .html()     usar un metodo que lo convierte todo en STRING Y con esto buscar dentro de este string las palabras clave  ver EDTEAM
        let cardInmuebleString = $("#contenedor_inm_inv_todos .card_un_inm_py")
            .eq(n)
            .text()
            .toLowerCase(); // llevando todo a minuscula  (y a string por defecto)

        let contador_encontrados = 0;
        for (let q = 0; q < arrayPalabras.length; q++) {
            if (cardInmuebleString.indexOf(arrayPalabras[q]) != -1) {
                contador_encontrados = contador_encontrados + 1;
            }
        }

        if (contador_encontrados == arrayPalabras.length) {
            // guardandolo con sus elementos HTML
            i_inm = i_inm + 1;
            arrayInmueblesHtml[i_inm] = $("#contenedor_inm_inv_todos .card_un_inm_py").eq(n).html();
        }
    }

    // renderizamos los inmuebles ordenados
    $("#contenedor_inm_inv_render .card_un_inm_py").remove(); // eliminamos los inmuebles presentes

    if (arrayInmueblesHtml.length > 0) {
        for (let r = 0; r < arrayInmueblesHtml.length; r++) {
            $("#contenedor_inm_inv_render .ref_tipo_inm_inv").after(
                `<div class="card_un_inm_py col-12 col-sm-6 col-md-4 col-lg-3">` +
                    arrayInmueblesHtml[r] +
                    `</div>`
            );
        }
    } else {
        $("#contenedor_inm_inv_render .ref_tipo_inm_inv").after(
            `<div class="mensaje_alerta_inv_inm alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>No existen resultados!</strong>
            </div>`
        );
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA BUSCAR REQUERIMIENTOS DENTRO DE LA TABLA (tecla por tecla)

$("#palabras_buscar_py_req").keyup(function (e) {
    if ($("#palabras_buscar_py_req").val() != "") {
        buscarRequerimientos();
    } else {

        $("#lista_requerimientos_render .fila_registro").remove(); // eliminamos los requerimientos presentes

        $(".mensaje_alerta_requerimiento").remove(); // borramos los mensajes alert si es que existiesen por seguridad

        // recolectamos los requerimientos que estan dentro del contenedor "#lista_requerimientos_todos"
        let n_requerimientos = $("#lista_requerimientos_todos .fila_registro").length;

        if (n_requerimientos > 0) {
            //let r = n_requerimientos;
            for (let i = 0; i < n_requerimientos; i++) {
                //r = r - 1;
                let requerimiento_html = $("#lista_requerimientos_todos .fila_registro").eq(i).html();

                // lo renderizamos dentro la tabla renderizados con append (es decir debajo al final como hijo de ".cuerpo_filas")
                $("#lista_requerimientos_render .cuerpo_filas").append(
                    `<tr class="fila_registro">` + requerimiento_html + `</tr>`
                );
            }
        }
    }
});

function buscarRequerimientos() {
    let requerimiento_buscar_palabras = $("#palabras_buscar_py_req").val().toLowerCase(); // llevando todo a minuscula por seguridad (y a string por defecto)

    let arrayPalabras = requerimiento_buscar_palabras.split(" "); // los separamos por espacios en blanco si existiesen

    $(".mensaje_alerta_requerimiento").remove(); // borramos los mensajes alert si es que existiesen por seguridad

    // por cada inmueble armamos un gran string donde estaran la informacion mas relevante, donde se hara la busqueda de las palabras claves
    let n_requerimientos = $("#lista_requerimientos_todos .fila_registro").length;
    let arrayRequerimientosHtml = [];
    let i_requeri = -1;
    for (let n = 0; n < n_requerimientos; n++) {
        // en lugar de usar .html()     usar un metodo que lo convierte todo en STRING Y con esto buscar dentro de este string las palabras clave  ver EDTEAM
        let requerimientoString = $("#lista_requerimientos_todos .fila_registro")
            .eq(n)
            .text()
            .toLowerCase(); // llevando todo a minuscula  (y a string por defecto)

        let contador_encontrados = 0;
        for (let q = 0; q < arrayPalabras.length; q++) {
            if (requerimientoString.indexOf(arrayPalabras[q]) != -1) {
                contador_encontrados = contador_encontrados + 1;
            }
        }

        if (contador_encontrados == arrayPalabras.length) {
            // guardandolo con sus elementos HTML
            i_requeri = i_requeri + 1;
            arrayRequerimientosHtml[i_requeri] = $("#lista_requerimientos_todos .fila_registro")
                .eq(n)
                .html();
        }
    }

    // renderizamos los Requerimientos ordenados
    $("#lista_requerimientos_render .fila_registro").remove(); // eliminamos los requerimientos presentes

    if (arrayRequerimientosHtml.length > 0) {
        for (let r = 0; r < arrayRequerimientosHtml.length; r++) {
            // lo renderizamos dentro la tabla renderizados con append (es decir debajo al final como hijo de ".cuerpo_filas")
            $("#lista_requerimientos_render .cuerpo_filas").append(
                `<tr class="fila_registro">` + arrayRequerimientosHtml[r] + `</tr>`
            );
        }
    } else {
        $("#lista_requerimientos_render").after(
            `<div class="mensaje_alerta_requerimiento alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>No existen resultados!</strong>
            </div>`
        );
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// RECODI REVISAR LOS CODIGOS A CONTINUACION:

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ORDENADOR INMUEBLES DESDE INTERIOR DE: PROYECTO, PROPIEDADES DE PROPIETARIO

$("#orden_inm_interior").on("click", ".o_inm_py", function () {
    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    //e.preventDefault(); // Cancelamos el evento por defecto del elemento

    $("#contenedor_py_inm_render .card_un_inm_py").attr("hidden", false); // mostramos todos los card de los inmuebles resultados, PORQUE con las casillas de filtro puede que algunos inmuebles esten ocultos

    //-------------------------------------------------------------
    // las casillas checkbox de filtro las DEseleccionamos todas
    let n_casillas = $(".casilla_inm_py").length;
    for (let i = 0; i < n_casillas; i++) {
        let estado_casilla_i = $(".casilla_inm_py").eq(i).attr("seleccionado");
        if (estado_casilla_i == "si") {
            $(".casilla_inm_py").eq(i).click(); // esto ejecutara la funcion click de los checkbox, que cambiara su atributo "seleccionado" al valor "no"
        }
    }
    //-------------------------------------------------------------

    var ordenElegido = $(this).attr("tipo_orden");
    //alert(ordenElegido);
    // ponemos el tipo de ordenamiento en el titulo descriptivo
    $(".ref_titulo_py_inm_r_o_b .t2_inv_inm").text(ordenElegido);

    // ponemos el tipo de ordenamiento en el titulo descriptivo
    //$(".ref_titulo_py_inm_r_o_b .t2_inv_inm").text(ordenElegido);

    let n_inmuebles = $("#contenedor_py_inm_render .card_un_inm_py").length;

    if (n_inmuebles >= 2) {
        // se ordenaran solo si existen al menos 2 inmuebles que ordenar

        var ordenamiento = $(this).attr("el_orden");
        //alert(ordenamiento);
        var arrayInmueblesHtml = []; // vacio que sera llenado con los HTML de los card de los inmuebles
        var arrayValorInteres = []; // vacio que sera llenado con el valor de interes de ordenamiento

        for (let i = 0; i < n_inmuebles; i++) {
            arrayInmueblesHtml[i] = $("#contenedor_py_inm_render .card_un_inm_py").eq(i).html();

            if (ordenElegido == "precio") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_precio").eq(i).attr("valor")
                );
            }

            if (ordenElegido == "ahorro") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_ahorro").eq(i).attr("valor")
                );
            }

            if (ordenElegido == "superficie") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_superficie").eq(i).attr("valor")
                );
            }
        }

        for (let k = 0; k < n_inmuebles - 1; k++) {
            for (let j = k + 1; j < n_inmuebles; j++) {
                let valorInteres_k = arrayValorInteres[k];
                let valorInteres_j = arrayValorInteres[j];

                if (ordenamiento == "menor") {
                    // se ordenara de "menor a MAYOR"
                    if (valorInteres_k > valorInteres_j) {
                        let auxiliar = arrayValorInteres[k];
                        arrayValorInteres[k] = arrayValorInteres[j];
                        arrayValorInteres[j] = auxiliar;

                        let auxiliar_2 = arrayInmueblesHtml[k];
                        arrayInmueblesHtml[k] = arrayInmueblesHtml[j];
                        arrayInmueblesHtml[j] = auxiliar_2;
                        // j ocupa el lugar de k,  k ocupa el lugar de j
                    }
                } else {
                    // se ordenara de "MAYOR a menor"
                    if (valorInteres_k < valorInteres_j) {
                        let auxiliar = arrayValorInteres[k];
                        arrayValorInteres[k] = arrayValorInteres[j];
                        arrayValorInteres[j] = auxiliar;

                        let auxiliar_2 = arrayInmueblesHtml[k];
                        arrayInmueblesHtml[k] = arrayInmueblesHtml[j];
                        arrayInmueblesHtml[j] = auxiliar_2;
                        // j ocupa el lugar de k,  k ocupa el lugar de j
                    }
                }
            }
        }

        // renderizamos los inmuebles ordenados
        $("#contenedor_py_inm_render .card_un_inm_py").remove(); // eliminamos los inmuebles presentes
        for (let n = 0; n < n_inmuebles; n++) {
            // dado el uso de "after", corregimos el recorrido del arrayHTML empezando del ultimo hacia el primero
            let i_aux = n_inmuebles - n - 1;

            $("#contenedor_py_inm_render .ref_tipo_py_inm").after(
                `<div class="card_un_inm_py mb-3 col-12 col-md-6 col-lg-4 col-xl-3">` +
                    arrayInmueblesHtml[i_aux] +
                    `</div>`
            );
        }

        // cambiamos el tipo de ordenamiento para el siguiente click sobre el mismo tipo de ordenamiento
        if (ordenamiento == "menor") {
            $(this).attr("el_orden", "mayor");
        } else {
            $(this).attr("el_orden", "menor");
        }
    }
});

// ------------------------------------------------------------------------------------
// PARA ORDENAR EXTERIORES: INMUEBLES RESULTADOS DE BUSQUEDA y PROYECTOS Y CONVOCATORIAS
$("#orden_inm_exterior").on("click", ".orden_gral_inm_py", function () {
    var ordenElegido = $(this).attr("tipo_orden");

    //alert(ordenElegido);

    // ponemos el tipo de ordenamiento en el titulo descriptivo
    //$(".ref_titulo_py_inm_r_o_b .t2_inv_inm").text(ordenElegido);

    let n_inmuebles = $("#contenedor_py_inm_render .card_un_inm_py").length;

    if (n_inmuebles >= 2) {
        // se ordenaran solo si existen al menos 2 CARDS que ordenar

        var ordenamiento = $(this).attr("el_orden");
        //alert(ordenamiento);
        var arrayInmueblesHtml = []; // vacio que sera llenado con los HTML de los card de los inmuebles
        var arrayValorInteres = []; // vacio que sera llenado con el valor de interes de ordenamiento

        for (let i = 0; i < n_inmuebles; i++) {
            arrayInmueblesHtml[i] = $("#contenedor_py_inm_render .card_un_inm_py").eq(i).html();

            // proyectos_reserva proyectos_pago proyectos_construccion proyectos_construido
            if (ordenElegido == "financiamiento") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_financiado").eq(i).attr("valor")
                );
            }

            // proyectos_reserva proyectos_pago proyectos_construccion
            if (ordenElegido == "meta") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_meta").eq(i).attr("valor")
                );
            }

            // proyectos_reserva proyectos_pago proyectos_construccion proyectos_construido INMUEBLES: es_disponible, es_pendiente, es_remate
            if (ordenElegido == "ahorro") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_ahorro").eq(i).attr("valor")
                );
            }

            // proyectos_reserva  proyectos_construccion proyectos_construido terrenos_convocatoria  INMUEBLES: es_disponible, es_pendiente
            if (ordenElegido == "vencimiento") {
                let aux_vencimiento = $("#contenedor_py_inm_render .card_un_inm_py .v_vencimiento")
                    .eq(i)
                    .attr("valor");
                arrayValorInteres[i] = new Date(aux_vencimiento); // convirtiendolo a fecha
            }

            // terrenos_convocatoria  INMUEBLES: es_disponible, es_pendiente, es_remate
            if (ordenElegido == "precio") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_precio").eq(i).attr("valor")
                );
            }

            // terrenos_convocatoria  INMUEBLES: es_disponible, es_pendiente, es_remate
            if (ordenElegido == "superficie") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_superficie").eq(i).attr("valor")
                );
            }

            // terrenos_convocatoria
            if (ordenElegido == "disponibles") {
                arrayValorInteres[i] = Number(
                    $("#contenedor_py_inm_render .card_un_inm_py .v_disponibles").eq(i).attr("valor")
                );
            }
        }

        //--------------- Verificacion ----------------
        //console.log('Los valores de ordenamiento');
        //console.log(arrayValorInteres);
        //console.log(arrayValorInteres[1]+1);
        //---------------------------------------------

        for (let k = 0; k < n_inmuebles - 1; k++) {
            for (let j = k + 1; j < n_inmuebles; j++) {
                let valorInteres_k = arrayValorInteres[k];
                let valorInteres_j = arrayValorInteres[j];

                if (ordenamiento == "menor") {
                    // se ordenara de "menor a MAYOR"
                    if (valorInteres_k > valorInteres_j) {
                        let auxiliar = arrayValorInteres[k];
                        arrayValorInteres[k] = arrayValorInteres[j];
                        arrayValorInteres[j] = auxiliar;

                        let auxiliar_2 = arrayInmueblesHtml[k];
                        arrayInmueblesHtml[k] = arrayInmueblesHtml[j];
                        arrayInmueblesHtml[j] = auxiliar_2;
                        // j ocupa el lugar de k,  k ocupa el lugar de j
                    }
                } else {
                    // se ordenara de "MAYOR a menor"
                    if (valorInteres_k < valorInteres_j) {
                        let auxiliar = arrayValorInteres[k];
                        arrayValorInteres[k] = arrayValorInteres[j];
                        arrayValorInteres[j] = auxiliar;

                        let auxiliar_2 = arrayInmueblesHtml[k];
                        arrayInmueblesHtml[k] = arrayInmueblesHtml[j];
                        arrayInmueblesHtml[j] = auxiliar_2;
                        // j ocupa el lugar de k,  k ocupa el lugar de j
                    }
                }
            }
        }

        // renderizamos los inmuebles ordenados
        $("#contenedor_py_inm_render .card_un_inm_py").remove(); // eliminamos los inmuebles presentes
        for (let n = 0; n < n_inmuebles; n++) {
            // dado el uso de "after", corregimos el recorrido del arrayHTML empezando del ultimo hacia el primero
            let i_aux = n_inmuebles - n - 1;

            $("#contenedor_py_inm_render .ref_tipo_py_inm").after(
                `<div class="card_un_inm_py mb-3 col-12 col-md-6 col-lg-4 col-xl-3">` +
                    arrayInmueblesHtml[i_aux] +
                    `</div>`
            );
        }
        
        // cambiamos el tipo de ordenamiento para el siguiente click sobre el mismo tipo de ordenamiento
        if (ordenamiento == "menor") {
            $(this).attr("el_orden", "mayor");
        } else {
            $(this).attr("el_orden", "menor");
        }
    }
});

// ------------------------------------------------------------------------------------

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para los filtros por tipo casilla check. (para VENTANA: INMUEBLES DENTRO DE PROYECTO Y RESULTADOS INMUEBLES)
// para la ventan de resultados de inmuebles del buscador: solo establecera el tipo de inmueble que se desea buscar, no filtrara nada en tiempo real. solo permitira la busqueda de inmuebles cuando se haga click en "buscar"
// para la ventana de inmuebles dentro de proyecto: se buscara entre todos los inmuebles presentes resultados del tipo elegido, se ocultaran todos y se mostrara solo aquel que cumpla con el check

$(".contenedor_tipo_inmueble_busqueda .casilla_inm_py").click(function (e) {
    //alert('estamos en las casillas del proyecto, NO DE BUSQUEDA');

    let casilla_seleccionada = $(this).attr("seleccionado");

    if (casilla_seleccionada == "no") {
        // si la casilla estaba NO SELECCIONADA, entonces con el click, estara SI SELECCIONADA
        $(this).attr("seleccionado", "si");
    } else {
        // si la casilla estaba SI SELECCIONADA, entonces con el click, estara NO SELECCIONADA
        $(this).attr("seleccionado", "no");
    }

    let tipo_ventana = $(".tipo_ventana").attr("data-tipo_ventana");

    if (tipo_ventana != "busqueda-inm-cli") {
        // para FILTRAR LOS INMUEBLES PRESENTES
        // esta condicion evita que los inmuebles sean filtrados automaticamente en la ventana de RESPUESTA INMUEBLES
        // de manera que esta opcion solo opera cuando se esta en la ventan de inmuebles dentro del proyecto

        let n_inmuebles = $("#contenedor_py_inm_render .card_un_inm_py").length; // si hubieran ocultos, tambien entrarian en el conteo
        if (n_inmuebles > 0) {
            // se FILTRARA solo si existen inmuebles que FILTRAR
            let n_casillas = $(".casilla_inm_py").length;

            // revision con este click, si todos las casillas estan ahora seleccionadas, ('seleccionado' esta 'si') o si todos estan DEseleccionadas ('seleccionado' esta 'no')
            let n_seleccionados = 0;
            let n_deseleccionados = 0;

            for (let i = 0; i < n_casillas; i++) {
                let estado_casilla_i = $(".casilla_inm_py").eq(i).attr("seleccionado");
                if (estado_casilla_i == "si") {
                    n_seleccionados = n_seleccionados + 1;
                } else {
                    n_deseleccionados = n_deseleccionados + 1;
                }
            }

            if (n_seleccionados == n_casillas || n_deseleccionados == n_casillas) {
                $("#contenedor_py_inm_render .card_un_inm_py").attr("hidden", false); // mostramos todos los inmuebles presentes, segun el radio previo que se eligio
            } else {
                // recorremos todos las casillas, viendo quienes estan seleccionadas y mostrando solo a estas en la ventana del navegador
                $("#contenedor_py_inm_render .card_un_inm_py").attr("hidden", true); // ocultamos todos los inmuebles presentes

                for (let i = 0; i < n_casillas; i++) {
                    let estado_casilla_i = $(".casilla_inm_py").eq(i).attr("seleccionado");
                    if (estado_casilla_i == "si") {
                        // entonces mostramos a todos los inmuebles que cumplen con esta casilla
                        let casilla_valor_i = $(".casilla_inm_py").eq(i).attr("value").toLowerCase(); // llevado a minuscula por seguridad
                        for (let j = 0; j < n_inmuebles; j++) {
                            let aux_tipo_inmueble_j = $(
                                "#contenedor_py_inm_render .card_un_inm_py .v_tipo_inmueble"
                            ).eq(j)[0].innerText;
                            let tipo_inmueble_j = aux_tipo_inmueble_j.toLowerCase(); // llevado a minuscula por seguridad
                            if (casilla_valor_i == tipo_inmueble_j) {
                                $("#contenedor_py_inm_render .card_un_inm_py")
                                    .eq(j)
                                    .attr("hidden", false); // mostramos el inmueble
                            }
                        }
                    }
                }
            }
        }
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA BUSCAR INMUEBLES DENTRO DEL PROYECTO y dentro de PROPIETARIO

$("#palabras_buscar_py_inm").keyup(function (e) {
    $(".ref_titulo_py_inm_r_o_b .t1_inv_inm").attr("hidden", true); // ocultamos
    $(".ref_titulo_py_inm_r_o_b .t2_inv_inm").attr("hidden", true); // ocultamos

    $(".ref_titulo_py_inm_r_o_b .t_busqueda").attr("hidden", false); // mostramos
    $(".ref_titulo_py_inm_r_o_b .t_busqueda").text("Resultados busqueda");

    // bloqueamos las opciones de ordenamientos, esto para evitar que despues de una busqueda se realize de manera directa un ordenamiento, pues de permitirselo, no se sabria como ordenarlo, ya que las busquedas eliminan todos los inmuebles que estaban en "#contenedor_py_inm_render"
    $(".ul_ordenadores_inm_py .o_inm_py").attr("disabled", true); // como no es posible bloquear estos elementos, entonces ocultamos todo su contenedor
    $(".ul_ordenadores_inm_py").attr("hidden", true);

    // las opciones de ordenamientos solo pueden ser habilitadas con las seleccion de algun tipo de radio de tipo de inmueble

    // tambien bloqueamos las opciones de CASILLAS, estas solo podran ser habilitadas con la seleccion de algun radio de tipo de inmueble
    $(".casilla_inm_py").attr("disabled", true);

    if ($("#palabras_buscar_py_inm").val() != "") {
        buscarInmuebleInterior();
    } else {
        // si esta en vacio (limpiandolo con las teclas)
        // click en la opcion de radio "todos"
        $("#tipo_radio_inm_py .radio_inm_py").eq(0).click();
    }
});

function buscarInmuebleInterior() {
    let inmueble_buscar_palabras = $("#palabras_buscar_py_inm").val().toLowerCase(); // llevando todo a minuscula por seguridad (y a string por defecto)

    let arrayPalabras = inmueble_buscar_palabras.split(" "); // los separamos por espacios en blanco si existiesen

    // borramos los mensajes alert si es que existiesen por seguridad
    $("#contenedor_py_inm_render .mensaje_alerta_inv_inm").remove();

    // por cada inmueble armamos un gran string donde estaran la informacion mas relevante, donde se hara la busqueda de las palabras claves
    let n_inmuebles = $("#contenedor_py_inm_todos .card_un_inm_py").length;
    let arrayInmueblesHtml = [];
    let i_inm = -1;
    for (let n = 0; n < n_inmuebles; n++) {
        // en lugar de usar .html()     usar un metodo que lo convierte todo en STRING Y con esto buscar dentro de este string las palabras clave  ver EDTEAM
        let cardInmuebleString = $("#contenedor_py_inm_todos .card_un_inm_py")
            .eq(n)
            .text()
            .toLowerCase(); // llevando todo a minuscula  (y a string por defecto)

        let contador_encontrados = 0;
        for (let q = 0; q < arrayPalabras.length; q++) {
            if (cardInmuebleString.indexOf(arrayPalabras[q]) != -1) {
                contador_encontrados = contador_encontrados + 1;
            }
        }

        if (contador_encontrados == arrayPalabras.length) {
            // guardandolo con sus elementos HTML
            i_inm = i_inm + 1;
            arrayInmueblesHtml[i_inm] = $("#contenedor_py_inm_todos .card_un_inm_py").eq(n).html();
        }
    }

    // renderizamos los inmuebles ordenados
    $("#contenedor_py_inm_render .card_un_inm_py").remove(); // eliminamos los inmuebles presentes

    if (arrayInmueblesHtml.length > 0) {
        for (let r = 0; r < arrayInmueblesHtml.length; r++) {
            $("#contenedor_py_inm_render .ref_tipo_py_inm").after(
                `<div class="card_un_inm_py mb-3 col-12 col-md-6 col-lg-4 col-xl-3">` +
                    arrayInmueblesHtml[r] +
                    `</div>`
            );
        }
    } else {
        $("#contenedor_py_inm_render .ref_tipo_py_inm").after(
            `<div class="mensaje_alerta_inv_inm alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>No existen resultados!</strong>
            </div>`
        );
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/
