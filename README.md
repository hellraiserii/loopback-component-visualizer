# loopback-component-visualizer

[![Build status](https://travis-ci.org/yantrashala/loopback-component-visualizer.svg?branch=v0.1.0)](https://travis-ci.org/yantrashala/loopback-component-visualizer)

[![GitHub issues](https://img.shields.io/github/issues/yantrashala/loopback-component-visualizer.svg)](https://github.com/yantrashala/loopback-component-visualizer/issues)

### Introduction

Visualizing a model is sometimes a difficult task. Its becomes more worse when the data model gets larger,
trying to understand how models relate to eachother.

loopback-component-visualizer helps you in creating a model diagram with the relation for you loopback application.

### Version
0.1.0

### Table of contents
* Installation
* Usage

#### Installation

```sh
$ npm install loopback-component-visualizer
```

#### Usage

Inside your component-config.json, add the loopback-component-visualizer and a '/visualize' api will be mounted to your server.

You can browse @ http://host:port/visualize

```sh
"loopback-component-visualizer": {
  "mountPath": "/visualize"
}
```

#### Preview

![A Relational Model](https://github.com/yantrashala/loopback-component-visualizer/v0.1.0/preview.png?raw=true "A Relational Model")
