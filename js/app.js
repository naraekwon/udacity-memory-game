/*
 * Create a list that holds all of your cards
 */
const icons = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor",
"fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb",
 "fa fa-bomb"];
const cardsContainer = document.querySelector(".deck");
let openedCards = [];
let matchedCards = [];

/*
* Add moves
*/
const moveIndicator = document.querySelector(".moves");
let moves = 0;


function addMove(){
    if (openedCards.length === 2){
      moves += 1;
      moveIndicator.innerHTML = moves;
    }
}

/*
* Star Rating
*/
const rateIndicator = document.querySelector(".stars");
let stars = 3;


function rateMove(){
    if (moves % 8 === 0){
        rateIndicator.firstElementChild.remove();
        stars -= 1;
    }
}


function newStarRate(){
    rateIndicator.innerHTML = "";
    for (let i = 0; i < 3; i++){
        const starRate = document.createElement("li");
        starRate.innerHTML = `<i class="fa fa-star"></i>`
        rateIndicator.appendChild(starRate);
    }
}

/*
* Restart Button
*/
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", createCards);


 /*
 * Modal
 */
const modal = document.querySelector(".modal");


function openModal(){
    const records = document.querySelector(".ending-records");
    records.innerHTML = `with ${moves} moves and ${stars} stars.
    It took about ${duration.toFixed(0)} seconds.`
    modal.style.display = "block";
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function(){
        modal.style.display = "none";
    })
    console.log(`this game took ${duration.toFixed(0)} seconds.`);
}


function closeModal(){
    modal.style.display = "none";
    createCards();
}


/*
* Timer1 to time total duration of the game.
*/
let startTime = 0;
let currentTime = 0;
let runningTime = 0;
let endTime = 0;
let duration = 0;
let displayTimer = document.querySelector(".timer")

/*
*Timer2 to display its time on the screen.
*/
function startDisplayTimer(){
    const x = setInterval(function(){
        currentTime = performance.now();
        runningTime = (currentTime - startTime)/1000;
        displayTimer.innerHTML = `${runningTime.toFixed(0)} seconds`
    }, 1000)
}


//Create the cards on the deck.
function createCards(){
    // remove existing cards using while loop
    openedCards = [];
    matchedCards = [];
    moves = 0;
    stars = 3;
    startTime = 0;
    currentTime = 0;
    runningTime = 0;
    endTime = 0;
    duration = 0;
    displayTimer.innerHTML = "0 second";
    moveIndicator.innerHTML = moves;
    newStarRate();
    while (cardsContainer.firstElementChild !== null){
        cardsContainer.firstElementChild.remove();
    };
    shuffle(icons);

    //start the timer
    startDisplayTimer();
    //create cards in the deck
    for (let i = 0; i < icons.length; i++){
        const card = document.createElement("li");
        card.className = "card";
        card.innerHTML = `<i class="${icons[i]}"></i>`
        cardsContainer.appendChild(card);
        //check the start time
        startTime = performance.now();
        flip(card);
    }
}


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


function isOver(){
    if (icons.length === matchedCards.length){
        //check its ending time.
        endTime = performance.now();
        //calculate how long the game took.
        duration = (endTime - startTime)/1000;
        //add Modal here;
        openModal();
    }
}


function flip(card){
    card.addEventListener("click", function(evt){
        //when we have one OPENED card already
        if (openedCards.length === 1) {
            let previousCard = openedCards[0];
            let currentCard = this;

            evt.target.classList.add("open", "show", "lock");
            openedCards.push(this);
            //count player's move
            addMove();
            rateMove();
            //compare two opened cards
            compareCards(currentCard, previousCard);
        } else if (openedCards.length < 1){
            //when we have no opened card yet
            evt.target.classList.add("open", "show", "lock");
            openedCards.push(this);
        }
    });
}


function reFlip(previousCard, currentCard){
    setTimeout(function(){
        previousCard.classList.remove("open", "show", "lock");
        currentCard.classList.remove("open", "show", "lock");
        openedCards = [];
    }, 1000);
}


function compareCards(currentCard, previousCard){
    //when two cards matched up.
    if (currentCard.innerHTML === previousCard.innerHTML){
        previousCard.classList.add("match");
        currentCard.classList.add("match");
        openedCards = [];
        matchedCards.push(previousCard.innerHTML, currentCard.innerHTML);
        //check the game is over
        isOver();
    } else {
        // when two cards don't match.
        reFlip(previousCard, currentCard);
        // change card className after a little of time.
    }
}


createCards();


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
