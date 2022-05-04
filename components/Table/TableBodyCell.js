// TODO: To prorotype
sap.ui.define([
  "./TableCell",
], function (TableCell) {
  return TableCell.extend("TableBodyCell", {
    constructor: function (oParameters) {
      TableCell.call(this, oParameters);
      this._scrollContainerRef = oParameters.scrollContainerRef
    },

    getScrollContainerRef: function () {
      return this._scrollContainerRef;
    },

    setScrollContainerRef: function (element) {
      this._scrollContainerRef = element;
      return this;
    }
  });
});