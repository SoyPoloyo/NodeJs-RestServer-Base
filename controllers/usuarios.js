const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    //req,query**
    //los query son parametros opcionales que vienen en el url
    //ejp: localhost:puerto/api/usuarios?desde=5&limite=10
    //esto nos mostraria del usuario 5 en adelante y solo 10

    let { desde = 0, limite = 5 } = req.query;

    isNaN(limite) ? limite = 5 : limite = (Number(limite));
    isNaN(desde) ? desde = 0 : desde = (Number(desde));

    const activos = { estado: true };

    // usamos Promise.all para ejecutar todas las promesas al mismo tiempo y reducir los tiempos de espera
    // y una desestructuracion de arreglos ya que nos devuelve un arreglo con las respuestas
    const [total, usuarios] = await Promise.all([

        Usuario.countDocuments(activos),

        Usuario.find(activos)
            .skip(desde)
            .limit(limite) // limita los usuarios mostrados

    ])
 

    // obtener nombres - for fun
    const nombres = usuarios.map(arr => {
        return arr.nombre
    })

    res.json({
        Info: `Usuarios totales: ${total}, Mostrando del: ${desde} al ${desde + limite}`,
        nombres,
        usuarios

    });
}

const usuariosPut = async (req, res) => {
    // red.params**
    // los params vienen en el url y son obligatorios, deben declararse en la ruta
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
    console.log(resto);

    //Validar contra base de datos
    if (password) {
        //Encriptamos la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findOneAndUpdate(id, resto);

    res.json({
        msg: 'Usuaro modificado?',
        usuario
    })
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //El ya se reviso antes de llegar aqui la informacion, es valido y no existe en la DB

    //Encriptamos la contraseña
    const salt = bcryptjs.genSaltSync(); // podriamos poner 100, pero duraria mucho
    usuario.password = bcryptjs.hashSync(password, salt) //salt = numeros de vueltas que usa para encriptar, default 10

    //Guardamos en la base de datos
    await usuario.save();

    res.json({
        msg: 'Usuario creado?',
        usuario
    })
}

const usuariosDelete = async (req, res = response) => {

    /*
    * Borrarlo fisicamente**
    * const usuario = await Usuario.findByIdAndDelete(id);
    */

    const { id } = req.params;
 
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    //el token del usuario que a borrado a quien*
    const usuarioAutenticado = req.usuario

    res.json({
        msg: 'Usuario desactivado / eliminado',
        usuarioAutenticado,
        usuario,
        
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}