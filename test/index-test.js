var vows = require('vows');
var assert = require('assert');
var util = require('util');
var dailycred = require('passport-dailycred');


vows.describe('passport-dailycred').addBatch({

  'module': {
    'should report a version': function (x) {
      assert.isString(dailycred.version);
    },
  },

}).export(module);
