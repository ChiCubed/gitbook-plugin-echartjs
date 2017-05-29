'use strict';

var Parser = require('expr-eval').Parser;
var parser = new Parser();

var countGraph = 0;

let css = '.echartjs-wrapper canvas {' +
          '    -webkit-user-select: none;' +
          '    -moz-user-select: none;' +
          '    -ms-user-select: none;' +
          '    user-select: none;' +
          '}'

function parseConfig(config) {
  var final = null;
  
  try {
    final = JSON.parse(config);
  } catch (e) {
    console.error('[echartjs] Failed to parse chartjs configuration with error', e);
  }
  
  return final || {};
}

function genHTML(chartID, config, width, height) {
  var divstyle = ' style="';
  divstyle += ( width != null ?  ' width:' +  width + ';' : '');
  divstyle += (height != null ? ' height:' + height + ';' : '');
  divstyle += '"';
  
  
  var s = '';
  
  
  // In PDFs and other ebook formats
  // the charts won't show up.
  // So, convert them to images.
  // (I don't think that the scripts will
  //  actually be executed during PDF generation,
  //  so maybe just convert all the graphs to images
  //  like this.)
  if (this.output.name != "website" && this.output.name != "json") {
    s += '<img id="' + chartID + '-img" src=""/>';
  }
  
  
  s +=   '<div class="echartjs-wrapper"' + divstyle + '>' +
              '<canvas id="' + chartID + '" class="chartjs"></canvas>' +
              '<script>' +
                  'var config = ' + JSON.stringify(config) + ';' +
                  'var canvas = document.getElementById("' + chartID + '");'
  
  if (this.output.name != "website" && this.output.name != "json") {
    // use canvas width and height to choose an image size
    s +=          'function renderImg() {' +
                      'var img = document.getElementById("' + chartID + '-img");' +
                      'img.style.width = canvas.width;' +
                      'img.style.height = canvas.height;' +
                      'img.src = canvas.toDataURL("image/png");' +
                  '}' +
                  'if (config.options == null) { config.options = {}; }' +
                  'if (config.options.animation == null) { config.options.animation = {}; }' +
                  'config.options.animation.onComplete = renderImg;' + 
                  'config.options.animation.duration = 0;';
    // We set the duration to 0 above so that the image
    // renders immediately.
  }
  
  
  
  s +=            'new Chart(canvas, config);' +
              '</script>' +
          '</div>';
          
  return s;
}


function processEquation(config) {
  // Process the configuration file given
  // that it was passed in as an equation
  // configuration, and convert it to a valid
  // chart.js configration.
  
  var final = {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'y = ' + config.equation,
        data: [],
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,1)',
        fill: false
      }]
    }
  };
  final.options = config.options;
  
  let equation = config.equation;
  let start = config.start;
  let stop = config.stop;
  let step = config.step;
  
  var expr = parser.parse(equation);
  for (var xpos = start; xpos <= stop; xpos += step) {
    final.data.datasets[0].data.push({x: xpos, y: expr.evaluate({x : xpos})});
  }
  
  return final;
}

module.exports = {
  book: {css: ['style.css'], assets: './assets'},
  ebook: {css: ['style.css'], assets: './assets'},
  
  blocks: {
    echartjs: {
      process: function(block) {
        let chartID = 'echartjs-'+countGraph++;
        var config = parseConfig(block.body);
        let width = block.kwargs.width;
        let height = block.kwargs.height;
        
        if (block.kwargs.type == "equation") {
          config = processEquation(config);
        }
        
        return genHTML(chartID, config, width, height);
      }
    }
  }
}
