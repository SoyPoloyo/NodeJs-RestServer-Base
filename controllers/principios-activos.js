const { response } = require('express');
const bcryptjs = require('bcryptjs');

const PrincipioActivo = require('../models/principio-activo');

const principiosActivosGet = async (req = request, res = response) => {

    const principioActivo = await PrincipioActivo.find();

    res.json({
        msg: 'Aqui mostraremos los principios activos',
        principioActivo
    });

}

const principiosActivosPost = async (req, res) => {

    const info = req.body;

    const principioActivo = new PrincipioActivo(info);

    //Guardamos en la base de datos
    await principioActivo.save();

    res.json({
        msg: 'Principio activo creado?',
        principioActivo
    })
}



module.exports = {
    principiosActivosGet,
    principiosActivosPost
}