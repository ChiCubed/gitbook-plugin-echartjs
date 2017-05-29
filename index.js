var Parser = require('expr-eval').Parser;
var parser = new Parser();

var countGraph = 0;

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
  let attr = '';
  attr += ( width != null ?  ' width="' +  width + '"': '');
  attr += (height != null ? ' height="' + height + '"': '');
  
  return '<div class="echartjs-wrapper">' +
             '<canvas id="' + chartID + '" class="chartjs"' + attr + '>' +
             '<script>' +
                 'new Chart(' +
                     'document.getElementById("' + chartID + '"),' +
                     JSON.stringify(config) + ');' +
             '</script>' +
         '</div>';
}


function processEquation(config) {
  // Process the configuration file given
  // that it was passed in as an equation
  // configuration, and convert it to a valid
  // chart.js configration.
  
  var final = {
    type: 'line',
    data: []
  };
  final.options = config.options;
  
  let equation = config.equation;
  let start = config.start;
  let stop = config.stop;
  let step = config.step;
  
  var expr = parser.parse(equation);
  for (var xpos = start; xpos <= stop; xpos += step) {
    final.data.push({x: xpos, y: expr.evaluate({x : xpos})});
  }
  
  return final
}

module.exports = {
  book: {css: ['style.css']},
  ebook: {css: ['style.css']},
  
  blocks: {
    echartjs: {
      process: function(block) {
        let chartID = 'echartjs-'+countGraph++;
        var config = parseConfig(block.body());
        let width = block.kwargs.width;
        let height = block.kwargs.height;
        
        if (block.kwargs.type !== undefined &&
            block.kwargs.type == "equation") {
          config = processEquation(config);
        }
        
        return genHTML(chartID, config, width, height);
      }
    }
  }
}
