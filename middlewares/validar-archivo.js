

const { response } = require("express")
//existeArchivo - hmmm
const validarArchivo = (req, res = response, next) => {
   

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({ msg: 'No hay archivos para subir - varificar el archivo' });
        return;
    }


    next();
}

module.exports = {
    validarArchivo
}