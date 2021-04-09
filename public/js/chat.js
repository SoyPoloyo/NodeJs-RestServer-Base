
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/auth/'
    : 'https://helium-restserver.herokuapp.com/api/auth/';

//Referencias HTMLconst 
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');




let usuario = null;
let socket = null;

// validar el token del local storage
const validarJWT = async () => {

    const token = localStorage.getItem('utkn') || '';

    if (token.length <= 10) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: { 'u-token': token }
    });

    const { usuario: userDB, token:tokenDB } = await resp.json();
    
    //renovamos el token
    localStorage.setItem('utkn', token)

    usuario = userDB;

    document.title = usuario.nombre

    await conectarSocket()

}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders':{
            'u-token': localStorage.getItem('utkn')
        }
    });

    //enviar mensaje al usuarioo que se conecto
    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', () => {
        //porhacer
    });

    socket.on('usuarios-activos', () => {
        //porhacer
    });

    socket.on('mensaje-privado', () => {
        //porhacer
    });


}

const main = async () => {

    await validarJWT();

}

main();


