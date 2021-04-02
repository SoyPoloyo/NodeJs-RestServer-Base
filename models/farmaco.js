

const { Schema, model } = require('mongoose');


const NombresComerciales = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre comercial es obligatorio']
    },
    laboratorio: {
        type: String,
    },
    presentaciones: {
        type: Array,
    },

})



const FarmacoSchema = Schema({
    principioActivo: {
        type: String,
        required: [true, 'El principio activo es obligatorio']
    },
    categoria: {
        type: String,
        required: [true, 'La categoria es obligatorio'],
        emun: ['GASTRICO', 'otras..']
    },
    mecanismoAccion: {
        type: [String],
    },
    indicaciones: {
        type: [String],
    },
    efectosAdversos: {
        type: [String],
    },
    contraindicaciones: {
        type: [String],
    },
    interacciones: {
        type: [String],
    },
    embarazo: {
        type: String,
        emun: ['Categoria B', 'otras..']
    },
    nombresComerciales: {
        type: [NombresComerciales]
    }

});


module.exports = model('Farmaco', FarmacoSchema);



