/* global sap*/
sap.ui.define(
	[
		// eslint-disable-line
		"sap/ui/core/mvc/Controller",
	],
	function (Controller) {
		"use strict";

		return Controller.extend("improved.bassoon.Content", {
			/**
			 * Called when the controller is instantiated.
			 * It sets up busy model and metadataLoaded promise callback in order to manipulate Busy Indicator on whole page
			 * @function
			 * @public
			 */
			onInit: function () {},

			onAfterRendering: function () {
				setTimeout(() => {
					for (let i = 0; i < 70; i++) {
						const aCells = [];
						aCells.push({
							text: `Span-${i}`,
							span: 7,
						});
						for (let j = 0; j < 1; j++) {
							const oProps = {
								text: `Column-${i}-${j}`,
							};
							if (i % 7 === 0) {
								oProps.span = 2;
							}

							aCells.push(oProps);
						}
						aCells.push({
							text: `Column-${i}-${1}`,
						});
						this.byId("test").addColumn2BeCreated({
							aHeaders: aCells,
							iWidth: 80,
							sWidthUnit: "px",
							fnDataAccessor: function (oData) {
								return oData["data"][i];
							},
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
				});
			},
		});
	}
);
