// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/core/Renderer", "./TableBodyCell", "./TableHeaderCell", "./TableRow"], function () {
	"use strict";

	const oRenderer = {};

	oRenderer.render = function (rm) {
		rm.write("<div id='TABLE'></div>");
	};

	// oRenderer.renderColumns = function (element, aColumn) {
	// 	const aColumns = [];
	// };

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

	oRenderer.renderTableRows = function () {};

	oRenderer.renderTable = function () {
		const $TableContainer = document.getElementById("TABLE");

		const $TableHeaderContainer = this.createElement("div", "tableHeaderWrapper");
		const $TableHeader = this.createElement("table", "tableHeader");
		const $TableHeaderBody = this.createElement("tbody", "headerTableBody tableBody");

		const $TableBodyContainer = this.createElement("div", "tableBodyWrapper");
		const $TableBodyScrollContainer = this.createElement("div", "tableBodyScrollWrapper");

		const $VerticalScrollDiv = this.createElement("div", "scroll verticalScroll");
		const $VerticalScrollBar = this.createElement("div", "scrollBar verticalScrollBar");
		const $HorizontalScrollDiv = this.createElement("div", "scroll horizontalScroll");
		const $HorizontalScrollBar = this.createElement("div", "scrollBar horizontalScrollBar");
		const $TableBodyScrollContainerContent = this.createElement("div");
		const $TableBody = this.createElement("table", "bodyTableBody tableBody");
		const $TBody = this.createElement("tbody");

		$TableBody.appendChild($TBody);

		$TableHeader.appendChild($TableHeaderBody);
		$TableHeaderContainer.appendChild($TableHeader);
		$TableContainer.appendChild($TableHeaderContainer);

		$TableBodyScrollContainerContent.appendChild($TableBody);
		$TableBodyScrollContainer.appendChild($TableBodyScrollContainerContent);
		// $TableBodyScrollContainer.appendChild($TableBody);
		$VerticalScrollDiv.appendChild($VerticalScrollBar);
		$HorizontalScrollDiv.appendChild($HorizontalScrollBar);
		$TableBodyScrollContainer.appendChild($VerticalScrollDiv);
		$TableBodyScrollContainer.appendChild($HorizontalScrollDiv);
		$TableBodyContainer.appendChild($TableBodyScrollContainer);

		$TableContainer.appendChild($TableBodyContainer);

		return {
			table: $TableBody,
			headerTable: $TableHeader,
			bodyTBody: $TBody,
			headerTBody: $TableHeaderBody,
			bodyScrollContainer: $TableBodyScrollContainer,
			verticalBar: $VerticalScrollBar,
			horizontalBar: $HorizontalScrollBar,
		};
	};

	return oRenderer;
});
