

sap.ui.define([
  "sap/ui/core/mvc/Controller",
], function (Controller) {
  "use strict";

  return Controller.extend("improved.bassoon.Content", {
    /**
     * Called when the controller is instantiated. 
     * It sets up busy model and metadataLoaded promise callback in order to manipulate Busy Indicator on whole page
     * @function
     * @public
     */
    onInit: function () {

    },

    onAfterRendering: function () {
      setTimeout(() => {
        this.byId("test").createTable();
      })
    }
  });
});