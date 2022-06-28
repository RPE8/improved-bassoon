/* global sap*/
sap.ui.define(
	[
		"sap/ui/core/Control",
		"./TableRenderer",
		"./Row/TableRowHeader",
		"./Row/TableRowData",
		"./Row/TableRowTh",
		"./Column/Column",
		"./Cell/TableCell",
		"./Cell/TableCellTh",
		"./ScrollBar",
		"../BaseDOMUtils/BaseDOMUtils",
	],
	function (Control, TableRenderer, TableRowHeader, TableRowData, TableRowTh, Column, TableCell, TableCellTh, ScrollBar, BaseDOMUtils) {
		return Control.extend("Table", {
			init: function () {
				this.aColumns = [];
				this.iRows = 35;
				this.iRowHeight = 17;
				this.iColumns = 70;

				this.iHeaderRowsAmount = 0;
				this.iHeaderRowsThAmount = 0;

				this.iDataRowsAmount = 0;
				this.iDataRowsThAmount = 0;

				// this.oDataMap = new Map();
				this.iVisibleRowsCount = Math.min(30, this.iRows);
				// Row Index to Data Index
				this.oDataRowToTableRow = {};

				this.iDataRowsStartIndex = null;

				this.oObservers = this.initObservers();
				this.oRows = this.initRows();
				this.oRowsAmount = this.initRowsAmount();
				this.mCellsById = new Map();
				this.mRowsById = new Map();

				this.verticalSBTop = 0;
				this.horizontalSBLeft = 0;

				this.aData = this.createData();

				const sTableId = this.getId();
				this.oGenerators = this.initGenerators(sTableId);

				this.aColumns2BeCreated = [];

				this.oVerticalScrollbar = null;
				this.oHorizontalScrollbar = null;
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

			_update$CellAggregationByDataRow2TableRow: function ($cell) {
				const sId = $cell.getAttribute("id");
				const oCell = this.getCellById(sId);
				this._updateCellAggregationByDataRow2TableRow(oCell);
			},

			_updateCellAggregationByDataRow2TableRow: function (oCell) {
				const oRow = oCell.getRow();
				const iRow = oRow.getIndex();
				const iDataRow = this.oDataRowToTableRow[iRow];
				const sValue = oCell.getColumn().getDataGetter()(this.aData[iDataRow]);
				oCell.updateAggregation({ vNewValue: sValue });
			},

			_intersectionObserverCallback: function (aEntries) {
				aEntries.forEach((entry) => {
					const $target = entry.target;
					this._update$CellAggregationByDataRow2TableRow($target);
				});
			},

			_initDataPartIntersectionObserver({ oObservers, $root, fnCallback }) {
				const _sIntersectionObserverPath = "dataPartIntersection";

				fnCallback = fnCallback.bind(this) || function () {};

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

				oObservers[_sIntersectionObserverPath] = oObserver;

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

			initRowsAmount: function () {
				const oRowsAmount = {
					dataRows: 0,
					headersRows: 0,
					allRows: 0,
					headersThRows: 0,
					dataThRows: 0,
				};

				return oRowsAmount;
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

			_updateRowsDataAccordingToDataRow2TableRow() {
				let iBorderWidth = 0;
				let iLastCellIndex = null;
				for (let i = 0; i < this.iVisibleRowsCount; i++) {
					console.time("row");
					const oRow = this.oRows.dataRows[i];

					const aCells = oRow.getCells();

					const iLength = aCells.length;
					for (let j = 0; j < iLength; j++) {
						const oCell = aCells[j];

						// Optimizaton part
						if (iLastCellIndex === null) {
							if (this.iTableBodyScrollContainerWidth < iBorderWidth) {
								iLastCellIndex = j;
								break;
							}

							iBorderWidth += oCell.getWidth();
						} else if (iLastCellIndex === j) {
							break;
						}

						this._updateCellAggregationByDataRow2TableRow(oCell);
					}
					console.timeEnd("row");
				}
			},

			onWheelHandler: function (oEvent) {
				const aKeys = Object.keys(this.oDataRowToTableRow);
				const aValues = Object.values(this.oDataRowToTableRow);

				if (oEvent.deltaY < 0) {
					if (aValues[0] <= 0) {
						return;
					}

					for (let sRowId in aKeys) {
						const iRowIdExtended = Number(sRowId) + this.iDataRowsStartIndex;
						this.oDataRowToTableRow[iRowIdExtended] = this.oDataRowToTableRow[iRowIdExtended] - 1;
					}
					const [iTop] = this.$VerticalScrollBar.style.top.split("%");
					this.$VerticalScrollBar.style.top = `${(+iTop ?? 0) - 100 / this.iRows}%`;

					this._updateRowsDataAccordingToDataRow2TableRow();
				} else if (oEvent.deltaY > 0) {
					if (aValues[aValues.length - 1] >= this.aData.length - 1) {
						return;
					}

					for (let sRowId in aKeys) {
						const iRowIdExtended = Number(sRowId) + this.iDataRowsStartIndex;
						this.oDataRowToTableRow[iRowIdExtended] = this.oDataRowToTableRow[iRowIdExtended] + 1;
					}

					const [iTop] = this.$VerticalScrollBar.style.top.split("%");
					this.$VerticalScrollBar.style.top = `${(+iTop ?? 0) + 100 / this.iRows}%`;

					this._updateRowsDataAccordingToDataRow2TableRow();
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
					fnDataGetter: oColumn.fnDataGetter,
					fnDataSetter: oColumn.fnDataSetter,
					iWidth: oColumn.iWidth,
					sWidthUnits: oColumn.sWidthUnits,
					fnAggregationConstructor: oColumn.oAggregationConstructor,
				});

				this.aColumns.push(oColumn2BeCreated);
			},

			clearTable: function () {
				this.destroyIntersectionObserver?.();
				this.oRows = this.initRows();
				this.oRowsAmount = this.initRowsAmount();
				this.oGenerators = this.initGenerators(this.getId());
				this.oObservers = this.initObservers();
				this.mCellsById?.clear();
				this.mRowsById?.clear();
				this.iDataRowsStartIndex = null;
				this.oDataRowToTableRow = {};
			},

			// Rerender whole table
			renderTable: function () {
				this.clearTable();

				const oDataPartIntersectionObserver = this._initDataPartIntersectionObserver({
					oObservers: this.getObservers(),
					root: this.$TableBodyScrollContainer,
					fnCallback: this._intersectionObserverCallback,
				});
				const { aElements: aHeaderRows } = this.createFulfilledHeadersPartElements();

				let iBodyWidth = 0;
				if (this.aColumns && this.aColumns.length) {
					this.aColumns.forEach((oColumn) => (iBodyWidth += oColumn.getWidth()));
				}
				this.$HeaderTable.setAttribute("width", iBodyWidth);
				this.$HeaderTable.setAttribute("cols", this.aColumns.length ?? 0);
				this.$TableHeaderBody.replaceChildren(...aHeaderRows);
				const aDataRows = this.createFulfilledDataPartElements();
				this.$DataTable.setAttribute("width", iBodyWidth);
				this.$DataTable.setAttribute("cols", this.aColumns.length ?? 0);
				this.$TableBody.replaceChildren(...aDataRows);

				if (this.iDataRowsStartIndex >= 0) {
					for (let i = 0; i < this.iVisibleRowsCount; i++) {
						this.oDataRowToTableRow[i + this.iDataRowsStartIndex] = i;
					}
				}
			},

			createFulfilledHeadersPartElements: function () {
				let aElements = [];

				const aColumns = this.aColumns;
				const oRowIdGenerator = this.getGenerator("rowId");
				const oRowIndexGenerator = this.getGenerator("rowIndex");
				const iColumnsLength = aColumns.length;
				const oCellIdGenerator = this.getGenerator("cellId");
				const sThRowId = oRowIdGenerator.next().value;
				const iHeadersAmount = aColumns?.[0]?.getHeadersObjects()?.length || 0;

				this.setRowsAmountByType("headersThRows", 1);
				this.setRowsAmountByType("headersRows", iHeadersAmount);

				const oThRow = new TableRowTh({
					sId: sThRowId,
					iIndex: oRowIndexGenerator.next().value,
					iHeight: this.iRowHeight,
				});

				this.oRows.headersThRows.push(oThRow);

				this.mRowsById.set(sThRowId, oThRow);

				for (let iColumn = 0; iColumn < iColumnsLength; iColumn++) {
					const oColumn = aColumns[iColumn];
					const iWidth = oColumn.getWidth();
					const iWidthUnits = oColumn.getWidthUnits();
					const sCellId = oCellIdGenerator.next().value;
					const oCell = new TableCellTh({
						// eslint-disable-line
						sId: sCellId,
						iIndex: oColumn.getIndex(),
						oColumn,
						iRow: oThRow.getIndex(),
						oPredefinedAttributes: {
							style: {
								// TODO: Validation
								width: iWidth + iWidthUnits,
							},
						},
						oThRow,
						iWidth: iWidth,
						fnAggregationConstructor: undefined,
						sWidthUnits: iWidthUnits,
					});

					oThRow.addCell(oCell);

					oThRow.addCell2BeCreated(oCell);

					oColumn.addHeaderCell(oCell);

					this.mCellsById.set(sCellId, oCell);
				}

				aElements.push(oThRow.createFullfiledHTMLRepresentation({}));

				for (let iRow = 0; iRow < iHeadersAmount; iRow++) {
					const sRowId = oRowIdGenerator.next().value;
					const oRow = new TableRowHeader({
						sId: sRowId,
						iIndex: oRowIndexGenerator.next().value,
						iHeight: this.iRowHeight,
					});

					this.oRows.headersRows.push(oRow);
					this.mRowsById.set(sRowId, oRow);

					for (let iColumn = 0; iColumn < iColumnsLength; iColumn++) {
						const oColumn = aColumns[iColumn];
						const aHeaders = oColumn.getHeadersObjects();
						const oHeader = aHeaders[iRow];
						if (!oHeader) {
							continue;
						}

						const sCellId = oCellIdGenerator.next().value;

						const oCell = new TableCell({
							sId: sCellId,
							iIndex: oColumn.getIndex(),
							oColumn,
							oPredefinedAttributes: oHeader.oPredefinedAttributes,
							iRow: oRow.getIndex(),
							oRow,
							iHeight: oRow.getHeight(),
							sHeightUnits: oRow.getHeightUnits(),
							iWidth: oColumn.getWidth(),
							fnAggregationConstructor: oColumn.getAggregationConstructor(),
							sWidthUnits: oColumn.getWidthUnits(),
						});
						oRow.addCell(oCell);

						oRow.addCell2BeCreated(oCell);

						this.mCellsById.set(sCellId, oCell);
					}

					aElements.push(oRow.createFullfiledHTMLRepresentation({}));
				}

				return { aElements };
			},

			createFulfilledDataPartElements: function () {
				let aElements = [];
				const aColumns = this.aColumns;
				const oRowIdGenerator = this.getGenerator("rowId");
				const oRowIndexGenerator = this.getGenerator("rowIndex");
				const iColumnsLength = aColumns.length;
				const oCellIdGenerator = this.getGenerator("cellId");
				const sThRowId = oRowIdGenerator.next().value;

				this.setRowsAmountByType("dataThRows", 1);
				this.setRowsAmountByType("dataRows", this.iVisibleRowsCount);

				const oThRow = new TableRowTh({
					sId: sThRowId,
					iIndex: oRowIndexGenerator.next().value,
					iHeight: this.iRowHeight,
				});

				this.oRows.dataThRows.push(oThRow);
				this.mRowsById.set(sThRowId, oThRow);

				for (let iColumn = 0; iColumn < iColumnsLength; iColumn++) {
					const oColumn = aColumns[iColumn];

					const iWidth = oColumn.getWidth();
					const sWidthUnits = oColumn.getWidthUnits();
					const sCellId = oCellIdGenerator.next().value;
					const oCell = new TableCellTh({
						// eslint-disable-line
						sId: sCellId,
						iIndex: oColumn.getIndex(),
						oColumn,
						iRow: oThRow.getIndex(),
						oThRow,
						iWidth: oColumn.getWidth(),
						oPredefinedAttributes: {
							style: {
								// TODO: Validation
								width: iWidth + sWidthUnits,
							},
						},
						fnAggregationConstructor: undefined,
						sWidthUnits: oColumn.getWidthUnits(),
					});

					this.mCellsById.set(sCellId, oCell);

					oThRow.addCell(oCell);

					oThRow.addCell2BeCreated(oCell);

					oColumn.addHeaderCell(oCell);
				}

				aElements.push(oThRow.createFullfiledHTMLRepresentation({}));

				const aDataCells = [];
				for (let iRow = 0; iRow < this.iVisibleRowsCount; iRow++) {
					const sRowId = oRowIdGenerator.next().value;
					const iRowIndex = oRowIndexGenerator.next().value;

					if (this.iDataRowsStartIndex === null) this.iDataRowsStartIndex = iRowIndex;
					const oRow = new TableRowHeader({
						sId: sRowId,
						iIndex: iRowIndex,
						iHeight: this.iRowHeight,
					});

					this.oRows.dataRows.push(oRow);
					this.mRowsById.set(sRowId, oRow);

					for (let iColumn = 0; iColumn < iColumnsLength; iColumn++) {
						const oColumn = aColumns[iColumn];
						const aHeaders = oColumn.getHeadersObjects();
						const oHeader = aHeaders[iRow];
						const sCellId = oCellIdGenerator.next().value;
						const oCell = new TableCell({
							sId: sCellId,
							iIndex: oColumn.getIndex(),
							oColumn,
							iRow: oRow.getIndex(),
							oRow,
							iHeight: oRow.getHeight(),
							sHeightUnits: oRow.getHeightUnits(),
							iWidth: oColumn.getWidth(),
							fnAggregationConstructor: oColumn.getAggregationConstructor(),
							sWidthUnits: oColumn.getWidthUnits(),
						});

						this.mCellsById.set(sCellId, oCell);

						oRow.addCell(oCell);
						aDataCells.push(oCell);
						oRow.addCell2BeCreated(oCell);
					}

					aElements.push(oRow.createFullfiledHTMLRepresentation({}));
				}
				const oObserver = this.getIntersectionObserver();
				aDataCells.forEach((oCell) => oObserver.observe(oCell.getDomRef()));

				return aElements;
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

				horizontalBarScrollContainer.classList.add("invisible");
				verticalBarScrollContainer.classList.add("invisible");

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

			getRows: function () {
				return this.oRows;
			},

			setRows: function (oData) {
				this.oRows = oData;
				return this;
			},

			addRowsByType: function (sType, aData) {
				if (!this.oRows[sType]) {
					this.oRows[sType] = [];
				}
				this.oRows[sType] = [...this.oRows[sType], ...aData];
				return this;
			},

			removeRowsByType: function (sType) {
				delete this.oRows[sType];
				return this;
			},

			clearRows: function () {
				this.oRows = {};
				return this;
			},

			getRowsAmount: function () {
				return this.oRowsAmount;
			},

			setRowsAmount: function (oData) {
				this.oRowsAmount = oData;
				return this;
			},

			setRowsAmountByType: function (sType, iValue) {
				if (!this.oRowsAmount[sType]) {
					this.oRowsAmount[sType] = null;
				}

				this.oRowsAmount[sType] = iValue;
				return this;
			},

			removeRowsAmountByType: function (sType) {
				delete this.oRowsAmount[sType];
				return this;
			},

			clearRowsAmount: function () {
				this.oRowsAmount = {};
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

			getVerticalScrollBar: function () {
				return this.oVerticalScrollbar;
			},

			setVerticalScrollBar: function (oValue) {
				this.oVerticalScrollbar = oValue;
				return this;
			},

			getHorizontalScrollBar: function () {
				return this.oHorizontalScrollbar;
			},

			setHorizontalScrollBar: function (oValue) {
				this.oHorizontalScrollbar = oValue;
				return this;
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
