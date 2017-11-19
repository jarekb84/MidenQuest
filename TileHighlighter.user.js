// ==UserScript==
// @name         MidenQuest - Tile Highlighter
// @namespace    https://github.com/jarekb84/MidenQuest
// @version      1.0.4
// @description  Highlights inputted list of map tiles
// @updateURL    https://raw.githubusercontent.com/jarekb84/MidenQuest/master/TileHighlighter.user.js
// @author       jarekb84
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at       document-idle
// ==/UserScript==

(function() {
  "use strict";
  
  var $ = jQuery.noConflict(true);

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
    var styles = "";

    $.each(tiles, function(index, value) {
      var tileId = "g#x" + value.replace(" ", "").replace(",", "y");

      styles += tileId + " text:first-of-type tspan {fill: pink} ";
    });

    addGlobalStyle(styles);
  }

  function addGlobalStyle(css) {
    var tileHighlighterStyles = $("#tileHighlighterStyles");

    if (tileHighlighterStyles.length === 0) {
      tileHighlighterStyles = $(
        '<style type="text/css" id="tileHighlighterStyles" />'
      );

      $("head").append(tileHighlighterStyles);
    }

    tileHighlighterStyles.html(css);
  }

  addContainer();

  $("#tileHighlighter__process").click(highlightTiles);
})();
