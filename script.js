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

    const resetGameController = () => {
        _turnCount = 1;
        turnDisplay.style.display = "block";
        turnDisplay.textContent = "Player 1's turn";
        matchInformation.textContent = "";
        _gameOver = false;
    }

    const checkWinner = (gameBoard, player) => {
        for (let i = 0; i < gameBoard.length - 2 ; i+=3) {
            if (gameBoard[i] === gameBoard[i + 1] && gameBoard[i] === gameBoard[i + 2] && gameBoard[i] !== "") {
                winnerAnnouncer.showModal();
                winnerPlayer.textContent = `${player} wins!`.toUpperCase();
                _gameOver = true;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i] === gameBoard[i + 3] && gameBoard[i] === gameBoard[i + 6] && gameBoard[i] !== "") {
                winnerAnnouncer.showModal();
                winnerPlayer.textContent = `${player} wins!`.toUpperCase();
                _gameOver = true;
            }
        }
        if (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[4] !== "") {
            winnerAnnouncer.showModal();
            winnerPlayer.textContent = `${player} wins!`.toUpperCase();
            _gameOver = true;
        }
        if (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[4] !== "") {
            winnerAnnouncer.showModal();
            winnerPlayer.textContent = `${player} wins!`.toUpperCase();
            _gameOver = true;
        }
    }

    const checkGameOver = () => _gameOver;

    return {showTurn, addTurn, displayTurn, getPlayer, resetGameController, checkWinner, checkGameOver}
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
    const newRound = document.querySelector("#new-round");

    const playerOne = playerFactory(getPlayerData.getPlayerOneName(), "X");
    const playerTwo = playerFactory(getPlayerData.getPlayerTwoName(), "O");

    const letsPlayTheGame = (spot) => {
        
        gameBoard.addMark(spot.dataset.index, gameController.getPlayer(playerOne, playerTwo).mark);
        spot.textContent = gameController.getPlayer(playerOne, playerTwo).mark;
        gameController.checkWinner(gameBoard.showGameBoard(), gameController.getPlayer(playerOne, playerTwo).name);

        console.log(gameBoard.showGameBoard())
        gameController.addTurn();
        gameController.displayTurn(gameController.getPlayer(playerOne, playerTwo).name);

        if (gameController.showTurn() > 9 && !gameController.checkGameOver()) {
            console.log("It's a tie!")
            haveAWinner = true;
        }
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

    newRound.addEventListener("click", () => {
        resetGame();
        winnerAnnouncer.close();
    });
})()