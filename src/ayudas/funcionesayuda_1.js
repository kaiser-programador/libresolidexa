/** SE ENCARGARA DE CONSTRUIR LOS DATOS NECESARIOS EN EL ORDEN EN EL QUE SE DESEA */

const {
    indiceTerreno,
    indiceProyecto,
    indiceImagenesProyecto,
    //indiceDocumentos,
    //indiceInversiones,
    indiceInmueble,
    //indice_propietario,
    //indiceGuardados,
    indiceHistorial,
    indiceAdministrador,
    indiceImagenesTerreno,
} = require("../modelos/indicemodelo");

//const { proyecto_info_cd  } = require("./funcionesayuda_2");
const { inmueble_info_cd, proyecto_info_cd } = require("./funcionesayuda_4");

const { funcion_tiempo_estado, numero_punto_coma } = require("./funcionesayuda_3");

const moment = require("moment");

const funcionesAyuda_1 = {};

/************************************************************************************ */
/************************************************************************************ */
// VERIFICADOR TERRENO BLOQUEADO
funcionesAyuda_1.verificadorTerrenoBloqueado = async function (codigo_terreno) {
    // ------- Para verificación -------
    console.log("el codigo del terreno para ver si esta bloquado");
    console.log(codigo_terreno);
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
        var datos_terreno = await indiceTerreno.findOne(
            { codigo_terreno: codigo_terreno },
            {
                codigo_terreno: 1,
                ciudad: 1,
                bandera_ciudad: 1,
                provincia: 1,
                direccion: 1,
                precio_sus: 1,
                superficie: 1,
                anteproyectos_maximo: 1,
                anteproyectos_registrados: 1,
                link_youtube: 1,
                link_facebook: 1,
                link_instagram: 1,
                link_tiktok: 1,
                estado_terreno: 1,
                fecha_creacion: 1,
                fecha_inicio_reserva: 1,
                fecha_fin_reserva: 1,
                fecha_inicio_aprobacion: 1,
                fecha_fin_aprobacion: 1,
                fecha_inicio_pago: 1,
                fecha_fin_pago: 1,
                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,
                _id: 0,
            }
        );

        if (datos_terreno) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(datos_terreno);
            // reconversion del "string" a "objeto"
            var terreno_card = JSON.parse(aux_string);

            terreno_card.superficie = numero_punto_coma(datos_terreno.superficie);
            terreno_card.superficie_num = datos_terreno.superficie;
            terreno_card.precio_sus = numero_punto_coma(datos_terreno.precio_sus);
            terreno_card.precio_sus_num = datos_terreno.precio_sus;

            terreno_card.laapirest = paquete_terreno.laapirest;

            var datos_tiempo = funcion_datos_tiempo(datos_terreno);

            // ya considera el estado del terreno: guardado, reserva, pago, contruccion y construido
            terreno_card.vencimiento = datos_tiempo.fecha; // para ORDENAMIENTO

            var resultado_tiempo = funcion_tiempo_estado(datos_tiempo);
            terreno_card.factor_tiempo_tiempo = resultado_tiempo.factor_tiempo_tiempo;
            terreno_card.factor_tiempo_titulo = resultado_tiempo.factor_tiempo_titulo;
            terreno_card.factor_tiempo_porcentaje = resultado_tiempo.factor_tiempo_porcentaje;
            terreno_card.factor_tiempo_porcentaje_render = numero_punto_coma(
                resultado_tiempo.factor_tiempo_porcentaje
            );
            terreno_card.disponibles =
                datos_terreno.anteproyectos_maximo - datos_terreno.anteproyectos_registrados; // para ORDENAMIENTO

            terreno_card.porcentaje_circular =
                (datos_terreno.anteproyectos_registrados / datos_terreno.anteproyectos_maximo) * 100;

            // ------- Para verificación -------
            //console.log("los datos del card terreno");
            //console.log(terreno_card);

            //----------------------------------------------------------------------
            // Para encontrar la imagen principal del terreno

            var registro_ima_te = await indiceImagenesTerreno.findOne(
                { codigo_terreno: codigo_terreno, imagen_principal: true },
                {
                    nombre_imagen: 1,
                    codigo_imagen: 1,
                    extension_imagen: 1, // ej: ".jpg"
                    _id: 0,
                }
            );

            if (registro_ima_te) {
                var imagen_terreno = registro_ima_te.codigo_imagen + registro_ima_te.extension_imagen;
                terreno_card.imagen_terreno = imagen_terreno;
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

/*************************************************************************************/
/*************************************************************************************/
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
                proyecto_ganador: 1, // true o false
                meses_construccion: 1,
                link_youtube_proyecto: 1,
                link_instagram_proyecto: 1,
                link_facebook_proyecto: 1,
                link_tiktok_proyecto: 1,

                _id: 0,
            }
        );

        var datos_terreno = await indiceTerreno.findOne(
            { codigo_terreno: aux_proyecto.codigo_terreno },
            {
                ciudad: 1,
                bandera_ciudad: 1,
                provincia: 1,
                direccion: 1,
                estado_terreno: 1,
                fecha_creacion: 1,
                fecha_inicio_reserva: 1,
                fecha_fin_reserva: 1,
                fecha_inicio_aprobacion: 1,
                fecha_fin_aprobacion: 1,
                fecha_inicio_pago: 1,
                fecha_fin_pago: 1,
                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,
                _id: 0,
            }
        );

        // importante: para especificar si se trata de un inmueble guardado o no (lado cliente), en el paquete de datos debera venir si se trata de lado cliente o administrador.

        if (aux_proyecto && datos_terreno) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(aux_proyecto);
            // reconversion del "string" a "objeto"
            var proyecto_card = JSON.parse(aux_string);

            var aux_proyecto_info = await proyecto_info_cd(codigo_proyecto);
            // agregacion de nuevas propiedades a la info del proyecto
            proyecto_card.laapirest = paquete_proyecto.laapirest;
            proyecto_card.codigo_proyecto = codigo_proyecto;
            proyecto_card.n_inmuebles = aux_proyecto_info.n_inmuebles;
            proyecto_card.n_inmuebles = aux_proyecto_info.n_inmuebles;
            proyecto_card.n_disponibles = aux_proyecto_info.n_disponibles;
            proyecto_card.financiado = aux_proyecto_info.financiado;
            proyecto_card.financiado_num = aux_proyecto_info.financiado_num;
            proyecto_card.meta = aux_proyecto_info.meta;
            proyecto_card.meta_num = aux_proyecto_info.meta_num;
            proyecto_card.ahorro = aux_proyecto_info.ahorro;
            proyecto_card.ahorro_num = aux_proyecto_info.ahorro_num;
            proyecto_card.porcentaje = aux_proyecto_info.porcentaje;
            proyecto_card.porcentaje_render = aux_proyecto_info.porcentaje_render;

            proyecto_card.ciudad = datos_terreno.ciudad;
            proyecto_card.bandera_ciudad = datos_terreno.bandera_ciudad;
            proyecto_card.provincia = datos_terreno.provincia;
            proyecto_card.direccion = datos_terreno.direccion;

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
                }
            );

            if (registro_imagenes_py.length > 0) {
                for (let j = 0; j < registro_imagenes_py.length; j++) {
                    // El proyecto al igual que sus inmuebles, solo puede tener UNA sola imagen como principal, por tanto cuando esta sea encontrada, se saldra del bucle FOR
                    var codArray = registro_imagenes_py[j].parte_principal;
                    // buscamos en este "codArray" si existe el codigo del proyecto (buscando la posicion que este ocupa en el presente ARRAY)
                    let pocisionExiste = codArray.indexOf(codigo_proyecto);
                    if (pocisionExiste != -1) {
                        var nombre_imagen = registro_imagenes_py[j].nombre_imagen;
                        var codigo_imagen = registro_imagenes_py[j].codigo_imagen;
                        var extension_imagen = registro_imagenes_py[j].extension_imagen;
                        var imagen_proyecto = codigo_imagen + extension_imagen;

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

            var datos_tiempo = funcion_datos_tiempo(datos_terreno);

            // ya considera el estado del terreno: guardado, reserva, pago, contruccion y construido
            proyecto_card.vencimiento = datos_tiempo.fecha; // para ORDENAMIENTO

            var resultado_tiempo = funcion_tiempo_estado(datos_tiempo);
            proyecto_card.factor_tiempo_tiempo = resultado_tiempo.factor_tiempo_tiempo;
            proyecto_card.factor_tiempo_titulo = resultado_tiempo.factor_tiempo_titulo;
            proyecto_card.factor_tiempo_porcentaje = resultado_tiempo.factor_tiempo_porcentaje;

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

        var aux_inmueble = await indiceInmueble.findOne(
            { codigo_inmueble: codigo_inmueble },
            {
                codigo_terreno: 1,
                codigo_proyecto: 1,
                // guardado, disponible, reservado, pendiente, pagado, pagos, remate, completado
                estado_inmueble: 1, // util para los botones de "guardar"
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

                _id: 0,
            }
        );

        var aux_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: aux_inmueble.codigo_proyecto },
            {
                codigo_terreno: 1,
                nombre_proyecto: 1,
                proyecto_ganador: 1, // true o false
                meses_construccion: 1,

                link_facebook_proyecto: 1,
                link_instagram_proyecto: 1,
                link_tiktok_proyecto: 1,

                _id: 0,
            }
        );

        var datos_terreno = await indiceTerreno.findOne(
            { codigo_terreno: aux_proyecto.codigo_terreno },
            {
                ciudad: 1,
                bandera_ciudad: 1,
                provincia: 1,
                direccion: 1,
                estado_terreno: 1,
                fecha_creacion: 1,
                fecha_inicio_reserva: 1,
                fecha_fin_reserva: 1,
                fecha_inicio_aprobacion: 1,
                fecha_fin_aprobacion: 1,
                fecha_inicio_pago: 1,
                fecha_fin_pago: 1,
                fecha_inicio_construccion: 1,
                fecha_fin_construccion: 1,

                _id: 0,
            }
        );

        // importante: para especificar si se trata de un inmueble guardado o no (lado cliente), en el paquete de datos debera venir si se trata de lado cliente o administrador.

        if (aux_inmueble && aux_proyecto && datos_terreno) {
            // conversion del documento MONGO ({OBJETO}) a "string"
            var aux_string = JSON.stringify(aux_inmueble);
            // reconversion del "string" a "objeto"
            var inmueble_card = JSON.parse(aux_string);

            inmueble_card.superficie_inmueble_render = numero_punto_coma(
                aux_inmueble.superficie_inmueble_m2
            );
            inmueble_card.codigo_inmueble = codigo_inmueble;
            inmueble_card.laapirest = paquete_inmueble.laapirest;
            inmueble_card.link_facebook = aux_proyecto.link_facebook_proyecto;
            inmueble_card.link_instagram = aux_proyecto.link_instagram_proyecto;
            inmueble_card.link_tiktok = aux_proyecto.link_tiktok_proyecto;
            inmueble_card.nombre_proyecto = aux_proyecto.nombre_proyecto;
            inmueble_card.meses_construccion = aux_proyecto.meses_construccion;

            var aux_inmueble_info = await inmueble_info_cd(paquete_inmueble);

            // agregacion de nuevas propiedades a la info del inmueble
            inmueble_card.porcentaje_obra_inm = aux_inmueble_info.porcentaje_obra_inm;
            inmueble_card.porcentaje_obra_inm_render = aux_inmueble_info.porcentaje_obra_inm_render;
            inmueble_card.reserva = aux_inmueble_info.reserva;
            inmueble_card.financiado = aux_inmueble_info.financiado;
            inmueble_card.meta = aux_inmueble_info.meta;
            inmueble_card.ahorro = aux_inmueble_info.ahorro;
            inmueble_card.num_puro_ahorro = aux_inmueble_info.num_puro_ahorro;
            inmueble_card.porcentaje = aux_inmueble_info.porcentaje;
            inmueble_card.porcentaje_render = aux_inmueble_info.porcentaje_render;
            inmueble_card.precio_actual_inm = aux_inmueble_info.precio_actual_inm;
            inmueble_card.num_puro_precio_actual = aux_inmueble_info.num_puro_precio_actual;
            inmueble_card.precio_competencia = aux_inmueble_info.precio_competencia;
            inmueble_card.inmueble_guardado = aux_inmueble_info.inmueble_guardado;
            inmueble_card.inmueble_propiedad = aux_inmueble_info.inmueble_propiedad;
            inmueble_card.ciudad = datos_terreno.ciudad;
            inmueble_card.bandera_ciudad = datos_terreno.bandera_ciudad;
            inmueble_card.provincia = datos_terreno.provincia;
            inmueble_card.direccion = datos_terreno.direccion;

            //--------------------------------------------------------------
            // Imagen principal INMUEBLE
            var registro_imagenes_py = await indiceImagenesProyecto.find(
                {
                    codigo_proyecto: aux_inmueble.codigo_proyecto,
                    imagen_respon_social: false, // no se tomaran en cuenta las imagenes de responsabilidad social
                },
                {
                    nombre_imagen: 1,
                    codigo_imagen: 1,
                    extension_imagen: 1,
                    parte_principal: 1, // es un ARRAY
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
                        var codigo_imagen = registro_imagenes_py[j].codigo_imagen;
                        var extension_imagen = registro_imagenes_py[j].extension_imagen;
                        var imagen_inmueble = codigo_imagen + extension_imagen;

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

            var datos_tiempo = funcion_datos_tiempo(datos_terreno);

            // ya considera el estado del terreno: guardado, reserva, pago, contruccion y construido
            inmueble_card.vencimiento = datos_tiempo.fecha; // para ORDENAMIENTO

            var resultado_tiempo = funcion_tiempo_estado(datos_tiempo);
            inmueble_card.factor_tiempo_tiempo = resultado_tiempo.factor_tiempo_tiempo;
            inmueble_card.factor_tiempo_titulo = resultado_tiempo.factor_tiempo_titulo;
            inmueble_card.factor_tiempo_porcentaje = resultado_tiempo.factor_tiempo_porcentaje;

            //--------------------------------------------------------------
            var cuadro_precio_inm = funcion_cuadro_precio_inm(aux_inmueble.estado_inmueble);
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

function funcion_datos_tiempo(datos_terreno) {
    var datos_tiempo = {};
    datos_tiempo.estado = datos_terreno.estado_terreno;

    if (datos_terreno.estado_terreno == "guardado") {
        datos_tiempo.fecha = datos_terreno.fecha_creacion;
        datos_tiempo.fecha_inicio = 0;
        datos_tiempo.fecha_fin = 0;
    }

    if (datos_terreno.estado_terreno == "reserva") {
        datos_tiempo.fecha = datos_terreno.fecha_fin_reserva;
        datos_tiempo.fecha_inicio = datos_terreno.fecha_inicio_reserva;
        datos_tiempo.fecha_fin = datos_terreno.fecha_fin_reserva;
    }

    if (datos_terreno.estado_terreno == "aprobacion") {
        datos_tiempo.fecha = datos_terreno.fecha_fin_aprobacion;
        datos_tiempo.fecha_inicio = datos_terreno.fecha_inicio_aprobacion;
        datos_tiempo.fecha_fin = datos_terreno.fecha_fin_aprobacion;
    }

    if (datos_terreno.estado_terreno == "pago") {
        datos_tiempo.fecha = datos_terreno.fecha_fin_pago;
        datos_tiempo.fecha_inicio = datos_terreno.fecha_inicio_pago;
        datos_tiempo.fecha_fin = datos_terreno.fecha_fin_pago;
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
    if (aux_estado_inmueble == "pendiente_pago") {
        var leyenda_precio_inm = "Pendiente";
        var color_precio_inm = "en_amarillo";
    }
    if (aux_estado_inmueble == "pagado_pago") {
        var leyenda_precio_inm = "Pagado";
        var color_precio_inm = "en_gris";
    }
    if (aux_estado_inmueble == "pendiente_aprobacion") {
        var leyenda_precio_inm = "Aprobación";
        var color_precio_inm = "en_amarillo";
    }
    if (aux_estado_inmueble == "pagos") {
        var leyenda_precio_inm = "Construcción";
        var color_precio_inm = "en_amarillo";
    }
    if (aux_estado_inmueble == "remate") {
        var leyenda_precio_inm = "Remate";
        var color_precio_inm = "en_azul";
    }
    if (aux_estado_inmueble == "completado") {
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
