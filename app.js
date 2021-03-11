const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const cors = require('cors');

//.env variables
require('dotenv/config');

const app = express();

//Middlewares
//validate all request are json
app.use(bodyParser.json());
//use cors
//app.use(cors);

//Import routes
const beerRoutes = require('./routes/beerRoutes');
const authRoutes = require('./routes/authRoutes');

//use of /api/v1/xyz
app.use(process.env.BASE_URL+'/auth', authRoutes);
app.use(process.env.BASE_URL+'/beers', beerRoutes);

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
{ useUnifiedTopology: true, useNewUrlParser: true  },
 ()=> console.log('connected to mongoDB and running in port 3000')
 );

//listening to the server in port 3000
app.listen(process.env.PORT || 3000);
