// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["../../BaseDOMComponent/BaseDOMComponent", "../../BaseDOMUtils/BaseDOMUtils", "./TableRowRenderer"], function (Component, DOMUtils, Renderer) {
	return Component.extend("TableRow", {
		constructor: function (oParameters) {
			let { iIndex, aCells = [], aCreatedCells = [], iHeight = 17, sHeightUnits = "px", aPredefinedClasses = [], oPredefinedAttributes = {} } = oParameters;

			oParameters.aPredefinedClasses = DOMUtils.mergeClasses(aPredefinedClasses, ["Row"]);
			oParameters.oPredefinedAttributes = DOMUtils.mergeAttributes(
				{
					// style: {
					// 	height: iHeight + sHeightUnits,
					// 	"max-height": iHeight + sHeightUnits,
					// },
				},
				oPredefinedAttributes
			);
			oParameters.iHeight = iHeight;
			oParameters.sHeightUnits = sHeightUnits;
			if (!oParameters.oRenderer) {
				oParameters.oRenderer = Renderer;
			}

			Component.call(this, oParameters);

			this._iIndex = iIndex;
			this._aCells = aCells;
			this._aCells2BeCreated = [];
			this._aCreatedCells = aCreatedCells;
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

		createFullfiledHTMLRepresentation: function ({
			bAssignToDomRef = true,
			aClasses = [],
			sClassesAction = "MERGE",
			oAttributes = {},
			sAttributesAction = "MERGE",
			bAssignToAggregation = true,
		}) {
			const $element = this.createStandaloneHTMLRepresentation({
				bAssignToDomRef,
				aClasses,
				sClassesAction,
				oAttributes,
				sAttributesAction,
			});
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
