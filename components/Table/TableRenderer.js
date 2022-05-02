
sap.ui.define(["sap/ui/core/Renderer"],
  function (Renderer) {
    "use strict";

    const oRenderer = {};

    oRenderer.render = (rm, oControl) => {
      rm.write("<div id='TABLE'></div>");
    };

    oRenderer.renderTable = (oControl, oObserver, {
      onWheel
    }) => {
      const $TableContainer = document.getElementById("TABLE");

      const $TableHeaderContainer = document.createElement('div');
      $TableHeaderContainer.className = "tableHeaderWrapper";
      const $TableHeader = document.createElement('table');
      $TableHeader.className = "tableHeader";

      const $TableBodyContainer = document.createElement('div');
      $TableBodyContainer.className = "tableBodyWrapper";
      const $TableBodyScrollContainer = document.createElement('div');
      $TableBodyScrollContainer.className = "tableBodyScrollWrapper";
      const $VerticalScrollDiv = document.createElement('div');
      $VerticalScrollDiv.className = "scroll verticalScroll";
      const $VerticalScrollBar = document.createElement('div');
      $VerticalScrollBar.className = "scrollBar verticalScrollBar";
      const $HorizontalScrollDiv = document.createElement('div');
      $HorizontalScrollDiv.className = "scroll horizontalScroll";
      const $HorizontalScrollBar = document.createElement('div');
      $HorizontalScrollBar.className = "scrollBar horizontalScrollBar";
      const $TableBody = document.createElement('table');
      $TableBody.className = "tableBody";
      const $TBody = document.createElement('tbody');

      const iHeaders = oControl.getHeaderRowsCount();
      const iColumns = oControl.getColumnsCount();

      for (let i = 0; i < iHeaders; i++) {
        const tr = document.createElement('tr');

        for (let j = 0; j < iColumns; j++) {
          const td = document.createElement('td');
          td.innerHTML = `${i}:${j}`
          tr.appendChild(td);
        }
        $TableHeader.appendChild(tr);
      };

      const aTrs = [];
      const aTds = [];
      const aTableData = oControl.getData();
      const iRows = oControl.getVisibleRows();
      for (let i = 0; i < iRows; i++) {
        const aData = aTableData[i];
        const tr = document.createElement('tr');
        tr.setAttribute("data-row", i);
        const aRow = [];
        aData.forEach((sData, j) => {
          const td = document.createElement('td');
          td.setAttribute("data-row", i);
          td.setAttribute("width", 42);
          td.setAttribute("data-column", j);
          oObserver.observe(td);
          // td.innerHTML = `<input style='width:${20}px;' value='HEADER ${sData}'>`;
          tr.appendChild(td);
          aRow.push(td);
        });
        aTds.push(aRow);
        aTrs.push(tr);
        $TBody.appendChild(tr);
      }

      $TableBody.appendChild($TBody);


      $TableHeaderContainer.appendChild($TableHeader);
      $TableContainer.appendChild($TableHeaderContainer);

      $TableBodyScrollContainer.appendChild($TableBody);
      $VerticalScrollDiv.appendChild($VerticalScrollBar);
      $HorizontalScrollDiv.appendChild($HorizontalScrollBar);
      $TableBodyScrollContainer.appendChild($VerticalScrollDiv);
      $TableBodyScrollContainer.appendChild($HorizontalScrollDiv);
      $TableBodyContainer.appendChild($TableBodyScrollContainer);


      $TableContainer.appendChild($TableBodyContainer);
      $TableContainer.onwheel = onWheel

      return {
        $TBody: $TBody,
        $TableBodyScrollContainer,
        aTrs,
        aTds
      }
    }

    return oRenderer;
  });