const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    //const esMongoId = ObjectId.isValid(termino); //TRUE
    const esMongoId = isValidObjectId(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i'); // para que sea insensible a mayuscula o minusculas

    const usuarios = await Usuario.find({ //.count para contar respuestas*
        //$or:[{nombre: regex, estado: true }, {correo: regex, estado: true }] -- opcion 1 1
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    })


}

const buscarCategorias = async (termino = '', res = response) => {

    //const esMongoId = ObjectId.isValid(termino); //TRUE
    const esMongoId = isValidObjectId(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    })


}

const buscarProductos = async (termino = '', res = response) => {

    //const esMongoId = ObjectId.isValid(termino); //TRUE
    const esMongoId = isValidObjectId(termino);

    if (esMongoId) {

        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
            .populate('usuario', 'nombre');

       // const productos = await Producto.find({ categoria: ObjectId(termino) }).populate('usuario', 'nombre'); -- buscar categorias dentro del producto por ID


        return res.json({
            results: (producto) ? [producto] : [],
            categorias: productos
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true }).populate('usuario', 'nombre').populate('categoria', 'nombre');

    /* Producto.find({
        price: { $lte: precioMax || 1000000000, $gte: precioMin || 0 } // encontrar por precio
    }); */

    res.json({
        results: productos
    })


}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `EL parametro ${coleccion} no se encuentra entre los permitidos: ${coleccionesPermitidas} :`
        })
    }


    switch (coleccion) {

        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
            break;
    }

}



module.exports = {
    buscar
}