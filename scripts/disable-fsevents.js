'use strict';

const Module = require('module');

const originalLoad = Module._load;

Module._load = function load(request, parent, isMain) {
  if (request === 'fsevents') {
    const err = new Error('fsevents is disabled for VuePress dev server');
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  }

  return originalLoad.apply(this, arguments);
};
