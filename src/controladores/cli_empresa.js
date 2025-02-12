// CONTROLADORES PARA EL INMUEBLE DESDE EL LADO DEL CLIENTE PUBLICO

const {
    indiceEmpresa,
    indiceImagenesEmpresa_sf,
    indiceDocumentos,
} = require("../modelos/indicemodelo");

const controladorCliEmpresa = {};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA RENDERIZAR LA VENTANA DE COMO FUNCIONA
// RUTA   "get"   '/empresa/como_funciona'
controladorCliEmpresa.comoFunciona = async (req, res) => {
    try {
        var info_funciona = {};

        info_funciona.encabezado_titulo = "Lo hacemos fácil para vos";
        info_funciona.encabezado_texto =
            "Ahora con SOLIDEXA, tendras al tu alcanze inmuebles a precio justo del mercado.";

        info_funciona.navegador_cliente = true;
        info_funciona.estilo_cabezera = "cabezera_estilo_empresa";

        //----------------------------------------------------

        // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
        info_funciona.es_ninguno = true;

        info_funciona.ordenador_externo = false; // porque no existen cards que ordenar

        info_funciona.inversor_autenticado = req.inversor_autenticado; // true o false
        // si es TRUE y solo si es true, entonces se mostrara su ci
        if (req.inversor_autenticado) {
            info_funciona.ci_propietario = req.user.ci_propietario;
        }

        var como_funciona = await indiceImagenesEmpresa_sf
            .find(
                { tipo_imagen: "funciona" },
                {
                    codigo_imagen: 1,
                    extension_imagen: 1,
                    texto_imagen: 1,
                    orden_imagen: 1,
                    titulo_imagen: 1,
                    url_video: 1,
                    video_funciona: 1,
                    url: 1,
                    _id: 0,
                }
            )
            .sort({ orden_imagen: 1 }); // ordenado por orden de imagen

        var lista_funciona = [];

        if (como_funciona.length > 0) {
            for (let i = 0; i < como_funciona.length; i++) {
                lista_funciona[i] = {
                    codigo_imagen: como_funciona[i].codigo_imagen,
                    extension_imagen: como_funciona[i].extension_imagen,
                    texto_imagen: como_funciona[i].texto_imagen,
                    orden_imagen: como_funciona[i].orden_imagen,
                    titulo_imagen: como_funciona[i].titulo_imagen,
                    url_video: como_funciona[i].url_video,
                    video_funciona: como_funciona[i].video_funciona, // true o false
                    url: como_funciona[i].url,
                    lista_documentos: [], // POR DEFECTO de inicio vacio para luego ser llenado
                };

                // codigo_terreno: esta el codigo de imagen de "como funciona"
                // en el orden: 1. manual, 2. modelo, 3. beneficio, 4. video

                var documentos_i_manual = await indiceDocumentos.find(
                    {
                        codigo_terreno: como_funciona[i].codigo_imagen,
                        clase_documento: "manual",
                    },
                    {
                        nombre_documento: 1, // pdf || word || excel
                        codigo_documento: 1,
                        clase_documento: 1, // manual || beneficio || modelo
                        url: 1,
                        _id: 0,
                    }
                );

                var documentos_i_modelo = await indiceDocumentos.find(
                    {
                        codigo_terreno: como_funciona[i].codigo_imagen,
                        clase_documento: "modelo",
                    },
                    {
                        nombre_documento: 1, // pdf || word || excel
                        codigo_documento: 1,
                        clase_documento: 1, // manual || beneficio || modelo
                        url: 1,
                        _id: 0,
                    }
                );

                var documentos_i_beneficio = await indiceDocumentos.find(
                    {
                        codigo_terreno: como_funciona[i].codigo_imagen,
                        clase_documento: "beneficio",
                    },
                    {
                        nombre_documento: 1, // pdf || word || excel
                        codigo_documento: 1,
                        clase_documento: 1, // manual || beneficio || modelo
                        url: 1,
                        _id: 0,
                    }
                );

                // unimos los array (si estan vacios no seran considerados por "concat")
                var documentos_i = documentos_i_manual.concat(
                    documentos_i_beneficio,
                    documentos_i_modelo
                );

                if (documentos_i.length > 0) {
                    var aux_documentos = [];
                    for (let j = 0; j < documentos_i.length; j++) {
                        // ----------------------------------------------------
                        if (documentos_i[j].nombre_documento == "pdf") {
                            var extension = "pdf";
                        }
                        if (documentos_i[j].nombre_documento == "word") {
                            var extension = "docx";
                        }
                        if (documentos_i[j].nombre_documento == "excel") {
                            var extension = "xlsx";
                        }
                        // ----------------------------------------------------
                        if (documentos_i[j].clase_documento == "manual") {
                            var tipo_documento = "Manual";
                            var color = "primary";
                        }
                        if (documentos_i[j].clase_documento == "beneficio") {
                            var tipo_documento = "Beneficios";
                            var color = "info";
                        }
                        if (documentos_i[j].clase_documento == "modelo") {
                            var tipo_documento = "Modelo";
                            var color = "success";
                        }
                        // ----------------------------------------------------
                        aux_documentos[j] = {
                            codigo_documento: documentos_i[j].codigo_documento,
                            tipo_documento, // Manual || Beneficios || Modelo
                            color, // primary || info || success
                            extension, // pdf || docx || xlsx
                            //tipo_archivo, // pdf || word || excel (para bootstrap)
                            tipo_archivo: documentos_i[j].nombre_documento, // pdf || word || excel (para bootstrap)
                            url: documentos_i[j].url,
                        };
                    }

                    lista_funciona[i].lista_documentos = aux_documentos;
                }
            }
            info_funciona.lista_funciona = lista_funciona;
            // ------- Para verificación -------
            //console.log("los datos de COMO FUNCIONA");
            //console.log(info_funciona);

            res.render("cli_funciona", info_funciona);
        } else {
            // ------- Para verificación -------
            //console.log("los datos de COMO FUNCIONA");
            //console.log(info_funciona);
            // de todas maneras renderiza la ventana (para que asi no se quede colgado cargando), pero renderizara una ventana con campos vacios, porque "info_funciona" esta vacio
            res.render("cli_funciona", info_funciona);
        }
    } catch (error) {
        console.log(error);
    }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA RENDERIZAR LA VENTANA DE QUIENES SOMOS
// RUTA   "get"   '/empresa/quienes_somos'
controladorCliEmpresa.quienesSomos = async (req, res) => {
    try {
        var info_somos = {};

        info_somos.encabezado_titulo = "Quienes somos?";
        info_somos.encabezado_texto = "Democratizando el mercado inmobiliario";

        // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
        info_somos.es_ninguno = true;

        info_somos.navegador_cliente = true;
        info_somos.ordenador_externo = false; // porque no existen cards que ordenar
        info_somos.estilo_cabezera = "cabezera_estilo_empresa";

        //----------------------------------------------------

        info_somos.inversor_autenticado = req.inversor_autenticado; // true o false
        // si es TRUE y solo si es true, entonces se mostrara su ci
        if (req.inversor_autenticado) {
            info_somos.ci_propietario = req.user.ci_propietario;
        }

        var quienes_somos = await indiceImagenesEmpresa_sf
            .find(
                { tipo_imagen: "somos" },
                {
                    codigo_imagen: 1,
                    extension_imagen: 1,
                    texto_imagen: 1,
                    orden_imagen: 1,
                    titulo_imagen: 1,
                    url: 1,
                    _id: 0,
                }
            )
            .sort({ orden_imagen: 1 }); // ordenado por orden de imagen

        var lista_somos = [];

        if (quienes_somos.length > 0) {
            for (let i = 0; i < quienes_somos.length; i++) {
                if (quienes_somos[i].orden_imagen % 2 == 0) {
                    // si "i" es divisible por 2 (que da igual a 0) entonces es par
                    lista_somos[i] = {
                        somos_par: true,
                        somos_impar: false,
                        somos_par_impar: "somos_par",
                        contenedor_somos: "contenedor_somos_par",
                        codigo_imagen: quienes_somos[i].codigo_imagen,
                        extension_imagen: quienes_somos[i].extension_imagen,
                        texto_imagen: quienes_somos[i].texto_imagen,
                        orden_imagen: quienes_somos[i].orden_imagen,
                        titulo_imagen: quienes_somos[i].titulo_imagen,
                        url: quienes_somos[i].url,
                    };
                } else {
                    lista_somos[i] = {
                        somos_par: false,
                        somos_impar: true,
                        somos_par_impar: "somos_impar",
                        contenedor_somos: "contenedor_somos_impar",
                        codigo_imagen: quienes_somos[i].codigo_imagen,
                        extension_imagen: quienes_somos[i].extension_imagen,
                        texto_imagen: quienes_somos[i].texto_imagen,
                        orden_imagen: quienes_somos[i].orden_imagen,
                        titulo_imagen: quienes_somos[i].titulo_imagen,
                        url: quienes_somos[i].url,
                    };
                }
            }

            info_somos.lista_somos = lista_somos;

            // ------- Para verificación -------
            //console.log("los datos de QUIENES SOMOS");
            //console.log(info_somos);

            res.render("cli_somos", info_somos);
        } else {
            // de todas maneras renderiza la ventana (para que asi no se quede colgado cargando), pero renderizara una ventana con campos vacios, porque "info_funciona" esta vacio
            res.render("cli_somos", info_somos);
        }
    } catch (error) {
        console.log(error);
    }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA RENDERIZAR LA VENTANA DE PREGUNTAS FRECUENTES
// RUTA   "get"   '/empresa/preguntas_frecuentes'
controladorCliEmpresa.preguntasFrecuentes = async (req, res) => {
    try {
        var info_preguntas = {};

        info_preguntas.navegador_cliente = true;
        info_preguntas.estilo_cabezera = "cabezera_estilo_empresa";

        //----------------------------------------------------

        info_preguntas.inversor_autenticado = req.inversor_autenticado; // FALSE O TRUE,
        // si es TRUE y solo si es true, entonces se mostrara su ci
        if (req.inversor_autenticado) {
            info_preguntas.ci_propietario = req.user.ci_propietario;
        }

        // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
        info_preguntas.es_ninguno = true;

        info_preguntas.ordenador_externo = false; // porque no existen cards que ordenar

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                preguntas_frecuentes: 1,
                _id: 0,
            }
        );
        if (registro_empresa) {
            info_preguntas.encabezado_titulo = "Aclara tus dudas";
            info_preguntas.encabezado_texto = "Simple, sencillo y eficiente";
        }

        if (registro_empresa) {
            var lista_preguntas = [];

            for (let i = 0; i < registro_empresa.preguntas_frecuentes.length; i++) {
                var almohadilla = "#almohadilla" + (i + 1);
                var identificador = "almohadilla" + (i + 1);
                lista_preguntas[i] = {
                    pregunta: i + 1 + ". " + registro_empresa.preguntas_frecuentes[i].pregunta,
                    respuesta: registro_empresa.preguntas_frecuentes[i].respuesta,

                    almohadilla,
                    identificador,
                };
            }

            info_preguntas.lista_preguntas = lista_preguntas;

            // ------- Para verificación -------
            //console.log("los datos de PREGUNTAS FRECUENTES");
            //console.log(info_preguntas);

            res.render("cli_preguntas", info_preguntas);
        } else {
            // de todas maneras renderiza la ventana (para que asi no se quede colgado cargando), pero renderizara una ventana con campos vacios, porque "info_funciona" esta vacio
            res.render("cli_preguntas", info_preguntas);
        }
    } catch (error) {
        console.log(error);
    }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA RENDERIZAR LA VENTANA DE PREGUNTAS FRECUENTES
// RUTA   "post"   '/empresa/operacion/tipo_cambio'
controladorCliEmpresa.tipo_cambio = async (req, res) => {
    try {
        // ------- Para verificación -------

        var tipoCambio = 7; // por defecto

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                tc_ine: 1,
                _id: 0,
            }
        );
        if (registro_empresa.tc_ine) {
            tipoCambio = registro_empresa.tc_ine; // tipo de cambio oficial del pais
        }

        //res.json(tipoCambio); // NO ES CORRECTO

        // Devuelve un JSON válido. DESDE EL LADO DEL SERVIDOR SIEMPRE SE DEBEN DEVOLVER A AJAX UN JSON VALIDO
        res.json({ tipoCambio }); // ES CORRECTO ENCERRARLO EN {}
    } catch (error) {
        console.log(error);
    }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = controladorCliEmpresa;
