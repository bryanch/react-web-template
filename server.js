const express = require('express');
const ReactDOM = require('react-dom');
const config = require('./config');
const dist = require('./util/dist');

const app = express();

app.get('/', function(req, res, next){
    dist.sendStaticFile(res, 'index.html');
});

app.use(dist.static());

var port = config.env.port;
app.listen(port, function(){
    console.info(`The server is running at http://localhost:${port}/`);
});
