// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["./TableCell", "./TableCellThRenderer"], function (TableCell, oRenderer) {
	return TableCell.extend("TableTHCell", {
		constructor: function (oParameters) {
			const aInitialClasses = ["Cell"];
			const oInitialAttributes = {
				// id: oParameters.sId,
				style: {
					width: `${oParameters.iWidth}${oParameters.sWidthUnits}`,
					"max-width": `${oParameters.iWidth}${oParameters.sWidthUnits}`,
				},
			};

			oParameters.aInitialClasses = aInitialClasses;
			oParameters.oInitialAttributes = oInitialAttributes;
			oParameters.oRenderer = oRenderer;
			TableCell.call(this, oParameters);
			this.bTableTHCell = true;
		},
	});
});
