// TODO: To prorotype
sap.ui.define([
  "sap/ui/base/Object",
], function (UI5Object) {
  return UI5Object.extend("TableCell", {
    constructor: function (element, rowElement, mParameters) {
      this._sId = mParameters.sId;
      this._vValue = mParameters.vValue;
      this._oDomRef = element;
      this._oRowDomRef = rowElement;
      this._iWidth = mParameters.iWidth;
      this._sWidthUnit = mParameters.sWidthUnit
      this._iColumn = mParameters.iColumn;
      this._iRow = mParameters.iRow;
      this._tBodyRef = mParameters.tBodyRef
      this._scrollContainerRef = mParameters.scrollContainerRef
    },

    getDisplayedValue: function () {
      return this.getDomRef().innerHTML;
    },

    setDisplayedValue: function (vValue, bUpdateUnderhoodValue) {
      this.getDomRef().innerHTML = vValue;
      if (bUpdateUnderhoodValue) {
        this.setUnderhoodValue(vValue, false);
      }
    },

    getUnderhoodValue: function () {
      return this._vValue;
    },

    setUnderhoodValue: function (vValue, bUpdateDisplayedValue) {
      this._vValue = vValue;
      if (bUpdateDisplayedValue) {
        this.setDisplayedValue(vValue, false);
      }
    },

    getDomRef: function () {
      return this._oDomRef;
    },

    getRpwDomRef: function () {
      return this._oRowDomRef;
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

    getColumn: function () {
      return this._iColumn;
    },

    getRow: function () {
      return this._iRow;
    },

    setColumn: function (iValue) {
      this._iColumn = iValue;
      return this;
    },

    setRow: function (iValue) {
      this._iRow = iValue;
      return this;
    }

  });
});