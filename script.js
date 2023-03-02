// Factory Function
function gameSetup(gOpponent, aiLevel, p1Name, p2Name, p1Symbol) {
    p1Name = p1Name.toLowerCase();
    p2Name = p2Name.toLowerCase();
    const p2Symbol = p1Symbol === 'x' ? 'o' : 'x';
    const gBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const gRound = 0;
    const p1Score = 0;
    const p2Score = 0;
    const pTurn = 0;
    const currentPlayer = 'o';
    const gameOver = false;

    return {
        gOpponent, 
        aiLevel, 
        p1Name, 
        p1Symbol, 
        p2Name, 
        p2Symbol, 
        gBoard, 
        gRound, 
        p1Score, 
        p2Score,
        pTurn,
        currentPlayer, 
        gameOver
    }
}

// Form Input module
const gameSetupInput = (() => {
    const _selectOpponentLevel = document.querySelectorAll('select'); // game opponent and ai level selection
    const _gameOpponentOption = [..._selectOpponentLevel[0].getElementsByTagName('option')]; // game opponent options
    const _gameLevelOption = [..._selectOpponentLevel[1].getElementsByTagName('option')]; // ai level options
    const _pNameInput = document.querySelectorAll('input[type="text"]'); // player 1 and player 2 name input
    const _pSymbolBtn = document.querySelectorAll('input[type="radio"]'); // player 1 symbol selection button
    const _pSymbolLabel = [...document.getElementsByClassName('turn')]; // player 1 symbol selection level
    const _gameInput = document.querySelector('.game-setup'); // form

    function selectOpponent() {
        if (_selectOpponentLevel[0].value === _gameOpponentOption[0].value) {
            _selectOpponentLevel[1].removeAttribute('disabled', '');
            _pNameInput[1].setAttribute('readonly', '');
        }

        if (_selectOpponentLevel[1].value === _gameLevelOption[0].value) {
            _pNameInput[1].value = 'Easy AI';
        } 
        
        if (_selectOpponentLevel[1].value === _gameLevelOption[1].value) {
            _pNameInput[1].value = 'Hard AI';
        }
    
        if (_selectOpponentLevel[0].value === _gameOpponentOption[1].value) {
            _selectOpponentLevel[1].setAttribute('disabled', '');
            _pNameInput[1].removeAttribute('readonly', '');
            _pNameInput[1].value = '';
        }
    }

    selectOpponent()

    function selectSymbol() {
        if (_pSymbolBtn[0].checked == true) {
            _pSymbolLabel[0].style.color = 'black';
            _pSymbolLabel[1].style.color = '#838383';
            // console.log('O symbol selected');
            return;
        }
    
        if (_pSymbolBtn[1].checked == true) {
            _pSymbolLabel[0].style.color = '#838383';
            _pSymbolLabel[1].style.color = 'black';
            // console.log('X symbol selected');
            return;
        }
    }

    _selectOpponentLevel.forEach(select => {
        select.addEventListener('change', () => selectOpponent());
    });

    _pSymbolBtn.forEach(button => {
        button.addEventListener('click', () => selectSymbol());
    });

    // Form Start Game Button
    _gameInput.addEventListener('submit', (event) => {
        event.preventDefault();

        // Initialize Form Input Data
        const fd = new FormData(_gameInput);
        // Transform a list of key-value pairs into an object
        const data = Object.fromEntries(fd);
        const gameData = gameSetup(data.gOpponent, data.aiLevel, data.p1Name, data.p2Name, data.p1Symbol);

        // Player One Symbol Validation
        if (_pSymbolBtn[0].checked == false && _pSymbolBtn[1].checked == false) {
            document.querySelector('.error-message').textContent = 'Pleas select your symbol!';
            return;
        }

        console.log(gameData);
        gameController.initializeGame(gameData);
    })

})();

// Display Controller Module
const displayController = (() => {
    const _modal = document.querySelector('.modal'); // Modal
    const _modalFormContent = document.querySelector('.modal-form-content'); // Modal form
    const _modalGameResult = document.querySelector('.modal-game-result'); // Modal end game result
    const _gameBoard = document.querySelector('.game-board'); // Game board
    const _scoreBoard = document.querySelector('.score-board'); // Score board
    const _newGameBtn = document.querySelector('.new-game'); // New game button

    function hideForm() {
        _modal.classList.add('hide');
        _modalFormContent.classList.add('hide');
        showGame();
    }

    function showGame() {
        _gameBoard.classList.remove('hide');
        _scoreBoard.classList.remove('hide');
    }

    function showGameResult() {
        _modal.classList.remove('hide');
        _modalGameResult.classList.remove('hide');
        hideGame();
    }

    function hideGame() {
        _gameBoard.classList.add('hide');
        _scoreBoard.classList.add('hide');
    }

    function showForm() {
        hideGameResult()
        _modal.classList.remove('hide');
        _modalFormContent.classList.remove('hide');
    }

    function hideGameResult() {
        _modal.classList.add('hide');
        _modalGameResult.classList.add('hide');
    }

    _newGameBtn.addEventListener('click', () => {
        location.reload(); // Reloads the current document
        showForm();
    })

    return {hideForm, showGameResult}
})();

// Game Controller Module
const gameController = (() => {
    const _cellElements = document.querySelectorAll('[data-cell]'); // Pull in cells from DOM
    const _gameBoardMask = document.querySelector('.game-board-mask');
    const _winningPattern = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function initializeGame(data) {
        addCellEventListener(data);
        displayController.hideForm();
    }

    function addCellEventListener(data) {
        _cellElements.forEach(cell => {
            cell.addEventListener('click', (e) => {
                console.log(e.target.id, data)
            });
        });
    }

    return {initializeGame}
})();