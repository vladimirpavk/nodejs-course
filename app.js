"//NodeJs - udemy course" 

const http=require('http');
const serverConfiguration = require('./server.module.js');

const server = http.createServer(
    serverConfiguration.serverConfig    
);

server.listen(3000);