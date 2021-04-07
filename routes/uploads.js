
const { Router } = require('express');
const { check } = require('express-validator');

const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivo } = require('../middlewares');

const { cargarArchivo, actualizarImg, mostrarImagen, actualizarImgCloudinary } = require('../controllers/updloads');


const router = Router();

router.post('/', validarArchivo, cargarArchivo)

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarArchivo,
    validarCampos
], actualizarImgCloudinary) //cloudinry
//], actualizarImg) // servidor local

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

module.exports = router;