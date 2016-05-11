var loopback = require('loopback');
var visualize = require('../');
var request = require('supertest');
var expect = require('chai').expect;

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
    var app = this.app = loopback();

    var Product = loopback.PersistedModel.extend('product');
    Product.attachTo(loopback.memory());
    app.model(Product);

    visualize(app, { mountPath: basePath });
    app.use(app.get('restApiRoot') || '/', loopback.rest());
    app.set('legacyExplorer', false);

    done();
  };
}
