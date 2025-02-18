/** SE ENCARGARA DE CONSTRUIR LOS DATOS NECESARIOS EN EL ORDEN EN EL QUE SE DESEA */

const {
    indiceTerreno,
    indiceProyecto,
    indiceImagenesProyecto,
    indiceInmueble,
    indiceHistorial,
    indiceAdministrador,
    indiceImagenesTerreno,
    indiceFraccionTerreno,
    indiceFraccionInmueble,
    indiceGuardados,
    indiceInversiones,
} = require("../modelos/indicemodelo");

const { numero_punto_coma } = require("./funcionesayuda_3");
const {
    super_info_inm,
    super_info_py,
    super_info_te,
    super_info_fraccion,
} = require("./funcionesayuda_5");

const funcionesAyuda_1 = {};

/************************************************************************************ */
/************************************************************************************ */
// VERIFICADOR TERRENO BLOQUEADO
funcionesAyuda_1.verificadorTerrenoBloqueado = async function (codigo_terreno) {
    // ------- Para verificación -------
    //console.log("el codigo del terreno para ver si esta bloquado");
    //console.log(codigo_terreno);
    var acceso_terreno = await indiceTerreno.findOne(
        { codigo_terreno: codigo_terreno },
        { acceso_bloqueado: 1 }
    );

    if (acceso_terreno.acceso_bloqueado) {
        // si es TRUE, significa que esta BLOQUEADO
        return "denegado";
    } else {
        // si es FALSE, significa que esta DESbloqueado
        return "permitido";
    }
};

