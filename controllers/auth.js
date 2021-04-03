const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/user');

const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {

    const { correo, password } = req.body;


    try {

        const usuario = await Usuario.findOne({ correo })

        //Verificiar si el email existe
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario / contraseña no es correcto - correo*'
            })
        }

        //verificiar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario / contraseña no es correcto - estado:false*'
            })
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El usuario / contraseña no es correcto - password'
            })
        }

        // generar el json web token
        // esto funciona en base a callbacks, generar funcion para cambiarlo a promesas**

        const token = await generarJWT(usuario.id)

        res.json({
            msg: 'Usuario que se acaba de logear',
            usuario,
            token

        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salio mal, hable con el administrador'
        })
    }

}

module.exports = {
    login
}