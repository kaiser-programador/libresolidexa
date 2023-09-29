// este{} sera el indice que contendra todos los modelos de datos creados

module.exports = {
    indiceAdministrador: require("./modeloadministrador"),

    indiceProyecto: require("./modeloproyecto"), // de esta manera para acceder al esquema del edificio, que esta contenida en el archivo "modeloedificio.js" se lo hara llamando desde el indice asi:

    indiceInmueble: require("./modeloinmueble"),

    indiceDocumentos: require("./modelodocumentos"),

    indiceImagenesEmpresa_sf: require("./modelo_ima_empresa_sf"),

    indiceImagenesTerreno: require("./modelo_terreno_ima"),

    indiceImagenesProyecto: require("./modeloimagenesproyecto"),

    indice_propietario: require("./modelo_propietario"),

    indiceInversiones: require("./modeloinversiones"),

    indiceGuardados: require("./modeloguardados"),

    indiceHistorial: require("./historial_gestionador"),

    indiceEmpresa: require("./modelo_empresa"),

    indiceTerreno: require("./modelo_terrenos"),

    indiceRequerimientos: require("./modelo_requerimientos"),

    indiceImagenesSistema: require("./modelo_ima_sistema"),

};