/************************************************************************************ */
/************************************************************************************ */
// VERIFICADOR LLAVES MAESTRAS
funcionesAyuda_1.verificadorLlavesMaestras = async function (paquete_datos) {
    var usuario_maestro = paquete_datos.usuario_maestro;
    var clave_maestro = paquete_datos.clave_maestro;

    // revision de la cuenta del usuario
    const usuario_validado = await indiceAdministrador.findOne({
        ad_usuario: usuario_maestro,
        clase: "maestro",
    });

    if (usuario_validado) {
        // revision de la contraseña del usuario
        const contrasena_validada = await usuario_validado.compararContrasena(clave_maestro);
        if (contrasena_validada) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

/*************************************************************************************/
/************************************************************************************ */
// REGISTRO EN HISTORIAL DE ACCIONES DE ADMINISTRADORES

funcionesAyuda_1.guardarAccionAdministrador = async function (aux_accion_adm) {
    var ci = aux_accion_adm.ci_administrador; // extraido de la SESION guardada del administrador
    var accion = aux_accion_adm.accion_administrador;
    const accionHistorial = new indiceHistorial({
        ci_administrador: ci,
        accion_historial: accion,
    });
    await accionHistorial.save();
};

/*************************************************************************************/
/*************************************************************************************/
// ARMADOR DEL CARD DE UN PROYECTO (INTERNO y EXTERNO) (CLIENTE y ADMINISTRADOR)
// paquete_terreno = {codigo_terreno,laapirest}
funcionesAyuda_1.terreno_card_adm_cli = async function (paquete_terreno) {
    try {
        var codigo_terreno = paquete_terreno.codigo_terreno;
        var registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                codigo_terreno: 1,
                ubicacion: 1,
                ciudad: 1,
                bandera_ciudad: 1,
                provincia: 1,
                direccion: 1,
                precio_bs: 1,
                fraccion_bs: 1,
                superficie: 1,
                link_youtube: 1,
                link_facebook: 1,
                link_instagram: 1,
                link_tiktok: 1,
                estado_terreno: 1,
                fecha_creacion: 1,

                fecha_inicio_convocatoria: 1,
                fecha_fin_convocatoria: 1,
                fecha_inicio_anteproyecto: 1,
                fecha_fin_anteproyecto: 1,
                fecha_inicio_reservacion: 1,
                fecha_fin_reservacion: 1,
                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,
                _id: 0,
            }
        );

        if (registro_terreno) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_terreno);
            // reconversion del "string" a "objeto"
            var terreno_card = JSON.parse(aux_string);

            terreno_card.superficie = numero_punto_coma(registro_terreno.superficie);
            terreno_card.superficie_num = registro_terreno.superficie;
            terreno_card.precio_bs = numero_punto_coma(registro_terreno.precio_bs);
            terreno_card.precio_bs_num = registro_terreno.precio_bs;
            terreno_card.fraccion_bs_r = numero_punto_coma(registro_terreno.fraccion_bs);

            terreno_card.laapirest = paquete_terreno.laapirest;

            var paquete_tiempo = {
                estado_terreno: registro_terreno.estado_terreno,
                fecha_creacion: registro_terreno.fecha_creacion,
                fecha_inicio_convocatoria: registro_terreno.fecha_inicio_convocatoria,
                fecha_fin_convocatoria: registro_terreno.fecha_fin_convocatoria,
                fecha_inicio_anteproyecto: registro_terreno.fecha_inicio_anteproyecto,
                fecha_fin_anteproyecto: registro_terreno.fecha_fin_anteproyecto,
                fecha_inicio_reservacion: registro_terreno.fecha_inicio_reservacion,
                fecha_fin_reservacion: registro_terreno.fecha_fin_reservacion,
                fecha_inicio_construccion: registro_terreno.fecha_inicio_construccion,
                fecha_fin_construccion: registro_terreno.fecha_fin_construccion,
            };

            var datos_tiempo = funcion_datos_tiempo(paquete_tiempo);

            // ya considera el estado del terreno: guardado, reserva, pago, contruccion y construido
            terreno_card.vencimiento = datos_tiempo.fecha; // para ORDENAMIENTO

            //----------------------------------------------------------------------

            var datos_inm = {
                // datos del terreno
                codigo_terreno,
                precio_terreno: registro_terreno.precio_bs,
                fecha_fin_convocatoria: registro_terreno.fecha_fin_convocatoria,
            };
            var resultado = await super_info_te(datos_inm);

            var fracciones_disponibles = resultado.fracciones_disponibles;
            var fracciones_invertidas = resultado.fracciones_invertidas;
            var plazo_titulo = resultado.plazo_titulo;
            var plazo_tiempo = resultado.plazo_tiempo;
            var meta = resultado.meta;
            var meta_render = resultado.meta_render;
            var financiamiento = resultado.financiamiento;
            var financiamiento_render = resultado.financiamiento_render;
            var p_financiamiento = resultado.p_financiamiento;
            var p_financiamiento_render = resultado.p_financiamiento_render;
            var fraccion = resultado.fraccion; // bs
            var fraccion_render = resultado.fraccion_render; // bs

            //-------------------------------------------------------------------
            terreno_card.disponibles = fracciones_disponibles; // para ORDENAMIENTO
            terreno_card.porcentaje = p_financiamiento;
            terreno_card.porcentaje_render = p_financiamiento_render;
            terreno_card.financiado = financiamiento;
            terreno_card.financiado_num = financiamiento_render;
            terreno_card.meta = meta_render;
            terreno_card.meta_num = meta;
            terreno_card.factor_tiempo_titulo = plazo_titulo;
            terreno_card.factor_tiempo_tiempo = plazo_tiempo;
            terreno_card.fraccion = fraccion;
            terreno_card.fraccion_render = fraccion_render;

            //----------------------------------------------------------------------
            // Para encontrar la imagen principal del terreno

            var registro_ima_te = await indiceImagenesTerreno.findOne(
                { codigo_terreno: codigo_terreno, imagen_principal: true },
                {
                    nombre_imagen: 1,
                    codigo_imagen: 1,
                    extension_imagen: 1, // ej: ".jpg"
                    url: 1,
                    _id: 0,
                }
            );

            if (registro_ima_te) {
                //var imagen_terreno = registro_ima_te.codigo_imagen + registro_ima_te.extension_imagen;
                terreno_card.imagen_terreno = registro_ima_te.url;
                terreno_card.imagen_encontrado = true;
            } else {
                terreno_card.imagen_encontrado = false;
            }
            //----------------------------------------------------------------------

            return terreno_card;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

//====================================================================================
//====================================================================================
// ARMADOR DEL CARD DE UNA FRACCION (INTERNO y EXTERNO) (LADO: CLIENTE y ADMINISTRADOR)
// paquete_fraccion = {codigo_fraccion,inmueble,codigo_usuario,tipo_navegacion}
funcionesAyuda_1.fraccion_card_adm_cli = async function (paquete_fraccion) {
    try {
        var codigo_fraccion = paquete_fraccion.codigo_fraccion;
        var ci_propietario = paquete_fraccion.ci_propietario; // codigo || "ninguno"
        var tipo_navegacion = paquete_fraccion.tipo_navegacion; // "administrador" || "cliente"

        var fraccion_card = {};

        fraccion_card.codigo_fraccion = codigo_fraccion;

        if (tipo_navegacion == "cliente") {
            fraccion_card.lado_administrador = false;
            fraccion_card.lado_cliente = true;
        } else {
            if (tipo_navegacion == "administrador") {
                fraccion_card.lado_administrador = true;
                fraccion_card.lado_cliente = false;
            }
        }

        //----------------------------------------------------------------------

        var datos_funcion = {
            codigo_fraccion,
            ci_propietario,
        };
        var resultado = await super_info_fraccion(datos_funcion);

        //----------------------------------------------------------------------
        fraccion_card.fraccion_bs = resultado.fraccion_bs;
        fraccion_card.fraccion_bs_render = resultado.fraccion_bs_render;
        fraccion_card.ganancia_bs = resultado.ganancia_bs;
        fraccion_card.ganancia_bs_render = resultado.ganancia_bs_render;
        fraccion_card.plusvalia_bs = resultado.plusvalia_bs;
        fraccion_card.plusvalia_bs_render = resultado.plusvalia_bs_render;
        fraccion_card.existe_inversionista = resultado.existe_inversionista;
        fraccion_card.existe_copropietario = resultado.existe_copropietario;
        fraccion_card.menor_igual = resultado.menor_igual;
        fraccion_card.verde = resultado.verde;
        fraccion_card.gris = resultado.gris;
        fraccion_card.azul = resultado.azul;
        fraccion_card.dias_plusvalia = resultado.dias_plusvalia;
        fraccion_card.dias_inversionista = resultado.dias_inversionista;
        //----------------------------------------------------------------------

        return fraccion_card;
    } catch (error) {
        console.log(error);
    }
};

//====================================================================================
//====================================================================================
// ARMADOR DEL CARD DE UN PROYECTO (INTERNO y EXTERNO) (LADO: CLIENTE y ADMINISTRADOR)
// paquete_proyecto = {codigo_proyecto,laapirest}
funcionesAyuda_1.proyecto_card_adm_cli = async function (paquete_proyecto) {
    try {
        // ------- Para verificación -------
        //console.log("ESTAMOS EN EL proyecto_card_adm_cli Y VEMOS EL PAQUETE DE DATOS");
        //console.log(paquete_proyecto);

        var codigo_proyecto = paquete_proyecto.codigo_proyecto;

        var aux_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            {
                codigo_proyecto: 1,
                codigo_terreno: 1,
                nombre_proyecto: 1,
                meses_construccion: 1,
                link_youtube_proyecto: 1,
                link_instagram_proyecto: 1,
                link_facebook_proyecto: 1,
                link_tiktok_proyecto: 1,

                _id: 0,
            }
        );

        var registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: aux_proyecto.codigo_terreno },
            {
                ciudad: 1,
                bandera_ciudad: 1,
                provincia: 1,
                direccion: 1,
                estado_terreno: 1,
                fecha_creacion: 1,
                precio_bs: 1,
                descuento_bs: 1,
                superficie: 1,

                fecha_inicio_convocatoria: 1,
                fecha_fin_convocatoria: 1,
                fecha_inicio_anteproyecto: 1,
                fecha_fin_anteproyecto: 1,
                fecha_inicio_reservacion: 1,
                fecha_fin_reservacion: 1,

                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,
                rend_fraccion_mensual: 1,

                _id: 0,
            }
        );

        // importante: para especificar si se trata de un inmueble guardado o no (lado cliente), en el paquete de datos debera venir si se trata de lado cliente o administrador.

        if (aux_proyecto && registro_terreno) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(aux_proyecto);
            // reconversion del "string" a "objeto"
            var proyecto_card = JSON.parse(aux_string);

            //-------------------------------------------------------------------
            var datos_funcion = {
                //------------------------------
                // datos del proyecto
                codigo_proyecto,

                //------------------------------
                // datos del terreno
                estado_terreno: registro_terreno.estado_terreno,
                precio_terreno: registro_terreno.precio_bs,
                descuento_terreno: registro_terreno.descuento_bs,
                rend_fraccion_mensual: registro_terreno.rend_fraccion_mensual,
                superficie_terreno: registro_terreno.superficie,
                fecha_inicio_convocatoria: registro_terreno.fecha_inicio_convocatoria,
                fecha_inicio_reservacion: registro_terreno.fecha_inicio_reservacion,
                fecha_fin_reservacion: registro_terreno.fecha_fin_reservacion,
                fecha_fin_construccion: registro_terreno.fecha_fin_construccion,
            };
            var resultado = await super_info_py(datos_funcion);

            var inmuebles_total = resultado.inmuebles_total;
            var inmuebles_disponibles = resultado.inmuebles_disponibles;
            var dormitorios_total = resultado.dormitorios_total;
            var banos_total = resultado.banos_total;
            var derecho_suelo = resultado.derecho_suelo;
            var derecho_suelo_render = resultado.derecho_suelo_render;
            var precio_justo = resultado.precio_justo;
            var precio_justo_render = resultado.precio_justo_render;
            var plusvalia = resultado.plusvalia;
            var plusvalia_render = resultado.plusvalia_render;
            var descuento_suelo = resultado.descuento_suelo;
            var descuento_suelo_render = resultado.descuento_suelo_render;
            var plazo_titulo = resultado.plazo_titulo;
            var plazo_tiempo = resultado.plazo_tiempo;
            var p_financiamiento = resultado.p_financiamiento;
            var p_financiamiento_render = resultado.p_financiamiento_render;
            var financiamiento = resultado.financiamiento;
            var financiamiento_render = resultado.financiamiento_render;
            var meta = resultado.meta;
            var meta_render = resultado.meta_render;
            var array_segundero = resultado.array_segundero;
            //-------------------------------------------------------------------

            proyecto_card.laapirest = paquete_proyecto.laapirest;
            proyecto_card.codigo_proyecto = codigo_proyecto;
            proyecto_card.n_inmuebles = inmuebles_total;
            proyecto_card.n_disponibles = inmuebles_disponibles;
            proyecto_card.financiado = financiamiento_render;
            proyecto_card.financiado_num = financiamiento;
            proyecto_card.meta = meta_render;
            proyecto_card.meta_num = meta;
            proyecto_card.ahorro = plusvalia_render;
            proyecto_card.ahorro_num = plusvalia;
            proyecto_card.porcentaje = p_financiamiento;
            proyecto_card.porcentaje_render = p_financiamiento_render;
            proyecto_card.factor_tiempo_tiempo = plazo_tiempo;
            proyecto_card.factor_tiempo_titulo = plazo_titulo;

            //-------------------------------------------------------------------

            proyecto_card.ciudad = registro_terreno.ciudad;
            proyecto_card.bandera_ciudad = registro_terreno.bandera_ciudad;
            proyecto_card.provincia = registro_terreno.provincia;
            proyecto_card.direccion = registro_terreno.direccion;

            //--------------------------------------------------------------
            // Imagen principal proyecto
            var registro_imagenes_py = await indiceImagenesProyecto.find(
                {
                    codigo_proyecto: codigo_proyecto,
                    imagen_respon_social: false, // no se tomaran en cuenta las imagenes de responsabilidad social
                },
                {
                    nombre_imagen: 1,
                    codigo_imagen: 1,
                    extension_imagen: 1,
                    parte_principal: 1, // es un ARRAY
                    url: 1,
                }
            );

            if (registro_imagenes_py.length > 0) {
                for (let j = 0; j < registro_imagenes_py.length; j++) {
                    // El proyecto al igual que sus inmuebles, solo puede tener UNA sola imagen como principal, por tanto cuando esta sea encontrada, se saldra del bucle FOR
                    var codArray = registro_imagenes_py[j].parte_principal;
                    // buscamos en este "codArray" si existe el codigo del proyecto (buscando la posicion que este ocupa en el presente ARRAY)
                    let pocisionExiste = codArray.indexOf(codigo_proyecto);
                    if (pocisionExiste != -1) {
                        //var nombre_imagen = registro_imagenes_py[j].nombre_imagen;
                        //var codigo_imagen = registro_imagenes_py[j].codigo_imagen;
                        //var extension_imagen = registro_imagenes_py[j].extension_imagen;
                        //var imagen_proyecto = codigo_imagen + extension_imagen;
                        var imagen_proyecto = registro_imagenes_py[j].url;

                        var imagen_encontrado = true; // cambiamos el booleano de la imagen a true (encontrado)
                        break;
                    }
                }
            } else {
                var imagen_encontrado = false;
            }

            proyecto_card.imagen_proyecto = imagen_proyecto;
            proyecto_card.imagen_encontrado = imagen_encontrado;

            //--------------------------------------------------------------

            var paquete_tiempo = {
                estado_terreno: registro_terreno.estado_terreno,
                fecha_creacion: registro_terreno.fecha_creacion,
                fecha_inicio_convocatoria: registro_terreno.fecha_inicio_convocatoria,
                fecha_fin_convocatoria: registro_terreno.fecha_fin_convocatoria,
                fecha_inicio_anteproyecto: registro_terreno.fecha_inicio_anteproyecto,
                fecha_fin_anteproyecto: registro_terreno.fecha_fin_anteproyecto,
                fecha_inicio_reservacion: registro_terreno.fecha_inicio_reservacion,
                fecha_fin_reservacion: registro_terreno.fecha_fin_reservacion,
                fecha_inicio_construccion: registro_terreno.fecha_inicio_construccion,
                fecha_fin_construccion: registro_terreno.fecha_fin_construccion,
            };

            var datos_tiempo = funcion_datos_tiempo(paquete_tiempo);

            // ya considera el estado del terreno: guardado, reserva, pago, contruccion y construido
            proyecto_card.vencimiento = datos_tiempo.fecha; // para ORDENAMIENTO

            return proyecto_card;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

