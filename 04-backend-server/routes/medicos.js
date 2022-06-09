 //RUTA:  /MEDICOS/    '/api/medicos'    
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');


const { validarJWT } = require('../middleware/validar-jwt');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicosById
} = require('../controllers/medicos');

const router = Router();




router.get( '/',
        validarJWT, 
        getMedicos ); 


router.post( '/',
    [
        validarJWT,
        check('nombre','el nombre del medico es necesario').not().isEmpty(),
        check('hospital','el hospital id debe ser valido').isMongoId(),
        validarCampos
    ],
    crearMedico
);


router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre del médico es necesario').not().isEmpty(),
        check('hospital','El hospital id debe de ser válido').isMongoId(),
        validarCampos
    ],
    actualizarMedico
);

router.delete('/:id',
        validarJWT,
        borrarMedico
);

router.get('/:id',
        validarJWT,
        getMedicosById
);
 






module.exports = router;
