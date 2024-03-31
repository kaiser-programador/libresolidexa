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

    //----------------------------------------

    $(".knob").knob({
        draw: function () {
            // "tron" case
            //if (this.$.data("skin") == "tron") {
            this.cursorExt = 0.3;

            var a = this.arc(this.cv), // Arc
                pa, // Previous arc
                r = 1;

            this.g.lineWidth = this.lineWidth;

            if (this.o.displayPrevious) {
                pa = this.arc(this.v);
                this.g.beginPath();
                this.g.strokeStyle = this.pColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                this.g.stroke();
            }

            this.g.beginPath();
            this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
            this.g.stroke();

            this.g.lineWidth = 2;
            this.g.beginPath();
            this.g.strokeStyle = this.o.fgColor;
            this.g.arc(
                this.xy,
                this.xy,
                this.radius - this.lineWidth + 1 + (this.lineWidth * 2) / 3,
                0,
                2 * Math.PI,
                false
            );
            this.g.stroke();

            return false;
            //}
        },
    });

    /************************************************************************************ */
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

    //alert("el vemos es: " + vemos);

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
                    array_costo[i] = Number(
                        $("#contenedor_constructoras .cuerpo .costo").eq(i).attr("data-costo")
                    );
                    if (i == 0) {
                        // si es la PRIMERA, (que pertenece a SOLIDEXA)
                        array_color[i] = "#0a58ae"; // #37acdf CON COLOR antes #46BFBD
                        array_borde[i] = "#065db9"; // CON COLOR
                    } else {
                        array_color[i] = "#949FB1"; // COLOR GRIS
                        array_borde[i] = "#919fb5"; // COLOR GRIS
                    }
                }

                var datos_sobreprecios = {
                    type: "bar",
                    data: {
                        datasets: [
                            {
                                label: "Costo construcción $us",
                                data: array_costo,
                                backgroundColor: array_color,
                                ////////
                                // Bordes y sombras:
                                borderColor: array_borde, // Cambia los colores de los bordes de las barras
                                borderWidth: 2, // 2 Ancho del borde de las barras
                                ////////
                            },
                        ],
                        labels: array_nombre,
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

                var canvas_sobreprecios = document
                    .getElementById("graficoSobreprecios")
                    .getContext("2d");
                window.bar = new Chart(canvas_sobreprecios, datos_sobreprecios);
            }

            //---------------------------------------------------------
            // GRAFICO DE PLUSVALIA

            let costo_construccion = Number($("#contenedor_plusvalia .costo").attr("data-costo"));
            let plusvalia = Number($("#contenedor_plusvalia .plusvalia").attr("data-plusvalia"));

            var datos_plusvalia = {
                type: "bar",

                data: {
                    datasets: [
                        {
                            label: "Precio justo",
                            data: [costo_construccion, plusvalia],
                            backgroundColor: ["#0a58ae", "#f7c501"],
                            ////////
                            // Bordes y sombras:
                            borderColor: ["#065db9", "#ffca28"], // Cambia los colores de los bordes de las barras
                            borderWidth: 2, // 2 Ancho del borde de las barras
                            ////////
                        },
                    ],
                    labels: ["SOLIDEXA", "Plusvalía"],
                },

                /*
                data: {
                    labels: ["SOLIDEXAaaa", "Plusvalíaaaa"],
                    datasets: [
                        {
                            label: "SOLIDEXA",
                            data: [costo_construccion],
                            backgroundColor: "#0a58ae",
                            ////////
                            // Bordes y sombras:
                            borderColor: "#065db9", // Cambia los colores de los bordes de las barras
                            borderWidth: 2, // 2 Ancho del borde de las barras
                            ////////
                        },
                        {
                            label: "Plusvalía",
                            data: [plusvalia],
                            backgroundColor: "#f7c501",
                            ////////
                            // Bordes y sombras:
                            borderColor: "#ffca28", // Cambia los colores de los bordes de las barras
                            borderWidth: 2, // 2 Ancho del borde de las barras
                            ////////
                        },
                    ],
                    
                },
                */
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
                },
            };

            var canvas_plusvalia = document.getElementById("graficoPlusvalia").getContext("2d");
            window.bar = new Chart(canvas_plusvalia, datos_plusvalia);
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
                    array_precios_mercado[i] = Number(
                        $("#contenedor_precios_mercado .cuerpo .sus_m2").eq(i).attr("data-dolarm2")
                    );

                    if (i == 0) {
                        // el primer lugar del array esta ocupado por info de SOLIDEXA
                        array_color[i] = "#0a58ae"; // CON COLOR
                        array_borde[i] = "#065db9"; // CON COLOR
                    } else {
                        array_color[i] = "#949FB1"; // COLOR GRIS
                        array_borde[i] = "#919fb5"; // COLOR GRIS
                    }
                }

                /*
                var precio_volterra = Number(
                    $("#contenedor_plusvalia .precio_venta").attr("data-precio")
                );

                // despues de llenar el array, añadimos al PRINCIPIO los valores necesarios de SOLIDEXA, al PRINCIPIO, porque es el de menor valor que los demas
                array_direccion.unshift("Inmueble SOLIDEXA");
                array_precios_mercado.unshift(precio_volterra);
                array_color.unshift("#0a58ae"); // CON COLOR
                array_borde.unshift("#065db9"); // CON COLOR
                */

                var datos_precios = {
                    type: "bar",
                    data: {
                        datasets: [
                            {
                                label: "Precios venta $us/m2",
                                data: array_precios_mercado,
                                backgroundColor: array_color,
                                ////////
                                // Bordes y sombras:
                                borderColor: array_borde, // Cambia los colores de los bordes de las barras
                                borderWidth: 2, // 2 Ancho del borde de las barras
                                ////////
                            },
                        ],
                        labels: array_direccion,
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

                var canvas_precios = document.getElementById("graficoPrecios").getContext("2d");
                window.bar = new Chart(canvas_precios, datos_precios);
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
                    array_costo[i] = Number(
                        $("#contenedor_constructoras .cuerpo .costo").eq(i).attr("data-costo")
                    );
                    if (i == 0) {
                        // si es la PRIMERA, (que pertenece a SOLIDEXA)
                        array_color[i] = "#0a58ae"; // CON COLOR
                        array_borde[i] = "#065db9"; // CON COLOR
                    } else {
                        array_color[i] = "#949FB1"; // COLOR GRIS
                        array_borde[i] = "#919fb5"; // COLOR GRIS
                    }
                }

                var datos_sobreprecios = {
                    type: "bar",
                    data: {
                        datasets: [
                            {
                                label: "Costo construcción $us",
                                data: array_costo,
                                backgroundColor: array_color,
                                ////////
                                // Bordes y sombras:
                                borderColor: array_borde, // Cambia los colores de los bordes de las barras
                                borderWidth: 2, // 2 Ancho del borde de las barras
                                ////////
                            },
                        ],
                        labels: array_nombre,
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

                var canvas_sobreprecios = document
                    .getElementById("graficoSobreprecios")
                    .getContext("2d");
                window.bar = new Chart(canvas_sobreprecios, datos_sobreprecios);
            }

            //---------------------------------------------------------------------------
            // GRAFICO PLUSVALIA

            let pv_volterra = Number($("#contenedor_plusvalia .precio_venta").attr("data-precio"));
            let plusvalia = Number($("#contenedor_plusvalia .plusvalia").attr("data-plusvalia"));

            var datos_plusvalia = {
                type: "bar",
                data: {
                    datasets: [
                        {
                            label: "Precio justo",
                            data: [pv_volterra, plusvalia],
                            backgroundColor: ["#0a58ae", "#f7c501"],
                            ////////
                            // Bordes y sombras:
                            borderColor: ["#065db9", "#ffca28"], // Cambia los colores de los bordes de las barras
                            borderWidth: 2, // 2 Ancho del borde de las barras
                            ////////
                        },
                    ],
                    labels: ["SOLIDEXA", "Plusvalía"],
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

            var canvas_plusvalia = document.getElementById("graficoPlusvalia").getContext("2d");
            window.bar = new Chart(canvas_plusvalia, datos_plusvalia);

            //---------------------------------------------------------------------------
        }

        if (tipo_pestana_inm == "calculadora_inm") {
            $(".calculadora_propietario").click();
            $(".clase_reinversion").eq(0).click(); // seleccionamos el radio de REINVERSION "No"
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

    /*
    if (tipo_ventana == "cliente-inicio") {
        $("#id_body").removeClass("body-imagen-fondo");

        // antes no estaba
        // esto es para cuando la pagian se cargue o aparesca por primera vez
        dim_ventana_inicio();
    }
    */

    if (tipo_ventana == "cliente-inicio") {
        $("#id_body").addClass("inicio_h_v");

        // antes no estaba
        // esto es para cuando la pagian se cargue o aparesca por primera vez
        dim_ventana_inicio();
    } else {
        // normal

        $("#id_body").removeClass("inicio_h_v");
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // FUNCION SEGUNDERO PARA: PROYECTO, INMUEBLE Y PROPIETARIO

    function sus_seg() {
        setInterval(() => {
            //----------------------------------------------------------------------------
            // SEGUNDERO DE PLUSVALIA

            var plus_r = 0;
            var a_plus_r = [];
            var plus_fechaInicio = new Date();
            var plus_fechaFin = new Date();

            var p_verificador = 0;

            var s_plus_t = 0;
            var s_plus_r = 0;

            var n_plus = $("#contenedor_seg_plus .cuerpo_plus").length;
            if (n_plus > 0) {
                for (let i = 0; i < n_plus; i++) {
                    plus_r = Number(
                        $("#contenedor_seg_plus .cuerpo_plus .plus_r").eq(i).attr("data-plus_r")
                    );

                    a_plus_r[i] = plus_r;

                    let aux_r_fi = $("#contenedor_seg_plus .cuerpo_plus .plus_fechaInicio")
                        .eq(i)
                        .attr("data-plus_fechaInicio");

                    plus_fechaInicio = new Date(aux_r_fi); // convertimos a formato fecha

                    let aux_r_ff = $("#contenedor_seg_plus .cuerpo_plus .plus_fechaFin")
                        .eq(i)
                        .attr("data-plus_fechaFin");

                    plus_fechaFin = new Date(aux_r_ff); // convertimos a formato fecha

                    s_plus_t = s_plus_t + ((plus_fechaFin - plus_fechaInicio) / 1000) * plus_r;

                    let r_d_t = (plus_fechaFin - plus_fechaInicio) / 1000;
                    let r_d_p = (new Date() - plus_fechaInicio) / 1000;

                    if (r_d_p >= r_d_t) {
                        s_plus_r = s_plus_r + r_d_t * plus_r;
                    }
                    if (r_d_p < r_d_t) {
                        s_plus_r = s_plus_r + r_d_p * plus_r;
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
            //----------------------------------------------------------------------------
            // SEGUNDERO DE RECOMPENSA DE TIEMPO DE ESPERA

            var recom_r = 0;
            var a_recom_r = [];
            var recom_fechaInicio = new Date();
            var recom_fechaFin = new Date();

            var r_verificador = 0;

            var s_recom_t = 0;
            var s_recom_r = 0;

            var n_recom = $("#contenedor_seg_recom .cuerpo_recom").length;
            if (n_recom > 0) {
                for (let i = 0; i < n_recom; i++) {
                    recom_r = Number(
                        $("#contenedor_seg_recom .cuerpo_recom .recom_r").eq(i).attr("data-recom_r")
                    );

                    a_recom_r[i] = recom_r;

                    let aux_r_fi = $("#contenedor_seg_recom .cuerpo_recom .recom_fechaInicio")
                        .eq(i)
                        .attr("data-recom_fechaInicio");

                    recom_fechaInicio = new Date(aux_r_fi); // convertimos a formato fecha

                    let aux_r_ff = $("#contenedor_seg_recom .cuerpo_recom .recom_fechaFin")
                        .eq(i)
                        .attr("data-recom_fechaFin");

                    recom_fechaFin = new Date(aux_r_ff); // convertimos a formato fecha

                    s_recom_t = s_recom_t + ((recom_fechaFin - recom_fechaInicio) / 1000) * recom_r;

                    let r_d_t = (recom_fechaFin - recom_fechaInicio) / 1000;
                    let r_d_p = (new Date() - recom_fechaInicio) / 1000;

                    if (r_d_p >= r_d_t) {
                        s_recom_r = s_recom_r + r_d_t * recom_r;
                    }
                    if (r_d_p < r_d_t) {
                        s_recom_r = s_recom_r + r_d_p * recom_r;
                    }

                    if (recom_r != 0) {
                        r_verificador = r_verificador + 1;
                    }
                }
            }

            if (r_verificador == 0) {
                $("#entero_tot_recompensa").text("0");

                //$("#decimales_tot_ret_alq").text(",000");
                $(".cd_r").eq(0).text(",");
                $(".cd_r").eq(1).text("0");
                $(".cd_r").eq(2).text("0");
                $(".cd_r").eq(3).text("0");
                //$(".cd").eq(4).attr("hidden", false); // ocultamos
                $(".cd_r").eq(4).css("display", "none"); // ocultamos

                let r_aux_string_progre = "0" + "%";
                $("#ref_progreso_recompensa").css("width", r_aux_string_progre);
                $("#ref_valor_progreso_recompensa").text(r_aux_string_progre);
            } else {
                // Usar Math.max con el operador de propagación para obtener el valor máximo
                let recom_r_max = Math.max(...a_recom_r); // el valor maximo de Bs/seg

                let string_recom_r_max = recom_r_max.toString();

                for (let t = 0; t < string_recom_r_max.length; t++) {
                    // las posiciones de una cadena empiezan desde CERO
                    let porsion = string_recom_r_max.substring(t, t + 1);

                    if (porsion != "0" && porsion != ".") {
                        //console.log("entramos al caracter dist cero: " + t);
                        // entonces la posicion es el de un numero superior a cero
                        var n_casillas_deci = t - 1;
                        break; // para salir de este bucle for
                    }
                }

                let string_s_recom_r = s_recom_r.toString();
                let array_aux = string_s_recom_r.split(".");
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

                $("#entero_tot_recompensa").text(numero_convertido);

                //==========================================================
                var arr = Array.from(aux_decimal); // convierte a "aux_decimal" en un array separandolo en cada uno de sus caracteres. ej/ 539 = [5, 3, 9]
                // ncd = 5: número de ".cd" caracteres para decimales (incluido la coma,)
                // n_casillas_deci: número de decimales ( sin inluir la coma, )
                var ncd = 5;
                if (ncd > n_casillas_deci) {
                    $(".cd_r").eq(0).text(",");
                    for (var ii = 0; ii < arr.length; ii++) {
                        $(".cd_r")
                            .eq(ii + 1)
                            .text(arr[ii]);
                    }

                    // ocultamos las casillas que no seran llenadas con decimales
                    for (let j = ii + 1; j < ncd; j++) {
                        $(".cd_r").eq(j).css("display", "none"); // ocultamos
                    }
                } else {
                    // entonces solo seran mostrados hasta maximo: 4 digitos de los decimales, que incluido con la coma "," ocuparan la totalidad de los 5 ".cd_r"
                    for (let k = 0; k < ncd; k++) {
                        $(".cd_r")
                            .eq(k + 1)
                            .text(arr[k]);
                    }
                }
                //==========================================================

                let porcen_progreso = ((s_recom_r / s_recom_t) * 100).toFixed(2); // con 2 decimales
                let aux_string_progre = porcen_progreso + "%";
                $("#ref_progreso_recompensa").css("width", aux_string_progre);

                let num_punto_coma = numero_punto_coma_query(porcen_progreso);

                let formato_punto_coma = num_punto_coma + " %";
                $("#ref_valor_progreso_recompensa").text(formato_punto_coma);
            }

            //----------------------------------------------------------------------------
        }, 1000);
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
});

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
                    $(".ancho_ventana").attr("data-ancho_ventana",anchoActual);
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

    var css_horizontal = `linear-gradient(rgba(5, 5, 54, 0.8), rgba(5, 5, 54, 0.8)),
    url(${url_horizontal})`;

    var css_vertical = `linear-gradient(rgba(5, 5, 54, 0.8), rgba(5, 5, 54, 0.8)),
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

/**************************************************************************** */
