 const { Schema, model } = require('mongoose');

//Definicion del esquema
 const UsuarioSChema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
 });

 //Extraer la version y id, que viene en la instancia del objeto
 UsuarioSChema.method('toJSON', function() {

    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
 })

 //Implementacion del modelo

 module.exports = model('Usuario', UsuarioSChema);