const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('u-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay un token en la peticion'
        });
    }


    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario que correspecto al uid
        const usuario = await Usuario.findById(uid)

        // verificiar si el usuario existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - *usuario no existe, borrado DB*'
            });
        }

        // verificiar si el uid es un usuarioo activo
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - *usuario con estado en falso*'
            });
        }


        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }

}

module.exports = {
    validarJWT
}