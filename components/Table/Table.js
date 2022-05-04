sap.ui.define([
  "sap/ui/core/Control",
  "./TableRenderer",
  "./Column"
], function (Control, TableRenderer, Column) {
  return Control.extend("Table", {
    init: function () {
      this.aColumns = [];
      this.iRows = 70;
      this.iColumns = 400;
      this.iColumnHeaderRows = 5;
      // this.oDataMap = new Map();
      this.iVisibleRowsCount = 30;
      this.iCurrentFirstRow = 0;
      this.iCurrentLastRow = this.iVisibleRowsCount - 1;
      this.oDataRowToTableRow = {};
      this.oIntersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          const sId = target.getAttribute("id");
          const oCell = this.mTdsById.get(sId);
          const iRow = oCell.getRow();
          const iColumn = oCell.getColumn();
          const iDataRow = this.oDataRowToTableRow[iRow];
          const sValue = String(this.aData[iDataRow][iColumn]);

          if (oCell.getDisplayedValue() !== sValue) {
            oCell.setDisplayedValue(sValue, true);
          }
        });
      });
      this.aRows = [];
      this.mTdsById = new Map();

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

        aData.push(aRow);
      }

      return aData;
    },

    getData() {
      return this.aData;
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

        let iBorderWidth = 0;
        let iLastTdIndex = null;

        for (let i = 0; i < this.iVisibleRowsCount; i++) {
          const aRowTds = this.aRows[i];


          const iLength = aRowTds.length;
          for (let j = 0; j < iLength; j++) {
            const oTd = aRowTds[j];

            if (iLastTdIndex === null) {
              if (this.iTableBodyScrollContainerWidth < iBorderWidth) {
                iLastTdIndex = j;
                break;
              }

              iBorderWidth += oTd.getWidth();
            } else if (iLastTdIndex === j) {
              break;
            }

            const iRow = oTd.getRow();
            const iColumn = oTd.getColumn();

            const iDataRow = this.oDataRowToTableRow[iRow];
            const sValue = this.aData[iDataRow][iColumn];

            if (oTd.getDisplayedValue() !== sValue) {
              oTd.setDisplayedValue(sValue, true);
            }
          }
        }
      } else if (oEvent.deltaY > 0) {
        if (this.iCurrentLastRow >= this.aData.length - 1) {
          return;
        }

        this.iCurrentFirstRow++;
        this.iCurrentLastRow++;

        for (let sRowId in Object.keys(this.oDataRowToTableRow)) {
          this.oDataRowToTableRow[sRowId] = this.oDataRowToTableRow[sRowId] + 1;
        }



        let iBorderWidth = 0;
        let iLastTdIndex = null;
        for (let i = 0; i < this.iVisibleRowsCount; i++) {
          console.time("row");
          const aRowTds = this.aRows[i];

          const iLength = aRowTds.length;
          for (let j = 0; j < iLength; j++) {
            const oTd = aRowTds[j];

            if (iLastTdIndex === null) {
              if (this.iTableBodyScrollContainerWidth < iBorderWidth) {
                iLastTdIndex = j;
                break;
              }

              iBorderWidth += oTd.getWidth();
            } else if (iLastTdIndex === j) {
              break;
            }

            const iRow = oTd.getRow();
            const iColumn = oTd.getColumn();

            const iDataRow = this.oDataRowToTableRow[iRow];
            const sValue = this.aData[iDataRow][iColumn];

            if (oTd.getDisplayedValue() !== sValue) {
              oTd.setDisplayedValue(sValue, true);
            }
          }
          console.timeEnd("row");
        }
      }
    },

    populateTableWithData: function () {

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
      const aData = this.aData;
      const iColumns = this.iColumns;
      const iVisibleRows = this.iVisibleRowsCount;


    },

    createTable() {
      const onWheelHandler = (oEvent) => {
        this.onWheelHandler(oEvent);
      };

      const { bodyTBody, headerTBody, bodyScrollContainer } = TableRenderer.renderTable({
        oContext: this
      });

      this.$TableBodyScrollContainer = bodyScrollContainer;
      this.$TableHeaderBody = headerTBody;
      this.$TableBody = bodyTBody;

      const oColumn = new Column({
        sId: this.oIdColumnsGenerator.next().value
      });

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