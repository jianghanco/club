
jQuery(document).ready(function($) {

    $('#admin2020-date-range').daterangepicker({
        "autoApply": true,
        "maxSpan": {
           "days": 60
       },
      "locale": {
          'format': 'DD/MM/YYYY'
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "alwaysShowCalendars": true,
        "startDate": moment().subtract(1, 'month'),
        "endDate": moment(),
        "opens": "left"
    }, function(start, end, label) {

      Chart.helpers.each(Chart.instances, function(instance){
        if (instance.chart.canvas.id != 'commentstracker'){
          instance.destroy();
        }
      })
      admin_2020_build_charts();
    });

});

function admin2020_start_analytics(){


  if (getCookie('googleauth')){

    var scope = 'https://www.googleapis.com/auth/analytics.readonly'

    gapi.load('client:auth2', function(){
      gapi.client.load(
        'https://analyticsreporting.googleapis.com/$discovery/rest',
        'v4'
      ).then(function(response){

          var access = jQuery('#admin2020Cid').text();
          gapi.auth.authorize({client_id: access, scope: scope, immediate: true}, reAuthed, failedauth);

          //gapi.auth.setToken({ access_token: token });

      })
    })
  } else {
    jQuery('#noauthsignin').show();
  }

}
function failedauth(response){
  jQuery('#noauthsignin').show();
}

function reAuthed(response){
  token = response['access_token'];
  gapi.auth.setToken({ access_token: token });
  admin_2020_build_charts();
}

function admin_2020_build_charts(){

  jQuery('#gverror').hide();
  admin_2020_analytics_get_users();
  admin_2020_analytics_get_sessions();
  admin_2020_analytics_get_countries();
  admin_2020_analytics_get_devices();
  admin_2020_analytics_get_sessions_by_page();
  admin_2020_analytics_session_duration();

}
// Query the API and print the results to the page.
function admin2020_reauthorize(response) {

    token = response.getAuthResponse().id_token;
    accesstoken = response.getAuthResponse(true).access_token;
    scope = response.getAuthResponse(true).scope;

    setCookie('googleauth', 'true',30);
    admin_2020_build_charts();
    jQuery('#noauthsignin').hide();

}

function displayResults(response) {

  var report = response.result.reports;
  var data = report[0].data.rows;

  datesArray = [];
  valueArray = [];
  totalvisits = 0;

  for (i = 0; i < data.length; i++) {

    date = data[i].dimensions[0];
    value = data[i].metrics[0].values[0];
    totalvisits = Number(value) + totalvisits;

    bits = date.split('');
    year = bits[0]+bits[1]+bits[2]+bits[3];
    month = bits[4]+bits[5];
    day = bits[6]+bits[7];

    datesArray.push(day+'/'+month+'/'+year);
    valueArray.push(value);


  }

  senddata = [];

  var temp = {
      label: 'Users',
      data: valueArray,
      backgroundColor: "rgba(30, 135, 240, 0.2)",
      borderColor: "rgb(30, 135, 240)",
      pointBorderWidth: 0,
      borderWidth: 2,
      pointBackgroundColor: "rgba(30, 135, 240, 0.2)",
      pointBorderColor: "rgb(30, 135, 240)",
      clip: 100,
      lineTension: 0.3,
      spanGaps: true,
      pointRadius: 5,
      pointHoverRadius: 7
  }

  senddata.push(temp);

  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');
  var b = moment(startdate);
  var a = moment(enddate);
  days = a.diff(b, 'days');

  jQuery("#total-vists").text(totalvisits+" in the last "+days+" days");
  newchart('traffic_visits','line',datesArray,senddata);
}


function admin_2020_buildGraphFromPhp(data, dates, color, element, name) {

  senddata = [];

  var temp = {
      label: name,
      data: data,
      backgroundColor: "rgb("+color+")",
      borderColor: "rgb("+color+")",
      pointBorderWidth: 0,
      borderWidth: 2,
      clip: 100,
      lineTension: 0.3,
      spanGaps: true,
      pointRadius: 5,
      pointHoverRadius: 7
  }

  senddata.push(temp);

  newchart(element,'bar',dates,senddata);
}


function admin_2020_analytics_get_users(){

  viewid = jQuery('#admin2020trackingid').text();

  //console.log(gapi.auth.getToken().access_token);
  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');


  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
    },
    body: {
      reportRequests: [
        {
          viewId: viewid,
          dateRanges: [
            {
              startDate: startdate,
              endDate: enddate
            }
          ],
          metrics: [
            {
              expression: 'ga:users',
            }
          ],
          dimensions: [
          {
            name: "ga:date"
          }
        ]
        }
      ]
    }
  }).then(displayResults, function(error){
        //console.log(error);
        errormessage = error.result.error.message;
        jQuery('#gverror').text('Analytics: '+ errormessage).show();
        jQuery('#noauthsignin').show();
  });

}

