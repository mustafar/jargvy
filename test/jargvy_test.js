'use strict';

var Jargvy = require('../lib/jargvy.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['define'] = {
  setUp: function(done) {
    done();
  },
  'infer type': function(test) {
    test.expect(3);

    var rules = [
      {'id': '-str', 'name': 'str', 'default': '.' },
      {'id': '-num', 'name': 'num', 'default': 5 },
      {'id': '-bool', 'name': 'bool', 'default': true },
    ];
    Jargvy.define(rules);
    var parsedRules = Jargvy.peek();
    test.equal("string", parsedRules['-str'].type);
    test.equal("number", parsedRules['-num'].type);
    test.equal("boolean", parsedRules['-bool'].type);

    test.done();
  },
  'type override': function(test) {
    test.expect(3);

    var rules = [{'id': '-p', 'name': 'path', 'default': '.', 'type': 'number' }];
    Jargvy.define(rules);
    var parsedRules = Jargvy.peek();
    var testParsedRule = parsedRules['-p'];
    test.equal("string", testParsedRule.type);
    test.equal("path", testParsedRule.name);
    test.equal(".", testParsedRule['default']);

    test.done();
  },
};

exports['extract'] = {
  setUp: function(done) {
    this.rules = [
      {'id': '-p', 'name': 'path', 'default': '.'},
      {'id': '-r', 'name': 'intThing', 'default': 6},
      {'id': '--help', 'name': 'help', 'default': false},
    ];
    Jargvy.define(this.rules);

    var fakeArgvs = [
        'fake_path',
        'fake_app',
        'fake search text',
        '-p', './dir', 
        '--help'];
    this.options = Jargvy.extract(fakeArgvs);

    done();
  },
  'defined option': function(test) {
    test.expect(1);

    var option = this.options['path'];
    test.equal("./dir", option);

    test.done();
  },
  'undefined option': function(test) {
    test.expect(1);

    test.equal(undefined, this.options['help']);

    test.done();
  },
}
