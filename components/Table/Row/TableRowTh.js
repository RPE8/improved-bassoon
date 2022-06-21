// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["./TableRow", "../../BaseDOMUtils/BaseDOMUtils", "./TableRowThRenderer"], function (TableRow, DOMUtils, Renderer) {
	return TableRow.extend("TableRowTH", {
		constructor: function (oParameters) {
			let { aPredefinedClasses = [], oPredefinedAttributes = {} } = oParameters;
			oParameters.aPredefinedClasses = DOMUtils.mergeClasses(aPredefinedClasses, ["RowTh"]);
			oParameters.oPredefinedAttributes = DOMUtils.mergeAttributes(
				{
					style: {
						height: "0px",
					},
				},
				oPredefinedAttributes
			);
			oParameters.oRenderer = Renderer;
			TableRow.call(this, oParameters);
			this.bTableRowTH = true;
		},
	});
});
