// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(
	["../BaseDataRepresentationComponent/BaseDataRepresentationComponent", "../BaseDOMUtils/BaseDOMUtils", "./InputRenderer"],
	function (BaseDataRepresentationComponent, DOMUtils, Renderer) {
		return BaseDataRepresentationComponent.extend("Input", {
			constructor: function ({ sId, element, oParent, iWidth, sWidthUnits, iHeight, iHeightUnits, oPredefinedAttributes = {}, aPredefinedClasses = [] }) {
				aPredefinedClasses = DOMUtils.mergeClasses(aPredefinedClasses, ["Input", "BasicInput"]);

				BaseDataRepresentationComponent.call(this, {
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
					fnUpdateValue: this.setValueByType.bind(this, "displayedValue"),
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
					return;
				}

				if (vValue === this.getValueByType(sType)) {
					return;
				}

				if (sType === "displayedValue") {
					this.getDomRef().value = vValue;
				}

				this._oValues[sType] = vValue;
			},

			getValueByType: function (sType) {
				return this._oValues[sType];
			},
		});
	}
);
