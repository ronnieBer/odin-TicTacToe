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
        data.gRound++;
        addCellEventListener(data);
        displayController.hideForm();
        scoreboardDisplay.initializeScoreBoard(data);
    }

    function addCellEventListener(data) {
        _cellElements.forEach(cell => {
            cell.addEventListener('click', (e) => {
                // console.log(e.target.id, data);
                placeMarker(e.target.id, data);
            });
        });
    }

    function placeMarker(cellId, data) {
        const currentPlayer = data.currentPlayer;

        // Prevent player from clicking the cell containing 'o' and 'x' marker
        if (_cellElements[cellId].classList.contains('o') ||
            _cellElements[cellId].classList.contains('x')) return;
        if (data.gameOver === true) return;

        data.pTurn++;
        // Put player symbol to game board
        drawMarkers(cellId, currentPlayer, data)

        // AI move
        if (data.gOpponent === 'ai' && data.aiLevel === 'easy') {
            _gameBoardMask.classList.remove('hide'); // Preventing the player from clicking on the game board
            aiPlayer.easyAiMove(data);
            _gameBoardMask.classList.add('hide'); // Allowing the player to click on the game board
        } else if (data.gOpponent === 'ai' && data.aiLevel === 'hard') {
            _gameBoardMask.classList.remove('hide');
            aiPlayer.hardAiMove(data);
            _gameBoardMask.classList.add('hide');
        }

        // Check for win and draw
        endGame(data, currentPlayer);
        // Swap player turns
        swapPlayerTurns(data);
        // Log player turns
        logPlayerTurn(data);
    }

    function logPlayerTurn(data) {
        if (data.gameOver === true) return;
        scoreboardDisplay.displayPlayerTurn(data);
    }

    function drawMarkers(cell, player, data) {
        if (data.gameOver === true) return
        data.gBoard[cell] = player;
        _cellElements[cell].classList.add(player);
    }

    function swapPlayerTurns(data) {
        data.currentPlayer = data.currentPlayer === data.p1Symbol ? data.p2Symbol : data.p1Symbol;
    }

    function endGame(data, currentPlayer) {
        if (checkWinner(data, currentPlayer)) {
            let winner = currentPlayer === data.p1Symbol ? data.p1Name : data.p2Name;
            // console.log(winner);
            scoreboardDisplay.getPlayerScore(data, winner);
            data.gameOver = true;
            setTimeout(() => {
                resetGame(data);
            },800);
        } else if (data.pTurn >= 9 && data.gBoard.filter((cell) => cell !== 'number')) {
            // console.log('Tie');
            data.gameOver = true;
            setTimeout(() => {
                resetGame(data);
            },800);
        }
    }

    function checkWinner(data, currentPlayer) {
        let result = false;
        _winningPattern.forEach(condition => {
            if (data.gBoard[condition[0]] === currentPlayer && 
                data.gBoard[condition[1]] === currentPlayer &&
                data.gBoard[condition[2]] === currentPlayer
            ) {
                result = true;
            }
        });
        return result;
    }

    function resetGameBoard(data) {
        scoreboardDisplay.displayGameRound(data);
        data.gBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8,];
        data.currentPlayer = 'o';
        data.pTurn = 0;
        scoreboardDisplay.displayPlayerTurn(data);
        data.gameOver = false;
        _cellElements.forEach(cell => {
            cell.classList.remove('o', 'x');
        });
    }

    function resetGame(data) {
        displayWinnerOf5Games(data);
        if (data.gRound === 5) return;
        data.gRound++;
        resetGameBoard(data);
    }

    function displayWinnerOf5Games(data) {
        if (data.gRound === 5 && data.gameOver === true || 
            data.p1Score === 3 && data.gameOver === true ||
            data.p2Score === 3 && data.gameOver === true) {
            getWinnerOf5Games(data);
            displayController.showGameResult();
            resetGameBoard(data);
            scoreboardDisplay.resetPScoreDisplay();
        }
    }

    function updateDOM(className, textMessage) {
        let elem = document.querySelector(`.${className}`);
        elem.textContent = textMessage
    }

    function getWinnerOf5Games(data) {
        displayController.showGameResult();
        if (data.p1Score > data.p2Score || data.p1Score === 3) {
            updateDOM("winner-name", data.p1Name.toUpperCase());
        } else if (data.p1Score < data.p2Score || data.p2Score === 3) {
            updateDOM("winner-name", data.p2Name.toUpperCase());
        } else {
            updateDOM("result-message", "It's a Tie!");
        }
    }

    return {initializeGame, drawMarkers, swapPlayerTurns, endGame, checkWinner, logPlayerTurn}
})();

