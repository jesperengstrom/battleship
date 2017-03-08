/* Hej och kul att du vill kolla in min kod. Jag heter Jesper Engstrom och gjorde det här spelet som ett hobbyprojekt under två veckor 
december -16 parallellt med Front End-utbildningen på Nackademin i sthlm. Detta är mitt första spel, jag skrev det efter eget 
huvud utan ramverk eller annan hjälp. Ha därför överseende om koden är lite hur som helst på sina ställen ;) 
kontakt: jengstro@gmail.com 
*/

//När DOM är laddad kör vi funktionen startGame som anropar alla övriga funktioner.
window.addEventListener("DOMContentLoaded", startGame, false);

//Mina ljud
var sndSankShip = new Audio('Audio/sankShip.mp3');
var sndMissShip = new Audio('Audio/missShip.mp3');
var sndHitShip = new Audio('Audio/hitShip.mp3');
var sndWonGame = new Audio('Audio/wonGame.mp3');
var sndLostGame = new Audio('Audio/lostGame.mp3');
var sndMouseOver = new Audio('Audio/mouseOver.mp3');
var sndClockTick = new Audio('Audio/clockTick.mp3');

//Globala variabler
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


// mina skepp, ett objekt som innehåller objekt för varje skepp, med namn färg mm.

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

/*createPlayingField skapar spelplanen rows * cols.
Lägger till objekt i arrayen playingField för varje ruta med koordinater & ship false o hit false.
Skapar samtidigt element på sidan o ger dem id och properties */

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

/*Detta är huvudfunktionen. Slumpar först fram om vi ska lägga på rad eller kolumn. Vi kör sedan de två hjälpfunktionerna createShip och testShip. 
Om testerna går igenom placerar vi ut skeppet på spelplanen samt i sidebaren, skickar rätt koordinater till skeppet samt bryter loopen. 
Vi testar att lägga ut skeppet (ship) 100 gånger, sedan skrivs ett felmeddelande ut i konsolen.*/

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

/*createShip returnerar ett förslag (array) på en placering av  ett skepp. Villkoren är att det 
inte redan ligger ett skepp på startpunkten samt att det får plats på spelplanen (startpunkt + skeppstorlek <= rad/kolumnstorlek).
Ska vi lägga horisontellt adderar vi 1 för varje koordinat. Vertikalt adderar vi antalet rutor på en rad. Returneras en array av rätt
längd från denna funktion vet placeShip att det gick.*/

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

//hjälpfunk testShip kollar om någon av skeppets koordinater är upptagna av ett skepp och returnerar isf false till placeShip, annars true.

function testShip(newShip) {
    for (var i = 0; i < newShip.length; i++) {
        if (playingField[newShip[i]].ship === true) {
            return false;
        }
    }
    return true;
}

// createSidebarShips renderar varje skepp vi placerar på spelplanen sidebaren (till höger), ruta för ruta.  

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

/* showSidebarShips fixar effekterna i sidebaren till höger. När vi har träffat en ruta där det ligger ett skepp får rutan 
dynamisk färg + opacitet (beroende på hur många delar vi sänkt o hur stort skeppet är). När vi sänkt det får hela raden "glow".*/

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


/*Printplayingfield skapades från början för att skriva ut skeppens placering i konsolen. 
(En rad skrivs ut när strängen är lika lång som antalet kolumner). Nu används den också för att lägga till event listeners
dynamiskt för varje ruta som renderas på spelplanen (lyssnar efter klick o mouseover). */

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

/* playerClick är den andra "huvudfunktionen" och styr vad som händer när en spelare klickar på en ruta, vilken text som dyker upp 
på skärmen mm. Scenarion: 1) Vi har redan klickat rutan. 2) Det ligger ett skepp där --> kör hjälpfunktionerna hitShip för att kolla om a)
vi sänkt skeppet samt b) checkWon om vi vunnit. 3) vi bommar. Oavsett vad räknar vi ner försöken med triesLeft.*/

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
            sndHitShip.currentTime = 0;
            sndHitShip.play();
        }
    } else {
        this.style.background = "#96c4f2";
        displayMessage.className = "red";
        displayMessage.innerHTML = "Du bommade... " + message;
        sndMissShip.currentTime = 0;
        sndMissShip.play();
    }
    playingField[this.id].hit = true;
    setTimeout(triesLeft, 200);
}

//Har vi täffat ett skepp tar vi bort den koordinaten från skeppets coords-array. När length = 0 är det sänkt.

function hitShip(shipcoords, square) {
    for (var i = shipcoords.length - 1; i >= 0; i--) {
        if (shipcoords[i] == square) {
            shipcoords.splice(i, 1);
        }
    }
    return shipcoords;
}

//har samtliga skepp key/value = float/false är alla skepp sänkta. Vi har vunnit (endScreen). Annars returneras false.

function checkWon() {
    for (var i in ships) {
        if (ships[i].float) {
            return false;
        }
    }
    setTimeout(endScreen(true), 1000);
}

//triesLeft räknar ner antalet försök vi har kvar. Vid 10 försök kvar varnar den. Vid 0 har vi förlorat (endScreen).

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

/*Slutskärm. Olika meddelande beroende på om vi vunnit eller förlorat. 
for-loopen allra sist renderar spelplanen ytterligare en gång med sina "rätta" färger för att visa var skeppen låg*/

function endScreen(won) {
    sndClockTick.pause();
    var displayMessage = document.getElementById("message");
    message = "";
    if (won) {
        sndWonGame.play();
        var finalTries = tries + 1;
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

//spelar mouseover-ljud. 

function mouseoverSound() {
    sndMouseOver.currentTime = 0;
    sndMouseOver.play();
}

// startGame ropar på funktioner som behövs vid spelstart samt lägger ut de skepp vi vill ha.

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
}