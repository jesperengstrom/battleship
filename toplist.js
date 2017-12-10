(function(){
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC8WG3W8154FgY64fwv_c1fFupeDWgZ3uQ",
        authDomain: "battleship-2f39b.firebaseapp.com",
        databaseURL: "https://battleship-2f39b.firebaseio.com",
        projectId: "battleship-2f39b",
        storageBucket: "battleship-2f39b.appspot.com",
        messagingSenderId: "920895199833"
    };
    firebase.initializeApp(config);

    //listen for show toplist / reset game 
    document.addEventListener('DOMContentLoaded', ()=> {
        document.querySelector('#showToplistBtn').addEventListener('click', () => {
            Toplist.getToplist(Toplist.printToplist)
        });
    document.querySelector('#resetGame').addEventListener('click', () => {
        location.reload()
    });

    })
})()

var Toplist = (function(){
    var database = firebase.database();
    var toplist = [];
    var myScore = '';
    var dateStamp = '';

    return {

        //simply gets the top 20 scores objects from db
        getToplist: function(callback){
            toplist = [];
            database.ref('toplist/')
            .orderByChild('score')
            .limitToLast(20)
            .once('value')
            .then((snapshot)=>{
                snapshot.forEach( (child) => {
                    toplist.unshift(child.val());
                })
            callback();
            })
            .catch(error => {
                console.log('oops, problem getting toplist', error);
            })
        },

        printToplist: function(){
            let modalBody = document.querySelector('.modal-body');
            var snippet = '<ol>';
            for (let i = 0; i < 20; i++) {
                if (toplist[i]){
                    if (toplist[i].date === dateStamp) {
                        snippet += '<li class="green">' + toplist[i].name + ' (' + toplist[i].score + ')</li>'
                    } else snippet += '<li>' + toplist[i].name + ' (' + toplist[i].score + ')</li>'
                } else snippet += '<li> - </li>'
            }
            snippet += '</ol>'
            modalBody.innerHTML = snippet;
        },

        //posts the score to db - then show modal
        submitScore: function(name, score, date){
            database.ref('toplist/').push({
                name: name,
                score: score,
                date: date
            })
            .then(()=>{
                document.getElementById('showToplistBtn').click();
            })
            .catch(error => {
                console.log('oops, post error', error)
            })
        },

        setMyScore: function(score) {
            myScore = parseInt(score);
        },

        compareMyScore: function(){
            dateStamp = '';
            //if there are empty spaces in toplist OR the last element is an equal or lower score than mine
            //- submit to toplist
            if (toplist.length < 20 || myScore >= toplist[toplist.length - 1].score) {
                dateStamp = Date.now();
                let name = prompt('Grattis, du tog dig in på topplistan! Skriv in ditt namn.', 'Namn');
                Toplist.submitScore(name, myScore, dateStamp);
            }
        },
    }

})();
