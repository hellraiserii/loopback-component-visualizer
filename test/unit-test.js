var loopback = require('loopback');
var visualize = require('../');
var request = require('supertest');
var expect = require('chai').expect;
var application;

describe('checkFinalObject', function() {
  beforeEach(function() {
    application = loopback({localRegistry: true, loadBuiltinModels : true});
    var customerProperties = {
      name: {type: String, required: true}
    };
    var customerOptions = {
      "relations": {
          "address": {
            "type": "embedsOne",
            "model": "Address",
            "property": "billingAddress",
            "options": {
              "validate": true,
              "forceId": false
            }
          }
      }
    }

    var addressProperties = {
      street: {type: String, required: true},
      city: {type: String, required: true},
      state: {type: String, required: true}
    };

    var Address = loopback.Model.extend('Address', addressProperties);

    application.model(Address);

    var Customer = loopback.Model.extend('Customer', customerProperties, customerOptions);

    Customer.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    Customer.remoteMethod(
        'greet',
        {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
        }
    );

    application.model(Customer);

  });

  it('should compare the finalObject for address and customer.', function(done) {
      var finalObj = visualize.prepareJson(application);
      expect(finalObj.nodes).to.have.lengthOf(2);
      expect(finalObj.nodes[0]).to.contain.all.keys({'label': 'Address'});
      expect(finalObj.nodes[0]).to.contain.all.keys({'label': 'Customer'});
      done();
  });

  it('should compare the finalObject by sending an empty object.', function(done) {
      var finalObj = visualize.prepareJson({});
      expect(finalObj.nodes).to.have.lengthOf(0);
      expect(finalObj.edges).to.have.lengthOf(0);
      done();
  });

});

describe('visualize', function() {
  describe('with default config', function() {
    beforeEach(createLoopbackApplication());

    it('should redirect to /visualize/', function(done) {
      request(this.app)
        .get('/visualize')
        .expect(200)
        .end(done);
    });


  });
});


function createLoopbackApplication(basePath) {
  return function(done) {
    var app = this.app = loopback({localRegistry: true, loadBuiltinModels : true});

    var customerProperties = {
      name: {type: String, required: true}
    };
    var customerOptions = {
      "relations": {
          "address": {
            "type": "embedsOne",
            "model": "Address",
            "property": "billingAddress",
            "options": {
              "validate": true,
              "forceId": false
            }
          }
      }
    }



    var addressProperties = {
      street: {type: String, required: true},
      city: {type: String, required: true},
      state: {type: String, required: true}
    };

    var Address = loopback.Model.extend('Address', addressProperties);

    app.model(Address);

    var BillingAddress = loopback.Model.extend('BillingAddress', addressProperties);

    app.model(BillingAddress);

    var OfficeAddress = loopback.Model.extend('OfficeAddress', addressProperties);

    app.model(OfficeAddress);

    var bookProperties = {
      name: {type: String, required: true}
    };

    var Book = loopback.Model.extend('Book', bookProperties);

    app.model(Book);

    var Address = loopback.Model.extend('Address', addressProperties);

    app.model(Address);

    var Address = loopback.Model.extend('Address', addressProperties);

    app.model(Address);

    var Customer = loopback.Model.extend('Customer', customerProperties, customerOptions);

    Customer.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    Customer.remoteMethod(
        'greet',
        {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
        }
    );

    app.model(Customer);

    visualize(app);
    app.use(app.get('restApiRoot') || '/', loopback.rest());
    done();
  };
}