function admin_2020_analytics_get_sessions(){

  viewid = jQuery('#admin2020trackingid').text();

  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');

  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
    },
    body: {
      reportRequests: [
        {
          viewId: viewid,
          dateRanges: [
            {
              startDate: startdate,
              endDate: enddate
            }
          ],
          metrics: [
            {
              expression: 'ga:pageviews',
            }
          ],
          dimensions: [
          {
            name: "ga:date"
          }
        ]
        }
      ]
    }
  }).then(displayResultsSessions, function(error){
        //console.log(error);
        errormessage = error.result.error.message;
        jQuery('#gverror').text('Analytics: '+ errormessage).show();
        jQuery('#noauthsignin').show();
  });

}

function displayResultsSessions(response) {

  var report = response.result.reports;
  var data = report[0].data.rows;

  datesArray = [];
  valueArray = [];
  totalvisits = 0;

  for (i = 0; i < data.length; i++) {

    date = data[i].dimensions[0];
    value = data[i].metrics[0].values[0];
    totalvisits = Number(value) + totalvisits;

    bits = date.split('');
    year = bits[0]+bits[1]+bits[2]+bits[3];
    month = bits[4]+bits[5];
    day = bits[6]+bits[7];

    datesArray.push(day+'/'+month+'/'+year);
    valueArray.push(value);


  }

  senddata = [];

  var temp = {
      label: 'Page Views',
      data: valueArray,
      backgroundColor: "rgba(255, 102, 236, 0.2)",
      borderColor: "rgb(255, 102, 236)",
      pointBorderWidth: 0,
      borderWidth: 2,
      pointBackgroundColor: "rgba(255, 102, 236, 0.2)",
      pointBorderColor: "rgb(255, 102, 236)",
      clip: 100,
      lineTension: 0.3,
      spanGaps: true,
      pointRadius: 5,
      pointHoverRadius: 7
  }

  senddata.push(temp);

  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');
  var b = moment(startdate);
  var a = moment(enddate);
  days = a.diff(b, 'days');


  jQuery("#totalsessions_text").text("In the last "+days+" days");
  jQuery("#admin2020_total_sessions").text(totalvisits);
  jQuery("#total-sessions").text(totalvisits+" page views in the last "+days+" days");
  newchart('session_visits','line',datesArray,senddata);
}


function admin_2020_analytics_get_countries(){

  viewid = jQuery('#admin2020trackingid').text();

  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');

  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
    },
    body: {
      reportRequests: [
        {
          viewId: viewid,
          pageSize: 10,
          dateRanges: [
            {
              startDate: startdate,
              endDate: enddate
            }
          ],
          metrics: [
            {
              expression: 'ga:sessions',
            }
          ],
          dimensions: [
          {
            name: "ga:country"
          }
        ],
        orderBys: [
          {
            fieldName: "ga:sessions",
            sortOrder: "DESCENDING"
          }
        ]
        }
      ]
    }
  }).then(displayResultscountries, function(error){
        //console.log(error);
        errormessage = error.result.error.message;
        jQuery('#gverror').text('Analytics: '+ errormessage).show();
        jQuery('#noauthsignin').show();
  });

}

function displayResultscountries(response) {

  var report = response.result.reports;
  var rows = report[0].data.rows;

  table = jQuery('#total-sessions-counntry tbody');
  jQuery(table).html('');

  for (i = 0; i < rows.length; i++) {

    data = rows[i];
    country = data.dimensions[0];
    value = data.metrics[0].values[0];
    jQuery(table).append('<tr><td>'+country+'</td><td class="uk-text-right">'+value+'</td></tr>');

  }
}




function admin_2020_analytics_session_duration(){

  viewid = jQuery('#admin2020trackingid').text();

  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');

  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
    },
    body: {
      reportRequests: [
        {
          viewId: viewid,
          pageSize: 10,
          dateRanges: [
            {
              startDate: startdate,
              endDate: enddate
            }
          ],
          metrics: [
            {
              expression: 'ga:avgSessionDuration',
            }
          ]
        }
      ]
    }
  }).then(displayResultsSessionDuration, function(error){
        //console.log(error);
        errormessage = error.result.error.message;
        jQuery('#gverror').text('Analytics: '+ errormessage).show();
        jQuery('#noauthsignin').show();
  });

}

