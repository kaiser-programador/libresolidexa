//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// botones radio de TIPO DE CALCULADORA

$("#calTeCopropietario").click(function (e) {
    // despintamos todos
    $(".boton-linea-secundario").removeClass("bg-unidad");

    $(this).addClass("bg-unidad");

    $("#c-calTeCopropietario").css("display", "block"); // mostrar
    $("#m-calTeCopropietario").css("display", "block"); // mostrar
    $("#c-calTeComparar").css("display", "none"); // ocultar
    $("#m-calTeComparar").css("display", "none"); // ocultar

    //$("." + data_radio).val(valorRadioSeleccinado);
});

$("#calTeComparar").click(function (e) {
    // despintamos todos
    $(".boton-linea-secundario").removeClass("bg-unidad");

    $(this).addClass("bg-unidad");

    $("#c-calTeComparar").css("display", "block"); // mostrar
    $("#m-calTeComparar").css("display", "block"); // mostrar
    $("#c-calTeCopropietario").css("display", "none"); // ocultar
    $("#m-calTeCopropietario").css("display", "none"); // ocultar

    //$("." + data_radio).val(valorRadioSeleccinado);
});

//==================================================================
//==================================================================
// Calculadora Terreno COPROPIETARIO
$("#cal_te_copropietario").click(function (e) {
    var tc_oficial = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico

    var tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

    $(".copropietario_alerta").remove(); // eliminamos todos los alert mensajes

    //--------------------------------------------
    $(".contenedor_1").hide(); // ocultamos

    //--------------------------------------------
    // respuestas originadas desde el servidor
    let tc_ine = Number($(".tc_ine").attr("data-tc_ine"));
    let tc_paralelo = Number($(".tc_paralelo").attr("data-tc_paralelo"));
    let inflacion_ine = Number($(".inflacion_ine").attr("data-inflacion_ine"));
    let promedio_bsm2 = Number($(".promedio_bsm2").attr("data-promedio_bsm2"));
    let meses_maximo = Number($(".meses_maximo").attr("data-meses_maximo"));
    let solidexa_te_bsm2 = Number($(".solidexa_te_bsm2").attr("data-solidexa_te_bsm2"));
    let solidexa_te_m2 = Number($(".solidexa_te_m2").attr("data-solidexa_te_m2"));
    let p_f_total = Number($(".p_f_total").attr("data-p_f_total"));

    //-------------------------------------------

    let economiaSeleccionada = $("#ajustar_economia").prop("checked"); // Verifica si está seleccionado. DEVUELVE true o false
    if (economiaSeleccionada) {
        //console.log("El checkbox está seleccionado.");

        var tcParalelo = Number($("#tc_paralelo").val()); // para ajuste economia nacional
        var inflacion = Number($("#inflacion").val()); // para ajuste economia nacional

        // con la condicionante de >= se garantiza que los datos ingresados de ajuste de economia nacional sean realistas acorde a la economia actual de pais
        if (tcParalelo >= tc_ine && inflacion >= inflacion_ine) {
            var economia = true;
        } else {
            var economia = false;
        }
    } else {
        //console.log("El checkbox está deseleccionado.");
        var economia = true;

        var tcParalelo = tc_paralelo; // se trabajara con el valor por defecto del tc_paralelo
        var inflacion = inflacion_ine;
    }

    let valor_inversion = $("#valor_adquiridos").data("bs"); // valor de las fracciones que el usuario pretende comprar. Siempre estara en moneda BOLIVIANOS. como este input es tipo "text", es que rescataremos su valor numerico bs guardado en el atributo "data-bs"

    let valor_inversion_bs = $("#valor_adquiridos").val(); // capturamos el valor de la inversion en fracciones en formato punto mil, util para mostrarlo en los popover.

    if (valor_inversion > 0 && economia === true) {
        $(".contenedor_1").show(); // visualizamos
        $("#contenedor_1_g_1").empty();
        $("#contenedor_1_g_2").empty();
        $("#contenedor_1_g_3").empty();
        $("#contenedor_1_g_4").empty();
        $("#contenedor_1_g_5").empty();
        $("#contenedor_1_g_6").empty();

        $("#contenedor_1_g_1").append(`<canvas id="grafico_21_1"></canvas>`);
        $("#contenedor_1_g_2").append(`<canvas id="grafico_21_2"></canvas>`);
        $("#contenedor_1_g_3").append(`<canvas id="grafico_12_1"></canvas>`);
        $("#contenedor_1_g_4").append(`<canvas id="grafico_12_2"></canvas>`);
        $("#contenedor_1_g_5").append(`<canvas id="grafico_x21_1"></canvas>`);
        $("#contenedor_1_g_6").append(`<canvas id="grafico_21_3"></canvas>`);

        // valor_inversion siempre estara en moneda BOLIVIANOS, es por ello que dependiendo la moneda con la que se deseen visualizar los resultados, es que se hara la debida converdion de valor_inversion a moneda deseada renonbradolo con la variable "inversion"
        if (tipoMoneda === "sus") {
            var cambio = tc_oficial;
            var inversion = Math.floor(valor_inversion / tc_oficial);
        } else {
            if (tipoMoneda === "bs") {
                var cambio = 1;
                var inversion = valor_inversion;
            }
        }

        //-------------------------------------------------------
        // PRONOSTICO DE PRECIOS POR M2 DEL TERRENO

        let paqueteDatos = {
            tipoMoneda, // sus o bs
            tc_oficial,
        };

        let resultadoPronostico = tePronosticoPrecioM2(paqueteDatos);

        // "pronostico_pm2" ya se encuentra en la moneda correcta en el que se esta trabajando
        let pronostico_pm2 = resultadoPronostico.pronostico_pm2;
        let pronostico_periodo = resultadoPronostico.pronostico_periodo;

        //----------------------------------------
        // calculo de la PLUSALIA AL FINAL DE LOS meses_maximo (MESES DE TIEMPO QUE SE DEMORA DESDE EL INICIO DE LA CONVOCATORIA HASTA EL FIN DE LA RESERVACION)

        let promedio_pm2 = promedio_bsm2 * (1 / cambio);

        let solidexa_pm2_futuro = promedio_pm2; // por defecto, sera corregido en las siguientes lineas de codigo

        // Obtener la fecha actual
        let fechaActual = new Date();
        let actualMes = fechaActual.getMonth() + 1; // getMonth() devuelve un índice (0-11), así que sumamos 1
        let actualAno = fechaActual.getFullYear(); // devuelve en numerico el año actual

        if (actualMes <= 5) {
            var semestreActual = "I";
        } else {
            var semestreActual = "II";
        }

        // formato: "2019 - II"
        let periodoActual = actualAno + " - " + semestreActual;

        if (pronostico_pm2.length > 0 && pronostico_periodo.length > 0) {
            for (let i = 0; i < pronostico_periodo.length; i++) {
                let elemento = pronostico_periodo[i];
                if (elemento === periodoActual) {
                    var auxPm2Actual = pronostico_pm2[i];
                    break; // para salir del bucle for
                }
            }

            // se procede a normalizar los valores pronosticados de precio de terreno por m2.
            // En los pronosticos normalizados el periodo actual debe dar un precio por m2 igual al precio promedio de los precios de los terrenos de la zona. Es por ello que se utiliza un factor de normalizacion "factor"
            let pronostico_pm2_ok = []; // pronosticos de precios por m2 NORMALIZADOS
            let factor = promedio_pm2 - auxPm2Actual;
            for (let j = 0; j < pronostico_pm2.length; j++) {
                pronostico_pm2_ok[j] = pronostico_pm2[j] + factor;
            }

            // ------- Para verificación -------
            console.log("LOS PUTOS PRONOSTICOS NORMALIZADOS");
            console.log(pronostico_pm2_ok);

            //-------------------
            // ahora se procede a extraer el valor normalizado futuro del precio por m2 del terreno

            // Obtener la fecha actual
            let fechaActualAux = new Date();

            // Sumar los meses
            fechaActualAux.setMonth(fechaActualAux.getMonth() + meses_maximo);

            // Obtener el año y el mes de la nueva fecha
            let futuroAno = fechaActualAux.getFullYear();
            let futuroMes = fechaActualAux.getMonth() + 1; // getMonth() devuelve un índice (0-11), así que sumamos 1

            if (futuroMes <= 5) {
                var semestreFuturo = "I";
            } else {
                var semestreFuturo = "II";
            }

            // formato: "2019 - II"
            let periodoFuturo = futuroAno + " - " + semestreFuturo;

            let posiFuturo = 0; // posicion que ocupa la fecha futura en el array de pronosticos. por defecto sera 0, luego sera corregido.

            if (pronostico_periodo.length > 0) {
                for (let i = 0; i < pronostico_periodo.length; i++) {
                    let elemento = pronostico_periodo[i];
                    if (elemento === periodoFuturo) {
                        posiFuturo = i;
                        break; // para salir del bucle for
                    }
                }
            }

            if (pronostico_pm2_ok.length > 0) {
                for (let i = 0; i < pronostico_pm2_ok.length; i++) {
                    let elemento = pronostico_pm2_ok[i];

                    if (i >= posiFuturo && elemento > promedio_pm2) {
                        // aseguramos que el valor futuro del pronostico sea mayor que el precio promedio por m2 del mercado tradicional
                        solidexa_pm2_futuro = pronostico_pm2_ok[i];
                        break; // para salir del bucle for
                    }
                }
            }
        }

        let solidexa_pm2 = solidexa_te_bsm2 * (1 / cambio);

        // participacion del usuario en funcion al numero de fracciones de terreno que desea adquirir
        let participacion = Number($("#participacion").val()) / 100; // en decimales

        //-------------------
        // Ganancia plusvalia ACTUAL en valor por m2

        let plus_solidexa_pm2_actual = promedio_pm2 - solidexa_pm2; // precio por m2

        // Ganancia plusvalia en valor monetario
        let plusvalia_te_actual = solidexa_te_m2 * plus_solidexa_pm2_actual;

        // ganancia por plusvalia ACTUAL del usuario en funcion a su nivel de participacion
        // floor redondea al inmediato entero inferior y devuelve tipo numerico
        let plusvaliaUsuarioActual = Math.floor(plusvalia_te_actual * participacion);

        //-------------------
        // Ganancia plusvalia EN X MESES en valor por m2

        let plus_solidexa_pm2 = solidexa_pm2_futuro - solidexa_pm2; // precio por m2

        // Ganancia plusvalia en valor monetario
        let plusvalia_te = solidexa_te_m2 * plus_solidexa_pm2;

        // ganancia por plusvalia del usuario en funcion a su nivel de participacion
        // floor redondea al inmediato entero inferior y devuelve tipo numerico
        let plusvaliaUsuario = Math.floor(plusvalia_te * participacion);
        let plusvaliaUsuarioRender = numero_punto_coma_query(plusvaliaUsuario);

        // Ganancia plusvalía

        let paqueteDatos_a = {
            canvasId: "grafico_12_1",
            etiquetas: ["Actual", "En 8 meses"],
            datasets: {
                label: "Ganancia por plusvalía",
                data: [plusvaliaUsuarioActual, plusvaliaUsuario],
            },
        };

        grafico_21(paqueteDatos_a);

        // RENDERIZAR LOS VALORES
        $(".12_1_1").text(plusvaliaUsuarioRender);

        // significados
        let s_12_1_1 = `Ganancia obtenida por plusvalía al cabo de los
                                    ${meses_maximo}
                                    meses de espera.`;
        $(".s_12_1_1").attr("data-content", s_12_1_1);

        //-------------------------------------------------------
        // GANANCIA ESTANDART

        let p_f_total_d = p_f_total / 100; // en decimal

        // floor redondea al inmediato entero inferior y devuelve tipo numerico
        let gananciaEstandart = Math.floor(inversion * p_f_total_d);
        let gananciaEstandartRender = numero_punto_coma_query(gananciaEstandart);

        // grafica barras apiladas
        // Ganancia ESTANDART

        let paqueteDatos_b = {
            canvasId: "grafico_12_2",
            etiquetas: ["SOLIDEXA"],
            datasets_1: {
                label: "Inversión",
                data: [inversion],
            },
            datasets_2: {
                label: "Ganancia estandart",
                data: [gananciaEstandart],
            },
        };

        grafico_12(paqueteDatos_b);

        // RENDERIZAR LOS VALORES
        $(".12_2_1").text(gananciaEstandartRender);

        // significados
        let s_12_2_1 = `Ganancia estandart que obtendrías al cabo de los
                                    ${meses_maximo}
                                    meses de espera.`;
        $(".s_12_2_1").attr("data-content", s_12_2_1);

        //-------------------------------------------------------
        // BENEFICIO --- Inversión $us
        // la moneda en mostrarse sera siempre en DOLARES dado que es en esa moneda lo que se pretende mostrar el nivel de ganancia que se obtiene con SOLIDEXA frente al tipo de cambio paralelo

        // valor_inversion (aquello que esta dispuesto a invertir el usuario) siempre estara en moneda BOLIVIANOS

        // floor redondea al inmediato entero inferior y devuelve tipo numerico
        let tradicional_sus = Math.floor(valor_inversion / tcParalelo);
        let solidexa_sus = Math.floor(valor_inversion / tc_ine);
        let beneficio_sus = solidexa_sus - tradicional_sus;

        let tradicional_sus_render = numero_punto_coma_query(tradicional_sus);
        let solidexa_sus_render = numero_punto_coma_query(solidexa_sus);
        let beneficio_sus_render = numero_punto_coma_query(beneficio_sus);

        // grafico de BENEFICIO INVERSION

        let paqueteDatos_c = {
            canvasId: "grafico_21_1",
            etiquetas: ["SOLIDEXA", "Tradicional"],
            datasets: {
                label: "Beneficio $us",
                data: [solidexa_sus, tradicional_sus],
            },
        };

        grafico_21(paqueteDatos_c);

        //var contexto_c = document.getElementById("grafico_21_1").getContext("2d");

        // visualizamos el numero de años
        $(".21_1_1").text(solidexa_sus_render);
        $(".21_1_2").text(tradicional_sus_render);

        // significados
        let s_21_1_1 = `Es el valor que adquieren tus ${valor_inversion_bs} Bs convertidos a dolares gracias al ser invertidos en fracciones del terreno SOLIDEXA.`;
        $(".s_21_1_1").attr("data-content", s_21_1_1);

        let s_21_1_2 = `Es el valor que adquieren tus ${valor_inversion_bs} Bs convertidos a dolares al tipo de cambio del mercado paralelo.`;
        $(".s_21_1_2").attr("data-content", s_21_1_2);

        //-------------------------------------------------------
        // BENEFICIO --- Compra M2

        var pm2_solidexa = solidexa_te_bsm2 * (1 / cambio);
        var pm2_tradicional = promedio_bsm2 * (1 / cambio);

        let solidexa_m2 = Math.floor(inversion / pm2_solidexa);
        let tradicional_m2 = Math.floor(inversion / pm2_tradicional);

        let tradicional_m2_render = numero_punto_coma_query(tradicional_m2);
        let solidexa_m2_render = numero_punto_coma_query(solidexa_m2);

        // grafico de BENEFICIO COMPRA M2

        let paqueteDatos_d = {
            canvasId: "grafico_21_2",
            etiquetas: ["SOLIDEXA", "Tradicional"],
            datasets: {
                label: "Beneficio m2",
                data: [solidexa_m2, tradicional_m2],
            },
        };

        grafico_21(paqueteDatos_d);

        // visualizamos los valores renderizados
        $(".21_2_1").text(solidexa_m2_render);
        $(".21_2_2").text(tradicional_m2_render);

        // significados
        let s_21_2_1 = `Cantidad adicional de superficie que obtienes con SOLIDEXA.`;
        $(".s_21_2_1").attr("data-content", s_21_2_1);
        let s_21_2_2 = `Cantidad de superficie que pierdes con un terreno tradicional.`;
        $(".s_21_2_2").attr("data-content", s_21_2_2);

        //-------------------------------------------------------
        // PROTECCION INFLACION ----- Desprotegido

        // la inflacion anual sera convertida a inflacion mensual y en decimal
        let inflacionAnual = inflacion / 100; // inflacion en decimal
        //  ((1+intAnual)^(1/12))-1
        // Math.pow(base, exponente)
        let inflacionMensual = Math.pow(1 + inflacionAnual, 1 / 12) - 1; // en decimal

        //  C24/((1+$C$12)^B24)

        // construccion de los valores de perdida de poder de compra en funcion al tiempo
        // inversion esta en el tipo de moneda que se esta trabajando
        let arrayDesprotegido = [];
        for (let i = 0; i < meses_maximo + 1; i++) {
            let aux = inversion / Math.pow(1 + inflacionMensual, i);
            if (i < meses_maximo) {
                arrayDesprotegido[i] = Number(aux.toFixed(2)); // redondeado 2 decimales, para tener mayor exactitud en la visualizacion del grafico
            } else {
                arrayDesprotegido[i] = Number(aux.toFixed(0)); // redondeado a entero sin decimales por ser el ultimo valor y para ser mostrado como resultado de grafico
            }
        }
        let perdidaFinal = arrayDesprotegido[meses_maximo];

        //-------------------------------------------------------
        // PROTECCION INFLACION ----- Protegido
        let flujosDinero = [];
        for (let i = 0; i < meses_maximo + 1; i++) {
            if (i === 0) {
                flujosDinero[i] = -inversion; // en negativo porque representa inversion (salida) de dinero
            } else {
                if (i === meses_maximo) {
                    flujosDinero[i] = inversion + plusvaliaUsuario;
                } else {
                    flujosDinero[i] = 0;
                }
            }
        }

        let tirMensual = calcularTIR(flujosDinero); // decimal de utilidad para grafico creciente

        if (tirMensual > 0) {
            // entonces se graficaran las barras juntas de: desprotegido y protegido
            // H16*((1+$H$12)^G16)

            // construccion de los valores de ganancia protegida en funcion al tiempo
            // inversion esta en el tipo de moneda que se esta trabajando
            let arrayProtegido = [];
            for (let i = 0; i < meses_maximo + 1; i++) {
                let aux = inversion * Math.pow(1 + tirMensual, i);
                if (i < meses_maximo) {
                    arrayProtegido[i] = Number(aux.toFixed(2)); // redondeado 2 decimales, para tener mayor exactitud en la visualizacion del grafico
                } else {
                    arrayProtegido[i] = Number(aux.toFixed(0)); // redondeado a entero sin decimales por ser el ultimo valor y para ser mostrado como resultado de grafico
                }
            }

            var gananciaFinal = inversion + plusvaliaUsuario;

            //------------------------------------------
            // grafica de desprotegido y protegido

            let arrayMeses = [];
            for (let i = 0; i < meses_maximo + 1; i++) {
                arrayMeses[i] = "Mes " + i;
            }

            let paqueteDatos_e = {
                canvasId: "grafico_x21_1",
                etiquetas: arrayMeses, // []
                datasets_1: {
                    label: "Desprotegido",
                    data: arrayDesprotegido, // []
                },
                datasets_2: {
                    label: "Protegido",
                    data: arrayProtegido, // []
                },
            };

            grafico_x21(paqueteDatos_e);

            // Crear el gráfico
            //var canvas_e = document.getElementById("grafico_x21_1").getContext("2d");

            // NO se agregara otra grafica adicional donde se muestre los valores finales de perdida y ganancia, en su lugar se mostraran estos valores con acompañamiento de iconos adecuados

            let gananciaFinal_render = numero_punto_coma_query(gananciaFinal);
            let perdidaFinal_render = numero_punto_coma_query(perdidaFinal);

            // visualizamos los valores renderizados
            $(".x21_1_1").text(gananciaFinal_render);
            $(".x21_1_2").text(perdidaFinal_render);

            // significados
            let s_x21_1_1 = `
            Valor que alcalza tus
            ${valor_inversion_bs}
            Bs al cabo de los
            ${meses_maximo}
            meses por encontrarse protegidos con la adquisición de
            fracciones de terreno SOLIDEXA.
            `;
            $(".s_x21_1_1").attr("data-content", s_x21_1_1);

            let s_x21_1_2 = `
            Perdida del poder de compra que tus
            ${valor_inversion_bs}
                                    Bs alcanzan al cabo de los
                                    ${meses_maximo}
                                    meses por no estar protegido frente a la inflación.
            `;
            $(".s_x21_1_2").attr("data-content", s_x21_1_2);
        }

        //-------------------------------------------------------
        // PROTECCION CONTRA DEVALUACION (LOS RESULTADOS DEBEN ESTAR EN DOLARES)
        // gananciaFinal (que viene de valor protegido frente a la inflacion) se encuentra en la moneda seleccinada (Bs o $us) de modo que si se encuntra en Bs, debera ser convertido a $us

        if (tipoMoneda === "sus") {
            var protegido_sus = gananciaFinal;
        } else {
            if (tipoMoneda === "bs") {
                var protegido_sus = Math.floor(gananciaFinal / tc_oficial);
            }
        }

        // floor redondea al inmediato entero inferior y devuelve tipo numerico
        let desprotegido_sus = Math.floor(valor_inversion / tcParalelo);
        //let beneficio_sus = protegido_sus - desprotegido_sus;

        let desprotegido_sus_render = numero_punto_coma_query(desprotegido_sus);
        let protegido_sus_render = numero_punto_coma_query(protegido_sus);
        //let beneficio_sus_render = numero_punto_coma_query(beneficio_sus);

        // grafico de DEVALUACION (protegido vs desprotegido)

        let paqueteDatos_f = {
            canvasId: "grafico_21_3",
            etiquetas: ["Protegido", "Desprotegido"],
            datasets: {
                label: "Valor $us",
                data: [protegido_sus, desprotegido_sus],
            },
        };

        grafico_21(paqueteDatos_f);

        // visualizamos el numero de años
        $(".21_3_1").text(protegido_sus_render);
        $(".21_3_2").text(desprotegido_sus_render);

        // significados
        let s_21_3_1 = `
                    es el valor que adquieren tus
                    ${valor_inversion_bs}
                    Bs
                    al cabo de los
                    ${meses_maximo}
                    meses convertidos a dolares gracias al ser invertidos en
                    fracciones del terreno SOLIDEXA.
                    `;
        $(".s_21_3_1").attr("data-content", s_21_3_1);

        let s_21_3_2 = `
                    es el valor que adquieren tus
                    ${valor_inversion_bs}
                    Bs
                    al cabo de los
                    ${meses_maximo}
                    meses convertidos a dolares en el mercado paralelo.
                    `;
        $(".s_21_3_2").attr("data-content", s_21_3_2);

        //-------------------------------------------------------
    } else {
        $(".ref-cal_te_copropietario").after(
            `<div class="alert alert-danger copropietario_alerta mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">Todos los campos requeridos deben estar debidamente llenados y acordes a la realidad del mercado nacional.</p>
            </div>`
        );
    }
});

