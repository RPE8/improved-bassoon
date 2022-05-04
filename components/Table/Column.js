// TODO: To prorotype
sap.ui.define([
  "sap/ui/base/Object",
], function (Object) {
  return Object.extend("Column", {
    constructor: function ({ sId, aClasses }) {
      this._sId = sId;
      this._aClasses = aClasses;
    }
  });
});