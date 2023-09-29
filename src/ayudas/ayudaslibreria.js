const {
    indiceTerreno,
    indiceProyecto,
    indiceInmueble,
    indiceInversiones,
} = require("../modelos/indicemodelo");

const { numero_punto_coma } = require("./funcionesayuda_3");

const moment = require("moment");

// creamos el objeto vacio, al que llamaremos "libreriaFunciones"
const libreriaFunciones = {};

// ahora procedemos a llenar al {objeto} vacio conlas funciones deseadas

/***************************************************************************** */
// CODIGO TERRENOS

libreriaFunciones.codigoAlfanumericoTerreno = function () {
    let codigoAlfaNumTerreno = "te";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumTerreno = codigoAlfaNumTerreno + codigoGenerado; // concatenamos

    return codigoAlfaNumTerreno; // retornamos
};

/***************************************************************************** */
// CODIGO PROYECTOS

libreriaFunciones.codigoAlfanumericoProyecto = function () {
    let codigoAlfaNumProyecto = "py";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumProyecto = codigoAlfaNumProyecto + codigoGenerado; // concatenamos

    return codigoAlfaNumProyecto; // retornamos
};

/***************************************************************************** */
// CODIGO INMUEBLE

libreriaFunciones.codigoAlfanumericoInmueble = function () {
    let codigoAlfaNumInmueble = "im";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumInmueble = codigoAlfaNumInmueble + codigoGenerado; // concatenamos

    return codigoAlfaNumInmueble; // retormanos
};

/***************************************************************************** */
// CODIGO IMAGEN PARA IMAGENES DE EMPRESA parte QUIENES SOMOS y COMO FUNCIONA
libreriaFunciones.codAlfanumImagenEmp_sf = function () {
    let codigoAlfaNumImagen = "imaemp_sf";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumImagen = codigoAlfaNumImagen + codigoGenerado; // concatenamos

    return codigoAlfaNumImagen; // retormanos
};

/***************************************************************************** */
// CODIGO IMAGEN PARA PROYECTO (incluye imagenes de responsabilidad social)
libreriaFunciones.codigoAlfanumericoImagen = function () {
    let codigoAlfaNumImagen = "ima";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumImagen = codigoAlfaNumImagen + codigoGenerado; // concatenamos

    return codigoAlfaNumImagen; // retormanos
};

/***************************************************************************** */
// CODIGO IMAGEN TERRENO
libreriaFunciones.codigoAlfanumericoImagenTe = function () {
    let codigoAlfaNumImagen = "imate";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumImagen = codigoAlfaNumImagen + codigoGenerado; // concatenamos

    return codigoAlfaNumImagen; // retormanos
};

/***************************************************************************** */
// CODIGO DOCUMENTO
libreriaFunciones.codigoAlfanumericoDocumento = function () {
    let codigoAlfaNumDocumento = "doc";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumDocumento = codigoAlfaNumDocumento + codigoGenerado; // concatenamos

    return codigoAlfaNumDocumento; // retormanos
};

/***************************************************************************** */
// CODIGO DOCUMENTO
libreriaFunciones.codigoAlfanumericoRequerimiento = function () {
    let codigoAlfaNumRequerimiento = "req";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumRequerimiento = codigoAlfaNumRequerimiento + codigoGenerado; // concatenamos

    return codigoAlfaNumRequerimiento; // retormanos
};

/***************************************************************************** */
// CODIGO VIDA USUARIO
libreriaFunciones.codigoAlfanumericoUsuario = function () {
    // usamos "let" y no "const", porque el "codigoAlfaNumUsuario" no se mantendra inalterable, sino que ira cambiando a medida que se le agreguen caracteres

    let codigoAlfaNumUsuario = "usu";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumUsuario = codigoAlfaNumUsuario + codigoGenerado; // concatenamos

    return codigoAlfaNumUsuario; // retormanos
};

