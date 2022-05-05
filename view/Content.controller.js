

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
        for (let i = 0; i < 400; i++) {
          const aCells = [];
          aCells.push({
            text: `Span-${i}`,
            span: 2
          });
          for (let j = 0; j < 1; j++) {
            aCells.push({
              text: `Column-${i}-${j}`,
            });
          }
          this.byId("test").addColumn2BeCreated({
            aHeaders: aCells
          });

        }
        this.byId("test").createTable();


        // this.byId("test").addColumn2BeCreated({
        //   aHeaders: [{
        //     text: "",
        //   }, {
        //     text: "Column 2"
        //   }]
        // });

        this.byId("test").createColumns();
      })
    }
  });
});