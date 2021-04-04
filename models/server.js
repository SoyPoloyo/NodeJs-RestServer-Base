express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');
 
//clase para levantar el server
class Server {
    //levantando el servidor
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //http de las rutas
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.principioActivoPath = '/api/principios-activos';
        this.nombreComercialPath = '/api/nombres-comerciales';
        

        //Coneccion a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Llamado a rutas de mi app
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
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
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.principioActivoPath, require('../routes/principio-activo'));
        this.app.use(this.nombreComercialPath, require('../routes/nombre-comercial'));
        
       
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor arriba, puerto: ${this.port}`);
        })
    }
}

module.exports = Server;