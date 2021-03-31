const { response } = require('express');

const usuariosGet = (req, res = response) => {
    //los query son parametros opcionales que vienen en el url
    const { q, nombre } = req.query;

    res.json({
        msg: 'get API - controlador',
        q, nombre
    });
}

const usuariosPut = (req, res) => {
    // los params vienen en el url y son obligatorios, deben declararse en la ruta
    const { id } = req.params;

    res.json({
        msg: 'put API - controlador',
        id
    })
}

const usuariosPost = (req, res) => {

    let { nombre, edad } = req.body;

    res.json({

        msg: 'post API - controlador',
        nombre,
        edad
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}