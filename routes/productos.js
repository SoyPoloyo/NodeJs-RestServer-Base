
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneElRole, esAdminRole } = require('../middlewares');

const { existeCategoriaID, esCategoriaValida, existeProductoID } = require('../helpers/validaciones-db');

const {actualizarProducto,borrarProducto,crearProducto,obtenerProducto,obtenerProductos  } = require('../controllers/productos');


const router = Router();





// obtener todas las categorias - public
router.get('/', obtenerProductos);

// obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoID),
    validarCampos
], obtenerProducto);

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio debe ser un numero').not().isString(),
    check('categoria', 'No es un ID de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaID),
    validarCampos
], crearProducto);

// actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoID),
    validarCampos
], actualizarProducto);

// borrar - privado - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoID),
    validarCampos
], borrarProducto )




module.exports = router;