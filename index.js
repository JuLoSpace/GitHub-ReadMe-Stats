const { Console } = require('console');
const http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const PORT = 8000;

http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8;");
    res.writeHead(200);
    if(req.url != null) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', 'https://github-contributions.now.sh/api/v1' + req.url, false);
        xmlHttp.send(null);
        res.end(
            `
            <html><head>
                <title>Name's Stats</title>
                <script async="" src="https://www.google-analytics.com/analytics.js"></script>
                <script src="https://www.chartjs.org/dist/2.9.4/Chart.min.js"></script>
                <script src="https://www.chartjs.org/samples/latest/utils.js"></script>
                <style>
                canvas{
                    -moz-user-select: none;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                }
                </style>
            <style type="text/css">/* Chart.js */
            @keyframes chartjs-render-animation{from{opacity:.99}to{opacity:1}}.chartjs-render-monitor{animation:chartjs-render-animation 1ms}.chartjs-size-monitor,.chartjs-size-monitor-expand,.chartjs-size-monitor-shrink{position:absolute;direction:ltr;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1}.chartjs-size-monitor-expand>div{position:absolute;width:1000000px;height:1000000px;left:0;top:0}.chartjs-size-monitor-shrink>div{position:absolute;width:200%;height:200%;left:0;top:0}</style></head>

            <body>
                <div style="width:40%;"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                    <canvas id="canvas" style="display: block; width: 200px; height: 100px;" width="200px" height="100px" class="chartjs-render-monitor"></canvas>
                </div>
                <br>
                <br>
                <script>
                    var data = JSON.parse(JSON.stringify(${xmlHttp.responseText}));

                    let MONTHS = [];
                    let CONTRIBUITING = [];
                    for(var row in data['contributions'].reverse()) {
                        MONTHS.push(data['contributions'][row]['date']);
                        CONTRIBUITING.push(data['contributions'][row]['count']);
                    }

                    var config = {
                        type: 'line',
                        data: {
                            labels: MONTHS,
                            datasets: [{
                                label: 'Commits',
                                backgroundColor: window.chartColors.red,
                                borderColor: window.chartColors.red,
                                data: CONTRIBUITING,
                                fill: false,
                            }, {
                                label: 'Pull Requests',
                                fill: false,
                                backgroundColor: window.chartColors.blue,
                                borderColor: window.chartColors.blue,
                                data: [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5
                                ],
                            }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Chart.js Line Chart'
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

                    window.onload = function() {
                        var ctx = document.getElementById('canvas').getContext('2d');
                        window.myLine = new Chart(ctx, config);
                    };
                </script>



            </body></html>
            `
        );
    }
}).listen(PORT, () => console.log('Server has been started!'));