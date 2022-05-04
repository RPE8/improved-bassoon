// TODO: To prorotype
sap.ui.define([
  "sap/ui/base/Object",
], function (Object) {
  return Object.extend("TableRow", {
    constructor: function ({ iRow, sId, aTds, tBody, element }) {
      this.iRow = iRow;
      this.sId = sId;
      this.aTds = aTds;
      this.oDomRefToTBody = tBody;
      this.oDomRef = element;
    }
  });
});