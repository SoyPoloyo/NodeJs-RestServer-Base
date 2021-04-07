//unimos todos nuestros middlewares en un solo archivo

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const existeArchivo = require('./validar-archivo')

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...existeArchivo
}