/*************************************************************************************/
/*************************************************************************************/
// ARMADOR DEL CARD DE UN INMUEBLE (INTERNO y EXTERNO) (CLIENTE y ADMINISTRADOR)
// paquete_inmueble = {codigo_inmueble,codigo_usuario,laapirest}
funcionesAyuda_1.inmueble_card_adm_cli = async function (paquete_inmueble) {
    try {
        // codigo_usuario puede ser: codigo || "ninguno"
        var codigo_inmueble = paquete_inmueble.codigo_inmueble;

        var registro_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                codigo_proyecto: 1,
                // guardado, disponible, reservado, construccion, remate, construido
                estado_inmueble: 1, // util para los botones de "guardar"
                fraccionado: 1,
                fecha_creacion: 1,
                tipo_inmueble: 1,
                piso: 1,
                puerta_inmueble: 1,
                superficie_inmueble_m2: 1,
                dormitorios_inmueble: 1,
                banos_inmueble: 1,
                garaje_inmueble: 1,
                precio_competencia: 1,

                link_youtube_inmueble: 1,

                precio_construccion: 1,

                _id: 0,
            }
        );

        var registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: registro_inmueble.codigo_proyecto },
            {
                codigo_terreno: 1,
                nombre_proyecto: 1,
                meses_construccion: 1,

                link_facebook_proyecto: 1,
                link_instagram_proyecto: 1,
                link_tiktok_proyecto: 1,

                construccion_mensual: 1,

                _id: 0,
            }
        );

        var registro_terreno = await indiceTerreno.findOne(
            { codigo_terreno: registro_proyecto.codigo_terreno },
            {
                ciudad: 1,
                bandera_ciudad: 1,
                provincia: 1,
                direccion: 1,
                estado_terreno: 1,
                fecha_creacion: 1,

                fecha_inicio_convocatoria: 1,
                fecha_fin_convocatoria: 1,
                fecha_inicio_anteproyecto: 1,
                fecha_fin_anteproyecto: 1,
                fecha_inicio_reservacion: 1,
                fecha_fin_reservacion: 1,
                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,

                precio_bs: 1,
                descuento_bs: 1,
                rend_fraccion_mensual: 1,
                superficie: 1,

                _id: 0,
            }
        );

        // importante: para especificar si se trata de un inmueble guardado o no (lado cliente), en el paquete de datos debera venir si se trata de lado cliente o administrador.

        if (registro_inmueble && registro_proyecto && registro_terreno) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(registro_inmueble);
            // reconversion del "string" a "objeto"
            var inmueble_card = JSON.parse(aux_string);

            inmueble_card.superficie_inmueble_render = numero_punto_coma(
                registro_inmueble.superficie_inmueble_m2
            );
            inmueble_card.codigo_inmueble = codigo_inmueble;
            inmueble_card.laapirest = paquete_inmueble.laapirest;
            inmueble_card.link_facebook = registro_proyecto.link_facebook_proyecto;
            inmueble_card.link_instagram = registro_proyecto.link_instagram_proyecto;
            inmueble_card.link_tiktok = registro_proyecto.link_tiktok_proyecto;
            inmueble_card.nombre_proyecto = registro_proyecto.nombre_proyecto;
            inmueble_card.meses_construccion = registro_proyecto.meses_construccion;

            //-------------------------------------------------------------------
            var datos_inm = {
                // datos del inmueble
                codigo_inmueble,
                precio_construccion: registro_inmueble.precio_construccion,
                precio_competencia: registro_inmueble.precio_competencia,
                superficie_inmueble: registro_inmueble.superficie_inmueble_m2,
                fraccionado: registro_inmueble.fraccionado,
                // datos del proyecto
                construccion_mensual: registro_proyecto.construccion_mensual,
                // datos del terreno
                estado_terreno: registro_terreno.estado_terreno,
                precio_terreno: registro_terreno.precio_bs,
                descuento_terreno: registro_terreno.descuento_bs,
                rend_fraccion_mensual: registro_terreno.rend_fraccion_mensual,
                superficie_terreno: registro_terreno.superficie,
                fecha_inicio_convocatoria: registro_terreno.fecha_inicio_convocatoria,
                fecha_inicio_reservacion: registro_terreno.fecha_inicio_reservacion,
                fecha_fin_reservacion: registro_terreno.fecha_fin_reservacion,
                fecha_fin_construccion: registro_terreno.fecha_fin_construccion,
            };
            var resultado = await super_info_inm(datos_inm);

            //-----------------------
            // precio justo, derecho suelo, plusvalia
            var precio_justo = resultado.precio_justo;
            var precio_justo_render = resultado.precio_justo_render;
            var plusvalia = resultado.plusvalia;
            var plusvalia_render = resultado.plusvalia_render;
            //------------------------------
            // financiamiento, meta, porcentaje
            var plazo_titulo = resultado.plazo_titulo;
            var plazo_tiempo = resultado.plazo_tiempo;
            var p_financiamiento = resultado.p_financiamiento;
            var p_financiamiento_render = resultado.p_financiamiento_render;
            var financiamiento = resultado.financiamiento;
            var financiamiento_render = resultado.financiamiento_render;
            var meta = resultado.meta;
            var meta_render = resultado.meta_render;
            //-----------------------
            // reserva, fraccio , cuota
            var refracu = resultado.refracu;
            var titulo_refracu = resultado.titulo_refracu;
            var valor_refracu = resultado.valor_refracu;
            var valor_refracu_render = resultado.valor_refracu_render;
            var ver_fraccion = resultado.ver_fraccion;
            var ver_reserva = resultado.ver_reserva;
            var ver_cuota = resultado.ver_cuota;

            //-------------------------------------------------------------------
            inmueble_card.refracu = refracu;
            inmueble_card.ver_fraccion = ver_fraccion;
            inmueble_card.ver_reserva = ver_reserva;
            inmueble_card.ver_cuota = ver_cuota;
            inmueble_card.titulo_refracu = titulo_refracu;
            inmueble_card.valor_refracu = valor_refracu;
            inmueble_card.valor_refracu_render = valor_refracu_render;

            inmueble_card.precio_justo = precio_justo;
            inmueble_card.precio_justo_render = precio_justo_render;
            inmueble_card.plusvalia = plusvalia;
            inmueble_card.plusvalia_render = plusvalia_render;
            inmueble_card.financiamiento = financiamiento;
            inmueble_card.financiamiento_render = financiamiento_render;
            inmueble_card.meta = meta;
            inmueble_card.meta_render = meta_render;
            inmueble_card.p_financiamiento = p_financiamiento;
            inmueble_card.p_financiamiento_render = p_financiamiento_render;
            inmueble_card.plazo_titulo = plazo_titulo;
            inmueble_card.plazo_tiempo = plazo_tiempo;

            var precio_competencia = registro_inmueble.precio_competencia;
            var precio_competencia_render = numero_punto_coma(precio_competencia);
            inmueble_card.precio_competencia = precio_competencia;
            inmueble_card.precio_competencia_render = precio_competencia_render;

            //-------------------------------------------------------------------

            var ci_propietario = paquete_inmueble.codigo_usuario;

            //-------------------------------------------------------------------
            // para saber si el presente inmueble es guardado del usuario

            if (ci_propietario == "ninguno") {
                var inmueble_guardado = false;
            } else {
                var registro_inmueble_guardado = await indiceGuardados.findOne(
                    {
                        codigo_inmueble: codigo_inmueble,
                        ci_propietario: ci_propietario,
                    },
                    {
                        codigo_inmueble: 1,
                        _id: 0,
                    }
                );

                if (registro_inmueble_guardado) {
                    // significa que el inmueble si es guardado por el usuario
                    var inmueble_guardado = true;
                } else {
                    // significa que el inmueble no es guardado por el usuario
                    var inmueble_guardado = false;
                }
            }

            //--------------------------------------------------------------
            // para saber si el presente inmueble es PROPIEDAD o CO-PROPIEDAD del usuario

            if (ci_propietario == "ninguno") {
                var inmueble_propiedad = false;
            } else {
                var registro_inmueble_propiedad = await indiceInversiones.findOne(
                    {
                        codigo_inmueble: codigo_inmueble,
                        ci_propietario: ci_propietario,
                    },
                    {
                        codigo_inmueble: 1,
                        _id: 0,
                    }
                );

                if (registro_inmueble_propiedad) {
                    // significa que el inmueble si es propiedad actual del usuario
                    var inmueble_propiedad = true;
                } else {
                    // entonces revisamos si es co-propietario del inmueble
                    var registro_inmueble_copropiedad = await indiceFraccionInmueble.findOne(
                        {
                            codigo_inmueble: codigo_inmueble,
                            ci_propietario: ci_propietario,
                        },
                        {
                            codigo_inmueble: 1,
                            _id: 0,
                        }
                    );

                    if (registro_inmueble_copropiedad) {
                        // significa que el usuario es copropietario del inmueble
                        var inmueble_propiedad = true;
                    } else {
                        // significa que el usuario no es propietario ni copropietario del inmueble
                        var inmueble_propiedad = false;
                    }
                }
            }

            //--------------------------------------------------------------

            inmueble_card.inmueble_guardado = inmueble_guardado;
            inmueble_card.inmueble_propiedad = inmueble_propiedad;
            inmueble_card.ciudad = registro_terreno.ciudad;
            inmueble_card.bandera_ciudad = registro_terreno.bandera_ciudad;
            inmueble_card.provincia = registro_terreno.provincia;
            inmueble_card.direccion = registro_terreno.direccion;

            //--------------------------------------------------------------
            // Imagen principal INMUEBLE
            var registro_imagenes_py = await indiceImagenesProyecto.find(
                {
                    codigo_proyecto: registro_inmueble.codigo_proyecto,
                    imagen_respon_social: false, // no se tomaran en cuenta las imagenes de responsabilidad social
                },
                {
                    nombre_imagen: 1,
                    codigo_imagen: 1,
                    extension_imagen: 1,
                    parte_principal: 1, // es un ARRAY
                    url: 1,
                }
            );

            if (registro_imagenes_py.length > 0) {
                for (let j = 0; j < registro_imagenes_py.length; j++) {
                    // El proyecto al igual que sus inmuebles, solo puede tener UNA sola imagen como principal, por tanto cuando esta sea encontrada, se saldra del bucle FOR
                    var codArray = registro_imagenes_py[j].parte_principal;
                    // buscamos en este "codArray" si existe el codigo del inmueble (buscando la posicion que este ocupa en el presente ARRAY)
                    let pocisionExiste = codArray.indexOf(codigo_inmueble);
                    if (pocisionExiste != -1) {
                        var nombre_imagen = registro_imagenes_py[j].nombre_imagen;
                        //var codigo_imagen = registro_imagenes_py[j].codigo_imagen;
                        //var extension_imagen = registro_imagenes_py[j].extension_imagen;
                        //var imagen_inmueble = codigo_imagen + extension_imagen;
                        var imagen_inmueble = registro_imagenes_py[j].url;

                        var imagen_encontrado = true; // cambiamos el booleano de la imagen a true (encontrado)
                        break;
                    }
                }
            } else {
                var imagen_encontrado = false;
            }

            inmueble_card.nombre_imagen = nombre_imagen;
            inmueble_card.imagen_inmueble = imagen_inmueble;
            inmueble_card.imagen_encontrado = imagen_encontrado;

            //--------------------------------------------------------------

            var paquete_tiempo = {
                estado_terreno: registro_terreno.estado_terreno,
                fecha_creacion: registro_terreno.fecha_creacion,
                fecha_inicio_convocatoria: registro_terreno.fecha_inicio_convocatoria,
                fecha_fin_convocatoria: registro_terreno.fecha_fin_convocatoria,
                fecha_inicio_anteproyecto: registro_terreno.fecha_inicio_anteproyecto,
                fecha_fin_anteproyecto: registro_terreno.fecha_fin_anteproyecto,
                fecha_inicio_reservacion: registro_terreno.fecha_inicio_reservacion,
                fecha_fin_reservacion: registro_terreno.fecha_fin_reservacion,
                fecha_inicio_construccion: registro_terreno.fecha_inicio_construccion,
                fecha_fin_construccion: registro_terreno.fecha_fin_construccion,
            };

            var datos_tiempo = funcion_datos_tiempo(paquete_tiempo);

            // ya considera el estado del terreno: guardado, reserva, pago, contruccion y construido
            inmueble_card.vencimiento = datos_tiempo.fecha; // para ORDENAMIENTO

            //--------------------------------------------------------------
            var cuadro_precio_inm = funcion_cuadro_precio_inm(registro_inmueble.estado_inmueble);
            inmueble_card.leyenda_precio_inm = cuadro_precio_inm.leyenda_precio_inm;
            inmueble_card.color_precio_inm = cuadro_precio_inm.color_precio_inm;
            //--------------------------------------------------------------

            return inmueble_card;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

