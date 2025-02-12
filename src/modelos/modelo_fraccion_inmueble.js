/*
CREADOS EN LA ETAPA DE TERRENO DE: RESERVA o CONSTRUCCION

Una misma fraccion de terreno puede pasar a formar parte de diferentes inmueble como "copropietario" y a su vez como "inversionista" de diferentes inmuebles.

en esta base de datos, solo se crean los registros cuando una fraccion de terreno forma parte de un inmueble como "copropietario" y cuando forma parte de un inmueble como "inversionista" (unicamente cuando es adquirido por un propietario absoluto como derecho de suelo de un inmueble, pero si solo esta en espera de ser adquirido, entonces aun no tendra ningun registro como inversionista en esta base de datos.)

durante la etapa de RESERVA, una fraccion de terreno (que desea ser usada como copropietario) pasara a formar parte de un inmueble, ya sea enteramente o solo una parte como "copropietario" y si existe sobra, esta sobra permanecera en espera hasta que el usuario pueda usarlo si es que le alcanza para formar parte como "copropietario" de otro inmueble y si no es posible usarlo como copropietario, o si el mismo usuario desea ya no utilizarlo como copropietario, entonces esa sobra permanecera en espera hasta formar parte de otro inmueble, pero como "inversionista", esperando ser adquirido como derecho de suelo por un propietario absoluto.

durante la etapa de RESERVA, una fraccion de terreno (que desea mantenerse como inversionista) peranecera en espera hasta pasar a formar parte de un inmueble como derecho de suelo, cuando es adqurido por un propietario absoluto.

durante la etapa de CONSTRUCCION, seran posible la creacion de nuevas fracciones del tipo "copropietario" para los inmuebles  que necesiten mas dinero para su construccion, la caracteristica de esas fracciones es que unicamente seran "copropietario", de manera que no tendra una parte residual del tipo "inversionista"

fraccion  <----->   n inmuebles
(una misma fraccion de terreno puede formar parte de diferentes inmuebles)
*/

const mongoose = require("mongoose");

const { Schema } = mongoose;

const fraccionInmuebleEsquema = new Schema({

    codigo_fraccion: { type: String },

    codigo_terreno: { type: String },

    codigo_proyecto: { type: String },

    ci_propietario: { type: String },

    disponible: { type: Boolean}, // "true" cuando la fraccion esta disponible para ser adquirido por uno que desea ser copropietario del inmueble del que formara parte esta fraccion, "false" cuando deja de estar disponible. LAS FRACCIONES DISPONIEBLES SE VERAN EN LA PESTAÑA "FRACCIONES" DEL INMUEBLE.

    orden: { type: Number }, // util para la ordenacion inicial para la venta de fracciones

    // este campo estara lleno como "inversionista" cuando la fraccion o parte de ella es unicamente adquirida por un propietario absoluto como derecho de suelo.
    // este campo estara lleno como "copropietario" cuando la fraccion o parte de ella pasara a formar parte del inmueble como copropietario.
    tipo: { type: String }, // "inversionista" o "copropietario"
    // una misma fraccion puede tener una parte "inversionista" y la otra como "copropietario" O puede ser simplemente una de ellas.
    // "inversionista": cuando la fraccion o parte de la fraccion forma parte de un inmueble que ya fue adquirida por un PROPIETARIO ABSOLUTO, quien pago su DERECHO DE TERRENO
    // "copropietario": cuando la fraccion o parte de la fraccion forma parte de un inmueble que pertenecera a diferentes copropietarios.

    //--------------------------------------------------------------------------------

    // para fraccion tipo "copropietario", este campo estara lleno cuando la fraccion  pasara a formar parte del inmueble como copropietario y para fracciones que se originan de inmuebles fraccionados.
    // para fraccion tipo "inversionista", este campo solo estara lleno cuando la fraccion o parte de ella formara parte de un inmueble que fue adquirido por un propietario absoluto, como derecho de suelo.
    codigo_inmueble: { type: String },

    // para fraccion tipo "copropietario", este campo estara lleno cuando la fraccion o parte de ella pasara a formar parte del inmueble como copropietario. EN ESTE TIPO DE FRACCIONES, EL VALOR DE CADA FRACCION DEBE SER IGUAL AL VALOR DE LAS FRACCIONES DEL TERRENO (terreno del cual el inmueble sera construido), Y SOLO PUDIENDO EXISTIR UNA FRACCION DE INMUEBLE MENOR AL VALOR DE LA FRACCION DEL TERRENO, ESTO SIEMPRE Y CUANDO EL PRECIO JUSTO DEL INMUEBLE LO REQUIERA.
    // para fraccion tipo "inversionista", este campo solo estara lleno cuando la fraccion o parte de ella formara parte de un inmueble que fue adquirido por un propietario absoluto, como derecho de suelo.
    fraccion_bs: { type: Number },

    // SOLO PARA A FRACCION O PARTE DE LA FRACCION QUE SEA DEL TIPO "INVERSIONISTA" DEL INMUEBLE, 
    // para fraccion tipo "inversionista", este campo solo estara lleno cuando la fraccion o parte de ella formara parte de un inmueble que fue adquirido por un propietario absoluto, como derecho de suelo. sera la ganancia por defecto (16%) que ganara la parte del valor de la fraccion cuando es  adquirida por un propietario absoluto. La ganancia estara en funcion al tiempo en que es adquirido por un propietario absoluto, empezando en 2, 4, 6, 8, 10, 12, 14, 16 (minimo 2% y maximo 16%)
    ganancia_bs: { type: Number },

    // PARA FRACCION O PARTE DE LA FRACCION QUE SEA DEL TIPO "COPROPIETARIO" DEL INMUEBLE, sera la "plusvalia" (plusvalia tomada de la base de datos del inmueble) que gane en funcion al inmueble al que pertenece como copropietario.

    fecha_copropietario: { type: Date }, // estara vacio si el registro pertenece a fraccion tipo "inversionista". Corresponde a la fecha en que la fraccion o parte de ella pasa a formar parte de un inmueble como "copropietario"

    fecha_inversionista: { type: Date }, // estara vacio si el registro pertenece a fraccion tipo "copropietario". Corresponde a la fecha en que la fraccion o parte de ella pasa a formar parte de un inmueble como "inversionista" (es decir cuando es adquirida por un propietario absoluto a travez del derecho de suelo de un inmueble)

    // si la fraccion es "INVERSIONISTA": fecha en que se paga el valor de la fraccion y su respectiva ganancia al dueño de la fraccion
    // IMPORTANTE: se paga la totalidad de las ganancias (porque podria darse el caso que una fraccion de origen terreno, forme parte de diferentes inmuebles, como parte de derecho de suelo. Difetenes inmuebles que pueden ser adquiridos por propietarios absolutos en diferentes fechas)
    fecha_pago: { type: Date }, // si la fraccion es "copropietario" este campo estara vacio
});

