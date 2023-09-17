// player factory function
const playerFactory = (name, mark) => {

    let _score = 0;

    const getScore = () => _score;

    const increaseScore = () => _score += 1;

    const resetScore = () => _score = 0;

    return { name, mark, getScore, increaseScore, resetScore };
}


// gameBoard module
const gameBoard = (() => {
    const _squares = document.querySelectorAll('.choice-spot');
    const _array = ["", "", "", "", "", "", "", "", ""];
    let _winningSquares = [];

    // initiate squares - each square div contains a data-index attribute
    _squares.forEach(square => {
        square.addEventListener("click", () => {
            if (!getSquare(square.dataset.index) && !game.getGameOverStatus()) {
                setSquare(square.dataset.index, game.getMark());
                game.nextTurn();
            }
        })
    });

    // methods
    const getSquare = index => _array[index];

    const setSquare = (index, mark) => {
        _array[index] = mark;
        let delay = 0;
        // add slight delay before displaying bot's move
        if (mark === "O" && game.getGameMode()) {
            delay = 100;
        }
        setTimeout(() => {
            _squares[index].textContent = mark;
            (mark === "X") ? _squares[index].style.color = "#fcd34d" : _squares[index].style.color = "#93c5fd"
        }, delay);

    };

    const getArray = () => _array;

    const getMoves = () => {
        // find free spaces
        const freeSpaces = [];
        for (let i = 0; i < _array.length; i++) {
            if (_array[i] === "") {
                freeSpaces.push(i);
            }
        }
        return freeSpaces;
    }

    const resetGameBoard = () => {
        for (let i = 0; i < _array.length; i++) {
            _array[i] = "";
        }
        _squares.forEach(square => {
            square.textContent = "";
        })
    };

    // use this for the winning squares animation 
    const setWinningSquares = (winningIndexArray) => {
        _winningSquares = winningIndexArray.sort();
    };

    const animateSquares = () => {
        // add slight delay
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    _squares[_winningSquares[i]].classList.add('square-win');
                }, 100 * i);
            }
        }, 300);
    };

    return { getSquare, setSquare, getArray, getMoves, resetGameBoard, setWinningSquares};
})();


// game logic
const game = (() => {
    const _botLevelSelect = document.querySelector('#bot-difficulty-options');
    const botLevel = document.querySelector(".bot-level")
    const gameMode = document.querySelector("#game-mode");
    const gameModeLabel = document.querySelector("#select-game-mode label")
    const tieDisplay = document.querySelector("#draw > .points");
    const turnInformation = document.querySelector("#turn-information");
    const playerOneDisplay = document.querySelector('#player-one-score > p:first-child');
    const playerTwoDisplay = document.querySelector('#player-two-score > p:first-child');
    const _playerOneScore = document.querySelector('#player-one-score > .points');
    const _playerTwoScore = document.querySelector('#player-two-score > .points');
    const displayPlayerTurn = document.querySelector("#p-turn")

    let playerOne = playerFactory("You", "X");
    let playerTwo = playerFactory("Bot", "O");
    let playVsBot = true;
    let _currentMark = playerOne.mark;
    let _currentPlayer = playerOne;
    let _isGameOver = false;
    let _botLevel = 'medium';
    let _tieScore = 0;
    
    gameMode.addEventListener("input", (event) => {
        _tieScore = 0;
        tieDisplay.textContent = _tieScore;
        if (event.target.checked) {
            playVsBot = true;
            playerOne = playerFactory("You", "X");
            playerTwo = playerFactory("Bot", "O");
            playerOneDisplay.textContent = "You"
            _playerOneScore.textContent = playerOne.getScore();
            playerTwoDisplay.textContent = "Bot"
            _playerTwoScore.textContent = playerTwo.getScore();
            gameModeLabel.textContent = "You vs. Bot"
            fullResetGame();
            turnInformation.classList.toggle("hidden");
            botLevel.classList.toggle("hidden")
        } else {
            playVsBot = false;
            playerOne = playerFactory("Player 1", "X");
            playerTwo = playerFactory("Player 2", "O");
            playerOneDisplay.textContent = "Player 1"
            _playerOneScore.textContent = playerOne.getScore();
            playerTwoDisplay.textContent = "Player 2"
            _playerTwoScore.textContent = playerTwo.getScore();
            gameModeLabel.textContent = "P 1 vs P 2"
            displayPlayerTurn.textContent = "Player 1"
            turnInformation.classList.toggle("hidden");
            botLevel.classList.toggle("hidden")
            _currentPlayer = playerOne;
        }
        console.log(playerTwo.getScore(), playerOne.getScore())
    })

    _botLevelSelect.addEventListener('input', () => {
        _botLevel = _botLevelSelect.value;
    });

    // methods
    const getMark = () => _currentMark;
    const getGameOverStatus = () => _isGameOver;
    const getGameMode = () => playVsBot;
    const nextTurn = () => {
        // display winner
        if (checkForWinner(gameBoard.getArray(), game.getMark())) {
            _isGameOver = true;
            if (_currentPlayer.name === "You") {
                display.show("You win!")
            } else {
                display.show(`${_currentPlayer.name} wins!`);
            }
            // gameBoard.animateSquares();
            _currentPlayer.increaseScore();
            display.updateScores(playerOne, playerTwo);
        } else if (checkForWinner(gameBoard.getArray(), game.getMark()) === false) {
            display.show("It's a tie...");
            _tieScore += 1;
            tieDisplay.textContent = _tieScore;
        } else {
            _currentMark = _currentMark === "X" ? "O" : "X";
            _currentPlayer = _currentPlayer === playerOne ? playerTwo : playerOne;
            if (!playVsBot) {
                displayPlayerTurn.textContent = _currentPlayer.name
            }
        }

        // initiate bot move
        if (_currentPlayer === playerTwo && _isGameOver === false && playVsBot) {
            if (_botLevel === 'very easy') {
                botMove.move(3);
            } else if (_botLevel === 'easy') {
                botMove.move(5);
            } else if (_botLevel === 'medium') {
                botMove.move(7);
            } else if (_botLevel === 'hard') {
                botMove.move(8);
            } else if (_botLevel === 'very hard') {
                botMove.move(9);
            } else if (_botLevel === 'impossible') {
                botMove.move(10);
            }
        }
    };

    const restartGame = () => {
        gameBoard.resetGameBoard();
        _currentPlayer = playerOne;
        _currentMark = "X";
        _isGameOver = false;
        _botLevel = _botLevelSelect.value
    }

    const fullResetGame = () => {
        restartGame();
        playerOne.resetScore();
        playerTwo.resetScore();
        _tieScore = 0;
        tieDisplay.textContent = 0;
        console.log(_botLevel)
        gameMode.checked = true;
    }

    return {getMark, getGameMode, nextTurn, getGameOverStatus, restartGame, fullResetGame};
})();


