/* eslint-disable indent */
// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["../BaseDOMComponent/BaseDOMComponent"], function (BaseDOMComponent) {
	return BaseDOMComponent.extend("BaseDataRepresentationComponent", {
		constructor: function (oParameters) {
			this._fnUpdateValue = oParameters.fnUpdateValue;
			BaseDOMComponent.call(this, oParameters);
		},
		setUpdateValue: function (fnValue) {
			this._fnUpdateValue = fnValue;
			return this;
		},
		getUpdateValue: function () {
			return this._fnUpdateValue;
		},

		updateValue: function ({ vNewValue }) {
			this._fnUpdateValue(vNewValue);
		},
	});
});
