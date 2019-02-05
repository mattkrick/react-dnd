"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoize = require('lodash/memoize');
exports.isFirefox = memoize(() => /firefox/i.test(navigator.userAgent));
exports.isSafari = memoize(() => Boolean(window.safari));
