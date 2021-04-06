const { response } = require("express");
const { Producto } = require("../models");


// obtener categorias, paginado, total, populate
const obtenerProductos = async (req, res = response) => {


    let { desde = 0, limite = 5 } = req.query;

    isNaN(limite) ? limite = 5 : limite = (Number(limite));
    isNaN(desde) ? desde = 0 : desde = (Number(desde));

    const activos = { estado: true };

    const [total, productos] = await Promise.all([

        Producto.countDocuments(activos),

        Producto.find(activos)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(desde)
            .limit(limite)

    ])


    // obtener nombres - for fun
    const nombres = productos.map(arr => {
        return arr.nombre
    })

    res.json({
        total,
        productos

    });
}

// obtener categoria  - populate
const obtenerProducto = async (req, res = response) => {

    const { id } = req.params

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto)
}

const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre })

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }


    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data)

    // guardamos

    await producto.save()


    res.status(201).json(producto);

}

//actualizarcategoria, 
const actualizarProducto = async (req, res) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

    res.json({
        msg: 'Categoria modificada con exito',
        producto
    })
}


const borrarProducto = async (req, res = response) => {


    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    //el token del usuario que a borrado a quien*
    const usuarioAutenticado = req.usuario

    res.json({
        msg: 'Usuario que borro / lo borrado',
        usuarioAutenticado,
        producto,

    })
}

module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}