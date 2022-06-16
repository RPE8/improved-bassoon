// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	"use strict";

	return UI5Object.extend("Renderer", {
		constructor: function () {},
		createElement: function (sTag, aClasses, aAttributes = []) {
			const element = document.createElement(sTag);

			if (aClasses && aClasses.length) {
				aClasses.forEach((sClass) => element.classList.add(sClass));
			}

			aAttributes.forEach((aAttribute) => {
				element.setAttribute(aAttribute[0], aAttribute[1]);
			});

			return element;
		},
	});
});
