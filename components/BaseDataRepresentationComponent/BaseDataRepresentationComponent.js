/* eslint-disable indent */
// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	return UI5Object.extend("BaseDataRepresentationComponent", {
		constructor: function ({ fnUpdateValue }) {
			this._fnUpdateValue = fnUpdateValue;
		},
		setUpdateValue: function (fnValue) {
			this._fnUpdateValue = fnValue;
			return this;
		},
		getUpdateValue: function () {
			return this._fnUpdateValue;
		},
	});
});
