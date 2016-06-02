'use strict';

var _defaults = require('lodash').defaults;
var path = require('path');

var STATIC_ROOT = path.join(__dirname, 'public');
module.exports = visualize;

function visualize(loopbackApp, options) {

    options = _defaults({}, options, {
        mountPath: '/visualize'
    });
    loopbackApp.use(options.mountPath, visualizeRoutes(loopbackApp, options));
}

function visualizeRoutes(loopbackApp, options) {
    var loopback = loopbackApp.loopback;

    var router = new loopback.Router();

    var resourcePath = '/visual.json';

    var boundedContext = {};

    loopbackApp.on('modelRemoted', function() {
      boundedContext = createDiagram(loopbackApplication, opts);
    });

    loopbackApp.on('remoteMethodDisabled', function() {
      boundedContext = createDiagram(loopbackApplication, opts);
    });

    boundedContext = createDiagram(loopbackApp, router, options);
    router.get('/vis/:modelName', function(req, res) {
      res.status(200).send(boundedContext);
    });

    router.use(loopback.static(STATIC_ROOT));
    return router;
}

function createDiagram(app, options) {
    var models = app.models();
    var remotes = app.remoteObjects();
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

    models.forEach(function(Model) {
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
            propObj.color = '#999999';
            propObj.level = level;
            propObj.remotes = remotes.toString().split(',').join('<li>');
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
