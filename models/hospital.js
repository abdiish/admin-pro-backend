const { Schema, model } = require('mongoose');

//Definicion del esquema
 const HospitalSChema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
    
 }, { collection: 'hospitales'});

 //Extraer la version y id, que viene en la instancia del objeto
 HospitalSChema.method('toJSON', function() {

    const { __v, ...object } = this.toObject();
    return object;
 })

 //Implementacion del modelo
 module.exports = model('Hospital', HospitalSChema);