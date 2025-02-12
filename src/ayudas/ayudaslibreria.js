
// creamos el objeto vacio, al que llamaremos "libreriaFunciones"
const libreriaFunciones = {};

// ahora procedemos a llenar al {objeto} vacio conlas funciones deseadas

/***************************************************************************** */
// CODIGO TERRENOS

libreriaFunciones.codigoAlfanumericoTerreno = function () {
    let codigoAlfaNumTerreno = "te";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumTerreno = codigoAlfaNumTerreno + codigoGenerado; // concatenamos

    return codigoAlfaNumTerreno; // retornamos
};

/***************************************************************************** */
// CODIGO PROYECTOS

libreriaFunciones.codigoAlfanumericoProyecto = function () {
    let codigoAlfaNumProyecto = "py";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumProyecto = codigoAlfaNumProyecto + codigoGenerado; // concatenamos

    return codigoAlfaNumProyecto; // retornamos
};

/***************************************************************************** */
// CODIGO INMUEBLE

libreriaFunciones.codigoAlfanumericoInmueble = function () {
    let codigoAlfaNumInmueble = "im";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumInmueble = codigoAlfaNumInmueble + codigoGenerado; // concatenamos

    return codigoAlfaNumInmueble; // retormanos
};

/***************************************************************************** */
// CODIGO IMAGEN PARA IMAGENES DE EMPRESA parte QUIENES SOMOS y COMO FUNCIONA
libreriaFunciones.codAlfanumImagenEmp_sf = function () {
    let codigoAlfaNumImagen = "imaemp_sf";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumImagen = codigoAlfaNumImagen + codigoGenerado; // concatenamos

    return codigoAlfaNumImagen; // retormanos
};

/***************************************************************************** */
// CODIGO IMAGEN PARA PROYECTO (incluye imagenes de responsabilidad social)
libreriaFunciones.codigoAlfanumericoImagen = function () {
    let codigoAlfaNumImagen = "ima";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumImagen = codigoAlfaNumImagen + codigoGenerado; // concatenamos

    return codigoAlfaNumImagen; // retormanos
};

/***************************************************************************** */
// CODIGO IMAGEN TERRENO
libreriaFunciones.codigoAlfanumericoImagenTe = function () {
    let codigoAlfaNumImagen = "imate";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumImagen = codigoAlfaNumImagen + codigoGenerado; // concatenamos

    return codigoAlfaNumImagen; // retormanos
};

/***************************************************************************** */
// CODIGO DOCUMENTO
libreriaFunciones.codigoAlfanumericoDocumento = function () {
    let codigoAlfaNumDocumento = "doc";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumDocumento = codigoAlfaNumDocumento + codigoGenerado; // concatenamos

    return codigoAlfaNumDocumento; // retormanos
};

/***************************************************************************** */
// CODIGO DOCUMENTO
libreriaFunciones.codigoAlfanumericoRequerimiento = function () {
    let codigoAlfaNumRequerimiento = "req";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumRequerimiento = codigoAlfaNumRequerimiento + codigoGenerado; // concatenamos

    return codigoAlfaNumRequerimiento; // retormanos
};

/***************************************************************************** */
// CODIGO VIDA USUARIO
libreriaFunciones.codigoAlfanumericoUsuario = function () {
    // usamos "let" y no "const", porque el "codigoAlfaNumUsuario" no se mantendra inalterable, sino que ira cambiando a medida que se le agreguen caracteres

    let codigoAlfaNumUsuario = "usu";
    let codigoGenerado = armadorCodigos();
    codigoAlfaNumUsuario = codigoAlfaNumUsuario + codigoGenerado; // concatenamos

    return codigoAlfaNumUsuario; // retormanos
};

/***************************************************************************** */
// ADMINISTRADOR USUARIO (usuario y clave)
libreriaFunciones.admUsuario = function () {
    // usamos "let" y no "const", porque el "codigoAlfaNumUsuario" no se mantendra inalterable, sino que ira cambiando a medida que se le agreguen caracteres

    let admAlfaNumUsuario = "adm";
    let codigoGenerado = armadorCodigos();
    admAlfaNumUsuario = admAlfaNumUsuario + codigoGenerado; // concatenamos

    let claveAdm = armadorCodigos();

    let accesosAdm = {
        usuario_administrador: admAlfaNumUsuario,
        clave_administrador: claveAdm,
    };

    return accesosAdm; // retormanos el OBJETO con los datos
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ENCARGADO DE ARMAR CODIGO PARA TODOS LOS DEMAS
function armadorCodigos() {
    // caracteres que formaran parte del codigo alfanumerico del documento
    const caracteresNumericos = "0123456789";
    const caracteresAlfabeticos = "abcdefghijklmnopqrstuvwxyz";

    // "Math.floor" redondea hacia abajo
    // "Math.random() * caracteresPosibles.length" genera un numero aleatorio, el valor de este numero sera hasta el numero de caracteres posibles
    // "caracteresPosibles.charAt" genera un caracter de acuerdo a la posicion, segun salgue el numero aleatorio dentro de ( )
    // "+=" para que los caracteres generados se vallan acomodando uno al lado del otro, hasta que se recorran 9 veces

    let codigoCreado; // del tipo    ##aa#a

    codigoCreado = caracteresNumericos.charAt(
        Math.floor(Math.random() * caracteresNumericos.length)
    );
    codigoCreado =
        codigoCreado +
        caracteresNumericos.charAt(Math.floor(Math.random() * caracteresNumericos.length));

    codigoCreado =
        codigoCreado +
        caracteresAlfabeticos.charAt(Math.floor(Math.random() * caracteresAlfabeticos.length));
    codigoCreado =
        codigoCreado +
        caracteresAlfabeticos.charAt(Math.floor(Math.random() * caracteresAlfabeticos.length));

    codigoCreado =
        codigoCreado +
        caracteresNumericos.charAt(Math.floor(Math.random() * caracteresNumericos.length));
    codigoCreado =
        codigoCreado +
        caracteresAlfabeticos.charAt(Math.floor(Math.random() * caracteresAlfabeticos.length));

    return codigoCreado;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = libreriaFunciones;
