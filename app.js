/**
 * Created by galen on 16/11/5.
 */
'use strict';

require('babel-core/register')({
    'presets': [
        'es2015',
        'stage-0'
    ]
});

require('babel-register');
require('babel-polyfill');

require('./server/app');
