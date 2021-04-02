const Role = require('../models/role');
const Usuario = require('../models/user');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no es valido`);
    }
}

const correoExiste = async (correo = '') => {

    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo '${correo}' ya esta registrado`)
    }
}

const existeUsuarioID = async (id) => {

    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El ID '${id}' no existe`)
    }
}

//Aqui realizaria las validaciones de la informacion de los farmacos que llegaria a mi ruta, antes de pasar a mi controlador
// si la informacion no viene como se requiere se va devolver inmediatamente sin llegar al controlador

module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioID
}