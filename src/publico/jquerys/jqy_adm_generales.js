// GENERALES DEL LADO DE ADMINISTRADOR, PUEDEN ENCONTRARSE UTILES PARA: TERRENO, PROYECTO, INMUEBLE, PROPIETARIO

/************************************************************************************* */
// SELECTOR DE CIUDAD, PERTENECE A "TERRENO"
$("#selector_ciudad").change(function () {
    var $seleccionado = $(this);
    var ciudad = $seleccionado.val();

    $("#ciudad_elegida").val(ciudad); // para el hidden
    $("#label_ciudad").text(ciudad);

    if (ciudad == "Cochabamba") {
        var bandera_ciudad = "cochabamba.png";
    }
    if (ciudad == "Chuquisaca") {
        var bandera_ciudad = "chuquisaca.png";
    }
    if (ciudad == "Beni") {
        var bandera_ciudad = "beni.png";
    }
    if (ciudad == "La Paz") {
        var bandera_ciudad = "la-paz.png";
    }
    if (ciudad == "Oruro") {
        var bandera_ciudad = "oruro.png";
    }
    if (ciudad == "Pando") {
        var bandera_ciudad = "pando.png";
    }
    if (ciudad == "Potosí") {
        var bandera_ciudad = "potosi.png";
    }
    if (ciudad == "Santa Cruz") {
        var bandera_ciudad = "santa-cruz.png";
    }
    if (ciudad == "Tarija") {
        var bandera_ciudad = "tarija.png";
    }

    //var bandera_ciudad = $seleccionado.attr("data-bandera_ciudad");
    $("#bandera_ciudad_elegida").val(bandera_ciudad); // para el hidden
});
/************************************************************************************* */
// PARA SELECCION DE RADIOS MAESTRO VALIDO PARA TODOS
$(".gral_radio").click(function (e) {
    var valorRadioSeleccinado = $(this).val();
    var data_radio = $(this).attr("data-radio_input");
    $("." + data_radio).val(valorRadioSeleccinado);
});
/************************************************************************************* */

function format(val_input) {
    //var key = e.keyCode ? e.keyCode : e.which;

    // desde el equipo se puede ingresar numero desde fila numeros (que son numeros keyCode[48-57])
    // o desde la parte de teclado de numeros (que son "numpad" keyCode[96-105])

    /*
    if ((key > 47 && key < 58) || (key > 95 && key < 106)) {

        var contenido = val_input.value;

        // verificamos si el numero ya cuenta con "como decimal", esto para evitar ingresar varias "comas"
        var numComas = palabra.match(/,/g).length;
        if (numComas > 0) {
            var auxArray = contenido.toString().split(',')
        } else {

        };






    } else {
        // revidamos si es un "coma como separador de decimales"
        if (key == 188) {

        };
    };
*/

    var num = val_input.value.replace(/\./g, ""); // aqui elimina los PUNTOS (si es que lo hubiesen)
    if (!isNaN(num)) {
        num = num
            .toString()
            .split("")
            .reverse()
            .join("")
            .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
        num = num.split("").reverse().join("").replace(/^[\.]/, "");
        val_input.value = num;
    } else {
        //alert('Solo se permiten numeros');
        // despues de aceptar el cuadro mensaje
        val_input.value = val_input.value.replace(/[^\d\.]*/g, ""); // borra el ultimo caracter introducido
    }

    // CODIGO ORIGINAL DEL POST
    // EN EL JAVASCRIPT
    //var num = input.value.replace(/\./g, '');
    //if (!isNaN(num)) {
    //num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    //num = num.split('').reverse().join('').replace(/^[\.]/, '');
    //input.value = num;
    //} else {
    //alert('Solo se permiten numeros');
    //input.value = input.value.replace(/[^\d\.]*/g, '');
    //}

    // EN EL HTML
    /*
    <form>
    <input type="text" onkeyup="format(this)" onchange="format(this)">
    </form>
    */

    /*
    isNaN es una función de alto nivel y no está asociada a ningún objeto. isNaN intenta convertir el parámetro pasado a un número. Si el parámetro no se puede convertir, devuelve true; en caso contrario, devuelve false. Esta función es útil ya que el valor NaN no puede se probado correctamente con operadores de igualdad.
    
    */
}

/////////////////

// PARA LA BARRA DE NAVEGACIÓN Y ADMINISTRADORES DEL SISTEMA

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#form-acceso-administrador").on("submit", function (e) {
    e.preventDefault(); // para impedir el acceso a la ruta url por defecto
    let idUsuario = $("#id_usuario").val();
    let idClave = $("#id_clave").val();

    // VERIFICACION QUE LOS DATOS INTRODUCIDOS NO SEAN VACIOS

    if (idUsuario != "" || idClave != "") {
        let paquete_datos = {
            usuario: idUsuario,
            clave: idClave,
        };

        $.ajax({
            url: "/laapirest/verificarclavesadm",
            type: "POST",
            data: paquete_datos,
        }).done(function (respuestaServidor) {
            // si los datos son incorrectos, entonces se procedera a mostrar su respectiva respuesta

            var tipo_respuesta = respuestaServidor.tipo;

            if (tipo_respuesta == "incorrecto") {
                // se creara el mensaje que se mostrara, despues del boton de "Ingresar"

                // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "acceso_principal"

                $("#acceso_principal").after(
                    // usando acento grave y el ${} para las partes que deven cambiar

                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Datos incorrectos</strong>
                        </div>`
                );
            }

            if (tipo_respuesta == "maestro") {
                // si es el codigo GENERADO inicio del administrador MAESTRO
                let auxUsuario = respuestaServidor.maeUsuario;
                let auxClave = respuestaServidor.maeClave;

                // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "acceso_principal"

                $("#acceso_principal").after(
                    // usando acento grave y el ${} para las partes que deven cambiar

                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Claves maestras:</strong>
                            <br>
                            Usuario: <strong>${auxUsuario}</strong>
                            <br>
                            Clave: <strong>${auxClave}</strong>
                        </div>`
                );
            }

            if (tipo_respuesta == "correcto") {
                $("#id_formulario_acceso").submit();
            }
        });
    } else {
        // si los datos estan vacios

        // agregamos los mensajes ALERT DESPUES y al MISMO NIVEL del boton id "acceso_principal"
        $("#acceso_principal").after(
            // usando acento grave y el ${} para las partes que deven cambiar

            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Llene los campos</strong>
            </div>`
        );
    }
});

//*************************************************************************************** */
// PARA SUBIR IMAGEN EN "TERRENO, PROYECTO" (incluye para subir imagenes de responsabilidad social) y para subir imagenes de "EMPRESA COMO FUNCIONA" Y "QUIENES SOMOS"

$("#idSubirImagen").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO

    $(".alert").remove(); // por seguridad borramos todos los alert

    // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
    $(".ref_subir_img").after(
        `<div class="alert alert-warning mt-3">
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
            <strong>Espere, imagen subiendose...!</strong>
        </div>`
    );

    var datosFormulario = new FormData(document.getElementById("idSubirImagen"));

    var tipo_objetivo = $("#tipo_objetivo").val();
    var tipo_py_rs = $("#tipo_py_rs").val();
    // viendo si se trata de imagen de TERRENO o PROYECTO, se armara la ruta a seguir

    $.ajax({
        type: "post",
        //url: rutaServidor,
        url: "/laapirest/administracion/general/accion/subir_imagen",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            var url = respuestaServidor.url; // TODAS LAS IMAGENES SUBIDAS CUENTAN CON ESTA PROPIEDAD

            if (tipo_objetivo == "empresa_somos" || tipo_objetivo == "empresa_funciona") {
                // si la imagen fue guardada en el servidor
                // extraemos los datos
                var codigo_imagen = respuestaServidor.codigoImagen;
                var titulo_imagen = respuestaServidor.titulo_imagen;
                var texto_imagen = respuestaServidor.texto_imagen;
                var orden_imagen = respuestaServidor.orden_imagen;

                var extension_imagen = respuestaServidor.extensionImagen;
            } else {
                // si la imagen fue guardada en el servidor
                // extraemos los datos
                var codigo_imagen = respuestaServidor.codigoImagen;
                var nombre_imagen = respuestaServidor.nombreImagen;
                var extension_imagen = respuestaServidor.extensionImagen;
            }

            // para EMPRESA, tanto para su parte: QUIENES SOMOS y COMO FUNCIONA
            if (tipo_objetivo == "empresa_somos" || tipo_objetivo == "empresa_funciona") {
                // con AFTER lO Agregamos despues del titulo y al mismo nivel que este (no como hijo)

                $(".ref_titulo_imagen").after(
                    // usando acento grave y el ${} para las partes que deven cambiar

                    `<div class="cuadro_contenedor_imagen imagenes mb-3 col-12 col-sm-6 col-md-4 col-lg-3">
                    <div class="card">
    
                        <div class="card-header p-0">
                            <div class="d-flex justify-content-between p-0 m-0">
    
                                <div class="align-self-center py-2 ml-2 text-primary">
                                    <h6>${orden_imagen}</h6>
                                </div>

                                <div class="align-self-center py-2 text-primary">
                                    <h6>${codigo_imagen}</h6>
                                </div>
    
                                <div
                                    class="boton_eliminar_imagen_jquery text-center ir_rojo align-self-center border-left mr-2"
                                    data-id="${codigo_imagen}"
                                    style="color: red;"
                                >
                                    <i class="fas fa-window-close py-1" style="font-size: 2em;"></i>
                                </div>
    
                            </div>
                        </div>
    
                        <div class="card-body">
                            <img
                                src="${url}"
                                alt="${orden_imagen}"
                                title="${orden_imagen}"
                                class="estilo_imagen card-img-top"
                                loading="lazy"
                            />
                            <h5 class="text-center mt-2">${titulo_imagen}</h5>
                            <p class="mt-2">${texto_imagen}</p>
    
                        </div>

                        <div class="card-footer">
                        </div>

                    </div>
                </div>`
                );
            }

            if (tipo_objetivo == "terreno") {
                var codigo_terreno = $(".input_codigo_terreno").val();
                // con AFTER lO Agregamos despues del titulo y al mismo nivel que este (no como hijo)
                $(".ref_titulo_imagen_te_exclusivas").after(
                    // usando acento grave y el ${} para las partes que deven cambiar

                    `<div class="cuadro_contenedor_imagen imagenes mb-3 col-12 col-sm-6 col-md-4 col-lg-3">
                        <div class="card">

                            <div class="card-header p-0">
                                <div class="d-flex p-0 m-0">

                                    <div class="align-self-center w-75 py-2 ml-2 text-primary">
                                        <h6>${nombre_imagen}</h6>
                                    </div>

                                    <div class="boton_eliminar_imagen_jquery text-center ir_rojo  w-25 align-self-center border-left"
                                        data-id="${codigo_imagen}" style="color: red;">
                                        <i class="fas fa-window-close py-1" style="font-size: 2em;"></i>
                                    </div>

                                </div>
                            </div>

                            <div class="card-body">
                                <img src="${url}" alt="${nombre_imagen}"
                                    title="${codigo_imagen}" class="estilo_imagen card-img-top" loading="lazy">
                            </div>

                            <div class="card-footer">
                                <button
                                    class="selec_deselec_imagen_principal_te btn boton-primario mb-2"
                                    data-id="${codigo_imagen}/${codigo_terreno}"
                                >Principal</button>
                            </div>

                        </div>
                    </div>`
                );
            }

            if (tipo_objetivo == "proyecto") {
                var codigo_proyecto = $(".input_codigo_proyecto").val();
                if (tipo_py_rs == "py") {
                    // con AFTER lO Agregamos despues del titulo y al mismo nivel que este (no como hijo)
                    $(".contenedor_titulo_imagenes_otras").after(
                        // usando acento grave y el ${} para las partes que deven cambiar

                        `<div class="cuadro_contenedor_imagen mb-3 col-12 col-sm-6 col-md-4 col-lg-3">
                            <div class="card">

                                <div class="card-header p-0">
                                    <div class="d-flex p-0 m-0">

                                        <div class="align-self-center w-75 py-2 ml-2 text-primary">
                                            <h6>${nombre_imagen}</h6>
                                        </div>

                                        <div class="boton_eliminar_imagen_jquery text-center ir_rojo text-danger w-25 align-self-center border-left"
                                            data-id="${codigo_imagen}">
                                            <i class="fas fa-window-close py-1" style="font-size: 2em;"></i>
                                        </div>

                                    </div>
                                </div>

                                <img src="${url}"
                                    alt="${nombre_imagen}" title="${codigo_imagen}"
                                    class="estilo_imagen card-img-top" loading="lazy">
                                <div class="card-body">

                                    <button class="boton_seleccionar_deseleccionar_imagen_jquery btn btn-success mb-2"
                                        data-id="${codigo_imagen}/${codigo_proyecto}">Exclusiva</button>

                                    <button class="selec_deselec_imagen_principal btn boton-primario mb-2"
                                        data-id="${codigo_imagen}/${codigo_proyecto}">Principal</button>
                                </div>
                            </div>
                        </div>`
                    );
                }

                if (tipo_py_rs == "py_rs") {
                    $(".ref_titulo_imagen").after(
                        // usando acento grave y el ${} para las partes que deven cambiar

                        `<div class="cuadro_contenedor_imagen imagenes mb-3 col-12 col-sm-6 col-md-4 col-lg-3">
                            <div class="card">
    
                                <div class="card-header p-0">
                                    <div class="d-flex p-0 m-0">
    
                                        <div class="align-self-center w-75 py-2 ml-2 text-primary">
                                            <h6>${nombre_imagen}</h6>
                                        </div>
    
                                        <div class="boton_eliminar_imagen_jquery text-center ir_rojo  w-25 align-self-center border-left"
                                            data-id="${codigo_imagen}" style="color: red;">
                                            <i class="fas fa-window-close py-1" style="font-size: 2em;"></i>
                                        </div>
    
                                    </div>
                                </div>
    
                                <div class="card-body">
                                    <img src="${url}" alt="${nombre_imagen}"
                                        title="${codigo_imagen}" class="estilo_imagen card-img-top" loading="lazy">
    
                                </div>
                            </div>
                        </div>`
                    );
                }
            }

            $(".alert").remove(); // por seguridad borramos todos los alert

            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_img").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Imagen subida!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // si la imagen no fue guardada, entonces procedemos a mostrar la respuesta del servidor
            //alert(respuestaServidor.mensaje);
            // aunque desde el servido viene como respuesta un "mensaje", aqui lo escribimos manualmente (el mismo mensaje que el de servidor)

            $(".alert").remove(); // por seguridad borramos todos los alert

            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_img").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Solo imagenes estan permitidos!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            $(".alert").remove(); // por seguridad borramos todos los alert

            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_img").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No es posible subir la imagen porque existe bloqueo administrativo desde terreno!</strong>
                </div>`
            );
        }

        // borramos los datos anteriores de los inputs de la imagen nueva subida
        $("#id_input_subir_imagen").val("");
        if (tipo_objetivo == "empresa_somos" || tipo_objetivo == "empresa_funciona") {
            $("#id_orden_imagen").val("");
            $("#id_texto_imagen").val("");
            $("#id_titulo_imagen").val("");
        } else {
            $("#id_titulo_imagen").val("");
        }

        // para la casilla check de "Requerimientos" si es que existiese
        if ($("#id_check_requerimiento").length > 0) {
            // dejamos este check en su estano natural que es el de estar deseleccionado
            let seleccionado = $("#id_check_requerimiento").attr("data-seleccionado");
            if (seleccionado == "si") {
                // entonces lo deseleccionamos haciendo click en este check
                $("#id_check_requerimiento").click();
            }
        }
    });
});

