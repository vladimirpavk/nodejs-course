const fs=require('fs');

const serverConfig = (request, response)=>{
    switch(request.method){
        case('GET'):{
            switch(request.url){
                case('/'):{
                    response.writeHead(200, 
                        {
                            'Content-Type': 'text/html'
                        });
                    fs.createReadStream('./site1.html').pipe(response);                        
                    break;
                }
                case('/users'):{
                    response.writeHead(200, 
                        {
                            'Content-Type': 'text/html'
                        });
                    fs.createReadStream('./site2.html').pipe(response);
                    break;
                }
                default:{
                    response.writeHead(200, 
                        {
                            'Content-Type': 'text/html'
                        });
                    fs.createReadStream('./nodest.html').pipe(response);
                    break;
                }
            }
            break;
        }
        case('POST'):{
            //console.log('POST request');
            const body = [];
            request.on('data', (chunk)=>{
                //console.log(chunk);
                body.push(chunk);
            })
            request.on('end', ()=>{
                const parsedBody = Buffer.concat(body).toString();
                const message = parsedBody.split('=')[1];
                console.log(message);
                //console.log(parsedBody);
                response.statusCode = 302;
                response.setHeader('Location', '/');
                return response.end();
            })
            break;
        }
        default:{

            break;
        }
    }      
}

module.exports.serverConfig = serverConfig;