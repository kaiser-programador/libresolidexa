// para usuario sesion

const pasaporte = require("passport");
const autentificacionLocal = require("passport-local").Strategy;

const {
    indiceAdministrador,
    indice_propietario,
    indiceEmpresa,
} = require("../modelos/indicemodelo");

// "verificar_usu_clave_adm" es el nombre que se le dara para especificar que realize todos las tareas contenidad de "ini alfa" hasta "fin alfa", esto es util para validar datos para ADMINISTRADOR e PROPIETARIO, pero si solo fuera uno solo, entonces no es necesario ponerle un nombre especifico

// ini alfa
pasaporte.use(
    "verificar_usu_clave_adm",
    new autentificacionLocal(
        {
            //pasaporte.use(
            //new autentificacionLocal(
            //{
            // los parametros que el usuario introducira para ingresar al sistema
            usernameField: "usuario", // el mismo en el "name" del input html
            passwordField: "clave", // el mismo en el "name" del input html

            // ejecutamos funcion para validar los datos que ingresa el usuario
            // "done" es un callback para terminar el proceso de autentificacion
            // "done" es para continuar con el proceso despues de la autentificacion
        },
        async (usuario, clave, done) => {
            // contamos el numero de administradores totales que existen en el sistema
            //var numAdm = await indiceAdministrador.find().count(); // SE CAMBIO, PORQUE DICE QUE ESTARA DEFECTUOSO

            // O PONER TODO EN UNO SOLO, DE MANERA QUE PRIMERO REVISAR POR LA CLAVE DE USUARIO SI ES ADMINISTRADOR O CLIENTE, LUEGO EN FUNCION AL TIPO QUE SEA VALIDAR LA CONTRASEÑA. DE ESA MANERA NO EXISTIRAN DOS EN ARRAY USANDO EL USER (VER ONENOTE)
            var numAdm = await indiceAdministrador.find().countDocuments();

            if (numAdm > 0) {
                const usuario_validado = await indiceAdministrador.findOne({
                    ad_usuario: usuario,
                    estado_administrador: "activo", // SOLO SE ADMITIRA EL INGRESO A ADM ACTIVOS (NO ASI A LOS ELIMINADOS)
                });

                // IMPORTANTE, REVISAR PRIMERO SI ES ADMINISTRADOR PERMITIDO ACTIVO O ELIMINADO
                //************************************************ */
                if (!usuario_validado) {
                    // si no se encuentra al usuario
                    // (la autentificacion puede terminar como un: error, un usuario encontrado o con un mensaje)
                    // le damos "null" para el error (porque no existe error), "false" para el usuario porque el usuario no fue encontrado, y enviamos un mensaje { }
                    return done(null, false, { message: "Usuario ADMINISTRADOR no encontrado" });
                } else {
                    // si el usuario es encontrado
                    // entonces procedemos a validar la contraseña que introdujo

                    // devuelve false o true. OJO AQUI ES "usuario_validado", NO ES "indiceAdministrador", porque "usuario_administrador" ya tiene los metodos de encriptacion de contraseñas
                    // ------- Para verificación -------
                    //console.log("EL USUARIO VALIDADO ADM CON TODO");
                    //console.log(usuario_validado);
                    const contrasena_validada = await usuario_validado.compararContrasena(clave);

                    if (contrasena_validada) {
                        // si la contraseña es valida
                        // "null" porque no existe un error y "usuario_validado" porque devolveremos los datos del administrador que se tiene en la base de datos
                        return done(null, usuario_validado);
                    } else {
                        // si la contraseña no es valida

                        // "null" porque no existe error, "false" porque no se encontro al administrador (con esa  contraseña) y devolvemos un mensaje
                        return done(null, false, {
                            message: "Contraseña ADMINISTRADOR incorrecta",
                        });
                    }
                }
            } else {
                // si este es el primer administrador, por tanto es el MAESTRO, de manera que los datos ingresados como "usuario y contraseña" sera tomados como correctos

                // creamos la base de datos de EMPRESA
                // para que se creen por defecto los textos defecto de la empresa
                const datosEmpresa = new indiceEmpresa({});
                await datosEmpresa.save();

                // guardamos en la base de datos estos datos de administrador MAESTRO

                const admiMaestro = new indiceAdministrador({
                    ci_administrador: usuario, // es su C.I.
                    ad_usuario: usuario,
                    ad_clave: clave,
                    clase: "maestro",
                });

                //----------------------------------
                // #session-passport #encriptar-contraseña encriptar contraseña y guardarlo en la base de datos
                admiMaestro.ad_clave = await admiMaestro.encriptarContrasena(clave);
                //----------------------------------

                await admiMaestro.save();

                const usuario_validado = await indiceAdministrador.findOne({
                    ad_usuario: usuario,
                });

                // se asumira "usuario y contraseña" validad, por se el primer administrador tipo MAESTRO
                // y se lo tratara enviara por la ruta correcta
                return done(null, usuario_validado);
            }
        }
    )
);
// fin alfa

