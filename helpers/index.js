

const validacionesDB = require('./validaciones-db');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...validacionesDB,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}