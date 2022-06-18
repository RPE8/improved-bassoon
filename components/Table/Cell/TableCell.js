// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object", "./TableCellRenderer"], function (UI5Object, Renderer) {
	return UI5Object.extend("TableCell", {
		constructor: function ({ rowElement, vValue, sId, iWidth, sWidthUnit, iColumn, iRow, tBodyRef, oRow, oColumn, fnAggregationConstructor, aPredefinedAttributes = [] }) {
			this._sId = sId;
			this._aPredefinedAttributes = aPredefinedAttributes;
			this._oDomRef = undefined;
			this._iRow = iRow;
			this._oRow = oRow;
			this._oRowDomRef = rowElement;
			this._iWidth = iWidth;
			this._sWidthUnit = sWidthUnit;
			this._iColumn = iColumn;
			this._oColumn = oColumn;
			this._tBodyRef = tBodyRef;
			this._fnAggregationConstructor = fnAggregationConstructor;
			this._oAggregation = undefined;

			this._initPredefinedAttributes();
		},

		_initPredefinedAttributes: function () {
			this._aPredefinedAttributes = [
				...this._aPredefinedAttributes,
				["id", this._sId],
				["style", `width:${this._iWidth}${this._sWidthUnits};max-width:${this._iWidth}${this._sWidthUnits}`],
			];
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

		setId: function (sValue) {
			this._sId = sValue;
			return this;
		},

		getId: function () {
			return this._sId;
		},

		setDomRef: function (element) {
			this._oDomRef = element;
			return this;
		},

		getDomRef: function () {
			return this._oDomRef;
		},

		getRowDomRef: function () {
			return this._oRowDomRef;
		},

		setRowDomRef: function (element) {
			this._oRowDomRef = element;
			return this;
		},

		getWidth: function () {
			return this._iWidth;
		},

		setWidth: (iValue) => {
			this._iWidth = iValue;
			return this;
		},

		getWidthUnit: function () {
			return this._sWidthUnit;
		},

		setWidthUnit: function (sValue) {
			this._sWidthUnit = sValue;
			return this;
		},

		getColumnIndex: function () {
			return this._iColumn;
		},

		getRowIndex: function () {
			return this._iRow;
		},

		setColumnIndex: function (iValue) {
			this._iColumn = iValue;
			return this;
		},

		setRowIndex: function (iValue) {
			this._iRow = iValue;
			return this;
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

		setPredefinedAttributes: function (aAttributes) {
			this._aPredefinedAttributes = aAttributes;
			return this;
		},

		getPredefinedAttributes: function () {
			return this._aPredefinedAttributes;
		},

		addPredefinedAttribute: function (aAttribute) {
			this._aPredefinedAttributes.push(aAttribute);
			return this;
		},

		initAggregation: function (fnAggregationConstructor = this._fnAggregationConstructor, bForce) {
			if (!fnAggregationConstructor) {
				return;
			}

			if (this._oAggregation && !bForce) {
				return this._oAggregation;
			}

			const oAggregation = (this._oAggregation = new fnAggregationConstructor({ oParent: this, iWidth: this._iWidth, sWidthUnits: this._sWidthUnit }));

			return oAggregation;
		},

		createStandaloneHTMLRepresentation: function ({ bAssignToDomRef = true, sId = this._sId, aClasses = [], aAttributes = [] }) {
			if (!aAttributes.length) {
				aAttributes = [...this._aPredefinedAttributes];
			}

			const $element = this.renderer.createHTMLElement({
				aClasses,
				aAttributes,
			});
			if (bAssignToDomRef) this._oDomRef = $element;
			return $element;
		},

		createFullfiledHTMLRepresentation: function ({ bAssignToDomRef = true, bAssignToAggregation = true, sId = this._sId, aClasses = [], aAttributes = [] }) {
			if (aAttributes.length) {
				aAttributes = [...this._aPredefinedAttributes, ...aAttributes];
			} else {
				aAttributes = [...this._aPredefinedAttributes];
			}

			const $element = this.createStandaloneHTMLRepresentation({ sId, aClasses, aAttributes, bAssignToDomRef: false });
			if (bAssignToDomRef) this._oDomRef = $element;

			const oAggregation = this.initAggregation();
			if (bAssignToAggregation) this._oAggregation = oAggregation;
			const $aggregation = oAggregation?.createStandaloneHTMLRepresentation({});
			if ($aggregation) {
				this.renderer.addChild($element, $aggregation);
			}

			return $element;
		},

		renderer: Renderer,
	});
});
