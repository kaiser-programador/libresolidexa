// controlador para GENERICOS

// TODO LO REFERENTE A LA PARTE DE TERRENO PARA ALBERGAR PROPUESTAS DE PROYECTOS
const pache = require("path");
const fs = require("fs-extra");
const fileType = require("file-type");
//const moment = require("moment");

//const { direccionBaseDatos } = require("../claves");
//const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");

const {
    codigoAlfanumericoImagen,
    codAlfanumImagenEmp_sf,
    codigoAlfanumericoImagenTe,
    codigoAlfanumericoDocumento,
} = require("../ayudas/ayudaslibreria");

const {
    indiceTerreno,
    indiceImagenesEmpresa_sf,
    indiceImagenesTerreno,
    indiceProyecto,
    indiceImagenesProyecto,
    indiceDocumentos,
    indiceInmueble,
    indiceInversiones,
    indice_propietario,
    indiceImagenesSistema,
} = require("../modelos/indicemodelo");

const {
    verificadorTerrenoBloqueado,
    guardarAccionAdministrador,
} = require("../ayudas/funcionesayuda_1");

//const { cabezeras_adm_cli } = require("../ayudas/funcionesayuda_2");

const controladorAdministradorGeneral = {};

/************************************************************************************ */
// CONTROLADOR PARA VERIFICAR SI SE TIENE PERMISO PARA CREAR NUEVO PROYECTO DENTRO DE UN TERRENO

