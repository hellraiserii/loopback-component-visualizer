#!/usr/bin/env node

var boot = require('loopback-boot');
var ejs = require('ejs');
var open = require("open");
var fs = require('fs');

console.log('Generating ER diagram. Please wait..')
//read server folder of loopback application
var opt = process.cwd() + '/server';
try {
  //load ejs template to generate html
  var temp = fs.readFileSync(__dirname + '/template.ejs').toString();
  //compile template
  var template = ejs.compile(temp);
  //execute boot.compile and add data to template
  var result = template(boot.compile(opt));
}
catch(e) {
  console.log('An error occured in reading loopback boot instrutions.', e);
  process.exit(0);
}

//write result to html file
fs.writeFile('output.html', result, function(err) {
    if(err) {
      console.log('An error occured in generating ER diagram html file.', err);
    }
    else {
      console.log('DONE!');
      open(process.cwd() + "/output.html");
    }

});
