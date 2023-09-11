const gameBoard = (() => {
    let gameBoardArray = ["", "", "", "", "", "", "", "", ""];
    const positionButtons = document.querySelectorAll(".choice-spot");
    const resetButton = document.querySelector(".reset")
    positionButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            checkPosition(event.target);
        })
    })

    const checkPosition = (button) => {
        if (gameBoardArray[Number(button.dataset.index)] === "") {
            gameBoardArray[Number(button.dataset.index)] = "X";
            console.log(gameBoardArray);
            button.disabled = true;
        }
    }

    const resetButtons = () => {
        positionButtons.forEach(button => {
            button.disabled = false;
            gameBoardArray = ["", "", "", "", "", "", "", "", ""]
        })
    }

    resetButton.addEventListener("click", resetButtons)

    
})();