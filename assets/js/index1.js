// load awal
document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.querySelector('.app-sidebar__toggle');
    if (sidebarToggle) {
        sidebarToggle.click();
    }
    var http = new XMLHttpRequest();
    http.open("GET", "https://mycloud.devazy.iotflows.com/getArrayData?data=0", true);
    http.send();
    chartTank();
});

// CHART LINE
function createTankChart(id, data) {
    var ctx = document.getElementById(id);
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeseries,
            datasets: [{
                label: id,
                borderColor: "#00ff04",
                borderWidth: 2,
                lineTension: 0,
                backgroundColor: "rgba(64, 255, 0, .2)",
                fill: true,
                data: data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: "#9ba6b5",
                    },
                    grid: {
                        color: 'rgba(119, 119, 142, 0.2)'
                    }
                },
                y: {
                    ticks: {
                        beginAtZero: true,
                        color: "#9ba6b5",
                    },
                    grid: {
                        color: 'rgba(119, 119, 142, 0.2)'
                    },
                }
            },
            plugins: {
                legend: {
                    display: true
                },
            },
            elements: {
                point: {
                    pointStyle: "circle",
                    radius: 1,
                }
            }
        }
    });
}

var timeseries = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
var tank1Data = [14, 10, 7, 4, 10, 8, 11, 5, 11, 8, 5, 4, 8, 7, 0, 10, 5, 2, 14, 19, 9, 14, 5, 13];

var chartTank1 = createTankChart('tank1', tank1Data);
var chartTank2 = createTankChart('tank2', tank1Data);
var chartTank3 = createTankChart('tank3', tank1Data);
var chartTank4 = createTankChart('tank4', tank1Data);

function updateChart(chart, time, data) {
    chart.data.labels = time;
    chart.data.datasets[0].data = data;
    chart.update(); // Memperbarui chart
}

function chartTank() {
    var http = new XMLHttpRequest();
    http.open("GET", "https://mycloud.devazy.iotflows.com/getArrayData?data=1", true);
    http.send();

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            timeseries = data.time;
            updateChart(chartTank1, timeseries, data.tank1);
            updateChart(chartTank2, timeseries, data.tank2);
            updateChart(chartTank3, timeseries, data.tank3);
            updateChart(chartTank4, timeseries, data.tank4);
        }
    }
    setTimeout(chartTank, 20000);
};

// button dropdown
function btn_sub(ID) {
    const dropdownItems = document.querySelectorAll(`#${ID}Dropdown .dropdown-item`);
    var http = new XMLHttpRequest();
    dropdownItems.forEach((item) => {
        item.addEventListener('click', () => {
            const selectedValue = item.getAttribute('data-value');
            http.open("GET", "https://mycloud.devazy.iotflows.com/getArrayData?data=" + selectedValue, true);
            http.send();
            document.getElementById(ID).textContent = selectedValue;
        });
    });
}


// CHART GAUGE
function createGauge(ID, data, max, color, label) {
    return new JustGage({
        id: ID,
        value: data,
        levelColors: color,
        min: 0,
        max: max,
        label: label,
        decimals: 2,
        gaugeWidthScale: 0.8,
        counter: true,
        formatNumber: true,
        tittleFontSize: 12
    });
}

var colorFuel = ["#40ff00"];
var colorTemp = ["#ffd500"];
var colorDens = ["#00eaff"];

var chartFuel1 = createGauge('fuel1', 372, 850, colorFuel, "Liter");
var chartFuel2 = createGauge('fuel2', 720, 850, colorFuel, "Liter");
var chartFuel3 = createGauge('fuel3', 576, 850, colorFuel, "Liter");
var chartFuel4 = createGauge('fuel4', 105, 850, colorFuel, "Liter");

var chartTemp1 = createGauge('temp1', 27, 100, colorTemp, "Celcius");
var chartTemp2 = createGauge('temp2', 38, 100, colorTemp, "Celcius");
var chartTemp3 = createGauge('temp3', 47, 100, colorTemp, "Celcius");
var chartTemp4 = createGauge('temp4', 72, 100, colorTemp, "Celcius");

var chartDens1 = createGauge('dens1', 0.95, 2, colorDens, "kg/liter");
var chartDens2 = createGauge('dens2', 0.85, 2, colorDens, "kg/liter");
var chartDens3 = createGauge('dens3', 0.72, 2, colorDens, "kg/liter");
var chartDens4 = createGauge('dens4', 1.32, 2, colorDens, "kg/liter");

function refreshGauge(gauge, value) {
    gauge.refresh(value);
}

// get data
var fuel = ['FuelTangki1', 'FuelTangki2', 'FuelTangki3', 'FuelTangki4'];
var temp = ['TempTangki1', 'TempTangki2', 'TempTangki3', 'TempTangki4'];
var dsg = ['DSG1', 'DSG2', 'DSG3', 'DSG4'];

function start() {
    var http = new XMLHttpRequest();
    http.open("GET", "https://mycloud.devazy.iotflows.com/getCurrentData", true);
    http.send();

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            for (var i = 0; i < 4; i++) {
                if (data[0][fuel[i]] == -1) {
                    data[0][fuel[i]] = 0;
                } if (data[0][temp[i]] == -1) {
                    data[0][temp[i]] = 0;
                } if (data[0][dsg[i]] == -1) {
                    data[0][dsg[i]] = 0;
                }
                refreshGauge(eval('chartFuel' + [i + 1]), data[0][fuel[i]]);
                refreshGauge(eval('chartTemp' + [i + 1]), data[0][temp[i]]);
                refreshGauge(eval('chartDens' + [i + 1]), data[0][dsg[i]]);
            }
            setTimeout(start, 5000);
        }
    };
}
start();
