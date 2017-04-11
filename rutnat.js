var cols = 5;
var rows = 5;



var letter = "a";
var coord;

for (var j = 1; j <= rows;j++) {
	for (var i = 1; i <= cols; i++) {
	coord = letter;
	coord += i;
	console.log(coord);
	}
	letter = nextChar(letter);
 }

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}




