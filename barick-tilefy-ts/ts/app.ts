﻿//class Greeter {
//    element: HTMLElement;
//    span: HTMLElement;
//    timerToken: number;

//    constructor(element: HTMLElement) {
//        this.element = element;
//        this.element.innerHTML += "The time is: ";
//        this.span = document.createElement('span');
//        this.element.appendChild(this.span);
//        this.span.innerText = new Date().toUTCString();
//    }

//    start() {
//        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
//    }

//    stop() {
//        clearTimeout(this.timerToken);
//    }

//}

window.onload = () => {
    //var el = document.getElementById('content');
    //var greeter = new Greeter(el);
    //greeter.start();

    let config = {
        "containerID": "tilesContainer",
        "TD": TD,
        "btn_ID_to_Toggle_Tile_Movement": "btn_toggleTileDnD",
        "btn_ID_to_Toggle_Tile_Resize": "btn_toggleTileResize"
    };

    var tfy = new Tilefy(config);
};

var TD =
    {
        "tileOrder":
        ["linkedIn", "stackoverflow", "galaxy", "tileOfTime", "weatherNow", "myPictures", "barickTilefy", "asteroidattack", "miniPuzzle", "facebook", "twitter", "codotronixBlog", "oneMall", "offersplus", "tankgular", "gogoltugo", "myBlog", "github", "bengalirecipes", "reactTaskMan", "txtTile"],

        "tiles":
        [
            {
                "id": "galaxy",
                "name": "Galaxy Website",
                "size": "medium",
                "contentType": "live",
                "liveImgUrls": ["img/galaxy/galaxy.png"],
                "link": "http://codotronix.github.io/galaxy/"
            },
            {
                "id": "codotronixBlog",
                "name": "Learn with Me",
                "size": "medium",
                "contentType": "live",
                "liveImgUrls": ["img/codotronixblog/CodotronixLogo.png"],
                "bgColor": "rgba(255,255,255,.2)",
                "link": "http://codotronix.barick.in/"
            },
            {
                "id": "reactTaskMan",
                "name": "React TaskMan",
                "size": "small",
                "contentType": "live",
                "liveImgUrls": ["img/reactTaskman/react.png"],
                "bgColor": "#653877",
                "link": "http://codotronix.github.io/react-taskman"
            },
            {
                "id": "myPictures",
                "name": "My Pictures",
                "size": "big",
                "contentType": "live",
                "liveImgUrls": ["img/myPictures/1.jpg", "img/myPictures/3.jpg", "img/myPictures/4.jpg"],
                "liveTxts": ["Welcome to my Website", "Follow me at Twitter @codotronix"],
                "fontColor": "ivory",
                "bgColor": "rgba(255,255,255,.2)"
            },
            {
                "id": "txtTile",
                "name": "Hello Guest!",
                "size": "rectangle",
                "contentType": "live",
                "liveTxts": ["Hi! I am Suman Barick and I love to Code", "I made this plugin \"barick-tilefy\"", "Like it? Star \"barick-tilefy\" repo on github", "I have made this plugin Open Source", "I'll soon make the documentation"],
                "fontColor": "#E4F978",
                "bgColor": "rgba(255,255,255,.3)"
            },
            {
                "id": "bengalirecipes",
                "name": "Bengali Recipes",
                "size": "rectangle",
                "contentType": "live",
                "liveImgUrls": ["img/bengalirecipes/310x150.png", "img/bengalirecipes/appcomingsoon.png"],
                "bgColor": "#AA0000",
                "link": "http://codotronix.github.io/bengali-recipes"
            },
            {
                "id": "oneMall",
                "name": "One Mall",
                "size": "small",
                "contentType": "live",
                "liveImgUrls": ["img/oneMall/onemall-rec.png"],
                "bgColor": "#AA0000",
                "link": "http://codotronix.github.io/one"
            },
            {
                "id": "github",
                "name": "Github",
                "size": "small",
                "contentType": "font",
                "icon": "fa fa-github",
                "bgColor": "rgba(10, 82, 49, 0.7)",
                "link": "https://github.com/codotronix",
                "linkTarget": "_blank"
            },
            {
                "id": "myBlog",
                "name": "My Blog",
                "size": "rectangle",
                "contentType": "live",
                "liveImgUrls": ["img/myBlog/lwl.jpg"],
                "bgColor": "#B2DE0C",
                "link": "http://sumanbarick.blogspot.in/"
            },
            {
                "id": "facebook",
                "name": "Facebook",
                "size": "small",
                "contentType": "font",
                "icon": "fa fa-facebook-square",
                "bgColor": "rgba(59, 89, 152, 0.7)",
                "link": "http://facebook.com/codotronix"
            },
            {
                "id": "offersplus",
                "name": "Offersplus.in",
                "size": "small",
                "contentType": "live",
                "liveImgUrls": ["img/offersplus/offersplus.in.png"],
                "link": "http://offersplus.in"
            },
            {
                "id": "miniPuzzle",
                "name": "Mini Puzzle",
                "size": "rectangle",
                "contentType": "live",
                "liveImgUrls": ["img/minipuzzle/744x360.png"],
                "bgColor": "rgba(255,255,255,.2)",
                "link": "http://codotronix.github.io/metro-static/sections/apps/minipuzzle/index.html"
            },
            {
                "id": "gogoltugo",
                "name": "Go Gol2, Go!",
                "size": "rectangle",
                "contentType": "live",
                "liveImgUrls": ["img/goltu/800x400.png"],
                "bgColor": "rgba(255,255,255,.2)",
                "link": "http://codotronix.github.io/Dourio/Final/"
            },
            {
                "id": "tankgular",
                "name": "Tankgular !!!",
                "size": "rectangle",
                "contentType": "live",
                "liveImgUrls": ["img/tankgular/tankgular.png"],
                "bgColor": "rgba(255,255,255,.2)",
                "link": "http://codotronix.github.io/Tankgular/"
            },
            {
                "id": "barickTilefy",
                "name": "barick-tilefy",
                "size": "rectangle",
                "contentType": "live",
                "liveImgUrls": ["img/screens/RepositionTiles.gif"],
                "bgColor": "rgba(255,255,255,.2)",
                "link": "https://github.com/codotronix/barick-tilefy"
            },
            {
                "id": "asteroidattack",
                "name": "Asteroid Aattack",
                "size": "rectangle",
                "contentType": "live",
                "liveImgUrls": ["img/asteroidattack/astattack.png"],
                "bgColor": "#000",
                "link": "http://codotronix.github.io/Asteroid-Attack/play.html"
            },
            {
                "id": "linkedIn",
                "name": "linkedin",
                "size": "small",
                "contentType": "font",
                "icon": "fa fa-linkedin-square",
                "bgColor": "rgba(139, 0, 0, 0.7)",
                "link": "https://in.linkedin.com/in/sumanbarick"
            },
            {
                "id": "stackoverflow",
                "name": "Stack Overflow",
                "size": "small",
                "contentType": "font",
                "icon": "fa fa-stack-overflow",
                "bgColor": "rgba(142, 140, 140, 0.69)",
                "link": "http://stackoverflow.com/users/5017556/suman-barick"
            },
            {
                "id": "twitter",
                "name": "twitter",
                "size": "small",
                "contentType": "font",
                "icon": "fa fa-twitter",
                "bgColor": "rgba(64, 153, 255, 0.7)",
                "link": "https://twitter.com/codotronix"
            },
            {
                "id": "tileOfTime",
                "name": "Tile of Time",
                "size": "rectangle",
                "contentType": "plugin",
                "bgColor": "rgba(7, 15, 245, 0.44)"
            },
            {
                "id": "weatherNow",
                "name": "Weather Now",
                "size": "rectangle",
                "contentType": "plugin",
                "bgColor": "rgba(228, 255, 0, 0.45)",
                "link": "http://weather.yahoo.com"
            }
        ]
    }