/*************************************************************************************/
//---------------------------------------------------------------------
// PARA CARDS DE: TERRENO, PROYECTO, INMUEBLE
function funcion_datos_tiempo(datos_terreno) {
    var datos_tiempo = {};
    datos_tiempo.estado = datos_terreno.estado_terreno;

    if (datos_terreno.estado_terreno == "guardado") {
        datos_tiempo.fecha = datos_terreno.fecha_creacion;
        datos_tiempo.fecha_inicio = 0;
        datos_tiempo.fecha_fin = 0;
    }

    if (datos_terreno.estado_terreno == "convocatoria") {
        datos_tiempo.fecha = datos_terreno.fecha_fin_convocatoria;
        datos_tiempo.fecha_inicio = datos_terreno.fecha_inicio_convocatoria;
        datos_tiempo.fecha_fin = datos_terreno.fecha_fin_convocatoria;
    }

    if (datos_terreno.estado_terreno == "anteproyecto") {
        datos_tiempo.fecha = datos_terreno.fecha_fin_anteproyecto;
        datos_tiempo.fecha_inicio = datos_terreno.fecha_inicio_anteproyecto;
        datos_tiempo.fecha_fin = datos_terreno.fecha_fin_anteproyecto;
    }

    if (datos_terreno.estado_terreno == "reservacion") {
        datos_tiempo.fecha = datos_terreno.fecha_fin_reservacion;
        datos_tiempo.fecha_inicio = datos_terreno.fecha_inicio_reservacion;
        datos_tiempo.fecha_fin = datos_terreno.fecha_fin_reservacion;
    }

    if (datos_terreno.estado_terreno == "construccion") {
        datos_tiempo.fecha = datos_terreno.fecha_fin_construccion;
        datos_tiempo.fecha_inicio = datos_terreno.fecha_inicio_construccion;
        datos_tiempo.fecha_fin = datos_terreno.fecha_fin_construccion;
    }

    if (datos_terreno.estado_terreno == "construido") {
        datos_tiempo.fecha = datos_terreno.fecha_fin_construccion;
        datos_tiempo.fecha_inicio = 0;
        datos_tiempo.fecha_fin = 0;
    }

    return datos_tiempo;
}

