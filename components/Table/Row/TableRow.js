// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object", "./TableRowRenderer"], function (Object, Renderer) {
	return Object.extend("TableRow", {
		constructor: function ({ iColumn, iRow, sId, aCells = [], tBody }) {
			this._iRow = iRow;
			this._iColumn = iColumn;
			this._sId = sId;
			this._aCells = aCells;
			this._oDomRefToTBody = tBody;
			this._oDomRef = undefined;
		},

		setId: function (sValue) {
			this._sId = sValue;
			return this;
		},

		getId: function () {
			return this._sId;
		},

		setCells: function (aValue) {
			this._aCells = aValue;
			return this;
		},

		addCell: function (oCell) {
			this._aCells.push(oCell);
			return this;
		},

		getCells: function () {
			return this._aCells;
		},

		setDomRef: function (element) {
			this._oDomRef = element;
			return this;
		},

		getDomRef: function () {
			return this._oDomRef;
		},

		setDomRefToTBody: function (element) {
			this._oDomRefToTBody = element;
			return this;
		},

		getDomRefToTBody: function () {
			return this._oDomRefToTBody;
		},

		createStandaloneHTMLRepresentation: function ({ bAssignToDomRef = true, sId = this._sId, aClasses = [], aAttributes = [["id", sId]] }) {
			const $element = this.renderer.createHTMLElement({
				aClasses,
				aAttributes,
			});
			if (bAssignToDomRef) this._oDomRef = $element;
			return $element;
		},

		createFullfiledHTMLRepresentation: function ({ bAssignToDomRef = true, bAssignToAggregation = true, sId = this._sId, aClasses = [], aAttributes = [["id", sId]] }) {
			const $element = this.createStandaloneHTMLRepresentation({ sId, aClasses, aAttributes, bAssignToDomRef: false });
			if (bAssignToDomRef) this._oDomRef = $element;

			const aCells = this._aCells;

			aCells.forEach((oCell) => {
				const $element = oCell.createFullfiledHTMLRepresentation();
				this.renderer.addChild($element);
			});

			return $element;
		},

		renderer: Renderer,
	});
});
