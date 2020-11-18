const { Console } = require('console');
const http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { CanvasRenderService } = require('chartjs-node-canvas');
var url = require("url");


const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.setHeader("Content-Type", "image/jpg");
    res.writeHead(200);

    var parsedUrl = url.parse(req.url, true);
    var query = parsedUrl.query;

    if(req.url != null) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', 'https://github-contributions.now.sh/api/v1/' + query.name, false);
        xmlHttp.send(null);

        var data = JSON.parse(xmlHttp.responseText);
        let MONTHS = [];
        let CONTRIBUITING = [];
        var count = 0;
        var count_cont = 0;
        for(var row in data['contributions'].reverse()) {
            if(count == 7) {
                MONTHS.push(data['contributions'][row]['date']);
                CONTRIBUITING.push(count_cont);
                count_cont = 0;
                count = 0;
            } else  {
                count += 1;
                count_cont += data['contributions'][row]['count'];
            }
        }
        const width = 1000;
        const height = 600;
        const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => { });
        

        var config = {
            type: 'line',
            data: {
                labels: MONTHS,
                datasets: [{
                    label: 'CONTRIBUITING',
                    backgroundColor: query.theme == 'react' ? "#8b00ff" : "#40c463",
                    borderColor: query.theme == 'react' ? "#002137" : "#40c463",
                    data: CONTRIBUITING,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: (query.name + "'s Stats")
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            }
        };

        (async () => {
            const configuration = config;
            const image = await canvasRenderService.renderToBuffer(configuration);
            res.end(image);
        })();
    }
}).listen(PORT, () => console.log('Server has been started!'));