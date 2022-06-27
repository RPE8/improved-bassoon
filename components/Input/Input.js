// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["../BaseDOMComponent/BaseDOMComponent", "../BaseDOMUtils/BaseDOMUtils", "./InputRenderer"], function (Component, DOMUtils, Renderer) {
	return Component.extend("Input", {
		constructor: function ({ sId, element, oParent, iWidth, sWidthUnits, iHeight, fnDataGetter, fnDataSetter, iHeightUnits, oPredefinedAttributes = {}, aPredefinedClasses = [] }) {
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
			});

			this._oValues = {
				displayedValue: "",
				underhoodValue: "",
			};
			this.fnDataGetter = fnDataGetter;
			this.fnDataSetter = fnDataSetter;
		},

		getDataSetter: function () {
			return this.fnDataSetter;
		},

		setDataSetter: function (fnValue) {
			this.fnDataSetter = fnValue;
			return this;
		},

		getDataGetter: function () {
			return this.fnDataGetter;
		},

		setDataGetter: function (fnValue) {
			this.fnDataGetter = fnValue;
			return this;
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
