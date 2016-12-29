window.addEventListener("DOMContentLoaded", startGame, false);

//ljud
var sndSankShip = new Audio('Audio/sankShip.mp3');
var sndMissShip = new Audio('Audio/missShip.mp3');
var sndHitShip = new Audio('Audio/hitShip.mp3');
var sndWonGame = new Audio('Audio/wonGame.mp3');
var sndLostGame = new Audio('Audio/lostGame.mp3');
var sndMouseOver = new Audio('Audio/mouseOver.mp3');
var sndClockTick = new Audio('Audio/clockTick.mp3');


var playingField = [];
var cols = 8;
var rows = 8;
var squares = cols * rows;
var tries = 40;
var message = "";


//Dessa funkar inte!! trots att de bara sätter variablerna cols o rows o det går att ändra dem manuellt med gott resultat...

/*function startButton() {
	var start = document.getElementById("start").addEventListener("click", startGame);
}

function setDifficulty() {
	var select = document.getElementById("select");
	var selected = parseInt(select.value);
	cols = selected;
	rows = selected;
	startButton();
}*/


// mina skepp, ett objekt som innehåller objekt för varje skepp

var ships = {
    Jolle: {
        name: "Jolle",
        size: 2,
        coords: [],
        float: true,
        mark: "j",
        color: "#4C1C00"
    },
    Sub: {
        name: "Sub",
        size: 2,
        coords: [],
        float: true,
        mark: "s",
        color: "#95B544"
    },
    Gunboat: {
        name: "Gunboat",
        size: 3,
        coords: [],
        float: true,
        mark: "g",
        color: "#D8B400"
    },
    Torpedoboat: {
        name: "Torpedoboat",
        size: 4,
        coords: [],
        float: true,
        mark: "t",
        color: "#DD8418"
    },
    Battleship: {
        name: "Battleship",
        size: 5,
        coords: [],
        float: true,
        mark: "b",
        color: "#CC4D2A"
    },
    Tanker: {
        name: "Tanker",
        size: 6,
        coords: [],
        float: true,
        mark: "T",
        color: "#700353"
    }
};

//createplayingfield skapar spelplanen.
//lägger till objekt i arrayen playingfield för varje ruta med koordinater & ship false o hit false.
//skapar också element på sidan samtidigt o ger dem id och properties

function createPlayingField() {
    var board = document.getElementById("board");
    var id = 0;
    for (var j = 0; j < rows; j++) {
        var row = document.createElement("div");
        board.appendChild(row);
        row.setAttribute("id", "row" + j);
        row.className = "row";

        for (var i = 0; i < cols; i++) {
            playingField.push({
                row: j,
                col: i,
                id: id,
                ship: false,
                hit: false,
                mark: "-",
                color: "#5593D1"
            });

            var square = document.createElement("div");
            square.className = "square";
            square.style.background = playingField[id].color;
            row.appendChild(square);
            square.setAttribute("id", id);
            id++;
        }
    }
}

/*Detta är huvudfunktionen. Vi testar att lägga ut skeppet (parameter) 100 gånger, sedan skrivs ett felmeddelande ut
slumpar först fram om vi ska lägga på rad eller kolumn
sedan anropas createShip med rätt argument å vi kollar att vi får tillbaks en array i rätt storlek
vi kör sedan testship och om den kommer tillbaka true så lägger vi ut skeppet; talar om detta för spelplanen o ger
skeppet koordinaterna samt bryter loopen.*/

function placeShip(ship) {
    var newShip = [];
    var invalidPlace = true;
    var tries = 0;
    while (invalidPlace) {
        if (Math.round(Math.random()) === 0) { //ROWS
            newShip = createShip("col", cols, ship, 1);
        } else newShip = createShip("row", rows, ship, rows); //COlS
        if (newShip.length === ship.size) {
            if (testShip(newShip)) {
                createSidebarShips(newShip, ship.color, ship.name); //skriver ut i sidebaren här 
                for (var k = 0; k < ship.size; k++) {
                    playingField[newShip[k]].ship = true;
                    playingField[newShip[k]].mark = ship.mark;
                    playingField[newShip[k]].name = ship.name;
                    playingField[newShip[k]].color = ship.color;
                    ship.coords.push(newShip[k]);
                    invalidPlace = false;
                }
            }
        }
        tries++;
        if (tries === 99) {
            console.log("can't place ships!");
            break;
        }
    }
}

function createSidebarShips(shipcoord, color, name) {
    var sideship = document.getElementById("sideship");
    var row = document.createElement("div");
    sideship.appendChild(row);
    row.className = "row " + name + "-row";
    for (var i = 0; i <= shipcoord.length - 1; i++) {
        var outersquare = document.createElement("div");
        var square = document.createElement("div");
        outersquare.className = "outersquare";
        square.className = "square-r " + name;
        square.style.background = color;
        row.appendChild(outersquare);
        outersquare.appendChild(square);
    }
}

function showSidebarShips(name, full) {
    var shipOpac = document.getElementsByClassName(name);
    var squaresHit = ships[name].size - ships[name].coords.length;
    var dynamicOpac = 1 / ships[name].size;
    var opac = dynamicOpac * squaresHit;
    if (full) opac = 1;
    for (var i = 0; i < squaresHit; i++) {
        shipOpac[i].style.opacity = opac;
        if (full) {
            shipOpac[i].className += " glow";
        }
    }
}

