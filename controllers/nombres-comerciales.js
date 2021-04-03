const { response } = require('express');
const bcryptjs = require('bcryptjs');

const NombreComercial = require('../models/nombre-comercial');

const nombreComercialGet = async (req, res = response) => {
    //req,query**
    //los query son parametros opcionales que vienen en el url
    //ejp: localhost:puerto/api/usuarios?desde=5&limite=10
    //esto nos mostraria del usuario 5 en adelante y solo 10

    let { desde = 0, limite = 5, nombre = '' } = req.query;

    isNaN(limite) ? limite = 5 : limite = (Number(limite));
    isNaN(desde) ? desde = 0 : desde = (Number(desde));

    const activos = { estado: true };

    // usamos Promise.all para ejecutar todas las promesas al mismo tiempo y reducir los tiempos de espera
    // y una desestructuracion de arreglos ya que nos devuelve un arreglo con las respuestas
    const [total, nombresComerciales, nombreComercial] = await Promise.all([

        NombreComercial.countDocuments(),

        NombreComercial.find()
            .skip(desde)
            .limit(limite), // limita los usuarios mostrados

        NombreComercial.find({ nombre: nombre })


    ])


    // obtener nombres - for fun
    const nombres = nombresComerciales.map(arr => {
        return arr.nombre
    })

    let respuesta = {}

    respuesta = (nombre == '') ? respuesta = {
        Info: `nombres comerciales iran aqui`,
        "total actual en base de datos": total,
        nombres: nombres,
        nombreComercial: nombreComercial
    } :
        respuesta = {
            Nota: `Todo sobre el ${nombre}`,
            Info: nombreComercial
        }


    res.json(respuesta);


}

const nombreComercialPost = async (req, res) => {

    const info = req.body;

    const nombreComercial = new NombreComercial(info);

    //Guardamos en la base de datos
    await nombreComercial.save();

    res.json({
        msg: 'Nombre comercial creado?',
        nombreComercial
    })
}


module.exports = {
    nombreComercialGet,
    nombreComercialPost
}