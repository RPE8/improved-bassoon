// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	return UI5Object.extend("ScrollBar", {
		constructor: function ({ bVertical = false, bHorizontal = false, BarDomRef, BarContainerDomRef }) {
			this.bVertical = bVertical;
			this.bHorizontal = bHorizontal;
			this.BarDomRef = BarDomRef;
			this.BarContainerDomRef = BarContainerDomRef;
			this.iPreviousX = null;
			this.iPreviousY = null;
		},

		getPreviousX: function () {
			return this.iPreviousX;
		},

		getPreviousY: function () {
			return this.iPreviousY;
		},

		setPreviousX: function (iValue) {
			this.iPreviousX = iValue;
			return this;
		},

		setPreviousY: function (iValue) {
			this.iPreviousY = iValue;
			return this;
		},

		getBarDomRef: function () {
			return this.BarDomRef;
		},

		getBarContainerDomRef: function () {
			return this.BarContainerDomRef;
		},
	});
});
