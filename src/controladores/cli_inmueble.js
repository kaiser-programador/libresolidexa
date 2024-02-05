// CONTROLADORES PARA EL INMUEBLE DESDE EL LADO DEL CLIENTE PUBLICO

const {
    indiceProyecto,
    indiceImagenesProyecto,
    indiceDocumentos,
    indiceInmueble,
    indiceInversiones,
    indiceTerreno,
    indiceEmpresa,
    indiceImagenesSistema,
} = require("../modelos/indicemodelo");

const {
    cabezeras_adm_cli,
    pie_pagina_cli,
    segundero_cajas,
    datos_pagos_propietario,
} = require("../ayudas/funcionesayuda_2");

const { proyecto_info_cd } = require("../ayudas/funcionesayuda_4");

const {
    numero_punto_coma,
    verificarTePyInm,
    funcion_sus_m2_historicos,
    tipo_cambio,
} = require("../ayudas/funcionesayuda_3");

const moment = require("moment");

const controladorCliInmueble = {};

/************************************************************************************ */
/************************************************************************************ */
// // PARA CALCULO DE TIEMPO EN QUE EL INM TRADICIONAL IGUALA LA PLUSVALIA DE SOLIDEXA
// RUTA   "post"   /inmueble/operacion/calculo_tiempo

