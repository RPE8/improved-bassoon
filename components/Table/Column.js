// TODO: To prorotype
sap.ui.define([
  "sap/ui/base/Object",
], function (Object) {
  return Object.extend("Column", {
    constructor: function ({ sId, aClasses = [], iColumn, aHeaders }) {
      this._sId = sId;
      this._aClasses = aClasses;
      this._aHeadersObjects = aHeaders;
      this._aHeaderCells = [];
      this._aDataCells = [];
      this._iColumn = iColumn;
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



  });
});