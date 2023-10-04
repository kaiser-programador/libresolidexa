// para validar secion de ADMINISTRADORES y PROPIETARIOS

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
const { indiceAdministrador } = require("../modelos/indicemodelo");

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

const validador = {};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// usamos "async" porque hara uso de consultar la base de datos y esto requiere su tiempo de espera

validador.validar_adm = async (req, res, next) => {
    // ------- Para verificación -------
    //console.log("vemos que pasa con autenticate ADMINISTRADOR");
    //console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
        // AQUI ENCERRAR DENTRO DE UN IF SI EL ADMINISTRADOR ES EFECTIVAMENTE UN ADMINISTRADOR Y NO UN CLIENTE CON SU CUENTA INICIADA INTENTANDO ACCEDER A URL PROPIAS DE ADMINISTRADOR. SI SE COMPRUEBA EFECTIVAMENTE QUE ES UN ADMINISTRADOR, ENTONCES PERMITIR "return next();"
        //console.log("DATOS del administrador ingreso");
        //console.log(req.user);
        //console.log("el id del administrador ingreso");
        //console.log(req.user.id);
        //console.log("el CI del administrador ingreso");
        //console.log(req.user.ci_administrador);
        //console.log("el ESTADO del administrador ingreso");
        //console.log(req.user.estado_administrador);

        var ci_navegante = req.user.ci_administrador;
        var estado_navegante = req.user.estado_administrador;

        if (ci_navegante != null || estado_navegante != null) {
            var registroAdministrador = await indiceAdministrador.findOne(
                { ci_administrador: ci_navegante },
                {
                    estado_administrador: 1, // // activo   o    eliminado
                    _id: 0,
                }
            );

            // CON:  estado_navegante == "activo"   se verifica que efectivamente el navegante con cuenta sea un ADMINISTRADOR y no un cliente (porque puede darse el particular caso que un administrador con su CI, sea tambien con su mismo CI un administrador activo), ya que si estaria intentando acceder con su cuenta de CLIENTE a las url de administrador, no tendria la propiedad de: req.user.estado_administrador

            // CON ESTO SE GARANTIZA QUE PARA ACCEDER A LAS URL DE ADMINISTRADOR SE DEBE HACER DESDE LA CUENTA DE ADMINISTRADOR ACTIVO

            if (
                registroAdministrador.estado_administrador == "activo" &&
                estado_navegante == "activo"
            ) {
                // ------- Para verificación -------
                //console.log("ESTA VALIDADO EL ADMINISTRADOR INGRESANTE");
                return next(); // significa que se continuara con el codigo que tenga a continuacion de el...
                //next(); // OJO sin usar "return" NO FUNCIONARIA
            } else {
                //console.log("El usuario INTENTA INGRESAR A URL DE ADMINISTRADOR CON CUENTA FALSA 1");
                res.write("<h1>SU ACCESO A SISTEMA ADMINISTRATIVO A SIDO DENEGADO</h1>"); // mensaje que sera mostrado en la ventana del navegador
                // mensaje que sera mostrado en la ventana del navegador

                res.end(); // es para terminar la respuesta para que el navegador no se quede en espera de carga
            }
        } else {
            //console.log("El usuario INTENTA INGRESAR A URL DE ADMINISTRADOR CON CUENTA FALSA 2");
            res.write("<h1>SU ACCESO A SISTEMA ADMINISTRATIVO A SIDO DENEGADO</h1>"); // mensaje que sera mostrado en la ventana del navegador
            res.end(); // es para terminar la respuesta para que el navegador no se quede en espera de carga
        }

        // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    }
    // ------- Para verificación -------
    //console.log("El usuario ADM no esta validado");
    res.redirect("/laapirest"); // rediccionara a la pagina principal del administrador
};

