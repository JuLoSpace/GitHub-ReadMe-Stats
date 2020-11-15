const { Console } = require('console');
const http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { CanvasRenderService } = require('chartjs-node-canvas');


const PORT = 8000;

http.createServer((req, res) => {
    res.setHeader("Content-Type", "image/jpg");
    res.writeHead(200);
    if(req.url != null) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', 'https://github-contributions.now.sh/api/v1' + req.url, false);
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
        const width = 550;
        const height = 400;
        const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => { });
        

        var config = {
            type: 'line',
            data: {
                labels: MONTHS,
                datasets: [{
                    label: 'CONTRIBUITING',
                    backgroundColor: "#40c463",
                    borderColor: "#40c463",
                    data: CONTRIBUITING,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: (req.url + "'s Stats").replace('/', '')
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