// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object"], function (Object) {
	return Object.extend("Column", {
		constructor: function ({ sId, aClasses = [], iIndex, iColumn, aHeaders, fnDataGetter, fnDataSetter, iWidth, sWidthUnits, fnAggregationConstructor }) {
			this._sId = sId;
			this._iIndex = iIndex;
			this._aClasses = aClasses;
			this._aHeadersObjects = aHeaders;
			this._aHeaderCells = [];
			this._aDataCells = [];
			this._oUtilCells = {
				headerTh: [],
				dataTh: [],
			};
			this._fnDataGetter = fnDataGetter;
			this._fnDataSetter = fnDataSetter;
			this._iColumn = iColumn;
			this._iWidth = iWidth;
			this._sWidthUnits = sWidthUnits;
			this._iRenderedWidth = null;
			this._fnAggregationConstructor = fnAggregationConstructor;
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

		setIndex: function (iValue) {
			this._iIndex = iValue;
			return this;
		},

		getIndex: function () {
			return this._iIndex;
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

		getUtilCells: function () {
			return this._oUtilCells;
		},

		setUtilCells: function (sName, aData) {
			this._oUtilCells[sName] = aData;
		},

		addUtilCells: function (sName, aData) {
			if (!this._oUtilCells[sName]) {
				this._oUtilCells[sName] = [];
			}

			this._oUtilCells[sName] = [...this._oUtilCells[sName], ...aData];
			return this;
		},

		removeUtilCells: function (sName) {
			delete this._oUtilCells[sName];
			return this;
		},

		setDataGetter: function (fnValue) {
			this._fnDataGetter = fnValue;
			return this;
		},

		getDataGetter: function () {
			return this._fnDataGetter;
		},

		setDataSetter: function (fnValue) {
			this._fnDataSetter = fnValue;
			return this;
		},

		getDataSetter: function () {
			return this._fnDataSetter;
		},

		setWidth: function (iValue) {
			this._iWidth = iValue;
			return this;
		},

		getWidth: function () {
			return this._iWidth;
		},

		setWidthUnits: function (sValue) {
			this._sWidthUnits = sValue;
			return this;
		},

		getWidthUnits: function () {
			return this._sWidthUnits;
		},

		setRenderedWidth: function (iValue) {
			this._iRenderedWidth = iValue;
			return this;
		},

		getRenderedWidth: function () {
			return this._iRenderedWidth;
		},

		setAggregationConstructor: function (fnValue) {
			this._fnAggregationConstructor = fnValue;
			return this;
		},

		getAggregationConstructor: function () {
			return this._fnAggregationConstructor;
		},
	});
});
