// TODO: To prorotype
sap.ui.define([ // eslint-disable-line
	"./TableRow",
], function (TableRow) {
	return TableRow.extend("TableDataRow", {
		constructor: function (oParameters) {
			TableRow.call(this, oParameters);
			this.bTableDataRow = true;
		}
	});
});