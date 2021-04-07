
const { Router } = require('express');
const { check } = require('express-validator');


const { principiosActivosGet, principiosActivosPost } = require('../controllers/principios-activos');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', principiosActivosGet);
router.post('/', principiosActivosPost);

module.exports = router;