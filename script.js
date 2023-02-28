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
})();