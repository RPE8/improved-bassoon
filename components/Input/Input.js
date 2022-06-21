// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["../BaseDOMComponent/BaseDOMComponent", "../BaseDOMUtils/BaseDOMUtils", "./InputRenderer"], function (Component, DOMUtils, Renderer) {
	return Component.extend("Input", {
		constructor: function ({ sId, element, oParent, iWidth, sWidthUnits, iHeight, iHeightUnits, oPredefinedAttributes = {}, aPredefinedClasses = [] }) {
			aPredefinedClasses = DOMUtils.mergeClasses(aPredefinedClasses, ["Input", "BasicInput"]);

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
