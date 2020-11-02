// Ania Kubow's space invaders, with a couple little tweaks
// https://www.youtube.com/watch?v=kSt2_YZzCec&t=85s&ab_channel=CodewithAniaKub%C3%B3w%23JavaScriptGames

// not using DOM event listener
// document.addEventListener('DOMContentLoaded', () => {})
// just moved script tag to bottom of <body>

const gridContainer = document.querySelector(".grid")

function createGridDivs() {
	for (let i = 0; i < 225; i++){
		let div = document.createElement("div");	
		gridContainer.appendChild(div);
		div.setAttribute("id", i.toString().padStart(3, '0'));
	}	

}

createGridDivs();

const gameBoard = document.querySelectorAll('.grid div');
const resultDisplay = document.querySelector('#result');
let boardWidth = 15;
let currentShooterPosition = 202;
let currentInvaderPosition = 0;
let invadersTakenDown = [];
let result = 0;
let direction = 1;
let invaderId;

// define the alien invaders
let alienInvaders = [
 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
];

// draw the alien invaders
alienInvaders.forEach(invader => gameBoard[currentInvaderPosition + invader].classList.add('invader'))

// draw the shooter
gameBoard[currentShooterPosition].classList.add('shooter');

//move the shooter move along a line

function moveShooter(e) {
	gameBoard[currentShooterPosition].classList.remove('shooter');
	switch(e.keyCode) {
		case 37:
		if(currentShooterPosition % boardWidth !== 0) currentShooterPosition -= 1;
		break;
		case 39:
		if(currentShooterPosition % boardWidth < boardWidth-1) currentShooterPosition +=1;
		break;
	}
	gameBoard[currentShooterPosition].classList.add('shooter');
}
document.addEventListener('keydown', moveShooter);

//move the invaders
function moveInvaders() {
	// basic edge detection from video:
	// the width of the group won't really change if the flanking invaders
	// are destroyed
	// const leftEdge = alienInvaders[0] % boardWidth === 0;
	// const rightEdge = alienInvaders[9] % boardWidth === boardWidth-1;

	// if((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
	// 	direction = boardWidth;		
	// } else if (direction === boardWidth) {
	// 	if (leftEdge) direction = 1;
	// 	else direction = -1;
	// }

	// since I'm treating destroyed invaders differently, the above edge detection
	// produces strange behavior.  Above is based on the edges of the array, which 
	// remain constant even if we no longer draw invaders in those positions.
	// since I'm deleting elements from the array, this messes up the edge detection.

	// now I'll need to check every element to see if it is on the left or right 
	// edges.

	// find:
	// an expression for the right edge
	//	14 to 224, counting by 15
	// 	224 % 15 === 14
	//  any square on the right edge % 15 === 14

	// an expression for the left edge
	// 0 to 210, counting by 15
	// any square on the left edge % 15 === 0
	
	// miror tweak to the logic from the video
	const leftEdge = alienInvaders.some(invader => invader % 15 === 0);
	const rightEdge = alienInvaders.some(invader => invader % 15 === 14);

	// this part remains the same
	if((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
		direction = boardWidth;		
	} else if (direction === boardWidth) {
		if (leftEdge) direction = 1;
		else direction = -1;
	}

	for (let i = 0; i <= alienInvaders.length -1; i++) {
		// remove class for current position
		gameBoard[alienInvaders[i]].classList.remove('invader');				
		// update positions stored in alienInvaders array by adding direction
		alienInvaders[i] += direction;
	}
	for (let i = 0; i <= alienInvaders.length -1; i++) {
		// add class for new positions
		gameBoard[alienInvaders[i]].classList.add('invader');
	}

	//game over condition
	if(gameBoard[currentShooterPosition].classList.contains('invader', 'shooter')) {
		resultDisplay.textContent = ' Game Over'
		gameBoard[currentShooterPosition].classList.add('boom');
		clearInterval(invaderId);
	}
	for (let i = 0; i < alienInvaders.length; i++){
		//check each position of the Invaders to see if any have reached the bottom
		//of the board
		// if any of the values in the invaders array contain a number from
		// 210 to 224
		if(alienInvaders[i] > 210 && alienInvaders[i] < 225) {
			resultDisplay.textContent = ' Game Over!'
			clearInterval(invaderId);
		}
	}

	// win condition
	if (alienInvaders.length === 0) {
		resultDisplay.textContent = " You Win!"
		clearInterval(invaderId);
	}

}
invaderId = setInterval(moveInvaders, 250);

//shoot at aliens
function shoot(e) {
	let laserId
	let currentLaserPosition = currentShooterPosition;
	// move the laser beam
	function moveLaser () {
		gameBoard[currentLaserPosition].classList.remove('laser');
		currentLaserPosition -= boardWidth;
		gameBoard[currentLaserPosition].classList.add('laser');
		if(gameBoard[currentLaserPosition].classList.contains('invader')) {
			gameBoard[currentLaserPosition].classList.remove('laser');
			gameBoard[currentLaserPosition].classList.remove('invader');
			gameBoard[currentLaserPosition].classList.add('boom');

			setTimeout(() => gameBoard[currentLaserPosition].classList.remove('boom'), 250);
			clearInterval(laserId);

			// look for the value of currentLaserPosition in the alienInvaders array
			// return the index where this value was found
			const takenDown = alienInvaders.indexOf(currentLaserPosition);
			alienInvaders.splice(takenDown,1);
			invadersTakenDown.push(takenDown);
			result ++;
			resultDisplay.textContent = result;
			console.log(takenDown);
		}

		if(currentLaserPosition < boardWidth) {
			clearInterval(laserId);
			setTimeout(() => gameBoard[currentLaserPosition].classList.remove('laser'), 100);
		}
	}
	
		if (e.keyCode === 32) {
			laserId = setInterval(moveLaser, 100);
		}
	
}
document.addEventListener('keyup', shoot);







