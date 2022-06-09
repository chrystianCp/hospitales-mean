require('dotenv').config();
const path = require('path');

const express = require('express');
var cors = require('cors');


const { dbConnection } = require('./database/config');


// CREAR EL SERVIDOR DE EXPRESS
const app = express();


//configurar CORS

app.use( cors() );


// Lectura y parse del body
app.use( express.json() );


//BASE DE DATOS
dbConnection();

//Directorio publico
app.use(express.static('public'));


// WIiZt8CK0JV6xgKU  
// mean_user

// mean_admin
// 36fuMLeSXrj0sjVD
//   mongodb+srv://mean_admin:36fuMLeSXrj0sjVD@cluster0.tgef7.mongodb.net/test
//   mongodb+srv://mean_user:WIiZt8CK0JV6xgKU@cluster0.tgef7.mongodb.net/test
/* 5cj070aGYqQ4mm6t */

//Rutas
app.use( '/api/todo', require('./routes/busquedas'));
app.use( '/api/usuarios', require('./routes/usuarios'));
app.use( '/api/hospitales', require('./routes/hospitales'));
app.use( '/api/medicos', require('./routes/medicos'));
app.use( '/api/login', require('./routes/auth'));
app.use( '/api/upload', require('./routes/uploads'));

// Lo último

app.get('*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});




app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});