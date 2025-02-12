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
    indiceFraccionTerreno,
    indiceFraccionInmueble,
} = require("../modelos/indicemodelo");

const {
    verificadorTerrenoBloqueado,
    guardarAccionAdministrador,
    fraccion_card_adm_cli,
} = require("../ayudas/funcionesayuda_1");

const { datos_pagos_propietario } = require("../ayudas/funcionesayuda_2");

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
                    _id: 0,
                }
            );

            if (terreno_encontrado) {
                //-------------------------------------------------------
                // Cuenta solo las fracciones que pertenecen al terreno en especifico
                var fracciones_maximo = await indiceFraccionTerreno.countDocuments({
                    codigo_terreno: codigo_terreno,
                });

                var fracciones_invertidas = await indiceFraccionTerreno.countDocuments({
                    codigo_terreno: codigo_terreno,
                    disponible: false,
                });
                //-------------------------------------------------------

                // si es "true", significa que aun queda espacio para admitir anteproyectos
                if (
                    terreno_encontrado.convocatoria_disponible == true &&
                    fracciones_invertidas < fracciones_maximo
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
            // si es una imagen "administrador", es decir que es propio de la EMPRESA
            // imagenes de: COMO FUNCIONA y QUINES SOMOS
            var imagenEliminar = await indiceImagenesEmpresa_sf.findOne({
                codigo_imagen: codigo_imagen,
            });

            var acceso = "permitido";
        }

        if (objetivo_tipo == "terreno" || objetivo_tipo == "proyecto") {
            var codigo_terreno = imagenEliminar.codigo_terreno;
            var acceso = await verificadorTerrenoBloqueado(codigo_terreno);
        }

        if (acceso == "permitido") {
            if (imagenEliminar) {
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
                //console.log("Archivo eliminado DE FIREBASE con éxito");

                //--------------------------------------------------

                // ahora eliminamos todos los datos (informacion que esta guardada en la base de datos) de la imagen

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
                            //console.log("Archivo eliminado DE FIREBASE con éxito");

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
            var codigo_inmueble = req.body.codigo_inmueble;
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
                            //await fs.rename(direccionTemporal, direccionDestino);

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
                                    url: url_archivo,
                                });
                            } else {
                                res.json({
                                    exito: "si",
                                    codigo_documento,
                                    nombre_documento,
                                    clase_documento: req.body.clase_documento,
                                    url: url_archivo,
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
                //const auxCodigoDocumento = codigo_documento + ".pdf";

                //await fs.unlink(pache.resolve("./src/publico/subido/" + auxCodigoDocumento)); // "+" es para concatenar

                //--------------------------------------------------

                const storage = getStorage();

                var nombre_y_ext = codigo_documento + ".pdf";

                // para encontrar en la carpeta "subido" en firebase con el nombre y la extension de la imagen incluida
                var direccionActualImagen = "subido/" + nombre_y_ext;

                // Crear una referencia al archivo que se eliminará
                const desertRef = ref(storage, direccionActualImagen);

                // Eliminar el archivo y esperar la promesa
                await deleteObject(desertRef);

                // Archivo eliminado con éxito
                //console.log("Archivo eliminado DE FIREBASE con éxito");

                //--------------------------------------------------

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
            //const auxCodigoDocumento = codigo_documento + "." + extension;

            // "unlink" es un metodo de "fs" que elimina un archivo a partir de la direccion que se le de. Esta direccion sera aquella donde se encuentra guardada la documento pdf o docx
            //await fs.unlink(pache.resolve("./src/publico/subido/" + auxCodigoDocumento)); // "+" es para concatenar

            //--------------------------------------------------

            const storage = getStorage();

            var nombre_y_ext = codigo_documento + "." + extension;

            // para encontrar en la carpeta "subido" en firebase con el nombre y la extension de la imagen incluida
            var direccionActualImagen = "subido/" + nombre_y_ext;

            // Crear una referencia al archivo que se eliminará
            const desertRef = ref(storage, direccionActualImagen);

            // Eliminar el archivo y esperar la promesa
            await deleteObject(desertRef);

            // Archivo eliminado con éxito
            //console.log("Archivo eliminado DE FIREBASE con éxito");

            //--------------------------------------------------

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

                if (tipo_tabla_objetivo == "py_cuotas") {
                    var array_cuotas = [];
                    if (array_tabla.length > 0) {
                        for (let i = 0; i < array_tabla.length; i++) {
                            let pago_bs = array_tabla[i][1];

                            // aunque ya viene en tipo numerico, lo convertimos nuevamente en numerico por seguridad
                            let pagoNumero = Number(pago_bs);

                            let fecha = array_tabla[i][0]; // String ej: "2010-10-10"

                            array_cuotas[i] = {
                                fecha: fecha,
                                pago_bs: pagoNumero,
                            };
                        }
                    }
                    // para guardar la tabla de cuotas del proyecto
                    var accion_administrador =
                        "Guarda tabla de cuotas del proyecto " + codigo_objetivo;
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigo_objetivo },
                        { $set: { construccion_mensual: array_cuotas } }
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

                if (tipo_tabla_objetivo == "py_cuotas") {
                    // para guardar la tabla de responsabilidad social del proyecto
                    var accion_administrador =
                        "Elimina tabla de cuotas de construccion del proyecto " + codigo_objetivo;
                    await indiceProyecto.updateOne(
                        { codigo_proyecto: codigo_objetivo },
                        { $set: { construccion_mensual: array_tabla } }
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
// PARA GUARDAR PROPIETARIO (DATOS)

controladorAdministradorGeneral.guardarDatosPropietario = async (req, res) => {
    // ruta   POST   "/laapirest/administracion/general/accion/guardar_datos_propietario"

    try {
        /*
        // ------- Para verificación -------
        console.log("los datos del req body para guardar sus datos es:");
        console.log(req.body);
        // ------- Para verificación -------
        console.log("los datos del req body CONTENEDOR es:");
        console.log(req.body.contenedor);
        */

        var objeto_convertido = JSON.parse(req.body.contenedor);

        const ci_propietario = objeto_convertido.ci_propietario;

        //------------------------------------------------------------------------
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
                nombres_propietario: objeto_convertido.propietario_datos.nombres_propietario,
                apellidos_propietario: objeto_convertido.propietario_datos.apellidos_propietario,
                telefonos_propietario: objeto_convertido.propietario_datos.telefonos_propietario,
                fecha_nacimiento_propietario:
                    objeto_convertido.propietario_datos.fecha_nacimiento_propietario,
                ocupacion_propietario: objeto_convertido.propietario_datos.ocupacion_propietario,
                departamento_propietario:
                    objeto_convertido.propietario_datos.departamento_propietario,
                provincia_propietario: objeto_convertido.propietario_datos.provincia_propietario,
                domicilio_propietario: objeto_convertido.propietario_datos.domicilio_propietario,
                usuario_propietario: ci_propietario,
                clave_propietario,
            });

            //----------------------------------
            // #session-passport #encriptar-contraseña para SESION USUARIO, encriptar contraseña y guardarlo en la base de datos
            datosNuevoPropietario.clave_propietario =
                await datosNuevoPropietario.encriptarContrasena(clave_propietario);
            //----------------------------------

            await datosNuevoPropietario.save(); // GUARDAMOS EL NUEVO REGISTRO

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

            // "nuevo", para mostrar: usuario y clave por defecto
            res.json({
                exito: "nuevo",
                usuario: ci_propietario,
                clave: clave_propietario,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/************************************************************************************ */
/************************************************************************************ */
// PARA GUARDAR PROPIETARIO (PAGO)

// aqui para guardar el pago de un propietario de inmueble, se verificara que el propietario ya cuenta con datos guardados en la base de datos y si existe un propietario en estado pasivo, este sera eliminado en favor del nuevo propietario que sera el dueño del inmueble
controladorAdministradorGeneral.guardarPagoPropietario = async (req, res) => {
    // "/laapirest/administracion/general/accion/guardar_pago_propietario"
    try {
        var ci_propietario = req.body.ci_propietario;
        var codigo_inmueble = req.body.codigo_inmueble;

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
                let inversionInmueble = await indiceInversiones.findOne(
                    {
                        codigo_inmueble: codigo_inmueble,
                    },
                    {
                        ci_propietario: 1,
                        estado_propietario: 1,
                        pagos_mensuales: 1,
                        _id: 0,
                    }
                );

                if (inversionInmueble) {
                    if (inversionInmueble.estado_propietario == "activo") {
                        if (ci_propietario == inversionInmueble.ci_propietario) {
                            let contenedor_propietario = await datos_pagos_propietario(
                                codigo_inmueble
                            );

                            let deuda_demora = contenedor_propietario.deuda_demora;
                            let deuda_demora_render = contenedor_propietario.deuda_demora_render;

                            // el pago sera registrado como cuota mensual o mensuales de construccion

                            let cronograma_pagos = contenedor_propietario.cronograma_pagos;

                            if (cronograma_pagos.length > 0) {
                                let sum_demora = 0;
                                let array_demora = [];
                                for (let i = 0; i < cronograma_pagos.length; i++) {
                                    let leyenda_pago = cronograma_pagos[i].leyenda_pago;
                                    if (leyenda_pago == "Demora") {
                                        let pago_bs = cronograma_pagos[i].pago_bs;

                                        sum_demora = sum_demora + pago_bs;

                                        // agregamos al array_demora
                                        // El método push agrega uno o más elementos al final del array.
                                        array_demora.push(pago_bs); // Agrega pago_bs al final
                                    }
                                }

                                if (deuda_demora == sum_demora) {
                                    if (array_demora.length > 0) {
                                        let pagos_mensuales = inversionInmueble.pagos_mensuales;
                                        for (let j = 0; j < array_demora.length; j++) {
                                            let pago_bs = array_demora[j];

                                            // agregamos el nuevo pago al array de pagos mensuales de construccion del propietario activo

                                            let objetoPago = {
                                                // "new Date()" nos devuelve la fecha actual
                                                fecha: new Date(),
                                                pago_bs: pago_bs,
                                            };

                                            pagos_mensuales.push(objetoPago); // Agrega pago_bs al final
                                        }

                                        // guarda y actualiza la base de datos (si existe con anterioridad esa propiedad ya llenada con dato, lo sobreescribe con los datos nuevos)
                                        await indiceInversiones.updateOne(
                                            { codigo_inmueble: codigo_inmueble },
                                            { $set: { pagos_mensuales: pagos_mensuales } }
                                        );

                                        //-----------------------------------------------
                                        // guardamos en el historial de acciones

                                        var accion_administrador =
                                            "guarda pago de propietario " +
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
                                            pagado_render: deuda_demora_render,
                                            exito: "si",
                                        });
                                    }
                                }
                            }
                        } else {
                            // significa que el propietario que se intenta registrar el pago no es el mismo que figura como propietario del inmueble
                            res.json({
                                exito: "no_propietario",
                            });
                        }
                    } else {
                        // significa que el inmueble tiene un propietario en estado "pasivo", por tanto sera reeemplazado por este nuevo propietario y el pago del propietario pasivo sera eliminado de la base de datos

                        let contenedor_propietario = await datos_pagos_propietario(codigo_inmueble);
                        let pago_nuevo_propietario = contenedor_propietario.pago_nuevo_propietario;
                        let pago_nuevo_propietario_render =
                            contenedor_propietario.pago_nuevo_propietario_render;

                        //-----------------------------------------
                        // eliminamos el registro de pago del anterior propietario que se encontraba "pasivo"
                        await indiceInversiones.deleteOne({
                            codigo_inmueble: codigo_inmueble,
                        });
                        //-----------------------------------------

                        // el pago sera registrado como pago_tipo: remate
                        const nuevaInversion = new indiceInversiones({
                            codigo_terreno: inmuebleEncontrado.codigo_terreno,
                            codigo_proyecto: inmuebleEncontrado.codigo_proyecto,
                            codigo_inmueble: codigo_inmueble,
                            ci_propietario: ci_propietario,

                            estado_propietario: "activo", // porque desde esta opcion se guardan a los propietarios que seran activos del inmueble

                            pago_primer_bs: pago_nuevo_propietario,
                            pago_tipo: "remate",
                        });
                        await nuevaInversion.save(); // GUARDAMOS EL NUEVO REGISTRO

                        //-----------------------------------------------
                        // guardamos en el historial de acciones

                        var accion_administrador =
                            "guarda pago de propietario " +
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
                            pagado_render: pago_nuevo_propietario_render,
                            exito: "si",
                        });
                    }
                } else {
                    // significa que el inmueble no cuenta con ningun propietario

                    let contenedor_propietario = await datos_pagos_propietario(codigo_inmueble);
                    let pago_nuevo_propietario = contenedor_propietario.pago_nuevo_propietario;
                    let pago_nuevo_propietario_render =
                        contenedor_propietario.pago_nuevo_propietario_render;

                    // el pago sera registrado como pago_tipo: reserva
                    const nuevaInversion = new indiceInversiones({
                        codigo_terreno: inmuebleEncontrado.codigo_terreno,
                        codigo_proyecto: inmuebleEncontrado.codigo_proyecto,
                        codigo_inmueble: codigo_inmueble,
                        ci_propietario: ci_propietario,

                        estado_propietario: "activo", // porque desde esta opcion se guardan a los propietarios que seran activos del inmueble

                        pago_primer_bs: pago_nuevo_propietario,
                        pago_tipo: "reserva",
                    });
                    await nuevaInversion.save(); // GUARDAMOS EL NUEVO REGISTRO

                    //-----------------------------------------------
                    // guardamos en el historial de acciones

                    var accion_administrador =
                        "guarda pago de propietario " +
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
                        pagado_render: pago_nuevo_propietario_render,
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
    } catch (error) {
        console.log(error);
    }
};

//===========================================================================
//===========================================================================
// PARA GUARDAR VENTA DE FRACCIONES DE TERRENO A COPROPIETARIO

controladorAdministradorGeneral.guardarPagoCopropietarioTe = async (req, res) => {
    // "/laapirest/administracion/general/accion/guardar_pago_copropietario_te"
    try {
        var ci_propietario = req.body.ci_propietario;
        var codigo_terreno = req.body.codigo_terreno;
        var val_fracciones_te = req.body.val_fracciones_te; // Bs

        var arrayFraccVendidas = []; // por defecto
        var array_card_fracciones = []; // por defecto
        var f_val_propietario = 0; // por defecto

        var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

        if (acceso == "permitido") {
            let registro_fracciones = await indiceFraccionTerreno
                .find(
                    {
                        codigo_terreno: codigo_terreno,
                        disponible: true,
                    },
                    {
                        fraccion_bs: 1,
                        codigo_fraccion: 1,
                        _id: 0,
                    }
                )
                .sort({ orden: 1 }); // ordenado del menor al mayor

            let sum_varFraccion = 0; // por defecto
            if (registro_fracciones.length > 0) {
                for (let i = 0; i < registro_fracciones.length; i++) {
                    let fraccion_bs = registro_fracciones[i].fraccion_bs;
                    sum_varFraccion = sum_varFraccion + fraccion_bs;

                    if (sum_varFraccion <= val_fracciones_te) {
                        // almacenamiento de las fracciones de inmueble que seran vendidas al copropietario interesado
                        arrayFraccVendidas[i] = registro_fracciones[i].codigo_fraccion;
                    } else {
                        break; // salimos del bucle for
                    }
                }
            }

            if (sum_varFraccion === val_fracciones_te) {
                for (let i = 0; i < arrayFraccVendidas.length; i++) {
                    // se prodecera a vender las fracciones, respetando el orden de menor a mayor de las fracciones de inmueble disponibles
                    let codigo_fraccion = arrayFraccVendidas[i];

                    // "new Date()" nos devuelve la fecha actual
                    await indiceFraccionTerreno.updateOne(
                        { codigo_fraccion: codigo_fraccion },
                        {
                            $set: {
                                ci_propietario: ci_propietario,
                                disponible: false,
                                fecha_compra: new Date(),
                            },
                        }
                    ); // guardamos el registro con el datos modificados
                }

                //-----------------------------------------------
                // armado de las fracciones que seran renderizados en el navegador

                for (let i = 0; i < arrayFraccVendidas.length; i++) {
                    let codigo_fraccion = arrayFraccVendidas[i];
                    var paquete_fraccion = {
                        codigo_fraccion: codigo_fraccion,
                        ci_propietario: ci_propietario,
                        tipo_navegacion: "administrador", // porque estamos dentro de un controlador administrador
                    };
                    let card_fraccion_i = await fraccion_card_adm_cli(paquete_fraccion);
                    array_card_fracciones[i] = card_fraccion_i;
                }

                //-----------------------------------------------
                // valor actualizado de fracciones del cual es ahora dueño el propietario (considerando los que recientemente acaba de comprar)

                let propietario_fracciones = await indiceFraccionTerreno.find(
                    {
                        codigo_terreno: codigo_terreno,
                        ci_propietario: ci_propietario,
                        disponible: false,
                    },
                    {
                        fraccion_bs: 1,
                        _id: 0,
                    }
                );

                if (propietario_fracciones.length > 0) {
                    for (let j = 0; j < propietario_fracciones.length; j++) {
                        let fraccion_bs = propietario_fracciones[j].fraccion_bs;
                        f_val_propietario = f_val_propietario + fraccion_bs;
                    }
                }

                //-----------------------------------------------
                // guardamos en el historial de acciones

                var accion_administrador =
                    "COpropietario " +
                    ci_propietario +
                    " compra fracciones de terreno " +
                    codigo_terreno;

                var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                var aux_accion_adm = {
                    ci_administrador,
                    accion_administrador,
                };
                await guardarAccionAdministrador(aux_accion_adm);
                //-----------------------------------------------

                res.json({
                    array_card_fracciones,
                    val_fracciones_te,
                    f_val_propietario,
                    f_n_propietario: propietario_fracciones.length,
                    exito: "si",
                });
            } else {
                // fracciones disponibles insuficientes para vender al requerimiento del propietario
                res.json({
                    exito: "insuficiente",
                });
            }
        } else {
            // si es TRUE, significa que el proyecto esta BLOQUEADO
            res.json({
                exito: "denegado",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//===========================================================================
//===========================================================================
// PARA GUARDAR VENTA DE FRACCIONES DE INMUEBLE A COPROPIETARIO

controladorAdministradorGeneral.guardarPagoCopropietarioInm = async (req, res) => {
    // "/laapirest/administracion/general/accion/guardar_pago_copropietario_inm"
    try {
        var ci_propietario = req.body.ci_propietario;
        var codigo_inmueble = req.body.codigo_inmueble;
        var val_fracciones_inm = req.body.val_fracciones_inm; // Bs

        var arrayFraccVendidas = []; // por defecto
        var array_card_fracciones = []; // por defecto
        var f_val_propietario = 0; // por defecto

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
                let registro_fracciones = await indiceFraccionInmueble
                    .find(
                        {
                            codigo_inmueble: codigo_inmueble,
                            disponible: true,
                            tipo: "copropietario",
                        },
                        {
                            fraccion_bs: 1,
                            codigo_fraccion: 1,
                            _id: 0,
                        }
                    )
                    .sort({ orden: 1 }); // ordenado del menor al mayor

                let sum_varFraccion = 0; // por defecto
                if (registro_fracciones.length > 0) {
                    for (let i = 0; i < registro_fracciones.length; i++) {
                        let fraccion_bs = registro_fracciones[i].fraccion_bs;
                        sum_varFraccion = sum_varFraccion + fraccion_bs;

                        if (sum_varFraccion <= val_fracciones_inm) {
                            // almacenamiento de las fracciones de inmueble que seran vendidas al copropietario interesado
                            arrayFraccVendidas[i] = registro_fracciones[i].codigo_fraccion;
                        } else {
                            break; // salimos del bucle for
                        }
                    }
                }

                if (sum_varFraccion === val_fracciones_inm) {
                    for (let i = 0; i < arrayFraccVendidas.length; i++) {
                        // se prodecera a vender las fracciones, respetando el orden de menor a mayor de las fracciones de inmueble disponibles
                        let codigo_fraccion = arrayFraccVendidas[i];

                        // "new Date()" nos devuelve la fecha actual
                        await indiceFraccionInmueble.updateOne(
                            { codigo_fraccion: codigo_fraccion },
                            {
                                $set: {
                                    ci_propietario: ci_propietario,
                                    disponible: false,
                                    fecha_copropietario: new Date(),
                                },
                            }
                        ); // guardamos el registro con el datos modificados
                    }

                    //-----------------------------------------------
                    // armado de las fracciones que seran renderizados en el navegador

                    for (let i = 0; i < arrayFraccVendidas.length; i++) {
                        let codigo_fraccion = arrayFraccVendidas[i];
                        var paquete_fraccion = {
                            codigo_fraccion: codigo_fraccion,
                            ci_propietario: ci_propietario,
                            tipo_navegacion: "administrador", // porque estamos dentro de un controlador administrador
                        };
                        let card_fraccion_i = await fraccion_card_adm_cli(paquete_fraccion);
                        array_card_fracciones[i] = card_fraccion_i;
                    }

                    //-----------------------------------------------
                    // valor actualizado de fracciones del cual es ahora dueño el propietario (considerando los que recientemente acaba de comprar)

                    let propietario_fracciones = await indiceFraccionInmueble.find(
                        {
                            codigo_inmueble: codigo_inmueble,
                            ci_propietario: ci_propietario,
                            disponible: false,
                            tipo: "copropietario",
                        },
                        {
                            fraccion_bs: 1,
                            _id: 0,
                        }
                    );

                    if (propietario_fracciones.length > 0) {
                        for (let j = 0; j < propietario_fracciones.length; j++) {
                            let fraccion_bs = propietario_fracciones[j].fraccion_bs;
                            f_val_propietario = f_val_propietario + fraccion_bs;
                        }
                    }

                    //-----------------------------------------------
                    // guardamos en el historial de acciones

                    var accion_administrador =
                        "COpropietario " +
                        ci_propietario +
                        " compra fracciones de inmueble " +
                        codigo_inmueble;

                    var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
                    var aux_accion_adm = {
                        ci_administrador,
                        accion_administrador,
                    };
                    await guardarAccionAdministrador(aux_accion_adm);
                    //-----------------------------------------------

                    res.json({
                        array_card_fracciones,
                        val_fracciones_inm,
                        f_val_propietario,
                        f_n_propietario: propietario_fracciones.length,
                        exito: "si",
                    });
                } else {
                    // fracciones disponibles insuficientes para vender al requerimiento del propietario
                    res.json({
                        exito: "insuficiente",
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
    } catch (error) {
        console.log(error);
    }
};

//===========================================================================
//===========================================================================
// PARA ELIMINAR COPROPIETARIO DE LAS FRACCIONES DE TERRENO O FRACCIONES DE INMUEBLE
// solo son eliminados los datos que relaciona al copropietario con las fracciones. (No se eliminan los datos personales del copropietario)

controladorAdministradorGeneral.eliminarCopropietario = async (req, res) => {
    // post : "/laapirest/administracion/general/accion/eliminar_copropietario"

    try {
        var ci_propietario = req.body.ci_propietario;
        var codigo_objetivo = req.body.codigo_objetivo; // codigo_terreno o codigo_inmueble
        var clase = req.body.clase; // "inmueble" || "terreno"

        if (clase === "inmueble") {
            let codigo_inmueble = codigo_objetivo;
            let registroInmueble = await indiceInmueble.findOne(
                {
                    codigo_inmueble: codigo_inmueble,
                },
                {
                    codigo_terreno: 1,
                }
            );

            if (registroInmueble) {
                var codigo_terreno = registroInmueble.codigo_terreno;
            }
        } else {
            var codigo_terreno = codigo_objetivo;
        }

        var acceso = await verificadorTerrenoBloqueado(codigo_terreno);

        if (acceso == "permitido") {
            const storage = getStorage();

            //--------------------------------------------------------
            // ELIMINACION DE LOS DOCUMENTOS PRIVADOS

            if (clase === "inmueble") {
                var registroDocumentosPrivados = await indiceDocumentos.find({
                    codigo_inmueble: codigo_objetivo,
                    clase_documento: "Propietario",
                    ci_propietario: ci_propietario,
                });
            }

            if (clase === "terreno") {
                var registroDocumentosPrivados = await indiceDocumentos.find({
                    codigo_terreno: codigo_objetivo,
                    clase_documento: "Propietario",
                    ci_propietario: ci_propietario,
                });
            }

            if (registroDocumentosPrivados.length > 0) {
                // eliminamos los ARCHIVOS DOCUMENTOS PDF uno por uno (sean publicos o privados)
                for (let i = 0; i < registroDocumentosPrivados.length; i++) {
                    /*
                        let documentoNombreExtension =
                            registroDocumentosPrivados[i].codigo_documento + ".pdf";
                        // eliminamos el ARCHIVO DOCUMENTO DE LA CARPETA DONDE ESTA GUARDADA
                        await fs.unlink(
                            pache.resolve("./src/publico/subido/" + documentoNombreExtension)
                        ); // "+" es para concatenar
                        */

                    //--------------------------------------------------

                    //const storage = getStorage();

                    var nombre_y_ext = registroDocumentosPrivados[i].codigo_documento + ".pdf";

                    // para encontrar en la carpeta "subido" en firebase con el nombre y la extension de la imagen incluida
                    var direccionActualImagen = "subido/" + nombre_y_ext;

                    // Crear una referencia al archivo que se eliminará
                    var desertRef = ref(storage, direccionActualImagen);

                    // Eliminar el archivo y esperar la promesa
                    await deleteObject(desertRef);

                    // Archivo eliminado con éxito
                    //console.log("Archivo eliminado DE FIREBASE con éxito");

                    //--------------------------------------------------
                }
                // luego de eliminar todos los ARCHIVOS DOCUMENTO, procedemos a ELIMINARLO DE LA BASE DE DATOS. Esto para ahorrar espacio en el servidor

                if (clase === "inmueble") {
                    await indiceDocumentos.deleteMany({
                        codigo_inmueble: codigo_objetivo,
                        clase_documento: "Propietario",
                        ci_propietario: ci_propietario,
                    }); // "deleteMany" para que elimine TODOS los que coinciden con las condiciones
                }

                if (clase === "terreno") {
                    await indiceDocumentos.deleteMany({
                        codigo_terreno: codigo_objetivo,
                        clase_documento: "Propietario",
                        ci_propietario: ci_propietario,
                    }); // "deleteMany" para que elimine TODOS los que coinciden con las condiciones
                }
            }

            //----------------------------------------------------
            // eliminacion de los registros ci_propietario de las fracciones (no se eliminan las fracciones, solo ci_propietario)

            if (clase === "terreno") {
                var registrosFraccionesTe = await indiceFraccionTerreno.find({
                    codigo_terreno: codigo_objetivo,
                    ci_propietario: ci_propietario,
                    disponible: false,
                });

                if (registrosFraccionesTe.length > 0) {
                    // actualizaremos TODOS los documentos que coinciden con el filtro
                    await indiceFraccionTerreno.updateMany(
                        {
                            codigo_terreno: codigo_objetivo,
                            ci_propietario: ci_propietario,
                            disponible: false,
                        },
                        {
                            $set: {
                                disponible: true,
                                ci_propietario: "",
                                fecha_compra: null, // LIMPIA el valor del campo (NO LO ELIMINA)
                            },
                        }
                    );
                    // PARA fecha_compra no podria ponerse fecha_compra: "", porque fecha_compra esta definido en la base de datos como type: Date, es por eso que lo limpiamos usando fecha_compra: null
                }

                //-------------------------------------------------------
                // fracciones de terreno utilizados para adquirir fracciones de inmueble tipo "copropietario"

                let registrosFraccionesInm_a = await indiceFraccionInmueble.find(
                    {
                        codigo_terreno: codigo_objetivo,
                        ci_propietario: ci_propietario,
                        tipo: "copropietario",
                        disponible: false,
                    },
                    {
                        codigo_fraccion: 1,
                        codigo_inmueble: 1,
                        orden: 1,
                    }
                );

                if (registrosFraccionesInm_a.length > 0) {
                    for (let i = 0; i < registrosFraccionesInm_a.length; i++) {
                        let codigo_fraccion_i = registrosFraccionesInm_a[i].codigo_fraccion;
                        let codigo_original_i =
                            registrosFraccionesInm_a[i].codigo_inmueble +
                            registrosFraccionesInm_a[i].orden;

                        // actualizamos la fraccion devolviendole su codigo de fraccion inmueble original.
                        await indiceFraccionInmueble.updateOne(
                            { codigo_fraccion: codigo_fraccion_i },
                            {
                                $set: {
                                    codigo_fraccion: codigo_original_i,
                                    disponible: true,
                                    ci_propietario: "",
                                    fecha_copropietario: null, // LIMPIA el valor del campo (NO LO ELIMINA)
                                },
                            }
                        );
                    }
                }

                //--------------------------------------------------------
                // fracciones de terreno convertidos en fracciones de inmueble como tipo "inversionista"
                // ELIMINAMOS estos registros

                let registrosFraccionesInm_b = await indiceFraccionInmueble.find({
                    codigo_terreno: codigo_objetivo,
                    ci_propietario: ci_propietario,
                    tipo: "inversionista",
                });

                if (registrosFraccionesInm_b.length > 0) {
                    await indiceFraccionInmueble.deleteMany({
                        codigo_terreno: codigo_objetivo,
                        ci_propietario: ci_propietario,
                        tipo: "inversionista",
                    }); // "deleteMany" para que elimine TODOS los que coinciden con las condiciones
                }
            } // FIN CLASE TERRENO

            if (clase === "inmueble") {
                
                //-------------------------------------------------------
                // fracciones de inmueble del tipo "copropietario"

                let registrosFraccionesInm_a = await indiceFraccionInmueble.find(
                    {
                        codigo_inmueble: codigo_objetivo,
                        ci_propietario: ci_propietario,
                        tipo: "copropietario",
                        disponible: false,
                    },
                    {
                        codigo_fraccion: 1,
                        codigo_inmueble: 1,
                        orden: 1,
                    }
                );

                if (registrosFraccionesInm_a.length > 0) {
                    for (let i = 0; i < registrosFraccionesInm_a.length; i++) {
                        let codigo_fraccion_i = registrosFraccionesInm_a[i].codigo_fraccion;
                        let codigo_original_i =
                            registrosFraccionesInm_a[i].codigo_inmueble +
                            registrosFraccionesInm_a[i].orden;

                        // actualizamos la fraccion devolviendole su codigo de fraccion inmueble original. PARA ESTE CASO NO ES NECESARIO, PERO SE LO HACE SOLO POR PRECAUSION
                        await indiceFraccionInmueble.updateOne(
                            { codigo_fraccion: codigo_fraccion_i },
                            {
                                $set: {
                                    codigo_fraccion: codigo_original_i,
                                    disponible: true,
                                    ci_propietario: "",
                                    fecha_copropietario: null, // LIMPIA el valor del campo (NO LO ELIMINA)
                                },
                            }
                        );
                    }
                }

                //--------------------------------------------------------
                // NO EXISTEN FRACCIONES DE INMUEBLE DEL TIPO "inversionista", porque esto solo corresponde a fracciones de terreno

                
            } // FIN CLASE INMUEBLE

            //------------------------------------------------------------------
            // guardamos en el historial de acciones
            var ci_administrador = req.user.ci_administrador; // extraido de la SESION guardada del administrador
            var accion_administrador =
                "El COpropietario: " +
                ci_propietario +
                " de " + clase + ": "
                codigo_objetivo +
                " fue eliminado";
            var aux_accion_adm = {
                ci_administrador,
                accion_administrador,
            };
            await guardarAccionAdministrador(aux_accion_adm);
            //-------------------------------------------------------------------

            res.json({
                exito: "si",
            });

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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = controladorAdministradorGeneral;
