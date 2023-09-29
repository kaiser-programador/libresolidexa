// ARCHIVO DE ARRANQUE DE LA APLICACION

const express = require('express');

const configuracionServidor = require('./servidor/configuracion');

// ejecutamos directamente (directamente, porque no se lo guarda en una variable o constante). "database.js" es la encargada de realizar la conexion a la BASE DE DATOS
require('./database');


//--------------------------------------------------------
// #session-passport #sesion para sesion usuario

require('./servidor/pasaporte');

//--------------------------------------------------------

// creamos el servidor con EXPRESS
const creamosServidorExpress = express();

// le damos todas las configuraciones al servidor descritas en el modulo "configuracion.js" y una vez configurado lo guardamos en una constante "servidorConfigurado"
const servidorConfigurado = configuracionServidor(creamosServidorExpress);

// obtenemos con "get" el puerto del servidor que fue configurado con "set" en el "configuracion.js" y lo guardamos en la constante "puertoServidor"
const puertoServidor = servidorConfigurado.get('puerto'); // en "configuracion.js" esta con el nombre de 'puerto'

// le indicamos al servidor que escuche en el puerto "puertoServidor"
servidorConfigurado.listen(puertoServidor, () => {
    console.log('Servidor escuchando en el puerto: ', puertoServidor); // "," es para concatenar
});


