// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["../BaseDOMComponent/BaseDOMComponent", "./InputRenderer"], function (Component, Renderer) {
	return Component.extend("Input", {
		constructor: function ({ sId, element, oParent, iWidth, sWidthUnits, iHeight, iHeightUnits, oPredefinedAttributes, aPredefinedClasses }) {
			const aInitialClasses = ["Input"];
			const oInitialAttributes = {
				style: {
					width: `${iWidth}${sWidthUnits}`,
					"max-width": `${iWidth}${sWidthUnits}`,
				},
			};
			if (sId) {
				oInitialAttributes.id = sId;
			}
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
				oInitialAttributes,
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