//---------------------------------------
// seleccion de casilla requerimiento en la subida de imagenes de "empresa funciona"
$("#id_check_requerimiento").click(function (e) {
    let tipo_seleccionado = $(this).attr("data-seleccionado");
    if (tipo_seleccionado == "no") {
        $(this).attr("data-seleccionado", "si");
    }
    if (tipo_seleccionado == "si") {
        $(this).attr("data-seleccionado", "no");
    }
});

/**************************************************************************** */
// PARA ELIMINAR UNA IMAGEN ESPECIFICA, PERTENECE A "TERRENO, PROYECTO, ADMINISTRADOR, SISTEMA"

// esta instruccion con "on", permite eliminar cualquier imagen seleccionada, incluso aquellas que se subieron e inmediatamente se desea eliminarlas
$(".contenedor_imagenes_subidas").on("click", ".boton_eliminar_imagen_jquery", function () {
    // note que ".contenedor_imagenes_subidas" ES EL CONTENEDOR PADRE QUE CONTIENE A TODAS LAS IMAGENES DEL PROYECTO (SEAN EXCLUSIVAS DE ESTA O SEAN OTRAS)

    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    //e.preventDefault(); // Cancelamos el evento por defecto del elemento

    let objetivo_tipo = $("#id_objetivo_tipo").attr("data-objetivo_tipo");

    let $botonEliminarImagen = $(this); // capturamos el elemento boton eliminador de imagen y lo guardamos en "$botonEliminarImagen" (podemos no usarlo con "$", pero como estamos en jquery, lo usamos por buenas practicas de programacion)

    // mostramos al usuario en su navegador un mensaje de confirmacion para eliminar la imagen, si el usuario da un click en "aceptar" entonces sera un "true", pero si hace click en "cancelar" o cierra la ventana del mensaje, entonces sera un "false". La respuesta la guardamos en una constante al que llamaremos "respuestaEliminar"
    const respuestaEliminar = confirm("¿Desea eliminar la imagen?");

    // si la respuesta es "true"
    if (respuestaEliminar) {
        let codigo_imagen = $botonEliminarImagen.attr("data-id");

        //  "/laapirest/administracion/general/accion/eliminar_imagen/:objetivo_tipo/:codigo_imagen"
        $.ajax({
            url:
                "/laapirest/administracion/general/accion/eliminar_imagen/" +
                objetivo_tipo +
                "/" +
                codigo_imagen,
            type: "DELETE",
        })

            // la respusta del servidor la guardamos en "respuestaServidorEliminarImagen" (que sera el parametro que recibira la funcion)
            .done(function (respuestaServidorEliminarImagen) {
                var laRespuesta = respuestaServidorEliminarImagen.exito;

                if (laRespuesta == "si") {
                    // Contamos todas las imagenes que existen en la ventana, contamos las que son exclusivas del proyecto y las que no las son
                    var numeroElementos = $(".cuadro_contenedor_imagen").length;

                    //console.log("vemos el numero de elementos imagenes TOTALES");
                    //console.log(numeroElementos);

                    for (let i = 0; i < numeroElementos; i++) {
                        let codigoImagenFor = $(
                            ".cuadro_contenedor_imagen .card .card-header .boton_eliminar_imagen_jquery"
                        )
                            .eq(i)
                            .attr("data-id");

                        if (codigoImagenFor === codigo_imagen) {
                            // (OJO que para imagenes de sistema en codigo_imagen esta el tipo de imagen, ej/ cabecera_convocatoria)
                            // si se encuentra la imagen a eliminar, entonces eliminamos todo su contenedor con REMOVE
                            $(".cuadro_contenedor_imagen").eq(i).remove();

                            break; // una vez encontrado la imagen deseada, salimos del bucle "for"
                        }
                    }
                }

                if (laRespuesta == "no") {
                    // entonces se procedera a mostrar el mensaje de error, y la imagen no sera eliminada
                    alert(respuestaServidorEliminarImagen.mensaje);
                }

                if (laRespuesta == "denegado") {
                    alert(
                        "No es posible eliminar la imagen porque existe bloqueo administrativo desde terreno"
                    );
                }
            });
    }
});

/************************************************************************************* */
/************************************************************************************* */

// PARA SELECCIONAR o deseleccionar UNA IMAGEN ESPECIFICA QUE SERA O DEJARA SE SER LA IMAGEN PRINCIPAL DEL PROYECTO / INMUEBLE

// SI SE DESELECCIONA, ENTONCES LA IMAGEN PASARA A FORMAR A LA CATEGORIA DE "IMAGENES OTRAS"

$(".contenedor_imagenes_subidas").on("click", ".selec_deselec_imagen_principal", function () {
    // note que ".contenedor_imagenes_subidas" ES EL CONTENEDOR PADRE QUE CONTIENE A TODAS LAS IMAGENES DEL PROYECTO (SEA PRINCIPAL O SEAN EXCLUSIVAS DE ESTA O SEAN OTRAS)

    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    //e.preventDefault(); // Cancelamos el evento por defecto del elemento

    let $botonSeleccionarImagen = $(this); // capturamos el elemento boton seleccionador de imagen y lo guardamos en "$botonSeleccionarImagen" (podemos no usarlo con "$", pero como estamos en jquery, lo usamos por buenas practicas de programacion)

    // el "id-data" contiene el siguiente arreglo: codigoImagen/codigoInmuebleProyecto que lo guardaremos en la let "dataID"
    // "codigoInmuebleProyecto" puede ser el codigo del proyecto o de un inmueble especifico
    let dataID = $botonSeleccionarImagen.data("id");

    var auxArray = dataID.split("/");

    let codigoImagen = auxArray[0];
    let codigoInmuebleProyecto = auxArray[1];

    // revisamos si existe una imagen ya como "IMAGEN PRINCIPAL"

    var numeroImagenesPrincipales = $(".la_imagen_principal").length; // es obvio que a lo sumo solo existira una IMAGEN PRINCIPAL

    //console.log("vemos el numero de elementos IMAGENES PRINCIPALES");
    //console.log(numeroImagenesPrincipales);

    if (numeroImagenesPrincipales != 0) {
        // como a los sumo solo existira UNA imagen principal, es por eso que bastara con "eq(0)"
        let elDataId = $(".la_imagen_principal .card .card-body .selec_deselec_imagen_principal")
            .eq(0)
            .attr("data-id");

        var auxArray2 = elDataId.split("/");

        var auxImagenPrincipalPrevio = auxArray2[0];

        if (auxImagenPrincipalPrevio != codigoImagen) {
            // si existe una imagen principal PREVIO, y su codigo es diferente al codigo de la imagen al que se le hizo click en el boton "principal", entonces ESTA IMAGEN PRINCIPAL PREVIO debe ser REEMPLAZADO por la nueva imagen "codigoImagen"
            var codigoImagenPrincipalPrevio = auxImagenPrincipalPrevio;

            var caso = "reemplazar";
        } else {
            // si existe una imagen principal PREVIO y es la misma sobre la que se hizo click, significa que esta imagen PRINCIPAL AHORA sera movida de "imagen principal" a "imagen otros"
            var codigoImagenPrincipalPrevio = "";

            var caso = "mismo";
        }
    } else {
        var codigoImagenPrincipalPrevio = ""; // si no existe imagen principal previo, se lo dejara vacio

        var caso = "nuevo";
    }

    //console.log("vemos el codigo de la IMAGEN PRINCIPAL PREVIO");
    //console.log(codigoImagenPrincipalPrevio);

    var paqueteDatos = {
        imagen_principal_previo: codigoImagenPrincipalPrevio,
        tipo_caso: caso,
    };

    // enviamos a la ruta del servidor, para que realice los tratamintos respectivos

    $.ajax({
        // "/laapirest/administracion/general/accion/sel_desel_img_principal/:codigo_imagen/:codigo_proyecto_inmueble"
        url:
            "/laapirest/administracion/general/accion/sel_desel_img_principal/" +
            codigoImagen +
            "/" +
            codigoInmuebleProyecto,
        type: "POST",
        data: paqueteDatos,
    })

        // la respusta del servidor la guardamos en "respuestaServidor", con esta respuesta daremos estilo y modificaremos la interfaz del navegador
        .done(function (respuestaServidor) {
            /****** Para verificación **********/
            //console.log("vemos el valor de la respuesta del servidor");
            //console.log(respuestaServidor.exito);

            if (respuestaServidor.exito == "si") {
                if (caso == "reemplazar") {
                    // la imagen que era principal, ahora pasara a la categoria de "otras" y la imagen sobre la que se hizo click en "principal", ahora pasara a ser la nueva "imagen principal"

                    // detectamos a la que actualmente ocupa el lugar de "imagen principal" y la enviamos a la categoria de "otros", despues del titulo de "contenedor_titulo_imagenes_otras"
                    $(".contenedor_titulo_imagenes_otras").after($(".la_imagen_principal"));

                    // ahora quitamos esa clase de "la_imagen_principal" y asi solo se quedara con la clase "cuadro_contenedor_imagen"
                    $(".la_imagen_principal").removeClass("la_imagen_principal");

                    // ------------------------------------------------
                    // identificamos la posicion que tiene la imagen sobre la que se hizo click en "principal"

                    var posicionImagenClick = buscaPosicionImagen();

                    // ------------------------------------------------

                    // le agregamos la clase de "la_imagen_principal"
                    $(".cuadro_contenedor_imagen")
                        .eq(posicionImagenClick)
                        .addClass("la_imagen_principal");

                    // ahora llevamos como nueva imagen principal a la imagen sobre la que se hizo click en "principal"
                    $(".contenedor_titulo_imagen_principal").after(
                        $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                    );
                }

                if (caso == "mismo") {
                    // la imagen sobre la que se hizo click en "principal" es la actual "imagen principal", ahora dejara de ser principal para ser "imagen otras".

                    // ------------------------------------------------
                    // identificamos la posicion que tiene la imagen sobre la que se hizo click en "principal"

                    var posicionImagenClick = buscaPosicionImagen();

                    // ------------------------------------------------

                    // ahora quitamos esa clase de "la_imagen_principal" y asi solo se quedara con la clase "cuadro_contenedor_imagen"
                    $(".cuadro_contenedor_imagen")
                        .eq(posicionImagenClick)
                        .removeClass("la_imagen_principal");

                    // ahora llevamos como "imagen otras" a la imagen sobre la que se hizo click en "principal"
                    $(".contenedor_titulo_imagenes_otras").after(
                        $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                    );
                }

                if (caso == "nuevo") {
                    // significa que no existe de momento "imagen principal", asi que la imagen sobre la que se hizo click, pasara a formar como "imagen principal"

                    // ------------------------------------------------
                    // identificamos la posicion que tiene la imagen sobre la que se hizo click en "principal"

                    var posicionImagenClick = buscaPosicionImagen();

                    // ------------------------------------------------

                    // le agregamos la clase de "la_imagen_principal"
                    $(".cuadro_contenedor_imagen")
                        .eq(posicionImagenClick)
                        .addClass("la_imagen_principal");

                    // ahora llevamos como nueva imagen principal a la imagen sobre la que se hizo click en "principal"
                    $(".contenedor_titulo_imagen_principal").after(
                        $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                    );
                }
            } else {
                var mensaje = respuestaServidor.mensaje;
                if (respuestaServidor.exito == "no") {
                    alert(mensaje);
                }

                if (respuestaServidor.exito == "denegado") {
                    alert(mensaje);
                }
            }

            function buscaPosicionImagen() {
                var numeroElementos = $(".cuadro_contenedor_imagen").length;

                //console.log("vemos el numero de elementos imagenes TOTALES");
                //console.log(numeroElementos);

                for (let i = 0; i < numeroElementos; i++) {
                    let elDataId = $(
                        ".cuadro_contenedor_imagen .card .card-body .selec_deselec_imagen_principal"
                    )
                        .eq(i)
                        .attr("data-id");

                    //elDataId = $('.cuadro_contenedor_imagen .contenedor_boton_imagen .selec_deselec_imagen_principal').eq(i).attr('data-id');

                    let auxArray2 = elDataId.split("/");

                    let codigoImagenFor = auxArray2[0];

                    if (codigoImagenFor === codigoImagen) {
                        var posicImagClick = i;

                        break; // una vez encontrado la imagen deseada, salimos del bucle "for"
                    }
                }

                //console.log("retornamos la posicion de la imagen click");
                //console.log(posicImagClick);
                // ahra retornamos pocicion de la imagen sobre la que se hizo click
                return posicImagClick;
            }
        });
});
/************************************************************************************* */
/************************************************************************************* */

