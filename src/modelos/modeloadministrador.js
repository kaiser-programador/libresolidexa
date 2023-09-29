// modelo de datos de los administradores que tendran acceso al sistema de fondecorp

const mongoose = require('mongoose');

const { Schema } = mongoose;

// #session-passport #encriptar-contraseña para contraseña secion usuario
const encripta = require('bcryptjs');

const administradoresEsquema = new Schema({
    ci_solicitante: String, // el jefe administrador que solicita que se registre a este nuevo administrador o que solicite que sea eliminado
    //----- DATOS PERSONALES DEL ADMINISTRADOR ------//

    // cedula identidad. Para cedulas que tengan el formato: "abc 124" o "abc-124" SE ESCRIBIRAN TODO UNIDO SIN ESPACIOS EN BLANCO NI SEPARADORES COMO "-". DE MANERA QUE SERAN ASI: "abc124"
    ci_administrador: String, 
    ad_nombres: String,
    ad_apellidos: String,
    ad_nacimiento: Date,
    ad_telefonos: String,
    ad_departamento: String,
    ad_provincia: String,
    ad_ciudad: String,
    ad_direccion: String,

    //----------------------------------------------//

    ad_usuario: String, // puede ser cambiado por el mismo usuario
    ad_clave: String, // puede ser cambiado por el mismo usuario (contraseña)

    estado_administrador: { type: String, default: 'activo' }, // activo   o    eliminado
    clase: String, // "maestro" o "administrador"

    fecha_ingreso: Date, // en que es registrado como administrador del sistema
    fecha_salida: Date // en que es eliminado como administrador del sistema

});

//--------------------------------------------
// #session-passport #encriptar-contraseña para cifrar datos del usuario para sesion

// este metodo "encryptPassword" va recibir una contraseña, que la guardaremos en "contrasena" (sin ñ)
administradoresEsquema.methods.encriptarContrasena = async (contrasena) => {  // fazt ".encryptPassword"

    // que ejecute el algoritmo (para generar un hast) ej/ 10 veces para seguridad y ese hast generado lo guardamos en "el_salt"
    const el_salt = await encripta.genSalt(10);

    // el hast generado lo damos a la contraseña y es ahi donde se genera la contraseña cifrada que lo guardamos en "contrasena_cifrada"
    const contrasena_cifrada = encripta.hash(contrasena, el_salt);

    return contrasena_cifrada; // asi la contraseña se guardara cifrada en la base de datos
};

// para comparar la contraseña que ingresa el usuario desde el navegador, compararlo con la contraseña cifrada, se hace lo siguiente metodo

// la contraseña que envia el usuario la guardamos en "contrasena_usu" y la comparamos con la contraseña del modelo de datos
administradoresEsquema.methods.compararContrasena = async function (contrasena_usu) {  // fazt ".matchPassword"
    return await encripta.compare(contrasena_usu, this.ad_clave); // retorna un resultado tipo "true o false"
};

//----------------------------------------------

module.exports = mongoose.model('administradoresModelo', administradoresEsquema);