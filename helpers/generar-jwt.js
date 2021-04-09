const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// **uid = user identifier , sera nuestro nuevo id
const generarJWT = (uid = '') => {
    //en el payload simplemente voy a guardar el id del usuario
    // ya que esta informacion se puede abrir de manera muy facil

    return new Promise((resolve, reject) => {

        const payload = { uid /** nombre,apellido lo que quiera */ };

        //generamos un nuevo token
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }

        })

    })
}

const comprobarJWT = async (token = '') => {

    try {

        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if (usuario) {
            if (usuario.estado) {

                return usuario;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}