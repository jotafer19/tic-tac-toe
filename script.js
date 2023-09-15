const gameBoard = (() => {
    const _gameBoardArray = ["", "", "", "", "", "", "", "", ""];
    
    const showGameBoard = () => _gameBoardArray;

    const addMark = (index, mark) => {
        if (_gameBoardArray[index] === "") _gameBoardArray[index] = mark;
    }

    const resetGameBoard = () => {
        for (let i = 0; i < _gameBoardArray.length; i++) {
            _gameBoardArray[i] = "";
        }
    }

    return {showGameBoard, addMark, resetGameBoard}
})();

const playerFactory = (name, mark) => {
    let _points = 0;

    const showScore = () => _points;

    const addPoint = () => _points += 1;
    
    const resetScore = () => _points = 0;

    const displayPoints = (playerScoreDisplay) => playerScoreDisplay.textContent = _points;

    return {name, mark, showScore, addPoint, resetScore, displayPoints};
}

const gameController = (() => {
    const turnInformation = document.querySelector("#turn-information");
    const playerOneScore = document.querySelector("#player-one-score > .points");
    const playerTwoScore = document.querySelector("#player-two-score > .points");
    const draw = document.querySelector("#draw > .points");
    const winnerDialog = document.querySelector("#winner-announcer");
    const winMessage = document.querySelector("#winner");

    let _turn = 1;
    let _gameOver = false;
    let _drawScore = 0;

    const addTurn = () => _turn += 1;

    const getPlayer = (playerOne, playerTwo) => (_turn % 2 !== 0) ? playerOne : playerTwo;

    const displayTurn = (playerOne, playerTwo) => turnInformation.textContent = `${getPlayer(playerOne, playerTwo).name} turn`

    const checkGameOver = () => _gameOver;

    const updateScore = (player) => {
        player.addPoint();
        (player.mark === "X") ? playerOneScore.textContent = player.showScore() : playerTwoScore.textContent = player.showScore();
    }

    const newRoundGameController = () => {
        turnInformation.textContent = "Player 1 turn";
        _turn = 1;
        _gameOver = false;
    }

    const resetGameController = () => {
        newRoundGameController();
        playerOneScore.textContent = 0;
        playerTwoScore.textContent = 0;
        _drawScore = 0;
        draw.textContent = 0;
    }

    const checkWinner = (gameBoard, player) => {
        for (let i = 0; i < gameBoard.length - 2 ; i+=3) {
            if (gameBoard[i] === gameBoard[i + 1] && gameBoard[i] === gameBoard[i + 2] && gameBoard[i] !== "") {
                winnerDialog.showModal();
                winMessage.textContent = (`${player.name} wins!`).toUpperCase();
                updateScore(player);
                _gameOver = true;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i] === gameBoard[i + 3] && gameBoard[i] === gameBoard[i + 6] && gameBoard[i] !== "") {
                winnerDialog.showModal();
                winMessage.textContent = (`${player.name} wins!`).toUpperCase();
                updateScore(player);
                _gameOver = true;
            }
        }
        if (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[4] !== "") {
            winnerDialog.showModal();
            winMessage.textContent = (`${player.name} wins!`).toUpperCase();
            updateScore(player);
            _gameOver = true;
        } else if (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[4] !== "") {
            winnerDialog.showModal();
            winMessage.textContent = (`${player.name} wins!`).toUpperCase();
            updateScore(player);
            _gameOver = true;
        } else if (!checkGameOver() && _turn === 9) {
            winnerDialog.showModal();
            winMessage.textContent = ("It's a draw!").toUpperCase();
            _drawScore += 1;
            draw.textContent = _drawScore;
            _gameOver = true;
        }
    }
    return {addTurn, getPlayer, displayTurn, checkGameOver, newRoundGameController, resetGameController, checkWinner}
})()

const playGame = (() => {
    const playSpots = document.querySelectorAll(".choice-spot");
    const resetButton = document.querySelector("#reset");
    const winnerDialog = document.querySelector("#winner-announcer");
    const closeDialog = document.querySelector("#close-dialog");
    const newRoundButton = document.querySelector("#new-round");

    const playerOne = playerFactory("Player 1", "X");
    const playerTwo = playerFactory("Player 2", "O");

    const displayMark = (spot, mark) => {
        spot.textContent = mark;
        if (mark === "X") {
            spot.style.color = "#fcd34d";
        } else {
            spot.style.color = "#93c5fd";
        }
    }

    const playTurn = (spot) => {
        gameBoard.addMark(spot.dataset.index, gameController.getPlayer(playerOne, playerTwo).mark);
        displayMark(spot, gameController.getPlayer(playerOne, playerTwo).mark);
        gameController.checkWinner(gameBoard.showGameBoard(), gameController.getPlayer(playerOne, playerTwo))
        if (!gameController.checkGameOver()) {
            gameController.addTurn();
            gameController.displayTurn(playerOne, playerTwo);
        }
    }

    const newRound = () => {
        gameBoard.resetGameBoard();
        gameController.newRoundGameController();
        playSpots.forEach(spot => spot.textContent = "");
    }

    const resetGame = () => {
        newRound();
        playerOne.resetScore();
        playerTwo.resetScore();
        gameController.resetGameController();
    }

    playSpots.forEach(spot => {
        spot.addEventListener("click", (event) => {
            if (event.target.textContent !== "" || gameController.checkGameOver()) return;
            playTurn(event.target);
        })
    })

    resetButton.addEventListener("click", resetGame);

    closeDialog.addEventListener("click", () => {
        winnerDialog.close();
    })

    newRoundButton.addEventListener("click", () => {
        newRound();
        winnerDialog.close();
    })
})()