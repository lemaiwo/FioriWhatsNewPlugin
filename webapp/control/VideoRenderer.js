sap.ui.define([], function () {
	"use strict";
	var Video = {};
	Video.render = function (oRm, oControl) {
		oRm.write("<video");
		oRm.writeControlData(oControl);
		oRm.writeAttributeEscaped("width", oControl.getWidth());
		oRm.writeAttributeEscaped("autoplay", false);

		oRm.write("controls autoplay muted loop ");
		// oRm.writeAttribute("controls", "controls");
		// oRm.writeAttribute("autoplay", "autoplay");
		oRm.write(">");
		oRm.write("<source");
		oRm.writeAttributeEscaped("src", oControl.getSrc());
		oRm.writeAttributeEscaped("type", oControl.getType());
		oRm.write(">");
		oRm.write("</source>");
		oRm.write("</video>");
	};
	return Video;
}, true);