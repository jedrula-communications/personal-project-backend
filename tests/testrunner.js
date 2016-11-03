const QUnit = require('qunitjs');
const qunitTap = require('qunit-tap');
qunitTap(QUnit, function() { console.log.apply(console, arguments); });
QUnit.config.autorun = false;

const { load, test } = QUnit;

require('./router_test')(test);
load();
