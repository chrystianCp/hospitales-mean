const { response } = require('express');
const bcrypt = require('bcryptjs');

//const { validationResult } = require('express-validator');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async(req, res) =>{

    const desde = Number(req.query.desde) || 0; 
                 
    const [ usuarios, total ] = await Promise.all([
    
    Usuario
        .find({}, 'nombre email role google img')
        .skip( desde )
        .limit( 5 ),

    Usuario.countDocuments(),

    ])

    res.json({
        ok: true,
        usuarios,
        total 
    }); 


} 

const crearUsuario = async(req, res = response) =>{

    const { email, password } = req.body;

    

       try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correro ya está registrado'
            });
        }

    const usuario = new Usuario( req.body );

    
    //Encriptar constraseña 
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );
    
    
    // Guardar al usuario
    await usuario.save();
    
    // Generar JWT Token 
    const token = await generarJWT( usuario.id );

    res.json({
        ok: true,
        usuario,
        token
    }); 

    }catch (error) { 
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error insesperado... revisar logs'
        });
    }

} 


const actualizarUsuario = async (req, res = response) => {
    
    // Todo: validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: fakse,
                msg: 'no existe un usuario con ese ID'
            });
        }

        //Actualizaciones

        const { password, google, email,  ...campos} = req.body;

        if( usuarioDB.email !== email ){
            
            const existeEmail = await Usuario.findOne({ email });
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        } 

        if ( !usuarioDB.google ) {
            campos.email = email;            
        } else if ( usuarioDB.email !== email ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no puede cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );
 

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        req.status(500).json({
            ok: false,
            msg: 'Error insesperado'
        })
    }


}


const borrarUsuario = async( req, res = response ) => {
   
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: fakse,
                msg: 'no existe un usuario con ese ID'
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