/* eslint-disable indent */
// TODO: To prorotype
// eslint-disable-next-line no-undef
sap.ui.define([], function (UI5Object) {
	return {
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
	};
});
