
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

    const { usuario: userDB, token: tokenDB } = await resp.json();

    //renovamos el token
    localStorage.setItem('utkn', tokenDB)

    usuario = userDB;

    document.title = usuario.nombre

    await conectarSocket()

}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
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

    socket.on('recibir-mensajes', dibujarmensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', dibujarmensajesPrivados);


}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
        <li>
        <p> 
        <h5 class="text-success">${nombre} </h5>
        <span class="fs-6 text-muted">${uid}</span>
        </p>
        </li>
        `
    })
    ulUsuarios.innerHTML = usersHtml
}

const dibujarmensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje, uid }) => {
        mensajesHtml += `
        <li>
        <p> 
        <span class="text-primary">${nombre}: </span>
        <span class="">${mensaje}</span>
        </p>
        </li>
        `
    })
    ulMensajes.innerHTML = mensajesHtml
}

const dibujarmensajesPrivados = (privados) => {
    

    ulMensajes.innerHTML += `
        <li>
        <p> 
        <span class="text-primary">${privados.de}: </span>
        <span class="">${privados.mensaje}</span>
        </p>
        </li>
        `

}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; }
    if (mensaje.length === 0) { return; }


    socket.emit('enviar-mensaje', { mensaje, uid })

    txtMensaje.value = '';
})

const main = async () => {

    await validarJWT();

}

main();


