//@ sourceURL=Charts.js
var Charts = {
    //TODO: Require.js

    pie: function (id, data, title) {
        $('#' + id).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: title,
                align: 'center',
                verticalAlign: 'middle',
                y: 50
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})Bytes'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: 5,
                        shadow: true,
                        color: "#333333"
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%'],
                    colors: ["#00FF00", "#FF0000", "#0000FF"]
                }
            },
            series: [
                {
                    type: 'pie',
                    name: 'Oran',
                    innerSize: '50%',
                    data: data
                }
            ]
        });
    },
    column: function (id, data, xAxisName, yAxisName, title, serverUptime, categoryList) {
        $(function () {
            $('#' + id).highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: title
                },
                subtitle: {
                    text: serverUptime
                },
                xAxis: {
                    categories: categoryList
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: yAxisName
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [
                    {
                        name: xAxisName,
                        data: data

                    }
                ]
            });
        });


    },


    gauge: function (id, data, title) {
        $('#' + id).highcharts({
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },

            title: {
                text: title
            },
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [
                    {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    },
                    {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    },
                    {
                        // default background
                    },
                    {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }
                ]
            },

            yAxis: {
                min: 0,
                max: data[1],

                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 5,
                minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: 'Active Thread'
                },
                plotBands: [
                    {
                        from: 0,
                        to: (data[1] * 0.7).toFixed(0),
                        color: '#55BF3B' // green
                    },
                    {
                        from: (data[1] * 0.7).toFixed(0),
                        to: (data[1] * 0.85).toFixed(0),
                        color: '#DDDF0D' // yellow
                    },
                    {
                        from: (data[1] * 0.85).toFixed(0),
                        to: data[1],
                        color: '#DF5353' // red
                    }
                ]
            },

            series: [
                {
                    name: 'Active',
                    data: [data[0]]
                }
            ]

        });
    },
    row: function (id, names, series, yAxisText) {
        $('#' + id).highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Robe Admin Resources Perfonmance'
            },
            subtitle: {
                text: 'www.robe.io'
            },
            xAxis: {
                categories: names,
                title: {
                    text: "Resources Service"
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: yAxisText,
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' '
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                floating: true,
                borderWidth: 1,
                backgroundColor: ('#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: series
        });
    }
}