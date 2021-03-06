/**
 *  Ruta: /api/usuarios
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario} = require('../controllers/usuarios');
const { 
    validarJWT, 
    validarAdminRole, 
    validarAdminRolMismoUsuario 
    } = require('../middlewares/validar-jwt');

const router = Router();

//Controlador
router.get( '/', validarJWT, getUsuarios );

//Ruta para crear usuarios
//Middleware, validar nombre,password, etc..(se pasa como segundo parametro)
router.post( '/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    crearUsuario 
);

router.put( '/:id', 
    [   
        validarJWT,
        validarAdminRolMismoUsuario,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarUsuario
);

router.delete( '/:id', [validarJWT, validarAdminRole], borrarUsuario);

module.exports = router;