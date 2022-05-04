sap.ui.define([
  "sap/ui/core/Control",
  "./TableRenderer"
], function (Control, TableRenderer) {
  return Control.extend("Table", {
    init: function () {
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
      this.oIdGenerator = (function* idMaker() {
        let index = 0;
        while (true)
          yield `Table1-${index++}`;
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

    createTable() {
      const onWheelHandler = (oEvent) => {
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
      };

      const { aRows, mTdsById, $TableBodyScrollContainer, mHeaderTdsById, aHeaderRows } = TableRenderer.renderTable({
        oContext: this,
        oIntObserver: this.oIntersectionObserver,
        oIdGenerator: this.oIdGenerator,
        onWheel: onWheelHandler
      });

      for (let i = 0; i < this.iVisibleRowsCount; i++) {
        this.oDataRowToTableRow[i] = i;
      }

      this.$TableBodyScrollContainer = $TableBodyScrollContainer;
      this.iTableBodyScrollContainerWidth = $TableBodyScrollContainer.clientWidth;
      this.aRows = aRows;
      this.mTdsById = mTdsById;
      console.log(this.mTdsById)
      console.log(this.aRows)
      console.log(this.oIdGenerator.next().value)
      console.log(this.oIdGenerator.next().value)

    },

    isInViewport: (el) => {
      const rect = el.getBoundingClientRect();
      return rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      // return (
      //   rect.top >= 0 &&
      //   rect.left >= 0 &&
      //   rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&

      // );
    },

    renderer: TableRenderer
  });
});