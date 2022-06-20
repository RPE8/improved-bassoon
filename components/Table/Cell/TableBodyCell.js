// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["./TableCell"], function (TableCell) {
	return TableCell.extend("TableBodyCell", {
		constructor: function (oParameters) {
			TableCell.call(this, oParameters);
			this.bTableBodyCell = true;
		},
	});
});
