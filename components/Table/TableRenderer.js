
sap.ui.define(["sap/ui/core/Renderer"],
  function (Renderer) {
    "use strict";

    const oRenderer = {};

    oRenderer.render = (rm, oControl) => {
      console.log(rm);
      console.log(oControl);
    };
    return oRenderer;
  });