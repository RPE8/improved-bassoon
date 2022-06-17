// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["./TableRow"], function (TableRow) {
	return TableRow.extend("TableHeaderRow", {
		constructor: function (oParameters) {
			TableRow.call(this, oParameters);
			this.bTableHeaderRow = true;
		},
	});
});
