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
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            nombresComerciales: '/api/nombres-comerciales',
            principiosActivos: '/api/principios-activos',
            productos: '/api/productos',
            usuarios: '/api/usuarios',

        }

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
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.principiosActivos, require('../routes/principios-activos'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.nombresComerciales, require('../routes/nombres-comerciales'));


    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor arriba, puerto: ${this.port}`);
        })
    }
}

module.exports = Server;