function displayResultsSessionDuration(response) {

  var report = response.result.reports;
  var rows = report[0].data.rows;

  var sessionduration = rows[0].metrics[0].values[0];
  sessionduration = Number(sessionduration);
  minutes = parseInt((sessionduration/60)).toFixed(0);
  seconds = (sessionduration - (minutes * 60)).toFixed(2);

  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');
  var b = moment(startdate);
  var a = moment(enddate);
  days = a.diff(b, 'days');

  jQuery("#total_session_duration_text").text("In the last "+days+" days");
  jQuery("#admin2020_average_session_duration").text(minutes+"m "+seconds+"s");
}



function admin_2020_analytics_get_sessions_by_page(){

  viewid = jQuery('#admin2020trackingid').text();

  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');

  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
    },
    body: {
      reportRequests: [
        {
          viewId: viewid,
          pageSize: 10,
          dateRanges: [
            {
              startDate: startdate,
              endDate: enddate
            }
          ],
          metrics: [
            {
              expression: 'ga:pageviews',
            }
          ],
          dimensions: [
          {
            name: "ga:pagePath"
          }
        ],
        orderBys: [
          {
            fieldName: "ga:pageviews",
            sortOrder: "DESCENDING"
          }
        ]
        }
      ]
    }
  }).then(displayResultsViewsByPage, function(error){
        //console.log(error);
        errormessage = error.result.error.message;
        jQuery('#gverror').text('Analytics: '+ errormessage).show();
        jQuery('#noauthsignin').show();
  });

}

function displayResultsViewsByPage(response) {

  var report = response.result.reports;
  var rows = report[0].data.rows;

  table = jQuery('#total-sessions-page tbody');
  jQuery(table).html('');

  for (i = 0; i < rows.length; i++) {

    data = rows[i];
    country = data.dimensions[0];
    value = data.metrics[0].values[0];
    jQuery(table).append('<tr><td>'+country+'</td><td class="uk-text-right">'+value+'</td></tr>');

  }
}



function admin_2020_analytics_get_devices(){

  viewid = jQuery('#admin2020trackingid').text();

  startdate = jQuery("#admin2020-date-range").data('daterangepicker').startDate.format('YYYY-MM-DD');
  enddate = jQuery("#admin2020-date-range").data('daterangepicker').endDate.format('YYYY-MM-DD');

  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
    },
    body: {
      reportRequests: [
        {
          viewId: viewid,
          pageSize: 10,
          dateRanges: [
            {
              startDate: startdate,
              endDate: enddate
            }
          ],
          metrics: [
            {
              expression: 'ga:sessions',
            }
          ],
          dimensions: [
          {
            name: "ga:deviceCategory"
          }
        ],
        orderBys: [
          {
            fieldName: "ga:sessions",
            sortOrder: "DESCENDING"
          }
        ]
        }
      ]
    }
  }).then(displayResultsDevices, function(error){
        //console.log(error);
        errormessage = error.result.error.message;
        jQuery('#gverror').text('Analytics: '+ errormessage).show();
        jQuery('#noauthsignin').show();
  });

}

function displayResultsDevices(response) {

  var report = response.result.reports;
  var rows = report[0].data.rows;

  devices = [];
  values = [];

  for (i = 0; i < rows.length; i++) {

    data = rows[i];
    device = data.dimensions[0];
    value = data.metrics[0].values[0];
    devices.push(device);
    values.push(value);

  }

  senddata = [];

  var temp = {
      label: 'Devices',
      data: values,
      backgroundColor: ["rgba(30, 135, 240,0.2)","rgba(255, 159, 243,0.2)","rgba(29, 209, 161, 0.2)"],
      borderColor: [ "rgb(30, 135, 240)","rgb(255, 159, 243)"],
      pointBorderWidth: 0,
      borderWidth: 2,
      pointBackgroundColor: "rgba(255, 102, 236, 0.2)",
      pointBorderColor: "rgb(95, 39, 205)",
      clip: 100,
      lineTension: 0.3,
      spanGaps: true,
      pointRadius: 5,
      pointHoverRadius: 7
  }

  senddata.push(temp);


  newchart('device_visits','doughnut',devices,senddata);



}



function displayResultscountries(response) {

  var report = response.result.reports;
  var rows = report[0].data.rows;

  table = jQuery('#total-sessions-counntry tbody');
  jQuery(table).html('');

  for (i = 0; i < rows.length; i++) {

    data = rows[i];
    country = data.dimensions[0];
    value = data.metrics[0].values[0];
    jQuery(table).append('<tr><td>'+country+'</td><td class="uk-text-right">'+value+'</td></tr>');

  }
}