module.exports = mongoose.model("fraccionInmuebleModelo", fraccionInmuebleEsquema);


/*
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

cuando se da click al boton "crear fracciones" (para crear fracciones copropietarios de un inmueble ya sean en el estado terreno de: RESERVACION o CONSTRUCCION), se crearan registros, donde tendran llenados los siguientes datos:

codigo_fraccion (codigo_inmueble + orden)
codigo_terreno
codigo_proyecto
disponible: true
orden
tipo: copropietario
codigo_inmueble
fraccion_bs (lo que corresponda, ej/ 2000 o lo que falta para completar el precio justo del inmueble ej/ < 2000)

de esta manera las fracciones copropietario estaran disponibles a la espera de que sean adquiridas por copropietarios

------------------------------------------------
cuando estas fracciones sean adquiridas mediante fracciones terreno, entonces se actualizaran y completaran los siguientes campos:

codigo_fraccion: (codigo fraccion terreno)
ci_propietario
disponible: false
fecha_copropietario

------------------------------------------------
cuando estas fracciones sean adquiridas mediante dinero externo (durante el estado de terreno de CONSTRUCCION), entonces se actualizaran y completaran los siguientes campos:

codigo_fraccion (codigo_inmueble + orden)
ci_propietario
disponible: false
fecha_copropietario
------------------------------------------------

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

cuando una fraccion de terreno (toda o una parte residual de ella) que estaba en espera para ser adquirida por un propietario absoluto que reserve un inmueble entero pagando su derecho de suelo, es cuando recien se origina un registro en esta base de datos de la siguiente manera:

codigo_fraccion: (codigo fraccion terreno)
tipo: "inversionista"
codigo_inmueble:
ci_propietario:
disponible: false
fraccion_bs: (lo que corresponda. todo el valor de la fraccion del terreno ej/ 2000 o la parte residual que estaba en espera)
ganancia_bs: (lo que le corresponda segun la fecha en que la fraccion del terreno o parte de ella es adquirida por un propietario absoluto como derecho de suelo, pudiendo ser la ganancia: 2, 4, 6, 8, 10, 12, 14, 16 (minimo 2% y maximo 16%) PERO EXPRESADO EN BOLIVIANOS)
fecha_inversionista:

//-------------------------

y cuando la totalidad de la fraccion de origen terreno es adquirido por propietarios absolutos como derecho de suelo, sera cuando recien se procedera a pagar al dueño de la fraccion la totalidad de la ganancia que le corresponda, UNA VEZ QUE SE LE PAGUE EFECTIVAMENTE AL DUEÑO, se pondra en el documento o todos los documentos que tengan el codigo de la fraccion en modelo_fraccion_inmueble, se las pondra el dato:
fecha_pago

*/