/*createShip returnerar ett förslag (array) på en placering för ett skepp. Enda två villkoren är att det 
inte redan ligger ett skepp på startpunkten samt att det får plats (startpunkt + skeppstorlek <= rad/kolumnstorlek)
ska vi lägga horisontellt lägger vi på 1 för varje gång. Vertikalt måste vi plussa på antalet rutor på en rad.*/

function createShip(axis, dir, thisShip, add) {
    var myShip = [],
        addEach = 0,
        i = 0;
    var startPoint = Math.floor(Math.random() * squares - 1) + 1;
    if (playingField[startPoint].ship === false && (playingField[startPoint][axis] + thisShip.size) <= dir) {
        for (i = 0; i < thisShip.size; i++) {
            myShip.push(startPoint + addEach);
            addEach += add;
        }
    }
    return myShip;
}

//testShip kollar om någon av skeppets koordinater är upptagen och returnerar isf false, annars true.

function testShip(newShip) {
    for (var i = 0; i < newShip.length; i++) {
        if (playingField[newShip[i]].ship === true) {
            return false;
        }
    }
    return true;
}

//Printplayingfield skriver ut spelplanen ruta för ruta, samt skriver ut markeringen för vilket 
//skepp som ligger där alt - för ledig ruta. En rad skrivs ut i konsolen när strängen är lika lång som antalet kolumner.

function printPlayingField() {
    var row = "";
    var i = 0;
    for (var item in playingField) {
        row += playingField[item].mark;

        var sq = document.getElementById(i);
        sq.addEventListener("click", playerClick);
        sq.addEventListener("mouseover", mouseoverSound);
        i++;
        if (row.length === cols) {
            console.log(row);
            row = "";
        }
    }
}

//playerClick styr vad som händer när en spelare klickar på en ruta

function playerClick() {

    this.className += " noMove";
    this.removeEventListener("mouseover", mouseoverSound);
    var displayMessage = document.getElementById("message");
    if (playingField[this.id].hit) {
        displayMessage.className = "black";
        displayMessage.innerHTML = "Du har redan provat den rutan...";
        return null;
    } else if (playingField[this.id].ship) {
        this.style.background = playingField[this.id].color;
        var check = hitShip(ships[playingField[this.id].name].coords, this.id);

        if (check.length === 0) {
            sndHitShip.play();
            displayMessage.className = "green";
            displayMessage.innerHTML = "Du sänkte " + playingField[this.id].name + "! " + message;
            ships[playingField[this.id].name].float = false;
            showSidebarShips(playingField[this.id].name, true);
            sndSankShip.play();
            setTimeout(checkWon, 500);
        } else {
            displayMessage.className = "yellow";
            displayMessage.innerHTML = "Du träffade " + playingField[this.id].name + "! " + message;
            showSidebarShips(playingField[this.id].name, false);
            sndHitShip.play();
        }
    } else {
        this.style.background = "#96c4f2";
        displayMessage.className = "red";
        displayMessage.innerHTML = "Du bommade... " + message;
        sndMissShip.play();
    }
    playingField[this.id].hit = true;
    setTimeout(triesLeft, 200);
}

//triesLeft räknar ner antalet försök och laddar om sidan när vi nått 0.

function triesLeft() {
    var displayTries = document.getElementById("tries");
    if (tries === 0) {
        setTimeout(endScreen(false), 1000);
    }
    if (tries === 10) {
        sndClockTick.play();
        message = "Inte så många försök kvar nu!";
    }
    displayTries.innerHTML = "Antal försök kvar: <span id='triesCount'>" + tries + "</span>";
    tries--;
}

function hitShip(shipcoords, square) {
    for (var i = shipcoords.length - 1; i >= 0; i--) {
        if (shipcoords[i] == square) {
            shipcoords.splice(i, 1);
        }
    }
    return shipcoords;
}

function checkWon() {
    for (var i in ships) {
        if (ships[i].float) {
            return false;
        }
    }
    setTimeout(endScreen(true), 1000);
}

function endScreen(won) {
    sndClockTick.pause();
    var displayMessage = document.getElementById("message");
    message = "";
    if (won) {
        sndWonGame.play();
        finalTries = tries + 1;
        displayMessage.className = "green";
        displayMessage.innerHTML = "Grattis, du sänkte alla skepp med " + finalTries + " försök kvar!";
    } else {
        sndLostGame.play();
        displayMessage.className = "red";
        displayMessage.innerHTML = "Spelet är slut. Du förlorade!";
    }
    for (var i = 0; i < playingField.length; i++) {
        var endSquare = document.getElementById(i);
        endSquare.style.background = playingField[i].color;
        endSquare.className += " noMove";
        endSquare.removeEventListener("click", playerClick);
        endSquare.removeEventListener("mouseover", mouseoverSound);
    }
}

function mouseoverSound() {
    sndMouseOver.play();

}

// En funktion för att dra igång alla funktioner som behövs

function startGame() {
    createPlayingField();
    placeShip(ships.Jolle);
    placeShip(ships.Sub);
    placeShip(ships.Gunboat);
    placeShip(ships.Torpedoboat);
    placeShip(ships.Battleship);
    placeShip(ships.Tanker);
    printPlayingField();
    triesLeft();
    //console.log(playingField);
    //console.log(ships);
}