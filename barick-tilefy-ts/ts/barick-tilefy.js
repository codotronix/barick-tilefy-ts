"use strict";
var Tilefy = (function () {
    function Tilefy(config) {
        this.grids = {};
        this.gridsPerRow = 0; //no of grids in a row
        this.page_Width_Class = 'xs'; // possible values = xs, sm, md, lg
        this.small_tile_size = 0;
        this.medium_tile_size = 0;
        this.big_tile_size = 0;
        this.clearSpaceDivPosition = 200; //max vertical point (y px) where tile ends + clearSpaceDivPosition
        this.tileMovementAllowed = false;
        this.tileResizeAllowed = false;
        this.colorCodes = ["#632F00", "#B01E00", "#C1004F", "#4617B4", "#008287", "#199900", "#00C13F", "#FF2E12", "#FF1D77", "#AA40FF", "#1FAEFF", "#000", "#00A3A3", "#FE7C22"];
        this.container = document.getElementById(config.containerID);
        this.containerWidth = this.container.offsetWidth;
        this.config = config;
        this.tiles = config.TD.tiles;
        this.tileOrder = config.TD.tileOrder;
        //console.log(this.container.offsetWidth);
        this.start();
    }
    Tilefy.prototype.start = function () {
        this.createTileLookupArray();
        this.calculateWidths();
        ////noBigTileInXS();
        this.makeGrids();
        this.mapTilesToGrid();
        this.drawTiles();
        //this.setStyles();
        //wakeUpLive();
        //bindDragAndDrop();
        //enableTileResize();
    };
    /*
    * Create an array of tile ids in the same order as they occur in tiles array
    */
    Tilefy.prototype.createTileLookupArray = function () {
        this.tileLookupArr = [];
        for (var i in this.tiles) {
            this.tileLookupArr.push(this.tiles[i].id);
        }
    };
    /*
    * calculate height and width of the tiles depending on the tiles_container width
    */
    Tilefy.prototype.calculateWidths = function () {
        var scrollBarWidth = 20; //17px for scrollbar
        //var tiles_Container_width = $('.tiles-container').width() - scrollBarWidth;
        var tiles_Container_width = this.containerWidth - scrollBarWidth;
        this.page_Width_Class = 'xs';
        var all_Possible_Width_Classes = 'xs sm md lg';
        this.gridsPerRow = this.config.gridCapacityPerRow || 12;
        this.small_tile_size = Math.floor(tiles_Container_width / this.gridsPerRow);
        if (tiles_Container_width >= 1200) {
            this.page_Width_Class = 'lg';
            this.gridsPerRow = this.config.gridCapacityPerRow || 16;
            this.small_tile_size = Math.floor(tiles_Container_width / this.gridsPerRow);
        }
        else if (tiles_Container_width >= 992) {
            this.page_Width_Class = 'md';
            this.gridsPerRow = this.config.gridCapacityPerRow || 12;
        }
        else if (tiles_Container_width >= 768) {
            this.page_Width_Class = 'sm';
            this.gridsPerRow = this.config.gridCapacityPerRow || 12;
        }
        else {
            this.page_Width_Class = 'xs';
            this.gridsPerRow = this.config.gridCapacityPerRow || 4;
            this.small_tile_size = Math.floor((tiles_Container_width + scrollBarWidth) / this.gridsPerRow);
        }
        this.medium_tile_size = this.small_tile_size * 2;
        this.big_tile_size = this.small_tile_size * 4;
    };
    /*
    * makeGrids will make the grids i.e. divide the page into smallest squares
    */
    Tilefy.prototype.makeGrids = function () {
        //let's calculate total filling capacity in terms of smallest squares or grids
        var fillCapacity = 0;
        //let _this = this;
        for (var i_1 in this.tiles) {
            if (this.tiles[i_1].size == "small") {
                fillCapacity += 1;
            }
            else if (this.tiles[i_1].size == "medium") {
                fillCapacity += 4;
            }
            else if (this.tiles[i_1].size == "rectangle") {
                fillCapacity += 8;
            }
            else if (this.tiles[i_1].size == "big") {
                fillCapacity += 16;
            }
        }
        //let's make total no grids be multiple gridsPerRow
        //Doubling the grids
        var totalGrids = this.gridsPerRow * Math.ceil(fillCapacity / this.gridsPerRow) * 2;
        //Let's make the grids
        this.grids = {};
        var gridX = 0;
        var gridY = 1;
        for (var i = 1; i <= totalGrids; i++) {
            gridX++;
            if (gridX > this.gridsPerRow) {
                gridX = 1;
                gridY++;
            }
            //if any tile starts on it, then type=startGrid
            var grid = {}; // = {};
            grid.indX = gridX;
            grid.indY = gridY;
            grid.id = gridX + "x" + gridY;
            grid.occupiedBy = "none";
            grid.top = (gridY - 1) * this.small_tile_size;
            grid.left = (gridX - 1) * this.small_tile_size;
            grid.type = ''; //if any tile starts on it, then type=startGrid
            this.grids[grid.id] = grid;
        }
    };
    /*
    * this function will loop thru tiles, send each tile to placeTileOnGrid(tile)
    * and will receive the starting grid id and will store that grid id on that tile object
    * We also calculate a clearSpaceDivPosition bottom all the tiles, since tiles are position absolute
    * there is nothing to push the browser scroll so that all the ttiles are visible
    *
    * Edit 1: send the tiles as per their order defined in tileOrder
    */
    Tilefy.prototype.mapTilesToGrid = function () {
        this.clearSpaceDivPosition = 0;
        var tileID = '';
        var gridId = '';
        var tile;
        var grid;
        for (var j in this.tileOrder) {
            //console.log("sending for tile id="+tiles[i].id);
            tileID = this.tileOrder[j];
            tile = this.tiles[this.tileLookupArr.indexOf(tileID)];
            gridId = this.placeTileOnGrid(tile);
            tile.gridId = gridId;
            grid = this.grids[gridId];
            tile.width = (tile.size == "small") ? this.small_tile_size : ((tile.size == "medium") ? this.medium_tile_size : this.big_tile_size);
            tile.height = (tile.size == "small") ? this.small_tile_size : ((tile.size == "big") ? this.big_tile_size : this.medium_tile_size);
            tile.bgColor = tile.bgColor || this.colorCodes[Math.floor(Math.random() * this.colorCodes.length)];
            tile.top = grid.top;
            tile.left = grid.left;
            //console.log('top='+tiles[tileID].top+" ... height="+tiles[tileID].height+" total="+(tiles[tileID].top+tiles[tileID].height));
            this.clearSpaceDivPosition = ((tile.top + tile.height) > this.clearSpaceDivPosition) ? (tile.top + tile.height) : this.clearSpaceDivPosition;
        }
        //config.TD.clearSpaceDivPosition = clearSpaceDivPosition;
    };
    /*
    * This function will loop thru the grid in grids
    * looking for a vacant grid where it can place the tile
    * if the place is of q^2 size, it will also have to look more (q-1) cells on right
    * and (q-1) cells on right
    * once found, the tileId should be stored on all the applicable grids
    */
    Tilefy.prototype.placeTileOnGrid = function (tile) {
        //console.log('inside placeTileOnGrid with Tile ='); console.log(tile);
        var grid;
        for (var key in this.grids) {
            grid = this.grids[key];
            if (grid.occupiedBy == "none") {
                if (tile.size == "small") {
                    grid.occupiedBy = tile.id;
                    grid.type = 'startGrid';
                    //console.log(key + " is will hold " + tile.size + " tile id="+tile.id);
                    return (key);
                }
                else {
                    if (this.canItHoldTile(grid.id, tile.size)) {
                        this.markGridsOccupied(grid.id, tile.size, tile.id);
                        grid.type = 'startGrid';
                        return (key);
                    }
                }
            }
        }
        //console.log('No Grid Avaialble for Tile id=' + tile.id);
    };
    /*
    * This function will take a gridId and examine
    * that grid can be an elligible starting grid for
    * a given tile size
    */
    Tilefy.prototype.canItHoldTile = function (gridId, tileSize) {
        var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
        var y = (tileSize == "big") ? 4 : 2; // y is 4 for big, 2 for medium and rectangle
        var startX = this.grids[gridId].indX;
        var startY = this.grids[gridId].indY;
        var uptoX = startX + (x - 1);
        var uptoY = startY + (y - 1);
        var key = '';
        var innerLoopFailed = false;
        for (var i = startX; i <= uptoX; i++) {
            for (var j = startY; j <= uptoY; j++) {
                key = i + "x" + j;
                if (this.grids[key] == undefined || typeof (this.grids[key]) == undefined || this.grids[key].occupiedBy != "none") {
                    innerLoopFailed = true;
                    break;
                }
            }
            if (innerLoopFailed) {
                break;
            }
        }
        return !innerLoopFailed;
    };
    /*
    * this function will mark all the grids occupied
    * by a medium or big tile
    */
    Tilefy.prototype.markGridsOccupied = function (gridId, tileSize, tileId) {
        var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
        var y = (tileSize == "big") ? 4 : 2; // y is 4 for big, 2 for medium and rectangle
        var startX = this.grids[gridId].indX;
        var startY = this.grids[gridId].indY;
        var uptoX = startX + (x - 1);
        var uptoY = startY + (y - 1);
        var key = '';
        for (var i = startX; i <= uptoX; i++) {
            for (var j = startY; j <= uptoY; j++) {
                key = i + "x" + j;
                this.grids[key].occupiedBy = tileId;
            }
        }
    };
    /*
    * This function will make the Full HTML and put them in container on which tilefy was called
    */
    Tilefy.prototype.drawTiles = function () {
        var htm = '';
        //this.container.addClass('barick-tiles-container ' + this.page_Width_Class);
        this.container.className += " barick-tiles-container " + this.page_Width_Class;
        var tile;
        for (var i in this.tiles) {
            tile = this.tiles[i];
            htm += "\n                    <div id=\"" + tile.id + "\" class=\"tile " + tile.size + "\" style=\"top: " + tile.top + "px; left: " + tile.left + "px; height: " + tile.height + "px; width: " + tile.width + "px;\" data-gridid=\"" + tile.gridId + "\">\n                        <a class=\"tileInnerContainer\" target=\"" + (tile.linkTarget || '_blank') + "\" href=\"" + (tile.link || 'javascript:void(0)') + "\" style=\"background: " + tile.bgColor + ";\">\n                    ";
            if (tile.contentType == 'font') {
                htm += "<span class=\"fontIcon " + tile.icon + "\" style=\"font-size: " + tile.height / 2 + "px; margin-top: " + tile.height / 8 + "px;\"></span>";
            }
            else if (tile.contentType == 'live') {
                htm += '<div class="live">';
                if (tile.liveImgUrls != undefined) {
                    htm += "<img  class=\"fontImg\" src=\"" + tile.liveImgUrls[0] + "\" />";
                }
                if (tile.liveTxts != undefined) {
                    htm += "<span class=\"liveTxt\" style=\"color: " + tile.fontColor + "\"> " + tile.liveTxts[0] + " </span>";
                }
                htm += '</div>';
            }
            else if (tile.contentType == 'plugin') {
                htm += '<div class="plugin"></div>';
            }
            //add the tile name
            htm += "<label class=\"name\">" + tile.name + "</label>";
            //close the opening <a> and <div>
            htm += '</a></div>';
        }
        //add the clearSpaceDiv
        htm += "<div style=\"position:absolute; left: 10px; right: 10px; height: 60px; top: " + this.clearSpaceDivPosition + "px;\" ></div>";
        //this.container.html(htm);
        this.container.innerHTML = htm;
        this.loadPlugins();
    };
    /*
    * Once drawTiles has finished preparing the DOM, it will call the loadPlugins
    */
    Tilefy.prototype.loadPlugins = function () {
        //console.log('inside loadPlugins');
        for (var i in this.tiles) {
            if (this.tiles[i].contentType == 'plugin') {
                //                        console.log('outside timeout callback '+pathToPlugin);
                //                        setTimeout(function(){
                //                            console.log('inside timeout callback '+pathToPlugin);
                //tile_plugins[tiles[i].id] = tile_plugins[tiles[i].id] || {};
                //if the plugin initFunc is available eval it, or load it
                //if (tile_plugins[tiles[i].id].initFunc) {
                //    eval(tile_plugins[tiles[i].id].initFunc);
                //} else {
                //    fetchPlugin(tiles[i].id);
                //}
                //                        }, 100);
                console.log('logic to load plugin is pending');
            }
        }
    };
    /*
            * Once the DOM for tile is ready, this function will set the styles
            */
    Tilefy.prototype.setStyles = function () {
        //set Tile Sizes
        //$('.tile.small').css({
        //    "width": small_tile_size,
        //    "height": small_tile_size
        //});
        //let smallTiles = this.container.getElementsByClassName("tile small");
        //for (let i = 0; i < smallTiles.length; i++) {
        //    (<HTMLElement>smallTiles.item(i)).style.width = this.small_tile_size + 'px';
        //    (<HTMLElement>smallTiles.item(i)).style.height = this.small_tile_size + 'px';
        //}
        //let mediumTiles = this.container.getElementsByClassName("tile medium");
        //for (let i = 0; i < mediumTiles.length; i++) {
        //    (<HTMLElement>mediumTiles.item(i)).style.width = this.medium_tile_size + 'px';
        //    (<HTMLElement>mediumTiles.item(i)).style.height = this.medium_tile_size + 'px';
        //}
        //let bigTiles = this.container.getElementsByClassName("tile big");
        //for (let i = 0; i < bigTiles.length; i++) {
        //    (<HTMLElement>bigTiles.item(i)).style.width = this.big_tile_size + 'px';
        //    (<HTMLElement>bigTiles.item(i)).style.height = this.big_tile_size + 'px';
        //}
        //let recTiles = this.container.getElementsByClassName("tile rectangle");
        //for (let i = 0; i < recTiles.length; i++) {
        //    (<HTMLElement>recTiles.item(i)).style.width = this.big_tile_size + 'px';
        //    (<HTMLElement>recTiles.item(i)).style.height = this.medium_tile_size + 'px';
        //}
        //Set fontIcon sizes
        //let fontTiles = this.container.getElementsByClassName("tile fontIcon");
        //$('.tile.medium').css({
        //    "width": medium_tile_size,
        //    "height": medium_tile_size
        //});
        //$('.tile.big').css({
        //    "width": big_tile_size,
        //    "height": big_tile_size
        //});
        //$('.tile.rectangle').css({
        //    "width": big_tile_size,
        //    "height": medium_tile_size
        //});
        //Set fontIcon sizes
        //$('.tile .fontIcon').each(function () {
        //    var ht = $(this).closest('.tile').height();
        //    $(this).css({
        //        "font-size": (ht / 2) + 'px',
        //        "margin-top": (ht / 8) + 'px'
        //    });
        //});
    };
    return Tilefy;
}());
//# sourceMappingURL=barick-tilefy.js.map