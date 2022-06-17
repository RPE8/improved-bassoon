// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/core/Control", "./InputRenderer"], function (Control, Renderer) {
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

		createStandaloneHTMLRepresentation: function ({
			bAssignToDomRef = true,
			sId = this._sId,
			aClasses = [],
			aAttributes = [
				["id", sId],
				["style", `width:${this._iWidth}${this._sWidthUnits};max-width:${this._iWidth}${this._sWidthUnits}`],
			],
		}) {
			const $element = this.renderer.createHTMLElement({
				aClasses,
				aAttributes,
			});
			if (bAssignToDomRef) this._oDomRef = $element;
			return $element;
		},

		renderer: Renderer,
	});
});