// PARA SELECCIONAR o deseleccionar UNA IMAGEN ESPECIFICA QUE SERA O DEJARA SE SER LA IMAGEN PRINCIPAL DEL TERRENO

// SI SE DESELECCIONA, ENTONCES LA IMAGEN PASARA A FORMAR A LA CATEGORIA DE "IMAGENES OTRAS"

$(".contenedor_imagenes_subidas").on("click", ".selec_deselec_imagen_principal_te", function () {
    // note que ".contenedor_imagenes_subidas" ES EL CONTENEDOR PADRE QUE CONTIENE A TODAS LAS IMAGENES DEL TERRENO (SEA PRINCIPAL O SEAN EXCLUSIVAS DE ESTA)

    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    //e.preventDefault(); // Cancelamos el evento por defecto del elemento

    let $botonSeleccionarImagen = $(this); // capturamos el elemento boton seleccionador de imagen y lo guardamos en "$botonSeleccionarImagen" (podemos no usarlo con "$", pero como estamos en jquery, lo usamos por buenas practicas de programacion)

    // el "id-data" contiene el siguiente arreglo: codigoImagen/codigoTerreno que lo guardaremos en la let "dataID"
    // "codigoTerreno" es el codigo del terreno
    let dataID = $botonSeleccionarImagen.data("id");

    var auxArray = dataID.split("/");

    let codigoImagen = auxArray[0];
    let codigoTerreno = auxArray[1];

    // revisamos si existe una imagen ya como "IMAGEN PRINCIPAL"

    var numeroImagenesPrincipales = $(".la_imagen_principal").length; // es obvio que a lo sumo solo existira una IMAGEN PRINCIPAL

    //console.log("vemos el numero de elementos IMAGENES PRINCIPALES");
    //console.log(numeroImagenesPrincipales);

    if (numeroImagenesPrincipales != 0) {
        // como a los sumo solo existira UNA imagen principal, es por eso que bastara con "eq(0)"
        let elDataId = $(
            ".la_imagen_principal .card .card-footer .selec_deselec_imagen_principal_te"
        )
            .eq(0)
            .attr("data-id");

        var auxArray2 = elDataId.split("/");

        var auxImagenPrincipalPrevio = auxArray2[0];

        if (auxImagenPrincipalPrevio != codigoImagen) {
            // si existe una imagen principal PREVIO, y su codigo es diferente al codigo de la imagen al que se le hizo click en el boton "principal", entonces ESTA IMAGEN PRINCIPAL PREVIO debe ser REEMPLAZADO por la nueva imagen "codigoImagen"
            var codigoImagenPrincipalPrevio = auxImagenPrincipalPrevio;

            var caso = "reemplazar";
        } else {
            // si existe una imagen principal PREVIO y es la misma sobre la que se hizo click, significa que esta imagen PRINCIPAL AHORA sera movida de "imagen principal" a "imagen otros"
            var codigoImagenPrincipalPrevio = "";

            var caso = "mismo";
        }
    } else {
        var codigoImagenPrincipalPrevio = ""; // si no existe imagen principal previo, se lo dejara vacio

        var caso = "nuevo";
    }

    //console.log("vemos el codigo de la IMAGEN PRINCIPAL PREVIO");
    //console.log(codigoImagenPrincipalPrevio);

    var paqueteDatos = {
        imagen_principal_previo: codigoImagenPrincipalPrevio,
        tipo_caso: caso,
    };

    // enviamos a la ruta del servidor, para que realice los tratamintos respectivos

    $.ajax({
        // "/laapirest/administracion/general/accion/sel_desel_img_principal_te/:codigo_imagen/:codigo_terreno"
        url:
            "/laapirest/administracion/general/accion/sel_desel_img_principal_te/" +
            codigoImagen +
            "/" +
            codigoTerreno,
        type: "POST",
        data: paqueteDatos,
    })

        // la respuesta del servidor la guardamos en "respuestaServidor", con esta respuesta daremos estilo y modificaremos la interfaz del navegador
        .done(function (respuestaServidor) {
            /****** Para verificación **********/
            //console.log("vemos el valor de la respuesta del servidor");
            //console.log(respuestaServidor.exito);

            if (respuestaServidor.exito == "si") {
                ////---//  ME QUEDE AQUI  //----
                if (caso == "reemplazar") {
                    // la imagen que era principal, ahora pasara a la categoria de "imagenes exclusivas" y la imagen sobre la que se hizo click en "principal", ahora pasara a ser la nueva "imagen principal"

                    // detectamos a la que actualmente ocupa el lugar de "imagen principal" y la enviamos a la categoria de "imagenes exclusivas", despues del titulo de "ref_titulo_imagen_te_exclusivas"
                    $(".ref_titulo_imagen_te_exclusivas").after($(".la_imagen_principal"));

                    // ahora quitamos esa clase de "la_imagen_principal" y asi solo se quedara con la clase "cuadro_contenedor_imagen"
                    $(".la_imagen_principal").removeClass("la_imagen_principal");

                    // ------------------------------------------------
                    // identificamos la posicion que tiene la imagen sobre la que se hizo click en "principal"

                    var posicionImagenClick = buscaPosicionImagen();

                    // ------------------------------------------------

                    // le agregamos la clase de "la_imagen_principal"
                    $(".cuadro_contenedor_imagen")
                        .eq(posicionImagenClick)
                        .addClass("la_imagen_principal");

                    // ahora llevamos como nueva imagen principal a la imagen sobre la que se hizo click en "principal"
                    $(".ref_titulo_imagen_te_principal").after(
                        $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                    );
                }

                if (caso == "mismo") {
                    // la imagen sobre la que se hizo click en "principal" es la actual "imagen principal", ahora dejara de ser principal para ser "imagen exclusivas".

                    // ------------------------------------------------
                    // identificamos la posicion que tiene la imagen sobre la que se hizo click en "principal"

                    var posicionImagenClick = buscaPosicionImagen();

                    // ------------------------------------------------

                    // ahora quitamos esa clase de "la_imagen_principal" y asi solo se quedara con la clase "cuadro_contenedor_imagen"
                    $(".cuadro_contenedor_imagen")
                        .eq(posicionImagenClick)
                        .removeClass("la_imagen_principal");

                    // ahora llevamos como "imagen exclusivas" a la imagen sobre la que se hizo click en "principal"
                    $(".ref_titulo_imagen_te_exclusivas").after(
                        $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                    );
                }

                if (caso == "nuevo") {
                    // significa que no existe de momento "imagen principal", asi que la imagen sobre la que se hizo click, pasara a formar como "imagen principal"

                    // ------------------------------------------------
                    // identificamos la posicion que tiene la imagen sobre la que se hizo click en "principal"

                    var posicionImagenClick = buscaPosicionImagen();

                    // ------------------------------------------------

                    // le agregamos la clase de "la_imagen_principal"
                    $(".cuadro_contenedor_imagen")
                        .eq(posicionImagenClick)
                        .addClass("la_imagen_principal");

                    // ahora llevamos como nueva imagen principal a la imagen sobre la que se hizo click en "principal"
                    $(".ref_titulo_imagen_te_principal").after(
                        $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                    );
                }
            } else {
                var mensaje = respuestaServidor.mensaje;
                if (respuestaServidor.exito == "no") {
                    alert(mensaje);
                }

                if (respuestaServidor.exito == "denegado") {
                    alert(mensaje);
                }
            }

            function buscaPosicionImagen() {
                var numeroElementos = $(".cuadro_contenedor_imagen").length;

                //console.log("vemos el numero de elementos imagenes TOTALES");
                //console.log(numeroElementos);

                for (let i = 0; i < numeroElementos; i++) {
                    let elDataId = $(
                        ".cuadro_contenedor_imagen .card .card-footer .selec_deselec_imagen_principal_te"
                    )
                        .eq(i)
                        .attr("data-id");

                    //elDataId = $('.cuadro_contenedor_imagen .contenedor_boton_imagen .selec_deselec_imagen_principal_te').eq(i).attr('data-id');

                    let auxArray2 = elDataId.split("/");

                    let codigoImagenFor = auxArray2[0];

                    if (codigoImagenFor === codigoImagen) {
                        var posicImagClick = i;

                        break; // una vez encontrado la imagen deseada, salimos del bucle "for"
                    }
                }

                //console.log("retornamos la posicion de la imagen click");
                //console.log(posicImagClick);
                // ahra retornamos pocicion de la imagen sobre la que se hizo click
                return posicImagClick;
            }
        });
});

/**************************************************************************************/
/**************************************************************************************/
// PARA SELECCIONAR o deseleccionar UNA IMAGEN ESPECIFICA QUE FORMARA PARTE DEL PROYECTO / INMUEBLE
// PERTENECE A "PROYECTO E INMUEBLE"

$(".contenedor_imagenes_subidas").on(
    "click",
    ".boton_seleccionar_deseleccionar_imagen_jquery",
    function () {
        // note que ".contenedor_imagenes_subidas" ES EL CONTENEDOR PADRE QUE CONTIENE A TODAS LAS IMAGENES DEL PROYECTO (SEAN EXCLUSIVAS DE ESTA O SEAN OTRAS)

        //$('.boton_seleccionar_deseleccionar_imagen_jquery').on('click', function (e) {

        // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
        //e.preventDefault(); // Cancelamos el evento por defecto del elemento

        let $botonSeleccionarImagen = $(this); // capturamos el elemento boton seleccionador de imagen y lo guardamos en "$botonSeleccionarImagen" (podemos no usarlo con "$", pero como estamos en jquery, lo usamos por buenas practicas de programacion)

        // el "id-data" contiene el siguiente arreglo: codigoImagen/codigoInmuebleProyecto que lo guardaremos en la let "dataID"
        // "codigoInmuebleProyecto" puede ser el codigo del proyecto o de un inmueble especifico
        let dataID = $botonSeleccionarImagen.data("id");

        auxArray = dataID.split("/");

        let codigoImagen = auxArray[0];
        let codigoInmuebleProyecto = auxArray[1];

        $.ajax({
            // "/laapirest/administracion/general/accion/sel_desel_img/:codigo_imagen/:codigo_proyecto_inmueble"
            url:
                "/laapirest/administracion/general/accion/sel_desel_img/" +
                codigoImagen +
                "/" +
                codigoInmuebleProyecto,
            type: "POST",
        })

            // la respusta del servidor la guardamos en "respuestaServidor", con esta respuesta daremos estilo y modificaremos la interfaz del navegador
            .done(function (respuestaServidor) {
                //console.log("vemos el valor de la respuesta del servidor");
                //console.log(respuestaServidor.tipo_caso);

                if (respuestaServidor.exito == "si") {
                    if (respuestaServidor.tipo_caso == "principal") {
                        // significa que la imagen sobre la que se hizo click, es una "imagen principal", ahora dejara de ser imagen principal para ser "imagen exclusiva"

                        var posicionImagenClick = buscaPosicionImagen();

                        // ahora quitamos esa clase de "la_imagen_principal" y asi solo se quedara con la clase "cuadro_contenedor_imagen"
                        $(".cuadro_contenedor_imagen")
                            .eq(posicionImagenClick)
                            .removeClass("la_imagen_principal");

                        // ahora llevamos como "imagen exclusiva" a la imagen sobre la que se hizo click
                        $(".contenedor_titulo_imagenes_pertenecen").after(
                            $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                        );
                    }

                    if (respuestaServidor.tipo_caso == "exclusiva") {
                        // significa que la imagen sobre la que se hizo click, es una "imagen exlusiva", ahora dejara de ser imagen exlusiva para ser "imagen otros"

                        var posicionImagenClick = buscaPosicionImagen();

                        // ahora llevamos como "imagen otras" a la imagen sobre la que se hizo click
                        $(".contenedor_titulo_imagenes_otras").after(
                            $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                        );
                    }

                    if (respuestaServidor.tipo_caso == "otros") {
                        // significa que la imagen sobre la que se hizo click, es una "imagen otros", ahora dejara de ser imagen otros, para ser "imagen exlusiva"

                        var posicionImagenClick = buscaPosicionImagen();

                        // ahora llevamos como "imagen exclusiva" a la imagen sobre la que se hizo click
                        $(".contenedor_titulo_imagenes_pertenecen").after(
                            $(".cuadro_contenedor_imagen").eq(posicionImagenClick)
                        );
                    }

                    // ---------------------------------------------------------
                    function buscaPosicionImagen() {
                        var numeroElementos = $(".cuadro_contenedor_imagen").length;

                        //console.log("vemos el numero de elementos imagenes TOTALES");
                        //console.log(numeroElementos);

                        for (let i = 0; i < numeroElementos; i++) {
                            elDataId = $(
                                ".cuadro_contenedor_imagen .card .card-body .boton_seleccionar_deseleccionar_imagen_jquery"
                            )
                                .eq(i)
                                .attr("data-id");

                            auxArray2 = elDataId.split("/");

                            let codigoImagenFor = auxArray2[0];

                            if (codigoImagenFor === codigoImagen) {
                                var posicImagClick = i;

                                break; // una vez encontrado la imagen deseada, salimos del bucle "for"
                            }
                        }

                        // ahora retornamos pocicion de la imagen sobre la que se hizo click
                        return posicImagClick;
                    }
                } else {
                    if (respuestaServidor.exito == "denegado") {
                        alert(
                            "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios"
                        );
                    } else {
                        // entonces la respuesta es un "no" que no se pudo encontrar la imagen a cambiar
                        alert(
                            "Imagen no encontrada, refresque el navegador e intentelo nuevamente"
                        );
                    }
                }
            });
    }
);

