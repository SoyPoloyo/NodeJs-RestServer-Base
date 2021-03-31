express = require('express');
const cors = require('cors')

//clase para levantar el server
class Server {
    //levantando el servidor
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        //http de las rutas
        this.usuariosPath = '/api/usuarios';
        //Middlewares
        this.middlewares();

        //Llamado a rutas de mi app
        this.routes();
    }

    middlewares() {
        //CORS
        this.app.use(cors());
        //JSON parse
        this.app.use(express.json());
        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/users'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Corriendo correctamente, puerto: ${this.port}`);
        })
    }
}

module.exports = Server;