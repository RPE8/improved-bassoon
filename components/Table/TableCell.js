// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	return UI5Object.extend("TableCell", {
		constructor: function ({ element, rowElement, vValue, sId, iWidth, sWidthUnit, iColumn, iRow, tBodyRef, oRow, oColumn, fnAggregationConstructor }) {
			this._sId = sId;
			this._vValue = vValue;
			this._oDomRef = element;
			this._iRow = iRow;
			this._oRow = oRow;
			this._oRowDomRef = rowElement;
			this._iWidth = iWidth;
			this._sWidthUnit = sWidthUnit;
			this._iColumn = iColumn;
			this._oColumn = oColumn;
			this._tBodyRef = tBodyRef;
			this._oAggregation = this.initAggregation(fnAggregationConstructor);
		},

		getDisplayedValue: function () {
			return this.getDomRef().innerHTML;
		},

		setDisplayedValue: function (vValue, bUpdateUnderhoodValue) {
			return;
			this.getDomRef().innerHTML = vValue;
			if (bUpdateUnderhoodValue) {
				this.setUnderhoodValue(vValue, false);
			}
		},

		getUnderhoodValue: function () {
			return this._vValue;
		},

		setUnderhoodValue: function (vValue, bUpdateDisplayedValue) {
			return;
			this._vValue = vValue;
			if (bUpdateDisplayedValue) {
				this.setDisplayedValue(vValue, false);
			}
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

		initAggregation: function (oAggregationConstructor) {
			if (!oAggregationConstructor) {
				return;
			}

			const oAggregation = new oAggregationConstructor({ oParent: this, iWidth: this._iWidth, sWidthUnits: this._sWidthUnit });

			return oAggregation;
		},

		renderAggregation: function () {
			this._oAggregation?.render?.();
		},
	});
});
