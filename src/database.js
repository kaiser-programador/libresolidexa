// CONEXION A NUESTRA BASE DE DATOS
/*
const mongoose = require('mongoose');
const { direccionBaseDatos } = require('./claves');
mongoose.connect(direccionBaseDatos.URI, { useNewUrlParser: true }).then(respuestaServidor => console.log('La base de datos esta Conectado')).catch(errorcillo => console.error(errorcillo));
*/

//++++++++++++++++++++++++++++++++++++++++++++++++++++
//const session = require('express-session');
//++++++++++++++++++++++++++++++++++++++++++++++++++++



const mongoose = require("mongoose");


//++++++++++++++++++++++++++++++++++++++++++++++++++++
//const MongoStore = require('connect-mongo')(session);
//++++++++++++++++++++++++++++++++++++++++++++++++++++

const { direccionBaseDatos } = require("./claves");
mongoose
    .connect(direccionBaseDatos.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((respuestaServidor) => console.log("La base de datos esta Conectado"))
    .catch((errorcillo) => console.error(errorcillo));

    /*
    // Crea una instancia de MongoStore para almacenar las sesiones en MongoDB
const mongoStore = new MongoStore({
    mongooseConnection: mongoose.connection,
  });
  */