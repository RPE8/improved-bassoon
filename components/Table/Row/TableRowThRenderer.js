// eslint-disable-next-line no-undef
sap.ui.define(["../../Renderer/Renderer"], function (Renderer) {
	"use strict";

	const oRenderer = new Renderer();

	oRenderer.createHTMLElement = function ({ aClasses = [], aAttributes = [] }) {
		return this.createElement("th", ["Row", ...aClasses], [...aAttributes]);
	};

	return oRenderer;
});
