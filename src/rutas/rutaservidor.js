// creamos las rutas del servidor, dependiendo de que rutas se elija (por accion del usuario desde su navegador) el servidor ejecutara las tareas que se le encomienden de acuerdo a las funciones del los controladores

const express = require("express");

const laRuta = express.Router();

// validador de cuenta de administrador y de cliente
const validador = require("../ayudas/validador_adm_prop");
//------------------------------------------------------------------
// controladores para el lado del GESTIONADOR O  ADMINISTRADOR

const controladorAdmGenerales = require("../controladores/adm_generales");

const controladorParaInicio = require("../controladores/adm_inicio");

const controladorAdmTerreno = require("../controladores/adm_terreno");

const controladorAdmProyecto = require("../controladores/adm_proyecto");

const controladorAdmInmueble = require("../controladores/adm_inmueble");

const controladorAdmFraccion = require("../controladores/adm_fraccion");

const controladorAdmPropietario = require("../controladores/adm_propietario");

const controladorAdmAdministrador = require("../controladores/administrador");

//------------------------------------------------------------------
// controladores para el lado del CLIENTE
const controladorCliInicio = require("../controladores/cli_inicio");

const controladorCliInversionista = require("../controladores/cli_propietario");

const controladorCliTerreno = require("../controladores/cli_terreno");

const controladorCliProyecto = require("../controladores/cli_proyecto");

const controladorCliInmueble = require("../controladores/cli_inmueble");

const controladorCliFraccion = require("../controladores/cli_fraccion");

const controladorEmpresa = require("../controladores/cli_empresa");

//------------------------------------------------------------------

