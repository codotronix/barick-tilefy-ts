"use strict"
class Tilefy {
    container: HTMLElement;
    containerWidth: number;
    tileOrder: Array<string>;
    tiles: Array<Tile>;                 // tiles = object of objects
    config: TileConfig;
    tileLookupArr: Array<string>;     //an array holding the id of tiles in sequence of their occurance in tiles array
    grids = {};
    gridsPerRow = 0;            //no of grids in a row
    page_Width_Class = 'xs';    // possible values = xs, sm, md, lg
    small_tile_size = 0;
    medium_tile_size = 0;
    big_tile_size = 0;
    clearSpaceDivPosition = 200;    //max vertical point (y px) where tile ends + clearSpaceDivPosition
    tileMovementAllowed = false;
    tileResizeAllowed = false;
    colorCodes = ["#632F00", "#B01E00", "#C1004F", "#4617B4", "#008287", "#199900", "#00C13F", "#FF2E12", "#FF1D77", "#AA40FF", "#1FAEFF", "#000", "#00A3A3", "#FE7C22"];

    constructor(config: any) {
        this.container = document.getElementById(config.containerID);
        this.containerWidth = this.container.offsetWidth;
        this.config = config;
        this.tiles = config.TD.tiles;
        this.tileOrder = config.TD.tileOrder;
        //console.log(this.container.offsetWidth);
        this.start();
    }

    start() {
        this.createTileLookupArray();
        this.calculateWidths();
        ////noBigTileInXS();
        this.makeGrids();
        this.mapTilesToGrid();
        this.drawTiles();
        this.wakeUpLive();
        //bindDragAndDrop();
        //enableTileResize();
    }


    /*
    * Create an array of tile ids in the same order as they occur in tiles array
    */
    createTileLookupArray() {
        this.tileLookupArr = [];
        for (let i in this.tiles) {
            this.tileLookupArr.push(this.tiles[i].id);
        }
    }


    /*
    * calculate height and width of the tiles depending on the tiles_container width
    */
    calculateWidths() {
        var scrollBarWidth = 20;                                    //17px for scrollbar
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
    }


