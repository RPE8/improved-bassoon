/* global sap*/
sap.ui.define(
	[
		"sap/ui/core/Control",
		"./TableRenderer",
		"./Row/TableHeaderRow",
		"./Row/TableDataRow",
		"./Row/TableRowTh",
		"./Column/Column",
		"./Cell/TableCell",
		"./Cell/TableCellTh",
		"./ScrollBar",
	],
	function (Control, TableRenderer, TableHeaderRow, TableDataRow, TableRowTh, Column, TableCell, TableCellTh, ScrollBar) {
		return Control.extend("Table", {
			init: function () {
				this.aColumns = [];
				this.iRows = 70;
				this.iRowHeight = 22;
				this.iColumns = 70;
				this.iColumnHeaderRows = 3;
				// this.oDataMap = new Map();
				this.iVisibleRowsCount = 30;
				this.oDataRowToTableRow = {};
				for (let i = 0; i < this.iVisibleRowsCount; i++) {
					this.oDataRowToTableRow[i] = i;
				}
				this.iCurrentFirstRow = 0;
				this.iCurrentLastRow = this.iVisibleRowsCount - 1;

				this.oObservers = this.initObservers();
				this.oRows = this.initRows();
				this.mCellsById = new Map();
				this.mRowsById = new Map();

				this.verticalSBTop = 0;
				this.horizontalSBLeft = 0;

				this.aData = this.createData();

				const sTableId = this.getId();
				this.oGenerators = this.initGenerators(sTableId);

				this.aColumns2BeCreated = [];
			},

			initGenerators(sId) {
				return {
					cellId: this._getIdGenerator(sId, "Cell"),
					columnId: this._getIdGenerator(sId, "Column"),
					columnIndex: this._getIncGenerator(),
					rowId: this._getIdGenerator(sId, "Row"),
					rowIndex: this._getIncGenerator(),
				};
			},

			_getIncGenerator: function () {
				return (function* () {
					let index = 0;
					while (true) yield index++;
				})();
			},

			_getIdGenerator: function (sTableId, sComponent) {
				return (function* () {
					let index = 0;
					while (true) yield `${sTableId}-${sComponent}-${index++}`;
				})();
			},

			initObservers() {
				const oObservers = {};
				return oObservers;
			},

			_initDataPartIntersectionObserver({ oObservers, $root, fnCallback }) {
				const _sIntersectionObserverPath = "dataPartIntersection";

				fnCallback =
					fnCallback ||
					function (entries) {
						entries.forEach((entry) => {
							const target = entry.target;
							const sId = target.getAttribute("id");
							const oCell = this.getCellById(sId);
							const iRow = oCell.getRowIndex();
							const iDataRow = this.oDataRowToTableRow[iRow];
							const sValue = oCell.getColumn().getDataAccessor()(this.aData[iDataRow]);

							if (oCell.getDisplayedValue() !== sValue) {
								oCell.setDisplayedValue(sValue, true);
							}
						});
					}.bind(this);

				const oObserver = new IntersectionObserver(fnCallback, {
					root: $root,
				});

				this.getIntersectionObserver = () => {
					return oObservers[_sIntersectionObserverPath];
				};
				this.setIntersectionObserver = (oData) => {
					oObservers[_sIntersectionObserverPath] = oData;
					return this;
				};
				this.removeIntersectionObserver = () => {
					delete oObservers[_sIntersectionObserverPath];
					return this;
				};
				this.destroyIntersectionObserver = () => {
					oObservers[_sIntersectionObserverPath].disconnect();
					delete oObservers[_sIntersectionObserverPath];
					return this;
				};

				return oObserver;
			},

			initRows: function () {
				const oRows = {
					dataRows: [],
					headersRows: [],
					allRows: [],
					headersThRows: [],
					dataThRows: [],
				};

				return oRows;
			},

			createData() {
				const aData = [];
				for (let i = 0; i < this.iRows; i++) {
					const aRow = [];
					for (let j = 0; j < this.iColumns; j++) {
						// this.oDataMap.set(`${i}:${j}`, `${i}:${j}`);
						aRow.push(`${i}:${j}`);
					}

					aData.push({ data: aRow });
				}

				return aData;
			},

			getData() {
				return this.aData;
			},

			_reassigneRowsDataAccordingToDataRow2TableRow() {
				let iBorderWidth = 0;
				let iLastTdIndex = null;

				for (let i = 0; i < this.iVisibleRowsCount; i++) {
					console.time("row");
					const oRow = this.aDataRows[i];

					const aCells = oRow.getCells();

					const iLength = aCells.length;
					for (let j = 0; j < iLength; j++) {
						const oTd = aCells[j];

						if (iLastTdIndex === null) {
							if (this.iTableBodyScrollContainerWidth < iBorderWidth) {
								iLastTdIndex = j;
								break;
							}

							iBorderWidth += oTd.getWidth();
						} else if (iLastTdIndex === j) {
							break;
						}

						const iRow = oTd.getRowIndex();

						const iDataRow = this.oDataRowToTableRow[iRow];
						const sValue = oTd.getColumn().getDataAccessor()(this.aData[iDataRow]);

						if (oTd.getDisplayedValue() !== sValue) {
							oTd.setDisplayedValue(sValue, true);
						}
					}
					console.timeEnd("row");
				}
			},

			onWheelHandler: function (oEvent) {
				const aKeys = Object.keys(this.oDataRowToTableRow);

				if (oEvent.deltaY < 0) {
					if (this.iCurrentFirstRow <= 0) {
						return;
					}

					this.iCurrentFirstRow--;
					this.iCurrentLastRow--;

					for (let sRowId in Object.keys(this.oDataRowToTableRow)) {
						this.oDataRowToTableRow[sRowId] = this.oDataRowToTableRow[sRowId] - 1;
					}
					const [iTop] = this.$VerticalScrollBar.style.top.split("%");
					this.$VerticalScrollBar.style.top = `${(+iTop ?? 0) - 100 / this.iRows}%`;

					this._reassigneRowsDataAccordingToDataRow2TableRow();
				} else if (oEvent.deltaY > 0) {
					if (this.iCurrentLastRow >= this.aData.length - 1) {
						return;
					}

					this.iCurrentFirstRow++;
					this.iCurrentLastRow++;

					for (let sRowId in aKeys) {
						this.oDataRowToTableRow[sRowId] = this.oDataRowToTableRow[sRowId] + 1;
					}

					const [iTop] = this.$VerticalScrollBar.style.top.split("%");
					this.$VerticalScrollBar.style.top = `${(+iTop ?? 0) + 100 / this.iRows}%`;

					this._reassigneRowsDataAccordingToDataRow2TableRow();
				}

				// this.$VerticalScrollBar.style.top = `${this.iRows * (this.oDataRowToTableRow[aKeys.length - 1] - this.iVisibleRowsCount) / 100}%`;
			},

			simulateMouseWheel: function (bUp) {
				const event = new MouseEvent("wheel", {
					view: window,
					bubbles: false,
					cancelable: false,
				});

				event.deltaY = bUp ? 1 : -1;
				this.$TABLE.dispatchEvent(event);
			},

			onScrollBarMouseDownHandler: function (event) {
				console.log(event);
			},

			onScrollBarMouseUpHandler: function (event) {
				console.log(event);
			},

			pauseEvent: function (e) {
				if (e.stopPropagation) e.stopPropagation();
				if (e.preventDefault) e.preventDefault();
				e.cancelBubble = true;
				e.returnValue = false;
				return false;
			},

			addColumn2BeCreated: function (oColumn) {
				const oIdGenerator = this.getGenerator("columnId");
				const oIndexGenerator = this.getGenerator("columnId");
				if (!oIdGenerator || !oIndexGenerator) {
					return false;
				}
				const oColumn2BeCreated = new Column({
					sId: oIdGenerator.next().value,
					iIndex: oIndexGenerator.next().value,
					aHeaders: oColumn.aHeaders,
					sDataPath: oColumn.sDataPath,
					fnDataAccessor: oColumn.fnDataAccessor,
					iWidth: oColumn.iWidth,
					sWidthUnits: oColumn.sWidthUnits,
					fnAggregationConstructor: oColumn.oAggregationConstructor,
				});

				this.aColumns.push(oColumn2BeCreated);
			},

			clearTable: function () {
				this.destroyIntersectionObserver?.();
				this.oRows = this.initRows();
				this.oGenerators = this.initGenerators(this.getId());
				this.oObservers = this.initObservers();
				this.mCellsById?.clear();
				this.mRowsById?.clear();
			},

			// Rerender whole table
			renderTable: function () {
				this.clearTable();

				const oDataPartIntersectionObserver = this._initDataPartIntersectionObserver({
					oObservers: this.getObservers(),
					root: this.$TableBodyScrollContainer,
				});

				const aHeaderRows = this.createFulfilledHeadersPartElements();
				console.log(aHeaderRows);
				// return;
				let iBodyWidth = 0;
				if (this.aColumns && this.aColumns.length) {
					this.aColumns.forEach((oColumn) => (iBodyWidth += oColumn.getWidth()));
				}
				this.$HeaderTable.setAttribute("width", iBodyWidth);
				this.$HeaderTable.setAttribute("cols", this.aColumns.length ?? 0);
				this.$TableHeaderBody.replaceChildren(...aHeaderRows);
				return;
				const $DataThRow = this.createUtilThRow({ aAdditionalTrClasses: "thRow dataThRow", aAdditionalThClasses: "dataThCell" });
				const aRows = this.createDataRows();
				// this.$TableBody.setAttribute("width", iBodyWidth);
				this.$DataTable.setAttribute("width", iBodyWidth);
				this.$DataTable.setAttribute("cols", this.aColumns.length ?? 0);
				this.$TableBody.replaceChildren($DataThRow, ...aRows);

				const oRect = this.$TableBodyScrollContainer.getBoundingClientRect();
				this.iTableBodyScrollContainerWidth = oRect.width;
				this.iTableBodyScrollContainerHeight = oRect.height;

				// TODO; Dynamic height of rows
				this.$HorizontalScrollBar.setAttribute("style", `width: ${(this.iTableBodyScrollContainerWidth * 100) / iBodyWidth}%`);
				this.$VerticalScrollBar.setAttribute("style", `height: ${(this.iVisibleRowsCount * this.iRowHeight * 100) / (this.iRows * this.iRowHeight)}%`);

				console.log(this.aColumns);
				console.log(this.aRows);
				console.log(this.aHeaderRows);
				console.log(this.aDataRows);
				console.log(this.mRowsById);
				console.log(this.mCellsById);
			},

			createFulfilledHeadersPartElements: function () {
				let aElements = [];
				const aColumns = this.aColumns;
				const iHeadersAmount = this.iColumnHeaderRows;
				const oRowIdGenerator = this.getGenerator("rowId");
				const oRowIndexGenerator = this.getGenerator("rowIndex");
				const iColumnsLength = aColumns.length;
				const oCellIdGenerator = this.getGenerator("cellId");

				const oThRow = new TableRowTh({
					sId: oRowIdGenerator.next().value,
					iIndex: oRowIndexGenerator.next().value,
				});

				let iColSpan = 0;
				for (let iColumn = 0; iColumn < iColumnsLength; iColumn++) {
					const oColumn = aColumns[iColumn];
					const oCell = new TableCell({
						// eslint-disable-line
						sId: oCellIdGenerator.next().value,
						iIndex: oColumn.getIndex(),
						oColumn,
						iRow: oThRow.getIndex(),
						oThRow,
						iWidth: oColumn.getWidth(),
						fnAggregationConstructor: undefined,
						sWidthUnits: oColumn.getWidthUnit(),
					});

					oThRow.addCell(oCell);

					const aHeaders = oColumn.getHeadersObjects();
					const oHeader = aHeaders[iColumn];
					if (iColSpan > 0) {
						iColSpan--;
						continue;
					}
					oThRow.addCell2BeCreated(oCell);
					iColSpan = oHeader?.span ?? 0;
					if (oHeader?.span) {
						// oCell.addPredefinedAttribute(["colspan", oHeader.span]);
						iColSpan--;
					}

					oColumn.addHeaderCell(oCell);
				}

				aElements.push(oThRow.createFullfiledHTMLRepresentation({}));

				for (let iRow = 0; iRow < iHeadersAmount; iRow++) {
					const oRow = new TableHeaderRow({
						sId: oRowIdGenerator.next().value,
						iIndex: oRowIndexGenerator.next().value,
					});

					this.oRows.allRows.push(oRow);
					this.oRows.headersRows.push(oRow);
					let iColSpan = 0;
					for (let iColumn = 0; iColumn < iColumnsLength; iColumn++) {
						const oColumn = aColumns[iColumn];
						const oCell = new TableCell({
							// eslint-disable-line
							sId: oCellIdGenerator.next().value,
							iIndex: oColumn.getIndex(),
							oColumn,
							iRow: oRow.getIndex(),
							oRow,
							iWidth: oColumn.getWidth(),
							fnAggregationConstructor: oColumn.getAggregationConstructor(),
							sWidthUnits: oColumn.getWidthUnit(),
						});
						oRow.addCell(oCell);
						const aHeaders = oColumn.getHeadersObjects();
						const oHeader = aHeaders[iColumn];

						if (iColSpan > 0) {
							iColSpan--;
							continue;
						}
						oRow.addCell2BeCreated(oCell);
						iColSpan = oHeader?.span ?? 0;
						if (oHeader?.span) {
							// oCell.addPredefinedAttribute(["colspan", oHeader.span]);
							iColSpan--;
						}

						oColumn.addHeaderCell(oCell);
					}

					aElements.push(oRow.createFullfiledHTMLRepresentation({}));
				}

				return aElements;
			},

			createDataPartElement: function () {},

			createHeadersRows: function () {
				return aTrs;
			},

			createUtilThRow: function ({ sAdditionalTrClasses = "", sAdditionalThClasses = "" }) {
				const aColumns = this.aColumns;
				const sRowThId = this.oIdRowGenerator.next().value;

				const oRowTh = new TableRowTh({
					sId: sRowThId,
				});

				this.mRowsById.set(sRowThId, oRowTh);
				this.aRows.push(oRowTh);

				const $TrTh = TableRenderer.createElement(
					"tr",
					["thRow", ...sAdditionalTrClasses],
					[
						["id", sRowThId],
						["style", " height: 0px"],
					]
				);
				oRowTh.setDomRef($TrTh);

				aColumns.forEach((oColumn, iColumn) => {
					const sCellId = this.oIdCellGenerator.next().value;
					oColumn.setColumnIndex(iColumn);
					const oCell = new TableCellTh({
						// eslint-disable-line
						sId: sCellId,
						iColumn,
						oColumn,
						iRow: undefined,
						oRowTh,
						iWidth: oColumn.getWidth(),
						sWidthUnits: oColumn.getWidthUnit(),
					});
					oRowTh.addCell(oCell);

					const $Th = TableRenderer.createElement(
						"th",
						["thCell", ...sAdditionalThClasses],
						[
							["id", sCellId],
							// ["width", oColumn.getWidth()],
							["style", `width:${oColumn.getWidth()}${oColumn.getWidthUnit()};max-width:${oColumn.getWidth()}${oColumn.getWidthUnit()};`],
						]
					);
					this.mCellsById.set(sCellId, oCell);
					$TrTh.appendChild($Th);
					oColumn.addHeaderCell(oCell);
					oCell.setDomRef($Th);
					oCell.setRowDomRef($TrTh);
				});

				this.addUtilRow("ths", oRowTh);
				return $TrTh;
			},

			createDataRows: function () {
				const aColumns = this.aColumns;
				const aTrs = [];

				const iRows = this.iVisibleRowsCount;
				// TODO: Move to separate method

				for (let i = 0; i < iRows; i++) {
					const sRowId = this.oIdRowGenerator.next().value;
					const $Tr = TableRenderer.createElement("tr", [], [["id", sRowId]]);

					const oRow = new TableDataRow({
						sId: sRowId,
						iRow: i,
					});
					this.mRowsById.set(sRowId, oRow);
					this.aRows.push(oRow);
					this.aDataRows.push(oRow);

					oRow.setDomRef($Tr);

					aColumns.forEach((oColumn, iColumn) => {
						const sCellId = this.oIdCellGenerator.next().value;
						oColumn.setColumnIndex(iColumn);
						const oCell = new TableCell({
							// eslint-disable-line
							sId: sCellId,
							iColumn,
							oColumn,
							iRow: i,
							oRow,
							iWidth: oColumn.getWidth(),
							fnAggregationConstructor: oColumn.getAggregationConstructor(),
							sWidthUnits: oColumn.getWidthUnit(),
						});
						oRow.addCell(oCell);

						const $Td = TableRenderer.createElement(
							"td",
							[],
							[
								["id", sCellId],
								// ["width", oColumn.getWidth()],
							]
						);
						this.mCellsById.set(sCellId, oCell);
						// $Td.innerHTML = (oColumn.getDataAccessor())(this.aData[i]);
						this.oIntersectionObserver.observe($Td);
						$Tr.appendChild($Td);
						oColumn.addDataCells(oCell);
						oCell.setDomRef($Td);
						oCell.setRowDomRef($Tr);
						oCell.renderAggregation();
					});

					aTrs.push($Tr);
				}

				return aTrs;
			},

			populateTableWithData: function () {},

			createTableDataObject: function () {
				// const aData = this.aData;
				// const iColumns = this.iColumns;
				// const iVisibleRows = this.iVisibleRowsCount;
			},

			createTable() {
				const $TABLE = (this.$TABLE = document.getElementById("TABLE"));

				const onYMouseMove = (this.onYScrollMouseMove = (oEvent) => {
					// prevents text selection
					this.pauseEvent(oEvent);
					console.log(oEvent);
					if (oEvent.screenY < oVerticalScrollbar.getPreviousY()) {
						console.log("up");
						this.simulateMouseWheel(false);
						oVerticalScrollbar.setPreviousY(oEvent.screenY);
					} else if (oEvent.screenY > oVerticalScrollbar.getPreviousY()) {
						this.simulateMouseWheel(true);
						console.log("down");

						oVerticalScrollbar.setPreviousY(oEvent.screenY);
					}
				});

				if (this._fnCurrWheelHandler) {
					$TABLE.removeEventListener("wheel", this._fnCurrWheelHandler);
				}
				const onWheelHandler = (this._fnCurrWheelHandler = (oEvent) => {
					this.onWheelHandler(oEvent);
				});

				const { bodyTBody, headerTBody, bodyScrollContainer, table, headerTable, verticalBar, verticalBarScrollContainer, horizontalBar, horizontalBarScrollContainer } =
					TableRenderer.renderTableContent({
						oContext: this,
					});
				$TABLE.addEventListener("wheel", onWheelHandler);

				this.$TableBodyScrollContainer = bodyScrollContainer;
				this.$TableHeaderBody = headerTBody;
				this.$TableBody = bodyTBody;
				this.$DataTable = table;
				this.$HeaderTable = headerTable;

				const oVerticalScrollbar = (this.oVerticalScrollbar = new ScrollBar({
					bVertical: true,
					BarContainerDomRef: verticalBarScrollContainer,
					BarDomRef: verticalBar,
				}));

				const oVerticalBar = oVerticalScrollbar.getBarDomRef();

				const oHorizontalScrollbar = (this.oHorizontalScrollbar = new ScrollBar({
					bHorizontal: true,
					BarContainerDomRef: horizontalBarScrollContainer,
					BarDomRef: horizontalBar,
				}));

				const oHorizontalBar = oHorizontalScrollbar.getBarDomRef();

				this.$VerticalScrollBar = verticalBar;
				this.$HorizontalScrollBar = horizontalBar;

				if (this._fnCurrVScrollBarMouseDownHandler) {
					this.$VerticalScrollBar.removeEventListener("mousedown", this._fnCurrVScrollBarMouseDownHandler);
				}

				if (this._fnCurrVScrollBarMouseUpHandler) {
					this.$VerticalScrollBar.removeEventListener("mouseup", this._fnCurrVScrollBarMouseUpHandler);
				}

				const onMouseUp = (this._fnCurrVScrollBarMouseUpHandler = (oEvent, oEvent2) => {
					this._bScroll = false;
					$TABLE.removeEventListener("mousemove", onYMouseMove);
					$TABLE.removeEventListener("mouseup", onMouseUp);
					this.onScrollBarMouseUpHandler(oEvent, oEvent2);
				});

				const onMouseDown = (this._fnCurrVScrollBarMouseDownHandler = (oEvent, oEvent2) => {
					this._bScroll = true;
					$TABLE.addEventListener("mousemove", onYMouseMove);
					$TABLE.addEventListener("mouseup", onMouseUp);
					this.onScrollBarMouseDownHandler(oEvent, oEvent2);
				});

				oVerticalBar.addEventListener("mousedown", onMouseDown);
				oVerticalBar.addEventListener("mouseup", onMouseUp);
				// const oColumn = new Column({
				//   sId: this.oIdColumnsGenerator.next().value
				// });
			},

			getCellById: function (sId) {
				return this.mCellsById.get(sId);
			},

			getRowById: function (sId) {
				return this.mRowsById.get(sId);
			},

			getColumnById: function (sId) {
				return this.aColumns.find((oColumns) => oColumns.getId() === sId);
			},

			getTdById: function (sId) {
				return this.getCellById(sId)?.getDomRef();
			},

			getTrById: function (sId) {
				return this.getRowById(sId)?.getDomRef();
			},

			getHeaderRowsCount() {
				return this.iColumnHeaderRows;
			},

			getColumnsCount() {
				return this.iColumns;
			},

			getVisibleRows() {
				return this.iVisibleRowsCount;
			},

			setUtilRows: function (oValue) {
				this._oUtilRows = oValue;
				return this;
			},

			getRows: function () {
				return this.oRows;
			},

			setRows: function (oData) {
				this.oRows = oData;
				return this;
			},

			addRows: function (sName, aData) {
				if (!this.oRows[sName]) {
					this.oRows[sName] = [];
				}
				this.oRows[sName] = [...this.oRows[sName], ...aData];
				return this;
			},

			removeRows: function (sName) {
				delete this.oRows[sName];
				return this;
			},

			clearRows: function () {
				this.oRows = {};
				return this;
			},

			getObservers: function () {
				return this.oObservers;
			},

			setObservers: function (oData) {
				this.oObservers = oData;
				return this;
			},

			addObserver: function (sName, oData) {
				this.oObservers[sName] = oData;
				return this;
			},

			removeObserver: function (sName) {
				delete this.oObservers[sName];
				return this;
			},

			clearObservers: function () {
				this.oObservers = {};
				return this;
			},

			getGenerators: function () {
				return this.oGenerators;
			},

			getGenerator: function (sName) {
				return this.oGenerators[sName];
			},

			setGenerators: function (oData) {
				this.oGenerators = oData;
				return this;
			},

			addGenerator: function (sName, oData) {
				this.oGenerators[sName] = oData;
				return this;
			},

			removeGenerator: function (sName) {
				delete this.oGenerators[sName];
				return this;
			},

			clearGenerator: function () {
				this.oGenerators = {};
				return this;
			},

			addUtilRow: function (sType, oValue) {
				if (!(sType in this._oUtilRows)) {
					this._oUtilRows[sType] = [];
				}

				this._oUtilRows[sType].push(oValue);
			},

			getUtilRowsByType: function (sType) {
				return this._oUtilRows[sType];
			},

			isInViewport: (element) => {
				const rect = element.getBoundingClientRect();
				return (
					rect.top >= 0 &&
					rect.left >= 0 &&
					rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
					rect.right <= (window.innerWidth || document.documentElement.clientWidth)
				);
			},

			renderer: TableRenderer,
		});
	}
);
