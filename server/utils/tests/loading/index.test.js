/**
 * Created by galen on 16/11/7.
 */
'use strict';

const path = require('path');
const loading = require('../../loading');
const expect = require('chai').expect;
const should = require('chai').should();

const loadDir = path.join(__dirname, 'dirs');

describe('server/utils/tests/loading/index.test.js', function () {

    it('should load dir ok', function () {
        const result = loading('dir1/index.js', {dirs: loadDir});
        result.should.be.an('array');
        result[0].should.be.equal('test');
    });

    it('should support dot in filename', function () {
        const result = loading('dir1/func.test.js', {
            dirs: loadDir
        });
        result.should.be.an('array');
        result[0].should.be.equal('test');
    });

    it('should load dir ok if option.call is false', function () {
        const result = loading('dir1/index.js', {
            dirs: loadDir,
            call: false
        });
        result.should.be.an('array');
        result[0].should.be.an('function');
        result[0]().should.be.equal('test');
    });

    it('should support inject', function () {
        const result = loading('dir1/index.js', {
            dirs: loadDir,
            inject: 'test'
        });
        result[0].should.be.equal('test1');
    });

    it('should support resultHandler', function () {
        const result = loading('dir1/index.js', {
            dirs: loadDir,
            resultHandler: function (result, file, dir, exports) {
                return result + 'changed';
            }
        });
        result[0].should.be.equal('testchanged');
    });

    it('should support ignore', function () {
        const result = loading('dir1/index.js', {
            dirs: loadDir,
            ignore: function (exports, dile, dir) {
                return true;
            }
        });
        result.length.should.be.equal(0);
    });

    it('should support target', function () {
        const target = {};
        loading('dir2/index.js', {
            dirs: loadDir,
            target: target
        });

        target.name.should.be.equal('shuyar');
    });

    it('should not throw error if file does not exist', function () {
        const result = loading('dir1/index11.js', {
            dirs: loadDir
        });
        result.length.should.be.equal(0);
    });

    it('should suport multiple dirs', function () {
        const result = loading('index.js', {
            dirs: [path.join(loadDir, 'dir1'), path.join(loadDir, 'dir2')]
        });
        result.length.should.be.equal(2);
    });

    it('should support mini match', function () {
        const result = loading('*', {
            dirs: [path.join(loadDir, 'dir1'), path.join(loadDir, 'dir2')]
        });
        result.length.should.be.equal(3);
    });

    it('should support into', function () {
        const into = {};
        const result = loading('**/*.js', {
            into: into,
            dirs: loadDir
        });
        into.dir1.index.should.be.equal('test');
        into.dir2.index.name.should.be.equal('shuyar');
    });

    it('should support into and flatten', function () {
        const into = {};
        const result = loading('**/*.js', {
            flatten: true,
            into: into,
            dirs: loadDir
        });
        into['dir1.index'].should.be.equal('test');
    });

    it('should support CamelCase', function () {
        const into = {};
        loading('**/*.js', {
            flatten: true,
            into: into,
            dirs: path.join(__dirname, 'dir4')
        });
        into.galenSheen.should.be.equal(1);
    });

    it('should load dir.xx ok', function () {
        const into = {};
        loading('**/*.js', {
            into: into,
            dirs: [path.join(__dirname, 'dir6')]
        });
        into['dir.a'].index.should.be.equal(1);
    });
});
