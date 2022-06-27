// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["../../BaseDOMComponent/BaseDOMComponent", "../../BaseDOMUtils/BaseDOMUtils", "./TableCellRenderer"], function (Component, DOMUtils, Renderer) {
	return Component.extend("TableCell", {
		constructor: function ({
			sId,
			element,
			oRow,
			oColumn,
			oParent,
			fnAggregationConstructor,
			iWidth,
			sWidthUnits,
			iHeight,
			sHeightUnits,
			oPredefinedAttributes = {},
			aPredefinedClasses = [],
			oRenderer = Renderer,
		}) {
			// const aInitialClasses = ["Cell"];
			// const oInitialAttributes = {
			// 	id: sId,
			// 	// style: {
			// 	// 	width: `${iWidth}${sWidthUnits}`,
			// 	// 	"max-width": `${iWidth}${sWidthUnits}`,
			// 	// },
			// };
			aPredefinedClasses = DOMUtils.mergeClasses(aPredefinedClasses, ["Cell"]);
			Component.call(this, {
				sId,
				element,
				oParent,
				iWidth,
				sWidthUnits,
				iHeight,
				sHeightUnits,
				oPredefinedAttributes,
				aPredefinedClasses,
				oRenderer: oRenderer,
			});
			this._oRow = oRow;
			this._oColumn = oColumn;
			this._fnAggregationConstructor = fnAggregationConstructor;
			this._oAggregation = undefined;
		},

		getColumn: function () {
			return this._oColumn;
		},

		getRow: function () {
			return this._oRow;
		},

		setColumn: function (oValue) {
			this._pColumn = oValue;
			return this;
		},

		setRow: function (oValue) {
			this._oRow = oValue;
			return this;
		},

		getAggregation: function () {
			return this._oAggregation;
		},

		setAggregation: function (oValue) {
			this._oAggregation = oValue;
			return this;
		},

		initAggregation: function (fnAggregationConstructor = this._fnAggregationConstructor, bForce) {
			if (!fnAggregationConstructor) {
				return;
			}

			if (this._oAggregation && !bForce) {
				return this._oAggregation;
			}

			const oAggregation = (this._oAggregation = new fnAggregationConstructor({ oParent: this, iWidth: this._iWidth, sWidthUnits: this._sWidthUnits }));

			return oAggregation;
		},

		createFullfiledHTMLRepresentation: function ({
			bAssignToDomRef = true,
			aClasses = [],
			sClassesAction = "MERGE",
			oAttributes = {},
			oAggregationAttributes = {},
			sAggregationAttributesAction = "MERGE",
			sAttributesAction = "MERGE",
			bAssignToAggregation = true,
			bAssignAggregationsDom = true,
		}) {
			const $element = this.createStandaloneHTMLRepresentation({
				bAssignToDomRef,
				aClasses,
				sClassesAction,
				oAttributes,
				sAttributesAction,
			});
			if (bAssignToDomRef) this._oDomRef = $element;

			const oAggregation = this.initAggregation();
			if (bAssignToAggregation) this._oAggregation = oAggregation;
			const $aggregation = oAggregation?.createStandaloneHTMLRepresentation({ oAttributes: oAggregationAttributes, sAttributesAction: sAggregationAttributesAction });
			if ($aggregation) {
				const aAttributes = [];
				if (bAssignAggregationsDom) oAggregation.setDomRef($aggregation);
				if (this.getHeight() !== undefined) {
					let sHeight = `${this.getHeight()}${this.getHeightUnits() ?? ""}`;
					aAttributes.push(["style", `height:${sHeight}`]);
				}
				const $wrapper = this.renderer.createElement("div", ["Wrapper", "InputWrapper"], aAttributes);
				this.renderer.addChild($wrapper, $aggregation);
				this.renderer.addChild($element, $wrapper);
			}

			return $element;
		},
	});
});
