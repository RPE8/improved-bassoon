// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["./TableCell"], function (TableCell) {
	return TableCell.extend("TableBodyCell", {
		constructor: function (oParameters) {
			TableCell.call(this, oParameters);
			this.bTableBodyCell = true;
			this._scrollContainerRef = oParameters.scrollContainerRef;
		},

		getScrollContainerRef: function () {
			return this._scrollContainerRef;
		},

		setScrollContainerRef: function (element) {
			this._scrollContainerRef = element;
			return this;
		},
	});
});
