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

    const showTurn = () => _turnCount;

    const addTurn = () => _turnCount += 1;
    
    const getMark = () => (_turnCount & 2 !== 0) ? "X" : "O"

    const resetGameController = () => {
        _turnCount = 1;
        _gameOver = false;
    }

    const checkWinner = (gameBoard, player) => {
        for (let i = 0; i < gameBoard.length - 2 ; i+=3) {
            if (gameBoard[i] === gameBoard[i + 1] && gameBoard[i] === gameBoard[i + 2] && gameBoard[i] !== "") {
                console.log(`${player} wins!`)
                _gameOver = true;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i] === gameBoard[i + 3] && gameBoard[i] === gameBoard[i + 6] && gameBoard[i] !== "") {
                console.log(`${player} wins!`)
                _gameOver = true;
            }
        }
        if (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[4] !== "") {
            console.log(`${player} wins!`)
            _gameOver = true;
        }
        if (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[4] !== "") {
            console.log(`${player} wins!`)
            _gameOver = true;
        }
    }

    const check_gameOver = () => _gameOver;

    return {showTurn, addTurn, getMark, resetGameController, checkWinner, check_gameOver}
})();

const playerFactory = ((mark) => {

    const getPlayer = (mark) => (mark === "X") ? "Player 1" : "Player 2";

    return {mark, getPlayer};
})()

const playGame = (() => {
    const positionButtons = document.querySelectorAll(".choice-spot");
    const resetButton = document.querySelector("#reset");

    const letsPlayTheGame = (spot) => {
        console.log(gameController.showTurn());
        gameBoard.addMark(spot.dataset.index, gameController.getMark());
        spot.textContent = gameController.getMark();
        gameController.checkWinner(gameBoard.showGameBoard(), playerFactory.getPlayer(gameController.getMark()));

        console.log(gameBoard.showGameBoard())
        gameController.addTurn();

        if (gameController.showTurn() > 9 && !haveAWinner) {
            console.log("It's a tie!")
            haveAWinner = true;
        }
    }

    const resetGame = () => {
        gameBoard.resetGameBoard();
        gameController.resetGameController();
        positionButtons.forEach(button => button.textContent = "");
        gameController
    }

    positionButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            if (event.target.textContent !== "" || gameController.check_gameOver()) return;
            letsPlayTheGame(event.target);
        })
    })

    resetButton.addEventListener("click", resetGame)
})()