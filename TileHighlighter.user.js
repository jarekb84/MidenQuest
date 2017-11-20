// ==UserScript==
// @name         MidenQuest - Tile Highlighter
// @namespace    https://github.com/jarekb84/MidenQuest
// @version      1.1.3
// @description  Highlights inputted list of map tiles
// @updateURL    https://raw.githubusercontent.com/jarekb84/MidenQuest/master/TileHighlighter.user.js
// @author       jarekb84
// @include      http://www.midenquest.com/Game.aspx*
// @include      http://midenquest.com/Game.aspx*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(async function () {
  "use strict";

  var $ = jQuery.noConflict(true);
  var settings = {};

  function addContainer(vertical, horizontal) {
    $('#tileHighlighter').remove();
    var container = $("<div id='tileHighlighter' style='position: fixed; " + vertical + ":0; " + horizontal + ":0; background-color: white; padding: 5px; z-index:999; color: black;' />");

    addTileInput(container);
    addActions(container);
    addSettings(container);

    $("body").append(container);

    function addTileInput(container) {
      var textArea = $("<textarea id='tileHighlighter__tileData' rows='15' style='display: none;' />");

      container.append(textArea);
    }

    function addActions(container) {
      var actions = $('<div />');

      var addCoordinates = $("<button id='tileHighlighter__actions__addCoordinates'>Add Coordinates</button>");

      var hilightTilesButton = $("<button id='tileHighlighter__actions__highlightTiles' style='display: none;' >Highlight Tiles</button>");

      var openSettingsAction = $('<span id="tileHighlighter__actions__toggleSettings" alt="Open Settings" style="cursor: pointer;" /> ')
      var gearIcon = $('<img style="display: inline-block; margin: 0 0 -4px 10px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEWSURBVDhPldPBSkJBFMbxW1bQpkXtfAtdBIII0RsEEqQLkZ6gwI1L8QVaCIJLe4patQislvoOQbqonYHV/7t47DhTih/84N4zd+5cz4zJihyijDPsqrBpqvieO1ZhXbJ4xiW20IG94AoZNHGHA0R5gE14c9fm1V33EaUGP+E/M5wgyjb8yl94wcjV5BFLOYIa5n+zJqv7lmvYmL6ghXPsI7mADRo100dNHSN8roj0TeHAED47+ED4XAHpIdE+N+AH9dlaWZNv5jWZQg3PQ+OLaJ/D7ZvgPag94c/okPgHV6kgyj00qC5rFe2ETfjEwN33EEXH8xZ2SNqwCXUViP5cXeyld2vidyenwqbRITlFCUvd/k2S/ADy43SMe6/AOAAAAABJRU5ErkJggg==">')
      openSettingsAction.append(gearIcon);

      actions.append(addCoordinates);
      actions.append(hilightTilesButton);
      actions.append(openSettingsAction);

      container.append(actions);
    }

    function addSettings(container) {

      var settingsPanel = $('<div id="tileHighlighter__settings__panel" style="display: none; height: 100px;" />');
      var horizontalSettings = $('<div style="margin: 5px 0;"><div>Horizontal Position</div></div>');
      var left = $('<input type="radio" name="horizontal" value="left"><label>Left</label>');
      left.prop('checked', settings.horizontal === 'left')
      var right = $('<input type="radio" name="horizontal" value="right"><label>Right</label>');
      right.prop('checked', settings.horizontal === 'right')
      horizontalSettings.append(left)
      horizontalSettings.append(right)
      settingsPanel.append(horizontalSettings);

      var verticalSettings = $('<div style="margin: 5px 0;"><div>Vertical Position</div></div>');
      var top = $('<input type="radio" name="vertical" value="top"><label>Top</label>');
      top.prop('checked', settings.vertical === 'top');
      
      var bottom = $('<input type="radio" name="vertical" value="bottom"><label>Bottom</label>');
      bottom.prop('checked', settings.vertical === 'bottom');
      
      verticalSettings.append(top);
      verticalSettings.append(bottom);
      settingsPanel.append(verticalSettings);

      var save = $("<button id='tileHighlighter__settings__save'>Save</button>");
      settingsPanel.append(save);
      container.append(settingsPanel);
    }
  }

  function highlightTiles() {
    var tiles = $("#tileHighlighter__tileData").val().split(/\r|\n/);
    var styles = "";

    $.each(tiles, function (index, value) {
      var tileId = "g#x" + value.replace(" ", "").replace(",", "y");

      styles += tileId + " text:first-of-type tspan {fill: pink} ";
    });

    addGlobalStyle(styles);
  }

  function addGlobalStyle(css) {
    var tileHighlighterStyles = $("#tileHighlighterStyles");

    if (tileHighlighterStyles.length === 0) {
      tileHighlighterStyles = $('<style type="text/css" id="tileHighlighterStyles" />');

      $("head").append(tileHighlighterStyles);
    }

    tileHighlighterStyles.html(css);
  }

  function attachEventHandlers() {
    $("#tileHighlighter__actions__highlightTiles").click(function () {
      highlightTiles();
      $('#tileHighlighter__actions__highlightTiles').hide();
      $('#tileHighlighter__actions__addCoordinates').show();
      $('#tileHighlighter__tileData').slideUp(200);
    });

    $('#tileHighlighter__actions__addCoordinates').click(function () {
      $('#tileHighlighter__actions__highlightTiles').show();
      $('#tileHighlighter__actions__addCoordinates').hide();
      $('#tileHighlighter__tileData').slideDown(200);
    })

    $('#tileHighlighter__actions__toggleSettings').click(function () {
      $('#tileHighlighter__settings__panel').slideToggle(200);
    });

    $('#tileHighlighter__settings__save').click(function () {
      var vertical = $('input[name=vertical]:checked').val();
      var horizontal = $('input[name=horizontal]:checked').val();
    
      GM.setValue('settings.vertical', vertical);
      GM.setValue('settings.horizontal', horizontal);
      
      settings.vertical = vertical;
      settings.horizontal = horizontal;
      
      addContainer(vertical, horizontal);
      attachEventHandlers();
    })
  }

  settings.vertical = await GM.getValue('settings.vertical', 'top');
  settings.horizontal = await GM.getValue('settings.horizontal', 'left');
  
  addContainer(settings.vertical, settings.horizontal);
  attachEventHandlers();
})();