// Scoreboard Display Module
const scoreboardDisplay = (() => {
    const _roundCount = document.querySelector('.round-number');
    const _playerName = document.querySelectorAll('.player-name');
    const _turnArrow = document.querySelectorAll('.material-icons-round');
    const _p1ScoreSymbol = document.querySelectorAll('.p1-symbol');
    const _p2ScoreSymbol = document.querySelectorAll('.p2-symbol');

    function initializeScoreBoard(data) {
        displayGameRound(data);
        displayPlayerName(data);
        displayPlayerTurn(data);
        displayScoreSymbol(data);
    }

    function displayGameRound(data) {
        _roundCount.textContent = data.gRound;
    }

    function displayPlayerName(data) {
        _playerName[0].textContent = data.p1Name;
        _playerName[1].textContent = data.p2Name;
    }

    function displayPlayerTurn(data) {
        if (data.p1Symbol === data.currentPlayer) {
            _playerName[0].style.color = '#000000';
            _playerName[0].style.fontWeight = '700';
            _playerName[1].style.color = '#838383';
            _playerName[1].style.fontWeight = '400';
            _turnArrow[0].classList.add('md');
            _turnArrow[1].classList.remove('md');
        } else {
            _playerName[0].style.color = '#838383';
            _playerName[0].style.fontWeight = '400';
            _playerName[1].style.color = '#000000';
            _playerName[1].style.fontWeight = '700';
            _turnArrow[1].classList.add('md');
            _turnArrow[0].classList.remove('md');
        }
    }

    function displayScoreSymbol(data) {
        if (data.p1Symbol === 'o' && data.p2Symbol === 'x') {
            _p1ScoreSymbol.forEach(symbol => symbol.textContent = 'O');
            _p2ScoreSymbol.forEach(symbol => symbol.textContent = 'X');
        } else {
            _p1ScoreSymbol.forEach(symbol => symbol.textContent = 'X');
            _p2ScoreSymbol.forEach(symbol => symbol.textContent = 'O');
        }
    }

    function getPlayerScore(data, winner) {
        if (data.p1Name === winner) {
            data.p1Score++
            // console.log(winner ,p1Score);
            if (data.gRound === 1 && data.p1Name === winner) {
                _p1ScoreSymbol[0].style.color = '#000000';
                _p2ScoreSymbol[0].style.color = '#d3d3d3';
            }
            else if (data.gRound === 2 && data.p1Name === winner) {
                _p1ScoreSymbol[1].style.color = '#000000';
                _p2ScoreSymbol[1].style.color = '#d3d3d3';
            }
            else if (data.gRound === 3 && data.p1Name === winner) {
                _p1ScoreSymbol[2].style.color = '#000000';
                _p2ScoreSymbol[2].style.color = '#d3d3d3';
            }            
            else if (data.gRound === 4 && data.p1Name === winner) {
                _p1ScoreSymbol[3].style.color = '#000000';
                _p2ScoreSymbol[3].style.color = '#d3d3d3';
            }            
            else if (data.gRound === 5 && data.p1Name === winner) {
                _p1ScoreSymbol[4].style.color = '#000000';
                _p2ScoreSymbol[4].style.color = '#d3d3d3';
            }            
        } 
        
        if (data.p2Name === winner) {
            data.p2Score++
            // console.log(winner, p2Score);
            if (data.gRound === 1 && data.p2Name === winner) {
                _p2ScoreSymbol[0].style.color = '#000000';
                _p1ScoreSymbol[0].style.color = '#d3d3d3';
            }
            else if (data.gRound === 2 && data.p2Name === winner) {
                _p2ScoreSymbol[1].style.color = '#000000';
                _p1ScoreSymbol[1].style.color = '#d3d3d3';
            }
            else if (data.gRound === 3 && data.p2Name === winner) {
                _p2ScoreSymbol[2].style.color = '#000000';
                _p1ScoreSymbol[2].style.color = '#d3d3d3';
            }            
            else if (data.gRound === 4 && data.p2Name === winner) {
                _p2ScoreSymbol[3].style.color = '#000000';
                _p1ScoreSymbol[3].style.color = '#d3d3d3';
            }            
            else if (data.gRound === 5 && data.p2Name === winner) {
                _p2ScoreSymbol[4].style.color = '#000000';
                _p1ScoreSymbol[4].style.color = '#d3d3d3';
            }
        }
    }

    function resetPScoreDisplay() {
        _p1ScoreSymbol.forEach(symbol => symbol.style.color = '#838383')
        _p2ScoreSymbol.forEach(symbol => symbol.style.color = '#838383')
    }

    return {initializeScoreBoard, displayGameRound, displayPlayerTurn, getPlayerScore, resetPScoreDisplay}
})();