controladorAdministradorGeneral.permisoNuevoProyecto = async (req, res) => {
    //  ruta   POST  "/laapirest/administracion/general/accion/permiso_nuevo_proyecto"
    try {
        const codigo_terreno = req.body.codigo_terreno;

        var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

        if (acceso == "permitido") {
            const terreno_encontrado = await indiceTerreno.findOne(
                { codigo_terreno: codigo_terreno },
                {
                    convocatoria_disponible: 1, // false o true
                    anteproyectos_maximo: 1,
                    anteproyectos_registrados: 1,
                    _id: 0,
                }
            );

            if (terreno_encontrado) {
                // si es "true", significa que aun queda espacio para admitir anteproyectos
                if (
                    terreno_encontrado.convocatoria_disponible == true &&
                    terreno_encontrado.anteproyectos_registrados <
                        terreno_encontrado.anteproyectos_maximo
                ) {
                    res.json({
                        exito: "libre",
                    });
                } else {
                    res.json({
                        exito: "lleno",
                    });
                }
            } else {
                res.json({
                    exito: "no",
                });
            }
        } else {
            // si el acceso es denegado
            res.json({
                exito: "denegado",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// CONTROLADOR PARA VERIFICAR SI SE TIENE PERMISO PARA CREAR NUEVO INMUEBLE DENTRO DE UN PROYECTO

controladorAdministradorGeneral.permisoNuevoInmueble = async (req, res) => {
    //  ruta   POST  "/laapirest/administracion/general/accion/permiso_nuevo_inmueble"
    try {
        const codigo_proyecto = req.body.codigo_proyecto;

        var registro_proyecto = await indiceProyecto.findOne(
            { codigo_proyecto: codigo_proyecto },
            { codigo_terreno: 1 }
        );

        if (registro_proyecto) {
            var codigo_terreno = registro_proyecto.codigo_terreno;
            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

            if (acceso == "permitido") {
                res.json({
                    exito: "permitido",
                });
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
                });
            }
        } else {
            res.json({
                exito: "no",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// PARA subir al servidor imagenes del TERRENO, PROYECTO, EMPRESA FUNCIONA, EMPRESA SOMOS

// RUTA   "post"  /laapirest/administracion/general/accion/subir_imagen

controladorAdministradorGeneral.subirImagen = async (req, res) => {
    try {
        // ------- Para verificación -------
        //console.log("los mensajes body de guardar imagen");
        //console.log(req.body);

        const tipo_imagen = req.body.tipo_imagen;
        const codigo_objetivo = req.body.codigo_objetivo;
        const codigo_terreno = req.body.codigo_terreno;
        const tipo_imagen_py = req.body.tipo_imagen_py; // puede ser "py" o "py_rs"

        if (tipo_imagen == "terreno" || tipo_imagen == "proyecto") {
            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);
        } else {
            // para imagens que son exclusivas de la empresa
            if (tipo_imagen == "empresa_somos" || tipo_imagen == "empresa_funciona") {
                var acceso = "permitido";
            }
        }

        if (acceso == "permitido") {
            funcionGuardaImagen();

            async function funcionGuardaImagen() {
                if (tipo_imagen == "empresa_somos") {
                    // esta funcion genera el codigo alfanumerico de la imagen (ojo, sin extension)
                    var CodigoImagenCreada = codAlfanumImagenEmp_sf();

                    // revisamos en la base de datos, si el codigo de la imagen alfanumerico ya existe
                    var codigoImagenExistente = await indiceImagenesEmpresa_sf.find({
                        codigo_imagen: CodigoImagenCreada,
                    });
                }

                if (tipo_imagen == "empresa_funciona") {
                    // esta funcion genera el codigo alfanumerico de la imagen (ojo, sin extension)
                    var CodigoImagenCreada = codAlfanumImagenEmp_sf();

                    // revisamos en la base de datos, si el codigo de la imagen alfanumerico ya existe
                    var codigoImagenExistente = await indiceImagenesEmpresa_sf.find({
                        codigo_imagen: CodigoImagenCreada,
                    });
                }

                if (tipo_imagen == "terreno") {
                    // esta funcion genera el codigo alfanumerico de la imagen (ojo, sin extension)
                    var CodigoImagenCreada = codigoAlfanumericoImagenTe();

                    // revisamos en la base de datos, si el codigo de la imagen alfanumerico ya existe
                    var codigoImagenExistente = await indiceImagenesTerreno.find({
                        codigo_imagen: CodigoImagenCreada,
                    });
                }

                if (tipo_imagen == "proyecto") {
                    // esta funcion genera el codigo alfanumerico de la imagen (ojo, sin extension)
                    var CodigoImagenCreada = codigoAlfanumericoImagen();

                    // revisamos en la base de datos, si el codigo de la imagen alfanumerico ya existe
                    var codigoImagenExistente = await indiceImagenesProyecto.find({
                        codigo_imagen: CodigoImagenCreada,
                    });
                }

                // si se encuentra una imagen con el mismo codigo alfanumerico
                if (codigoImagenExistente.length > 0) {
                    // entonces se le creara un nuevo codigo
                    funcionGuardaImagen(); // volvemos a ejecutar la funcion nuevamente, a esto se llama FUNCION RECURSIVA.
                } else {
                    // si el codigo es unico y no tiene similares, entonces

                    // extraemos la direccion donde se encuentra temporalmente la imagen (carpeta temporal) y la guardamos en la constante "direccionTemporalImagen"
                    const direccionTemporalImagen = req.file.path; // es "path" (no pache, la que requerimos al inicio), esta es la propiedad propia de "file"

                    // (extname) extraemos la extension de la imagen y la convertimos en minuscula "toLowerCase" por precausion, porque el codigo alfanumerico generado, se genera en minuscula.
                    const extensionImagenMinuscula = pache
                        .extname(req.file.originalname)
                        .toLowerCase();

                    /*
                    // direccion de destino, donde sera guardada la imagen (se la guardara en la carpeta "subido"), esta direccion sera guardada en la constante "direccionDestinoImagen"
                    // la imagen sera guardada con el codigo alfanumerico que se le dio
                    const direccionDestinoImagen = pache.resolve(
                        `src/publico/subido/${CodigoImagenCreada}${extensionImagenMinuscula}`
                    );
                    */

                    // para validar la imagen, que lo que se esta subiendo sea en verdad un archivo de imagen
                    const tipo_archivo_a = req.file.mimetype.toLowerCase(); // en minuscula

                    //console.log("tipo_archivo_a");
                    //console.log(tipo_archivo_a);

                    // para validar si en verdad es una imagen y NO UN ARCHIVO CORRUPTO (aquel que tiene la extension de imagen, pero que en verdad es de otro tipo) con "file-type"
                    // con fileType analizamos si es un archivo de imagen verdadero, y para ello le damos la direccion donde esta almacenado temporalmente el archivo antes de ser subido al servidor
                    const infoArchivo = await fileType.fromFile(direccionTemporalImagen);

                    if (infoArchivo != undefined) {
                        // si el archivo no es de tipo indefinido
                        // ej, nos devolvera un objeto con la siguiente informacion { ext: 'jpg', mime: 'image/jpeg' } por tanto nos interezara solo el valor de su "mime"
                        const tipo_archivo_b = infoArchivo.mime.toLowerCase(); // en minuscula

                        //console.log("tipo_archivo_b");
                        //console.log(tipo_archivo_b);

                        if (
                            (tipo_archivo_a === "image/png" ||
                                tipo_archivo_a === "image/jpg" ||
                                tipo_archivo_a === "image/jpeg" ||
                                tipo_archivo_a === "image/gif") &&
                            (tipo_archivo_b === "image/png" ||
                                tipo_archivo_b === "image/jpg" ||
                                tipo_archivo_b === "image/jpeg" ||
                                tipo_archivo_b === "image/gif")
                        ) {
                            /*
                            // "fs.rename" mueve un archivo (es este caso una imagen) del lugar de origen (direccionTemporalImagen) a otro destino (direccionDestinoImagen)
                            await fs.rename(direccionTemporalImagen, direccionDestinoImagen);
                            */

                            //--------------------------------------------------------------
                            // PARA SUBIR ARCHIVO IMAGEN A FIREBASE

                            const storage = getStorage();

                            var nombre_y_ext = CodigoImagenCreada + extensionImagenMinuscula;
                            // para guardar en la carpeta "subido" en firebase con el nombre y la extension de la imagen incluida
                            var direccionDestinoImagen = "subido/" + nombre_y_ext;

                            // cramos una referencia al archivo imagen. donde se guardara y con que nombre sera guardado dentro de firebase
                            const storageRef = ref(storage, direccionDestinoImagen);

                            const data = await fs.promises.readFile(direccionTemporalImagen); // Utilizamos fs.promises.readFile para obtener una versión promisificada de fs.readFile

                            // ESPERAMOS QUE SUBA LA IMAGEN
                            await uploadBytes(storageRef, data);

                            //console.log("Archivo subido con éxito a Firebase Storage");

                            // Obtiene la URL de descarga pública de la imagen
                            const url_imagen = await getDownloadURL(storageRef);

                            //console.log("URL de descarga pública:", url_imagen);

                            //--------------------------------------------------------------
                            // despues de subir la imagen a firebase, eliminamos el archivo de la carpeta "temporal" donde se encuentra alamacenado temporalmente
                            // con "fs.unlink" eliminamos el archivo imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado.
                            await fs.unlink(direccionTemporalImagen);
                            //--------------------------------------------------------------

                            if (tipo_imagen == "empresa_somos") {
                                const datosImagenNueva = new indiceImagenesEmpresa_sf({
                                    codigo_imagen: CodigoImagenCreada, // sin extension
                                    extension_imagen: extensionImagenMinuscula,
                                    tipo_imagen: "somos",
                                    titulo_imagen: req.body.titulo_imagen,
                                    texto_imagen: req.body.texto_imagen,
                                    // porque aunque en html esta espeficicado su campo input como numerico, aqui llega como string, por lo tanto debe ser convertido nuevamente a numerico antes de ser guardado en la base de datos
                                    orden_imagen: Number(req.body.orden_imagen),
                                    url: url_imagen,
                                });

                                // ahora guardamos en la base de datos la informacion de la imagen creada
                                await datosImagenNueva.save();

                                var texto_imagen = req.body.texto_imagen;
                                var orden_imagen = Number(req.body.orden_imagen);
                                var titulo_imagen = req.body.titulo_imagen;

                                var fragmento = " de empresa SOMOS";
                            }

                            if (tipo_imagen == "empresa_funciona") {
                                const datosImagenNueva = new indiceImagenesEmpresa_sf({
                                    codigo_imagen: CodigoImagenCreada, // sin extension
                                    extension_imagen: extensionImagenMinuscula,
                                    tipo_imagen: "funciona",
                                    titulo_imagen: req.body.titulo_imagen,
                                    texto_imagen: req.body.texto_imagen,
                                    orden_imagen: Number(req.body.orden_imagen),
                                    url: url_imagen,
                                });

                                // ahora guardamos en la base de datos la informacion de la imagen creada
                                await datosImagenNueva.save();

                                // se guardo por defecto "es_requerimiento" como false, ahora corregimos si debera ser true o mantenerse como false
                                if (req.body.name_check_requerimiento) {
                                    // si es true
                                    // significa que esta casilla esta seleccionada, entonces guardamos como true en la base de datos
                                    // updateOne guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
                                    await indiceImagenesEmpresa_sf.updateOne(
                                        { codigo_imagen: CodigoImagenCreada },
                                        { $set: { es_requerimiento: true } }
                                    );
                                }

                                var texto_imagen = req.body.texto_imagen;
                                var orden_imagen = Number(req.body.orden_imagen);
                                var titulo_imagen = req.body.titulo_imagen;

                                var fragmento = " de empresa FUNCIONA";
                            }

                            if (tipo_imagen == "terreno") {
                                const datosImagenNueva = new indiceImagenesTerreno({
                                    codigo_terreno: codigo_objetivo,
                                    nombre_imagen: req.body.nombreImagenHtml,
                                    codigo_imagen: CodigoImagenCreada, // sin extension
                                    extension_imagen: extensionImagenMinuscula,
                                    // imagen_principal por defecto estara en FALSE
                                    url: url_imagen,
                                });

                                // ahora guardamos en la base de datos la informacion de la imagen creada
                                await datosImagenNueva.save();
                                var nombreImagen = req.body.nombreImagenHtml;
                                var fragmento = " de terreno " + codigo_objetivo;
                            }

                            if (tipo_imagen == "proyecto") {
                                if (tipo_imagen_py == "py") {
                                    const datosImagenNueva = new indiceImagenesProyecto({
                                        codigo_terreno: codigo_terreno,
                                        codigo_proyecto: codigo_objetivo,
                                        nombre_imagen: req.body.nombreImagenHtml,
                                        codigo_imagen: CodigoImagenCreada, // sin extension
                                        extension_imagen: extensionImagenMinuscula,
                                        imagen_respon_social: false, // para indicar que no es de RESPONSABILIDAD SOCIAL
                                        url: url_imagen,
                                    });
                                    // ahora guardamos en la base de datos la informacion de la imagen creada
                                    await datosImagenNueva.save();
                                    var nombreImagen = req.body.nombreImagenHtml;
                                }

                                if (tipo_imagen_py == "py_rs") {
                                    // si es una imagen de RESPONSABILIDAD SOCIAL
                                    const datosImagenNueva = new indiceImagenesProyecto({
                                        codigo_terreno: codigo_terreno,
                                        codigo_proyecto: codigo_objetivo,
                                        nombre_imagen: req.body.nombreImagenHtml,
                                        codigo_imagen: CodigoImagenCreada, // sin extension
                                        extension_imagen: extensionImagenMinuscula,
                                        imagen_respon_social: true, // para indicar que SI es de RESPONSABILIDAD SOCIAL
                                        url: url_imagen,
                                    });
                                    // ahora guardamos en la base de datos la informacion de la imagen creada
                                    await datosImagenNueva.save();
                                    var nombreImagen = req.body.nombreImagenHtml;
                                }
                                var fragmento = " de proyecto " + codigo_objetivo;
                            }

                            //-------------------------------------------------------------------
                            // guardamos en el historial de acciones
                            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                            var accion_administrador =
                                "Guarda imagen " + CodigoImagenCreada + fragmento;
                            var aux_accion_adm = {
                                ci_administrador,
                                accion_administrador,
                            };
                            await guardarAccionAdministrador(aux_accion_adm);
                            //-------------------------------------------------------------------

                            if (tipo_imagen == "terreno" || tipo_imagen == "proyecto") {
                                res.json({
                                    exito: "si",
                                    codigoImagen: CodigoImagenCreada,
                                    nombreImagen,
                                    extensionImagen: extensionImagenMinuscula,
                                    url: url_imagen,
                                });
                            } else {
                                if (
                                    tipo_imagen == "empresa_somos" ||
                                    tipo_imagen == "empresa_funciona"
                                ) {
                                    res.json({
                                        exito: "si",
                                        codigoImagen: CodigoImagenCreada,
                                        extensionImagen: extensionImagenMinuscula,
                                        texto_imagen,
                                        orden_imagen,
                                        titulo_imagen,
                                        url: url_imagen,
                                    });
                                }

                                // if (tipo_imagen == "empresa_funciona") {
                                //     res.json({
                                //         exito: "si",
                                //         codigoImagen: CodigoImagenCreada,
                                //         extensionImagen: extensionImagenMinuscula,
                                //         texto_imagen,
                                //         orden_imagen,
                                //         titulo_imagen,
                                //     });
                                // }
                            }
                        } else {
                            // en caso de que el archivo no sea una IMAGEN, entonces sera eliminado de la carpeta "TEMPORAL"
                            // con "fs.unlink" eliminamos el archivo que no es una imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
                            await fs.unlink(direccionTemporalImagen);

                            res.json({
                                exito: "no",
                                mensaje: "Solo imagenes estan permitidas",
                            });
                        }
                    } else {
                        // en caso de que el archivo no sea una IMAGEN, entonces sera eliminado de la carpeta "TEMPORAL"
                        // con "fs.unlink" eliminamos el archivo que no es una imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
                        await fs.unlink(direccionTemporalImagen);

                        res.json({
                            exito: "no",
                            mensaje: "Solo imagenes estan permitidas",
                        });
                    }
                }
            }
        } else {
            const direccionTemporalImagen = req.file.path; // es "path" (no pache, la que requerimos al inicio), esta es la propiedad propia de "file"
            // con "fs.unlink" eliminamos el archivo, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
            await fs.unlink(direccionTemporalImagen);

            // si el acceso es denegado
            res.json({
                exito: "denegado",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// PARA subir al servidor imagenes del SISTEMA: CABECERAS Y PRINCIPAL

// RUTA   "post"  /laapirest/administracion/general/accion/subir_imagen_empresa

controladorAdministradorGeneral.subirImagenEmpresa = async (req, res) => {
    try {
        // ------- Para verificación -------
        //console.log("los mensajes body de guardar imagen de SISTEMA EMPRESA");
        //console.log(req.body);

        // revisamos si la imagen es en verdad una imagen en formato jpg

        //console.log("INICIO LA DIRECCION ACTUAL DEL ARCHIVO adm_generales");
        //console.log(__dirname);
        //console.log("FIN LA DIRECCION ACTUAL DEL ARCHIVO adm_generales");

        // extraemos la direccion donde se encuentra temporalmente la imagen (carpeta temporal) y la guardamos en la constante "direccionTemporalImagen"
        const direccionTemporalImagen = req.file.path; // es "path" (no pache, la que requerimos al inicio), esta es la propiedad propia de "file"

        console.log(
            "VEMOS INICIO EL req.file.path PARA VER LA DIRECCION ACTUAL DONDE ESTA GUARDADA LA IMAGEN TEMPORALMENTE"
        );
        console.log(direccionTemporalImagen);
        console.log("VEMOS FIN");

        // para validar la imagen, que lo que se esta subiendo sea en verdad un archivo de imagen
        const tipo_archivo_a = req.file.mimetype.toLowerCase(); // en minuscula

        // para validar si en verdad es una imagen y NO UN ARCHIVO CORRUPTO (aquel que tiene la extension de imagen, pero que en verdad es de otro tipo) con "file-type"
        // con fileType analizamos si es un archivo de imagen verdadero, y para ello le damos la direccion donde esta almacenado temporalmente el archivo antes de ser subido al servidor
        const infoArchivo = await fileType.fromFile(direccionTemporalImagen);

        if (infoArchivo != undefined) {
            // si el archivo no es de tipo indefinido
            // ej, nos devolvera un objeto con la siguiente informacion { ext: 'jpg', mime: 'image/jpeg' } por tanto nos interezara solo el valor de su "mime"
            const tipo_archivo_b = infoArchivo.mime.toLowerCase(); // en minuscula

            //console.log("el tipo_archivo_a: " + tipo_archivo_a);
            //console.log("el tipo_archivo_b: " + tipo_archivo_b);

            // PARA IMAGENES DEL SISTEMA, SOLO ESTARAN PERMITIDAS SUBIR IMAGENES "jpg" o jpeg
            if (
                tipo_archivo_a === "image/jpg" ||
                (tipo_archivo_a === "image/jpeg" && tipo_archivo_b === "image/jpg") ||
                tipo_archivo_b === "image/jpeg"
            ) {
                const tipo_imagen = req.body.name_radio_tipo_img_emp; // los 14 tipos de imagen de la empresa, ej/ cabecera_convocatoria

                // revisamos la existencia en la BD del tipo de imagen que se pretende subir

                var imagenExistente = await indiceImagenesSistema.findOne(
                    {
                        tipo_imagen: tipo_imagen,
                    },
                    {
                        imagen: 1,
                        completo: 1, // EJ/ "cabecera_convocatoria.jpg", "inicio_horizontal.jpg"
                    }
                );

                // (extname) extraemos la extension de la imagen y la convertimos en minuscula "toLowerCase" por precausion, porque el codigo alfanumerico generado, se genera en minuscula.
                const extensionImagenMinuscula = pache.extname(req.file.originalname).toLowerCase();

                if (imagenExistente) {
                    // si la imagen existe, entonces se procedera a eliminar la existente porque sera reemplazado con la nueva imagen que ocupara su lugar

                    /*
                    // direccion de las imagenes del sistema
                    const direccionExistente = pache.resolve(
                        `src/publico/imagenes/imagenes_sistema/${imagenExistente.completo}`
                    );

                    // con "fs.unlink" eliminamos el archivo imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado.
                    await fs.unlink(direccionExistente);
                    */

                    const storage = getStorage();

                    var nombre_y_ext = imagenExistente.completo;
                    // para guardar en la carpeta "imagenes_sistema" en firebase con el nombre y la extension de la imagen incluida
                    var direccionActualImagen = "imagenes_sistema/" + nombre_y_ext;

                    // Crear una referencia al archivo que se eliminará
                    const desertRef = ref(storage, direccionActualImagen);

                    // Eliminar el archivo y esperar la promesa
                    await deleteObject(desertRef);

                    // Archivo eliminado con éxito
                    //console.log("Archivo eliminado con éxito");

                    /*
                    // direccion de destino, donde sera guardada la imagen (se la guardara en la carpeta "subido"), esta direccion sera guardada en la constante "direccionDestinoImagen"
                    // la imagen sera guardada
                    const direccionDestinoImagen = pache.resolve(
                        `src/publico/imagenes/imagenes_sistema/${tipo_imagen}${extensionImagenMinuscula}`
                    );

                    // ahora guardamos la nueva imagen
                    // "fs.rename" mueve un archivo (es este caso una imagen) del lugar de origen (direccionTemporalImagen) a otro destino (direccionDestinoImagen)
                    await fs.rename(direccionTemporalImagen, direccionDestinoImagen);
                    */

                    //--------------------------------------------------------------
                    // PARA SUBIR ARCHIVO IMAGEN A FIREBASE

                    //const storage = getStorage();

                    var nombre_y_ext = tipo_imagen + extensionImagenMinuscula;
                    // para guardar en la carpeta "imagenes_sistema" en firebase con el nombre y la extension de la imagen incluida
                    var direccionDestinoImagen = "imagenes_sistema/" + nombre_y_ext;

                    // cramos una referencia al archivo imagen. donde se guardara y con que nombre sera guardado dentro de firebase
                    const storageRef = ref(storage, direccionDestinoImagen);

                    const data = await fs.promises.readFile(direccionTemporalImagen); // Utilizamos fs.promises.readFile para obtener una versión promisificada de fs.readFile

                    // ESPERAMOS QUE SUBA LA IMAGEN
                    await uploadBytes(storageRef, data);

                    // Obtiene la URL de descarga pública de la imagen
                    const url_imagen = await getDownloadURL(storageRef);

                    //--------------------------------------------------------------
                    // despues de subir la imagen a firebase, eliminamos el archivo de la carpeta "temporal" donde se encuentra alamacenado temporalmente
                    // con "fs.unlink" eliminamos el archivo imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado.
                    await fs.unlink(direccionTemporalImagen);
                    //--------------------------------------------------------------

                    // por seguridad solo actualizamos el atributo "completo" de la BD con el nombre y la extension con la que se guardo la nueva imagen
                    await indiceImagenesSistema.updateOne(
                        { tipo_imagen: tipo_imagen },
                        { $set: { completo: nombre_y_ext, url: url_imagen } }
                    );

                    var imagen = imagenExistente.imagen;

                    //-------------------------------------------------------------------
                    // guardamos en el historial de acciones
                    var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                    var accion_administrador =
                        "Reemplaza imagen sistema " + tipo_imagen + extensionImagenMinuscula;
                    var aux_accion_adm = {
                        ci_administrador,
                        accion_administrador,
                    };
                    await guardarAccionAdministrador(aux_accion_adm);
                    //-------------------------------------------------------------------

                    res.json({
                        exito: "si",
                        tipo_imagen,
                        imagen,
                        url: url_imagen,
                    });
                } else {
                    // si no existe la imagen, entonces se procedera a ser almacenado en la BD

                    /*
                    // direccion de destino, donde sera guardada la imagen (se la guardara en la carpeta "subido"), esta direccion sera guardada en la constante "direccionDestinoImagen"
                    // la imagen sera guardada con el codigo alfanumerico que se le dio
                    const direccionDestinoImagen = pache.resolve(
                        `src/publico/imagenes/imagenes_sistema/${tipo_imagen}${extensionImagenMinuscula}`
                    );

                    // ahora guardamos la nueva imagen
                    // "fs.rename" mueve un archivo (es este caso una imagen) del lugar de origen (direccionTemporalImagen) a otro destino (direccionDestinoImagen)
                    await fs.rename(direccionTemporalImagen, direccionDestinoImagen);
                    */

                    /*
                    const firebaseConfig = {
                        apiKey: direccionBaseDatos.F_API_KEY,
                        authDomain: direccionBaseDatos.F_AUTH_DOMAIN,
                        projectId: direccionBaseDatos.F_PROJECT_ID,
                        storageBucket: direccionBaseDatos.F_STORAGE_BUCKET,
                        messagingSenderId: direccionBaseDatos.F_MESSAGING_SENDER_ID,
                        appId: direccionBaseDatos.F_APP_ID,
                    };

                    const app = initializeApp(firebaseConfig);
                    */

                    //const storage = getStorage(app);

                    //--------------------------------------------------------------
                    // PARA SUBIR ARCHIVO IMAGEN A FIREBASE

                    const storage = getStorage();

                    var nombre_y_ext = tipo_imagen + extensionImagenMinuscula;
                    // para guardar en la carpeta "imagenes_sistema" en firebase con el nombre y la extension de la imagen incluida
                    var direccionDestinoImagen = "imagenes_sistema/" + nombre_y_ext;

                    // cramos una referencia al archivo imagen. donde se guardara y con que nombre sera guardado dentro de firebase
                    const storageRef = ref(storage, direccionDestinoImagen);

                    const data = await fs.promises.readFile(direccionTemporalImagen); // Utilizamos fs.promises.readFile para obtener una versión promisificada de fs.readFile

                    // ESPERAMOS QUE SUBA LA IMAGEN
                    await uploadBytes(storageRef, data);

                    console.log("Archivo subido con éxito a Firebase Storage");

                    // Obtiene la URL de descarga pública de la imagen
                    const url_imagen = await getDownloadURL(storageRef);

                    console.log("URL de descarga pública:", url_imagen);

                    //--------------------------------------------------------------
                    // despues de subir la imagen a firebase, eliminamos el archivo de la carpeta "temporal" donde se encuentra alamacenado temporalmente
                    // con "fs.unlink" eliminamos el archivo imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado.
                    await fs.unlink(direccionTemporalImagen);
                    //--------------------------------------------------------------

                    if (tipo_imagen == "inicio_horizontal") {
                        var imagen = "Inicio horizontal";
                    }
                    if (tipo_imagen == "inicio_vertical") {
                        var imagen = "Inicio vertical";
                    }
                    if (tipo_imagen == "cabecera_convocatoria") {
                        var imagen = "Cabecera convocatoria";
                    }
                    if (tipo_imagen == "cabecera_reserva") {
                        var imagen = "Cabecera reserva";
                    }
                    if (tipo_imagen == "cabecera_aprobacion") {
                        var imagen = "Cabecera aprobacion";
                    }
                    if (tipo_imagen == "cabecera_pago") {
                        var imagen = "Cabecera pago";
                    }
                    if (tipo_imagen == "cabecera_construccion") {
                        var imagen = "Cabecera construcción";
                    }
                    if (tipo_imagen == "cabecera_construido") {
                        var imagen = "Cabecera construido";
                    }
                    if (tipo_imagen == "cabecera_administrador") {
                        var imagen = "Cabecera administrador";
                    }
                    if (tipo_imagen == "cabecera_propietario") {
                        var imagen = "Cabecera propietario";
                    }
                    if (tipo_imagen == "cabecera_terreno") {
                        var imagen = "Cabecera terreno";
                    }
                    if (tipo_imagen == "cabecera_proyecto") {
                        var imagen = "Cabecera proyecto";
                    }
                    if (tipo_imagen == "cabecera_inmueble") {
                        var imagen = "Cabecera inmueble";
                    }
                    if (tipo_imagen == "cabecera_empresa") {
                        var imagen = "Cabecera empresa";
                    }
                    if (tipo_imagen == "cabecera_resultados_inmuebles") {
                        var imagen = "Cabecera resultados inmuebles";
                    }
                    if (tipo_imagen == "cabecera_resultados_requerimientos") {
                        var imagen = "Cabecera resultados requerimientos";
                    }

                    // registramos la nueva imagen en la BD
                    const datosImagenNueva = new indiceImagenesSistema({
                        imagen,
                        tipo_imagen,
                        completo: nombre_y_ext,
                        url: url_imagen,
                    });

                    // ahora guardamos en la base de datos la informacion de la imagen creada
                    await datosImagenNueva.save();

                    //-------------------------------------------------------------------
                    // guardamos en el historial de acciones
                    var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                    var accion_administrador =
                        "guarda imagen sistema " + tipo_imagen + extensionImagenMinuscula;
                    var aux_accion_adm = {
                        ci_administrador,
                        accion_administrador,
                    };
                    await guardarAccionAdministrador(aux_accion_adm);
                    //-------------------------------------------------------------------

                    res.json({
                        exito: "si",
                        tipo_imagen,
                        imagen,
                        url: url_imagen,
                    });
                }
            } else {
                // en caso de que el archivo no sea una IMAGEN, entonces sera eliminado de la carpeta "TEMPORAL"
                // con "fs.unlink" eliminamos el archivo que no es una imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
                await fs.unlink(direccionTemporalImagen);

                res.json({
                    exito: "no",
                });
            }
        } else {
            // en caso de que el archivo no sea una IMAGEN, entonces sera eliminado de la carpeta "TEMPORAL"
            // con "fs.unlink" eliminamos el archivo que no es una imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
            await fs.unlink(direccionTemporalImagen);

            res.json({
                exito: "no",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA ELIMINACION DE IMAGEN DE TERRENO || PROYECTO || EMPRESA (somos y funciona) || SISTEMA
controladorAdministradorGeneral.eliminarImagen = async (req, res) => {
    // delete: "/laapirest/administracion/general/accion/eliminar_imagen/:objetivo_tipo/:codigo_imagen"

    try {
        const codigo_imagen = req.params.codigo_imagen;
        const objetivo_tipo = req.params.objetivo_tipo;

        // ------- Para verificación -------
        //console.log("el dato de codigo de imagen y objetivo tipo es:");
        //console.log(codigo_imagen + "   " + objetivo_tipo);

        if (objetivo_tipo == "terreno") {
            var imagenEliminar = await indiceImagenesTerreno.findOne({
                codigo_imagen: codigo_imagen,
            });
        }

        if (objetivo_tipo == "proyecto") {
            var imagenEliminar = await indiceImagenesProyecto.findOne({
                codigo_imagen: codigo_imagen,
            });
        }

        if (objetivo_tipo == "inmueble") {
            var acceso = "denegado"; // porque no es posible eliminar imagenes desde la ventana de INMUEBLE
        }

        if (objetivo_tipo == "administrador") {
            if (codigo_imagen.indexOf("cabecera") != -1 || codigo_imagen.indexOf("inicio") != -1) {
                // entonces se trata de una imagen del sistema (ej/ cabeceras)
                var imagenEliminar = await indiceImagenesSistema.findOne(
                    {
                        tipo_imagen: codigo_imagen, // ok (ej/ cabecera_convocatoria)
                    },
                    {
                        completo: 1, // EJ/  la URL imagen en FIREBASE
                    }
                );
            } else {
                // si es una imagen "administrador", es decir que es propio de la EMPRESA
                // imagenes de: COMO FUNCIONA y QUINES SOMOS
                var imagenEliminar = await indiceImagenesEmpresa_sf.findOne({
                    codigo_imagen: codigo_imagen,
                });
            }

            var acceso = "permitido";
        }

        if (objetivo_tipo == "terreno" || objetivo_tipo == "proyecto") {
            var codigo_terreno = imagenEliminar.codigo_terreno;
            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);
        }

        if (acceso == "permitido") {
            if (imagenEliminar) {
                if (
                    codigo_imagen.indexOf("cabecera") != -1 ||
                    codigo_imagen.indexOf("inicio") != -1
                ) {
                    // entonces se trata de una imagen del sistema

                    /*
                    const auxCodigoImagen = imagenEliminar.completo; // EJ/  "cabecera_convocatoria.jpg"

                    // "unlink" es un metodo de "fs" que elimina un archivo a partir de la direccion que se le de. Esta direccion sera aquella donde se encuentra guardada la imagen
                    await fs.unlink(
                        pache.resolve("./src/publico/imagenes/imagenes_sistema/" + auxCodigoImagen)
                    ); // "+" es para concatenar
                    */

                    //--------------------------------------------------

                    const storage = getStorage();

                    var nombre_y_ext = codigo_imagen + ".jpg"; // porque solo son aceptados imagnes ".jpg" y son guardados en minuscula
                    // para encontrar en la carpeta "imagenes_sistema" en firebase con el nombre y la extension de la imagen incluida
                    var direccionActualImagen = "imagenes_sistema/" + nombre_y_ext;

                    // Crear una referencia al archivo que se eliminará
                    const desertRef = ref(storage, direccionActualImagen);

                    // Eliminar el archivo y esperar la promesa
                    await deleteObject(desertRef);

                    // Archivo eliminado con éxito
                    console.log("Archivo eliminado DE FIREBASE con éxito");

                    //--------------------------------------------------

                    // ahora eliminamos todos los datos (informacion que esta guardada en la base de datos) de la imagen
                    //await imagenEliminar.remove(); // indiceImagenesSistema (funcionaba, pero lo reemplazamos para no tener problemas con la obsolescencia)

                    // se trata de una imagen del sistema (ej/ cabeceras)
                    await indiceImagenesSistema.deleteOne({ tipo_imagen: codigo_imagen });

                    //--------------------------------------------
                    // guardamos en el historial de acciones
                    var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                    var accion_administrador = "Elimina imagen SISTEMA " + codigo_imagen;
                    var aux_accion_adm = {
                        ci_administrador,
                        accion_administrador,
                    };
                    await guardarAccionAdministrador(aux_accion_adm);
                    //--------------------------------------------

                    res.json({
                        exito: "si",
                    });
                } else {
                    /*
                    // si la imagen es encontrada en la base de datos
                    // entonces eliminamos el archivo imagen (la imagen misma) de la carpeta donde se encuentra guardada (carpeta "subido")
                    // "unlink" es un metodo de "fs" que elimina un archivo a partir de la direccion que se le de. Esta direccion sera aquella donde se encuentra guardada la imagen
                    const auxCodigoImagen = codigo_imagen + imagenEliminar.extension_imagen;

                    await fs.unlink(pache.resolve("./src/publico/subido/" + auxCodigoImagen)); // "+" es para concatenar
                    */
                    //--------------------------------------------------

                    const storage = getStorage();

                    var nombre_y_ext = codigo_imagen + imagenEliminar.extension_imagen;

                    // para encontrar en la carpeta "subido" en firebase con el nombre y la extension de la imagen incluida
                    var direccionActualImagen = "subido/" + nombre_y_ext;

                    // Crear una referencia al archivo que se eliminará
                    const desertRef = ref(storage, direccionActualImagen);

                    // Eliminar el archivo y esperar la promesa
                    await deleteObject(desertRef);

                    // Archivo eliminado con éxito
                    console.log("Archivo eliminado DE FIREBASE con éxito");

                    //--------------------------------------------------

                    // ahora eliminamos todos los datos (informacion que esta guardada en la base de datos) de la imagen
                    //await imagenEliminar.remove(); // indiceImagenesSistema (funcionaba, pero lo reemplazamos para no tener problemas con la obsolescencia)

                    if (objetivo_tipo == "terreno") {
                        await indiceImagenesTerreno.deleteOne({ codigo_imagen: codigo_imagen });
                    }

                    if (objetivo_tipo == "proyecto") {
                        await indiceImagenesProyecto.deleteOne({ codigo_imagen: codigo_imagen });
                    }

                    if (objetivo_tipo == "administrador") {
                        // ya se verifico que no es una imagen del sistema
                        // es una imagen "administrador", es decir que es propio de la EMPRESA
                        await indiceImagenesEmpresa_sf.deleteOne({
                            codigo_imagen: codigo_imagen,
                        });
                    }

                    //--------------------------------------------
                    // revision si la imagen tiene documentos pdf, word, excel que la acompañen (imagenes de FUNCIONA)

                    if (codigo_imagen.indexOf("imaemp_sf") != -1) {
                        const documentos_imagen = await indiceDocumentos.find(
                            {
                                codigo_terreno: codigo_imagen, // para documentos que pertenecen a "como funciona" en "codigo_terreno" se encuentra el codigo de la imagen al que pertenecen los documentos de "como funciona"
                            },
                            {
                                codigo_documento: 1,
                                nombre_documento: 1, // para documentos de COMO FUNCIONA, en "nombre_documento" se guarda la: pdf || word || excel
                            }
                        );

                        var documentos_eliminados = ""; // un string que contendra los doc eliminados que pertenecen a la imagen de la empresa
                        if (documentos_imagen.length > 0) {
                            // 1. eliminamos los archivos documentos en la carpeta donde se encuentran guardados

                            for (let i = 0; i < documentos_imagen.length; i++) {
                                if (documentos_imagen[i].nombre_documento == "pdf") {
                                    var extension = "pdf";
                                }
                                if (documentos_imagen[i].nombre_documento == "word") {
                                    var extension = "docx";
                                }
                                if (documentos_imagen[i].nombre_documento == "excel") {
                                    var extension = "xlsx";
                                }

                                let documentoNombreExtension =
                                    documentos_imagen[i].codigo_documento + "." + extension;

                                /*
                                // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                                await fs.unlink(
                                    pache.resolve(
                                        "./src/publico/subido/" + documentoNombreExtension
                                    )
                                ); // "+" es para concatenar
                                */

                                //--------------------------------------------------

                                //const storage = getStorage(); // ya fue declarado anteriormente

                                // para encontrar en la carpeta "subido" en firebase con el nombre y la extension de la imagen incluida
                                var direccionActualImagen = "subido/" + documentoNombreExtension;

                                // Crear una referencia al archivo que se eliminará
                                const desertRef = ref(storage, direccionActualImagen);

                                // Eliminar el archivo y esperar la promesa
                                await deleteObject(desertRef);

                                // Archivo eliminado con éxito
                                console.log("Archivo eliminado DE FIREBASE con éxito");

                                //--------------------------------------------------

                                documentos_eliminados =
                                    documentos_eliminados + " " + documentoNombreExtension;
                            }
                            // 2. eliminamos de la base de datos todos los documentos que pertenecen a la imagen eliminada

                            //await indiceDocumentos.remove({ codigo_terreno: codigo_imagen }); // NUNCA VIMOS USAR REMOVE DE ESA MANERA, PERO LO CAMBIAMOS POR "deleteMany" para que borre a TODOS los que coincidan con la condicion: codigo_terreno: codigo_imagen

                            await indiceDocumentos.deleteMany({ codigo_terreno: codigo_imagen });
                        }

                        //--------------------------------------------
                        // guardamos en el historial de acciones
                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var accion_administrador =
                            "Elimina imagen " +
                            codigo_imagen +
                            " y sus documentos: " +
                            documentos_eliminados;
                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //--------------------------------------------
                    } else {
                        //--------------------------------------------
                        // guardamos en el historial de acciones
                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var accion_administrador = "Elimina imagen " + codigo_imagen;
                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //--------------------------------------------
                    }

                    res.json({
                        exito: "si",
                    });
                }
            } else {
                res.json({
                    exito: "no",
                    mensaje: "Error, mal requerimiento al eliminar imagen",
                });
            }
        } else {
            if (objetivo_tipo == "inmueble") {
                res.json({
                    exito: "no",
                    mensaje: "Las imagenes no pueden ser eliminadas desde Inmueble",
                });
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
                });
            }

            /*
            // si el acceso es denegado
            res.json({
                exito: "denegado",
            });
            */
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA SELECCIONAR O DESELECCIONAR PARA IMAGEN PRINCIPAL, YA SEA ESTANDO DENTRO DE LA VENTANA DEL PROYECTO O DENTRO DE LA VENTANA DE UN INMUEBLE EN ESPECIFICO

controladorAdministradorGeneral.seleccionarDeseleccionarImagenPrincipal = async (req, res) => {
    // recuerde que en la ruta presenta el siguiente orden:

    // "/laapirest/administracion/general/accion/sel_desel_img_principal/:codigo_imagen/:codigo_proyecto_inmueble"
    try {
        // ------- Para verificación -------
        //console.log("estamos en el controlador de selecciona imagen principal");

        var codigoImagen = req.params.codigo_imagen;
        var codigoInmuebleProyecto = req.params.codigo_proyecto_inmueble;

        var imagenPrincipalPrevio = req.body.imagen_principal_previo;
        var tipoCaso = req.body.tipo_caso;

        /*
        console.log("el codigo imagen es: " + codigoImagen);
        console.log("el codigo inmueble proyecto es: " + codigoInmuebleProyecto);
        console.log("el codigo imagen previo es: " + imagenPrincipalPrevio);
        console.log("el tipo caso es: " + tipoCaso);
        */

        var registro_imagen = await indiceImagenesProyecto.findOne(
            {
                codigo_imagen: codigoImagen,
            },
            {
                codigo_terreno: 1,
            }
        );

        // ------- Para verificación -------
        //console.log("el registro imagen es");
        //console.log(registro_imagen);

        if (registro_imagen) {
            var acceso = await verificadorTerrenoBloqueado(registro_imagen.codigo_terreno);

            // ------- Para verificación -------
            //console.log("el acceso es: ");
            //console.log(acceso);

            if (acceso == "permitido") {
                // ------- Para verificación -------
                //console.log("codigo imagen click, tipo caso");
                //console.log(codigoImagen + "   " + tipoCaso);

                if (tipoCaso == "mismo") {
                    // si existe IMAGEN PRINCIPAL PREVIO, y la imagen sobre la que se hizo click en "principal" es esta MISMA IMAGEN.
                    // entonces esta imagen pasara de "IMAGEN PRINCIPAL" A "IMAGEN OTROS"

                    var imagenPrincipal = await indiceImagenesProyecto.findOne({
                        codigo_imagen: codigoImagen,
                    }); // solo existe un codigo unico por imagen, de ahi el uso de "findOne"

                    if (imagenPrincipal) {
                        // la imagen ya forma parte como "imagen principal" del "codigoInmuebleProyecto"

                        var arrayInmuebles = imagenPrincipal.parte_principal;

                        // buscamos la posicion (en el ARRAY) del inmueble/proyecto a eliminar de este ARRAY
                        var pocicionEliminar = arrayInmuebles.indexOf(codigoInmuebleProyecto);

                        if (pocicionEliminar != -1) {
                            // entonces significa que el "codigoInmuebleProyecto" debera ser eliminado de "parte_principal"
                            imagenPrincipal.parte_principal.splice(pocicionEliminar, 1); // Recuerde que "1" significa que solo queremos borrar "1" valor del ARRAY a partir de la posicion "pocicionEliminar"

                            // ahora el "codigoInmuebleProyecto" por no estar en las "parte_exclusiva" ni "parte_principal", la presente imagen pasa a formar parte de "imagenes otros" para el caso del "codigoInmuebleProyecto"

                            // ahora guardamos la base de datos
                            await imagenPrincipal.save();

                            res.json({ exito: "si" });
                        }
                    } else {
                        res.json({
                            exito: "no",
                            mensaje:
                                "Imagen no encontrada, refresque el navegador e intentelo nuevamente",
                        });
                    }
                }

                if (tipoCaso == "reemplazar") {
                    // si existe IMAGEN PRINCIPAL PREVIO, y la imagen sobre la que se hizo click en "principal" es OTRA IMAGEN DIFERENTE que puede estar como "IMAGEN EXCLUSIVA" o "IMAGEN OTROS"
                    // entonces la IMAGEN PRINCIPAL PREVIA pasara a "IMAGEN OTROS" y la imagen sobre la que se hizo click en "principal" dejara de estar como "IMAGEN EXCLUSIVA" o "IMAGEN OTROS"  para ser la nueva "IMAGEN PRINCIPAL"

                    var imagenReemplazar = await indiceImagenesProyecto.findOne({
                        codigo_imagen: imagenPrincipalPrevio,
                    }); // solo existe un codigo unico por imagen, de ahi el uso de "findOne"

                    if (imagenReemplazar) {
                        // de este ARRAY de codigos (donde tambien puede estar incluido el mismo PROYECTO), donde esta imagen es la imagen principal se BORRARA el codigo del proyecto/inmueble
                        var arrayInmuebles = imagenReemplazar.parte_principal;

                        // ---------------  VERIFICACION -----------------------------
                        /*
                        console.log(
                            "vemos el ARRAY de los inmuebles que utilizan esta imagen como PRINCIPAL"
                        );
                        console.log(imagenReemplazar.parte_principal);
                        */

                        // buscamos la posicion (en el ARRAY) del inmueble/proyecto a eliminar de este ARRAY
                        var pocicionEliminar = arrayInmuebles.indexOf(codigoInmuebleProyecto);

                        if (pocicionEliminar != -1) {
                            // si el inmueble figura dentro de este ARRAY "arrayInmuebles"

                            // eliminamos el codigo del proyecto/inmueble en el "parte_principal" de esta manera el proyecto/inmueble pasara a NO utilizar esta imagen COMO PRINCIPAL
                            imagenReemplazar.parte_principal.splice(pocicionEliminar, 1); // Recuerde que "1" significa que solo queremos borrar "1" valor del ARRAY a partir de la posicion "pocicionEliminar"

                            // ---------------  VERIFICACION -----------------------------
                            //console.log("vemos si se elimino el codigo del proyecto/inmueble");
                            //console.log(imagenReemplazar.parte_principal);

                            // ahora guardamos la base de datos con la propiedad actualizada
                            await imagenReemplazar.save();

                            // ahora la imagen sobre la que se hizo click en "principal", dejara de ser "imagen exclusiva" o "imagen otras" para ser la nueva IMAGEN PRINCIPAL

                            var nuevaImagenPrincipal = await indiceImagenesProyecto.findOne({
                                codigo_imagen: codigoImagen,
                            }); // solo existe un codigo unico por imagen, de ahi el uso de "findOne"

                            if (nuevaImagenPrincipal) {
                                // 1º revisamos si la imagen sobre la que se hizo click en "principal", el codigo del inmueble "codigoInmuebleProyecto" figura en "parte_exclusiva"

                                var arrayInmuebles = nuevaImagenPrincipal.parte_exclusiva;

                                // buscamos la posicion (en el ARRAY) del inmueble/proyecto a eliminar de este ARRAY
                                var pocicionEliminar =
                                    arrayInmuebles.indexOf(codigoInmuebleProyecto);

                                if (pocicionEliminar == -1) {
                                    // si el "codigoInmuebleProyecto" no tiene a esta imagen como "imagenes exclusivas"(porque no se lo encontro en el ARRAY "-1" )
                                    // entonces significa que el "codigoInmuebleProyecto" forma parte de "imagenes otras"
                                    // en ese caso solo basta con agregar el "codigoInmuebleProyecto" a la "parte_principal", para que asi esta imagen pase a formar parte de "imagen principal" del inmueble/proyecto

                                    nuevaImagenPrincipal.parte_principal.unshift(
                                        codigoInmuebleProyecto
                                    ); // con "unshift" el codigo del proyecto/inmueble se agrega al ARRAY al INICIO

                                    // --------- Para verificación --------- /
                                    /*
                                    console.log(
                                        "vemos si se agrego el codigo del proyecto/inmueble en la parte de PRINCIPAL"
                                    );
                                    console.log(nuevaImagenPrincipal.parte_principal);
                                    */

                                    // ahora guardamos la base de datos
                                    await nuevaImagenPrincipal.save();

                                    res.json({ exito: "si" });
                                } else {
                                    // entonces significa que el "codigoInmuebleProyecto" debera ser eliminado de "parte_exclusiva"
                                    nuevaImagenPrincipal.parte_exclusiva.splice(
                                        pocicionEliminar,
                                        1
                                    ); // Recuerde que "1" significa que solo queremos borrar "1" valor del ARRAY a partir de la posicion "pocicionEliminar"

                                    // ahora el "codigoInmuebleProyecto" sera agregado a "parte_principal"
                                    nuevaImagenPrincipal.parte_principal.unshift(
                                        codigoInmuebleProyecto
                                    ); // con "unshift" el codigo del proyecto/inmueble se agrega al ARRAY al INICIO

                                    // ahora guardamos la base de datos
                                    await nuevaImagenPrincipal.save();

                                    res.json({ exito: "si" });
                                }
                            }
                        }
                    } else {
                        res.json({
                            exito: "no",
                            mensaje:
                                "Imagen no encontrada, refresque el navegador e intentelo nuevamente",
                        });
                    }
                }

                if (tipoCaso == "nuevo") {
                    // NO existe IMAGEN PRINCIPAL PREVIO, y la imagen sobre la que se hizo click en "principal" puede ser "IMAGEN EXCLUSIVA" o "IMAGEN OTROS"
                    // entonces la  imagen sobre la que se hizo click en "principal" dejara de ser "imagen exclusiva" o "imagen otros" y pasar a ser la NUEVA "IMAGEN PRINCIPAL"

                    // la imagen sobre la que se hizo click en "principal", dejara de ser "imagen exclusiva" o "imagen otras" para ser la nueva IMAGEN PRINCIPAL

                    var nuevaImagenPrincipal = await indiceImagenesProyecto.findOne({
                        codigo_imagen: codigoImagen,
                    }); // solo existe un codigo unico por imagen, de ahi el uso de "findOne"

                    if (nuevaImagenPrincipal) {
                        // 1º revisamos si la imagen sobre la que se hizo click en "principal", el codigo del inmueble "codigoInmuebleProyecto" figura en "parte_exclusiva"

                        var arrayInmuebles = nuevaImagenPrincipal.parte_exclusiva;

                        // buscamos la posicion (en el ARRAY) del inmueble/proyecto a eliminar de este ARRAY
                        var pocicionEliminar = arrayInmuebles.indexOf(codigoInmuebleProyecto);

                        if (pocicionEliminar == -1) {
                            // si el "codigoInmuebleProyecto" no tiene a esta imagen como "imagenes exclusivas"(porque no se lo encontro en el ARRAY "-1" )
                            // entonces significa que el "codigoInmuebleProyecto" forma parte de "imagenes otras"
                            // en ese caso solo basta con agregar el "codigoInmuebleProyecto" a la "parte_principal", para que asi esta imagen pase a formar parte de "imagen principal" del inmueble/proyecto

                            nuevaImagenPrincipal.parte_principal.unshift(codigoInmuebleProyecto); // con "unshift" el codigo del proyecto/inmueble se agrega al ARRAY al INICIO

                            // --------- Para verificación --------- /
                            /*
                            console.log(
                                "vemos si se agrego el codigo del proyecto/inmueble en la parte de PRINCIPAL"
                            );
                            console.log(nuevaImagenPrincipal.parte_principal);
                            */

                            // ahora guardamos la base de datos
                            await nuevaImagenPrincipal.save();

                            res.json({ exito: "si" });
                        } else {
                            // entonces significa que el "codigoInmuebleProyecto" debera ser eliminado de "parte_exclusiva"
                            nuevaImagenPrincipal.parte_exclusiva.splice(pocicionEliminar, 1); // Recuerde que "1" significa que solo queremos borrar "1" valor del ARRAY a partir de la posicion "pocicionEliminar"

                            // ahora el "codigoInmuebleProyecto" sera agregado a "parte_principal"
                            nuevaImagenPrincipal.parte_principal.unshift(codigoInmuebleProyecto); // con "unshift" el codigo del proyecto/inmueble se agrega al ARRAY al INICIO

                            // ahora guardamos la base de datos
                            await nuevaImagenPrincipal.save();

                            res.json({ exito: "si" });
                        }
                    } else {
                        res.json({
                            exito: "no",
                            mensaje:
                                "Imagen no encontrada, refresque el navegador e intentelo nuevamente",
                        });
                    }
                }
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
                    mensaje:
                        "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios",
                });
            }
        } else {
            res.json({
                exito: "no",
                mensaje: "Error, mal requerimiento al seleccionar imagen",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA SELECCIONAR O DESELECCIONAR PARA IMAGEN PRINCIPAL DE TERRENO

controladorAdministradorGeneral.selecDeselecImagenPrincipalTe = async (req, res) => {
    // recuerde que en la ruta presenta el siguiente orden:

    // "/laapirest/administracion/general/accion/sel_desel_img_principal_te/:codigo_imagen/:codigo_terreno"
    try {
        // ------- Para verificación -------
        //console.log("estamos en el controlador de selecciona imagen principal TERRENO");

        var codigoImagen = req.params.codigo_imagen;
        var codigoTerreno = req.params.codigo_terreno;

        var imagenPrincipalPrevio = req.body.imagen_principal_previo;
        var tipoCaso = req.body.tipo_caso;

        /*
        console.log("el codigo imagen es: " + codigoImagen);
        console.log("el codigo TERRENO es: " + codigoTerreno);
        console.log("el codigo imagen previo es: " + imagenPrincipalPrevio);
        console.log("el tipo caso es: " + tipoCaso);
        */

        var acceso = await verificadorTerrenoBloqueado(codigoTerreno);

        // ------- Para verificación -------
        //console.log("el acceso es: ");
        //console.log(acceso);

        if (acceso == "permitido") {
            var registro_imagen = await indiceImagenesTerreno.findOne(
                {
                    codigo_imagen: codigoImagen,
                },
                {
                    imagen_principal: 1, // true || false
                }
            );

            if (registro_imagen) {
                // ------- Para verificación -------
                //console.log("codigo imagen click, tipo caso");
                //console.log(codigoImagen + "   " + tipoCaso);

                if (tipoCaso == "mismo") {
                    // si existe IMAGEN PRINCIPAL PREVIO, y la imagen sobre la que se hizo click en "principal" es esta MISMA IMAGEN.
                    // entonces esta imagen pasara de "IMAGEN PRINCIPAL" A "IMAGEN EXCLUSIVA"

                    var imagenPrincipal = await indiceImagenesTerreno.findOne({
                        codigo_imagen: codigoImagen,
                    }); // solo existe un codigo unico por imagen, de ahi el uso de "findOne"

                    if (imagenPrincipal) {
                        // la imagen principal pasara de ser TRUE a FALSE
                        await indiceImagenesTerreno.updateOne(
                            { codigo_imagen: codigoImagen },
                            { $set: { imagen_principal: false } }
                        ); // guardamos el registro con el dato modificado

                        res.json({ exito: "si" });
                    } else {
                        res.json({ exito: "no" });
                    }
                }

                if (tipoCaso == "reemplazar") {
                    // si existe IMAGEN PRINCIPAL PREVIO, y la imagen sobre la que se hizo click en "principal" es una "IMAGEN EXCLUSIVA" del terreno
                    // entonces la IMAGEN PRINCIPAL PREVIA pasara a "IMAGEN EXCLUSIVA" y la imagen sobre la que se hizo click en "principal" dejara de estar como "IMAGEN EXCLUSIVA"  para ser la nueva "IMAGEN PRINCIPAL"

                    var imagenPrincipal = await indiceImagenesTerreno.findOne({
                        codigo_imagen: imagenPrincipalPrevio,
                    }); // solo existe un codigo unico por imagen, de ahi el uso de "findOne"

                    var imagenExclusiva = await indiceImagenesTerreno.findOne({
                        codigo_imagen: codigoImagen,
                    }); // solo existe un codigo unico por imagen, de ahi el uso de "findOne"

                    if (imagenPrincipal && imagenExclusiva) {
                        // la imagen principal pasara de ser TRUE a FALSE
                        await indiceImagenesTerreno.updateOne(
                            { codigo_imagen: imagenPrincipalPrevio },
                            { $set: { imagen_principal: false } }
                        ); // guardamos el registro con el dato modificado

                        // ahora la imagen sobre la que se hizo click en "principal", dejara de ser "imagen exclusiva" para ser la nueva IMAGEN PRINCIPAL

                        // la imagen EXCLUSIVA pasara de ser FALSE a TRUE
                        await indiceImagenesTerreno.updateOne(
                            { codigo_imagen: codigoImagen },
                            { $set: { imagen_principal: true } }
                        ); // guardamos el registro con el dato modificado

                        res.json({ exito: "si" });
                    } else {
                        res.json({
                            exito: "no",
                            mensaje:
                                "Imagen no encontrada, refresque el navegador e intentelo nuevamente",
                        });
                    }
                }

                if (tipoCaso == "nuevo") {
                    // NO existe IMAGEN PRINCIPAL PREVIO, y la imagen sobre la que se hizo click en "principal" es "IMAGEN EXCLUSIVA"
                    // entonces la  imagen sobre la que se hizo click en "principal" dejara de ser "imagen exclusiva" y pasara a ser la NUEVA "IMAGEN PRINCIPAL"

                    var nuevaImagenPrincipal = await indiceImagenesTerreno.findOne({
                        codigo_imagen: codigoImagen,
                    }); // solo existe un codigo unico por imagen, de ahi el uso de "findOne"

                    if (nuevaImagenPrincipal) {
                        // la imagen EXCLUSIVA pasara de ser FALSE a TRUE
                        await indiceImagenesTerreno.updateOne(
                            { codigo_imagen: codigoImagen },
                            { $set: { imagen_principal: true } }
                        ); // guardamos el registro con el dato modificado

                        res.json({ exito: "si" });
                    } else {
                        res.json({
                            exito: "no",
                            mensaje:
                                "Imagen no encontrada, refresque el navegador e intentelo nuevamente",
                        });
                    }
                }
            } else {
                res.json({
                    exito: "no",
                    mensaje: "Error, mal requerimiento al seleccionar imagen",
                });
            }
        } else {
            // si el acceso es denegado
            res.json({
                exito: "denegado",
                mensaje:
                    "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// CONTROLADOR PARA SELECCIONAR O DESELECCIONAR UNA IMAGEN, YA SEA ESTANDO DENTRO DE LA VENTANA DEL PROYECTO O DENTRO DE LA VENTANA DE UN INMUEBLE EN ESPECIFICO

controladorAdministradorGeneral.seleccionarDeseleccionarImagen = async (req, res) => {
    // recuerde que en la ruta presenta el siguiente orden:
    // "/laapirest/administracion/general/accion/sel_desel_img/:codigo_imagen/:codigo_proyecto_inmueble"

    try {
        var codigoImagen = req.params.codigo_imagen;
        var codigoInmuebleProyecto = req.params.codigo_proyecto_inmueble;

        var imagenProyecto = await indiceImagenesProyecto.findOne({
            codigo_imagen: codigoImagen,
        });

        if (imagenProyecto) {
            var acceso = await verificadorTerrenoBloqueado(imagenProyecto.codigo_terreno);

            if (acceso == "permitido") {
                /********* Para verificación **********/
                /*
                console.log("vemos los codigos involucrados:");
                console.log(
                    "codigo imagen: " +
                        codigoImagen +
                        " codigo proyecto o inmuble: " +
                        codigoInmuebleProyecto
                );
                */

                if (imagenProyecto) {
                    // 1º vemos si la imagen es "principal"
                    var inmueblesUtilizanPricipal = imagenProyecto.parte_principal;
                    // vemos si ocupa una posicion en este ARRAY de imagenes principales
                    var posicionInmueblePrincipal =
                        inmueblesUtilizanPricipal.indexOf(codigoInmuebleProyecto);

                    if (posicionInmueblePrincipal != -1) {
                        // si el inmueble utiliza esta imagen como "principal"

                        // entonces la imagen sera eliminada de "parte_principal"
                        imagenProyecto.parte_principal.splice(posicionInmueblePrincipal, 1); // Recuerde que "1" significa que solo queremos borrar "1" valor del ARRAY a partir de la posicion "posicionInmueblePrincipal"

                        // ahora el "codigoInmuebleProyecto" sera agregada en "parte_exclusiva"
                        imagenProyecto.parte_exclusiva.unshift(codigoInmuebleProyecto); // con "unshift" el codigo del proyecto/inmueble se agrega al ARRAY al INICIO

                        // ahora guardamos la base de datos con la propiedad actualizada
                        await imagenProyecto.save();

                        res.json({ exito: "si", tipo_caso: "principal" });
                    } else {
                        // si el inmueble NO tiene a esta imagen como "principal", entonces revisamos si la tiene como "exclusiva"
                        var inmueblesUtilizanExclusiva = imagenProyecto.parte_exclusiva;
                        // vemos si ocupa una posicion en este ARRAY de imagenes exclusivas
                        var posicionInmuebleExclusiva =
                            inmueblesUtilizanExclusiva.indexOf(codigoInmuebleProyecto);

                        if (posicionInmuebleExclusiva != -1) {
                            // si el inmueble utiliza esta imagen como "exclusiva"

                            // entonces la imagen sera eliminada de "parte_exclusiva"
                            imagenProyecto.parte_exclusiva.splice(posicionInmuebleExclusiva, 1); // Recuerde que "1" significa que solo queremos borrar "1" valor del ARRAY a partir de la posicion "posicionInmuebleExclusiva"

                            // ahora el "codigoInmuebleProyecto" al ser eliminado de "exclusiva", automaticamente pasara a formar parte de "imagenes otras" (no es necesario escribir mas codigo, solo guardar la base de datos)

                            // ahora guardamos la base de datos con la propiedad actualizada
                            await imagenProyecto.save();

                            res.json({ exito: "si", tipo_caso: "exclusiva" });
                        } else {
                            // si el inmueble NO tiene a esta imagen como "principal", ni tampoco la tiene como "exclusiva", entonces la imagen sobre la que se hizo click forma parte de "imagenes otras"

                            // entonces el "codigoInmuebleProyecto" sera agregado a "parte_exclusiva" pasando a formar parte de imagenes exclusivas
                            imagenProyecto.parte_exclusiva.unshift(codigoInmuebleProyecto); // con "unshift" el codigo del proyecto/inmueble se agrega al ARRAY al INICIO

                            // ahora guardamos la base de datos con la propiedad actualizada
                            await imagenProyecto.save();

                            res.json({ exito: "si", tipo_caso: "otros" });
                        }
                    }
                } else {
                    // si la imagen no es econtrada en la base de datos
                    res.json({
                        exito: "no",
                    });
                }
            } else {
                // si el acceso es denegado
                res.json({
                    exito: "denegado",
                });
            }
        } else {
            res.json({
                exito: "no",
                mensaje: "Error, mal requerimiento al eliminar imagen",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// PARA subir al servidor DOCUMENTOS del TERRENO, PROYECTO, INMUEBLE, PROPIETARIO

// RUTA   "post"  /laapirest/administracion/general/accion/subir_documento

controladorAdministradorGeneral.subirDocumento = async (req, res) => {
    try {
        if (req.body.clase_documento == "Propietario") {
            var codigo_inmueble = req.body.codigo_inmueble_pertenecera;
            var propiedad_real = await indiceInversiones.findOne({
                ci_propietario: req.body.ci_propietario,
                codigo_inmueble: codigo_inmueble,
            });
            if (propiedad_real) {
                var acceso = "permitido"; // si el inmueble existe y ademas es un inmueble donde el propietario es propietario de este inmueble

                var registro_inmueble = await indiceInmueble.findOne(
                    {
                        codigo_inmueble: codigo_inmueble,
                    },
                    {
                        codigo_terreno: 1,
                        codigo_proyecto: 1,
                    }
                );
                if (registro_inmueble) {
                    var codigo_proyecto = registro_inmueble.codigo_proyecto;
                    var codigo_terreno = registro_inmueble.codigo_terreno;
                } else {
                    var acceso = "denegado";
                }
            } else {
                var acceso = "denegado"; // caso contrario
            }
        } else {
            // desde html, vendran ya con valores definidos o vacios ""
            var codigo_terreno = req.body.codigo_terreno;
            var codigo_proyecto = req.body.codigo_proyecto;
            var codigo_inmueble = req.body.codigo_inmueble;

            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);
        }

        if (acceso == "permitido") {
            funcionGuardaDocumento();

            async function funcionGuardaDocumento() {
                // esta funcion genera el nombre alfanumerico de el documento (ojo, sin extension)
                var codigo_documento = codigoAlfanumericoDocumento();

                // revisamos en la base de datos, si el nombre de el documento alfanumerico ya existe
                var codigo_documento_existe = await indiceDocumentos.find({
                    codigo_documento: codigo_documento,
                });

                // si se encuentra un documento con el mismo nombre alfanumerico
                if (codigo_documento_existe.length > 0) {
                    // entonces se le creara un nuevo nombre
                    funcionGuardaDocumento(); // volvemos a ejecutar la funcion nuevamente, a esto se llama FUNCION RECURSIVA.
                } else {
                    // si el codigo es unico y no tiene similares, entonces

                    // extraemos la direccion donde se encuentra temporalmente el documento (carpeta temporal) y la guardamos en la constante "direccionTemporal"
                    const direccionTemporal = req.file.path; // es "path" (no pache, la que requerimos al inicio), esta es la propiedad propia de "file"

                    // (extname) extraemos la extension de el documento y la convertimos en minuscula "toLowerCase" por precausion, porque el nombre alfanumerico generado, se genera en minuscula.
                    const extensionDocumentoMinuscula = pache
                        .extname(req.file.originalname)
                        .toLowerCase();

                    /*
                    // direccion de destino, donde sera guardada el documento (se la guardara en la carpeta "subido"), esta direccion sera guardada en la constante "direccionDestino"
                    // el documento sera guardada con el nombre alfanumerico que se le dio
                    const direccionDestino = pache.resolve(
                        `src/publico/subido/${codigo_documento}${extensionDocumentoMinuscula}`
                    );
                    */

                    // para validar el documento, que lo que se esta subiendo sea en verdad un archivo de PDF
                    const tipo_archivo_a = req.file.mimetype.toLowerCase(); // en minuscula

                    // para validar si en verdad es una PDF y NO UN ARCHIVO CORRUPTO con "file-type"
                    // con fileType analizamos si es un archivo de PDF verdader, y para ello le damos la direccion donde esta almacenado temporalmente el archivo antes de ser subido al servidor
                    const infoArchivo = await fileType.fromFile(direccionTemporal);

                    if (infoArchivo != undefined) {

                        // ej, nos devolvera un objeto con la siguiente informacion { ext: 'pdf', mime: 'application/pdf' } por tanto nos interezara solo el valor de su "mime"
                        const tipo_archivo_b = infoArchivo.mime.toLowerCase(); // en minuscula

                        if (
                            tipo_archivo_a === "application/pdf" &&
                            tipo_archivo_b === "application/pdf"
                        ) {
                            // "fs.rename" mueve un archivo del lugar de origen (direccionTemporal) a otro destino (direccionDestino)
                            await fs.rename(direccionTemporal, direccionDestino);

                            //--------------------------------------------------------------
                            // PARA SUBIR ARCHIVO A FIREBASE

                            const storage = getStorage();

                            var nombre_y_ext = codigo_documento + extensionDocumentoMinuscula;
                            // para guardar en la carpeta "subido" en firebase con el nombre y la extension del archivo incluida
                            var direccionDestinoArchivo = "subido/" + nombre_y_ext;

                            // cramos una referencia al archivo imagen. donde se guardara y con que nombre sera guardado dentro de firebase
                            const storageRef = ref(storage, direccionDestinoArchivo);

                            const data = await fs.promises.readFile(direccionTemporal); // Utilizamos fs.promises.readFile para obtener una versión promisificada de fs.readFile

                            // ESPERAMOS QUE SUBA LA IMAGEN
                            await uploadBytes(storageRef, data);

                            //console.log("Archivo subido con éxito a Firebase Storage");

                            // Obtiene la URL de descarga pública de la imagen
                            const url_archivo = await getDownloadURL(storageRef);

                            //console.log("URL de descarga pública:", url_archivo);

                            //--------------------------------------------------------------
                            // despues de subir la imagen a firebase, eliminamos el archivo de la carpeta "temporal" donde se encuentra alamacenado temporalmente
                            // con "fs.unlink" eliminamos el archivo imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado.
                            await fs.unlink(direccionTemporal);
                            //--------------------------------------------------------------

                            const datosDocumentoNuevo = new indiceDocumentos({
                                codigo_terreno: codigo_terreno,
                                codigo_proyecto: codigo_proyecto,
                                codigo_inmueble: codigo_inmueble,
                                nombre_documento: req.body.nombre_documento,
                                codigo_documento: codigo_documento,
                                clase_documento: req.body.clase_documento,
                                ci_propietario: req.body.ci_propietario,
                                url: url_archivo,
                            });

                            // ahora guardamos en la base de datos la informacion de el documento creada
                            await datosDocumentoNuevo.save();
                            var nombre_documento = req.body.nombre_documento;

                            //-------------------------------------------------------------------
                            // guardamos en el historial de acciones
                            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                            var accion_administrador =
                                "Guarda documento " +
                                codigo_documento +
                                " de " +
                                req.body.codigo_objetivo;
                            var aux_accion_adm = {
                                ci_administrador,
                                accion_administrador,
                            };
                            await guardarAccionAdministrador(aux_accion_adm);
                            //-------------------------------------------------------------------

                            if (req.body.clase_documento == "Propietario") {
                                res.json({
                                    exito: "si",
                                    codigo_documento,
                                    nombre_documento,
                                    codigo_inmueble, // codigo del inm al que pertenecera el docum
                                    url:url_archivo,
                                });
                            } else {
                                res.json({
                                    exito: "si",
                                    codigo_documento,
                                    nombre_documento,
                                    clase_documento: req.body.clase_documento,
                                    url:url_archivo,
                                });
                            }
                        } else {
                            // en caso de que el archivo no sea una IMAGEN, entonces sera eliminado de la carpeta "TEMPORAL"
                            // con "fs.unlink" eliminamos el archivo que no es una imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
                            await fs.unlink(direccionTemporal);

                            res.json({
                                exito: "no",
                                mensaje: "Solo documentos PDF estan permitidas",
                            });
                        }
                    } else {
                        // en caso de que el archivo no sea una IMAGEN, entonces sera eliminado de la carpeta "TEMPORAL"
                        // con "fs.unlink" eliminamos el archivo que no es una imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
                        await fs.unlink(direccionTemporal);

                        res.json({
                            exito: "no",
                            mensaje: "Solo documentos PDF estan permitidas",
                        });
                    }
                }
            }
        } else {
            const direccionTemporal = req.file.path; // es "path" (no pache, la que requerimos al inicio), esta es la propiedad propia de "file"
            // con "fs.unlink" eliminamos el archivo, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
            await fs.unlink(direccionTemporal);

            // si el acceso es denegado
            res.json({
                exito: "denegado",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// CONTROLADOR PARA ELIMINAR UN DOCUMENTO DEL TERRENO, PROYECTO, INMUEBLE, PROPIETARIO
// DELETE: "/laapirest/administracion/general/accion/eliminar_documento/:objetivo_tipo/:codigo_documento"
controladorAdministradorGeneral.eliminarDocumento = async (req, res) => {
    try {
        const codigo_documento = req.params.codigo_documento;
        // objetivo_tipo, no es usado aqui, solo es considerado en la ruta para mantener la simetria con otras rutas de accion del terreno

        var documentoEliminar = await indiceDocumentos.findOne({
            codigo_documento: codigo_documento,
        });
        var codigo_terreno = documentoEliminar.codigo_terreno;
        var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

        if (acceso == "permitido") {
            if (documentoEliminar) {
                // si la documento pdf es encontrada en la base de datos
                // entonces eliminamos el archivo documento pdf (la documento pdf misma) de la carpeta donde se encuentra guardada (carpeta "subido")
                // "unlink" es un metodo de "fs" que elimina un archivo a partir de la direccion que se le de. Esta direccion sera aquella donde se encuentra guardada la documento pdf
                const auxCodigoDocumento = codigo_documento + ".pdf";

                await fs.unlink(pache.resolve("./src/publico/subido/" + auxCodigoDocumento)); // "+" es para concatenar

                // ahora eliminamos todos los datos (informacion que esta guardada en la base de datos) de la documento pdf
                //await documentoEliminar.remove(); // funcionaba, pero eliminamos para no tener problemas con la caducidad de remove
                await indiceDocumentos.deleteOne({ codigo_documento: codigo_documento });

                //-----------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var accion_administrador = "Elimina documento " + codigo_documento;
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-----------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                res.json({
                    exito: "no",
                    mensaje: "Error, mal requerimiento al eliminar documento",
                });
            }
        } else {
            // si el acceso es denegado
            res.json({
                exito: "denegado",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// PARA subir al servidor DOCUMENTOS de EMPRESA "COMO FUNCIONA"

// RUTA   "post"  /laapirest/administracion/general/accion/subir_doc_empresa_funciona

controladorAdministradorGeneral.subirDocumentoEmpresaFunciona = async (req, res) => {
    try {
        var codigo_funciona = req.body.name_codigo_funciona;

        // revision de existencia del "codigo funciona"

        var funciona_existe = await indiceImagenesEmpresa_sf.find({
            codigo_imagen: codigo_funciona,
        });

        if (funciona_existe.length > 0) {
            funcionGuardaDocumento();

            async function funcionGuardaDocumento() {
                // esta funcion genera el nombre alfanumerico de el documento (ojo, sin extension)
                var codigo_documento = codigoAlfanumericoDocumento();

                // revisamos en la base de datos, si el nombre de el documento alfanumerico ya existe
                var codigo_documento_existe = await indiceDocumentos.find({
                    codigo_documento: codigo_documento,
                });

                // si se encuentra un documento con el mismo nombre alfanumerico
                if (codigo_documento_existe.length > 0) {
                    // entonces se le creara un nuevo nombre
                    funcionGuardaDocumento(); // volvemos a ejecutar la funcion nuevamente, a esto se llama FUNCION RECURSIVA.
                } else {
                    // si el codigo es unico y no tiene similares, entonces

                    // extraemos la direccion donde se encuentra temporalmente el documento (carpeta temporal) y la guardamos en la constante "direccionTemporal"
                    const direccionTemporal = req.file.path; // es "path" (no pache, la que requerimos al inicio), esta es la propiedad propia de "file"

                    // (extname) extraemos la extension de el documento y la convertimos en minuscula "toLowerCase" por precausion, porque el nombre alfanumerico generado, se genera en minuscula.
                    const extensionDocumentoMinuscula = pache
                        .extname(req.file.originalname)
                        .toLowerCase();

                    /*
                    // direccion de destino, donde sera guardada el documento (se la guardara en la carpeta "subido"), esta direccion sera guardada en la constante "direccionDestino"
                    // el documento sera guardada con el nombre alfanumerico que se le dio
                    const direccionDestino = pache.resolve(
                        `src/publico/subido/${codigo_documento}${extensionDocumentoMinuscula}`
                    );
                    */

                    //console.log("req.file es");
                    //console.log(req.file);

                    // para validar el documento, que lo que se esta subiendo sea en verdad un archivo de PDF
                    const tipo_archivo_a = req.file.mimetype.toLowerCase(); // en minuscula

                    //console.log("extension archivo a");
                    //console.log(tipo_archivo_a);

                    // para validar si en verdad es una PDF y NO UN ARCHIVO CORRUPTO con "file-type"
                    // con fileType analizamos si es un archivo de PDF verdader, y para ello le damos la direccion donde esta almacenado temporalmente el archivo antes de ser subido al servidor
                    const infoArchivo = await fileType.fromFile(direccionTemporal);

                    if (infoArchivo != undefined) {
                        // ej, nos devolvera un objeto con la siguiente informacion { ext: 'pdf', mime: 'application/pdf' } por tanto nos interezara solo el valor de su "mime"
                        const tipo_archivo_b = infoArchivo.mime.toLowerCase(); // en minuscula

                        //console.log("extension archivo b");
                        //console.log(tipo_archivo_b);

                        if (req.body.name_radio_tipo_archivo == "pdf") {
                            if (
                                tipo_archivo_a === "application/pdf" &&
                                tipo_archivo_b === "application/pdf"
                            ) {
                                var archivo_aceptado = true;
                            } else {
                                var archivo_aceptado = false;
                                var mensaje = "Solo documentos PDF estan permitidas";
                            }
                        }

                        if (req.body.name_radio_tipo_archivo == "word") {
                            /*
                            if (
                                tipo_archivo_a === "application/docx" &&
                                tipo_archivo_b === "application/docx"
                            )
                            */

                            if (
                                tipo_archivo_a ===
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                                tipo_archivo_b ===
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            ) {
                                var archivo_aceptado = true;
                            } else {
                                var archivo_aceptado = false;
                                var mensaje = "Solo documentos WORD estan permitidas";
                            }
                        }

                        if (req.body.name_radio_tipo_archivo == "excel") {
                            /*
                            if (
                                tipo_archivo_a === "application/xlsx" &&
                                tipo_archivo_b === "application/xlsx"
                            )
                            */

                            if (
                                tipo_archivo_a ===
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                                tipo_archivo_b ===
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            ) {
                                var archivo_aceptado = true;
                            } else {
                                var archivo_aceptado = false;
                                var mensaje = "Solo documentos EXCEL estan permitidas";
                            }
                        }

                        if (archivo_aceptado) {
                            /*
                            // "fs.rename" mueve un archivo del lugar de origen (direccionTemporal) a otro destino (direccionDestino)
                            await fs.rename(direccionTemporal, direccionDestino);
                            */

                            //--------------------------------------------------------------
                            // PARA SUBIR ARCHIVO A FIREBASE

                            const storage = getStorage();

                            var nombre_y_ext = codigo_documento + extensionDocumentoMinuscula;
                            // para guardar en la carpeta "subido" en firebase con el nombre y la extension del archivo incluida
                            var direccionDestinoImagen = "subido/" + nombre_y_ext;

                            // cramos una referencia al archivo imagen. donde se guardara y con que nombre sera guardado dentro de firebase
                            const storageRef = ref(storage, direccionDestinoImagen);

                            const data = await fs.promises.readFile(direccionTemporal); // Utilizamos fs.promises.readFile para obtener una versión promisificada de fs.readFile

                            // ESPERAMOS QUE SUBA LA IMAGEN
                            await uploadBytes(storageRef, data);

                            //console.log("Archivo subido con éxito a Firebase Storage");

                            // Obtiene la URL de descarga pública de la imagen
                            const url_archivo = await getDownloadURL(storageRef);

                            //console.log("URL de descarga pública:", url_archivo);

                            //--------------------------------------------------------------
                            // despues de subir la imagen a firebase, eliminamos el archivo de la carpeta "temporal" donde se encuentra alamacenado temporalmente
                            // con "fs.unlink" eliminamos el archivo imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado.
                            await fs.unlink(direccionTemporal);
                            //--------------------------------------------------------------

                            // los atributos que no figuran aqui ya estan configurados con valores por defecto en la base de datos
                            const datosDocumentoNuevo = new indiceDocumentos({
                                codigo_terreno: codigo_funciona,
                                nombre_documento: req.body.name_radio_tipo_archivo, // pdf || word || excel
                                codigo_documento,
                                clase_documento: req.body.name_radio_tipo_doc, // manual || beneficio || modelo
                                url: url_archivo,
                            });

                            // ahora guardamos en la base de datos la informacion de el documento creada
                            await datosDocumentoNuevo.save();

                            //-------------------------------------------------------------------
                            // guardamos en el historial de acciones
                            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                            var accion_administrador =
                                "Guarda documento FUNCIONA " +
                                codigo_documento +
                                " de " +
                                codigo_funciona;
                            var aux_accion_adm = {
                                ci_administrador,
                                accion_administrador,
                            };
                            await guardarAccionAdministrador(aux_accion_adm);
                            //-------------------------------------------------------------------

                            res.json({
                                exito: "si",
                                codigo_documento,
                                codigo_funciona,
                                tipo_archivo: req.body.name_radio_tipo_archivo, // pdf || word || excel
                                tipo_doc: req.body.name_radio_tipo_doc, // manual || beneficio || modelo
                                url: url_archivo,
                            });
                        } else {
                            // en caso de que el archivo no sea una pdf o docx, entonces sera eliminado de la carpeta "TEMPORAL"
                            // con "fs.unlink" eliminamos el archivo que no es una imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
                            await fs.unlink(direccionTemporal);

                            res.json({
                                exito: "no",
                                mensaje,
                            });
                        }
                    } else {
                        // en caso de que el archivo no sea una IMAGEN, entonces sera eliminado de la carpeta "TEMPORAL"
                        // con "fs.unlink" eliminamos el archivo que no es una imagen, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
                        await fs.unlink(direccionTemporal);

                        res.json({
                            exito: "no",
                            mensaje: "Solo documentos PDF, WORD o EXCEL estan permitidas",
                        });
                    }
                }
            }
        } else {
            const direccionTemporal = req.file.path; // es "path" (no pache, la que requerimos al inicio), esta es la propiedad propia de "file"
            // con "fs.unlink" eliminamos el archivo, dentro de ( ) le damos la direccion donde el archivo esta guardado temporalmente.
            await fs.unlink(direccionTemporal);

            // si el acceso es denegado
            res.json({
                exito: "denegado",
                mensaje: "El codigo funcionamiento no existe, intente nuevamente",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// CONTROLADOR PARA ELIMINAR UN DOCUMENTO DE "COMO FUNCIONA"
// DELETE: "/laapirest/administracion/general/accion/eliminar_doc_empresa_funciona"
controladorAdministradorGeneral.eliminarDocumentoEmpresaFunciona = async (req, res) => {
    try {
        const codigo_documento = req.body.codigo_documento;

        var documentoEliminar = await indiceDocumentos.findOne({
            codigo_documento: codigo_documento,
        });

        if (documentoEliminar) {
            if (documentoEliminar.nombre_documento == "pdf") {
                var extension = "pdf";
            }
            if (documentoEliminar.nombre_documento == "word") {
                var extension = "docx";
            }
            if (documentoEliminar.nombre_documento == "excel") {
                var extension = "xlsx";
            }

            // en "nombre_documento" se encuentra el tipo: "pdf || docx" (guardado asi para FUNCIONA EMPRESA)
            const auxCodigoDocumento = codigo_documento + "." + extension;

            // "unlink" es un metodo de "fs" que elimina un archivo a partir de la direccion que se le de. Esta direccion sera aquella donde se encuentra guardada la documento pdf o docx
            await fs.unlink(pache.resolve("./src/publico/subido/" + auxCodigoDocumento)); // "+" es para concatenar

            // ahora eliminamos todos los datos (informacion que esta guardada en la base de datos) de la documento pdf
            //await documentoEliminar.remove(); // funciona, pero cambiamos porque dice que esta obsoleto
            await indiceDocumentos.deleteOne({ codigo_documento: codigo_documento });

            //-----------------------------------------------
            // guardamos en el historial de acciones
            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
            var accion_administrador = "Elimina documento FUNCIONA " + codigo_documento;
            var aux_accion_adm = {
                ci_administrador,
                accion_administrador,
            };
            await guardarAccionAdministrador(aux_accion_adm);
            //-----------------------------------------------

            res.json({
                exito: "si",
            });
        } else {
            res.json({
                exito: "no",
                mensaje: "Error, mal requerimiento al eliminar documento",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// PARA SUBIR URL VIDEO DE "COMO FUNCIONA"

// RUTA   "post"  "/laapirest/administracion/general/accion/subir_url_video_funciona"

controladorAdministradorGeneral.subirVideoEmpresaFunciona = async (req, res) => {
    try {
        var codigo_funciona = req.body.name_codigo_funciona;

        // revision de existencia del "codigo funciona"
        var funciona_existe = await indiceImagenesEmpresa_sf.findOne({
            codigo_imagen: codigo_funciona,
        });

        if (funciona_existe) {
            // guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
            await indiceImagenesEmpresa_sf.updateOne(
                { codigo_imagen: codigo_funciona },
                { $set: { url_video: req.body.name_url_video_funciona } }
            );

            await indiceImagenesEmpresa_sf.updateOne(
                { codigo_imagen: codigo_funciona },
                { $set: { video_funciona: true } }
            );

            //-------------------------------------------------------------------
            // guardamos en el historial de acciones
            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
            var accion_administrador =
                "Guarda URL VIDEO imagen funciona" + " de " + codigo_funciona;
            var aux_accion_adm = {
                ci_administrador,
                accion_administrador,
            };
            await guardarAccionAdministrador(aux_accion_adm);
            //-------------------------------------------------------------------

            res.json({
                exito: "si",
                url_video: req.body.name_url_video_funciona,
                codigo_funciona,
            });
        } else {
            // si la imagen de como funciona no existe
            res.json({
                exito: "no",
                mensaje: "El codigo funcionamiento no existe, intente nuevamente",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
// PARA ELIMINAR URL VIDEO DE "COMO FUNCIONA"

// RUTA   "delete"  "/laapirest/administracion/general/accion/eliminar_vid_empresa_funciona"

controladorAdministradorGeneral.eliminarVideoEmpresaFunciona = async (req, res) => {
    try {
        var codigo_imagen_funciona = req.body.codigo_imagen_funciona;

        // revision de existencia del "codigo funciona"
        var funciona_existe = await indiceImagenesEmpresa_sf.findOne({
            codigo_imagen: codigo_imagen_funciona,
        });

        if (funciona_existe) {
            // guarda y actualiza la base de datos poniendo la url_video como vacio ""
            await indiceImagenesEmpresa_sf.updateOne(
                { codigo_imagen: codigo_imagen_funciona },
                { $set: { url_video: "" } }
            );

            await indiceImagenesEmpresa_sf.updateOne(
                { codigo_imagen: codigo_imagen_funciona },
                { $set: { video_funciona: false } }
            );

            //-------------------------------------------------------------------
            // guardamos en el historial de acciones
            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
            var accion_administrador =
                "Elimina URL VIDEO imagen funciona" + " de " + codigo_imagen_funciona;
            var aux_accion_adm = {
                ci_administrador,
                accion_administrador,
            };
            await guardarAccionAdministrador(aux_accion_adm);
            //-------------------------------------------------------------------

            res.json({
                exito: "si",
                codigo_imagen_funciona,
            });
        } else {
            // si la imagen de como funciona no existe
            res.json({
                exito: "no",
                mensaje: "Error, mal requerimiento al eliminar documento",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA GUARDAR TABLA DE PROYECTO: PRESUPUESTO, EMPLEOS, RESPONSABILIDAD SOCIAL

controladorAdministradorGeneral.guardarTabla = async (req, res) => {
    // viene de la ruta   POST  "/laapirest/administracion/general/accion/guardar_tabla/:tipo_tabla_objetivo/:codigo_objetivo"

    try {
        const codigo_objetivo = req.params.codigo_objetivo;
        const tipo_tabla_objetivo = req.params.tipo_tabla_objetivo;

        // ------- Para verificación -------
        //console.log("los datos DEL BODY");
        //console.log(req.body);

        // el array ya viene en string de ajax, aqui se lo convierte en objeto tipo array como debe ser
        var array_tabla = JSON.parse(req.body.en_string);

        // ------- Para verificación -------
        //console.log('CONVIRTIENDO EL BODY PAQUETE DATOS EN STRING');
        //console.log(aux_string);
        // ------- Para verificación -------
        //console.log("CONVIRTIENDO EL BODY PAQUETE DATOS EN OBJETO");
        //console.log(array_tabla);

        var proyectoEncontrado = await indiceProyecto.findOne(
            {
                codigo_proyecto: codigo_objetivo,
            },
            {
                codigo_terreno: 1,
                _id: 0,
            }
        );

        if (proyectoEncontrado) {
            var codigo_terreno = proyectoEncontrado.codigo_terreno;
            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

            if (acceso == "permitido") {
                // sie es FALSE, significa que el proyecto esta DESBLOQUEADO

                if (tipo_tabla_objetivo == "py_presupuesto") {
                    // para guardar la tabla de presupustos del proyecto
                    var accion_administrador =
                        "Guarda tabla de presupuesto proyecto " + codigo_objetivo;
                    // guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigo_objetivo },
                        { $set: { presupuesto_proyecto: array_tabla } }
                    );
                }

                if (tipo_tabla_objetivo == "py_social") {
                    // para guardar la tabla de responsabilidad social del proyecto
                    var accion_administrador =
                        "Guarda tabla de responsabilidad social del proyecto " + codigo_objetivo;
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigo_objetivo },
                        { $set: { tabla_rs_proyecto: array_tabla } }
                    );
                }

                if (tipo_tabla_objetivo == "py_empleos") {
                    // para guardar la tabla de empleos del proyecto
                    var accion_administrador =
                        "Guarda tabla de empleos del proyecto " + codigo_objetivo;
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigo_objetivo },
                        { $set: { tabla_empleos_sociedad: array_tabla } }
                    );
                }

                //-----------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-----------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
                });
            }
        } else {
            res.json({
                exito: "no",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA ELIMINAR TABLA DE PROYECTO: PRESUPUESTO, RESPONSABILIDAD SOCIAL

controladorAdministradorGeneral.eliminarTabla = async (req, res) => {
    // viene de la ruta   POST   "/laapirest/administracion/general/accion/eliminar_tabla/:tipo_tabla_objetivo/:codigo_objetivo"

    try {
        const codigo_objetivo = req.params.codigo_objetivo;
        const tipo_tabla_objetivo = req.params.tipo_tabla_objetivo;

        var proyectoEncontrado = await indiceProyecto.findOne(
            {
                codigo_proyecto: codigo_objetivo,
            },
            {
                codigo_terreno: 1,
                _id: 0,
            }
        );

        if (proyectoEncontrado) {
            var codigo_terreno = proyectoEncontrado.codigo_terreno;
            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

            if (acceso == "permitido") {
                // sie es FALSE, significa que el proyecto esta DESBLOQUEADO
                const array_tabla = []; // sera una tabla VACIA
                if (tipo_tabla_objetivo == "py_presupuesto") {
                    // para guardar la tabla de presupustos del proyecto
                    var accion_administrador =
                        "Elimina tabla de presupuesto proyecto " + codigo_objetivo;
                    // guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigo_objetivo },
                        { $set: { presupuesto_proyecto: array_tabla } }
                    );
                }

                if (tipo_tabla_objetivo == "py_social") {
                    // para guardar la tabla de responsabilidad social del proyecto
                    var accion_administrador =
                        "Elimina tabla de responsabilidad social proyecto " + codigo_objetivo;
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigo_objetivo },
                        { $set: { tabla_rs_proyecto: array_tabla } }
                    );
                }

                if (tipo_tabla_objetivo == "py_empleos") {
                    // para guardar la tabla de responsabilidad social del proyecto
                    var accion_administrador =
                        "Elimina tabla de empleos proyecto " + codigo_objetivo;
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigo_objetivo },
                        { $set: { tabla_empleos_sociedad: array_tabla } }
                    );
                }

                //-----------------------------------------------
                // guardamos en el historial de acciones
                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-----------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                // si es TRUE, significa que el proyecto esta BLOQUEADO
                res.json({
                    exito: "denegado",
                });
            }
        } else {
            res.json({
                exito: "no",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA GUARDAR PROPIETARIO (DATOS O PAGOS)

controladorAdministradorGeneral.guardarDatosPagosPropietario = async (req, res) => {
    // ruta   POST   "/laapirest/administracion/general/accion/guardar_datos_pagos_propietario/:tipo_guardado"

    try {
        /*
        // ------- Para verificación -------
        console.log("los datos del req body para guardar sus datos es:");
        console.log(req.body);
        // ------- Para verificación -------
        console.log("los datos del req body CONTENEDOR es:");
        console.log(req.body.contenedor);
        */

        // el array ya viene en string de ajax, aqui se lo convierte en objeto tipo array como debe ser
        var objeto_convertido = JSON.parse(req.body.contenedor);

        // ------- Para verificación -------
        console.log("el objeto convertido es:");
        console.log(objeto_convertido);
        // ------- Para verificación -------
        console.log("PAGOS MENSUALES es:");
        console.log(objeto_convertido.propietario_pagos);

        const ci_propietario = objeto_convertido.ci_propietario;
        const tipo_guardado = req.params.tipo_guardado;

        /*
        // ------- Para verificación -------
        console.log("entramos a guardar los datos en la base de datos");
        console.log("ci_propietario: " + ci_propietario + " tipo de guardado: " + tipo_guardado);
        */

        //------------------------------------------------------------------------

        // "guardar_datos_pagos_a" cuando se guardan datos y pagos en conjunto desde la pestaña "propietario" de la cuenta "inmueble"
        // es el unico que requiere verificar si el propietario es nuevo o no en la base de datos.
        // en esta opcion es donde se cambia el estado de propietario a "activo" en favor del propietario desde el cual se modifican los datos, poniendo a los demas a estado "pasivo"
        if (tipo_guardado == "guardar_datos_pagos_a") {
            const codigo_inmueble = objeto_convertido.propietario_pagos.codigo_inmueble;

            var inmuebleEncontrado = await indiceInmueble.findOne(
                {
                    codigo_inmueble: codigo_inmueble,
                },
                {
                    codigo_terreno: 1,
                    codigo_proyecto: 1,
                    _id: 0,
                }
            );

            if (inmuebleEncontrado) {
                var codigo_terreno = inmuebleEncontrado.codigo_terreno;
                var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

                if (acceso == "permitido") {
                    // guardamos los datos del propietario

                    var propietarioRegistrado = await indice_propietario.findOne({
                        ci_propietario: ci_propietario,
                    });

                    if (propietarioRegistrado) {
                        // si es un propietario que ya existe

                        propietarioRegistrado.nombres_propietario =
                            objeto_convertido.propietario_datos.nombres_propietario;
                        propietarioRegistrado.apellidos_propietario =
                            objeto_convertido.propietario_datos.apellidos_propietario;
                        propietarioRegistrado.telefonos_propietario =
                            objeto_convertido.propietario_datos.telefonos_propietario;
                        propietarioRegistrado.fecha_nacimiento_propietario =
                            objeto_convertido.propietario_datos.fecha_nacimiento_propietario;
                        propietarioRegistrado.ocupacion_propietario =
                            objeto_convertido.propietario_datos.ocupacion_propietario;
                        propietarioRegistrado.departamento_propietario =
                            objeto_convertido.propietario_datos.departamento_propietario;
                        propietarioRegistrado.provincia_propietario =
                            objeto_convertido.propietario_datos.provincia_propietario;
                        propietarioRegistrado.domicilio_propietario =
                            objeto_convertido.propietario_datos.domicilio_propietario;

                        await propietarioRegistrado.save();
                    } else {
                        // entonces es un propietario nuevo

                        //--------------------------------------------------
                        // damos sus claves de acceso por defecto
                        let auxFechaNacimiento =
                            objeto_convertido.propietario_datos.fecha_nacimiento_propietario;
                        // La fecha de nacimiento esta en formato: año-mes-dia   ej/ 1988-01-30

                        let a_m_d = auxFechaNacimiento.split("-");
                        let a_ano = a_m_d[0];
                        let a_mes = a_m_d[1];
                        let a_dia = a_m_d[2];

                        let clave_propietario = a_dia + a_mes + a_ano;
                        // ------- Para verificación -------
                        //console.log("la clave por defecto es:");
                        //console.log(clave_propietario);
                        //--------------------------------------------------

                        const datosNuevoPropietario = new indice_propietario({
                            ci_propietario: ci_propietario,
                            nombres_propietario:
                                objeto_convertido.propietario_datos.nombres_propietario,
                            apellidos_propietario:
                                objeto_convertido.propietario_datos.apellidos_propietario,
                            telefonos_propietario:
                                objeto_convertido.propietario_datos.telefonos_propietario,
                            fecha_nacimiento_propietario:
                                objeto_convertido.propietario_datos.fecha_nacimiento_propietario,
                            ocupacion_propietario:
                                objeto_convertido.propietario_datos.ocupacion_propietario,
                            departamento_propietario:
                                objeto_convertido.propietario_datos.departamento_propietario,
                            provincia_propietario:
                                objeto_convertido.propietario_datos.provincia_propietario,
                            domicilio_propietario:
                                objeto_convertido.propietario_datos.domicilio_propietario,
                            usuario_propietario: ci_propietario,
                            clave_propietario,
                        });

                        //----------------------------------
                        // #session-passport #encriptar-contraseña para SESION USUARIO, encriptar contraseña y guardarlo en la base de datos
                        datosNuevoPropietario.clave_propietario =
                            await datosNuevoPropietario.encriptarContrasena(clave_propietario);
                        //----------------------------------

                        await datosNuevoPropietario.save(); // GUARDAMOS EL NUEVO REGISTRO
                    }

                    // --------------------------------------------------
                    // ahora procedemos a guardar los pagos del propietario

                    var inversionesInmueble = await indiceInversiones.find({
                        codigo_inmueble: codigo_inmueble,
                    });

                    if (inversionesInmueble.length > 0) {
                        // se cambiara el estado a "pasivo" TODAS las inversiones existentes que tiene el inmueble, porque codigos mas abajo el unico activo sera el propitario que esta siendo registrado en esta opcion
                        await indiceInversiones.updateMany(
                            //  REVISAR ESTE "updateMany"
                            { codigo_inmueble: codigo_inmueble },
                            { $set: { estado_propietario: "pasivo" } }
                        );
                    }

                    // buscamos si ya existe el registro o si es nuevo

                    var inversionEncontrado = await indiceInversiones.findOne({
                        codigo_inmueble: codigo_inmueble,
                        ci_propietario: ci_propietario,
                    });

                    if (inversionEncontrado) {
                        // significa que ya existe registro de inversion de este propietario en este inmueble

                        // notese que no es necesario re-guardar los datos de: codigos de inmueble, terreno, proyecto, porque estos ya estan guardados en esta base de datos, solo se actualizaran los campos de los pagos y fechas.
                        inversionEncontrado.estado_propietario = "activo"; // porque desde esta opcion se guardan a los propietarios que seran activos del inmueble
                        inversionEncontrado.tiene_reserva =
                            objeto_convertido.propietario_pagos.tiene_reserva;
                        inversionEncontrado.pagado_reserva =
                            objeto_convertido.propietario_pagos.pagado_reserva;
                        inversionEncontrado.fecha_pagado_reserva =
                            objeto_convertido.propietario_pagos.fecha_pagado_reserva;

                        inversionEncontrado.tiene_pago =
                            objeto_convertido.propietario_pagos.tiene_pago;
                        inversionEncontrado.pagado_pago =
                            objeto_convertido.propietario_pagos.pagado_pago;
                        inversionEncontrado.fecha_pagado_pago =
                            objeto_convertido.propietario_pagos.fecha_pagado_pago;

                        inversionEncontrado.tiene_mensuales =
                            objeto_convertido.propietario_pagos.tiene_mensuales;
                        inversionEncontrado.pagos_mensuales =
                            objeto_convertido.propietario_pagos.pagos_mensuales;

                        await inversionEncontrado.save();

                        //-----------------------------------------------
                        // guardamos en el historial de acciones

                        var accion_administrador =
                            "guarda datos y pagos de propietario " +
                            ci_propietario +
                            " en inmueble " +
                            codigo_inmueble;

                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //-----------------------------------------------

                        res.json({
                            exito: "si",
                        });
                    } else {
                        // significa que es nuevo pago
                        const nuevaInversion = new indiceInversiones({
                            codigo_terreno: inmuebleEncontrado.codigo_terreno,
                            codigo_proyecto: inmuebleEncontrado.codigo_proyecto,
                            codigo_inmueble: codigo_inmueble,
                            ci_propietario: ci_propietario,

                            estado_propietario: "activo", // porque desde esta opcion se guardan a los propietarios que seran activos del inmueble

                            tiene_reserva: objeto_convertido.propietario_pagos.tiene_reserva,
                            pagado_reserva: objeto_convertido.propietario_pagos.pagado_reserva,
                            fecha_pagado_reserva:
                                objeto_convertido.propietario_pagos.fecha_pagado_reserva,

                            tiene_pago: objeto_convertido.propietario_pagos.tiene_pago,
                            pagado_pago: objeto_convertido.propietario_pagos.pagado_pago,
                            fecha_pagado_pago:
                                objeto_convertido.propietario_pagos.fecha_pagado_pago,

                            tiene_mensuales: objeto_convertido.propietario_pagos.tiene_mensuales,
                            pagos_mensuales: objeto_convertido.propietario_pagos.pagos_mensuales,
                        });
                        await nuevaInversion.save(); // GUARDAMOS EL NUEVO REGISTRO

                        //-----------------------------------------------
                        // guardamos en el historial de acciones

                        var accion_administrador =
                            "guarda datos y pagos de propietario " +
                            ci_propietario +
                            " en inmueble " +
                            codigo_inmueble;

                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //-----------------------------------------------

                        res.json({
                            exito: "si",
                        });
                    }
                } else {
                    // si es TRUE, significa que el proyecto esta BLOQUEADO
                    res.json({
                        exito: "denegado",
                    });
                }
            } else {
                res.json({
                    exito: "no",
                });
            }
        }

        //------------------------------------------------------------------------

        // "guardar_datos_pagos_b" cuando se guardan datos y pagos en conjunto desde la pestaña "pagos" de la cuenta "inmueble"
        if (tipo_guardado == "guardar_datos_pagos_b") {
            const codigo_inmueble = objeto_convertido.propietario_pagos.codigo_inmueble;

            var inmuebleEncontrado = await indiceInmueble.findOne(
                {
                    codigo_inmueble: codigo_inmueble,
                },
                {
                    codigo_terreno: 1,
                    codigo_proyecto: 1,
                    _id: 0,
                }
            );

            if (inmuebleEncontrado) {
                var codigo_terreno = inmuebleEncontrado.codigo_terreno;
                var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

                if (acceso == "permitido") {
                    var propietarioRegistrado = await indice_propietario.findOne({
                        ci_propietario: ci_propietario,
                    });

                    var inversionEncontrado = await indiceInversiones.findOne({
                        codigo_inmueble: codigo_inmueble,
                        ci_propietario: ci_propietario,
                    });

                    if (propietarioRegistrado && inversionEncontrado) {
                        // guardamos los datos del propietario

                        // si es un propietario que ya existe

                        propietarioRegistrado.nombres_propietario =
                            objeto_convertido.propietario_datos.nombres_propietario;
                        propietarioRegistrado.apellidos_propietario =
                            objeto_convertido.propietario_datos.apellidos_propietario;
                        propietarioRegistrado.telefonos_propietario =
                            objeto_convertido.propietario_datos.telefonos_propietario;
                        propietarioRegistrado.fecha_nacimiento_propietario =
                            objeto_convertido.propietario_datos.fecha_nacimiento_propietario;
                        propietarioRegistrado.ocupacion_propietario =
                            objeto_convertido.propietario_datos.ocupacion_propietario;
                        propietarioRegistrado.departamento_propietario =
                            objeto_convertido.propietario_datos.departamento_propietario;
                        propietarioRegistrado.provincia_propietario =
                            objeto_convertido.propietario_datos.provincia_propietario;
                        propietarioRegistrado.domicilio_propietario =
                            objeto_convertido.propietario_datos.domicilio_propietario;

                        await propietarioRegistrado.save();

                        // --------------------------------------------------
                        // ahora procedemos a guardar los pagos del propietario

                        // aqui no se modifica el estado "estado_propietario" (pasivo o activo), se lo deja como se encuentra.

                        inversionEncontrado.tiene_reserva =
                            objeto_convertido.propietario_pagos.tiene_reserva;
                        inversionEncontrado.pagado_reserva =
                            objeto_convertido.propietario_pagos.pagado_reserva;
                        inversionEncontrado.fecha_pagado_reserva =
                            objeto_convertido.propietario_pagos.fecha_pagado_reserva;

                        inversionEncontrado.tiene_pago =
                            objeto_convertido.propietario_pagos.tiene_pago;
                        inversionEncontrado.pagado_pago =
                            objeto_convertido.propietario_pagos.pagado_pago;
                        inversionEncontrado.fecha_pagado_pago =
                            objeto_convertido.propietario_pagos.fecha_pagado_pago;

                        inversionEncontrado.tiene_mensuales =
                            objeto_convertido.propietario_pagos.tiene_mensuales;
                        inversionEncontrado.pagos_mensuales =
                            objeto_convertido.propietario_pagos.pagos_mensuales;

                        await inversionEncontrado.save();

                        //-----------------------------------------------
                        // guardamos en el historial de acciones

                        var accion_administrador =
                            "guarda datos y pagos de propietario " +
                            ci_propietario +
                            " en inmueble " +
                            codigo_inmueble;

                        var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                        var aux_accion_adm = {
                            ci_administrador,
                            accion_administrador,
                        };
                        await guardarAccionAdministrador(aux_accion_adm);
                        //-----------------------------------------------

                        res.json({
                            exito: "si",
                        });
                    } else {
                        res.json({
                            exito: "no",
                        });
                    }
                } else {
                    // si es TRUE, significa que el proyecto esta BLOQUEADO
                    res.json({
                        exito: "denegado",
                    });
                }
            } else {
                res.json({
                    exito: "no",
                });
            }
        }

        //------------------------------------------------------------------------

        // no es necesario verificar si el usuario existe, porque a esta opcion de "guardar datos" solo se ingresa desde usurios que ya existen en la base de datos, por tanto solo en necesario actualizar los datos.
        // PERTENECE A LA PESTAÑA "DATOS" DE LA CUENTA DEL PROPIETARIO.
        if (tipo_guardado == "guardar_datos") {
            var propietarioRegistrado = await indice_propietario.findOne({
                ci_propietario: ci_propietario,
            });

            if (propietarioRegistrado) {
                // si el propietario es encontrado

                propietarioRegistrado.nombres_propietario =
                    objeto_convertido.propietario_datos.nombres_propietario;
                propietarioRegistrado.apellidos_propietario =
                    objeto_convertido.propietario_datos.apellidos_propietario;
                propietarioRegistrado.telefonos_propietario =
                    objeto_convertido.propietario_datos.telefonos_propietario;
                propietarioRegistrado.fecha_nacimiento_propietario =
                    objeto_convertido.propietario_datos.fecha_nacimiento_propietario;
                propietarioRegistrado.ocupacion_propietario =
                    objeto_convertido.propietario_datos.ocupacion_propietario;
                propietarioRegistrado.departamento_propietario =
                    objeto_convertido.propietario_datos.departamento_propietario;
                propietarioRegistrado.provincia_propietario =
                    objeto_convertido.propietario_datos.provincia_propietario;
                propietarioRegistrado.domicilio_propietario =
                    objeto_convertido.propietario_datos.domicilio_propietario;

                await propietarioRegistrado.save();

                //-----------------------------------------------
                // guardamos en el historial de acciones

                var accion_administrador = "guarda datos de propietario " + ci_propietario;

                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-----------------------------------------------

                res.json({
                    exito: "si",
                });
            } else {
                res.json({
                    exito: "no",
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorAdministradorGeneral;
