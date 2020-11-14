const { Console } = require('console');
const http = require('http');

const PORT = 8000;

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, Node.js!');
}).listen(PORT, () => console.log('Server has been started!'));