/**************************************************************************** */
// PARA SUBIR DOCUMENTO A "TERRENO, PROYECTO, INMUEBLE, PROPIETARIO"

$("#idSubirDocumento").on("submit", function (e) {
    e.preventDefault(); // EVITAMOS QUE EL FORMULARIO SE DIRIJA AL SRC POR DEFECTO
    var tipo_documento = $("#idSubirDocumento").attr("data-tipo_doc");

    var datosFormulario = new FormData(document.getElementById("idSubirDocumento"));

    $(".alert").remove(); // por seguridad borramos todos los alert

    // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
    $(".ref_subir_doc").after(
        `<div class="alert alert-warning mt-3">
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
            <strong>Espere, documento subiendose...!</strong>
        </div>`
    );

    $.ajax({
        type: "post",
        //url: rutaServidor,
        url: "/laapirest/administracion/general/accion/subir_documento",
        data: datosFormulario,
        //dataType: "html",  // inhabilitar esto, porque si esta habilitado, las respuestas json del servidor seran entendidas como STRING y no como OBJETOS
        cache: false,
        contentType: false,
        processData: false,
    }).done(function (respuestaServidor) {
        $(".alert").remove(); // por seguridad borramos todos los alert

        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {
            // si el documento fue guardada en el servidor
            // extraemos los datos

            if (tipo_documento == "propietario") {
                var codigo_documento = respuestaServidor.codigo_documento;
                var nombre_documento = respuestaServidor.nombre_documento;
                var codigo_inmpro_pertenece = respuestaServidor.codigo_inmueble;
                var url = respuestaServidor.url;

                // agregamos la fila tabla del documento
                // LO Agregamos despues del cuerpo de la tabla (.cuerpo_filas), COMO HIJO (con "append")
                $(".cuerpo_filas").append(
                    // usando acento grave y el ${} para las partes que deven cambiar

                    `<tr class="fila_registro">
                        <td class="text-center">
                            <i
                                class="texto-link fas fa-file-pdf"
                                style="font-size: 2em;"
                            ></i>
                        </td>
                        <td class="nom_doc" data-id="${nombre_documento}">
                            ${nombre_documento}
                        </td>
                        <td class="cod_inm" data-id="${codigo_inmpro_pertenece}">
                            ${codigo_inmpro_pertenece}
                        </td>
                        <td>
                            <div class="contenedor_ver_eliminar_documento">
                                <button
                                    class="boton_eliminar_documento_jquery btn btn-danger btn-sm"
                                    data-id="${codigo_documento}"
                                >Eliminar</button>
                                <a
                                    href="${url}"
                                    target="_blank"
                                    class="btn btn-success btn-sm"
                                >Ver</a>
                            </div>
                        </td>
                    </tr>`
                );
            }

            if (tipo_documento == "te_py_inm") {
                var codigo_documento = respuestaServidor.codigo_documento;
                var nombre_documento = respuestaServidor.nombre_documento;
                var clase_documento = respuestaServidor.clase_documento;
                var url = respuestaServidor.url;

                // agregamos la fila tabla del documento
                // LO Agregamos despues del cuerpo de la tabla (.cuerpo_filas), COMO HIJO (con "append")
                $(".cuerpo_filas").append(
                    // usando acento grave y el ${} para las partes que deven cambiar

                    `<tr class="fila_registro">
                        <td class="text-center">
                            <i class="texto-link fas fa-file-pdf" style="font-size: 2em;"></i>
                        </td>
                        <td>${nombre_documento}</td>
                        <td>${clase_documento}</td>
                        <td>
                            <div class="contenedor_ver_eliminar_documento">
                                <button class="boton_eliminar_documento_jquery btn btn-danger btn-sm"
                                    data-id="${codigo_documento}">Eliminar</button>
                                <a href="${url}" target="_blank" class="btn btn-success btn-sm">Ver</a>
                            </div>
                        </td>
                    </tr>`
                );
                // borramos los datos anteriores de los inputs del documento nuevo subido
                $("#id_input_subir_documento").val(""); // es el tipo "file"
                $("#id_nombre_documento").val("");
            }

            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_doc").after(
                `<div class="alert alert-success mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Documento guardado!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "no") {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_subir_doc").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Solo documentos PDF estan permitidos!</strong>
                </div>`
            );
        }

        if (tipoRespuesta == "denegado") {
            if (tipo_documento == "propietario") {
                // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
                $(".ref_subir_doc").after(
                    `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>El codigo del inmueble es incorrecto o el propietario no tiene relacion con el codigo del inmueble</strong>
                </div>`
                );
            } else {
                // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
                $(".ref_subir_doc").after(
                    `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No es posible subir el documento porque existe bloqueo administrativo desde terreno</strong>
                </div>`
                );
            }
        }

        // LIMPIAMOS LOS INPUTS
        $("#id_input_subir_documento").val(""); // es el tipo "file"
        if (tipo_documento == "propietario") {
            // borramos los datos anteriores de los inputs del documento nuevo subido
            $("#id_nombre_documento").val("");
            $("#id_cod_inm_pertenecera").val("");
        }
        if (tipo_documento == "te_py_inm") {
            // borramos los datos anteriores de los inputs del documento nuevo subido
            $("#id_nombre_documento").val("");
        }
    });
});

/**************************************************************************** */
// PARA ELIMINAR DOCUMENTO "TERRENO, PROYECTO, INMUEBLE, INVERSOR"

