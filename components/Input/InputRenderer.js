// eslint-disable-next-line no-undef
sap.ui.define(["../Renderer/Renderer"], function (Renderer) {
	"use strict";

	const oRenderer = {};

	oRenderer.createElement = function (sTag, sClass, aAttributes = []) {
		const element = document.createElement(sTag);

		if (sClass && sClass.length) {
			const aClasses = sClass.split(" ");

			aClasses.forEach((sClass) => element.classList.add(sClass));
		}

		aAttributes.forEach((aAttribute) => {
			element.setAttribute(aAttribute[0], aAttribute[1]);
		});

		return element;
	};

	oRenderer.render = function ({ iWidth, sWidthUnits }) {
		return this.createElement("input", ["Input"], [["style", `width:${iWidth}${sWidthUnits};max-width:${iWidth}${sWidthUnits}`]]);
	};

	return oRenderer;
});