    /*
    * makeGrids will make the grids i.e. divide the page into smallest squares
    */
    makeGrids() {
        //let's calculate total filling capacity in terms of smallest squares or grids
        var fillCapacity = 0;
        //let _this = this;

        for (let i in this.tiles) {
            if (this.tiles[i].size == "small") {
                fillCapacity += 1;
            } else if (this.tiles[i].size == "medium") {
                fillCapacity += 4;
            } else if (this.tiles[i].size == "rectangle") {
                fillCapacity += 8;
            } else if (this.tiles[i].size == "big") {
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
            let grid: Grid = {} as Grid;         // = {};
            grid.indX = gridX;
            grid.indY = gridY;
            grid.id = gridX + "x" + gridY;
            grid.occupiedBy = "none";
            grid.top = (gridY - 1) * this.small_tile_size;
            grid.left = (gridX - 1) * this.small_tile_size;
            grid.type = '';     //if any tile starts on it, then type=startGrid

            this.grids[grid.id] = grid;
        }

    }


    /*
    * this function will loop thru tiles, send each tile to placeTileOnGrid(tile) 
    * and will receive the starting grid id and will store that grid id on that tile object
    * We also calculate a clearSpaceDivPosition bottom all the tiles, since tiles are position absolute
    * there is nothing to push the browser scroll so that all the ttiles are visible
    *
    * Edit 1: send the tiles as per their order defined in tileOrder
    */
    mapTilesToGrid() {
        this.clearSpaceDivPosition = 0;
        let tileID: string = '';
        let gridId: string = '';
        let tile: Tile;
        let grid: Grid;
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
    }


    /*
    * This function will loop thru the grid in grids
    * looking for a vacant grid where it can place the tile
    * if the place is of q^2 size, it will also have to look more (q-1) cells on right
    * and (q-1) cells on right
    * once found, the tileId should be stored on all the applicable grids
    */
    placeTileOnGrid(tile: Tile) {
        //console.log('inside placeTileOnGrid with Tile ='); console.log(tile);
        let grid: Grid;
        for (var key in this.grids) {
            grid = this.grids[key];
            if (grid.occupiedBy == "none") {
                if (tile.size == "small") {
                    grid.occupiedBy = tile.id;
                    grid.type = 'startGrid';
                    //console.log(key + " is will hold " + tile.size + " tile id="+tile.id);
                    return (key);
                } else {
                    if (this.canItHoldTile(grid.id, tile.size)) {
                        this.markGridsOccupied(grid.id, tile.size, tile.id);
                        grid.type = 'startGrid';
                        return (key);
                    }
                }
            }
        }
    }


    /*
    * This function will take a gridId and examine
    * that grid can be an elligible starting grid for
    * a given tile size
    */
    canItHoldTile(gridId: string, tileSize: string) {
        var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
        var y = (tileSize == "big") ? 4 : 2;    // y is 4 for big, 2 for medium and rectangle

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
    }


    /*
    * this function will mark all the grids occupied
    * by a medium or big tile
    */
    markGridsOccupied(gridId, tileSize, tileId) {
        var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
        var y = (tileSize == "big") ? 4 : 2;    // y is 4 for big, 2 for medium and rectangle

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
    }


    /*
    * This function will make the Full HTML and put them in container on which tilefy was called
    */
    drawTiles() {
        var htm = '';
        //this.container.addClass('barick-tiles-container ' + this.page_Width_Class);
        this.container.className += " barick-tiles-container " + this.page_Width_Class;
        let tile: Tile;
        for (var i in this.tiles) {
            tile = this.tiles[i];

            htm += `
                    <div id="${tile.id}" class="tile ${tile.size}" style="top: ${tile.top}px; left: ${tile.left}px; height: ${tile.height}px; width: ${tile.width}px;" data-gridid="${tile.gridId}">
                        <a class="tileInnerContainer" target="${tile.linkTarget || '_blank'}" href="${tile.link || 'javascript:void(0)'}" style="background: ${tile.bgColor};">
                    `;


            if (tile.contentType == 'font') {
                htm += `<span class="fontIcon ${tile.icon}" style="font-size: ${tile.height / 2}px; margin-top: ${tile.height / 8}px;"></span>`;
            }
            else if (tile.contentType == 'live') {
                htm += '<div class="live">';

                if (tile.liveImgUrls != undefined) {
                    htm += `<img  class="fontImg" src="${tile.liveImgUrls[0]}" />`;
                }

                if (tile.liveTxts != undefined) {
                    htm += `<span class="liveTxt" style="color: ${tile.fontColor}"> ${tile.liveTxts[0]} </span>`;
                }

                htm += '</div>';
            }
            else if (tile.contentType == 'plugin') {
                htm += '<div class="plugin"></div>';
            }

            //add the tile name
            htm += `<label class="name">${tile.name}</label>`;

            //close the opening <a> and <div>
            htm += '</a></div>';
        }

        //add the clearSpaceDiv
        htm += `<div style="position:absolute; left: 10px; right: 10px; height: 60px; top: ${this.clearSpaceDivPosition}px;" ></div>`;

        //this.container.html(htm);
        this.container.innerHTML = htm;

        this.loadPlugins();
    }


    /*
    * Once drawTiles has finished preparing the DOM, it will call the loadPlugins
    */
    loadPlugins() {
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
    }


    /*
    * Wake the live tiles up
    */
    wakeUpLive() {
        let _this = this;
        let animationClasses = ["slideInDown", "slideInLeft", "slideInRight", "slideInUp", "rotateIn", "rollIn", "zoomIn"];

        let txtAnimations = ["fadeIn"];

        let allTiles = this.container.querySelectorAll(".tile");
        //let tileElement;
        for (let i = 0; i < allTiles.length; i++) {
            let tileElement = allTiles.item(i);

            ///if it has a div with class 'live'
            if (tileElement.querySelector('.live')) {
                (function () {
                    var tileId = tileElement.id;
                    var liveImgUrls = _this.tiles[_this.tileLookupArr.indexOf(tileId)].liveImgUrls;
                    var liveTxts = _this.tiles[_this.tileLookupArr.indexOf(tileId)].liveTxts;

                    //live img
                    if (liveImgUrls != undefined && liveImgUrls.length > 1) {
                        var imgIndx = 0;
                        var noOfImgs = liveImgUrls.length;
                        var animateClass = '';
                        var waitTime = 2500 + Math.round(Math.random() * (5000 / noOfImgs));

                        function nxtImg() {
                            if (!_this.tileMovementAllowed && !_this.tileResizeAllowed) {
                                imgIndx = (imgIndx + 1) % noOfImgs;
                                animateClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];

                                let fontImgEl = tileElement.querySelector('.fontImg') as HTMLImageElement;
                                fontImgEl.src = liveImgUrls[imgIndx];
                                fontImgEl.className = '';
                                fontImgEl.className = 'fontImg animated ' + animateClass;

                                //$('#' + tileId).find('.fontImg').attr('src', liveImgUrls[imgIndx]).removeClass().addClass('fontImg animated ' + animateClass);
                            }
                            setTimeout(nxtImg, waitTime);
                        }

                        nxtImg();
                    }

                    //live txt
                    if (liveTxts != undefined && liveTxts.length > 1) {
                        var txtIndx = 0;
                        var noOfTxts = liveTxts.length;
                        var animateClass = '';
                        var waitTime = 2500 + Math.round(Math.random() * (5000 / noOfTxts));

                        function nxtTxt() {
                            if (!_this.tileMovementAllowed && !_this.tileResizeAllowed) {
                                txtIndx = (txtIndx + 1) % noOfTxts;
                                animateClass = txtAnimations[Math.floor(Math.random() * txtAnimations.length)];

                                let txtEl = tileElement.querySelector('.liveTxt');
                                txtEl.textContent = liveTxts[txtIndx];
                                txtEl.className = '';
                                txtEl.className = 'liveTxt animated ' + animateClass;
                            }
                            setTimeout(nxtTxt, waitTime);
                        }

                        nxtTxt();
                    }

                })();

            }
        }
        





        
    }

} 