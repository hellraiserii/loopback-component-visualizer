'use strict';

var _defaults = require('lodash').defaults;

module.exports = visualize;


function visualize(loopbackApp, options) {
  options = _defaults({}, options, { mountPath: '/visualize' });
  loopbackApp.use(options.mountPath, createDiagram(loopbackApp, options));
}

function createDiagram(app, options) {

  return function(req, res, next) {



    res.send(404,{'sample':'sample'});
  };
}
