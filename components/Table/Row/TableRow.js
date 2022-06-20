// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object", "./TableRowRenderer"], function (Object, Renderer) {
	return Object.extend("TableRow", {
		constructor: function ({ iColumn, iIndex, sId, aCells = [], tBody, _aCreatedCells = [] }) {
			this._iIndex = iIndex;
			this._iColumn = iColumn;
			this._sId = sId;
			this._aCells = aCells;
			this._aCells2BeCreated = [];
			this._aCreatedCells = _aCreatedCells;
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

		setIndex: function (iValue) {
			this._iIndex = iValue;
			return this;
		},

		getIndex: function () {
			return this._iIndex;
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

		setCells2BeCreated: function (aValue) {
			this._aCells2BeCreated = aValue;
			return this;
		},

		addCell2BeCreated: function (oCell) {
			this._aCells2BeCreated.push(oCell);
			return this;
		},

		getCells2BeCreated: function () {
			return this._aCells2BeCreated;
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

			const aCells = this._aCells2BeCreated;

			aCells.forEach((oCell) => {
				const $cell = oCell.createFullfiledHTMLRepresentation({});
				if (!$cell) {
					return;
				}
				this._aCreatedCells.push(oCell);
				this.renderer.addChild($element, $cell);
			});

			this._aCells2BeCreated = [];

			return $element;
		},

		renderer: Renderer,
	});
});
