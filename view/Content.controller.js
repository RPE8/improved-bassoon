/* global sap*/
sap.ui.define(
	[
		// eslint-disable-line
		"sap/ui/core/mvc/Controller",
		"../components/Input/Input",
	],
	function (Controller, Input) {
		"use strict";

		return Controller.extend("improved.bassoon.Content", {
			/**
			 * Called when the controller is instantiated.
			 * It sets up busy model and metadataLoaded promise callback in order to manipulate Busy Indicator on whole page
			 * @function
			 * @public
			 */
			onInit: function () {},

			createColumns: function () {
				const aFirstRow = new Array(7).fill(undefined);
				aFirstRow[0] = {
					text: `Header-Span-7`,
					oPredefinedAttributes: {
						colspan: 7,
					},
				};

				const aSecondRow = new Array(7).fill({
					text: `Header-Span-1`,
					oPredefinedAttributes: {},
				});
				aSecondRow[0] = {
					text: `Header-Span-2`,
					oPredefinedAttributes: {
						colspan: 2,
					},
				};
				aSecondRow[1] = undefined;
				aSecondRow[5] = {
					text: `Header-Span-2`,
					oPredefinedAttributes: {
						colspan: 2,
					},
				};
				aSecondRow[6] = undefined;

				const aThirdRow = new Array(7).fill({
					text: `Header-Span-1`,
					oPredefinedAttributes: {},
				});

				return [aFirstRow, aSecondRow, aThirdRow];
			},

			onAfterRendering: function () {
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
						const aRows = this.createColumns();
						const iColumn = aRows[0].length;
						for (let iCell = 0; iCell < iColumn; iCell++) {
							let aCells = [];
							for (let iRow = 0; iRow < aRows.length; iRow++) {
								aCells.push(aRows[iRow][iCell]);
							}
							this.byId("test").addColumn2BeCreated({
								aHeaders: aCells,
								iWidth: 80,
								sWidthUnits: "px",
								oAggregationConstructor: Input,
								fnDataAccessor: function (oData) {
									return oData["data"][i];
								},
								fnDataSetter: function (oData) {
									this.setValueByType("displayedValue", oData["data"][i]);
									return this;
								},
							});
						}
					}
					this.byId("test").createTable();

					this.byId("test").renderTable();
				});
			},
		});
	}
);
