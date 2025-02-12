// PARA CUANDO LA PAGINA SE CARGUE DEL LADO DEL CLIENTE

$(document).ready(function () {
    //----------------------------------------
    // para los mensajes de icono informacion
    $('[data-toggle="popover"]').popover();

    // Cerrar el popover al hacer clic en el botón de cerrar
    // Cerrar el popover al hacer clic en el popover
    /*
    $('.mensaje_peter').on('click', function () {
        $('[data-toggle="popover"]').popover('toggle');
      });
      */

    //   $(document).on('click', function (e) {
    /*
        $(document).click(function (e) {
            if (!$(e.target).closest('[data-toggle="popover"]').length) {
              $('[data-toggle="popover"]').popover('hide');
            };
            */

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // PARA VENTANA CALCULADORA DE TERRENO

    // Obtener la URL actual
    var direccionUrl = window.location.href;
    // ------- Para verificación -------
    console.log("la url es:");
    console.log(direccionUrl);

    // Definir las palabras clave que deben estar en la URL
    var palabrasClave_1 = ["terreno", "calculadora"];

    // Verificar si todas las palabras clave están presentes en la URL
    var todasLasPalabrasPresentes_1 = palabrasClave_1.every((palabra) =>
        direccionUrl.includes(palabra)
    );

    if (todasLasPalabrasPresentes_1) {
        // ocultamos el contenedor que contienen a los resultados de los calculos y graficos
        $(".contenedor_1").hide();
        $(".contenedor_2").hide();
        $(".contenedor_3").hide();
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // PARA VENTANA CALCULADORA DE INMUEBLE ENTERO e INMUEBLE FRACCIONADO

    // Definir las palabras clave que deben estar en la URL
    var palabrasClave_2 = ["inmueble", "calculadora"];

    // Verificar si todas las palabras clave están presentes en la URL
    var todasLasPalabrasPresentes_2 = palabrasClave_2.every((palabra) =>
        direccionUrl.includes(palabra)
    );

    if (todasLasPalabrasPresentes_2) {
        // ocultamos el contenedor que contienen a los resultados de los calculos y graficos
        $(".contenedor_1").hide();
        $(".contenedor_2").hide();
        $(".contenedor_4").hide();
        $(".contenedor_5").hide();
        $(".contenedor_6").hide();
        $(".contenedor_7").hide();
        $(".contenedor_8").hide();
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // TIPO DE CAMBIO ----> ALMACENAMIENTO EN LA MEMORIA DEL NAVEGADOR

    let tipoCambio = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico

    let tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

    if (tipoCambio && tipoMoneda) {

        // Para visualizar el tipo de cambio en el menu dropdown
        $("#tcOficial").text(numero_punto_coma_query(tipoCambio));

        // ----------------------------------
        // funcion
        let datosMoneda = {
            tipoCambio,
            tipoMoneda,
        };

        tipoMonedaTipoCambio(datosMoneda);
        continuamosReady();
    } else {
        // Significa que SOLIDEXA es abierta por primera vez en el navegador del usuario, por tanto la moneda por defecto sera el BOLIVIANO Y debemos extraer de la base de datos el valor del tipo de cambio.

        $.ajax({
            type: "POST",
            url: "/empresa/operacion/tipo_cambio",
            dataType: "json", // Esto asegura que la respuesta se trate como JSON
        })
            .done(function (respuestaServidor) {
                if (respuestaServidor && respuestaServidor.tipoCambio) {
                    let aux_tipoCambio = respuestaServidor.tipoCambio;

                    // guardamos en sessionStorage del navegador con los nombres de: te_array_sus_m2 y te_array_periodo
                    // Como se trata de un solo valor no sera necesario usar JSON.stringify para guardar en la memoria sessionStorage.setItem.
                    sessionStorage.setItem("tipoCambio", aux_tipoCambio);

                    sessionStorage.setItem("tipoMoneda", "bs");

                    // como ya se encuentran guardados en la memoria del navegador, extraemos de esta los valores de tipoCambio y tipoMoneda

                    tipoCambio = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico
                    tipoMoneda = sessionStorage.getItem("tipoMoneda");

                    // Para visualizar el tipo de cambio en el menu dropdown
                    $("#tcOficial").text(numero_punto_coma_query(tipoCambio));

                    // ----------------------------------
                    // funcion
                    let datosMoneda = {
                        tipoCambio,
                        tipoMoneda,
                    };
                    tipoMonedaTipoCambio(datosMoneda);
                    continuamosReady();
                } else {
                    console.error("La respuesta del servidor es inválida.");
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error("Error al obtener el tipo de cambio:", textStatus, errorThrown);
            });
    }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CONTINUAMOS CON EL CODIGO CUANDO LA VENTANA DEL NAVEGADOR  YA ESTA RENDERIZADA Y LA MONEDA Y TIPO DE CAMBIO YA SON CONOCIDOS

function continuamosReady() {
    let tipoCambio = Number(sessionStorage.getItem("tipoCambio")); // ej: 7
    let tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

    if (tipoMoneda === "sus") {
        var cambio = tipoCambio;
    } else {
        if (tipoMoneda === "bs") {
            var cambio = 1;
        }
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // PARA RENDERIZAR LOS TEXTOS RESPETANDO LOS SALTOS DE LINEA
    var n_escrituras = $(".escritura").length;
    if (n_escrituras > 0) {
        for (let k = 0; k < n_escrituras; k++) {
            // es importante usar aqui ".text()" para que lea las etiquetas html (si es que existiesen) como tal, por ejemplo si existe un salto de linea como "<br>" el text lo leera como tal y luego usando el ".html()" lo inyectara (reemplazando contenido si es que existiese) como html dentro de ".escritura".
            // si en lugar de ".text()" se hubiese usado ".html()" entonces etiquetas como "<br>" hubiesen sido leidas como "&lgh ???" y no hubiesen sido leidos como tal "<br>"
            var contenido = $(".escritura").eq(k).text();
            $(".escritura").eq(k).html(contenido);
        }
    }

    /************************************************************************************ */
    // PARA LA VISUALIZACION DE LOS MAPAS DE GOOGLE MAPS
    var n_mapas = $("#mapa-vista").length;
    if (n_mapas > 0) {
        for (let k = 0; k < n_mapas; k++) {
            // es importante usar aqui ".text()" para que lea las etiquetas html (si es que existiesen) como tal, por ejemplo si existe un salto de linea como "<br>" el text lo leera como tal y luego usando el ".html()" lo inyectara (reemplazando contenido si es que existiese) como html dentro de "#mapa-vista".
            // si en lugar de ".text()" se hubiese usado ".html()" entonces etiquetas como "<br>" hubiesen sido leidas como "&lgh ???" y no hubiesen sido leidos como tal "<br>"
            var contenido = $("#mapa-vista").eq(k).text();
            $("#mapa-vista").eq(k).html(contenido);
        }
    }
    /************************************************************************************ */
    // PARA LA VISUALIZACION DE LOS VIDEOS DE YOUTUBE DE RESPONSABILIDAD SOCIAL
    var n_videos = $("#video-rs").length;
    if (n_videos > 0) {
        for (let k = 0; k < n_videos; k++) {
            // es importante usar aqui ".text()" para que lea las etiquetas html (si es que existiesen) como tal, por ejemplo si existe un salto de linea como "<br>" el text lo leera como tal y luego usando el ".html()" lo inyectara (reemplazando contenido si es que existiese) como html dentro de "#video-rs".
            // si en lugar de ".text()" se hubiese usado ".html()" entonces etiquetas como "<br>" hubiesen sido leidas como "&lgh ???" y no hubiesen sido leidos como tal "<br>"
            var contenido = $("#video-rs").eq(k).text();
            $("#video-rs").eq(k).html(contenido);
        }
    }
    /************************************************************************************ */

    // se hara click en el primer tipo radio de busqueda "Inmueble"
    $(".radio_tipo_busqueda").eq(0).click();

    // se hara click en el primer tipo radio de busqueda de inmuebles: "Disponible"
    $("#formulario_busqueda_cli .radio_inm_py_busq").eq(0).click();

    var tipo_ventana = $("#id_tipo_ventana").attr("data-tipo_ventana");
    let vemos = $("#id_objetivo_tipo").attr("data-objetivo_tipo");

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // RESULTADO DE UNA BUSQUEDA DE INMUEBLES

    if (vemos === "cards_proyectos" || vemos === "resultados_busqueda") {
        // contamos el numero de inmuebles si es que existiesen
        let n_proyectos = $("#contenedor_py_inm_render .card_un_inm_py").length;
        if (n_proyectos > 2) {
            // minimamente 2 cards para ser ordenados
            // hacemos click en el ordenamiento por defecto
            $("#orden_inm_exterior .orden_gral_inm_py").eq(0).click();
        }
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // PARA VENTANAS DE PROYECTO

    if (vemos === "proyecto") {
        let tipo_pestana_py = $("#tipo_pestana_py").attr("data-id");

        //alert("el tipo de pestaña del proyecto es: "+tipo_pestana_py);

        //alert('la pestaña es: ' + tipo_pestana_py);
        if (tipo_pestana_py == "inmuebles_py") {
            // --------------------------------------------------------------
            // PARA VISUALIZAR LOS INMUEBLES QUE TIENE EL PROYECTO
            // seleccionamos el radio tipo por defecto "todos"
            $("#tipo_radio_inm_py .radio_inm_py").eq(0).click(); // este click ejecuta por defecto el la primera opcion de ordenamiento por defecto (por lo escrito en su respectivo JQUERY)
            /// !!!! NOTESE COMO DE AQUI SE ENTRA A OTRA FUNCION Y DE ESA SE PASA A OTRA FUNCION Y CUANDO TODAS ESAS TERMINE, SE RETORNA A ESTA PARA CONTINUAR CON LAS LINEAS DE CODIGO QUE PUDIERAN EXISTIR DEBAJO DE ESTA
        }

        if (tipo_pestana_py == "descripcion_py") {
            // estamos en la pestaña de "descripcion" del proyecto, tratando un PROYECTO EN FONDEO
            //----------------------------------------------------------------------------
            // para segunderos $us/seg
            sus_seg();
        }

        if (tipo_pestana_py == "beneficios_py") {
            //---------------------------------------------------------
            // GRAFICO DE CONTRUCTORAS

            let n_filas = $("#constructoras_sobreprecios .cuerpo_filas .fila_ref").length;
            if (n_filas > 0) {
                // eliminamos la primera fila de la tabla de constructoras_sobreprecios, PORQUE ESA CORRESPONDE AL DE SOLIDEXA Y ESA NO DEBE YA SER MOSTRADA
                //$("#constructoras_sobreprecios .cuerpo_filas .fila_ref").eq(0).remove();
                //----------------------------------------------------------------------------

                let n_filas_r = $("#contenedor_constructoras .cuerpo").length;
                let array_nombre = [];
                let array_costo = [];
                let array_color = [];
                let array_borde = [];

                for (let i = 0; i < n_filas_r; i++) {
                    array_nombre[i] = $("#contenedor_constructoras .cuerpo .nombre")
                        .eq(i)
                        .attr("data-nombre");
                    let costo = Number(
                        $("#contenedor_constructoras .cuerpo .costo").eq(i).attr("data-costo")
                    );

                    // floor redondea al inmediato entero inferior y devuelve tipo numerico
                    array_costo[i] = Math.floor(costo / cambio);

                    if (i == 0) {
                        // si es la PRIMERA pertenece a SOLIDEXA
                        array_color[i] = "#0a58ae"; // #37acdf CON COLOR antes #46BFBD
                        array_borde[i] = "#065db9"; // CON COLOR
                    } else {
                        array_color[i] = "#949FB1"; // COLOR GRIS
                        array_borde[i] = "#919fb5"; // COLOR GRIS
                    }
                }

                if (tipoMoneda === "sus") {
                    var titulo_a = "Costo construcción " + "$us";
                } else {
                    if (tipoMoneda === "bs") {
                        var titulo_a = "Costo construcción " + "Bs";
                    }
                }

                let paqueteDatos_a = {
                    canvasId: "graficoSobreprecios",
                    etiquetas: array_nombre,
                    datasets: {
                        label: titulo_a,
                        data: array_costo,
                        color: array_color,
                        borde: array_borde,
                    },
                };

                grafico_x20(paqueteDatos_a);
            }

            //---------------------------------------------------------
            // GRAFICO DE PLUSVALIA

            let aux_precio_justo = Number($("#contenedor_plusvalia .costo").attr("data-costo"));
            let aux_plusvalia = Number(
                $("#contenedor_plusvalia .plusvalia").attr("data-plusvalia")
            );

            // floor redondea al inmediato entero inferior y devuelve tipo numerico
            let precio_justo = Math.floor(aux_precio_justo / cambio);
            let plusvalia = Math.floor(aux_plusvalia / cambio);

            let paqueteDatos_b = {
                canvasId: "graficoPlusvalia",
                etiquetas: ["Precio justo", "Plusvalía"],
                //etiquetas: ["SOLIDEXA"],
                datasets_1: {
                    label: "Precio justo",
                    data: [precio_justo],
                },
                datasets_2: {
                    label: "Plusvalía",
                    data: [plusvalia],
                },
            };

            grafico_20(paqueteDatos_b);
        }
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // PARA VENTANAS DE INMUEBLE

    if (vemos === "inmueble") {
        let tipo_pestana_inm = $("#tipo_pestana_inm").attr("data-id");

        if (tipo_pestana_inm == "descripcion_inm") {
            // estamos en la pestaña de "descripcion" del inmueble
            //----------------------------------------------------------------------------
            // para segunderos $us/seg
            sus_seg();
        }

        if (tipo_pestana_inm == "beneficios_inm") {
            //---------------------------------------------------------------------------
            // GRAFICO PRECIOS

            var n_filas = $("#diferencia_ganancias .cuerpo_filas .fila_ref").length;
            if (n_filas > 0) {
                //----------------------------------------------------------------------------

                let n_filas_r = $("#contenedor_precios_mercado .cuerpo").length;
                let array_direccion = [];
                let array_precios_mercado = []; // los precios de un inmueble llevado a igual superficie que el INMUEBLE de SOLIDEXA
                let array_color = [];
                let array_borde = [];

                for (let i = 0; i < n_filas_r; i++) {
                    array_direccion[i] = $(
                        "#contenedor_precios_mercado .cuerpo .direccion_comparativa"
                    )
                        .eq(i)
                        .attr("data-direccion");
                    let aux_precios = Number(
                        $("#contenedor_precios_mercado .cuerpo .sus_m2").eq(i).attr("data-dolarm2")
                    );

                    // floor redondea al inmediato entero inferior y devuelve tipo numerico
                    array_precios_mercado[i] = Math.floor(aux_precios / cambio);

                    if (i == 0) {
                        // el primer lugar del array esta ocupado por info de SOLIDEXA
                        array_color[i] = "#0a58ae"; // CON COLOR
                        array_borde[i] = "#065db9"; // CON COLOR
                    } else {
                        array_color[i] = "#949FB1"; // COLOR GRIS
                        array_borde[i] = "#919fb5"; // COLOR GRIS
                    }
                }

                if (tipoMoneda === "sus") {
                    var titulo_a = "Precios venta $us/m2";
                } else {
                    if (tipoMoneda === "bs") {
                        var titulo_a = "Precios venta Bs/m2";
                    }
                }

                let paqueteDatos_a = {
                    canvasId: "graficoPrecios",
                    etiquetas: array_direccion,
                    datasets: {
                        label: titulo_a,
                        data: array_precios_mercado,
                        color: array_color,
                        borde: array_borde,
                    },
                };

                grafico_x20(paqueteDatos_a);
            }

            //---------------------------------------------------------------------------
            // GRAFICO CONSTRUCTORAS

            var n_filas = $("#constructoras_sobreprecios .cuerpo_filas .fila_ref").length;
            if (n_filas > 0) {
                // eliminamos la primera fila de la tabla de constructoras_sobreprecios, PORQUE ESA CORRESPONDE AL DE SOLIDEXA Y ESA NO DEBE YA SER MOSTRADA
                // $("#constructoras_sobreprecios .cuerpo_filas .fila_ref").eq(0).remove();
                //----------------------------------------------------------------------------

                let n_filas_r = $("#contenedor_constructoras .cuerpo").length;
                let array_nombre = [];
                let array_costo = [];
                let array_color = [];
                let array_borde = [];

                for (let i = 0; i < n_filas_r; i++) {
                    array_nombre[i] = $("#contenedor_constructoras .cuerpo .nombre")
                        .eq(i)
                        .attr("data-nombre");

                    let costo = Number(
                        $("#contenedor_constructoras .cuerpo .costo").eq(i).attr("data-costo")
                    );

                    // floor redondea al inmediato entero inferior y devuelve tipo numerico
                    array_costo[i] = Math.floor(costo / cambio);

                    if (i == 0) {
                        // si es la PRIMERA, (que pertenece a SOLIDEXA)
                        array_color[i] = "#0a58ae"; // CON COLOR
                        array_borde[i] = "#065db9"; // CON COLOR
                    } else {
                        array_color[i] = "#949FB1"; // COLOR GRIS
                        array_borde[i] = "#919fb5"; // COLOR GRIS
                    }
                }

                if (tipoMoneda === "sus") {
                    var titulo_b = "Costo construcción $us";
                } else {
                    if (tipoMoneda === "bs") {
                        var titulo_b = "Costo construcción Bs";
                    }
                }

                let paqueteDatos_b = {
                    canvasId: "graficoSobreprecios",
                    etiquetas: array_nombre,
                    datasets: {
                        label: titulo_b,
                        data: array_costo,
                        color: array_color,
                        borde: array_borde,
                    },
                };

                grafico_x20(paqueteDatos_b);
            }

            //---------------------------------------------------------------------------
            // GRAFICO PLUSVALIA

            let aux_precio_justo = Number(
                $("#contenedor_plusvalia .precio_venta").attr("data-precio")
            );
            let aux_plusvalia = Number(
                $("#contenedor_plusvalia .plusvalia").attr("data-plusvalia")
            );

            // floor redondea al inmediato entero inferior y devuelve tipo numerico
            let precio_justo = Math.floor(aux_precio_justo / cambio);
            let plusvalia = Math.floor(aux_plusvalia / cambio);

            let paqueteDatos_c = {
                canvasId: "graficoPlusvalia",
                etiquetas: ["Precio justo", "Plusvalía"],
                //etiquetas: ["SOLIDEXA"],
                datasets_1: {
                    label: "Precio justo",
                    data: [precio_justo],
                },
                datasets_2: {
                    label: "Plusvalía",
                    data: [plusvalia],
                },
            };

            grafico_20(paqueteDatos_c);

            //---------------------------------------------------------------------------
        }

        if (tipo_pestana_inm == "calculadora_inm") {
            $(".calculadora_propietario").click();
            $(".comisionP").eq(0).click(); // seleccionamos el radio de comisión "no"

            // ocultamos los los elementos que contienen a los resultados de los calculos
            $(".contenedor_1").hide();
            $(".contenedor_moneda_1").hide();
            $(".contenedor_2").hide();
            $(".contenedor_moneda_2").hide();
            $(".total_comision").hide();
            $(".opciones_inversion").hide();

            // guardamos el ancho actual de la ventana, esto para evitar errores en la visualizacion de los graficos de barras con los velocimetros
            var anchoActual = $(window).width();
            $(".ancho_ventana").attr("data-ancho_ventana", anchoActual);
        }

        if (tipo_pestana_inm == "inversor_inm") {
            // DENTRO DE LA VENTANA DE "INMUEBLE"
            //----------------------------------------------------------------------------
            // para segunderos $us/seg
            ////////sus_seg(); EN ESTA VENTANA NO EXISTE SEGUNDERO
        }
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // cuando se este en la ventana privada del propietario

    if (vemos === "propietario") {
        let tipo_pestana_prop = $("#tipo_pestana_prop").attr("data-id");

        //alert("el tipo de pestaña del PROPIETARIO es: "+tipo_pestana_prop);

        //alert('la pestaña es: ' + tipo_pestana_prop);
        if (tipo_pestana_prop == "propiedades_propietario") {
            // --------------------------------------------------------------
            // PARA VISUALIZAR LOS INMUEBLES QUE TIENE EL PROPIETARIO
            // seleccionamos el radio tipo por defecto "todos"
            $("#tipo_radio_inm_py .radio_inm_py").eq(0).click(); // este click ejecuta por defecto el la primera opcion de ordenamiento por defecto (por lo escrito en su respectivo JQUERY)
            /// !!!! NOTESE COMO DE AQUI SE ENTRA A OTRA FUNCION Y DE ESA SE PASA A OTRA FUNCION Y CUANDO TODAS ESAS TERMINE, SE RETORNA A ESTA PARA CONTINUAR CON LAS LINEAS DE CODIGO QUE PUDIERAN EXISTIR DEBAJO DE ESTA
        }

        //alert('la pestaña es: ' + tipo_pestana_prop);
        if (tipo_pestana_prop == "guardados_propietario") {
            // --------------------------------------------------------------
            // PARA VISUALIZAR LOS INMUEBLES QUE TIENE EL PROPIETARIO
            // seleccionamos el radio tipo por defecto "todos"
            $("#tipo_radio_inm_py .radio_inm_py").eq(0).click(); // este click ejecuta por defecto el la primera opcion de ordenamiento por defecto (por lo escrito en su respectivo JQUERY)
            /// !!!! NOTESE COMO DE AQUI SE ENTRA A OTRA FUNCION Y DE ESA SE PASA A OTRA FUNCION Y CUANDO TODAS ESAS TERMINE, SE RETORNA A ESTA PARA CONTINUAR CON LAS LINEAS DE CODIGO QUE PUDIERAN EXISTIR DEBAJO DE ESTA
        }

        //----------------------------------------------------------------------------
        // para segunderos $us/seg
        let segundero = $(".segundero_propietario").attr("data-segundero");
        if (segundero == "si") {
            sus_seg();
        }
        /* 
        function sus_seg() {
            ...
        }
        */
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    if (tipo_ventana == "cliente-inicio") {
        $("#id_body").addClass("inicio_h_v");

        // antes no estaba
        // esto es para cuando la pagian se cargue o aparesca por primera vez
        dim_ventana_inicio();
    } else {
        // normal

        $("#id_body").removeClass("inicio_h_v");
    }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// FUNCION SEGUNDERO PARA: PROYECTO, INMUEBLE, PROPIETARIO, FRACCION

function sus_seg() {
    setInterval(() => {
        //----------------------------------------------------------------------------
        let tipoCambio = Number(sessionStorage.getItem("tipoCambio")); // ej: 7
        let tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

        if (tipoMoneda === "sus") {
            var cambio = tipoCambio;
        } else {
            if (tipoMoneda === "bs") {
                var cambio = 1;
            }
        }
        //----------------------------------------------------------------------------
        // SEGUNDERO DE PLUSVALIA

        var plus_r = 0; // bs/seg
        var plus_fechaInicio = new Date();
        var plus_fechaFin = new Date();

        var a_plus_r = []; // bs/seg
        var p_verificador = 0;
        var s_plus_t = 0; // bs
        var s_plus_r = 0; // bs

        var n_plus = $("#contenedor_seg_plus .cuerpo_plus").length;
        if (n_plus > 0) {
            for (let i = 0; i < n_plus; i++) {
                /*
                antes
                plus_r = Number(
                    $("#contenedor_seg_plus .cuerpo_plus .plus_r").eq(i).attr("data-plus_r")
                );
                */

                plus_r =
                    Number(
                        $("#contenedor_seg_plus .cuerpo_plus .plus_r").eq(i).attr("data-plus_r")
                    ) / cambio;

                a_plus_r[i] = plus_r;

                let aux_r_fi = $("#contenedor_seg_plus .cuerpo_plus .plus_fechaInicio")
                    .eq(i)
                    .attr("data-plus_fechaInicio");

                plus_fechaInicio = new Date(aux_r_fi); // convertimos a formato fecha

                let aux_r_ff = $("#contenedor_seg_plus .cuerpo_plus .plus_fechaFin")
                    .eq(i)
                    .attr("data-plus_fechaFin");

                plus_fechaFin = new Date(aux_r_ff); // convertimos a formato fecha

                /*
                antes
                s_plus_t = s_plus_t + ((plus_fechaFin - plus_fechaInicio) / 1000) * plus_r;
                */

                s_plus_t =
                    s_plus_t + ((plus_fechaFin - plus_fechaInicio) / 1000) * (plus_r / cambio);

                let r_d_t = (plus_fechaFin - plus_fechaInicio) / 1000;
                let r_d_p = (new Date() - plus_fechaInicio) / 1000;

                if (r_d_p >= r_d_t) {
                    /*
                    antes
                    s_plus_r = s_plus_r + r_d_t * plus_r;
                    */
                    s_plus_r = s_plus_r + r_d_t * (plus_r / cambio);
                }
                if (r_d_p < r_d_t) {
                    /*
                    antes
                    s_plus_r = s_plus_r + r_d_p * plus_r;
                    */
                    s_plus_r = s_plus_r + r_d_p * (plus_r / cambio);
                }

                if (plus_r != 0) {
                    p_verificador = p_verificador + 1;
                }
            }
        }

        if (p_verificador == 0) {
            $("#entero_tot_ret_alq").text("0");

            //$("#decimales_tot_ret_alq").text(",000");
            $(".cd").eq(0).text(",");
            $(".cd").eq(1).text("0");
            $(".cd").eq(2).text("0");
            $(".cd").eq(3).text("0");
            //$(".cd").eq(4).attr("hidden", false); // ocultamos
            $(".cd").eq(4).css("display", "none"); // ocultamos

            let r_aux_string_progre = "0" + "%";
            $("#ref_progreso_generandose").css("width", r_aux_string_progre);
            $("#ref_valor_progreso_generandose").text(r_aux_string_progre);
        } else {
            // Usar Math.max con el operador de propagación para obtener el valor máximo
            let plus_r_max = Math.max(...a_plus_r); // el valor maximo de Bs/seg

            let string_plus_r_max = plus_r_max.toString();

            for (let t = 0; t < string_plus_r_max.length; t++) {
                // las posiciones de una cadena empiezan desde CERO
                let porsion = string_plus_r_max.substring(t, t + 1);

                if (porsion != "0" && porsion != ".") {
                    //console.log("entramos al caracter dist cero: " + t);
                    // entonces la posicion es el de un numero superior a cero
                    var n_casillas_deci = t - 1;
                    break; // para salir de este bucle for
                }
            }

            let string_s_plus_r = s_plus_r.toString();
            let array_aux = string_s_plus_r.split(".");
            let val_entero = array_aux[0];
            let aux_decimal = array_aux[1].substring(0, n_casillas_deci);

            //---------------------------------------------------------
            // "val_entero" se lo convertira en formato español punto mil:
            let el_numero = Number(val_entero);
            let aux_num_string = el_numero.toLocaleString("en"); // LO DEVUELVE EN FORMATO INGLES Y EN STRING

            let numero_convertido = aux_num_string
                .replace(".", "#")
                .replace(",", ".")
                .replace("#", ","); // LO CONVIERTE A FORMATO ESPAÑOL, Y EN STRING

            $("#entero_tot_ret_alq").text(numero_convertido);

            //==========================================================
            var arr = Array.from(aux_decimal); // convierte a "aux_decimal" en un array separandolo en cada uno de sus caracteres. ej/ 539 = [5, 3, 9]
            // ncd = 5: número de ".cd" caracteres para decimales (incluido la coma,)
            // n_casillas_deci: número de decimales ( sin inluir la coma, )
            var ncd = 5;
            if (ncd > n_casillas_deci) {
                $(".cd").eq(0).text(",");
                for (var ii = 0; ii < arr.length; ii++) {
                    $(".cd")
                        .eq(ii + 1)
                        .text(arr[ii]);
                }

                // ocultamos las casillas que no seran llenadas con decimales
                for (let j = ii + 1; j < ncd; j++) {
                    $(".cd").eq(j).css("display", "none"); // ocultamos
                }
            } else {
                // entonces solo seran mostrados hasta maximo: 4 digitos de los decimales, que incluido con la coma "," ocuparan la totalidad de los 5 ".cd"
                for (let k = 0; k < ncd; k++) {
                    $(".cd")
                        .eq(k + 1)
                        .text(arr[k]);
                }
            }
            //==========================================================

            let porcen_progreso = ((s_plus_r / s_plus_t) * 100).toFixed(2); // con 2 decimales
            let aux_string_progre = porcen_progreso + "%";
            $("#ref_progreso_generandose").css("width", aux_string_progre);

            let num_punto_coma = numero_punto_coma_query(porcen_progreso);

            let formato_punto_coma = num_punto_coma + " %";
            $("#ref_valor_progreso_generandose").text(formato_punto_coma);
        }
        //----------------------------------------------------------------------------
    }, 1000);
}

/**************************************************************************** */
// esta funcion se ejecutara para cuando la pagina se modifique manualmente las dimensiones de la ventana o cuando se cambia de pocision el smartphone
$(window).resize(function () {
    var tipo_ventana = $("#id_tipo_ventana").attr("data-tipo_ventana");
    if (tipo_ventana == "cliente-inicio") {
        dim_ventana_inicio();
    } else {
        // para la pestaña de "calculadora" del inmueble
        let vemos = $("#id_objetivo_tipo").attr("data-objetivo_tipo");
        if (vemos == "inmueble") {
            let tipo_pestana_inm = $("#tipo_pestana_inm").attr("data-id");
            if (tipo_pestana_inm == "calculadora_inm") {
                var anchoAnterior = Number($(".ancho_ventana").attr("data-ancho_ventana"));
                var anchoActual = $(window).width();

                if (anchoActual !== anchoAnterior) {
                    // si el ancho actual es diferente al ancho anterior, con esto se evita que el grafico de velocimetro cambie bruscamente a grafico de barras al momento de deslizar con los dedos la pantalla en pantalla celular.
                    // Obtener el valor de la propiedad CSS 'display' del elemento con la clase 'opciones_inversion'
                    var display_1 = $(".opciones_inversion").css("display");
                    if (display_1 == "block") {
                        // si el elemento SI esta visible en la ventana

                        var ancho_ventana = $(window).width(); // resultado en px
                        // if (ancho_ventana >= 575) {
                        if (ancho_ventana > 575) {
                            // si es mayor que 575px
                            // entonces se visualizara las graficas de barras y velocimetros

                            $(".gra_velocimetro").css("display", "block");
                            $(".texto_velocimetro").css("display", "block");
                            $(".gra_barras").css("display", "block");
                            $(".texto_barras").css("display", "block");

                            // se ocultara las flechas de desplazamiento
                            $(".contenedor_desplazamiento").css("display", "none");
                        } else {
                            // si es menor que 575px

                            // se visualizara las flechas de desplazamiento
                            $(".contenedor_desplazamiento").css("display", "block");

                            //--------------------------------------------------------
                            // visualizamos siempre el grafico de barras para que sus dimensiones de ancho y altura no se anulen automaticamente poniendose a valor CERO.

                            $(".gra_velocimetro").css("display", "none");
                            $(".texto_velocimetro").css("display", "none");
                            $(".gra_barras").css("display", "block");
                            $(".texto_barras").css("display", "block");

                            // para que cuando se de en el boton de desplazamiento el proximo grafico que se visualice sea el de "velocimetros"
                            $(".aux_desplazamiento").attr("data-desplazamiento", "barras");
                        }
                    }

                    // actualizamos el ancho de la ventana actual
                    $(".ancho_ventana").attr("data-ancho_ventana", anchoActual);
                }
            }
        }
    }
});

//----------------------------------------------------------
// solo para cerrar los mensajes "popover" cuando se hace click en cualquier punto de la ventana de la web
// oculta todos los mensajes "popover" que estuvieran visibles
$(document).click(function (e) {
    if (!$(e.target).closest('[data-toggle="popover"]').length) {
        $('[data-toggle="popover"]').popover("hide");
    }
});

//---------------------------------------------
// para animacion de las cajas caidas de una en una

function dim_ventana_inicio() {
    //---------------------------------------------
    // para cambiar la "background-image" dependiendo de las diensiones de la ventana

    var ventana_madre_ancho = $(window).width(); // resultado en px

    //console.log("ancho ventana madre: " + ventana_madre_ancho);

    // inicialmente ya esta condicionado que estamos en la ventana de inicio del administrador (ventana de la caida de cuadros), por tanto esta ventana cuenta con las url de las imagenes: vertica y horizontal
    var url_vertical = $("#url_vertical").attr("data-url_img");
    var url_horizontal = $("#url_horizontal").attr("data-url_img");

    var css_horizontal = `linear-gradient(rgba(16, 16, 21, 0.8), rgba(14, 14, 23, 0.8)),
    url(${url_horizontal})`;

    var css_vertical = `linear-gradient(rgba(16, 16, 21, 0.8), rgba(14, 14, 23, 0.8)),
    url(${url_vertical})`;

    if (ventana_madre_ancho >= 768) {
        // si es igual o mayor que 768px
        $(".inicio_h_v").css("background-image", css_horizontal);
    } else {
        // si es menor que 768px
        $(".inicio_h_v").css("background-image", css_vertical);
    }

    //---------------------------------------------
    // para animacion de las cajas caidas de una en una

    // var ventana_ancho = $(window).width(); // resultado en px
    // var ventana_alto = $(window).height(); // resultado en px

    var ventana_ancho = $(".contenedor-icono-info-hijo").width(); // resultado en px
    //console.log("ancho contenedor hijo: " + ventana_ancho);
    //var ventana_alto = $(".contenedor-icono-info-hijo").height(); // resultado en px
    var n = $(".contenedor-icono-info-1").length;
    var separacion_i = [];
    var array_porcen_separ_izq = [10, 95, 50, 20, 80, 40];
    for (let i = 0; i < n; i++) {
        let ancho_i = $(".contenedor-icono-info-1").eq(i).width();
        //console.log("ancho elemento: " + ancho_i);
        separacion_i[i] = (ventana_ancho - ancho_i) * (array_porcen_separ_izq[i] / 100); // en px
        $(".contenedor-icono-info-1").eq(i).css("left", separacion_i[i]);
        //console.log(separacion_i[i]);
    }

    //alert("ancho: " + ventana_ancho + "alto: " + ventana_alto);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function tipoMonedaTipoCambio(datosMoneda) {
    let tipoCambio = datosMoneda.tipoCambio; // ej/ 7
    let tipoMoneda = datosMoneda.tipoMoneda; // bs o sus

    if (tipoMoneda === "sus") {
        //---------------------------------------------
        // para cambio de valor monetario de Bs a $us
        let n_valores = $(".elvalor").length;
        if (n_valores > 0) {
            for (let k = 0; k < n_valores; k++) {
                // extraemos el valor numerico del valor en Bs
                let e_valor_bs = Number($(".elvalor").eq(k).attr("data-bs"));

                // cambiamos el valor a dolares
                let aux_sus = e_valor_bs / tipoCambio;
                // para evitar decimales redondeamos el valor al inmediato inferior entero
                let redondeado = Math.floor(aux_sus); // floor devuelve tipo numerico
                let sus_render = numero_punto_coma_query(redondeado);
                $(".elvalor").eq(k).text(sus_render);

                // Notese que el atributo data-bs nunca es modificado ya que este valor proviene directamente del servidor en moneda Bs y es util para cambios de moneda a dolar
            }
        }

        //---------------------------------------------
        // para cambio de valor monetario de Bs a $us en INPUTS type "text"
        let n_valores_i = $(".elvalorinput").length;
        if (n_valores_i > 0) {
            for (let k = 0; k < n_valores_i; k++) {
                // extraemos el valor numerico del valor en Bs
                let e_valor_bs = Number($(".elvalorinput").eq(k).attr("data-bs"));

                // cambiamos el valor a dolares
                let aux_sus = e_valor_bs / tipoCambio;
                // para evitar decimales redondeamos el valor al inmediato inferior entero
                let redondeado = Math.floor(aux_sus); // floor devuelve tipo numerico
                let redondeado_render = numero_punto_coma_query(redondeado);
                $(".elvalorinput").eq(k).val(redondeado_render);
            }
        }

        //---------------------------------------------
        // para cambio de valor monetario de Bs a $us en INPUTS RANGE
        let n_valores_r = $(".elvalorrange").length;
        if (n_valores_r > 0) {
            for (let k = 0; k < n_valores_r; k++) {
                // extraemos el valor numerico del valor en Bs
                let e_valor_bs = Number($(".elvalorrange").eq(k).attr("data-bs"));

                // cambiamos el valor a dolares
                let aux_sus = e_valor_bs / tipoCambio;
                // para evitar decimales redondeamos el valor al inmediato inferior entero
                let redondeado = Math.floor(aux_sus); // floor devuelve tipo numerico
                $(".elvalorrange").eq(k).val(redondeado);

                //------------
                let e_valor_bs_min = Number($(".elvalorrange").eq(k).attr("data-bs_min"));
                let aux_sus_min = e_valor_bs_min / tipoCambio;
                let redondeado_min = Math.floor(aux_sus_min);
                $(".elvalorrange").eq(k).attr("min", redondeado_min);
                //------------
                let e_valor_bs_max = Number($(".elvalorrange").eq(k).attr("data-bs_max"));
                let aux_sus_max = e_valor_bs_max / tipoCambio;
                let redondeado_max = Math.floor(aux_sus_max);
                $(".elvalorrange").eq(k).attr("min", redondeado_max);

                // Notese que cambiamos los atributos de: value, min, max PARA QUE EL PUNTO DEL RANGUE SE POSICIONE EN EL LUGAR CORRECTO Y RESPETE LOS LIMITES MAXIMO Y MINIMO
            }
        }
        //---------------------------------------------
        // para cambio de simbolo monetario de Bs a $us
        let n_simbolos = $(".lamoneda").length;
        if (n_simbolos > 0) {
            for (let k = 0; k < n_simbolos; k++) {
                // cambiamos el valor a dolares
                $(".lamoneda").eq(k).text("$us");
            }
        }
    }

    if (tipoMoneda === "bs") {
        //---------------------------------------------
        // para cambio de valor monetario de Bs a $us
        let n_valores = $(".elvalor").length;
        if (n_valores > 0) {
            for (let k = 0; k < n_valores; k++) {
                // extraemos el valor numerico del valor en Bs
                let e_valor_bs = Number($(".elvalor").eq(k).attr("data-bs"));

                // para evitar decimales redondeamos el valor al inmediato inferior entero
                let redondeado = Math.floor(e_valor_bs); // floor devuelve tipo numerico
                let bs_render = numero_punto_coma_query(redondeado);
                $(".elvalor").eq(k).text(bs_render);

                // Notese que el atributo data-bs nunca es modificado ya que este valor proviene directamente del servidor en moneda Bs y es util para cambios de moneda a dolar
            }
        }

        //---------------------------------------------
        // para cambio de valor monetario de Bs a $us en INPUTS type "text"
        let n_valores_i = $(".elvalorinput").length;
        if (n_valores_i > 0) {
            for (let k = 0; k < n_valores_i; k++) {
                // extraemos el valor numerico del valor en Bs
                let e_valor_bs = Number($(".elvalorinput").eq(k).attr("data-bs"));

                // para evitar decimales redondeamos el valor al inmediato inferior entero
                let redondeado = Math.floor(e_valor_bs); // floor devuelve tipo numerico
                let redondeado_render = numero_punto_coma_query(redondeado);
                $(".elvalorinput").eq(k).val(redondeado_render);
            }
        }

        //---------------------------------------------
        // para cambio de valor monetario de Bs a $us en INPUTS RANGE
        let n_valores_r = $(".elvalorrange").length;
        if (n_valores_r > 0) {
            for (let k = 0; k < n_valores_r; k++) {
                let e_valor_bs = Number($(".elvalorrange").eq(k).attr("data-bs"));
                // para evitar decimales redondeamos el valor al inmediato inferior entero
                let redondeado = Math.floor(e_valor_bs); // floor devuelve tipo numerico
                $(".elvalorrange").eq(k).val(redondeado);

                //------------
                let e_valor_bs_min = Number($(".elvalorrange").eq(k).attr("data-bs_min"));
                let redondeado_min = Math.floor(e_valor_bs_min);
                $(".elvalorrange").eq(k).attr("min", redondeado_min);
                //------------
                let e_valor_bs_max = Number($(".elvalorrange").eq(k).attr("data-bs_max"));
                let redondeado_max = Math.floor(e_valor_bs_max);
                $(".elvalorrange").eq(k).attr("min", redondeado_max);

                // Notese que cambiamos los atributos de: value, min, max PARA QUE EL PUNTO DEL RANGUE SE POSICIONE EN EL LUGAR CORRECTO Y RESPETE LOS LIMITES MAXIMO Y MINIMO
            }
        }
        //---------------------------------------------

        //---------------------------------------------
        // para cambio de simbolo monetario de Bs a $us
        let n_simbolos = $(".lamoneda").length;
        if (n_simbolos > 0) {
            for (let k = 0; k < n_simbolos; k++) {
                // cambiamos el valor a dolares
                $(".lamoneda").eq(k).text("Bs");
            }
        }
    }
    // ----------------------------
    // el tipo de moneda del menu superior se cambia al tipo de moneda seleccionado
    $("#moneda").attr("data-moneda", tipoMoneda);
    if (tipoMoneda === "bs") {
        $("#moneda_bandera").attr("src", "/rutavirtualpublico/imagenes/bolivia.png");
        $("#moneda").text("Bs");
    }
    if (tipoMoneda === "sus") {
        $("#moneda_bandera").attr("src", "/rutavirtualpublico/imagenes/usa.png");
        $("#moneda").text("$us");
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// caluculo del tiempo de espera para que el inmueble o terreno tradicional iguale a la plusvalia de SOLIDEXA

function tiempoEsperaPlusvalia(paqueteria) {
    let pronostico_pm2 = paqueteria.pronostico_pm2;
    let pronostico_periodo = paqueteria.pronostico_periodo;
    let promedio_pm2 = paqueteria.promedio_pm2;
    let solidexa_pm2 = paqueteria.solidexa_pm2;
    let tradicional_pm2 = paqueteria.tradicional_pm2;

    let year_espera = 5; // por defecto

    let fecha_actual = new Date();
    // Extraemos el mes utilizando el método getMonth()
    let mes_actual = fecha_actual.getMonth(); // devolvera un valor numerico entre 0 a 11
    let year_actual = fecha_actual.getFullYear(); // devuelve en numerico el año actual

    if (mes_actual <= 5) {
        var semestre = "I";
    } else {
        var semestre = "II";
    }

    // formato: "2019 - II"
    let periodo = year_actual + " - " + semestre;

    if (pronostico_pm2.length > 0 && pronostico_periodo.length > 0) {
        let meta = promedio_pm2 + (tradicional_pm2 - solidexa_pm2);

        for (let i = 0; i < pronostico_periodo.length; i++) {
            let elemento = pronostico_periodo[i];
            if (elemento == periodo) {
                var aux_sus_m2 = pronostico_pm2[i];
                break; // para salir del bucle for
            }
        }
        let factor = promedio_pm2 - aux_sus_m2;
        for (let j = 0; j < pronostico_pm2.length; j++) {
            if (pronostico_pm2[j] + factor >= meta) {
                let aux_periodo = pronostico_periodo[j]; // formato: "2019 - II"
                let aux_array = aux_periodo.split(" ");
                let year_meta = Number(aux_array[0]);
                // entonces calculamos el numero de años de espera
                year_espera = year_meta - year_actual;
                break; // para salir del bucle for
            }
        }
    }
    return year_espera;
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// grafico 2 barras independientes. Util para mostrar una barra el precio justo y la otra barra a su lado mostrando su plusvalia como ganancia.

function grafico_20(paqueteDatos) {
    let canvasId = paqueteDatos.canvasId;
    let etiquetas = paqueteDatos.etiquetas; // []
    let label_1 = paqueteDatos.datasets_1.label;
    let data_1 = paqueteDatos.datasets_1.data; // []
    let label_2 = paqueteDatos.datasets_2.label;
    let data_2 = paqueteDatos.datasets_2.data; // []

    var datos = {
        type: "bar",
        data: {
            labels: etiquetas, // []
            datasets: [
                {
                    label: label_1,
                    data: data_1, // []
                    backgroundColor: "#3A91FF", // Color de las barras
                    stack: "Stack 0", // indica que es una barra separada de la siguiente
                },
                {
                    label: label_2,
                    data: data_2, // []
                    backgroundColor: "#3A91FF", // Color de las barras
                    stack: "Stack 1",
                },
            ],
        },
        options: {
            //responsive: true,
            // en "false" Esto desactivará la relación de aspecto predeterminada y permitirá que el lienzo del gráfico se ajuste a la altura y el ancho especificados.
            maintainAspectRatio: false,

            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],

                //----
                // para ancho de la barras
                // Ajusta el porcentaje de ancho de las barras (por ejemplo, 0.7 para un 70%)
                xAxes: [
                    {
                        barPercentage: 0.5,
                    },
                ],
                //----
            },

            //////////////
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                },
            },
            //////////////
        },
    };

    var canvas = document.getElementById(canvasId).getContext("2d");
    new Chart(canvas, datos);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// grafico 1 barra dividida en 2

function grafico_12(paqueteDatos) {
    let canvasId = paqueteDatos.canvasId;
    let etiquetas = paqueteDatos.etiquetas; // []
    let label_1 = paqueteDatos.datasets_1.label;
    let data_1 = paqueteDatos.datasets_1.data; // []
    let label_2 = paqueteDatos.datasets_2.label;
    let data_2 = paqueteDatos.datasets_2.data; // []

    var datos = {
        type: "bar",
        data: {
            labels: etiquetas, // []
            datasets: [
                // barra inferior:
                {
                    label: label_1,
                    data: data_1, // []
                    backgroundColor: "#FF6F31", // Color de las barras para el Precio
                },
                // barra superior:
                {
                    label: label_2,
                    data: data_2, // []
                    backgroundColor: "#3A91FF", // Color de las barras para el Plusvalía
                },
            ],
        },
        options: {
            // en "false" Esto desactivará la relación de aspecto predeterminada y permitirá que el lienzo del gráfico se ajuste a la altura y el ancho especificados.
            maintainAspectRatio: false,

            scales: {
                xAxes: [
                    {
                        stacked: true, // Apila las barras horizontalmente

                        // Ajusta el porcentaje de ancho de las barras (por ejemplo, 0.7 para un 70%)
                        barPercentage: 0.4,
                    },
                ],
                yAxes: [
                    {
                        stacked: true, // Apila las barras verticalmente
                    },
                ],
            },
        },
    };

    // Obtén el contexto del lienzo
    var canvas = document.getElementById(canvasId).getContext("2d");

    // Crea el gráfico de barras apiladas
    new Chart(canvas, datos);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// grafico 2 barras dividida en 1

function grafico_21(paqueteDatos) {
    let canvasId = paqueteDatos.canvasId;
    let etiquetas = paqueteDatos.etiquetas; // []
    let label = paqueteDatos.datasets.label;
    let data = paqueteDatos.datasets.data; // []

    var datos = {
        type: "bar",
        data: {
            labels: etiquetas, // []
            datasets: [
                {
                    label: label,
                    data: data, // []
                    backgroundColor: "#3A91FF", // Color de las barras para el Plusvalia
                },
            ],
        },
        options: {
            scales: {
                xAxes: [
                    {
                        // Ajusta el porcentaje de ancho de las barras (por ejemplo, 0.7 para un 70%)
                        barPercentage: 0.4,
                    },
                ],
            },
        },
    };

    var canvas = document.getElementById(canvasId).getContext("2d");
    new Chart(canvas, datos);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// grafico 2 barras dividida en 2

function grafico_22(paqueteDatos) {
    let canvasId = paqueteDatos.canvasId;
    let etiquetas = paqueteDatos.etiquetas; // []
    let label_1 = paqueteDatos.datasets_1.label;
    let data_1 = paqueteDatos.datasets_1.data; // []
    let label_2 = paqueteDatos.datasets_2.label;
    let data_2 = paqueteDatos.datasets_2.data; // []

    var datos = {
        type: "bar",
        data: {
            labels: etiquetas, // []
            datasets: [
                {
                    label: label_1,
                    data: data_1, // []
                    backgroundColor: "#FF6F31", // Color de las barras para el Precio
                },
                {
                    label: label_2,
                    data: data_2, // []
                    backgroundColor: "#3A91FF", // Color de las barras para el Plusvalía
                },
            ],
        },
        options: {
            scales: {
                xAxes: [
                    {
                        stacked: true, // Apila las barras horizontalmente

                        // Ajusta el porcentaje de ancho de las barras (por ejemplo, 0.7 para un 70%)
                        barPercentage: 0.4,
                    },
                ],
                yAxes: [
                    {
                        stacked: true, // Apila las barras verticalmente
                    },
                ],
            },
        },
    };

    var canvas = document.getElementById(canvasId).getContext("2d");
    new Chart(canvas, datos);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// grafico varias barras, PARA BENEFICIOS DE PROYECTO (constructora), INMUEBLE (constructoa, precios de otros dptos)

function grafico_x20(paqueteDatos) {
    let canvasId = paqueteDatos.canvasId;
    let etiquetas = paqueteDatos.etiquetas; // []
    let label = paqueteDatos.datasets.label;
    let data = paqueteDatos.datasets.data; // []
    let color = paqueteDatos.datasets.color; // []
    let borde = paqueteDatos.datasets.borde; // []

    var datos = {
        type: "bar",
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: label,
                    data: data, // []
                    backgroundColor: color, // []
                    ////////
                    // Bordes y sombras:
                    borderColor: borde, // [] Cambia los colores de los bordes de las barras
                    borderWidth: 2, // 2 Ancho del borde de las barras
                    ////////
                },
            ],
        },
        options: {
            //responsive: true,
            // en "false" Esto desactivará la relación de aspecto predeterminada y permitirá que el lienzo del gráfico se ajuste a la altura y el ancho especificados.
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],

                //----
                // para ancho de la barras
                // Ajusta el porcentaje de ancho de las barras (por ejemplo, 0.7 para un 70%)
                xAxes: [
                    {
                        barPercentage: 0.7,
                    },
                ],
                //----
            },
        },
    };

    // Crear el gráfico
    var canvas = document.getElementById(canvasId).getContext("2d");
    new Chart(canvas, datos);
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// grafico varias barras, en grupos de 2 y cada barra dividida en 1

function grafico_x21(paqueteDatos) {
    let canvasId = paqueteDatos.canvasId;
    let etiquetas = paqueteDatos.etiquetas; // []
    let label_1 = paqueteDatos.datasets_1.label;
    let data_1 = paqueteDatos.datasets_1.data; // []
    let label_2 = paqueteDatos.datasets_2.label;
    let data_2 = paqueteDatos.datasets_2.data; // []

    var datos = {
        type: "bar",
        data: {
            labels: etiquetas, // [ ] Eje X (meses)
            datasets: [
                // desprotegido:
                {
                    label: label_1,
                    data: data_1, // [ ]  Valores del primer caso
                    backgroundColor: "rgba(255, 99, 132, 0.6)", // Color de las barras
                    borderColor: "rgba(255, 99, 132, 1)", // Color del borde
                    borderWidth: 1,
                },
                // protegido:
                {
                    label: label_2,
                    data: data_2, // [ ] Valores del segundo caso
                    backgroundColor: "rgba(54, 162, 235, 0.6)", // Color de las barras
                    borderColor: "rgba(54, 162, 235, 1)", // Color del borde
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, // Mostrar la leyenda
                    position: "top",
                },
            },
            scales: {
                x: {
                    stacked: false, // Las barras no estarán apiladas
                },
                y: {
                    beginAtZero: true, // Comienza el eje Y en cero
                },
            },
        },
    };

    // Crear el gráfico
    var canvas = document.getElementById(canvasId).getContext("2d");
    new Chart(canvas, datos);
}

//====================================================================
//====================================================================

function tePronosticoPrecioM2(paqueteDatos) {
    let tipoMoneda = paqueteDatos.tipoMoneda; // sus o bs
    let tc_oficial = paqueteDatos.tc_oficial;

    // sessionStorage: Los datos permanecen solo durante la sesión del navegador. Se eliminan automáticamente cuando se cierra la pestaña o la ventana.

    var datos_1 = sessionStorage.getItem("te_array_sus_m2");
    var datos_2 = sessionStorage.getItem("te_array_periodo");

    if (datos_1 && datos_2) {
        // si existen datos guardados del pronostico $us/m2 del terreno
        // lectura de los datos de pronostico
        // Cuando recuperas datos almacenados como un string JSON, debes convertirlos nuevamente a su formato original (objeto, array, etc.) usando JSON.parse.

        // Recuperar y convertir de vuelta a objeto||array
        var array_sus_m2 = JSON.parse(sessionStorage.getItem("te_array_sus_m2"));
        var pronostico_periodo = JSON.parse(sessionStorage.getItem("te_array_periodo"));

        //=================================================

        if (tipoMoneda === "sus") {
            var pronostico_pm2 = array_sus_m2;
        } else {
            if (tipoMoneda === "bs") {
                // dado que los valores pronosticos de precio por m2 estan en DOLARES, entonces abra que convertir los valores de pronosticos a BOLIVIANOS
                var pronostico_pm2 = [];
                if (array_sus_m2.length > 0) {
                    for (let i = 0; i < array_sus_m2.length; i++) {
                        pronostico_pm2[i] = array_sus_m2[i] * tc_oficial;
                    }
                }
            }
        }

        // ------- Para verificación -------
        // para ver si se mantinen los valores numericos como numeros o string.
        console.log("array_sus_m2");
        console.log(pronostico_pm2);
        console.log("array_periodo");
        console.log(pronostico_periodo);

        var respuesta = {
            pronostico_pm2,
            pronostico_periodo,
        };

        return respuesta;
    } else {
        // no existen datos, entonces tendran que ser cargados del servidor

        $.ajax({
            type: "POST",
            url: "/terreno/operacion/pronostico_precio_m2",
        }).done(function (respuestaPronostico) {
            // ------- Para verificación -------
            console.log("respuesta de pronostico terreno desde el servidor");
            console.log(respuestaPronostico);

            let arraySusM2 = respuestaPronostico.array_sus_m2;
            let arrayPeriodo = respuestaPronostico.array_periodo;

            // guardamos en sessionStorage del navegador con los nombres de: te_array_sus_m2 y te_array_periodo
            // La función JSON.stringify es necesaria en sessionStorage.setItem porque sessionStorage solo puede almacenar datos en formato de texto plano (strings).
            sessionStorage.setItem("te_array_sus_m2", JSON.stringify(arraySusM2));
            sessionStorage.setItem("te_array_periodo", JSON.stringify(arrayPeriodo));

            // lectura de los datos de pronostico
            // Cuando recuperas datos almacenados como un string JSON, debes convertirlos nuevamente a su formato original (objeto, array, etc.) usando JSON.parse.

            // Recuperar y convertir de vuelta a objeto||array
            var array_sus_m2 = JSON.parse(sessionStorage.getItem("te_array_sus_m2"));
            var pronostico_periodo = JSON.parse(sessionStorage.getItem("te_array_periodo"));

            //=================================================

            if (tipoMoneda === "sus") {
                var pronostico_pm2 = array_sus_m2;
            } else {
                if (tipoMoneda === "bs") {
                    // dado que los valores pronosticos de precio por m2 estan en DOLARES, entonces abra que convertir los valores de pronosticos a BOLIVIANOS
                    var pronostico_pm2 = [];
                    if (array_sus_m2.length > 0) {
                        for (let i = 0; i < array_sus_m2.length; i++) {
                            pronostico_pm2[i] = array_sus_m2[i] * tc_oficial;
                        }
                    }
                }
            }

            // ------- Para verificación -------
            // para ver si se mantinen los valores numericos como numeros o string.
            console.log("array_sus_m2");
            console.log(pronostico_pm2);
            console.log("array_periodo");
            console.log(pronostico_periodo);

            var respuesta = {
                pronostico_pm2,
                pronostico_periodo,
            };

            return respuesta;
        });
    }
}

//====================================================================
//====================================================================

function inmPronosticoPrecioM2(paqueteDatos) {
    let tipoMoneda = paqueteDatos.tipoMoneda; // sus o bs
    let tc_oficial = paqueteDatos.tc_oficial;

    // sessionStorage: Los datos permanecen solo durante la sesión del navegador. Se eliminan automáticamente cuando se cierra la pestaña o la ventana.

    var datos_1 = sessionStorage.getItem("inm_array_sus_m2");
    var datos_2 = sessionStorage.getItem("inm_array_periodo");

    if (datos_1 && datos_2) {
        // si existen datos guardados del pronostico $us/m2 del terreno
        // lectura de los datos de pronostico
        // Cuando recuperas datos almacenados como un string JSON, debes convertirlos nuevamente a su formato original (objeto, array, etc.) usando JSON.parse.

        // Recuperar y convertir de vuelta a objeto||array
        var array_sus_m2 = JSON.parse(sessionStorage.getItem("inm_array_sus_m2"));
        var pronostico_periodo = JSON.parse(sessionStorage.getItem("inm_array_periodo"));

        //=================================================

        if (tipoMoneda === "sus") {
            var pronostico_pm2 = array_sus_m2;
        } else {
            if (tipoMoneda === "bs") {
                // dado que los valores pronosticos de precio por m2 estan en DOLARES, entonces abra que convertir los valores de pronosticos a BOLIVIANOS
                var pronostico_pm2 = [];
                if (array_sus_m2.length > 0) {
                    for (let i = 0; i < array_sus_m2.length; i++) {
                        pronostico_pm2[i] = array_sus_m2[i] * tc_oficial;
                    }
                }
            }
        }

        // ------- Para verificación -------
        // para ver si se mantinen los valores numericos como numeros o string.
        console.log("array_sus_m2");
        console.log(pronostico_pm2);
        console.log("array_periodo");
        console.log(pronostico_periodo);

        var respuesta = {
            pronostico_pm2,
            pronostico_periodo,
        };

        return respuesta;
    } else {
        // no existen datos, entonces tendran que ser cargados del servidor

        $.ajax({
            type: "POST",
            url: "/inmueble/operacion/pronostico_precio_m2",
        }).done(function (respuestaPronostico) {
            // ------- Para verificación -------
            console.log("respuesta de pronostico inmueble desde el servidor");
            console.log(respuestaPronostico);

            let arraySusM2 = respuestaPronostico.array_sus_m2;
            let arrayPeriodo = respuestaPronostico.array_periodo;

            // guardamos en sessionStorage del navegador con los nombres de: inm_array_sus_m2 y inm_array_periodo
            // La función JSON.stringify es necesaria en sessionStorage.setItem porque sessionStorage solo puede almacenar datos en formato de texto plano (strings).
            sessionStorage.setItem("inm_array_sus_m2", JSON.stringify(arraySusM2));
            sessionStorage.setItem("inm_array_periodo", JSON.stringify(arrayPeriodo));

            // lectura de los datos de pronostico
            // Cuando recuperas datos almacenados como un string JSON, debes convertirlos nuevamente a su formato original (objeto, array, etc.) usando JSON.parse.

            // Recuperar y convertir de vuelta a objeto||array
            var array_sus_m2 = JSON.parse(sessionStorage.getItem("inm_array_sus_m2"));
            var pronostico_periodo = JSON.parse(sessionStorage.getItem("inm_array_periodo"));

            //=================================================

            if (tipoMoneda === "sus") {
                var pronostico_pm2 = array_sus_m2;
            } else {
                if (tipoMoneda === "bs") {
                    // dado que los valores pronosticos de precio por m2 estan en DOLARES, entonces abra que convertir los valores de pronosticos a BOLIVIANOS
                    var pronostico_pm2 = [];
                    if (array_sus_m2.length > 0) {
                        for (let i = 0; i < array_sus_m2.length; i++) {
                            pronostico_pm2[i] = array_sus_m2[i] * tc_oficial;
                        }
                    }
                }
            }

            // ------- Para verificación -------
            // para ver si se mantinen los valores numericos como numeros o string.
            console.log("array_sus_m2");
            console.log(pronostico_pm2);
            console.log("array_periodo");
            console.log(pronostico_periodo);

            var respuesta = {
                pronostico_pm2,
                pronostico_periodo,
            };

            return respuesta;
        });
    }
}

//====================================================================
//====================================================================
// funcion calculo del TIR financiero
// estimacionInicial = 0.005  = 0.5%  una estimacion inicial muy baja porque el TIR caluclado sera MENSUAL, a diferencia del anual que simpre suele ser una estimacion del 0.1 = 10%
// tolerancia 1e-3 = 0.001
// maxIteraciones = 1000 Esto para evitar bucles infinitos
function calcularTIR(flujos, estimacionInicial = 0.005, tolerancia = 1e-3, maxIteraciones = 1000) {
    let tir = estimacionInicial; // Tasa inicial
    let iteraciones = 0;

    while (iteraciones < maxIteraciones) {
        let vpn = 0; // Valor Presente Neto
        let derivadaVpn = 0; // Derivada del VPN respecto a la tasa

        // Calcular el VPN y su derivada
        for (let i = 0; i < flujos.length; i++) {
            vpn += flujos[i] / Math.pow(1 + tir, i);
            derivadaVpn -= (i * flujos[i]) / Math.pow(1 + tir, i + 1);
        }

        // Actualizar la TIR usando el método de Newton-Raphson
        const nuevaTIR = tir - vpn / derivadaVpn;

        // Comprobar si la diferencia es menor que la tolerancia
        if (Math.abs(nuevaTIR - tir) < tolerancia) {
            return nuevaTIR;
        }

        tir = nuevaTIR; // Actualizar la TIR para la siguiente iteración
        iteraciones++;
    }

    // Si no converge, devolver un mensaje de error
    throw new Error("No se pudo calcular el TIR: se alcanzó el número máximo de iteraciones.");
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function numero_punto_coma_query(numero) {
    // como ejemplo:
    // 2275730.88; // tipo numerico
    // sera convetido a string ingles: 2,275,730.88
    // finalmente sera convertido a string español: 2.275.730,88

    // convertimos a numerico por seguridad
    var el_numero = Number(numero);
    if (el_numero > 0) {
        var aux_num_string = el_numero.toLocaleString("en"); // LO DEVUELVE EN FORMATO INGLES Y EN STRING

        // dividimos el string numero en ","
        var array_1 = aux_num_string.split(",");
        // unimos el array con "*" en el lugar de las ","
        var numero_string_2 = array_1.join("*");

        // dividimos el string numero en "."
        var array_2 = numero_string_2.split(".");
        // unimos el array con "," en el lugar de las "."
        var numero_string_3 = array_2.join(",");

        // dividimos el string numero en "*"
        var array_3 = numero_string_3.split("*");
        // unimos el array con "." en el lugar de las "*"
        var numero_string_4 = array_3.join(".");

        var numero_convertido = numero_string_4; // NUMERO CONVERTIDO A FORMATO ESPAÑOL, Y EN STRING

        return numero_convertido; // DEVUELVE COMO STRING
    } else {
        return 0;
    }
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
