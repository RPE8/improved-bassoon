sap.ui.define([
  "sap/ui/core/Control",
  "./TableRenderer"
], function (Control, TableRenderer) {
  return Control.extend("Table", {
    init: function () {
      console.info("init");
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
          const iRow = +target.getAttribute("data-row");
          const iColumn = +target.getAttribute("data-column");

          const iDataRow = this.oDataRowToTableRow[iRow];
          const sValue = String(this.aData[iDataRow][iColumn]);

          if (target.innerHTML !== sValue) {
            target.innerHTML = sValue;
          }
        });
      });
      this.aTds = [];
      this.aTrs = [];
      this.aData = this.createData();
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
            const aRowTds = this.aTds[i];


            const iLength = aRowTds.length;
            for (let j = 0; j < iLength; j++) {
              if (iLastTdIndex === null) {
                if (this.iTableBodyScrollContainerWidth < iBorderWidth) {
                  iLastTdIndex = j;
                  break;
                }

                iBorderWidth += +aRowTds[j].getAttribute("width");
              } else if (iLastTdIndex === j) {
                break;
              }

              const iRow = +aRowTds[j].getAttribute("data-row");
              const iColumn = +aRowTds[j].getAttribute("data-column");

              const iDataRow = this.oDataRowToTableRow[iRow];
              const sValue = this.aData[iDataRow][iColumn];

              aRowTds[j].innerHTML = sValue;
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
            const aRowTds = this.aTds[i];

            const iLength = aRowTds.length;
            for (let j = 0; j < iLength; j++) {
              if (iLastTdIndex === null) {
                if (this.iTableBodyScrollContainerWidth < iBorderWidth) {
                  iLastTdIndex = j;
                  break;
                }

                iBorderWidth += +aRowTds[j].getAttribute("width");
              } else if (iLastTdIndex === j) {
                break;
              }

              const iRow = +aRowTds[j].getAttribute("data-row");
              const iColumn = +aRowTds[j].getAttribute("data-column");

              const iDataRow = this.oDataRowToTableRow[iRow];
              const sValue = this.aData[iDataRow][iColumn];
              // console.log(aRowTds[j].clientWidth);
              aRowTds[j].innerHTML = sValue;
            }
            console.timeEnd("row");
          }
        }
      };



      // aTds

      const { aTds, aTrs, $TableBodyScrollContainer } = TableRenderer.renderTable(this, this.oIntersectionObserver, {
        onWheel: onWheelHandler
      });

      for (let i = 0; i < this.iVisibleRowsCount; i++) {
        this.oDataRowToTableRow[i] = i;
      }

      this.$TableBodyScrollContainer = $TableBodyScrollContainer;
      this.iTableBodyScrollContainerWidth = $TableBodyScrollContainer.clientWidth;
      this.aTds = aTds;
      this.aTrs = aTrs;
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