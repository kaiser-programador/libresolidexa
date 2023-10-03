const {
    indiceTerreno,
    indiceProyecto,
    indiceInmueble,
    indiceEmpresa,
    indiceImagenesSistema,
} = require("../modelos/indicemodelo");

const {
    inmueble_card_adm_cli,
    proyecto_card_adm_cli,
    terreno_card_adm_cli,
} = require("../ayudas/funcionesayuda_1");

const funcionesAyuda_0 = {};

/************************************************************************************ */
/************************************************************************************ */
// paquete_info = {tipo_ventana, laapirest, codigo_usuario}
// el "codigo_usuario"  sera solo util para los "cards inmuebles"

funcionesAyuda_0.cards_inicio_cli_adm = async function (paquete_info) {
    try {
        // ------- Para verificación -------
        //console.log("el paquete de datos de cards_inicio_cli_adm");
        //console.log(paquete_info);

        var tipo_ventana = paquete_info.tipo_ventana;
        var objetivo_armado = {};
        // para opciones navegador estado comprimido, porque no esta dentro la ventana propia de: TERRENO, PROYECTO, INMUEBLE, ADMINISTRADOR, PROPIETARIO (que estos tienen sus propios menus de navegacion)
        objetivo_armado.es_ninguno = true;

        var registro_datos_empresa = await indiceEmpresa.findOne(
            {},
            {
                encabezado_guardado_terreno: 1,
                texto_guardado_terreno: 1,
                inexistente_guardado_terreno: 1,

                encabezado_guardado_proyecto: 1,
                texto_guardado_proyecto: 1,
                inexistente_guardado_proyecto: 1,

                encabezado_guardado_inmueble: 1,
                texto_guardado_inmueble: 1,
                inexistente_guardado_inmueble: 1,

                encabezado_convocatoria: 1,
                texto_convocatoria: 1,
                inexistente_convocatoria: 1,

                encabezado_reserva: 1,
                texto_reserva: 1,
                inexistente_reserva: 1,

                encabezado_aprobacion: 1,
                texto_aprobacion: 1,
                inexistente_aprobacion: 1,

                encabezado_pago: 1,
                texto_pago: 1,
                inexistente_pago: 1,

                encabezado_construccion: 1,
                texto_construccion: 1,
                inexistente_construccion: 1,

                encabezado_construido: 1,
                texto_construido: 1,
                inexistente_construido: 1,
            }
        );

        if (registro_datos_empresa) {
            if (tipo_ventana == "guardado_terreno") {
                objetivo_armado.encabezado_titulo =
                    registro_datos_empresa.encabezado_guardado_terreno;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_guardado_terreno;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_terreno";

                //----------------------------------------------------
                // para la url de la cabezera
                var url_cabezera = ""; // vacio por defecto
                const registro_cabezera = await indiceImagenesSistema.findOne(
                    { tipo_imagen: "cabecera_terreno" },
                    {
                        url: 1,
                        _id: 0,
                    }
                );

                if (registro_cabezera) {
                    url_cabezera = registro_cabezera.url;
                }

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                var registro_objetivo = await indiceTerreno
                    .find(
                        { estado_terreno: "guardado" },
                        {
                            codigo_terreno: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_creacion: -1 }); // ordenado del mas reciente al menos reciente

                if (registro_objetivo.length > 0) {
                    var cards_terrenos = []; // vacio para ser llenado
                    for (let i = 0; i < registro_objetivo.length; i++) {
                        var paquete_terreno = {
                            codigo_terreno: registro_objetivo[i].codigo_terreno,
                            laapirest: paquete_info.laapirest,
                        };
                        cards_terrenos[i] = await terreno_card_adm_cli(paquete_terreno);
                    }

                    objetivo_armado.adm_guardado_terreno = cards_terrenos;
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente =
                        registro_datos_empresa.inexistente_guardado_terreno;
                    objetivo_armado.adm_guardado_terreno = [];
                }

                return objetivo_armado;
            }

            if (tipo_ventana == "guardado_proyecto") {
                objetivo_armado.encabezado_titulo =
                    registro_datos_empresa.encabezado_guardado_proyecto;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_guardado_proyecto;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_proyecto";

                //----------------------------------------------------
                // para la url de la cabezera
                var url_cabezera = ""; // vacio por defecto
                const registro_cabezera = await indiceImagenesSistema.findOne(
                    { tipo_imagen: "cabecera_proyecto" },
                    {
                        url: 1,
                        _id: 0,
                    }
                );

                if (registro_cabezera) {
                    url_cabezera = registro_cabezera.url;
                }

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                var registro_objetivo = await indiceProyecto
                    .find(
                        { estado_proyecto: "guardado" },
                        {
                            codigo_proyecto: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_creacion: -1 }); // ordenado del mas reciente al menos reciente

                if (registro_objetivo.length > 0) {
                    var cards_proyectos = []; // vacio para ser llenado
                    for (let i = 0; i < registro_objetivo.length; i++) {
                        var paquete_proyecto = {
                            codigo_proyecto: registro_objetivo[i].codigo_proyecto,
                            laapirest: paquete_info.laapirest,
                        };
                        cards_proyectos[i] = await proyecto_card_adm_cli(paquete_proyecto);
                        cards_proyectos[i].card_externo = true; // para que muestre info de card EXTERNOS
                    }
                    objetivo_armado.adm_guardado_proyecto = cards_proyectos;
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente =
                        registro_datos_empresa.inexistente_guardado_proyecto;
                    objetivo_armado.adm_guardado_proyecto = [];
                }

                return objetivo_armado;
            }

            if (tipo_ventana == "guardado_inmueble") {
                objetivo_armado.encabezado_titulo =
                    registro_datos_empresa.encabezado_guardado_inmueble;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_guardado_inmueble;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_inmueble";

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

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                var registro_objetivo = await indiceInmueble
                    .find(
                        { estado_inmueble: "guardado" },
                        {
                            codigo_inmueble: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_creacion: -1 }); // ordenado del mas reciente al menos reciente

                if (registro_objetivo.length > 0) {
                    var cards_inmuebles = []; // vacio para ser llenado
                    for (let i = 0; i < registro_objetivo.length; i++) {
                        // paquete_inmueble = {codigo_inmueble,codigo_usuario,laapirest}
                        var paquete_inmueble = {
                            codigo_inmueble: registro_objetivo[i].codigo_inmueble,
                            laapirest: paquete_info.laapirest,
                            codigo_usuario: paquete_info.codigo_usuario,
                        };
                        cards_inmuebles[i] = await inmueble_card_adm_cli(paquete_inmueble);
                        cards_inmuebles[i].card_externo = true; // para que muestre info de card EXTERNOS
                    }
                    objetivo_armado.adm_guardado_inmueble = cards_inmuebles;
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente =
                        registro_datos_empresa.inexistente_guardado_inmueble;
                    objetivo_armado.adm_guardado_inmueble = [];
                }

                return objetivo_armado;
            }

            if (tipo_ventana == "convocatoria") {
                objetivo_armado.encabezado_titulo = registro_datos_empresa.encabezado_convocatoria;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_convocatoria;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_convocatoria";

                //----------------------------------------------------
                // para la url de la cabezera
                var url_cabezera = ""; // vacio por defecto
                const registro_cabezera = await indiceImagenesSistema.findOne(
                    { tipo_imagen: "cabecera_convocatoria" },
                    {
                        url: 1,
                        _id: 0,
                    }
                );

                if (registro_cabezera) {
                    url_cabezera = registro_cabezera.url;
                }

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                objetivo_armado.terrenos_convocatoria = true;

                // ANTES: { convocatoria_disponible: true, estado_terreno: { $ne: "guardado" } },
                var registro_objetivo = await indiceTerreno
                    .find(
                        { convocatoria_disponible: true, estado_terreno: "reserva" },
                        {
                            codigo_terreno: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_creacion: -1 }); // ordenado del mas reciente al menos reciente

                if (registro_objetivo.length > 0) {
                    var cards_terrenos = []; // vacio para ser llenado
                    for (let i = 0; i < registro_objetivo.length; i++) {
                        var paquete_terreno = {
                            codigo_terreno: registro_objetivo[i].codigo_terreno,
                            laapirest: paquete_info.laapirest,
                        };
                        cards_terrenos[i] = await terreno_card_adm_cli(paquete_terreno);
                    }
                    objetivo_armado.adm_cli_convocatoria = cards_terrenos;
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente =
                        registro_datos_empresa.inexistente_convocatoria;

                    objetivo_armado.adm_cli_convocatoria = [];
                }

                return objetivo_armado;
            }

            if (tipo_ventana == "reserva") {
                objetivo_armado.encabezado_titulo = registro_datos_empresa.encabezado_reserva;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_reserva;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_reserva";

                //----------------------------------------------------
                // para la url de la cabezera
                var url_cabezera = ""; // vacio por defecto
                const registro_cabezera = await indiceImagenesSistema.findOne(
                    { tipo_imagen: "cabecera_reserva" },
                    {
                        url: 1,
                        _id: 0,
                    }
                );

                if (registro_cabezera) {
                    url_cabezera = registro_cabezera.url;
                }

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                objetivo_armado.proyectos_reserva = true;

                // ------- Para verificación -------
                //console.log("estamos en proyectos en reserva");

                var terrenos_reserva = await indiceTerreno
                    .find(
                        { estado_terreno: "reserva" },
                        {
                            codigo_terreno: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_creacion: -1 }); // ordenado del mas reciente al menos reciente

                if (terrenos_reserva.length > 0) {
                    // ------- Para verificación -------
                    //console.log("existen terrenos en reserva");

                    var aux_codigos_proyectos = [];
                    var n = -1;
                    for (let j = 0; j < terrenos_reserva.length; j++) {
                        var codigo_terreno_j = terrenos_reserva[j].codigo_terreno;
                        // notese que aqui se usa "find", porque deseamos todos los proyectos que pueda tener un terreno listos para ser reservados.
                        var proyecto_reserva_j = await indiceProyecto.find(
                            {
                                codigo_terreno: codigo_terreno_j,
                                // no se tomara en cuenta que sea "proyecto_ganador", porque se necesita mostrar a todos los proyectos que esten disponibles para ser reservados (es por ello que solo se tomara en cuenta que cumpla con la condicion de que sea visible), asi los potenciales propietarios podran ver los proyectos de este tipo y ordenarlos segun su grado de inmuebles disponibles a la espera de propietarios interesados en reservarlos.
                                //proyecto_ganador: true,
                                visible: true,
                            },
                            {
                                codigo_proyecto: 1,
                                _id: 0,
                            }
                        );

                        if (proyecto_reserva_j.length > 0) {
                            for (let k = 0; k < proyecto_reserva_j.length; k++) {
                                n = n + 1;
                                aux_codigos_proyectos[n] = proyecto_reserva_j[k].codigo_proyecto;
                            }
                        }
                    }

                    if (aux_codigos_proyectos.length > 0) {
                        // ------- Para verificación -------
                        //console.log("existen proyectos de terrenos en reserva");

                        var cards_proyectos = []; // vacio para ser llenado
                        for (let i = 0; i < aux_codigos_proyectos.length; i++) {
                            var paquete_proyecto = {
                                codigo_proyecto: aux_codigos_proyectos[i],
                                laapirest: paquete_info.laapirest,
                            };
                            cards_proyectos[i] = await proyecto_card_adm_cli(paquete_proyecto);
                            cards_proyectos[i].card_externo = true; // para que muestre info de card EXTERNOS
                        }
                        objetivo_armado.adm_cli_reserva = cards_proyectos;

                        // ------- Para verificación -------
                        //console.log("los card en reserva armados son: ");
                        //console.log(objetivo_armado);
                    } else {
                        objetivo_armado.no_existe = true;
                        objetivo_armado.mensaje_inexistente =
                            registro_datos_empresa.inexistente_reserva;
                        objetivo_armado.adm_cli_reserva = [];
                    }
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente =
                        registro_datos_empresa.inexistente_reserva;
                    objetivo_armado.adm_cli_reserva = [];
                }

                // ------- Para verificación -------
                //console.log("los proyetos en reserva son: ");
                //console.log(objetivo_armado);

                return objetivo_armado;
            }

            if (tipo_ventana == "aprobacion") {
                objetivo_armado.encabezado_titulo = registro_datos_empresa.encabezado_aprobacion;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_aprobacion;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_aprobacion";

                //----------------------------------------------------
                // para la url de la cabezera
                var url_cabezera = ""; // vacio por defecto
                const registro_cabezera = await indiceImagenesSistema.findOne(
                    { tipo_imagen: "cabecera_aprobacion" },
                    {
                        url: 1,
                        _id: 0,
                    }
                );

                if (registro_cabezera) {
                    url_cabezera = registro_cabezera.url;
                }

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                objetivo_armado.proyectos_aprobacion = true;

                // solo puede existir un PROYECTO en aprobacion por TERRENO

                var terrenos_aprobacion = await indiceTerreno
                    .find(
                        { estado_terreno: "aprobacion" },
                        {
                            codigo_terreno: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_creacion: -1 }); // ordenado del mas reciente al menos reciente

                if (terrenos_aprobacion.length > 0) {
                    var aux_codigos_proyectos = [];
                    var n = -1;
                    for (let j = 0; j < terrenos_aprobacion.length; j++) {
                        var codigo_terreno_j = terrenos_aprobacion[j].codigo_terreno;
                        // notese que aqui se usa "findOne", porque solo puede exitir un solo proyecto por terreno a la espera de recibir aprobacion de construccion.
                        var proyecto_aprobacion_j = await indiceProyecto.findOne(
                            {
                                codigo_terreno: codigo_terreno_j,
                                // aqui si importa que se trate de un proyecto ganador, porque solo los ganadores pueden estar en la etapa de recibir el aprobacion de construccion.
                                proyecto_ganador: true,
                                visible: true,
                            },
                            {
                                codigo_proyecto: 1,
                                _id: 0,
                            }
                        );

                        if (proyecto_aprobacion_j) {
                            n = n + 1;
                            aux_codigos_proyectos[n] = proyecto_aprobacion_j.codigo_proyecto;
                        }
                    }

                    if (aux_codigos_proyectos.length > 0) {
                        var cards_proyectos = []; // vacio para ser llenado
                        for (let i = 0; i < aux_codigos_proyectos.length; i++) {
                            var paquete_proyecto = {
                                codigo_proyecto: aux_codigos_proyectos[i],
                                laapirest: paquete_info.laapirest,
                            };
                            cards_proyectos[i] = await proyecto_card_adm_cli(paquete_proyecto);
                            cards_proyectos[i].card_externo = true; // para que muestre info de card EXTERNOS
                        }
                        objetivo_armado.adm_cli_aprobacion = cards_proyectos;
                    } else {
                        objetivo_armado.no_existe = true;
                        objetivo_armado.mensaje_inexistente =
                            registro_datos_empresa.inexistente_aprobacion;
                        objetivo_armado.adm_cli_aprobacion = [];
                    }
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente =
                        registro_datos_empresa.inexistente_aprobacion;
                    objetivo_armado.adm_cli_aprobacion = [];
                }

                return objetivo_armado;
            }

            if (tipo_ventana == "pago") {
                objetivo_armado.encabezado_titulo = registro_datos_empresa.encabezado_pago;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_pago;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_pago";

                //----------------------------------------------------
                // para la url de la cabezera
                var url_cabezera = ""; // vacio por defecto
                const registro_cabezera = await indiceImagenesSistema.findOne(
                    { tipo_imagen: "cabecera_pago" },
                    {
                        url: 1,
                        _id: 0,
                    }
                );

                if (registro_cabezera) {
                    url_cabezera = registro_cabezera.url;
                }

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                objetivo_armado.proyectos_pago = true;

                // solo puede existir un PROYECTO en pago por TERRENO

                var terrenos_pago = await indiceTerreno
                    .find(
                        { estado_terreno: "pago" },
                        {
                            codigo_terreno: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_creacion: -1 }); // ordenado del mas reciente al menos reciente

                if (terrenos_pago.length > 0) {
                    var aux_codigos_proyectos = [];
                    var n = -1;
                    for (let j = 0; j < terrenos_pago.length; j++) {
                        var codigo_terreno_j = terrenos_pago[j].codigo_terreno;
                        // notese que aqui se usa "findOne", porque solo puede exitir un solo proyecto por terreno a la espera de recibir pago del valor de sus inmuebles.
                        var proyecto_pago_j = await indiceProyecto.findOne(
                            {
                                codigo_terreno: codigo_terreno_j,
                                // aqui si importa que se trate de un proyecto ganador, porque solo los ganadores pueden estar en la etapa de recibir el pago de del inmueble de los propietarios que previamente los reservaron.
                                proyecto_ganador: true,
                                visible: true,
                            },
                            {
                                codigo_proyecto: 1,
                                _id: 0,
                            }
                        );

                        if (proyecto_pago_j) {
                            n = n + 1;
                            aux_codigos_proyectos[n] = proyecto_pago_j.codigo_proyecto;
                        }
                    }

                    if (aux_codigos_proyectos.length > 0) {
                        var cards_proyectos = []; // vacio para ser llenado
                        for (let i = 0; i < aux_codigos_proyectos.length; i++) {
                            var paquete_proyecto = {
                                codigo_proyecto: aux_codigos_proyectos[i],
                                laapirest: paquete_info.laapirest,
                            };
                            cards_proyectos[i] = await proyecto_card_adm_cli(paquete_proyecto);
                            cards_proyectos[i].card_externo = true; // para que muestre info de card EXTERNOS
                        }
                        objetivo_armado.adm_cli_pago = cards_proyectos;
                    } else {
                        objetivo_armado.no_existe = true;
                        objetivo_armado.mensaje_inexistente =
                            registro_datos_empresa.inexistente_pago;
                        objetivo_armado.adm_cli_pago = [];
                    }
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente = registro_datos_empresa.inexistente_pago;
                    objetivo_armado.adm_cli_pago = [];
                }

                return objetivo_armado;
            }

            if (tipo_ventana == "construccion") {
                objetivo_armado.encabezado_titulo = registro_datos_empresa.encabezado_construccion;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_construccion;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_construccion";

                //----------------------------------------------------
                // para la url de la cabezera
                var url_cabezera = ""; // vacio por defecto
                const registro_cabezera = await indiceImagenesSistema.findOne(
                    { tipo_imagen: "cabecera_construccion" },
                    {
                        url: 1,
                        _id: 0,
                    }
                );

                if (registro_cabezera) {
                    url_cabezera = registro_cabezera.url;
                }

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                objetivo_armado.proyectos_construccion = true;

                // solo puede existir un PROYECTO en construccion por TERRENO

                var terrenos_construccion = await indiceTerreno
                    .find(
                        { estado_terreno: "construccion" },
                        {
                            codigo_terreno: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_inicio_construccion: -1 }); // ordenado del mas reciente al menos reciente

                if (terrenos_construccion.length > 0) {
                    var aux_codigos_proyectos = [];
                    var n = -1;
                    for (let j = 0; j < terrenos_construccion.length; j++) {
                        var codigo_terreno_j = terrenos_construccion[j].codigo_terreno;
                        var proyecto_pago_j = await indiceProyecto.findOne(
                            {
                                codigo_terreno: codigo_terreno_j,
                                proyecto_ganador: true,
                                visible: true,
                            },
                            {
                                codigo_proyecto: 1,
                                _id: 0,
                            }
                        );

                        if (proyecto_pago_j) {
                            n = n + 1;
                            aux_codigos_proyectos[n] = proyecto_pago_j.codigo_proyecto;
                        }
                    }

                    if (aux_codigos_proyectos.length > 0) {
                        var cards_proyectos = []; // vacio para ser llenado
                        for (let i = 0; i < aux_codigos_proyectos.length; i++) {
                            var paquete_proyecto = {
                                codigo_proyecto: aux_codigos_proyectos[i],
                                laapirest: paquete_info.laapirest,
                            };
                            cards_proyectos[i] = await proyecto_card_adm_cli(paquete_proyecto);
                            cards_proyectos[i].card_externo = true; // para que muestre info de card EXTERNOS
                        }
                        objetivo_armado.adm_cli_construccion = cards_proyectos;
                    } else {
                        objetivo_armado.no_existe = true;
                        objetivo_armado.mensaje_inexistente =
                            registro_datos_empresa.inexistente_construccion;
                        objetivo_armado.adm_cli_construccion = [];
                    }
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente =
                        registro_datos_empresa.inexistente_construccion;
                    objetivo_armado.adm_cli_construccion = [];
                }

                return objetivo_armado;
            }

            if (tipo_ventana == "construido") {
                objetivo_armado.encabezado_titulo = registro_datos_empresa.encabezado_construido;
                objetivo_armado.encabezado_texto = registro_datos_empresa.texto_construido;
                //objetivo_armado.estilo_cabezera = "cabezera_estilo_construido";

                //----------------------------------------------------
                // para la url de la cabezera
                var url_cabezera = ""; // vacio por defecto
                const registro_cabezera = await indiceImagenesSistema.findOne(
                    { tipo_imagen: "cabecera_construido" },
                    {
                        url: 1,
                        _id: 0,
                    }
                );

                if (registro_cabezera) {
                    url_cabezera = registro_cabezera.url;
                }

                objetivo_armado.url_cabezera = url_cabezera;

                //----------------------------------------------------

                objetivo_armado.proyectos_construido = true;

                // solo puede existir un PROYECTO construido por TERRENO

                var terrenos_construidos = await indiceTerreno
                    .find(
                        { estado_terreno: "construido" },
                        {
                            codigo_terreno: 1,
                            _id: 0,
                        }
                    )
                    .sort({ fecha_fin_construccion: -1 }); // ordenado del mas reciente al menos reciente

                if (terrenos_construidos.length > 0) {
                    var aux_codigos_proyectos = [];
                    var n = -1;
                    for (let j = 0; j < terrenos_construidos.length; j++) {
                        var codigo_terreno_j = terrenos_construidos[j].codigo_terreno;
                        var proyecto_pago_j = await indiceProyecto.findOne(
                            {
                                codigo_terreno: codigo_terreno_j,
                                proyecto_ganador: true,
                                visible: true,
                            },
                            {
                                codigo_proyecto: 1,
                                _id: 0,
                            }
                        );

                        if (proyecto_pago_j) {
                            n = n + 1;
                            aux_codigos_proyectos[n] = proyecto_pago_j.codigo_proyecto;
                        }
                    }

                    if (aux_codigos_proyectos.length > 0) {
                        var cards_proyectos = []; // vacio para ser llenado
                        for (let i = 0; i < aux_codigos_proyectos.length; i++) {
                            var paquete_proyecto = {
                                codigo_proyecto: aux_codigos_proyectos[i],
                                laapirest: paquete_info.laapirest,
                            };
                            cards_proyectos[i] = await proyecto_card_adm_cli(paquete_proyecto);
                            cards_proyectos[i].card_externo = true; // para que muestre info de card EXTERNOS
                        }
                        objetivo_armado.adm_cli_construido = cards_proyectos;
                    } else {
                        objetivo_armado.no_existe = true;
                        objetivo_armado.mensaje_inexistente =
                            registro_datos_empresa.inexistente_construido;
                        objetivo_armado.adm_cli_construido = [];
                    }
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente =
                        registro_datos_empresa.inexistente_construido;
                    objetivo_armado.adm_cli_construido = [];
                }

                return objetivo_armado;
            }
        } else {
            return objetivo_armado; // uno VACIO
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
module.exports = funcionesAyuda_0;
