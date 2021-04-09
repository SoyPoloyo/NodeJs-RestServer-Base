const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ correo })

        //Verificiar si el email existe
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario / contraseña no es correcto'
            })
        }

        //verificiar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario / contraseña no es correcto'
            })
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El usuario / contraseña no es correcto'
            })
        }

        // generar el json web token
        // esto funciona en base a callbacks, generar funcion para cambiarlo a promesas**

        const token = await generarJWT(usuario.id)

        res.json({

            token

        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salio mal, hable con el administrador'
        })
    }

}

const googleSignin = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { correo, img, nombre } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        //si no existe lo creamos
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();

        }

        //si el usuario tiene el estado en false
        //negamos su autenticacion

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id)


        res.json({
            msg: 'Autenticado correctamente con google',
            //usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es valido'
        })
    }

}

const renovarToken = async (req, res = response) => { 

    const {usuario} = req;

    const token = await generarJWT(usuario.id)

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignin,
    renovarToken
}