'use strict';

module.exports = visualize;

var _defaults = require('lodash').defaults;

function visualize(loopbackApp, options) {
    options = _defaults({}, options, {
        mountPath: '/visualize',
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

    models.length && models.forEach(function (Model) {
        var remotes = [];
        Model.sharedClass.methods().forEach(function (method) {
            remotes.push(method.name);
        });
        var modelDefinition = app.models[Model.modelName].definition;
        if (modelDefinition && modelDefinition.properties) {

            var propObj = {};
            propObj.id = idx;
            propObj.label = Model.modelName;
            propObj.props = '<ul><li>' + Object.keys(modelDefinition.properties).toString().split(',').join('<li>\n').replace('"', '') + '</ul>';
            propObj.level = level;
            propObj.remotes = remotes && '<ul><li>' + remotes.toString().split(',').join('<li>\n').replace('"', '') + '</ul>';
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

                var relObj = Model.settings.relations[relArr[rel]];
                if (relObj.model) {
                    var edgeObj = {};
                    edgeObj.from = modIdxObj[Model.modelName];
                    edgeObj.to = modIdxObj[relObj.model];
                    edgeObj.label = relArr[rel];
                    edgeObj.model = relObj.model;
                    edgeObj.type = relObj.type;
                    edgeObj.foreignKey = relObj.foreignKey;
                    edgeObj.options = relObj.options;
                    edgeObj.through = relObj.through;
                    edgeObj.title = Model.modelName + " " + relObj.type + " " + relObj.model;
                    if (relObj.through) edgeObj.title += " (through " + edgeObj.through + ")";
                    //default length and arrow direction
                    edgeObj.length = 100;
                    edgeObj.arrows = 'to';


                    //show middle circle if relation has a through object
                    if (relObj.through) {
                        //extend through relation edge lenght so it embraces the middle node
                        edgeObj.length = 300;

                        edgeObj.arrows = {
                            'middle': {
                                'enabled': true,
                                'type': 'circle'
                            },
                            'to': {
                                'enabled': true,
                                'type': 'arrow'
                            }
                        };
                    }

                    if (relObj.type == "belongsTo") {
                        //represent a belongsTo relation with a dashed line
                        edgeObj.dashes = true;
                    }
                    if (relObj.type == "hasAndBelongsToMany") {
                        //draw a many to many relation with double arrows
                        edgeObj.arrows = {
                            'from': {
                                'enabled': true,
                                'type': 'arrow'
                            },
                            'to': {
                                'enabled': true,
                                'type': 'arrow'
                            }
                        };
                    }
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

    return function (req, res, next) {
        var data = finalObj || {};
        var render = app.loopback.template(__dirname + '/template.ejs');
        var html = render(data);
        res.send(200, html);
    };

}

module.exports.prepareJson = prepareJson;