// AI Player Module
const aiPlayer = (() => {
    // AI marker
    const aiPlayerMarker = data.p2Symbol;

    // Easy AI Move
    function easyAiMove(data) {
        // Game board available space
        let availableSpaces = data.gBoard.filter((cell) => cell !== "x" && cell !== "o");
        // Easy AI move
        let easyMove = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];

        setTimeout(() => {
            if (data.gameOver === true) return
            data.pTurn++;
            gameController.drawMarkers(easyMove, aiPlayerMarker, data)
            gameController.endGame(data, aiPlayerMarker);
            gameController.swapPlayerTurns(data);
            gameController.logPlayerTurn(data);
        }, 800);
    }

    // Hard AI Move
    function hardAiMove(data) {
        // Hard AI move
        let hardMove = minimax(data, aiPlayerMarker).index;

        setTimeout(() => {
            if (data.gameOver === true) return
            data.pTurn++;
            gameController.drawMarkers(hardMove, aiPlayerMarker, data)
            gameController.endGame(data, aiPlayerMarker);
            gameController.swapPlayerTurns(data);
            gameController.logPlayerTurn(data);
        }, 800);
        
    }

    // Minimax Algorithm
    function minimax(data, player) {
        // Game board available space
        let availableSpaces = data.gBoard.filter((cell) => cell !== "x" && cell !== "o");

        if (gameController.checkWinner(data, data.p1Symbol)) {
            return {score: -10};
        } else if (gameController.checkWinner(data, data.p2Symbol)) {
            return {score: 10}
        } else if (availableSpaces.length === 0) {
            return {score: 0}
        }

        const potentialMove = [];

        for (let i = 0; i < availableSpaces.length; i++) {
            let move = {};

            move.index = data.gBoard[availableSpaces[i]];
            data.gBoard[availableSpaces[i]] = player;

            if (player === data.p2Symbol) {
                move.score = minimax(data, data.p1Symbol).score;
            } else {
                move.score = minimax(data, data.p2Symbol).score;
            }

            data.gBoard[availableSpaces[i]] = move.index;
            potentialMove.push(move);
        }

        let bestMove = 0;

        if (player === data.p2Symbol) {
            let bestScore = -2;

            for (let i = 0; i < potentialMove.length; i++) {
                if (potentialMove[i].score > bestScore) {
                    bestScore = potentialMove[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 2;

            for (let i = 0; i < potentialMove.length; i++) {
                if (potentialMove[i].score < bestScore) {
                    bestScore = potentialMove[i].score;
                    bestMove = i;
                }
            }
        }

        return potentialMove[bestMove];
    }

    return {easyAiMove, hardAiMove}
})();