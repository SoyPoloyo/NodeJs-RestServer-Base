
const { Router } = require('express');
const { check } = require('express-validator');

//MIDDLEWARES
/* 
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneElRole } = require('../middlewares/validar-roles');
 */
const { validarCampos, validarJWT, esAdminRole, tieneElRole } = require('../middlewares');


const { esRolValido, correoExiste, existeUsuarioID } = require('../helpers/validaciones-db');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');

const router = Router();

//Si mandamos 3 o mas middlewares, significa que en el 2 espacio van los middlewares, si van varios, van entre []

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioID),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    //Especificamos que campo del body queremos revisar
    check('nombre', 'No escribio su nombre').not().isEmpty(),
    check('password', 'La contraseña debe de ser de mas de 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no tiene aspecto de correo').isEmail(),
    check('correo').custom(correoExiste),
    //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole, verifica que el rol sea administrador
    tieneElRole('MASTER_ROLE', 'ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioID),
    validarCampos
], usuariosDelete);

module.exports = router;