//---------------------------------------------------------------------
function funcion_cuadro_precio_inm(aux_estado_inmueble) {
    if (aux_estado_inmueble == "guardado") {
        var leyenda_precio_inm = "Guardado";
        var color_precio_inm = "en_gris";
    }
    if (aux_estado_inmueble == "disponible") {
        var leyenda_precio_inm = "Disponible";
        var color_precio_inm = "en_verde";
    }
    if (aux_estado_inmueble == "reservado") {
        var leyenda_precio_inm = "Reservado";
        var color_precio_inm = "en_gris";
    }
    if (aux_estado_inmueble == "construccion") {
        var leyenda_precio_inm = "Construcción";
        var color_precio_inm = "en_amarillo";
    }

    if (aux_estado_inmueble == "remate") {
        var leyenda_precio_inm = "Remate";
        var color_precio_inm = "en_azul";
    }
    if (aux_estado_inmueble == "construido") {
        var leyenda_precio_inm = "Construido";
        var color_precio_inm = "en_gris";
    }

    var resultado = {
        leyenda_precio_inm,
        color_precio_inm, // como sera un texto, entonces para que funcione, se devera hacer con CSS ne el HTML, poniendo este resultado de tecto en la clase para pintarlo con el color deseado
    };
    return resultado;
}
//---------------------------------------------------------------------

/*************************************************************************************/
/************************************************************************************ */
// ELIMINADOR DE IMAGENES TERRENO O PROYECTO

funcionesAyuda_1.eliminadorImagenes = async function (codigo_imagen) {
    var codigo_imagen = codigo_imagen;

    var ci = aux_accion_adm.ci_administrador; // extraido de la SESION guardada del administrador
    var accion = aux_accion_adm.accion_administrador;
    const accionHistorial = new indiceHistorial({
        ci_administrador: ci,
        accion_historial: accion,
    });
    await accionHistorial.save();
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = funcionesAyuda_1;
