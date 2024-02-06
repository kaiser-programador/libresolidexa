// contendra el modelo de informacion que tendra el PROYECTO

const mongoose = require("mongoose");

const { Schema } = mongoose;

const proyectoEsquema = new Schema({
    codigo_terreno: { type: String, default: "" }, // codigo del TERRENO al que pertenece

    codigo_proyecto: { type: String, default: "" },
    nombre_proyecto: { type: String, default: "" },
    proyecto_ganador: { type: Boolean, default: false }, // "true" ganador para: pago, construccion, construido (solo puede existir uno entre todos los proyectos del terreno)
    visible: { type: Boolean, default: false }, // "false" para ocultar en los resultados
    estado_proyecto: { type: String, default: "guardado" }, // guardado o completado

    tipo_proyecto: { type: String, default: "" }, // edificio || condominio
    // edificio (para: departamentos, oficinas, comerciales) || condominio (para: casas)

    // el estado_proyecto vendro estara determinado por el estado del terreno, asi que en esta base de datos no es necesario especificar
    //estado_proyecto: { type: String, default: "guardado" },

    fecha_creacion: { type: Date, default: Date.now },
    /**----------------------------- */

    meses_construccion: { type: Number, default: 12 },

    // no es necesario especificar el numero de inmuebles, porque se lo hara con funciones, asi como los ocupados y disponibles

    total_departamentos: { type: Number, default: 0 },
    total_oficinas: { type: Number, default: 0 },
    total_comerciales: { type: Number, default: 0 },
    total_casas: { type: Number, default: 0 },
    //dormitorios: { type: Number, default: 0 },
    //banos: { type: Number, default: 0 }, // numero de baños
    //terreno: { type: Number, default: "" },
    garajes: { type: Number, default: 0 },
    area_construida: { type: Number, default: "" },
    proyecto_descripcion: { type: String, default: "" },
    penalizacion: { type: Number, default: 15 }, // castigo por incumplimiento de pago en %

    trafico:{ type: Number, default: 0 }, // numero de personas por hora

    titulo_garantia_1: { type: String, default: "" }, // posible "Garantía fiduciaria"
    garantia_1: { type: String, default: "" }, // posible "Garantía fiduciaria"
    titulo_garantia_2: { type: String, default: "" }, // posible "Garantía hipotecaria"
    garantia_2: { type: String, default: "" }, // posible "Garantía hipotecaria"
    titulo_garantia_3: { type: String, default: "" }, // posible "Garantía adicional"
    garantia_3: { type: String, default: "" }, // posible "Garantía adicional"

    titulo_otros_1: { type: String, default: "" }, // posible "areas comunes"
    otros_1: { type: String, default: "" }, // posible "areas comunes" SEPARADO CON "*"

    titulo_otros_2: { type: String, default: "" }, // posible "adicionales"
    otros_2: { type: String, default: "" }, // posible "adicionales SEPARADO CON "*"

    titulo_otros_3: { type: String, default: "" }, // posible "otros"
    otros_3: { type: String, default: "" }, // posible "otros" SEPARADO CON "*"

    acabados: { type: String, default: "" },

    link_youtube_proyecto: { type: String, default: "" },
    link_facebook_proyecto: { type: String, default: "" },
    link_instagram_proyecto: { type: String, default: "" },
    link_tiktok_proyecto: { type: String, default: "" },

    contructora_dolar_m2_1: { type: Number, default: "" },
    contructora_dolar_m2_2: { type: Number, default: "" },
    contructora_dolar_m2_3: { type: Number, default: "" },
    //contructora_dolar_promedio: { type: Number, default: '' }, // de las tres contructoras dolar/m2
    volterra_dolar_m2: { type: Number, default: "" },

    // [ [#,item,valor] , [#,item,valor] , ... , [#,item,valor] ]
    presupuesto_proyecto: { type: Array, default: [] },
    //----------------------------------------------------------------
    // TEXTOS y segunderos PROYECTO e INMUEBLE

    titulo_construccion_py: { type: String, default: "Construcción sin sobreprecios" },
    texto_construccion_py: {
        type: String,
        default:
            'La ejecución de nuestros proyectos son llevados a cabo con el uso eficiente de los recursos materiales y humanos, sumandose una optimización en las diferentes tareas de construcción, eliminando todo aquello que pueda conducir al encarecimiento innecesario del producto, cumpliendo con las normas y sin descuidar la calidad de nuestros inmuebles. Para mas información, ponemos a disposicion de nuestros potenciales inversores los detalles del Presupuesto de contruccion del proyecto, en la pestaña "Información económica".',
    },
    nota_construccion_py: {
        type: String,
        default:
            "Los costos de construcción fueron obtenidas de diferentes constructoras que operan en el mercado. Por lo general estas empresas trabajan con una tarifa fija de contrucción $us/m2 que viene determinada por el mercado tradicional.",
    },

    titulo_plusvalia_py: { type: String, default: "Plusvalía de regalo" },
    texto_plusvalia_py: {
        type: String,
        default:
            "Todos los inmuebles del proyecto cuentan con plusvalías de mercado, es ganancia potencial para los compradores.",
    },
    nota_plusvalia_py: {
        type: String,
        default:
            "La plusvalia de mercado, fue obtenida sumando todas las plusvalías de los inmuebles que componen al presente proyecto.",
    },

    titulo_economico_py: { type: String, default: "Resumen económico" },
    texto_economico_py: {
        type: String,
        default:
            'La ejecución de nuestros proyectos son llevados a cabo con el uso eficiente de los recursos materiales y humanos, sumandose una optimización en las diferentes tareas de construcción, eliminando todo aquello que pueda conducir al encarecimiento innecesario del producto, cumpliendo con las normas y sin descuidar la calidad de nuestros inmuebles. Para más información, ponemos a disposicion de nuestros potenciales inversores los detalles del Presupuesto de contruccion del proyecto, en la pestaña "Información económica".',
    },
    nota_economico_py: {
        type: String,
        default:
            "Los costos de contruccion fueron obtenidas de diferentes constructoras que operan en el mercado, por lo general estas empresas trabajan con una tarifa fija de contrucción $us/m2 que viene determinada por el mercado tradicional.",
    },

    titulo_construccion_inm: { type: String, default: "Construcción sin sobreprecios" },
    texto_construccion_inm: {
        type: String,
        default:
            'La ejecución de nuestros proyectos son llevados a cabo con el uso eficiente de los recursos materiales y humanos, sumandose una optimización en las diferentes tareas de construcción, eliminando todo aquello que pueda conducir al encarecimiento innecesario del producto, cumpliendo con las normas y sin descuidar la calidad de nuestros inmuebles. Para mas información, ponemos a disposicion de nuestros potenciales inversores los detalles del Presupuesto de contruccion del proyecto, en la pestaña "Información económica".',
    },
    nota_construccion_inm: {
        type: String,
        default:
            "Los costos de construcción fueron obtenidas de diferentes constructoras que operan en el mercado. Por lo general estas empresas trabajan con una tarifa fija de contrucción $us/m2 que viene determinada por el mercado tradicional.",
    },

    titulo_precio_inm: { type: String, default: "Precio económico" },
    texto_precio_inm: {
        type: String,
        default:
            "En comparación a otros inmuebles de la zona, el precio es económico, ademas de tratarse de un inmueble  completamente nuevo",
    },

    titulo_plusvalia_inm: { type: String, default: "Plusvalía de regalo" },
    texto_plusvalia_inm: {
        type: String,
        default:
            "Nuestro inmueble cuenta con plusvalía valorada de mercado, misma que llegaría a ser ganancia potencial para los compradores.",
    },

    titulo_economico_inm: { type: String, default: "Resumen económico" },
    texto_economico_inm: {
        type: String,
        default:
            "La ejecución de nuestros proyectos son llevados a cabo con el uso eficiente de los recursos materiales y humanos, sumandose una optimización en las diferentes tareas de construcción, eliminando todo aquello que pueda conducir al encarecimiento innecesario del producto, cumpliendo con las normas y sin descuidar la calidad de nuestros inmuebles.",
    },
    nota_economico_inm: {
        type: String,
        default:
            "Los costos de contruccion fueron obtenidas de diferentes constructoras que operan en el mercado, por lo general estas empresas trabajan con una tarifa fija de contrucción $us/m2 que viene determinada por el mercado tradicional.",
    },

    // mensajes que estaran debajo del segundero visto en las ventanas de:PROYECTO y sus INMUEBLES
    mensaje_segundero_py_inm_a: {
        type: String,
        default:
            "Con SOLIDEXA veraz crecer tus ganancias segundo a segundo, adquiere tu inmueble y benefíciate de las plusvalías del mercado.",
    }, // para las etapas de: Reserva, Pago, Aprobación y Construcción

    mensaje_segundero_py_inm_b: {
        type: String,
        default:
            "Proyecto finalizado con éxito, gracias a todos los propietarios por confiar en nosotros.",
    }, // para las etapa de: Construido

    // mensajes que estaran debajo del segundero RECOMPENSA visto en las ventanas de:PROYECTO y sus INMUEBLES
    mensaje_segundero_py_inm_c: {
        type: String,
        default:
            "Con SOLIDEXA obtienes ganancias mientras se tramitan los permisos necesarios para la construcción.",
    }, // para las etapas de: Reserva, Pago y Aprobación

    mensaje_segundero_py_inm_d: {
        type: String,
        default:
            "Ganancia generada por el tiempo de espera hasta la obtencion de los permisos de construcción.",
    }, // para las etapaS de: Construcción Y Construido

    nota_precio_justo: {
        type: String,
        default: "Precio Justo sin intermediarios, para nuestra poblacion",
    }, // Valido para Proyecto e Inmuebles de dicho proyecto

    //----------------------------------------------------------------
    // parte de RESPONSABILIDAD SOCIAL DEL PROYECTO
    beneficiario_rs: { type: String, default: "" },
    descripcion_rs: { type: String, default: "" },
    monto_dinero_rs: { type: Number, default: 0 },
    link_youtube_rs: { type: String, default: "" },
    fecha_entrega_rs: { type: Date, default: "" },

    // TABLA DE RESPONABILIDAD SOCIAL DEL PROYECTO
    // [ [#, item, unidad, pu $us, cantidad, total $us] , ... , [#, ..., ..., ..., ..., ...] ]
    tabla_rs_proyecto: { type: Array, default: [] },

    existe_rs: { type: Boolean, default: false },

    //----------------------------------------------------------------
    // parte de REQUERIMIENTOS (MATERIALES, SERVICIOS)
    nota_no_requerimientos: {
        type: String,
        default:
            "El presente proyecto actualmente no cuenta con requerimientos, por favor consulte en otros proyectos de la plataforma o bien puede hacerlo a traves del buscador",
    }, // texto que ira cuando no se necesitan requerimientos, ya sea porque el py no lo necesita aun o este esta completamente terminado.

    nota_si_requerimientos: {
        type: String,
        default:
            "Deseamos contribuir en el mejoramiento economico de las familias bolivianas, es por ello que presentamos oportunidades de empleo por medio de la adquisicion de servicios, insumos, materiales, etc. Envie su propuesta por medio de WhatsApp al número ####### tambien puede comunicarse a dicho número en caso de que requiera mayor infomación",
    },
    existe_requerimientos: { type: Boolean, default: false }, // para mostrar la visibilidad de la tabla de requerimientos

    //----------------------------------------------------------------
    // parte de EMPLEOS GENERADOS DEL PROYECTO
    descripcion_empleo: { type: String, default: "" },

    // TABLA DE EMPLEOS PARA LA SOCIEDAD
    // [ [#, beneficiario, directo/directo, cantidad, beneficio $us] , ... ,  [#,...,...,...,...]  ]
    tabla_empleos_sociedad: { type: Array, default: [] },

    //----------------------------------------------------------------
    // numero de vistas, segun la ventana abierta
    v_descripcion: { type: Number, default: 0 },
    v_inmuebles: { type: Number, default: 0 },
    v_garantias: { type: Number, default: 0 },
    v_beneficios: { type: Number, default: 0 },
    v_info_economico: { type: Number, default: 0 },
    v_empleos: { type: Number, default: 0 },
    v_resp_social: { type: Number, default: 0 },
    v_requerimientos: { type: Number, default: 0 },
    // ----------------------------------------------------------------
});

module.exports = mongoose.model("proyectoModelo", proyectoEsquema);
