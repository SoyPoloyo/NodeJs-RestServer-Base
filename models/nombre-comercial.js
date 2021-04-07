
const { Schema, model, SchemaType } = require('mongoose');

const NombreComercialSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre comercial es obligatorio']
    },
    laboratorio: {
        type: String,
    },
    principioActivo: {
        type: [Schema.Types.ObjectId],
        ref:'PrincipioActivo',
        required: true
    },
    presentaciones: {
        type: Object
    },

})

module.exports = model('NombreComercial', NombreComercialSchema, 'NombresComerciales');
