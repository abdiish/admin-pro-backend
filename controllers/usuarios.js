/** 
 *  Logica de cada una de las rutas
*/
const { response } = require('express');
const bcrypt  = require('bcryptjs'); 
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res)=> {

    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    // Paginar resultados
    // const usuarios =  await Usuario
    //                             .find({}, 'nombre email role google')
    //                             .skip( desde )
    //                             .limit( 5 );
    
    // Total de registros en la BD
    // const total = await Usuario.count();

    // Coleccion de promesas(ES6)
    // Desestructuración para extraer el resultado de la primera y segunda posición del arreglo
    const [ usuarios, total ] = await Promise.all([

        Usuario //Posicion 1 del arreglo
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ),
        
        Usuario.countDocuments() // Posición 2 del arreglo
    ])

    res.json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
    });
}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        // Validar correo, evitar duplicados
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'La dirección de correo electrónico que ha ingresado ya está registrada'
            });
        }

        const usuario = new Usuario(req.body);
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        //Guardar usuario, Mongo DB
        await usuario.save();
        //Genrar JWT
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            usuario: usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }   
    
}

const actualizarUsuario = async (req, res = response) => {

    //TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try {

        const usuarioBD = await Usuario.findById(uid);

        if ( !usuarioBD ) {
            
            return res.status(404).json({
                ok:false,
                msg: 'No existe un usuario por ese ID'
            });
        }

        //Actualizaciones
        const { password, google, email, ...campos } = req.body;
        console.log(usuarioBD);
        if(usuarioBD.email !== email) {
            
            const existeEmail = await Usuario.findOne({ email });

            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        //campos.email = email;

        if ( !usuarioBD.google ) {
            campos.email = email;
        } else if( usuarioBD.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de Google no puede cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioBD = await Usuario.findById( uid );

        if ( !usuarioBD ) {
            
            return res.status(404).json({
                ok:false,
                msg: 'No existe un usuario por ese ID'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = { 
    getUsuarios, 
    crearUsuario,
    actualizarUsuario,
    borrarUsuario 
}