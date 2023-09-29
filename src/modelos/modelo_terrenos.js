// contendra el modelo de TERRENOS EN CONVOCATORIA ABIERTA para recepcionar ANTEPROYECTOS

const mongoose = require("mongoose");

const { Schema } = mongoose;

const terrenosEsquema = new Schema({
    codigo_terreno: { type: String, default: "" }, // codigo del TERRENO
    estado_terreno: { type: String, default: "guardado" }, // guardado, reserva, pago, aprobacion, construccion, construido

    proyecto_ganador: { type: String, default: "" }, // codigo del proyecto que entra en la etapa de PAGO, APROBACION, CONSTRUCCION, CONSTRUIDO

    anteproyectos_maximo: { type: Number, default: 3 }, // numero maximo de ANTEPROYECTOS
    anteproyectos_registrados: { type: Number, default: 0 }, // numero de ANTEPROYECTOS registrados
    convocatoria_disponible: { type: Boolean, default: true }, // "true" cuando aun queda espacio para recibir ANTEPROYECTOS, "false" cuando todo esta OCUPADO

    fecha_creacion: { type: Date, default: Date.now }, // util solo para mostrar "hace x dias" en la cabezera adm en estado de GUARDADO

    acceso_bloqueado: { type: Boolean, default: false }, // false, porque al inicio no estara DESbloqueado

    /**--------------------------------------------------- */
    // tiempo de duracion 90 dias (para recibir anteproyectos de edificios para el terreno y para recibir RESERVACIONES sobre inmuebles de anteproyectos que dispone el terreno)
    fecha_inicio_reserva: { type: Date, default: "" },
    fecha_fin_reserva: { type: Date, default: "" },

    // tiempo de duracion 6 meses
    fecha_inicio_aprobacion: { type: Date, default: "" },
    fecha_fin_aprobacion: { type: Date, default: "" },

    // tiempo de duracion 10 dias
    fecha_inicio_pago: { type: Date, default: "" },
    fecha_fin_pago: { type: Date, default: "" },
    /**-------------------------------------------------- */

    // imagino que sera la fechas pertenecientes al proyecto ganador
    fecha_inicio_construccion: { type: Date, default: "" },
    fecha_fin_construccion: { type: Date, default: "" },
    /**--------------------------------------------------- */

    ciudad: { type: String, default: "" }, // ciudad (departamento) donde esta ubicado el TERRENO: Beni, Chuquisaca, Cochabamba, La Paz, Oruro, Pando, Potosí, Santa Cruz, Tarija
    bandera_ciudad: { type: String, default: "" }, // bandera de la ciudad elegida ya esta con su .extension
    provincia: { type: String, default: "" },
    direccion: { type: String, default: "" },
    precio_sus: { type: Number, default: 0 },
    superficie: { type: Number, default: 0 },
    maximo_pisos: { type: Number, default: 0 }, // Número máximo de pisos permitido en ese terreno por normativas

    convocatoria: { type: String, default: "Aun estas a tiempo para presentar tu Anteproyecto. Si tu Anteproyecto resulta ser el ganador, entonces se procedera a su construcción sobre el presente terreno." },

    importante: { type: String, default: "A todos los Desarrolladores que presenten sus Anteproyectos en la plataforma de SOLIDEXA, les informamos que su trabajo y propiedad intelectual serás debidamente protegidas" },

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

    // ----------------------------------------------------------------
    // numero de vistas, segun la ventana abierta SOLO VALIDOS PARA VADO CLIENTE
    v_descripcion: { type: Number, default: 0 },
    v_proyectos: { type: Number, default: 0 },
    // ----------------------------------------------------------------
    
});

module.exports = mongoose.model("terrenosModelo", terrenosEsquema);