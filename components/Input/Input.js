// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["../BaseDOMComponent/BaseDOMComponent", "./InputRenderer"], function (Component, Renderer) {
	return Component.extend("Input", {
		constructor: function ({ sId, element, oParent, iWidth, sWidthUnits, iHeight, iHeightUnits, oPredefinedAttributes, aPredefinedClasses }) {
			const aInitialClasses = ["Input"];
			const oIntialAttributes = {
				id: sId,
				style: {
					width: `${this._iWidth}${this._sWidthUnits}`,
					"max-width": `${this._iWidth}${this._sWidthUnits}`,
				},
			};
			Component.call(this, {
				sId,
				element,
				oParent,
				iWidth,
				sWidthUnits,
				iHeight,
				iHeightUnits,
				oPredefinedAttributes,
				aPredefinedClasses,
				oRenderer: Renderer,
				oIntialAttributes,
				aInitialClasses,
				oRederer: Renderer,
			});

			this._oValues = {
				displayedValue: "",
				underhoodValue: "",
			};
		},

		getValues: function () {
			return this._oValues;
		},

		setValues: function (oValue) {
			this._oValues = oValue;
			return this;
		},

		setValueByType: function (sType, vValue) {
			if (!(sType in this._oValues)) {
				this._oValues[sType] = null;
			}

			this._oValues[sType] = vValue;
		},

		getValueByType: function (sType) {
			return this._oValues[sType];
		},
	});
});