$(".tabla_contenedora").on("click", ".boton_eliminar_documento_jquery", function () {
    // IMPORTANTE, ESTE METODO CON "ON" EL UTIL PARA QUE TAMBIEN FUNCIONE EN ELEMENTOS CREADOS DINAMICAMENTE CON JQUERY, ADEMAS NOTESE QUE EN ".tabla_contenedora" SE ENGLOBAN VARIOS ELEMENTOS, ENTRE ELLOS ".boton_eliminar_documento_jquery" QUE NO ES HIJO DIRECTO DE ".tabla_contenedora" (SINO QUE ES HIJO DE OTRO HIJO), PERO FUNCIONA, NO IMPORTA QUE DEBA SER HIJO DIRECTO, SOLO QUE ESTE DENTRO DEL CONTENEDOR PRINCIPAL ".tabla_contenedora"

    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    // e.preventDefault(); // Cancelamos el evento por defecto del elemento

    let objetivo_tipo = $("#id_objetivo_tipo").attr("data-objetivo_tipo");

    let $botonEliminarDocumento = $(this); // capturamos el elemento boton eliminador de documento y lo guardamos en "$botonEliminarDocumento" (podemos no usarlo con "$", pero como estamos en jquery, lo usamos por buenas practicas de programacion)

    const respuestaEliminar = confirm("¿Desea eliminar el documento?");

    // si la respuesta es "true"
    if (respuestaEliminar) {
        // capturamos el "data-id" del boton que ya esta seleccionado (por eso usamos "this") y lo guardamos en let "dataIdBotonEliminarDocumento"

        let codigo_documento = $botonEliminarDocumento.attr("data-id");

        // ahora enviamos una peticion al servidor, un AJAX de tipo "delete"
        // usamos el metodo AJAX
        $.ajax({
            url:
                "/laapirest/administracion/general/accion/eliminar_documento/" +
                objetivo_tipo +
                "/" +
                codigo_documento,
            type: "DELETE",
        })

            // POR lo escrito en "nuevoproyecto.js", nos envia una respuesta al navegador asi: "res.json(true)", es decir que si  salio favorable, el servidor esta enviando al navegador como respuesta un simple "true"

            // la respusta del servidor la guardamos en "respuestaServidorEliminarDocumento" (que sera el parametro que recibira la funcion)
            .done(function (respuestaServidor) {
                var laRespuesta = respuestaServidor.exito;

                if (laRespuesta == "si") {
                    // ahora procedemos a eliminar la fila del documento

                    // Contamos todas las documentos que existen en la ventana, contamos las que son exclusivas del proyecto y las que no las son
                    var numeroElementos = $(".fila_registro").length;

                    for (let i = 0; i < numeroElementos; i++) {
                        let codigoDocumentoFor = $(
                            ".fila_registro .boton_eliminar_documento_jquery"
                        )
                            .eq(i)
                            .attr("data-id");

                        // IMPORTANTE: la clase "boton_eliminar_documento_jquery" no es un hijo directo de la clase "fila_registro", pero funciona, porque esta dentro de esta clase "fila_registro"

                        if (codigoDocumentoFor === codigo_documento) {
                            $(".fila_registro").eq(i).remove();
                            break; // una vez encontrado la imagen deseada, salimos del bucle "for"
                        }
                    }
                }

                if (laRespuesta == "no") {
                    alert(respuestaServidor.mensaje);
                }

                if (laRespuesta == "denegado") {
                    alert(
                        "No es posible eliminar el documento porque existe bloqueo administrativo desde terreno"
                    );
                }
            });
    }
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA TABLAS DE PRESUPUESTO EN PROYECTO, RESPONSABILIDAD SOCIAL EN PROYECTO
// ---------------------------------------------------------------------------
// para "AGREGAR NUEVA FILA, ARRIBA DE LA FILA SELECCIONADA"

$(".madre_tabla").on("click", ".boton_fila_arriba", function () {
    //$(".cuerpo_filas").on("click", ".boton_fila_arriba", function () {

    let fila_numero = Number($(this).attr("data-id"));
    let n_fila_nuevo = fila_numero; // el numero de fila de la nueva fila creada hacia arriba
    let n_filas = $(".fila_fila").length;

    var html_nueva_fila = $(".fila_fila").eq(0).html(); // rescatara todo lo que esta dentro de "fila_fila", tomando a la primera fila como referencia
    // ------- Para verificación -------
    //console.log("LA NUEVA FILA ARRIBA EN FORMATO HTML");
    //console.log(html_nueva_fila);

    for (let i = 0; i < n_filas; i++) {
        // "n_fila" ok, porque empieza desde 0
        let numero_i = Number($(".numero_fila").eq(i).attr("data-id"));
        if (numero_i == fila_numero) {
            // "before" inserta contenido ANTES de ".fila_fila" y A su mismo NIVEL
            $(".fila_fila")
                .eq(i)
                .before(`<tr class="fila_fila">` + html_nueva_fila + `</tr>`);
            break;
        }
    }

    // "n_filas + 1", porque ahora se incremento con una nueva fila
    for (let j = 0; j < n_filas + 1; j++) {
        $(".numero_fila")
            .eq(j)
            .text(j + 1);

        $(".numero_fila")
            .eq(j)
            .attr("data-id", j + 1);

        $(".boton_fila_arriba")
            .eq(j)
            .attr("data-id", j + 1);

        $(".boton_fila_abajo")
            .eq(j)
            .attr("data-id", j + 1);

        $(".boton_fila_eliminar")
            .eq(j)
            .attr("data-id", j + 1);

        if (j == n_fila_nuevo - 1) {
            // "n_fila_nuevo - 1" ok, valido para nueva fila creada hacia arriba o abajo
            // limpiamos por seguridad los todos los inputs que contiene esta nueva fila creada
            $(".fila_fila .fila_campo").eq(j).val("");
        }
    }
});

// ---------------------------------------------------------------------------
// para "AGREGAR NUEVA FILA, ABAJO DE LA FILA SELECCIONADA"

$(".madre_tabla").on("click", ".boton_fila_abajo", function () {
    //$(".cuerpo_filas").on("click", ".boton_fila_abajo", function () {

    let fila_numero = Number($(this).attr("data-id"));
    let n_fila_nuevo = fila_numero + 1; // el numero de fila de la nueva fila creada hacia ABAJO
    let n_filas = $(".fila_fila").length;

    var html_nueva_fila = $(".fila_fila").eq(0).html(); // rescatara todo lo que esta dentro de "fila_fila", tomando a la primera fila como referencia

    // ------- Para verificación -------
    //console.log("LA NUEVA FILA ABAJO EN FORMATO HTML");
    //console.log(html_nueva_fila);

    for (let i = 0; i < n_filas; i++) {
        let numero_i = Number($(".numero_fila").eq(i).attr("data-id"));
        if (numero_i == fila_numero) {
            // "after" inserta contenido DESPUES de ".fila_fila" y A su mismo NIVEL
            $(".fila_fila")
                .eq(i)
                .after(`<tr class="fila_fila">` + html_nueva_fila + `</tr>`);
            break;
        }
    }

    // "n_filas + 1", porque ahora se incremento con una nueva fila
    for (let j = 0; j < n_filas + 1; j++) {
        $(".numero_fila")
            .eq(j)
            .text(j + 1);
        $(".numero_fila")
            .eq(j)
            .attr("data-id", j + 1);
        $(".boton_fila_arriba")
            .eq(j)
            .attr("data-id", j + 1);
        $(".boton_fila_abajo")
            .eq(j)
            .attr("data-id", j + 1);
        $(".boton_fila_eliminar")
            .eq(j)
            .attr("data-id", j + 1);

        if (j == n_fila_nuevo - 1) {
            // "n_fila_nuevo - 1" ok, valido para nueva fila creada hacia arriba o abajo
            // limpiamos por seguridad los todos los inputs que contiene esta nueva fila creada
            $(".fila_fila .fila_campo").eq(j).val("");
        }
    }
});

// ---------------------------------------------------------------------------
// para "ELIMINAR LA FILA SELECCIONADA"

//$(".cuerpo_filas").on("click", ".boton_fila_eliminar", function () {
$(".madre_tabla").on("click", ".boton_fila_eliminar", function () {
    let fila_numero = Number($(this).attr("data-id"));
    let n_filas = $(".fila_fila").length;
    if (n_filas > 1) {
        // solo sera eliminado si existe mas de 1 fila, esto para mantener 1 fila como minimo que mantenga los botones que permitan agregar nuevas filas
        for (let i = 0; i < n_filas; i++) {
            let numero_i = Number($(".numero_fila").eq(i).text());
            if (numero_i == fila_numero) {
                $(".fila_fila").eq(i).remove();
                break;
            }
        }

        // "n_filas - 1", porque ahora se DISMINUYO EN una fila
        for (let j = 0; j < n_filas - 1; j++) {
            $(".numero_fila")
                .eq(j)
                .text(j + 1);
            $(".numero_fila")
                .eq(j)
                .attr("data-id", j + 1);
            $(".boton_fila_arriba")
                .eq(j)
                .attr("data-id", j + 1);
            $(".boton_fila_abajo")
                .eq(j)
                .attr("data-id", j + 1);
            $(".boton_fila_eliminar")
                .eq(j)
                .attr("data-id", j + 1);
        }
    }
});

// ---------------------------------------------------------------------------
// para "GUARDAR TABLA" DE: PRESUPUESTO DE PROYECTO || RESPONSABILIDAD SOCIAL PROYECTO || EMPLEOS PROYECTO || CUOTAS MENSUALES DE CONSTRUCCION DEL PROYECTO
$(".madre_tabla").on("click", "#id_guardar_tabla", function () {
    //$("#id_guardar_tabla").click(function (e) {

    // importante, un ARRAY puede contener dentro valores de diferente tipo, es decir de tipo: string, numerico, incluso objetos. todos ellos mesclados dentro el mismo array
    // let array_prueba = ["texto_1", 14, "texto_2", 15];

    let tipo_tabla_objetivo = $("#tipo_tabla_objetivo").attr("data-id");

    let n_filas = $(".fila_fila").length;
    let n_inputs = $(".fila_input").length;
    let n_columnas = n_inputs / n_filas;

    // ------- Para verificación -------
    //console.log("NUMERO DE FILAS " + n_filas);
    //console.log("NUMERO DE INPUTS " + n_inputs);
    //console.log("NUMERO DE COLUMNAS " + n_columnas);

    let inputs_vacios = 0;

    for (let i = 0; i < n_inputs; i++) {
        let valor_input = $(".fila_input").eq(i).val();

        // IMPORTANTE, AUNQUE EN EL INPUT HTML ESTA ESPECIFICADO QUE EL TIPO DE DATO QUE SE INGRESARA ES "NUMERICO", AL RESCATARLO CON JQUERY, LO TOMA COMO "STRING", POR TANTO PARA SOLUCIONAR ESTE PROBLEMA SE DEVERA HACER UNA RECONVERSION CON NUM
        if (valor_input == "") {
            inputs_vacios = 1;
            break; // para salir del bucle for
        }
    }

    if (inputs_vacios == 0) {
        let codigo_objetivo = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

        // almacenamos los valores de los inputs de la tabla
        let array_tabla = [];
        let sub_array_tabla = [];
        var aux = -1;
        var sub_aux = -1;
        for (let j = 0; j < n_inputs; j++) {
            sub_aux = sub_aux + 1;
            var tipo_input = $(".fila_input").eq(j).attr("data-tipo");
            if (tipo_input == "numero") {
                var aux_contenido = Number($(".fila_input").eq(j).val()); // en formato numerico
            } else {
                var aux_contenido = $(".fila_input").eq(j).val(); // en formato texto simple
            }

            sub_array_tabla[sub_aux] = aux_contenido;

            // ------- Para verificación -------
            //console.log("SUB_TABLA EN PROCESO DE LLENADO");
            //console.log(sub_array_tabla);

            if (sub_aux == n_columnas - 1) {
                aux = aux + 1;
                sub_array_tabla.unshift(aux + 1); // Añade "aux+1" numero de fila al inicio del array (+1 para que inicie desde 1 y no desde 0)

                // ------- Para verificación -------
                //console.log("SUB TABLA");
                //console.log(sub_array_tabla);

                array_tabla[aux] = sub_array_tabla; // ok "aux" porque lo pocicionara en ubicacion 0 dentro del array
                // ------- Para verificación -------
                //console.log("TABLA");
                //console.log(array_tabla);
                sub_aux = -1; // para iniciar de nuevo la siguiente fila de llenado
                sub_array_tabla = []; // limpiamos para la siguiente fila de llenado
            }
        }

        //--------------- Verificacion ----------------
        //console.log("LA TABLA ARRAY ANTES DEL JSON");
        //console.log(array_tabla);
        //---------------------------------------------

        var aux_string = JSON.stringify(array_tabla);

        //--------------- Verificacion ----------------
        //console.log("LA TABLA ARRAY DESPUES DEL JSON");
        //console.log(aux_string);
        //---------------------------------------------

        $.ajax({
            type: "POST",
            url:
                "/laapirest/administracion/general/accion/guardar_tabla/" +
                tipo_tabla_objetivo +
                "/" +
                codigo_objetivo,
            //data: paqueteDatos,
            data: { en_string: aux_string },
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;

            if (tipoRespuesta == "si") {
                $(".ref_botones_tabla").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Tabla guardada!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "no") {
                $(".ref_botones_tabla").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Proyecto no econtrado, intentelo nuevamente!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "denegado") {
                $(".ref_botones_tabla").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios!</strong>
                        </div>`
                );
            }
        });
    } else {
        // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
        $(".ref_botones_tabla").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Todos los campos deben estar llenados!</strong>
            </div>`
        );
    }
});

// ---------------------------------------------------------------------------
// para "ELIMINAR TABLA" DE: PRESUPUESTO DE PROYECTO || RESPONSABILIDAD SOCIAL PROYECTO || CUOTAS MENSUALES DE CONSTRUCCION DE PROYECTO

$(".madre_tabla").on("click", "#id_eliminar_tabla", function () {
    const respuestaEliminar = confirm("¿Desea eliminar la tabla?");
    // si la respuesta es "true"
    if (respuestaEliminar) {
        let tipo_tabla_objetivo = $("#tipo_tabla_objetivo").attr("data-id");
        let codigo_objetivo = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
        $.ajax({
            type: "POST", // ojo, usamos el metodo POST y no DELETE, YA QUE SOLO SERAN MODIFICADOS LAS PROPIEDADES DE PRESUPUESTO O DE RESPONSABILIDAD SOCIAL DE LA BASE DE DATOS DEL PROYECTO
            url:
                "/laapirest/administracion/general/accion/eliminar_tabla/" +
                tipo_tabla_objetivo +
                "/" +
                codigo_objetivo,
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;
            if (tipoRespuesta == "si") {
                // borramos el contenido de TODOS los inputs de la tabla
                $(".fila_input").val("");

                let n_filas = $(".fila_fila").length; // numero de filas de la tabla
                // eliminamos todas las filas de la tabla, excepto la primera (pocicion 0 de la matriz de elementos)
                if (n_filas > 1) {
                    for (let i = 0; i < n_filas - 1; i++) {
                        // "(n_filas - 1)" porque la primara fila no sera eliminada
                        // al eliminar una fila, las que se encuentran debajo de esta suben un nivel, de manera que se ira eliminando siempre la posicion "1" en cada ciclo de eliminacion (sin tocar la posicion 0, es decir la PRIMERA FILA)
                        $(".fila_fila").eq(1).remove(); //
                    }
                }

                $(".ref_botones_tabla").after(
                    `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Tabla eliminada!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "no") {
                $(".ref_botones_tabla").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Proyecto no econtrado, intentelo nuevamente!</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "denegado") {
                alert(
                    "El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios"
                );
            }
        });
    }
});

/* *************************************************************************** */
// AL MOMENTO DE HACER CLICK EN BOTON DE "LLENAR INFORMACION DE LOS DATOS DEL PROPIETARIO"

$(".contenido").on("click", ".llenar_datos_propietario", function () {
    // **OK
    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    // e.preventDefault(); // Cancelamos el evento por defecto del elemento

    // limpieza de inputs
    $("#label_ci_propietario").text("");
    $("#label_ci_propietario").attr("data-ci", "");

    $(".aux_borrador_datos").val("");

    var ci_propietario = $("#idCedulaIdentidad").val();

    // limpiar todas las filas de la tabla de pagos mensuales, dejando solo una fila limpia

    if (ci_propietario != "") {
        // empaquetandolos los datos necesarios en el objeto "paqueteDatos"
        var paqueteDatos = {
            ci_propietario,
        };

        // entramos a la ruta de servidor
        $.ajax({
            url: "/laapirest/propietario/accion/llenar_datos_propietario",
            type: "POST",
            data: paqueteDatos,
        }).done(function (aux_respuestaServidor) {
            var respuestaServidor = aux_respuestaServidor;
            // ------- Para verificación -------
            //console.log("la respuesta del servidor");
            //console.log(respuestaServidor);

            // ------- Para verificación -------
            //console.log("nombres del propietario desde el servidor");
            //console.log(respuestaServidor.respuesta.propietario_datos.nombres_propietario);

            if (respuestaServidor.respuesta.propietario_datos.propietario_registrado == true) {
                $("#label_ci_propietario").text(ci_propietario);
                $("#label_ci_propietario").attr("data-ci", ci_propietario);
                $("#guardar_datos_propietario").attr("data-ci", ci_propietario);

                $("#nombres_propietario").val(
                    respuestaServidor.respuesta.propietario_datos.nombres_propietario
                );
                $("#apellidos_propietario").val(
                    respuestaServidor.respuesta.propietario_datos.apellidos_propietario
                );
                $("#departamento_propietario").val(
                    respuestaServidor.respuesta.propietario_datos.departamento_propietario
                );
                $("#provincia_propietario").val(
                    respuestaServidor.respuesta.propietario_datos.provincia_propietario
                );
                $("#domicilio_propietario").val(
                    respuestaServidor.respuesta.propietario_datos.domicilio_propietario
                );
                $("#ocupacion_propietario").val(
                    respuestaServidor.respuesta.propietario_datos.ocupacion_propietario
                );
                $("#fecha_nacimiento_propietario").val(
                    respuestaServidor.respuesta.propietario_datos.fecha_nacimiento_propietario
                );
                $("#telefonos_propietario").val(
                    respuestaServidor.respuesta.propietario_datos.telefonos_propietario
                );
            } else {
                $(".ref_idCedulaIdentidad").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El usuario es completamente nuevo</strong>
                        </div>`
                );
            }
        });
    } else {
        $(".ref_idCedulaIdentidad").after(
            `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Ingrese un documento de identidad</strong>
                </div>`
        );
    }
});

//===============================================================================
// AL MOMENTO DE HACER CLICK EN BOTON DE "LLENAR INFORMACION DE LOS DATOS DEL PROPIETARIO"
// llenar_datos_copropietario_inm es casi similar a llenar_datos_copropietario_te

$(".contenido").on("click", ".llenar_datos_copropietario_te", function () {
    // **OK
    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    // e.preventDefault(); // Cancelamos el evento por defecto del elemento

    $("#contenedor_eliminar_copropietario").attr("hidden", true); // ocultamos
    $("#contenedor_copropietario").attr("hidden", true); // ocultamos
    $("#contenedor_fracciones").attr("hidden", true); // ocultamos
    $("#contenedor_documentos").attr("hidden", true); // ocultamos

    let codigo_inmueble = $(this).attr("data-codigo_inmueble");

    // limpieza de inputs
    $("#label_ci_propietario").text("");
    $("#label_ci_propietario").attr("data-ci", "");

    $(".aux_borrador_datos").val("");

    var ci_propietario = $("#idCedulaIdentidad").val();

    // limpiar todas las filas de la tabla de pagos mensuales, dejando solo una fila limpia

    if (ci_propietario != "") {
        // empaquetandolos los datos necesarios en el objeto "paqueteDatos"
        var paqueteDatos = {
            ci_propietario,
            codigo_inmueble,
        };

        // entramos a la ruta de servidor
        $.ajax({
            url: "/laapirest/propietario/accion/llenar_datos_copropietario_te",
            type: "POST",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            // ------- Para verificación -------
            //console.log("la respuesta del servidor");
            //console.log(respuestaServidor);

            var propietario_datos = respuestaServidor.propietario_datos;
            var array_fracciones = respuestaServidor.array_fracciones;
            var documentos_privados = respuestaServidor.documentos_privados;
            var caso = respuestaServidor.caso;
            var c_fti_a_val = respuestaServidor.c_fti_a_val;
            var c_fti_a_val_render = respuestaServidor.c_fti_a_val_render;
            var c_fti_a_n = respuestaServidor.c_fti_a_n;
            var c_fti_a_n_render = respuestaServidor.c_fti_a_n_render;

            $("#label_ci_propietario").text(ci_propietario);
            $("#label_ci_propietario").attr("data-ci", ci_propietario);
            $("#guardar_datos_propietario").attr("data-ci", ci_propietario);

            if (caso == "nuevo_a") {
                // significa que es un usuario completamente nuevo: no tiene datos ni es dueño de fracciones de este inmueble
                $(".ref_idCedulaIdentidad").after(
                    `<div class="alert alert-danger mt-3">
                        <strong>El usuario ${ci_propietario} es completamente nuevo.</strong>
                    </div>`
                );
            } else {
                if (caso == "nuevo_b") {
                    // el usuario cuenta con datos registrados, pero NO cuenta con fracciones en el inmueble

                    `<div class="alert alert-danger mt-3">
                        <strong>El usuario ${ci_propietario} no cuenta con fracciones del presente inmueble.</strong>
                    </div>`;

                    $("#nombres_propietario").val(propietario_datos.nombres_propietario);
                    $("#apellidos_propietario").val(propietario_datos.apellidos_propietario);
                    $("#departamento_propietario").val(propietario_datos.departamento_propietario);
                    $("#provincia_propietario").val(propietario_datos.provincia_propietario);
                    $("#domicilio_propietario").val(propietario_datos.domicilio_propietario);
                    $("#ocupacion_propietario").val(propietario_datos.ocupacion_propietario);
                    $("#fecha_nacimiento_propietario").val(
                        propietario_datos.fecha_nacimiento_propietario
                    );
                    $("#telefonos_propietario").val(propietario_datos.telefonos_propietario);
                }
            }

            //---------------------------------------------------------------
            // LLENADO DEL NIVEL DE PARTICIPACION ACTUAL QUE TIENE EL COPROPIETARIO EN EL INMUEBLE

            $(".c_fti_a_n").text(c_fti_a_n_render);
            $(".c_fti_a_val").text(c_fti_a_val_render);
            $(".c_fti_a_p").text(c_fti_a_p_render);

            //---------------------------------------------------------------
            // LLENADO DE FRACCIONES QUE TIENEN EL COPROPIETARIO EN EL TERRENO
            if (array_fracciones.length > 0) {
                for (let i = 0; i < array_fracciones.length; i++) {
                    let codigo_fraccion = array_fracciones[i].codigo_fraccion;
                    let fraccion_bs = array_fracciones[i].fraccion_bs;
                    let fraccion_bs_render = array_fracciones[i].fraccion_bs_render;
                    let plusvalia_bs = array_fracciones[i].plusvalia_bs;
                    let plusvalia_bs_render = array_fracciones[i].plusvalia_bs_render;

                    // con AFTER lO Agregamos despues del titulo y al mismo nivel que este (no como hijo)
                    $(".ref_fracciones").after(
                        `
                        AQUI ESTARA LA ESTRUCTURA HTML DE LOS CARD FRACCIONES DE TERRENO COMPLETO, ES DECIR SE MOSTRARA LA PARTE DE COPROPIETARIO Y DE INVERSIONISTA
                        `
                    );
                }
            }

            //---------------------------------------------------------------
            // LLENADO DE DOCUMENTOS QUE TIENEN EL COPROPIETARIO EN EL TERRENO
            if (documentos_privados.length > 0) {
                for (let i = 0; i < documentos_privados.length; i++) {
                    let codigo_documento = documentos_privados[i].codigo_documento;
                    let nombre_documento = documentos_privados[i].nombre_documento;
                    let codigo_inmueble = documentos_privados[i].codigo_inmueble;
                    let url = documentos_privados[i].url;

                    // agregamos la fila tabla del documento
                    // LO Agregamos despues del cuerpo de la tabla (.cuerpo_filas), COMO HIJO (con "append")
                    $(".cuerpo_filas").append(
                        // usando acento grave y el ${} para las partes que deven cambiar

                        `<tr class="fila_registro">
                            <td class="text-center">
                                <i
                                    class="texto-link fas fa-file-pdf"
                                    style="font-size: 2em;"
                                ></i>
                            </td>
                            <td class="nom_doc" data-id="${nombre_documento}">
                                ${nombre_documento}
                            </td>
                            <td class="cod_inm" data-id="${codigo_inmueble}">
                                ${codigo_inmueble}
                            </td>
                            <td>
                                <div class="contenedor_ver_eliminar_documento">
                                    <button
                                        class="boton_eliminar_documento_jquery btn btn-danger btn-sm"
                                        data-id="${codigo_documento}"
                                    >Eliminar</button>
                                    <a
                                        href="${url}"
                                        target="_blank"
                                        class="btn btn-success btn-sm"
                                    >Ver</a>
                                </div>
                            </td>
                        </tr>`
                    );
                }
            }

            $("#contenedor_eliminar_copropietario").attr("hidden", false); // mostramos
            $("#contenedor_copropietario").attr("hidden", false); // mostramos
            $("#contenedor_fracciones").attr("hidden", false); // mostramos
            $("#contenedor_documentos").attr("hidden", false); // mostramos
        });
    } else {
        $(".ref_idCedulaIdentidad").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Ingrese un documento de identidad</strong>
            </div>`
        );
    }
});

//===============================================================================
// AL MOMENTO DE HACER CLICK EN BOTON DE "LLENAR INFORMACION DE LOS DATOS DEL PROPIETARIO"
// llenar_datos_copropietario_inm es casi similar a llenar_datos_copropietario_te

$(".contenido").on("click", ".llenar_datos_copropietario_inm", function () {
    // **OK
    // IMPORTANTE, CUANDO SE USE ESTE METODO DE "ON", NO DEBE USARSE EL "PREVENTDEFAULT"
    // e.preventDefault(); // Cancelamos el evento por defecto del elemento

    $("#contenedor_eliminar_copropietario").attr("hidden", true); // ocultamos
    $("#contenedor_copropietario").attr("hidden", true); // ocultamos
    $("#contenedor_fracciones").attr("hidden", true); // ocultamos
    $("#contenedor_documentos").attr("hidden", true); // ocultamos

    let codigo_inmueble = $(this).attr("data-codigo_inmueble");

    // limpieza de inputs
    $("#label_ci_propietario").text("");
    $("#label_ci_propietario").attr("data-ci", "");

    $(".aux_borrador_datos").val("");

    var ci_propietario = $("#idCedulaIdentidad").val();

    // limpiar todas las filas de la tabla de pagos mensuales, dejando solo una fila limpia

    if (ci_propietario != "") {
        // empaquetandolos los datos necesarios en el objeto "paqueteDatos"
        var paqueteDatos = {
            ci_propietario,
            codigo_inmueble,
        };

        // entramos a la ruta de servidor
        $.ajax({
            url: "/laapirest/propietario/accion/llenar_datos_copropietario_inm",
            type: "POST",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            // ------- Para verificación -------
            //console.log("la respuesta del servidor");
            //console.log(respuestaServidor);

            var propietario_datos = respuestaServidor.propietario_datos;
            var array_fracciones = respuestaServidor.array_fracciones;
            var documentos_privados = respuestaServidor.documentos_privados;
            var caso = respuestaServidor.caso;
            var c_fti_a_val = respuestaServidor.c_fti_a_val;
            var c_fti_a_val_render = respuestaServidor.c_fti_a_val_render;
            var c_fti_a_n = respuestaServidor.c_fti_a_n;
            var c_fti_a_n_render = respuestaServidor.c_fti_a_n_render;

            $("#label_ci_propietario").text(ci_propietario);
            $("#label_ci_propietario").attr("data-ci", ci_propietario);
            $("#guardar_datos_propietario").attr("data-ci", ci_propietario);

            if (caso == "nuevo_a") {
                // significa que es un usuario completamente nuevo: no tiene datos ni es dueño de fracciones de este inmueble
                $(".ref_idCedulaIdentidad").after(
                    `<div class="alert alert-success mt-3">
                        <strong>El usuario ${ci_propietario} es completamente nuevo.</strong>
                    </div>`
                );
            } else {
                if (caso == "nuevo_b") {
                    // el usuario cuenta con datos registrados, pero NO cuenta con fracciones en el inmueble

                    `<div class="alert alert-success mt-3">
                        <strong>El usuario ${ci_propietario} no cuenta con fracciones del presente inmueble.</strong>
                    </div>`;

                    $("#nombres_propietario").val(propietario_datos.nombres_propietario);
                    $("#apellidos_propietario").val(propietario_datos.apellidos_propietario);
                    $("#departamento_propietario").val(propietario_datos.departamento_propietario);
                    $("#provincia_propietario").val(propietario_datos.provincia_propietario);
                    $("#domicilio_propietario").val(propietario_datos.domicilio_propietario);
                    $("#ocupacion_propietario").val(propietario_datos.ocupacion_propietario);
                    $("#fecha_nacimiento_propietario").val(
                        propietario_datos.fecha_nacimiento_propietario
                    );
                    $("#telefonos_propietario").val(propietario_datos.telefonos_propietario);
                }
            }

            //---------------------------------------------------------------
            // LLENADO DEL NIVEL DE PARTICIPACION ACTUAL QUE TIENE EL COPROPIETARIO EN EL INMUEBLE

            $(".c_fti_a_n").text(c_fti_a_n_render);
            $(".c_fti_a_val").text(c_fti_a_val_render);
            $(".c_fti_a_p").text(c_fti_a_p_render);
            //---------------------------------------------------------------
            // LLENADO DE FRACCIONES QUE TIENEN EL COPROPIETARIO EN EL INMUEBLE
            if (array_fracciones.length > 0) {
                for (let i = 0; i < array_fracciones.length; i++) {
                    let codigo_fraccion = array_fracciones[i].codigo_fraccion;
                    let fraccion_bs = array_fracciones[i].fraccion_bs;
                    let fraccion_bs_render = array_fracciones[i].fraccion_bs_render;
                    let plusvalia_bs = array_fracciones[i].plusvalia_bs;
                    let plusvalia_bs_render = array_fracciones[i].plusvalia_bs_render;

                    // con AFTER lO Agregamos despues del titulo y al mismo nivel que este (no como hijo)
                    $(".ref_fracciones").after(
                        `
                        <div class="card_un_fraccion mb-3 col-12 col-sm-6 col-md-4 col-lg-3">
                            <div class="card">
                                <div class="card-body">
                                    <div class="text-center mb-2">
                                        <a href="laapirest/fraccion/${codigo_fraccion}/descripcion">
                                            <span class="h6"><b>${codigo_fraccion}</b></span>
                                        </a>
                                    </div>

                                    <div class="text-center mb-2" title="Valor fracción de terreno">
                                        <span class="h6"><b class="elvalor" data-bs="${fraccion_bs}">${fraccion_bs_render}</b></span>
                                        <span class="h6"><b class="lamoneda">Bs</b></span>
                                    </div>

                                    <div class="linea-x"></div>
                                    <div class="text-center">Copropietario</div>
                                    <div class="d-flex justify-content-between my-2">
                                        <div class="linea-v text-center w-50">
                                            <div>
                                                <div class="h6">
                                                    <b>
                                                        <span class="elvalor" data-bs="${plusvalia_bs}">${plusvalia_bs_render}</span>
                                                        <span class="lamoneda">Bs</span>
                                                    </b>
                                                </div>
                                            </div>

                                            <div class="mb-1">
                                                <span class="h6">Plusvalía</span>
                                            </div>
                                        </div>

                                        <div class="text-center w-50">
                                            <div>
                                                <div class="h6">
                                                    <b>
                                                        <span>{{dias_plusvalia}}</span>
                                                        <span>Días</span>
                                                    </b>
                                                </div>
                                            </div>

                                            <div class="mb-1">
                                                <span class="h6">Duración</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    );
                }
            }

            //---------------------------------------------------------------
            // LLENADO DE DOCUMENTOS QUE TIENEN EL COPROPIETARIO EN EL INMUEBLE
            if (documentos_privados.length > 0) {
                for (let i = 0; i < documentos_privados.length; i++) {
                    let codigo_documento = documentos_privados[i].codigo_documento;
                    let nombre_documento = documentos_privados[i].nombre_documento;
                    let codigo_inmueble = documentos_privados[i].codigo_inmueble;
                    let url = documentos_privados[i].url;

                    // agregamos la fila tabla del documento
                    // LO Agregamos despues del cuerpo de la tabla (.cuerpo_filas), COMO HIJO (con "append")
                    $(".cuerpo_filas").append(
                        // usando acento grave y el ${} para las partes que deven cambiar

                        `<tr class="fila_registro">
                            <td class="text-center">
                                <i
                                    class="texto-link fas fa-file-pdf"
                                    style="font-size: 2em;"
                                ></i>
                            </td>
                            <td class="nom_doc" data-id="${nombre_documento}">
                                ${nombre_documento}
                            </td>
                            <td class="cod_inm" data-id="${codigo_inmueble}">
                                ${codigo_inmueble}
                            </td>
                            <td>
                                <div class="contenedor_ver_eliminar_documento">
                                    <button
                                        class="boton_eliminar_documento_jquery btn btn-danger btn-sm"
                                        data-id="${codigo_documento}"
                                    >Eliminar</button>
                                    <a
                                        href="${url}"
                                        target="_blank"
                                        class="btn btn-success btn-sm"
                                    >Ver</a>
                                </div>
                            </td>
                        </tr>`
                    );
                }
            }

            $("#contenedor_eliminar_copropietario").attr("hidden", false); // mostramos
            $("#contenedor_copropietario").attr("hidden", false); // mostramos
            $("#contenedor_fracciones").attr("hidden", false); // mostramos
            $("#contenedor_documentos").attr("hidden", false); // mostramos
        });
    } else {
        $(".ref_idCedulaIdentidad").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Ingrese un documento de identidad</strong>
            </div>`
        );
    }
});

/**************************************************************************** */
// PARA GUARDAR DATOS DEL PROPIETARIO y TAMBIEN DE COPROPIETARIO DE ALGUNA FRACCION SEA DEL TIPO TERRENO O INMUEBLE

$("#guardar_datos_propietario").click(function (e) {
    // guardaremos los datos del inversionista, puede que se trate de uno completamente NUEVO o de uno del que ya se tienen sus datos, pero que puede haber cambiado su numero de telefono, es por eso que igualmente se actualizaran esos datos (se los tratara como si fuese un INVERSIONISTA NUEVO)

    let ci_propietario = $("#label_ci_propietario").attr("data-ci");

    if (ci_propietario) {
        // si existe un ci de propietario que registrar ya sea sus datos o pagos

        var paqueteDatos = {};
        paqueteDatos.ci_propietario = ci_propietario;

        var propietario_datos = {};

        //let aux_fech_nac_prop = $("#fecha_nacimiento_propietario").attr("value"); // esta con attr NO FUNCIONA, para que funcione en caso de inputs tiene que ser con .val
        let aux_fech_nac_prop = $("#fecha_nacimiento_propietario").val();

        // IMPORTANTE: PARA VALIDAR SI EL CAMPO DE FECHA ESTA VACIA, SE LO HACE CON "length"
        if (aux_fech_nac_prop.toString().length != 0) {
            // si existe la fecha de nacimiento, porque este es necesario ya que a partir de este dato se dara las contraseñas por defecto al nuevo propietario del inmueble
            propietario_datos.nombres_propietario = $("#nombres_propietario").val();
            propietario_datos.apellidos_propietario = $("#apellidos_propietario").val();
            propietario_datos.telefonos_propietario = $("#telefonos_propietario").val();
            propietario_datos.fecha_nacimiento_propietario = $(
                "#fecha_nacimiento_propietario"
            ).val();
            propietario_datos.ocupacion_propietario = $("#ocupacion_propietario").val();
            propietario_datos.departamento_propietario = $("#departamento_propietario").val();
            propietario_datos.provincia_propietario = $("#provincia_propietario").val();
            propietario_datos.domicilio_propietario = $("#domicilio_propietario").val();

            paqueteDatos.propietario_datos = propietario_datos;

            if (
                $("#nombres_propietario").val() == "" ||
                $("#apellidos_propietario").val() == "" ||
                $("#telefonos_propietario").val() == "" ||
                $("#ocupacion_propietario").val() == "" ||
                $("#departamento_propietario").val() == "" ||
                $("#provincia_propietario").val() == "" ||
                $("#domicilio_propietario").val() == ""
            ) {
                var datos_personales = false;
            } else {
                var datos_personales = true;
            }
        } else {
            var datos_personales = false;
        }

        if (datos_personales == true) {
            var verdad_paqueteDatos = JSON.stringify(paqueteDatos);

            $.ajax({
                type: "POST",
                url: "/laapirest/administracion/general/accion/guardar_datos_propietario",

                data: { contenedor: verdad_paqueteDatos },
                //data: paqueteDatos,
            }).done(function (respuestaServidor) {
                var tipoRespuesta = respuestaServidor.exito;

                if (tipoRespuesta == "si") {
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Información guardada!</strong>
                        </div>`
                    );
                }

                if (tipoRespuesta == "nuevo") {
                    let usuario = respuestaServidor.usuario;
                    let clave = respuestaServidor.clave;

                    // mostraremos el usuario y clave por defecto del propietario nuevo
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Nuevas claves de acceso:</strong>
                            <br>
                            Usuario: <strong>${usuario}</strong>
                            <br>
                            Clave: <strong>${clave}</strong>
                        </div>`
                    );
                }
            });
        } else {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_datos_pagos_propietario").after(
                `<div class="alert alert-danger mt-3 mx-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>Todos los campos de DATOS del propietario deben estar llenados!</strong>
                </div>`
            );
        }
    } else {
        // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
        $(".ref_boton_datos_pagos_propietario").after(
            `<div class="alert alert-danger mt-3 mx-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>No existen datos de propietario que deban ser registrados</strong>
            </div>`
        );
    }
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA GUARDAR PAGO DEL PROPIETARIO ABSOLUTO sobre un INMUEBLE ENTERO

$("#guardar_pago_propietario").click(function (e) {
    let ci_propietario = $("#label_ci_propietario").attr("data-ci");

    let codigo_inmueble = $("#id_objetivo_codigo").attr("data-objetivo_codigo");

    if (ci_propietario) {
        // si existe un ci de propietario que registrar ya sea sus datos o pagos

        var paqueteDatos = {
            ci_propietario,
            codigo_inmueble,
        };

        $.ajax({
            type: "POST",
            url: "/laapirest/administracion/general/accion/guardar_pago_propietario",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;

            if (tipoRespuesta == "si") {
                let pagado_render = respuestaServidor.pagado_render;

                alert(`Pago de ${pagado_render} Bs. guardado. La ventana se recargara`);
                // usamos el metodo DE RECARGAR/ACTUALIZAR LA PAGINA, porque asi se visualizara el pago que efectuo el propietario.
                location.reload();
            }

            if (tipoRespuesta == "no") {
                $(".ref_boton_datos_pagos_propietario").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Inmueble no econtrado</strong>
                        </div>`
                );
            }

            if (tipoRespuesta == "denegado") {
                $(".ref_boton_datos_pagos_propietario").after(
                    `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                        </div>`
                );
            }
        });
    } else {
        // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
        $(".ref_boton_datos_pagos_propietario").after(
            `<div class="alert alert-danger mt-3 mx-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>No existen datos de propietario cuyo pago deba ser registrado</strong>
            </div>`
        );
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para registrar pago de un usuario por adquirir fracciones de inmueble. Ahora este usuario sera un copropietario del inmueble.

$("#guardar_pago_copropietario_inm").click(function (e) {
    let ci_propietario = $("#label_ci_propietario").attr("data-ci");
    let codigo_inmueble = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let val_fracciones_inm = Number($("#f_vender_val").attr("data-f_vender_val")); //Bs
    let f_vender_n = Number($("#f_vender_n").attr("data-f_vender_n")); // CANTAIDAD DE FRACCIONES QUE SERAN VENDIDAS. valido solo para actualizaciones despues de la respuesta del servidor

    if (f_vender_n > 0) {
        if (ci_propietario) {
            // si existe un ci de propietario que registrar ya sea sus datos o pagos

            var paqueteDatos = {
                ci_propietario,
                codigo_inmueble,
                val_fracciones_inm,
            };

            $.ajax({
                type: "POST",
                url: "/laapirest/administracion/general/accion/guardar_pago_copropietario_inm",
                data: paqueteDatos,
            }).done(function (respuestaServidor) {
                var tipoRespuesta = respuestaServidor.exito;

                if (tipoRespuesta == "si") {
                    let val_fracciones_inm = respuestaServidor.val_fracciones_inm;
                    let array_card_fracciones = respuestaServidor.array_card_fracciones;
                    let c_fti_a_val = respuestaServidor.f_val_propietario; // para participacion actual del copropietario
                    let c_fti_a_n = respuestaServidor.f_n_propietario;

                    if (array_card_fracciones.length > 0) {
                        for (let i = 0; i < array_card_fracciones.length; i++) {
                            let codigo_fraccion = array_card_fracciones[i].codigo_fraccion;
                            let fraccion_bs = array_card_fracciones[i].fraccion_bs;

                            // aqui renderizaremos las fracciones de inmueble del cual el propietario acaba de comprar
                        }
                    }

                    //------------------------------------------------
                    // actualizacion de los valores correspondientes aL INMUEBLE sus fracciones:

                    let precio_justo_inm = Number(
                        $("#precio_justo_inm").attr("data-precio_justo_inm")
                    );

                    let ti_f_d_n = Number($(".ti_f_d_n").attr("data-ti_f_d_n"));
                    let ti_f_d_val = Number($(".ti_f_d_val").attr("data-ti_f_d_val"));

                    ti_f_d_n = ti_f_d_n - f_vender_n;
                    ti_f_d_val = ti_f_d_val - val_fracciones_inm;

                    let ti_f_d_n_render = numero_punto_coma_query(ti_f_d_n);
                    let ti_f_d_val_render = numero_punto_coma_query(ti_f_d_val);

                    let aux_ti_f_p = (
                        ((precio_justo_inm - ti_f_d_val) / precio_justo_inm) *
                        100
                    ).toFixed(2);

                    let ti_f_p_render = numero_punto_coma_query(Number(aux_ti_f_p));

                    $(".ti_f_d_n").attr("data-ti_f_d_n", ti_f_d_n);
                    $(".ti_f_d_val").attr("data-ti_f_d_val", ti_f_d_val);

                    $(".ti_f_d_n").text(ti_f_d_n_render);
                    $(".ti_f_d_val").text(ti_f_d_val_render);
                    $(".ti_f_p").text(ti_f_p_render);

                    //-------------------------------------------------------
                    // actualizacion del porcentaje de participacion del copropietario

                    if (c_fti_a_val > 0) {
                        let string_p_participacion = (
                            (c_fti_a_val / precio_justo_inm) *
                            100
                        ).toFixed(2);
                        var c_fti_a_p = Number(string_p_participacion); // numerico con 2 decimales
                        var c_fti_a_p_render = numero_punto_coma_query(c_fti_a_p); // string con coma decimal

                        var c_fti_a_val_render = numero_punto_coma_query(c_fti_a_val);
                    } else {
                        var c_fti_a_p = 0;
                        var c_fti_a_p_render = "0";
                        var c_fti_a_val_render = "0";
                    }

                    var c_fti_a_n_render = numero_punto_coma_query(c_fti_a_n);

                    $(".c_fti_a_n").text(c_fti_a_n_render);
                    $(".c_fti_a_p").text(c_fti_a_p_render);
                    $(".c_fti_a_val").text(c_fti_a_val_render);

                    //--------------------------------------------------------
                    // llevando a valor por defecto
                    $("#f_vender_n").attr("data-f_vender_n", 0);
                    $("#f_vender_n").text("0");
                    //--------------------------------------------------------

                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Fracciones ${val_fracciones_inm} Bs. vendidas con exito.</strong>
                        </div>`
                    );
                }

                if (tipoRespuesta == "insuficiente") {
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-danger mt-3">
                                <button type="button" class="close" data-dismiss="alert">
                                    <span>&times;</span>
                                </button>
                                <strong>Fracciones disponibles insuficientes.</strong>
                            </div>`
                    );
                }

                if (tipoRespuesta == "no") {
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-danger mt-3">
                                <button type="button" class="close" data-dismiss="alert">
                                    <span>&times;</span>
                                </button>
                                <strong>Inmueble no econtrado</strong>
                            </div>`
                    );
                }

                if (tipoRespuesta == "denegado") {
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                        </div>`
                    );
                }
            });
        } else {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_datos_pagos_propietario").after(
                `<div class="alert alert-danger mt-3 mx-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No existen datos de propietario cuyo pago deba ser registrado</strong>
                </div>`
            );
        }
    } else {
        $(".ref_boton_datos_pagos_propietario").after(
            `<div class="alert alert-danger mt-3 mx-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>El número de fracciones a vender debe ser mayor a 0</strong>
            </div>`
        );
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para registrar pago de un usuario por adquirir fracciones de terreno. Ahora este usuario sera un copropietario del terreno.

$("#guardar_pago_copropietario_te").click(function (e) {
    let ci_propietario = $("#label_ci_propietario").attr("data-ci");
    let codigo_terreno = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let val_fracciones_te = Number($("#f_vender_val").attr("data-f_vender_val")); //Bs
    let f_vender_n = Number($("#f_vender_n").attr("data-f_vender_n")); // CANTAIDAD DE FRACCIONES QUE SERAN VENDIDAS. valido solo para actualizaciones despues de la respuesta del servidor

    if (f_vender_n > 0) {
        if (ci_propietario) {
            // si existe un ci de propietario que registrar ya sea sus datos o pagos

            var paqueteDatos = {
                ci_propietario,
                codigo_terreno,
                val_fracciones_te,
            };

            $.ajax({
                type: "POST",
                url: "/laapirest/administracion/general/accion/guardar_pago_copropietario_te",
                data: paqueteDatos,
            }).done(function (respuestaServidor) {
                var tipoRespuesta = respuestaServidor.exito;

                if (tipoRespuesta == "si") {
                    let val_fracciones_inm = respuestaServidor.val_fracciones_inm;
                    let array_card_fracciones = respuestaServidor.array_card_fracciones;
                    let c_fti_a_val = respuestaServidor.f_val_propietario; // para participacion actual del copropietario
                    let c_fti_a_n = respuestaServidor.f_n_propietario;

                    if (array_card_fracciones.length > 0) {
                        for (let i = 0; i < array_card_fracciones.length; i++) {
                            let codigo_fraccion = array_card_fracciones[i].codigo_fraccion;
                            let fraccion_bs = array_card_fracciones[i].fraccion_bs;

                            // aqui renderizaremos las fracciones de inmueble del cual el propietario acaba de comprar
                        }
                    }

                    //------------------------------------------------
                    // actualizacion de los valores correspondientes aL TERRENO sus fracciones:

                    let precio_terreno = Number($("#precio_terreno").attr("data-precio_terreno"));

                    let ti_f_d_n = Number($(".ti_f_d_n").attr("data-ti_f_d_n"));
                    let ti_f_d_val = Number($(".ti_f_d_val").attr("data-ti_f_d_val"));

                    ti_f_d_n = ti_f_d_n - f_vender_n;
                    ti_f_d_val = ti_f_d_val - val_fracciones_inm;

                    let ti_f_d_n_render = numero_punto_coma_query(ti_f_d_n);
                    let ti_f_d_val_render = numero_punto_coma_query(ti_f_d_val);

                    let aux_ti_f_p = (
                        ((precio_terreno - ti_f_d_val) / precio_terreno) *
                        100
                    ).toFixed(2);

                    let ti_f_p_render = numero_punto_coma_query(Number(aux_ti_f_p));

                    $(".ti_f_d_n").attr("data-ti_f_d_n", ti_f_d_n);
                    $(".ti_f_d_val").attr("data-ti_f_d_val", ti_f_d_val);

                    $(".ti_f_d_n").text(ti_f_d_n_render);
                    $(".ti_f_d_val").text(ti_f_d_val_render);
                    $(".ti_f_p").text(ti_f_p_render);

                    //-------------------------------------------------------
                    // actualizacion del porcentaje de participacion del copropietario

                    if (c_fti_a_val > 0) {
                        let string_p_participacion = ((c_fti_a_val / precio_terreno) * 100).toFixed(
                            2
                        );
                        var c_fti_a_p = Number(string_p_participacion); // numerico con 2 decimales
                        var c_fti_a_p_render = numero_punto_coma_query(c_fti_a_p); // string con coma decimal

                        var c_fti_a_val_render = numero_punto_coma_query(c_fti_a_val);
                    } else {
                        var c_fti_a_p = 0;
                        var c_fti_a_p_render = "0";
                        var c_fti_a_val_render = "0";
                    }

                    var c_fti_a_n_render = numero_punto_coma_query(c_fti_a_n);

                    $(".c_fti_a_n").text(c_fti_a_n_render);
                    $(".c_fti_a_p").text(c_fti_a_p_render);
                    $(".c_fti_a_val").text(c_fti_a_val_render);

                    //--------------------------------------------------------
                    // llevando a valor por defecto
                    $("#f_vender_n").attr("data-f_vender_n", 0);
                    $("#f_vender_n").text("0");
                    //--------------------------------------------------------

                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-success mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>Fracciones ${val_fracciones_inm} Bs. vendidas con exito.</strong>
                        </div>`
                    );
                }

                if (tipoRespuesta == "insuficiente") {
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-danger mt-3">
                                <button type="button" class="close" data-dismiss="alert">
                                    <span>&times;</span>
                                </button>
                                <strong>Fracciones disponibles insuficientes.</strong>
                            </div>`
                    );
                }

                if (tipoRespuesta == "no") {
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-danger mt-3">
                                <button type="button" class="close" data-dismiss="alert">
                                    <span>&times;</span>
                                </button>
                                <strong>Terreno no econtrado</strong>
                            </div>`
                    );
                }

                if (tipoRespuesta == "denegado") {
                    $(".ref_boton_datos_pagos_propietario").after(
                        `<div class="alert alert-danger mt-3">
                            <button type="button" class="close" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                            <strong>El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                        </div>`
                    );
                }
            });
        } else {
            // con "after" el nuevo contenido se pondra DESPUES y al MISMO NIVEL
            $(".ref_boton_datos_pagos_propietario").after(
                `<div class="alert alert-danger mt-3 mx-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>No existen datos de propietario cuyo pago deba ser registrado</strong>
                </div>`
            );
        }
    } else {
        $(".ref_boton_datos_pagos_propietario").after(
            `<div class="alert alert-danger mt-3 mx-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>El número de fracciones a vender debe ser mayor a 0</strong>
            </div>`
        );
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para eliminar al copropietario del terreno o inmueble. Se elimina TODOS los datos que relacionan al copropietario con las fracciones del terreno o las fracciones del inmueble, incluyendo los DOCUMENTOS PRIVADOS que tiene el copropietario con dichas fracciones.

$("#eliminar_copropietario").click(function (e) {
    let ci_propietario = $("#label_ci_propietario").attr("data-ci");
    let codigo_objetivo = $("#id_objetivo_codigo").attr("data-objetivo_codigo");
    let clase = $("#clase").attr("data-clase");

    // si existe un ci de propietario que registrar ya sea sus datos o pagos

    var paqueteDatos = {
        ci_propietario,
        codigo_objetivo,
        clase,
    };

    $.ajax({
        type: "POST",
        url: "/laapirest/administracion/general/accion/eliminar_copropietario",
        data: paqueteDatos,
    }).done(function (respuestaServidor) {
        var tipoRespuesta = respuestaServidor.exito;

        if (tipoRespuesta == "si") {

            alert(`Copropietario ${ci_propietario} eliminado. La ventana se recargara`);
            // usamos el metodo DE RECARGAR/ACTUALIZAR LA PAGINA, porque asi se visualizara el pago que efectuo el propietario.
            location.reload();
        }

        if (tipoRespuesta == "denegado") {
            $("#eliminar_copropietario").after(
                `<div class="alert alert-danger mt-3">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>El proyecto presente se encuentra bloqueado, por tanto no es posible realizar cambios</strong>
                </div>`
            );
        }
    });
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// para botones de + y - para la venta de fracciones disponibles a los interesados que desean adquirirlos.

$("body").on("click", ".f_boton", function () {
    let f_boton = $(".f_boton").attr("data-f_boton");

    // numero actual de fracciones para ser vendidas
    let f_vender_n = Number($("#f_vender_n").attr("data-f_vender_n"));

    let sum_f_val = 0;

    // numero TOTAL de fracciones disponibles
    let n_f_disponibles = $(".fraccion_disponible_bs").length;

    if (f_boton === "mas") {
        if (f_vender_n + 1 <= n_f_disponibles) {
            // se permite incrementar las fracciones a vender
            var nuevo_f_vender_n = f_vender_n + 1;
        } else {
            // NO se permite incrementar las fracciones a vender
            var nuevo_f_vender_n = f_vender_n;
        }
    } else {
        if (f_boton === "menos") {
            if (f_vender_n - 1 > 0) {
                // se permite reducir las fracciones a vender, siendo como limite minimo permitido: 1
                var nuevo_f_vender_n = f_vender_n - 1;
            } else {
                // NO se permite reducir las fracciones a vender, por tanto se pondra el valor minimo por defecto: 0
                var nuevo_f_vender_n = 0;
            }
        }
    }

    for (let i = 0; i < nuevo_f_vender_n; i++) {
        let f_val_i = Number(
            $(".fraccion_disponible_bs").eq(i).attr("data-fraccion_disponible_bs")
        );
        sum_f_val = sum_f_val + f_val_i;
    }

    //----------------------------------------------------------------
    // actualizando los valores de las nuevas fracciones a ser vendidas al interesado

    let f_vender_val = sum_f_val;
    let f_vender_val_render = numero_punto_coma_query(f_vender_val);
    let f_vender_n_render = numero_punto_coma_query(nuevo_f_vender_n);

    $("#f_vender_n").attr("data-f_vender_n", nuevo_f_vender_n);
    $("#f_vender_n").text(f_vender_n_render);
    $("#f_vender_val").attr("data-f_vender_val", f_vender_val);
    $("#f_vender_val").text(f_vender_val_render);
    //----------------------------------------------------------------
    // visualizacion de los potenciales valores de n,va, % de fracciones inmueble si el comprador adquiriera las nuevas fracciones de inmueble
    // ESTE FRAGMENTO DE CODIGO SOLO SERA USADO PARA LADO CALCULADORA SIMULACION
    let f_prop_actual = Number($("#f_prop_actual").attr("data-f_prop_actual"));
    let f_n_prop_actual = Number($("#f_n_prop_actual").attr("data-f_n_prop_actual"));

    let precio_justo_inm = Number($("#precio_justo_inm").attr("data-precio_justo_inm"));

    let f_potencial_val = f_prop_actual + sum_f_val;
    let f_potencial_val_render = numero_punto_coma_query(f_potencial_val);

    let string_f_potencial_p = ((f_potencial_val / precio_justo_inm) * 100).toFixed(2);
    let f_potencial_p = Number(string_f_potencial_p); // numerico con 2 decimales
    let f_potencial_p_render = numero_punto_coma_query(f_potencial_p); // string con coma decimal

    let f_potencial_n = f_n_prop_actual + f_vender_n;
    let f_potencial_n_render = numero_punto_coma_query(f_potencial_n);

    $(".f_n_propietario").text(f_potencial_n_render);
    $(".f_val_propietario").text(f_potencial_val_render);
    $(".f_p_propietario").text(f_potencial_p_render);

    //----------------------------------------------------------------
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PARA BUSCAR INVERSOR DEL INMUEBLE COLECTIVO
// NO EXISTE EN HTML EL ID id_campo_ci_inversionista
$("#id_campo_ci_inversionista").keyup(function (e) {
    if ($("#id_campo_ci_inversionista").val() != "") {
        buscaInversorInmueble();
    } else {
        // si esta en vacio (limpiandolo con las teclas)
        // mostramos todos los inversores del inmueble
        $(".cuadro_un_inversionista").attr("hidden", false);

        // borramos los mensajes alert si es que existiesen por seguridad
        $(".alerta_sin_resultados").remove();
    }
});

function buscaInversorInmueble() {
    // borramos los mensajes alert si es que existiesen por seguridad
    $(".alerta_sin_resultados").remove();

    let ci_buscar = $("#id_campo_ci_inversionista").val();

    let n_inversores = $(".cuadro_un_inversionista").length;

    let n_encontrados = 0;

    // ocultamos todos los inversores presentes
    $(".cuadro_un_inversionista").attr("hidden", true);

    for (let i = 0; i < n_inversores; i++) {
        let ci_inversor_i = $(".eliminador_inversionista").eq(i).attr("data-id");

        //if (ci_inversor_i == ci_buscar) {
        if (ci_inversor_i.indexOf(ci_buscar) != -1) {
            $(".cuadro_un_inversionista").eq(i).attr("hidden", false); // mostramos el ci encontrado
            n_encontrados = n_encontrados + 1;
        }
    }

    // despues de recorrer la busqueda en todos los inversores
    if (n_encontrados == 0) {
        $("#ref_mensaje_busqueda").after(
            `<div class="alerta_sin_resultados alert alert-danger mt-3 mx-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Inversionista no encontrado!</strong>
            </div>`
        );
    }
}
