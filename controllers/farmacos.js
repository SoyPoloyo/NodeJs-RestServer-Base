const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Farmaco = require('../models/farmaco');

const farmacosGet =  async (req = request, res = response) => {
    
    const farmacos = await Farmaco.find();

    res.json({
        farmacos: farmacos.indicaciones
    });
    
    


}

const farmacosPut = (req, res) => {
    // los params vienen en el url y son obligatorios, deben declararse en la ruta
    const { id } = req.params;

    res.json({
        msg: 'put API - controlador de farmacos',
        id
    })
}

const farmacosPost = async (req, res) => {

   
    const body = req.body;
    const farmaco = new Farmaco(body);

    //Verificamos si el principio activo existe
   /*  const existePrincipioActivo = await Farmaco.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            Fail: 'Ese correo ya esta registrado'
        })
    } */



    //Guardamos en la base de datos
    await farmaco.save();

    res.json({

        msg: 'Farmaco creado?',
        body
    })
}

const farmacosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador de farmacos'
    })
}

module.exports = {
   farmacosGet,
   farmacosPut,
   farmacosPost,
   farmacosDelete
}