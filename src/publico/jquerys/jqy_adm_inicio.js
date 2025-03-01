// CONTIENE TODA LA LOGICA DE INICIOS DE VENTANAS DE "PROYECTO", "INMUEBLE"

// PARA CUANDO LA PAGINA SE CARGUE (proyecto, inmueble)
$(document).ready(function () {
    
    /************************************************************************************ */

    // PARA LAS OPCIONES DE RADIO (MAESTRO PARA TODOS LOS QUE TIENE RADIOS, PARA QUE ESTOS ESTEN DEVIDAMENTE SELECCIONADOS AL RENDERIZARSE LA VENTANA)
    // NO SE APLICA PARA LOS RADIOS QUE EXISTAN EN: FILTRADOR ORDENADOR DE INMUEBLES DENTRO DE PY, PROPIETARIO
    // TAMBIEN NO SE APLICA PARA LOS RADIOS QUE EXISTAN EN LAS OPCIONES DEL "BUSCADOR DESPLEGABLE LADO CLIENTE"

    var n_inputs_radios = $(".radio_seleccionado").length;

    if (n_inputs_radios > 0) {
        for (let i = 0; i < n_inputs_radios; i++) {
            var valor_input_radio = $(".radio_seleccionado").eq(i).val();
            var data_input = $(".radio_seleccionado").eq(i).attr("data-input_radio");
            var n_radios = $("." + data_input).length;
            for (let k = 0; k < n_radios; k++) {
                let valor_radio = $("." + data_input)
                    .eq(k)
                    .attr("value");
                if (valor_radio == valor_input_radio) {
                    $("." + data_input)
                        .eq(k)
                        .click(); // ES como hacer click manualmente sobre el radio
                    break;
                }
            }
        }
    }

    /************************************************************************************ */
    // PARA RENDERIZAR LOS TEXTOS RESPETANDO LOS SALTOS DE LINEA
    var n_escrituras = $(".escritura").length;
    if (n_escrituras > 0) {
        for (let k = 0; k < n_escrituras; k++) {
            // es importante usar aqui ".text()" para que lea las etiquetas html (si es que existiesen) como tal, por ejemplo si existe un salto de linea como "<br>" el text lo leera como tal y luego usando el ".html()" lo inyectara (reemplazando contenido si es que existiese) como html dentro de ".escritura".
            // si en lugar de ".text()" se hubiese usado ".html()" entonces etiquetas como "<br>" hubiesen sido leidas como "&lgh ???" y no hubiesen sido leidos como tal "<br>"
            var contenido = $(".escritura").eq(k).text();
            $(".escritura").eq(k).html(contenido);
        }
    }

    /************************************************************************************ */
    // AQUI PODEMOS AGREGAR CODIGO PARA TRATAMIENTO DE CARGADO DE LA VENTANA, POR EJEMPLO QUE RADIOS ESTARAN ACTIVADOS O SELECCIONADOS, DEPENDIENDO DEL VALOR DE SU INPUT, RECUERDE SI ES UN FORMULARIO QUE YA CUENTA CON DATOS LLENADOS, LA FUNCION QUE LOS RENDERIZA, YA PINTA LOS DATOS, ASI QUE SOLO ES CUESTION DE LEER ESTOS DATOS Y CON ESOS DARLE LOS TRATAMIENTOS RESPECTIVOS

    var tipo_ventana = $("#id_tipo_ventana").attr("data-tipo_ventana");

    var objetivo_tipo = $("#id_objetivo_tipo").attr("data-objetivo_tipo");

    /***************************** VENTANA INMUEBLE ********************************************* */
    /***************************** VENTANA INMUEBLE ********************************************* */
    /*
    if (objetivo_tipo === "inmueble") {

    }
    */
    /***************************** VENTANA PROYECTO ********************************************* */
    /***************************** VENTANA PROYECTO ********************************************* */

    if (objetivo_tipo === "proyecto") {
        // --------------------------------------------------------------
        // para mostrar TODOS los inmuebles por defecto DEL PROYECTO
        if (tipo_ventana == "ventana_adm_py_descripcion") {
            // seleccionamos el radio tipo de proyecto (edifico || condominio)

            let radio_input_tipo_proyecto = $(".radio_input_tipo_proyecto").val();

            if (radio_input_tipo_proyecto == "edificio") {
                $(".radio_tipo_proyecto").eq(0).click();
            }

            if (radio_input_tipo_proyecto == "condominio") {
                $(".radio_tipo_proyecto").eq(1).click();
            }
        }

        // --------------------------------------------------------------
        // para los CUADROS check de la pestaña ESTADO DEL PROYECTO
        if (tipo_ventana == "ventana_adm_py_estados") {

            let tipo_boolean_visible = $(".input_visibilidad_proyecto").val();
            // solo cuando es true, si es false se lo deja tal como esta sin hacer click
            if (tipo_boolean_visible == "true") {
                $(".casilla_py_visible").click();
            }
        }

        // --------------------------------------------------------------
        // para el CUADRO DE VISIBILIDAD de REQUERIMIENTOS del PROYECTO
        if (tipo_ventana == "ventana_adm_py_requerimientos") {
            let tipo_boolean_eleccion = $(".input_visibilidad_requerimientos").val();
            // solo cuando es true, si es false se lo deja tal como esta sin hacer click
            if (tipo_boolean_eleccion == "true") {
                $(".casilla_requerimientos_visible").click();
            }
        }

        // --------------------------------------------------------------
        // para el CUADRO DE VISIBILIDAD de RESPONSABILIDAD SOCIAL
        if (tipo_ventana == "ventana_adm_py_rs") {
            let tipo_boolean_eleccion = $(".input_visibilidad_rs").val();
            // solo cuando es true, si es false se lo deja tal como esta sin hacer click
            if (tipo_boolean_eleccion == "true") {
                $(".casilla_rs_visible").click();
            }
        }

        // --------------------------------------------------------------
        // para mostrar TODOS los inmuebles por defecto DEL PROYECTO
        if (tipo_ventana == "ventana_adm_py_inmuebles") {
            // seleccionamos el radio tipo por defecto "todos"
            $("#tipo_radio_inm_py .radio_inm_py").eq(0).click(); // este click ejecuta por defecto el la primera opcion de ordenamiento por defecto (por lo escrito en su respectivo JQUERY)
            /// !!!! NOTESE COMO DE AQUI SE ENTRA A OTRA FUNCION Y DE ESA SE PASA A OTRA FUNCION Y CUANDO TODAS ESAS TERMINE, SE RETORNA A ESTA PARA CONTINUAR CON LAS LINEAS DE CODIGO QUE PUDIERAN EXISTIR DEBAJO DE ESTA
        }

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    }

    /***************************** VENTANA PROPIETARIO *************************************** */
    /***************************** VENTANA PROPIETARIO ************************************** */

    if (objetivo_tipo === "propietario") {
        /*
        // PARA EL CUADRO DESPLEGABLE DE "CIUDAD"

        // este valor puede ya venir de la renderizacion, si se tratase de un dato ya llenado con anterioridad
        let valorCiudad = $("#id_inversor_departamento").val();

        // si existe dato de "ciudad"
        if (valorCiudad != undefined || valorCiudad != "") {
            $("#selector_ciudad_inversor").val(valorCiudad);
        }
        */

        let tipo_pestana_prop = $("#tipo_pestana_prop").attr("data-id");

        //alert("el tipo de pestaña del PROPIETARIO es: "+tipo_pestana_prop);

        //alert('la pestaña es: ' + tipo_pestana_prop);
        if (tipo_pestana_prop == "propiedades_propietario") {
            // --------------------------------------------------------------
            // PARA VISUALIZAR LOS INMUEBLES QUE TIENE EL PROPIETARIO
            // seleccionamos el radio tipo por defecto "todos"
            $("#tipo_radio_inm_py .radio_inm_py").eq(0).click(); // este click ejecuta por defecto el la primera opcion de ordenamiento por defecto (por lo escrito en su respectivo JQUERY)
            /// !!!! NOTESE COMO DE AQUI SE ENTRA A OTRA FUNCION Y DE ESA SE PASA A OTRA FUNCION Y CUANDO TODAS ESAS TERMINE, SE RETORNA A ESTA PARA CONTINUAR CON LAS LINEAS DE CODIGO QUE PUDIERAN EXISTIR DEBAJO DE ESTA
        }

        //----------------------------------------------------------------------------
        // para segunderos $us/seg COMO ES EL UNICO EN LADO ADMINISTRADOR QUE TENDRA SEGUNDERO, ENTONCES ESTARA BIEN QUE LA FUNCION SEGUNDERO QUEDE DENTRO DE "PROPIETARIO"
        let segundero = $(".segundero_propietario").attr("data-segundero");
        if (segundero == "si") {
            sus_seg();
        }
    }

    /******************** VENTANA INICIO DEL ADMINISTRADOR *********************************** */

    if (tipo_ventana == "administrador-acceso") {
        $("#id_body").addClass("body-imagen-fondo");
        $("#id_body").removeClass("inicio_h_v"); // antes no estaba
    } else {
        // normal

        if (tipo_ventana == "administrador-inicio") {
            $("#id_body").removeClass("body-imagen-fondo");
            $("#id_body").addClass("inicio_h_v"); // antes no estaba

            // antes no estaba
            // esto es para cuando la pagian se cargue o aparesca por primera vez
            dim_ventana_inicio();
        }
    }

    function sus_seg() {
        // EL SEGUNDERO, AL IGUAL QUE TODAS LAS UNIDADES MONETARIAS EN EL LADO DEL ADMINISTRADOR ESTARA SIEMPRE EN BOLIVIANOS BS.
        setInterval(() => {

            //----------------------------------------------------------------------------
            // SEGUNDERO DE PLUSVALIA

            var plus_r = 0;
            var a_plus_r = [];
            var plus_fechaInicio = new Date();
            var plus_fechaFin = new Date();

            var p_verificador = 0;

            var s_plus_t = 0;
            var s_plus_r = 0;

            var n_plus = $("#contenedor_seg_plus .cuerpo_plus").length;
            if (n_plus > 0) {
                for (let i = 0; i < n_plus; i++) {
                    plus_r = Number(
                        $("#contenedor_seg_plus .cuerpo_plus .plus_r").eq(i).attr("data-plus_r")
                    );

                    a_plus_r[i] = plus_r;

                    let aux_r_fi = $("#contenedor_seg_plus .cuerpo_plus .plus_fechaInicio")
                        .eq(i)
                        .attr("data-plus_fechaInicio");

                    plus_fechaInicio = new Date(aux_r_fi); // convertimos a formato fecha

                    let aux_r_ff = $("#contenedor_seg_plus .cuerpo_plus .plus_fechaFin")
                        .eq(i)
                        .attr("data-plus_fechaFin");

                    plus_fechaFin = new Date(aux_r_ff); // convertimos a formato fecha

                    s_plus_t = s_plus_t + ((plus_fechaFin - plus_fechaInicio) / 1000) * plus_r;

                    let r_d_t = (plus_fechaFin - plus_fechaInicio) / 1000;
                    let r_d_p = (new Date() - plus_fechaInicio) / 1000;

                    if (r_d_p >= r_d_t) {
                        s_plus_r = s_plus_r + r_d_t * plus_r;
                    }
                    if (r_d_p < r_d_t) {
                        s_plus_r = s_plus_r + r_d_p * plus_r;
                    }

                    if (plus_r != 0) {
                        p_verificador = p_verificador + 1;
                    }
                }
            }

            if (p_verificador == 0) {
                $("#entero_tot_ret_alq").text("0");

                //$("#decimales_tot_ret_alq").text(",000");
                $(".cd").eq(0).text(",");
                $(".cd").eq(1).text("0");
                $(".cd").eq(2).text("0");
                $(".cd").eq(3).text("0");
                //$(".cd").eq(4).attr("hidden", false); // ocultamos
                $(".cd").eq(4).css("display", "none"); // ocultamos

                let r_aux_string_progre = "0" + "%";
                $("#ref_progreso_generandose").css("width", r_aux_string_progre);
                $("#ref_valor_progreso_generandose").text(r_aux_string_progre);
            } else {
                // Usar Math.max con el operador de propagación para obtener el valor máximo
                let plus_r_max = Math.max(...a_plus_r); // el valor maximo de Bs/seg

                let string_plus_r_max = plus_r_max.toString();

                for (let t = 0; t < string_plus_r_max.length; t++) {
                    // las posiciones de una cadena empiezan desde CERO
                    let porsion = string_plus_r_max.substring(t, t + 1);

                    if (porsion != "0" && porsion != ".") {
                        //console.log("entramos al caracter dist cero: " + t);
                        // entonces la posicion es el de un numero superior a cero
                        var n_casillas_deci = t - 1;
                        break; // para salir de este bucle for
                    }
                }

                let string_s_plus_r = s_plus_r.toString();
                let array_aux = string_s_plus_r.split(".");
                let val_entero = array_aux[0];
                let aux_decimal = array_aux[1].substring(0, n_casillas_deci);

                //---------------------------------------------------------
                // "val_entero" se lo convertira en formato español punto mil:
                let el_numero = Number(val_entero);
                let aux_num_string = el_numero.toLocaleString("en"); // LO DEVUELVE EN FORMATO INGLES Y EN STRING

                let numero_convertido = aux_num_string
                    .replace(".", "#")
                    .replace(",", ".")
                    .replace("#", ","); // LO CONVIERTE A FORMATO ESPAÑOL, Y EN STRING

                $("#entero_tot_ret_alq").text(numero_convertido);

                //==========================================================
                var arr = Array.from(aux_decimal); // convierte a "aux_decimal" en un array separandolo en cada uno de sus caracteres. ej/ 539 = [5, 3, 9]
                // ncd = 5: número de ".cd" caracteres para decimales (incluido la coma,)
                // n_casillas_deci: número de decimales ( sin inluir la coma, )
                var ncd = 5;
                if (ncd > n_casillas_deci) {
                    $(".cd").eq(0).text(",");
                    for (var ii = 0; ii < arr.length; ii++) {
                        $(".cd")
                            .eq(ii + 1)
                            .text(arr[ii]);
                    }

                    // ocultamos las casillas que no seran llenadas con decimales
                    for (let j = ii + 1; j < ncd; j++) {
                        $(".cd").eq(j).css("display", "none"); // ocultamos
                    }
                } else {
                    // entonces solo seran mostrados hasta maximo: 4 digitos de los decimales, que incluido con la coma "," ocuparan la totalidad de los 5 ".cd"
                    for (let k = 0; k < ncd; k++) {
                        $(".cd")
                            .eq(k + 1)
                            .text(arr[k]);
                    }
                }
                //==========================================================

                let porcen_progreso = ((s_plus_r / s_plus_t) * 100).toFixed(2); // con 2 decimales
                let aux_string_progre = porcen_progreso + "%";
                $("#ref_progreso_generandose").css("width", aux_string_progre);

                let num_punto_coma = numero_punto_coma_query(porcen_progreso);

                let formato_punto_coma = num_punto_coma + " %";
                $("#ref_valor_progreso_generandose").text(formato_punto_coma);
            }

            //----------------------------------------------------------------------------

        }, 1000);
    }

    /*
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    function numero_punto_coma_query(numero) {
        // como ejemplo:
        // 2275730.88; // tipo numerico
        // sera convetido a string ingles: 2,275,730.88
        // finalmente sera convertido a string español: 2.275.730,88

        // convertimos a numerico por seguridad
        var el_numero = Number(numero);
        if (el_numero > 0) {
            var aux_num_string = el_numero.toLocaleString("en"); // LO DEVUELVE EN FORMATO INGLES Y EN STRING

            // dividimos el string numero en ","
            var array_1 = aux_num_string.split(",");
            // unimos el array con "*" en el lugar de las ","
            var numero_string_2 = array_1.join("*");

            // dividimos el string numero en "."
            var array_2 = numero_string_2.split(".");
            // unimos el array con "," en el lugar de las "."
            var numero_string_3 = array_2.join(",");

            // dividimos el string numero en "*"
            var array_3 = numero_string_3.split("*");
            // unimos el array con "." en el lugar de las "*"
            var numero_string_4 = array_3.join(".");

            var numero_convertido = numero_string_4; // NUMERO CONVERTIDO A FORMATO ESPAÑOL, Y EN STRING

            return numero_convertido; // DEVUELVE COMO STRING
        } else {
            return 0;
        }
    }
        */
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
});

