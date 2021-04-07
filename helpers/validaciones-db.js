const { Categoria, Role, Usuario, Producto } = require('../models');

/* 
* USUARIOS
 */
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

/* 
* CATEGORIAS
 */
const existeCategoriaID = async (id) => {

    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El ID '${id}' no existe`)
    }
}


/* 
* PRODUCTOS
 */
const existeProductoID = async (id) => {

    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El ID '${id}' no existe`)
    }
}

/* 
* VALIDAR COLECCIONES PERMITIDAS
 */
const coleccionesPermitidas = async (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida -  ${colecciones}`)
    }

    return true
}

//Aqui realizaria las validaciones de la informacion de los farmacos que llegaria a mi ruta, antes de pasar a mi controlador
// si la informacion no viene como se requiere se va devolver inmediatamente sin llegar al controlador

module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioID,
    existeCategoriaID,
    existeProductoID,
    coleccionesPermitidas

}