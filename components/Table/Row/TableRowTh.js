// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["./TableRow", "./TableRowThRenderer"], function (TableRow, Renderer) {
	return TableRow.extend("TableRowTH", {
		constructor: function (oParameters) {
			const aInitialClasses = ["Row"];
			const oInitialAttributes = {
				id: oParameters.sId,
				style: {
					height: "0px",
				},
			};
			oParameters.aInitialClasses = aInitialClasses;
			oParameters.oInitialAttributes = oInitialAttributes;
			oParameters.oRenderer = Renderer;
			TableRow.call(this, oParameters);
			this.bTableRowTH = true;
		},
	});
});
