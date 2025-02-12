// contendra el modelo de TERRENOS EN CONVOCATORIA ABIERTA para recepcionar ANTEPROYECTOS

const mongoose = require("mongoose");

const { Schema } = mongoose;

const terrenosEsquema = new Schema({

    codigo_terreno: { type: String, default: "" }, // codigo del TERRENO

    // ubicacion del TERRENO puede ser ejemplo: OTB Vertiente 1, OTB Vertiente 2, Pacata Alta. Un nombre que sirva de referencia
    ubicacion: { type: String, default: "" }, 

    estado_terreno: { type: String, default: "guardado" }, // guardado, convocatoria, anteproyecto, reservacion, construccion, construido

    convocatoria_disponible: { type: Boolean, default: true }, // "true" cuando aun queda espacio para recibir ANTEPROYECTOS, "false" cuando todo esta OCUPADO

    fecha_creacion: { type: Date, default: Date.now }, // util solo para mostrar "hace x dias" en la cabezera adm en estado de GUARDADO

    acceso_bloqueado: { type: Boolean, default: false }, // false, porque al inicio no estara DESbloqueado

    /**--------------------------------------------------- */
    // SI ANTES DEL PLAZO PREVISTO DE FRACCIONES, EL TERRENO VENDIO EL 100% DE LAS FRACCIONES, ENTONCES INMEDIATAMENTE DEBERA CAMBIARSE SU ESTADO DE "FRACCIONES" AL ESTADO INMEDIATO DE "ANTEPROYECTO", DE MODO QUE TAMBIEN DEBERAN ACTUALIZARSE LAS FECHAS INICIO Y FIN DE LOS SIGUIENTES ESTADOS DEL TERRENO.
    // Tiempo 1 mes para vender las fracciones de terreno
    fecha_inicio_convocatoria: { type: Date, default: "" },
    fecha_fin_convocatoria: { type: Date, default: "" },

    // tiempo 1 mes para la elaboracion del anteproyecto arquitectonico
    fecha_inicio_anteproyecto: { type: Date, default: "" },
    fecha_fin_anteproyecto: { type: Date, default: "" },

    // tiempo 6 meses para conseguir los permisos de construccion
    fecha_inicio_reservacion: { type: Date, default: "" },
    fecha_fin_reservacion: { type: Date, default: "" },

    // tiempo X meses dependiendo de la magnitud del proyecto a construir
    fecha_inicio_construccion: { type: Date, default: "" },
    fecha_fin_construccion: { type: Date, default: "" },
    /**--------------------------------------------------- */

    ciudad: { type: String, default: "" }, // ciudad (departamento) donde esta ubicado el TERRENO: Beni, Chuquisaca, Cochabamba, La Paz, Oruro, Pando, Potosí, Santa Cruz, Tarija
    bandera_ciudad: { type: String, default: "" }, // bandera de la ciudad elegida ya esta con su .extension
    provincia: { type: String, default: "" },
    direccion: { type: String, default: "" },
    precio_bs: { type: Number, default: 0 }, // ya considera el descuento del terreno
    descuento_bs: { type: Number, default: 0 },
    superficie: { type: Number, default: 0 },
    maximo_pisos: { type: Number, default: 0 }, // Número máximo de pisos permitido en ese terreno por normativas

    //-----------------------------------------------------------
    // estos campos estaran visualizados en la pestaña fracciones de terreno

    fraccion_bs: { type: Number, default: 0 }, // bs precio unitario de la fraccion de terreno.

    rend_fraccion_mensual: { type: Number, default: 2 }, // rendimiento mensual% de la fraccion de terreno (2)
    rend_fraccion_total: { type: Number, default: 16 }, // rendimiento total% de la fraccion de terreno (16)

    // 240 dias maximo === 8 meses maximo
    
    dias_maximo: { type: Number, default: 240 }, // (240) numero de dias maximo que ganaran rendimientos las fracciones de terreno que actuen como tipo "inversionista"

    meses_maximo: { type: Number, default: 8 }, // (8) numero de meses maximo que ganaran rendimientos las fracciones de terreno que actuen como tipo "inversionista". 8 = 1 mes de campaña convocatoria del terreno, + 1 mes de desarrollo de anteproyecto + 6 meses reservacion (tramites en la alcaldia para la optencion de permisos e construccion)

    //-----------------------------------------------------------

    convocatoria: {
        type: String,
        default:
            "Invierte en fracciones de terreno para convertirte en copropietario del terreno y obtener ganancias superiores.",
    },

    importante: {
        type: String,
        default:
            "Invierte en fracciones de terreno con xyz, la plataforma que democratiza las inversiones inmobiliarias. Ya no necesitas grandes capitales; ahora puedes empezar con pequeñas fracciones y ser parte del mercado inmobiliario.",
    },

    descri_ubi_terreno: { type: String, default: "" },

    titulo_ubi_otros_1: { type: String, default: "" }, // posible "Avenidas principales"
    ubi_otros_1: { type: String, default: "" }, // posible "Avenidas principales"

    titulo_ubi_otros_2: { type: String, default: "" }, // posible "Puntos de interes"
    ubi_otros_2: { type: String, default: "" }, // posible "Puntos de interes"

    titulo_ubi_otros_3: { type: String, default: "" }, // posible "Plazas comerciales"
    ubi_otros_3: { type: String, default: "" }, // posible "Plazas comerciales"

    link_googlemap: { type: String, default: "" },

    link_youtube: { type: String, default: "" },
    link_facebook: { type: String, default: "" },
    link_instagram: { type: String, default: "" },
    link_tiktok: { type: String, default: "" },

    //--------------------------------------------------------
    // terreno tradicionales en la zona donde se encuentra el terreno SOLIDEXA, se tomaran 4 terrenos tradicionales
    direccion_comparativa: { type: Array, default: [] },
    m2_comparativa: { type: Array, default: [] },
    precio_comparativa: { type: Array, default: [] },

    // ----------------------------------------------------------------
    // numero de vistas, segun la ventana abierta SOLO VALIDOS PARA VADO CLIENTE
    v_descripcion: { type: Number, default: 0 },
    v_fracciones: { type: Number, default: 0 },
    v_proyectos: { type: Number, default: 0 },
    v_calculadora: { type: Number, default: 0 },
    v_fracciones: { type: Number, default: 0 },
    // ----------------------------------------------------------------
});

module.exports = mongoose.model("terrenosModelo", terrenosEsquema);
