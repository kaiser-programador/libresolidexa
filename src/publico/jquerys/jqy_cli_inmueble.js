// PARA LOGICA DENTRO DE INMUEBLE DESDE LA VISTA PÚBLICA DEL CLIENTE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// seleccion de TIPO DE CALCULADORA INMUEBLE

$("#calInmPropietario").click(function (e) {
    // despintamos todos
    $(".boton-linea-secundario").removeClass("bg-unidad");

    $(this).addClass("bg-unidad");

    $("#c-calInmPropietario").css("display", "block"); // mostrar
    $("#m-calInmPropietario").css("display", "block"); // mostrar
    $("#c-calInmComparar").css("display", "none"); // ocultar
    $("#m-calInmComparar").css("display", "none"); // ocultar
    $("#c-calInmInversionista").css("display", "none"); // ocultar
    $("#m-calInmInversionista").css("display", "none"); // ocultar

    //$("." + data_radio).val(valorRadioSeleccinado);
});

$("#calInmComparar").click(function (e) {
    // despintamos todos
    $(".boton-linea-secundario").removeClass("bg-unidad");

    $(this).addClass("bg-unidad");

    $("#c-calInmComparar").css("display", "block"); // mostrar
    $("#m-calInmComparar").css("display", "block"); // mostrar
    $("#c-calInmPropietario").css("display", "none"); // ocultar
    $("#m-calInmPropietario").css("display", "none"); // ocultar
    $("#c-calInmInversionista").css("display", "none"); // ocultar
    $("#m-calInmInversionista").css("display", "none"); // ocultar

    //$("." + data_radio).val(valorRadioSeleccinado);
});

$("#calInmInversionista").click(function (e) {
    // despintamos todos
    $(".boton-linea-secundario").removeClass("bg-unidad");

    $(this).addClass("bg-unidad");

    $("#c-calInmInversionista").css("display", "block"); // mostrar
    $("#m-calInmInversionista").css("display", "block"); // mostrar
    $("#c-calInmPropietario").css("display", "none"); // ocultar
    $("#m-calInmPropietario").css("display", "none"); // ocultar
    $("#c-calInmComparar").css("display", "none"); // ocultar
    $("#m-calInmComparar").css("display", "none"); // ocultar

    //$("." + data_radio).val(valorRadioSeleccinado);
});

//==================================================================
//==================================================================
// checkbox para el seleccion o deseleccion de la casilla de FINANCIAMIENTO BANCARIO PARA calculadora inmueble - COMPARE
$("#ajustar_financiamiento_a").change(function () {
    if ($(this).is(":checked")) {
        // Acción cuando el checkbox está seleccionado

        $("#range_aporte_a").prop("disabled", false); // permite que el range sea editable
        $("#aporte_a").prop("readonly", false); // Quita el atributo readonly
        $("#aporte_a").removeClass("input_respuesta");
        $("#plazo_a").prop("readonly", false); // Quita el atributo readonly
        $("#plazo_a").removeClass("input_respuesta");
        $("#interes_a").prop("readonly", false); // Quita el atributo readonly
        $("#interes_a").removeClass("input_respuesta");

        $("#aporte_a").val("");
        $("#plazo_a").val("");
        $("#interes_a").val("");
    } else {
        // Acción cuando el checkbox está deseleccionado

        $("#range_aporte_a").prop("disabled", true); // IMPIDE que el range sea editable
        $("#aporte_a").prop("readonly", true); // Añade el atributo readonly
        $("#aporte_a").addClass("input_respuesta");
        $("#plazo_a").prop("readonly", true); // Añade el atributo readonly
        $("#plazo_a").addClass("input_respuesta");
        $("#interes_a").prop("readonly", true); // Añade el atributo readonly
        $("#interes_a").addClass("input_respuesta");

        $("#aporte_a").val(0);
        $("#plazo_a").val(0);
        $("#interes_a").val(0);

        // extraemos el valor minimo en la moneda correcta
        let minimo = $("#range_aporte_a").prop("min"); // .prop develve en valor numerico
        // rangue llevado al valor minimo
        $("#range_aporte_a").val(minimo);
        // input del rangue llevado al valor minimo
        $("#aporte_a").val(minimo);
    }
});
//==================================================================
//==================================================================
// checkbox para el seleccion o deseleccion de la casilla de FINANCIAMIENTO BANCARIO PARA calculadora inmueble - INVERSIONISTA
$("#ajustar_financiamiento_b").change(function () {
    if ($(this).is(":checked")) {
        // Acción cuando el checkbox está seleccionado
        $("#range_aporte_b").prop("disabled", false); // permite que el range sea editable
        $("#aporte_b").prop("readonly", false); // Quita el atributo readonly
        $("#aporte_b").removeClass("input_respuesta");
        $("#plazo_b").prop("readonly", false); // Quita el atributo readonly
        $("#plazo_b").removeClass("input_respuesta");
        $("#interes_b").prop("readonly", false); // Quita el atributo readonly
        $("#interes_b").removeClass("input_respuesta");

        $("#aporte_b").val("");
        $("#plazo_b").val("");
        $("#interes_b").val("");
    } else {
        // Acción cuando el checkbox está deseleccionado

        $("#range_aporte_b").prop("disabled", true); // IMPIDE que el range sea editable
        $("#aporte_b").prop("readonly", true); // Añade el atributo readonly
        $("#aporte_b").addClass("input_respuesta");
        $("#plazo_b").prop("readonly", true); // Añade el atributo readonly
        $("#plazo_b").addClass("input_respuesta");
        $("#interes_b").prop("readonly", true); // Añade el atributo readonly
        $("#interes_b").addClass("input_respuesta");

        $("#aporte_b").val(0);
        $("#plazo_b").val(0);
        $("#interes_b").val(0);

        // extraemos el valor minimo en la moneda correcta
        let minimo = $("#range_aporte_b").prop("min"); // .prop develve en valor numerico
        // rangue llevado al valor minimo
        $("#range_aporte_b").val(minimo);
        // input del rangue llevado al valor minimo
        $("#aporte_b").val(minimo);
    }
});

//==================================================================
//==================================================================
// checkbox para AJUSTAR LA TASA DE RENDIMIENTO DE AHORRO BANCARIO
$("#ajustar_ahorro").change(function () {
    if ($(this).is(":checked")) {
        // Acción cuando el checkbox está seleccionado
        // quita el atributo disabled para que el rangue pueda ser editable
        $("#range_ahorro").prop("disabled", false);

        $("#input_ahorro").prop("readonly", false); // Quita el atributo readonly
        $("#input_ahorro").removeClass("input_respuesta");
    } else {
        // Acción cuando el checkbox está deseleccionado
        // agrega el atributo disabled para que el rangue NO pueda ser editable
        $("#range_ahorro").prop("disabled", true);

        $("#input_ahorro").prop("readonly", true); // Añade el atributo readonly
        $("#input_ahorro").addClass("input_respuesta");

        let tasaNormal = $("#input_ahorro").data("normal"); // tasa de ahorro normal. data devuelve en numerico
        $("#range_ahorro").val(tasaNormal);
        $("#input_ahorro").val(tasaNormal);
    }
});

//==================================================================
//==================================================================
// RANGO para editar el rendimiento de AHORRO BANCARIO

$("#range_ahorro").change(function (e) {
    let cambio = $(this);
    let el_valor = cambio.val();
    $("#input_ahorro").val(el_valor);
});

$("#input_ahorro").keyup(function (e) {
    let minimo = Number($(".limite_min").attr("data-minimo"));
    let maximo = Number($(".limite_max").attr("data-maximo"));
    let valor_numerico = Number($("#input_ahorro").val());

    if (valor_numerico >= minimo && valor_numerico <= maximo) {
        $("#range_ahorro").val(valor_numerico);
    } else {
        alert("la tasa de rendimiento% no debe superar los límites establecidos");
    }
});

//==================================================================
//==================================================================
// RANGO para editar el APORTE PROPIO calculadora inmueble COMPARE

$("#range_aporte_a").change(function (e) {
    let cambio = $(this);
    let el_valor = cambio.val();
    $("#aporte_a").val(el_valor);
});

