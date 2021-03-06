/* eslint-disable indent */
// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define(["sap/ui/base/Object", "../BaseDOMUtils/BaseDOMUtils"], function (UI5Object) {
	return UI5Object.extend("BaseDomComponent", {
		constructor: function ({ oPredefinedAttributes = {}, sId, aPredefinedClasses = [], element, oParent, iWidth, sWidthUnits, oRenderer, iHeight, sHeightUnits }) {
			this._oDomRef = element;
			this._oParent = oParent;
			this._iWidth = iWidth;
			this._sWidthUnits = sWidthUnits;
			this._sId = sId;
			this._iHeight = iHeight;
			this._sHeightUnits = sHeightUnits;
			if (sId) {
				oPredefinedAttributes = this.mergeAttributes(
					{
						id: sId,
					},
					oPredefinedAttributes
				);
			}
			this._oPredefinedAttributes = oPredefinedAttributes;
			this._aPredefinedClasses = aPredefinedClasses;
			this.renderer = oRenderer;
		},

		overrideAttributes: function (oAttributesTarget, oAttributesSource) {
			return {
				...oAttributesTarget,
				...oAttributesSource,
			};
		},

		mergeAttributes: function (oAttributesTarget, oAttributesSource) {
			return this.mergeDeep(oAttributesTarget, oAttributesSource);
		},

		mergeDeep: function (...aObjects) {
			const bIsObject = (oObj) => oObj && typeof oObj === "object";

			return aObjects.reduce((oPrev, oObj) => {
				Object.keys(oObj).forEach((sKey) => {
					const pVal = oPrev[sKey];
					const oVal = oObj[sKey];

					if (Array.isArray(pVal) && Array.isArray(oVal)) {
						oPrev[sKey] = pVal.concat(...oVal);
					} else if (bIsObject(pVal) && bIsObject(oVal)) {
						oPrev[sKey] = this.mergeDeep(pVal, oVal);
					} else {
						oPrev[sKey] = oVal;
					}
				});

				return oPrev;
			}, {});
		},

		isEmptyObject: function (oObj) {
			return oObj && Object.keys && Object.keys(oObj).length === 0 && Object.getPrototypeOf(oObj) === Object.prototype;
		},

		mergeClasses: function (aClassesTarget, aClassesSource) {
			const oUnique = new Set([...aClassesTarget, ...aClassesSource]);
			return Array.from(oUnique);
		},

		setId: function (sValue) {
			this._sId = sValue;
			return this;
		},

		getId: function () {
			return this._sId;
		},

		setDomRef: function (element) {
			this._oDomRef = element;
			return this;
		},

		getDomRef: function () {
			return this._oDomRef;
		},

		getWidth: function () {
			return this._iWidth;
		},

		setWidth: function (iValue) {
			this._iWidth = iValue;
			return this;
		},

		getWidthUnits: function () {
			return this._sWidthUnits;
		},

		setWidthUnits: function (sValue) {
			this._sWidthUnits = sValue;
			return this;
		},

		getHeight: function () {
			return this._iHeight;
		},

		setHeight: function (iValue) {
			this._iHeight = iValue;
			return this;
		},

		getHeightUnits: function () {
			return this._sHeightUnits;
		},

		setHeightUnits: function (sValue) {
			this._sHeightUnits = sValue;
			return this;
		},

		setParent: function (oValue) {
			this._oParent = oValue;
		},

		getParent: function () {
			return this._oParent;
		},

		setPredefinedAttributes: function (oAttributes) {
			this._oPredefinedAttributes = oAttributes;
			return this;
		},

		getPredefinedAttributes: function () {
			return this._oPredefinedAttributes;
		},

		setPredefinedClasses: function (aValue) {
			this._aPredefinedClasses = aValue;
			return this;
		},

		getPredefinedClasses: function () {
			return this._aPredefinedClasses;
		},

		// supports only 1 level of nesting
		convertAttributesObjectToArray: function (oAttributes) {
			const aArray = [];
			try {
				for (const [sKey, vData] of Object.entries(oAttributes)) {
					if (typeof vData === "object") {
						let sValue = "";
						for (const [sNestedKey, sNestedData] of Object.entries(vData)) {
							sValue += `${sNestedKey}:${sNestedData};`;
						}
						aArray.push([sKey, sValue]);
					} else {
						aArray.push([sKey, vData]);
					}
				}
			} catch (err) {
				console.log(err);
			}
			return aArray;
		},

		createStandaloneHTMLRepresentation: function ({ aClasses = [], sClassesAction = "MERGE", oAttributes = {}, sAttributesAction = "MERGE" }) {
			let oFinalttributes = {};
			switch (sAttributesAction) {
				case "MERGE": {
					oFinalttributes = this.mergeAttributes(this._oPredefinedAttributes, oAttributes);
					break;
				}
				case "OVERRRIDE": {
					oFinalttributes = this.overrideAttributes(this._oPredefinedAttributes, oAttributes);
					break;
				}
				case "REPLACE": {
					oFinalttributes = oAttributes;
					break;
				}
				default: {
					oFinalttributes = this.mergeAttributes(this._oPredefinedAttributes, oAttributes);
					break;
				}
			}

			let aFinalClasses = [];
			switch (sClassesAction) {
				case "MERGE": {
					aFinalClasses = this.mergeClasses(this._aPredefinedClasses, aClasses);
					break;
				}
				case "REPLACE": {
					aFinalClasses = aClasses;
					break;
				}
				default: {
					aFinalClasses = this.mergeClasses(this._aPredefinedClasses, aClasses);
					break;
				}
			}

			this._oPredefinedAttributes;
			const $element = this.renderer.createHTMLElement({
				aClasses: this.mergeClasses(this._aPredefinedClasses, aFinalClasses),
				aAttributes: this.convertAttributesObjectToArray(oFinalttributes),
			});

			return $element;
		},
	});
});
