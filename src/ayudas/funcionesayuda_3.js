const {
    indiceProyecto,
    indiceInmueble,
    indiceTerreno,
    indiceFraccionTerreno,
    indiceFraccionInmueble,
} = require("../modelos/indicemodelo");

const moment = require("moment");

const funcionesAyuda_3 = {};

/************************************************************************************ */

//funcionesAyuda_3.numero_punto_coma = async function (numero) {
// NOTESE QUE EST FUNCION NO USA EL "ASYNC", POR TANTO AL DECLARAR ESTA FUNCION DESDE OTRO SITIO, NO SERA NECESARIO PONER POR DELANTE EL "AWAIT"
funcionesAyuda_3.numero_punto_coma = function (numero) {
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
};

/*************************************************************************************/
//IMPORTANTE: PARA NO PERMITIR EL ACCESO A:TERRENOS, PROYECTOS, INMUEBLES O FRACCIONES INEXISTENTES O QUE NO ESTAN DISPONIBLES PARA SER VISIBLES POR EL USUARIO. USADO POR EL LADO DEL CLIENTE.
funcionesAyuda_3.verificarTePyInmFracc = async function (paqueteria_datos) {
    try {
        var codigo_objetivo = paqueteria_datos.codigo_objetivo;
        var tipo = paqueteria_datos.tipo;

        var la_verificacion = false; // sera por defecto, pero sera corregida a true si cumple con las condiciones de verificacion

        if (tipo == "terreno") {
            var terrenoExiste = await indiceTerreno.findOne(
                { codigo_terreno: codigo_objetivo },
                {
                    estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                    _id: 0,
                }
            );

            if (terrenoExiste) {
                if (terrenoExiste.estado_terreno != "guardado") {
                    la_verificacion = true;
                }
            }
        }

        //---------------------------------------------------------------------

        if (tipo == "proyecto") {
            var proyectoExiste = await indiceProyecto.findOne(
                { codigo_proyecto: codigo_objetivo },
                {
                    visible: 1, // true o false
                    estado_proyecto: 1, // guardado o completado
                    codigo_terreno: 1,
                    _id: 0,
                }
            );
            if (proyectoExiste) {
                var terrenoExiste = await indiceTerreno.findOne(
                    { codigo_terreno: proyectoExiste.codigo_terreno },
                    {
                        estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                        _id: 0,
                    }
                );

                if (terrenoExiste) {
                    if (
                        proyectoExiste.visible == true &&
                        proyectoExiste.estado_proyecto == "completado" &&
                        terrenoExiste.estado_terreno != "guardado"
                    ) {
                        la_verificacion = true;
                    }
                }
            }
        }

        //---------------------------------------------------------------------

        if (tipo == "inmueble") {
            var inmuebleExiste = await indiceInmueble.findOne(
                { codigo_inmueble: codigo_objetivo },
                {
                    codigo_proyecto: 1,

                    // guardado, disponible, reservado, pagos (construccion), remate, completado (construido)
                    estado_inmueble: 1,
                    _id: 0,
                }
            );

            if (inmuebleExiste) {
                var proyectoExiste = await indiceProyecto.findOne(
                    { codigo_proyecto: inmuebleExiste.codigo_proyecto },
                    {
                        visible: 1, // true o false
                        estado_proyecto: 1, // guardado o completado
                        codigo_terreno: 1,
                        _id: 0,
                    }
                );
                if (proyectoExiste) {
                    var terrenoExiste = await indiceTerreno.findOne(
                        { codigo_terreno: proyectoExiste.codigo_terreno },
                        {
                            estado_terreno: 1, // guardado, reserva, pago, aprobacion, construccion, construido
                            _id: 0,
                        }
                    );

                    if (terrenoExiste) {
                        if (
                            inmuebleExiste.estado_inmueble != "guardado" &&
                            proyectoExiste.visible == true &&
                            proyectoExiste.estado_proyecto == "completado" &&
                            terrenoExiste.estado_terreno != "guardado"
                        ) {
                            la_verificacion = true;
                        }
                    }
                }
            }
        }

        //---------------------------------------------------------------------

        if (tipo == "fraccion") {
            var fraccionTeExiste = await indiceFraccionTerreno.findOne(
                { codigo_fraccion: codigo_objetivo },
                {
                    disponible: 1, // true o false
                    _id: 0,
                }
            );

            if (fraccionTeExiste) {
                la_verificacion = true;
            } else {
                // entonces puede tratarse de una fraccion inmueble
                var fraccionInmExiste = await indiceFraccionInmueble.findOne(
                    { codigo_fraccion: codigo_objetivo },
                    {
                        disponible: 1, // true o false
                        _id: 0,
                    }
                );

                if (fraccionInmExiste) {
                    la_verificacion = true;
                }
            }
        }

        //---------------------------------------------------------------------

        return la_verificacion; // true o false
    } catch (error) {
        console.log(error);
    }
};

