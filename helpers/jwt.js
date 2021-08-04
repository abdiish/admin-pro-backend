const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {

    return new Promise( (resolve, reject) => {

        const payload = {
            uid
        };
        //Parametros que recibe,(uid, JWT)
        //Revisar archivo .env
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => { //Callbak, parametros que recibe (error, JWT)
    
            if ( err ) {
                console.log( err );
                reject('No se pudo generar el JWT');
            }else{
                resolve( token );
            }
    
        });

    });
}

module.exports = {
    generarJWT
}