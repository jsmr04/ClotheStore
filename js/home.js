
getOrders();
getCategories();
getproducts();
//inflateChartSales();

function getCategories() {
    const cont = document.getElementById("qt-categ");
    const categoryRef = firebase.database().ref("category/");
    let count = 0
    categoryRef.on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        count++;
        //console.log(count);
        cont.innerHTML = count;
      });
    });
}

function getproducts() {
    const cont = document.getElementById("qt-prod");
    const Ref = firebase.database().ref("product/");
    let count = 0
    Ref.on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        count++;
        //console.log(count);
        cont.innerHTML = count;
      });
    });
}

function getOrders() {
  const cont = document.getElementById("qt-orders");
  const contPend = document.getElementById("qt-pendin");
  const Ref = firebase.database().ref("order/");
  let countAll = 0
  let pending = 0;
  let completed = 0;
  let rShip = 0;
  let shipped = 0;
  let march = 0;
  let orderData = [];
  let salesData = [];

  Ref.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      countAll++;
      //console.log(count);
      switch (childSnapshot.val()["status"]) {
        case "COMPLETED":
          completed++;
          break;
        case "PENDING":
          pending++;
          break;
        case "READY":
          rShip++;
          break;
        case "SHIPPED":
          shipped++;
          break;    
        default:
          break;
      }
      march = march + parseFloat(childSnapshot.val()["total"])
      console.log(march);
      cont.innerHTML = countAll;
      contPend.innerHTML = pending;
      console.log(orderData);
    })
    salesData = [0, 0, march];
    orderData = [completed, pending, rShip, shipped];
    inflateChartOrders(orderData);
    inflateChartSales(salesData);
  });
}

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
function inflateChartOrders(orders) {
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Completed", "Pending", "Ready for shipment", "Shipped"],
      datasets: [{
        data: orders,
        backgroundColor: ['#5a2d82', '#f6c23e', '#e74a3b', '#1cc88a'],
        hoverBackgroundColor: ['#513875', '#f4b619', '#e02d1b', '#17a673'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  });
}

function inflateChartSales(totalSales) {
  function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }
  
  // Area Chart Example
  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Total: C$",
        lineTension: 0.3,
        backgroundColor: "rgba(90, 45, 130, 0.05)",
        borderColor: "rgba(90, 45, 130, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(90, 45, 130, 1)",
        pointBorderColor: "rgba(90, 45, 130, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(90, 45, 130, 1)",
        pointHoverBorderColor: "rgba(90, 45, 130, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: totalSales,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 5,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
              return  number_format(value);
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#5a2d82",
        titleMarginBottom: 10,
        titleFontColor: '#5a2d82',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ' ' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
}
