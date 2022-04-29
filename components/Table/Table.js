sap.ui.define([
  "sap/ui/core/Control",
  "./TableRenderer"
], function (Control, TableRenderer) {
  return Control.extend("Table", {
    init: function () {
      console.info("init");
    },
    renderer: TableRenderer
  });
});