/************************************************************************************* */
/************************************************************************************* */

$(".boton_buscar_gestionador").click(function (e) {
    e.preventDefault();

    let objetivo_busqueda = $(".campo_buscador_gestionador").val().toLowerCase(); // llevado a minuscula

    if (objetivo_busqueda != "") {
        let paqueteDatos = {
            objetivo_busqueda,
        };

        $.ajax({
            url: "/laapirest/buscar_desde_gestionador/",
            type: "POST",
            data: paqueteDatos,
        }).done(function (respuestaServidor) {
            var laRespuesta = respuestaServidor.exito;

            if (laRespuesta == "si") {
                if (respuestaServidor.se_trata == "terreno") {
                    // /laapirest/terreno/:codigo_terreno/:ventana_terreno
                    var rutaServidor = "/laapirest/terreno/" + objetivo_busqueda + "/descripcion";
                    $("#form_visualizador_resultado").attr("action", rutaServidor);

                    // IMPORTANTE, PORQUE LE INDICAMOS AL FORMULARIO QUE HAGA "submit", es decir que se dirija a la ruta que se le creo guardao en "rutaServidor" y que le agregamos como "attr" 'action'
                    $("#form_visualizador_resultado").submit();
                }

                if (respuestaServidor.se_trata == "proyecto") {
                    // /laapirest/proyecto/:codigo_proyecto/descripcion
                    var rutaServidor = "/laapirest/proyecto/" + objetivo_busqueda + "/descripcion";
                    $("#form_visualizador_resultado").attr("action", rutaServidor);

                    // IMPORTANTE, PORQUE LE INDICAMOS AL FORMULARIO QUE HAGA "submit", es decir que se dirija a la ruta que se le creo guardao en "rutaServidor" y que le agregamos como "attr" 'action'
                    $("#form_visualizador_resultado").submit();
                }

                if (respuestaServidor.se_trata == "inmueble") {
                    // /laapirest/inmueble/:codigo_inmueble/descripcion
                    var rutaServidor = "/laapirest/inmueble/" + objetivo_busqueda + "/descripcion";
                    $("#form_visualizador_resultado").attr("action", rutaServidor);

                    $("#form_visualizador_resultado").submit();
                }

                if (respuestaServidor.se_trata == "inversionista") {
                    // /laapirest/propietario/:ci_propietario/:ventana_propietario
                    var rutaServidor = "/laapirest/propietario/" + objetivo_busqueda + "/datos";
                    $("#form_visualizador_resultado").attr("action", rutaServidor);

                    $("#form_visualizador_resultado").submit();
                }

                if (respuestaServidor.se_trata == "requerimiento") {
                    var codigo_proyecto = respuestaServidor.codigo_proyecto;
                    // /laapirest/proyecto/:codigo_proyecto/requerimientos
                    var rutaServidor = "/laapirest/proyecto/" + codigo_proyecto + "/requerimientos";
                    $("#form_visualizador_resultado").attr("action", rutaServidor);

                    $("#form_visualizador_resultado").submit();
                }
            }

            if (laRespuesta == "no") {
                alert("No se encontraron resultados");
            }
        });
    } else {
        alert(
            "Introduzca el C.I. o el código de: terreno, proyecto, inmueble o requerimiento que desea buscar"
        );
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// $("#id_crear_terreno").click(function (e) {
$("#id_crear_terreno").on("submit", function (e) {
    e.preventDefault(); // para impedir el acceso a la ruta url por defecto
    let usuario_maestro = $("#id_usuario_maestro_modal").val();
    let clave_maestro = $("#id_clave_maestro_modal").val();

    if (usuario_maestro != "" && clave_maestro != "") {
        let paquete_datos = {
            usuario_maestro,
            clave_maestro,
        };

        $.ajax({
            url: "/laapirest/verificarmaestras",
            type: "post",
            data: paquete_datos,
            // cache: false, // IMPORTANTE QUE ESTE ESTO PARA ENVIO DE DATOS INPUTS DE FORMULARIO
            // contentType: false, // IMPORTANTE QUE ESTE ESTO PARA ENVIO DE DATOS INPUTS DE FORMULARIO
            // processData: false // IMPORTANTE QUE ESTE ESTO PARA ENVIO DE DATOS INPUTS DE FORMULARIO
        }).done(function (respuestaServidor) {
            var tipoRespuesta = respuestaServidor.exito;
            if (tipoRespuesta == "si") {
                //cerramos la ventana modal
                $(".aux_cerrar_np").click(); // haciendo click en su boton de cerrar
                // creamos la action ruta del formulario
                var rutaServidor = "/laapirest/terreno";
                $("#id_form_crear_terreno").attr("action", rutaServidor);

                // usamos "attr value" y no val, para que sea escrito en el html (recuerde que "VAL" escribe en el input pero solo visible para el usuario, pero no en el HTML)
                $("#ci_administrador_creador").attr("value", respuestaServidor.ci_administrador);

                // IMPORTANTE, PORQUE LE INDICAMOS AL FORMULARIO QUE HAGA "submit", es decir que se dirija a la ruta que se le creo guardao en "rutaServidor" y que le agregamos como "attr" 'action'
                $("#id_form_crear_terreno").submit();
            }

            if (tipoRespuesta == "no") {
                $(".ref-crear_terreno").after(
                    `<div class="alert alert-danger mt-3">
                        <button type="button" class="close" data-dismiss="alert">
                            <span>&times;</span>
                        </button>
                        <strong>Claves maestras incorrectas!</strong>
                    </div>`
                );
            }
        });
    } else {
        $(".ref-crear_terreno").after(
            `<div class="alert alert-danger mt-3">
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
                <strong>Llene todos los campos!</strong>
            </div>`
        );
    }
});

/**************************************************************************** */
// esta funcion se ejecutara para cuando la pagina se modifique manualmente las dimensiones de la ventana o cuando se cambia de pocision el smartphone
$(window).resize(function () {
    var tipo_ventana = $("#id_tipo_ventana").attr("data-tipo_ventana");
    if (tipo_ventana == "administrador-inicio") {
        dim_ventana_inicio();
    }
});

//---------------------------------------------

function dim_ventana_inicio() {
    
    //---------------------------------------------
    // para cambiar la "background-image" dependiendo de las diensiones de la ventana

    var ventana_madre_ancho = $(window).width(); // resultado en px

    //console.log("ancho ventana madre: " + ventana_madre_ancho);

    // inicialmente ya esta condicionado que estamos en la ventana de inicio del administrador (ventana de la caida de cuadros), por tanto esta ventana cuenta con las url de las imagenes: vertica y horizontal
    var url_vertical = $("#url_vertical").attr("data-url_img");
    var url_horizontal = $("#url_horizontal").attr("data-url_img");

    var css_horizontal = `linear-gradient(rgba(16, 16, 21, 0.8), rgba(14, 14, 23, 0.8)),
    url(${url_horizontal})`;

    var css_vertical = `linear-gradient(rgba(16, 16, 21, 0.8), rgba(14, 14, 23, 0.8)),
    url(${url_vertical})`;

    if (ventana_madre_ancho >= 768) {
        // si es igual o mayor que 768px
        $(".inicio_h_v").css("background-image", css_horizontal);
    } else {
        // si es menor que 768px
        $(".inicio_h_v").css("background-image", css_vertical);
    }

    //---------------------------------------------
    // para animacion de las cajas caidas de una en una

    // var ventana_ancho = $(window).width(); // resultado en px
    // var ventana_alto = $(window).height(); // resultado en px
    var ventana_ancho = $(".contenedor-icono-info-hijo").width(); // resultado en px
    //console.log("ancho contenedor hijo: " + ventana_ancho);
    //var ventana_alto = $(".contenedor-icono-info-hijo").height(); // resultado en px
    var n = $(".contenedor-icono-info-1").length;
    var separacion_i = [];
    var array_porcen_separ_izq = [10, 95, 50, 20, 80, 40];
    for (let i = 0; i < n; i++) {
        let ancho_i = $(".contenedor-icono-info-1").eq(i).width();
        //console.log("ancho elemento: " + ancho_i);
        separacion_i[i] = (ventana_ancho - ancho_i) * (array_porcen_separ_izq[i] / 100); // en px
        $(".contenedor-icono-info-1").eq(i).css("left", separacion_i[i]);
        //console.log(separacion_i[i]);
    }

    //---------------------------------------------

    //alert("ancho: " + ventana_ancho + "alto: " + ventana_alto);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function numero_punto_coma_query(numero) {
    // como ejemplo:
    // 2275730.88; // tipo numerico
    // sera convetido a string ingles: 2,275,730.88
    // finalmente sera convertido a string español: 2.275.730,88

    // convertimos a numerico por seguridad
    var el_numero = Number(numero);
    if (el_numero > 0) {
        var aux_num_string = el_numero.toLocaleString("en"); // LO DEVUELVE EN FORMATO INGLES Y EN STRING

        // dividimos el string numero en ","
        var array_1 = aux_num_string.split(",");
        // unimos el array con "*" en el lugar de las ","
        var numero_string_2 = array_1.join("*");

        // dividimos el string numero en "."
        var array_2 = numero_string_2.split(".");
        // unimos el array con "," en el lugar de las "."
        var numero_string_3 = array_2.join(",");

        // dividimos el string numero en "*"
        var array_3 = numero_string_3.split("*");
        // unimos el array con "." en el lugar de las "*"
        var numero_string_4 = array_3.join(".");

        var numero_convertido = numero_string_4; // NUMERO CONVERTIDO A FORMATO ESPAÑOL, Y EN STRING

        return numero_convertido; // DEVUELVE COMO STRING
    } else {
        return 0;
    }
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
