// TODO: To prorotype
sap.ui.define([ // eslint-disable-line
	"./TableRow",
], function (TableRow) {
	return TableRow.extend("TableHeaderRow", {
		constructor: function (oParameters) {
			TableRow.call(this, oParameters);
			this.bTableHeaderRow = true;
		}
	});
});