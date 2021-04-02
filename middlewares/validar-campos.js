const { validationResult } = require('express-validator');

//Esto se llamara en la ruta para devolver los datos que no vienen con mis requisitos previos
// para que no lleguen al controlador
const validarCampos = (req, res, next) => {
    //el tercer argumento se llama si pasa las validaciones, se usa por ser un middleware

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json(errores)
    }
    //quiere decir que si llega a este punto, sigue con el proximo middleware y si no hay, el controlador
    next();
}
 
module.exports = {
    validarCampos
}