/*************************************************************************************/
// PRECIOS PRONOSTICO TERRENO $us/m2
// ACTUALIZAR ACORDE AL MERCADO
// EXTRAIDO DE LA HOJA EXCEL "PronosticoPrecioTerreno" , columna: corregido $us/m2. Es en esta hoja donde se encuentra los valores pronosticados REALISTAS de $us/m2 (no consideramos los pronosticos obtenidos segun el %de crecimiento que sugiren sitios como ultracasas)
funcionesAyuda_3.terreno_pronostico = function () {
    var array_sus_m2 = [
        779, 793.5, 808, 809.5, 811, 822, 823, 795, 801, 824, 869, 820, 836.4, 853.13, 870.19, 872,
        880.8, 876.14, 889.49, 884.73, 898.17, 893.33, 906.86, 901.93, 915.55, 910.53, 924.23,
        919.12, 932.92, 927.72, 941.6, 936.32, 950.29, 944.92, 958.98, 953.51, 967.66, 962.11,
        976.35, 970.71, 985.03, 979.31, 993.72, 987.9, 1002.4, 996.5, 1011.09, 1005.1, 1019.78,
        1013.69, 1028.46, 1022.29, 1037.15, 1030.89, 1045.83, 1039.49, 1054.52, 1048.08, 1063.2,
        1056.68, 1071.89, 1065.28, 1080.58, 1073.88, 1089.26, 1082.47, 1097.95, 1091.07, 1106.63,
        1099.67, 1115.32, 1108.27, 1124.01, 1116.86, 1132.69, 1125.46, 1141.38, 1134.06, 1150.06,
        1142.66, 1158.75, 1151.25, 1167.43, 1159.85, 1176.12, 1168.45, 1184.81, 1177.04, 1193.49,
        1185.64, 1202.18, 1194.24, 1210.86, 1202.84, 1219.55, 1211.43, 1228.23, 1220.03, 1236.92,
        1228.63, 1245.61, 1237.23, 1254.29, 1245.82, 1262.98, 1254.42, 1271.66, 1263.02, 1280.35,
        1271.62, 1289.03, 1280.21, 1297.72, 1288.81, 1306.41, 1297.41, 1315.09, 1306.01, 1323.78,
        1314.6, 1332.46, 1323.2, 1341.15, 1331.8, 1349.84, 1340.39, 1358.52, 1348.99, 1367.21,
        1357.59, 1375.89, 1366.19, 1384.58, 1374.78, 1393.26, 1383.38, 1401.95, 1391.98, 1410.64,
        1400.58, 1419.32, 1409.17, 1428.01, 1417.77, 1436.69, 1426.37, 1445.38, 1434.97, 1454.06,
        1443.56, 1462.75, 1452.16, 1471.44, 1460.76, 1480.12, 1469.36, 1488.81, 1477.95, 1497.49,
        1486.55, 1506.18, 1495.15, 1514.87, 1503.74, 1523.55, 1512.34, 1532.24, 1520.94, 1540.92,
        1529.54,
    ];

    var array_periodo = [
        "2016 - I",
        "2016 - II",
        "2017 - I",
        "2017 - II",
        "2018 - I",
        "2018 - II",
        "2019 - I",
        "2019 - II",
        "2020 - I",
        "2020 - II",
        "2021 - I",
        "2021 - II",
        "2022 - I",
        "2022 - II",
        "2023 - I",
        "2023 - II",
        "2024 - I",
        "2024 - II",
        "2025 - I",
        "2025 - II",
        "2026 - I",
        "2026 - II",
        "2027 - I",
        "2027 - II",
        "2028 - I",
        "2028 - II",
        "2029 - I",
        "2029 - II",
        "2030 - I",
        "2030 - II",
        "2031 - I",
        "2031 - II",
        "2032 - I",
        "2032 - II",
        "2033 - I",
        "2033 - II",
        "2034 - I",
        "2034 - II",
        "2035 - I",
        "2035 - II",
        "2036 - I",
        "2036 - II",
        "2037 - I",
        "2037 - II",
        "2038 - I",
        "2038 - II",
        "2039 - I",
        "2039 - II",
        "2040 - I",
        "2040 - II",
        "2041 - I",
        "2041 - II",
        "2042 - I",
        "2042 - II",
        "2043 - I",
        "2043 - II",
        "2044 - I",
        "2044 - II",
        "2045 - I",
        "2045 - II",
        "2046 - I",
        "2046 - II",
        "2047 - I",
        "2047 - II",
        "2048 - I",
        "2048 - II",
        "2049 - I",
        "2049 - II",
        "2050 - I",
        "2050 - II",
        "2051 - I",
        "2051 - II",
        "2052 - I",
        "2052 - II",
        "2053 - I",
        "2053 - II",
        "2054 - I",
        "2054 - II",
        "2055 - I",
        "2055 - II",
        "2056 - I",
        "2056 - II",
        "2057 - I",
        "2057 - II",
        "2058 - I",
        "2058 - II",
        "2059 - I",
        "2059 - II",
        "2060 - I",
        "2060 - II",
        "2061 - I",
        "2061 - II",
        "2062 - I",
        "2062 - II",
        "2063 - I",
        "2063 - II",
        "2064 - I",
        "2064 - II",
        "2065 - I",
        "2065 - II",
        "2066 - I",
        "2066 - II",
        "2067 - I",
        "2067 - II",
        "2068 - I",
        "2068 - II",
        "2069 - I",
        "2069 - II",
        "2070 - I",
        "2070 - II",
        "2071 - I",
        "2071 - II",
        "2072 - I",
        "2072 - II",
        "2073 - I",
        "2073 - II",
        "2074 - I",
        "2074 - II",
        "2075 - I",
        "2075 - II",
        "2076 - I",
        "2076 - II",
        "2077 - I",
        "2077 - II",
        "2078 - I",
        "2078 - II",
        "2079 - I",
        "2079 - II",
        "2080 - I",
        "2080 - II",
        "2081 - I",
        "2081 - II",
        "2082 - I",
        "2082 - II",
        "2083 - I",
        "2083 - II",
        "2084 - I",
        "2084 - II",
        "2085 - I",
        "2085 - II",
        "2086 - I",
        "2086 - II",
        "2087 - I",
        "2087 - II",
        "2088 - I",
        "2088 - II",
        "2089 - I",
        "2089 - II",
        "2090 - I",
        "2090 - II",
        "2091 - I",
        "2091 - II",
        "2092 - I",
        "2092 - II",
        "2093 - I",
        "2093 - II",
        "2094 - I",
        "2094 - II",
        "2095 - I",
        "2095 - II",
        "2096 - I",
        "2096 - II",
        "2097 - I",
        "2097 - II",
        "2098 - I",
        "2098 - II",
        "2099 - I",
        "2099 - II",
        "2100 - I",
        "2100 - II",
    ];

    var array_hist_sus_m2 = {
        array_sus_m2,
        array_periodo,
    };

    return array_hist_sus_m2;
};

