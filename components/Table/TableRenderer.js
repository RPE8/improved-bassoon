// eslint-disable-next-line no-undef
sap.ui.define(["../Renderer/Renderer"], function (Renderer) {
	"use strict";

	const oRenderer = new Renderer();
	console.log(oRenderer.createElement);
	oRenderer.render = function (rm) {
		rm.write("<div id='TABLE'></div>");
	};

	// oRenderer.renderColumns = function (element, aColumn) {
	// 	const aColumns = [];
	// };

	// oRenderer.createElement = function (sTag, sClass, aAttributes = []) {
	// 	const element = document.createElement(sTag);

	// 	if (sClass && sClass.length) {
	// 		const aClasses = sClass.split(" ");

	// 		aClasses.forEach((sClass) => element.classList.add(sClass));
	// 	}

	// 	aAttributes.forEach((aAttribute) => {
	// 		element.setAttribute(aAttribute[0], aAttribute[1]);
	// 	});

	// 	return element;
	// };

	oRenderer.renderTableRows = function () {};

	oRenderer.renderTableContent = function () {
		const $TableContainer = document.getElementById("TABLE");

		const $TableHeaderContainer = this.createElement("div", ["tableHeaderWrapper"]);
		const $TableHeader = this.createElement("table", ["tableHeader"]);
		const $TableHeaderBody = this.createElement("tbody", ["headerTableBody", "tableBody"]);

		const $TableBodyContainer = this.createElement("div", ["tableBodyWrapper"]);
		const $TableBodyScrollContainer = this.createElement("div", ["tableBodyScrollWrapper"]);
		const $TableBody = this.createElement("table", ["bodyTableBody", "tableBody"]);
		const $TBody = this.createElement("tbody");

		$TableBody.appendChild($TBody);

		$TableHeader.appendChild($TableHeaderBody);
		$TableHeaderContainer.appendChild($TableHeader);
		$TableContainer.appendChild($TableHeaderContainer);

		$TableBodyScrollContainer.appendChild($TableBody);
		$TableBodyContainer.appendChild($TableBodyScrollContainer);

		$TableContainer.appendChild($TableBodyContainer);

		return {
			table: $TableBody,
			headerTable: $TableHeader,
			bodyTBody: $TBody,
			headerTBody: $TableHeaderBody,
			bodyScrollContainer: $TableBodyScrollContainer,
		};
	};

	return oRenderer;
});
