const { response } = require("express");
const { Categoria } = require("../models");


// obtener categorias, paginado, total, populate
const obtenerCategorias = async (req, res = response) => {


    let { desde = 0, limite = 5 } = req.query;

    isNaN(limite) ? limite = 5 : limite = (Number(limite));
    isNaN(desde) ? desde = 0 : desde = (Number(desde));

    const activos = { estado: true };

    const [total, categorias] = await Promise.all([

        Categoria.countDocuments(activos),

        Categoria.find(activos)
            .skip(desde)
            .limit(limite)
            .populate('usuario')

    ])


    // obtener nombres - for fun
    const nombres = categorias.map(arr => {
        return arr.nombre
    })

    res.json({
        Info: `Usuarios totales: ${total}, Mostrando del: ${desde} al ${desde + limite}`,
        nombres,
        categorias

    });
}

// obtener categoria  - populate
const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria)
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //generar data a guardar

    const data = {
        nombre,
        usuario: [req.usuario._id, req.usuario._id]

    }

    const categoria = new Categoria(data)

    // guardamos

    await categoria.save()


    res.status(201).json(categoria);

}

//actualizarcategoria, 
const actualizarCategoria = async (req, res) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true})

    res.json({
        msg: 'Categoria modificada con exito',
        categoria
    })
}


const borrarCategoria = async (req, res = response) => {


    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, {new:true});

    //el token del usuario que a borrado a quien*
    const usuarioAutenticado = req.usuario

    res.json({
        msg: 'Usuario que borro / lo borrado',
        usuarioAutenticado,
        categoria,

    })
}

module.exports = {
    obtenerCategorias,
    crearCategoria,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}