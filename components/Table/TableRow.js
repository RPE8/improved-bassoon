// TODO: To prorotype
sap.ui.define([
  "sap/ui/base/Object",
  "./TableCell"
], function (Object, TableCell) {
  return Object.extend("TableRow", {
    constructor: function ({ iColumn, iRow, sId, aCells = [], tBody, element }) {
      this._iRow = iRow;
      this._iColumn = iColumn;
      this._sId = sId;
      this._aCells = aCells;
      this._oDomRefToTBody = tBody;
      this._oDomRef = element;
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

    getDomRef: function (element) {
      return this._oDomRef;
    },

    setDomRefToTBody: function (element) {
      this._oDomRefToTBody = element;
      return this;
    },

    getDomRefToTBody: function (element) {
      return this._oDomRefToTBody;
    }
  });
});