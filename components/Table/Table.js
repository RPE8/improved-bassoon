sap.ui.define([ // eslint-disable-line
	"sap/ui/core/Control",
	"./TableRenderer",
	"./TableHeaderRow",
	"./TableDataRow",
	"./Column"
], function (Control, TableRenderer, TableHeaderRow, TableDataRow, Column) {
	return Control.extend("Table", {
		init: function () {
			this.aColumns = [];
			this.iRows = 70;
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
			this.oIntersectionObserver = null;
			this.aRows = [];
			this.aCells = [];
			this.aHeaderRow = [];
			this.aDataRow = [];
			this.mCellsById = new Map();
			this.mRowsById = new Map();

			this.aData = this.createData();

			const sTableId = "Table";
			this.oIdRowGenerator = (function* idMaker() {
				let index = 0;
				while (true)
					yield `${sTableId}-Row-${index++}`;
			})();

			this.oIdCellGenerator = (function* idMaker() {
				let index = 0;
				while (true)
					yield `${sTableId}-Cell-${index++}`;
			})();

			this.oIdColumnsGenerator = (function* idMaker() {
				let index = 0;
				while (true)
					yield `${sTableId}-Column-${index++}`;
			})();

			this.aColumns2BeCreated = [];
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

		createData() {
			const aData = [];
			for (let i = 0; i < this.iRows; i++) {
				const aRow = [];
				for (let j = 0; j < this.iColumns; j++) {
					// this.oDataMap.set(`${i}:${j}`, `${i}:${j}`);
					aRow.push(`${i}:${j}`);
				}

				aData.push({data: aRow});
			}

			return aData;
		},

		getData() {
			return this.aData;
		},
    
		_reassigneRowsDataAccordingToDataRow2TableRow: function() {
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
					const sValue = (oTd.getColumn().getDataAccessor())(this.aData[iDataRow]);

					if (oTd.getDisplayedValue() !== sValue) {
						oTd.setDisplayedValue(sValue, true);
					}
				}
				console.timeEnd("row");
			}
		},

		onWheelHandler: function (oEvent) {
			if (oEvent.deltaY < 0) {
				if (this.iCurrentFirstRow <= 0) {
					return;
				}

				this.iCurrentFirstRow--;
				this.iCurrentLastRow--;

				for (let sRowId in Object.keys(this.oDataRowToTableRow)) {
					this.oDataRowToTableRow[sRowId] = this.oDataRowToTableRow[sRowId] - 1;
				}

				this._reassigneRowsDataAccordingToDataRow2TableRow();
			} else if (oEvent.deltaY > 0) {
				if (this.iCurrentLastRow >= this.aData.length - 1) {
					return;
				}

				this.iCurrentFirstRow++;
				this.iCurrentLastRow++;

				for (let sRowId in Object.keys(this.oDataRowToTableRow)) {
					this.oDataRowToTableRow[sRowId] = this.oDataRowToTableRow[sRowId] + 1;
				}

				this._reassigneRowsDataAccordingToDataRow2TableRow();
			}
		},

		addColumn2BeCreated: function (oColumn) {
			const oColumn2BeCreated = new Column({
				sId: this.oIdColumnsGenerator.next().value,
				aHeaders: oColumn.aHeaders,
				sDataPath: oColumn.sDataPath,
				fnDataAccessor: oColumn.fnDataAccessor,
				iWidth: oColumn.iWidth,
				sWidthUnit: oColumn.sWidthUnit
			});

			this.aColumns.push(oColumn2BeCreated);
		},

		createColumns: function () {
			this.aRows = [];
			this.aHeaderRows = [];
			this.aDataRows = [];
			this.mRowsById.clear();
			this.mCellsById.clear();
			
			// TODO: Do we nede to unobserve?
			this.oIntersectionObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					const target = entry.target;
					const sId = target.getAttribute("id");
					const oCell = this.getCellById(sId);
					const iRow = oCell.getRowIndex();
					const iDataRow = this.oDataRowToTableRow[iRow];
					const sValue = (oCell.getColumn().getDataAccessor())(this.aData[iDataRow]);

					if (oCell.getDisplayedValue() !== sValue) {
						oCell.setDisplayedValue(sValue, true);
					}
				});
			}, {
				root: this.$TableBody
			});

			const aHeaderRows = this.createHeadersRows();
			let iBodyWidth = 0;
			if (this.aColumns && this.aColumns.length) {
				this.aColumns.forEach(oColumn => iBodyWidth += oColumn.getWidth());
			}
			this.$HeaderTable.setAttribute("width", iBodyWidth);
			this.$HeaderTable.setAttribute("cols", this.aColumns.length ?? 0);
			this.$TableHeaderBody.replaceChildren(...aHeaderRows);
			const aRows = this.createDataRows();

			
			

			// this.$TableBody.setAttribute("width", iBodyWidth);
			this.$DataTable.setAttribute("width", iBodyWidth);
			this.$DataTable.setAttribute("cols", this.aColumns.length ?? 0);
			this.$TableBody.replaceChildren(...aRows);

			const oRect = this.$TableBodyScrollContainer.getBoundingClientRect();
			this.iTableBodyScrollContainerWidth = oRect.width;
			this.iTableBodyScrollContainerHeight = oRect.height;

			this.$HorizontalScrollBar.setAttribute("style", `width: ${this.iTableBodyScrollContainerWidth * 100 / iBodyWidth}%`);
			this.$VerticalScrollBar.setAttribute("style", `height: ${(this.iVisibleRowsCount * 19 * 100) / (this.iRows * 19)}%`);
      
			console.log(this.aColumns);
			console.log(this.aRows);
			console.log(this.aHeaderRows);
			console.log(this.aDataRows);
			console.log(this.mRowsById);
			console.log(this.mCellsById);
		},

		createHeadersRows: function () {
			const aColumns = this.aColumns;
			const aHeaderTrs = [];
			const aHeaderTds = [];
			const iHeadersAmount = this.iColumnHeaderRows;
			const aTrs = [];


			for (let i = 0; i < iHeadersAmount; i++) {
				const sRowId = this.oIdRowGenerator.next().value;
				const $Tr = TableRenderer.createElement("tr", [], [["id", sRowId]]);

				const oRow = new TableHeaderRow({
					sId: sRowId,
					iRow: i,
				});

				this.mRowsById.set(sRowId, oRow);

				this.aRows.push(oRow);
				this.aHeaderRow.push(oRow);
        
				oRow.setDomRef($Tr);

				let iColSpan = 0;
				aColumns.forEach((oColumn, iColumn) => {
					const sCellId = this.oIdCellGenerator.next().value;
					oColumn.setColumnIndex(iColumn);
					const oCell = new TableCell({ // eslint-disable-line
						sId: sCellId,
						iColumn,
						oColumn,
						iRow: i,
						oRow,
						iWidth: oColumn.getWidth(),
						sWidthUnit: oColumn.getWidthUnit()
					});
					oRow.addCell(oCell);
					const aHeaders = oColumn.getHeadersObjects();
					const oHeader = aHeaders[i];

					if (iColSpan > 0) {
						iColSpan--;
						return;
					}

					iColSpan = oHeader?.span ?? 0;

					const aAttributes = [["id", sCellId], ["width", oColumn.getWidth()]];

					if (oHeader?.span) {
						aAttributes.push(["colspan", oHeader.span]);
						iColSpan--;
					}

					const $Td = TableRenderer.createElement("td", [], aAttributes);
					this.mCellsById.set(sCellId, oCell);

					// oCell.setDisplayedValue(oHeader?.text || "", true);
					
					$Td.innerHTML = oHeader?.text || "";
					aHeaderTds.push($Td);
					$Tr.appendChild($Td);
					oColumn.addHeaderCell(oCell);
					oCell.setDomRef($Td);
					oCell.setRowDomRef($Tr);
				});

				aHeaderTrs.push(aHeaderTds);
				aTrs.push($Tr);
			}

			return aTrs;
		},

		createDataRows: function () {
			const aColumns = this.aColumns;
			const aHeaderTds = [];
			const aTrs = [];

			const iRows = this.iVisibleRowsCount;

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
					const oCell = new TableCell({ // eslint-disable-line
						sId: sCellId,
						iColumn,
						oColumn,
						iRow: i,
						oRow,
						iWidth: oColumn.getWidth(),
						sWidthUnit: oColumn.getWidthUnit(),
						
					});
					oRow.addCell(oCell);

					const $Td = TableRenderer.createElement("td", [], [["id", sCellId], ["width", oColumn.getWidth()]]);
					this.mCellsById.set(sCellId, oCell);
					// $Td.innerHTML = (oColumn.getDataAccessor())(this.aData[i]);
					this.oIntersectionObserver.observe($Td);
					aHeaderTds.push($Td);
					$Tr.appendChild($Td);
					oColumn.addHeaderCell(oCell);
					oCell.setDomRef($Td);
					oCell.setRowDomRef($Tr);
				});

				aTrs.push($Tr);
			}

			

			return aTrs;
		},

		populateTableWithData: function () {
			// const iHeaders = this.iColumnHeaderRows;


			// for (let i = 0; i < iHeaders; i++) {
			//   const tr = document.createElement('tr');
			//   const aTds = [];
			//   for (let j = 0; j < iColumns; j++) {
			//     const sId = oIdGenerator.next().value;
			//     const td = document.createElement('td');
			//     td.setAttribute("id", sId);

			//     const sData = `${i}:${j}`;
			//     tr.appendChild(td);
			//     const oCell = new TableHeaderCell({
			//       element: td,
			//       rowElement: tr,
			//       sId: sId,
			//       // Values is hardcoded
			//       iWidth: 42,
			//       sWidthUnit: "px",
			//       iColumn: j,
			//       iRow: i,
			//       tBodyRef: $TableBody,
			//       vValue: sData
			//     });

			//     mHeaderTdsById.set(sId, oCell);
			//   }
			//   aHeaderRows.push(new TableRow({
			//     sId: oIdGenerator.next().value,
			//     element: tr,
			//     aTds,
			//     tBody: $TableHeaderBody,
			//     iRow: i
			//   }))
			//   $TableHeaderBody.appendChild(tr);
			// };

			// const aTableData = oControl.getData();
			// const iRows = oControl.getVisibleRows();
			// const aRows = [];
			// const mTdsById = new Map();
			// for (let i = 0; i < iRows; i++) {
			//   const aData = aTableData[i];
			//   const tr = document.createElement('tr');
			//   tr.setAttribute("data-row", i);
			//   const aRow = [];
			//   const aTds = [];
			//   aData.forEach((sData, j) => {
			//     const sId = oIdGenerator.next().value;
			//     const td = document.createElement('td');
			//     td.setAttribute("id", sId);

			//     oObserver.observe(td);
			//     // td.innerHTML = sData;
			//     // td.innerHTML = `<input style='width:${20}px;' value='HEADER ${sData}'>`;
			//     tr.appendChild(td);

			//     const oCell = new TableBodyCell({
			//       element: td,
			//       rowElement: tr,
			//       sId: sId,
			//       // Values is hardcoded
			//       iWidth: 42,
			//       sWidthUnit: "px",
			//       iColumn: j,
			//       iRow: i,
			//       tBodyRef: $TableBody,
			//       scrollContainerRef: $TableBodyScrollContainer,
			//       vValue: sData
			//     });

			//     mTdsById.set(sId, oCell);
			//     aTds.push(oCell);
			//   });
			//   aHeaderRows.push(new TableRow({
			//     sId: oIdGenerator.next().value,
			//     element: tr,
			//     aTds,
			//     tBody: $TableBody,
			//     iRow: i
			//   }));
			//   $TBody.appendChild(tr);
			//   aRows.push(aRow);
			// }
		},

		createTableDataObject: function () {
			// const aData = this.aData;
			// const iColumns = this.iColumns;
			// const iVisibleRows = this.iVisibleRowsCount;
		},

		createTable() {
			const onWheelHandler = (oEvent) => {
				this.onWheelHandler(oEvent);
			};

			const { bodyTBody, headerTBody, bodyScrollContainer, table, headerTable, verticalBar, horizontalBar } = TableRenderer.renderTable({
				oContext: this
			});
			document.getElementById("TABLE").addEventListener("wheel", onWheelHandler);
			this.$TableBodyScrollContainer = bodyScrollContainer;
			this.$TableHeaderBody = headerTBody;
			this.$TableBody = bodyTBody;
			this.$DataTable = table;
			this.$HeaderTable = headerTable;
			this.$VerticalScrollBar = verticalBar;
			this.$HorizontalScrollBar = horizontalBar;
			// const oColumn = new Column({
			//   sId: this.oIdColumnsGenerator.next().value
			// });

		},

		getCellById: function(sId) {
			return this.mCellsById.get(sId);
		},

		getRowById: function(sId) {
			return this.mRowsById.get(sId);
		},

		getColumnById: function(sId) {
			return this.aColumns.find(oColumns => oColumns.getId() === sId);
		},

		getTdById: function(sId) {
			return this.getCellById(sId)?.getDomRef();
		},

		getTrById: function(sId) {
			return this.getRowById(sId)?.getDomRef();
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

		renderer: TableRenderer
	});
});