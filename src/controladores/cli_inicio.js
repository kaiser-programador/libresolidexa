// CONTROLADOR PARA INICIO DEL LADO DEL CLIENTE

const {
    indiceInmueble,
    indiceProyecto,
    indiceTerreno,
    indiceEmpresa,
    indiceRequerimientos,
} = require("../modelos/indicemodelo");

const { cards_inicio_cli_adm } = require("../ayudas/funcionesayuda_0");

const { inmueble_card_adm_cli, terreno_card_adm_cli } = require("../ayudas/funcionesayuda_1");

const moment = require("moment");

const controladorClienteInicio = {};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

controladorClienteInicio.inicioCliente = async (req, res) => {
    // ruta GET "/"

    try {
        // ------- Para verificación -------
        //console.log("ESTAMOS EN LA VENTANA DE INICIO DEL LADO DEL CLIENTE OK");

        // ------- Para verificación -------
        //console.log("TIPO NAVEGACION");
        //console.log(req.tipo_navegacion);

        /*
        // ------- Para verificación -------
        console.log("DATOS del cliente ingreso");
        console.log(req.user);
        console.log("el id del cliente ingreso");
        console.log(req.user.id);
        console.log("el CI del cliente ingreso");
        console.log(req.user.ci_administrador);
        */

        // ---------------------------------------------------------------
        // para las url de imagen inicio del sistema horizontal y vertical

        var url_inicio_h = "/rutavirtualpublico/imagenes/imagenes_sistema/inicio_horizontal.jpg";
        var url_inicio_v = "/rutavirtualpublico/imagenes/imagenes_sistema/inicio_vertical.jpg";

        // ---------------------------------------------------------------

        var registro_empresa = await indiceEmpresa.findOne(
            {},
            {
                texto_inicio_principal: 1,
                n_construidos: 1,
                n_proyectos: 1,
                n_inmuebles: 1,
                n_empleos: 1,
                n_ahorros: 1,
                n_resp_social: 1,
                _id: 0,
            }
        );

        if (registro_empresa) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_empresa);

            // reconversion del "string" a "objeto"
            var datos_empresa = JSON.parse(aux_string);

            //----------------------------------------
            // agregando valores render con punto mil
            datos_empresa.r_construidos = numero_punto_coma(n_construidos);
            datos_empresa.r_proyectos = numero_punto_coma(n_proyectos);
            datos_empresa.r_inmuebles = numero_punto_coma(n_inmuebles);
            datos_empresa.r_empleos = numero_punto_coma(n_empleos);
            datos_empresa.r_ahorros = numero_punto_coma(n_ahorros);
            datos_empresa.r_resp_social = numero_punto_coma(n_resp_social);
            //----------------------------------------

            /*
            // ------- Para verificación -------
            console.log("VEMOS SI EL CLIENTE ES VALIDADO");
            console.log(req.inversor_autenticado); // puede dar:false o true
            console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");
            */

            datos_empresa.inversor_autenticado = req.inversor_autenticado;
            // si es TRUE y solo si es true, entonces se mostrara su ci
            if (req.inversor_autenticado) {
                datos_empresa.ci_propietario = req.user.ci_propietario;
            }

            // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
            datos_empresa.es_ninguno = true;

            datos_empresa.navegador_cliente = true;

            datos_empresa.url_inicio_h = url_inicio_h;
            datos_empresa.url_inicio_v = url_inicio_v;

            res.render("cli_inicio", datos_empresa); //increible que borrandolo FUNCIONE
        } else {
            var datos_empresa = {}; // lo enviamos como objeto vacio

            /*
            // ------- Para verificación -------
            console.log("VEMOS SI EL CLIENTE ES VALIDADO");
            console.log(req.inversor_autenticado); // puede dar:false o true
            console.log("VEMOS SI EL CLIENTE ES VALIDADO finnnnn");
            */

            datos_empresa.inversor_autenticado = req.inversor_autenticado;
            // si es TRUE y solo si es true, entonces se mostrara su ci
            if (req.inversor_autenticado) {
                datos_empresa.ci_propietario = req.user.ci_propietario;
            }

            // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
            datos_empresa.es_ninguno = true;

            datos_empresa.navegador_cliente = true;

            datos_empresa.url_inicio_h = url_inicio_h;
            datos_empresa.url_inicio_v = url_inicio_v;

            res.render("cli_inicio", datos_empresa); //increible que borrandolo FUNCIONE
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA LA BUSQUEDA DE INMUEBLES DESDE EL BUSCADOR PRINCIPAL LADO DEL CLIENTE

controladorClienteInicio.buscarInmueble = async (req, res) => {
    // RUTA POST  "/inmuebles/resultados"
    // "POST" porque se estan enviando datos del formulario para que sean leidos del lado del servidor

    try {
        // ------- Para verificación -------
        //console.log("los datos del formulario:");
        //console.log(req.body);

        let ciudad_busqueda = req.body.name_ciudad_busq;

        let tipo_busqueda = req.body.name_radio_inm_busq;

        // ------- Para verificación -------
        //console.log("EL RADIO ELEGIDO");
        //console.log(tipo_busqueda);

        var aux_palabras_clave = req.body.html_palabras_busq;
        var palabras_clave = aux_palabras_clave.toLowerCase(); // TODO A minuscula

        let html_tipo_inmueble = req.body.html_tipo_inmueble; // en caso de que sea mas de uno, sera un ARRAY
        let html_input_superficie = req.body.html_input_superficie;
        let html_numero_banos = req.body.html_numero_banos;
        let html_numero_habitaciones = req.body.html_numero_habitaciones;
        let name_garaje_busq = req.body.name_garaje_busq;

        var k_posicion = -1;
        var inmuebles_renderizar = []; // contendra a los inmuebles que cumplen con las condiciones de la busqueda
        moment.locale("es");

        // req.inversor_autenticado PUEDE DAR: FALSE O TRUE
        var inversor_autenticado = req.inversor_autenticado;

        var resultado_renderizar = {
            navegador_cliente: true,
            inversor_autenticado,
            tipo_resultado_inmuebles: true, // para si mostrar el formato de resultados de inmuebles
            tipo_resultado_requerimientos: false, // para no mostrar el formato de resultados de requerimientos
            tipo_resultado_fracciones_terreno: false, // para no mostrar el formato de resultados de proyectos
        };
        resultado_renderizar.ordenador_externo = true; // porque SI existen cards que ordenar
        resultado_renderizar.encabezado_titulo = "Resultado inmuebles";
        if (tipo_busqueda == "disponible") {
            resultado_renderizar.es_disponible = true;
            resultado_renderizar.encabezado_texto = "Disponibles";
        }

        if (tipo_busqueda == "remate") {
            resultado_renderizar.es_remate = true;
            resultado_renderizar.encabezado_texto = "En Remates";
        }

        if (tipo_busqueda == "fraccion") {
            resultado_renderizar.es_fraccion = true;
            resultado_renderizar.encabezado_texto = "Fracciones";
        }

        resultado_renderizar.estilo_cabezera = "cabezera_estilo_resultados";

        //----------------------------------------------------

        // si es TRUE y solo si es true, entonces se mostrara su ci
        if (req.inversor_autenticado) {
            resultado_renderizar.ci_propietario = req.user.ci_propietario;
        }

        //resultado_renderizar.pie_empresa = pie_empresa;

        // ------- Para verificación -------
        //console.log("lo que inicialmente se mostrara");
        //console.log(resultado_renderizar);

        // *****++-+*+-**/-
        // SE BUSCARA SEGUN EL ESTADO DEL INMUEBLE (aquellos que son de interes solo para que el futuro dueño pague con dinero):
        // disponible, pendiente, remate

        // EN TODAS LAS OPCIONES DE BUSQUEDA ESTARA DISPONIBLE EL FILTRO DE PRECIO DE COMPRA DEL INMUEBLE PARA LOS FUTUROS DUEÑOS INTEREZADOS

        if (tipo_busqueda == "disponible") {
            // precio deseado del inmueble
            var precio_requerido = req.body.html_input_precio_disponible_busq;

            // inmuebles del tipo ENTERO que esten DISPONIBLES para ser reservados (se reservan pagando el derecho de suelo)
            var inmuebles_buscar = await indiceInmueble.find(
                { estado_inmueble: "disponible", fraccionado: false },
                {
                    codigo_inmueble: 1,
                    codigo_terreno: 1,
                    codigo_proyecto: 1,
                    _id: 0,
                }
            );
        }

        if (tipo_busqueda == "remate") {
            // precio deseado del inmueble
            var precio_requerido = req.body.html_input_precio_remate_busq;

            // inmuebles del tipo ENTERO que esten en REMATE para ser ADQUIRIDOS
            var inmuebles_buscar = await indiceInmueble.find(
                { estado_inmueble: "remate", fraccionado: false },
                {
                    codigo_inmueble: 1,
                    codigo_terreno: 1,
                    codigo_proyecto: 1,
                    _id: 0,
                }
            );
        }

        if (tipo_busqueda == "fraccion") {
            // precio deseado del inmueble
            var precio_requerido = req.body.html_input_precio_fraccion_busq;

            // inmuebles del tipo FRACCIONADO que tienen fracciones de inmuebles DISPONIBLES
            var inmuebles_buscar = await indiceInmueble.find(
                { estado_inmueble: "disponible", fraccionado: true },
                {
                    codigo_inmueble: 1,
                    codigo_terreno: 1,
                    codigo_proyecto: 1,
                    _id: 0,
                }
            );
        }

        if (inmuebles_buscar.length > 0) {
            for (let i = 0; i < inmuebles_buscar.length; i++) {
                let codigo_inmueble_i = inmuebles_buscar[i].codigo_inmueble;
                let codigo_proyecto_i = inmuebles_buscar[i].codigo_proyecto;
                let codigo_terreno_i = inmuebles_buscar[i].codigo_terreno;

                // extraemos las caracteristicas necesarias de inmueble, terreno, proyecto para realizar la busqueda en esas caracteristicas

                var info_inmueble_i = await indiceInmueble.findOne(
                    {
                        codigo_inmueble: codigo_inmueble_i,
                    },
                    {
                        tipo_inmueble: 1,
                        superficie_inmueble_m2: 1,
                        dormitorios_inmueble: 1,
                        banos_inmueble: 1,
                        garaje_inmueble: 1,
                        varios_descripcion_1: 1,
                        varios_descripcion_2: 1,
                        varios_descripcion_3: 1,
                        varios_descripcion_4: 1,
                        varios_descripcion_5: 1,
                        _id: 0,
                    }
                );

                var info_proyecto_i = await indiceProyecto.findOne(
                    {
                        codigo_proyecto: codigo_proyecto_i,
                    },
                    {
                        nombre_proyecto: 1,
                        proyecto_descripcion: 1,
                        otros_1: 1,
                        otros_2: 1,
                        otros_3: 1,
                        acabados: 1,
                        _id: 0,
                    }
                );

                var info_terreno_i = await indiceTerreno.findOne(
                    {
                        codigo_terreno: codigo_terreno_i,
                    },
                    {
                        ciudad: 1,
                        provincia: 1,
                        direccion: 1,
                        ubi_otros_1: 1,
                        ubi_otros_2: 1,
                        ubi_otros_3: 1,
                        _id: 0,
                    }
                );

                //-----------------------------
                // condicionales por defecto
                var ok_ciudad = false;
                var ok_palabras = false;
                var ok_tipo_inmueble = false;
                var ok_superficie = false;
                var ok_banos = false;
                var ok_dormitorios = false;
                var ok_garaje = false;
                var ok_precio_requerido = false;
                //-----------------------------

                //-------------------------------------------------------------
                // revision si cumple con la ciudad

                if (ciudad_busqueda == "Todos") {
                    ok_ciudad = true;
                } else {
                    if (ciudad_busqueda == info_terreno_i.ciudad) {
                        ok_ciudad = true;
                    } else {
                        ok_ciudad = false;
                    }
                }

                //-------------------------------------------------------------
                // revision si cumple con las palabras clave de busqueda

                if (palabras_clave != "") {
                    let palabras_encontradas = 0; // asumimos por defecto

                    var aux_string_buscar =
                        codigo_inmueble_i +
                        " " +
                        info_inmueble_i.tipo_inmueble +
                        " " +
                        info_inmueble_i.superficie_inmueble_m2 +
                        " " +
                        info_inmueble_i.dormitorios_inmueble +
                        " " +
                        info_inmueble_i.banos_inmueble +
                        " " +
                        info_inmueble_i.garaje_inmueble +
                        " " +
                        info_inmueble_i.varios_descripcion_1 +
                        " " +
                        info_inmueble_i.varios_descripcion_2 +
                        " " +
                        info_inmueble_i.varios_descripcion_3 +
                        " " +
                        info_inmueble_i.varios_descripcion_4 +
                        " " +
                        info_inmueble_i.varios_descripcion_5 +
                        " " +
                        info_proyecto_i.nombre_proyecto +
                        " " +
                        info_proyecto_i.proyecto_descripcion +
                        " " +
                        info_proyecto_i.otros_1 +
                        " " +
                        info_proyecto_i.otros_2 +
                        " " +
                        info_proyecto_i.otros_3 +
                        " " +
                        info_proyecto_i.acabados +
                        " " +
                        info_terreno_i.ciudad +
                        " " +
                        info_terreno_i.provincia +
                        " " +
                        info_terreno_i.direccion +
                        " " +
                        info_terreno_i.ubi_otros_1 +
                        " " +
                        info_terreno_i.ubi_otros_2 +
                        " " +
                        info_terreno_i.ubi_otros_3;

                    var string_buscar = aux_string_buscar.toLowerCase(); // TODO A minuscula

                    let array_palabras_clave = palabras_clave.split(" ");
                    for (let n = 0; n < array_palabras_clave.length; n++) {
                        if (string_buscar.indexOf(array_palabras_clave[n]) != -1) {
                            palabras_encontradas = palabras_encontradas + 1;
                        }
                    }

                    if (palabras_encontradas == array_palabras_clave.length) {
                        ok_palabras = true;
                        // en caso de no cumplir la condicion, no es necesario poner "false", porque de inicio se definio "false" por defecto
                    }
                } else {
                    // si no existen palabras clave que buscar, se tomara como cumplido
                    ok_palabras = true;
                }

                // -------------------------------------------------------------
                // revision si cumple con los tipos de inmueble

                if (html_tipo_inmueble == null) {
                    // significa que ninguno esta seleccionado, por tanto se lo considerara como si todos estuvieran seleccionadas, por tanto todo inmueble es considerado encontrado en su "tipo"
                    var tipo_encontrado = 1;
                } else {
                    // vemos si no importa que sea un ARRAY o Un STRING, DE todas maneras lo convertimos a STRING
                    let aux_string_tipos = String(html_tipo_inmueble).toLowerCase();
                    // si fuera un ARRAY, el string separaria sus elementos con "," entonces para la busqueda reemplazaremos esa "," con espacios

                    // ------- Para verificación -------
                    //console.log("convirtiendolo a STRING");
                    //console.log(aux_string_tipos);

                    let string_tipos = aux_string_tipos.replace(",", " ");

                    // ------- Para verificación -------
                    //console.log("reemplazando la , por espacio");
                    //console.log(string_tipos);

                    var tipo_encontrado = string_tipos.indexOf(
                        info_inmueble_i.tipo_inmueble.toLowerCase()
                    );
                }

                if (tipo_encontrado != -1) {
                    ok_tipo_inmueble = true;
                }

                //-------------------------------------------------------------
                // revision si cumple con el tamaño de superficie
                // las superficies validas, san aquellas que son iguales o MAYORES que la superficie introducida en el input html
                if (
                    Number(info_inmueble_i.superficie_inmueble_m2) >= Number(html_input_superficie)
                ) {
                    ok_superficie = true;
                }

                //-------------------------------------------------------------
                // revision si cumple con el numero de baños
                if (Number(info_inmueble_i.banos_inmueble) >= Number(html_numero_banos)) {
                    ok_banos = true;
                }

                //-------------------------------------------------------------
                // revision si cumple con el numero de dormitorios
                if (
                    Number(info_inmueble_i.dormitorios_inmueble) >= Number(html_numero_habitaciones)
                ) {
                    ok_dormitorios = true;
                } else {
                    if (
                        ok_tipo_inmueble == true &&
                        info_inmueble_i.tipo_inmueble.toLowerCase() == "comercial"
                    ) {
                        ok_dormitorios = true;
                    }
                }

                //-------------------------------------------------------------
                // revision si cumple con el garaje
                if (name_garaje_busq) {
                    if (Number(info_inmueble_i.garaje_inmueble) > 0) {
                        ok_garaje = true;
                    }
                } else {
                    ok_garaje = true;
                }
                // EN CASO DE QUE GARAJE NO CUMPLA CON ESTAS CONDICIONANTES, NO ES NECESARIO PONERLE "FALSE", PORQUE YA VIENE ASI DEFINIDO LINEAS DE CODIGO ARRIBA
                //-------------------------------------------------------------
                // Revision si cumple con el precio de venta

                // si el cliente esta navegado con su cuenta
                if (req.inversor_autenticado) {
                    var cod_inversor = req.user.ci_propietario;
                } else {
                    // en caso de que este navegando sin haber accedido a su cuenta personal
                    var cod_inversor = "ninguno";
                }

                // paquete_inmueble = {codigo_inmueble,codigo_usuario}
                var paquete_inmueble_i = {
                    codigo_inmueble: codigo_inmueble_i,
                    codigo_usuario: cod_inversor,
                    laapirest: "/", // por partir desde el lado del CLIENTE
                };

                var inmueble_card_i = await inmueble_card_adm_cli(paquete_inmueble_i);

                inmueble_card_i.card_externo = true; // para que muestre info de card EXTERIONES

                if (tipo_busqueda == "remate") {
                    inmueble_card_i.factor_tiempo_tiempo = "En remate"; // (esto porque no deseamos que muestre el tiempo de FINALIZA ....)
                }

                if (tipo_busqueda == "fraccion") {
                    inmueble_card_i.factor_tiempo_tiempo = "Fracciones disponibles"; // (esto porque no deseamos que muestre el tiempo de FINALIZA ....)
                }

                if (inmueble_card_i.precio_justo >= Number(precio_requerido)) {
                    ok_precio_requerido = true;
                }

                // ---------------------------------------

                let inmueble_aceptado = false; // POR DEFECTO

                // agregacion en inmuebles respuesta encontrados

                // ------- Para verificación -------
                /*
                console.log("PARA UN INMUEBLE");
                console.log("ok_palabras: " + ok_palabras);
                console.log("ok_tipo_inmueble: " + ok_tipo_inmueble);
                console.log("ok_superficie: " + ok_superficie);
                console.log("ok_banos: " + ok_banos);
                console.log("ok_dormitorios: " + ok_dormitorios);
                console.log("ok_garaje: " + ok_garaje);
                console.log("ok_precio_requerido: " + ok_precio_requerido);
                */

                if (
                    ok_ciudad &&
                    ok_palabras &&
                    ok_tipo_inmueble &&
                    ok_superficie &&
                    ok_banos &&
                    ok_dormitorios &&
                    ok_garaje &&
                    ok_precio_requerido
                ) {
                    inmueble_aceptado = true;
                }

                if (inmueble_aceptado) {
                    k_posicion = k_posicion + 1;
                    // GUARDAMOS TODOS LOS DATOS POR IGUAL, ya en JQUERY se renderizara HTML segun los datos necesarios.

                    inmuebles_renderizar[k_posicion] = inmueble_card_i;
                }
            }

            // despues de recorrer todos los proyectos y sus respectivos inmuebles, pasamos a renderizar los inmuebles encontrados que cumplen con las condiciones de busqueda
            resultado_renderizar.inmuebles_renderizar = inmuebles_renderizar;
            resultado_renderizar.es_ninguno = true; // para menu navegacion comprimido

            if (inmuebles_renderizar.length > 0) {
                resultado_renderizar.existen_resultados = true;

                /*
                //-------------------------------------------------
                // PARA EL COLOCADO DE ORDENADOR EXTERNO CORRECTO
                if (tipo_busqueda == "disponible") {
                    resultado_renderizar.resultado_inm_disponible = true;
                }
                if (tipo_busqueda == "pendiente") {
                    resultado_renderizar.resultado_inm_pendiente = true;
                }
                if (tipo_busqueda == "remate") {
                    resultado_renderizar.resultado_inm_remate = true;
                }
                //-------------------------------------------------
                */

                // ------- Para verificación -------
                //console.log("todo el resultado a RENDERIZAR");
                //console.log(resultado_renderizar);

                res.render("cli_resultado_busqueda", resultado_renderizar);
            } else {
                resultado_renderizar.existen_resultados = false;

                // ------- Para verificación -------
                //console.log("todo el resultado a RENDERIZAR");
                //console.log(resultado_renderizar);

                res.render("cli_resultado_busqueda", resultado_renderizar);
            }
        } else {
            // porque tenemos que enviar alguna instruccion, aunque sea un ARRAY VACIO "inmuebles_renderizar"
            resultado_renderizar.inmuebles_renderizar = inmuebles_renderizar;
            resultado_renderizar.existen_resultados = false;

            resultado_renderizar.es_ninguno = true; // para menu navegacion comprimido

            // ------- Para verificación -------
            //console.log("todo el resultado BUSQUEDA a RENDERIZAR");
            //console.log(resultado_renderizar);

            res.render("cli_resultado_busqueda", resultado_renderizar);
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA LA BUSQUEDA DE TERRENOS QUE TIENEN A LA VENTA FRACCIONES DE TERRENO, DESDE EL BUSCADOR PRINCIPAL LADO DEL CLIENTE

controladorClienteInicio.buscarFraccionesTerreno = async (req, res) => {
    // RUTA POST  "/fracciones_terreno/resultados"
    // "POST" porque se estan enviando datos del formulario para que sean leidos del lado del servidor

    try {
        // ------- Para verificación -------
        //console.log("los datos del formulario:");
        //console.log(req.body);

        // coincide con la forma de guardado que esta en la base de datos de terreno. Así sera facil en la utilizacion de filtros en la busqueda de la base de datos de terreno
        // Beni, Chuquisaca, Cochabamba, La Paz, Oruro, Pando, Potosí, Santa Cruz, Tarija
        let ciudad_busqueda = req.body.name_ciudad_busq_frac_te;

        moment.locale("es");

        // req.inversor_autenticado PUEDE DAR: FALSE O TRUE
        var inversor_autenticado = req.inversor_autenticado;

        var resultado_renderizar = {
            navegador_cliente: true,
            inversor_autenticado,
            tipo_resultado_inmuebles: false, // para no mostrar el formato de resultados de inmuebles
            tipo_resultado_requerimientos: false, // para no mostrar el formato de resultados de requerimientos
            tipo_resultado_fracciones_terreno: true, // para si mostrar el formato de resultados de terrenos que tienen fracciones disponibles
            es_ninguno: true, // para menu navegacion comprimido
        };
        resultado_renderizar.ordenador_externo = true; // porque SI existen cards que ordenar
        resultado_renderizar.encabezado_titulo = "Resultado fracciones terreno";

        // si es TRUE y solo si es true, entonces se mostrara su ci
        if (req.inversor_autenticado) {
            resultado_renderizar.ci_propietario = req.user.ci_propietario;
        }

        var codigos_resultados = []; // vacio que sera llenado con los codigos de los codigos de terrenos que cumplen con todas las condiciones de busqueda
        var posi = -1; // para ir almacenando los proyectos en el array: "proyectos_resultados"

        // por defecto
        var terrenos_renderizar = []; // cards de terrenos que cumplen con las condiciones de busqueda, asuminos vacio por defecto

        // por defecto
        resultado_renderizar.existen_resultados = false;

        resultado_renderizar.es_convocatoria = true;
        resultado_renderizar.terrenos_convocatoria = true; // para mostrar el menu desplegable de ordenacion
        resultado_renderizar.encabezado_texto = "Fracciones terreno";

        resultado_renderizar.estilo_cabezera = "cabezera_estilo_terreno";

        //----------------------------------------------------

        // con los filtros que se les impuso en ".find", ya estan cumpliendo con la condicion de busqueda por ciudad

        if (ciudad_busqueda == "Todos") {
            var array_terrenos = await indiceTerreno
                .find(
                    { estado_terreno: "fracciones" },
                    {
                        codigo_terreno: 1,
                        provincia: 1,
                        direccion: 1,
                        ubi_otros_1: 1,
                        ubi_otros_2: 1,
                        ubi_otros_3: 1,
                        _id: 0,
                    }
                )
                .sort({ fecha_inicio_convocatoria: -1 }); // ordenado del mas reciente al mas antiguo;
        } else {
            var array_terrenos = await indiceTerreno
                .find(
                    { estado_terreno: "fracciones", ciudad: ciudad_busqueda },
                    {
                        codigo_terreno: 1,
                        provincia: 1,
                        direccion: 1,
                        ubi_otros_1: 1,
                        ubi_otros_2: 1,
                        ubi_otros_3: 1,
                        _id: 0,
                    }
                )
                .sort({ fecha_inicio_convocatoria: -1 }); // ordenado del mas reciente al mas antiguo;
        }

        if (array_terrenos.length > 0) {
            for (let j = 0; j < array_terrenos.length; j++) {
                posi = posi + 1;
                codigos_resultados[posi] = array_terrenos[j].codigo_terreno;
            }

            // llenado con los cards de terrenos que cumplen con las condiciones de busqueda
            if (codigos_resultados.length > 0) {
                for (let i = 0; i < codigos_resultados.length; i++) {
                    var paquete_terreno = {
                        codigo_terreno: codigos_resultados[i],
                        laapirest: "/", // por partir desde el lado del CLIENTE
                    };
                    terrenos_renderizar[i] = await terreno_card_adm_cli(paquete_terreno);
                    terrenos_renderizar[i].card_externo = true; // para que muestre info de card EXTERNOS
                }
                resultado_renderizar.existen_resultados = true;
            }
        }

        //--------------- Verificacion ----------------
        //console.log("los resultados de la busqueda de convocatoria es");
        //console.log(resultado_renderizar);
        //---------------------------------------------
        resultado_renderizar.terrenos_renderizar = terrenos_renderizar;
        res.render("cli_resultado_busqueda", resultado_renderizar);
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA LA BUSQUEDA DE REQUERIMIENTOS DESDE EL BUSCADOR PRINCIPAL LADO DEL CLIENTE

controladorClienteInicio.buscarRequerimientos = async (req, res) => {
    // RUTA POST  "/requerimientos/resultados"
    // "POST" porque se estan enviando datos del formulario para que sean leidos del lado del servidor

    try {
        // ------- Para verificación -------
        //console.log("los datos del formulario busqueda de requerimientos:");
        //console.log(req.body);

        let ciudad_busqueda = req.body.name_ciudad_busq_req;
        let aux_palabras_clave = req.body.html_palabras_requerimiento; // debe estar en minuscula
        var palabras_clave = aux_palabras_clave.toLowerCase(); // TODO A minuscula

        var k_posicion = -1;
        var requerimientos_renderizar = []; // contendra a los inmuebles que cumplen con las condiciones de la busqueda

        // req.inversor_autenticado PUEDE DAR: FALSE O TRUE
        var inversor_autenticado = req.inversor_autenticado;

        var resultado_renderizar = {
            navegador_cliente: true,
            inversor_autenticado,
            tipo_resultado_inmuebles: false, // para no mostrar el formato de resultados de inmuebles
            tipo_resultado_requerimientos: true, // para si mostrar el formato de resultados de requerimientos
            tipo_resultado_fracciones_terreno: false, // para no mostrar el formato de resultados de proyectos
        };
        resultado_renderizar.ordenador_externo = true; // porque sera ordenado (en este caso por la fecha)
        resultado_renderizar.encabezado_titulo = "Resultado requerimientos";

        resultado_renderizar.es_requerimiento = true;
        resultado_renderizar.encabezado_texto = "Vigentes";
        resultado_renderizar.estilo_cabezera = "cabezera_estilo_requerimientos";

        //----------------------------------------------------

        // si es TRUE y solo si es true, entonces se mostrara su ci
        if (req.inversor_autenticado) {
            resultado_renderizar.ci_propietario = req.user.ci_propietario;
        }

        if (ciudad_busqueda == "Todos") {
            var requerimientos_buscar = await indiceRequerimientos
                .find(
                    { visible: true },
                    {
                        codigo_proyecto: 1,
                        codigo_requerimiento: 1,
                        ciudad: 1,
                        requerimiento: 1,
                        descripcion: 1,
                        cantidad: 1,
                        presupuesto_maximo: 1,
                        fecha: 1,
                        _id: 0,
                    }
                )
                .sort({ fecha: -1 }); // ordenado del mas reciente al menos reciente;
        } else {
            var requerimientos_buscar = await indiceRequerimientos
                .find(
                    { visible: true, ciudad: ciudad_busqueda },
                    {
                        codigo_proyecto: 1,
                        codigo_requerimiento: 1,
                        ciudad: 1,
                        requerimiento: 1,
                        descripcion: 1,
                        cantidad: 1,
                        presupuesto_maximo: 1,
                        fecha: 1,
                        _id: 0,
                    }
                )
                .sort({ fecha: -1 }); // ordenado del mas reciente al menos reciente;
        }

        if (requerimientos_buscar.length > 0) {
            // para conversion de formato de fecha a ej/ domingo 28 Junio de 2023
            moment.locale("es");

            for (let i = 0; i < requerimientos_buscar.length; i++) {
                //-----------------------------
                // condicionales por defecto
                var ok_ciudad = false;
                var ok_palabras = false;

                //-------------------------------------------------------------
                // revision si cumple con la ciudad

                if (ciudad_busqueda == "Todos") {
                    ok_ciudad = true;
                } else {
                    if (ciudad_busqueda == requerimientos_buscar[i].ciudad) {
                        ok_ciudad = true;
                    } else {
                        ok_ciudad = false;
                    }
                }

                //-------------------------------------------------------------
                // revision si cumple con las palabras clave de busqueda

                if (palabras_clave != "") {
                    let palabras_encontradas = 0; // asumimos por defecto

                    var aux_string_buscar =
                        requerimientos_buscar[i].codigo_proyecto +
                        " " +
                        requerimientos_buscar[i].codigo_requerimiento +
                        " " +
                        requerimientos_buscar[i].ciudad +
                        " " +
                        requerimientos_buscar[i].requerimiento +
                        " " +
                        requerimientos_buscar[i].descripcion +
                        " " +
                        requerimientos_buscar[i].cantidad +
                        " " +
                        requerimientos_buscar[i].presupuesto_maximo;

                    var string_buscar = aux_string_buscar.toLowerCase(); // TODO A minuscula

                    //--------------- Verificacion ----------------
                    //console.log('la cadena donde buscar');
                    //console.log(string_buscar);
                    //---------------------------------------------

                    let array_palabras_clave = palabras_clave.split(" ");

                    //--------------- Verificacion ----------------
                    //console.log('el array de palabras clave');
                    //console.log(array_palabras_clave);
                    //---------------------------------------------
                    for (let n = 0; n < array_palabras_clave.length; n++) {
                        if (string_buscar.indexOf(array_palabras_clave[n]) != -1) {
                            palabras_encontradas = palabras_encontradas + 1;
                        }
                    }

                    if (palabras_encontradas == array_palabras_clave.length) {
                        ok_palabras = true;
                        // en caso de no cumplir la condicion, no es necesario poner "false", porque de inicio se definio "false" por defecto
                    }
                } else {
                    // si no existen palabras clave que buscar, se tomara como cumplido
                    ok_palabras = true;
                }

                // ---------------------------------------
                if (ok_ciudad && ok_palabras) {
                    k_posicion = k_posicion + 1;
                    // GUARDAMOS TODOS LOS DATOS POR IGUAL, ya en JQUERY se renderizara HTML segun los datos necesarios.

                    //requerimientos_renderizar[k_posicion] = requerimientos_buscar[i];
                    requerimientos_renderizar[k_posicion] = {
                        codigo_proyecto: requerimientos_buscar[i].codigo_proyecto,
                        codigo_requerimiento: requerimientos_buscar[i].codigo_requerimiento,
                        ciudad: requerimientos_buscar[i].ciudad,
                        requerimiento: requerimientos_buscar[i].requerimiento,
                        descripcion: requerimientos_buscar[i].descripcion,
                        cantidad: requerimientos_buscar[i].cantidad,
                        presupuesto_maximo: requerimientos_buscar[i].presupuesto_maximo,
                        //fecha: requerimientos_buscar[i].fecha,
                        fecha: moment(requerimientos_buscar[i].fecha).format("LL"),
                    };
                }
            }

            // despues de recorrer todos los requerimientos, pasamos a renderizar los encontrados que cumplen con las condiciones de busqueda
            resultado_renderizar.requerimientos_renderizar = requerimientos_renderizar;
            resultado_renderizar.es_ninguno = true; // para menu navegacion comprimido

            if (requerimientos_renderizar.length > 0) {
                resultado_renderizar.existen_resultados = true;

                // ------- Para verificación -------
                //console.log("todo el resultado a RENDERIZAR");
                //console.log(resultado_renderizar);

                res.render("cli_resultado_busqueda", resultado_renderizar);
            } else {
                resultado_renderizar.existen_resultados = false;

                // ------- Para verificación -------
                //console.log("todo el resultado a RENDERIZAR");
                //console.log(resultado_renderizar);

                res.render("cli_resultado_busqueda", resultado_renderizar);
            }
        } else {
            // porque tenemos que enviar alguna instruccion, aunque sea un ARRAY VACIO "requerimientos_renderizar"
            resultado_renderizar.requerimientos_renderizar = requerimientos_renderizar;
            resultado_renderizar.existen_resultados = false;

            resultado_renderizar.es_ninguno = true; // para menu navegacion comprimido

            // ------- Para verificación -------
            //console.log("todo el resultado BUSQUEDA a RENDERIZAR");
            //console.log(resultado_renderizar);

            res.render("cli_resultado_busqueda", resultado_renderizar);
        }
    } catch (error) {
        console.log(error);
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// RENDERIZACION DE PROYECTOS DE DIFERENTE ESTADO LADO PUBLICO CLIENTE

controladorClienteInicio.cliProyectosVariosTipos = async (req, res) => {
    // viene de la ruta: GET  "/ventana/:tipo_ventana"

    try {
        // ------- Para verificación -------
        //console.log("INGRESAMOS AL CONTROLADOR DE TIPOS DE VENTANA LADO CLIENTE");

        var tipo_ventana = req.params.tipo_ventana;
        var laapirest = "/"; // por partir desde el lado del CLIENTE
        var codigo_usuario = "ninguno"; // por partir desde el lado del CLIENTE donde no existen inmueble (CARD DE INMUEBLES) solo PROYECTOS Y TERRENOS
        var paquete_info = {
            tipo_ventana,
            laapirest,
            codigo_usuario,
        };
        var cards_inicio = await cards_inicio_cli_adm(paquete_info);

        cards_inicio.inversor_autenticado = req.inversor_autenticado; // FALSE O TRUE

        //console.log("req.inversor_autenticado es: " + req.inversor_autenticado);

        // si es TRUE y solo si es true, entonces se mostrara su ci
        if (req.inversor_autenticado) {
            cards_inicio.ci_propietario = req.user.ci_propietario;
        }

        // es_ninguno: true  // para las opciones de navegacion de la ventana en estado comprimido
        // cards_inicio.es_ninguno = true; // YA ESTA INCLUIDO EN LA FUNCION "cards_inicio_cli_adm"

        cards_inicio.navegador_cliente = true;
        cards_inicio.ordenador_externo = true; // porque SI existen cards que ordenar

        // ------- Para verificación -------

        //console.log("los datos ARMADOS DE INICIO");
        //console.log(cards_inicio);

        res.render("cli_p_proyectos", cards_inicio);
    } catch (error) {
        console.log(error);
    }
};

module.exports = controladorClienteInicio;
