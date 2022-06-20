// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["../../BaseDOMComponent/BaseDOMComponent", "./TableCellRenderer"], function (Component, Renderer) {
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
			iHeightUnits,
			oPredefinedAttributes = {},
			aPredefinedClasses = [],
		}) {
			const aInitialClasses = ["Cell"];
			const oIntialAttributes = {
				id: sId,
				style: {
					width: `${this._iWidth}${this._sWidthUnits}`,
					"max-width": `${this._iWidth}${this._sWidthUnits}`,
				},
			};
			Component.call(this, {
				sId,
				element,
				oParent,
				iWidth,
				sWidthUnits,
				iHeight,
				iHeightUnits,
				oPredefinedAttributes,
				aPredefinedClasses,
				oRenderer: Renderer,
				oIntialAttributes,
				aInitialClasses,
				oRederer: Renderer,
			});
			this._oRow = oRow;
			this._oColumn = oColumn;
			this._fnAggregationConstructor = fnAggregationConstructor;
			this._oAggregation = undefined;
		},

		getDisplayedValue: function () {
			return this.getDomRef().innerHTML;
		},

		setDisplayedValue: function (vValue, bUpdateUnderhoodValue) {
			return;
			// this.getDomRef().innerHTML = vValue;
			// if (bUpdateUnderhoodValue) {
			// 	this.setUnderhoodValue(vValue, false);
			// }
		},

		getUnderhoodValue: function () {
			return this._vValue;
		},

		setUnderhoodValue: function (vValue, bUpdateDisplayedValue) {
			return;
			// this._vValue = vValue;
			// if (bUpdateDisplayedValue) {
			// 	this.setDisplayedValue(vValue, false);
			// }
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

			const oAggregation = this.initAggregation();
			if (bAssignToAggregation) this._oAggregation = oAggregation;
			const $aggregation = oAggregation?.createStandaloneHTMLRepresentation({});
			if ($aggregation) {
				this.renderer.addChild($element, $aggregation);
			}

			return $element;
		},
	});
});