/*
// CODIGO ORIGINAL SIN PROBLEMAS
validador.validar_adm = (req, res, next) => {
    // ------- Para verificación -------
    console.log("vemos que pasa con autenticate ADMINISTRADOR");
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        
        // ------- Para verificación -------
        //console.log("ESTA VALIDADO EL ADMINISTRADOR INGRESANTE");
        return next(); // significa que se continuara con el codigo que tenga a continuacion de el...
        //next(); // OJO sin usar "return" NO FUNCIONARIA
    }
    // ------- Para verificación -------
    //console.log("El usuario ADM no esta validado");
    res.redirect("/laapirest"); // rediccionara a la pagina principal del administrador
};
*/

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
validador.validar_cli_2 = (req, res, next) => {
    // ------- Para verificación -------
    //console.log("vemos que pasa con autenticate CLIENTE");
    //console.log(req.isAuthenticated()); // true o false
    if (req.isAuthenticated()) {
        // ------- Para verificación -------
        //console.log("ESTA VALIDADO EL PROPIETARIO INGRESANTE");

        //console.log("DATOS del CLIENTE PROPIETARIO ingreso");
        //console.log(req.user);

        // PARA EVITAR QUE ADMINISTRADORES CON SU CUENTA INTENTEN INGRESAR AL SISTEMA DEL CLIENTE PROPIETARIO CON INTENSIONES MALICIOSAS
        if (req.user.ci_propietario) {
            // si esta propiedad tiene dato, es decir no es null o indefenido, entonces se constata que efectivamente el navegante es un PROPIETARIO (ya que un administrador no cuenta con la propiedad "ci_propietario")
            req.inversor_autenticado = true; // ASI ES EL ENVIO DE DATOS (AGREGANDOLO AL req) PARA QUE OTRA FUNCION LA USE, USANDO "NEXT"
            return next(); // significa que se continuara con el codigo que tenga a continuacion de el...
            //next(); // OJO sin usar "return" NO FUNCIONARIA
        } else {
            // mensaje que sera mostrado en la ventana del navegador
            res.write(
                "<h1>ACCESO DENEGADO<br>Desde cuenta de ADMINISTRADOR no puede ingresar a direcciones de CLIENTE, primero deber&aacute; cerrar sesi&oacute;n como administrador.</h1>"
            );
            res.end(); // es para terminar la respuesta para que el navegador no se quede en espera de carga
        }
    } else {
        //console.log("NO ESTA VALIDADO EL CLIENTE INGRESANTE, PERO SE LE PERMITE NAVEGACION");

        req.inversor_autenticado = false; // ASI ES EL ENVIO DE DATOS (AGREGANDOLO AL req) PARA QUE OTRA FUNCION LA USE, USANDO "NEXT"
        return next(); // significa que se continuara con el codigo que tenga a continuacion de el...
    }
};

/*
// CODIGO ORIGINAL SIN PROBLEMAS
validador.validar_cli_2 = (req, res, next) => {
    // ------- Para verificación -------
    console.log("vemos que pasa con autenticate CLIENTE");
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        // ------- Para verificación -------
        console.log("ESTA VALIDADO EL CLIENTE INGRESANTE");

        console.log("DATOS del CLIENTE PROPIETARIO ingreso");
        console.log(req.user);

        req.inversor_autenticado = true; // ASI ES EL ENVIO DE DATOS (AGREGANDOLO AL req) PARA QUE OTRA FUNCION LA USE, USANDO "NEXT"
        return next(); // significa que se continuara con el codigo que tenga a continuacion de el...
        //next(); // OJO sin usar "return" NO FUNCIONARIA
    } else {
        console.log("NO ESTA VALIDADO EL CLIENTE INGRESANTE, PERO SE LE PERMITE NAVEGACION");

        req.inversor_autenticado = false; // ASI ES EL ENVIO DE DATOS (AGREGANDOLO AL req) PARA QUE OTRA FUNCION LA USE, USANDO "NEXT"
        return next(); // significa que se continuara con el codigo que tenga a continuacion de el...
    }
};
*/

module.exports = validador;
