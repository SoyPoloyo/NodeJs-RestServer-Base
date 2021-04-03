const { response } = require("express")

const esAdminRole = (req, res = response, next) => {
    //verificamos que se haya recibido un token primero, para obtener los datos del usuario
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no cuenta con los permisos necesarios para esta peticion`
        })
    }

    next();
}

const tieneElRole = (...roles) => {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `No cuenta con los permisos para esta peticion`
            })
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneElRole
}