// check for winner
const checkForWinner = (array, mark) => {
    // check for rows of 3
    for (let i = 0; i < 9; i++) {
        // check horizontal lines
        if (i % 3 === 0 && array[i] === mark && array[i + 1] === mark && array[i + 2] === mark) {
            gameBoard.setWinningSquares([i, i + 1, i + 2]);
            return true;
        }
        // check vertical lines
        if (i < 3 && array[i] === mark && array[i + 3] === mark && array[i + 6] === mark) {
            gameBoard.setWinningSquares([i, i + 3, i + 6]);
            return true;
        }
        // check diagonal lines
        if (i === 4) {
            // from top-left
            if (array[i] === mark && array[i - 4] === mark && array[i + 4] === mark) {
                gameBoard.setWinningSquares([i, i - 4, i + 4]);
                return true;
            }
            // from top-right
            if (array[i] === mark && array[i - 2] === mark && array[i + 2] === mark) {
                gameBoard.setWinningSquares([i, i - 2, i + 2]);
                return true;
            }
        }
    }
    // if array full and no winner game is tied
    if (array.includes("")) {
        return;
    } else {
        return false;
    }
}


// displayController
const display = (() => {
    const _winnerDialog = document.querySelector('#winner-announcer');
    const winner = document.querySelector("#winner");
    const _playerOneScore = document.querySelector('#player-one-score > .points');

    const _botScore = document.querySelector('#player-two-score > .points');
    const _restartBtn = document.querySelector('#reset');
    const closeDialogButton = document.querySelector("#close-dialog");
    const newRoundButton = document.querySelector("#new-round");

    const show = (message) => {
        _winnerDialog.showModal()
        winner.textContent = message;
    }
    const updateScores = (playerOne, playerTwo) => {
        _playerOneScore.textContent = playerOne.getScore();
        _botScore.textContent = playerTwo.getScore();
    }

    _restartBtn.addEventListener("click", () => {
        game.fullResetGame();
        _playerOneScore.textContent = 0;
        _botScore.textContent = 0;
    })

    newRoundButton.addEventListener("click", () => {
        game.restartGame();
        _winnerDialog.close();
    })

    closeDialogButton.addEventListener("click", () => {
        _winnerDialog.close();
    })

    return {show, updateScores};
})()



// BOT MOVES
const botMove = (() => {

    const _chooseRandomSquare = () => {
        // get possible moves
        const freeSpaces = gameBoard.getMoves();
        // choose one possible move at random
        const randomIndex = Math.floor(Math.random() * freeSpaces.length);
        gameBoard.setSquare(freeSpaces[randomIndex], game.getMark());
    }

    // minimax is a recursive algorithm that finds the optimal move
    const _minimax = (array, depth = 0, mark = "O") => {

        const nextMark = mark === "O" ? "X" : "O";
        let bestIndex;
        // set default best score depending on current mark being checked
        let bestScore = mark === "O" ? -Infinity : Infinity;

        // return 0 is no free spaces
        if (!array.includes("")) return { bestIndex: null, bestScore: 0 }

        // check for winner & return
        for (let i = 0; i < array.length; i++) {
            // check is space is empty and insert mark if so
            if (!array[i]) {
                array[i] = mark;
                if (checkForWinner(array, mark)) {
                    if (mark === "O") {
                        let score = 10 - depth;
                        bestScore = Math.max(score, bestScore);
                        if (score === bestScore) {
                            bestIndex = i;
                        }
                    } else {
                        let score = depth - 10;
                        bestScore = Math.min(score, bestScore);
                        if (score === bestScore) {
                            bestIndex = i;
                        }
                    }
                } else {
                    if (mark === "O") {
                        let score = _minimax(array, depth + 1, nextMark).bestScore;
                        bestScore = Math.max(score, bestScore);
                        if (score === bestScore) {
                            bestIndex = i;
                        }
                    } else {
                        let score = _minimax(array, depth + 1, nextMark).bestScore;
                        bestScore = Math.min(score, bestScore);
                        if (score === bestScore) {
                            bestIndex = i;
                        }
                    }
                }
                array[i] = "";
            }
        }
        return {bestIndex, bestScore}
    };

    const move = (level) => {
        // generate random number from 0 - 10
        let random = Math.round(Math.random(1) * 10);
        // choose random space if random number is higher than current level
        // else play the ideal move using minimax
        if (random > level) {
            _chooseRandomSquare();
        } else {
            const array = [...gameBoard.getArray()];
            gameBoard.setSquare(_minimax(array).bestIndex, "O");
        }
        game.nextTurn();
    }

    return { move }
})()