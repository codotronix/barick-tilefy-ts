//enum TileSize { small, medium, big, rectangle }
//enum ContentType { font, live, plugin }

interface Tile {
    id: string;
    name: string;
    size: string;
    contentType: string;
    icon?: string;
    fontColor?: string;
    liveTxts?: Array<string>;
    liveImgUrls?: Array<string>;
    bgColor?: string;
    link?: string;
    linkTarget?: string;
    gridId?: string;
    width?: number;
    height?: number;
    top?: number;
    left?: number;
}

interface Grid {
    id: string;
    indX: number;
    indY: number;
    occupiedBy: string;
    top: number;
    left: number;
    type: string;
}


interface TileConfig {
    containerID: string;
    TD: TileDescriptor;
    btn_ID_to_Toggle_Tile_Movement?: string;
    btn_ID_to_Toggle_Tile_Resize?: string;
    gridCapacityPerRow?: number;
}

interface TileDescriptor {
    tileOrder: Array<string>;
    tiles: any;
}