// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["./TableRow", "./TableRowThRenderer"], function (TableRow, Renderer) {
	return TableRow.extend("TableRowTH", {
		constructor: function (oParameters) {
			TableRow.call(this, oParameters);
			this.bTableRowTH = true;
		},

		renderer: Renderer,
	});
});
