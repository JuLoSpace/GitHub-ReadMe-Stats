const { Console } = require('console');
const http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { on } = require('process');

const PORT = 8000;

http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8;");
    res.writeHead(200);

    if(req.url != null) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', 'https://github-contributions.now.sh/api/v1' + req.url, false);
        xmlHttp.send(null);
        res.end(xmlHttp.responseText);
    }
}).listen(PORT, () => console.log('Server has been started!'));