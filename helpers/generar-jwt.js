const { response } = require('express');
const jwt = require('jsonwebtoken');

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

module.exports = {
    generarJWT
}