$("#aporte_a").keyup(function (e) {
    let minimo = Number($("#range_aporte_a").attr("min"));
    let maximo = Number($("#range_aporte_a").attr("max"));
    let valor_numerico = Number($("#aporte_a").val());

    if (valor_numerico >= minimo && valor_numerico <= maximo) {
        $("#range_aporte_a").val(valor_numerico);
    } else {
        alert("El aporte no debe superar los límites establecidos");
    }
});

//==================================================================
//==================================================================
// RANGO para editar el APORTE PROPIO calculadora inmueble INVERSIONISTA

$("#range_aporte_b").change(function (e) {
    let cambio = $(this);
    let el_valor = cambio.val();
    $("#aporte_b").val(el_valor);
});

$("#aporte_b").keyup(function (e) {
    let minimo = Number($("#range_aporte_b").attr("min"));
    let maximo = Number($("#range_aporte_b").attr("max"));
    let valor_numerico = Number($("#aporte_b").val());

    if (valor_numerico >= minimo && valor_numerico <= maximo) {
        $("#range_aporte_b").val(valor_numerico);
    } else {
        alert("El aporte no debe superar los límites establecidos");
    }
});

//==================================================================
//==================================================================

$("#selector_periodo").change(function (e) {

    var tc_oficial = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico

    var tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

    if (tipoMoneda === "sus") {
        var cambio = tc_oficial;
    } else {
        if (tipoMoneda === "bs") {
            var cambio = 1;
        }
    }

    let periodo = Number($("#selector_periodo").val());

    var n_c = $(".construccion_mes").length;

    if (n_c > 0) {
        // .data extrae el valor y lo devuelve en tipo numerico
        //let construccion_bs = $("#construccion_inv").data("bs");
        let solidexa_inm_bs = $(".solidexa_inm_bs").data("solidexa_inm_bs");
        let suelo_bs = $(".suelo_bs").data("suelo_bs");
        let inversion_bs = $(".inversion_bs").data("inversion_bs"); // el pago actual que el inversionista debera pagar para invertir inicialmente en el inmuebe

        let aux_precio_bs = suelo_bs;

        let contador = 0;
        for (let i = 0; i < n_c; i++) {
            contador = contador + 1;
            if (aux_precio_bs == inversion_bs) {
                let disponibles = n_c - contador;
                if (disponibles <= periodo) {
                    let limite = contador + periodo;
                    for (let j = contador; j < limite; j++) {
                        let pago = $(".construccion_mes").eq(j).data("precio");
                        aux_precio_bs = aux_precio_bs + pago;
                    }
                    var inversionFinal_bs = aux_precio_bs;
                } else {
                    var inversionFinal_bs = solidexa_inm_bs; // (precio justo en Bs)
                }
                break; // para salir de este bucle for
            } else {
                // .data extrae el valor del atributo "data-precio" y lo convierte en tipo numerico
                let pago = $(".construccion_mes").eq(i).data("precio");
                aux_precio_bs = aux_precio_bs + pago;
            }
        }
    }

    $("#inversion_inm").attr("data-bs", inversionFinal_bs);

    // .floor redondea el valor al inmediato entero inferior y lo devuelve en tipo numerico
    let inversionFinal = Math.floor(inversionFinal_bs * (1 / cambio));

    let inversionFinal_render = numero_punto_coma_query(inversionFinal);

    $("#inversion_inm").val(inversionFinal_render);

    let suelo = Math.floor(suelo_bs * (1 / cambio));
    let construccion = inversionFinal - suelo;
    let construccion_render = numero_punto_coma_query(construccion);
    $("#construccion_inv").val(construccion_render);
});

//==================================================================
//==================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA LAS FLECHAS DE DESPLAZAMIENTO

