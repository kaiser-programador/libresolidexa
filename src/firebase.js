// para la subida de archivos a FIREBASE

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const { direccionBaseDatos } = require("./claves");

const firebaseConfig = {
    apiKey: direccionBaseDatos.F_API_KEY,
    authDomain: direccionBaseDatos.F_AUTH_DOMAIN,
    projectId: direccionBaseDatos.F_PROJECT_ID,
    storageBucket: direccionBaseDatos.F_STORAGE_BUCKET,
    messagingSenderId: direccionBaseDatos.F_MESSAGING_SENDER_ID,
    appId: direccionBaseDatos.F_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



//export const storage = getStorage(app); // hasta aqui OK para iniciar FIREBASE

//const storage = getStorage(app); // hasta aqui OK para iniciar FIREBASE


//module.exports = storage;
