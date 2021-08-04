/** 
 *  Logica de cada una de las rutas
*/
const { response } = require('express');
const bcrypt  = require('bcryptjs'); 
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res)=> {

    const usuarios =  await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuario = async (req, res = response)=> {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        // Validar correo, evitar duplicados
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
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
        //Desestructuración de objetos, permite desempacar valores 
        //de arreglos o propiedades de objetos en distintas variables 
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ) {
            
            const existeEmail = await Usuario.findOne({ email });

            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

        
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