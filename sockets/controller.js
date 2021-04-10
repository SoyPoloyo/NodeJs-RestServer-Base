const { Socket } = require("socket.io")
const { comprobarJWT } = require('../helpers');
const { ChatInfo } = require("../models");

const chatInfo = new ChatInfo();

//********Borrar el new Socket, solamente se puso para tener el tipado de autocompletado ************************ */
const socketController = async (socket = new Socket(), io) => {

    console.log('cliente conectado', socket.id);

    const usuario = await comprobarJWT(socket.handshake.headers['u-token']);

    if (!usuario) {
        return socket.disconnect();
    }

    //agregar usuario al chat
    chatInfo.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatInfo.usuariosArr)
    socket.emit('recibir-mensajes', chatInfo.ultimos10)

    //conectarlo a una sala especial
    socket.join(usuario.id); //va tener 3 salas al conectarse la global, la propia socket.id,  y una de usuario // 

    //sacar usuario del chat
    socket.on('disconnect', () => {

        chatInfo.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos', chatInfo.usuariosArr)
    })

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        if (uid) {
            //significaria que es privado

            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje })
        } else {
            // para todos
            chatInfo.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatInfo.ultimos10)
        }


    })
}


module.exports = {
    socketController
}