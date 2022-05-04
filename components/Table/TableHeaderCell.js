// TODO: To prorotype
sap.ui.define([
  "./TableCell",
], function (TableCell) {
  return TableCell.extend("TableHeaderCell", {
    constructor: function (oParameters) {
      TableCell.call(this, oParameters);
      this.setUnderhoodValue(oParameters.vValue, true);
    }
  });
});