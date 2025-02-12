const {
    indiceTerreno,
    indiceProyecto,
    indiceInmueble,
    indiceFraccionInmueble,
    indiceFraccionTerreno,
} = require("../modelos/indicemodelo");

const { fraccion_card_adm_cli } = require("./funcionesayuda_1");
const { numero_punto_coma } = require("./funcionesayuda_3");
const { super_info_inm, super_info_te } = require("../ayudas/funcionesayuda_5");
const moment = require("moment");

const funcionesAyuda_4 = {};

//=======================================================================

funcionesAyuda_4.te_inm_copropietario = async function (paquete_datos) {
    try {
        var ci_propietario = paquete_datos.ci_propietario;
        var codigo_objetivo = paquete_datos.codigo_objetivo; // codigo_inmueble || codigo_terreno
        var copropietario = paquete_datos.copropietario; // "inmueble" || "terreno"

        var tiene_fracciones = false;
        var precio_te_inm = 0; // precio del terreno || precio justo del inmueble
        var fracciones_propietario = [];
        var leyenda_tiempo = "Vencido"; // por defecto

        //-------------------------
        // propietario las fracciones de terreno que tiene disponibles
        var c_ft_d_n = 0;
        var c_ft_d_n_render = "0";
        var c_ft_d_val = 0;
        var c_ft_d_val_render = "0";
        //-------------------------
        // propietario fracciones de terreno||inmueble adquiridos
        var c_fti_a_n = 0;
        var c_fti_a_n_render = "0";
        var c_fti_a_val = 0;
        var c_fti_a_val_render = "0";
        var c_fti_a_p = 0; // % participacion
        var c_fti_a_p_render = "0"; // % participacion
        //------------------------
        // terreno||inmueble financiamiento
        var ti_f_p_render = "0"; // %
        var ti_f_val = 0;
        var ti_f_val_render = "0";
        //----------------------
        // terreno||inmueble fracciones disponibles
        var ti_f_d_n = 0;
        var ti_f_d_n_render = "0";
        var ti_f_d_val = 0;
        var ti_f_d_val_render = "0";
        //----------------------

        var array_fracciones = [];

        if (copropietario === "terreno") {
            // todas las fracciones que guardan relacion con el inmueble
            let fracciones_terreno = await indiceFraccionTerreno.find(
                {
                    codigo_terreno: codigo_objetivo,
                },
                {
                    disponible: 1,
                    fraccion_bs: 1,
                    ci_propietario: 1,
                    codigo_fraccion: 1,
                    _id: 0,
                }
            );

            if (fracciones_terreno.length > 0) {
                let j = -1;
                for (let i = 0; i < fracciones_terreno.length; i++) {
                    let disponible = fracciones_terreno[i].disponible;
                    if (disponible) {
                        ti_f_d_n = ti_f_d_n + 1;
                        ti_f_d_val = ti_f_d_val + fracciones_terreno[i].fraccion_bs;
                    } else {
                        if (ci_propietario === fracciones_terreno[i].ci_propietario) {
                            // fracciones de terreno en el terreno especifico que fueron adquiridas por el ci_propietario
                            c_fti_a_n = c_fti_a_n + 1;
                            c_fti_a_val = c_fti_a_val + fracciones_terreno[i].fraccion_bs;
                            j = j + 1;
                            fracciones_propietario[j] = {
                                codigo_fraccion: fracciones_terreno[i].codigo_fraccion,
                                fraccion_bs: fracciones_terreno[i].fraccion_bs,
                            };
                        }
                    }
                }
            }

            //--------------------------------------------------
            // para financiamiento de terreno

            let registro_terreno = await indiceTerreno.findOne(
                { codigo_terreno: codigo_objetivo },
                {
                    precio_bs: 1,
                    fecha_fin_convocatoria: 1,
                    _id: 0,
                }
            );

            if (registro_terreno) {
                var datos_inm = {
                    // datos del terreno
                    codigo_terreno: codigo_objetivo,
                    precio_terreno: registro_terreno.precio_bs,
                    fecha_fin_convocatoria: registro_terreno.fecha_fin_convocatoria,
                };
                let resultado = await super_info_te(datos_inm);

                let plazo_titulo = resultado.plazo_titulo; // Finaliza || Finalizado
                let plazo_tiempo = resultado.plazo_tiempo; // x dias || hace x dias
                let fracciones_disponibles = resultado.fracciones_disponibles; // #
                let financiamiento = resultado.financiamiento;
                let p_financiamiento_render = resultado.p_financiamiento_render;

                //--------------------------------------------------------------
                precio_te_inm = registro_terreno.precio_bs;
                ti_f_p_render = p_financiamiento_render;
                ti_f_val = financiamiento;

                ti_f_d_n = fracciones_disponibles;
                ti_f_d_val = precio_te_inm - ti_f_val;

                //--------------------------------------------------
                // para participacion del propietario

                if (precio_te_inm > 0 && c_fti_a_val > 0) {
                    let string_p_participacion = ((c_fti_a_val / precio_te_inm) * 100).toFixed(2);
                    c_fti_a_p = Number(string_p_participacion); // numerico con 2 decimales
                }

                //--------------------------------------------------------
                // para fecha vencimiento de fracciones terreno
                leyenda_tiempo = plazo_titulo + " " + plazo_tiempo;

                //--------------------------------------------------------
            }

            //--------------------------------------------------------

            if (fracciones_propietario.length > 0) {
                tiene_fracciones = true;

                for (let i = 0; i < fracciones_propietario.length; i++) {
                    let codigo_fraccion_i = fracciones_propietario[i].codigo_fraccion;
                    let paquete_fraccion = {
                        codigo_fraccion: codigo_fraccion_i,
                        ci_propietario: ci_propietario,

                        // el unico que requiere a este controlador viene de "adm_propietario", como es un "adm", entonces supone que se lo requiere desde una navegacion del tipo "administrador".
                        tipo_navegacion: "administrador",
                    };
                    let card_fraccion_i = await fraccion_card_adm_cli(paquete_fraccion);
                    array_fracciones[i] = card_fraccion_i;
                }
            }
        }

        if (copropietario === "inmueble") {
            // todas las fracciones que guardan relacion con el inmueble
            let fracciones_inmueble = await indiceFraccionInmueble.find(
                {
                    codigo_inmueble: codigo_objetivo,
                },
                {
                    disponible: 1,
                    fraccion_bs: 1,
                    ci_propietario: 1,
                    codigo_fraccion: 1,
                    _id: 0,
                }
            );

            if (fracciones_inmueble.length > 0) {
                let j = -1;
                for (let i = 0; i < fracciones_inmueble.length; i++) {
                    let disponible = fracciones_inmueble[i].disponible;
                    if (disponible) {
                        ti_f_d_n = ti_f_d_n + 1;
                        ti_f_d_val = ti_f_d_val + fracciones_inmueble[i].fraccion_bs;
                    } else {
                        if (ci_propietario === fracciones_inmueble[i].ci_propietario) {
                            // fracciones de inmueble en el inmueble especifico que fueron adquiridas por el ci_propietario
                            c_fti_a_n = c_fti_a_n + 1;
                            c_fti_a_val = c_fti_a_val + fracciones_inmueble[i].fraccion_bs;
                            j = j + 1;
                            fracciones_propietario[j] = {
                                codigo_fraccion: fracciones_inmueble[i].codigo_fraccion,
                                fraccion_bs: fracciones_inmueble[i].fraccion_bs,
                            };
                        }
                    }
                }
            }

            //--------------------------------------------------
            // para financiamiento de inmueble

            let registro_inmueble = await indiceInmueble.findOne(
                { codigo_inmueble: codigo_inmueble },
                {
                    codigo_proyecto: 1,
                    codigo_terreno: 1,
                    precio_construccion: 1,
                    precio_competencia: 1,
                    superficie_inmueble_m2: 1,
                    fraccionado: 1,
                    fecha_fin_fraccionado: 1, // solo para leyenda de fecha vencimiento
                    _id: 0,
                }
            );

            if (registro_inmueble) {
                let registro_terreno = await indiceTerreno.findOne(
                    {
                        codigo_terreno: registro_inmueble.codigo_terreno,
                    },
                    {
                        estado_terreno: 1,
                        precio_bs: 1,
                        descuento_bs: 1,
                        rend_fraccion_mensual: 1,
                        superficie: 1,
                        fecha_inicio_convocatoria: 1,
                        fecha_inicio_reservacion: 1,
                        fecha_fin_reservacion: 1,
                        fecha_fin_construccion: 1,
                        _id: 0,
                    }
                );

                let registro_proyecto = await indiceProyecto.findOne(
                    {
                        codigo_proyecto: registro_inmueble.codigo_proyecto,
                    },
                    {
                        construccion_mensual: 1,
                        _id: 0,
                    }
                );

                if (registro_terreno && registro_proyecto) {
                    //--------------------------------------------------------------
                    var datos_inm = {
                        // datos del inmueble
                        codigo_inmueble: codigo_objetivo,
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
                    let resultado = await super_info_inm(datos_inm);

                    // precio justo
                    let precio_justo = resultado.precio_justo;
                    let financiamiento = resultado.financiamiento;
                    let p_financiamiento_render = resultado.p_financiamiento_render;

                    //--------------------------------------------------------------
                    precio_te_inm = precio_justo;
                    ti_f_p_render = p_financiamiento_render;
                    ti_f_val = financiamiento;

                    //--------------------------------------------------
                    // para participacion del propietario

                    if (precio_te_inm > 0 && c_fti_a_val > 0) {
                        let string_p_participacion = ((c_fti_a_val / precio_te_inm) * 100).toFixed(
                            2
                        );
                        c_fti_a_p = Number(string_p_participacion); // numerico con 2 decimales
                    }
                }

                //----------------------------------------------------------
                // PARA FRACCIONES DE TERRENO DISPONIBLES CON LAS QUE CUENTA EL ci_propietario

                let registro_copropietario_te = await indiceFraccionTerreno.find(
                    {
                        codigo_terreno: registro_inmueble.codigo_terreno,
                        ci_propietario: ci_propietario,
                    },
                    {
                        codigo_fraccion: 1,
                        fraccion_bs: 1,
                    }
                );

                let sum_ft_total_n = 0;
                let sum_ft_utilizado_n = 0;
                let sum_ft_total = 0;
                let sum_ft_utilizado = 0;

                if (registro_copropietario_te.length > 0) {
                    sum_ft_total_n = registro_copropietario_inm.length;

                    // todas las fracciones de inmueble pertenecientes al terreno en especifico y que fueron adquiridas por el ci_propietario
                    var registro_copropietario_inm = await indiceFraccionInmueble.find(
                        {
                            codigo_terreno: registro_inmueble.codigo_terreno,
                            ci_propietario: ci_propietario,
                        },
                        {
                            fraccion_bs: 1,
                            codigo_fraccion: 1,
                            _id: 0,
                        }
                    );

                    if (registro_copropietario_inm.length > 0) {
                        sum_ft_utilizado_n = registro_copropietario_inm.length;
                        for (let i = 0; i < registro_copropietario_te.length; i++) {
                            let cod_ft_i = registro_copropietario_te[i].codigo_fraccion;
                            let val_ft_i = registro_copropietario_te[i].fraccion_bs;
                            sum_ft_total = sum_ft_total + val_ft_i;
                            for (let k = 0; k < registro_copropietario_inm.length; k++) {
                                let cod_fi_k = registro_copropietario_inm[k].codigo_fraccion;
                                if (cod_ft_i === cod_fi_k) {
                                    let val_fi_k = registro_copropietario_inm[k].fraccion_bs;
                                    sum_ft_utilizado = sum_ft_utilizado + val_fi_k;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < registro_copropietario_te.length; i++) {
                            let val_ft_i = registro_copropietario_te[i].fraccion_bs;
                            sum_ft_total = sum_ft_total + val_ft_i;
                        }
                    }
                }

                c_ft_d_val = sum_ft_total - sum_ft_utilizado;
                c_ft_d_n = sum_ft_total_n - sum_ft_utilizado_n;

                //--------------------------------------------------------
                // para fecha vencimiento de inmueble fraccionado

                let fecha_fin_fraccionado = registro_inmueble.fecha_fin_fraccionado;

                let fecha_actual = new Date();
                moment.locale("es");
                if (fecha_actual <= fecha_fin_fraccionado) {
                    let plazo_tiempo = moment(fecha_fin_fraccionado).endOf("minute").fromNow(); // ej/ en x dias
                    leyenda_tiempo = "Finaliza " + plazo_tiempo;
                } else {
                    let plazo_tiempo = moment(fecha_fin_fraccionado).startOf("minute").fromNow(); // hace x dias
                    leyenda_tiempo = "Finalizado " + plazo_tiempo;
                }
                //--------------------------------------------------------
            }

            //--------------------------------------------------------

            if (fracciones_propietario.length > 0) {
                tiene_fracciones = true;

                for (let i = 0; i < fracciones_propietario.length; i++) {
                    let codigo_fraccion_i = fracciones_propietario[i].codigo_fraccion;
                    let paquete_fraccion = {
                        codigo_fraccion: codigo_fraccion_i,
                        ci_propietario: ci_propietario,

                        // el unico que requiere a este controlador viene de "adm_propietario", como es un "adm", entonces supone que se lo requiere desde una navegacion del tipo "administrador".
                        tipo_navegacion: "administrador",
                    };
                    let card_fraccion_i = await fraccion_card_adm_cli(paquete_fraccion);
                    array_fracciones[i] = card_fraccion_i;
                }
            }
        }

        c_ft_d_n_render = numero_punto_coma(c_ft_d_n);
        c_ft_d_val_render = numero_punto_coma(c_ft_d_val);
        c_fti_a_n_render = numero_punto_coma(c_fti_a_n);
        c_fti_a_val_render = numero_punto_coma(c_fti_a_val);
        c_fti_a_p_render = numero_punto_coma(c_fti_a_p);
        //ti_f_p_render = numero_punto_coma(ti_f_p);
        ti_f_val_render = numero_punto_coma(ti_f_val);
        ti_f_d_n_render = numero_punto_coma(ti_f_d_n);
        ti_f_d_val_render = numero_punto_coma(ti_f_d_val);

        return {
            leyenda_tiempo,
            precio_te_inm,
            tiene_fracciones,
            array_fracciones,
            c_ft_d_n,
            c_ft_d_n_render,
            c_ft_d_val,
            c_ft_d_val_render,
            c_fti_a_n,
            c_fti_a_n_render,
            c_fti_a_val,
            c_fti_a_val_render,
            c_fti_a_p,
            c_fti_a_p_render,
            ti_f_p_render,
            ti_f_val,
            ti_f_val_render,
            ti_f_d_n,
            ti_f_d_n_render,
            ti_f_d_val,
            ti_f_d_val_render,
        };
    } catch (error) {
        console.log(error);
    }
};

//=======================================================================
module.exports = funcionesAyuda_4;
