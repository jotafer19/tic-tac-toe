const gameBoard = (() => {
    const _gameBoardArray = ["", "", "", "", "", "", "", "", ""];
    
    const showGameBoard = () => _gameBoardArray;

    const addMark = (index, mark) => _gameBoardArray[index] = mark;

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

    const getMark = () => (_turnCount % 2 === 0) ? "O" : "X";

    const resetGameController = () => _turnCount = 0;

    return {showTurn, addTurn, getMark, resetGameController}
})();

const playerFactory = (playerPosition) => {
    const playerMark = () => (playerPosition === "PlayerOne") ? "X" :"O";
    
    return {playerMark};
}

const playerOne = playerFactory("PlayerOne");
const playerTwo = playerFactory("PlayerTwo");

