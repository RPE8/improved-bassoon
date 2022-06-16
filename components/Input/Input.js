// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/core/Control", "./InputRenderer"], function (Control, InputRenderer) {
	return Control.extend("Input", {
		constructor: function ({ sId, element, oParent, iWidth, sWidthUnits }) {
			this._sId = sId;
			this._oValues = {
				displayedValue: "",
				underhoodValue: "",
			};
			this._oDomRef = element;
			this._oParent = oParent;
			this._iWidth = iWidth;
			this._sWidthUnits = sWidthUnits;
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

		render: function () {
			this._oDomRef = InputRenderer.render({ iWidth: this._iWidth, sWidthUnits: this._sWidthUnits });
			this._oParent.getDomRef().appendChild(this._oDomRef);
		},

		renderer: InputRenderer,
	});
});
