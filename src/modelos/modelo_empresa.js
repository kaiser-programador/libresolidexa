// INFORMACIÓN PRINCIPAL DE LA EMPRESA

const mongoose = require("mongoose");

const { Schema } = mongoose;

const empresaEsquema = new Schema({
    // los valores en Bs y $us estaran en NUMEROS ENTEROS (sin decimales). por ejemplo para 14.000 Bs su equivalente en dolares no sera 2.011,49 $us, sino mas bien redondeado al ENTERO INFERIOR 2.011 $us (porque si nos pagaran en dolares, podremos cambiarlo en una casa de cambio donde nos daran un poco mas ej/ 7 Bs por dolar, entonces 2.011 $us = 2.011*7 = 14.077 Bs un poco mayor al original 14.000 Bs )
    // IMPORTANTE: si bien todos los valores monetarios seran almacenados en Bs, para mostrarlos en las ventanas, al momento de cargarse la ventana, se agregara un programa en jquery para que cambie de Bs a $us, porque en bolivia se esta acostumbrado a que los precios inmobiliarios esten en $us
    // IMPORTANTE: para los algoritmos de calculadora en jquery, se revisara primero en que moneda esta seleccionada la ventana y dependiendo de eso procedera en hacer los calculos.
    // por ejemplo si en la calculadora la ventana esta seleccionada en $us
    // IMPORTANTE: el menu para seleccionar el tipo de moneda: $us o Bs estara junto con el menu principal donde estan: convocatoria, reserva, construccion, contruido, ...
    tc_ine: { type: Number, default: 6.96 }, // tipo de cambio INE (oficial). ej/ 6,96 SERA DE UTILIDAD PARA CALCULADORAS

    tc_paralelo: { type: Number, default: 11 }, // tipo de cambio paralelo (mercado negro)

    inflacion_ine: { type: Number, default: 8 }, // inflacion INE

    tasa_banco: { type: Number, default: 6.8 }, // la mayor tasa de interes % que un banco otorga por los ahorros.

    texto_inicio_principal: {
        type: String,
        default: "Edificando el futuro inmobiliario con entrega y eficiencia",
    },

    //-----------------------------------------------------------------
    // numero para las ventanas de inicio de ADMINISTRADOR y CLIENTE
    n_construidos: { type: Number, default: 0 },
    n_proyectos: { type: Number, default: 0 },
    n_inmuebles: { type: Number, default: 0 },
    n_empleos: { type: Number, default: 0 },
    n_ahorros: { type: Number, default: 0 },
    n_resp_social: { type: Number, default: 0 },

    //-----------------------------------------------------------------

    // mensaje del segundero del propietario que sera vista (en el lado IZQUIERDO) en la cuenta del propietario (no influye si el propietario tiene varios inmuebles, que estos esten en reserva, construccion, etc)
    texto_segundero_prop_iz: {
        type: String,
        default:
            "<strong>/nom_propietario/</strong> el tiempo no se detiene y tus ganancias tampoco, tu inversión genera ganancias para ti segundo a sengundo.",
    },

    //-----------------------------------------------------------------

    // [{pregunta:....,respuesta:...}, ... , {pregunta:....,respuesta:...}]
    preguntas_frecuentes: { type: Array, default: "" },

    // [{termino:....,texto:...}, ... , {termino:....,texto:...}]
    //terminos_condiciones: { type: Array, default: '' },
});

module.exports = mongoose.model("empresaModelo", empresaEsquema);
