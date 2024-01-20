// INFORMACIÓN PRINCIPAL DE LA EMPRESA

const mongoose = require("mongoose");

const { Schema } = mongoose;

const empresaEsquema = new Schema({
    nombre_empresa: { type: String, default: "" },
    mision_vision: { type: String, default: "Construir viviendas al alcancé de tod@s" },
    texto_footer: { type: String, default: "Create by: Ing. M. Cesar V. Canaviri" }, // para lado ADMINISTRADOR

    texto_inicio_principal: {
        type: String,
        default: "Edificando el futuro inmobiliario con entrega y eficiencia",
    },

    //-----------------------------------------------------------------
    // numero para las ventanas de inicio de ADMINISTRADOR y CLIENTE (el tipo es string, porque en la base de datos seran guardados con punto separador de mil)
    n_construidos: { type: String, default: "" },
    n_proyectos: { type: String, default: "" },
    n_inmuebles: { type: String, default: "" },
    n_empleos: { type: String, default: "" },
    n_ahorros: { type: String, default: "" },
    n_resp_social: { type: String, default: "" },

    //-----------------------------------------------------------------
    // para la ventana de EMPLEOS DE py e inm (lado cliente)
    significado_py_propietarios: {
        type: String,
        default: "Los /py_nfp/ propietarios que conforman el presente proyecto y sus respectivas familias se benefician con una plusvalía de regalo equivalente a /py_dfp/ $us.",
    },
    significado_py_empresa: {
        type: String,
        default: "Mediante el presente proyecto, /nom_empre/ genera /py_inm_nfe/ trabajos directos, contribuyendo de esta manera a mejorar la situación económica de las familias bolivianas por un valor de /py_dfe/ $us.",
    },
    significado_py_pais: {
        type: String,
        default: "Mediante el presente proyecto, /nom_empre/ genera /py_inm_nfb/ trabajos indirectos, contribuyendo de esta manera en el mejoramiento de la situación económica de nuestro país por un valor de /py_dfb/ $us.",
    },

    significado_inm_propietarios: {
        type: String,
        default: "El propietario del presente inmueble y su respectiva familia se benefician con una  plusvalía de regalo equivalente a /inm_dfp/ $us.",
    },
    significado_inm_empresa: {
        type: String,
        default: "Mediante el presente inmueble, /nom_empre/ genera /py_inm_nfe/ trabajos directos, contribuyendo de esta manera a mejorar la situación económica de las familias bolivianas por un valor de /inm_dfe/ $us.",
    },
    significado_inm_pais: {
        type: String,
        default: "Mediante el presente inmueble, /nom_empre/ genera /py_inm_nfb/ trabajos indirectos, contribuyendo de esta manera en el mejoramiento de la situación económica de nuestro país por un valor de /inm_dfb/ $us.",
    },

    //-----------------------------------------------------------------
    texto_segundero_py: {
        type: String,
        default:
            "Tan solo pagando la suma de <strong>/sus_precio/ $us</strong> obtienes inmueble(s), que en el mercado tendra(n) un valor de <strong>/sus_total/ $us</strong>, obteniendo de esta manera <strong>/sus_plusvalia/ $us</strong> de plusvalía como regalo",
    },
    texto_segundero_inm: {
        type: String,
        default:
            "Tan solo pagando la suma de <strong>/sus_precio/ $us</strong> obtienes inmueble(s), que en el mercado tendra(n) un valor de <strong>/sus_total/ $us</strong>, obteniendo de esta manera <strong>/sus_plusvalia/ $us</strong> de plusvalía como regalo",
    },

    // TEXTO QUE IRA DEBAJO DE LOS ICONOS DE MANO CON DINERO Y CALENDARIO (LADO DERECHO DE RECOMPENSA) VALIDO TANTO PARA INMUEBLE COMO PARA PROYECTO
    texto_segundero_recom_inm_py: {
        type: String,
        default:
            "la espera de <strong>/n_meses/ meses</strong> te genera una ganancia de <strong>/bs_espera/ Bs</strong>.",
    },

    // mensaje del segundero del propietario que sera vista (en el lado DERECHO) en la cuenta del propietario (no influye si el propietario tiene varios inmuebles, que estos esten en reserva, construccion, etc)
    texto_segundero_prop: {
        type: String,
        default:
            "Tan solo pagando la suma de <strong>/sus_precio/ $us</strong> obtienes inmueble(s), que en el mercado tendra(n) un valor de <strong>/sus_total/ $us</strong>, obteniendo de esta manera <strong>/sus_plusvalia/ $us</strong> de plusvalía como regalo",
    },

    // mensaje del segundero del propietario que sera vista (en el lado IZQUIERDO) en la cuenta del propietario (no influye si el propietario tiene varios inmuebles, que estos esten en reserva, construccion, etc)
    texto_segundero_prop_iz: {
        type: String,
        default:
            "<strong>/nom_propietario/</strong> el tiempo no se detiene y tus ganancias tampoco, tu inversión genera ganancias para ti segundo a sengundo.",
    },

    // mensaje del segundero RECOMPENSA del propietario que sera vista (en el lado IZQUIERDO) en la cuenta del propietario (no influye si el propietario tiene varios inmuebles, que estos esten en reserva, construccion, etc)
    texto_segundero_prop_recom_iz: {
        type: String,
        default:
            "<strong>/nom_propietario/</strong> el tiempo de espera no tiene que ser una perdida de tiempo ni de dinero, mira como crecen tus ganancias segundo a segundo.",
    },

    // mensaje del segundero DERECHO del propietario que sera vista (en el lado DERECHO) en la cuenta del propietario (no influye si el propietario tiene varios inmuebles, que estos esten en reserva, construccion, etc)
    texto_segundero_prop_recom_de: {
        type: String,
        default:
            "la espera de <strong>/n_meses/ meses</strong> te genera una ganancia de <strong>/bs_espera/ Bs</strong>.",
    },

    //-----------------------------------------------------------------
    whatsapp: { type: String, default: "" },
    telefono_fijo: { type: String, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" },
    direccion: { type: String, default: "" },
    year_derecho: { type: String, default: "" },

    encabezado_somos: { type: String, default: "Quienes somos?" },
    texto_somos: { type: String, default: "Democratizando el mercado inmobiliario" },

    encabezado_funciona: { type: String, default: "Lo hacemos fácil para tí" },
    texto_funciona: {
        type: String,
        default:
            "Ahora con SOLIDEXA, tendras al tu alcanze inmuebles a precio justo del mercado.",
    },

    // [{pregunta:....,respuesta:...}, ... , {pregunta:....,respuesta:...}]
    preguntas_frecuentes: { type: Array, default: "" },

    encabezado_preguntas: { type: String, default: "" },
    texto_preguntas: { type: String, default: "" },

    // [{termino:....,texto:...}, ... , {termino:....,texto:...}]
    //terminos_condiciones: { type: Array, default: '' },

    encabezado_guardado_terreno: { type: String, default: "Terrenos guardados" },
    texto_guardado_terreno: { type: String, default: "Terrenos en espera de lanzamiento" },
    inexistente_guardado_terreno: { type: String, default: "No existen Terrenos guardados" },

    encabezado_guardado_proyecto: { type: String, default: "Proyectos guardados" },
    texto_guardado_proyecto: { type: String, default: "Proyectos en espera de lanzamiento" },
    inexistente_guardado_proyecto: { type: String, default: "No existen Proyectos guardados" },

    encabezado_guardado_inmueble: { type: String, default: "Inmuebles guardados" },
    texto_guardado_inmueble: { type: String, default: "Inmuebles en espera de lanzamiento" },
    inexistente_guardado_inmueble: { type: String, default: "No existen Inmuebles guardados" },

    encabezado_convocatoria: { type: String, default: "Convocatoria pública" },
    texto_convocatoria: { type: String, default: "Registra tu anteproyecto arquitectónico" },
    inexistente_convocatoria: {
        type: String,
        default: "No existen propuestas de anteproyectos arquitectónicos",
    },

    encabezado_reserva: { type: String, default: "Proyectos en reserva" },
    texto_reserva: { type: String, default: "Reserva tu inmueble" },
    inexistente_reserva: { type: String, default: "No existen Proyectos reservados" },

    encabezado_aprobacion: { type: String, default: "Proyectos en solicitud de aprobación" },
    texto_aprobacion: {
        type: String,
        default: "Proyecto en proceso de autorizacion y aprobación de contrucción",
    },
    inexistente_aprobacion: { type: String, default: "No existen Proyectos en etapa de aprobación" },

    encabezado_pago: { type: String, default: "Proyectos en espera de pago" },
    texto_pago: { type: String, default: "Proyectos reservado en espera de pago total" },
    inexistente_pago: { type: String, default: "No existen Proyectos con pagos" },

    encabezado_construccion: { type: String, default: "Proyectos en construcción" },
    texto_construccion: {
        type: String,
        default: "Construyendo inmuebles a precio justo",
    },
    inexistente_construccion: {
        type: String,
        default: "No existen Proyectos en construcción",
    },

    encabezado_construido: { type: String, default: "Proyectos construidos" },
    texto_construido: { type: String, default: "Obras que entran por los ojos" },
    inexistente_construido: {
        type: String,
        default:
            "Los proyectos que lleguen a completar el 100% de su construcción, pasaran a formar parte como proyectos CONTRUIDOS.",
    },
});

module.exports = mongoose.model("empresaModelo", empresaEsquema);
