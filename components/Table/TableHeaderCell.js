// TODO: To prorotype
sap.ui.define([ // eslint-disable-line
	"./TableCell",
], function (TableCell) {
	return TableCell.extend("TableHeaderCell", {
		constructor: function (oParameters) {
			TableCell.call(this, oParameters);
			this.setUnderhoodValue(oParameters.vValue, true);
		}
	});
});