/*************************************************************************************/
// PRECIOS PRONOSTICO INMUEBLE $us/m2
// ACTUALIZAR ACORDE AL MERCADO
// EXTRAIDO DE LA HOJA EXCEL
funcionesAyuda_3.inmueble_pronostico = function () {
    var array_sus_m2 = [
        779, 793.5, 808, 809.5, 811, 822, 823, 795, 801, 824, 869, 820, 836.4, 853.13, 870.19, 872,
        880.8, 876.14, 889.49, 884.73, 898.17, 893.33, 906.86, 901.93, 915.55, 910.53, 924.23,
        919.12, 932.92, 927.72, 941.6, 936.32, 950.29, 944.92, 958.98, 953.51, 967.66, 962.11,
        976.35, 970.71, 985.03, 979.31, 993.72, 987.9, 1002.4, 996.5, 1011.09, 1005.1, 1019.78,
        1013.69, 1028.46, 1022.29, 1037.15, 1030.89, 1045.83, 1039.49, 1054.52, 1048.08, 1063.2,
        1056.68, 1071.89, 1065.28, 1080.58, 1073.88, 1089.26, 1082.47, 1097.95, 1091.07, 1106.63,
        1099.67, 1115.32, 1108.27, 1124.01, 1116.86, 1132.69, 1125.46, 1141.38, 1134.06, 1150.06,
        1142.66, 1158.75, 1151.25, 1167.43, 1159.85, 1176.12, 1168.45, 1184.81, 1177.04, 1193.49,
        1185.64, 1202.18, 1194.24, 1210.86, 1202.84, 1219.55, 1211.43, 1228.23, 1220.03, 1236.92,
        1228.63, 1245.61, 1237.23, 1254.29, 1245.82, 1262.98, 1254.42, 1271.66, 1263.02, 1280.35,
        1271.62, 1289.03, 1280.21, 1297.72, 1288.81, 1306.41, 1297.41, 1315.09, 1306.01, 1323.78,
        1314.6, 1332.46, 1323.2, 1341.15, 1331.8, 1349.84, 1340.39, 1358.52, 1348.99, 1367.21,
        1357.59, 1375.89, 1366.19, 1384.58, 1374.78, 1393.26, 1383.38, 1401.95, 1391.98, 1410.64,
        1400.58, 1419.32, 1409.17, 1428.01, 1417.77, 1436.69, 1426.37, 1445.38, 1434.97, 1454.06,
        1443.56, 1462.75, 1452.16, 1471.44, 1460.76, 1480.12, 1469.36, 1488.81, 1477.95, 1497.49,
        1486.55, 1506.18, 1495.15, 1514.87, 1503.74, 1523.55, 1512.34, 1532.24, 1520.94, 1540.92,
        1529.54,
    ];

    var array_periodo = [
        "2016 - I",
        "2016 - II",
        "2017 - I",
        "2017 - II",
        "2018 - I",
        "2018 - II",
        "2019 - I",
        "2019 - II",
        "2020 - I",
        "2020 - II",
        "2021 - I",
        "2021 - II",
        "2022 - I",
        "2022 - II",
        "2023 - I",
        "2023 - II",
        "2024 - I",
        "2024 - II",
        "2025 - I",
        "2025 - II",
        "2026 - I",
        "2026 - II",
        "2027 - I",
        "2027 - II",
        "2028 - I",
        "2028 - II",
        "2029 - I",
        "2029 - II",
        "2030 - I",
        "2030 - II",
        "2031 - I",
        "2031 - II",
        "2032 - I",
        "2032 - II",
        "2033 - I",
        "2033 - II",
        "2034 - I",
        "2034 - II",
        "2035 - I",
        "2035 - II",
        "2036 - I",
        "2036 - II",
        "2037 - I",
        "2037 - II",
        "2038 - I",
        "2038 - II",
        "2039 - I",
        "2039 - II",
        "2040 - I",
        "2040 - II",
        "2041 - I",
        "2041 - II",
        "2042 - I",
        "2042 - II",
        "2043 - I",
        "2043 - II",
        "2044 - I",
        "2044 - II",
        "2045 - I",
        "2045 - II",
        "2046 - I",
        "2046 - II",
        "2047 - I",
        "2047 - II",
        "2048 - I",
        "2048 - II",
        "2049 - I",
        "2049 - II",
        "2050 - I",
        "2050 - II",
        "2051 - I",
        "2051 - II",
        "2052 - I",
        "2052 - II",
        "2053 - I",
        "2053 - II",
        "2054 - I",
        "2054 - II",
        "2055 - I",
        "2055 - II",
        "2056 - I",
        "2056 - II",
        "2057 - I",
        "2057 - II",
        "2058 - I",
        "2058 - II",
        "2059 - I",
        "2059 - II",
        "2060 - I",
        "2060 - II",
        "2061 - I",
        "2061 - II",
        "2062 - I",
        "2062 - II",
        "2063 - I",
        "2063 - II",
        "2064 - I",
        "2064 - II",
        "2065 - I",
        "2065 - II",
        "2066 - I",
        "2066 - II",
        "2067 - I",
        "2067 - II",
        "2068 - I",
        "2068 - II",
        "2069 - I",
        "2069 - II",
        "2070 - I",
        "2070 - II",
        "2071 - I",
        "2071 - II",
        "2072 - I",
        "2072 - II",
        "2073 - I",
        "2073 - II",
        "2074 - I",
        "2074 - II",
        "2075 - I",
        "2075 - II",
        "2076 - I",
        "2076 - II",
        "2077 - I",
        "2077 - II",
        "2078 - I",
        "2078 - II",
        "2079 - I",
        "2079 - II",
        "2080 - I",
        "2080 - II",
        "2081 - I",
        "2081 - II",
        "2082 - I",
        "2082 - II",
        "2083 - I",
        "2083 - II",
        "2084 - I",
        "2084 - II",
        "2085 - I",
        "2085 - II",
        "2086 - I",
        "2086 - II",
        "2087 - I",
        "2087 - II",
        "2088 - I",
        "2088 - II",
        "2089 - I",
        "2089 - II",
        "2090 - I",
        "2090 - II",
        "2091 - I",
        "2091 - II",
        "2092 - I",
        "2092 - II",
        "2093 - I",
        "2093 - II",
        "2094 - I",
        "2094 - II",
        "2095 - I",
        "2095 - II",
        "2096 - I",
        "2096 - II",
        "2097 - I",
        "2097 - II",
        "2098 - I",
        "2098 - II",
        "2099 - I",
        "2099 - II",
        "2100 - I",
        "2100 - II",
    ];

    var array_hist_sus_m2 = {
        array_sus_m2,
        array_periodo,
    };

    return array_hist_sus_m2;
};

/*************************************************************************************/

module.exports = funcionesAyuda_3;