// ini alfa
pasaporte.use(
    "verificar_usu_clave_cli",
    new autentificacionLocal(
        {
            //pasaporte.use(
            //new autentificacionLocal(
            //{
            // los parametros que el usuario introducira para ingresar al sistema
            usernameField: "usuario", // el mismo en el "name" del input html
            passwordField: "clave", // el mismo en el "name" del input html

            // ejecutamos funcion para validar los datos que ingresa el usuario
            // "done" es un callback para terminar el proceso de autentificacion
            // "done" es para continuar con el proceso despues de la autentificacion
        },
        async (usuario, clave, done) => {
            // ------- Para verificación -------
            //console.log("datos del usuario USUARIO LOCO PROPIETARIO");
            //console.log(usuario);
            // ------- Para verificación -------
            //console.log("datos de usuario CLAVE LOCO PROPIETARIO");
            //console.log(clave);
            // ------- Para verificación -------
            // console.log("datos de usuario TIPO LOCO");
            // console.log(tipo);
            //----------------------------------
            const usuario_validado = await indice_propietario.findOne({
                usuario_propietario: usuario,
            });
            if (!usuario_validado) {
                // si no se encuentra al usuario
                // (la autentificacion puede terminar como un: error, un usuario encontrado o con un mensaje)
                // le damos "null" para el error (porque no existe error), "false" para el usuario porque el usuario no fue encontrado, y enviamos un mensaje { }
                return done(null, false, { message: "Usuario CLIENTE no encontrado" });
            } else {
                // si el usuario es encontrado
                // entonces procedemos a validar la contraseña que introdujo

                // devuelve false o true. OJO AQUI ES "usuario_validado", NO ES "indice_propietario", porque "usuario_administrador" ya tiene los metodos de encriptacion de contraseñas
                const contrasena_validada = await usuario_validado.compararContrasena(clave);

                if (contrasena_validada) {
                    // si la contraseña es valida
                    // "null" porque no existe un error y "usuario_validado" porque devolveremos los datos del administrador que se tiene en la base de datos
                    return done(null, usuario_validado);
                } else {
                    // si la contraseña no es valida

                    // "null" porque no existe error, "false" porque no se encontro al administrador (con esa  contraseña) y devolvemos un mensaje
                    return done(null, false, { message: "Contraseña CLIENTE incorrecta" });
                }
            }
        }
    )
);
// fin alfa

// UNA VEZ que el usuario este autentificado (se loguee), su sesion debe ser guardada
// al momento que el usuario se autentique, se guardara en una sesion el id (que le da mongo) del usuario, asi se evita tener que pedir al usuario que introdusca nuevamente sus datos para ingresar al sistema
pasaporte.serializeUser((usuario_validado, done) => {
    // ------- Para verificación -------
    //console.log("los datos del Administrador o Cliente validado en pasaporte es:");
    //console.log(usuario_validado);

    var tipo_usuario = usuario_validado.clase;
    if (tipo_usuario == "" || tipo_usuario == undefined || tipo_usuario == null) {
        var resultado = {
            id: usuario_validado.id,
            tipo: "cliente",
        };
    } else {
        var resultado = {
            id: usuario_validado.id,
            tipo: "administrador",
        };
    }
    done(null, resultado);
});

// por cada navegacion se desearializara al usuario
// lo siguiente lo que hace es tomar un id y genera un usuario
// si existe un usuario en la sesion, entonces buscara por su "id" a ese usuario
pasaporte.deserializeUser((resultado, done) => {
    // ------- Para verificación -------
    //console.log("el id en desearilizacion es:");
    //console.log(resultado);

    if (resultado.tipo == "cliente") {
        var id = resultado.id;
        // en la busqueda puedo tener un error "err" o encontrar al usuario "usuario_encontrado"
        indice_propietario.findById(id, (err, usuario_encontrado) => {
            done(err, usuario_encontrado);
        });
    }
    if (resultado.tipo == "administrador") {
        var id = resultado.id;
        // en la busqueda puedo tener un error "err" o encontrar al usuario "usuario_encontrado"
        indiceAdministrador.findById(id, (err, usuario_encontrado) => {
            done(err, usuario_encontrado);
        });
    }
});
