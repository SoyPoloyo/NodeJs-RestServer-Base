
const { Schema, model } = require('mongoose');

const NombreComercialSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre comercial es obligatorio']
    },
    laboratorio: {
        type: String,
    },
    principioActivo: {
        type: [String]
    },
    presentaciones: {
        type: Object
    },

})

module.exports = model('NombreComercial', NombreComercialSchema, 'NombresComerciales');
