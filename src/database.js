// CONEXION A NUESTRA BASE DE DATOS
/*
const mongoose = require('mongoose');
const { direccionBaseDatos } = require('./claves');
mongoose.connect(direccionBaseDatos.URI, { useNewUrlParser: true }).then(respuestaServidor => console.log('La base de datos esta Conectado')).catch(errorcillo => console.error(errorcillo));
*/

const mongoose = require("mongoose");

const { direccionBaseDatos } = require("./claves");
mongoose
    .connect(direccionBaseDatos.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((respuestaServidor) => console.log("La base de datos esta Conectado"))
    .catch((errorcillo) => console.error(errorcillo));
