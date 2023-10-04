// aqui se encuentran todas las funciones que seran utilizadas por los handlebars
// recuerde que este archivo js esta definido en "configuracion.js" como:
// helpers: require('./ayucoservidor')

const ayudasHandlebars = {};

// esta funcion recibira como parametro el tipo de inmueble que se trata: Departamento, Oficina, Tienda comercial, Colectivos A o B. y que sera guardado en "tipoImueble"
ayudasHandlebars.imagenTipoInmueble = function (tipoImueble) {

    /****** Para verificación **********/
    //console.log('tipo de inmueble recibido');
    //console.log(tipoImueble);

    if (tipoImueble === 'Departamento') {
        tipoImuebleRespuesta = 'departamento.png';
    };


    if (tipoImueble === 'Oficina') {
        tipoImuebleRespuesta = 'oficina.png';
    };

    if (tipoImueble === 'Tienda comercial') {
        tipoImuebleRespuesta = 'tiendacomercial.png';
    };


    if (tipoImueble === 'Colectivo A') {
        tipoImuebleRespuesta = 'colectivoa.png';
    };

    // son aquellos inmuebles que son la garantia de ganancia de lo inmuebles enteros
    if (tipoImueble === 'Colectivo B') {
        tipoImuebleRespuesta = 'colectivob.png';
    };

    // si no existe ningun dato respecto al tipo de inmueble
    //if (tipoImueble === undefined) {
    if (tipoImueble === "" || tipoImueble === undefined) {
        tipoImuebleRespuesta = 'indefinido.png';
    };

    // la respuesta que retornara sera el tipo de imagen que ira en la src de "img" para luego extraer esta imagen de la carpeta "publico" ---> "imagenes"
    return tipoImuebleRespuesta;

};

ayudasHandlebars.t_espera_i = function (fechaEstado) {

    // "fechaEstado" es la fecha ya sea en que el inversionista fue declarado EN ESPERA

    // encargada de mostrar el tiempo que falta para completarse el plazo

    // capturamos la fecha actual
    var fecha_actual = new Date();

    // restamos la fecha_actual con la fecha del estado "en espera"



    // armamos el OBJETO "tiempo_faltante"
    var tiempo_faltante = {
        dias: dias,
        horas: horas,
        minutos: minutos,
        segundos: segundos
    };


    return tiempo_faltante; // devolveremos un OBJETO contenido en "tiempo_faltante"


};

ayudasHandlebars.t_fondeado_i = function (fechaEstado) {

    // "fechaEstado" es la fecha en que el inversionista FONDEO en el inmueble

    // encargado de mostrar el tiempo que transcurrio desde que el inversionista fondeo en el inmueble
    // con modulo de "moment"

    // capturamos la fecha actual
    var fecha_actual = new Date();

    moment.locale('es'); // para indicarle que debe ser en español

    return moment(fechaEstado).startOf('minute').fromNow();

};

module.exports = ayudasHandlebars;




