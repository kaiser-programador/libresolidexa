/** CONFIGURACIONES QUE SE LE DARAN A EXPRESS, ES DECIR A NUESTRO SERVIDOR */

const patho = require("path");

const miMotorHandlebars = require("express-handlebars");

const morgan = require("morgan");

const multer = require("multer");

const express = require("express");

const errorHandlerin = require("errorhandler");

//------------------------------------------------------
// #session-passport para sesiones del usuario

const sesion = require("express-session");

const pasaporte = require("passport");

//------------------------------------------------------

const rutasDelServidor = require("../rutas/rutaservidor");


// Exportaremos una funcion que contendra las configuraciones, middlewares, rutas, archivos estaticos y el manejador de errores

module.exports = function (servidorConfiguraciones) {

    /**************************************************************************************** */
    // SETTINGS O CONFIGURACIONES DEL SERVIDOR "set" es la palabra clave (es analogo a guardar los valores, en este caso a guardar las configuraciones y se los utiliza con "get" que es analogo a leer valores)

    /**----------------------------------------------------------- */
    // que utilice como PUERTO la variable de entorno "process.env.PORT" (esta variable de entorno recien se la definira cuando la aplicacion sea subida a la WEB) o en su defecto el puerto "3000"
    servidorConfiguraciones.set("puerto", process.env.PORT || 3000);

    /**----------------------------------------------------------- */
    // indicamos donde esta la carpeta "vistas" que contiene a las plantillas de HANDDLEBARS
    const direccionVistas = patho.join(__dirname, "../vistas"); // "__dirname" devuelve la direccion actual del archivo donde nos encontramos ahora.    "," es para concatenar con '../vistas'

    servidorConfiguraciones.set("views", direccionVistas); // "views" es nombre standart
    /**----------------------------------------------------------- */
    // configuracion del MOTOR DE PLANTILLAS DE HANDLEBARS


    const cofiguracionHanddlebars = miMotorHandlebars({
        // nombre del archivo handdlebars que sera repetitivo (que se vera siempre) en todas las ventanas de nuestra aplicacion en el navegador, este sera "repetitivo.hbs" pero no sera necesario darle con su extension ".hbs"
        defaultLayout: "repetitivo",

        // direccion de los archivos parciales de handdlebars, estas son pequeñas partes de html (ahora en hbs) que pueden ser usadas en varias partes de la aplicacion. estos archivos estan dentro de la carpeta "parciales", el mismo que esta dentro de la carpeta "vistas. la direccion hasta "vistas", ya esta definida y guardada en el middleware "views", asi que leemos con "get"
        partialsDir: patho.join(servidorConfiguraciones.get("views"), "parciales"), // "," es para concatenar con el nombre de la carpeta "parciales"

        // damos la direccion de la carpeta "marcos", donde estaran las plantillas de html (ahora en hbs) que sera repetitivo (que se vera siempre) en todas las ventanas de nuestra aplicacion en el navegador
        layoutsDir: patho.join(servidorConfiguraciones.get("views"), "marcos"),

        // nombre que le daremos a la extension de los archivos de HANDDLEBARS (es mejor respetar el nombre ".hbs")
        extname: ".hbs",

        // direccion del archivo donde se encuentran las funciones que seran usadas por HANDDLEBARS, este es "ayucoservidor.js" este esta en la misma carpeta que "configuracion.js". No es necesario ponerle con la extencion ".js"
        helpers: require("./ayucoservidor"),
    });

    // la configuracion (cofiguracionHanddlebars) que hicimos, se la aplicaremos al motor (engine) de plantillas haddlebars ".hbs"
    servidorConfiguraciones.engine(".hbs", cofiguracionHanddlebars);
    servidorConfiguraciones.set("view engine", ".hbs");

    /**************************************************************************************** */
    // FUNCIONES MIDDLEWARES (la palabra clave es "use")
    // son funciones que se deben ejecutar antes de las rutas del servidor

    servidorConfiguraciones.use(morgan("dev")); // para ver en consola los requerimientos al servidor

    // para subir los archivos (como imagenes, pdf) desde el navegador, primero seran subidos a la carpeta "temporal", es por ellos que se le dara la direccion de esta carpeta.
    servidorConfiguraciones.use(
        multer({ dest: patho.join(__dirname, "../publico/subido/temporal") }).single(
            "subirArchivoNavegador"
        )
    ); // "subirArchivoNavegador" este nombre deve coincidir con el dado en el formulario HTML HANDDLEVARS  input type="file" name="subirArchivoNavegador" para subir imagenes, pdfs, todo lo que sea algun archivo que se desea subir desde el navegador

    /************************************************************************************* */
    // añadido por mi, para subir documentos pdf. NO FUNCIONA, SOLO DEBE EXISTIR UN SOLO MULTER CON SINGLE
    /*
        servidorConfiguraciones.use(multer({ dest: patho.join(__dirname, '../publico/subido/temporal') }).single('subirDocumentoNavegador'));
    */
    /************************************************************************************* */

    // "urlencoded" es solo para recibir los datos o archivos que vienen desde el formulario HTML (hbs)
    servidorConfiguraciones.use(express.urlencoded({ extended: false })); // aqui se uso "express", por eso se lo requirio al inicio del codigo.

    // para utilizar mansajes tipo "json" en el navegador, tambien para poder ver (en formato JSON) en la consola (negro) los datos de "req.body" que puedan venir de un formulario
    servidorConfiguraciones.use(express.json());

    //-----------------------------------------------------------------

    // #session-passport para SESIONES DEL USUARIO, alamacenar sus datos temporalmente
    servidorConfiguraciones.use(
        sesion({
            secret: "misecretoapp",
            resave: true,
            saveUninitialized: false, // "false" al parecer para que no exija volver a introducir usuario y contraseña nuevamente.
        })
    );

    // esta deve ir despues de "sesion"
    servidorConfiguraciones.use(pasaporte.initialize()); // "initialize" metodo funcion propio de "pasaporte"
    servidorConfiguraciones.use(pasaporte.session()); // ojo, aqui "session" es un metodo funcion propio de "pasaporte", asi que no confundir con nuestro "sesion".

    //-----------------------------------------------------------------
    // VARIABLES GLOBALES
    servidorConfiguraciones.use((req, res, next) => { // "use" es propio del servidor
        res.locals.user = req.user || null; 

        // ESTA A LA PRIMERA DARIA "undefined", pero cuando pase un usuario registrado y se valide sus datos, se mostrara todos los datos de este usuario
        // console.log(req.user);

        // LA RAZON POR LA QUE NO FUNCIONAN LAS SIGUIENTES A LA PRIMERA, ES PORQUE NO SE TENDRIAN AUN DATOS DE UN USUARIO, 
        // console.log(req.user.ci_administrador);

        next();
    });
    /**************************************************************************************** */
    // RUTAS DEL SERVIDOR, deben venir despues de los MIDDLEWARES.

    // las rutas del servidor ya se encuentran importadas a travez de "rutasDelServidor", por tanto lo ejecutamos pasandole como parametro el "servidorConfiguraciones" y nos devolvera las rutas del servidor
    rutasDelServidor(servidorConfiguraciones);

    /**************************************************************************************** */
    // ARCHIVOS ESTATICOS

    // dentro de .static como parametro se le da la direccion de la carpeta "publico"
    // aqui es donde se le da el nombre a la RUTA VIRTUAL (rutavirtualpublico) que nos conducira hasta la carpeta "PUBLICO"
    servidorConfiguraciones.use(
        "/rutavirtualpublico",
        express.static(patho.join(__dirname, "../publico"))
    );

    /**************************************************************************************** */
    // MANEJADOR DE ERRORES

    // "servidorConfiguraciones.get('env')" devuelve "developement" o "production"
    // esto nos indica el entorno en que nos encontramos en desarrollo nos devolvera "developemet", y si estamos en produccion (cuando se subira a la WEB) nos devolvera "production"

    if ("developement" === servidorConfiguraciones.get("env")) {
        // si estamos en entorno de desarrollo, entonces se usara el "errorHandlerin"
        servidorConfiguraciones.use(errorHandlerin);
    }

    // retornamos todas las configuraciones que se le dio al SERVIDOR
    return servidorConfiguraciones;
};
