const { Schema, model } = require('mongoose');

//Definicion del esquema
 const MedicoSChema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
    
 });

 //Extraer la version y id, que viene en la instancia del objeto
 MedicoSChema.method('toJSON', function() {

    const { __v, ...object } = this.toObject();
    return object;
 })

 //Implementacion del modelo
 module.exports = model('Medico', MedicoSChema);