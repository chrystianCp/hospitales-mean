const { response } = require('express');
const bcrypt = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        // VERIFICAR EMAIL
        const usuarioDB = await Usuario.findOne({ email });
        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'el usuario o la contraseña no son correctos (email)'
            });
        }
        // VERIFICAR CONTRASEÑA
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {

            return res.status(400).json({
                ok: false,
                msg: 'el usuario o la contraseña no son correctos (password)'
            });
            
        }

        // GENERAR EL JSON WEB TOKEN (JWS)
        const token = await generarJWT( usuarioDB.id )


        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuarioDB.role )
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}



const googleSingIn = async( req, res = response ) => {

    const googleToken = req.body.token;

    try {

        const {name, email, picture} = await googleVerify( googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if ( !usuarioDB ){
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;            
        }

        // guardar en base de datos
        await usuario.save();

        // Generar el Token - JWT
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuario.role )
        });
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token Google no es correcto',
            
        });
    }

     
}


const renewToken = async( req, res = response ) => {

    const uid = req.uid;

    // Generar el Token - JWT
    const token = await generarJWT( uid );

    // Obtener usuario por UID 
 
    const usuario = await Usuario.findById( uid );

    

    
    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd( usuario.role )
    });
}


module.exports = {
    login,
    googleSingIn,
    renewToken
} 