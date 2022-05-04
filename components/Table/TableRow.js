// TODO: To prorotype
sap.ui.define([
  "sap/ui/base/Object",
], function (Object) {
  return Object.extend("TableRow", {
    constructor: function ({ iRow, sId, aTds = [], tBody, element }) {
      this._iRow = iRow;
      this._sId = sId;
      this._aTds = aTds;
      this._oDomRefToTBody = tBody;
      this._oDomRef = element;
    },

    setTds: function (aValue) {
      this._aTds = aValue;
      return this;
    },

    getTds: function () {
      return this._aTds;
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