controladorCliInmueble.calculoTiempo = async (req, res) => {
    try {
        console.log("el bodyyyyy");
        console.log(req.body);
        var codigo_inmueble = req.body.codigo_inmueble;
        var meta = Number(req.body.meta);
        var plus_promedio = Number(req.body.plus_promedio); // precio de venta actual al que el inmueble tradicional es vendido (es el promedio de los precios de venta tradicionales en la zona donde se encuentra el inm tradicional)

        console.log(codigo_inmueble);
        console.log(meta);
        console.log(plus_promedio);

        var year_espera = 5; // por defecto

        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                tipo_inmueble: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            var fecha_actual = new Date();
            // Extraemos el mes utilizando el método getMonth()
            var mes_actual = fecha_actual.getMonth(); // devolvera un valor numerico entre 0 a 11
            var year_actual = fecha_actual.getFullYear(); // devuelve en numerico el año actual

            if (mes_actual <= 5) {
                var semestre = "I";
            } else {
                var semestre = "II";
            }

            // formato: "2019 - II"
            var periodo = year_actual + " - " + semestre;

            var tipo_inmueble = registro_inmueble.tipo_inmueble; // departamento, oficina, comercial, casa
            console.log("tipo de inmueble: " + tipo_inmueble);
            let datos_auxiliares = {
                tipo_inmueble,
            };
            var array_hist_sus_m2 = funcion_sus_m2_historicos(datos_auxiliares);
            var array_sus_m2 = array_hist_sus_m2.array_sus_m2;
            var array_periodo = array_hist_sus_m2.array_periodo;

            console.log("array_sus_m2 " + array_sus_m2.length);
            console.log("array_sus_m2 " + array_periodo.length);

            if (array_sus_m2.length > 0 && array_periodo.length > 0) {
                for (let i = 0; i < array_periodo.length; i++) {
                    let elemento = array_periodo[i];
                    if (elemento == periodo) {
                        var aux_sus_m2 = array_sus_m2[i];
                        break; // para salir del bucle for
                    }
                }
                let factor = plus_promedio - aux_sus_m2;
                for (let j = 0; j < array_sus_m2.length; j++) {
                    if (array_sus_m2[j] + factor >= meta) {
                        let aux_periodo = array_periodo[j]; // formato: "2019 - II"
                        let aux_array = aux_periodo.split(" ");
                        let year_meta = Number(aux_array[0]);
                        // entonces calculamos el numero de años de espera
                        year_espera = year_meta - year_actual;
                        break; // para salir del bucle for
                    }
                }
            }
        }
        res.json({
            exito: year_espera,
        });
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// // PARA CALCULO DE TIEMPO EN QUE EL INM TRADICIONAL IGUALA LA PLUSVALIA DE SOLIDEXA
// RUTA   "post"   /inmueble/operacion/calculo_banco_p

controladorCliInmueble.calculo_banco_p = async (req, res) => {
    try {
        console.log(req.body.precio_solidexa);

        console.log("el bodyyyyy BANCO P");
        console.log(req.body);

        // aunque de jquery los numeros fueron enviados como valores numericos, aqui se reciben como string, asi que nuevamente deben ser convertidos a numericos
        var precio_solidexa = Number(req.body.precio_solidexa); // $us
        var precio_tradicional = Number(req.body.precio_tradicional); // $us
        var aporte = Number(req.body.aporte); // %
        var plazo = Number(req.body.plazo); // # años
        var interes = Number(req.body.interes); // % anual
        var moneda = req.body.moneda;

        console.log("el valor de precio solidexa: " + precio_solidexa);
        console.log(precio_solidexa);

        if (moneda == "bs") {
            var aux_tc = tipo_cambio();
            var tc = aux_tc.tipo_cambio;
        } else {
            var tc = 1;
        }

        var plazo_meses = plazo * 12;
        var prestamo_solidexa = precio_solidexa * tc * (1 - aporte / 100); // $us o Bs
        var prestamo_tradicional = precio_tradicional * tc * (1 - aporte / 100); // $us o Bs

        //----------------------------------------------------------
        // calculo de interes mensual

        var aux_i = interes / 100; // interes anual en decimal

        // conversion de interes anual a mensual
        //  ((1+intAnual)^(1/12))-1
        // Math.pow(base, exponente)
        var i_mensual = Math.pow(1 + aux_i, 1 / 12) - 1; // interes mensual en decimal

        //----------------------------------------------------------
        // calculo de cuota mensual

        var aux_numerador = i_mensual * Math.pow(1 + i_mensual, plazo_meses);
        var aux_denominador = Math.pow(1 + i_mensual, plazo_meses) - 1;

        // $us/mes o Bs/mes
        var mensualidad_solidexa = prestamo_solidexa * (aux_numerador / aux_denominador);
        var mensualidad_tradicional = prestamo_tradicional * (aux_numerador / aux_denominador);

        //----------------------------------------------------------
        // calculo de intereses acumulados

        let interesesTotales_s = 0;
        let saldoRestante_s = prestamo_solidexa;

        let interesesTotales_t = 0;
        let saldoRestante_t = prestamo_tradicional;

        for (let i = 0; i < plazo_meses; i++) {
            //--------------------------------------------------
            // Calcular los intereses para este período SOLIDEXA
            var interesesEsteMes_s = saldoRestante_s * i_mensual;

            // Actualizar el saldo restante
            saldoRestante_s = saldoRestante_s - (mensualidad_solidexa - interesesEsteMes_s);

            // total de intereses pagados hasta este periodo
            interesesTotales_s = interesesTotales_s + interesesEsteMes_s;

            //--------------------------------------------------
            // Calcular los intereses para este período TRADICIONAL
            var interesesEsteMes_t = saldoRestante_t * i_mensual;

            // Actualizar el saldo restante
            saldoRestante_t = saldoRestante_t - (mensualidad_tradicional - interesesEsteMes_t);

            // Sumar los intereses de este período al total
            interesesTotales_t = interesesTotales_t + interesesEsteMes_t;
            //----------------------------------------------------------
        }

        // devolvemos resultados redondeados a enteros sin decimales y en tipo numericos
        res.json({
            credito_solidexa: Number(prestamo_solidexa.toFixed(0)),
            credito_tradicional: Number(prestamo_tradicional.toFixed(0)),

            int_acu_solidexa: Number(interesesTotales_s.toFixed(0)),
            int_acu_tradicional: Number(interesesTotales_t.toFixed(0)),

            mensual_solidexa: Number(mensualidad_solidexa.toFixed(0)),
            mensual_tradicional: Number(mensualidad_tradicional.toFixed(0)),
        });
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// // PARA CALCULO DE RENDIMIENTOS DEL INVERSIONISTA
// RUTA   "post"   /inmueble/operacion/calculo_inversionista

controladorCliInmueble.calculo_inversionista = async (req, res) => {
    try {
        var solucionado = false; // por defecto

        console.log("el bodyyyyy INVERSIONISTA");
        console.log(req.body);

        // aunque de jquery los numeros fueron enviados como valores numericos, aqui se reciben como string, asi que nuevamente deben ser convertidos a numericos
        var inversion_emp = Number(req.body.inversion_emp); // $us
        var ganancia = Number(req.body.ganancia); // $us/Mes
        var reinversion = req.body.reinversion; // si o no
        var inversion_sol = Number(req.body.inversion_sol); // $us
        var i_financiamiento = Number(req.body.i_financiamiento); // % anual
        var plazo_financiamiento = Number(req.body.plazo_financiamiento);
        var codigo_inmueble = req.body.codigo_inmueble;

        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            var registro_terreno = await indiceTerreno.findOne(
                { codigo_terreno: registro_inmueble.codigo_terreno },
                {
                    fecha_inicio_reserva: 1,
                    fecha_fin_construccion: 1,
                    _id: 0,
                }
            );

            if (registro_terreno) {
                //----------------------------------------------------------
                // calculo del total plazo en meses DESDE INICIO CONVOCATORIA HASTA FIN CONTRUCCION

                var diferenciaEnMilisegundos =
                    registro_terreno.fecha_fin_construccion - registro_terreno.fecha_inicio_reserva;

                // Convertir la diferencia de milisegundos a días
                var diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

                // el número de meses, redondeado al entero inmediato inferior
                var plazo = Math.floor(diferenciaEnDias / 30); // meses

                //------------------------------------------------------------
                //------------------------------------------------------------
                // rendimiento de ahorro bancario

                var datos_segundero = {
                    codigo_objetivo: codigo_inmueble,
                    ci_propietario: "ninguno",
                    tipo_objetivo: "inmueble",
                };

                var aux_segundero_cajas = await segundero_cajas(datos_segundero);
                var solidexa_sus = aux_segundero_cajas.precio; // precio actual del inmueble con los descuentos por penalizaciones que pudierra llegar a tener actualmente

                //----------------------------------------------------------
                // calculo de interes mensual

                // ACTUALIZAR ACORDE AL MERCADO
                var i_banco = 6.8; // % ANUAL. corresponde a la mejor tasa de interes por tus ahorros que ofrece un banco

                var aux_i = i_banco / 100; // interes anual en decimal

                // conversion de interes anual a mensual
                //  ((1+intAnual)^(1/12))-1
                // Math.pow(base, exponente)
                var i_banco_mes = Math.pow(1 + aux_i, 1 / 12) - 1; // interes mensual en decimal
                //----------------------------------------------------------

                var val_futuro = solidexa_sus * Math.pow(1 + i_banco_mes, plazo);

                var ganancia_a = Number((val_futuro - solidexa_sus).toFixed(0));

                var rendimiento_a = Number(
                    (((val_futuro - solidexa_sus) / solidexa_sus) * 100).toFixed(2)
                );

                var inversion_a = solidexa_sus;

                // para pocicionamiento del angulo de la flecha
                var angulo_a = Number(((1.8*rendimiento_a)-180).toFixed(2));

                //------------------------------------------------------------
                //------------------------------------------------------------
                // rendimiento de emprendimiento

                var plazo_reinv = plazo;

                if (reinversion == "si") {
                    // ACTUALIZAR ACORDE AL MERCADO
                    var i_reinversion = 10; // 10% anual (puede ser la MEJOR tasa de interes que ofrece un banco)

                    //----------------------------------------------------------
                    // calculo de interes mensual

                    var aux_i_reinv = i_reinversion / 100; // interes anual en decimal

                    // conversion de interes anual a mensual
                    //  ((1+intAnual)^(1/12))-1
                    // Math.pow(base, exponente)
                    var i_reinv_mes = Math.pow(1 + aux_i_reinv, 1 / 12) - 1; // interes mensual en decimal

                    //------------------------------------------------------------

                    var sum_gan_reinv = 0; // sumatoria de las ganancias que se obtienen por reinvertir las ganancias mensuales

                    for (let i = 0; i < plazo_reinv - 1; i++) {
                        let plazo_reinv = plazo_reinv - 1; // ej/ si fueran 10 meses, la primera reinversion no permarecera 10 meses, sino que 9 (por eso se resta 1 mes) porque primero debe transcurrir 1 mes para que el inversionista obtenga su primera ganancia mensual, que es la que se reinvertira

                        let val_futuro_reinv = ganancia * Math.pow(1 + i_reinv_mes, plazo_reinv);

                        sum_gan_reinv = sum_gan_reinv + val_futuro_reinv;
                    }

                    var inversion_b = inversion_emp;
                    var ganancia_b = Number((sum_gan_reinv - inversion_emp).toFixed(0));
                    var rendimiento_b = Number(
                        (((sum_gan_reinv - inversion_emp) / inversion_emp) * 100).toFixed(2)
                    );

                    // para pocicionamiento del angulo de la flecha
                    var angulo_b = Number(((1.8*rendimiento_b)-180).toFixed(2));
                }

                if (reinversion == "no") {
                    var inversion_b = inversion_emp;
                    var ganancia_b = Number((ganancia * plazo).toFixed(0));
                    var rendimiento_b = Number(
                        (((ganancia * plazo) / inversion_emp) * 100).toFixed(2)
                    );

                    // para pocicionamiento del angulo de la flecha
                    var angulo_b = Number(((1.8*rendimiento_b)-180).toFixed(2));
                }

                //------------------------------------------------------------
                //------------------------------------------------------------
                // rendimiento de SOLIDEXA

                var inversion_c = solidexa_sus;
                var ganancia_c = Number(aux_segundero_cajas.ahorro.toFixed(0));
                var rendimiento_c = Number(
                    ((aux_segundero_cajas.ahorro / solidexa_sus) * 100).toFixed(2)
                );

                // para pocicionamiento del angulo de la flecha
                var angulo_c = Number(((1.8*rendimiento_c)-180).toFixed(2));

                //------------------------------------------------------------
                //------------------------------------------------------------
                // rendimiento de SOLIDEXA PLUS

                // dinero que el inversionista pone de su propio bolsillo
                var inversion_d = Number((solidexa_sus * (inversion_sol / 100)).toFixed(0)); // $us
                // dinero que el inversionista pide prestado a un financiador externo
                var val_financiamiento = solidexa_sus - inversion_d; // $us

                var plazo_finan = plazo_financiamiento * 12; // meses
                //----------------------------------------------------------
                // calculo de interes mensual

                var aux_i_finan = i_financiamiento / 100; // interes anual en decimal

                // conversion de interes anual a mensual
                //  ((1+intAnual)^(1/12))-1
                // Math.pow(base, exponente)
                var i_finan_mes = Math.pow(1 + aux_i_finan, 1 / 12) - 1; // interes mensual en decimal

                //------------------------------------------------------------
                // calculo del pago mensual por el financiamiento

                var aux_numerador = i_finan_mes * Math.pow(1 + i_finan_mes, plazo_finan);
                var aux_denominador = Math.pow(1 + i_finan_mes, plazo_finan) - 1;

                // $us/mes
                var mensualidad_finan = val_financiamiento * (aux_numerador / aux_denominador);

                //------------------------------------------------------------

                let interesesTotales = 0;
                let saldoRestante = val_financiamiento;
                let periodo = 0;

                for (let i = 0; i < plazo_finan; i++) {
                    periodo = periodo + 1;
                    //--------------------------------------------------
                    // Calcular los intereses para este período
                    var interesesEsteMes = saldoRestante * i_finan_mes;

                    // Actualizar el saldo restante
                    saldoRestante = saldoRestante - (mensualidad_finan - interesesEsteMes);

                    // total de intereses pagados hasta este periodo
                    interesesTotales = interesesTotales + interesesEsteMes;
                    //--------------------------------------------------

                    // plazo: es el numero de meses desde inicio convocatoria hasta fin contruccion
                    if (periodo == plazo) {
                        // recuerda que se lo vende al precio del mercado tradicional
                        var venta_inm = solidexa_sus + aux_segundero_cajas.ahorro; // $us

                        var aux_ganancia = venta_inm - saldoRestante - interesesTotales;

                        var inversion_d = Number((inversion_d + interesesTotales).toFixed(0));

                        var ganancia_d = Number(aux_ganancia.toFixed(0));

                        var rendimiento_d = Number(
                            ((aux_ganancia / (inversion_d + interesesTotales)) * 100).toFixed(2)
                        );

                        // para pocicionamiento del angulo de la flecha
                        var angulo_d = Number(((1.8*rendimiento_d)-180).toFixed(2));

                        break; // para salir del bucle for
                    }
                }

                //------------------------------------------------------------
                //------------------------------------------------------------

                var solucionado = true;
            }
        }

        if (solucionado) {
            res.json({
                exito: "si",
                inversion_a,
                ganancia_a,
                rendimiento_a,
                inversion_b,
                ganancia_b,
                rendimiento_b,
                inversion_c,
                ganancia_c,
                rendimiento_c,
                inversion_d,
                ganancia_d,
                rendimiento_d,
                angulo_a,
                angulo_b,
                angulo_c,
                angulo_d,
            });
        } else {
            res.json({
                exito: "no",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA RENDERIZAR LA VENTANA DEL INMUEBLE DESDE EL LADO PUBLICO DEL CLIENTE
// RUTA   "get"   /inmueble/:codigo_inmueble/:vista_inm

controladorCliInmueble.renderVentanaInmueble = async (req, res) => {
    try {
        // ------------------------------------------------------

        var codigo_inmueble = req.params.codigo_inmueble;
        var tipo_vista_inmueble = req.params.vista_inm;

        //IMPORTANTE: PARA NO PERMITIR EL ACCESO A PROYECTOS INEXISTENTES O QUE NO ESTAN DISPONIBLES PARA SER VISIBLES POR EL USUARIO, ES QUE 1º EL PROYECTO SERA BUSCADO EN LA BASE DE DATOS

        var paqueteria_datos = {
            codigo_objetivo: codigo_inmueble,
            tipo: "inmueble",
        };
        var verificacion = await verificarTePyInm(paqueteria_datos);

        if (verificacion == true) {
            // ------- Para verificación -------
            //console.log("el codigo del inmueble es:");
            //console.log(codigo_inmueble);
            // ------- Para verificación -------
            //console.log("tipo de vista del inmueble es:");
            //console.log(tipo_vista_inmueble);

            var info_inmueble_cli = {};
            info_inmueble_cli.cab_inm_cli = true;
            //info_inmueble_cli.estilo_cabezera = "cabezera_estilo_inmueble";
            info_inmueble_cli.navegador_cliente = true;
            info_inmueble_cli.codigo_inmueble = codigo_inmueble;

            //----------------------------------------------------
            // para la url de la cabezera
            var url_cabezera = ""; // vacio por defecto
            const registro_cabezera = await indiceImagenesSistema.findOne(
                { tipo_imagen: "cabecera_inmueble" },
                {
                    url: 1,
                    _id: 0,
                }
            );

            if (registro_cabezera) {
                url_cabezera = registro_cabezera.url;
            }

            info_inmueble_cli.url_cabezera = url_cabezera;

            //----------------------------------------------------

            // ------- Para verificación -------
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO");
            //console.log(req.inversor_autenticado);
            //console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");

            info_inmueble_cli.inversor_autenticado = req.inversor_autenticado;
            // si es TRUE y solo si es true, entonces se mostrara su ci
            if (req.inversor_autenticado) {
                info_inmueble_cli.ci_propietario = req.user.ci_propietario;
            }

            var aux_cabezera = {
                codigo_objetivo: codigo_inmueble,
                tipo: "inmueble",
                lado: "cliente",
            };

            var cabezera_cli = await cabezeras_adm_cli(aux_cabezera);
            info_inmueble_cli.cabezera_cli = cabezera_cli;

            var pie_pagina = await pie_pagina_cli();
            info_inmueble_cli.pie_pagina_cli = pie_pagina;

            //-------------------------------------------------------------------------------
            // si el cliente esta navegado con su cuenta
            if (req.inversor_autenticado) {
                var ci_inversionista = req.user.ci_propietario;

                // ------- Para verificación -------
                //console.log("el codigo del propietario registrado con su cuenta es");
                //console.log(ci_inversionista);
            } else {
                // en caso de que este navegando sin haber accedido a su cuenta personal

                var ci_inversionista = "ninguno";
            }

            var paquete_datos = {
                codigo_inmueble,
                //codigo_proyecto,
                //tipo_inmueble: registro_inmueble.tipo_inmueble,
                ci_inversionista,
            };
            info_inmueble_cli.global_inm = await complementos_globales_inm(paquete_datos);
            //-------------------------------------------------------------------------------

            info_inmueble_cli.es_inmueble = true; // para menu navegacion comprimido

            //----------------------------------------------------
            // paquete para actualizar el numero de vistas segun el tipo de la ventana
            var paquete_vista = {
                codigo_inmueble,
                ventana: tipo_vista_inmueble,
            };
            info_inmueble_cli.nv_ventana = await n_vista_ventana(paquete_vista);
            //----------------------------------------------------

            if (tipo_vista_inmueble == "descripcion") {
                // para mostrar seleccinada la pestaña de donde no encontramos
                info_inmueble_cli.descripcion_inm = true;

                info_inmueble_cli.info_segundero = true;

                // para mostrar circulos estados y caracteristicas del proyecto
                info_inmueble_cli.estado_caracteristicas = true;

                info_inmueble_cli.caracteristicas_inmueble = true;

                var paquete_datos = {
                    codigo_inmueble,
                    ci_propietario: ci_inversionista,
                };

                var info_inmueble = await inmueble_descripcion(paquete_datos);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de descripcion del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "garantias") {
                // para mostrar seleccinada la pestaña de donde no encontramos
                info_inmueble_cli.garantias_inm = true;

                var info_inmueble = await inmueble_garantias(codigo_inmueble);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de garantias del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "beneficios") {
                // para mostrar seleccinada la pestaña de donde no encontramos
                info_inmueble_cli.beneficios_inm = true;

                var paquete_datos = {
                    codigo_inmueble,
                    ci_propietario: ci_inversionista,
                };

                var info_inmueble = await inmueble_beneficios(paquete_datos);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de beneficios del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "info_economico") {
                // para mostrar seleccinada la pestaña de donde no encontramos
                info_inmueble_cli.informe_economico = true;

                var info_inmueble = await inmueble_info_economico(codigo_inmueble);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de info_economico del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "empleos") {
                // para pestaña y ventana apropiada para proyecto
                info_inmueble_cli.empleos_inm = true;

                var info_inmueble = await inmueble_empleos(codigo_inmueble);

                info_inmueble_cli.informacion = info_inmueble;

                // agregamos info complementaria
                //info_inmueble_cli.codigo_proyecto = codigo_proyecto;

                // ------- Para verificación -------
                //console.log("LOS DATOS A RENDERIZAR DE EMPLEOS DEL INMUEBLE");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (tipo_vista_inmueble == "calculadora") {
                // para mostrar seleccinada la pestaña de donde no encontramos
                info_inmueble_cli.calculadora_inm = true;

                var info_inmueble = await inmueble_calculadora(codigo_inmueble);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de info_economico del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }

            if (ci_inversionista != "ninguno" && tipo_vista_inmueble == "inversor") {
                // para mostrar seleccinada la pestaña de donde no encontramos
                info_inmueble_cli.inversor_inmueble = true;

                let paquete_datos = {
                    ci_inversionista,
                    codigo_inmueble,
                };

                var info_inmueble = await inmueble_inversor(paquete_datos);
                info_inmueble_cli.informacion = info_inmueble;

                // ------- Para verificación -------
                //console.log("los datos de PROPIETARIO del inmueble");
                //console.log(info_inmueble_cli);

                res.render("cli_inmueble", info_inmueble_cli);
            }
        } else {
            // EN CASO DE QUE SE TRATA DE UN INMUEBLE INEXISTENTE O QUE NO ESTA AUN DISPONIBLE PARA SER VISUALIZADO POR EL CLIENTE.
            res.redirect("/"); // rediccionara a la pagina DE INICIO DEL CLIENTE
        }
    } catch (error) {
        console.log(error);
    }
};

//------------------------------------------------------------------

async function inmueble_descripcion(paquete_datos) {
    try {
        var codigo_inmueble = paquete_datos.codigo_inmueble;
        var ci_propietario = paquete_datos.ci_propietario;

        moment.locale("es");

        const registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                codigo_proyecto: 1,
                tipo_inmueble: 1,
                estado_inmueble: 1,
                valor_reserva: 1,
                superficie_inmueble_m2: 1,
                inmueble_descripcion: 1,
                titulo_descripcion_1: 1,
                varios_descripcion_1: 1,
                titulo_descripcion_2: 1,
                varios_descripcion_2: 1,
                titulo_descripcion_3: 1,
                varios_descripcion_3: 1,
                titulo_descripcion_4: 1,
                varios_descripcion_4: 1,
                titulo_descripcion_5: 1,
                varios_descripcion_5: 1,
                link_youtube_inmueble: 1,
                titulo_garantia_1: 1,
                garantia_1: 1,
                titulo_garantia_2: 1,
                garantia_2: 1,
                titulo_garantia_3: 1,
                garantia_3: 1,
                dormitorios_inmueble: 1,
                banos_inmueble: 1,
                garaje_inmueble: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            let codigo_terreno = registro_inmueble.codigo_terreno;

            const registro_terreno = await indiceTerreno.findOne(
                { codigo_terreno: codigo_terreno },
                {
                    ciudad: 1,
                    provincia: 1,
                    direccion: 1,
                    estado_terreno: 1,
                    titulo_ubi_otros_1: 1,
                    ubi_otros_1: 1,
                    titulo_ubi_otros_2: 1,
                    ubi_otros_2: 1,
                    titulo_ubi_otros_3: 1,
                    ubi_otros_3: 1,
                    link_googlemap: 1,
                    _id: 0,
                }
            );

            let codigo_proyecto = registro_inmueble.codigo_proyecto;
            const registro_proyecto = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_proyecto },
                {
                    meses_construccion: 1,
                    mensaje_segundero_py_inm_a: 1,
                    mensaje_segundero_py_inm_b: 1,
                    mensaje_segundero_py_inm_c: 1, // para RECOMPENSA
                    mensaje_segundero_py_inm_d: 1, // para RECOMPENSA
                    nota_precio_justo: 1,
                    _id: 0,
                }
            );

            if (registro_terreno && registro_proyecto) {
                // conversion del documento MONGO ({OBJETO}) a "string"
                var aux_string = JSON.stringify(registro_inmueble);

                // reconversion del "string" a "objeto"
                var inm_descripcion = JSON.parse(aux_string);

                // conversion de superficie inmueble a punto mil
                inm_descripcion.superficie_inmueble_m2 = numero_punto_coma(
                    registro_inmueble.superficie_inmueble_m2
                );

                // conversion de valor reserva inmueble a punto mil
                inm_descripcion.valor_reserva = numero_punto_coma(registro_inmueble.valor_reserva);

                // por defecto ponemos a todos en "false"
                inm_descripcion.resplandor_1 = false;
                inm_descripcion.resplandor_2 = false;
                inm_descripcion.resplandor_3 = false;
                inm_descripcion.resplandor_4 = false;

                inm_descripcion.plazo = registro_proyecto.meses_construccion;
                inm_descripcion.nota_precio_justo = registro_proyecto.nota_precio_justo;

                // corregimos que estado estara como "true"
                if (registro_terreno.estado_terreno == "reserva") {
                    inm_descripcion.resplandor_1 = true;
                }
                if (registro_terreno.estado_terreno == "pago") {
                    inm_descripcion.resplandor_2 = true;
                }
                if (registro_terreno.estado_terreno == "aprobacion") {
                    inm_descripcion.resplandor_3 = true;
                }
                if (registro_terreno.estado_terreno == "construccion") {
                    inm_descripcion.resplandor_4 = true;
                }
                if (registro_terreno.estado_terreno == "construido") {
                    inm_descripcion.resplandor_5 = true;
                }

                if (registro_terreno.estado_terreno == "construido") {
                    var mensaje_segundero = registro_proyecto.mensaje_segundero_py_inm_b;
                } else {
                    var mensaje_segundero = registro_proyecto.mensaje_segundero_py_inm_a;
                }

                // Reserva, Pago y Aprobación
                if (
                    registro_terreno.estado_terreno == "reserva" ||
                    registro_terreno.estado_terreno == "pago" ||
                    registro_terreno.estado_terreno == "aprobacion"
                ) {
                    var texto_segundero_recom_iz = registro_proyecto.mensaje_segundero_py_inm_c;
                }

                // Construcción Y Construido
                if (
                    registro_terreno.estado_terreno == "construccion" ||
                    registro_terreno.estado_terreno == "construido"
                ) {
                    var texto_segundero_recom_iz = registro_proyecto.mensaje_segundero_py_inm_d;
                }

                inm_descripcion.texto_segundero_recom_iz = texto_segundero_recom_iz;

                //----------------------------------------------------------------
                // para estado y color del inmueble

                if (inm_descripcion.estado_inmueble == "guardado") {
                    inm_descripcion.leyenda_precio_inm = "Guardado";
                    inm_descripcion.color_precio_inm = "en_gris";
                }
                if (inm_descripcion.estado_inmueble == "disponible") {
                    inm_descripcion.leyenda_precio_inm = "Disponible";
                    inm_descripcion.color_precio_inm = "en_verde";
                }
                if (inm_descripcion.estado_inmueble == "reservado") {
                    inm_descripcion.leyenda_precio_inm = "Reservado";
                    inm_descripcion.color_precio_inm = "en_gris";
                }
                if (inm_descripcion.estado_inmueble == "pendiente_pago") {
                    inm_descripcion.leyenda_precio_inm = "Pendiente";
                    inm_descripcion.color_precio_inm = "en_amarillo";
                }
                if (inm_descripcion.estado_inmueble == "pagado_pago") {
                    inm_descripcion.leyenda_precio_inm = "Pagado";
                    inm_descripcion.color_precio_inm = "en_gris";
                }
                if (inm_descripcion.estado_inmueble == "pendiente_aprobacion") {
                    inm_descripcion.leyenda_precio_inm = "Aprobación";
                    inm_descripcion.color_precio_inm = "en_amarillo";
                }
                if (inm_descripcion.estado_inmueble == "pagos") {
                    inm_descripcion.leyenda_precio_inm = "Construcción";
                    inm_descripcion.color_precio_inm = "en_amarillo";
                }
                if (inm_descripcion.estado_inmueble == "remate") {
                    inm_descripcion.leyenda_precio_inm = "Remate";
                    inm_descripcion.color_precio_inm = "en_azul";
                }
                if (inm_descripcion.estado_inmueble == "completado") {
                    inm_descripcion.leyenda_precio_inm = "Construido";
                    inm_descripcion.color_precio_inm = "en_gris";
                }

                //----------------------------------------------------------------
                // para las viñetas
                var titulo_descrip_1 = registro_inmueble.titulo_descripcion_1;
                var array = registro_inmueble.varios_descripcion_1.split("*");
                var puntos_descrip_1 = [];
                if (titulo_descrip_1 != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_descrip_1[i - 1] = { punto: array[i] };
                    }
                }
                inm_descripcion.titulo_descrip_1 = titulo_descrip_1;
                inm_descripcion.puntos_descrip_1 = puntos_descrip_1;

                var titulo_descrip_2 = registro_inmueble.titulo_descripcion_2;
                var array = registro_inmueble.varios_descripcion_2.split("*");
                var puntos_descrip_2 = [];
                if (titulo_descrip_2 != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_descrip_2[i - 1] = { punto: array[i] };
                    }
                }
                inm_descripcion.titulo_descrip_2 = titulo_descrip_2;
                inm_descripcion.puntos_descrip_2 = puntos_descrip_2;

                var titulo_descrip_3 = registro_inmueble.titulo_descripcion_3;
                var array = registro_inmueble.varios_descripcion_3.split("*");
                var puntos_descrip_3 = [];
                if (titulo_descrip_3 != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_descrip_3[i - 1] = { punto: array[i] };
                    }
                }
                inm_descripcion.titulo_descrip_3 = titulo_descrip_3;
                inm_descripcion.puntos_descrip_3 = puntos_descrip_3;

                var titulo_descrip_4 = registro_inmueble.titulo_descripcion_4;
                var array = registro_inmueble.varios_descripcion_4.split("*");
                var puntos_descrip_4 = [];
                if (titulo_descrip_4 != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_descrip_4[i - 1] = { punto: array[i] };
                    }
                }
                inm_descripcion.titulo_descrip_4 = titulo_descrip_4;
                inm_descripcion.puntos_descrip_4 = puntos_descrip_4;

                // NO TIENE ****, Y ES CORRESPONDIENTE A POSIBLEMENTE "ACABADOS DE CALIDAD"
                inm_descripcion.titulo_descrip_5 = registro_inmueble.titulo_descripcion_5;
                inm_descripcion.descripcion_5 = registro_inmueble.varios_descripcion_5;

                //-------------------------------------------------------------------
                // UBICACION DEL INMUEBLE

                inm_descripcion.ciudad = registro_terreno.ciudad;
                inm_descripcion.direccion = registro_terreno.direccion;
                inm_descripcion.provincia = registro_terreno.provincia;
                inm_descripcion.link_googlemap = registro_terreno.link_googlemap;

                var titulo_up_a = registro_terreno.titulo_ubi_otros_1;
                var array = registro_terreno.ubi_otros_1.split("*");
                var puntos_up_a = [];
                if (titulo_up_a != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_up_a[i - 1] = { punto: array[i] };
                    }
                }

                var titulo_up_b = registro_terreno.titulo_ubi_otros_2;
                var array = registro_terreno.ubi_otros_2.split("*");
                var puntos_up_b = [];
                if (titulo_up_b != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_up_b[i - 1] = { punto: array[i] };
                    }
                }

                var titulo_up_c = registro_terreno.titulo_ubi_otros_3;
                var array = registro_terreno.ubi_otros_3.split("*");
                var puntos_up_c = [];
                if (titulo_up_c != "") {
                    for (let i = 1; i < array.length; i++) {
                        // desde i = 1 ok
                        puntos_up_c[i - 1] = { punto: array[i] };
                    }
                }
                //-------------------------------------------------------------------
                var datos_segundero = {
                    codigo_objetivo: codigo_inmueble,
                    ci_propietario,
                    tipo_objetivo: "inmueble",
                };

                // OJO*** PORQUE "segundero_cajas" tambien utiliza "inmueble_card_adm_cli" y estan ambas en esta misma funcion
                var aux_segundero_cajas = await segundero_cajas(datos_segundero);

                // ------- Para verificación -------
                //console.log("SON LOS VALORES DE SEGUNDERO CAJAS");
                //console.log(aux_segundero_cajas);

                var aux_cajas = {
                    // despues de sumar todos valores de plusvalia, contruccion y valor total
                    // convertimos a numeros con separadores de punto, coma
                    valor_total: numero_punto_coma(aux_segundero_cajas.total),
                    precio: numero_punto_coma(aux_segundero_cajas.precio),
                    plusvalia: numero_punto_coma(aux_segundero_cajas.ahorro),
                    //plusvalia_construida: aux_segundero_cajas.ahorro, // util solo para propietario, aqui ya viene con su valor por defecto con CERO
                    //-------------------------------------------------
                    // para RECOMPENSA
                    recompensa: numero_punto_coma(aux_segundero_cajas.recompensa),
                    meses: numero_punto_coma(aux_segundero_cajas.meses),
                    //-------------------------------------------------
                };

                inm_descripcion.val_segundero_cajas = aux_segundero_cajas;
                inm_descripcion.val_cajas = aux_cajas;
                inm_descripcion.construccion = numero_punto_coma(
                    aux_segundero_cajas.construccion.toFixed(0)
                );

                //-------------------------------------------------------------------------------
                // PARA LA SIGNIFICADO DE SEGUNDERO

                var registro_empresa = await indiceEmpresa.findOne(
                    {},
                    {
                        texto_segundero_inm: 1,
                        texto_segundero_recom_inm_py: 1,
                        _id: 0,
                    }
                );

                if (registro_empresa.texto_segundero_inm != undefined) {
                    if (
                        registro_empresa.texto_segundero_inm.indexOf("/sus_precio/") != -1 &&
                        registro_empresa.texto_segundero_inm.indexOf("/sus_total/") != -1 &&
                        registro_empresa.texto_segundero_inm.indexOf("/sus_plusvalia/") != -1
                    ) {
                        var significado_aux_0 = registro_empresa.texto_segundero_inm;
                        var significado_aux_1 = significado_aux_0.replace(
                            "/sus_precio/",
                            aux_cajas.precio
                        );
                        var significado_aux_2 = significado_aux_1.replace(
                            "/sus_total/",
                            aux_cajas.valor_total
                        );
                        var significado_aux = significado_aux_2.replace(
                            "/sus_plusvalia/",
                            aux_cajas.plusvalia
                        );
                    } else {
                        var significado_aux = "Significado";
                    }
                } else {
                    var significado_aux = "Significado";
                }

                inm_descripcion.significado_segundero = significado_aux;
                inm_descripcion.mensaje_segundero = mensaje_segundero;
                //-------------------------------------------------------------------------------
                //---------------------------------------------------------------
                // para mensaje debajo de segundero RECOMPENSA lado DERECHO

                if (registro_empresa.texto_segundero_recom_inm_py != undefined) {
                    if (
                        registro_empresa.texto_segundero_recom_inm_py.indexOf("/n_meses/") != -1 &&
                        registro_empresa.texto_segundero_recom_inm_py.indexOf("/bs_espera/") != -1
                    ) {
                        var significado_re_aux_0 = registro_empresa.texto_segundero_recom_inm_py;
                        var significado_re_aux_1 = significado_re_aux_0.replace(
                            "/n_meses/",
                            aux_cajas.meses
                        );
                        var significado_re_de_aux = significado_re_aux_1.replace(
                            "/bs_espera/",
                            aux_cajas.recompensa
                        );
                    } else {
                        var significado_re_de_aux = "Significado";
                    }
                } else {
                    var significado_re_de_aux = "Significado";
                }

                inm_descripcion.texto_segundero_recom_de = significado_re_de_aux;

                //---------------------------------------------------------------
                inm_descripcion.titulo_up_a = titulo_up_a;
                inm_descripcion.puntos_up_a = puntos_up_a;
                inm_descripcion.titulo_up_b = titulo_up_b;
                inm_descripcion.puntos_up_b = puntos_up_b;
                inm_descripcion.titulo_up_c = titulo_up_c;
                inm_descripcion.puntos_up_c = puntos_up_c;

                //-------------------------------------------------------------------
                var registro_documentos = await indiceDocumentos.find({
                    codigo_inmueble: codigo_inmueble,
                    clase_documento: "General",
                });

                // por defecto con respectos a los documentos del inmueble
                var documentos_descripcion = [];

                if (registro_documentos.length > 0) {
                    for (let d = 0; d < registro_documentos.length; d++) {
                        documentos_descripcion[d] = {
                            titulo_documento: registro_documentos[d].nombre_documento,
                            codigo_documento: registro_documentos[d].codigo_documento,
                            url: registro_documentos[d].url,
                        };
                    }
                }
                inm_descripcion.documentos_descripcion = documentos_descripcion;
                //-------------------------------------------------------------------

                return inm_descripcion;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function inmueble_garantias(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_proyecto: 1,
                tipo_inmueble: 1,
                titulo_garantia_1: 1,
                garantia_1: 1,
                titulo_garantia_2: 1,
                garantia_2: 1,
                titulo_garantia_3: 1,
                garantia_3: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            var registro_documentos = await indiceDocumentos.find({
                codigo_inmueble: codigo_inmueble,
                clase_documento: "Garantía",
            });

            // por defecto con respectos a los documentos  de garantia del proyecto
            var documentacion = [];

            if (registro_documentos.length > 0) {
                for (let d = 0; d < registro_documentos.length; d++) {
                    documentacion[d] = {
                        titulo_documento: registro_documentos[d].nombre_documento,
                        codigo_documento: registro_documentos[d].codigo_documento,
                        url: registro_documentos[d].url,
                    };
                }
            }

            var info_inmueble_garantias = {
                titulo_garantia_1: registro_inmueble.titulo_garantia_1,
                garantia_1: registro_inmueble.garantia_1,
                titulo_garantia_2: registro_inmueble.titulo_garantia_2,
                garantia_2: registro_inmueble.garantia_2,
                titulo_garantia_3: registro_inmueble.titulo_garantia_3,
                garantia_3: registro_inmueble.garantia_3,

                documentacion,
            };

            return info_inmueble_garantias;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_beneficios(paquete_datos) {
    try {
        var codigo_inmueble = paquete_datos.codigo_inmueble;
        var ci_propietario = paquete_datos.ci_propietario;

        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_proyecto: 1,
                superficie_inmueble_m2: 1,
                direccion_comparativa: 1,
                m2_comparativa: 1,
                precio_comparativa: 1,
                _id: 0,
            }
        );

        if (registro_inmueble) {
            var codigo_proyecto = registro_inmueble.codigo_proyecto;
            var registro_proyecto = await indiceProyecto.findOne(
                {
                    codigo_proyecto: codigo_proyecto,
                },
                {
                    contructora_dolar_m2_1: 1,
                    contructora_dolar_m2_2: 1,
                    contructora_dolar_m2_3: 1,
                    volterra_dolar_m2: 1,
                    titulo_construccion_inm: 1,
                    texto_construccion_inm: 1,
                    nota_construccion_inm: 1,
                    titulo_precio_inm: 1,
                    texto_precio_inm: 1,
                    titulo_plusvalia_inm: 1,
                    texto_plusvalia_inm: 1,
                    _id: 0,
                }
            );
            if (registro_proyecto) {
                //------------------------------------------------------------------------------
                // PLUSVALIA Y CONSTRUCCION den inmueble
                var caja_datos = {
                    codigo_objetivo: codigo_inmueble,
                    ci_propietario,
                    tipo_objetivo: "inmueble",
                };
                // NOTE QUE USAMOS ESTA FUNCION Y NO LOS DATOS DE COSTRUCCION Y PLUSVALIA DEL INM, PORQUE TRABAJAMOS CON LOS DATOS ACTUALIZADOS DE PRECIO Y PLUSVALIA DEL INM
                var resultado = await segundero_cajas(caja_datos);
                var construccion_inm = resultado.construccion; // ES EL PRECIO ACTUAL DEL INMUEBLE CONSIDERANDO LOS DESCUENTOS POR REMATES SI ES QUE LOS TUVIESE
                var plusvalia_inm = resultado.ahorro; // LA PLUSVALIA ACTUAL CONSIDERANDO LOS REMATES SI ES QUE TUVIESE

                //-------------------------------------------------------------------------------
                // COSTO CONTRUCCION (trabajamos con los valores referentes a la construccion y no con los precios de mercado)
                var contructora_dolar_m2_1 = Number(registro_proyecto.contructora_dolar_m2_1);
                var contructora_dolar_m2_2 = Number(registro_proyecto.contructora_dolar_m2_2);
                var contructora_dolar_m2_3 = Number(registro_proyecto.contructora_dolar_m2_3);
                var volterra_dolar_m2 = Number(registro_proyecto.volterra_dolar_m2);

                var area_construida = Number(registro_inmueble.superficie_inmueble_m2); // m2 del INMUEBLE

                var costo_constructora_1 = area_construida * contructora_dolar_m2_1;
                var costo_constructora_2 = area_construida * contructora_dolar_m2_2;
                var costo_constructora_3 = area_construida * contructora_dolar_m2_3;
                //var costo_volterra = area_construida * volterra_dolar_m2;
                var costo_volterra = construccion_inm;

                var sobreprecio_1 = costo_constructora_1 - costo_volterra;
                var sobreprecio_2 = costo_constructora_2 - costo_volterra;
                var sobreprecio_3 = costo_constructora_3 - costo_volterra;

                var constructoras = [
                    {
                        nombre: "SOLIDEXA",
                        contructora_dolar_m2: Number(volterra_dolar_m2.toFixed(2)),
                        costo_constructora: Number(costo_volterra.toFixed(0)),
                        sobreprecio: 0,
                    },
                    {
                        nombre: "Constructora A",
                        contructora_dolar_m2: Number(contructora_dolar_m2_1.toFixed(2)),
                        costo_constructora: Number(costo_constructora_1.toFixed(0)),
                        sobreprecio: Number(sobreprecio_1.toFixed(0)),
                    },
                    {
                        nombre: "Constructora B",
                        contructora_dolar_m2: Number(contructora_dolar_m2_2.toFixed(2)),
                        costo_constructora: Number(costo_constructora_2.toFixed(0)),
                        sobreprecio: Number(sobreprecio_2.toFixed(0)),
                    },
                    {
                        nombre: "Constructora C",
                        contructora_dolar_m2: Number(contructora_dolar_m2_3.toFixed(2)),
                        costo_constructora: Number(costo_constructora_3.toFixed(0)),
                        sobreprecio: Number(sobreprecio_3.toFixed(0)),
                    },
                ];

                var constructoras_render = [
                    {
                        nombre: "SOLIDEXA",
                        contructora_dolar_m2: numero_punto_coma(volterra_dolar_m2.toFixed(2)),
                        costo_constructora: numero_punto_coma(costo_volterra.toFixed(0)),
                        sobreprecio: "-",
                    },
                    {
                        nombre: "Constructora A",
                        contructora_dolar_m2: numero_punto_coma(contructora_dolar_m2_1.toFixed(2)),
                        costo_constructora: numero_punto_coma(costo_constructora_1.toFixed(0)),
                        sobreprecio: numero_punto_coma(Math.abs(sobreprecio_1).toFixed(0)),
                    },
                    {
                        nombre: "Constructora B",
                        contructora_dolar_m2: numero_punto_coma(contructora_dolar_m2_2.toFixed(2)),
                        costo_constructora: numero_punto_coma(costo_constructora_2.toFixed(0)),
                        sobreprecio: numero_punto_coma(Math.abs(sobreprecio_2).toFixed(0)),
                    },
                    {
                        nombre: "Constructora C",
                        contructora_dolar_m2: numero_punto_coma(contructora_dolar_m2_3.toFixed(2)),
                        costo_constructora: numero_punto_coma(costo_constructora_3.toFixed(0)),
                        sobreprecio: numero_punto_coma(Math.abs(sobreprecio_3).toFixed(0)),
                    },
                ];

                //-------------------------------------------------------------------------------

                var precios_mercado = [];
                var precios_mercado_render = []; // para numeros separados por punto mil

                let n_p = registro_inmueble.direccion_comparativa.length;
                if (n_p > 0) {
                    var sum_precios = 0;
                    var sus_m2_solidexa = construccion_inm / area_construida;
                    for (let i = 0; i < n_p; i++) {
                        var aux_sus_m2 = Number(
                            (
                                Number(registro_inmueble.precio_comparativa[i]) /
                                Number(registro_inmueble.m2_comparativa[i])
                            ).toFixed(2)
                        );

                        var aux_precio_inm_volterra = Number(
                            (aux_sus_m2 * area_construida).toFixed(2)
                        );
                        sum_precios = sum_precios + aux_precio_inm_volterra;
                        precios_mercado[i] = {
                            direccion_comparativa: registro_inmueble.direccion_comparativa[i],
                            m2_comparativa: Number(registro_inmueble.m2_comparativa[i].toFixed(2)),
                            precio_comparativa: Number(
                                registro_inmueble.precio_comparativa[i].toFixed(0)
                            ),
                            sus_m2: Number(aux_sus_m2.toFixed(2)),

                            sobreprecio_venta: Number((aux_sus_m2 - sus_m2_solidexa).toFixed(2)), // $us/m2

                            //precio_inm_volterra: Number(aux_precio_inm_volterra.toFixed(0)), // precio del inmueble  calculado a los precios que venden sus similares

                            //area_volterra: Number(area_construida.toFixed(2)), // para repetirlo en la tabla
                        };

                        precios_mercado_render[i] = {
                            direccion_comparativa: registro_inmueble.direccion_comparativa[i],
                            //m2_comparativa: registro_inmueble.m2_comparativa[i],
                            m2_comparativa: numero_punto_coma(
                                registro_inmueble.m2_comparativa[i].toFixed(2)
                            ),
                            precio_comparativa: numero_punto_coma(
                                registro_inmueble.precio_comparativa[i].toFixed(0)
                            ),
                            sus_m2: numero_punto_coma(aux_sus_m2.toFixed(2)),
                            sobreprecio_venta: numero_punto_coma(
                                (aux_sus_m2 - sus_m2_solidexa).toFixed(2)
                            ),

                            /*
                            precio_inm_volterra: numero_punto_coma(
                                aux_precio_inm_volterra.toFixed(0)
                            ), // precio del inmueble  calculado a los precios que venden sus similares
                            */

                            //area_volterra: numero_punto_coma(area_construida.toFixed(2)), // para repetirlo en la tabla
                        };
                    }
                    //---------------------------------------------------------------
                    // agregamos los datos de SOLIDEXA al inicio de los array necesarios
                    let datos_solidexa = {
                        direccion_comparativa: "SOLIDEXA",
                        m2_comparativa: Number(area_construida.toFixed(2)),
                        precio_comparativa: Number(construccion_inm.toFixed(0)),
                        sus_m2: Number(sus_m2_solidexa.toFixed(2)),
                        sobreprecio_venta: "-",
                        //area_volterra: Number(area_construida.toFixed(2)), // para repetirlo en la tabla
                    };

                    // Agregar al inicio del array
                    precios_mercado.unshift(datos_solidexa);

                    let datos_solidexa_render = {
                        direccion_comparativa: "SOLIDEXA",
                        m2_comparativa: numero_punto_coma(area_construida.toFixed(2)),
                        precio_comparativa: numero_punto_coma(construccion_inm.toFixed(0)),
                        sus_m2: numero_punto_coma(sus_m2_solidexa.toFixed(2)),
                        sobreprecio_venta: "-",
                        //area_volterra: numero_punto_coma(area_construida.toFixed(2)), // para repetirlo en la tabla
                    };

                    // Agregar al inicio del array
                    precios_mercado_render.unshift(datos_solidexa_render);
                    //---------------------------------------------------------------

                    var precio_promedio = (sum_precios / n_p).toFixed(0);
                    var precio_promedio_render = numero_punto_coma((sum_precios / n_p).toFixed(0));

                    // ------- Para verificación -------
                    //console.log("precio mercado");
                    //console.log(precio_promedio);
                    // ------- Para verificación -------
                    //console.log("precio mercado render");
                    //console.log(precio_promedio_render);
                }

                var info_inmueble_beneficios = {
                    //--------------------------------
                    // precios CONSTRUCTORAS - SOLIDEXA
                    constructoras,
                    constructoras_render,
                    // anteriormente era solo: area_construida,
                    area_construida: numero_punto_coma(area_construida.toFixed(2)),
                    // anteriormente era solo: volterra_dolar_m2,
                    volterra_dolar_m2: numero_punto_coma(volterra_dolar_m2.toFixed(2)),
                    costo_volterra_render: numero_punto_coma(costo_volterra.toFixed(0)),
                    // costo_volterra,
                    //--------------------------------
                    // ok
                    //capital_requerido,
                    //capital_faltante,
                    //partida_inversion,
                    plusvalia_sus: plusvalia_inm,
                    plusvalia_sus_render: numero_punto_coma(plusvalia_inm.toFixed(0)),
                    pv_volterra: Number(construccion_inm.toFixed(0)), // PRECIO VENTA DEL INMUEBLE ACTUALIZADO CON LOS DESCUENTOS SI ES QUE LOS TUVIESE
                    pv_volterra_render: numero_punto_coma(construccion_inm.toFixed(0)),

                    //rendimiento_proyecto: registro_proyecto.rentabilidad, // para mostrar el %

                    //inversion_minima: registro_proyecto.unitario_accion_sus, // para los saltos de rangueador

                    //--------------------------------
                    // para los precios de venta, comparativa de mercado
                    precios_mercado,
                    precios_mercado_render, // para mostrar con punto mil
                    //nota_comparativa: registro_inmueble.nota_comparativa, // para explicar la comparativa de mercado de los precios de venta
                    precio_promedio,

                    precio_promedio_render, // para mostrar con punto mil
                    //---------------------------------
                    // par permitir o no simulaciones con el rangueador
                    //permitir_simulacion, // booleano

                    //-----------------------------------------
                    // textos beneficio inmueble

                    titulo_construccion_inm: registro_proyecto.titulo_construccion_inm,
                    texto_construccion_inm: registro_proyecto.texto_construccion_inm,
                    nota_construccion_inm: registro_proyecto.nota_construccion_inm,

                    titulo_precio_inm: registro_proyecto.titulo_precio_inm,
                    texto_precio_inm: registro_proyecto.texto_precio_inm,

                    titulo_plusvalia_inm: registro_proyecto.titulo_plusvalia_inm,
                    texto_plusvalia_inm: registro_proyecto.texto_plusvalia_inm,
                };

                // ------- Para verificación -------
                //console.log("la respuesta de beneficios");
                //console.log(info_inmueble_beneficios);

                return info_inmueble_beneficios;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_info_economico(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_proyecto: 1,
                precio_construccion: 1,
                superficie_inmueble_m2: 1,
                tipo_inmueble: 1,
                _id: 0,
            }
        );
        if (registro_inmueble) {
            var codigo_proyecto = registro_inmueble.codigo_proyecto;
            var registro_proyecto = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_proyecto },
                {
                    presupuesto_proyecto: 1,
                    titulo_economico_inm: 1,
                    texto_economico_inm: 1,
                    nota_economico_inm: 1,
                    _id: 0,
                }
            );
            if (registro_proyecto) {
                let n_filas = registro_proyecto.presupuesto_proyecto.length;
                var sum_valores = 0;
                for (let t = 0; t < n_filas; t++) {
                    // porque de momento son 14 filas como maximo que permite la tabla
                    if (registro_proyecto.presupuesto_proyecto[t][1] != "") {
                        sum_valores =
                            sum_valores + Number(registro_proyecto.presupuesto_proyecto[t][2]);
                    }
                }
                var total_presupuesto = sum_valores;

                var area_construida = Number(registro_inmueble.superficie_inmueble_m2); // de INMUEBLE

                var valores_tabla = []; // asumimos
                var t_posi = -1;

                for (let t = 0; t < n_filas; t++) {
                    // porque de momento son 14 filas como maximo que permite la tabla
                    if (registro_proyecto.presupuesto_proyecto[t][1] != "") {
                        t_posi = t_posi + 1;

                        var porcentaje_item = numero_punto_coma(
                            Number(
                                (
                                    (Number(registro_proyecto.presupuesto_proyecto[t][2]) /
                                        total_presupuesto) *
                                    100
                                ).toFixed(2)
                            )
                        );
                        var porcentaje_item_prog = Number(
                            (
                                (Number(registro_proyecto.presupuesto_proyecto[t][2]) /
                                    total_presupuesto) *
                                100
                            ).toFixed(2)
                        );
                        var presupuesto_valores = Number(
                            (
                                (porcentaje_item_prog / 100) *
                                Number(registro_inmueble.precio_construccion)
                            ).toFixed(2)
                        );

                        valores_tabla[t_posi] = {
                            presupuesto_items: registro_proyecto.presupuesto_proyecto[t][1],
                            presupuesto_valores: numero_punto_coma(presupuesto_valores),
                            sus_m2: numero_punto_coma(
                                Number((presupuesto_valores / area_construida).toFixed(2))
                            ),
                            porcentaje_item,
                            porcentaje_item_prog,
                        };
                    }
                }

                var registro_documentos = await indiceDocumentos.find({
                    codigo_inmueble: codigo_inmueble,
                    clase_documento: "Económico",
                });

                var documentacion = []; // por defecto con respectos a los documentos  economico del proyecto
                if (registro_documentos.length > 0) {
                    for (let d = 0; d < registro_documentos.length; d++) {
                        documentacion[d] = {
                            titulo_documento: registro_documentos[d].nombre_documento,
                            codigo_documento: registro_documentos[d].codigo_documento,
                            url: registro_documentos[d].url,
                        };
                    }
                }

                var info_inmueble_info_economico = {
                    tipo_inmueble: registro_inmueble.tipo_inmueble,
                    sus_m2_total: numero_punto_coma(
                        (Number(registro_inmueble.precio_construccion) / area_construida).toFixed(2)
                    ),
                    total_presupuesto: numero_punto_coma(
                        Number(registro_inmueble.precio_construccion).toFixed(0)
                    ),
                    area_construida,
                    valores_tabla,
                    documentacion,

                    superficie_inmueble_m2: numero_punto_coma(
                        registro_inmueble.superficie_inmueble_m2
                    ),

                    titulo_economico_inm: registro_proyecto.titulo_economico_inm,
                    texto_economico_inm: registro_proyecto.texto_economico_inm,
                    nota_economico_inm: registro_proyecto.nota_economico_inm,
                };

                // ------- Para verificación -------
                //console.log("DATOS DE INFORME ECONOMICO DE INMUEBLE");
                //console.log(info_inmueble_info_economico);

                return info_inmueble_info_economico;
            } else {
                return false;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_empleos(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            {
                codigo_inmueble: codigo_inmueble,
            },
            {
                codigo_proyecto: 1,
                tipo_inmueble: 1,
                precio_construccion: 1,
                _id: 0,
            }
        );

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                nombre_empresa: 1,
                significado_inm_propietarios: 1,
                significado_inm_empresa: 1,
                significado_inm_pais: 1,
                _id: 0,
            }
        );

        if (registro_inmueble && registro_empresa) {
            var codigo_proyecto = registro_inmueble.codigo_proyecto;
            var construccion_inmueble = registro_inmueble.precio_construccion;

            var registro_proyecto = await indiceProyecto.findOne(
                {
                    codigo_proyecto: codigo_proyecto,
                },
                {
                    nombre_proyecto: 1,
                    descripcion_empleo: 1,

                    tabla_empleos_sociedad: 1,
                    _id: 0,
                }
            );

            if (registro_proyecto) {
                var aux_proyecto_info = await proyecto_info_cd(codigo_proyecto);
                // se trabajar con el valor de precio de CONTRUCCION, no asi con el valor actual de precio de los inmuebles, porque es con el valor de CONSTRUCCION con el que se paga a los trabajadores directos e indirectos, proveedores, etc
                var construccion_proyecto = aux_proyecto_info.construccion;
                var fraccion_inmueble = construccion_inmueble / construccion_proyecto;

                // ------- Para verificación -------
                //console.log("la fraccion del inmueble es:");
                //console.log(fraccion_inmueble);

                let n_filas = registro_proyecto.tabla_empleos_sociedad.length;
                var sum_valores = 0;
                var sum_valores_2 = 0;
                var sum_beneficiarios = 0;
                for (let t = 0; t < n_filas; t++) {
                    if (registro_proyecto.tabla_empleos_sociedad[t] != "") {
                        sum_valores =
                            sum_valores +
                            Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                fraccion_inmueble;
                        sum_valores_2 =
                            sum_valores_2 + Number(registro_proyecto.tabla_empleos_sociedad[t][4]);

                        sum_beneficiarios =
                            sum_beneficiarios +
                            Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                    }
                }

                var total_beneficio = sum_valores; // en moneda
                var total_beneficio_2 = sum_valores_2; // en moneda
                var total_beneficiarios = sum_beneficiarios; // #

                var valores_tabla = []; // asumimos vacio
                var t_posi = -1;
                var n_directos = 0;
                var n_indirectos = 0;
                var sus_directos = 0;
                var sus_indirectos = 0;
                for (let t = 0; t < n_filas; t++) {
                    if (registro_proyecto.tabla_empleos_sociedad[t][1] != "") {
                        t_posi = t_posi + 1;
                        if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Directo") {
                            var tipo_color = "en_azul";
                        }
                        if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Indirecto") {
                            var tipo_color = "en_verde";
                        }
                        valores_tabla[t_posi] = {
                            // [#, beneficiario, directo/directo, cantidad, beneficio $us]
                            empleo_beneficiario: registro_proyecto.tabla_empleos_sociedad[t][1],
                            empleo_tipo: registro_proyecto.tabla_empleos_sociedad[t][2],
                            empleo_cantidad: registro_proyecto.tabla_empleos_sociedad[t][3],
                            empleo_beneficio: numero_punto_coma(
                                (
                                    Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                    fraccion_inmueble
                                ).toFixed(0)
                            ),

                            empleo_porcentaje: numero_punto_coma(
                                Number(
                                    (
                                        (Number(registro_proyecto.tabla_empleos_sociedad[t][4]) /
                                            total_beneficio_2) *
                                        100
                                    ).toFixed(1)
                                )
                            ),
                            empleo_porcentaje_prog: Number(
                                (
                                    (Number(registro_proyecto.tabla_empleos_sociedad[t][4]) /
                                        total_beneficio_2) *
                                    100
                                ).toFixed(1)
                            ),
                            tipo_color,
                        };

                        if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Directo") {
                            n_directos =
                                n_directos + Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                            sus_directos =
                                sus_directos +
                                Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                    fraccion_inmueble;
                        }
                        if (registro_proyecto.tabla_empleos_sociedad[t][2] == "Indirecto") {
                            n_indirectos =
                                n_indirectos +
                                Number(registro_proyecto.tabla_empleos_sociedad[t][3]);
                            sus_indirectos =
                                sus_indirectos +
                                Number(registro_proyecto.tabla_empleos_sociedad[t][4]) *
                                    fraccion_inmueble;
                        }
                    }
                }

                //----------------------------------------------------------
                // para los significados de los empleos

                var datos_segundero = {
                    codigo_objetivo: codigo_inmueble,
                    ci_propietario: "ninguno",
                    tipo_objetivo: "inmueble",
                };
                var aux_segundero_cajas = await segundero_cajas(datos_segundero);
                //-------------

                let significado_inm_propietarios_0 = registro_empresa.significado_inm_propietarios;
                let significado_inm_empresa_0 = registro_empresa.significado_inm_empresa;
                let significado_inm_pais_0 = registro_empresa.significado_inm_pais;

                let nom_empre = registro_empresa.nombre_empresa;
                let inm_nfp = 1; // representa al mismo propietario del inmueble
                let inm_dfp = numero_punto_coma(aux_segundero_cajas.ahorro); // es la plusvalia total de inmueble
                let py_inm_nfe = n_directos;
                let inm_dfe = numero_punto_coma(sus_directos.toFixed(0));
                let py_inm_nfb = n_indirectos;
                let inm_dfb = numero_punto_coma(sus_indirectos.toFixed(0));

                // "replace" reemplaza solo la primera coincidencia.

                var significado_inm_propietarios_1 = significado_inm_propietarios_0.replace(
                    "/inm_nfp/",
                    inm_nfp
                );
                var significado_inm_propietarios = significado_inm_propietarios_1.replace(
                    "/inm_dfp/",
                    inm_dfp
                );

                var significado_inm_empresa_1 = significado_inm_empresa_0.replace(
                    "/nom_empre/",
                    nom_empre
                );
                var significado_inm_empresa_2 = significado_inm_empresa_1.replace(
                    "/py_inm_nfe/",
                    py_inm_nfe
                );
                var significado_inm_empresa = significado_inm_empresa_2.replace(
                    "/inm_dfe/",
                    inm_dfe
                );

                var significado_inm_pais_1 = significado_inm_pais_0.replace(
                    "/nom_empre/",
                    nom_empre
                );
                var significado_inm_pais_2 = significado_inm_pais_1.replace(
                    "/py_inm_nfb/",
                    py_inm_nfb
                );
                var significado_inm_pais = significado_inm_pais_2.replace("/inm_dfb/", inm_dfb);

                // ---------------------------------------------------------------------

                var info_proyecto_info_economico = {
                    tipo_inmueble: registro_inmueble.tipo_inmueble,
                    total_beneficio: numero_punto_coma(total_beneficio.toFixed(0)),
                    total_beneficiarios,
                    nombre_proyecto: registro_proyecto.nombre_proyecto,

                    area_construida: registro_proyecto.area_construida,
                    valores_tabla,

                    descripcion_empleo: registro_proyecto.descripcion_empleo,

                    inm_nfp,
                    inm_dfp,
                    py_inm_nfe,
                    inm_dfe,
                    py_inm_nfb,
                    inm_dfb,
                    significado_inm_propietarios,
                    significado_inm_empresa,
                    significado_inm_pais,
                };

                return info_proyecto_info_economico;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------------------

async function inmueble_calculadora(codigo_inmueble) {
    try {
        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                superficie_inmueble_m2: 1,
                codigo_terreno: 1,
                codigo_terreno: 1,
                precio_comparativa: 1,
                m2_comparativa: 1,
                superficie_inmueble_m2: 1,
                _id: 0,
            }
        );

        var solidexa_sus = 0;
        var solidexa_sus_m2 = 0;
        var solidexa_m2 = 0;

        var maximo = 0; // por defecto
        var minimo = 0; // por defecto
        var promedio = 0; // por defecto

        var maximo_render = "0"; // por defecto
        var minimo_render = "0"; // por defecto
        var promedio_render = "0"; // por defecto

        var direccion = "Dirección";
        var provincia = "Provincia";
        var ciudad = "Ciudad";

        if (registro_inmueble) {
            //-------------------------------------------------------------------
            var datos_segundero = {
                codigo_objetivo: codigo_inmueble,
                ci_propietario: "ninguno",
                tipo_objetivo: "inmueble",
            };

            // OJO*** PORQUE "segundero_cajas" tambien utiliza "inmueble_card_adm_cli" y estan ambas en esta misma funcion
            var aux_segundero_cajas = await segundero_cajas(datos_segundero);
            solidexa_sus = aux_segundero_cajas.precio; // precio actual del inmueble con los descuentos por penalizaciones que pudierra llegar a tener actualmente
            solidexa_sus_m2 = Number(
                (solidexa_sus / registro_inmueble.superficie_inmueble_m2).toFixed(2)
            ); // en valor numerico con 2 decimales

            solidexa_m2 = registro_inmueble.superficie_inmueble_m2; // de la BD ya viene como numerico y redondeado a 2 decimales

            var registro_terreno = await indiceTerreno.findOne(
                { codigo_terreno: registro_inmueble.codigo_terreno },
                {
                    ciudad: 1,
                    provincia: 1,
                    direccion: 1,
                    _id: 0,
                }
            );

            if (registro_terreno) {
                direccion = registro_terreno.direccion;
                provincia = registro_terreno.provincia;
                ciudad = registro_terreno.ciudad;
            }

            let precios_otros = registro_inmueble.precio_comparativa;
            let m2_otros = registro_inmueble.m2_comparativa;
            let sus_m2 = [];
            let sum_sus_m2 = 0;
            let contador = 0;

            if (precios_otros.length > 0 && m2_otros.length > 0) {
                for (let d = 0; d < precios_otros.length; d++) {
                    sus_m2[d] = precios_otros[d] / m2_otros[d];
                    sum_sus_m2 = sum_sus_m2 + precios_otros[d] / m2_otros[d];
                    contador = contador + 1;
                }

                // el valor MAXIMO del array sus_m2
                var aux_maximo = Math.max(...sus_m2);
                maximo = Number(aux_maximo.toFixed(2));
                maximo_render = numero_punto_coma(aux_maximo.toFixed(2));
                // el valor minimo del array sus_m2
                var aux_minimo = Math.min(...sus_m2);
                minimo = Number(aux_minimo.toFixed(2));
                minimo_render = numero_punto_coma(aux_minimo.toFixed(2));
                // el valor promedio del array sus_m2
                var aux_promedio = sum_sus_m2 / contador;
                promedio = Number(aux_promedio.toFixed(2));
                promedio_render = numero_punto_coma(aux_promedio.toFixed(2));
            }

            var datos_calculadora = {
                direccion,
                provincia,
                ciudad,

                solidexa_sus,
                solidexa_m2,
                solidexa_sus_m2,

                maximo, // $us/m2 numerico redondeado a 2 decimales
                minimo, // $us/m2 numerico redondeado a 2 decimales
                promedio, // $us/m2 numerico redondeado a 2 decimales

                maximo_render,
                minimo_render,
                promedio_render,
            };

            return datos_calculadora;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------

async function inmueble_inversor(paquete_datos) {
    try {
        var paquete_propietario = {
            ci_propietario: paquete_datos.ci_inversionista,
            codigo_inmueble: paquete_datos.codigo_inmueble,
        };

        var aux_respuesta = {}; // ***** REVISAR SI ES CORRECTO DECLARARLO VACIO PARA LUEGO LLENARLO CON AWAIT.
        aux_respuesta = await datos_pagos_propietario(paquete_propietario);
        aux_respuesta.existe_propietario = true; // porque esta pestaña "Propietario" dentro de la ventana de "Inmuble" (lado cliente) solo esta disponible cuando en verdad existe un propietario de este inmueble

        /*
        var reg_estado_propietario = await indiceInversiones.findOne(
            {
                codigo_inmueble: paquete_datos.codigo_inmueble,
                ci_propietario: paquete_datos.ci_inversionista,
            },
            {
                estado_propietario: 1,
                _id: 0,
            }
        );

        aux_respuesta.estado_propietario = reg_estado_propietario.estado_propietario;
        */

        // DOCUMENTOS PRIVADOS DEL PROPIETARIO
        var documentos_privados = [];
        var registro_documentos_priv = await indiceDocumentos.find({
            ci_propietario: paquete_datos.ci_inversionista,
            codigo_inmueble: paquete_datos.codigo_inmueble,
            clase_documento: "Propietario",
        });

        if (registro_documentos_priv.length > 0) {
            for (let p = 0; p < registro_documentos_priv.length; p++) {
                documentos_privados[p] = {
                    codigo_inmueble: registro_documentos_priv[p].codigo_inmueble,
                    nombre_documento: registro_documentos_priv[p].nombre_documento,
                    codigo_documento: registro_documentos_priv[p].codigo_documento,
                    url: registro_documentos_priv[p].url,
                };
            }
        }

        //en caso de que no existiesen documentos privados, entonces "documentos_privados" estara vacio
        aux_respuesta.documentos = documentos_privados;

        return aux_respuesta;
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------------------------------------

async function n_vista_ventana(paquete_vista) {
    try {
        var codigo_inmueble = paquete_vista.codigo_inmueble;
        var ventana = paquete_vista.ventana;

        const registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                v_descripcion: 1,
                v_garantias: 1,
                v_beneficios: 1,
                v_info_economico: 1,
                v_empleos: 1,
                v_inversor: 1,
                _id: 0,
            }
        );
        if (registro_inmueble) {
            if (ventana == "descripcion") {
                var n_vista = registro_inmueble.v_descripcion + 1;
                await indiceInmueble.updateOne(
                    { codigo_inmueble: codigo_inmueble },
                    { $set: { v_descripcion: n_vista } }
                );
            }
            if (ventana == "garantias") {
                var n_vista = registro_inmueble.v_garantias + 1;
                await indiceInmueble.updateOne(
                    { codigo_inmueble: codigo_inmueble },
                    { $set: { v_garantias: n_vista } }
                );
            }
            if (ventana == "beneficios") {
                var n_vista = registro_inmueble.v_beneficios + 1;
                await indiceInmueble.updateOne(
                    { codigo_inmueble: codigo_inmueble },
                    { $set: { v_beneficios: n_vista } }
                );
            }
            if (ventana == "info_economico") {
                var n_vista = registro_inmueble.v_info_economico + 1;
                await indiceInmueble.updateOne(
                    { codigo_inmueble: codigo_inmueble },
                    { $set: { v_info_economico: n_vista } }
                );
            }
            if (ventana == "empleos") {
                var n_vista = registro_inmueble.v_empleos + 1;
                await indiceInmueble.updateOne(
                    { codigo_inmueble: codigo_inmueble },
                    { $set: { v_empleos: n_vista } }
                );
            }
            if (ventana == "inversor") {
                var n_vista = registro_inmueble.v_inversor + 1;
                await indiceInmueble.updateOne(
                    { codigo_inmueble: codigo_inmueble },
                    { $set: { v_inversor: n_vista } }
                );
            }
            return n_vista;
        }
    } catch (error) {
        console.log(error);
    }
}

// ------------------------------------------------------------------
// para informacion global de INMUEBLE que se mostrara en todas las ventanas

async function complementos_globales_inm(paquete_datos) {
    const codigo_inmueble = paquete_datos.codigo_inmueble;

    const ci_inversionista = paquete_datos.ci_inversionista;
    //const tipo_inmueble = paquete_datos.tipo_inmueble; // para no tener que invocar nuevamente al indiceInmueble

    var aux_inmueble = await indiceInmueble.findOne(
        { codigo_inmueble: codigo_inmueble },
        {
            codigo_proyecto: 1,
            estado_inmueble: 1,
        }
    );

    const codigo_proyecto = aux_inmueble.codigo_proyecto;

    var basico_py = await indiceProyecto.findOne(
        { codigo_proyecto: codigo_proyecto },
        {
            nombre_proyecto: 1,
            //link_video_recorrido: 1,
            //link_facebook_proyecto: 1,
            //link_tiktok_proyecto: 1,
            estado_proyecto: 1,
        }
    );

    if (basico_py) {
        var registro_imagenes_py = await indiceImagenesProyecto.find(
            {
                codigo_proyecto: codigo_proyecto,
                imagen_respon_social: false,
            },
            {
                nombre_imagen: 1,
                codigo_imagen: 1,
                extension_imagen: 1,
                parte_principal: 1,
                parte_exclusiva: 1,
                url: 1,
                _id: 0,
            }
        );

        var imagenes_inm_principal = []; // asumimos por defecto
        var imagenes_inm_exclusiva = []; // asumimos por defecto
        if (registro_imagenes_py.length > 0) {
            var i_principal = -1;
            var i_exclusiva = -1;
            for (let i = 0; i < registro_imagenes_py.length; i++) {
                // revision si la "imagen for" es una imagen principal del inmueble

                let arrayPrincipalesFor = registro_imagenes_py[i].parte_principal;

                // buscamos en este "arrayPrincipalesFor" si existe el codigo del inmueble (buscando la posicion que este ocupa en el presente ARRAY)
                let pocisionExiste = arrayPrincipalesFor.indexOf(codigo_inmueble);
                if (pocisionExiste != -1) {
                    // si el codigo del INMUEBLE figura en este ARRAY, significa que la presente imagen for, es la imagen principal del INMUEBLE

                    // incrementamos en +1 la pocision para construir el ARRAY
                    i_principal = i_principal + 1; // AUNQUE SOLO PUEDE EXISTIR 1 IMAGEN COMO PRINCIPAL
                    // llenamos el objeto con los valores de la imagen que corresponda "i"
                    imagenes_inm_principal[i_principal] = {
                        nombre_imagen: registro_imagenes_py[i].nombre_imagen,
                        codigo_imagen: registro_imagenes_py[i].codigo_imagen, // sin extension
                        inmueble_imagen:
                            registro_imagenes_py[i].codigo_imagen +
                            registro_imagenes_py[i].extension_imagen,
                        url: registro_imagenes_py[i].url,
                    };
                } else {
                    // si la imagen no es "principal" para el proyecto,
                    // entonces revisamos si es una "exclusiva" del proyecto
                    let arrayExclusivasFor = registro_imagenes_py[i].parte_exclusiva;

                    // buscamos en este "arrayExclusivasFor" si existe el codigo del proyecto (buscando la posicion que este ocupa en el presente ARRAY)
                    let pocisionExiste = arrayExclusivasFor.indexOf(codigo_inmueble);

                    if (pocisionExiste != -1) {
                        // si el codigo del inmueble figura en este ARRAY, significa que la presente imagen for, es una imagen exclusiva del inmueble

                        // incrementamos en +1 la pocision para construir el ARRAY
                        i_exclusiva = i_exclusiva + 1;
                        // llenamos el objeto con los valores de la imagen que corresponda "i"
                        imagenes_inm_exclusiva[i_exclusiva] = {
                            nombre_imagen: registro_imagenes_py[i].nombre_imagen,
                            codigo_imagen: registro_imagenes_py[i].codigo_imagen, // sin extension
                            inmueble_imagen:
                                registro_imagenes_py[i].codigo_imagen +
                                registro_imagenes_py[i].extension_imagen,
                            url: registro_imagenes_py[i].url,
                        };
                    }
                }
            }
        }

        // solo para mostrar las pestañas de navegacion correspondientes al estado del proyecto

        // para mostrar la pestaña del inversor del presente inmueble

        if (ci_inversionista != "ninguno") {
            var registro_inversor = await indiceInversiones.findOne({
                ci_propietario: ci_inversionista,
                codigo_inmueble: codigo_inmueble,
            });
            if (registro_inversor) {
                // si el inversor EXISTE EN LA BASE DE DATOS y es actual dueño del presente INMUEBLE
                var existe_inversor_inmueble = true;
            } else {
                var existe_inversor_inmueble = false;
            }
        } else {
            var existe_inversor_inmueble = false;
        }

        //----------------------------------------------------------
        // para mostrar u ocultar la pestaña de calculadora dentro del inmueble

        if (aux_inmueble.estado_inmueble == "completado") {
            // la pestaña de "calculadora" no sera visible cuando el inmueble este en estado de completado (que equivale a estar construido)
            var existe_calculadora = false;
        } else {
            var existe_calculadora = true;
        }
        //----------------------------------------------------------

        return {
            codigo_proyecto,
            nombre_proyecto: basico_py.nombre_proyecto,
            estado_proyecto: basico_py.estado_proyecto,

            //facebook_py: basico_py.link_facebook_proyecto,
            //tiktok_py: basico_py.link_tiktok_proyecto,
            //youtube_py: basico_py.link_video_recorrido, // si no existe del propio inmueble, entonces en su lugar se pondra este.

            //tipo_inmueble, // (departamento, garzonier, tienda, otro [en ese caso especificado] )
            codigo_inmueble,

            imagenes_inm_principal,
            imagenes_inm_exclusiva,

            existe_inversor_inmueble,

            existe_calculadora,
        };
    }
}

// ------------------------------------------------------------------

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorCliInmueble;
