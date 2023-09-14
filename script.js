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

const gameController = (() => {
    let _turnCount = 1;
    let _gameOver = false;

    const matchInformation = document.querySelector("#match-information");
    const turnDisplay = document.querySelector("#turn-information");
    const winnerAnnouncer = document.querySelector("#winner-announcer");
    const winnerPlayer = document.querySelector("#winner");


    const showTurn = () => _turnCount;

    const addTurn = () => _turnCount += 1;

    const displayTurn = (player) => turnDisplay.textContent = `${player}'s turn`

    const getPlayer = (playerOne, playerTwo) => (_turnCount % 2 !== 0) ? playerOne : playerTwo;

    const newRound = () => {
        _turnCount = 1;
        turnDisplay.style.display = "block";
        turnDisplay.textContent = "Player 1's turn";
        matchInformation.textContent = "";
        _gameOver = false;
    }

    const resetGameController = () => {
        newRound();
        playerOneScore = 0;
        displayPlayerOneScore.textContent = 0;
        playerTwoScore = 0;
        displayPlayerTwoScore.textContent = 0;
        tieScore = 0;
        displayTieScore.textContent = 0;
    }

    const checkWinner = (gameBoard, player) => {
        for (let i = 0; i < gameBoard.length - 2 ; i+=3) {
            if (gameBoard[i] === gameBoard[i + 1] && gameBoard[i] === gameBoard[i + 2] && gameBoard[i] !== "") {
                winnerAnnouncer.showModal();
                winnerPlayer.textContent = `${player.name} wins!`.toUpperCase();
                addPoint(player.mark);
                _gameOver = true;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i] === gameBoard[i + 3] && gameBoard[i] === gameBoard[i + 6] && gameBoard[i] !== "") {
                winnerAnnouncer.showModal();
                winnerPlayer.textContent = `${player.name} wins!`.toUpperCase();
                addPoint(player.mark);
                _gameOver = true;
            }
        }
        if (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[4] !== "") {
            winnerAnnouncer.showModal();
            winnerPlayer.textContent = `${player.name} wins!`.toUpperCase();
            addPoint(player.mark);
            _gameOver = true;
        }
        if (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[4] !== "") {
            winnerAnnouncer.showModal();
            winnerPlayer.textContent = `${player.name} wins!`.toUpperCase();
            addPoint(player.mark);
            _gameOver = true;
        }
        if (!_gameOver && _turnCount === 9) {
            winnerAnnouncer.showModal();
            winnerPlayer.textContent = "It's a tie!"
            tieScore += 1;
            displayTieScore.textContent = tieScore;
        }
    }

    let playerOneScore = 0;
    const displayPlayerOneScore = document.querySelector("#player-one-score > .points");
    let playerTwoScore = 0;
    const displayPlayerTwoScore = document.querySelector("#player-two-score > .points");
    let tieScore = 0;
    const displayTieScore = document.querySelector("#tie > .points");

    const addPoint = (playerMark) => {
        if (playerMark === "X") {
            playerOneScore += 1;
            displayPlayerOneScore.textContent = playerOneScore;
        } 
        if (playerMark === "O") {
            playerTwoScore += 1;
            displayPlayerTwoScore.textContent = playerTwoScore;
        }
    }

    const checkGameOver = () => _gameOver;

    return {showTurn, addTurn, displayTurn, getPlayer, newRound, resetGameController, checkWinner, checkGameOver}
})();

const getPlayerData = (() => {
    const playerOneName = document.querySelector("#player-one-name");
    const playerTwoName = document.querySelector("#player-two-name");

    const getPlayerOneName = () => (playerOneName.value === "") ? "Player 1" : playerOneName.value;
    const getPlayerTwoName = () => (playerTwoName.value === "") ? "Player 2" : playerTwoName.value;

    const resetPlayerData = () => {
        playerOneName.value = "";
        playerTwoName.value = "";
    }

    return {getPlayerOneName, getPlayerTwoName, resetPlayerData}
})()

const playerFactory = (name, mark) => {

    return {name, mark};
}

const playGame = (() => {
    const positionButtons = document.querySelectorAll(".choice-spot");
    const resetButton = document.querySelector("#reset");

    const winnerAnnouncer = document.querySelector("#winner-announcer");
    const closeDialog = document.querySelector("#close-dialog");
    const newRoundButton = document.querySelector("#new-round");

    const playerOne = playerFactory(getPlayerData.getPlayerOneName(), "X");
    const playerTwo = playerFactory(getPlayerData.getPlayerTwoName(), "O");

    const letsPlayTheGame = (spot) => {
        
        gameBoard.addMark(spot.dataset.index, gameController.getPlayer(playerOne, playerTwo).mark);
        spot.textContent = gameController.getPlayer(playerOne, playerTwo).mark;
        gameController.checkWinner(gameBoard.showGameBoard(), gameController.getPlayer(playerOne, playerTwo));

        console.log(gameBoard.showGameBoard())
        gameController.addTurn();
        gameController.displayTurn(gameController.getPlayer(playerOne, playerTwo).name);
    }

    const newRound = () => {
        gameBoard.resetGameBoard();
        gameController.newRound();
        positionButtons.forEach(button => button.textContent = "");
    }

    const resetGame = () => {
        gameBoard.resetGameBoard();
        gameController.resetGameController();
        positionButtons.forEach(button => button.textContent = "");
    }

    positionButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            if (event.target.textContent !== "" || gameController.checkGameOver()) return;
            letsPlayTheGame(event.target);
        })
    })

    resetButton.addEventListener("click", resetGame);

    closeDialog.addEventListener("click", () => {
        winnerAnnouncer.close();
    })

    newRoundButton.addEventListener("click", () => {
        newRound();
        winnerAnnouncer.close();
    });
})()