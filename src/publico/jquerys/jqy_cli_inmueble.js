// PARA LOGICA DENTRO DE INMUEBLE DESDE LA VISTA PÚBLICA DEL CLIENTE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// botones radio de TIPO DE CALCULADORA

$(".calculadora_propietario").click(function (e) {
    $("#contenedor_propietario").css("display", "block");
    $("#contenedor_inversionista").css("display", "none");
    // limpiesa de los campos de claves maestras
    $(".clase_calculadora").text("");
    // titulo del tipo de calculadora
    $(".clase_calculadora").text("Propietario");
});

$(".calculadora_inversionista").click(function (e) {
    $("#contenedor_propietario").css("display", "none");
    $("#contenedor_inversionista").css("display", "block");
    // limpiesa de los campos de claves maestras
    $(".clase_calculadora").text("");
    // titulo del tipo de calculadora
    $(".clase_calculadora").text("Inversionista");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// LADO PROPIETARIO

//---------------------------------------------------
// PARA SELECCION DE RADIOS TIPO MONEDA PROPIETARIO
$(".monedaP").click(function (e) {
    var valorRadioSeleccinado = $(this).val();
    $("#id_input_monedaP").val(valorRadioSeleccinado);
});
//---------------------------------------------------

$(".calcular_plusvalia").click(function (e) {
    let a_precio_tradicional = $("#label_precio_tradicional").val();
    let a_superficie_tradicional = $("#label_superficie_tradicional").val();

    if (a_precio_tradicional == "" || a_superficie_tradicional == "") {
        // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-calcular_plusvalia"
        $(".ref-calcular_plusvalia").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">Llene todos los campos de Precio y Superficie</p>
            </div>`
        );
    } else {
        let minimo = Number($(".minimo").attr("data-minimo"));
        let maximo = Number($(".maximo").attr("data-maximo"));
        let precio_tradicional = Number(a_precio_tradicional);
        let superficie_tradicional = Number(a_superficie_tradicional);
        let tradicional_sus_m2 = Number((precio_tradicional / superficie_tradicional).toFixed(2)); // $us/m2
        let solidexa_sus_m2 = Number($(".solidexa_sus_m2").attr("data-solidexa_sus_m2")); // $us/m2
        let solidexa_m2 = Number($(".solidexa_m2").attr("data-solidexa_m2"));
        let solidexa_sus = Number($(".solidexa_sus").attr("data-solidexa_sus"));
        let plus_promedio = Number($(".promedio").attr("data-promedio")); // $us/m2

        if (solidexa_sus_m2 <= tradicional_sus_m2) {
            // redondeados a entero (sin decimales)
            let plus_solidexa = Number((solidexa_m2 * plus_promedio - solidexa_sus).toFixed(0));
            let plus_tradicional = Number(
                (superficie_tradicional * plus_promedio - precio_tradicional).toFixed(0)
            );

            //----------------------------------------
            // visualizamos los valores de precio del inm tradicional
            let num_ptje = ((tradicional_sus_m2 - minimo) / (maximo - minimo)) * 100;
            let string_ptje = num_ptje.toFixed(2) + "%";
            $("#ref_precio_tradicional").css("width", string_ptje);

            let render_tradicional_Sus_m2 = numero_punto_coma_query(tradicional_sus_m2.toFixed(2));
            $(".tradicional_sus_m2").text(render_tradicional_Sus_m2);
            //----------------------------------------
            // para graficar barras
            // Datos para el gráfico de barras apiladas
            const data = {
                labels: ["SOLIDEXA", "Tradicional"],
                datasets: [
                    {
                        label: "Precio",
                        data: [solidexa_sus, precio_tradicional],
                        backgroundColor: "#0a58ae", // Color de las barras para el Precio
                    },
                    {
                        label: "Plusvalía",
                        data: [plus_solidexa, plus_tradicional],
                        backgroundColor: "#f7c501", // Color de las barras para el Plusvalía
                    },
                ],
            };

            // Opciones para el gráfico de barras apiladas
            const options = {
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
            };

            // Obtén el contexto del lienzo
            const ctx = document.getElementById("grafico_plus_sol_tra").getContext("2d");

            // Crea el gráfico de barras apiladas
            const myChart = new Chart(ctx, {
                type: "bar",
                data: data,
                options: options,
            });

            // RENDERIZAR LOS VALORES

            let r_plus_solidexa = numero_punto_coma_query(plus_solidexa);
            $(".c1").text(r_plus_solidexa);

            let aux_perdida = plus_solidexa - plus_tradicional;
            let r_aux_perdida = numero_punto_coma_query(aux_perdida);
            $(".c2").text(r_aux_perdida);

            //----------------------------------------
            // CALCULO DE NUMERO DE AÑOS EN EL QUE LA PLUSVALIA TRADICIONAL IGUALARIA AL DE SOLIDEXA

            let codigo_inmueble = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
            let meta = plus_promedio + (tradicional_sus_m2 - solidexa_sus_m2);

            var datosAuxiliar = {
                codigo_inmueble,
                meta,
                plus_promedio,
            };

            $.ajax({
                type: "post",
                url: "/inmueble/operacion/calculo_tiempo",
                data: datosAuxiliar,
            }).done(function (respuestaServidor) {
                var year_espera = respuestaServidor.exito;
                //------------------------------------
                // graficamos las plusvalias de los inmuebles solidexa y tradicional con la linea de referencia

                var data_t = {
                    labels: ["SOLIDEXA", "Tradicional"],
                    datasets: [
                        {
                            label: "Plusvalía",
                            data: [plus_solidexa, plus_tradicional],
                            backgroundColor: "#f7c501", // Color de las barras para el Plusvalia
                        },
                    ],
                };

                const opciones_t = {
                    plugins: {
                        annotation: {
                            annotations: {
                                line1: {
                                    type: "line",
                                    mode: "horizontal",
                                    scaleID: "y",
                                    value: plus_solidexa, // Valor en el eje Y donde quieres la línea horizontal
                                    borderColor: "#0a58ae", // Color de la línea
                                    borderWidth: 1000, // Ancho de la línea
                                    //borderDash: [5, 5] // Patrón de guiones y espacios para hacer la línea entrecortada
                                },
                            },
                        },
                    },
                    scales: {
                        xAxes: [
                            {
                                // Ajusta el porcentaje de ancho de las barras (por ejemplo, 0.7 para un 70%)
                                barPercentage: 0.4,
                            },
                        ],
                    },
                };

                const graf_tiempo_espera = document
                    .getElementById("grafico_tiempo_espera")
                    .getContext("2d");
                const mi_grafico = new Chart(graf_tiempo_espera, {
                    type: "bar",
                    data: data_t,
                    options: opciones_t,
                });

                // visualizamos el numero de años
                $(".c3").text(year_espera);

                //------------------------------------
            });
            //----------------------------------------
        } else {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-calcular_plusvalia"
            $(".ref-calcular_plusvalia").after(
                `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">
                    El precio $us/m<sup>2</sup> del inmueble tradicional se encuentra fuera del rango.
                    <br>
                    Por favor trabaje con datos de inmuebles que se encuentran dentro de la zona del inmueble SOLIDEXA
                </p>
            </div>`
            );
        }
    }
    // limpiesa de los campos de claves maestras
    $("#id_usuario_maestro").val("");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(".calcular_prestamo_p").click(function (e) {
    let a_precio_tradicional = $("#label_precio_tradicional").val();
    let aporte_p = $("#label_aporte_p").val();
    let plazo_year_p = $("#label_plazo_year_p").val();
    let interes_anual_p = $("#label_interes_anual_p").val();
    let monedaP = $("#id_input_monedaP").val(); // sus o bs

    if (
        a_precio_tradicional == "" ||
        aporte_p == "" ||
        plazo_year_p == "" ||
        interes_anual_p == "" ||
        monedaP == ""
    ) {
        // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-calcular_plusvalia"
        $(".ref-calcular_prestamo_p").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">Llene todos los campos</p>
            </div>`
        );
    } else {
        var precio_solidexa = Number($(".solidexa_sus").attr("data-solidexa_sus"));
        var precio_tradicional = Number(a_precio_tradicional); // $us
        var aporte = Number(aporte_p); // $us
        var plazo = Number(plazo_year_p);
        var interes = Number(interes_anual_p); // $us
        var moneda = monedaP; // sus o bs

        var datosAuxiliar = {
            precio_solidexa,
            precio_tradicional,
            aporte,
            plazo,
            interes,
            moneda,
        };

        $.ajax({
            type: "post",
            url: "/inmueble/operacion/calculo_banco_p",
            data: datosAuxiliar,
        }).done(function (respuestaServidor) {
            var credito_solidexa = respuestaServidor.credito_solidexa;
            var credito_tradicional = respuestaServidor.credito_tradicional;
            var int_acu_solidexa = respuestaServidor.int_acu_solidexa;
            var int_acu_tradicional = respuestaServidor.int_acu_tradicional;
            var mensual_solidexa = respuestaServidor.mensual_solidexa;
            var mensual_tradicional = respuestaServidor.mensual_tradicional;

            console.log(int_acu_solidexa);

            //----------------------------------------
            // eliminamos todos los elementos que contienen a los graficos
            // los eliminamos para que los graficos nuevos no sean creados encima de los antiguos
            //  empty(). Este método eliminará todos los hijos del elemento seleccionado, pero conservará el propio elemento.
            $("#contenedor_banco_sol_tra").empty();
            $("#contenedor_int_acu").empty();

            //----------------------------------------
            // ahora creamos nuevamente el elemento que contendra al grafico nuevo
            // append lo crea como hijo
            $("#contenedor_banco_sol_tra").append(`<canvas id="grafico_prestamo_p"></canvas>`);
            $("#contenedor_int_acu").append(`<canvas id="grafico_interes_acumulado"></canvas>`);

            //----------------------------------------
            // para graficar barras PRESTAMO + INTERESES ACUMULADOS
            // Datos para el gráfico de barras apiladas

            if (moneda == "sus") {
                var uni_moneda = "$us";
            }
            if (moneda == "bs") {
                var uni_moneda = "Bs";
            }

            const data_a = {
                labels: ["SOLIDEXA", "Tradicional"],
                datasets: [
                    {
                        label: "Prestamo",
                        data: [credito_solidexa, credito_tradicional],
                        backgroundColor: "#0a58ae",
                    },
                    {
                        label: "Interés",
                        data: [int_acu_solidexa, int_acu_tradicional],
                        backgroundColor: "#f7c501",
                    },
                ],
            };

            // Opciones para el gráfico de barras apiladas
            const opciones_a = {
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
            };

            // Obtén el contexto del lienzo
            const ctx_a = document.getElementById("grafico_prestamo_p").getContext("2d");

            // Crea el gráfico de barras apiladas
            const myChart_a = new Chart(ctx_a, {
                type: "bar",
                data: data_a,
                options: opciones_a,
            });

            // RENDERIZAMOS LOS VALORES
            var r_int_acu_solidexa = numero_punto_coma_query(int_acu_solidexa);
            var r_int_acu_tradicional = numero_punto_coma_query(int_acu_tradicional);

            $(".c4").text(r_int_acu_solidexa);
            $(".c5").text(uni_moneda);
            $(".c6").text(r_int_acu_tradicional);
            $(".c7").text(uni_moneda);

            //----------------------------------------
            // GRAFICO DE PAGOS MENSUALES

            if (moneda == "sus") {
                var moneda_mensual = "$us/Mes";
            }
            if (moneda == "bs") {
                var moneda_mensual = "Bs/Mes";
            }
            $(".moneda_mensual").text(moneda_mensual);

            var data_b = {
                labels: ["SOLIDEXA", "Tradicional"],
                datasets: [
                    {
                        label: "Pago mensual",
                        data: [mensual_solidexa, mensual_tradicional],
                        backgroundColor: "#f7c501", // Color de las barras para el Plusvalia
                    },
                ],
            };

            const opciones_b = {
                scales: {
                    xAxes: [
                        {
                            // Ajusta el porcentaje de ancho de las barras (por ejemplo, 0.7 para un 70%)
                            barPercentage: 0.4,
                        },
                    ],
                },
            };

            const ctx_b = document.getElementById("grafico_interes_acumulado").getContext("2d");
            const myChart_b = new Chart(ctx_b, {
                type: "bar",
                data: data_b,
                options: opciones_b,
            });

            // RENDERIZAMOS LOS VALORES
            var r_mensual_solidexa = numero_punto_coma_query(mensual_solidexa);
            var r_mensual_tradicional = numero_punto_coma_query(mensual_tradicional);

            $(".c8").text(r_mensual_solidexa);
            $(".c9").text(moneda_mensual);
            $(".c10").text(r_mensual_tradicional);
            $(".c11").text(moneda_mensual);

            //------------------------------------
        });
    }
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