module.exports = function (servidorDamosRutas) {
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++       RUTAS CLIENTE     +++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // RUTA PARA LA VENTANA DE INICIO DEL CLIENTE
    laRuta.get("/", validador.validar_cli_2, controladorCliInicio.inicioCliente);

    // RUTA PARA BUSQUEDA DE INMUEBLE
    laRuta.post(
        "/inmuebles/resultados",
        validador.validar_cli_2,
        controladorCliInicio.buscarInmueble
    );

    // RUTA PARA BUSQUEDA DE REQUERIMIENTOS
    laRuta.post(
        "/requerimientos/resultados",
        validador.validar_cli_2,
        controladorCliInicio.buscarRequerimientos
    );

    // RUTA PARA BUSQUEDA DE TERRENO, que tienen fracciones disponibles
    laRuta.post(
        "/fracciones_terreno/resultados",
        validador.validar_cli_2,
        controladorCliInicio.buscarFraccionesTerreno
    );

    // RUTA PARA RENDERIZAR LOS PROYECTOS SEGUN SU TIPO DE ESTADO LADO PUBLICO CLIENTE
    laRuta.get(
        "/ventana/:tipo_ventana",
        validador.validar_cli_2,
        controladorCliInicio.cliProyectosVariosTipos
    );

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // RUTA PARA PIE DE PÁGINA LADO CLIENTE

    // RUTA PARA "COMO FUNCIONA"
    laRuta.get("/empresa/como_funciona", validador.validar_cli_2, controladorEmpresa.comoFunciona);

    // RUTA PARA "QUIENES SOMOS"
    laRuta.get("/empresa/quienes_somos", validador.validar_cli_2, controladorEmpresa.quienesSomos);

    // RUTA PARA "PREGUNTAS FRECUENTES"
    laRuta.get(
        "/empresa/preguntas_frecuentes",
        validador.validar_cli_2,
        controladorEmpresa.preguntasFrecuentes
    );

    // RUTA PARA EXTRACCION DEL TIPO DE CAMBIO OFICIAL DE LA MONEDA
    laRuta.post(
        "/empresa/operacion/tipo_cambio",
        validador.validar_cli_2,
        controladorEmpresa.tipo_cambio
    );

    //===================================================================================
    //===================================================================================
    // RUTAS PROPIETARIO LADO PUBLICO CLIENTE

    //----------------------------------------------------------------------------------
    // RUTA PARA VERIFICAR LAS CLAVES (usuario y contraseña) DE ACCESO DEL PROPIETARIO

    laRuta.post("/verificarclavescli", controladorCliInversionista.verificarClavesCli); // ok

    laRuta.get("/revision_acceso_cli/acceso_fallado", controladorCliInversionista.cli_incorrecto);
    laRuta.get("/revision_acceso_cli/acceso_permitido", controladorCliInversionista.cli_correcto);

    //----------------------------------------------------------------------------------

    // PARA RENDERIZAR VENTANA DEL PROPIETARIO
    laRuta.get(
        "/propietario/:ci_propietario/:ventana_propietario",
        validador.validar_cli_2, // AQUI ES DONDE SE VALIDA AL CLIENTE CUANDO ESTE INTENTA INGRESAR A SU CUENTA PERSONAL
        controladorCliInversionista.renderizarVentanaPropietarioCli
    );

    // PARA CERRAR VENTANA DEL PROPIETARIO
    laRuta.get(
        "/ventana/inversor/cerrar",
        validador.validar_cli_2,
        controladorCliInversionista.cerrarInversor
    );

    // PARA GUARDAR O DES-GUARDAR INMUEBLE QUE SELECCIONA EL INVERSOR
    laRuta.post(
        "/inversor/operacion/guardar-inmueble",
        validador.validar_cli_2,
        controladorCliInversionista.guardarInmueble
    );

    // PARA CAMBIAR LAS CLAVES DE ACCESO DEL INVERSOR
    laRuta.post(
        "/inversor/operacion/cambiar-claves",
        validador.validar_cli_2,
        controladorCliInversionista.cambiarClavesAcceso
    );

    // PARA ADQUIRIR FRACCIONES DE INMUEBLE EMPLEANDO FRACCIONES DE TERRENO
    laRuta.post(
        "/propietario/accion/adquirir_fraccion_inm",
        validador.validar_cli_2,
        controladorCliInversionista.adquirirFraccionInm
    );

    // PARA DESHACER FRACCIONES DE INMUEBLE ADQUIRIDAS
    laRuta.post(
        "/propietario/accion/deshacer_fraccion_inm",
        validador.validar_cli_2,
        controladorCliInversionista.deshacerFraccionInm
    );

    //===================================================================================
    //===================================================================================
    // RUTAS TERRENO DESDE LADO PUBLICO CLIENTE

    // RUTA PARA RENDERIZAR LA VENTANA DEL TERRENO, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/terreno/:codigo_terreno/:vista_te",
        validador.validar_cli_2,
        controladorCliTerreno.renderVentanaTerreno
    );

    // PARA LECTURA DE PRONOSTICO PRECIOS $us/m2 DEL TERRENO
    laRuta.post(
        "/terreno/operacion/pronostico_precio_m2",
        validador.validar_cli_2,
        controladorCliTerreno.pronostico_precio_m2
    );

    //===================================================================================
    //===================================================================================
    // RUTAS PROYECTO DESDE LADO PUBLICO CLIENTE

    // RUTA PARA RENDERIZAR LA VENTANA DEL PROYECTO, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/proyecto/:codigo_proyecto/:vista_py",
        validador.validar_cli_2,
        controladorCliProyecto.renderVentanaProyecto
    );

    //===================================================================================
    //===================================================================================
    // RUTAS INMUEBLE DESDE LADO PUBLICO CLIENTE

    // PARA LECTURA DE PRONOSTICO PRECIOS $us/m2 DEL TERRENO
    laRuta.post(
        "/inmueble/operacion/pronostico_precio_m2",
        validador.validar_cli_2,
        controladorCliInmueble.pronostico_precio_m2
    );

    // RUTA PARA RENDERIZAR LA VENTANA DEL INMUEBLE, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/inmueble/:codigo_inmueble/:vista_inm",
        validador.validar_cli_2,
        controladorCliInmueble.renderVentanaInmueble
    );

    //===================================================================================
    //===================================================================================
    // RUTAS FRACCION DESDE LADO PUBLICO CLIENTE

    // RUTA PARA RENDERIZAR LA VENTANA DE LA FRACCION, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/fraccion/:codigo_fraccion/:vista_fraccion",
        validador.validar_cli_2,
        controladorCliFraccion.renderVentanaFraccion
    );

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++   RUTAS ADMINISTRADOR   +++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //-----------------------------------------------------------------------------------
    // RUTA PRINCIPAL DE INICIO DEL GESTIONADOR
    laRuta.get("/laapirest", controladorParaInicio.indexInicio); //

    //-----------------------------------------------------------------------------------
    // RUTA PARA VERIFICAR LAS CLAVES DE ACCESO AL SISTEMA
    //aqui no es necesario validar al administrador, porque primero se debe permitir enviar con POST los datos de usuario y contraseña, para que estos sean analizados.
    laRuta.post("/laapirest/verificarclavesadm", controladorParaInicio.verificarClavesAdm); // ok

    laRuta.get(
        "/laapirest/revision_acceso_adm/acceso_fallado",
        controladorParaInicio.adm_incorrecto
    );
    laRuta.get(
        "/laapirest/revision_acceso_adm/acceso_permitido",
        controladorParaInicio.adm_correcto
    );

    //-----------------------------------------------------------------------------------
    // RUTA PARA RENDERIZAR LA VENTANA DE INICIO DEL SISTEMA
    // aqui si es necesario VALIDAR AL ADMINISTRADOR, porque esta ruta es la que RENDERIZA LA VISTA
    laRuta.get(
        "/laapirest/accesosistema",
        validador.validar_adm, // AQUI ES DONDE POR PRIMERA VEZ SE VALIDA AL ADMINISTRADOR
        controladorParaInicio.inicioSistema
    ); // OK

    //-----------------------------------------------------------------------------------

    // PARA PERMISO DE CREAR NUEVO PROYECTO DEL TERRENO (no se creara un nuevo proyecto como tal, sino mas bien se verificara que el terreno no este bloqueado y que aun quede espacion para nuevos proyecto dentro del terreno)
    laRuta.post(
        "/laapirest/administracion/general/accion/permiso_nuevo_proyecto",
        validador.validar_adm,
        controladorAdmGenerales.permisoNuevoProyecto
    );

    // PARA PERMISO DE CREAR NUEVO PROYECTO DEL INMUEBLE (no se creara un nuevo INMUEBLE como tal, sino mas bien se verificara que el terreno no este bloqueado)
    laRuta.post(
        "/laapirest/administracion/general/accion/permiso_nuevo_inmueble",
        validador.validar_adm,
        controladorAdmGenerales.permisoNuevoInmueble
    );

    // PARA SUBIR IMAGEN ya sea de TERRENO o PROYECTO
    laRuta.post(
        "/laapirest/administracion/general/accion/subir_imagen",
        validador.validar_adm,
        controladorAdmGenerales.subirImagen
    );

    // PARA ELIMINAR IMAGEN ya sea de TERRENO o PROYECTO
    laRuta.delete(
        "/laapirest/administracion/general/accion/eliminar_imagen/:objetivo_tipo/:codigo_imagen",
        validador.validar_adm,
        controladorAdmGenerales.eliminarImagen
    );

    // PARA SELECCIONAR O DESELECCIONAR IMAGEN PRINCIPAL EN EL PROYECTO O INMUEBLE
    laRuta.post(
        "/laapirest/administracion/general/accion/sel_desel_img_principal/:codigo_imagen/:codigo_proyecto_inmueble",
        validador.validar_adm,
        controladorAdmGenerales.seleccionarDeseleccionarImagenPrincipal
    );

    // PARA SELECCIONAR O DESELECCIONAR IMAGEN PRINCIPAL EN EL TERRENO
    laRuta.post(
        "/laapirest/administracion/general/accion/sel_desel_img_principal_te/:codigo_imagen/:codigo_terreno",
        validador.validar_adm,
        controladorAdmGenerales.selecDeselecImagenPrincipalTe
    );

    //-----------------------------------------------------------------------------------
    // PARA SELECCIONAR O DESELECCIONAR IMAGEN EN EL PROYECTO
    // "/laapirest/selecdeselec/:codigo_imagen/:codigo_proyecto_inmueble"
    laRuta.post(
        "/laapirest/administracion/general/accion/sel_desel_img/:codigo_imagen/:codigo_proyecto_inmueble",
        validador.validar_adm,
        controladorAdmGenerales.seleccionarDeseleccionarImagen
    ); // OK

    // PARA SUBIR DOCUMENTO ya sea de TERRENO o PROYECTO
    laRuta.post(
        "/laapirest/administracion/general/accion/subir_documento",
        validador.validar_adm,
        controladorAdmGenerales.subirDocumento
    );

    // PARA ELIMINAR DOCUMENTO ya sea de TERRENO o PROYECTO o INMUEBLE
    laRuta.delete(
        "/laapirest/administracion/general/accion/eliminar_documento/:objetivo_tipo/:codigo_documento",
        validador.validar_adm,
        controladorAdmGenerales.eliminarDocumento
    );

    // PARA SUBIR DOCUMENTO DE EMPRESA "COMO FUNCIONA"
    laRuta.post(
        "/laapirest/administracion/general/accion/subir_doc_empresa_funciona",
        validador.validar_adm,
        controladorAdmGenerales.subirDocumentoEmpresaFunciona
    );

    // PARA ELIMINAR DOCUMENTO DE EMPRESA "COMO FUNCIONA"
    laRuta.delete(
        "/laapirest/administracion/general/accion/eliminar_doc_empresa_funciona",
        validador.validar_adm,
        controladorAdmGenerales.eliminarDocumentoEmpresaFunciona
    );

    // PARA SUBIR URL VIDEO DE "COMO FUNCIONA"
    laRuta.post(
        "/laapirest/administracion/general/accion/subir_url_video_funciona",
        validador.validar_adm,
        controladorAdmGenerales.subirVideoEmpresaFunciona
    );

    // PARA ELIMINAR URL VIDEO DE "COMO FUNCIONA"
    laRuta.delete(
        "/laapirest/administracion/general/accion/eliminar_vid_empresa_funciona",
        validador.validar_adm,
        controladorAdmGenerales.eliminarVideoEmpresaFunciona
    );

    // PARA GUARDAR TABLA DE PROYECTO: PRESUPUESTO, RESPONSABILIDAD SOCIAL
    laRuta.post(
        "/laapirest/administracion/general/accion/guardar_tabla/:tipo_tabla_objetivo/:codigo_objetivo",
        validador.validar_adm,
        controladorAdmGenerales.guardarTabla
    );

    // PARA ELIMINAR TABLA DE PROYECTO: PRESUPUESTO, RESPONSABILIDAD SOCIAL
    // usamos "post", porque sera como una actualizacion a una propiedad en la base de datos, ya que se guardara como una TABLA VACIA []
    laRuta.post(
        "/laapirest/administracion/general/accion/eliminar_tabla/:tipo_tabla_objetivo/:codigo_objetivo",
        validador.validar_adm,
        controladorAdmGenerales.eliminarTabla
    );

    // PARA GUARDAR PROPIETARIO (DATOS)
    laRuta.post(
        "/laapirest/administracion/general/accion/guardar_datos_propietario",
        validador.validar_adm,
        controladorAdmGenerales.guardarDatosPropietario
    );

    // PARA GUARDAR PROPIETARIO (PAGOS)
    laRuta.post(
        "/laapirest/administracion/general/accion/guardar_pago_propietario",
        validador.validar_adm,
        controladorAdmGenerales.guardarPagoPropietario
    );

    // PARA GUARDAR VENTA DE FRACCIONES DE TERRENO A COPROPIETARIO
    laRuta.post(
        "/laapirest/administracion/general/accion/guardar_pago_copropietario_te",
        validador.validar_adm,
        controladorAdmGenerales.guardarPagoCopropietarioTe
    );

    // PARA GUARDAR VENTA DE FRACCIONES DE INMUEBLE A COPROPIETARIO
    laRuta.post(
        "/laapirest/administracion/general/accion/guardar_pago_copropietario_inm",
        validador.validar_adm,
        controladorAdmGenerales.guardarPagoCopropietarioInm
    );

    // para eliminar al copropietario del terreno o inmueble. Se elimina TODOS los datos que relacionan al copropietario con las fracciones del terreno o las fracciones del inmueble, incluyendo los DOCUMENTOS PRIVADOS que tiene el copropietario con dichas fracciones.
    laRuta.post(
        "/laapirest/administracion/general/accion/eliminar_copropietario",
        validador.validar_adm,
        controladorAdmGenerales.eliminarCopropietario
    );

    //-----------------------------------------------------------------------------------
    // RUTA PARA RENDERIZAR LOS VENTANAS SEGUN SU TIPO DE ESTADO (LADO ADMINISTRADOR)
    laRuta.get(
        "/laapirest/ventana/:tipo_ventana",
        validador.validar_adm,
        controladorParaInicio.proyectosVariosTipos
    ); // OK

    //-----------------------------------------------------------------------------------
    // PARA BUSQUEDA EN FUNCION AL CODIGO DEL PROYECTO, CODIGO INMUEBLE O C.I. INVERSIONISTA
    laRuta.post(
        "/laapirest/buscar_desde_gestionador/",
        validador.validar_adm,
        controladorParaInicio.buscarDesdeGestionador
    ); //

    //-----------------------------------------------------------------------------------
    // PARA VERIFICAR CLAVES MAESTRAS PARA CREAR UN NUEVO PROYECTO
    laRuta.post(
        "/laapirest/verificarmaestras",
        validador.validar_adm,
        controladorParaInicio.verificarMaestras
    );

    //===================================================================================
    //===================================================================================
    // RUTAS TERRENO

    // PARA CREAR CODIGO DEL NUEVO TERRENO
    laRuta.post(
        "/laapirest/terreno",
        validador.validar_adm,
        controladorAdmTerreno.crearNuevoTerreno
    );

    // RUTA PARA RENDERIZAR LA VENTANA DEL TERRENO, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/laapirest/terreno/:codigo_terreno/:ventana_terreno",
        validador.validar_adm,
        controladorAdmTerreno.renderizarVentanaTerreno
    );

    // PARA CREAR GUARDAR FORMULARIO DESCRIPCION DEL TERRENO
    laRuta.post(
        "/laapirest/terreno/:codigo_terreno/accion/guardar_descripcion",
        validador.validar_adm,
        controladorAdmTerreno.guardarDescripcionTerreno
    );

    // PARA CREAR GUARDAR ESTADO DEL TERRENO
    laRuta.post(
        "/laapirest/terreno/:codigo_terreno/accion/guardar_estado",
        validador.validar_adm,
        controladorAdmTerreno.guardarEstadoTerreno
    );

    // PARA CREAR GUARDAR BLOQUEO DESBLOQUEO DEL TERRENO
    laRuta.post(
        "/laapirest/terreno/:codigo_terreno/accion/guardar_bloqueo_desbloqueo",
        validador.validar_adm,
        controladorAdmTerreno.guardarBloqueoDesbloqueoTerreno
    );

    // PARA ELIMINAR TERRENO
    laRuta.delete(
        "/laapirest/terreno/:codigo_terreno/accion/eliminar_terreno",
        validador.validar_adm,
        controladorAdmTerreno.eliminarTerreno
    );

    // PARA CREAR FRACCIONES DEL TERRENO
    laRuta.post(
        "/laapirest/terreno/:codigo_terreno/accion/crear_fracciones_terreno",
        validador.validar_adm,
        controladorAdmTerreno.crearFraccionesTerreno
    );

    // eliminar todas las fracciones que pertenecen al terreno
    laRuta.delete(
        "/laapirest/terreno/accion/eliminar_fracciones_te",
        validador.validar_adm,
        controladorAdmTerreno.eliminarFraccionesTerreno
    );

    //===================================================================================
    //===================================================================================
    // RUTAS PROYECTO

    // PARA CREAR CODIGO DEL NUEVO PROYECTO (que pertenecera a un terreno)
    laRuta.post(
        "/laapirest/proyecto/:codigo_terreno",
        validador.validar_adm,
        controladorAdmProyecto.crearNuevoProyecto
    );

    // RUTA PARA RENDERIZAR LA VENTANA DEL PROYECTO, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/laapirest/proyecto/:codigo_proyecto/:ventana_proyecto",
        validador.validar_adm,
        controladorAdmProyecto.renderizarVentanaProyecto
    );

    //-----------------------------------------------------------------------------------
    // PARA GUARDAR LA DESCRIPCION DEL PROYECTO
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_descripcion",
        validador.validar_adm,
        controladorAdmProyecto.guardarDatosProyecto
    ); // OK

    //-----------------------------------------------------------------------------------
    // PARA GUARDAR ESTADO DEL PROYECTO  **OK
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_estado_proyecto",
        validador.validar_adm,
        controladorAdmProyecto.guardarEstadoProyecto
    );
    //-----------------------------------------------------------------------------------
    // PARA GUARDAR ELECCION GANADORA DEL PROYECTO   **OK
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_visibilidad_proyecto",
        validador.validar_adm,
        controladorAdmProyecto.guardarVisibilidadProyecto
    );

    //-----------------------------------------------------------------------------------
    // PARA "ELIMINAR" el proyecto  **OK
    laRuta.delete(
        "/laapirest/proyecto/:codigo_proyecto/accion/eliminar_proyecto",
        validador.validar_adm,
        controladorAdmProyecto.eliminarProyecto
    );

    //-----------------------------------------------------------------------------------
    // PARA "GUARDAR FORMULARIO" de RESPONSABILIDAD SOCIAL del proyecto  **OK
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_form_rs",
        validador.validar_adm,
        controladorAdmProyecto.guardarFormularioRs
    );

    //-----------------------------------------------------------------------------------
    // PARA "GUARDAR FORMULARIO" de EMPLEOS del proyecto  **OK
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_form_empleos",
        validador.validar_adm,
        controladorAdmProyecto.guardarFormularioEmpleos
    );

    //-----------------------------------------------------------------------------------
    // PARA GUARDAR "VISIBILIDAD REQUERIMIENTOS" del proyecto
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_visibilidad_requerimientos",
        validador.validar_adm,
        controladorAdmProyecto.guardarVisibilidadRequerimientos
    );

    //-----------------------------------------------------------------------------------
    // PARA GUARDAR "NOTA EXISTENTE REQUERIMIENTO" del proyecto
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_requerimientos_existente",
        validador.validar_adm,
        controladorAdmProyecto.guardarRequerimientosExistente
    );

    //-----------------------------------------------------------------------------------
    // PARA GUARDAR "NOTA INEXISTENTE REQUERIMIENTO" del proyecto
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_requerimientos_inexistente",
        validador.validar_adm,
        controladorAdmProyecto.guardarRequerimientosInexistente
    );

    //-----------------------------------------------------------------------------------
    // PARA GUARDAR "REQUERIMIENTO" del proyecto
    laRuta.post(
        "/laapirest/proyecto/:codigo_proyecto/accion/guardar_requerimiento",
        validador.validar_adm,
        controladorAdmProyecto.guardarRequerimiento
    );

    //-----------------------------------------------------------------------------------
    // PARA ELIMINAR "REQUERIMIENTO" del proyecto
    laRuta.delete(
        "/laapirest/proyecto/:codigo_proyecto/accion/eliminar_requerimiento",
        validador.validar_adm,
        controladorAdmProyecto.eliminarRequerimiento
    );

    //-----------------------------------------------------------------------------------
    // PARA GUARDAR TEXTOS-PROYECTO DEL PROYECTO
    laRuta.post(
        "/laapirest/crearnuevoproyecto/guardar_textos_py/proyecto",
        validador.validar_adm,
        controladorAdmProyecto.guardarTextosProyectoPy
    );
    // CONTROLADOR PARA GUARDAR TEXTOS-INMUEBLE DEL PROYECTO
    laRuta.post(
        "/laapirest/crearnuevoproyecto/guardar_textos_py/inmueble",
        validador.validar_adm,
        controladorAdmProyecto.guardarTextosProyectoInm
    );
    // CONTROLADOR PARA GUARDAR TEXTOS-SEGUNDEROS DEL PROYECTO
    laRuta.post(
        "/laapirest/crearnuevoproyecto/guardar_textos_py/segunderos_justo",
        validador.validar_adm,
        controladorAdmProyecto.guardarTextosSegunderosPy
    );

    //===================================================================================
    //===================================================================================
    // RUTAS INMUEBLE

    // PARA CREAR CODIGO DEL NUEVO INMUEBLE (que pertenecera a un proyecto)
    // OJO ES CORRETO:  /inmueble/:codigo_proyecto
    laRuta.post(
        "/laapirest/inmueble/:codigo_proyecto",
        validador.validar_adm,
        controladorAdmInmueble.crearNuevoInmueble
    );

    // RUTA PARA RENDERIZAR LA VENTANA DEL INMUEBLE, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/laapirest/inmueble/:codigo_inmueble/:ventana_inmueble",
        validador.validar_adm,
        controladorAdmInmueble.renderizarVentanaInmueble
    );

    // PARA GUARDAR LOS DATOS DEL INMUEBLE
    laRuta.post(
        "/laapirest/inmueble/:codigo_inmueble/accion/guardar_descripcion",
        validador.validar_adm,
        controladorAdmInmueble.guardarDatosInmueble
    );

    // PARA CAMBIAR EL ESTADO DEL PROPIETARIO DE ACTIVO A PASIVO. LA ELIMINACION COMPLETA DEL PROPIETARIO SE HACE CUANDO SEA REEMPLAZADO POR UNO NUEVO Y ESO ESTA EN LA SIGUIENTE RUTA:
    // "/laapirest/administracion/general/accion/guardar_pago_propietario"
    laRuta.post(
        "/laapirest/inmueble/:codigo_inmueble/accion/eliminar_propietario_inmueble",
        validador.validar_adm,
        controladorAdmInmueble.eliminarPropietarioInmueble
    );

    // PARA GUARDAR EL ESTADO DEL INMUEBLE  **OK
    laRuta.post(
        "/laapirest/inmueble/:codigo_inmueble/accion/guardar_estado_inmueble",
        validador.validar_adm,
        controladorAdmInmueble.guardarEstadoInmueble
    );

    // PARA CREAR FRACCIONES DEL INMUEBLE
    laRuta.post(
        "/laapirest/inmueble/:codigo_inmueble/accion/crear_fracciones_inmueble",
        validador.validar_adm,
        controladorAdmInmueble.crearFraccionesInmueble
    );

    // PARA GUARDAR DATOS DEL INVERSIONISTA
    laRuta.post(
        "/laapirest/inversor/guardar_datos_inversor",
        validador.validar_adm,
        controladorAdmPropietario.guardarDatosInversor
    );

    // PARA ELIMINAR INMUEBLE   **OK
    laRuta.delete(
        "/laapirest/inmueble/:codigo_inmueble/accion/eliminar_inmueble",
        validador.validar_adm,
        controladorAdmInmueble.eliminarInmueble
    );

    //===================================================================================
    //===================================================================================
    // RUTAS FRACCION

    // RUTA PARA RENDERIZAR LA VENTANA DE LA FRACCION, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/laapirest/fraccion/:codigo_fraccion/:ventana_fraccion",
        validador.validar_adm,
        controladorAdmFraccion.renderizarVentanaFraccion
    );

    // PARA ELIMINAR FRACCION
    laRuta.delete(
        "/laapirest/fraccion/:codigo_fraccion/accion/eliminar_fraccion",
        validador.validar_adm,
        controladorAdmFraccion.eliminarFraccion
    );

    //===================================================================================
    //===================================================================================
    // RUTAS PROPIETARIO

    // RUTA PARA RENDERIZAR LA VENTANA DEL PROPIETARIO, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/laapirest/propietario/:ci_propietario/:ventana_propietario",
        validador.validar_adm,
        controladorAdmPropietario.renderizarVentanaPropietario
    );

    // RUTA PARA CERRAR SECION LA CUENTA DEL ADMINISTRADOR
    laRuta.get(
        "/laapirest/propietario/:ci_propietario/accion/nuevas_claves",
        validador.validar_adm,
        controladorAdmPropietario.nuevasClavesInversor
    ); //OK

    // PARA GENERAR NUEVAS CLAVES DEL INVERSOR
    laRuta.post(
        "/laapirest/inversor/nuevas_claves",
        validador.validar_adm,
        controladorAdmPropietario.nuevasClavesInversor
    );

    // PARA INSPECCIONAR EL CI DEL POTENCIAL PROPIETARIO  **OK
    laRuta.post(
        "/laapirest/propietario/accion/llenar_datos_propietario",
        validador.validar_adm,
        controladorAdmPropietario.llenar_datos_propietario
    );

    // PARA INSPECCIONAR EL CI DEL POTENCIAL COPROPIETARIO DE INMUEBLE  **OK
    laRuta.post(
        "/laapirest/propietario/accion/llenar_datos_copropietario_inm",
        validador.validar_adm,
        controladorAdmPropietario.llenar_datos_copropietario_inm
    );

    // PARA INSPECCIONAR EL CI DEL POTENCIAL COPROPIETARIO DE TERRENO  **OK
    laRuta.post(
        "/laapirest/propietario/accion/llenar_datos_copropietario_te",
        validador.validar_adm,
        controladorAdmPropietario.llenar_datos_copropietario_te
    );

    //===================================================================================
    //===================================================================================
    // RUTAS ADMINISTRADOR EMPLEADO Y MAESTRO

    // RUTA PARA RENDERIZAR LA VENTANA DEL ADMINISTRADOR, SEGUN EL TIPO DE PESTAÑA SELECCIONADO
    laRuta.get(
        "/laapirest/administrador/:ventana_administrador",
        validador.validar_adm,
        controladorAdmAdministrador.renderizarVentanaAdministrador
    );

    // RUTA PARA CERRAR SECION LA CUENTA DEL ADMINISTRADOR
    laRuta.get(
        "/laapirest/administrador/accion/cerrar",
        validador.validar_adm,
        controladorAdmAdministrador.cerrarAdministrador
    ); //OK

    // RUTA PARA QUE EL ADMINISTRADOR (EMPLEADO O MAESTRO) PUEDA CAMBIAR SUS CLAVES DE ACCESO
    laRuta.post(
        "/laapirest/administrador/accion/cambiar_claves",
        validador.validar_adm,
        controladorAdmAdministrador.cambiarClaves
    );

    // RUTA PARA INSPECCIONAR NUEVO ADMINISTRADOR (que puede ser uno que anteriormente fue eliminado)
    laRuta.post(
        "/laapirest/administrador/accion/insp_nuevo_adm",
        validador.validar_adm,
        controladorAdmAdministrador.inspCiAdmNuevo
    );

    // RUTA PARA GUARDAR ADMINISTRADOR (ACTIVO para editar sus datos editables, O ELIMINADO)
    laRuta.post(
        "/laapirest/administrador/accion/adm_guardar",
        validador.validar_adm,
        controladorAdmAdministrador.guardarAdministrador
    );

    // RUTA PARA ELIMINAR ADMINISTRADOR ACTIVO
    laRuta.post(
        "/laapirest/administrador/accion/adm_eliminar",
        validador.validar_adm,
        controladorAdmAdministrador.eliminarAdministrador
    );

    // RUTA PARA dar RE-CLAVES A ADMINISTRADOR ACTIVO
    laRuta.post(
        "/laapirest/administrador/accion/adm_re_claves",
        validador.validar_adm,
        controladorAdmAdministrador.reClavesAdministrador
    );

    // PARA ENLISTAR AL PERSONAL ACTIVO DE SOLIDEXA
    laRuta.get(
        "/laapirest/administrador/accion/ver_personal_activo",
        validador.validar_adm,
        controladorAdmAdministrador.verPersonalActivo
    );
    // PARA BUSCAR EN EL HISTORIAL DE ACCIONES DEL DENTRO DEL SISTEMA
    laRuta.post(
        "/laapirest/administrador/accion/buscar_historial",
        validador.validar_adm,
        controladorAdmAdministrador.buscarHistorial
    );
    // PARA BORRAR EL HISTORIAL DE ACCIONES DEPENDIENDO DEL TIEMPO EN QUE SEA DEFINIDO
    laRuta.post(
        "/laapirest/administrador/accion/borrar_historial",
        validador.validar_adm,
        controladorAdmAdministrador.borrarHistorial
    );

    // RUTA PARA "GUARDAR FORMULARIO DE TRANSICIONES DE EMPRESA"
    laRuta.post(
        "/laapirest/administrador/accion/guardar_texto_principal_empresa",
        validador.validar_adm,
        controladorAdmAdministrador.guardarTextoPrincipalEmpresa
    );

    // RUTA PARA "GUARDAR TEXTOS DE SEGUNDERO DE: PROYECTO, INMUEBLE Y PROPIETARIO"
    laRuta.post(
        "/laapirest/administrador/accion/guardar_textos_segundero",
        validador.validar_adm,
        controladorAdmAdministrador.guardarTextosSegundero
    );

    // PARA GUARDAR TABLA "PREGUNTAS FRECUENTES"
    laRuta.post(
        "/laapirest/administrador/accion/guardar_tabla_preguntas",
        validador.validar_adm,
        controladorAdmAdministrador.guardarTablaPreguntas
    );
    // PARA ELIMINAR TABLA "PREGUNTAS FRECUENTES"
    laRuta.post(
        "/laapirest/administrador/accion/eliminar_tabla_preguntas",
        validador.validar_adm,
        controladorAdmAdministrador.eliminarTablaPreguntas
    );

    // PARA ELIMINAR ACTUALIZAR "RESUMEN NUMEROS DE VENTANA DE INICIO"
    laRuta.get(
        "/laapirest/administrador/accion/actualizar_numeros_empresa",
        validador.validar_adm,
        controladorAdmAdministrador.actualizarNumerosEmpresa
    );

    // para "TABLA DE VISITAS A LAS PAGINAS DE: TERRENO, PROYECTO, INMUEBLE"
    laRuta.post(
        "/laapirest/administrador/accion/visitas",
        validador.validar_adm,
        controladorAdmAdministrador.visitas
    );

    // para "BUSCAR NUMERO DE VISITAS DE: TERRENO, PROYECTO, INMUEBLE"
    laRuta.post(
        "/laapirest/administrador/accion/buscar_visitas",
        validador.validar_adm,
        controladorAdmAdministrador.buscarVisitas
    );

    //-----------------------------------------------------------------------------------
    // cargamos a la "servidorDamosRutas" las rutas creadas del servidor, NOTESE QUE SE USA "use", entonces es un MIDDLEWARE de rutas
    servidorDamosRutas.use(laRuta); // ES PARA QUE EL SERVIDOR UTILICE LAS RUTAS CREADAS
};
