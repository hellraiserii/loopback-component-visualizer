'use strict';

module.exports = visualize;

var _defaults = require('lodash').defaults;

function visualize(loopbackApp, options) {
    options = _defaults({}, options, {
        mountPath: '/visualize'
    });
    loopbackApp.use(options.mountPath, createDiagram(loopbackApp, options));
}

function createDiagram(app, options) {

    var finalObj = prepareJson(app);

    return respond(finalObj, app);
}

function prepareJson(app) {

  var models = (app && app.models && app.models()) || {};
  var remotes = (app && app.remoteObjects && app.remoteObjects()) || {};
  var level = 0;
  var x = 0;
  var propArr = [];
  var edgeArr = [];
  var idx = 0;
  var modIdxObj = {};
  var finalObj = {};

  for (var i in models) {
      modIdxObj[models[i].modelName] = i;
  }

  models.length && models.forEach(function(Model) {
      var remotes = [];
      Model.sharedClass.methods().forEach(function(method) {
          remotes.push(method.name);
      });
      var modelDefinition = app.models[Model.modelName].definition;
      if (modelDefinition && modelDefinition.properties) {
          var propString = Object.keys(modelDefinition.properties).toString().split(",").join('<li>');

          var propObj = {};
          propObj.id = idx;
          propObj.name = Model.modelName;
          propObj.props = propString;
          propObj.level = level;
          propObj.remotes = remotes && remotes.toString().split(',').join('<li>');
          propArr.push(propObj);
          x++;
          if (x == 5) {
              x = 0;
              level++;
          }
      }
      //edges
      if (Model.settings.relations) {
          var relArr = Object.keys(Model.settings.relations);
          for (var rel in relArr) {
              if (Model.settings.relations[relArr[rel]].model) {
                  var edgeObj = {};
                  edgeObj.from = modIdxObj[Model.modelName];
                  edgeObj.to = modIdxObj[Model.settings.relations[relArr[rel]].model];
                  edgeArr.push(edgeObj);
              }
          }
      }


      idx++;
  });


  finalObj.nodes = propArr;
  finalObj.edges = edgeArr;

  return finalObj;
}

function respond(finalObj, app) {

  return function(req, res, next) {
      var data = finalObj || {};
      var render = app.loopback.template(__dirname + '/template.ejs');
      var html = render(data);
      res.send(200, html);
  };

}

module.exports.prepareJson = prepareJson;
