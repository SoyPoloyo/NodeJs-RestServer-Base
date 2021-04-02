
const { Router } = require('express');
const { check } = require('express-validator');


const { farmacosGet, farmacosPut, farmacosPost, farmacosDelete } = require('../controllers/farmacos');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', farmacosGet);

router.put('/:id', farmacosPut);
//Si mandamos 3, significa que en el 2 van los middlewares, si van varios, van entre []
router.post('/', [
    //Especificamos que campo del body queremos revisar
    check('principioActivo', 'No escribio el principio activo').not().isEmpty(),
    check('embarazo', 'Debe seleccionar las indicaciones en caso de embarazo').not().isEmpty(),
    /* check('categoria').custom(),  */
    validarCampos
], farmacosPost);

router.delete('/', farmacosDelete);

module.exports = router;