//==================================================================
//==================================================================
// Calculadora Terreno COMPARACION
$("#cal_te_comparacion").click(function (e) {
    var tc_oficial = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico

    var tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

    $(".comparacion_alerta").remove(); // eliminamos todos los alert mensajes

    //--------------------------------------------
    $(".contenedor_2").hide(); // ocultamos
    $(".contenedor_3").hide(); // ocultamos (comision desperdiciada)
    //--------------------------------------------

    let comisionSeleccionada = $("#ajustar_comision").prop("checked"); // Verifica si está seleccionado. DEVUELVE true o false
    if (comisionSeleccionada) {
        //console.log("El checkbox está seleccionado.");
        var input_comision = Number($("#input_comision").val());
        if (input_comision > 0) {
            var comision = true;
        } else {
            var comision = false;
        }
    } else {
        //console.log("El checkbox está deseleccionado.");
        var comision = true;
    }

    let precio_te_otro = Number($("#precio_te_otro").val());
    let superficie_te_otro = Number($("#superficie_te_otro").val());

    if (precio_te_otro > 0 && superficie_te_otro > 0 && comision === true) {
        //---------------------------

        if (tipoMoneda === "sus") {
            var cambio = tc_oficial; // ej: 7
        } else {
            if (tipoMoneda === "bs") {
                var cambio = 1;
            }
        }
        //----------------------------------------

        let tradicional_pm2 = precio_te_otro / superficie_te_otro;

        let solidexa_te_bsm2 = Number($(".solidexa_te_bsm2").attr("data-solidexa_te_bsm2"));
        let solidexa_pm2 = solidexa_te_bsm2 * (1 / cambio);

        if (tradicional_pm2 >= solidexa_pm2) {
            let paqueteDatos = {
                tipoMoneda, // sus o bs
                tc_oficial,
            };

            let resultadoPronostico = tePronosticoPrecioM2(paqueteDatos);

            // "pronostico_pm2" esta en la moneda correcta en el que se esta trabajando
            let pronostico_pm2 = resultadoPronostico.pronostico_pm2;
            let pronostico_periodo = resultadoPronostico.pronostico_periodo;

            let minimo_bsm2 = Number($(".minimo_bsm2").attr("data-minimo_bsm2"));
            let maximo_bsm2 = Number($(".maximo_bsm2").attr("data-maximo_bsm2"));

            let minimo = minimo_bsm2 * (1 / cambio);
            let maximo = maximo_bsm2 * (1 / cambio);

            let num_ptje = ((tradicional_pm2 - minimo) / (maximo - minimo)) * 100;
            let string_ptje = num_ptje.toFixed(2) + "%";
            $("#p_tradicional_precio_m2").css("width", string_ptje);

            let i_tradicional_precio_m2 = numero_punto_coma_query(tradicional_pm2.toFixed(2));
            $("#i_tradicional_precio_m2").val(i_tradicional_precio_m2);

            //----------------------------------------
            $(".contenedor_2").show(); // visualizamos

            // eliminamos todos los elementos que contienen a los graficos
            // los eliminamos para que los graficos nuevos no sean creados encima de los antiguos
            //  empty(). Este método solo eliminará todos los hijos del elemento seleccionado.
            $("#contenedor_2_g_1").empty();
            $("#contenedor_2_g_2").empty();

            // ahora creamos nuevamente el elemento que contendra al grafico nuevo
            // append lo crea como hijo
            $("#contenedor_2_g_1").append(`<canvas id="grafico_22_1"></canvas>`);
            $("#contenedor_2_g_2").append(`<canvas id="grafico_21_4"></canvas>`);

            //----------------------------------------
            // calculo de la PLUSVALIA ACTUAL, es decir sin considerar los x meses de espera desde el inicio de la convocatoria de solidexa, hasta el fin de reservacion

            let promedio_bsm2 = Number($(".promedio_bsm2").attr("data-promedio_bsm2"));
            let promedio_pm2 = promedio_bsm2 * (1 / cambio);

            let plus_solidexa_pm2 = Number((promedio_pm2 - solidexa_pm2).toFixed(2)); // precio por m2
            let plus_tradicional_pm2 = Number((promedio_pm2 - tradicional_pm2).toFixed(2)); // precio por m2

            if (plus_tradicional_pm2 <= promedio_pm2) {
                plus_tradicional_pm2 = 0;
            }

            //----------------------
            // grafico plusvalia
            // para graficar barras apiladas

            let paqueteDatos_a = {
                canvasId: "grafico_22_1",
                etiquetas: ["SOLIDEXA", "Tradicional"],
                datasets_1: {
                    label: "Precio",
                    data: [solidexa_pm2, tradicional_pm2],
                },
                datasets_2: {
                    label: "Plusvalía",
                    data: [plus_solidexa_pm2, plus_tradicional_pm2],
                },
            };

            grafico_22(paqueteDatos_a);

            // RENDERIZAR LOS VALORES

            let r_plus_solidexa = numero_punto_coma_query(plus_solidexa_pm2);
            $(".22_1_1").text(r_plus_solidexa);

            let r_plus_tradicional = numero_punto_coma_query(plus_tradicional_pm2);
            $(".22_1_2").text(r_plus_tradicional);

            // significados
            let s_22_1_1 = `Es la plusvalia que presenta el terreno SOLIDEXA.`;
            $(".s_22_1_1").attr("data-content", s_22_1_1);
            let s_22_1_2 = `Es la plusvalía que presenta el terreno tradicional.`;
            $(".s_22_1_2").attr("data-content", s_22_1_2);

            //----------------------------------------
            // calculo del tiempo de espera PLUSVALIA ACTUAL

            var paqueteria = {
                pronostico_pm2,
                pronostico_periodo,
                promedio_pm2,
                solidexa_pm2,
                tradicional_pm2,
            };

            let year_espera = tiempoEsperaPlusvalia(paqueteria);

            //----------------------
            // grafico tiempo de espera

            let paqueteDatos_b = {
                canvasId: "grafico_21_4",
                etiquetas: ["SOLIDEXA", "Tradicional"],
                datasets: {
                    label: "Plusvalía",
                    data: [plus_solidexa_pm2, plus_tradicional_pm2],
                },
            };

            grafico_21(paqueteDatos_b);

            // visualizamos el numero de años
            $(".21_4_1").text(year_espera);

            // significados
            let s_21_4_1 = `Es el tiempo que le tomaría al terreno tradicional igualar la
                                    plusvalía de SOLIDEXA.`;
            $(".s_21_4_1").attr("data-content", s_21_4_1);

            //----------------------------------------
            // calculo de comsion desperdiciada (si la casilla fue seleccionada)

            if (comisionSeleccionada) {
                $(".contenedor_3").show(); // visualizamos
                $("#contenedor_3_g_1").empty(); // eliminamos el hijo que tiene
                $("#contenedor_3_g_1").append(`<canvas id="grafico_12_3"></canvas>`); // creamos un nuevo hijo

                var num_comision = Number((precio_te_otro * (input_comision / 100)).toFixed(0));
                var rend_solidexa = plus_solidexa_pm2 / solidexa_pm2;
                var num_oportunidad = Number(
                    (precio_te_otro * (input_comision / 100) * rend_solidexa).toFixed(0)
                );

                //----------------------------------------
                // para graficar barras
                // Datos para el gráfico de barras apiladas

                let paqueteDatos_c = {
                    canvasId: "grafico_12_3",
                    etiquetas: ["Tradicional"],
                    datasets_1: {
                        label: "Comisión",
                        data: [num_comision],
                    },
                    datasets_2: {
                        label: "Ganancia perdida",
                        data: [num_oportunidad],
                    },
                };

                grafico_12(paqueteDatos_c);

                // RENDERIZAR LOS VALORES
                let r_comision = numero_punto_coma_query(num_comision);
                let r_oportunidad = numero_punto_coma_query(num_oportunidad);

                $(".12_3_1").text(r_comision);
                $(".12_3_2").text(r_oportunidad);

                //---------------------------------------
                // para mensaje de perdida de oportunidad por comision
                if (tipoMoneda === "sus") {
                    var simbolo = "$us";
                } else {
                    if (tipoMoneda === "bs") {
                        var simbolo = "Bs";
                    }
                }

                let render_comision = r_comision + " " + simbolo;
                let render_oportunidad = r_oportunidad + " " + simbolo;

                $(".r_comision").text(render_comision);
                $(".r_oportunidad").text(render_oportunidad);

                //---------------------------------------
            }
        } else {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-calcular_plusvalia"
            $(".ref-cal_te_comparacion").after(
                `<div class="alert alert-danger comparacion_alerta mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">
                    El precio $us/m<sup>2</sup> del terreno tradicional se encuentra fuera del rango.
                    <br>
                    Por favor trabaje con datos de terrenos que se encuentran dentro del rango de precios de la zona.
                </p>
            </div>`
            );
        }

        //----------------------------------------
    } else {
        // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-calcular_plusvalia"
        $(".ref-cal_te_comparacion").after(
            `<div class="alert alert-danger comparacion_alerta mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">Llene todos los campos de Precio y Superficie</p>
            </div>`
        );
    }
});

//====================================================================
//====================================================================
