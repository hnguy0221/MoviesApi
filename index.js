//Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

//DB setup
mongoose.connect('mongodb://localhost/moviesapi');

// App setup - both morgan and body-parser are middlewares in express. Morgan is a logging framework.
app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }));//body-parser is use to parse incoming request into json.
app.use(express.static("public"));
router(app);

//Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app); //create http server that knows how to receive requests
server.listen(port);
console.log('Server listening on: ', port);