/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zsales_print/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
