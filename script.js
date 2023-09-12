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

    const showTurn = () => _turnCount;

    const addTurn = () => _turnCount += 1;

    const resetGameController = () => _turnCount = 0;

    const checkWinner = (gameBoard, player) => {
        for (let i = 0; i < gameBoard.length - 2; i++) {
            if (gameBoard[i] === gameBoard[i + 1] && gameBoard[i] === gameBoard[i + 2] && gameBoard[i] !== "") {
                console.log(`${player} wins!`)
                return true;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i] === gameBoard[i + 3] && gameBoard[i] === gameBoard[i + 6] && gameBoard[i] !== "") {
                console.log(`${player} wins!`)
                return true;
            }
        }
        if (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[4] !== "") {
            console.log(`${player} wins!`)
            return true;
        }
        if (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[4] !== "") {
            console.log(`${player} wins!`)
            return true;
        }
    }

    return {showTurn, addTurn, resetGameController, checkWinner}
})();

const playerFactory = (playerPosition) => {

    const playerMark = () => (playerPosition === "PlayerOne") ? "X" :"O";
    
    return {playerPosition, playerMark};
}

const playGame = (() => {
    let haveAWinner = false;

    const playerOne = playerFactory("PlayerOne");
    const playerTwo = playerFactory("PlayerTwo");

    while (!haveAWinner) {
        console.log(gameController.showTurn());
        if (gameController.showTurn() % 2 !== 0) {
            gameBoard.addMark(prompt("Choose a position: "), playerOne.playerMark())
            haveAWinner = gameController.checkWinner(gameBoard.showGameBoard(), playerOne.playerPosition)
        } else {
            gameBoard.addMark(prompt("Choose a position: "), playerTwo.playerMark())
            haveAWinner = gameController.checkWinner(gameBoard.showGameBoard(), playerTwo.playerPosition)
        }
        console.log(gameBoard.showGameBoard())
        gameController.addTurn();

        if (gameController.showTurn() > 10 && !haveAWinner) {
            console.log("It's a tie!")
            haveAWinner = true;
        }
    }
})()