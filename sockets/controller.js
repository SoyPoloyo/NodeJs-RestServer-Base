const { Socket } = require("socket.io")
const { comprobarJWT } = require('../helpers')

//********Borrar el new Socket, solamente se puso para tener el tipado de autocompletado ************************ */
const socketController = async (socket = new Socket()) => {

    console.log('cliente conectado', socket.id);

    const usuario = await comprobarJWT(socket.handshake.headers['u-token']);

    if (!usuario) {
        return socket.disconnect();
    }

    console.log('Se conecto', usuario.nombre);
}


module.exports = {
    socketController
}