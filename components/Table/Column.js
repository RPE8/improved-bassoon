// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object"], function (Object) {
	return Object.extend("Column", {
		constructor: function ({ sId, aClasses = [], iColumn, aHeaders, fnDataAccessor, iWidth, sWidthUnit }) {
			this._sId = sId;
			this._aClasses = aClasses;
			this._aHeadersObjects = aHeaders;
			this._aHeaderCells = [];
			this._aDataCells = [];
			this._fnDataAccessor = fnDataAccessor;
			this._iColumn = iColumn;
			this._iWidth = iWidth;
			this._sWidthUnit = sWidthUnit;
			this._iRenderedWidth = null;
		},

		setId: function (sValue) {
			this._sId = sValue;
			return this;
		},

		getId: function () {
			return this._sId;
		},

		setHeaderCells: function (aValue) {
			this._aHeaderCells = aValue;
			return this;
		},

		getHeaderCells: function () {
			return this._aHeaderCells;
		},

		addHeaderCell: function (oCell) {
			this._aHeaderCells.push(oCell);
			return this;
		},

		setColumnIndex: function (iValue) {
			this._iColumn = iValue;
			return this;
		},

		getColumnIndex: function () {
			return this._iColumn;
		},

		setDataCells: function (aValue) {
			this._aDataCells = aValue;
			return this;
		},

		getDataCell: function () {
			return this._aDataCells;
		},

		addDataCells: function (oCell) {
			this._aDataCells.push(oCell);
			return this;
		},

		getHeadersObjects: function () {
			return this._aHeadersObjects;
		},

		setDataAccessor: function (fnAccessor) {
			this._fnDataAccessor = fnAccessor;
			return this;
		},

		getDataAccessor: function () {
			return this._fnDataAccessor;
		},

		setWidth: function (iValue) {
			this._iWidth = iValue;
			return this;
		},

		getWidth: function () {
			return this._iWidth;
		},

		setWidthUnit: function (sValue) {
			this._sWidthUnit = sValue;
			return this;
		},

		getWidthUnit: function () {
			return this._sWidthUnit;
		},

		setRenderedWidth: function (iValue) {
			this._iRenderedWidth = iValue;
			return this;
		},

		getRenderedWidth: function () {
			return this._iRenderedWidth;
		},
	});
});
