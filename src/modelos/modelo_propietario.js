// contendra el modelo de informacion que tendra el INVERSIONISTA o USUARIO comun y corriente, que necesita de una cuenta para GUARDAR LOS INMUEBLE DE SU INTERES

const mongoose = require("mongoose");

const { Schema } = mongoose;

// #session-passport #encriptar-contraseña para contraseña secion usuario
const encripta = require("bcryptjs");

const inversionistaEsquema = new Schema({
    ci_solicitante: String, // el administrador que registra a este nuevo PROPIETARIO o el jefe administrador que solicita que sea eliminado

    ///estado_propietario: { type: String, default: 'activo' }, // activo   o    eliminado

    nombres_propietario: { type: String, default: "" },

    apellidos_propietario: { type: String, default: "" }, // paterno y materno o solo uno de ellos si fuera el caso

    ci_propietario: { type: String, default: "" }, // porque pueden existir cedulas alfanumericos de otros paises

    departamento_propietario: { type: String, default: "" },
    provincia_propietario: { type: String, default: "" },
    domicilio_propietario: { type: String, default: "" },

    // solo sera visto para el lado del ADMINISTRADOR para fines de formales de llamarles por su titulo academico.
    ocupacion_propietario: { type: String, default: "" },

    fecha_nacimiento_propietario: { type: Date, default: "" },

    telefonos_propietario: { type: String, default: "" }, // celulares, fijos numero de referencia

    usuario_propietario: { type: String, default: "" }, // para accedo a su cuenta
    clave_propietario: { type: String, default: "" }, // para acceso a su cuenta (contraseña)

});

//--------------------------------------------
// #session-passport #encriptar-contraseña para cifrar datos del usuario para secion

// este metodo "encryptPassword" va recibir una contraseña, que la guardaremos en "contrasena" (sin ñ)
inversionistaEsquema.methods.encriptarContrasena = async (contrasena) => {
    // fazt ".encryptPassword"

    // que ejecute el algoritmo (para generar un hast) ej/ 10 veces para seguridad y ese hast generado lo guardamos en "el_salt"
    const el_salt = await encripta.genSalt(10);

    // el hast generado lo damos a la contraseña y es ahi donde se genera la contraseña cifrada que lo guardamos en "contrasena_cifrada"
    const contrasena_cifrada = encripta.hash(contrasena, el_salt);

    return contrasena_cifrada; // asi la contraseña se guardara cifrada en la base de datos
};

// para comparar la contraseña que ingresa el usuario desde el navegador, compararlo con la contraseña cifrada, se hace lo siguiente metodo

// la contraseña que envia el usuario la guardamos en "contrasena_usu" y la comparamos con la contraseña del modelo de datos
inversionistaEsquema.methods.compararContrasena = async function (contrasena_usu) {
    // fazt ".matchPassword"
    return await encripta.compare(contrasena_usu, this.clave_propietario); // retorna un resultado tipo "true o false"
};

//----------------------------------------------

module.exports = mongoose.model("inversionistaModelo", inversionistaEsquema);