/***************************************************************************** */
// ADMINISTRADOR USUARIO (usuario y clave)
libreriaFunciones.admUsuario = function () {
    // usamos "let" y no "const", porque el "codigoAlfaNumUsuario" no se mantendra inalterable, sino que ira cambiando a medida que se le agreguen caracteres

    let admAlfaNumUsuario = "adm";
    let codigoGenerado = armadorCodigos();
    admAlfaNumUsuario = admAlfaNumUsuario + codigoGenerado; // concatenamos

    let claveAdm = armadorCodigos();

    let accesosAdm = {
        usuario_administrador: admAlfaNumUsuario,
        clave_administrador: claveAdm,
    };

    return accesosAdm; // retormanos el OBJETO con los datos
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ENCARGADO DE ARMAR CODIGO PARA TODOS LOS DEMAS
function armadorCodigos() {
    // caracteres que formaran parte del codigo alfanumerico del documento
    const caracteresNumericos = "0123456789";
    const caracteresAlfabeticos = "abcdefghijklmnopqrstuvwxyz";

    // "Math.floor" redondea hacia abajo
    // "Math.random() * caracteresPosibles.length" genera un numero aleatorio, el valor de este numero sera hasta el numero de caracteres posibles
    // "caracteresPosibles.charAt" genera un caracter de acuerdo a la posicion, segun salgue el numero aleatorio dentro de ( )
    // "+=" para que los caracteres generados se vallan acomodando uno al lado del otro, hasta que se recorran 9 veces

    let codigoCreado; // del tipo    ##aa#a

    codigoCreado = caracteresNumericos.charAt(Math.floor(Math.random() * caracteresNumericos.length));
    codigoCreado =
        codigoCreado +
        caracteresNumericos.charAt(Math.floor(Math.random() * caracteresNumericos.length));

    codigoCreado =
        codigoCreado +
        caracteresAlfabeticos.charAt(Math.floor(Math.random() * caracteresAlfabeticos.length));
    codigoCreado =
        codigoCreado +
        caracteresAlfabeticos.charAt(Math.floor(Math.random() * caracteresAlfabeticos.length));

    codigoCreado =
        codigoCreado +
        caracteresNumericos.charAt(Math.floor(Math.random() * caracteresNumericos.length));
    codigoCreado =
        codigoCreado +
        caracteresAlfabeticos.charAt(Math.floor(Math.random() * caracteresAlfabeticos.length));

    return codigoCreado;
}

//-----------------------------------------------------------------------------
// PARA LA BARRA DE PROGRESO QUE SE VERAN EN EL CARD DE: PY, INM
/*
card_porcentaje,
card_porcentaje_render,
card_financiamiento,
card_financiamiento_render,
card_meta,
card_meta_render,
*/

libreriaFunciones.barra_progreso_card = async function (paquete_datos) {
    // corregir el codigo que viene debajo
    try {
        // ------- Para verificación -------
        //console.log("EL PAQUETE DE DATOS QUE LE LLEGA A barra_progreso_card");
        //console.log(paquete_datos);

        var tipo_objetivo = paquete_datos.tipo_objetivo;
        var codigo_objetivo = paquete_datos.codigo_objetivo;

        if (tipo_objetivo == "proyecto") {
            var datos_proyecto = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_objetivo },
                {
                    codigo_terreno: 1,
                    _id: 0,
                }
            );
            var codigo_terreno = datos_proyecto.codigo_terreno;
        }

        if (tipo_objetivo == "inmueble") {
            var datos_inmueble = await indiceInmueble.findOne(
                { codigo_inmueble: codigo_objetivo },
                {
                    codigo_terreno: 1,
                    valor_reserva: 1,
                    precio_construccion: 1,
                    _id: 0,
                }
            );
            var codigo_terreno = datos_inmueble.codigo_terreno;
        }

        if (tipo_objetivo == "terreno") {
            var codigo_terreno = codigo_objetivo;
        }

        var datos_terreno = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                // guardado, reserva, pago, construccion, construido
                estado_terreno: 1,
                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,
                _id: 0,
            }
        );

        //-------------------------------------------------------------------------------
        // VALORES POR DEFECTO
        var card_porcentaje = 0; // numerico para que sea leido como tal por el style
        var card_porcentaje_render = "0"; // (string) para mostrar visiblemente al cliente

        var card_financiamiento = 0;
        var card_financiamiento_render = "0";

        var card_meta = 0;
        var card_meta_render = "0";
        //-------------------------------------------------------------------------------

        if (datos_terreno) {
            moment.locale("es");

            if (tipo_objetivo == "inmueble") {
                // utilizamos "findOne", porque solo puede existir un solo propietario "activo" por inmueble
                var registro_pagos = await indiceInversiones.findOne(
                    { codigo_inmueble: codigo_objetivo, estado_propietario: "activo" },
                    {
                        tiene_reserva: 1,
                        pagado_reserva: 1,
                        tiene_pago: 1,
                        pagado_pago: 1,
                        tiene_mensuales: 1,
                        pagos_mensuales: 1,
                        _id: 0,
                    }
                );

                if (datos_terreno.estado_terreno == "reserva") {
                    card_meta = datos_inmueble.valor_reserva;
                    card_meta_render = numero_punto_coma(card_meta);
                    if (registro_pagos && registro_pagos.tiene_reserva) {
                        card_financiamiento = registro_pagos.pagado_reserva;
                        card_financiamiento_render = numero_punto_coma(card_financiamiento);
                        card_porcentaje = 100;
                        card_porcentaje_render = "100";
                    }
                }

                if (datos_terreno.estado_terreno == "pago") {
                    card_meta = datos_inmueble.precio_construccion;
                    card_meta_render = numero_punto_coma(card_meta);
                    if (registro_pagos && registro_pagos.tiene_pago) {
                        card_financiamiento = registro_pagos.pagado_pago;
                        card_financiamiento_render = numero_punto_coma(card_financiamiento);
                        card_porcentaje = 100;
                        card_porcentaje_render = "100";
                    }
                }

                if (datos_terreno.estado_terreno == "aprobacion") {
                    //card_meta = datos_inmueble.valor_reserva + datos_inmueble.precio_construccion;
                    card_meta = datos_inmueble.precio_construccion;
                    card_meta_render = numero_punto_coma(card_meta);
                    // en la condicionante if, consideramos "registro_pagos.tiene_pago", porque solo es tomado en cuenta este pago, ya que considera el monto de reserva
                    if (registro_pagos && registro_pagos.tiene_pago) {
                        //card_financiamiento = registro_pagos.pagado_reserva + registro_pagos.pagado_pago;
                        card_financiamiento = registro_pagos.pagado_pago;

                        card_financiamiento_render = numero_punto_coma(card_financiamiento);

                        card_porcentaje = 100;
                        card_porcentaje_render = "100";
                    }
                }

                if (datos_terreno.estado_terreno == "construccion") {
                    //card_meta = datos_inmueble.valor_reserva + datos_inmueble.precio_construccion;
                    card_meta = datos_inmueble.precio_construccion;
                    card_meta_render = numero_punto_coma(card_meta);
                    if (registro_pagos && registro_pagos.tiene_mensuales) {
                        var sum_pago = 0;
                        for (let k = 0; k < pagos_mensuales.length; k++) {
                            // PAGOS MENSUALES
                            //  [ [1, "2023-09-08", 88.77], [ ], [ ]]
                            sum_pago = sum_pago + registro_pagos.pagos_mensuales[k][2];
                        }
                        card_financiamiento = sum_pago;
                        card_financiamiento_render = numero_punto_coma(card_financiamiento);

                        var fecha_inicio = datos_terreno.fecha_inicio_construccion;
                        var fecha_fin = datos_terreno.fecha_fin_construccion;

                        var fecha_actual = new Date();

                        let string_card_porcentaje = (
                            (1 - (fecha_fin - fecha_actual) / (fecha_fin - fecha_inicio)) *
                            100
                        ).toFixed(2);

                        card_porcentaje = Number(string_card_porcentaje); // numerico con 2 decimales
                        card_porcentaje_render = numero_punto_coma(card_porcentaje); // string con coma decimal
                    }
                }

                if (datos_terreno.estado_terreno == "construido") {
                    if (registro_pagos && registro_pagos.tiene_mensuales) {
                        var sum_pago = 0;
                        for (let k = 0; k < registro_pagos.pagos_mensuales.length; k++) {
                            // PAGOS MENSUALES
                            //  [ [1, "2023-09-08", 88.77], [ ], [ ]]
                            sum_pago = sum_pago + registro_pagos.pagos_mensuales[k][2];
                        }

                        card_financiamiento = sum_pago;
                        card_financiamiento_render = numero_punto_coma(card_financiamiento);
                        card_meta = card_financiamiento;
                        card_meta_render = card_financiamiento_render;

                        card_porcentaje = 100;
                        card_porcentaje_render = "100";
                    }
                }
            }

            //-----------------------------------------------------------------------------------------------
            //-----------------------------------------------------------------------------------------------

            if (tipo_objetivo == "proyecto") {
                //------------------------------------------
                var proyecto_inmuebles = await indiceInmueble.find(
                    { codigo_proyecto: codigo_objetivo },
                    {
                        valor_reserva: 1,
                        precio_construccion: 1,
                        _id: 0,
                    }
                );

                // valores por defecto
                var sum_reserva = 0;
                var sum_construccion = 0;

                for (let t = 0; t < proyecto_inmuebles.length; t++) {
                    sum_reserva = sum_reserva + proyecto_inmuebles[t].valor_reserva;
                    sum_construccion = sum_construccion + proyecto_inmuebles[t].precio_construccion;
                }

                //------------------------------------------
                // usamos "find", porque recopilaremos a TODOS los propietarios "activos" que tengan pagos del proyecto
                var registro_pagos = await indiceInversiones.find(
                    { codigo_proyecto: codigo_objetivo, estado_propietario: "activo" },
                    {
                        tiene_reserva: 1,
                        pagado_reserva: 1,
                        tiene_pago: 1,
                        pagado_pago: 1,
                        tiene_mensuales: 1,
                        pagos_mensuales: 1,
                        _id: 0,
                    }
                );

                // valores por defecto
                var sum_pagado_reserva = 0;
                var sum_pagado_pago = 0;
                var sum_pagado_mensuales = 0;

                if (registro_pagos.length > 0) {
                    for (let t = 0; t < registro_pagos.length; t++) {
                        if (registro_pagos[t].tiene_reserva) {
                            sum_pagado_reserva = sum_pagado_reserva + registro_pagos[t].pagado_reserva;
                        }
                        if (registro_pagos[t].tiene_pago) {
                            sum_pagado_pago = sum_pagado_pago + registro_pagos[t].pagado_pago;
                        }
                        if (registro_pagos[t].tiene_mensuales) {
                            for (let x = 0; x < registro_pagos[t].pagos_mensuales.length; x++) {
                                let aux_mensual_x = registro_pagos[t].pagos_mensuales[x][2];
                                sum_pagado_mensuales = sum_pagado_mensuales + aux_mensual_x;
                            }
                        }
                    }
                }

                //------------------------------------------

                if (datos_terreno.estado_terreno == "reserva") {
                    card_meta = sum_reserva;
                    card_meta_render = numero_punto_coma(card_meta);

                    card_financiamiento = sum_pagado_reserva;
                    card_financiamiento_render = numero_punto_coma(card_financiamiento);

                    let aux_card_porcentaje = ((card_financiamiento / card_meta) * 100).toFixed(2);
                    card_porcentaje = Number(aux_card_porcentaje); // numerico con 2 decimales

                    card_porcentaje_render = numero_punto_coma(card_porcentaje); // string con coma decimal
                }

                if (datos_terreno.estado_terreno == "pago") {
                    card_meta = sum_construccion;
                    card_meta_render = numero_punto_coma(card_meta);

                    card_financiamiento = sum_pagado_pago;
                    card_financiamiento_render = numero_punto_coma(card_financiamiento);

                    let aux_card_porcentaje = ((card_financiamiento / card_meta) * 100).toFixed(2);
                    card_porcentaje = Number(aux_card_porcentaje); // numerico con 2 decimales

                    card_porcentaje_render = numero_punto_coma(card_porcentaje); // string con coma decimal
                }

                if (datos_terreno.estado_terreno == "aprobacion") {
                    //card_meta = sum_reserva + sum_construccion;
                    card_meta = sum_construccion;
                    card_meta_render = numero_punto_coma(card_meta);

                    //card_financiamiento = sum_pagado_reserva + sum_pagado_pago;
                    card_financiamiento = sum_pagado_pago;
                    card_financiamiento_render = numero_punto_coma(card_financiamiento);

                    let aux_card_porcentaje = ((card_financiamiento / card_meta) * 100).toFixed(2);
                    card_porcentaje = Number(aux_card_porcentaje); // numerico con 2 decimales

                    card_porcentaje_render = numero_punto_coma(card_porcentaje); // string con coma decimal
                }

                if (datos_terreno.estado_terreno == "construccion") {
                    //card_meta = sum_reserva + sum_construccion;
                    card_meta = sum_construccion;
                    card_meta_render = numero_punto_coma(card_meta);

                    card_financiamiento = sum_pagado_mensuales;
                    card_financiamiento_render = numero_punto_coma(card_financiamiento);

                    var fecha_inicio = datos_terreno.fecha_inicio_construccion;
                    var fecha_fin = datos_terreno.fecha_fin_construccion;

                    var fecha_actual = new Date();

                    let string_card_porcentaje = (
                        (1 - (fecha_fin - fecha_actual) / (fecha_fin - fecha_inicio)) *
                        100
                    ).toFixed(2);

                    card_porcentaje = Number(string_card_porcentaje); // numerico con 2 decimales
                    card_porcentaje_render = numero_punto_coma(card_porcentaje); // string con coma decimal
                }

                if (datos_terreno.estado_terreno == "construido") {
                    card_financiamiento = sum_pagado_mensuales;
                    card_financiamiento_render = numero_punto_coma(card_financiamiento);
                    card_meta_render = card_financiamiento_render;
                    card_meta = card_financiamiento;

                    card_porcentaje = 100;
                    card_porcentaje_render = "100";
                }
            }
        }

        //---------------------------------------------------------------

        // card_meta, card_financiamiento los redondeamos a valores enteros sin decimales
        var resultados = {
            card_porcentaje,
            card_porcentaje_render,

            card_financiamiento: Number(card_financiamiento.toFixed(0)),
            card_financiamiento_render: numero_punto_coma(card_financiamiento.toFixed(0)),

            card_meta: Number(card_meta.toFixed(0)),
            card_meta_render: numero_punto_coma(card_meta.toFixed(0)),
        };

        //--------------- Verificacion ----------------
        //console.log('los resultados de CARDS');
        //console.log(resultados);
        //---------------------------------------------

        return resultados;
        
    } catch (error) {
        console.log(error);
    }
};

//-----------------------------------------------------------------------------

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = libreriaFunciones;
