// ==UserScript==
// @name         MidenQuest - Tile Highlighter
// @namespace    https://github.com/jarekb84/MidenQuest
// @version      1.0.2
// @description  Highlights inputted list of map tiles
// @updateURL    https://raw.githubusercontent.com/jarekb84/MidenQuest/master/TileHighlighter.user.js
// @author       jarekb84
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @run-at       document-idle
// ==/UserScript==

(function() {
  "use strict";

  function addContainer() {
    var container = $(
      "<div id='tileHighlighter' style='position: fixed; top:0; background-color: white; padding: 5px' />"
    );
    var textArea = $("<textarea id='tileHighlighter__tileData' rows='15' />");

    container.append(textArea);

    var hilightTilesButton = $(
      "<div><button id='tileHighlighter__process'>Highlight Tiles</button></div>"
    );

    container.append(hilightTilesButton);

    $("body").append(container);
  }

  function highlightTiles() {
    var tiles = $("#tileHighlighter__tileData")
      .val()
      .split(/\r|\n/);
    $.each(tiles, function(index, value) {
      var tileId = "#x" + value.replace(" ", "").replace(",", "y");

      var tileElement = $(tileId + " text tspan");

      if (tileElement.length) {
        tileElement[0].style["fill"] = "pink";
      }
    });
  }

  function delayedHighlight() {
    setTimeout(highlightTiles, 400);
  }

  addContainer();

  $("#tileHighlighter__process").click(highlightTiles);

  $("body").on("click", "#MapZoomIn", delayedHighlight);
  $("body").on("click", "#MapZoomOut", delayedHighlight);
  $("body").on("click", "#map", delayedHighlight);
})();