function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  if(document.domain === 'localhost') {
      window.localStorage.setItem(name, value);
  } else {
      document.cookie = encodeURI(name) + '=' + encodeURI(value) + ';domain=.' + document.domain + ';path=/;';
  }
}

function getCookie(name) {
  if(document.domain === 'localhost') {
    return window.localStorage.getItem(name);
  }
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}


function admin_2020_date_convert(unix_timestamp){
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}




function newchart(target,type,labels,data){

    //var canvas = document.getElementById(target);
    var ctx = document.getElementById(target).getContext("2d");

    var myChart = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: senddata,
      },
      options: {

        cutoutPercentage: 80,
        elements: {
            arc: {
                borderWidth: 12
            }
          },

        legend: {
          display: false,
          labels: {
            align: "start",
            boxWidth: 5,
            fontColor: "#999",
            usePointStyle: true,
            padding: 0
          }
        },
        plugins: {
          datalabels: {
            display: false,
            backgroundColor: ["#8300ad"]
          }
        },
        maintainAspectRatio: true,
        scales: {
          yAxes: [
            {

            stacked: true,
              ticks: {
                display: false,
                padding: 20,
                fontColor: "#999",
                autoSkip: true,
                maxTicksLimit: 5,
                beginAtZero: true
              },
              gridLines: {
                display: false,
                drawBorder: false,
                tickMarkLength: 0

              }
            }
          ],
          xAxes: [
            {
            stacked: true,
              gridLines: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                display: false,
                padding: 0,
                fontColor: "#999",
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
}

Chart.elements.Rectangle.prototype.draw = function() {

    var ctx = this._chart.ctx;
    var vm = this._view;
    var left, right, top, bottom, signX, signY, borderSkipped, radius;
    var borderWidth = vm.borderWidth;
    // Set Radius Here
    // If radius is large enough to cause drawing errors a max radius is imposed
    var cornerRadius = 4;

    if (!vm.horizontal) {
        // bar
        left = vm.x - vm.width / 2;
        right = vm.x + vm.width / 2;
        top = vm.y;
        bottom = vm.base;
        signX = 1;
        signY = bottom > top? 1: -1;
        borderSkipped = vm.borderSkipped || 'bottom';
    } else {
        // horizontal bar
        left = vm.base;
        right = vm.x;
        top = vm.y - vm.height / 2;
        bottom = vm.y + vm.height / 2;
        signX = right > left? 1: -1;
        signY = 1;
        borderSkipped = vm.borderSkipped || 'left';
    }

    // Canvas doesn't allow us to stroke inside the width so we can
    // adjust the sizes to fit if we're setting a stroke on the line
    if (borderWidth) {
        // borderWidth shold be less than bar width and bar height.
        var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
        borderWidth = borderWidth > barSize? barSize: borderWidth;
        var halfStroke = borderWidth / 2;
        // Adjust borderWidth when bar top position is near vm.base(zero).
        var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
        var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
        var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
        var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
        // not become a vertical line?
        if (borderLeft !== borderRight) {
            top = borderTop;
            bottom = borderBottom;
        }
        // not become a horizontal line?
        if (borderTop !== borderBottom) {
            left = borderLeft;
            right = borderRight;
        }
    }

    ctx.beginPath();
    ctx.fillStyle = vm.backgroundColor;
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = borderWidth;

    // Corner points, from bottom-left to bottom-right clockwise
    // | 1 2 |
    // | 0 3 |
    var corners = [
        [left, bottom],
        [left, top],
        [right, top],
        [right, bottom]
    ];

    // Find first (starting) corner with fallback to 'bottom'
    var borders = ['bottom', 'left', 'top', 'right'];
    var startCorner = borders.indexOf(borderSkipped, 0);
    if (startCorner === -1) {
        startCorner = 0;
    }

    function cornerAt(index) {
        return corners[(startCorner + index) % 4];
    }

    // Draw rectangle from 'startCorner'
    var corner = cornerAt(0);
    ctx.moveTo(corner[0], corner[1]);

    for (var i = 1; i < 4; i++) {
        corner = cornerAt(i);
        nextCornerId = i+1;
        if(nextCornerId == 4){
            nextCornerId = 0
        }

        nextCorner = cornerAt(nextCornerId);

        width = corners[2][0] - corners[1][0];
        height = corners[0][1] - corners[1][1];
        x = corners[1][0];
        y = corners[1][1];

        var radius = cornerRadius;

        // Fix radius being too large
        if(radius > height/2){
            radius = height/2;
        }if(radius > width/2){
            radius = width/2;
        }

        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);

    }

    ctx.fill();
    if (borderWidth) {
        ctx.stroke();
    }
};
