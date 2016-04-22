var expect = require('chai').expect;
var Backbone = require('backbone');
var GroupedCollection = require('../backbone.grouped-collection');

describe('Backbone.GroupedCollection', function() {
  var models = new Backbone.Collection([
    { color: "red", name: "Jean-Michel" },
    { color: "red", name: "René" },
    { color: "blue", name: "Etienne" },
    { color: "red", name: "Mathilde" }
  ]);

  describe('constructor', function () {
    it('should build a new Backbone.Collection', function () {
      var collection = new GroupedCollection(models, {
        groupBy: "color"
      });
      expect(collection).to.be.an.instanceof(Backbone.Collection);
    });
    
    it('should group models', function () {
      var collection = new GroupedCollection(models, {
        groupBy: "color"
      });
      expect(collection.models).to.have.lengthOf(2);
    });
  });
});
