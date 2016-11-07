/**
 * Created by galen on 16/11/7.
 */
'use strict';

const should = require('chai').should();
const expect = require('chai').expect;
const inject = require('../../inject');

describe('server/utils/tests/inject/index.test.js', function () {
    var obj, properties, result;

    beforeEach(function () {
        obj = {a: 1, b: 2};
        result = {e: 'test'};
    });

    it('inject without conflict key', function () {
        properties = ['c', 'd'];
        inject(obj, properties, result);
        JSON.stringify(obj).should.equal(JSON.stringify({a: 1, b: 2, c: {d: {e: 'test'}}}));
    });

    it('inject with a conflict key', function () {
        properties = ['b', 'c'];
        inject(obj, properties, result);
        JSON.stringify(obj).should.equal(JSON.stringify({a: 1, b: {c: {e: 'test'}}}));
    });

    it('throw error with un-object obj', function () {
        properties = ['c', 'd'];
        inject().should.to.be.an('error');
    })
});