

const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');

const { nombreComercialGet, nombreComercialPost } = require('../controllers/nombres-comerciales');

const router = Router();

router.get('/', nombreComercialGet);

router.post('/', nombreComercialPost);
 
module.exports = router;