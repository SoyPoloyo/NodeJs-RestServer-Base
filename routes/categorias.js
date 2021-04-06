
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneElRole, esAdminRole } = require('../middlewares');

const { existeCategoriaID } = require('../helpers/validaciones-db');

const { crearCategoria, obtenerCategoria,obtenerCategorias, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');


const router = Router();





// obtener todas las categorias - public
router.get('/', obtenerCategorias);

// obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaID),
    validarCampos
], obtenerCategoria);

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),

    validarCampos
], crearCategoria);

// actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaID),
    check('nombre', 'Debe especificar un nuevo nombre').not().isEmpty(),
    tieneElRole('MASTER_ROLE', 'ADMIN_ROLE', 'USER_ROLE'),
    validarCampos
], actualizarCategoria);

// borrar - privado - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaID),
    validarCampos
], borrarCategoria )




module.exports = router;