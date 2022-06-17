// eslint-disable-next-line no-undef
sap.ui.define(["../Renderer/Renderer"], function (Renderer) {
	"use strict";

	const oRenderer = new Renderer();

	oRenderer.render = function ({ aClasses = [], aAttributes = [] }) {
		return this.createElement("tr", ["Row", ...aClasses], [...aAttributes]);
	};

	return oRenderer;
});