$(".flechas_desplazamiento").click(function (e) {
    let vemos = $(".aux_desplazamiento").attr("data-desplazamiento");

    if (vemos == "barras") {
        // actualmente se ven barras, entonces ocultamos barras y visualizamos velocimetros

        $(".gra_velocimetro").css("display", "block");
        $(".texto_velocimetro").css("display", "block");
        $(".gra_barras").css("display", "none");
        $(".texto_barras").css("display", "none");

        $(".aux_desplazamiento").attr("data-desplazamiento", "velocimetros");
    }

    if (vemos == "velocimetros") {
        // actualmente se ven velocimetros, entonces ocultamos velocimetros y visualizamos barras

        $(".gra_velocimetro").css("display", "none");
        $(".texto_velocimetro").css("display", "none");
        $(".gra_barras").css("display", "block");
        $(".texto_barras").css("display", "block");

        $(".aux_desplazamiento").attr("data-desplazamiento", "barras");
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// LADO PROPIETARIO

//---------------------------------------------------
// PARA SELECCION DE RADIOS COMISIÓN SI O NO
$(".comisionP").click(function (e) {
    var valorRadioSeleccinado = $(this).val();
    if (valorRadioSeleccinado == "si") {
        // habilitamos el input para introducir % de comisión
        $("#label_input_comision").prop("disabled", false);
        // llenamos con 3 el input
        $("#label_input_comision").val(3);
    }
    if (valorRadioSeleccinado == "no") {
        // llenamos con CERO el input
        $("#label_input_comision").val(0);
        // DEShabilitamos el input para introducir % de comisión
        $("#label_input_comision").prop("disabled", true);
    }

    $(".comision_si_no").attr("data-comision", valorRadioSeleccinado);
});
//---------------------------------------------------

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CALCULADORA INMUEBLE - PROPIETARIO

$("#cal_inm_propietario").click(function (e) {
    var tc_oficial = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico

    var tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

    $(".propietario_alerta").remove(); // eliminamos todos los alert mensajes

    //--------------------------------------------
    $(".contenedor_1").hide(); // ocultamos

    let meses_maximo = 8;

    //--------------------------------------------
    // respuestas originadas desde el servidor
    let tc_ine = Number($(".tc_ine").attr("data-tc_ine"));
    let tc_paralelo = Number($(".tc_paralelo").attr("data-tc_paralelo"));
    let inflacion_ine = Number($(".inflacion_ine").attr("data-inflacion_ine"));
    let promedio_bsm2 = Number($(".promedio_bsm2").attr("data-promedio_bsm2"));
    
    let solidexa_inm_bsm2 = Number($(".solidexa_inm_bsm2").attr("data-solidexa_inm_bsm2"));
    let solidexa_inm_m2 = Number($(".solidexa_inm_m2").attr("data-solidexa_inm_m2"));
    let solidexa_inm_bs = Number($(".solidexa_bs").attr("data-solidexa_bs"));

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

    // suma de dinero que el PROPIETARIO debe pagar para adquirir el inmueble en el momento actual
    let inversionPropietario = Number($("#inversionPropietario").val());

    if (inversionPropietario > 0 && economia === true) {
        $(".contenedor_1").show(); // visualizamos
        $("#contenedor_1_g_1").empty();
        $("#contenedor_1_g_2").empty();
        $("#contenedor_1_g_3").empty();
        $("#contenedor_1_g_4").empty();
        $("#contenedor_1_g_5").empty();

        $("#contenedor_1_g_1").append(`<canvas id="grafico_21_1"></canvas>`);
        $("#contenedor_1_g_2").append(`<canvas id="grafico_21_2"></canvas>`);
        $("#contenedor_1_g_3").append(`<canvas id="grafico_x21_1"></canvas>`);
        $("#contenedor_1_g_4").append(`<canvas id="grafico_12_1"></canvas>`);
        $("#contenedor_1_g_5").append(`<canvas id="grafico_21_3"></canvas>`);

        if (tipoMoneda === "sus") {
            var cambio = tc_oficial;
        } else {
            if (tipoMoneda === "bs") {
                var cambio = 1;
            }
        }

        //------------------------------------------
        // PRONOSTICO DE PRECIOS POR M2 DEL INMUEBLE

        let paqueteDatos = {
            tipoMoneda, // sus o bs
            tc_oficial,
        };

        let resultadoPronostico = inmPronosticoPrecioM2(paqueteDatos);

        // "pronostico_pm2" ya se encuentra en la moneda correcta en el que se esta trabajando
        let pronostico_pm2 = resultadoPronostico.pronostico_pm2;
        let pronostico_periodo = resultadoPronostico.pronostico_periodo;

        //----------------------------------------
        // calculo de la PLUSALIA AL FINAL DE LOS meses_maximo (MESES DE TIEMPO QUE SE DEMORA DESDE EL INICIO DE LA CONVOCATORIA HASTA EL FIN DE LA RESERVACION)

        let promedio_pm2 = promedio_bsm2 * (1 / cambio);

        let solidexa_pm2_futuro = promedio_pm2; // por defecto, luego sera corregido en las siguientes lineas de codigo

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

            //-------------------
            // ahora se procede a extraer el valor normalizado futuro del precio por m2 del terreno

            // Obtener la fecha actual
            let fechaActualAux = new Date();

            // Sumar los meses
            fechaActualAux.setMonth(fechaActualAux.getMonth() + meses_maximo);

            // Obtener el año y el mes de la nueva fecha
            let nuevoAno = fechaActualAux.getFullYear();
            let nuevoMes = fechaActualAux.getMonth() + 1; // getMonth() devuelve un índice (0-11), así que sumamos 1

            if (nuevoMes <= 5) {
                var semestreNuevo = "I";
            } else {
                var semestreNuevo = "II";
            }

            // formato: "2019 - II"
            let periodoNuevo = nuevoAno + " - " + semestreNuevo;

            if (pronostico_pm2_ok.length > 0) {
                for (let i = 0; i < pronostico_periodo.length; i++) {
                    let elemento = pronostico_periodo[i];
                    if (elemento === periodoNuevo) {
                        // dado que pronostico_periodo y pronostico_pm2_ok son complementarios, bast con encontrar la posicion "i" del periodo nuevo en pronostico_periodo, para utilizar esta misma posicion "i" en pronostico_pm2_ok y asi extraer de este array el valor del precio por m2 del terreno en ese periodo futuro
                        solidexa_pm2_futuro = pronostico_pm2_ok[i];
                        break; // para salir del bucle for
                    }
                }
            }
        }

        //-------------------

        // Ganancia plusvalia en valor por m2
        let solidexa_pm2 = solidexa_inm_bsm2 * (1 / cambio);
        let plus_solidexa_pm2 = solidexa_pm2_futuro - solidexa_pm2; // precio por m2

        // Ganancia plusvalia en valor monetario
        let plusvalia_inm = solidexa_inm_m2 * plus_solidexa_pm2;

        let precioJustoInm = solidexa_inm_bs * (1 / cambio);

        let rendimiento = plusvalia_inm / precioJustoInm;

        // ganancia por plusvalia del usuario en funcion a su inversion como PROPIETARIO
        // floor redondea al inmediato entero inferior y devuelve tipo numerico
        let plusvaliaUsuario = Math.floor(inversionPropietario * rendimiento);
        let plusvaliaUsuarioRender = numero_punto_coma_query(plusvaliaUsuario);

        // grafica barras apiladas
        // Ganancia plusvalía

        let paqueteDatos_a = {
            canvasId: "grafico_12_1",
            etiquetas: ["SOLIDEXA"],
            datasets_1: {
                label: "Inversión",
                data: [inversionPropietario],
            },
            datasets_2: {
                label: "Ganancia plusvalía",
                data: [plusvaliaUsuario],
            },
        };

        grafico_12(paqueteDatos_a);

        // RENDERIZAR LOS VALORES
        $(".12_1_1").text(plusvaliaUsuarioRender);

        //-------------------------------------------------------
        // BENEFICIO --- Inversión $us
        // la moneda en mostrarse sera siempre en DOLARES dado que es en esa moneda lo que se pretende mostrar el nivel de ganancia que se obtiene con SOLIDEXA frente al tipo de cambio paralelo

        if (tipoMoneda === "sus") {
            var solidexa_sus = inversionPropietario;
            let solidexa_bs = $("#inversionPropietario").data("bs"); // .data ya devuelve en valor numerico
            // floor redondea al inmediato entero inferior y devuelve tipo numerico
            var tradicional_sus = Math.floor(solidexa_bs / tcParalelo);
        } else {
            if (tipoMoneda === "bs") {
                // floor redondea al inmediato entero inferior y devuelve tipo numerico
                var tradicional_sus = Math.floor(inversionPropietario / tcParalelo);
                var solidexa_sus = Math.floor(inversionPropietario / tc_ine);
            }
        }

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

        //-------------------------------------------------------
        // BENEFICIO --- Compra M2

        var pm2_solidexa = solidexa_inm_bsm2 * (1 / cambio);
        var pm2_tradicional = promedio_bsm2 * (1 / cambio);

        let solidexa_m2 = Math.floor(inversionPropietario / pm2_solidexa);
        let tradicional_m2 = Math.floor(inversionPropietario / pm2_tradicional);

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

        //-------------------------------------------------------
        // PROTECCION INFLACION ----- Desprotegido

        // la inflacion anual sera convertida a inflacion mensual y en decimal
        let inflacionAnual = inflacion / 100; // inflacion en decimal
        //  ((1+intAnual)^(1/12))-1
        // Math.pow(base, exponente)
        let inflacionMensual = Math.pow(1 + inflacionAnual, 1 / 12) - 1; // en decimal

        //  C24/((1+$C$12)^B24)

        // construccion de los valores de perdida de poder de compra en funcion al tiempo
        // inversionPropietario esta en el tipo de moneda que se esta trabajando
        let arrayDesprotegido = [];
        for (let i = 0; i < meses_maximo + 1; i++) {
            let aux = inversionPropietario / Math.pow(1 + inflacionMensual, i);
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
                flujosDinero[i] = -inversionPropietario; // en negativo porque representa inversionPropietario (salida) de dinero
            } else {
                if (i === meses_maximo) {
                    flujosDinero[i] = inversionPropietario + plusvaliaUsuario;
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
            // inversionPropietario esta en el tipo de moneda que se esta trabajando
            let arrayProtegido = [];
            for (let i = 0; i < meses_maximo + 1; i++) {
                let aux = inversionPropietario * Math.pow(1 + tirMensual, i);
                if (i < meses_maximo) {
                    arrayProtegido[i] = Number(aux.toFixed(2)); // redondeado 2 decimales, para tener mayor exactitud en la visualizacion del grafico
                } else {
                    arrayProtegido[i] = Number(aux.toFixed(0)); // redondeado a entero sin decimales por ser el ultimo valor y para ser mostrado como resultado de grafico
                }
            }

            var gananciaFinal = inversionPropietario + plusvaliaUsuario;

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
        }

        //-------------------------------------------------------
        // PROTECCION CONTRA DEVALUACION (LOS RESULTADOS DEBEN ESTAR EN DOLARES)
        // gananciaFinal (que viene de valor protegido frente a la inflacion) se encuentra en la moneda seleccinada (Bs o $us) de modo que si se encuntra en Bs, debera ser convertido a $us

        if (tipoMoneda === "sus") {
            var protegido_sus = gananciaFinal;
            let inversionPropietariBs = $("#inversionPropietario").data("bs");
            var desprotegido_sus = Math.floor(inversionPropietariBs / tcParalelo);
        } else {
            if (tipoMoneda === "bs") {
                var protegido_sus = Math.floor(gananciaFinal / tc_oficial);
                // floor redondea al inmediato entero inferior y devuelve tipo numerico
                var desprotegido_sus = Math.floor(inversionPropietario / tcParalelo);
            }
        }

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

        //-------------------------------------------------------
    } else {
        $(".ref-cal_inm_propietario").after(
            `<div class="alert alert-danger propietario_alerta mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">Todos los campos requeridos deben estar debidamente llenados y acordes a la realidad del mercado nacional.</p>
            </div>`
        );
    }
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CALCULADORA INMUEBLE - COMPARE

$("#cal_inm_comparacion").click(function (e) {
    //--------------------------------------------
    $(".comparacion_alerta").remove(); // eliminamos todos los alert mensajes

    $(".contenedor_2").hide(); // ocultamos (plusvalia y tiempo de espera)
    $(".contenedor_3").hide(); // ocultamos (intermediario)
    $(".contenedor_4").hide(); // ocultamos (prestamo banco)
    //--------------------------------------------

    var tc_oficial = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico

    var tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

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

    let financiamientoSeleccionada = $("#ajustar_financiamiento_a").prop("checked"); // Verifica si está seleccionado. DEVUELVE true o false
    if (financiamientoSeleccionada) {
        //console.log("El checkbox está seleccionado.");
        var aporte = Number($("#aporte_a").val());
        var plazo = Number($("#plazo_a").val());
        var interes = Number($("#interes_a").val());
        if (aporte > 0 && plazo > 0 && interes > 0) {
            var financiamiento = true;
        } else {
            var financiamiento = false;
        }
    } else {
        //console.log("El checkbox está deseleccionado.");
        var financiamiento = true;
    }

    let precio_inm_otro = Number($("#precio_inm_otro").val());
    let superficie_inm_otro = Number($("#superficie_inm_otro").val());

    if (
        precio_inm_otro > 0 &&
        superficie_inm_otro > 0 &&
        comision === true &&
        financiamiento === true
    ) {
        //---------------------------

        if (tipoMoneda === "sus") {
            var cambio = tc_oficial; // ej: 7
        } else {
            if (tipoMoneda === "bs") {
                var cambio = 1;
            }
        }
        //----------------------------------------

        let tradicional_pm2 = precio_inm_otro / superficie_inm_otro;

        let solidexa_inm_bsm2 = Number($(".solidexa_inm_bsm2").attr("data-solidexa_inm_bsm2"));
        let solidexa_pm2 = solidexa_inm_bsm2 * (1 / cambio);

        if (tradicional_pm2 >= solidexa_pm2) {
            let paqueteDatos = {
                tipoMoneda, // sus o bs
                tc_oficial,
            };

            let resultadoPronostico = inmPronosticoPrecioM2(paqueteDatos);

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
            $("#i_tradicional_precio_m2").text(i_tradicional_precio_m2);

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

            let plus_solidexa_pm2 = promedio_pm2 - solidexa_pm2; // precio por m2
            let plus_tradicional_pm2 = promedio_pm2 - tradicional_pm2; // precio por m2

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

            //----------------------------------------
            // calculo de comision desperdiciada (si la casilla fue seleccionada)

            if (comisionSeleccionada) {
                $(".contenedor_3").show(); // visualizamos
                $("#contenedor_3_g_1").empty(); // eliminamos el hijo que tiene
                $("#contenedor_3_g_1").append(`<canvas id="grafico_12_2"></canvas>`); // creamos un nuevo hijo

                var num_comision = Number((precio_inm_otro * (input_comision / 100)).toFixed(0));
                var rend_solidexa = plus_solidexa_pm2 / solidexa_pm2;
                var num_oportunidad = Number(
                    (precio_inm_otro * (input_comision / 100) * rend_solidexa).toFixed(0)
                );

                //----------------------------------------
                // para graficar barras
                // Datos para el gráfico de barras apiladas

                let paqueteDatos_c = {
                    canvasId: "grafico_12_2",
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

                $(".12_2_1").text(r_comision);
                $(".12_2_2").text(r_oportunidad);

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

            //----------------------------------------

            if (financiamientoSeleccionada) {
                let solidexa_inm_bs = Number($(".solidexa_bs").attr("data-solidexa_bs"));
                let solidexa_inm = solidexa_inm_bs * (1 / cambio);

                if (solidexa_inm > precio_inm_otro) {
                    // los valores se mostraran en moneda/m2
                    let solidexa_inm_m2 = Number(
                        $(".solidexa_inm_m2").attr("data-solidexa_inm_m2")
                    );
                    var areaSolidexa = solidexa_inm_m2;
                    var areaTradicional = superficie_inm_otro;
                    $(".area").css("display", "block"); // mostramos
                } else {
                    // los valores se mostraran en moneda
                    var areaSolidexa = 1;
                    var areaTradicional = 1;
                    $(".area").css("display", "none"); // ocultamos
                }

                //----------------------------------------
                // calculo de financiamiento - prestamo e intereses

                let plazo_meses = plazo * 12;
                let prestamo_solidexa = solidexa_inm - aporte;
                let prestamo_tradicional = precio_inm_otro - aporte;

                //----------------------------------------------------------
                // calculo de interes mensual

                let aux_i = interes / 100; // interes anual en decimal

                // conversion de interes anual a mensual
                //  ((1+intAnual)^(1/12))-1
                // Math.pow(base, exponente)
                let i_mensual = Math.pow(1 + aux_i, 1 / 12) - 1; // interes mensual en decimal

                //----------------------------------------------------------
                // calculo de cuota mensual

                let aux_numerador = i_mensual * Math.pow(1 + i_mensual, plazo_meses);
                let aux_denominador = Math.pow(1 + i_mensual, plazo_meses) - 1;

                // $us/mes o Bs/mes
                let mensualidad_solidexa = prestamo_solidexa * (aux_numerador / aux_denominador);
                let mensualidad_tradicional =
                    prestamo_tradicional * (aux_numerador / aux_denominador);

                //----------------------------------------------------------
                // calculo de intereses acumulados

                let interesesTotales_s = 0;
                let saldoRestante_s = prestamo_solidexa; // saldo restante SOLIDEXA

                let interesesTotales_t = 0;
                let saldoRestante_t = prestamo_tradicional; // saldo restante tradicional

                for (let i = 0; i < plazo_meses; i++) {
                    //--------------------------------------------------
                    // Calcular los intereses para este período, inmueble SOLIDEXA
                    var interesesEsteMes_s = saldoRestante_s * i_mensual;

                    // Actualizar el saldo restante
                    saldoRestante_s = saldoRestante_s - (mensualidad_solidexa - interesesEsteMes_s);

                    // total de intereses pagados hasta este periodo
                    interesesTotales_s = interesesTotales_s + interesesEsteMes_s;

                    //--------------------------------------------------
                    // Calcular los intereses para este período, inmueble TRADICIONAL
                    var interesesEsteMes_t = saldoRestante_t * i_mensual;

                    // Actualizar el saldo restante
                    saldoRestante_t =
                        saldoRestante_t - (mensualidad_tradicional - interesesEsteMes_t);

                    // Sumar los intereses de este período al total
                    interesesTotales_t = interesesTotales_t + interesesEsteMes_t;
                    //----------------------------------------------------------
                }

                let credito_solidexa = Math.round(prestamo_solidexa / areaSolidexa);
                let credito_tradicional = Math.round(prestamo_tradicional / areaTradicional);

                let int_acu_solidexa = Math.round(interesesTotales_s / areaSolidexa);
                let int_acu_tradicional = Math.round(interesesTotales_t / areaTradicional);

                let mensual_solidexa = Math.round(mensualidad_solidexa / areaSolidexa);
                let mensual_tradicional = Math.round(mensualidad_tradicional / areaTradicional);

                $(".contenedor_4").show(); // visualizamos
                $("#contenedor_4_g_1").empty(); // eliminamos el hijo que tiene
                $("#contenedor_4_g_1").append(`<canvas id="grafico_22_2"></canvas>`); // creamos un nuevo hijo
                $("#contenedor_4_g_2").empty(); // eliminamos el hijo que tiene
                $("#contenedor_4_g_2").append(`<canvas id="grafico_21_5"></canvas>`); // creamos un nuevo hijo

                //----------------------
                // grafico Financiamiento:  Prestamo e intereses SOLIDEXA Vs Tradicional

                let paqueteDatos_d = {
                    canvasId: "grafico_22_2",
                    etiquetas: ["SOLIDEXA", "Tradicional"],
                    datasets_1: {
                        label: "Prestamo",
                        data: [credito_solidexa, credito_tradicional],
                    },
                    datasets_2: {
                        label: "Interés",
                        data: [int_acu_solidexa, int_acu_tradicional],
                    },
                };

                grafico_22(paqueteDatos_d);

                // RENDERIZAR LOS VALORES

                let int_acu_solidexa_r = numero_punto_coma_query(int_acu_solidexa);
                $(".22_2_1").text(int_acu_solidexa_r);

                let int_acu_tradicional_r = numero_punto_coma_query(int_acu_tradicional);
                $(".22_2_2").text(int_acu_tradicional_r);

                //----------------------
                // grafico Financiamiento:  Cuotas mensuales SOLIDEXA Vs Tradicional

                let paqueteDatos_e = {
                    canvasId: "grafico_21_5",
                    etiquetas: ["SOLIDEXA", "Tradicional"],
                    datasets: {
                        label: "Pago mensual",
                        data: [mensual_solidexa, mensual_tradicional],
                    },
                };

                grafico_21(paqueteDatos_e);

                // visualizamos valor renderizado
                let mensual_solidexa_r = numero_punto_coma_query(mensual_solidexa);
                $(".21_5_1").text(mensual_solidexa_r);

                let mensual_tradicional_r = numero_punto_coma_query(mensual_tradicional);
                $(".21_5_2").text(mensual_tradicional_r);

                //----------------------------------------
            }
        } else {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-calcular_plusvalia"
            $(".ref-cal_inm_comparacion").after(
                `<div class="alert alert-danger comparacion_alerta mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">
                    El precio $us/m<sup>2</sup> del inmueble tradicional se encuentra fuera del rango.
                    <br>
                    Por favor trabaje con datos de inmuebles que se encuentran dentro del rango de precios de la zona.
                </p>
            </div>`
            );
        }
    } else {
        // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-calcular_plusvalia"
        $(".ref-cal_inm_comparacion").after(
            `<div class="alert alert-danger comparacion_alerta mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">Llene todos los campos</p>
            </div>`
        );
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CALCULADORA INMUEBLE - INVERSIONISTA

$("#cal_inm_inversion").click(function (e) {
    //--------------------------------------------
    $(".inversion_alerta").remove(); // eliminamos todos los alert mensajes
    $(".texto_inversiones").css("display", "none");

    $(".contenedor_5").hide(); // ocultamos
    $(".contenedor_6").hide(); // ocultamos
    $(".contenedor_7").hide(); // ocultamos
    $(".contenedor_8").hide(); // ocultamos
    //--------------------------------------------

    var tc_oficial = Number(sessionStorage.getItem("tipoCambio")); // Number, porque en sessionStorage al final los datos se almacenan en tipo string, por mas que se los alamacene en type numerico

    var tipoMoneda = sessionStorage.getItem("tipoMoneda"); // bs o sus

    if (tipoMoneda === "sus") {
        var cambio = tc_oficial; // ej: 7
        var simboloMoneda = "$us";
    } else {
        if (tipoMoneda === "bs") {
            var cambio = 1;
            var simboloMoneda = "Bs";
        }
    }

    let ajustar_ahorro = $("#ajustar_ahorro").prop("checked"); // Verifica si está seleccionado. DEVUELVE true o false
    let ajustar_financiamiento = $("#ajustar_financiamiento_b").prop("checked"); // Verifica si está seleccionado. DEVUELVE true o false

    if (ajustar_ahorro) {
        // PARA AHORO BANCARIO
        //console.log("El checkbox está seleccionado.");
        var tasa_ahorro = Number($("#input_ahorro").val());
        if (tasa_ahorro > 0) {
            var ahorro = true;
        } else {
            var ahorro = false;
        }
    } else {
        //console.log("El checkbox está deseleccionado.");
        var ahorro = true;
    }

    if (ajustar_financiamiento) {
        // PARA APALANCAMIENTO BANCARIO
        //console.log("El checkbox está seleccionado.");
        var aporte = Number($("#aporte_b").val());
        var plazo = Number($("#plazo_b").val());
        var interes = Number($("#interes_b").val()); // tasa de interes bancario para prestamo
        if (aporte > 0 && plazo > 0 && interes > 0) {
            var financiamiento = true;
        } else {
            var financiamiento = false;
        }
    } else {
        //console.log("El checkbox está deseleccionado.");
        var financiamiento = true;
    }

    let periodo = Number($("#selector_periodo").val());
    let precio_otro = Number($("#precio_inm_otro_2").val());
    let superficie_otro = Number($("#superficie_inm_otro_2").val());

    // inversion (suma de dinero que el interesado debe invertir en el inmueble)
    // el valor almacenado en el data-bs ya se encuentra redondeado.
    let aux_inversion_inm = $("#inversion_inm").data("bs"); // data devuelve en numerico

    let inversion_inm = aux_inversion_inm * (1 / cambio); // estara en la moneda correcta

    if (
        periodo > 0 &&
        precio_otro > 0 &&
        superficie_otro > 0 &&
        inversion_inm > 0 &&
        ahorro === true &&
        financiamiento === true
    ) {
        //------------------------------------------------------------
        //------------------------------------------------------------
        // rendimiento de ahorro bancario

        //----------------------------
        // calculo de interes mensual

        let aux_i = tasa_ahorro / 100; // interes anual en decimal

        // conversion de interes anual a mensual
        //  ((1+intAnual)^(1/12))-1
        // Math.pow(base, exponente)
        let i_banco_mes = Math.pow(1 + aux_i, 1 / 12) - 1; // interes mensual en decimal
        //----------------------------

        let val_futuro = inversion_inm * Math.pow(1 + i_banco_mes, periodo);

        let ganancia_a = Math.round(val_futuro - inversion_inm);

        let rendimiento_a = Number(
            (((val_futuro - inversion_inm) / inversion_inm) * 100).toFixed(2)
        );

        let inversion_a = inversion_inm;

        // para pocicionamiento del angulo de la flecha
        let angulo_a = Number((1.8 * rendimiento_a - 180).toFixed(2));

        let inversion_a_r = numero_punto_coma_query(inversion_a);
        let ganancia_a_r = numero_punto_coma_query(ganancia_a);
        let rendimiento_a_r = numero_punto_coma_query(rendimiento_a);

        //------------------------------------------------------------
        //------------------------------------------------------------
        // rendimiento de Inmueble tradicional
        let promedio_bsm2 = $(".promedio_bsm2").data("promedio_bsm2"); // data devuelve en numerico
        let promedio_pm2 = promedio_bsm2 * (1 / cambio); // estara en la moneda correcta
        let inversion_b = Number($("#precio_inm_otro_2").val());
        let superficieOtro = Number($("#superficie_inm_otro_2").val());
        let ventaOtro = superficieOtro * promedio_pm2; // ofertado al precio promedio del mercado tradicional
        let ganancia_b = Math.round(ventaOtro - inversion_b);

        let rendimiento_b = Number(((ganancia_b / inversion_b) * 100).toFixed(2));

        let aux_rendimiento_b = (ganancia_b / inversion_b) * 100;

        if (aux_rendimiento_b >= 150) {
            // si el rendimiento sobresaldra de la escala del velocimetro, entonces poner la aguja en el maximo 150%
            // para pocicionamiento del angulo de la flecha
            var angulo_b = Number((1.8 * 150 - 180).toFixed(2));
        } else {
            // para pocicionamiento del angulo de la flecha
            var angulo_b = Number((1.8 * rendimiento_b - 180).toFixed(2));
        }

        let inversion_b_r = numero_punto_coma_query(inversion_b);
        let ganancia_b_r = numero_punto_coma_query(ganancia_b);
        let rendimiento_b_r = numero_punto_coma_query(rendimiento_b);

        //------------------------------------------------------------
        //------------------------------------------------------------
        // rendimiento de SOLIDEXA

        // data devuelve en numerico
        let plusvalia_inm_bs = $(".plusvalia_inm_bs").data("plusvalia_inm_bs");
        let solidexa_inm_bs = $(".solidexa_inm_bs").data("solidexa_inm_bs");

        let rendimiento_c = Number(((plusvalia_inm_bs / solidexa_inm_bs) * 100).toFixed(2));

        let inversion_c = inversion_inm;

        // la ganancia que obtiene la inversion no puede ser directamente igual a la plusvalia total del inmueble SOLIDEXA, porque debe estar acorde y proporcional a la cantidad que se esta inviritiedo en el inmueble SOLIDEXA. Solo llegara a ser igual a la plusvalia total del inmueble si la cantidad invertida es igual al valor total del precio justo del inmueble. Esta proporcionalidad de ganancia se logra trabajando con el rendimiento (en este caso "rendimiento_c")
        let gananciaProporcional = inversion_c * rendimiento_c;

        // no consideramos la plusvalia que tendra utilizando los pronosticos, porque puede darse el caso que el usuario seleccione como periodo de analisis "1 mes", y esto ocasionaria un problema, porque los pronosticos son semestrales, no mensuales.
        let gananciaInversion = gananciaProporcional * (1 / cambio); // estara en la moneda correcta

        let ganancia_c = gananciaInversion;

        if (rendimiento_c >= 150) {
            // si el rendimiento sobresaldra de la escala del velocimetro, entonces poner la aguja en el maximo 150%
            // para pocicionamiento del angulo de la flecha
            var angulo_c = Number((1.8 * 150 - 180).toFixed(2));
        } else {
            // para pocicionamiento del angulo de la flecha
            var angulo_c = Number((1.8 * rendimiento_c - 180).toFixed(2));
        }

        let inversion_c_r = numero_punto_coma_query(inversion_c);
        let ganancia_c_r = numero_punto_coma_query(ganancia_c);
        let rendimiento_c_r = numero_punto_coma_query(rendimiento_c);

        //------------------------------------------------------------
        //------------------------------------------------------------
        // rendimiento de SOLIDEXA PLUS (APALANCAMIENTO)

        if (ajustar_financiamiento) {
            // SI ESTA SELECCIONADO APALANCAMIENTO FINANCIERO

            // dinero que el inversionista pone de su propio bolsillo
            let inversion_d_inicial = aporte;
            // dinero que el inversionista pide prestado a un financiador externo
            let val_financiamiento = inversion_inm - inversion_d_inicial;

            let plazo_finan = plazo * 12; // meses
            //----------------------------------
            // calculo de interes mensual

            let aux_i_finan = interes / 100; // interes anual en decimal

            // conversion de interes anual a mensual
            //  ((1+intAnual)^(1/12))-1
            // Math.pow(base, exponente)
            let i_finan_mes = Math.pow(1 + aux_i_finan, 1 / 12) - 1; // interes mensual en decimal

            //---------------------------------
            // calculo del pago mensual al banco por el financiamiento

            let aux_numerador = i_finan_mes * Math.pow(1 + i_finan_mes, plazo_finan);
            let aux_denominador = Math.pow(1 + i_finan_mes, plazo_finan) - 1;

            // moneda/mes
            let mensualidad_finan = val_financiamiento * (aux_numerador / aux_denominador);

            //---------------------------------

            let cuotasTotales = 0;
            let saldoRestante = val_financiamiento;
            let mes = 0;

            for (let i = 0; i < plazo_finan; i++) {
                mes = mes + 1;
                //--------------------------------
                // Calcular los intereses para este período
                var interesesEsteMes = saldoRestante * i_finan_mes;

                // Actualizar el saldo restante
                saldoRestante = saldoRestante - (mensualidad_finan - interesesEsteMes);

                // total de intereses pagados hasta este mes
                cuotasTotales = cuotasTotales + mensualidad_finan;
                //------------------------------

                if (mes == periodo) {
                    // recuerda que se lo vende al precio promedio del mercado tradicional
                    var venta_inm = inversion_inm + gananciaInversion;

                    var aux_ganancia =
                        venta_inm - saldoRestante - cuotasTotales - inversion_d_inicial;

                    var inversion_d = Math.round(inversion_d_inicial + cuotasTotales); // aporte total considerando los pagos mensuales al banco

                    var ganancia_d = Math.round(aux_ganancia);

                    var rendimiento_d = Number(
                        ((aux_ganancia / (inversion_d + cuotasTotales)) * 100).toFixed(2)
                    );

                    var aux_rendimiento_d = (aux_ganancia / (inversion_d + cuotasTotales)) * 100;
                    if (aux_rendimiento_d >= 150) {
                        // si el rendimiento sobresaldra de la escala del velocimetro, entonces poner la aguja en el maximo 150%
                        // para pocicionamiento del angulo de la flecha
                        var angulo_d = Number((1.8 * 150 - 180).toFixed(2));
                    } else {
                        // para pocicionamiento del angulo de la flecha
                        var angulo_d = Number((1.8 * rendimiento_d - 180).toFixed(2));
                    }

                    var inversion_d_r = numero_punto_coma_query(inversion_d);
                    var ganancia_d_r = numero_punto_coma_query(ganancia_d);
                    var rendimiento_d_r = numero_punto_coma_query(rendimiento_d);

                    break; // para salir del bucle for
                }
            }
        }

        //------------------------------------------------------------
        //------------------------------------------------------------

        if (ajustar_financiamiento) {
            if (rendimiento_d > rendimiento_a && rendimiento_d > rendimiento_b) {
                var apalancamiento = true;
            } else {
                var apalancamiento = false;
            }
        } else {
            var apalancamiento = true; // solo para que continue con el codigo
        }

        if (
            rendimiento_c > rendimiento_a &&
            rendimiento_c > rendimiento_b &&
            apalancamiento == true
        ) {
            //---------------------

            var ancho_ventana = $(window).width(); // resultado en px
            // if (ancho_ventana >= 575) {
            if (ancho_ventana > 575) {
                // ocultamos los botones de flechas desplazamiento
                $(".contenedor_desplazamiento").css("display", "none");
            } else {
                // visualizamos los botones de flechas desplazamiento
                $(".contenedor_desplazamiento").css("display", "block");

                // visualizamos los graficos de barras y ocultamos los velocimetros

                $(".gra_velocimetro").css("display", "none");
                $(".texto_velocimetro").css("display", "none");
                $(".gra_barras").css("display", "block");
                $(".texto_barras").css("display", "block");

                $(".aux_desplazamiento").attr("data-desplazamiento", "barras");
            }

            //----------------------
            // texto_inversiones
            $(".texto_inversiones").css("display", "block");
            // utilizamos ".html" para que respete los elementos html que encierran
            $(".texto_inversiones").html(
                `El rendimiento de cada oportunidad de inversión fue calculado utilizando un período de <b>${periodo} meses</b>, que corresponde al plazo que se otorga al inversionista para que pueda obtener ganancias con la inversión que realice en cualquiera de las opciones presentadas.`
            );

            // popover
            $(".p_ahorro").attr(
                "data-content",
                `Ganancia y rendimiento que obtienes si en lugar de invertir los ${inversion_a} ${simboloMoneda} en el inmueble SOLIDEXA, decides invertirlos en un Depósito a Plazo Fijo (DPF) en un banco o bono que ofrece una tasa de interés del ${tasa_ahorro} % anual durante ${periodo} meses.`
            );

            $(".p_tradicional").attr(
                "data-content",
                `Los ${inversion_b} ${simboloMoneda} que inviertes en el inmueble tradicional, al cabo de ${periodo} meses te habrá generado una ganancia por plusvalía de ${ganancia_b} ${simboloMoneda}`
            );

            $(".p_solidexa").attr(
                "data-content",
                `Al invertir ${inversion_c} ${simboloMoneda} en el inmueble SOLIDEXA, obtienes una plusvalía de ${ganancia_c} ${simboloMoneda}. Esta ganancia se queda contigo en lugar de ir a parar a manos de intermediarios, desarrolladores inmobiliarios o constructoras tradicionales.`
            );

            $(".p_solidexa_p").attr(
                "data-content",
                `Aplicar el apalancamiento financiero a un inmueble competitivo como el de SOLIDEXA puede hacer que tu inversión de ${inversion_d} ${simboloMoneda} obtenga una ganancia multiplicada de ${ganancia_d} ${simboloMoneda}.`
            );

            //-------------------

            $(".contenedor_5").show(); // visualizamos
            $(".contenedor_6").show(); // visualizamos
            $(".contenedor_7").show(); // visualizamos

            // eliminamos todos los elementos que contienen a los graficos
            // los eliminamos para que los graficos nuevos no sean creados encima de los antiguos
            //  empty(). Este método eliminará todos los hijos del elemento seleccionado, pero conservará el propio elemento.
            $("#contenedor_grafico_i_1").empty();
            $("#contenedor_grafico_i_2").empty();
            $("#contenedor_grafico_i_3").empty();

            if (ajustar_financiamiento) {
                $(".contenedor_8").show(); // visualizamos
                $("#contenedor_grafico_i_4").empty();
            }

            //--------------------
            // ahora creamos nuevamente el elemento que contendra al grafico nuevo // append lo crea como hijo
            $("#contenedor_grafico_i_1").append(`<canvas id="grafico_12_3"></canvas>`);
            $("#contenedor_grafico_i_2").append(`<canvas id="grafico_12_4"></canvas>`);
            $("#contenedor_grafico_i_3").append(`<canvas id="grafico_12_5"></canvas>`);

            if (ajustar_financiamiento) {
                $("#contenedor_grafico_i_4").append(`<canvas id="grafico_12_6"></canvas>`);
            }

            //--------------------
            // grafica barras apiladas
            // Ahorro bancario

            let paqueteDatos123 = {
                canvasId: "grafico_12_3",
                etiquetas: ["Ahorro Bancario"],
                datasets_1: {
                    label: "Inversión",
                    data: [inversion_a],
                },
                datasets_2: {
                    label: "Ganancia",
                    data: [ganancia_a],
                },
            };

            grafico_12(paqueteDatos123);

            // RENDERIZAR LOS VALORES
            $(".12_3_1").text(inversion_a_r);
            $(".12_3_2").text(ganancia_a_r);
            $(".12_3_3").text(rendimiento_a_r);

            // el angulo de la linea
            $(".linea1").css("transform", `rotate(${angulo_a}deg)`);

            //----------------------------------------
            // grafica barras apiladas
            // Emprendimiento

            let paqueteDatos124 = {
                canvasId: "grafico_12_4",
                etiquetas: ["Inmueble tradicional"],
                datasets_1: {
                    label: "Inversión",
                    data: [inversion_b],
                },
                datasets_2: {
                    label: "Ganancia",
                    data: [ganancia_b],
                },
            };

            grafico_12(paqueteDatos124);

            // RENDERIZAR LOS VALORES
            $(".12_4_1").text(inversion_b_r);
            $(".12_4_2").text(ganancia_b_r);
            $(".12_4_3").text(rendimiento_b_r);

            // el angulo de la linea
            $(".linea2").css("transform", `rotate(${angulo_b}deg)`);

            //----------------------------------------
            // grafica barras apiladas
            // SOLIDEXA

            let paqueteDatos125 = {
                canvasId: "grafico_12_5",
                etiquetas: ["SOLIDEXA"],
                datasets_1: {
                    label: "Inversión",
                    data: [inversion_c],
                },
                datasets_2: {
                    label: "Ganancia",
                    data: [ganancia_c],
                },
            };

            grafico_12(paqueteDatos125);

            // RENDERIZAR LOS VALORES
            $(".12_5_1").text(inversion_c_r);
            $(".12_5_2").text(ganancia_c_r);
            $(".12_5_3").text(rendimiento_c_r);

            // el angulo de la linea
            $(".linea3").css("transform", `rotate(${angulo_c}deg)`);

            //----------------------------------------
            // grafica barras apiladas
            // SOLIDEXA plus (APALANCAMIENTO)

            if (ajustar_financiamiento) {
                let paqueteDatos126 = {
                    canvasId: "grafico_12_6",
                    etiquetas: ["SOLIDEXA apalancado"],
                    datasets_1: {
                        label: "Inversión",
                        data: [inversion_d],
                    },
                    datasets_2: {
                        label: "Ganancia",
                        data: [ganancia_d],
                    },
                };

                grafico_12(paqueteDatos126);

                // RENDERIZAR LOS VALORES
                $(".12_6_1").text(inversion_d_r);
                $(".12_6_2").text(ganancia_d_r);
                $(".12_6_3").text(rendimiento_d_r);

                // el angulo de la linea
                $(".linea4").css("transform", `rotate(${angulo_d}deg)`);
            }

            //---------------------------------------------------------------
            var a_sup_1 = ganancia_c - ganancia_a;
            var a_sup_2 = ganancia_c - ganancia_b;
            var a_sup_3 = ganancia_d - ganancia_a;
            var a_sup_4 = ganancia_d - ganancia_b;

            var sup_1 = numero_punto_coma_query(a_sup_1.toFixed(0));
            var sup_2 = numero_punto_coma_query(a_sup_2.toFixed(0));
            var sup_3 = numero_punto_coma_query(a_sup_3.toFixed(0));
            var sup_4 = numero_punto_coma_query(a_sup_4.toFixed(0));

            // CONCLUSIÓN
            // utilizamos ".html" para que respete los elementos html que encierran
            $(".conclusion_inversion").html(`
                <h5>Conclusión:</h5>
                <p class="text-left">
                <b>SOLIDEXA</b> destaca como la opción de inversión más sólida entre las alternativas que se han propuesto.
                </p>
                <p class="text-left">
                <b>SOLIDEXA</b> supera con <b>${sup_1} ${simboloMoneda}</b> de ganancia a la opción Ahorro Bancario y cuenta con un rendimeinto del <b>${rendimiento_c_r} %</b> superior a la alternativa del inmueble tradicional.
                </p>
                <p class="text-left">
                <b>SOLIDEXA Apalancado</b> supera con <b>${sup_3} ${simboloMoneda}</b> de ganancia a la opción Ahorro Bancario y cuenta con un rendimiento del <b>${rendimiento_d_r} $us</b> superior a la alternativa del inmueble tradicional.
                </p>
                `);

            //---------------------------------------------------------------
        } else {
            // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-cal_inm_inversion"
            $(".ref-cal_inm_inversion").after(
                `<div class="alerta_i alert alert-success inversion_alerta mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <p class="text-left">Por favor ingresa datos realistas y que estén acordes con las recomendaciones especificadas.
                    </p>
                </div>`
            );
        }
    } else {
        // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton ".ref-cal_inm_inversion"
        $(".ref-cal_inm_inversion").after(
            `<div class="alert alert-danger inversion_alerta mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <p class="text-left">Llene todos los campos</p>
            </div>`
        );
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// botones radio de TIPO DE CALCULADORA en INMUEBLE FRACCIONADO

$("#calInmFrCopropietario").click(function (e) {
    // despintamos todos
    $(".boton-linea-secundario").removeClass("bg-unidad");

    $(this).addClass("bg-unidad");

    $("#c-calInmFrCopropietario").css("display", "block"); // mostrar
    $("#m-calInmFrCopropietario").css("display", "block"); // mostrar
    $("#c-calInmFrComparar").css("display", "none"); // ocultar
    $("#m-calInmFrComparar").css("display", "none"); // ocultar

});

$("#calInmFrComparar").click(function (e) {
    // despintamos todos
    $(".boton-linea-secundario").removeClass("bg-unidad");

    $(this).addClass("bg-unidad");

    $("#c-calInmFrComparar").css("display", "block"); // mostrar
    $("#m-calInmFrComparar").css("display", "block"); // mostrar
    $("#c-calInmFrCopropietario").css("display", "none"); // ocultar
    $("#m-calInmFrCopropietario").css("display", "none"); // ocultar

});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CALCULADORA INMUEBLE FRACCIONADO - COPROPIETARIO

$("#cal_inmFr_copropietario").click(function (e) {
    // codigo similar al de fracciones copropietario de terreno

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
    let meses_maximo = 8;
    let solidexa_inm_bsm2 = Number($(".solidexa_inm_bsm2").attr("data-solidexa_inm_bsm2"));
    let solidexa_inm_m2 = Number($(".solidexa_inm_m2").attr("data-solidexa_inm_m2"));

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

    if (valor_inversion > 0 && economia === true) {
        $(".contenedor_1").show(); // visualizamos
        $("#contenedor_1_g_1").empty();
        $("#contenedor_1_g_2").empty();
        $("#contenedor_1_g_3").empty();
        $("#contenedor_1_g_4").empty();
        $("#contenedor_1_g_5").empty();

        $("#contenedor_1_g_1").append(`<canvas id="grafico_21_1"></canvas>`);
        $("#contenedor_1_g_2").append(`<canvas id="grafico_21_2"></canvas>`);
        $("#contenedor_1_g_3").append(`<canvas id="grafico_x21_1"></canvas>`);
        $("#contenedor_1_g_4").append(`<canvas id="grafico_12_1"></canvas>`);
        $("#contenedor_1_g_5").append(`<canvas id="grafico_21_3"></canvas>`);

        // valor_inversion siempre estara en moneda BOLIVIANOS, es por ello que dependiendo la moneda con la que se deseen visualizar los resultados, es que se hara la debida converdion de valor_inversion a moneda deseada renonbradolo con la variable "inversion"
        if (tipoMoneda === "sus") {
            var cambio = tc_oficial;
            var inversion = Math.floor(valor_inversion * tc_oficial);
        } else {
            if (tipoMoneda === "bs") {
                var cambio = 1;
                var inversion = valor_inversion;
            }
        }

        //-------------------------------------------------------
        // PRONOSTICO DE PRECIOS POR M2 DEL INMUEBLE

        let paqueteDatos = {
            tipoMoneda, // sus o bs
            tc_oficial,
        };

        let resultadoPronostico = inmPronosticoPrecioM2(paqueteDatos);

        // "pronostico_pm2" ya se encuentra en la moneda correcta en el que se esta trabajando
        let pronostico_pm2 = resultadoPronostico.pronostico_pm2;
        let pronostico_periodo = resultadoPronostico.pronostico_periodo;

        //----------------------------------------
        // calculo de la PLUSALIA AL FINAL DE LOS meses_maximo

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

            // se procede a normalizar los valores pronosticados de precio de INMUEBLE por m2.
            // En los pronosticos normalizados el periodo actual debe dar un precio por m2 igual al precio promedio de los precios de los INMUEBLEs de la zona. Es por ello que se utiliza un factor de normalizacion "factor"
            let pronostico_pm2_ok = []; // pronosticos de precios por m2 NORMALIZADOS
            let factor = promedio_pm2 - auxPm2Actual;
            for (let j = 0; j < pronostico_pm2.length; j++) {
                pronostico_pm2_ok[j] = pronostico_pm2[j] + factor;
            }

            //-------------------
            // ahora se procede a extraer el valor normalizado futuro del precio por m2 del terreno

            // Obtener la fecha actual
            let fechaActualAux = new Date();

            // Sumar los meses
            fechaActualAux.setMonth(fechaActualAux.getMonth() + meses_maximo);

            // Obtener el año y el mes de la nueva fecha
            let nuevoAno = fechaActualAux.getFullYear();
            let nuevoMes = fechaActualAux.getMonth() + 1; // getMonth() devuelve un índice (0-11), así que sumamos 1

            if (nuevoMes <= 5) {
                var semestreNuevo = "I";
            } else {
                var semestreNuevo = "II";
            }

            // formato: "2019 - II"
            let periodoNuevo = nuevoAno + " - " + semestreNuevo;

            if (pronostico_pm2_ok.length > 0) {
                for (let i = 0; i < pronostico_periodo.length; i++) {
                    let elemento = pronostico_periodo[i];
                    if (elemento === periodoNuevo) {
                        // dado que pronostico_periodo y pronostico_pm2_ok son complementarios, bast con encontrar la posicion "i" del periodo nuevo en pronostico_periodo, para utilizar esta misma posicion "i" en pronostico_pm2_ok y asi extraer de este array el valor del precio por m2 del inmueble en ese periodo futuro
                        solidexa_pm2_futuro = pronostico_pm2_ok[i];
                        break; // para salir del bucle for
                    }
                }
            }
        }

        //-------------------

        // Ganancia plusvalia en valor por m2
        let solidexa_pm2 = solidexa_inm_bsm2 * (1 / cambio);
        let plus_solidexa_pm2 = solidexa_pm2_futuro - solidexa_pm2; // precio por m2

        // Ganancia plusvalia en valor monetario
        let plusvalia_inm = solidexa_inm_m2 * plus_solidexa_pm2;

        // participacion del usuario en funcion al numero de fracciones de terreno que desea adquirir
        let participacion = Number($("#participacion").val()) / 100; // en decimales

        // ganancia por plusvalia del usuario en funcion a su nivel de participacion
        // floor redondea al inmediato entero inferior y devuelve tipo numerico
        let plusvaliaUsuario = Math.floor(plusvalia_inm * participacion);
        let plusvaliaUsuarioRender = numero_punto_coma_query(plusvaliaUsuario);

        // grafica barras apiladas
        // Ganancia plusvalía

        let paqueteDatos_a = {
            canvasId: "grafico_12_1",
            etiquetas: ["SOLIDEXA"],
            datasets_1: {
                label: "Inversión",
                data: [inversion],
            },
            datasets_2: {
                label: "Ganancia plusvalía",
                data: [plusvaliaUsuario],
            },
        };

        grafico_12(paqueteDatos_a);

        // RENDERIZAR LOS VALORES
        $(".12_1_1").text(plusvaliaUsuarioRender);

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

        //-------------------------------------------------------
        // BENEFICIO --- Compra M2

        var pm2_solidexa = solidexa_inm_bsm2 * (1 / cambio);
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

        //-------------------------------------------------------
    } else {
        $(".ref-cal_inmFr_copropietario").after(
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
// Calculadora INMUEBLE FRACCIONADO COMPARACION

$("#cal_inmFr_comparacion").click(function (e) {
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

    let precio_inm_otro = Number($("#precio_inm_otro").val());
    let superficie_inm_otro = Number($("#superficie_inm_otro").val());

    if (precio_inm_otro > 0 && superficie_inm_otro > 0 && comision === true) {
        //---------------------------

        if (tipoMoneda === "sus") {
            var cambio = tc_oficial; // ej: 7
        } else {
            if (tipoMoneda === "bs") {
                var cambio = 1;
            }
        }
        //----------------------------------------

        let tradicional_pm2 = precio_inm_otro / superficie_inm_otro;

        let solidexa_inm_bsm2 = Number($(".solidexa_inm_bsm2").attr("data-solidexa_inm_bsm2"));
        let solidexa_pm2 = solidexa_inm_bsm2 * (1 / cambio);

        if (tradicional_pm2 >= solidexa_pm2) {
            let paqueteDatos = {
                tipoMoneda, // sus o bs
                tc_oficial,
            };

            let resultadoPronostico = inmPronosticoPrecioM2(paqueteDatos);

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
            $("#i_tradicional_precio_m2").text(i_tradicional_precio_m2);

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
            // calculo de la PLUSVALIA ACTUAL PRESENTE

            let promedio_bsm2 = Number($(".promedio_bsm2").attr("data-promedio_bsm2"));
            let promedio_pm2 = promedio_bsm2 * (1 / cambio);

            let plus_solidexa_pm2 = promedio_pm2 - solidexa_pm2; // precio por m2
            let plus_tradicional_pm2 = promedio_pm2 - tradicional_pm2; // precio por m2

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

            //----------------------------------------
            // calculo de comsion desperdiciada (si la casilla fue seleccionada)

            if (comisionSeleccionada) {
                $(".contenedor_3").show(); // visualizamos
                $("#contenedor_3_g_1").empty(); // eliminamos el hijo que tiene
                $("#contenedor_3_g_1").append(`<canvas id="grafico_12_2"></canvas>`); // creamos un nuevo hijo

                var num_comision = Number((precio_inm_otro * (input_comision / 100)).toFixed(0));
                var rend_solidexa = plus_solidexa_pm2 / solidexa_pm2;
                var num_oportunidad = Number(
                    (precio_inm_otro * (input_comision / 100) * rend_solidexa).toFixed(0)
                );

                //----------------------------------------
                // para graficar barras
                // Datos para el gráfico de barras apiladas

                let paqueteDatos_c = {
                    canvasId: "grafico_12_2",
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

                $(".12_2_1").text(r_comision);
                $(".12_2_2").text(r_oportunidad);

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
            $(".ref-cal_inmFr_comparacion").after(
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
        $(".ref-cal_inmFr_comparacion").after(
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
