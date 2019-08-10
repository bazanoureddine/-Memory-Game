/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond", "fa-diamond",
    "fa-paper-plane-o", "fa-paper-plane-o",
    "fa-anchor", "fa-anchor",
    "fa-bolt", "fa-bolt",
    "fa-cube", "fa-cube",
    "fa-bomb", "fa-bomb",
    "fa-leaf", "fa-leaf",
    "fa-bicycle", "fa-bicycle"];
/*-----------------global variable -------------------*/
// to restart game
const divRestart = document.querySelector('.restart');
divRestart.addEventListener('click', initGame);

// table of card
let ulDeck = document.querySelector('.deck');

// to display modal
let myModel = document.querySelector('#myModal');

// to display counter of moves
let spanMoves = document.querySelector('.moves');

// to display stars
let ulStars = document.querySelector('.stars').children;

// to display time
let spanTime = document.querySelector('#time');

// to display result score in the modal
let p = document.querySelector("p");

// When the user clicks the button, it closes the modal and restart the game.
let btnclose = document.querySelector("#close");
btnclose.addEventListener('click', closeModal);

// to store two card to check if they match.
let cardMatch = [];

// to count moves.
let moves = 0;

// to count card opened, if cardOpened = 16 the game ends.
let cardOpened = 0;

// to count number of stars (Rating)
let starRemaining = 3;

// for the timer
let time = 0;
let timerOn = false;
let interval;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// to initialize the game
function initGame() {
    initMoves();
    hideModel();
    initStars();
    createCard();
    initTimer();
}

function initMoves(){
    moves = 0;
    spanMoves.textContent = moves;
}

function hideModel(){
    myModel.style.display = "none";
}

function initStars(){
    starRemaining = 3;
    const liStars = document.querySelectorAll('.stars li');
    for(star of liStars){
        star.style.visibility= "visible";
    }
}

function createCard(){
    cardOpened = 0;
    cardMatch.length = 0;
    const randomCards = shuffle(cards);
    let li;
    // add event listener to the table of card, when we click on it, the card is displayed.
    ulDeck.addEventListener('click', displayCard);
    ulDeck.innerHTML = "";

    for (const r of randomCards) {
        li = document.createElement('li');
        li.className = "card";
        li.innerHTML = `<i class="fa ${r}"></i>`;
        ulDeck.appendChild(li);
    }
}

//to initialize the timer
function initTimer(){
    time = 0;
    spanTime.textContent=`${time} secondes`
    clearInterval(interval);
    timerOn = false;
}

// close the modal and restart the game
function closeModal() {
    myModel.style.display = "none";
    initGame();
    timerOn = false;
}

//the timer start when the game begin and display the count of time in secondes
function startTimer(){
    interval = setInterval(function(){
        spanTime.textContent=`${time++} secondes`
    },1000);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 // to display the card
function displayCard(evt) {

    //to be sure that the event target is card and not an opened/matched card
    if (evt.target.nodeName === 'LI' &&
        !evt.target.classList.contains("open") &&
        !evt.target.classList.contains("show") &&
        !evt.target.classList.contains("match")) {
            //to start the timer once
            if (timerOn === false) {
                startTimer();
                timerOn = true;
            }

        checKcardToMatch(evt);
    };
}

// to check cards if they match
function checKcardToMatch(evt) {
    // add classes open and show, to the selected card
    evt.target.classList.add("open", "show");
    // add card to array cardMatch to check if it match the next selected card or not
    cardMatch.push(evt.target.firstElementChild.className);

    // checking cards when there are two cards in cardMatch array
    if (cardMatch.length === 2) {
       // to prevent opening more than two cards
        ulDeck.classList.add("prevent-event");
         //count the moves
         incrementMoves();
        //check if the two cards are the same
        if (cardMatch[0] === cardMatch[1]) {
            doMatchCard();
            cardMatch.length = 0;
            //check if the game ends
            setTimeout(checkWinGame, 500);
        } else {
            setTimeout(doNotMatchCard, 900);
            cardMatch.length = 0;
        }
    }
}

// match the card
function doMatchCard() {
    let openedCard = document.querySelectorAll('.card.open.show');
    ulDeck.classList.remove("prevent-event");
    for (o of openedCard) {
        o.classList.remove("open", "show");
        o.classList.add("match");
    }
}

//do not match the card
function doNotMatchCard() {
    let openedCard = document.querySelectorAll('.card.open.show');
    ulDeck.classList.remove("prevent-event");
    for (o of openedCard) {
        o.classList.remove("open", "show");
    }
}

//increment the count of moves and display it, and check the rating
function incrementMoves() {
    moves ++;
    spanMoves.textContent = moves;
    //for rating stars
    hideStars();
}

//check if the game ends
function checkWinGame(){
    cardOpened=cardOpened+2;

    if(cardOpened == 16 ){
        clearInterval(interval);
        //display the result of score
        p.textContent=`with ${moves} moves, time: ${time} secondes and ${starRemaining} stars`;
        myModel.style.display = "block";
    }
}

// to hide stars (for rating)
function hideStars() {
    if (moves == 15) {
        starRemaining=starRemaining-1;
        ulStars[0].style.visibility= "hidden";
    } else if (moves == 20) {
        starRemaining=starRemaining-1;
        ulStars[1].style.visibility= "hidden";
    }
};

initGame();
