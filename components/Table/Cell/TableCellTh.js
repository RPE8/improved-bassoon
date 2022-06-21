// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["./TableCell", "../../BaseDOMUtils/BaseDOMUtils", "./TableCellThRenderer"], function (TableCell, DOMUtils, oRenderer) {
	return TableCell.extend("TableTHCell", {
		constructor: function (oParameters) {
			oParameters.oRenderer = oRenderer;
			oParameters.aPredefinedClasses = DOMUtils.mergeClasses(oParameters.aPredefinedClasses || [], ["CellTh"]);
			TableCell.call(this, oParameters);
			this.bTableTHCell = true;
		},
	});
});
