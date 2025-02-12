const {
    indiceTerreno,
    indiceProyecto,
    indiceInmueble,
    indiceEmpresa,
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

        if (tipo_ventana == "guardado_terreno") {
            objetivo_armado.encabezado_titulo = "Terrenos guardados";
            objetivo_armado.encabezado_texto = "Terrenos en espera de lanzamiento";
            objetivo_armado.estilo_cabezera = "cabezera_estilo_terreno";

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
                objetivo_armado.mensaje_inexistente = "No existen Terrenos guardados";
                objetivo_armado.adm_guardado_terreno = [];
            }

            return objetivo_armado;
        }

        if (tipo_ventana == "guardado_proyecto") {
            objetivo_armado.encabezado_titulo = "Proyectos guardados";
            objetivo_armado.encabezado_texto = "Proyectos en espera de lanzamiento";
            objetivo_armado.estilo_cabezera = "cabezera_estilo_proyecto";

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
                objetivo_armado.mensaje_inexistente = "No existen Proyectos guardados";
                objetivo_armado.adm_guardado_proyecto = [];
            }

            return objetivo_armado;
        }

        if (tipo_ventana == "guardado_inmueble") {
            objetivo_armado.encabezado_titulo = "Inmuebles guardados";
            objetivo_armado.encabezado_texto = "Inmuebles en espera de lanzamiento";
            objetivo_armado.estilo_cabezera = "cabezera_estilo_inmueble";

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
                objetivo_armado.mensaje_inexistente = "No existen Inmuebles guardados";
                objetivo_armado.adm_guardado_inmueble = [];
            }

            return objetivo_armado;
        }

        if (tipo_ventana == "convocatoria") {
            objetivo_armado.encabezado_titulo = "Terrenos en convocatoria";
            objetivo_armado.encabezado_texto = "Invierte y obten ganancias";
            objetivo_armado.estilo_cabezera = "cabezera_estilo_convocatoria";

            //----------------------------------------------------

            objetivo_armado.terrenos_convocatoria = true;

            // ANTES: { convocatoria_disponible: true, estado_terreno: { $ne: "guardado" } },
            var registro_objetivo = await indiceTerreno
                .find(
                    { convocatoria_disponible: true, estado_terreno: "convocatoria" },
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
                    "No existen terrenos disponibles para convocatoria";

                objetivo_armado.adm_cli_convocatoria = [];
            }

            return objetivo_armado;
        }

        if (tipo_ventana == "reservacion") {
            objetivo_armado.encabezado_titulo = "Proyectos en reservación";
            objetivo_armado.encabezado_texto = "Reserva tu inmueble";
            objetivo_armado.estilo_cabezera = "cabezera_estilo_reserva";

            //----------------------------------------------------

            objetivo_armado.proyectos_reserva = true;

            // ------- Para verificación -------
            //console.log("estamos en proyectos en reserva");

            var terrenos_reserva = await indiceTerreno
                .find(
                    { estado_terreno: "reservacion" },
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
                    objetivo_armado.adm_cli_reservacion = cards_proyectos;

                    // ------- Para verificación -------
                    //console.log("los card en reserva armados son: ");
                    //console.log(objetivo_armado);
                } else {
                    objetivo_armado.no_existe = true;
                    objetivo_armado.mensaje_inexistente = "No existen Proyectos en reservación";
                    objetivo_armado.adm_cli_reservacion = [];
                }
            } else {
                objetivo_armado.no_existe = true;
                objetivo_armado.mensaje_inexistente = "No existen Proyectos en reservación";
                objetivo_armado.adm_cli_reservacion = [];
            }

            // ------- Para verificación -------
            //console.log("los proyetos en reserva son: ");
            //console.log(objetivo_armado);

            return objetivo_armado;
        }

        if (tipo_ventana == "construccion") {
            objetivo_armado.encabezado_titulo = "Proyectos en construcción";
            objetivo_armado.encabezado_texto = "Construyendo inmuebles a precio justo";
            objetivo_armado.estilo_cabezera = "cabezera_estilo_construccion";

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
                    objetivo_armado.mensaje_inexistente = "No existen Proyectos en construcción";
                    objetivo_armado.adm_cli_construccion = [];
                }
            } else {
                objetivo_armado.no_existe = true;
                objetivo_armado.mensaje_inexistente = "No existen Proyectos en construcción";
                objetivo_armado.adm_cli_construccion = [];
            }

            return objetivo_armado;
        }

        if (tipo_ventana == "construido") {
            objetivo_armado.encabezado_titulo = "Proyectos construidos";
            objetivo_armado.encabezado_texto = "Construidos con eficiencia";
            objetivo_armado.estilo_cabezera = "cabezera_estilo_construido";

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
                    objetivo_armado.mensaje_inexistente = "No existen Proyectos construidos";
                    objetivo_armado.adm_cli_construido = [];
                }
            } else {
                objetivo_armado.no_existe = true;
                objetivo_armado.mensaje_inexistente = "No existen Proyectos construidos";
                objetivo_armado.adm_cli_construido = [];
            }

            return objetivo_armado;
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
module.exports = funcionesAyuda_0;
