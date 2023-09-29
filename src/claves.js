//++++++++++
// para que la variable de entorno pueda ser leida
const {config} = require("dotenv");
config();
//console.log("inicio MONGODB_URI");
//console.log(process.env.MONGODB_URI);
//console.log("fin MONGODB_URI");
//+++++++++

/** DIRECCION DE LA BASE DE DATOS y otras direcciones de importancia (si es que las hubiesen) */
module.exports = {

    direccionBaseDatos: {

        // "mibdsolidexa" sera el nombre que le daremos a nuestra base de datos
        // de momento nuestra base de datos sera local, es decir que estara en nuestra computadora
        // cuando se tenga la verdadera base de datos en mongo, entonces reemplazar lo que esta entre comillas por la direccion de esa base de datos verdadera.
        //URI: 'mongodb://localhost/mibdsolidexa' // direccion de nuestra base de datos (usamos esta si no usaremos variables de entorno)
        URI: process.env.MONGODB_URI // direccion de nuestra base de datos
    }

}