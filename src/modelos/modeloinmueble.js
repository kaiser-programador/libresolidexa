// MODELO DE DATOS PARA TIPO "INMUEBLE ENTERO" y "COLECTIVO"

const mongoose = require("mongoose");

const { Schema } = mongoose;

const inmuebleEsquema = new Schema({
    codigo_terreno: { type: String, default: "" },
    codigo_proyecto: { type: String, default: "" },
    codigo_inmueble: { type: String, default: "" },
    ciudad: { type: String, default: "" }, // util para busquedas de inmuebles por ciudad

    ci_propietario: { type: String, default: "" }, // ci del propietario actual (que lo tiene reservado) o final, en caso de que no exista entonces estara vacio ""

    // guardado, disponible, reservado, pendiente_pago, pagado_pago, pendiente_aprobacion, pagos (construccion), remate, completado (construido)
    estado_inmueble: { type: String, default: "guardado" }, //
    fecha_creacion: { type: Date, default: Date.now },

    // NO EXISTE FECHA INICIO Y FIN DE REMATE EN INMUEBLE, PORQUE SI ENTRA EN REMATE, ESTARA EN ESE ESTADO HASTA QUE LOGRE SER COMPRADO POR UN NUEVO PROPIETARIO, ASI QUE EL CAMBIO DE ESTADO DE REMATE SE LO HARA MANUALMENTE DESDE EL LADO DEL GESTIONADOR

    valor_reserva: { type: Number, default: 0 }, // que requiere el inmueble en $us

    tipo_inmueble: { type: String, default: "" }, // Departamento, Oficina, Comercial, Casa
    torre: { type: String, default: "" },
    piso: { type: Number, default: 0 }, // Importante, para que se los resultados sean ordenados por num. piso
    puerta_inmueble: { type: String, default: "" }, // AQUELLO QUE ESTARA EN SUS PUERTAS (ej/ 1A  ,  5B)
    superficie_inmueble_m2: { type: Number, default: 0 },
    dormitorios_inmueble: { type: Number, default: 0 }, // numero de dormitorios del inmueble (incluye el de la suit)
    banos_inmueble: { type: Number, default: 0 }, // numero de baños del inmueble (incluye el de la suit)
    garaje_inmueble: { type: Number, default: 0 },
    inmueble_descripcion: { type: String, default: "" },

    // ------------------------------------------------------------
    // es el precio de venta, de un imueble similar a nuestro inmueble que es vendido por LA COMPETENCIA, importante que este precio debe ser SUPERIOR al precio de SOLIDEXA
    // TAMBIEN ES IMPORTANTE QUE ESTE PRECIO SEA IGUAL AL PROMEDIO DE LOS PRECIOS COMPARTIVOS DE INMUEBLE DEL MERCADO QUE ESTAN ALMACENADOS EN "precio_comparativa"
    precio_competencia: { type: Number, default: 0 },

    // ------------------------------------------------------------
    // el el precio de contruccion del inmueble o PRECIO JUSTO, incluido el costo de derechos de terreno
    precio_construccion: { type: Number, default: 100 },

    // ------------------------------------------------------------
    // el valor en BS. del valor de recompensa por el tiempo de espera del inmueble hasta el inicio de su contruccion
    recompensa: { type: Number, default: 0 }, // en moneda nacional "Bs"

    // ------------------------------------------------------------

    plusvalia_sus: { type: Number, default: 0 }, //  ( = precio mercado corriente de inmueble similares - precio construccion SOLIDEXA)

    titulo_descripcion_1: { type: String, default: "" }, // posible "informacion general *****"
    varios_descripcion_1: { type: String, default: "" }, // posible "informacion general *****"

    titulo_descripcion_2: { type: String, default: "" }, // posible "servicios *****"
    varios_descripcion_2: { type: String, default: "" }, // posible "servicios *****"

    titulo_descripcion_3: { type: String, default: "" }, // posible "areas comunes *****"
    varios_descripcion_3: { type: String, default: "" }, // posible "areas comunes *****"

    titulo_descripcion_4: { type: String, default: "" }, // posible "adicionales *****"
    varios_descripcion_4: { type: String, default: "" }, // posible "adicionales *****"

    titulo_descripcion_5: { type: String, default: "" }, // posible "acabados de calidad"
    varios_descripcion_5: { type: String, default: "" }, // posible "acabados de calidad"

    link_youtube_inmueble: { type: String, default: "" }, // sera la direccion link del video en youtube

    direccion_comparativa: { type: Array, default: [] },
    m2_comparativa: { type: Array, default: [] },
    precio_comparativa: { type: Array, default: [] },

    titulo_garantia_1: { type: String, default: "" }, // posible "fiduciaria"
    garantia_1: { type: String, default: "" }, // posible "fiduciaria"

    titulo_garantia_2: { type: String, default: "" }, // posible "hipotecaria"
    garantia_2: { type: String, default: "" }, // posible "hipotecaria"

    titulo_garantia_3: { type: String, default: "" }, // posible "Colectivo A"
    garantia_3: { type: String, default: "" }, // posible "Colectivo A"

    // -----------------------------------------------------------------------
    // false, porque de inicio el inmueble no estara en remate, solo estara cuando el propietario incumpla con el pago mensual de su inmueble
    inmueble_remate: { type: Boolean, default: false },
    penalizacion_inm: { type: Number, default: 0 }, // el valor de penalizacion que actualmente tiene el inmueble que se encuentra en remate y que debera perder el propitario que incumplio con los pagos
    // -----------------------------------------------------------------------
    // acumulador de penalizaciones actuales de propietarios irresponsables
    acumulador_penalizaciones: { type: Number, default: 0 },

    //----------------------------------------------------------------
    // numero de vistas, segun la ventana abierta
    v_descripcion: { type: Number, default: 0 },
    v_garantias: { type: Number, default: 0 },
    v_beneficios: { type: Number, default: 0 },
    v_info_economico: { type: Number, default: 0 },
    v_empleos: { type: Number, default: 0 },
    v_inversor: { type: Number, default: 0 },
    // ----------------------------------------------------------------
});

module.exports = mongoose.model("inmuebleModelo", inmuebleEsquema);
